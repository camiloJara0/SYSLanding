<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const toast = useToast()
const carrito = useCarritoStore()

const { productos, totalProductos } = storeToRefs(carrito)

const abierto = ref(false)
const anterior = ref(totalProductos.value)

const contadorVisibles = computed(() => totalProductos.value > 99 ? '99+' : String(totalProductos.value))

watch(totalProductos, (nuevo) => {
  if (nuevo > anterior.value) {
    // Microanimación al sumar un producto
  }
  anterior.value = nuevo
})

function precioCOP(valor) {
  return (valor || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 })
}

function alternar() {
  // abierto.value = !abierto.value
  carrito.abrirModalProductos()
}

function cerrar() {
  abierto.value = false
}

function abrirCotizacion() {
  abierto.value = false
  carrito.abrirModalProductos()
}

function quitarProducto(nombre) {
  carrito.quitarProducto(nombre)
  toast.add({
    title: 'Producto eliminado',
    description: 'Se quitó de tu cotización.',
    color: 'neutral',
    icon: 'i-lucide-trash-2'
  })
}

watch(abierto, (val) => {
  if (!import.meta.client) return
  document.body.style.overflow = val ? 'hidden' : ''
})

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

function onKeydown(e) {
  if (e.key === 'Escape' && abierto.value) cerrar()
}

if (import.meta.client) {
  window.addEventListener('keydown', onKeydown)
}
</script>

<template>
  <Teleport to="body">
    <!-- BOTÓN FLOTANTE -->
    <button
      type="button"
      class="carrito-fab"
      :aria-label="`Ver cotización, ${totalProductos} productos`"
      @click="alternar"
    >
      <span
        v-if="totalProductos > 0 && !abierto"
        :key="totalProductos"
        class="carrito-fab-badge"
      >
        {{ contadorVisibles }}
      </span>

      <UIcon
        name="i-lucide-shopping-cart"
        class="w-6 h-6"
      />
    </button>

    <!-- PANEL LATERAL -->
    <Transition name="drawer-fade">
      <div
        v-if="abierto"
        class="drawer-backdrop"
        role="presentation"
        @click.self="cerrar"
      >
        <aside
          class="drawer-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Tu cotización"
        >
          <!-- Cabecera -->
          <div class="drawer-header">
            <div class="flex items-center gap-2.5">
              <span class="drawer-icono">
                <UIcon
                  name="i-lucide-shopping-cart"
                  class="w-5 h-5"
                />
              </span>
              <div>
                <h3 class="font-bold text-gray-900!">
                  Tu cotización
                </h3>
                <p class="text-xs text-gray-500">
                  {{ totalProductos }} {{ totalProductos === 1 ? 'producto' : 'productos' }}
                </p>
              </div>
            </div>

            <button
              type="button"
              class="drawer-cerrar"
              aria-label="Cerrar panel"
              @click="cerrar"
            >
              <UIcon
                name="i-lucide-x"
                class="w-5 h-5"
              />
            </button>
          </div>

          <!-- Contenido -->
          <div class="drawer-cuerpo">
            <TransitionGroup
              v-if="productos.length"
              name="item-list"
              tag="ul"
              class="drawer-lista"
            >
              <li
                v-for="p in productos"
                :key="p.EQUIPO"
                class="drawer-item"
              >
                <img
                  :src="p.IMAGEN"
                  :alt="p.EQUIPO"
                  class="drawer-item-img"
                  loading="lazy"
                >
                <div class="min-w-0 grow">
                  <p class="drawer-item-nombre">
                    {{ p.EQUIPO }}
                  </p>
                  <p class="drawer-item-precio">
                    $ {{ precioCOP(p.V_UNITARIO) }}
                  </p>
                </div>
                <button
                  type="button"
                  class="drawer-item-quitar"
                  :aria-label="`Quitar ${p.EQUIPO}`"
                  @click="quitarProducto(p.EQUIPO)"
                >
                  <UIcon
                    name="i-lucide-trash-2"
                    class="w-4 h-4"
                  />
                </button>
              </li>
            </TransitionGroup>

            <div
              v-else
              class="drawer-vacio"
            >
              <UIcon
                name="i-lucide-shopping-basket"
                class="w-12 h-12 text-gray-300"
              />
              <p class="text-sm text-gray-500 text-center">
                Aún no tienes productos para cotizar.
              </p>
            </div>
          </div>

          <!-- Pie -->
          <div class="drawer-footer">
            <div class="flex gap-2">
              <UButton
                type="button"
                color="neutral"
                variant="soft"
                class="grow flex justify-center"
                :disabled="!productos.length"
                @click="carrito.limpiarCarrito()"
              >
                Vaciar
              </UButton>
              <UButton
                type="button"
                color="primary"
                class="grow flex justify-center"
                icon="i-lucide-send"
                :disabled="!productos.length"
                @click="abrirCotizacion"
              >
                Solicitar cotización
              </UButton>
            </div>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.carrito-fab {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
  color: #fff;
  box-shadow: 0 10px 30px -8px rgba(29, 78, 216, 0.55);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;
}

.carrito-fab:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 16px 38px -10px rgba(29, 78, 216, 0.6);
}

.carrito-fab-badge {
  position: absolute;
  top: -0.35rem;
  right: -0.35rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.55rem;
  height: 1.55rem;
  padding: 0 0.4rem;
  border-radius: 9999px;
  background: #dc2626;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  border: 2px solid #fff;
  animation: badge-pop 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes badge-pop {
  0% {
    transform: scale(0.4);
  }

  70% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 95;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: 100%;
  max-width: 24rem;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -16px 0 40px -12px rgba(2, 6, 23, 0.3);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
}

.drawer-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.8rem;
  background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
  color: #fff;
}

.drawer-cerrar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.7rem;
  color: #6b7280;
  transition: all 0.2s ease;
}

.drawer-cerrar:hover {
  background: #f1f5f9;
  color: #111827;
}

.drawer-cuerpo {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
}

.drawer-lista {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.drawer-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem;
  border-radius: 0.9rem;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  transition: background 0.2s ease;
}

.drawer-item:hover {
  background: #f1f5f9;
}

.drawer-item-img {
  width: 3.25rem;
  height: 3.25rem;
  object-fit: contain;
  border-radius: 0.65rem;
  background: #fff;
  padding: 0.25rem;
  flex-shrink: 0;
}

.drawer-item-nombre {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.drawer-item-precio {
  font-size: 0.75rem;
  color: #6b7280;
}

.drawer-item-quitar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  color: #9ca3af;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.drawer-item-quitar:hover {
  background: #fee2e2;
  color: #dc2626;
}

.drawer-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
}

.drawer-footer {
  padding: 1.25rem;
  border-top: 1px solid #f1f5f9;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-fade-enter-active .drawer-panel,
.drawer-fade-leave-active .drawer-panel {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-fade-enter-from .drawer-panel,
.drawer-fade-leave-to .drawer-panel {
  transform: translateX(100%);
}

.item-list-enter-active,
.item-list-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.item-list-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.item-list-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.item-list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 640px) {
  .carrito-fab {
    right: 1rem;
    bottom: 1rem;
    width: 3.25rem;
    height: 3.25rem;
  }
}
</style>

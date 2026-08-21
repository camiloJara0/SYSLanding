<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import emailjs from '@emailjs/browser'

const toast = useToast()
const carrito = useCarritoStore()
const emailjsConfig = useRuntimeConfig().public.emailjs

const { productos, modalAbierto, modoModal, servicioModal, recomendaciones } = storeToRefs(carrito)

const enviando = ref(false)
const enviado = ref(false)
const cerrarRef = ref(null)
const showRecommends = ref(false)

const form = ref({
  nombre: '',
  correo: '',
  mensaje: ''
})

const esProductos = computed(() => modoModal.value === 'productos')

const tituloModal = computed(() => {
  if (esProductos.value) return 'Solicitar cotización'
  return 'Solicitar servicio'
})

function prefillMensaje() {
  if (modoModal.value === 'servicio') {
    form.value.mensaje = servicioModal.value?.mensajePredeterminado || ''
    return
  }

  const lista = carrito.productos.map(p => `- ${p.EQUIPO}`).join('\n')

  form.value.mensaje = lista
    ? `Me interesa cotizar los siguientes productos:\n${lista}\n\nQuedo atento(a) a su respuesta.`
    : ''
}

watch(modalAbierto, async (abierto) => {
  if (!abierto) {
    enviado.value = false
    return
  }

  enviado.value = false
  form.value.nombre = ''
  form.value.correo = ''
  prefillMensaje()

  await nextTick()
  cerrarRef.value?.focus()
})

watch(modalAbierto, (abierto) => {
  if (!import.meta.client) return
  document.body.style.overflow = abierto ? 'hidden' : ''
})

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

function cerrar() {
  carrito.cerrarModal()
}

function onKeydown(e) {
  if (e.key === 'Escape' && modalAbierto.value) cerrar()
}

if (import.meta.client) {
  window.addEventListener('keydown', onKeydown)
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

function agregarRecomendado(p) {
  if (carrito.agregarProducto(p)) {
    toast.add({
      title: 'Producto añadido',
      description: `${p.EQUIPO} se agregó a tu cotización.`,
      color: 'success',
      icon: 'i-lucide-shopping-cart'
    })
  }
}

function validarFormulario() {
  if (!form.value.nombre.trim() || !form.value.correo.trim()) {
    toast.add({
      title: 'Campos obligatorios',
      description: 'Ingresa tu nombre y correo para continuar.',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.correo.trim())) {
    toast.add({
      title: 'Correo inválido',
      description: 'Revisa el formato de tu correo electrónico.',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
    return false
  }

  return true
}

function construirParametros() {
  const nombre = form.value.nombre.trim()
  const correo = form.value.correo.trim()
  const mensaje = form.value.mensaje.trim()

  const params = {
    from_name: nombre,
    reply_to: correo,
    message: mensaje,
    asunto: '',
    tipo_solicitud: '',
    productos: '',
    servicio: ''
  }

  if (esProductos.value) {
    params.asunto = 'Solicitud de cotización de productos'
    params.tipo_solicitud = 'Cotización de productos'
    params.productos = carrito.productos
      .map((p, i) => `${i + 1}. ${p.EQUIPO} — ${p.CATEGORIA}`)
      .join('\n')
  } else {
    const tituloServicio = servicioModal.value?.titulo || 'Servicio'
    params.asunto = `Solicitud de servicio: ${tituloServicio}`
    params.tipo_solicitud = tituloServicio
    params.servicio = tituloServicio
  }

  return params
}

function procesarExito() {
  enviado.value = true

  if (esProductos.value) {
    carrito.limpiarCarrito()
    toast.add({
      title: '¡Cotización enviada!',
      description: 'Nos pondremos en contacto contigo muy pronto.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  } else {
    toast.add({
      title: '¡Solicitud enviada!',
      description: `Gracias por interesarte en ${servicioModal.value?.titulo || 'nuestro servicio'}.`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  }

  setTimeout(() => cerrar(), 1400)
}

async function enviar() {
  if (enviando.value || !validarFormulario()) return

  enviando.value = true

  try {
    const params = construirParametros()
    await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      params,
      { publicKey: emailjsConfig.publicKey }
    )

    procesarExito()
  } catch (error) {
    toast.add({
      title: 'Error al enviar',
      description: error?.text || error?.message || 'No se pudo enviar la solicitud. Inténtalo nuevamente.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      name="modal-fade"
      appear
    >
      <div
        v-if="modalAbierto"
        class="modal-backdrop"
        role="presentation"
        @click.self="cerrar"
      >
        <div
          class="modal-panel scrollbar-none"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="'cotizacion-titulo'"
        >
          <!-- ENCABEZADO -->
          <div class="modal-header">
            <div class="flex items-center gap-3">
              <span class="modal-icono">
                <UIcon
                  v-if="esProductos"
                  name="i-lucide-file-text"
                  class="w-6 h-6"
                />
                <UIcon
                  v-else
                  name="i-lucide-ambulance"
                  class="w-6 h-6"
                />
              </span>

              <div>
                <h3
                  id="cotizacion-titulo"
                  class="text-xl! font-bold text-white!"
                >
                  {{ tituloModal }}
                </h3>
                <p class="text-sm! text-gray-500">
                  Respuesta en menos de 24 horas
                </p>
              </div>
            </div>

            <button
              ref="cerrarRef"
              type="button"
              class="modal-cerrar"
              aria-label="Cerrar"
              @click="cerrar"
            >
              <UIcon
                name="i-lucide-x"
                class="w-5 h-5"
              />
            </button>
          </div>

          <!-- ÉXITO -->
          <Transition name="modal-fade">
            <div
              v-if="enviado"
              class="modal-exito"
            >
              <span class="exito-check">
                <UIcon
                  name="i-lucide-check"
                  class="w-12 h-12"
                />
              </span>
              <h3 class="text-2xl! font-bold text-gray-900!">
                ¡Enviado con éxito!
              </h3>
              <p class="text-gray-500">
                Tu solicitud fue recibida, un asesor te contactará pronto.
              </p>
            </div>
          </Transition>

          <div
            v-if="!enviado"
            class="modal-cuerpo h-[80vh] overflow-y-auto"
          >
            <!-- PRODUCTOS: resumen del carrito -->
            <section
              v-if="esProductos"
              class="modal-seccion"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="modal-seccion-titulo">
                  <UIcon
                    name="i-lucide-shopping-cart"
                    class="w-4 h-4"
                  />
                  Tu cotización
                  <span class="modal-badge">{{ productos.length }}</span>
                </h4>
                <button
                  v-if="productos.length"
                  type="button"
                  class="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  @click="carrito.limpiarCarrito()"
                >
                  Vaciar carrito
                </button>
              </div>

              <TransitionGroup
                v-if="productos.length"
                name="item-list"
                tag="ul"
                class="modal-lista"
              >
                <li
                  v-for="p in productos"
                  :key="p.EQUIPO"
                  class="modal-item"
                >
                  <img
                    :src="p.IMAGEN"
                    :alt="p.EQUIPO"
                    class="modal-item-img"
                    loading="lazy"
                  >
                  <div class="min-w-0 grow">
                    <p class="modal-item-nombre">
                      {{ p.EQUIPO }}
                    </p>
                    <p class="modal-item-precio">
                      {{ p.CATEGORIA }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="modal-item-quitar"
                    :aria-label="`Quitar ${p.EQUIPO}`"
                    @click="quitarProducto(p.EQUIPO)"
                  >
                    <UIcon
                      name="i-lucide-x"
                      class="w-4 h-4"
                    />
                  </button>
                </li>
              </TransitionGroup>

              <div
                v-else
                class="modal-vacio"
              >
                <UIcon
                  name="i-lucide-shopping-basket"
                  class="w-10 h-10 text-gray-300"
                />
                <p class="text-sm text-gray-500">
                  Tu cotización está vacía. Añade productos desde el catálogo.
                </p>
              </div>
            </section>

            <!-- SERVICIO: información del servicio -->
            <section
              v-if="!esProductos && servicioModal"
              class="modal-seccion"
            >
              <div class="servicio-resumen">
                <img
                  :src="servicioModal.imagen"
                  :alt="servicioModal.alt || servicioModal.titulo"
                  class="servicio-resumen-img"
                  loading="lazy"
                >
                <div>
                  <span class="servicio-tag">
                    <UIcon
                      :name="servicioModal.icon"
                      class="w-3.5 h-3.5"
                    />
                    {{ servicioModal.tag }}
                  </span>
                  <h4 class="text-lg! font-bold text-gray-900!">
                    {{ servicioModal.titulo }}
                  </h4>
                  <p class="text-sm text-gray-500">
                    {{ servicioModal.descripcion }}
                  </p>
                </div>
              </div>
            </section>

            <!-- RECOMENDACIONES -->
            <section
              v-if="esProductos && recomendaciones.length"
              class="modal-seccion"
            >
              <h4 class="modal-seccion-titulo">
                <UIcon
                  name="i-lucide-sparkles"
                  class="w-4 h-4"
                />
                Te recomendamos

                <UButton
                  :icon="showRecommends ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  variant="soft"
                  class="rounded-full"
                  color="neutral"
                  size="sm"
                  @click="showRecommends = !showRecommends"
                />
              </h4>
              <div
                v-if="showRecommends"
                class="recomendaciones-grid"
              >
                <div
                  v-for="r in recomendaciones"
                  :key="r.EQUIPO"
                  class="recomendacion"
                >
                  <img
                    :src="r.IMAGEN"
                    :alt="r.EQUIPO"
                    class="recomendacion-img"
                    loading="lazy"
                  >
                  <div class="min-w-0 grow">
                    <p class="recomendacion-nombre">
                      {{ r.EQUIPO }}
                    </p>
                    <p class="recomendacion-precio">
                      {{ r.CATEGORIA }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="recomendacion-btn"
                    :aria-label="`Añadir ${r.EQUIPO}`"
                    @click="agregarRecomendado(r)"
                  >
                    <UIcon
                      name="i-lucide-plus"
                      class="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            </section>

            <!-- FORMULARIO -->
            <section class="modal-seccion">
              <h4 class="modal-seccion-titulo">
                <UIcon
                  name="i-lucide-user"
                  class="w-4 h-4"
                />
                Tus datos
              </h4>

              <form
                class="modal-form"
                @submit.prevent="enviar"
              >
                <label
                  class="modal-label"
                  for="cotizacion-nombre"
                >
                  Nombre *
                </label>
                <UInput
                  id="cotizacion-nombre"
                  v-model="form.nombre"
                  placeholder="Tu nombre completo"
                  size="lg"
                  autocomplete="name"
                />

                <label
                  class="modal-label"
                  for="cotizacion-correo"
                >
                  Correo electrónico *
                </label>
                <UInput
                  id="cotizacion-correo"
                  v-model="form.correo"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  size="lg"
                  autocomplete="email"
                />

                <label
                  class="modal-label"
                  for="cotizacion-mensaje"
                >
                  Mensaje
                </label>
                <UTextarea
                  id="cotizacion-mensaje"
                  v-model="form.mensaje"
                  :rows="5"
                  placeholder="Cuéntanos qué necesitas..."
                />

                <div class="modal-acciones">
                  <UButton
                    type="button"
                    color="neutral"
                    variant="soft"
                    size="lg"
                    class="grow flex justify-center"
                    @click="cerrar"
                  >
                    Cancelar
                  </UButton>
                  <UButton
                    type="submit"
                    color="primary"
                    size="lg"
                    class="grow flex justify-center"
                    :loading="enviando"
                    :disabled="enviando"
                  >
                    <UIcon
                      v-if="!enviando"
                      name="i-lucide-send"
                      class="w-4 h-4"
                    />
                    Enviar solicitud
                  </UButton>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
}

.modal-panel {
  width: 100%;
  max-width: 42rem;
  max-height: min(90vh, 56rem);
  overflow-y: hidden;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 25px 60px -12px rgba(2, 6, 23, 0.35);
  position: relative;
}

.modal-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
  border-radius: 1.25rem 1.25rem 0 0;
}

.modal-header h3,
.modal-header p {
  color: #fff;
}

.modal-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  flex-shrink: 0;
}

.modal-cerrar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.modal-cerrar:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-cuerpo {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-seccion-titulo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.9rem;
}

.modal-seccion-titulo :deep(.ui-icon) {
  color: #1d4ed8;
}

.modal-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4rem;
  height: 1.4rem;
  padding: 0 0.35rem;
  border-radius: 9999px;
  background: #1d4ed8;
  color: #fff;
  font-size: 0.7rem;
}

.modal-lista {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.modal-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.9rem;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  transition: background 0.2s ease;
}

.modal-item:hover {
  background: #f1f5f9;
}

.modal-item-img {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  border-radius: 0.6rem;
  background: #fff;
  padding: 0.25rem;
  flex-shrink: 0;
}

.modal-item-nombre {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.modal-item-precio {
  font-size: 0.75rem;
  color: #6b7280;
}

.modal-item-quitar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  color: #9ca3af;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.modal-item-quitar:hover {
  background: #fee2e2;
  color: #dc2626;
}

.modal-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  border: 1px dashed #e5e7eb;
  border-radius: 1rem;
}

.servicio-resumen {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background: #f8fafc;
  border: 1px solid #eef2f7;
}

.servicio-resumen-img {
  width: 6rem;
  height: 6rem;
  object-fit: cover;
  border-radius: 0.85rem;
  flex-shrink: 0;
}

.servicio-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #1d4ed8;
  background: #dbeafe;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  margin-bottom: 0.4rem;
}

.recomendaciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12.5rem, 1fr));
  gap: 0.65rem;
}

.recomendacion {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.85rem;
  background: #fff;
  border: 1px solid #eef2f7;
  transition: all 0.2s ease;
}

.recomendacion:hover {
  border-color: #bfdbfe;
  box-shadow: 0 6px 16px -8px rgba(29, 78, 216, 0.35);
  transform: translateY(-2px);
}

.recomendacion-img {
  width: 2.6rem;
  height: 2.6rem;
  object-fit: contain;
  background: #f8fafc;
  border-radius: 0.55rem;
  padding: 0.2rem;
  flex-shrink: 0;
}

.recomendacion-nombre {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recomendacion-precio {
  font-size: 0.7rem;
  color: #6b7280;
}

.recomendacion-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.55rem;
  background: #1d4ed8;
  color: #fff;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.recomendacion-btn:hover {
  background: #1e3a8a;
  transform: scale(1.08);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.modal-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

.modal-acciones {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.modal-exito {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  padding: 4rem 1.5rem;
  text-align: center;
}

.exito-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6rem;
  height: 6rem;
  border-radius: 9999px;
  background: #dcfce7;
  color: #16a34a;
  animation: exito-pulse 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes exito-pulse {
  0% {
    transform: scale(0.4);
    opacity: 0;
  }

  70% {
    transform: scale(1.12);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-active .modal-panel,
.modal-fade-leave-active .modal-panel {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-panel,
.modal-fade-leave-to .modal-panel {
  transform: translateY(24px) scale(0.96);
  opacity: 0;
}

.item-list-enter-active,
.item-list-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.item-list-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.item-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.item-list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 640px) {
  .modal-backdrop {
    padding: 0.75rem;
  }

  .modal-header {
    border-radius: 0.85rem 0.85rem 0 0;
  }

  .modal-acciones {
    flex-direction: column-reverse;
  }
}
</style>

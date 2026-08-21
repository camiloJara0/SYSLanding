<script setup>
import { onMounted, onUnmounted, ref, computed, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { storeToRefs } from 'pinia'

gsap.registerPlugin(ScrollTrigger)

const { supportsHeavyAnimations } = useDeviceCapabilities()

const store = useCatalogoStore()
const carrito = useCarritoStore()
const toast = useToast()
const showFilters = ref(false)
const searchFocused = ref(false)

const { categorias, productosFiltrados, busqueda, categoriaSeleccionada, orden, productoSeleccionado } = storeToRefs(store)
const { borrarFiltros, ordenar, seleccionarCategoria } = store

const isFilterActive = computed(() => categoriaSeleccionada.value || busqueda.value)

let revealSt = null

onMounted(async () => {
  await nextTick()
  if (supportsHeavyAnimations.value) {
    revealSt = gsap.from('.catalog-hero', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
  }
})

onUnmounted(() => {
  revealSt?.scrollTrigger?.kill()
  revealSt?.kill()
})

function cotizarProducto(item) {
  if (carrito.agregarProducto(item)) {
    toast.add({
      title: 'Producto añadido',
      description: `${item.EQUIPO} se agregó a tu cotización.`,
      color: 'success',
      icon: 'i-lucide-shopping-cart'
    })
  }

  // carrito.abrirModalProductos()
}
</script>

<template>
  <section class="catalog-section">
    <!-- Hero Section -->
    <div class="catalog-hero">
      <UContainer class="py-16 lg:pt-20 pb-5">
        <div class="space-y-3 mb-12">
          <span class="section-eyebrow">Catálogo</span>
          <h2 class="text-4xl lg:text-5xl font-bold tracking-tight text-deep-blue">
            Catálogo de productos
          </h2>
          <p class="text-lg text-gray-600">
            Tecnología de precisión, higiene garantizada. Explora nuestro inventario de equipos médicos certificados.
          </p>
        </div>

        <!-- Search & Controls Bar -->
        <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <!-- Search Input -->
          <div class="w-full lg:w-96 relative group">
            <UInput
              v-model="busqueda"
              icon="i-lucide-search"
              size="lg"
              placeholder="Buscar equipos médicos..."
              class="search-input w-full"
              aria-label="Buscar equipos médicos"
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            />
            <div
              v-if="busqueda"
              class="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="sm"
                aria-label="Limpiar búsqueda"
                class="hover:bg-gray-100"
                @click="busqueda = ''"
              />
            </div>
          </div>

          <!-- Sort & Clear Controls -->
          <div class="flex gap-2">
            <UButton
              variant="soft"
              color="neutral"
              size="md"
              class="whitespace-nowrap"
              @click="ordenar"
            >
              <template #leading>
                <i class="i-lucide-arrow-up-down text-base" />
              </template>
              {{ orden === 'asc' ? 'A-Z' : 'Z-A' }}
            </UButton>

            <UButton
              v-if="isFilterActive"
              variant="soft"
              color="error"
              size="md"
              class="whitespace-nowrap"
              @click="borrarFiltros"
            >
              <template #leading>
                <i class="i-lucide-x text-base" />
              </template>
              Limpiar
            </UButton>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="pb-5">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Products Grid -->
        <div class="col-span-4">
          <!-- Mobile Filter Button -->
          <div class="lg:hidden mb-6">
            <UButton
              icon="i-lucide-filter"
              color="gray"
              variant="soft"
              size="md"
              class="w-full justify-between"
              @click="showFilters = !showFilters"
            >
              Filtros
              <i :class="['i-lucide-chevron-down transition-transform duration-200', showFilters && 'rotate-180']" />
            </UButton>

            <!-- Mobile Filters Panel -->
            <transition name="slide-down">
              <div
                v-if="showFilters"
                class="mt-4 space-y-4 bg-gray-50 rounded-lg p-4"
              >
                <div>
                  <p class="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Categorías
                  </p>
                  <ul class="space-y-2">
                    <li
                      v-for="categoria in categorias"
                      :key="categoria"
                    >
                      <button
                        :class="[
                          'w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm',
                          categoriaSeleccionada === categoria
                            ? 'bg-gold text-white font-medium'
                            : 'text-gray-700 hover:bg-gray-200'
                        ]"
                        @click="seleccionarCategoria(categoria); showFilters = false"
                      >
                        {{ categoria }}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>

          <!-- Products Grid -->
          <div
            v-if="productosFiltrados.length > 0"
            class="products-grid grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
          >
            <article
              v-for="(item, i) in productosFiltrados"
              :key="i"
              class="product-card group w-full rounded-2xl overflow-hidden"
              @click="productoSeleccionado = item"
            >
              <!-- Card Container -->
              <div class="overflow-hidden transition-all duration-300 h-full flex">
                <!-- Image Container -->
                <div
                  class="relative w-[40%] overflow-hidden aspect-square bg-linear-to-b from-[#88A5B7] to-(--bg-color) hover:border-gold/50 shadow-sm hover:shadow-xl"
                >
                  <img
                    :src="item.IMAGEN"
                    :alt="item.EQUIPO"
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                  >
                  <!-- Overlay gradient on hover -->
                  <div
                    class="absolute inset-0 bg-linear-to-t from-black/0 to-black/0 group-hover:from-black/20 group-hover:to-black/0 transition-all duration-300"
                  />
                </div>

                <!-- Content -->
                <div class="p-5 flex flex-col grow w-[60%]">
                  <!-- Category Badge -->
                  <div class="mb-1">
                    <span
                      class="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-[9px] font-semibold uppercase tracking-wider rounded-full"
                    >
                      {{ item.CATEGORIA }}
                    </span>
                  </div>

                  <!-- Title -->
                  <h3
                    class="text-base! lg:text-lg! font-semibold text-gray-900 mb-1 group-hover:text-gold transition-colors duration-200 line-clamp-2"
                  >
                    {{ item.EQUIPO }}
                  </h3>

                  <p class="text-gray-600 text-sm py-3">
                    {{ item.DESCRIPCION.substring(0, 100) }}...
                  </p>

                  <!-- Price -->
                  <!-- <div class="card-precio">
                    <p class="card-precio-label">
                      Precio unitario
                    </p>
                    <p class="card-precio-valor">
                      $ {{ precioCOP(item.V_UNITARIO) }}
                    </p>
                  </div> -->

                  <div class="card-acciones">
                    <UButton
                      color="primary"
                      icon="i-lucide-shopping-cart"
                      variant="subtle"
                      class="btn-cotizar bg-[#3B82F6]! hover:bg-[#1E3A8A]! text-white!"
                      aria-label="Cotizar producto"
                      @click="cotizarProducto(item)"
                    >
                      Cotizar
                    </UButton>
                    <NuxtLink
                      to="/Producto"
                      class="btn-info-link"
                      @click="productoSeleccionado = item"
                    >
                      <UButton
                        color="neutral"
                        variant="subtle"
                        class="btn-info"
                      >
                        Más información
                      </UButton>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="col-span-full py-16 text-center"
          >
            <div class="space-y-4">
              <UIcon
                name="i-lucide-inbox"
                class="text-6xl text-gray-300 mx-auto block"
              />
              <p class="text-gray-600 text-lg">
                No se encontraron productos
              </p>
              <p class="text-gray-400 text-sm">
                Intenta ajustar tus filtros o búsqueda
              </p>
              <UButton
                color="neutral"
                variant="soft"
                class="mt-4"
                @click="borrarFiltros"
              >
                Limpiar filtros
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.catalog-section {
  background: var(--bg-color);
  min-height: 100vh;
  padding-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--light-blue);
  margin-bottom: 0.25rem;
}

/* Search Input Styling */
.search-input :deep(input) {
  font-size: 1rem;
  border-radius: 0.75rem;
  border: 1.5px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input :deep(input:focus) {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.1);
}

.search-input :deep(input::placeholder) {
  color: #9ca3af;
}

/* Product Card */
.product-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  background: #e4ebf3;
  box-shadow: 20px 20px 60px #c2c8cf,
    -20px -20px 60px #ffffff;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.card-inner {
  display: flex;
  height: 100%;
  min-height: 240px;
}

.card-imagen {
  position: relative;
  width: 38%;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(160deg, #88a5b7, var(--bg-color));
}

.card-imagen-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.08) 100%);
  pointer-events: none;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.card-badge {
  display: inline-block;
  align-self: flex-start;
  padding: 0.3rem 0.8rem;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 50px;
}

.card-titulo-link {
  text-decoration: none;
}

.card-titulo {
  font-family: var(--font-secondary);
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card:hover .card-titulo {
  color: var(--gold);
}

.card-descripcion {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-precio {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(15, 23, 42, 0.07);
}

.card-precio-label {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0 0 0.15rem;
}

.card-precio-valor {
  font-weight: 800;
  color: var(--gold);
  margin: 0;
  font-family: var(--font-secondary);
}

.card-acciones {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.btn-cotizar,
.btn-info {
  border-radius: 0.75rem;
  font-weight: 600;
}

.btn-info-link {
  text-decoration: none;
  display: inline-flex;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

button:active {
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 640px) {
  .card-imagen {
    width: 42%;
  }

  .card-content {
    padding: 1rem;
  }

  .card-precio-valor {
    font-size: 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {

  .product-card,
  .card-imagen img,
  .card-titulo {
    transition: none;
  }
}
</style>

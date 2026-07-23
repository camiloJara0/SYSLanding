<script setup>
import { onMounted, ref, computed, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { catalogo } from '~/data/catalogo'
import { storeToRefs } from 'pinia'

gsap.registerPlugin(ScrollTrigger)

const store = useCatalogoStore()
const showFilters = ref(false)
const searchFocused = ref(false)

const { productos, categorias, productosFiltrados, loading, error, busqueda, categoriaSeleccionada, orden, productoSeleccionado } = storeToRefs(store)
const { borrarFiltros, ordenar, seleccionarCategoria } = store

const isFilterActive = computed(() => categoriaSeleccionada.value || busqueda.value)


</script>

<template>
    <section class="catalog-section">
        <!-- Hero Section -->
        <div class="catalog-hero">
            <UContainer class="py-16 lg:pt-20 pb-5">
                <div class="space-y-3 mb-12">
                    <h2 class="text-4xl lg:text-5xl font-bold tracking-tight text-deep-blue">
                        Catálogo
                    </h2>
                    <p class="text-lg text-gray-600">
                        Tecnología de precisión, Higiene garantizada
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
                            placeholder="Buscar equipos..." 
                            class="search-input w-full"
                            
                            @focus="searchFocused = true"
                            @blur="searchFocused = false"
                        />
                        <div v-if="busqueda" class="absolute right-3 top-1/2 -translate-y-1/2">
                            <UButton 
                                icon="i-lucide-x" 
                                color="neutral"
                                variant="ghost"
                                size="sm"
                                @click="busqueda = ''"
                                class="hover:bg-gray-100"
                            />
                        </div>
                    </div>

                    <!-- Sort & Clear Controls -->
                    <div class="flex gap-2">
                        <UButton 
                            @click="ordenar" 
                            variant="soft" 
                            color="neutral"
                            size="md"
                            class="whitespace-nowrap"
                        >
                            <template #leading>
                                <i class="i-lucide-arrow-up-down text-base" />
                            </template>
                            {{ orden == 'asc' ? 'A-Z' : 'Z-A' }}
                        </UButton>
                        
                        <UButton 
                            v-if="isFilterActive"
                            @click="borrarFiltros" 
                            variant="soft" 
                            color="error"
                            size="md"
                            class="whitespace-nowrap"
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
                            @click="showFilters = !showFilters"
                            icon="i-lucide-filter"
                            color="gray"
                            variant="soft"
                            size="md"
                            class="w-full justify-between"
                        >
                            Filtros
                            <i :class="['i-lucide-chevron-down transition-transform duration-200', showFilters && 'rotate-180']" />
                        </UButton>

                        <!-- Mobile Filters Panel -->
                        <transition name="slide-down">
                            <div v-if="showFilters" class="mt-4 space-y-4 bg-gray-50 rounded-lg p-4">
                                <div>
                                    <p class="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Categorías</p>
                                    <ul class="space-y-2">
                                        <li v-for="categoria in categorias" :key="categoria">
                                            <button 
                                                @click="seleccionarCategoria(categoria); showFilters = false"
                                                :class="[
                                                    'w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm',
                                                    categoriaSeleccionada === categoria 
                                                        ? 'bg-gold text-white font-medium' 
                                                        : 'text-gray-700 hover:bg-gray-200'
                                                ]"
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
                    <div v-if="productosFiltrados.length > 0" class="products-grid grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <nuxt-link 
                            v-for="(item, i) in productosFiltrados"
                            :key="i"
                            to="/Producto"
                            @click="productoSeleccionado = item"
                            class="product-card group w-full rounded-2xl overflow-hidden"
                        >
                            <!-- Card Container -->
                            <div class="overflow-hidden transition-all duration-300 h-full flex">
                                
                                <!-- Image Container -->
                                <div class="relative w-[65%] overflow-hidden aspect-square bg-linear-to-b from-[#88A5B7] to-(--bg-color) hover:border-gold/50 shadow-sm hover:shadow-xl">
                                    <img 
                                        :src="item.IMAGEN"
                                        :alt="item.EQUIPO"
                                        class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                                    />
                                    <!-- Overlay gradient on hover -->
                                    <div class="absolute inset-0 bg-linear-to-t from-black/0 to-black/0 group-hover:from-black/20 group-hover:to-black/0 transition-all duration-300" />
                                </div>

                                <!-- Content -->
                                <div class="p-5 flex flex-col grow">
                                    <!-- Category Badge -->
                                    <div class="mb-1">
                                        <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                                            Equipo médico
                                        </span>
                                    </div>

                                    <!-- Title -->
                                    <h3 class="text-base! lg:text-lg! font-semibold text-gray-900 mb-1 group-hover:text-gold transition-colors duration-200 line-clamp-2">
                                        {{ item.EQUIPO }}
                                    </h3>

                                    <p class="text-gray-600 text-sm">
                                        {{ item.DESCRIPCION.substring(0,50) }}...
                                    </p>

                                    <!-- Price -->
                                    <div class="mt-auto pt-1 border-t border-gray-100">
                                        <p class="text-gray-600 text-sm mb-2">Precio unitario</p>
                                        <p class="text-2xl font-bold text-gold">
                                            $ {{ item.V_UNITARIO.toLocaleString("es-CO", { maximumFractionDigits: 0 }) }}
                                        </p>
                                    </div>

                                    <div>
                                        <UButton color="blue" variant="subtle" class="neoCard rounded-2xl">
                                            Mas Información
                                        </UButton>
                                    </div>

                                </div>
                            </div>
                        </nuxt-link>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="col-span-full py-16 text-center">
                        <div class="space-y-4">
                            <UIcon name="i-lucide-inbox" class="text-6xl text-gray-300 mx-auto block" />
                            <p class="text-gray-600 text-lg">No se encontraron productos</p>
                            <p class="text-gray-400 text-sm">Intenta ajustar tus filtros o búsqueda</p>
                            <UButton 
                                @click="borrarFiltros" 
                                color="neutral"
                                variant="soft"
                                class="mt-4"
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
:root {
    --gold: #C9A227;
    --deep-blue: #1E3A8A;
    --light-blue: #3B82F6;
    --bg-light: #dae5f2;
}

.catalog-section {
    background: var(--bg-color) !important;
    min-height: 100vh;
    padding-bottom: 2rem;
    position: relative;
    z-index: 1;
}

.catalog-hero {
    animation: fadeInDown 0.8s ease-out;
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

/* Product Card Styles */
.product-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    background: #e4ebf3;
    box-shadow:  20px 20px 60px #c2c8cf,
                -20px -20px 60px #ffffff;
}

.neoCard {
    background: #e4ebf3;
    box-shadow:  20px 20px 60px #c2c8cf,
                -20px -20px 60px #ffffff;
}

.product-card:hover {
    transform: translateY(-8px);
}

/* Grid and Animations */
.products-grid {
    animation: fadeInUp 0.8s ease-out;
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

/* Animations */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Desktop sidebar sticky positioning */
@media (min-width: 1024px) {
    aside {
        top: 100px;
    }
}

/* Responsive font sizes */
@media (max-width: 768px) {
    .catalog-hero h2 {
        font-size: 2rem;
    }

    .catalog-hero p {
        font-size: 1rem;
    }
}

/* Utility classes */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Hover effects on category buttons */
.product-card:hover h3 {
    color: var(--gold);
}

/* Button hover states */
button:active {
    transform: scale(0.98);
}
</style>
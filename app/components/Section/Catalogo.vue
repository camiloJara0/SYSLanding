<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { catalogo } from '~/data/catalogo'
import { storeToRefs } from 'pinia'

gsap.registerPlugin(ScrollTrigger)
const equipos = ref([])
const showSearch = ref(false)
const store = useCatalogoStore()
const showFilters = ref(false)

const { productos, categorias, productosFiltrados, loading, error, busqueda, categoriaSeleccionada, orden, productoSeleccionado } = storeToRefs(store)
const { llamaDatos, borrarFiltros, ordenar, seleccionarCategoria } = store

watch(productosFiltrados, () => {
    console.log('Productos filtrados:', productosFiltrados.value)
})

onMounted(() => {
    equipos.value = catalogo.slice(0, 9)
    // Entrada del bloque completo con scroll
    gsap.from('.equipo-seccion', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.equipo-seccion',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    })

    // Entrada escalonada de tarjetas
    gsap.from('.eq-card', {
        scale: 0.95,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.eq-grid',
            start: 'top 85%'
        }
    })

})
</script>

<template>
    <section class="equipo-seccion py-30">
        <!-- Header -->
        <UContainer>
            <div class="equipo-header">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="equipo-titulo">Catálogo</h2>
                        <p class="text-xs">Tecnología de precisión, Higiene garantizada.</p>
                    </div>
                    <div class="flex items-center">
                        <UButton icon="i-lucide-user" variant="ghost" />
                    </div>
                </div>
                <div class="w-full flex justify-end py-5">
                    <UButton @click="ordenar" variant="link" color="primary">{{ orden == 'asc' ? 'Ordenar A - Z' :
                        'Ordenar Z - A' }}</UButton>
                    <UButton @click="borrarFiltros" :variant="categoriaSeleccionada || busqueda ? 'soft' : 'link'"
                        color="primary">Limpiar filtros</UButton>
                </div>
                <div class="md:hidden flex items-center justify-between py-5">
                    <UInput v-model="busqueda" icon="i-lucide-search" size="md" color="primary" variant="soft"
                        placeholder="Buscar..." class="w-64" />
                    <UButton icon="i-lucide-x" @click="busqueda = ''"></UButton>
                </div>
            </div>
        </UContainer>

        <UContainer class="grid md:grid-cols-[20%_1fr] gap-5">
            <aside class="md:block hidden">
                <div class="flex items-center py-5">
                    <transition name="expand">
                        <UInput v-if="showSearch" v-model="busqueda" icon="i-lucide-search" size="md" color="primary"
                            variant="soft" placeholder="Buscar..." class="w-64" />
                    </transition>


                    <UButton :icon="showSearch ? 'i-lucide-x' : 'i-lucide-search'" variant="ghost"
                        @click="showSearch = !showSearch" />
                </div>

                <div>
                    <p>Categorías</p>
                    <ul class="flex flex-col gap-5 w-full">
                        <li v-for="categoria in categorias" :key="categoria">
                            <UButton @click="seleccionarCategoria(categoria)" color="neutral" variant="soft">
                                {{ categoria }}
                            </UButton>
                        </li>
                    </ul>
                </div>
            </aside>
            <!-- Versión móvil -->
            <div class="md:hidden">
                <!-- Botón para abrir el desplegable -->
                <UButton icon="i-lucide-filter" color="secondary" variant="solid" size="md"
                    @click="showFilters = !showFilters" class="w-full flex justify-between items-center">
                    Filtros
                    <span :class="showFilters ? 'rotate-180' : ''" class="transition-transform">
                        ▼
                    </span>
                </UButton>

                <!-- Panel desplegable -->
                <transition name="fade">
                    <div v-if="showFilters" class="mt-3 bg-gray-50 rounded-lg shadow p-4 space-y-4">

                        <!-- Categorías -->
                        <div>
                            <p class="font-semibold mb-2">Categorías</p>
                            <ul class="space-y-2">
                                <li v-for="categoria in categorias" :key="categoria">
                                    <UButton @click="seleccionarCategoria(categoria)" color="neutral" variant="soft"
                                        class="w-full">
                                        {{ categoria }}
                                    </UButton>
                                </li>
                            </ul>
                        </div>
                    </div>
                </transition>
            </div>
            <!-- Grid de tarjetas -->
            <div class="eq-grid grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-4 bg-(--bg-color) ">

                <div class="relative cursor-pointer group font-[Outfit] rounded-2xl" v-for="(item, i) in productosFiltrados.slice(0, 9)" :key="i">
                    <!-- <div
                        class="absolute -left-3.5 top-0 bottom-auto w-10.5 z-10 flex items-center justify-center pointer-events-none rounded-2xl">
                        <span class="text-[#1565C0] font-black uppercase leading-none select-none opacity-10"
                            style="writingMode: vertical-rl; textOrientation: mixed; transform: rotate(180deg); fontSize: 38px; letterSpacing: -0.02em; whiteSpace: nowrap;">
                            {{ item.CATEGORIA.split(' ')[0] }}
                        </span>
                    </div> -->
                    <nuxt-link to="/Producto" 
                        @click="productoSeleccionado = item"
                        class="md:h-[45vh] h-[30vh] group w-70 rounded-[20px] overflow-hidden bg-white shadow-[0_4px_24px_rgba(10,60,120,0.13)] hover:shadow-[0_16px_48px_rgba(10,60,120,0.22)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
    
                        <!-- Escena IMG producto (cada uno con su propio IMG) -->
                        <div class="relative w-full h-47.5 overflow-hidden bg-blue-100">
                            <img src="/images/equipos.jpg" alt="Equipo BIPAP"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400 rounded-t-2xl" />
                            <!-- <span
                                class="absolute top-3 left-3 bg-white/90 text-blue-700 text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-200">
                                Disponible
                            </span> -->
                    <div
                        class="absolute -left-1 top-auto bottom-0 w-10.5 z-10 flex items-center justify-center pointer-events-none rounded-2xl">
                        <span class="categoria text-[#1565C0] text-3xl font-black uppercase leading-none select-none opacity-100"
                            style="color: linear-gradient(90deg, rgba(255,255,255,0.13), rgba(255,255,255,0.4), rgba(255,255,255,0.13)) !important; writingMode: vertical-rl; textOrientation: mixed; transform: rotate(180deg); fontSize: 40px; letterSpacing: -0.02em; whiteSpace: nowrap;">
                            {{ item.CATEGORIA.split(' ')[0] }}
                        </span>
                    </div>
                        </div>
                        <div class="relative px-5.5 pt-5 pb-5.5 rounded-b-2xl"
                            style="background: linear-gradient(160deg, #1565C0 0%, #1E88E5 60%, #29B6F6 100%)">
                            <div class="absolute top-0 left-0 right-0 h-0.75"
                                style="background: linear-gradient(90deg, rgba(255,255,255,0.13), rgba(255,255,255,0.4), rgba(255,255,255,0.13))" />
                            <p class="text-xs! font-semibold uppercase tracking-[0.06em] text-white/65 mb-0.5">
                                Equipo médico
                            </p>
                            <h2 class="text-lg! font-bold text-white tracking-tight mb-3.5">
                                {{ item.EQUIPO.length > 25 ? item.EQUIPO.substring(0, 25) + '...' : item.EQUIPO }}
                            </h2>
                            <div class="h-px bg-white/20 mb-4" />
    
                            <div class="flex items-end gap-1.5 mb-4.5">
                                <span class="text-base font-semibold text-white/75 mb-0.5">$</span>
                                <div>
                                    <span class="text-lg! font-bold text-white leading-none">{{
                                        item.V_UNITARIO.toLocaleString("es-CO") }}</span>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="px-4 pt-2">
                            <h3 class="md:text-lg! text-base! text-white!">
                                {{ item.EQUIPO.length > 25 ? item.EQUIPO.substring(0, 25) + '...' : item.EQUIPO }}
                            </h3>
                            <p class="eq-desc text-white">${{ item.V_UNITARIO.toLocaleString("es-CO") }}</p>
    
                            <div class="eq-footer">
                                <UButton to="/Producto" color="neutral" variant="soft" size="xs"
                                    @click="productoSeleccionado = item">Ver más</UButton>
                            </div>
    
                        </div> -->
                    </nuxt-link>
                </div>

            </div>
        </UContainer>

    </section>
</template>

<style scoped>
/* Fondo de la sección — oscuro médico */
.equipo-seccion {
    background: #F5F5F5;
    font-family: 'Space Grotesk', sans-serif;
    position: relative;
    z-index: 2;
}

.categoria {
    -webkit-text-stroke: 1px #3558bb;
}

.eq-card {
    background: #1E3A8A;
    background: linear-gradient(344deg, rgba(30, 58, 138, 1) 7%, rgba(83, 178, 237, 1) 70%);
    position: relative;
    overflow: hidden;
    transition: background all 0.3s;
    transition: all 500ms ease-in-out;
}

.eq-card:hover {
    background: rgb(212, 231, 255)c;
}

.eq-card:hover .eq-scanline {
    opacity: 1;
}

.eq-card:hover img {
    scale: 1.05;
}

/* Piezas SVG — estado inicial disperso vía GSAP */
.pieza {
    will-change: transform, opacity;
}

.eq-eyebrow {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #a9f5ff;
}

.eq-bottom {
    padding: 24px 40px;
    border-top: 0.5px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.eq-stat {
    text-align: center
}

.eq-stat-num {
    font-family: 'Rajdhani', sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--glow);
}

.eq-stat-label {
    font-size: 11px;
    color: var(--text-sub);
    margin-top: 2px;
    text-transform: uppercase;
    letter-spacing: 0.07em
}

.eq-cta {
    display: flex;
    gap: 10px;
}

.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
    transform: scaleX(0.5);
}
</style>
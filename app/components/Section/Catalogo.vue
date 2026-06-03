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
                    <UButton @click="ordenar" variant="link" color="primary">{{ orden == 'asc' ? 'Ordenar A - Z' : 'Ordenar Z - A'}}</UButton>
                    <UButton @click="borrarFiltros" :variant="categoriaSeleccionada || busqueda ? 'soft' : 'link'" color="primary">Limpiar filtros</UButton>
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
            <div class="eq-grid grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-4 bg-(--bg-color)">
                <div v-for="(item, i) in productosFiltrados.slice(0, 9)" :key="i"
                    class="eq-card md:h-[45vh] h-[30vh] rounded-lg">

                    <!-- Escena IMG producto (cada uno con su propio IMG) -->
                    <div class="w-full flex justify-center">
                        <img src="/images/equipos.jpg" alt="producto">
                    </div>

                    <div class="px-4 pt-2">
                        <h3 class="md:text-lg! text-base!">{{ item.EQUIPO.length > 25 ? item.EQUIPO.substring(0, 25) +
                            '...' : item.EQUIPO
                        }}</h3>
                        <p class="eq-desc">${{ item.V_UNITARIO.toLocaleString("es-CO") }}</p>

                        <div class="eq-footer">
                            <UButton to="/Producto" color="secondary" variant="soft" size="xs"
                                @click="productoSeleccionado = item">Ver más</UButton>
                        </div>

                    </div>
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

.eq-card {
    background: #f8fbff;
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
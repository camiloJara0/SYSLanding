<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref, nextTick } from 'vue'
import { gsap } from 'gsap'

const store = useCatalogoStore()

const { productoSeleccionado, productos, categorias, productosFiltrados, loading, error, busqueda, categoriaSeleccionada, orden } = storeToRefs(store)
const { llamaDatos, borrarFiltros, ordenar } = store

const imagenPrincipal = ref('/images/hospital.jpg')
const cantidad = ref(1)
const router = useRouter()

function volver() {
    router.push('/#section-catalogo')
    store.productoSeleccionado = {}
}

const caracteristicasArray = computed(() => {
    if (!productoSeleccionado.value.CARACTERISTICAS) return []
    return Object.entries(productoSeleccionado.value.CARACTERISTICAS).map(([clave, valor]) => ({ clave, valor }))
})

const productosRecomendados = computed(() => {
    const productosActuales = productos.value.filter(p => p.EQUIPO !== productoSeleccionado.value.EQUIPO)
    return productosActuales.slice(0, 6)
})

onMounted(async() => {
    if (!productoSeleccionado.value.EQUIPO) {
        volver()
    }

    await nextTick() // asegura que el DOM ya está renderizado
    // Animación suave de entrada
    gsap.from('.producto-hero', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out'
    })

    gsap.from('.producto-info', {
        opacity: 0,
        x: 30,
        duration: 0.7,
        delay: 0.1,
        ease: 'power2.out'
    })

    gsap.from('.caracteristica-item', {
        opacity: 1,
        y: 15,
        stagger: 0.05,
        duration: 0.3,
        ease: 'power2.out'
    })

    gsap.from('.recomendacion-card', {
        opacity: 0,
        scale: 0.95,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out'
    })
})
</script>

<template>
    <Navbar />

    <UContainer class="py-8 pt-18">
        <!-- Breadcrumb -->
        <div class="mb-8 text-sm text-gray-600">
            <NuxtLink to="/" class="hover:text-blue-600 transition-colors">Home</NuxtLink>
            <span class="mx-2">/</span>
            <NuxtLink to="/#section-catalogo" class="hover:text-blue-600 transition-colors">Productos</NuxtLink>
            <span class="mx-2">/</span>
            <span class="font-semibold text-gray-800">{{ productoSeleccionado.EQUIPO || 'Producto' }}</span>
        </div>

        <!-- PRODUCTO HERO SECTION -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">

            <!-- GALERÍA IZQUIERDA -->
            <div class="producto-hero">
                <div
                    class="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8">
                    <img :src="imagenPrincipal" :alt="productoSeleccionado.EQUIPO"
                        class="w-full h-auto object-contain" />
                </div>

                <!-- Miniaturas (placeholder) -->
                <div class="grid grid-cols-4 gap-3 mt-6">
                    <div v-for="i in 4" :key="i"
                        class="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200">
                        <img :src="imagenPrincipal" alt="thumbnail" class="w-full h-full object-cover rounded-lg" />
                    </div>
                </div>
            </div>

            <!-- INFORMACIÓN DERECHA -->
            <div class="producto-info flex flex-col my-10">

                <!-- Encabezado del producto -->
                <div class="mb-6">
                    <h1 class="text-3xl! font-bold mb-3 text-gray-900!">
                        {{ productoSeleccionado.EQUIPO || '—' }}
                    </h1>
                    <div class="flex items-center gap-3 mb-4">

                        <span :class="productoSeleccionado.CANT > 0
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'" class="px-4 py-1 rounded-full text-sm font-semibold">
                            {{ productoSeleccionado.CANT > 0 ? 'En Stock' : 'Agotado' }}
                        </span>
                    </div>
                </div>

                <!-- Precio -->
                <div class="mb-8 pb-6 border-b-2 border-gray-200">
                    <div class="flex items-baseline gap-3 mb-2">
                        <span class="text-3xl font-bold text-gray-900">
                            ${{ productoSeleccionado.V_UNITARIO?.toLocaleString('es-ES') || '—' }}
                        </span>
                        <span class="text-lg text-gray-500">/unidad</span>
                    </div>
                    <p class="text-sm text-gray-600">Precio IVA incluido</p>
                </div>

                <!-- Descripción -->
                <p class="text-lg text-gray-700 leading-relaxed mb-8">
                    {{ productoSeleccionado.DESCRIPCION || 'Sin descripción disponible' }}
                </p>

                <!-- Cantidad y Acciones -->
                <div class="space-y-4 mt-auto">
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-semibold text-gray-700">Cantidad:</label>
                        <div class="flex items-center border border-gray-300 rounded-lg">
                            <button @click="cantidad = Math.max(1, cantidad - 1)"
                                class="px-3 py-2 hover:bg-gray-100 transition-colors flex justify-center items-center">
                                <UIcon name="i-lucide-minus" class="w-5 h-5"></UIcon>
                            </button>
                            <input v-model.number="cantidad" type="number" min="1"
                                class="w-12 text-center border-0 focus:ring-0" />
                            <button @click="cantidad = cantidad + 1"
                                class="px-3 py-2 hover:bg-gray-100 transition-colors flex justify-center items-center">
                                <UIcon name="i-lucide-plus" class="w-5 h-5"></UIcon>
                            </button>
                        </div>
                    </div>

                    <!-- Botones CTA -->
                    <div class="grid grid-cols-2 gap-3">
                        <UButton class="py-3 text-base font-semibold"
                            :style="{ backgroundColor: '#3B82F6', borderColor: '#3B82F6' }"
                            @click="agregarProducto(productoSeleccionado)">
                            <UIcon name="i-lucide-shopping-cart" class="w-5 h-5 mr-2"></UIcon>
                            Añadir a cotización
                        </UButton>
                        <UButton variant="soft" color="gray" class="py-3 text-base font-semibold" @click="volver">
                            <UIcon name="i-lucide-arrow-left" class="w-5 h-5 mr-2"></UIcon>
                            Atrás
                        </UButton>
                    </div>

                    <!-- Información adicional -->
                    <div class="grid grid-cols-2 gap-3 pt-6 border-t border-gray-200">
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <UIcon name="i-lucide-truck" class="w-5 h-5 text-blue-600"></UIcon>
                            <span>Envío rápido</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-green-600"></UIcon>
                            <span>Garantía 12 meses</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <UIcon name="i-lucide-phone" class="w-5 h-5 text-amber-600"></UIcon>
                            <span>Soporte 24/7</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <UIcon name="i-lucide-check" class="w-5 h-5 text-teal-600"></UIcon>
                            <span>Certificado</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- CARACTERÍSTICAS DETALLADAS -->
        <div class="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 mb-20">
            <h2 class="text-2xl! font-bold text-gray-900 mb-8">
                <UIcon name="i-lucide-list-check" class="w-6 h-6 inline mr-3 text-blue-600"></UIcon>
                Características Técnicas
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(car, idx) in caracteristicasArray" :key="idx"
                    class="caracteristica-item bg-white p-5 rounded-xl shadow-sm border-l-4 hover:shadow-md "
                    :style="{ borderLeftColor: '#3B82F6' }">
                    <h3 class="text-sm! font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                        {{ car.clave }}
                    </h3>
                    <p class="text-base! font-bold text-gray-900">
                        {{ car.valor || '—' }}
                    </p>
                </div>
            </div>
        </div>

        <!-- SECCIÓN DE RECOMENDACIONES -->
        <div class="mb-20">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h2 class="text-2xl! font-bold text-gray-900">Te podría interesar</h2>
                    <p class="text-gray-600 mt-1">Otros productos relacionados</p>
                </div>
                <NuxtLink to="/#section-catalogo"
                    class="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors">
                    Ver catálogo completo
                    <UIcon name="i-lucide-arrow-right" class="w-5 h-5"></UIcon>
                </NuxtLink>
            </div>

            <!-- Grid de recomendaciones -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="relative cursor-pointer group font-[Outfit] rounded-2xl" v-for="(item, i) in productosRecomendados" :key="i">
                    <div
                        class="absolute -left-3.5 top-0 bottom-auto w-10.5 z-10 flex items-center justify-center pointer-events-none rounded-2xl">
                        <span class="text-[#1565C0] font-black uppercase leading-none select-none opacity-10"
                            style="writingMode: vertical-rl; textOrientation: mixed; transform: rotate(180deg); fontSize: 38px; letterSpacing: -0.02em; whiteSpace: nowrap;">
                            {{ item.CATEGORIA.split(' ')[0] }}
                        </span>
                    </div>
                    <nuxt-link to="/Producto" 
                        @click="productoSeleccionado = item"
                        class="md:h-[45vh] h-[30vh] group w-70 rounded-[20px] overflow-hidden bg-white shadow-[0_4px_24px_rgba(10,60,120,0.13)] hover:shadow-[0_16px_48px_rgba(10,60,120,0.22)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
    
                        <!-- Escena IMG producto (cada uno con su propio IMG) -->
                        <div class="relative w-full h-47.5 overflow-hidden bg-blue-100">
                            <img src="/images/equipos.jpg" alt="Equipo BIPAP"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400 rounded-t-2xl" />
                            <span
                                class="absolute top-3 left-3 bg-white/90 text-blue-700 text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-200">
                                Disponible
                            </span>
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
        </div>
    </UContainer>

    <Footer />
</template>

<style scoped>
/* Ocultar scrollbar en navegadores modernos */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Animaciones suaves */
.producto-hero,
.producto-info {
    animation-fill-mode: both;
}

.caracteristica-item {
    transition: all 0.3s ease;
}

.caracteristica-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

.recomendacion-card {
    animation-fill-mode: both;
}

/* Efecto hover en botones */
button {
    transition: all 0.3s ease;
}

button:hover {
    transform: translateY(-2px);
}

button:active {
    transform: translateY(0);
}

/* Estilos de input quantity */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Line clamp para textos largos */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
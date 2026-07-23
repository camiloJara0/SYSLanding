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
    // store.productoSeleccionado = {}
}

const caracteristicasArray = computed(() => {
    if (!productoSeleccionado.value.CARACTERISTICAS) return []
    return Object.entries(productoSeleccionado.value.CARACTERISTICAS).map(([clave, valor]) => ({ clave, valor }))
})

const productosRecomendados = computed(() => {
    const productosActuales = productos.value.filter(p => p.EQUIPO !== productoSeleccionado.value.EQUIPO)
    return productosActuales.slice(0, 6)
})

onMounted(async () => {
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
        <div class="mb-8 text-sm text-gray-600" id="inicio-producto">
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
                    class="bg-linear-to-br from-(--bg-color) to-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 h-[60vh]">
                    <img :src="productoSeleccionado.IMAGEN" :alt="productoSeleccionado.EQUIPO"
                        class="w-full h-full object-contain" />
                </div>

                <!-- Miniaturas (placeholder) -->
                <div class="grid grid-cols-4 gap-3 mt-6">
                    <div v-for="i in 4" :key="i"
                        class="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200 overflow-hidden">
                        <img :src="productoSeleccionado.IMAGEN" alt="thumbnail" class="w-full h-full object-cover rounded-lg" :class="{
                            'scale-[1.2] object-[0%_0%]': i === 1,
                            'scale-[4.0] object-[60%_30%]': i === 2,
                            'scale-[1.5] object-[20%_40%]': i === 3,
                            'scale-[5.0] object-[100%_100%]': i === 4
                        }" />
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
                            $ {{ productoSeleccionado.V_UNITARIO?.toLocaleString('es-ES') || '—' }}
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
                        <UButton class="py-3 text-base font-semibold flex justify-center text-white"
                            :style="{ backgroundColor: '#3B82F6', borderColor: '#3B82F6' }"
                            @click="agregarProducto(productoSeleccionado)">
                            <UIcon name="i-lucide-shopping-cart" class="w-5 h-5 mr-2"></UIcon>
                            Añadir a cotización
                        </UButton>
                        <UButton to="/#section-catalogo" variant="soft" color="gray" class="py-3 text-base font-semibold" @click="volver">
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
                <div
                v-for="(car, idx) in caracteristicasArray"
                :key="idx"
                class="caracteristica-item bg-white p-5 rounded-xl shadow-sm border-l-4 hover:shadow-md"
                :style="{ borderLeftColor: '#3B82F6' }"
                >
                <h3 class="text-sm! font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    {{ car.clave }}
                </h3>

                <!-- Si es un objeto o array -->
                <template v-if="car.valor && typeof car.valor === 'object'">
                    <ul class="list-disc list-inside space-y-1">
                    <li v-for="(item, index) in car.valor" :key="index">
                        <template v-if="typeof item === 'object'">
                        {{ JSON.stringify(item) }}
                        </template>
                        <template v-else>
                        {{ item }}
                        </template>
                    </li>
                    </ul>
                </template>

                <!-- Si es un valor simple -->
                <p v-else class="text-base! font-bold text-gray-900">
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
            <div
                class="products-grid grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <nuxt-link v-for="(item, i) in productosRecomendados" :key="i" to="/Producto/#inicio-producto"
                    @click="productoSeleccionado = item" class="product-card group w-full rounded-2xl overflow-hidden">
                    <!-- Card Container -->
                    <div class="overflow-hidden transition-all duration-300 h-full flex">

                        <!-- Image Container -->
                        <div
                            class="overflow-hidden rounded-2xl relative w-[65%] aspect-square bg-linear-to-b from-[#88A5B7] to-(--bg-color) hover:border-gold/50 shadow-sm hover:shadow-xl">
                            <img :src="item.IMAGEN" :alt="item.EQUIPO"
                                class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out" />
                            <!-- Overlay gradient on hover -->
                            <div
                                class="absolute inset-0 bg-linear-to-t from-black/0 to-black/0 group-hover:from-black/20 group-hover:to-black/0 transition-all duration-300" />
                        </div>

                        <!-- Content -->
                        <div class="p-5 flex flex-col grow">
                            <!-- Category Badge -->
                            <div class="mb-1">
                                <span
                                    class="inline-block px-3 py-1 neoCard text-blue-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                                    Equipo médico
                                </span>
                            </div>

                            <!-- Title -->
                            <h3
                                class="text-base! lg:text-lg! font-semibold text-gray-900 mb-1 group-hover:text-gold transition-colors duration-200 line-clamp-2">
                                {{ item.EQUIPO }}
                            </h3>

                            <p class="text-gray-600 text-sm">
                                {{ item.DESCRIPCION.substring(0, 50) }}...
                            </p>

                            <!-- Price -->
                            <div class="mt-auto pt-1 border-t border-gray-100">
                                <p class="text-gray-600 text-sm mb-2">Precio unitario</p>
                                <p class="text-2xl font-bold text-gold">
                                    $ {{ item.V_UNITARIO.toLocaleString("es-CO", { maximumFractionDigits: 0 })}}
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

.neoCard {
    background: #e4ebf3;
    box-shadow:  20px 20px 60px #c2c8cf,
                -20px -20px 60px #ffffff;
}
</style>
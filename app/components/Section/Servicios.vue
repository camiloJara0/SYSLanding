<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
const progress = ref(0)
const ecgRef = ref(null)

const servicios = [
    {
        titulo: 'Traslado básico',
        descripcion: 'Transporte asistido para pacientes estables con monitoreo continuo.',
        tag: 'Ambulancia',
        color: 'teal',
        imagen: '/images/ambulanciaServicio.jpg',
        alt: 'Ambulancia',
        icon: 'i-lucide-activity'
    },
    {
        titulo: 'Emergencias 24/7',
        descripcion: 'Atención inmediata con soporte vital avanzado y personal médico especializado.',
        tag: 'Urgente',
        color: 'coral',
        imagen: '/images/emergenciasServicio.jpg',
        alt: 'Emergencias',
        icon: 'i-lucide-van'
    },
    {
        titulo: 'Soporte vital',
        descripcion: 'UCI móvil con desfibrilador, oxígeno y medicamentos de emergencia.',
        tag: 'UCI móvil',
        color: 'blue',
        imagen: '/images/soporteServicio.jpg',
        alt: 'Soporte',
        icon: 'i-lucide-briefcase-medical'
    },
    {
        titulo: 'Equipos médicos',
        descripcion: 'Venta y alquiler de insumos certificados para instituciones y hogares.',
        tag: 'Productos',
        color: 'purple',
        imagen: '/images/equipos.jpg',
        alt: 'Emergencias',
        icon: 'i-lucide-stethoscope'
    },
    {
        titulo: 'Atención hospitalaria',
        descripcion: 'Coordinación con centros hospitalarios para la continuidad del cuidado.',
        tag: 'Hospitalario',
        color: 'green',
        imagen: '/images/hospital.jpg',
        alt: 'Emergencias',
        icon: 'i-lucide-hospital'
    },
    {
        titulo: 'Contratos empresariales',
        descripcion: 'Planes personalizados con cobertura de emergencias para empresas.',
        tag: 'Empresas',
        color: 'amber',
        imagen: '/images/contrato.jpg',
        alt: 'Emergencias',
        icon: 'i-lucide-clipboard-plus'
    }
]

onMounted(() => {
    // ─── Carrusel horizontal con scroll ───────────────────────────────────────
    const track = document.querySelector('.cards-track')
    const progressFill = document.querySelector('.progress-fill')

    // Cuánto debe desplazarse el track (ancho total - ancho visible)
    const maxSlide = track.scrollWidth - track.parentElement.offsetWidth
    gsap.to(track, {
        x: -maxSlide,
        ease: 'none',          // movimiento lineal = 1:1 con scroll
        scrollTrigger: {
            trigger: '.carrusel-wrapper',
            start: 'top top',
            end: () => `+=${maxSlide}`,   // duración = distancia a desplazar
            pin: '.carrusel-sticky',      // fija el bloque mientras dura el scroll
            scrub: 1,                     // suavizado: 1s de lag entre scroll y gsap
            anticipatePin: 1,
            onUpdate: (self) => {
                // Actualiza la barra de progreso
                // if (progressFill) {
                //     progressFill.style.width = `${self.progress * 100}%`
                // }
                ecgRef.value?.draw(self.progress)
            }
        }
    })

    // ─── Entrada de tarjetas (cuando el carrusel llega al viewport) ────────────
    gsap.from('.card-servicio', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.carrusel-wrapper',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    })
})

</script>

<template>
    <!-- Sección "sticky" que ancla el carrusel mientras dura el scroll -->
    <section class="carrusel-wrapper">
        <div class="carrusel-sticky">
            <UContainer>
                <div class="flex items-center justify-between">
                    <h2 class="carrusel-titulo w-full">Nuestros servicios</h2>
                    <ProgressBar :progress="progress" ref="ecgRef"></ProgressBar>
                </div>
                <div class="carrusel-overflow">
                    <div class="cards-track" ref="track">
                        <div v-for="(s, i) in servicios" :key="i" class="card-servicio md:w-[40vw] w-[90vw] shadow-lg p-6" :class="`card--${s.color}`">
                            <span class="card-tag">{{ s.tag }}</span>
                            <h3>{{ s.titulo }}</h3>
                            <p>{{ s.descripcion }}</p>
                            <img :src="s.imagen" :alt="s.alt">
                        </div>
                    </div>
                </div>


            </UContainer>
        </div>
    </section>
</template>

<style scoped>
/* El wrapper debe ser más alto que la pantalla para dar "espacio" al scroll */
.carrusel-wrapper {
    height: 400vh;
    /* ajusta según cuántas tarjetas tengas */
}

.carrusel-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: #F5F5F5;
}

.carrusel-overflow {
    overflow: hidden;
}

.cards-track {
    display: flex;
    gap: 1.5rem;
    width: max-content;
    padding: 1rem;
    /* clave: que el track sea más ancho que el viewport */
    will-change: transform;
}

.card-servicio {
    height: 65vh;
    flex-shrink: 0;
    /* tu estilos de card... */
    border-radius: 6px;
}

.card-servicio img {
    width: 76%;
    margin: auto;
    border-radius: 30px;
}

.progress-bar {
    height: 2px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    margin-top: 2rem;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    width: 0%;
    background: currentColor;
    border-radius: 2px;
}
</style>
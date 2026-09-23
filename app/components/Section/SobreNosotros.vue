<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'

gsap.registerPlugin(ScrollTrigger)

const { prefersReducedMotion } = useMotionQuality()
const { crearEnlace } = useWhatsApp()
const whatsappUrl = crearEnlace()

const valores = [
  { icono: 'i-lucide-scale', titulo: 'Integridad', descripcion: 'Actuamos con transparencia, ética y responsabilidad en cada relación comercial y asistencial.' },
  { icono: 'i-lucide-badge-check', titulo: 'Confianza', descripcion: 'Construimos relaciones basadas en el cumplimiento, la transparencia y la confiabilidad de nuestras soluciones.' },
  { icono: 'i-lucide-heart-handshake', titulo: 'Humanización', descripcion: 'Entendemos que detrás de cada servicio, equipo o suministro existe una persona que necesita atención segura y oportuna.' },
  { icono: 'i-lucide-clock-3', titulo: 'Oportunidad', descripcion: 'Respondemos con agilidad a las necesidades de nuestros clientes, entendiendo que en salud el tiempo puede ser determinante.' },
  { icono: 'i-lucide-lightbulb', titulo: 'Innovación', descripcion: 'Buscamos nuevas tecnologías, procesos y soluciones que permitan transformar y mejorar la prestación de servicios de salud.' },
  { icono: 'i-lucide-award', titulo: 'Excelencia', descripcion: 'Trabajamos con disciplina y compromiso para superar las expectativas y entregar productos y servicios con altos estándares de calidad.' }
]

let ctx = null

onMounted(() => {
  if (prefersReducedMotion.value) return

  ctx = gsap.context(() => {
    // Animación del header
    gsap.from('.sobre-header', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.sobre-nosotros-seccion',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    })

    // Animación del contenido principal
    gsap.fromTo(
      '.sobre-contenido',
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        immediateRender: false,
        scrollTrigger: {
          trigger: '.sobre-nosotros-seccion',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Animación de valores
    gsap.from('.valor-card', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.valores-grid',
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section class="sobre-nosotros-seccion py-32 bg-(--bg-color) relative z-1">
    <UContainer>
      <!-- Header Section -->
      <div class="sobre-header mb-20 text-center lg:text-left">
        <div class="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
          <p class="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Sobre SYS
          </p>
        </div>
        <h2 class="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          Soluciones integrales para un <span class="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">sector salud más eficiente</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0">
          Integramos tecnología biomédica, suministro de medicamentos e insumos,
          transporte asistencial y talento humano especializado para brindar
          soluciones confiables, seguras y oportunas a las instituciones de salud.
        </p>
      </div>

      <!-- Contenido Principal -->
      <div class="sobre-contenido grid lg:grid-cols-2 gap-12 items-center mb-32">
        <div class="space-y-8">
          <!-- Misión -->
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <UIcon
                name="i-lucide-target"
                class="text-blue-600 text-2xl"
              />
              Misión
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Brindar soluciones integrales para el sector salud mediante la comercialización y alquiler de tecnología biomédica, suministro de medicamentos e insumos, prestación de servicios de transporte asistencial y provisión de talento humano en salud, garantizando calidad, oportunidad, seguridad y acompañamiento especializado.
            </p>
          </div>

          <!-- Visión -->
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <UIcon
                name="i-lucide-eye"
                class="text-cyan-600 text-2xl"
              />
              Visión
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Para el año 2030, ser reconocidos como una empresa referente en Colombia en soluciones integrales para el sector salud, destacándonos por nuestra innovación, confiabilidad, excelencia operacional y capacidad de integrar tecnología, suministros, transporte asistencial y talento humano en una propuesta de valor diferenciada.
            </p>
          </div>
        </div>

        <!-- Imagen -->
        <div class="relative">
          <div class="absolute inset-0 bg-linear-to-r from-blue-600/20 to-cyan-500/20 rounded-3xl blur-2xl" />
          <img
            src="/images/FOTO 4.jpeg"
            alt="SYS Soluciones médicas y de emergencia"
            loading="lazy"
            decoding="async"
            class="w-full rounded-3xl shadow-2xl relative z-1 hover:shadow-3xl transition-shadow duration-300"
          >
        </div>
      </div>

      <!-- Valores Corporativos -->
      <div class="mt-32">
        <div class="text-center mb-16">
          <h3 class="text-4xl font-bold text-gray-900 mb-4">
            Nuestros Valores
          </h3>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilares que guían nuestras decisiones y acciones en cada proyecto
          </p>
        </div>

        <div class="valores-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(valor, idx) in valores"
            :key="idx"
            class="valor-card group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-blue-500/50 hover:bg-white/15 transition-all duration-300 cursor-pointer"
          >
            <div class="mb-4 inline-flex p-3 rounded-xl bg-linear-to-br from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300">
              <UIcon
                :name="valor.icono"
                class="text-blue-600 text-2xl"
              />
            </div>
            <h4 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
              {{ valor.titulo }}
            </h4>
            <p class="text-gray-600 leading-relaxed text-sm">
              {{ valor.descripcion }}
            </p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-32 p-12 rounded-3xl bg-linear-to-r from-blue-600 to-cyan-500 text-center">
        <h4 class="text-3xl font-bold text-white mb-4">
          Tecnología, talento y soluciones que hacen posible una mejor atención en salud.
        </h4>
        <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Integramos equipos biomédicos, insumos, medicamentos, transporte asistencial y talento humano para acompañar a quienes hacen posible la salud.
        </p>
        <UButton
          :to="whatsappUrl"
          target="_blank"
          rel="noopener"
          size="lg"
          variant="solid"
          color="neutral"
          icon="i-lucide-phone"
          class="font-semibold"
        >
          Contactar Ahora
        </UButton>
      </div>
    </UContainer>
  </section>
</template>

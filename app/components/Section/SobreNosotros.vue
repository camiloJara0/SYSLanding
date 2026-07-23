<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted } from 'vue'

gsap.registerPlugin(ScrollTrigger)

const valores = [
  { icono: 'i-lucide-star', titulo: 'Excelencia', descripcion: 'Superamos los estándares de calidad en cada proyecto y servicio' },
  { icono: 'i-lucide-lightbulb', titulo: 'Innovación', descripcion: 'Tecnologías vanguardistas para mayor eficiencia y competitividad' },
  { icono: 'i-lucide-handshake', titulo: 'Compromiso', descripcion: 'Cumplimos con responsabilidad los objetivos de nuestros clientes' },
  { icono: 'i-lucide-shield', titulo: 'Confianza', descripcion: 'Relaciones sólidas basadas en transparencia y profesionalismo' },
  { icono: 'i-lucide-leaf', titulo: 'Sostenibilidad', descripcion: 'Soluciones responsables con las personas y el ambiente' },
  { icono: 'i-lucide-lock', titulo: 'Seguridad', descripcion: 'Protegemos personas, instalaciones y procesos' }
]

onMounted(() => {
  // Animación del header
  gsap.from('.sobre-header', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.sobre-nosotros-seccion',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  })

  // Animación del contenido principal
  gsap.from('.sobre-contenido', {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.sobre-nosotros-seccion',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  })

  // Animación de valores
  gsap.from('.valor-card', {
    opacity: 1,
    y: 40,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.valores-grid',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  })
})
</script>

<template>
  <section class="sobre-nosotros-seccion py-32 bg-(--bg-color) relative z-1">
    <UContainer>
      <!-- Header Section -->
      <div class="sobre-header mb-20 text-center lg:text-left">
        <div class="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
          <p class="text-blue-600 font-semibold text-sm uppercase tracking-wider">Sobre SYS</p>
        </div>
        <h2 class="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          Aire inteligente para <span class="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">espacios que inspiran</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0">
          Soluciones integrales de ventilación mecánica que transforman la calidad del aire, la eficiencia energética y el confort de los espacios.
        </p>
      </div>

      <!-- Contenido Principal -->
      <div class="sobre-contenido grid lg:grid-cols-2 gap-12 items-center mb-32">
        <div class="space-y-8">
          <!-- Misión -->
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <UIcon name="i-lucide-target" class="text-blue-600 text-2xl" />
              Misión
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Diseñar, suministrar e implementar sistemas de ventilación mecánica de alto desempeño, ofreciendo soluciones innovadoras, eficientes y confiables, respaldadas por un equipo altamente calificado y comprometido con la excelencia.
            </p>
          </div>

          <!-- Visión -->
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <UIcon name="i-lucide-eye" class="text-cyan-600 text-2xl" />
              Visión
            </h3>
            <p class="text-gray-700 leading-relaxed">
              Ser la empresa líder en soluciones de ventilación mecánica en Colombia y referente en Latinoamérica, reconocida por innovación, calidad, sostenibilidad y capacidad para generar valor en cada proyecto.
            </p>
          </div>
        </div>

        <!-- Imagen -->
        <div class="relative">
          <div class="absolute inset-0 bg-linear-to-r from-blue-600/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
          <img src="/images/emergenciasServicio.jpg" alt="SYS Soluciones" class="w-full rounded-3xl shadow-2xl relative z-1 hover:shadow-3xl transition-shadow duration-300" />
        </div>
      </div>

      <!-- Valores Corporativos -->
      <div class="mt-32">
        <div class="text-center mb-16">
          <h3 class="text-4xl font-bold text-gray-900 mb-4">Nuestros Valores</h3>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilares que guían nuestras decisiones y acciones en cada proyecto
          </p>
        </div>

        <div class="valores-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(valor, idx) in valores" :key="idx" class="valor-card group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-blue-500/50 hover:bg-white/15 transition-all duration-300 cursor-pointer">
            <div class="mb-4 inline-flex p-3 rounded-xl bg-linear-to-br from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300">
              <UIcon :name="valor.icono" class="text-blue-600 text-2xl" />
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
        <h4 class="text-3xl font-bold text-white mb-4">¿Listo para transformar tus espacios?</h4>
        <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Descubre cómo nuestras soluciones de ventilación inteligente pueden mejorar la calidad del aire y la eficiencia energética.
        </p>
        <UButton to="#" size="lg" variant="solid" color="white" icon="i-lucide-phone" class="font-semibold">
          Contactar Ahora
        </UButton>
      </div>
    </UContainer>
  </section>
</template>
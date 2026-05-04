<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
const progress = ref(0)
const ecgRef = ref(null)

const equipos = [
  {
    titulo: 'Equipos médicos',
    descripcion: 'Venta y alquiler de equipos certificados para hospitales y hogares.',
    tag: 'Equipos',
    color: 'purple',
    imagen: '/images/equipos.jpg',
    alt: 'Equipos médicos',
    icon: 'i-lucide-stethoscope'
  },
  {
    titulo: 'Insumos médicos',
    descripcion: 'Materiales y suministros esenciales para procedimientos clínicos.',
    tag: 'Insumos',
    color: 'teal',
    imagen: '/images/hospital.jpg',
    alt: 'Insumos médicos',
    icon: 'i-lucide-pill'
  },
  {
    titulo: 'Medicinas',
    descripcion: 'Medicamentos de uso general y especializado con garantía de calidad.',
    tag: 'Medicinas',
    color: 'coral',
    imagen: '/images/medicinas.png',
    alt: 'Medicinas',
    icon: 'i-lucide-capsule'
  }
]

onMounted(() => {
  const cards = gsap.utils.toArray('.card-equipo')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.equipos-wrapper',
      start: 'top top',
      end: () => `+=${cards.length * window.innerHeight}`, // una pantalla por card
      scrub: true,
      pin: '.equipos-sticky',
      anticipatePin: 1
    }
  })

  cards.forEach((card, i) => {
    tl.fromTo(card,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1 },
      i // posición relativa en el timeline
    )
    tl.to(card,
      { y: '-100%', opacity: 0, duration: 1 },
      i + 0.8 // se va antes de que entre la siguiente
    )
  })
})

</script>

<template>
    <!-- Sección "sticky" que ancla el carrusel mientras dura el scroll -->
<section class="equipos-wrapper">
  <div class="equipos-sticky py-30">
    <UContainer>
      <h2 class="equipos-titulo">Nuestros productos</h2>
      <div class="equipos-overflow">
        <div v-for="(e, i) in equipos" :key="i"
             class="card-equipo w-[90vw] h-[60vh] flex flex-col items-center justify-center absolute top-0 left-0"
             :class="`card--${e.color}`">
          <span class="card-tag">{{ e.tag }}</span>
          <h3>{{ e.titulo }} <UIcon :name="e.icon"></UIcon></h3>
          <p>{{ e.descripcion }}</p>
          <img :src="e.imagen" :alt="e.alt" class="md:w-[40%] w-[60%] h-full object-cover rounded-[20px]">
        </div>
      </div>
    </UContainer>
  </div>
</section>


</template>

<style scoped>
.equipos-wrapper {
  height: 300vh; /* 3 tarjetas → 3 pantallas */
}

.equipos-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #F5F5F5;
}

.equipos-overflow {
  position: relative;
  width: 100%;
  height: 100%;
}

.card-equipo {
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  border-radius: 12px;
}

.card-equipo img {
  margin: 2rem auto;
  border-radius: 20px;
}

</style>
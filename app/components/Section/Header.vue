<script setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, onUnmounted, ref } from 'vue'

gsap.registerPlugin(ScrollTrigger);
const totalImagenes = 98
const imagenActual = ref(1)
const imagenesPrecargadas = []

// Precarga de imágenes
const precargarImagenes = () => {
  for (let i = 1; i <= totalImagenes; i++) {
    const frame = String(i).padStart(3, '0')
    const img = new Image()
    img.src = `/images/rural/ezgif-frame-${frame}.jpg`
    imagenesPrecargadas.push(img)
  }
}

// Actualiza frame según scroll
const actualizarImagen = () => {
  const scrollTop = window.scrollY
  const header = document.querySelector("header")
  const maxScroll = header.offsetHeight - window.innerHeight
  const progreso = scrollTop / maxScroll
  const frame = Math.min(
    totalImagenes,
    Math.max(1, Math.floor(progreso * totalImagenes))
  )
  imagenActual.value = frame
}

onMounted(() => {
  precargarImagenes()
  window.addEventListener('scroll', actualizarImagen, { passive: true })

  gsap.from(".informacion-inicial", {
    y: -50,        // empieza 100px arriba
    opacity: 0,     // invisible al inicio
    duration: 1.2,  // duración de la animación
    ease: "power3.out" // curva de aceleración suave
  });

// Animación inicial del nombre de la empresa
  gsap.from(".informacion-inicial h3", {
    y: -80,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
  });

  // Animación de subtítulo y botón en el primer bloque
  gsap.from(".informacion-inicial p, .informacion-inicial button", {
    y: 40,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power2.out"
  });

  // Animación del segundo bloque con scroll
  gsap.from(".ambulancia", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power1.out",
    scrollTrigger: {
      trigger: ".ambulancia",
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });

})

onUnmounted(() => {
  window.removeEventListener('scroll', actualizarImagen)
})
</script>

<template>
      <header class="h-[220dvh] relative">
    <div class="fixed inset-0">
      <img class="imagenAnimada" :src="`/images/rural/ezgif-frame-${String(imagenActual).padStart(3, '0')}.jpg`"
        alt="Animación scroll" />
        <!-- <img class="imagenAnimada" src="/images/Captura de pantalla 2026-04-30 114718.png" >
        <img class="imagenAnimada" src="/images/Captura de pantalla 2026-04-30 114627.png" >
        <img class="imagenAnimada" src="/images/Captura de pantalla 2026-04-30 114652.png" > -->
        <!-- <img class="imagenAnimada" src="/images/Captura de pantalla 2026-04-30 114701.png" > -->
    </div>

    <!-- Bloque inicial -->
    <UContainer class="h-screen">
      <div class="grid grid-cols-12 grid-rows-12 contenido">
        <div class="informacion-inicial md:col-span-5 col-span-6 col-start-1 md:row-start-4 row-start-3 row-span-3">
          <h3 class="md:text-5xl! text-2xl">SYS S.A.S</h3>
          <p class="md:text-xl! text-gray-950">
            <strong>servicios de ambulancia</strong> para emergencias y traslados, 
            <strong>venta de equipos e insumos médicos</strong> certificados.
          </p>
        </div>
        <div class="informacion-inicial md:col-span-2 col-span-4 md:col-start-11 col-start-9 row-start-4 row-span-2 p-1">
          <h4 class="md:text-3xl! text-xl text-gray-900">Tu salud, nuestra prioridad</h4>
          <UButton to="#section-servicios" color="secondary" variant="solid" size="xl" class="mt-2">Ver Servicios</UButton>
        </div>
      </div>
    </UContainer>

    <!-- Bloque ambulancia -->
    <UContainer class="h-screen">
      <div class="grid grid-cols-12 grid-rows-12 contendio">
        <div class="ambulancia md:col-span-5 col-span-6 md:col-start-7 col-start-6 row-start-7 row-span-4">
          <h3 class="md:text-4xl! text-3xl">Servicio de Ambulancia</h3>
          <p class="md:text-xl! text-gray-950">
            Atención rápida y segura, con personal capacitado y unidades modernas para emergencias y traslados.
          </p>
          <UButton to="#" color="secondary" variant="solid" size="xl">Contactar</UButton>
        </div>
      </div>
    </UContainer>
  </header>
</template>

<style scoped>
.imagenHeader {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
}

.imagenAnimada {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  /* optimización */
}

.contenido {
  position: relative;
  z-index: 1;
  /* para que el texto quede encima de la imagen */
}
</style>
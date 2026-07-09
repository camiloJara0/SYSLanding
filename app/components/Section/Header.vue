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
    duration: 1,
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
  <header class="h-[220dvh] relative overflow-hidden">
    <div class="fixed inset-0">
      <img class="imagenAnimada object-[30%_center]"
        :src="`/images/rural/ezgif-frame-${String(imagenActual).padStart(3, '0')}.jpg`" alt="Animación scroll" />
      <div class="absolute inset-0 "></div>
    </div>

    <!-- Bloque inicial -->
    <UContainer class="h-screen">
      <div class="grid grid-cols-12 grid-rows-12 contenido">
        <div
          class="informacion-inicial hero-card relative overflow-hidden md:col-span-6 col-span-10 lg:col-start-1 col-start-2 md:row-start-2 row-start-2 row-span-4 rounded-3xl md:p-8 md:py-12 p-5 hover:bg-white/25 transition-all duration-300">
            <h3 class="text-2xl font-bold mb-2 flex items-center">
              <span class="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">SYS</span>
              <span class="text-blue-800">S.A.S.</span>
            </h3>
          <h3 class="md:text-3xl! text-base text-gray-700/95 mt-3 md:my-4 leading-relaxed drop-shadow font-medium ">
            <strong class="text-black">Respuesta rápida,</strong> <br>
            cuidado humano.
          </h3>
          <p class="md:text-lg text-base text-gray-700/95 mt-3 md:mt-4 leading-relaxed drop-shadow font-medium">
            <strong class="text-black">Ambulancias cértificadas,</strong> perosnal ceritificado y equipos
            <strong class="text-black">de ultima generación para cada</strong> emergencia.
          </p>
          <div class="flex md:flex-row flex-col gap-3 py-5 px-10">
            <div class="flex gap-1 items-center justify-center">
              <UIcon name="i-lucide-shield" size="2xl" class="md:text-5xl text-2xl"></UIcon>
              <p class="text-xs! font-bold">Seguridad certificada</p>
            </div>
            <div class="h-full w-1 bg-gray-400"></div>
            <div class="flex gap-1 items-center justify-center">
              <UIcon name="i-lucide-user" size="xl" class="md:text-5xl text-2xl"></UIcon>
              <p class="text-xs! font-bold">Profesionales especializados</p>
            </div>
            <div class="h-full w-1 bg-gray-200"></div>
            <div class="flex gap-1 items-center justify-center">
              <UIcon name="i-lucide-clock" size="xl" class="md:text-5xl text-2xl"></UIcon>
              <p class="text-xs! font-bold">Disponibilidad 24/7</p>
            </div>
          </div>

          <div class="flex gap-3 py-4">
            <UButton color="secondary" class="py-3 md:px-8 rounded-2xl text-white">Contactar</UButton>
            <UButton to="/#section-servicios" color="neutral" variant="soft" class="py-3 md:px-8 rounded-2xl">Ver Servicios</UButton>
          </div>
        </div>

        <!-- <div
          class="informacion-inicial md:col-span-4 col-span-10 md:col-start-9 col-start-2 md:row-start-4 row-start-8 row-span-2 bg-white/15 md:bg-white/20 rounded-2xl backdrop-blur-xl border border-white/30 shadow-lg md:p-8 md:py-10 p-5 hover:bg-white/25 transition-all duration-300">
          <h4 class="md:text-3xl text-2xl font-bold text-black drop-shadow-lg">Tu salud, nuestra prioridad</h4>
          <UButton to="#section-servicios" color="secondary" variant="solid" size="xl" icon="i-lucide-stethoscope"
            class="mt-4 md:mt-6 text-white font-semibold shadow-md hover:shadow-lg transition-shadow">Ver Servicios
          </UButton>
        </div> -->
      </div>
    </UContainer>

    <!-- Bloque ambulancia -->
    <UContainer class="h-screen">
      <div class="grid grid-cols-12 grid-rows-12 contendio">
        <div
          class="ambulancia md:col-span-6 col-span-10 md:col-start-7 col-start-2 row-start-4 row-span-4 hero-card rounded-2xl md:p-8 md:py-10 p-5 hover:bg-white/25 transition-all duration-300">
          <h3 class="md:text-4xl text-2xl font-bold py-2 md:py-3 text-white drop-shadow-lg flex items-center gap-3">
            Servicio de Ambulancia <UIcon name="i-lucide-car"></UIcon>
          </h3>
          <p class="md:text-lg text-base text-gray-800/95 mt-3 md:mt-4 leading-relaxed font-medium drop-shadow">
            Atención rápida y segura, con personal capacitado y unidades modernas para emergencias y traslados.
          </p>
          <UButton to="#" color="secondary" variant="solid" size="xl" icon="i-lucide-phone"
            class="mt-4 md:mt-6 text-white font-semibold shadow-md hover:shadow-lg transition-shadow">Contactar
          </UButton>
        </div>
      </div>
    </UContainer>
    <div class="absolute bottom-0 left-0 w-full h-50 bg-linear-to-b from-transparent to-(--bg-color)"></div>
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

.hero-card {
  position: relative;
}

.hero-card::before {
  content: '';
  position: absolute;
  inset: 0;

  background: radial-gradient(
    ellipse at center,
    rgba(255,255,255,0.9) 0%,
    rgba(255,255,255,0.75) 35%,
    rgba(255,255,255,0.3) 60%,
    rgba(255,255,255,0.05) 80%,
    transparent 100%
  );

  z-index: -1;
}
</style>
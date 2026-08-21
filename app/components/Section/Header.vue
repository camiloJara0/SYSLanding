<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref, computed } from 'vue'

gsap.registerPlugin(ScrollTrigger)

const { isLowEnd, isMobile, prefersReducedMotion, supportsHeavyAnimations } = useDeviceCapabilities()

useHead({
  link: [
    { rel: 'preload', as: 'image', href: '/header.jpg', fetchpriority: 'high' }
  ]
})

const { crearEnlace } = useWhatsApp()
const whatsappUrl = crearEnlace()

const TOTAL_IMAGENES = 98
const imagenActual = ref(1)

const heroRef = ref(null)
const heroVisualRef = ref(null)
const ambulanciaStageRef = ref(null)
const ambulanciaStickyRef = ref(null)

const frameStep = computed(() => {
  if (prefersReducedMotion.value || isLowEnd.value) return 8
  if (isMobile.value) return 3
  return 1
})

/**
 * Modo superposición (solo desktop heavy): el hero queda por encima
 * del escenario de la ambulancia y se despliega hacia arriba al hacer
 * scroll. En mobile el escenario mantiene su flujo normal.
 *
 * Arranca en `false` para que el SSR renderice el HTML sin el overlay
 * (evita el margin-top negativo horneado en móvil) y se activa en
 * `onMounted` solo en desktop.
 */
const overlapMode = ref(false)

/**
 * Curva de "llegada rápida": al entrar a la sección de la ambulancia,
 * los frames avanzan rápido al inicio (la ambulancia llega a toda velocidad)
 * y frenan progresivamente a medida que el scroll avanza.
 */
const curvaLlegada = gsap.parseEase('power2.out')

const framesPrecargados = new Set()

function precargarFrames(desde, hasta) {
  const idle = window.requestIdleCallback
    ? window.requestIdleCallback.bind(window)
    : cb => setTimeout(cb, 1)
  for (let i = desde; i <= hasta; i += frameStep.value) {
    if (framesPrecargados.has(i)) continue
    framesPrecargados.add(i)
    idle(() => {
      const frame = String(i).padStart(3, '0')
      const img = new Image()
      img.src = `/images/rural/ezgif-frame-${frame}.webp`
    })
  }
}

function frameDesdeProgreso(progreso) {
  const f = Math.min(TOTAL_IMAGENES, Math.max(1, Math.floor(progreso * TOTAL_IMAGENES) + 1))
  if (frameStep.value > 1) {
    const redondeado = Math.round(f / frameStep.value) * frameStep.value
    return Math.min(TOTAL_IMAGENES, Math.max(1, redondeado))
  }
  return f
}

let triggers = []

onMounted(() => {
  // Precarga inicial ligera (solo los primeros frames para arrancar)
  precargarFrames(1, Math.min(12 * frameStep.value, TOTAL_IMAGENES))

  overlapMode.value = supportsHeavyAnimations.value && !isMobile.value

  // Animación de entrada del hero
  const heroTl = gsap.timeline({ delay: 0.15 })
  heroTl
    .from('.hero-badge', { y: -20, opacity: 1, duration: 0.8, ease: 'power3.out' })
    // .from('. text-2xl', { y: 40, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.5')
    .from('.hero-subtitle', { y: 30, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.6')
    .from('.hero-features > *', { y: 20, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.5')
    .from('.hero-cta > *', { y: 20, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.4')
    .from('.scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.2')

  // Transición cinematográfica del hero visual al hacer scroll
  const stage = ambulanciaStageRef.value
  const sticky = ambulanciaStickyRef.value

  if (supportsHeavyAnimations.value) {
    if (overlapMode.value) {
      // El hero entero se eleva (yPercent -100) en los primeros 100vh,
      // acelerando con power2.in. El stage está tirado debajo
      // (margin-top: -100vh), de modo que la secuencia de frames de la
      // ambulancia arranca desde el scroll 0, apenas el hero se despliega.
      const stHero = gsap.to('.hero-visual', {
        yPercent: -100,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=100vh',
          scrub: 1
        }
      })
      triggers.push(stHero)
    } else {
      // Salida rápida hacia arriba: el hero "sale volando" y acelera
      // justo antes de ceder paso a la sección de la ambulancia.
      const stHero = gsap.to('.hero-visual-layer', {
        opacity: 0,
        scale: 1.2,
        yPercent: -25,
        filter: 'blur(16px)',
        ease: 'power2.in',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })
      triggers.push(stHero)
    }

    const stIndicator = gsap.to('.scroll-indicator', {
      opacity: 0,
      y: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.value,
        start: 'top top',
        end: '30% top',
        scrub: true
      }
    })
    triggers.push(stIndicator)
  }

  // Lazy-load del resto de frames cuando el bloque ambulancia se acerca
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          precargarFrames(1, TOTAL_IMAGENES)
          obs.disconnect()
        }
      })
    },
    { rootMargin: '300px' }
  )
  if (ambulanciaStageRef.value) obs.observe(ambulanciaStageRef.value)

  if (supportsHeavyAnimations.value && stage && sticky) {
    // Animación de frames sincronizada con scroll (reemplaza listener nativo)
    const stFrames = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          imagenActual.value = frameDesdeProgreso(curvaLlegada(self.progress))
        },
        onLeave: () => { imagenActual.value = TOTAL_IMAGENES },
        onLeaveBack: () => { imagenActual.value = 1 }
      }
    })
    triggers.push(stFrames)

    // Card de ambulancia: aparece casi al último cuarto de la animación
    // de frames, tomando el rango real del scrollTrigger de los frames.
    const framesST = stFrames.scrollTrigger
    const cardStart = framesST.start + (framesST.end - framesST.start) * 0.72
    const cardEnd = framesST.start + (framesST.end - framesST.start) * 0.95

    const stCard = gsap.from('.ambulancia-card', {
      y: 130,
      x: 60,
      opacity: 0,
      duration: 1.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: stage,
        start: cardStart,
        end: cardEnd,
        toggleActions: 'play none none reverse'
      }
    })
    triggers.push(stCard)
  } else {
    // Modo reducido: frame fijo a la mitad de la secuencia
    imagenActual.value = frameDesdeProgreso(0.5)
  }

  ScrollTrigger.refresh()
})

onUnmounted(() => {
  triggers.forEach((t) => {
    t.scrollTrigger?.kill()
    t.kill()
  })
  triggers = []
})
</script>

<template>
  <header
    class="header-wrap relative"
    :class="{ 'overlap-mode': overlapMode }"
  >
    <!-- ====== HERO VISUAL 100vh ====== -->
    <section
      ref="heroRef"
      class="hero-visual h-screen relative overflow-hidden"
    >
      <!-- Capa imagen (la que se anima al hacer scroll) -->
      <div
        ref="heroVisualRef"
        class="hero-visual-layer absolute inset-0"
      >
        <img
          src="/header.jpg"
          alt="Equipos médicos de tecnología avanzada para hospitales y centros de salud"
          class="w-full h-full object-cover"
          fetchpriority="high"
          width="1920"
          height="1080"
        >
        <!-- Overlay para legibilidad del texto -->
        <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/45 to-black/15" />
        <div class="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />
      </div>

      <!-- Contenido del hero -->
      <UContainer class="relative z-10 h-full flex items-center">
        <div class="max-w-2xl">
          <div class="brand-sys text-xl font-bold mb-2 flex items-center opacity-80">
            <span class="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">SYS</span>
            <span class="text-gray-300 ml-1.5">S.A.S.</span>
          </div>

          <h1
            class=" text-white font-extrabold leading-[1.05] mb-6"
            style="font-size: 28px; letter-spacing: -0.02em;"
          >
            Respuesta rápida,<br>
            <span class="text-(--light-blue)">cuidado humano</span>.
          </h1>

          <p class="hero-subtitle text-white/85 text-sm! sm:text-xl max-w-xl mb-8 leading-relaxed">
            Ambulancias certificadas, personal certificado y equipos de última generación para cada emergencia.
          </p>

          <div class="hero-features flex flex-wrap gap-6 mb-10">
            <div class="flex items-center gap-2 text-white/90">
              <UIcon
                name="i-lucide-shield-check"
                class="md:text-2xl text-xl text-emerald-300"
              />
              <span class="md:text-sm! text-xs! font-semibold">Seguridad certificada</span>
            </div>
            <div class="flex items-center gap-2 text-white/90">
              <UIcon
                name="i-lucide-user-check"
                class="md:text-2xl text-xl text-emerald-300"
              />
              <span class="md:text-sm! text-xs! font-semibold">Profesionales especializados</span>
            </div>
            <div class="flex items-center gap-2 text-white/90">
              <UIcon
                name="i-lucide-clock"
                class="md:text-2xl text-xl text-emerald-300"
              />
              <span class="md:text-sm! text-xs! font-semibold">Disponibilidad 24/7</span>
            </div>
          </div>

          <div class="hero-cta flex flex-wrap gap-3">
            <UButton
              :to="whatsappUrl"
              target="_blank"
              rel="noopener"
              size="xl"
              class="rounded-full md:px-8 px-5 text-white font-semibold shadow-lg"
              :style="{ backgroundColor: 'var(--gold)', borderColor: 'var(--gold)' }"
            >
              Contactar
            </UButton>
            <UButton
              to="/#section-servicios"
              size="xl"
              variant="outline"
              color="neutral"
              class="rounded-full md:px-8 px-5 text-default border-white/40 hover:bg-white/10 font-semibold"
            >
              Ver servicios
            </UButton>
          </div>
        </div>
      </UContainer>

      <!-- Indicador de scroll -->
      <div class="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/70">
        <span class="text-xs uppercase tracking-widest">Scroll</span>
        <UIcon
          name="i-lucide-chevron-down"
          class="text-2xl animate-bounce"
        />
      </div>
    </section>

    <!-- ====== ESCENARIO AMBULANCIA (contenido, no fixed global) ====== -->
    <section
      ref="ambulanciaStageRef"
      class="ambulancia-stage"
    >
      <div
        ref="ambulanciaStickyRef"
        class="ambulancia-sticky"
      >
        <!-- Frame sequence -->
        <img
          class="ambulancia-frame object-[30%_center]"
          :src="`/images/rural/ezgif-frame-${String(imagenActual).padStart(3, '0')}.webp`"
          :alt="`Secuencia animada de ambulancia en recorrido rural, frame ${imagenActual}`"
          width="1920"
          height="1080"
        >
        <!-- Overlay para legibilidad -->
        <div class="absolute inset-0 bg-linear-to-r from-black/45 via-black/15 to-transparent" />
      </div>
      <!-- Card de ambulancia -->
      <UContainer class="absolute top-100 z-10 h-full flex items-center">
        <div class="ambulancia-card max-w-lg ml-auto bg-white/10 backdrop-blur-xl border border-white/25 rounded-3xl p-8 md:p-10 shadow-2xl">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3 drop-shadow-lg">
            Servicio de Ambulancia
            <UIcon
              name="i-lucide-ambulance"
              class="text-3xl text-amber-300"
            />
          </h2>
          <p class="text-secundary text-lg leading-relaxed font-semibold mb-6">
            Atención rápida y segura, con personal capacitado y unidades modernas para emergencias y traslados.
          </p>
          <UButton
            to="/#section-servicios"
            size="xl"
            class="rounded-full px-8 text-white font-semibold shadow-lg"
            :style="{ backgroundColor: 'var(--deep-blue)', borderColor: 'var(--deep-blue)' }"
          >
            <UIcon
              name="i-lucide-phone"
              class="mr-2"
            />
            Contactar
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- Gradiente de cierre hacia el fondo de la página -->
    <div class="absolute bottom-0 left-0 w-full h-50 bg-linear-to-b from-transparent to-(--bg-color)" />
  </header>
</template>

<style scoped>
.header-wrap {
  position: relative;
  background: var(--bg-color);
}

.hero-visual-layer {
  will-change: transform, opacity, filter;
  transform-origin: center;
}

.hero-visual-layer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Escenario ambulancia: altura que provee scroll suficiente para 98 frames */
.ambulancia-stage {
  position: relative;
  height: 300vh;
  background: #000;
}

.ambulancia-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.ambulancia-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}

.hero-fade-out {
  position: relative;
  height: 80px;
  margin-top: -1px;
  background: linear-gradient(to bottom, #fff, var(--bg-color));
  z-index: 2;
}

/*
|--------------------------------------------------------------------------
| Modo superposición (desktop)
|--------------------------------------------------------------------------
*/

.overlap-mode .hero-visual {
  position: relative;
  z-index: 2;
  will-change: transform;
}

.overlap-mode .ambulancia-stage {
  margin-top: -100vh;
  z-index: 1;
}

@media (max-width: 768px) {
  .ambulancia-stage {
    height: 180vh;
  }

  .ambulancia-card {
    margin: 0 auto;
    padding: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-visual-layer {
    will-change: auto;
  }

  .ambulancia-frame {
    will-change: auto;
  }
}
</style>

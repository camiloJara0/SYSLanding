<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  nextTick
} from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { isMobile, isTouch, supportsHeavyAnimations } = useDeviceCapabilities()

const progress = ref(0)
const showHint = ref(true)

const ecgRef = ref(null)
const trackRef = ref(null)
const wrapperRef = ref(null)
const stickyRef = ref(null)
const overflowRef = ref(null)

// Drag de tarjetas
const isDragging = ref(false)

const dragStartX = ref(0)
const dragStartScrollY = ref(0)
const dragStartScrollX = ref(0)

const servicios = [
  {
    titulo: 'Ambulancias básicas y medicalizadas',
    descripcion:
      'Transporte asistido para pacientes estables con monitoreo continuo durante todo el recorrido.',
    tag: 'Ambulancia',
    color: '#0D9488',
    acento: '#14B8A6',
    imagen: '/images/services/ambulancia.webp',
    alt: 'Ambulancia de traslado básico de SYS S.A.S. con monitoreo continuo de pacientes',
    icon: 'i-lucide-activity',
    mensajePredeterminado:
      'Me gustaría solicitar un traslado básico asistido para un paciente estable. Necesito información sobre disponibilidad, tarifas y cobertura.'
  },
  {
    titulo: 'Suministro de personal',
    descripcion:
      'Atención inmediata con soporte vital avanzado y personal médico especializado disponible las 24 horas.',
    tag: 'Urgente',
    color: '#F97316',
    acento: '#FB923C',
    imagen: '/images/services/emergencias.webp',
    alt: 'Unidad de emergencias 24/7 con soporte vital avanzado de SYS S.A.S.',
    icon: 'i-lucide-siren',
    mensajePredeterminado:
      'Solicito atención de emergencias 24/7. Requiero información sobre tiempos de respuesta, personal médico y cobertura.'
  },
  {
    titulo: 'Insumos médicos y medicamentos',
    descripcion:
      'UCI móvil equipada con desfibrilador, oxígeno y medicamentos de emergencia para traslados críticos.',
    tag: 'UCI móvil',
    color: '#2563EB',
    acento: '#3B82F6',
    imagen: '/images/services/soporte.webp',
    alt: 'UCI móvil de soporte vital con desfibrilador y oxígeno de SYS S.A.S.',
    icon: 'i-lucide-briefcase-medical',
    mensajePredeterminado:
      'Solicito el servicio de soporte vital (UCI móvil) para un traslado crítico. Por favor contáctenme con detalles de disponibilidad y tarifas.'
  },
  {
    titulo: 'Suministro y alquiler de equipos médicos',
    descripcion:
      'Suministro y alquiler de equipos médicos para instituciones de salud y atención domiciliaria.',
    tag: 'Productos',
    color: '#7C3AED',
    acento: '#8B5CF6',
    imagen: '/images/services/equipos.webp',
    alt: 'Equipos médicos certificados en venta y alquiler de SYS S.A.S.',
    icon: 'i-lucide-stethoscope',
    mensajePredeterminado:
      'Me interesa conocer el catálogo de equipos e insumos médicos para venta o alquiler. Solicito información detallada y tarifas.'
  },
  {
    titulo: 'Atención hospitalaria',
    descripcion:
      'Coordinación con centros hospitalarios para garantizar la continuidad del cuidado del paciente.',
    tag: 'Hospitalario',
    color: '#16A34A',
    acento: '#22C55E',
    imagen: '/images/services/hospital.webp',
    alt: 'Coordinación de atención hospitalaria con centros de salud de SYS S.A.S.',
    icon: 'i-lucide-hospital',
    mensajePredeterminado:
      'Solicito información sobre el servicio de coordinación de atención hospitalaria para un paciente que requiere continuidad de cuidado.'
  },
  {
    titulo: 'Contratos empresariales',
    descripcion:
      'Planes personalizados con cobertura de emergencias y atención prioritaria para empresas.',
    tag: 'Empresas',
    color: '#C9A227',
    acento: '#E8B923',
    imagen: '/images/services/contrato.webp',
    alt: 'Contratos empresariales con cobertura de emergencias de SYS S.A.S.',
    icon: 'i-lucide-clipboard-plus',
    mensajePredeterminado:
      'Me interesa contratar un plan empresarial con cobertura de emergencias. Solicito una cotización personalizada para mi empresa.'
  }
]

function solicitarServicio(servicio) {
  const carrito = useCarritoStore()
  carrito.abrirModalServicio(servicio)
}

let stCarousel = null
let stReveal = null

let resizeHandler = null
let orientationHandler = null
let visibilityHandler = null

let dragMoveHandler = null
let dragEndHandler = null

/**
 * Solo utilizamos el modo GSAP en desktop.
 * En mobile el carrusel usa scroll nativo (horizontal) para que
 * el scroll vertical de la página y el desplazamiento de las tarjetas
 * funcionen a la vez y de forma fluida.
 *
 * Arranca SIEMPRE en `false` (modo nativo): así el servidor (SSR/prerender)
 * renderiza el HTML con las clases seguras (native-mode/native-scroll) y no
 * hay discrepancia al hidratar en móvil/táctil. En desktop se activa el modo
 * GSAP en `onMounted`.
 */
const useHorizontalPin = ref(false)

/**
 * Distancia horizontal total que debe recorrer GSAP.
 */
const horizontalDistance = ref(0)

/**
 * Calcula las dimensiones reales del carrusel.
 *
 * La distancia se mide contra el contenedor visible
 * (`.carrusel-overflow`), no contra la sección completa,
 * para que la última tarjeta quede totalmente apreciable.
 */
function calculateDimensions() {
  if (!useHorizontalPin.value) {
    horizontalDistance.value = 0
    return
  }

  const track = trackRef.value
  const wrapper = wrapperRef.value
  const overflow = overflowRef.value

  if (!track || !wrapper || !overflow) return

  horizontalDistance.value = Math.max(
    0,
    track.scrollWidth - overflow.offsetWidth
  )

  /**
   * La altura del wrapper determina cuánto scroll vertical
   * necesitamos para completar el desplazamiento horizontal.
   */
  if (horizontalDistance.value > 0) {
    const scrollDistance = horizontalDistance.value

    wrapper.style.height = `calc(100vh + ${scrollDistance}px)`
  } else {
    wrapper.style.height = '100vh'
  }
}

/**
 * Convierte un progress horizontal en una posición vertical
 * de la página.
 */
function progressToScroll(progressValue) {
  if (!stCarousel?.scrollTrigger) return

  const trigger = stCarousel.scrollTrigger

  const start = trigger.start
  const end = trigger.end

  const target = gsap.utils.interpolate(
    start,
    end,
    gsap.utils.clamp(0, 1, progressValue)
  )

  window.scrollTo({
    top: target,
    behavior: 'auto'
  })
}

/**
 * Inicia drag directamente sobre las tarjetas.
 *
 * El usuario mueve el mouse horizontalmente,
 * pero nosotros convertimos ese movimiento en
 * scroll vertical de la página.
 */
function startCardDrag(event) {
  if (!useHorizontalPin.value && isTouch.value) return

  /**
   * Solo botón izquierdo.
   */
  if (event.button !== 0) return

  /**
   * No activar drag si el usuario está intentando
   * interactuar con botones/enlaces.
   */
  const interactive = event.target.closest(
    'button, a, input, textarea, select'
  )

  if (interactive) return

  isDragging.value = true

  dragStartX.value = event.clientX
  dragStartScrollY.value = window.scrollY
  dragStartScrollX.value = overflowRef.value?.scrollLeft ?? 0

  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'grabbing'

  window.addEventListener('mousemove', dragMoveHandler)
  window.addEventListener('mouseup', dragEndHandler)
}

/**
 * Movimiento del drag.
 */
function handleCardDrag(event) {
  if (!isDragging.value) return

  const deltaX = event.clientX - dragStartX.value

  /**
   * Multiplicador para hacer que el drag
   * se sienta natural.
   */
  const sensitivity = 1.15

  if (useHorizontalPin.value) {
    const targetScroll = dragStartScrollY.value - deltaX * sensitivity

    window.scrollTo({
      top: targetScroll,
      behavior: 'auto'
    })
  } else {
    const overflow = overflowRef.value
    if (!overflow) return

    overflow.scrollLeft = dragStartScrollX.value - deltaX * sensitivity
  }
}

/**
 * Finaliza el drag.
 */
function endCardDrag() {
  if (!isDragging.value) return

  isDragging.value = false

  document.body.style.userSelect = ''
  document.body.style.cursor = ''

  window.removeEventListener('mousemove', dragMoveHandler)
  window.removeEventListener('mouseup', dragEndHandler)
}

/**
 * Recalcula todo el sistema.
 */
function recalc() {
  if (!useHorizontalPin.value) {
    /**
     * Si cambiamos a modo nativo (p. ej. al girar a landscape
     * en mobile), liberamos el pin GSAP y restauramos la altura.
     */
    if (stCarousel) {
      stCarousel.scrollTrigger?.kill()
      stCarousel.kill()
      stCarousel = null
    }

    horizontalDistance.value = 0

    if (wrapperRef.value) {
      wrapperRef.value.style.height = ''
    }

    ScrollTrigger.refresh()
    return
  }

  calculateDimensions()

  nextTick(() => {
    ScrollTrigger.refresh()
  })
}

/**
 * En modo nativo oculta el hint al deslizar las tarjetas.
 */
function onOverflowScroll() {
  const el = overflowRef.value
  if (!el) return

  showHint.value = el.scrollLeft < 2
}

onMounted(async () => {
  await nextTick()

  useHorizontalPin.value = supportsHeavyAnimations.value && !isMobile.value && !isTouch.value

  /**
   * Handlers del drag.
   */
  dragMoveHandler = handleCardDrag
  dragEndHandler = endCardDrag

  calculateDimensions()

  resizeHandler = () => {
    recalc()
  }

  orientationHandler = () => {
    setTimeout(recalc, 250)
  }

  visibilityHandler = () => {
    if (!document.hidden) {
      recalc()
    }
  }

  window.addEventListener('resize', resizeHandler)
  window.addEventListener(
    'orientationchange',
    orientationHandler
  )

  document.addEventListener(
    'visibilitychange',
    visibilityHandler
  )

  /**
   * ===============================
   * GSAP HORIZONTAL SCROLL
   * ===============================
   */
  if (useHorizontalPin.value) {
    const track = trackRef.value
    const wrapper = wrapperRef.value

    if (track && wrapper && horizontalDistance.value > 0) {
      stCarousel = gsap.to(track, {
        x: () => -horizontalDistance.value,
        ease: 'none',

        scrollTrigger: {
          trigger: wrapper,

          start: 'top top',

          end: () => `+=${horizontalDistance.value}`,

          pin: stickyRef.value,

          scrub: 1,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            progress.value = self.progress

            if (self.progress > 0.04) {
              showHint.value = false
            }

            if (self.progress < 0.02) {
              showHint.value = true
            }

            ecgRef.value?.draw?.(self.progress)
          },

          onLeave: () => {
            showHint.value = false
          },

          onLeaveBack: () => {
            showHint.value = true
          }
        }
      })
    }
  }

  /**
   * ===============================
   * REVEAL DE TARJETAS
   * ===============================
   */
  stReveal = gsap.from('.card-servicio', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',

    scrollTrigger: {
      trigger: wrapperRef.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  /**
   * ===============================
   * DRAG
   * ===============================
   */
  trackRef.value?.addEventListener(
    'mousedown',
    startCardDrag
  )

  overflowRef.value?.addEventListener(
    'scroll',
    onOverflowScroll,
    { passive: true }
  )

  ScrollTrigger.refresh()
})

onUnmounted(() => {
  stCarousel?.scrollTrigger?.kill()
  stCarousel?.kill()

  stReveal?.scrollTrigger?.kill()
  stReveal?.kill()

  trackRef.value?.removeEventListener(
    'mousedown',
    startCardDrag
  )

  overflowRef.value?.removeEventListener(
    'scroll',
    onOverflowScroll
  )

  window.removeEventListener(
    'mousemove',
    dragMoveHandler
  )

  window.removeEventListener(
    'mouseup',
    dragEndHandler
  )

  window.removeEventListener(
    'resize',
    resizeHandler
  )

  window.removeEventListener(
    'orientationchange',
    orientationHandler
  )

  document.removeEventListener(
    'visibilitychange',
    visibilityHandler
  )
})
</script>

<template>
  <section
    ref="wrapperRef"
    class="carrusel-wrapper"
    :class="{ 'native-mode': !useHorizontalPin }"
  >
    <div
      ref="stickyRef"
      class="carrusel-sticky"
    >
      <UContainer>
        <!-- HEADER -->
        <div class="carrusel-header mt-5">
          <div>
            <h2 class="text-2xl!">
              Nuestros servicios
            </h2>
          </div>

          <!-- <ProgressBar
            ref="ecgRef"
            :progress="progress"
          /> -->
        </div>

        <!-- HINT -->
        <transition name="fade">
          <div
            v-if="showHint"
            class="scroll-hint"
          >
            <UIcon
              :name="useHorizontalPin ? 'i-lucide-mouse' : 'i-lucide-move-horizontal'"
              class="text-xl text-blue-600"
            />

            <span>
              {{
                useHorizontalPin
                  ? 'Scrollea o utiliza la barra para explorar'
                  : 'Desliza para explorar todos los servicios'
              }}
            </span>

            <UIcon
              name="i-lucide-arrow-right"
              class="text-xl text-blue-600 hint-arrow"
            />
          </div>
        </transition>

        <!-- TRACK -->
        <div
          ref="overflowRef"
          :class="{ 'carrusel-overflow': useHorizontalPin, 'native-scroll overflow-x-auto!': !useHorizontalPin }"
        >
          <div
            ref="trackRef"
            class="cards-track"
            :class="{ 'native-track': !useHorizontalPin, 'is-dragging': isDragging }"
          >
            <article
              v-for="(s, i) in servicios"
              :key="i"
              class="card-servicio"
              :class="`card--${i}`"
              :style="{
                '--card-color': s.color,
                '--card-acento': s.acento
              }"
            >
              <div class="card-imagen">
                <img
                  :src="s.imagen"
                  :alt="s.alt"
                  loading="lazy"
                  draggable="false"
                >

                <div class="card-imagen-overlay" />

                <span class="card-tag">
                  <UIcon
                    :name="s.icon"
                    class="mr-1.5"
                  />

                  -{{ s.tag }}
                </span>
              </div>

              <div class="card-cuerpo">
                <h3 class="card-titulo">
                  {{ s.titulo }}
                </h3>

                <p class="card-descripcion">
                  {{ s.descripcion }}
                </p>

                <button
                  type="button"
                  class="card-accion"
                  @click="solicitarServicio(s)"
                >
                  <span class="card-accion-texto">
                    Solicitar servicio
                  </span>

                  <UIcon
                    name="i-lucide-arrow-right"
                    class="card-accion-icono"
                  />
                </button>
              </div>
            </article>
          </div>
        </div>

        <!-- ========================= -->
        <!-- NAVEGACIÓN HORIZONTAL -->
        <!-- ========================= -->
        <div
          v-if="useHorizontalPin && horizontalDistance > 0"
          class="horizontal-navigation"
        >
          <button
            type="button"
            class="horizontal-navigation-button"
            aria-label="Ir al inicio"
            @click="progressToScroll(0)"
          >
            <UIcon name="i-lucide-chevron-left" />
          </button>

          <!-- <div ref="scrollbarRef" class="horizontal-scrollbar" role="scrollbar"
            aria-label="Navegación horizontal de servicios" :aria-valuenow="Math.round(progress * 100)"
            aria-valuemin="0" aria-valuemax="100" @mousedown="handleScrollbarClick">
            <div ref="scrollbarThumbRef" class="horizontal-scrollbar-thumb" :class="{ dragging: isDragging }" :style="{
              width: `${thumbWidth}%`,
              left: `${thumbLeft}%`
            }" @mousedown.stop="startScrollbarDrag">
              <span />
            </div>
          </div> -->

          <ProgressBar
            ref="ecgRef"
            :progress="progress"
          />

          <button
            type="button"
            class="horizontal-navigation-button"
            aria-label="Ir al final"
            @click="progressToScroll(1)"
          >
            <UIcon name="i-lucide-chevron-right" />
          </button>
        </div>

        <div
          v-else
        >
          <Transition name="fade">
            <div
              v-if="!useHorizontalPin"
              class="horizontal-navigation-info"
            >
              <span>
                Explora nuestros servicios
              </span>
            </div>
          </Transition>
        </div>

        <!-- INDICADOR -->
        <div
          v-if="useHorizontalPin"
          class="horizontal-navigation-info"
        >
          <span>
            {{ Math.round(progress * 100) }}%
          </span>

          <span>
            Explora nuestros servicios
          </span>
        </div>
      </UContainer>
    </div>
  </section>
</template>

<style scoped>
.carrusel-wrapper {
  position: relative;
  width: 100%;
}

.carrusel-sticky {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.carrusel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.carrusel-overflow {
  width: 100%;
  overflow: hidden;
}

.cards-track {
  display: flex;
  width: max-content;
  gap: 1.5rem;
  padding-right: clamp(1.5rem, 4vw, 3rem);

  will-change: transform;

  cursor: grab;
}

.cards-track.is-dragging {
  cursor: grabbing;
}

.card-servicio {
  flex: 0 0 clamp(320px, 32vw, 460px);
  overflow: hidden;

  border-radius: 1.5rem;

  background: white;

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.04);

  user-select: none;
}

.card-imagen {
  position: relative;
  height: 260px;
  overflow: hidden;
}

.card-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;

  pointer-events: none;

  transition:
    transform 0.6s ease;
}

.card-servicio:hover .card-imagen img {
  transform: scale(1.05);
}

.card-imagen-overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(to top,
      rgba(0, 0, 0, 0.45),
      transparent 55%);
}

.card-tag {
  position: absolute;
  left: 1rem;
  top: 1rem;

  display: inline-flex;
  align-items: center;

  padding: 0.5rem 0.75rem;

  border-radius: 999px;

  color: white;

  background: var(--card-color);

  font-size: 0.75rem;
  font-weight: 600;

  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-cuerpo {
  padding: 1.5rem;
}

.card-titulo {
  margin-bottom: 0.75rem;

  color: #111827;

  font-size: 1.35rem;
  font-weight: 700;
}

.card-descripcion {
  min-height: 72px;

  color: #6b7280;

  font-size: 0.95rem;
  line-height: 1.6;
}

.card-accion {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 1.5rem;

  width: 100%;

  padding: 0;

  background: none;
  border: none;

  color: var(--card-color);

  font-weight: 600;

  cursor: pointer;

  text-align: left;
}

.card-accion-icono {
  transition: transform 0.3s ease;
}

.card-servicio:hover .card-accion-icono {
  transform: translateX(5px);
}

/*
|--------------------------------------------------------------------------
| Barra horizontal
|--------------------------------------------------------------------------
*/

.horizontal-navigation {
  display: flex;
  align-items: center;

  gap: 0.75rem;

  width: 100%;

  margin-top: 2rem;
}

.horizontal-navigation-button {
  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  width: 38px;
  height: 38px;

  border: 1px solid rgba(0, 0, 0, 0.08);

  border-radius: 50%;

  background: white;

  color: #374151;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.horizontal-navigation-button:hover {
  transform: translateY(-1px);

  background: #f9fafb;

  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08);
}

.horizontal-scrollbar {
  position: relative;

  flex: 1;

  height: 8px;

  border-radius: 999px;

  background: #e5e7eb;

  cursor: pointer;
}

.horizontal-scrollbar-thumb {
  position: absolute;
  top: 0;

  height: 100%;

  min-width: 40px;

  border-radius: inherit;

  background: #2563eb;

  cursor: grab;

  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.horizontal-scrollbar-thumb:hover {
  background: #1d4ed8;
}

.horizontal-scrollbar-thumb.dragging {
  cursor: grabbing;

  transform: scaleY(1.5);
}

.horizontal-scrollbar-thumb span {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 32px;
  height: 3px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.7);

  transform: translate(-50%, -50%);
}

.horizontal-navigation-info {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.75rem;

  margin-top: 0.75rem;

  color: #9ca3af;

  font-size: 0.75rem;
}

.horizontal-navigation-info span:first-child {
  color: #2563eb;

  font-weight: 700;
}

/*
|--------------------------------------------------------------------------
| Hint
|--------------------------------------------------------------------------
*/

.scroll-hint {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.6rem;

  margin-bottom: 1rem;

  color: #6b7280;

  font-size: 0.85rem;
}

.hint-arrow {
  animation: arrowMove 1.2s ease-in-out infinite;
}

@keyframes arrowMove {

  0%,
  100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(5px);
  }
}

/*
|--------------------------------------------------------------------------
| Mobile
|--------------------------------------------------------------------------
*/

.native-scroll {
  overflow-x: auto !important;
  overflow-y: hidden !important;

  scroll-snap-type: x proximity;

  -webkit-overflow-scrolling: touch;

  touch-action: pan-x;
}

.native-track {
  cursor: grab;

  will-change: auto;
}

.native-track:active {
  cursor: grabbing;
}

.native-track .card-servicio {
  scroll-snap-align: center;
}

.native-mode .carrusel-sticky {
  height: auto;
  min-height: 100vh;
  overflow: visible;
}

.native-mode .carrusel-overflow {
  padding-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .carrusel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-servicio {
    flex-basis: min(82vw, 480px);
  }

  .card-imagen {
    height: 220px;
  }

  .native-scroll {
    width: min(100%, 480px);

    margin-inline: auto;
  }

  .horizontal-navigation {
    display: none;
  }

  .horizontal-navigation-info {
    display: none;
  }
}
</style>

<!-- <style scoped>
.carrusel-wrapper {
  width: 100%;
  position: relative;
  background: var(--bg-color);
}

.carrusel-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--bg-color);
  z-index: 10;
}

.carrusel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--light-blue);
  margin-bottom: 0.25rem;
}

.scroll-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--deep-blue);
  opacity: 0.75;
  margin-bottom: 1rem;
}

.hint-arrow {
  animation: hintNudge 1.4s ease-in-out infinite;
}

@keyframes hintNudge {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(6px); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.carrusel-overflow {
  overflow: hidden;
}

.carrusel-overflow.native-scroll {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}

.carrusel-overflow.native-scroll::-webkit-scrollbar {
  display: none;
}

.cards-track {
  display: flex;
  gap: 1.5rem;
  width: max-content;
  padding: 1rem;
  padding-top: 0;
  will-change: transform;
}

.cards-track.native-track {
  width: 100%;
  scroll-padding-left: 1rem;
}

.card-servicio {
  flex-shrink: 0;
  width: clamp(280px, 38vw, 540px);
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: var(--shadow-md);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), box-shadow 0.4s ease;
  display: flex;
  flex-direction: column;
  scroll-snap-align: start;
}

.cards-track:not(.native-track) .card-servicio {
  height: 62vh;
}

.cards-track.native-track .card-servicio {
  height: 480px;
}

.card-servicio:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.card-servicio:focus-visible {
  outline: 3px solid var(--light-blue);
  outline-offset: 3px;
}

.card-imagen {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.cards-track:not(.native-track) .card-imagen {
  aspect-ratio: auto;
  flex: 1 1 55%;
}

.card-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-servicio:hover .card-imagen img {
  transform: scale(1.06);
}

.card-imagen-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.45) 100%);
  pointer-events: none;
}

.card-tag {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.9rem;
  background: var(--card-color);
  color: #fff;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow: 0 6px 20px -4px var(--card-color);
}

.card-cuerpo {
  padding: 1.5rem 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}

.card-titulo {
  font-family: var(--font-secondary);
  font-weight: 700;
  font-size: clamp(1.15rem, 1.8vw, 1.4rem);
  color: var(--deep-blue);
  letter-spacing: -0.01em;
  margin: 0;
}

.card-descripcion {
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.55;
  margin: 0;
}

.card-accion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.9rem;
  border-top: 1px solid rgba(15, 23, 42, 0.07);
}

.card-accion-texto {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--card-color);
}

.card-accion-icono {
  color: var(--card-color);
  transition: transform 0.3s ease;
}

.card-servicio:hover .card-accion-icono {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .carrusel-sticky {
    position: relative;
    height: auto;
    padding: 4rem 0;
  }

  .carrusel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .card-servicio {
    width: 85vw;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-servicio,
  .card-imagen img,
  .card-accion-icono,
  .hint-arrow {
    transition: none;
    animation: none;
  }
}
</style> -->

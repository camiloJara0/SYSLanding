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
const nativeProgress = ref(0)
const isSliderDragging = ref(false)
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
    imagen: '/images/FOTO 1.jpeg',
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
    imagen: '/images/FOTO 3.jpeg',
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

    nextTick(() => {
      updateNativeProgress()
    })

    ScrollTrigger.refresh()
    return
  }

  calculateDimensions()

  nextTick(() => {
    ScrollTrigger.refresh()
  })
}

/**
 * En modo nativo, sincroniza la barra deslizadora con el scroll real.
 */
function updateNativeProgress() {
  const el = overflowRef.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  nativeProgress.value = max > 0 ? el.scrollLeft / max : 0
}

/**
 * En modo nativo oculta el hint al deslizar las tarjetas.
 */
function onOverflowScroll() {
  const el = overflowRef.value
  if (!el) return
  showHint.value = el.scrollLeft < 2
  updateNativeProgress()
}

/**
 * Drag de la barra deslizadora móvil.
 */
const sliderTrackEl = ref(null)

function onSliderDown(e) {
  if (!overflowRef.value) return
  isSliderDragging.value = true
  sliderTrackEl.value = e.currentTarget?.querySelector?.('.mobile-slider-track') || e.target?.closest?.('.mobile-slider-track')
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onSliderMove)
  document.addEventListener('mouseup', onSliderUp)
  document.addEventListener('touchmove', onSliderMove, { passive: false })
  document.addEventListener('touchend', onSliderUp)
}

function onSliderMove(e) {
  if (!isSliderDragging.value || !overflowRef.value || !sliderTrackEl.value) return
  const rect = sliderTrackEl.value.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const maxScroll = overflowRef.value.scrollWidth - overflowRef.value.clientWidth
  overflowRef.value.scrollLeft = ratio * maxScroll
}

function onSliderUp() {
  isSliderDragging.value = false
  sliderTrackEl.value = null
  document.body.style.userSelect = ''
  document.removeEventListener('mousemove', onSliderMove)
  document.removeEventListener('mouseup', onSliderUp)
  document.removeEventListener('touchmove', onSliderMove)
  document.removeEventListener('touchend', onSliderUp)
}

function onTrackClick(e) {
  if (!overflowRef.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  const maxScroll = overflowRef.value.scrollWidth - overflowRef.value.clientWidth
  overflowRef.value.scrollTo({ left: ratio * maxScroll, behavior: 'smooth' })
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

  document.removeEventListener('mousemove', onSliderMove)
  document.removeEventListener('mouseup', onSliderUp)
  document.removeEventListener('touchmove', onSliderMove)
  document.removeEventListener('touchend', onSliderUp)
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
          class="mobile-slider"
          @touchstart.passive="onSliderDown"
          @mousedown="onSliderDown"
        >
          <div
            class="mobile-slider-track"
            @click="onTrackClick"
          >
            <div
              class="mobile-slider-fill"
              :style="{ width: `${nativeProgress * 100}%` }"
            />
            <div
              class="mobile-slider-thumb"
              :class="{ 'is-dragging': isSliderDragging }"
              :style="{ left: `${nativeProgress * 100}%` }"
            />
          </div>
          <span class="mobile-slider-label">
            {{ Math.round(nativeProgress * 100) }}%
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

/*
|--------------------------------------------------------------------------
| Slider de progreso móvil
|--------------------------------------------------------------------------
*/

.mobile-slider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  touch-action: none;
}

.mobile-slider-track {
  position: relative;
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: #e5e7eb;
  cursor: pointer;
  overflow: hidden;
}

.mobile-slider-fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #0D9488, #2563EB, #C9A227);
  pointer-events: none;
  z-index: 1;
}

.mobile-slider-thumb {
  position: absolute;
  top: 50%;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563EB;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: box-shadow 0.15s ease;
  z-index: 2;
}

.mobile-slider-thumb.is-dragging {
  cursor: grabbing;
  box-shadow: 0 2px 14px rgba(37, 99, 235, 0.6);
}

.mobile-slider-label {
  flex: 0 0 auto;
  min-width: 2.5rem;
  color: #2563EB;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: right;
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

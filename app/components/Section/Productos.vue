<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const equipos = [
  {
    id: 1,
    titulo: 'Equipos médicos',
    descripcion: 'Venta y alquiler de equipos certificados para hospitales y hogares.',
    detalles: ['Tecnología certificada', 'Mantenimiento incluido', 'Soporte técnico 24/7'],
    tag: 'Equipos',
    imagen: '/images/products/equipos.jpeg',
    alt: 'Equipos médicos',
    icon: 'i-lucide-stethoscope',
    color: '#C9A227',
    acento: '#E8B923'
  },
  {
    id: 2,
    titulo: 'Insumos médicos',
    descripcion: 'Materiales y suministros esenciales para procedimientos clínicos.',
    detalles: ['Calidad farmacéutica', 'Trazabilidad completa', 'Entrega rápida'],
    tag: 'Insumos',
    imagen: '/images/products/insumos.jpeg',
    alt: 'Insumos médicos',
    icon: 'i-lucide-briefcase-medical',
    color: '#3B82F6',
    acento: '#60A5FA'
  },
  {
    id: 3,
    titulo: 'Medicamentos',
    descripcion: 'Medicamentos de uso general y especializado con garantía de calidad.',
    detalles: ['Registro sanitario vigente', 'Asesoría farmacéutica', 'Precios competitivos'],
    tag: 'Medicinas',
    imagen: '/images/products/medicamentos.jpeg',
    alt: 'Medicinas',
    icon: 'i-lucide-pill',
    color: '#1E3A8A',
    acento: '#2563EB'
  }
]

const activeCard = ref(0)
const scrollProgress = ref(0)

const { prefersReducedMotion, isLowEnd, isMobile } = useMotionQuality()

const { crearEnlace } = useWhatsApp()
function whatsappProducto(titulo) {
  return crearEnlace(`Hola, quiero información sobre ${titulo}.`)
}

/**
 * Diseño estático (sin baraja): se usa en prefers-reduced-motion o en
 * dispositivos táctiles/angostos. Arranca en `false` para que el SSR
 * renderice el diseño normal y se active en `onMounted` según el dispositivo.
 */
const staticLayout = ref(false)

let ctx = null

onMounted(() => {
  const widthMobile = window.matchMedia('(max-width: 768px)').matches
  const skipAnimation = prefersReducedMotion.value || isMobile.value || widthMobile
  staticLayout.value = (prefersReducedMotion.value || isMobile.value) && !widthMobile

  ctx = gsap.context(() => {
    const cards = gsap.utils.toArray('.card-equipo')
    if (!cards.length) return
    const imageWrappers = gsap.utils.toArray('.card-image-wrapper')
    const total = cards.length

    if (skipAnimation) {
      gsap.set(cards, { yPercent: 0, opacity: 1, rotateZ: 0 })
      gsap.set('.card-image-wrapper', { y: 0 })
      return
    }

    // Estados iniciales para evitar parpadeo (FOUC) y revertir de forma limpia
    gsap.set(cards, { yPercent: 100, opacity: 0, rotateZ: 5 })
    gsap.set('.card-image-wrapper', { y: -30 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.equipos-wrapper',
        start: 'top top',
        end: 'bottom bottom',
        scrub: isLowEnd.value ? 0.4 : 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollProgress.value = self.progress
          activeCard.value = Math.floor(self.progress * total)
        }
      }
    })

    cards.forEach((card, i) => {
      // Entrada de la tarjeta (desde abajo)
      tl.to(card,
        { yPercent: 0, opacity: 1, rotateZ: 0, duration: 0.8, ease: 'power2.out' },
        i
      )

      // Parallax en la imagen
      const img = imageWrappers[i]
      if (img) {
        tl.to(img, { y: 30, duration: 1, ease: 'none' }, i)
      }

      // Salida de la tarjeta (hacia arriba como baraja)
      tl.to(card,
        { yPercent: -100, opacity: 0, rotateZ: -3, duration: 0.6, ease: 'power2.in' },
        i + 0.8
      )

      // Elementos internos dentro del timeline (sincronizados con el scroll)
      const tag = card.querySelector('.card-tag')
      const titulo = card.querySelector('.card-titulo')
      const detalles = card.querySelectorAll('.detalle-item')

      gsap.set(tag, { opacity: 0, y: 20 })
      gsap.set(titulo, { opacity: 0, y: 20 })
      gsap.set(detalles, { opacity: 0, x: -20 })

      tl.to(tag, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out' }, i + 0.15)
      tl.to(titulo, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out' }, i + 0.25)
      detalles.forEach((detalle, idx) => {
        tl.to(detalle, { opacity: 1, x: 0, duration: 0.4, ease: 'back.out' }, i + 0.35 + (idx * 0.1))
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    class="equipos-wrapper"
    :class="{ 'layout-estatico': staticLayout }"
  >
    <div class="equipos-sticky md:py-30 py-20">
      <UContainer>
        <div class="section-header mb-12">
          <h2 class="equipos-titulo">
            Nuestros Productos
          </h2>
          <div
            class="titulo-accent"
            style="background: var(--ui-primary)"
          />
        </div>

        <div class="equipos-overflow">
          <div
            v-for="e in equipos"
            :key="e.id"
            class="card-equipo"
            :style="{ '--card-color': e.color, '--card-acento': e.acento }"
          >
            <!-- Fondo gradiente dinámico -->
            <div class="card-bg-gradient" />

            <!-- Contenedor izquierdo: Información -->
            <div class="card-content">
              <div class="content-top">
                <span class="card-tag">{{ e.tag }}</span>
                <div
                  class="icon-badge"
                  :style="{ backgroundColor: e.color }"
                >
                  <UIcon
                    :name="e.icon"
                    class="text-white"
                  />
                </div>
              </div>

              <h3 class="card-titulo">
                {{ e.titulo }}
              </h3>

              <p class="card-descripcion">
                {{ e.descripcion }}
              </p>

              <!-- Detalles dinámicos -->
              <div class="detalles-list">
                <div
                  v-for="(detalle, idx) in e.detalles"
                  :key="idx"
                  class="detalle-item"
                >
                  <div
                    class="detalle-dot"
                    :style="{ backgroundColor: e.acento }"
                  />
                  <span>{{ detalle }}</span>
                </div>
              </div>

              <!-- CTA Button -->
              <div class="card-cta">
                <a
                  :href="whatsappProducto(e.titulo)"
                  target="_blank"
                  rel="noopener"
                  class="btn-contactar"
                  :style="{ backgroundColor: e.color, borderColor: e.acento }"
                >
                  Contactar
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="ml-2"
                  />
                </a>
              </div>
            </div>

            <!-- Contenedor derecho: Imagen con parallax -->
            <div class="card-image-container">
              <div class="card-image-wrapper">
                <div
                  class="image-parallax-layer"
                  :style="{ backgroundImage: `url(${e.imagen})` }"
                />
                <div
                  class="image-overlay"
                  :style="{ background: `linear-gradient(135deg, ${e.color}40 0%, ${e.acento}20 100%)` }"
                />
              </div>

              <!-- Elementos decorativos -->
              <div
                class="decoration-circle md:flex hidden"
                :style="{ backgroundColor: e.color, opacity: 0.1 }"
              />
              <div
                class="decoration-line"
                :style="{ backgroundColor: e.acento }"
              />
            </div>
          </div>
        </div>
      </UContainer>
    </div>
  </section>
</template>

<style scoped>
.equipos-wrapper {
  height: 360vh;
  /* 3 tarjetas → 3 pantallas */
}

.equipos-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  /* background: linear-gradient(135deg, var(--bg-color) 0%, #FFFFFF 100%); */
  background: var(--bg-color);
  z-index: 1;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.equipos-titulo {
  font-family: var(--font-secondary);
  font-weight: 800;
  background-clip: text;
  letter-spacing: -0.5px;
}

.titulo-accent {
  width: 60px;
  height: 5px;
  border-radius: 3px;
  animation: slideIn 0.8s ease-out;
}

@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }

  to {
    width: 60px;
    opacity: 1;
  }
}

.equipos-overflow {
  width: 90%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-equipo {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 80%;
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 3rem;
  padding: 3rem 4rem;
  perspective: 1200px;
  max-height: 85vh;
}

/*
|--------------------------------------------------------------------------
| Diseño estático (reduced-motion / táctil en desktop/tablet)
|--------------------------------------------------------------------------
| Cada tarjeta ocupa 100vh en su propia posición, sin animación de baraja.
*/

.layout-estatico {
  height: auto;
}

.layout-estatico .equipos-sticky {
  position: relative;
  height: auto;
  overflow: visible;
}

.layout-estatico .equipos-overflow {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: stretch;
}

.layout-estatico .card-equipo {
  position: static;
  width: 100%;
  height: auto;
  min-height: 100vh;
  max-height: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 3rem;
  padding: 3rem 4rem;
  margin: 0;
}

.card-bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, var(--card-color, #C9A227)15, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

/* ===== CONTENIDO IZQUIERDO ===== */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  z-index: 2;
  position: relative;
  overflow: hidden;
}

.content-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.card-tag {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: var(--card-color, #C9A227);
  color: white;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 15px var(--card-color, #C9A227)40;
}

.icon-badge {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-color, #C9A227);
  box-shadow: 0 8px 25px var(--card-color, #C9A227)40;
}

.icon-badge :deep(i) {
  font-size: 1.8rem;
}

.card-titulo {
  font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  font-family: var(--font-secondary);
  font-weight: 800;
  color: var(--deep-blue);
  line-height: 1.1;
  letter-spacing: -0.3px;
  margin: 0.5rem 0;
}

.card-descripcion {
  font-size: 0.95rem;
  color: var(--deep-blue);
  line-height: 1.6;
  opacity: 0.8;
  margin: 0.5rem 0;
}

/* ===== DETALLES DINÁMICOS ===== */
.detalles-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin: 0.8rem 0;
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.detalle-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.detalle-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.detalle-item span {
  font-size: 0.85rem;
  color: var(--deep-blue);
  font-weight: 500;
}

/* ===== CTA BUTTON ===== */
.card-cta {
  margin-top: 1rem;
}

.btn-contactar {
  display: inline-flex;
  align-items: center;
  padding: 0.8rem 1.6rem;
  border: 2px solid;
  background: var(--card-color, #C9A227);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 50px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 25px var(--card-color, #C9A227)40;
  margin-top: 0.5rem;
}

.btn-contactar:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px var(--card-color, #C9A227)60;
  background: var(--card-acento, #E8B923);
}

.btn-contactar:active {
  transform: translateY(-1px);
}

/* ===== IMAGEN CON PARALLAX ===== */
.card-image-container {
  position: relative;
  height: 100%;
  perspective: 1200px;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  transform-origin: center;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.image-parallax-layer {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  mix-blend-mode: overlay;
  z-index: 2;
}

.decoration-circle {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  bottom: -50px;
  right: -50px;
  filter: blur(40px);
  z-index: 0;
}

.decoration-line {
  position: absolute;
  height: 3px;
  width: 150px;
  bottom: 40px;
  left: -80px;
  border-radius: 50px;
  opacity: 0.6;
  z-index: 0;
  filter: blur(2px);
}

/* ===== ANIMACIONES ===== */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .card-equipo {
    gap: 2rem;
    padding: 3rem 2rem;
    height: 50%;
  }

  .card-titulo {
    font-size: 2rem;
  }

  .detalles-list {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .card-titulo {
    font-size: 1.5rem;
  }

  .card-descripcion {
    font-size: 0.95rem;
  }

  .btn-contactar {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }

  .card-image-wrapper {
    min-height: 300px;
  }
}

/*
|--------------------------------------------------------------------------
| Móvil (<768px): va al final para ganar la cascada sobre los breakpoints
| mayores. Las tarjetas se apilan en columna y la foto siempre visible.
|--------------------------------------------------------------------------
*/
@media (max-width: 768px) {
  .equipos-wrapper {
    height: auto;
  }

  .equipos-sticky {
    position: relative;
    height: auto;
    overflow: visible;
  }

  .equipos-overflow {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: stretch;
  }

  .card-equipo {
    position: static;
    width: 100%;
    height: auto;
    max-height: none;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    margin: 0;
  }

  .card-image-container {
    order: -1;
    width: 100%;
    height: 200px;
  }

  .card-image-wrapper {
    height: 100%;
    min-height: 0;
  }

  .card-bg-gradient {
    display: none;
  }
}
</style>

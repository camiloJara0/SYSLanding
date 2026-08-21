<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, ref, computed } from 'vue'

gsap.registerPlugin(ScrollTrigger)
const { prefersReducedMotion } = useMotionQuality()

const sedes = [
  {
    ciudad: 'Cali',
    barrio: 'Tequendama',
    direccion: 'Calle 5B #40-50',
    telefono: '+57 300 234 5678',
    horario: 'Lun a Vie: 8:00 - 18:00',
    query: 'Calle 5B #40-50 Cali Colombia'
  },
  {
    ciudad: 'Barrancabermeja ',
    barrio: 'Galan',
    direccion: 'Carrera 19 AV # 58A',
    telefono: '+57 (300) 234 5678',
    horario: 'Lun a Vie: 8:00 - 18:00',
    query: 'Carrera 19 AV # 58A Barrancabermeja Colombia'
  },
  {
    ciudad: 'Valledupar',
    barrio: 'Ciudad',
    direccion: 'Proximamente',
    telefono: '+57 300 234 5678',
    horario: 'Proximamente',
    query: 'Valledupar Colombia'
  },
  {
    ciudad: 'Armenia',
    barrio: 'Ciudad',
    direccion: 'Proximamente',
    telefono: '+57 300 234 5678',
    horario: 'Proximamente',
    query: 'Armenia Colombia'
  }
]

const sedeSeleccionada = ref(sedes[0])

const mapaUrl = computed(() => {
  return `https://www.google.com/maps?q=${encodeURIComponent(sedeSeleccionada.value.query)}&z=15&t=m&hl=es&output=embed`
})

const direccionesUrl = computed(() => {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(sedeSeleccionada.value.query)}`
})

const { crearEnlace } = useWhatsApp()

const telefonoEnlace = computed(() => {
  return crearEnlace('Hola, quiero cotizar un producto')
})

onMounted(() => {
  if (prefersReducedMotion.value) return

  gsap.from('.ubicacion-header', {
    opacity: 0.5,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.ubicacion-section',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  })

  gsap.from('.ubicacion-mapa', {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.ubicacion-section',
      start: 'top 65%',
      toggleActions: 'play none none reverse'
    }
  })
})
</script>

<template>
  <section class="ubicacion-section py-32 bg-(--bg-color) relative z-1">
    <UContainer>
      <!-- Header Section -->
      <div class="ubicacion-header mb-20 text-center lg:text-left">
        <div class="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
          <p class="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Nuestras sedes
          </p>
        </div>
        <h2 class="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          Conoce nuestros puntos fisicos de
          <span class="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            atención
          </span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0">
          Nuestras sedes y puntos de atención nos permiten ofrecer una respuesta
          eficiente y oportuna en la distribución de medicamentos, insumos,
          equipos médicos y servicios de atención en salud.
        </p>
      </div>

      <div class="ubicacion-mapa">
        <!-- Selector de sedes -->
        <div
          class="sede-selector"
          aria-label="Selecciona una sede"
        >
          <button
            v-for="sede in sedes"
            :key="sede.ciudad"
            type="button"
            class="sede-card"
            :class="{ 'sede-card--activa': sede.ciudad === sedeSeleccionada.ciudad }"
            :aria-pressed="sede.ciudad === sedeSeleccionada.ciudad"
            @click="sedeSeleccionada = sede"
          >
            <span class="sede-icono">
              <UIcon
                name="i-lucide-map-pin"
                class="w-5 h-5"
              />
            </span>

            <span class="sede-info">
              <span class="sede-ciudad">
                {{ sede.ciudad }}
              </span>
              <span class="sede-ubicacion">
                {{ sede.direccion }}
              </span>
            </span>

            <span
              v-if="sede.ciudad === sedeSeleccionada.ciudad"
              class="sede-check"
              aria-hidden="true"
            >
              <UIcon
                name="i-lucide-check"
                class="w-3 h-3"
              />
            </span>
          </button>
        </div>

        <!-- Detalle + mapa -->
        <div class="sede-contenido">
          <div class="sede-detalles">
            <div
              :key="sedeSeleccionada.ciudad"
              class="sede-detalles-anim"
            >
              <div>
                <span class="sede-detalle-badge">
                  <UIcon
                    name="i-lucide-map"
                    class="w-3.5 h-3.5"
                  />
                  Sede seleccionada
                </span>
                <h3>
                  {{ sedeSeleccionada.ciudad }}
                </h3>
                <p class="sede-detalle-sub">
                  {{ sedeSeleccionada.barrio }}
                </p>
              </div>

              <div class="detalle-item">
                <UIcon
                  name="i-lucide-map-pin"
                  class="w-5 h-5 detalle-icono"
                />
                <div>
                  <p class="detalle-label">
                    Dirección
                  </p>
                  <p class="detalle-valor">
                    {{ sedeSeleccionada.direccion }}, {{ sedeSeleccionada.ciudad }}
                  </p>
                </div>
              </div>

              <div class="detalle-item">
                <UIcon
                  name="i-lucide-phone"
                  class="w-5 h-5 detalle-icono"
                />
                <div>
                  <p class="detalle-label">
                    Teléfono
                  </p>
                  <a
                    :href="telefonoEnlace"
                    target="_blank"
                    class="detalle-valor detalle-enlace"
                  >
                    {{ sedeSeleccionada.telefono }}
                  </a>
                </div>
              </div>

              <div class="detalle-item">
                <UIcon
                  name="i-lucide-clock"
                  class="w-5 h-5 detalle-icono"
                />
                <div>
                  <p class="detalle-label">
                    Horario
                  </p>
                  <p class="detalle-valor">
                    {{ sedeSeleccionada.horario }}
                  </p>
                </div>
              </div>

              <a
                :href="direccionesUrl"
                target="_blank"
                rel="noopener"
                class="btn-ubicacion"
              >
                <UIcon
                  name="i-lucide-navigation"
                  class="w-4 h-4"
                />
                Cómo llegar
              </a>
            </div>
          </div>

          <div class="sede-mapa">
            <Transition
              name="mapa-fade"
              mode="out-in"
            >
              <iframe
                :key="sedeSeleccionada.ciudad"
                :src="mapaUrl"
                class="mapa-iframe"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                :title="`Mapa de ubicación de SYS S.A.S. en ${sedeSeleccionada.ciudad}`"
              />
            </Transition>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.ubicacion-mapa {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.sede-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.75rem;
}

.sede-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.1rem;
    border-radius: 1rem;
    background: #fff;
    border: 1.5px solid rgba(15, 23, 42, 0.08);
    cursor: pointer;
    text-align: left;
    transition: border-color 0.25s ease, box-shadow 0.25s ease,
        transform 0.25s ease, background 0.25s ease;
}

.sede-card:hover {
    transform: translateY(-2px);
    border-color: rgba(29, 78, 216, 0.35);
    box-shadow: 0 12px 24px -12px rgba(29, 78, 216, 0.3);
}

.sede-card--activa {
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    border-color: #2563eb;
    box-shadow: 0 8px 20px -10px rgba(37, 99, 235, 0.4);
}

.sede-icono {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 0.75rem;
    background: #dbeafe;
    color: #2563eb;
    flex-shrink: 0;
    transition: background 0.25s ease, color 0.25s ease;
}

.sede-card--activa .sede-icono {
    background: #2563eb;
    color: #fff;
}

.sede-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.sede-ciudad {
    font-weight: 700;
    font-size: 1rem;
    color: #0f172a;
}

.sede-ubicacion {
    font-size: 0.8rem;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sede-check {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    background: #2563eb;
    color: #fff;
    animation: check-pop 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes check-pop {
    0% {
        transform: scale(0.4);
        opacity: 0;
    }
    70% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.sede-contenido {
    display: grid;
    grid-template-columns: minmax(0, 360px) 1fr;
    gap: 1.25rem;
}

.sede-detalles {
    background: linear-gradient(160deg, #1e3a8a, #1d4ed8);
    border-radius: 1.25rem;
    padding: 1.4rem;
}

.sede-detalles-anim {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    height: 100%;
    animation: detalle-enter 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes detalle-enter {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.sede-detalle-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #dbeafe;
    background: rgba(255, 255, 255, 0.12);
    padding: 0.3rem 0.7rem;
    border-radius: 9999px;
    margin-bottom: 0.5rem;
}

.sede-detalles h3 {
    font-size: 1.4rem;
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
}

.sede-detalle-sub {
    color: #bfdbfe;
    font-size: 0.9rem;
    margin: 0.15rem 0 0;
}

.detalle-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 0.85rem;
    border-radius: 0.9rem;
    background: rgba(255, 255, 255, 0.08);
}

.detalle-icono {
    color: #93c5fd;
    flex-shrink: 0;
    margin-top: 2px;
}

.detalle-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #93c5fd;
    font-weight: 600;
    margin: 0 0 0.1rem;
}

.detalle-valor {
    font-size: 0.92rem;
    font-weight: 600;
    color: #fff;
    line-height: 1.35;
    margin: 0;
}

.detalle-enlace {
    text-decoration: none;
    transition: opacity 0.2s ease;
}

.detalle-enlace:hover {
    opacity: 0.8;
    text-decoration: underline;
}

.btn-ubicacion {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8rem 1.1rem;
    border-radius: 0.85rem;
    background: #fff;
    color: #1d4ed8;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-ubicacion:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.35);
}

.sede-mapa {
    border-radius: 1.25rem;
    overflow: hidden;
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: var(--shadow-lg);
    min-height: 0;
}

.mapa-iframe {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 420px;
    border: 0;
}

.mapa-fade-enter-active,
.mapa-fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.mapa-fade-enter-from {
    opacity: 0;
    transform: scale(0.98);
}

.mapa-fade-leave-to {
    opacity: 0;
    transform: scale(1.02);
}

@media (max-width: 1024px) {
    .sede-contenido {
        grid-template-columns: 1fr;
    }

    .mapa-iframe {
        min-height: 360px;
    }
}

@media (max-width: 640px) {
    .mapa-iframe {
        min-height: 300px;
    }
}
</style>

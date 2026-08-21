<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const store = useCatalogoStore()
const { seleccionarCategoria } = store
const { categorias } = storeToRefs(store)
const router = useRouter()
const mobil = ref(false)
const items = ref([])
const itemsToggle = ref([])

/**
 * Navbar transparente mientras el hero oscuro ocupa el tope.
 * Al llegar a la sección de ambulancia recupera su fondo claro.
 */
const transparente = ref(true)
let scrollHandler = null

function actualizarEstadoScroll() {
  if (!import.meta.client) return

  const hero = document.querySelector('#section-header .hero-visual')
  if (!hero) {
    transparente.value = false
    return
  }

  transparente.value = window.scrollY < hero.offsetHeight
}

onMounted(() => {
  items.value = categorias.value.map(categoria => ({
    label: categoria,
    icon: 'i-lucide-list',
    onSelect: () => {
      seleccionarCategoria(categoria)
      router.push('/#section-catalogo')
      mobil.value = false
    }
  }))

  itemsToggle.value = [
    {
      label: 'Inicio',
      icon: 'i-lucide-home',
      onSelect: () => {
        router.push('/#section-header')
        mobil.value = false
      }
    },
    {
      label: 'Servicios',
      icon: 'i-lucide-ambulance',
      onSelect: () => {
        router.push('/#section-servicios')
        mobil.value = false
      }
    },
    {
      label: 'Catálogo',
      icon: 'i-lucide-list',
      onSelect: () => {
        router.push('/#section-catalogo')
        mobil.value = false
      },
      children: items.value
    },
    {
      label: 'Ubicación',
      icon: 'i-lucide-map-pin',
      onSelect: () => {
        router.push('/#section-ubicacion')
        mobil.value = false
      }
    }
  ]
})

function cerrarMenu() {
  mobil.value = false
}

function onKeydown(e) {
  if (e.key === 'Escape' && mobil.value) cerrarMenu()
}

watch(mobil, (val) => {
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

onMounted(() => window.addEventListener('keydown', onKeydown))

onMounted(() => {
  scrollHandler = () => actualizarEstadoScroll()
  window.addEventListener('scroll', scrollHandler, { passive: true })
  actualizarEstadoScroll()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', scrollHandler)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <nav
    class="navbar"
    :class="{ 'navbar--transparente': transparente }"
    role="navigation"
    aria-label="Navegación principal"
  >
    <UContainer class="navbar-inner">
      <!-- Logo -->
      <NuxtLink
        to="/#section-header"
        class="logo"
        aria-label="SYS S.A.S. inicio"
      >
        <span class="logo-text">
          <span class="text-amber-500">SYS</span>
          <span
            class="ml-1"
            :class="transparente ? 'text-white!' : 'text-slate-900'"
          >S.A.S.</span>
        </span>
        <img
          src="/images/sysLogo.png"
          alt="Logo SYS S.A.S."
          width="40"
          height="40"
          class="logo-img"
        >
      </NuxtLink>

      <!-- Navegación desktop -->
      <div class="nav-desktop">
        <UNavigationMenu :items="itemsToggle" :ui="{linkLabel: 'font-bold text-black', }"/>
      </div>

      <!-- Botón menú móvil -->
      <UButton
        v-if="!mobil"
        icon="i-lucide-menu"
        color="neutral"
        variant="ghost"
        class="nav-toggle"
        :class="transparente ? 'text-white!' : ''"
        aria-label="Abrir menú"
        @click="mobil = true"
      />
    </UContainer>
  </nav>

  <!-- Overlay + Panel móvil -->
  <teleport
    v-if="mobil"
    to="body"
  >
    <div
      class="mobile-overlay"
      @click="cerrarMenu"
    />
    <aside
      class="mobile-panel"
      role="dialog"
      aria-label="Menú de navegación móvil"
    >
      <div class="mobile-panel-header">
        <span class="logo-text">
          <span class="text-amber-500">SYS</span>
          <span class="text-slate-900 ml-1">S.A.S.</span>
        </span>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          aria-label="Cerrar menú"
          @click="cerrarMenu"
        />
      </div>
      <UNavigationMenu
        :items="itemsToggle"
        orientation="vertical"
        class="mobile-nav"
      />
    </aside>
  </teleport>
</template>

<style>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(228, 235, 243, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    backdrop-filter 0.3s ease;
}

.navbar--transparente {
  background: rgba(0,0,0,0.35);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

.navbar--transparente [data-slot='link'],
.navbar--transparente [data-slot='linkLabel'],
.navbar--transparente [data-slot='linkLeadingIcon'],
.navbar--transparente [data-slot='linkTrailingIcon'] {
  color: #fff;
}

.navbar--transparente [data-slot='link']:hover {
  color: var(--gold);
}

.navbar [data-slot='link'],
.navbar [data-slot='linkLabel'],
.navbar [data-slot='linkLeadingIcon'],
.navbar [data-slot='linkTrailingIcon'] {
  font-weight: bold;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.logo-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
}

.logo-img {
  display: block;
}

.nav-desktop {
  display: none;
}

@media (min-width: 769px) {
  .nav-desktop {
    display: flex;
    align-items: center;
  }
}

.nav-toggle {
  display: inline-flex;
}

@media (min-width: 769px) {
  .nav-toggle {
    display: none;
  }
}

/* Overlay */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  z-index: 200;
  animation: overlayIn 0.25s ease-out;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Panel móvil */
.mobile-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 85vw);
  background: #fff;
  z-index: 201;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: -12px 0 40px rgba(0, 0, 0, 0.15);
  animation: panelIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
}

@keyframes panelIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.mobile-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.mobile-nav {
  flex: 1;
}

@media (prefers-reduced-motion: reduce) {
  .mobile-overlay,
  .mobile-panel {
    animation: none;
  }
}
</style>

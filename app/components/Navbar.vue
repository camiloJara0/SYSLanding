<script setup>
import { ref } from 'vue';

const store = useCatalogoStore()
const { llamaDatos, borrarFiltros, ordenar, seleccionarCategoria } = store
const router = useRouter()
const mobil = ref(false)
const items = [
  {
    label: 'Equipos de Aspiración',
    value: 'all',
    onSelect: () => { 
      seleccionarCategoria('Equipos de Aspiración'); 
      router.push('/#section-catalogo')
    }
  },
  {
    label: 'Accesorios de Bomba',
    value: 'unread'
  }
]

const links = [
  { label: 'Inicio', to: '#section-header', icon: 'i-lucide-home' },
  { label: 'Servicio de Ambulancia', to: '#section-servicios', icon: 'i-lucide-ambulance' },
  { label: 'Equipos Médicos', to: '#section-productos', icon: 'i-lucide-stethoscope' }
]

const itemsToggle = [
  {
    label: 'Inicio',
    icon: 'i-lucide-home'
  },
  {
    label: 'Servicio de Ambulancia'
  },
  {
    label: 'Equipos Medicos'
  }
]
</script>

<template>
  <UContainer class="navbar backdrop-blur-xl bg-white/10">
    <UDashboardNavbar title="Inbox" class=" w-full px-6" :toggle="{ color: 'primary', }">
      <template #left>
        SYS S.A.S.
        <img src="/images/sys.png" alt="logo sys sas" width="60">
      </template>

      <template #right>
        <div class="md:flex hidden gap-2">
          <UButton to="/#section-header" color="secundary" variant="link">Inicio</UButton>
          <UButton to="/#section-servicios" color="secundary" variant="link">Servicio de Ambulancia</UButton>
          <UButton to="/#section-productos" color="secundary" variant="link">Equipos Medicos</UButton>
        </div>
        <!-- <UDropdownMenu :items="items">
          <UButton color="secondary" variant="ghost" size="md" icon="i-lucide-store"></UButton>
        </UDropdownMenu> -->
      </template>

      <template #toggle>
        <UButton v-if="!mobil" icon="i-lucide-menu" color="primary" variant="ghost" class="md:hidden" @click="mobil = !mobil" />
      </template>
    </UDashboardNavbar>

  </UContainer>

  <teleport v-if="mobil" to="body">

    <div  class="md:hidden fixed left-0 top-0 bottom-0 bg-gray-900 p-6">
      <UButton icon="i-lucide-x" color="primary" variant="ghost" class="mb-4" @click="mobil = !mobil" />
      <UNavigationMenu :items="itemsToggle" orientation="vertical" />
    </div>
  </teleport>
</template>

<style>
.navbar {
  grid-area: navbar;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
}
</style>
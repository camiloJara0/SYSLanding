<script setup>
const items = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Unread',
    value: 'unread'
  }
]

const links = [
  { label: 'Inicio', to: '#section-header', icon: 'i-lucide-home' },
  { label: 'Servicio de Ambulancia', to: '#section-servicios', icon: 'i-lucide-ambulance' },
  { label: 'Equipos Médicos', to: '#section-productos', icon: 'i-lucide-stethoscope' }
]
</script>

<template>
  <UContainer class="navbar backdrop-blur-xl bg-white/10">
    <UDashboardNavbar title="Inbox" class=" w-full px-10">
      <template #left>
        SYS S.A.S.
        <UIcon name="i-lucide-home" />
      </template>

      <template #right>
        <div class="md:flex hidden gap-2">
          <UButton to="/#section-header" color="neutral" variant="link">Inicio</UButton>
          <UButton to="/#section-servicios" color="neutral" variant="link">Servicio de Ambulancia</UButton>
          <UButton to="/#section-productos" color="neutral" variant="link">Equipos Medicos</UButton>
        </div>
        <UDropdownMenu :items="items"  >
          <UButton color="neutral" variant="ghost" size="md" icon="i-lucide-bell"></UButton>
        </UDropdownMenu>
      </template>
    </UDashboardNavbar>

  </UContainer>
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
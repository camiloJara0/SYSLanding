<script setup>
import { ref } from 'vue';

const store = useCatalogoStore()
const { llamaDatos, borrarFiltros, ordenar, seleccionarCategoria } = store
const { productos, categorias, productosFiltrados, loading, error, busqueda, categoriaSeleccionada, orden, productoSeleccionado } = storeToRefs(store)
const router = useRouter()
const mobil = ref(false)
const items = ref([])
const itemsToggle = ref([])

onMounted(() => {
  items.value = categorias.value.map((categoria) => {
    return {
      label: categoria,
      icon: 'i-lucide-list',
      onSelect: () => {
        seleccionarCategoria(categoria);
        router.push('/#section-catalogo')
      }
    }
  })

  itemsToggle.value = [
    {
      label: 'Inicio',
      icon: 'i-lucide-home',
      onSelect: () => {
        router.push('/#section-header')
      }
    },
    {
      label: 'Nuestros Servicios',
      icon: 'i-lucide-ambulance',
      onSelect: () => {
        router.push('/#section-servicios')
      }
    },
    // {
    //   label: 'Productos',
    //   icon: 'i-lucide-stethoscope',
    //   onSelect: () => {
    //     router.push('/#section-productos')
    //   }
    // },
    {
      label: 'Catalogo',
      icon: 'i-lucide-list',
      onSelect: () => {
        router.push('/#section-catalogo')
      },
      children: items.value
    }
  ]
})

const links = [
  { label: 'Inicio', to: '#section-header', icon: 'i-lucide-home' },
  { label: 'Servicio de Ambulancia', to: '#section-servicios', icon: 'i-lucide-ambulance' },
  { label: 'Equipos Médicos', to: '#section-productos', icon: 'i-lucide-stethoscope' }
]
</script>

<template>
  <UContainer class="navbar backdrop-blur-xl bg-white/10 w-full">
    <UDashboardNavbar title="Inbox" class=" w-full px-6" :toggle="{ color: 'primary', }">
      <template #left>
            <p class="text-lg font-bold mb-2 flex items-center">
              <span class="bg-linear-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">SYS</span>
              <span class="text-black">S.A.S.</span>
              <img src="/images/sysLogo.png" alt="Logo SyS S.A.S" width="40">
            </p>
      </template>

      <template #right>
        <div class="md:flex hidden gap-2">
          <UNavigationMenu :items="itemsToggle" />
        </div>
      </template>

      <template #toggle>
        <UButton v-if="!mobil" icon="i-lucide-menu" color="primary" variant="ghost" class="md:hidden"
          @click="mobil = !mobil" />
      </template>
    </UDashboardNavbar>

  </UContainer>

  <teleport v-if="mobil" to="body">

    <div class="md:hidden fixed left-0 top-0 bottom-0 bg-gray-900 p-6">
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
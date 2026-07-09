<script setup>
const year = new Date().getFullYear()

const enlaces = [
  {
    titulo: 'Empresa',
    links: [
      { label: 'Sobre nosotros', href: '#' },
      { label: 'Misión & Visión', href: '#' },
      { label: 'Equipo', href: '#' },
      { label: 'Carreras', href: '#' }
    ]
  },
  {
    titulo: 'Productos',
    links: [
      { label: 'Equipos médicos', href: '#' },
      { label: 'Insumos', href: '#' },
      { label: 'Medicinas', href: '#' },
      { label: 'Catálogo', href: '#' }
    ]
  },
  {
    titulo: 'Legal',
    links: [
      { label: 'Términos de servicio', href: '#' },
      { label: 'Política de privacidad', href: '#' },
      { label: 'Política de cookies', href: '#' },
      { label: 'Contacto', href: '#' }
    ]
  }
]

const redes = [
  { icon: 'i-lucide-facebook', label: 'Facebook', href: '#' },
  { icon: 'i-lucide-x', label: 'Twitter', href: '#' },
  { icon: 'i-lucide-instagram', label: 'Instagram', href: '#' }
]

const contacto = [
  { icon: 'i-lucide-map-pin', label: 'Cra. 15 #123-45, Bogotá, Colombia', tipo: 'direccion' },
  { icon: 'i-lucide-phone', label: '+57 (1) 234 5678', tipo: 'telefono' },
  { icon: 'i-lucide-mail', label: 'info@sys-medical.com', tipo: 'email' }
]
</script>

<template>
  <footer class="bg-linear-to-b from-gray-900 to-gray-950 text-white pt-20 relative z-1">
    <!-- Main Footer Content -->
    <UContainer class="pt-16 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        
        <!-- Logo & Company Info -->
        <div class="lg:col-span-2">
          <div class="mb-6">
            <h3 class="text-2xl font-bold mb-2 flex items-center">
              <span class="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">SYS</span>
              <span class="text-white">S.A.S.</span>
              <img src="/images/sys.png" alt="Logo SyS S.A.S" width="120">
            </h3>
            <p class="text-gray-400 text-sm">Soluciones médicas de calidad garantizada</p>
          </div>

          <p class="text-gray-400 text-sm leading-relaxed mb-6">
            Más de 10 años proporcionando equipos médicos, insumos y medicinas de alta calidad a hospitales y centros de salud en toda Colombia.
          </p>

          <!-- Social Links -->
          <div class="flex gap-3">
            <a 
              v-for="red in redes" 
              :key="red.label"
              :href="red.href"
              :title="red.label"
              class="w-10 h-10 rounded-lg bg-gray-800 hover:bg-amber-500 flex items-center justify-center transition-colors duration-300 group"
            >
              <UIcon :name="red.icon" class="w-5 h-5 text-gray-300 group-hover:text-white"></UIcon>
            </a>
          </div>
        </div>

        <!-- Quick Links Section 1 -->
        <div v-for="seccion in enlaces" :key="seccion.titulo">
          <h4 class="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
            {{ seccion.titulo }}
          </h4>
          <ul class="space-y-3">
            <li v-for="link in seccion.links" :key="link.label">
              <a 
                :href="link.href"
                class="text-gray-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
              >
                <span class="w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Contact Section -->
      <!-- <div class="bg-linear-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-8 mb-12">
        <h4 class="font-semibold text-white mb-6 text-lg flex items-center gap-2">
          <UIcon name="i-lucide-headphones" class="w-5 h-5 text-blue-400"></UIcon>
          Información de Contacto
        </h4>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a 
            v-for="item in contacto" 
            :key="item.label"
            :href="item.tipo === 'email' ? `mailto:${item.label}` : item.tipo === 'telefono' ? `tel:${item.label.replace(/\\s/g, '')}` : '#'"
            class="flex gap-3 hover:translate-x-1 transition-transform duration-200 group"
          >
            <div class="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/30 transition-colors">
              <UIcon :name="item.icon" class="w-5 h-5 text-blue-400 group-hover:text-amber-400"></UIcon>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-gray-500 uppercase tracking-wider">
                {{ item.tipo === 'direccion' ? 'Dirección' : item.tipo === 'telefono' ? 'Teléfono' : 'Email' }}
              </span>
              <span class="text-sm text-gray-300 group-hover:text-white transition-colors">
                {{ item.label }}
              </span>
            </div>
          </a>
        </div>
      </div> -->

    </UContainer>

    <!-- Bottom Footer -->
    <div class="border-t border-gray-800 bg-gray-950/50 backdrop-blur">
      <UContainer class="py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-gray-500">
          &copy; {{ year }} <span class="font-semibold text-white">SYS S.A.S.</span> Todos los derechos reservados.
        </p>
        
        <div class="flex gap-6">
          <a href="#" class="text-xs text-gray-500 hover:text-amber-400 transition-colors">
            Política de privacidad
          </a>
        </div>
      </UContainer>
    </div>
  </footer>
</template>

<style scoped>
/* Transiciones suaves */
a {
  transition: all 0.3s ease;
}

/* Efecto linear animado en hover */
@media (prefers-reduced-motion: no-preference) {
  .text-transparent {
    background-size: 200% 200%;
  }
}
</style>
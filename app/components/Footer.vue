<script setup>
const year = new Date().getFullYear()

const enlaces = [
  {
    titulo: 'Empresa',
    links: [
      { label: 'Sobre nosotros', to: '/#section-sobre-nosotros' },
      { label: 'Servicios', to: '/#section-servicios' },
      { label: 'Ubicación', to: '/#section-ubicacion' },
      { label: 'Catálogo', to: '/#section-catalogo' }
    ]
  },
  {
    titulo: 'Productos',
    links: [
      { label: 'Equipos médicos', to: '/#section-productos' },
      { label: 'Insumos', to: '/#section-catalogo' },
      { label: 'Medicamentos', to: '/#section-catalogo' },
      { label: 'Ver catálogo', to: '/#section-catalogo' }
    ]
  },
  {
    titulo: 'Legal',
    links: [
      { label: 'Términos de servicio', to: '#' },
      { label: 'Política de privacidad', to: '#' },
      { label: 'Política de cookies', to: '#' }
    ]
  }
]

const redes = [
  { icon: 'i-lucide-facebook', label: 'Facebook', href: '#' },
  { icon: 'i-lucide-instagram', label: 'Instagram', href: '#' },
  { icon: 'i-lucide-linkedin', label: 'LinkedIn', href: '#' }
]
</script>

<template>
  <footer class="footer">
    <UContainer class="footer-main">
      <div class="footer-grid">
        <!-- Logo & Company Info -->
        <div class="footer-brand">
          <div class="mb-6">
            <h3 class="footer-logo">
              <span class="text-amber-400">SYS</span>
              <span class="text-white ml-1.5">S.A.S.</span>
              <img
                src="/images/sys.png"
                alt="Logo SYS S.A.S."
                width="120"
                height="40"
                class="footer-logo-img"
              >
            </h3>
            <p class="footer-tagline">
              Soluciones médicas de calidad garantizada
            </p>
          </div>

          <p class="footer-desc">
            Nuestro propósito es simple: poner soluciones confiables al servicio de quienes cuidan la vida.
          </p>

          <!-- Social Links -->
          <div class="footer-social">
            <a
              v-for="red in redes"
              :key="red.label"
              :href="red.href"
              :title="red.label"
              :aria-label="red.label"
              class="footer-social-link"
            >
              <UIcon
                :name="red.icon"
                class="w-5 h-5"
              />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div
          v-for="seccion in enlaces"
          :key="seccion.titulo"
          class="footer-links-col"
        >
          <h4 class="footer-links-title">
            {{ seccion.titulo }}
          </h4>
          <ul class="footer-links-list">
            <li
              v-for="link in seccion.links"
              :key="link.label"
            >
              <NuxtLink
                :to="link.to"
                class="footer-link"
              >
                <span class="footer-link-dot" />
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Contact Section -->
      <!-- <div class="footer-contact">
        <h4 class="footer-contact-title">
          <UIcon
            name="i-lucide-headphones"
            class="w-5 h-5 text-blue-400"
          />
          Información de contacto
        </h4>

        <div class="footer-contact-grid">
          <a
            v-for="item in contacto"
            :key="item.label"
            :href="item.tipo === 'email' ? `mailto:${item.label}` : item.tipo === 'telefono' ? `tel:${item.label.replace(/\s/g, '')}` : '#'"
            class="footer-contact-item"
          >
            <div class="footer-contact-icon">
              <UIcon
                :name="item.icon"
                class="w-5 h-5"
              />
            </div>
            <div class="footer-contact-text">
              <span class="footer-contact-label">
                {{ item.tipo === 'direccion' ? 'Dirección' : item.tipo === 'telefono' ? 'Teléfono' : 'Email' }}
              </span>
              <span class="footer-contact-value">{{ item.label }}</span>
            </div>
          </a>
        </div>
      </div> -->
    </UContainer>

    <!-- Bottom Footer -->
    <div class="footer-bottom">
      <UContainer class="footer-bottom-inner">
        <p class="footer-copyright">
          &copy; {{ year }} <span class="font-semibold text-white">SYS S.A.S.</span> Todos los derechos reservados.
        </p>

        <div class="footer-bottom-links">
          <NuxtLink
            to="#"
            class="footer-bottom-link"
          >Política de privacidad</NuxtLink>
          <NuxtLink
            to="#"
            class="footer-bottom-link"
          >Términos de servicio</NuxtLink>
        </div>
      </UContainer>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(to bottom, #0f172a, #020617);
  color: #fff;
  padding-top: 5rem;
  position: relative;
  z-index: 1;
}

.footer-main {
  padding-top: 4rem;
  padding-bottom: 3rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
}

.footer-brand {
  grid-column: 1 / -1;
}

@media (min-width: 1024px) {
  .footer-brand {
    grid-column: auto;
  }
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-logo-img {
  display: block;
}

.footer-tagline {
  color: #94a3b8;
  font-size: 0.875rem;
}

.footer-desc {
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 32rem;
}

.footer-social {
  display: flex;
  gap: 0.75rem;
}

.footer-social-link {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
}

.footer-social-link:hover {
  background: var(--gold);
  color: #fff;
  transform: translateY(-2px);
}

.footer-links-title {
  font-weight: 600;
  color: #fff;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  color: #94a3b8;
  font-size: 0.875rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--gold);
}

.footer-link-dot {
  width: 0.25rem;
  height: 0.25rem;
  background: var(--gold);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.footer-link:hover .footer-link-dot {
  opacity: 1;
}

.footer-contact {
  background: linear-gradient(to right, rgba(37, 99, 235, 0.1), rgba(79, 70, 229, 0.1));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 3rem;
}

.footer-contact-title {
  font-weight: 600;
  color: #fff;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .footer-contact-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.footer-contact-item {
  display: flex;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.footer-contact-item:hover {
  transform: translateX(4px);
}

.footer-contact-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: rgba(37, 99, 235, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #60a5fa;
  transition: background 0.2s ease, color 0.2s ease;
}

.footer-contact-item:hover .footer-contact-icon {
  background: rgba(201, 162, 39, 0.3);
  color: var(--gold);
}

.footer-contact-text {
  display: flex;
  flex-direction: column;
}

.footer-contact-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-contact-value {
  font-size: 0.875rem;
  color: #cbd5e1;
}

.footer-bottom {
  border-top: 1px solid #1e293b;
  background: rgba(2, 6, 23, 0.5);
  backdrop-filter: blur(8px);
}

.footer-bottom-inner {
  padding-top: 2rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

@media (min-width: 768px) {
  .footer-bottom-inner {
    flex-direction: row;
  }
}

.footer-copyright {
  font-size: 0.875rem;
  color: #64748b;
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
}

.footer-bottom-link {
  font-size: 0.75rem;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-bottom-link:hover {
  color: var(--gold);
}

a {
  transition: all 0.3s ease;
}

@media (prefers-reduced-motion: no-preference) {
  .text-transparent {
    background-size: 200% 200%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-social-link,
  .footer-contact-item,
  a {
    transition: none;
  }
}
</style>

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],
  ssr: false,
  devtools: {
    enabled: true
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1E3A8A' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', href: '/sysLogo.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },

  runtimeConfig: {
    public: {
      emailjs: {
        serviceId: process.env.EMAILJS_SERVICE_ID || '',
        templateId: process.env.EMAILJS_TEMPLATE_ID || '',
        publicKey: process.env.EMAILJS_PUBLIC_KEY || ''
      },
      whatsapp: {
        number: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '',
        message: process.env.NUXT_PUBLIC_WHATSAPP_MESSAGE || ''
      }
    }
  },

  /**
   * El prerender de rutas se aplica solo en build de producción.
   * En dev (`routeRules` vacío) se evita la colisión del caché de payload
   * de Nuxt: `/` genera el archivo `.nuxt/cache/nuxt/payload` y `/Producto`
   * intenta escribir `.nuxt/cache/nuxt/payload/Producto` (ENOENT → 500).
   */
  routeRules: process.env.NODE_ENV === 'production'
    ? {
        '/': { prerender: true },
        '/Producto': { prerender: true }
      }
    : {},

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})

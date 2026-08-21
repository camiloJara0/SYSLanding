<script setup>
useHead({
  titleTemplate: title => (title && !title.includes('SYS') ? `${title} | SYS S.A.S.` : title || 'SYS S.A.S. | Equipos Médicos y Servicio de Ambulancias'),
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/sysLogo.ico' }
  ],
  htmlAttrs: {
    lang: 'es',
    class: 'light'
  }
})

const carrito = useCarritoStore()

onMounted(() => carrito.init())

const title = 'SYS S.A.S. | Equipos Médicos y Servicio de Ambulancias'
const description = 'SYS S.A.S. ofrece servicio de ambulancias certificadas, atención de emergencias 24/7, UCI móvil y venta y alquiler de equipos e insumos médicos certificados para hospitales y hogares en toda Colombia.'
const siteUrl = 'https://sys-medical.com'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/images/sys.png',
  ogType: 'website',
  ogUrl: siteUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: '/images/sys.png',
  robots: 'index, follow',
  author: 'SYS S.A.S.',
  keywords: 'ambulancias, equipos médicos, insumos médicos, UCI móvil, emergencias, traslado asistido, hospitales, Colombia, venta equipos médicos, alquiler equipos médicos'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'MedicalBusiness',
        'name': 'SYS S.A.S.',
        description,
        'url': siteUrl,
        'logo': `${siteUrl}/images/sys.png`,
        'image': `${siteUrl}/images/sys.png`,
        'telephone': '+57 (1) 234 5678',
        'email': 'info@sys-medical.com',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Cra. 15 #123-45',
          'addressLocality': 'Bogotá',
          'addressRegion': 'Cundinamarca',
          'addressCountry': 'CO'
        },
        'areaServed': 'Colombia',
        'openingHours': 'Mo-Su 00:00-24:00',
        'sameAs': []
      })
    }
  ]
})
</script>

<template>
  <UApp>
    <NuxtPage />
    <CarritoWidget />
    <CotizacionModal />
  </UApp>
</template>

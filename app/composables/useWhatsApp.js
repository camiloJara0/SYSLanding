export function useWhatsApp() {
  const config = useRuntimeConfig()

  const numero = config.public.whatsapp?.number || ''
  const mensajeDefault = config.public.whatsapp?.message || 'Hola, quiero información sobre sus servicios y cotizaciones.'

  function crearEnlace(mensaje = mensajeDefault) {
    const numeroLimpio = String(numero).replace(/\D/g, '')
    return `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`
  }

  return { numero, mensajeDefault, crearEnlace }
}

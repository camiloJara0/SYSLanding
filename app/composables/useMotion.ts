export const useMotionQuality = () => {
  const prefersReducedMotion = computed(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  const isMobile = computed(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(pointer: coarse)').matches
  })

  const isLowEnd = computed(() => {
    if (typeof navigator === 'undefined') return false
    const nav = navigator as Navigator & { deviceMemory?: number }
    const cores = navigator.hardwareConcurrency || 8
    const memory = nav.deviceMemory || 8
    return cores <= 4 || memory <= 4
  })

  return { prefersReducedMotion, isMobile, isLowEnd }
}

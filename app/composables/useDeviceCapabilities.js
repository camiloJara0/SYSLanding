import { computed } from 'vue'

const tierCache = { value: null }

function detectTier() {
  if (typeof window === 'undefined') return 'high'
  if (tierCache.value) return tierCache.value

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const narrow = window.matchMedia('(max-width: 768px)').matches

  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory || 4
  const conn = navigator.connection?.effectiveType || '4g'
  const saveData = navigator.connection?.saveData || false

  let score = 0
  if (cores <= 4) score += 1
  if (cores <= 2) score += 2
  if (mem <= 4) score += 1
  if (mem <= 2) score += 2
  if (conn === '3g' || conn === '2g' || conn === 'slow-2g') score += 3
  if (saveData) score += 2
  if (narrow) score += 1

  let tier = 'high'
  if (reduceMotion) tier = 'low'
  else if (score >= 5) tier = 'low'
  else if (score >= 3) tier = 'mid'

  tierCache.value = tier
  return tier
}

export function useDeviceCapabilities() {
  if (import.meta.client && !tierCache.value) {
    tierCache.value = detectTier()
  }

  const tier = computed(() => (import.meta.client ? detectTier() : 'high'))
  const isLowEnd = computed(() => tier.value === 'low')
  const isMidEnd = computed(() => tier.value === 'mid')
  const prefersReducedMotion = computed(() =>
    import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const isMobile = computed(() => import.meta.client && window.matchMedia('(max-width: 768px)').matches)
  const isTouch = computed(() => import.meta.client && (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches))
  const supportsHeavyAnimations = computed(() => tier.value === 'high' && !prefersReducedMotion.value)

  return {
    tier,
    isLowEnd,
    isMidEnd,
    prefersReducedMotion,
    isMobile,
    isTouch,
    supportsHeavyAnimations
  }
}

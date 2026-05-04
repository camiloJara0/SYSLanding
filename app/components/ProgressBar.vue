<template>
  <div class="ecg-wrapper">
    <canvas ref="ecgCanvas" class="ecg-canvas" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const ecgCanvas = ref(null)
let ctx = null

// Puntos normalizados del latido (x,y entre 0 y 1)
const ECG_PATH = [
  [0, 0.5], [0.06, 0.5], [0.08, 0.45], [0.1, 0.5],
  [0.12, 0.5], [0.14, 0.1], [0.16, 0.95], [0.18, 0.5],
  [0.2, 0.4], [0.22, 0.28], [0.24, 0.35], [0.26, 0.5],
  [0.36, 0.5], [0.38, 0.44], [0.4, 0.5],
  [0.5, 0.5], [0.56, 0.5], [0.58, 0.45], [0.6, 0.5],
  [0.62, 0.5], [0.64, 0.1], [0.66, 0.95], [0.68, 0.5],
  [0.7, 0.4], [0.72, 0.28], [0.74, 0.35], [0.76, 0.5],
  [0.86, 0.5], [0.88, 0.44], [0.9, 0.5], [1, 0.5]
]

// Props: pasar el progreso (0–1) desde el ScrollTrigger
const props = defineProps({ progress: { type: Number, default: 0 } })

function resize() {
  const c = ecgCanvas.value
  if (!c) return
  c.width = c.offsetWidth
  c.height = 48
}

function draw(prog) {
  const c = ecgCanvas.value
  if (!c || !ctx) return
  const W = c.width, H = c.height
  const cutoff = prog  // valor entre 0 y 1

  ctx.clearRect(0, 0, W, H)

  const pts = ECG_PATH.map(([x, y]) => [x * W, y * H])

  // Traza apagada (fondo)
  ctx.beginPath()
  pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
  ctx.strokeStyle = 'rgba(0, 229, 160, 0.15)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Traza iluminada hasta el punto de progreso
  const litPts = pts.filter(([x]) => x / W <= cutoff)
  if (litPts.length > 1) {
    ctx.beginPath()
    litPts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
    ctx.strokeStyle = '#3B82F6'
    ctx.lineWidth = 2.5
    ctx.stroke()

    // Punto luminoso en el frente
    const [lx, ly] = litPts[litPts.length - 1]
    ctx.beginPath()
    ctx.arc(lx, ly, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#3B82F6'
    ctx.fill()
  }
}

// Exponer para que el padre llame draw()
defineExpose({ draw })

onMounted(() => {
  ctx = ecgCanvas.value.getContext('2d')
  resize()
  draw(0)
  window.addEventListener('resize', () => { resize(); draw(props.progress) })
})

onUnmounted(() => window.removeEventListener('resize', resize))
</script>

<style scoped>
.ecg-wrapper {
  width: 100%;
  height: 48px;
  margin-top: 1.5rem;
}
.ecg-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
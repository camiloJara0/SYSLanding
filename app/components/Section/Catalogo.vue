<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const equipos = [
    {
        tag: 'Soporte vital', nombre: 'Monitor de signos vitales',
        desc: 'Pantalla táctil 12". ECG, SpO2, NIBP, temperatura y capnografía en tiempo real.',
        cert: 'ISO 13485 · CE', cat: 'soporte',
        svg: ` <svg class="eq-svg" width="110" height="100" viewBox="0 0 110 100">
        <rect class="piece" id="p0-0" x="10" y="20" width="90" height="60" rx="8" fill="none" stroke="#4fc3f7" stroke-width="1" style="transform-origin:55px 50px"/>
        <rect class="piece" id="p0-1" x="22" y="32" width="30" height="36" rx="4" fill="rgba(79,195,247,0.08)" stroke="#4fc3f7" stroke-width="0.5"/>
        <line class="piece" id="p0-2" x1="60" y1="40" x2="90" y2="40" stroke="#4fc3f7" stroke-width="0.5"/>
        <line class="piece" id="p0-3" x1="60" y1="50" x2="90" y2="50" stroke="#4fc3f7" stroke-width="0.5"/>
        <line class="piece" id="p0-4" x1="60" y1="60" x2="80" y2="60" stroke="#4fc3f7" stroke-width="0.5"/>
        <circle class="piece" id="p0-5" cx="55" cy="10" r="5" fill="none" stroke="#00e5ff" stroke-width="1"/>
        <line class="piece" id="p0-6" x1="55" y1="15" x2="55" y2="20" stroke="#00e5ff" stroke-width="1"/>
        <rect class="piece pulse-ring" id="p0-ring" cx="55" cy="50" x="25" y="20" width="60" height="60" rx="50%" style="animation-delay:0s"/>
        <text x="37" y="54" font-size="9" fill="#4fc3f7" font-family="Rajdhani,sans-serif" font-weight="600" class="piece" id="p0-7">MONITOR</text>
      </svg>`
    },
    {
        tag: 'Soporte vital', nombre: 'Desfibrilador bifásico',
        desc: '200J energía máxima. DEA automático con guía de voz. Batería 6h de operación.',
        cert: 'FDA · INVIMA', cat: 'soporte',
        svg: ` <svg class="eq-svg" width="110" height="100" viewBox="0 0 110 100">
        <ellipse class="piece" id="p1-0" cx="55" cy="55" rx="38" ry="28" fill="none" stroke="#4fc3f7" stroke-width="1"/>
        <ellipse class="piece" id="p1-1" cx="55" cy="55" rx="28" ry="20" fill="rgba(79,195,247,0.06)" stroke="#4fc3f7" stroke-width="0.5"/>
        <path class="piece" id="p1-2" d="M20 55 Q35 30 55 55 Q75 80 90 55" fill="none" stroke="#00e5ff" stroke-width="1.5"/>
        <rect class="piece" id="p1-3" x="42" y="15" width="26" height="14" rx="4" fill="rgba(79,195,247,0.1)" stroke="#4fc3f7" stroke-width="0.5"/>
        <line class="piece" id="p1-4" x1="55" y1="29" x2="55" y2="43" stroke="#4fc3f7" stroke-width="0.5" stroke-dasharray="2,2"/>
        <circle class="piece" id="p1-5" cx="55" cy="55" r="5" fill="rgba(0,229,255,0.3)" stroke="#00e5ff" stroke-width="1"/>
        <text x="44" y="20" font-size="7" fill="#4fc3f7" font-family="Rajdhani,sans-serif" font-weight="600" class="piece" id="p1-6">DEFIB</text>
        </svg>`
    },
    {
        tag: 'Diagnóstico', nombre: 'Tablet clínica',
        desc: 'IP65, pantalla anti-reflejo. Software EMR integrado. Resistente a desinfectantes.',
        cert: 'IP65 · MIL-STD', cat: 'diagnóstico',
        svg: `
            <svg class="eq-svg" width="110" height="100" viewBox="0 0 110 100">
                <rect class="piece" id="p2-0" x="30" y="15" width="50" height="70" rx="8" fill="none" stroke="#4fc3f7" stroke-width="1"/>
                <rect class="piece" id="p2-1" x="35" y="22" width="40" height="42" rx="4" fill="rgba(79,195,247,0.08)" stroke="#4fc3f7" stroke-width="0.5"/>
                <circle class="piece" id="p2-2" cx="55" cy="75" r="6" fill="rgba(79,195,247,0.15)" stroke="#4fc3f7" stroke-width="0.5"/>
                <line class="piece" id="p2-3" x1="38" y1="32" x2="72" y2="32" stroke="#00e5ff" stroke-width="1"/>
                <line class="piece" id="p2-4" x1="38" y1="40" x2="65" y2="40" stroke="#4fc3f7" stroke-width="0.5"/>
                <line class="piece" id="p2-5" x1="38" y1="47" x2="68" y2="47" stroke="#4fc3f7" stroke-width="0.5"/>
                <line class="piece" id="p2-6" x1="38" y1="54" x2="58" y2="54" stroke="#4fc3f7" stroke-width="0.5"/>
                <rect class="piece" id="p2-7" x="43" y="10" width="24" height="7" rx="3" fill="#0a1a2e" stroke="#4fc3f7" stroke-width="0.5"/>
            </svg>
        `
    },
    {
        tag: 'Soporte vital', nombre: 'Ventilador de transporte',
        desc: 'Modos VC, PC, SIMV. Batería interna 4h. Peso 3.8kg, ideal para ambulancias.',
        cert: 'CE · ISO 80601', cat: 'soporte',
        svg: `
            <svg class="eq-svg" width="110" height="100" viewBox="0 0 110 100">
                <rect class="piece" id="p3-0" x="15" y="30" width="55" height="45" rx="6" fill="none" stroke="#4fc3f7" stroke-width="1"/>
                <rect class="piece" id="p3-1" x="70" y="40" width="22" height="25" rx="4" fill="rgba(79,195,247,0.08)" stroke="#4fc3f7" stroke-width="0.5"/>
                <line class="piece" id="p3-2" x1="70" y1="52" x2="70" y2="52" stroke="#4fc3f7" stroke-width="1"/>
                <circle class="piece" id="p3-3" cx="25" cy="20" r="8" fill="none" stroke="#00e5ff" stroke-width="1"/>
                <line class="piece" id="p3-4" x1="25" y1="28" x2="25" y2="30" stroke="#00e5ff" stroke-width="1"/>
                <path class="piece" id="p3-5" d="M22 55 L28 45 L34 60 L40 38 L46 62 L52 52 L58 52" fill="none" stroke="#00e5ff" stroke-width="1.2"/>
                <text x="74" y="56" font-size="7" fill="#4fc3f7" font-family="Rajdhani,sans-serif" font-weight="600" class="piece" id="p3-6">O₂</text>
                <rect class="piece" id="p3-7" x="20" y="78" width="50" height="7" rx="2" fill="rgba(79,195,247,0.1)" stroke="#4fc3f7" stroke-width="0.5"/>
            </svg>
        `
    },
    {
        tag: 'Insumos', nombre: 'Soluciones IV certificadas',
        desc: 'Suero fisiológico, dextrosa, lactato Ringer. Envases PVC-free. Lote trazable.',
        cert: 'INVIMA · USP', cat: 'insumos',
        svg: `
            <svg class="eq-svg" width="110" height="100" viewBox="0 0 110 100">
                <rect class="piece" id="p4-0" x="40" y="15" width="30" height="70" rx="6" fill="none" stroke="#4fc3f7" stroke-width="1"/>
                <rect class="piece" id="p4-1" x="45" y="20" width="20" height="55" rx="4" fill="rgba(79,195,247,0.08)"/>
                <rect class="piece" id="p4-2" x="44" y="10" width="22" height="8" rx="3" fill="rgba(79,195,247,0.15)" stroke="#4fc3f7" stroke-width="0.5"/>
                <rect class="piece" id="p4-3" x="44" y="82" width="22" height="8" rx="3" fill="rgba(79,195,247,0.15)" stroke="#4fc3f7" stroke-width="0.5"/>
                <rect class="piece" id="p4-4" x="47" y="24" width="16" height="30" rx="2" fill="rgba(0,229,255,0.12)" stroke="#00e5ff" stroke-width="0.5"/>
                <line class="piece" id="p4-5" x1="15" y1="50" x2="40" y2="50" stroke="#4fc3f7" stroke-width="0.5" stroke-dasharray="3,2"/>
                <line class="piece" id="p4-6" x1="70" y1="50" x2="95" y2="50" stroke="#4fc3f7" stroke-width="0.5" stroke-dasharray="3,2"/>
                <circle class="piece" id="p4-7" cx="55" cy="50" r="3" fill="#00e5ff"/>
            </svg>
        `
    },
    {
        tag: 'Diagnóstico', nombre: 'Oxímetro de pulso portátil',
        desc: 'SpO2 y frecuencia cardíaca. Pantalla OLED. Alarma configurable. Batería 30h.',
        cert: 'CE · FDA 510k', cat: 'diagnostico',
        svg: `
            <svg class="eq-svg" width="110" height="100" viewBox="0 0 110 100">
                <circle class="piece" id="p5-0" cx="55" cy="50" r="35" fill="none" stroke="#4fc3f7" stroke-width="1"/>
                <circle class="piece" id="p5-1" cx="55" cy="50" r="25" fill="rgba(79,195,247,0.05)" stroke="#4fc3f7" stroke-width="0.5" stroke-dasharray="4,3"/>
                <circle class="piece" id="p5-2" cx="55" cy="50" r="4" fill="#00e5ff"/>
                <line class="piece" id="p5-3" x1="55" y1="15" x2="55" y2="46" stroke="#00e5ff" stroke-width="1.5"/>
                <line class="piece" id="p5-4" x1="55" y1="50" x2="75" y2="50" stroke="#4fc3f7" stroke-width="1"/>
                <circle class="piece" id="p5-5" cx="55" cy="15" r="4" fill="none" stroke="#4fc3f7" stroke-width="0.5"/>
                <line class="piece" id="p5-6" x1="20" y1="50" x2="90" y2="50" stroke="#1a3a5c" stroke-width="0.5"/>
                <line class="piece" id="p5-7" x1="55" y1="15" x2="55" y2="85" stroke="#1a3a5c" stroke-width="0.5"/>
                <text x="60" y="44" font-size="7" fill="#4fc3f7" font-family="Rajdhani,sans-serif" font-weight="600" class="piece" id="p5-8">GPS</text>
            </svg>
        `
    }
]

function ensamblar(card) {
    // const piezas = document.querySelectorAll(`.pieza-${card}`)
    const offsets = [
        { x: -40, y: -30, r: -15, s: 0.4 }, { x: 30, y: -40, r: 20, s: 0.5 },
        { x: -30, y: 30, r: -10, s: 0.6 }, { x: 40, y: 20, r: 15, s: 0.5 },
        { x: -20, y: -35, r: 25, s: 0.4 }, { x: 35, y: -25, r: -20, s: 0.6 },
        { x: -35, y: 25, r: 10, s: 0.5 }
    ]

    // // Dispersar primero
    // piezas.forEach((p, i) => {
    //     const o = offsets[i % offsets.length]
    //     gsap.set(p, { x: o.x, y: o.y, rotation: o.r, scale: o.s, opacity: 0 })
    // })

    // // Ensamblar con stagger
    // gsap.to(piezas, {
    //     x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
    //     duration: 1,
    //     stagger: 0.06,
    //     ease: 'back.out(1.4)'
    // })
}

function filtrar(cat) {
    document.querySelectorAll('.eq-card').forEach(card => {
        const visible = cat === 'todos' || card.dataset.cat === cat
        gsap.to(card, {
            opacity: visible ? 1 : 0.2,
            scale: visible ? 1 : 0.97,
            duration: 0.3,
            ease: 'power2.out'
        })
    })
}

onMounted(() => {
    // Entrada del bloque completo con scroll
    gsap.from('.equipo-seccion', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.equipo-seccion',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    })

    // Entrada escalonada de tarjetas
    gsap.from('.eq-card', {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.eq-grid',
            start: 'top 85%'
        }
    })

    // Ensamblar la primera card automáticamente al entrar al viewport
    ScrollTrigger.create({
        trigger: '.eq-grid',
        start: 'top 70%',
        once: true,
        onEnter: () => {
            const primeraCard = document.querySelector('.eq-card')
            if (primeraCard) ensamblar(primeraCard)
        }
    })

    // Eventos hover para el ensamblaje en cada tarjeta
    document.querySelectorAll('.eq-card').forEach(card => {
        card.addEventListener('mouseenter', () => ensamblar(card))
    })
})
</script>

<template>
    <section class="equipo-seccion py-30">
        <!-- Header -->
        <UContainer>
            <div class="equipo-header">
                <div>
                    <h2 class="equipo-titulo">Catálogo</h2>
                    <p class="text-xs">Tecnología de precisión. Higiene garantizada. Entrega inmediata.</p>
                </div>
                <div class="w-full justify-between py-5">
                    <UButton v-for="f in ['Todos', 'Diagnóstico', 'Soporte', 'Insumos']" :key="f" variant="link"
                        @click="filtrar(f.toLowerCase())">
                        {{ f }}
                    </UButton>
                </div>
            </div>
        </UContainer>

        <UContainer>
            <!-- Grid de tarjetas -->
            <div class="eq-grid grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2.5 bg-(--bg-color)">
                <div v-for="(eq, i) in equipos" :key="i" class="eq-card h-[50vh]" :data-cat="eq.cat"
                    @mouseenter="ensamblar(i)">

                    <!-- Escena SVG del producto (cada uno con su propio SVG) -->
                    <div class="w-full flex justify-center">
                        <!-- Aquí va el SVG específico de cada equipo -->
                        <!-- Las piezas SVG llevan class="pieza" para que GSAP las tome -->
                        <p v-html="eq.svg" :class="`pieza-${i}`"></p>
                    </div>

                    <span class="eq-tag">{{ eq.tag }}</span>
                    <h3 class="eq-nombre">{{ eq.nombre }}</h3>
                    <p class="eq-desc">{{ eq.desc }}</p>

                    <div class="eq-footer">
                        <span class="eq-cert">{{ eq.cert }}</span>
                        <UButton to="#" color="secondary" variant="ghost" size="xs">Ver más →</UButton>
                    </div>
                </div>
            </div>
        </UContainer>

    </section>
</template>

<style scoped>
/* Fondo de la sección — oscuro médico */
.equipo-seccion {
    background: #F5F5F5;
    font-family: 'Space Grotesk', sans-serif;
}

.eq-card {
    background: #f8fbff;
    padding: 28px 24px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s;
    border-radius: 16px;
}

.eq-card:hover {
    background: #adcffc;
}

.eq-card:hover .eq-scanline {
    opacity: 1;
}

/* Piezas SVG — estado inicial disperso vía GSAP */
.pieza {
    will-change: transform, opacity;
}

.eq-eyebrow {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #a9f5ff;
}

.eq-bottom{
padding:24px 40px;
border-top:0.5px solid var(--border);
display:flex;
align-items:center;
justify-content:space-between;
}
.eq-stat{text-align:center}
.eq-stat-num{
font-family:'Rajdhani',sans-serif;
font-size:24px;
font-weight:600;
color:var(--glow);
}
.eq-stat-label{font-size:11px;color:var(--text-sub);margin-top:2px;text-transform:uppercase;letter-spacing:0.07em}

.eq-cta{
display:flex;gap:10px;
}
</style>
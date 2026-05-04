<template>
  <section class="h-screen relative overflow-hidden py-5">

    <!-- Fondo -->
    <div v-if="capaImg" class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${capaImg})` }">
    </div>

    <UContainer>
      <!-- GRID PRINCIPAL -->
      <div class="relative z-10 grid grid-cols-12 grid-rows-12 h-full border border-gray-200 shadow-lg rounded-lg p-4">

        <!-- SLOT CONTENIDO -->
        <slot></slot>

      </div>
    </UContainer>
  </section>
</template>

<script setup>
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  capaImg: String,
});


</script>
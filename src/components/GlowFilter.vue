<template>
  <filter :id="id" height="300%" width="300%" x="-75%" y="-75%">
    <!-- Thicken out the original shape -->
    <feMorphology operator="dilate" radius="15" in="SourceAlpha" result="thicken" />

    <!-- Use a gaussian blur to create the soft blurriness of the glow -->
    <feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />

    <!-- Change the colour -->
    <feFlood :flood-color="color" result="glowColor" />

    <!-- Color in the glows -->
    <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />

    <!--	Layer the effects together -->
    <feMerge>
      <feMergeNode in="softGlow_colored" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GlowFilter',
  props: {
    id: String,
    color: String,
  },
});
</script>

<style scoped>

</style>

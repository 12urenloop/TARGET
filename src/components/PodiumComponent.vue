<template>
  <div class="img-overlay-outer">
    <div class="img-overlay-wrap">
      <img src="/podium.png" alt="12urenloop podium Gent Sint-Pietersplein" width="2048" height="2048" />
      <svg viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">

        <defs>
          <GlowFilter id="gold" color="rgb(249,215,126)"></GlowFilter>
          <GlowFilter id="silver" color="rgb(192,192,192)"></GlowFilter>
          <GlowFilter id="bronze" color="rgb(160,88,34)"></GlowFilter>
        </defs>

        <PodiumTeam
          v-for="(rank, index) in podium"
          :key="index"
          :rank="rank"
          :index="index"
          :teams="teams"
          :podium="podium"
        />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Rank } from '@/assets/loxsi';
import type { Team } from '@/assets/team';
import GlowFilter from '@/components/GlowFilter.vue';
import PodiumTeam from '@/components/PodiumTeam.vue';

export default defineComponent({
  name: 'PodiumComponent',
  components: { PodiumTeam, GlowFilter },
  props: {
    podium: Array<Rank>,
    teams: Array<Team>,
  },
  data() {
    return {
      positions: [
        { x: 1024, y: 1050 },
        { x: 500, y: 1350 },
        { x: 1570, y: 1350 },
      ],
    };
  },
});
</script>

<style scoped>
.img-overlay-wrap {
  position: relative;
  display: inline-block;
  transition: transform 150ms ease-in-out;
}

.img-overlay-outer {
  display: flex;
  justify-content: center;
  transition: transform 150ms ease-in-out;
}

.img-overlay-wrap img {
  display: block;
  max-width: 100%;
  height: auto;
  width: auto;
  max-height: 90vh;
}

.img-overlay-wrap svg {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

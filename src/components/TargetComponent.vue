<template>
  <RunningTrackComponent
    v-if="mounted && !frozen && !podium?.length"
    :points="points"
    :teams="teams"
    :img="img"
    :showPoints="showPoints"
    :showTrack="showTrack"
    :frozen="frozen"
  />
  <MessageComponent :message="message" font-size="1.5rem" />
  <PodiumComponent v-if="podium?.length" :podium="podium" :teams="teams" />
  <LeaderboardComponent :teams="teams" :frozen="frozen" class="mt-3 mb-3" />
  <FooterComponent />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RunningTrackComponent from '@/components/RunningTrackComponent.vue';
import LeaderboardComponent from '@/components/LeaderboardComponent.vue';
import MessageComponent from '@/components/MessageComponent.vue';
import type { Team } from '@/assets/team';
import FooterComponent from '@/components/FooterComponent.vue';
import type { Rank } from '@/assets/loxsi';
import PodiumComponent from '@/components/PodiumComponent.vue';

export default defineComponent({
  name: 'TargetComponent',
  components: { PodiumComponent, FooterComponent, MessageComponent, LeaderboardComponent, RunningTrackComponent },
  props: {
    showPoints: Boolean,
    showTrack: Boolean,
    img: String,
    points: Array<{ x: number, y: number }>,
    message: String,
    teams: Array<Team>,
    frozen: Boolean,
    podium: Array<Rank>,
  },
  data() {
    return {
      mounted: false,
    };
  },
  async mounted() {
    this.mounted = true;
  },
});
</script>


<style scoped>
</style>

<template>
  <RunningTrackComponent
    v-if="mounted && !frozen"
    :points="points"
    :teams="teams"
    :img="img"
    :showPoints="showPoints"
    :showTrack="showTrack"
    :frozen="frozen"
  />
  <MessageComponent :message="message" />
  <LeaderboardComponent :teams="teams" :frozen="frozen" class="mt-3 mb-3" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RunningTrackComponent from '@/components/RunningTrackComponent.vue';
import LeaderboardComponent from '@/components/LeaderboardComponent.vue';
import MessageComponent from '@/components/MessageComponent.vue';
import type { Team } from '@/assets/team';

export default defineComponent({
  name: 'TargetComponent',
  components: { MessageComponent, LeaderboardComponent, RunningTrackComponent },
  props: {
    showPoints: Boolean,
    showTrack: Boolean,
    img: String,
    points: Array<{ x: number, y: number }>,
    wsEndpoint: String,
    message: String,
    teams: Array<Team>,
    frozen: Boolean,
  },
  data() {
    return {
      mounted: false,
    }
  },
  async mounted() {
    this.mounted = true;
  },
});
</script>


<style scoped>
</style>

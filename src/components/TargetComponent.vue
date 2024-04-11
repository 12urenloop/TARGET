<template>
  <RunningTrackComponent
    v-if="mounted"
    :points="points"
    :colors="colors"
    :teams="teams"
    :img="img"
  />
  <LeaderboardComponent :teams="teams" class="mt-3 mb-3" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RunningTrackComponent from '@/components/RunningTrackComponent.vue';
import LeaderboardComponent from '@/components/LeaderboardComponent.vue';

export default defineComponent({
  name: 'TargetComponent',
  components: { LeaderboardComponent, RunningTrackComponent },
  props: [
    'configuration',
  ],
  data() {
    return {
      showPoints: false,
      mounted: false,
      img: '',
      points: [
        { x: 0, y: 0 },
      ],
      colors: {} as any,
      teams: [
        {
          team_id: 1,
          team_name: 'VTK',
          rounds: 2,
          progress: 0.5,
          speed: 0.02,
          timestamp: new Date().getTime(),
          show: true,
        },
        {
          team_id: 2,
          team_name: 'VGK',
          rounds: 3,
          progress: 0.7,
          speed: 0.05,
          timestamp: new Date().getTime(),
          show: true,
        },
        {
          team_id: 3,
          team_name: 'Wetenschappen',
          rounds: 2,
          progress: 0.3,
          speed: 0.03,
          timestamp: new Date().getTime(),
          show: true,
        },
      ],
    };
  },
  async mounted() {
    await this.loadConfiguration();
    this.mounted = true;
  },
  methods: {
    async loadConfiguration() {
      // Load the JSON configuration file and update the component's data
      const config = await import(`./../configurations/${this.configuration}.json`);
      console.log(config);
      this.img = config.img;
      this.points = config.points;
      this.colors = config.colors;
    },
  },
});
</script>


<style scoped>
</style>

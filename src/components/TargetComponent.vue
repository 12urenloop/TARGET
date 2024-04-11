<template>
  <RunningTrackComponent
    v-if="mounted"
    :points="points"
    :colors="colors"
    :teams="teams"
    :img="img"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RunningTrackComponent from '@/components/RunningTrackComponent.vue';

export default defineComponent({
  name: 'TargetComponent',
  components: { RunningTrackComponent },
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
          progress: 0.5,
          speed: 0.02,
          timestamp: new Date().getTime(),
        },
        {
          team_id: 2,
          progress: 0.7,
          speed: 0.05,
          timestamp: new Date().getTime(),
        },
        {
          team_id: 3,
          progress: 0.3,
          speed: 0.03,
          timestamp: new Date().getTime(),
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

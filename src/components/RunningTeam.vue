<template>
  <image :id="`team-${team.team_id}-img`"
         :href="`/teams/${team.team_name.split('-')[0].trim().toLowerCase()}.png`"
         :x="point.x - 50"
         :y="point.y - 50"
         :style="{ display: team.show ? 'block' : 'none' }"
         :filter="team.team_id === 0 ? 'url(#gold)' : team.team_id === 1 ? 'url(#silver)' : team.team_id === 2 ? 'url(#bronze)' : ''"
         width="100"
  />
  <text :id="`team-${team.team_id}-text`"
        :x="point.x - 25"
        :y="point.y - 60"
        fill="#fff"
        class="team-score"
        :style="{ display: team.show ? 'block' : 'none' }"
  >{{ team.rounds }}
  </text>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RunningTeam',
  props: [
    'team',
  ],
  data() {
    return {
      mounted: false,
    };
  },
  mounted() {
    this.mounted = true;
  },
  computed: {
    point(): { x: number, y: number } {
      if (!this.mounted) return { x: 0, y: 0 };
      const path = document.getElementById('path') as unknown as SVGGeometryElement;
      const length = path.getTotalLength();
      return path.getPointAtLength(length * this.team.progress);
    },
  },
});
</script>

<style scoped>
.team-score {
  font-size: 2.25rem;
  font-weight: 700;
  text-shadow: 0 0 3px #000;
}
</style>

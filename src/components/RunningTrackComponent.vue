<template>
  <div class="img-overlay-wrap">
    <img :src="img" alt="12urenloop parcours Gent Sint-Pietersplein" width="4032" height="2268" />
    <svg viewBox="0 0 4032 2268" xmlns="http://www.w3.org/2000/svg">

      <defs>
        <GlowFilter id="gold" color="rgb(249,215,126)"></GlowFilter>
        <GlowFilter id="silver" color="rgb(192,192,192)"></GlowFilter>
        <GlowFilter id="bronze" color="rgb(160,88,34)"></GlowFilter>
      </defs>

      <path id="path" :d="path" fill="none" stroke="black" :stroke-width="showTrack ? 5 : 0" stroke-linejoin="round" />

      <!-- Points -->
      <template v-if="showPoints">
        <circle v-for="point of points" :cx="point.x" :cy="point.y" r="10" fill="red" />
      </template>

      <!-- Teams -->
      <RunningTeam v-for="(team, index) of teams" :key="index" :team="team"></RunningTeam>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Team } from '@/assets/team';
import RunningTeam from '@/components/RunningTeam.vue';
import GlowFilter from '@/components/GlowFilter.vue';

export default defineComponent({
  name: 'RunningTrackComponent',
  components: { GlowFilter, RunningTeam },
  props: {
    points: Array<{ x: number, y: number }>,
    teams: Array<Team>,
    img: String,
    showPoints: Boolean,
    showTrack: Boolean,
    frozen: Boolean,
  },
  computed: {
    path() {
      const points = this.points || [];
      // Start building the path string
      let pathString = 'M' + points[0].x + ',' + points[0].y;

      // Apply smoothing to the path
      for (let i = 1; i < points.length - 1; i++) {
        const x0 = i === 1 ? points[0].x : points[i - 1].x;
        const y0 = i === 1 ? points[0].y : points[i - 1].y;
        const x1 = points[i].x;
        const y1 = points[i].y;
        const x2 = points[i + 1].x;
        const y2 = points[i + 1].y;

        const cp1x = x1 + (x2 - x0) / 4;
        const cp1y = y1 + (y2 - y0) / 4;
        const cp2x = x2 - (x2 - x1) / 4;
        const cp2y = y2 - (y2 - y1) / 4;

        pathString += 'C' + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + x2 + ',' + y2;
      }

      return pathString;
    },
  },
  async mounted() {
    this.updateTeams();
  },
  methods: {
    updateTeams() {
      const now = Date.now();
      if (!this.frozen) {
        this.sortedDrawingOrder(this.teams).forEach((team) => {
          // Progress is in percentage of the path
          // Speed is in percentage of the path per millisecond
          // Acceleration is in percentage of the path per millisecond squared

          if (team.positions[0]?.timestamp ?? now + 1 <= now) {
            const position = team.positions.shift()!;
            team.progress = Number.isFinite(position.progress) ? position.progress : 0;
            team.speed = Number.isFinite(position.speed) ? position.speed : 0;
            team.acceleration = Number.isFinite(position.acceleration) ? position.acceleration : 0;
            team.timestamp = Number.isFinite(position.timestamp) ? position.timestamp : 0;
          }

          const dt = now - team.timestamp;
          team.progress += team.speed * dt + 0.5 * team.acceleration * dt * dt;
          team.speed += team.acceleration * dt;
          // Runners never go backwards
          team.speed = Math.max(0, team.speed);
          team.timestamp = now;

          // Failsafe if no data is received for 60 seconds
          if (team.updatedAt < (now - 60000)) {
            team.progress = 0;
            team.speed = 0;
            team.acceleration = 0;
          }

          if (team.progress >= 1 && team.updatedAt < (now - 5000)) {
            team.rounds += 1;
            team.updatedAt = Date.now();
          }

          // If the team is at the end of the path, reset it to the start
          team.progress = team.progress % 1;
        });
      }

      // Now update the teams every frame.
      requestAnimationFrame(this.updateTeams);
    },
    sortedDrawingOrder(teams: Array<Team> | undefined) {
      return [...teams || []].sort((a, b) => (a.rounds + a.progress) - (b.rounds + b.progress));
    },
  },
});
</script>

<style scoped>
.img-overlay-wrap {
  position: relative;
  display: inline-block;
  /* <= shrinks container to image size */
  transition: transform 150ms ease-in-out;
}

.img-overlay-wrap img {
  /* <= optional, for responsiveness */
  display: block;
  max-width: 100%;
  height: auto;
}

.img-overlay-wrap svg {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

<style>
body::-webkit-scrollbar {
  display: none;
}
</style>

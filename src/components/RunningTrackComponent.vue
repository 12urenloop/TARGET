<template>
  <div class="img-overlay-wrap">
    <img :src="img" alt="12urenloop parcours Gent Sint-Pietersplein" />
    <svg viewBox="0 0 4032 2268" xmlns="http://www.w3.org/2000/svg">
      <path id="path" :d="path" fill="none" stroke="black" :stroke-width="showTrack ? 5 : 0" stroke-linejoin="round" />

      <!-- Points -->
      <template v-if="showPoints">
        <circle v-for="point of points" :cx="point.x" :cy="point.y" r="10" fill="red" />
      </template>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Team } from '@/assets/team';

export default defineComponent({
  name: 'RunningTrackComponent',
  props: {
    points: Array<{ x: number, y: number }>,
    teams: Array<Team>,
    img: String,
    showPoints: Boolean,
    showTrack: Boolean,
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
      const now = new Date().getTime();
      this.teams?.forEach(team => {
        // Progress is in percentage of the path
        // Speed is in percentage of the path per second
        team.progress += team.speed * (now - team.timestamp) / 1000;
        team.timestamp = now;

        // If the team is at the end of the path, reset it to the start
        team.progress = team.progress % 1;

        this.drawTeam(team);
      });

      // Now update the teams every frame.
      requestAnimationFrame(this.updateTeams);
    },
    drawTeam(team: Team) {
      // Calculate the point on the path
      const path = document.getElementById('path') as unknown as SVGGeometryElement;
      const length = path.getTotalLength();
      const point = path.getPointAtLength(length * team.progress);

      // Draw the team on the SVG
      // If the team is already drawn, update its position
      const teamImage = document.getElementById(`team-${team.team_id}`) as unknown as SVGImageElement;
      if (teamImage) {
        teamImage.setAttribute('x', (point.x - 50).toString());
        teamImage.setAttribute('y', (point.y - 50).toString());
        teamImage.style.display = team.show ? 'block' : 'none';
      } else {
        const svg = document.querySelector('svg') as SVGSVGElement;
        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.id = `team-${team.team_id}`;
        image.setAttribute('x', (point.x - 50).toString()); // Adjust x and y position according to image size
        image.setAttribute('y', (point.y - 50).toString());
        image.setAttribute('width', '100'); // Set the width and height of the image
        image.style.display = team.show ? 'block' : 'none';
        image.setAttribute('href', `/teams/${team.team_name.split('-')[0].trim().toLowerCase()}.png`);
        svg.appendChild(image);
      }
    },
  },
});
</script>

<style scoped>
.img-overlay-wrap {
  position: relative;
  display: inline-block; /* <= shrinks container to image size */
  transition: transform 150ms ease-in-out;
}

.img-overlay-wrap img { /* <= optional, for responsiveness */
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

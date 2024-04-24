<template>
  <div class="img-overlay-wrap">
    <img :src="img" alt="12urenloop parcours Gent Sint-Pietersplein" width="4032" height="2268" />
    <svg viewBox="0 0 4032 2268" xmlns="http://www.w3.org/2000/svg">

      <defs>

        <filter id="gold" height="300%" width="300%" x="-75%" y="-75%">
          <!-- Thicken out the original shape -->
          <feMorphology operator="dilate" radius="15" in="SourceAlpha" result="thicken" />

          <!-- Use a gaussian blur to create the soft blurriness of the glow -->
          <feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />

          <!-- Change the colour -->
          <feFlood flood-color="rgb(249,215,126)" result="glowColor" />

          <!-- Color in the glows -->
          <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />

          <!--	Layer the effects together -->
          <feMerge>
            <feMergeNode in="softGlow_colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="silver" height="300%" width="300%" x="-75%" y="-75%">
          <!-- Thicken out the original shape -->
          <feMorphology operator="dilate" radius="15" in="SourceAlpha" result="thicken" />

          <!-- Use a gaussian blur to create the soft blurriness of the glow -->
          <feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />

          <!-- Change the colour -->
          <feFlood flood-color="rgb(192,192,192)" result="glowColor" />

          <!-- Color in the glows -->
          <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />

          <!--	Layer the effects together -->
          <feMerge>
            <feMergeNode in="softGlow_colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="bronze" height="300%" width="300%" x="-75%" y="-75%">
          <!-- Thicken out the original shape -->
          <feMorphology operator="dilate" radius="15" in="SourceAlpha" result="thicken" />

          <!-- Use a gaussian blur to create the soft blurriness of the glow -->
          <feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />

          <!-- Change the colour -->
          <feFlood flood-color="rgb(160,88,34)" result="glowColor" />

          <!-- Color in the glows -->
          <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />

          <!--	Layer the effects together -->
          <feMerge>
            <feMergeNode in="softGlow_colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>

        </filter>

      </defs>

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
        const length = this.teams?.length || 0;
        this.sortedDrawingOrder(this.teams).forEach((team, index) => {
          // Progress is in percentage of the path
          // Speed is in percentage of the path per millisecond
          // Acceleration is in percentage of the path per millisecond squared
          team.speed += team.acceleration * (now - team.timestamp);
          // Runners never go backwards
          team.speed = Math.max(0, team.speed);
          team.progress += team.speed * (now - team.timestamp);
          team.timestamp = now;

          if (team.progress >= 1 && team.updatedAt < (now - 5000)) {
            team.rounds += 1;
          }

          // If the team is at the end of the path, reset it to the start
          team.progress = team.progress % 1;

          this.drawTeam(team, length - 1 - index);
        });
      }

      // Now update the teams every frame.
      requestAnimationFrame(this.updateTeams);
    },
    drawTeam(team: Team, index: number) {
      // Calculate the point on the path
      const path = document.getElementById('path') as unknown as SVGGeometryElement;
      const length = path.getTotalLength();
      const point = path.getPointAtLength(length * team.progress);

      // Draw the team on the SVG
      // If the team is already drawn, update its position
      const teamImage = document.getElementById(`team-${team.team_id}-img`) as unknown as SVGImageElement;
      const teamText = document.getElementById(`team-${team.team_id}-text`) as unknown as SVGImageElement;
      if (teamImage && teamText) {
        teamText.setAttribute('x', (point.x - 25).toString());
        teamText.setAttribute('y', (point.y - 60).toString());
        teamText.style.display = team.show ? 'block' : 'none';
        teamText.textContent = String(team.rounds);

        teamImage.setAttribute('x', (point.x - 50).toString());
        teamImage.setAttribute('y', (point.y - 50).toString());
        teamImage.style.display = team.show ? 'block' : 'none';
        if (index === 0) teamImage.setAttribute('filter', 'url(#gold)');
        else if (index === 1) teamImage.setAttribute('filter', 'url(#silver)');
        else if (index === 2) teamImage.setAttribute('filter', 'url(#bronze)');
        else teamImage.removeAttribute('filter');
      } else {
        const svg = document.querySelector('svg') as SVGSVGElement;
        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.id = `team-${team.team_id}-img`;
        image.setAttribute('x', (point.x - 50).toString()); // Adjust x and y position according to image size
        image.setAttribute('y', (point.y - 50).toString());
        image.setAttribute('width', '100'); // Set the width and height of the image
        image.style.display = team.show ? 'block' : 'none';
        image.setAttribute('href', `/teams/${team.team_name.split('-')[0].trim().toLowerCase()}.png`);
        if (index === 0) image.setAttribute('filter', 'url(#gold)');
        else if (index === 1) image.setAttribute('filter', 'url(#silver)');
        else if (index === 2) image.setAttribute('filter', 'url(#bronze)');
        svg.appendChild(image);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.id = `team-${team.team_id}-text`;
        text.setAttribute('x', (point.x - 25).toString()); // Adjust x and y position so that it's above the image
        text.setAttribute('y', (point.y - 60).toString());
        text.setAttribute('fill', '#fff');
        text.setAttribute('class', 'team-score');
        text.style.display = team.show ? 'block' : 'none';
        text.textContent = String(team.rounds);
        svg.appendChild(text);
      }
    },
    sortedDrawingOrder(teams: Array<Team> | undefined) {
      return [...teams || []].sort((a, b) => a.rounds - b.rounds);
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

:deep(.team-score) {
  font-size: 2.25rem;
  font-weight: 700;
  text-shadow: 0px 0px 3px #000;
}
</style>

<style>
body::-webkit-scrollbar {
  display: none;
}
</style>

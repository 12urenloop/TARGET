<template>
  <div class="img-overlay-outer">
    <div class="img-overlay-wrap">
      <img src="/podium.png" alt="12urenloop podium Gent Sint-Pietersplein" width="2048" height="2048" />
      <svg viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">

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
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Rank } from '@/assets/loxsi';
import type { Team } from '@/assets/team';

export default defineComponent({
  name: 'PodiumComponent',
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
  mounted() {
    this.drawPodium();
  },
  watch: {
    podium: {
      handler() {
        this.drawPodium();
      },
      deep: true,
    },
  },
  methods: {
    drawPodium() {
      if (!this.podium) return;
      for (const [index, rank] of this.podium.entries()) {
        const svg = document.querySelector('svg') as SVGSVGElement;
        let image = document.getElementById(`rank-${index}-img`) as unknown as SVGImageElement;
        if (!image) {
          image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
          image.id = `rank-${index}-img`;
          image.setAttribute('width', '200');
          image.style.display = 'block';
          image.style.animation = 'updown 1s infinite';
          svg.appendChild(image);
        }
        // Display teams next to each other if they share the same rank
        const teamsAtRank = this.podium.filter(r => r.rank === rank.rank);
        const rankIndex = teamsAtRank.findIndex(r => r.team_id === rank.team_id);
        const offset = (rankIndex - (teamsAtRank.length - 1) / 2) * 250;
        image.setAttribute('x', (this.positions[rank.rank].x - 100 + offset).toString());

        image.setAttribute('y', (this.positions[rank.rank].y - 100).toString());
        image.setAttribute('href', `/teams/${this.teams?.find(t => t.team_id === rank.team_id)?.team_name.split('-')[0].trim().toLowerCase()}.png`);
        if (rank.rank === 0) image.setAttribute('filter', 'url(#gold)');
        else if (rank.rank === 1) image.setAttribute('filter', 'url(#silver)');
        else if (rank.rank === 2) image.setAttribute('filter', 'url(#bronze)');
      }
    },
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

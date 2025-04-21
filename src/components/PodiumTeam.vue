<template>
  <image :id="`rank-${index}-img`"
         :href="`/teams/${teams?.find((t: Rank) => t.team_id === rank.team_id)?.team_name.split('-')[0].trim().toLowerCase()}.png`"
         :x="positions[rank.rank].x - 100 + offset"
         :y="positions[rank.rank].y - 100"
         width="200"
         style="display: block; animation: updown 1s infinite;"
         :filter="rank.rank === 0 ? 'url(#gold)' : rank.rank === 1 ? 'url(#silver)' : rank.rank === 2 ? 'url(#bronze)' : ''"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Rank } from '@/assets/loxsi';

export default defineComponent({
  name: 'PodiumTeam',
  props: [
    'rank',
    'index',
    'teams',
    'podium',
  ],
  data() {
    return {
      positions: [
        { x: 1024, y: 1050 },
        { x: 500, y: 1350 },
        { x: 1570, y: 1350 },
      ],
    };
  },
  computed: {
    offset(): number {
      const teamsAtRank = this.podium.filter((r: Rank) => r.rank === this.rank.rank);
      const rankIndex = teamsAtRank.findIndex((r: Rank) => r.team_id === this.rank.team_id);
      return (rankIndex - (teamsAtRank.length - 1) / 2) * 250;
    },
  },
});
</script>

<style scoped>

</style>

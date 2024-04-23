<template>
  <h1>Led Wall</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Team } from '@/assets/team';

export default defineComponent({
  name: 'LedWallComponent',
  props: {
    teams: Array<Team>,
  },
});
</script>

<style scoped>

</style>

<template>
  <div class="container">
    <MDBTable hover responsive>
      <thead class="bg-light">
      <tr>
        <th>#</th>
        <th />
        <th>Team</th>
        <th>Rounds</th>
        <th>Visible</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(team, index) in sorted(teams ?? [])" :key="team.team_id">
        <td>{{ index + 1 }}</td>
        <td>
          <img
            :src="`/teams/${team.team_name.trim().toLowerCase()}.png`"
            :alt="`Team ${team.team_name}`"
          />
        </td>
        <td>{{ team.team_name }}</td>
        <td>{{ team.rounds }}</td>
        <td>
          <MDBCheckbox v-model="team.show" />
        </td>
      </tr>
      </tbody>
    </MDBTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MDBCheckbox, MDBTable } from 'mdb-vue-ui-kit';
import type { Team } from '@/assets/team';

export default defineComponent({
  name: 'LeaderboardComponent',
  components: { MDBTable, MDBCheckbox },
  props: {
    teams: Array<Team>,
  },
  methods: {
    sorted(teams: Array<Team>) {
      return teams.sort((a, b) => (b.rounds + b.progress) - (a.rounds + a.progress));
    },
  },
});
</script>

<style scoped>
img {
  height: 30px;
}
</style>

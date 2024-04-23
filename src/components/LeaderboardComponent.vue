<template>
  <div class="container">
    <MDBTable hover responsive align="middle">
      <thead class="bg-light">
      <tr>
        <th>#</th>
        <th />
        <th>Team</th>
        <th style="width: 75%">Rounds</th>
        <th>Visible</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(team, index) in sorted(teams ?? [])" :key="team.team_id">
        <td>{{ index + 1 }}</td>
        <td>
          <RotatingImages class="flex-fill team-logo" :team-names="team.team_name.split('-')" width="auto" height="30px" items-class="d-block" />
        </td>
        <td>{{ team.team_name }}</td>
        <td>
          <MDBProgress :height="20">
            <MDBProgressBar :value="team.rounds" :min="0" :max="maxRounds" striped :animated="!frozen">
              <b>{{ team.rounds }}</b>
            </MDBProgressBar>
          </MDBProgress>
        </td>
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
import { MDBCheckbox, MDBProgress, MDBProgressBar, MDBTable } from 'mdb-vue-ui-kit';
import type { Team } from '@/assets/team';
import RotatingImages from '@/components/RotatingImages.vue';

export default defineComponent({
  name: 'LeaderboardComponent',
  components: { RotatingImages, MDBTable, MDBCheckbox, MDBProgress, MDBProgressBar },
  props: {
    teams: Array<Team>,
    frozen: Boolean,
  },
  computed: {
    maxRounds() {
      return Math.max(...this.teams?.map(team => team.rounds) ?? [1]);
    },
  },
  methods: {
    sorted(teams: Array<Team>) {
      return teams.sort((a, b) => (b.rounds + b.progress) - (a.rounds + a.progress));
    },
  },
});
</script>

<style scoped>
.progress-bar {
  background-color: #fc0;
  color: #2c2ca0;
}
</style>
<style>
.form-check-input[type=checkbox]:checked {
  background-color: #2c2ca0;
  border-color: #2c2ca0;
}

.form-check-input:checked {
  background-color: #2c2ca0;
  border-color: #2c2ca0;
}

.form-check-input:focus {
  background-color: #2c2ca0 !important;
}
</style>

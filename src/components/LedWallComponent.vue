<template>
  <div class="vh-100 bg-black">
    <MessageComponent :message="message" class="message d-flex align-items-center" />
    <div class="d-flex flex-wrap justify-content-center">
      <div class="team pb-1 pt-1 pb-2 pe-2" v-for="team in teams" :key="team.team_id">
        <MDBCard class="bg-dark">
          <MDBCardBody class="text-center d-flex flex-column align-items-center">
            <h1 class="text-white">{{ team.team_name }}</h1>

            <RotatingImages class="flex-fill" :team-names="team.team_name.split('-')" width="5vh" height="auto"
                            items-class="d-block w-100" />

            <MDBProgress :height="50" class="">
              <MDBProgressBar :value="team.rounds" :min="0" :max="maxRounds" striped :animated="!frozen">
                <b class="rounds-text">{{ team.rounds }}</b>
              </MDBProgressBar>
            </MDBProgress>
          </MDBCardBody>
        </MDBCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MDBCard, MDBCardBody, MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit';
import { defineComponent } from 'vue';
import type { Team } from '@/assets/team';
import RotatingImages from '@/components/RotatingImages.vue';
import MessageComponent from '@/components/MessageComponent.vue';

export default defineComponent({
  name: 'LedWallComponent',
  components: {
    MessageComponent,
    MDBProgressBar,
    MDBProgress,
    RotatingImages,
    MDBCard,
    MDBCardBody,
  },
  props: {
    showPoints: Boolean,
    showTrack: Boolean,
    img: String,
    points: Array<{ x: number, y: number }>,
    message: String,
    teams: Array<Team>,
    frozen: Boolean,
  },
  computed: {
    maxRounds() {
      return Math.max(...this.teams?.map(team => team.rounds) ?? [1]);
    },
  },
});
</script>

<style scoped>
.team {
  width: 16vw;
  height: 30vh;
}

.message {
  height: 10vh;
}

.card {
  width: 100%;
  height: 100%;
  background-color: #000000;
}

h1 {
  font-size: 1.7rem;
}

.progress {
  width: 100%;
  overflow: visible;
}

.progress-bar {
  background-color: #fc0;
  color: #2c2ca0;
  font-size: 1.5rem;
}
</style>

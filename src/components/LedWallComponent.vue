<template>
  <div class="vh-100 bg-black">
    <MessageComponent :message="message" class="message d-flex align-items-center" font-size="2rem" />
    <div class="d-flex flex-wrap justify-content-center">
      <div class="team pb-1 pt-1 pb-2 pe-2" v-for="(team, index) in teams" :key="team.team_id">
        <MDBCard class="bg-dark">
          <div class="card-position" :style="height(team)"></div>
          <MDBCardBody class="text-center d-flex flex-column align-items-center">
            <div class="rank text-white rounded-bottom rounded-4 rounded-start border-bottom border-start border-3">
              &nbsp;{{ index + 1}}&nbsp;
            </div>
            <h1 class="text-white"><b>{{ team.team_name }}</b></h1>

            <RotatingImages class="flex-fill" :team-names="team.team_name.split('-')" width="7vh" height="auto"
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
    <img
      loading="lazy"
      width="150"
      height="150"
      src="https://zinc.zeus.gent/zeus"
      class="zeus"
      alt="Zeus WPI"
      data-recalc-dims="1"
    />
    <img
      loading="lazy"
      width="150"
      height="150"
      src="https://12urenloop.be/images/logo.svg"
      class="urenloop"
      alt="12urenloop"
      data-recalc-dims="1"
    />
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
  data() {
    return {
      intervalId: 0,
    };
  },
  computed: {
    maxRounds() {
      return Math.max(...this.teams?.map(team => team.rounds) ?? [1]);
    },
  },
  mounted() {
    this.intervalId = setInterval(() => {
      const now = Date.now();
      this.teams?.forEach((team) => {
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
      });
    }, 100);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  methods: {
    height(team: Team) {
      return `height: ${team.progress * 100}%`;
    },
  }
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
  z-index: 1;
}

h1 {
  font-size: 2rem;
}

.progress {
  width: 100%;
  overflow: visible;
}

.progress-bar {
  background-color: #fc0;
  color: #2c2ca0;
  font-size: 2.5rem;
}

.rank {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1.7rem;
}

.zeus {
  float: right;
  margin-top: -11em;
  margin-right: 2em;
}

.urenloop {
  float: left;
  margin-top: -11em;
  margin-left: 2em;
}

.card-position {
  position: absolute;
  background-color: #2c2ca0;
  border-radius: 0.5rem;
  z-index: 2;
  bottom: 0;
  width: 100%;
}

.card-body {
  z-index: 3;
}
</style>

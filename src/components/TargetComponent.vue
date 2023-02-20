<template>
  <MDBContainer>
    <h1>TARGET</h1>
    <h2>Top-down Advancement of the Running Groups Estimation Technology</h2>
    <div class="track-outer">
      <div v-for="i in teams.length" :key="i">
        <div
          class="track"
          :style="
            'height: ' +
            (400 - i * (220 / teams.length)) +
            'px; width: ' +
            (900 - i * (220 / teams.length)) +
            'px; border-radius: ' +
            (200 - i * (100 / teams.length)) +
            'px; left: ' +
            (110 / teams.length) * i +
            'px; top: ' +
            (110 / teams.length) * i +
            'px; border: ' +
            100 / teams.length +
            'px solid ' +
            teams[i - 1].color
          "
        ></div>
      </div>
    </div>
  </MDBContainer>
</template>

<script>
import { MDBContainer } from "mdb-vue-ui-kit";

export default {
  name: "TargetComponent",
  components: {
    MDBContainer,
  },
  data() {
    return {
      // 20 teams
      teams: [
        {
          name: "Team 1",
          color: "#b27569",
        },
        {
          name: "Team 2",
          color: "#825046",
        },
        {
          name: "Team 3",
          color: "#b27569",
        },
        {
          name: "Team 4",
          color: "#825046",
        },
        {
          name: "Team 5",
          color: "#b27569",
        },
        {
          name: "Team 6",
          color: "#825046",
        },
        {
          name: "Team 7",
          color: "#b27569",
        },
        {
          name: "Team 8",
          color: "#825046",
        },
        {
          name: "Team 9",
          color: "#b27569",
        },
        {
          name: "Team 10",
          color: "#825046",
        },
        {
          name: "Team 11",
          color: "#b27569",
        },
        {
          name: "Team 12",
          color: "#825046",
        },
        {
          name: "Team 13",
          color: "#b27569",
        },
        {
          name: "Team 14",
          color: "#825046",
        },
        {
          name: "Team 15",
          color: "#b27569",
        },
        {
          name: "Team 16",
          color: "#825046",
        },
        {
          name: "Team 17",
          color: "#b27569",
        },
        {
          name: "Team 18",
          color: "#825046",
        },
        {
          name: "Team 19",
          color: "#b27569",
        },
        {
          name: "Team 20",
          color: "#825046",
        },
      ],
    };
  },
};
</script>

<style scoped>
.track-outer {
  position: relative;
}

.track {
  transition: all ease-in-out 200ms;
  position: absolute;
}

.track:hover {
  border-color: #825046 !important;
  opacity: 0.8;
  cursor: pointer;
}

.track:hover::before {
  background: #825046;
}
</style>

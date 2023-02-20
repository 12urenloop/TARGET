<template>
  <MDBContainer>
    <h1>TARGET</h1>
    <h2>Top-down Advancement of the Running Groups Estimation Technology</h2>
    <div class="track-outer">
      <div v-for="i in 20" :key="i">
        <div
          class="track"
          :style="
            'height: ' +
            (400 - i * 11) +
            'px; width: ' +
            (900 - i * 11) +
            'px; border-radius: ' +
            (200 - i * 5) +
            'px; left: ' +
            5.5 * i +
            'px; top: ' +
            5.5 * i +
            'px'
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
};
</script>

<style scoped>
.track-outer {
  position: relative;
}

.track {
  border: 5px solid #b27569;
  transition: all ease-in-out 200ms;
  position: absolute;
}
.track:hover {
  border: 5px solid #825046;
  cursor: pointer;
}
.track:hover::before {
  background: #825046;
}
</style>

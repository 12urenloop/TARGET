<template>
  <div class="logo-img">
    <MDBCarousel
      v-if="teamNames?.length && teamNames.length > 1"
      v-model="carousel"
      :items="items"
      :controls="false"
      :indicators="false"
      :items-class="itemsClass"
    />
    <img v-if="teamNames?.length && teamNames.length === 1"
         :src="`/teams/${teamNames![showingIndex].trim().toLowerCase()}.png`" alt="logo" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MDBCarousel } from 'mdb-vue-ui-kit';

export default defineComponent({
  name: 'RotatingImages',
  components: { MDBCarousel },
  props: {
    teamNames: Array<String>,
    minwidth: String,
    height: String,
    itemsClass: String,
  },
  data() {
    return {
      showingIndex: 0,
      intervalId: 0,
      carousel: 0,
      items: this.teamNames!.map((_, index) => ({
        src: `/teams/${this.teamNames![index].trim().toLowerCase()}.png`,
        alt: `logo ${this.teamNames![index]}`,
      })),
    };
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.showingIndex = (this.showingIndex + 1) % this.teamNames!.length;
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
});
</script>

<style>
.logo-img {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img > * {
  min-width: v-bind(minwidth);
  height: v-bind(height);
  object-fit: contain;
}

.carousel-inner img {
  margin: auto;
}

.carousel-item, .carousel-inner, .carousel-item-start, .carousel-item-next {
  height: 100%;
}

.carousel-item > img {
  height: 100%;
}
</style>

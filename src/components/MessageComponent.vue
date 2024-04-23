<template>
  <div class="container" v-if="message">
    <div class="alert alert-warning w-100" role="alert">
      <b>{{ message }}</b>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MessageComponent',
  props: {
    message: String,
  },
});
</script>

<style scoped>
.alert-warning {
  background-color: #fc0;
  color: #2c2ca0;
  font-size: 1.5rem;
  padding-bottom: 0.8rem;
  padding-top: 0.8rem;
}
</style>

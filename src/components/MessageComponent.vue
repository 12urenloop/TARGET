<template>
  <div class="container" v-if="message">
    <div class="alert alert-warning w-100" role="alert">
      {{ message }}
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

</style>

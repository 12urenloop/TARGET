<template>
  <MDBFooter :text="['center', 'lg-start']" class="pt-4">
    <!-- Copyright -->
    <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2)">
      Made with
      <MDBIcon icon="heart" iconStyle="fas" class="heart" />
      by
      <a class="zeus" href="https://zeus.gent/">Zeus WPI</a>
      - View on <a class="text-dark" href="https://github.com/12urenloop/TARGET">GitHub
      <MDBIcon icon="github" iconStyle="fab" />
    </a>
    </div>
    <!-- Copyright -->
  </MDBFooter>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MDBFooter, MDBIcon } from 'mdb-vue-ui-kit';

export default defineComponent({
  name: 'FooterComponent',
  components: { MDBFooter, MDBIcon },
});
</script>

<style scoped>
.heart {
  color: #f14668;
}

.zeus {
  color: #ff7f00;
  font-weight: bold;
}
</style>

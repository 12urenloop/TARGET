<template>
  <MDBContainer>
    <h1>TARGET</h1>
    <h2>Top-down Advancement of the Running Groups Estimation Technology</h2>
    <div class="track-outer">
        <div class="track track1"></div>
        <div class="track track2"></div>
        <div class="track track3"></div>
        <div class="track track4"></div>
        <div class="track track5"></div>
        <!-- <div class="track track6"></div>
        <div class="track track7"></div>
        <div class="track track8"></div>
        <div class="track track9"></div>
        <div class="track track10"></div> -->
        
      <div v-for="i in 20" :key="i">
        <div class="track track5"></div>
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
  mounted() {
    
  },
};
</script>

<style scoped>
.track-outer {
  position: relative;
}

.track { border: 10px solid #B27569; transition: all ease-in-out 200ms; position: absolute;}
.track:hover {border: 10px solid #825046; cursor:pointer}
.track:hover::before{ background:#825046;}

/*  position changes by 11px every track, size changes by 22, border-rad by 10 */

.track1 {
  height: 200px;
  width: 450px;
  border-radius:100px;
  
  left:0;
  top:0;
}

.track2 {
  height: 178px;
  width: 428px;
  border-radius:90px;
  
  left:11px;
  top:11px;
}

.track3 {
  height: 156px;
  width: 406px;
  border-radius:80px;
  
  left:22px;
  top:22px;
}

.track4 {
  height: 134px;
  width: 384px;
  border-radius:70px;
  
  left:33px;
  top:33px;
}

.track5 {
  height: 112px;
  width: 362px;
  border-radius:60px;
  
  left:44px;
  top:44px;
}
</style>

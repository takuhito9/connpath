<template>
  <div>
    <div v-for="obst in obsts" :key="obst.id">
      <p>Obstacle : {{ obst.obst }}</p>
      <div v-for="sol in obst.sols" :key="sol.id">
        <p>Solution : {{ sol.sol }}</p>
      </div>
      <hr />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
interface obstsType {
  obst: string;
  sols: {
    ref: string;
    sol: string;
  };
}

export default Vue.extend({
  props: {
    obsts: Array as Vue.PropType<Array<obstsType>>,
  },
});
</script>

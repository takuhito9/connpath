<template>
  <div>
    <div>
      <div v-for="obst in obsts" :key="obst.id">
        <GoalObstacleListAndSolutionForLoop :obst="obst" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import GoalObstacleListAndSolutionForLoop from "@/views/Goal/GoalObstacle/GoalObstacleListAndSolutionForLoop.vue";
interface obstsType {
  obst: string;
  sols: {
    ref: string;
    sol: string;
  };
}
export default Vue.extend({
  components: {
    GoalObstacleListAndSolutionForLoop,
  },
  props: {
    obsts: Array as Vue.PropType<Array<obstsType>>,
  },
});
</script>
<style lang="scss" scoped>
</style>

<template>
  <div>
    <div>
      <div v-for="(obst, index) in obsts" :key="obst.id">
        <GoalObstacleSolutionCreate :obst="obst" :index="index" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import GoalObstacleSolutionCreate from "@/views/Goal/GoalObstacleSolutionCreate.vue";
interface obstsType {
  obst: string;
  sols: {
    ref: string;
    sol: string;
  };
}
export default Vue.extend({
  components: {
    GoalObstacleSolutionCreate,
  },
  props: {
    obsts: Array as Vue.PropType<Array<obstsType>>,
  },
  data() {
    return {
      add_solution_flag: false,
    };
  },
  methods: {
    addSolution(index: number) {},
  },
});
</script>
<style lang="scss" scoped>
</style>

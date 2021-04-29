<template>
  <div>
    <ul class="block obst_ul">
      <span>{{ index }} : </span>
      <li class="obst_li">{{ obst.obst }}</li>

      <div style="margin-left: 2em; border-left: 3px #e1e3e8 solid">
        <div v-for="sol in obst.sols" :key="sol.id" style="margin-left: 15px">
          <GoalObstacleSolutionList :sol="sol" />
        </div>
      </div>
    </ul>

    <!-- Add Solution Form -->
    <template v-if="!flag"
      ><button
        @click="addSolution(index)"
        class="button_positive"
        style="margin-left: 1.7em; margin-bottom: 10px"
      >
        <i
          class="material-icons"
          style="margin-right: 5%; vertical-align: -5px"
        >
          add_circle
        </i>
        Solution
      </button>
    </template>
    <template v-else>
      <h1>{{ obst }}を編集します</h1>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import GoalObstacleSolutionList from "@/views/Goal/GoalObstacleSolutionList.vue";

interface obstType {
  obst: string;
  sols: {
    ref: string;
    sol: string;
  };
}
export default Vue.extend({
  components: {
    GoalObstacleSolutionList,
  },
  data() {
    return {
      flag: false,
    };
  },
  props: {
    obst: Object as Vue.PropType<obstType>,
    index: Number,
  },
  methods: {
    addSolution(index: number) {
      this.flag = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.solution_position {
  margin-left: 2em;
  padding-left: 2em;
}
.block {
  padding-bottom: 10px;
  padding-left: 1em;
  margin-left: 1em;
}
.obst_ul {
  list-style: none;

  .obst_li {
    margin-bottom: 10px;
    text-indent: -1.7em;
    padding-left: 1em;

    &:before {
      vertical-align: -2px;
      font-family: "Material Icons";
      margin-right: 10px;
      content: "hiking";
    }
  }
}
</style>

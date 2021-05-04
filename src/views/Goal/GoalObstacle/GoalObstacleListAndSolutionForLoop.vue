<template>
  <div>
    <template>
      <ul class="block obst_ul">
        <li class="obst_li">
          <span class="line">{{ obst.obst }}</span>
        </li>

        <!-- For Loop `Solution` -->
        <template>
          <div style="margin-left: 2em; border-left: 3px #e1e3e8 solid">
            <div
              v-for="(sol, index) in obst.sols"
              :key="sol.id"
              style="margin-left: 15px"
            >
              <GoalObstacleSolutionList
                :sol="sol"
                :solNth="index"
                :obstId="obst.docId"
              />
            </div>
          </div>
        </template>
      </ul>
    </template>

    <!-- Add `Solution` -->
    <template>
      <GoalObstacleSolutionAdd :obst="obst" />
      <br />
    </template>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import GoalObstacleSolutionList from "@/views/Goal/GoalObstacle/GoalObstacleSolutionList.vue";
import GoalObstacleSolutionAdd from "@/views/Goal/GoalObstacle/GoalObstacleSolutionAdd.vue";

interface obstType {
  docId: string;
  obst: string;
  sols: {
    ref: string;
    sol: string;
  };
}
export default Vue.extend({
  components: {
    GoalObstacleSolutionList,
    GoalObstacleSolutionAdd,
  },
  props: {
    obst: { type: Object as () => obstType },
  },
});
</script>

<style lang="scss" scoped>
.line {
  background: -moz-linear-gradient(transparent 70%, #c3505033 70%);
  background: -webkit-linear-gradient(transparent 70%, #c3505033 70%);
  background: linear-gradient(transparent 70%, #c3505033 70%);
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

<template>
  <div>
    <h3>
      <i class="material-icons" style="vertical-align: -4px">rule</i>
      Condition of Success
      {{ isCosExist }}
    </h3>

    <div class="left_border">
      <template v-if="!coss">
        <GoalConditionOfSuccessAdd :isCosExist="isCosExist" />
      </template>
      <template v-else>
        <div v-for="(condition, index) in coss" :key="condition.id">
          <GoalConditionOfSuccessList
            :condition="condition"
            :coss="coss"
            :nth="index"
          />
        </div>
        <GoalConditionOfSuccessAdd :isCosExist="isCosExist" />
      </template>
    </div>
    <br />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import GoalConditionOfSuccessList from "@/views/Goal/GoalConditionOfSuccess/GoalConditionOfSuccessList.vue";
import GoalConditionOfSuccessAdd from "@/views/Goal/GoalConditionOfSuccess/GoalConditionOfSuccessAdd.vue";

interface conditionOfSuccessType {
  cond: string;
  cmplt: boolean;
}
interface dataType {
  cosAddDialog: boolean;
  cosAddInput: string;
  isCosExist: boolean;
}

export default Vue.extend({
  components: {
    GoalConditionOfSuccessList,
    GoalConditionOfSuccessAdd,
  },
  props: {
    coss: Array as Vue.PropType<Array<conditionOfSuccessType>>,
  },
  data(): dataType {
    return {
      cosAddDialog: false,
      cosAddInput: "",
      isCosExist: this.coss.length >= 1,
    };
  },
});
</script>
<style lg="scss" scoped>
.position_correction {
  /* font-weight: 500; */
  margin: 0em 0em 0.5em 3em;
}
.left_border {
  margin-left: 0.8em;
  border-left: 3px solid #e1e3e88f;
}
</style>

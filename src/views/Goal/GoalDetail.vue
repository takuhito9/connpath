<template>
  <div>
    <div class="goal">
      <h2 class="goal__title">
        <i
          ><span class="material-icons" style="vertical-align: -4px"
            >flag</span
          ></i
        >
        {{ goal.goal }}
      </h2>
      <h4 class="goal__detail">{{ goal.deets }}</h4>
    </div>

    <br />

    <GoalConditionOfSuccess :cos="goal.cos"></GoalConditionOfSuccess>
    <TaskList />

    <!-- <pre>goal: {{ goal }}</pre> -->
    <!-- <pre>selectingGoal :{{ $store.state.selectingGoal }}</pre> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db } from "@/main";
import TaskList from "@/views/Goal/Task/TaskList.vue";
import GoalConditionOfSuccess from "@/views/Goal/GoalConditionOfSuccess.vue";

interface goalObjectType {
  goal: string;
  cos: Array<{
    cond: string;
    cmplt: boolean;
  }>;
  deets: string;
  cre_at: {
    seconds: number;
    nanoseconds: number;
  };
  docId: string;
}

interface dataType {
  goal: goalObjectType;
}

export default Vue.extend({
  components: { TaskList, GoalConditionOfSuccess },
  data(): dataType {
    return {
      goal: {
        goal: "",
        cos: [{ cond: "", cmplt: false }],
        deets: "",
        cre_at: {
          seconds: 0,
          nanoseconds: 0,
        },
        docId: "",
      },
    };
  },
  methods() {},
  created() {
    const vm = this;
    const goalId = vm.$route.params.id;
    const userId = vm.$store.state.user.uid;
    const docRef = db.doc(`users/${userId}/goals/${goalId}`);
    docRef.onSnapshot(function (doc) {
      const docData = doc.data();
      if (docData) {
        docData.docId = goalId;
        vm.goal = docData as goalObjectType;
        vm.$store.commit("setSelectingGoal", vm.goal);
        console.log("Firebaseにアクセスしてデータを取得しました");
      } else {
        console.log(Error);
      }
    });
  },
});
</script>

<style lang="scss" scoped>
.goal__title {
  color: #50c38f;
}
.goal__detail {
  font-weight: 500;
  margin: 0em 0em 0em 3em;
}
.button__design {
  border: none;
  background: none;
  color: #4c4c4c;
}
.button__design:hover,
.button__design:focus {
  color: #50c38f;
  transition: 0.2s;
}
</style>

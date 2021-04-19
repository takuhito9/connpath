<template>
  <div>
    <div class="goal">
      <span>{{ goal.wish }}</span>
      <h2 class="goal_title">
        <i
          ><span class="material-icons" style="vertical-align: -4px"
            >flag</span
          ></i
        >
        {{ goal.goal }}
      </h2>
      <h4 class="goal__detail">{{ goal.deets }}</h4>

      <h3>Feedback</h3>
      <div v-for="feedback in goal.fdbk" :key="feedback.id">
        <h4 class="goal__detail">{{ feedback }}</h4>
      </div>
    </div>

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
  wish: string;
  goal: string;
  fdbk: string[];
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
        wish: "",
        goal: "",
        fdbk: [""],
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
.goal__detail {
  font-weight: 500;
  margin: 0em 0em 0em 3em;
}
</style>

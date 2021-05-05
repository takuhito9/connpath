<template>
  <div>
    <div class="category">
      <p style="margin: 0 0 3em 0">
        <span class="wish">
          <i class="material-icons" style="vertical-align: -5px">arrow_right</i>
          {{ goal.wish }}</span
        >
      </p>
      <h2 class="goal_title">
        <i
          ><span class="material-icons" style="vertical-align: -4px"
            >flag</span
          ></i
        >
        {{ goal.goal }}
      </h2>
      <h4 class="position_correction">{{ goal.deets }}</h4>
    </div>

    <div class="category">
      <GoalFeedback :fdbks="goal.fdbks" />
    </div>

    <div class="category">
      <GoalConditionOfSuccessForLoop :coss="goal.coss" />
    </div>

    <div class="category">
      <GoalObstacle />
    </div>

    <div class="category">
      <TaskList />
    </div>

    <!-- <pre>goal: {{ goal }}</pre> -->
    <!-- <pre>selectingGoal :{{ $store.state.selectingGoal }}</pre> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db } from "@/main";
import TaskList from "@/views/Goal/Task/TaskList.vue";
import GoalFeedback from "@/views/Goal/GoalFeedback.vue";
import GoalObstacle from "@/views/Goal/GoalObstacle/GoalObstacle.vue";
import GoalConditionOfSuccessForLoop from "@/views/Goal/GoalConditionOfSuccess/GoalConditionOfSuccessForLoop.vue";

interface goalObjectType {
  wish: string;
  goal: string;
  fdbks: string[];
  coss: Array<{
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
  components: {
    TaskList,
    GoalConditionOfSuccessForLoop,
    GoalFeedback,
    GoalObstacle,
  },
  data(): dataType {
    return {
      goal: {
        wish: "",
        goal: "",
        fdbks: [""],
        coss: [{ cond: "", cmplt: false }],
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
.position_correction {
  font-weight: normal;
  margin: 0em 0em 0.5em 3em;
}
.category {
  padding-bottom: 1em;
}
.wish {
  background: #eaeded;
  border-radius: 10px;
  padding: 5px 10px;
}
</style>

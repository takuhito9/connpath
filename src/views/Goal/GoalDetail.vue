<template>
  <div>
    <div class="category">
      <p>
        <strong>Wish</strong> <span>{{ goal.wish }}</span>
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
      <GoalConditionOfSuccess :coss="goal.coss"></GoalConditionOfSuccess>
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
import GoalObstacle from "@/views/Goal/GoalObstacle.vue";
import GoalConditionOfSuccess from "@/views/Goal/GoalConditionOfSuccess.vue";

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
  components: { TaskList, GoalConditionOfSuccess, GoalFeedback, GoalObstacle },
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
</style>

<template lang='html'>
  <div>
    <h1>User Name : {{ $store.state.user.displayName }}</h1>
    <br />
    <router-link to="GoalCreate"><button>GoalCreate</button></router-link>
    <router-view />

    <h1>
      <span class="material-icons">flag</span>
      Goal
    </h1>
    <div class="goal__grid">
      <template v-if="isEmpty">
        <vs-alert>
          <template #title>
            not Objects
          </template>
          The goal has not been registered. If you would like to register a new
          goal, please click the Register button above.
        </vs-alert>
      </template>

      <template v-else>
        <div v-for="goal in goals" :key="goal.id">
          <button
            style="cursor:pointer"
            class="goal__item"
            @click="accessGoalPage(goal.docId, goal)"
          >
            <template>
              <h3 class="goalTitle">{{ goal.goal }}</h3>
            </template>
            <template>
              <p>
                {{ goal.deets }} :
                {{ goal.cre_at.toDate().toLocaleDateString("ja-JP") }}
              </p>
            </template>

            <template v-if="goal.cos">
              <div v-for="condition in goal.cos" :key="condition.id">
                {{ condition.cond }} :
                <template v-if="condition.stat">✅</template>
                <template v-else>⬜</template>
              </div>
            </template>
            <template v-else>
              <p>Not Exist Condition of Success</p>
            </template>
          </button>
          <div>
          <button @click="deleteGoal(goal.docId)">
            Delete
          </button>
          </div>
        </div>
      </template>
    </div>

    <pre>{{ goals }}</pre>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db } from "@/main";

export type DataType = {
  goals: object;
  isEmpty: boolean;
  color: string;
};

export default Vue.extend({
  data(): DataType {
    return {
      goals: {},
      isEmpty: false,
      color: "success",
    };
  },
  methods: {
    // list page to detail page
    accessGoalPage(goalId: string, goal: object) {
      this.$store.commit("setSelectingGoal", goal);
      this.$router
        .push({ name: "GoalDetail", params: { id: goalId } })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteGoal(goalId: string) {
      const vm = this;
      const collectionRef = db.collection(
        `users/${vm.$store.state.user.uid}/goals`
      );
      const docRef = collectionRef.doc(goalId);
      docRef
        .delete()
        .then(function () {
          console.log("Delete");
        })
        .catch(function (error) {
          console.error("Don't Delete", error);
        });
    },
  },
  created: function () {
    const vm = this;
    db.collection(`users/${vm.$store.state.user.uid}/goals`)
      .get()
      .then(function (querysnapshot) {
        const dataList = querysnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(), // spread
        }));
        console.log("firebaseにアクセスしました");
        vm.goals = dataList;
        vm.isEmpty = querysnapshot.empty;
      });
  },
});
</script>

<style lg="scss" scoped>
.goal__grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin: 0em 0em 0em 3em;
}
.goal__item {
  border-radius: 10px;
  background: rgb(235, 238, 239);
  border: 0;
  padding: 5px 20px;
  /* margin: 5px; */
  font-size: 15px;
  color: #2c3e50;
  text-align: center;
}
.goal__item:hover,
.goal__item:focus {
  background: #50c38f;
  color: rgb(241, 241, 241);
  transition: 0.2s;
}
.goal_title {
  border: 1px black solid;
  margin: 10px;
  padding: 10px;
}
</style>

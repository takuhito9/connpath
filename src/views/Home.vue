<template>
  <div>
    <h1>User Name : {{ $store.state.user.displayName }}</h1>
    <br />
    <router-link to="NewGoal"><button>New Goal</button></router-link>
    <router-view />

    <div v-if="isEmpty">
      <template>
        <vs-alert>
          <template #title>
            not Objects
          </template>
          The goal has not been registered. If you would like to register a new
          goal, please click the Register button above.
        </vs-alert>
      </template>
    </div>

    <div v-for="goal in goals" :key="goal.id">
      <div
        style="cursor:pointer"
        class="tile"
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
      </div>
      <button @click="deleteGoal(goal.docId)">
        Delete
      </button>
    </div>

    <pre>{{ goals }}</pre>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
const Vuesax = require("vuesax");
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
        .push({ name: "Goal", params: { id: goalId } })
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
        .then(function() {
          console.log("Delete");
        })
        .catch(function(error) {
          console.error("Don't Delete", error);
        });
    },
  },
  created: function() {
    const vm = this;
    db.collection(`users/${vm.$store.state.user.uid}/goals`)
      .get()
      .then(function(querysnapshot) {
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

<style scoped>
.tile {
  border: 1px black solid;
  margin: 10px;
  padding: 10px;
}
</style>

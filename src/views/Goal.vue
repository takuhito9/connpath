<template>
  <div>
    <h1 class="goalTitle">{{ goal.goal }}</h1>
    <h3>{{ goal.deets }}</h3>

    <div class="conditionOfSuccess">
      <template v-if="goal.cos">
        <div v-for="condition in goal.cos" :key="condition.id">
          <button @click="deleteCondition(condition.cond, goal.docId)">
            Delete
          </button>
          {{ condition.cond }} :
          <template v-if="condition.stat">✅ : </template>
          <template v-else>⬜</template>
        </div>
      </template>
      <template v-else>
        <p>Not Exist Condition of Success</p>
      </template>
      <button @click="cosDialog = !cosDialog">Add Condition of Success</button>
    </div>
    <!-- Dialog -->
    <vs-dialog width="300px" not-center v-model="cosDialog">
      <template #header>
        <h4 class="not-margin">Input Condition of Success</h4>
      </template>
      <div class="con-content">
        <vs-input
          v-model="cosInput"
          placeholder="condition of success"
        ></vs-input>
      </div>
      <template #footer>
        <div class="con-footer">
          <vs-button
            @click="(cosDialog = false), addCondition(cosInput, goal.docId)"
            transparent
          >
            Ok
          </vs-button>
          <vs-button @click="cosDialog = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <pre>goal: {{ goal }}</pre>
    <pre>selectingGoal :{{ $store.state.selectingGoal }}</pre>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db, firestore } from "../main";

interface dataType {
  goal: object;
  cosDialog: boolean;
  cosInput: string;
}

export default Vue.extend({
  components: {},
  props: {},
  data(): dataType {
    return {
      goal: {},
      cosDialog: false,
      cosInput: "",
    };
  },
  methods: {
    addCondition: function(condition: string, docId: string) {
      const vm = this;
      const docRef = db
        .collection("users")
        .doc(vm.$store.state.user.uid)
        .collection("goals")
        .doc(docId);
      console.log(docRef);
      docRef
        .update({
          cos: firestore.FieldValue.arrayUnion({
            cond: condition,
            stat: false,
          }),
        })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteCondition: function(condition: string, docId: string) {
      const vm = this;
      const userUId = vm.$store.state.user.uid;
      const docRef = db
        .collection("users")
        .doc(userUId)
        .collection("goals")
        .doc(docId);
      docRef.update({
        cos: firestore.FieldValue.arrayRemove({
          cond: condition,
          stat: false,
        }),
      });
    },
  },
  created() {
    const vm = this;
    const goalId = vm.$route.params.id;
    const docRef = db
      .collection(`users/${vm.$store.state.user.uid}/goals`)
      .doc(goalId);
    docRef.onSnapshot(function(doc) {
      const docData = doc.data();
      if (docData) {
        docData.docId = goalId;
        vm.goal = docData;
        vm.$store.commit("setSelectingGoal", vm.goal);
        console.log(doc, "Firebaseにアクセスしてデータを取得しました");
      } else {
        console.log(Error);
      }
    });
  },
});
</script>

<style scoped>
.conditionOfSuccess {
  background: rgba(192, 241, 225, 0.562);
}
</style>

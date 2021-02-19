<template>
  <div>
    <h1 class="goalTitle">{{ goal.goal }}</h1>
    <h3>{{ goal.deets }}</h3>

    <div class="conditionOfSuccess">
      <template v-if="goal.cos">
        <div v-for="(condition, index) in goal.cos" :key="condition.id">
          <button @click="deleteCondition(condition, goal.docId)">
            🗑
          </button>
          <button @click="showUpdateCondition(condition.cond, index)">
            🖋
          </button>
          {{ condition.cond }} :
          <template v-if="condition.cmplt">✅ : </template>
          <template v-else>⬜</template>
        </div>
      </template>
      <template v-else>
        <p>Not Exist Condition of Success</p>
      </template>
      <button @click="cosAddDialog = !cosAddDialog">
        ➕
      </button>
    </div>

    <!-- Update Conditon of Dialog -->
    <vs-dialog width="" not-center v-model="cosUpdateDialog">
      <template #header>
        <h4 class="not-margin">
          <p>{{ cosUpdateBaseInput }}</p>
        </h4>
      </template>
      <div class="con-content">
        <vs-input
          v-model="cosUpdateNewInput"
          placeholder="condition of success"
        ></vs-input>
      </div>
      <template #footer>
        <div class="con-footer">
          <vs-button
            @click="
              (cosUpdateDialog = false), updateCondition(cosUpdateNewInput, nth)
            "
            transparent
          >
            Ok
          </vs-button>
          <vs-button @click="cosUpdateDialog = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <!-- Add Conditon of Dialog -->
    <vs-dialog width="300px" not-center v-model="cosAddDialog">
      <template #header>
        <h4 class="not-margin">Input Condition of Success</h4>
      </template>
      <div class="con-content">
        <vs-input
          v-model="cosAddInput"
          placeholder="condition of success"
        ></vs-input>
      </div>
      <template #footer>
        <div class="con-footer">
          <vs-button
            @click="
              (cosAddDialog = false), addCondition(cosAddInput, goal.docId)
            "
            transparent
          >
            Ok
          </vs-button>
          <vs-button @click="cosAddDialog = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <pre>goal: {{ goal }}</pre>
    <!-- <pre>selectingGoal :{{ $store.state.selectingGoal }}</pre> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db, firestore } from "../main";

interface dataType {
  goal: object;
  cosAddDialog: boolean;
  cosAddInput: string;
  cosUpdateDialog: boolean;
  cosUpdateBaseInput: string;
  cosUpdateNewInput: string;
  nth: number;
}

export default Vue.extend({
  components: {},
  props: {},
  data(): dataType {
    return {
      goal: {},
      cosAddDialog: false,
      cosAddInput: "",
      cosUpdateDialog: false,
      cosUpdateBaseInput: "",
      cosUpdateNewInput: "",
      nth: 0,
    };
  },
  methods: {
    addCondition: function(cond: string, docId: string) {
      const vm = this;
      const userUId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userUId}/goals/${docId}`);
      console.log(docRef);
      docRef
        .update({
          cos: firestore.FieldValue.arrayUnion({
            cond: cond,
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
    deleteCondition: function(cond: string, docId: string) {
      const vm = this;
      const userUId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userUId}/goals/${docId}`);
      docRef.update({
        cos: firestore.FieldValue.arrayRemove(cond),
      });
    },
    showUpdateCondition: function(cond: string, index: number) {
      this.cosUpdateDialog = true;
      this.cosUpdateBaseInput = cond;
      this.nth = index;
    },
    updateCondition: function(cond: string, nth: number) {
      const vm = this;
      const docId = vm.goal.docId;
      const userUId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userUId}/goals/${docId}`);
      let originalCos = vm.goal.cos;
      originalCos[nth] = { cond: cond, cmplt: false };

      docRef
        .update({ cos: originalCos })
        .then((el) => {
          console.log(el);
          vm.cosUpdateNewInput = "";
        })
        .catch((err) => console.log(err));
    },
  },
  created() {
    const vm = this;
    const goalId = vm.$route.params.id;
    const docRef = db.doc(`users/${vm.$store.state.user.uid}/goals/${goalId}`);
    docRef.onSnapshot(function(doc) {
      const docData = doc.data();
      if (docData) {
        docData.docId = goalId;
        vm.goal = docData;
        vm.$store.commit("setSelectingGoal", vm.goal);
        console.log("Firebaseにアクセスしてデータを取得しました");
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

<template>
  <div>
    <h3>
      <i class="material-icons" style="vertical-align: -4px">rule</i>
      Condition of Success
      <button
        @click="cosAddDialog = !cosAddDialog"
        class="button_positive material-icons"
        style="vertical-align: -5px"
      >
        add_circle
      </button>
    </h3>
    <div v-if="coss">
      <div v-for="(condition, index) in coss" :key="condition.id">
        <GoalConditionOfSuccessList
          :condition="condition"
          :coss="coss"
          :nth="index"
        />
      </div>
    </div>
    <template v-else>
      <p>Not Exist Condition of Success</p>
    </template>

    <!-- Update Conditon of Dialog -->
    <vs-dialog width="" not-center v-model="cosUpdateDialog">
      <template #header>
        <h4>
          <p>{{ cosUpdateBaseInput }}</p>
        </h4>
      </template>
      <div>
        <vs-input
          v-model="cosUpdateNewInput"
          placeholder="condition of success"
        ></vs-input>
      </div>
      <template #footer>
        <div>
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
    <vs-dialog v-model="cosAddDialog">
      <template>
        <h4>Input Condition of Success</h4>
      </template>
      <div>
        <vs-input
          v-model="cosAddInput"
          placeholder="condition of success"
        ></vs-input>
      </div>
      <template #footer>
        <div>
          <vs-button
            @click="(cosAddDialog = false), addCondition(cosAddInput)"
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
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";
import GoalConditionOfSuccessList from "@/views/Goal/GoalConditionOfSuccess/GoalConditionOfSuccessList.vue";

interface conditionOfSuccessType {
  cond: string;
  cmplt: boolean;
}
interface dataType {
  cosAddDialog: boolean;
  cosAddInput: string;
  cosUpdateDialog: boolean;
  cosUpdateBaseInput: string;
  cosUpdateNewInput: string;
  nth: number;
}

export default Vue.extend({
  components: {
    GoalConditionOfSuccessList,
  },
  props: {
    coss: Array as Vue.PropType<Array<conditionOfSuccessType>>,
  },
  data(): dataType {
    return {
      cosAddDialog: false,
      cosAddInput: "",
      cosUpdateDialog: false,
      cosUpdateBaseInput: "",
      cosUpdateNewInput: "",
      nth: 0,
    };
  },
  methods: {
    addCondition: function (cond: conditionOfSuccessType) {
      const vm = this;
      const userUId = vm.$store.state.user.uid;
      const goalId = this.$store.state.selectingGoal.docId;
      const docRef = db.doc(`users/${userUId}/goals/${goalId}`);
      console.log(docRef);
      docRef
        .update({
          coss: firestore.FieldValue.arrayUnion({
            cond: cond,
            cmplt: false,
          }),
        })
        .then((result) => {
          console.log(result);
          vm.cosAddInput = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteCondition: function (cond: conditionOfSuccessType) {
      const vm = this;
      const userUId = vm.$store.state.user.uid;
      const goalId = this.$store.state.selectingGoal.docId;
      const docRef = db.doc(`users/${userUId}/goals/${goalId}`);
      docRef.update({
        coss: firestore.FieldValue.arrayRemove(cond),
      });
    },
    showUpdateCondition: function (cond: string, index: number) {
      this.cosUpdateDialog = true;
      this.cosUpdateBaseInput = cond;
      this.nth = index;
    },
    updateCondition: function (cond: string, nth: number) {
      const vm = this;
      const goalId = this.$store.state.selectingGoal.docId;
      const userUId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userUId}/goals/${goalId}`);
      let originalCos = vm.coss;
      originalCos[nth] = { cond: cond, cmplt: false };
      docRef
        .update({ coss: originalCos })
        .then((el) => {
          console.log(el);
          vm.cosUpdateNewInput = "";
        })
        .catch((err) => console.log(err));
    },
  },
});
</script>
<style lg="scss" scoped>
.position_correction {
  /* font-weight: 500; */
  margin: 0em 0em 0.5em 3em;
}
</style>

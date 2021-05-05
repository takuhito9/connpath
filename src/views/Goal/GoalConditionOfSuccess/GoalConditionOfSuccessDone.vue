<template>
  <div id="overlay">
    <div id="content">
      <template v-if="condition.cmplt">
        <h2>Not Yet ?</h2>
        <button
          @click="$emit('closeDoneOverlay')"
          class="button_cancel"
          ref="focus"
        >
          Cancel
        </button>
        <button @click="doneCondition" class="button_delete">Not Yet</button>
      </template>
      <template v-else>
        <h2>Done ?</h2>
        <button
          @click="$emit('closeDoneOverlay')"
          class="button_cancel"
          ref="focus"
        >
          Cancel
        </button>
        <button @click="doneCondition" class="button_register">Done</button>
      </template>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";
interface cosType {
  cond: string;
  cmplt: boolean;
}

export default Vue.extend({
  props: {
    condition: { type: Object },
    coss: { type: Array as () => Array<cosType> },
    nth: { type: Number },
  },
  data() {
    return {
      // One-Way-Data-Flow
      cossData: JSON.parse(JSON.stringify(this.coss)),
    };
  },
  methods: {
    firstFocus() {
      // @ts-ignore
      this.$refs.focus.focus();
    },
    doneCondition() {
      const vm = this;
      const goalId = vm.$store.state.selectingGoal.docId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}`);
      if (vm.cossData[vm.nth].cmplt == false) {
        vm.cossData[vm.nth].cmplt = true;
      } else {
        vm.cossData[vm.nth].cmplt = false;
      }
      docRef.update({ coss: vm.cossData }).then((el) => {
        console.log(el);
      });
      vm.$emit("closeDoneOverlay");
    },
  },
});
</script> e

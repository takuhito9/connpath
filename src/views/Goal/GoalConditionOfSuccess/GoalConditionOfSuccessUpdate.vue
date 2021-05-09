<template>
  <div id="overlay">
    <div id="content">
      <h2>
        <i class="material-icons" style="vertical-align: -4px">edit</i>
        Update the following ...
      </h2>
      <p>{{ beforeCos.cond }}</p>
      <input
        placeholder="solution"
        v-model.trim="afterCos.cond"
        class="input_text"
        style="margin-right: 2em"
        ref="focus"
      />
      <br />

      <button @click="$emit('closeUpdateOverlay')" class="button_cancel">
        Cancel
      </button>
      <button @click="updateCondition" class="button_register">Update</button>
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
      beforeCos: JSON.parse(JSON.stringify(this.condition)),
      afterCos: JSON.parse(JSON.stringify(this.condition)),
      cossData: JSON.parse(JSON.stringify(this.coss)),
    };
  },
  methods: {
    firstFocus() {
      // @ts-ignore
      this.$refs.focus.focus();
    },
    updateCondition() {
      const vm = this;
      const goalId = vm.$store.state.selectingGoal.docId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}`);
      if (JSON.stringify(vm.beforeCos) === JSON.stringify(vm.afterCos)) {
        alert("内容が同じです");
      } else {
        vm.cossData[vm.nth] = vm.afterCos;
        docRef.update({ coss: vm.cossData }).then((el) => {
          console.log(el);
        });
        vm.$emit("closeUpdateOverlay");
      }
    },
  },
});
</script> 

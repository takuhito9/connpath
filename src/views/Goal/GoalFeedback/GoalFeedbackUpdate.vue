<template>
  <div id="overlay">
    <div id="content">
      <h2>
        <i class="material-icons" style="vertical-align: -4px">edit</i>
        Update the following ...
      </h2>
      <p>{{ beforeFeedback }}</p>
      <input
        placeholder="Feedback"
        v-model.trim="afterFeedback"
        class="input_text"
        style="margin-right: 2em"
        ref="focus"
      />
      <br />

      <button @click="$emit('closeUpdateOverlay')" class="button_cancel">
        Cancel
      </button>
      <button @click="updateFeedback" class="button_register">Update</button>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { db } from "@/main";

export default Vue.extend({
  props: {
    feedback: { type: String },
    fdbks: { type: Array as () => Array<String> },
    nth: { type: Number },
  },
  data() {
    return {
      // One-Way-Data-Flow
      beforeFeedback: JSON.parse(JSON.stringify(this.feedback)),
      afterFeedback: JSON.parse(JSON.stringify(this.feedback)),
      fdbksData: JSON.parse(JSON.stringify(this.fdbks)),
    };
  },
  methods: {
    firstFocus() {
      // @ts-ignore
      this.$refs.focus.focus();
    },
    updateFeedback() {
      const vm = this;
      const goalId = vm.$store.state.selectingGoal.docId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}`);
      if (
        JSON.stringify(vm.beforeFeedback) === JSON.stringify(vm.afterFeedback)
      ) {
        alert("内容が同じです");
      } else {
        vm.fdbksData[vm.nth] = vm.afterFeedback;
        docRef.update({ fdbks: vm.fdbksData }).then((el) => {
          console.log(el);
        });
        vm.$emit("closeUpdateOverlay");
      }
    },
  },
});
</script> p

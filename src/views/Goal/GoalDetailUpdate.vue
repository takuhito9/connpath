<template>
  <div id="overlay">
    <div id="content">
      <h2>
        <i class="material-icons" style="vertical-align: -4px">edit</i>
        Update the following ...
      </h2>
      <p>{{ deets }}</p>
      <input
        placeholder="Feedback"
        v-model.trim="after"
        class="input_text"
        style="margin-right: 2em"
        ref="focus"
      />
      <br />

      <button @click="$emit('closeDetailUpdateOverlay')" class="button_cancel">
        Cancel
      </button>
      <button @click="updateGoalDetail" class="button_register">Update</button>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { db } from "@/main";

export default Vue.extend({
  props: {
    deets: { type: String },
  },
  data() {
    return {
      // One-Way-Data-Flow
      before: JSON.parse(JSON.stringify(this.deets)),
      after: JSON.parse(JSON.stringify(this.deets)),
    };
  },
  methods: {
    firstFocus() {
      // @ts-ignore
      this.$refs.focus.focus();
    },
    updateGoalDetail() {
      const vm = this;
      const goalId = vm.$store.state.selectingGoal.docId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}`);
      if (JSON.stringify(vm.before) === JSON.stringify(vm.after)) {
        alert("内容が同じです");
      } else {
        docRef.update({ deets: vm.after }).then((el) => {
          console.log(el);
        });
        vm.$emit("closeDetailUpdateOverlay");
      }
    },
  },
});
</script>  

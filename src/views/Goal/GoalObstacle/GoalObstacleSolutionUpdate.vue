<template>
  <div id="overlay">
    <div id="content">
      <p>{{ sol.sol }}</p>
      <p>{{ sol.ref }}</p>
      <button @click="updateSolution" class="button_cancel">Update</button>
      <button
        @click="$emit('closeUpdateOverlay')"
        class="button_register"
        ref="focus"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";

interface solType {
  sol: string;
  ref: string;
}

export default Vue.extend({
  props: {
    sol: { type: Object as () => solType },
    solNth: { type: Number },
    obstId: { type: String },
  },

  methods: {
    firstFocus() {
      // @ts-ignore
      this.$refs.focus.focus();
    },
    updateSolution() {
      const vm = this;
      const goalId = vm.$store.state.selectingGoal.docId;
      const userId = vm.$store.state.user.uid;
      const obstId = vm.obstId;
    },
  },
});
</script>

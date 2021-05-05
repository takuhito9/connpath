<template>
  <div id="overlay">
    <div id="content">
      <h2>
        <i class="material-icons" style="vertical-align: -4px">delete</i>
        Delete it
      </h2>

      <p>{{ condition.cond }}</p>
      <br />
      <button
        @click="$emit('closeDeleteOverlay')"
        class="button_cancel"
        ref="focus"
      >
        Cancel
      </button>
      <button @click="deleteConditionOfSuccess" class="button_delete">
        Delete
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";

export default Vue.extend({
  props: {
    condition: { type: Object },
  },

  methods: {
    firstFocus() {
      // @ts-ignore
      this.$refs.focus.focus();
    },
    deleteConditionOfSuccess() {
      const vm = this;
      const goalId = vm.$store.state.selectingGoal.docId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}`);
      docRef
        .update({ coss: firestore.FieldValue.arrayRemove(vm.condition) })
        .then(() => {
          vm.$emit("closeDeleteOverlay");
        });
    },
  },
});
</script>

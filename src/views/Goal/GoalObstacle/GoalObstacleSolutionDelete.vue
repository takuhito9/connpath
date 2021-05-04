<template>
  <div id="overlay">
    <div id="content">
      <h2>
        <i class="material-icons" style="vertical-align: -4px">delete</i>
        Delete it
      </h2>

      <p>{{ sol.sol }}</p>
      <p>{{ sol.ref }}</p>
      <br />
      <button
        @click="$emit('closeDeleteOverlay')"
        class="button_cancel"
        ref="focus"
      >
        Cancel
      </button>
      <button @click="deleteSolution" class="button_delete">Delete</button>
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
  components: {},
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
    deleteSolution() {
      const vm = this;
      const goalId = vm.$store.state.selectingGoal.docId;
      const userId = vm.$store.state.user.uid;
      const obstId = vm.obstId;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/obstacles/${obstId}`
      );
      docRef
        .update({ sols: firestore.FieldValue.arrayRemove(vm.sol) })
        .then((result) => {
          vm.$emit("closeDeleteOverlay");
        });
    },
  },
});
</script>


<template>
  <div>
    <div id="overlay">
      <div id="content">
        <h2>
          <i class="material-icons" style="vertical-align: -4px">delete</i>
          Delete it
        </h2>

        <p>{{ obst.obst }}</p>
        <br />
        <ul v-for="sol in obst.sols" style="text-align: left" :key="sol.id">
          <li>
            {{ sol.sol }}<br />
            {{ sol.ref }}
          </li>
        </ul>
        <br />
        <button
          @click="$emit('closeDeleteOverlay')"
          class="button_cancel"
          ref="focus"
        >
          Cancel
        </button>
        <button @click="deleteObstacle" class="button_delete">Delete</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";

interface obstType {
  docId: string;
  obst: string;
  sols: {
    ref: string;
    sol: string;
  };
}

export default Vue.extend({
  props: {
    obst: { type: Object as () => obstType },
  },
  methods: {
    firstFocus() {
      // @ts-ignore
      this.$refs.focus.focus();
    },
    deleteObstacle() {
      const vm = this;
      const goalId = vm.$store.state.selectingGoal.docId;
      const userId = vm.$store.state.user.uid;
      const obstId = vm.obst.docId;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/obstacles/${obstId}`
      );
      docRef
        .delete()
        .then(() => {
          console.log("deleted");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
  },
});
</script>

<template>
  <div>
    <div id="overlay">
      <div id="content">
        <h2>
          <i class="material-icons" style="vertical-align: -4px">edit</i>
          Update the following ...
        </h2>

        <p style="margin: 1em 4em; text-align: left">{{ obst.obst }}</p>
        <input
          placeholder="Obstacle"
          v-model="afterObst.obst"
          class="input_text"
          style="margin: 9.5px 2em 0 2em"
          ref="focus"
        />
        <br />
        <button @click="$emit('closeUpdateOverlay')" class="button_cancel">
          Cancel
        </button>
        <button @click="updateObstacle" class="button_register">Update</button>
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
  data() {
    return {
      beforeObst: JSON.parse(JSON.stringify(this.obst)),
      afterObst: JSON.parse(JSON.stringify(this.obst)),
    };
  },
  methods: {
    firstFocus() {
      // @ts-ignore
      this.$refs.focus.focus();
    },
    updateObstacle() {
      const vm = this;
      const goalId = vm.$store.state.selectingGoal.docId;
      const userId = vm.$store.state.user.uid;
      const obstId = vm.obst.docId;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/obstacles/${obstId}`
      );
      if (
        JSON.stringify(vm.beforeObst.obst) === JSON.stringify(vm.afterObst.obst)
      ) {
        alert("内容が同じです");
      } else {
        docRef
          .update({ obst: vm.afterObst.obst })
          .then(() => {
            console.log("Document successfully updated!");
          })
          .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }
    },
  },
});
</script>i

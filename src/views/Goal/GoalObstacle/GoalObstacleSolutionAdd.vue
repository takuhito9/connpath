<template>
  <div>
    <!-- Add Solution Form -->
    <template v-if="!flag"
      ><button
        @click="displaySolution"
        class="button_positive"
        style="margin-left: 49px; margin-bottom: 0px"
      >
        <i
          class="material-icons"
          style="margin-right: 5%; vertical-align: -5px"
          add_solution_input
        >
          add_circle
        </i>

        <div style="margin: 0; padding: 0">
          <i
            class="material-icons"
            style="font-size: 12px; vertical-align: -2px"
            >lightbulb</i
          >
        </div>
      </button>
    </template>
    <template v-else>
      <div class="add_solution_input">
        <i class="material-icons" style="font-size: 1em">lightbulb</i>
        <input
          v-model.trim="newSolution"
          class="input_text input_text_fix"
          type="text"
          ref="inputFocus"
          placeholder="Solution"
        />
        <input
          v-model.trim="newReference"
          style="margin-left: 1.9em; margin-top: 7px"
          class="input_text_url"
          type="url"
          placeholder="URL"
        />
      </div>
      <div style="margin-left: 6.5em">
        <button @click="cancel" class="button_cancel">Cancel</button>
        <button @click="addSolution" class="button_register">Register</button>
      </div>
    </template>
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
    obst: { type: Object as Vue.PropType<obstType> },
  },
  data() {
    return {
      flag: false,
      newSolution: "",
      newReference: "",
    };
  },

  methods: {
    displaySolution() {
      this.flag = true;
      // @ts-ignore
      this.$nextTick(() => this.$refs.inputFocus.focus());
    },
    addSolution() {
      const vm = this;
      const userId = vm.$store.state.user.uid;
      const goalId = vm.$store.state.selectingGoal.docId;
      const obstId = vm.obst.docId;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/obstacles/${obstId}`
      );
      docRef
        .update({
          sols: firestore.FieldValue.arrayUnion({
            sol: vm.newSolution,
            ref: vm.newReference,
          }),
        })
        .then((result) => {
          console.log(result);
          this.flag = false;
          vm.newSolution = "";
          vm.newReference = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancel() {
      const vm = this;
      if (vm.newSolution || vm.newReference) {
        alert("文字が入力されているよ");
      } else {
        this.flag = false;
        vm.newSolution = "";
        vm.newReference = "";
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.add_solution_input {
  padding-top: 0em;
  margin-left: 5.9em;
}
.input_text_fix {
  margin: 0 0 3px 0.9em;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>

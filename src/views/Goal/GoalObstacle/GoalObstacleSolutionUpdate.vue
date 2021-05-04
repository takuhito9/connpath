<template>
  <div id="overlay">
    <div id="content">
      <h2>
        <i class="material-icons" style="vertical-align: -4px">lightbulb </i>
        Update it
      </h2>
      <input
        placeholder="solution"
        v-model.trim="afterSol.sol"
        class="input_text"
        style="margin-right: 2em"
      />
      <input
        placeholder="reference url"
        v-model.trim="afterSol.ref"
        class="input_text_url"
        style="margin: 9.7px 2em 0 2em"
      />
      <br />
      <br />

      <button
        @click="$emit('closeUpdateOverlay')"
        class="button_cancel"
        ref="focus"
      >
        Cancel
      </button>
      <button @click="updateSolution" class="button_register">Update</button>
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
    sols: { type: Array as () => Array<solType> },
    sol: { type: Object as () => solType },
    solNth: { type: Number },
    obstId: { type: String },
  },

  data() {
    return {
      // One-Way-Data-Flow
      beforeSol: JSON.parse(JSON.stringify(this.sol)),
      afterSol: JSON.parse(JSON.stringify(this.sol)),
      solsData: JSON.parse(JSON.stringify(this.sols)),
    };
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
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/obstacles/${obstId}`
      );
      if (JSON.stringify(vm.beforeSol) === JSON.stringify(vm.afterSol)) {
        alert("内容が同じです");
      } else {
        vm.solsData[vm.solNth] = vm.afterSol;
        docRef.update({ sols: vm.solsData }).then((el) => {
          console.log(el);
        });
        vm.$emit("closeUpdateOverlay");
      }
    },
  },
});
</script>

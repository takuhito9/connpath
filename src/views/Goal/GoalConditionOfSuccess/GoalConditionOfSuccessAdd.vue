<template>
  <div style="position: relative">
    <template v-if="!editMode">
      <template v-if="isCosExist">
        <button class="button_positive add_button" @click="toEditMode">
          <i
            class="material-icons"
            style="margin-right: 5%; vertical-align: -5px"
          >
            add_circle
          </i>
        </button>
      </template>
      <template v-else>
        <button class="click_me" @click="toEditMode">
          <span
            ><i
              class="material-icons"
              style="vertical-align: -6px; font-size: 1em"
            >
              add
            </i>
            Condition of Success</span
          >
        </button>
      </template>
    </template>
    <template v-else>
      <div style="margin: 0.5em 0em 0 2.5em">
        <input
          v-model.trim="newCondition"
          class="input_text"
          type="text"
          placeholder="New Condition of success"
          ref="inputFocus"
        />
        <div style="margin: 0.7em">
          <button @click="cancel" class="button_cancel">Cancel</button>
          <button @click="addCondition" class="button_register">
            Register
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";

export default Vue.extend({
  data() {
    return {
      editMode: false,
      newCondition: "",
    };
  },
  props: {
    isCosExist: { type: Boolean },
  },
  methods: {
    toEditMode() {
      this.editMode = true;
      // @ts-ignore
      this.$nextTick(() => this.$refs.inputFocus.focus());
    },
    addCondition() {
      const vm = this;
      const userId = vm.$store.state.user.uid;
      const goalId = vm.$store.state.selectingGoal.docId;
      const docRef = db.doc(`users/${userId}/goals/${goalId}`);
      docRef
        .update({
          coss: firestore.FieldValue.arrayUnion({
            cond: vm.newCondition,
            cmplt: false,
          }),
        })
        .then((result) => {
          console.log(result);
          this.editMode = false;
          vm.newCondition = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },

    cancel() {
      const vm = this;
      if (vm.newCondition) {
        alert("文字が入力されているよ");
      } else {
        vm.editMode = false;
        vm.newCondition = "";
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.add_button {
  position: absolute;
  left: -19px;
}
.click_me {
  border: 7px dashed #d5d6d8;
  background: none;
  width: 90%;
  height: 10em;
  border-radius: 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 3em;
    font-weight: 700;
    color: #d5d6d8;
  }
  &:focus {
    border: 7px dashed #50c38f;
    transition: 0.3s;
    span {
      color: #50c38f;
      transition: 0.3s;
    }
  }
  &:hover {
    border: 7px dashed #50c38f;
    transition: 0.3s;
  }
}
.click_me.click_me:hover span {
  color: #50c38f;
  transition: 0.3s;
}
</style>

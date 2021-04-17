<template>
  <div>
    <div id="task__condition-of-success">
      <h3>
        <i
          class="material-icons"
          style="vertical-align: -5px; margin-left: 10px"
          >rule</i
        >
        Condition of Success
        <button
          class="button_positive material-icons"
          @click="cosAddDialog = !cosAddDialog"
          style="vertical-align: -5px"
        >
          add_circle
        </button>
      </h3>
      <div id="task__condition-of-success__list" v-if="cos">
        <template v-if="cos.length">
          <div
            v-for="(condition, index) in cos"
            :key="condition.id"
            class="task__condition-of-success__item"
          >
            <template v-if="condition.cmplt"
              ><button
                @click="showNotYetCondition(index)"
                class="button_positive material-icons"
                style="vertical-align: -6px"
              >
                check_box
              </button>
            </template>
            <template v-else
              ><button
                @click="showDoneCondition(index)"
                class="button_positive material-icons"
                style="vertical-align: -6px"
              >
                indeterminate_check_box
              </button>
            </template>
            <span
              :class="{
                doneCosStyle: condition.cmplt,
              }"
            >
              {{ condition.cond }}</span
            >

            <span style="position: absolute; right: 11%">
              <button
                class="button_positive material-icons button_negative"
                @click="showDeleteCondition(condition)"
                @mouseover="deleteActive = true"
                @mouseout="deleteActive = false"
              >
                delete
              </button>
              <button
                class="button_positive material-icons"
                @click="showUpdateCondition(condition.cond, index)"
              >
                edit
              </button>
            </span>
          </div>
        </template>
        <template v-else>
          <p>Not Exist Condition of Success</p>
        </template>
      </div>
    </div>

    <!-- Update Conditon of Dialog -->
    <vs-dialog width="" not-center v-model="cosUpdateDialog">
      <h4>Before change : {{ cosUpdateBaseInput }}</h4>
      <div>
        Before change :
        <input v-model="cosUpdateNewInput" placeholder="condition of success" />
      </div>
      <template #footer>
        <div>
          <button
            @click="
              (cosUpdateDialog = false),
                updateCondition(cosUpdateNewInput, cosUpdateNth)
            "
          >
            Ok
          </button>
          <button @click="cosUpdateDialog = false">Cancel</button>
        </div>
      </template>
    </vs-dialog>

    <!-- Add Conditon of Dialog -->
    <vs-dialog width="300px" not-center v-model="cosAddDialog">
      <template #header>
        <h4>Input Condition of Success</h4>
      </template>
      <div>
        <vs-input
          v-model="cosAddInput"
          placeholder="condition of success"
        ></vs-input>
      </div>
      <template #footer>
        <div>
          <vs-button
            @click="(cosAddDialog = false), addCondition(cosAddInput)"
            transparent
          >
            Ok
          </vs-button>
          <vs-button @click="cosAddDialog = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <!-- Delete Conditon of Dialog -->
    <vs-dialog width="300px" not-center v-model="deleteConditionDialog">
      <template #header>
        <h4>Delete ?</h4>
      </template>
      <div></div>
      <template #footer>
        <div>
          <button
            @click="
              (deleteConditionDialog = false), deleteCondition(cosDoneNth)
            "
            transparent
          >
            Delete
          </button>
          <vs-button @click="deleteConditionDialog = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <!-- Done Conditon of Dialog -->
    <vs-dialog width="300px" not-center v-model="cosDoneDialog">
      <template #header>
        <h4>Done ?</h4>
      </template>
      <div></div>
      <template #footer>
        <div>
          <vs-button
            @click="(cosDoneDialog = false), doneCondition(cosDoneNth)"
            transparent
          >
            Done
          </vs-button>
          <vs-button @click="cosDoneDialog = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <!-- Not Yet Conditon of Dialog -->
    <vs-dialog width="300px" not-center v-model="cosNotYetDialog">
      <template #header>
        <h4>Not Yet ?</h4>
      </template>
      <div></div>
      <template #footer>
        <div>
          <vs-button
            @click="(cosNotYetDialog = false), NotYetCondition(cosNotYetNth)"
            transparent
          >
            Not Yet
          </vs-button>
          <vs-button @click="cosNotYetDialog = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";

interface conditionOfSuccessType {
  cond: string;
  cmplt: boolean;
}

interface dataType {
  cosAddDialog: boolean;
  cosAddInput: string;

  cosUpdateDialog: boolean;
  cosUpdateBaseInput: string;
  cosUpdateNewInput: string;
  cosUpdateNth: number;

  deleteConditionDialog: boolean;
  deleteConditionContent: object;

  cosDoneDialog: boolean;
  cosDoneNth: number;

  cosNotYetDialog: boolean;
  cosNotYetNth: number;
}

export default Vue.extend({
  props: {
    cos: Array as Vue.PropType<Array<conditionOfSuccessType>>,
  },

  data(): dataType {
    return {
      cosAddDialog: false,
      cosAddInput: "",

      deleteConditionDialog: false,
      deleteConditionContent: [],

      cosUpdateDialog: false,
      cosUpdateBaseInput: "",
      cosUpdateNewInput: "",
      cosUpdateNth: 0,

      cosDoneDialog: false,
      cosDoneNth: 0,

      cosNotYetDialog: false,
      cosNotYetNth: 0,
    };
  },
  methods: {
    addCondition(cond: string) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      console.log(docRef);
      docRef
        .update({
          cos: firestore.FieldValue.arrayUnion({
            cond: cond,
            cmplt: false,
          }),
        })
        .then((result) => {
          console.log(result);
          vm.cosAddInput = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showDeleteCondition(content: object) {
      this.deleteConditionDialog = true;
      this.deleteConditionContent = content;
    },
    deleteCondition() {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      docRef.update({
        cos: firestore.FieldValue.arrayRemove(vm.deleteConditionContent),
      });
      vm.deleteConditionDialog = false;
    },
    showUpdateCondition(cond: string, index: number) {
      this.cosUpdateDialog = true;
      this.cosUpdateBaseInput = cond;
      this.cosUpdateNth = index;
    },
    updateCondition(cond: string, cosUpdateNth: number) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      let originalCos = vm.cos;
      // Do not change the boolean value.
      const nowCmplt = vm.cos[cosUpdateNth].cmplt;
      originalCos[cosUpdateNth] = { cond: cond, cmplt: nowCmplt };
      docRef
        .update({ cos: originalCos })
        .then((el) => {
          console.log(el);
          vm.cosUpdateNewInput = "";
        })
        .catch((err) => console.log(err));
    },
    showDoneCondition(index: number) {
      this.cosDoneDialog = true;
      this.cosDoneNth = index;
    },
    doneCondition(cosDoneNth: number) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      let originalCos = vm.cos;
      const nowCond = vm.cos[cosDoneNth].cond;
      originalCos[cosDoneNth] = { cond: nowCond, cmplt: true };
      docRef
        .update({ cos: originalCos })
        .then((el) => {
          console.log(el);
        })
        .catch((err) => console.log(err));
    },
    showNotYetCondition(index: number) {
      this.cosNotYetDialog = true;
      this.cosNotYetNth = index;
    },
    NotYetCondition(cosNotYetNth: number) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      let originalCos = vm.cos;
      const nowCond = vm.cos[cosNotYetNth].cond;
      originalCos[cosNotYetNth] = { cond: nowCond, cmplt: false };
      docRef
        .update({ cos: originalCos })
        .then((el) => {
          console.log(el);
        })
        .catch((err) => console.log(err));
    },
  },
});
</script>

<style lang="scss" scoped>
#task__condition-of-success {
  text-align: left;
  font-weight: normal;
}
#task__condition-of-success__list {
  margin: 0em 4em 0em 3em;
}
.task__condition-of-success__item {
  margin: 0.5em 0em;
}
.doneCosStyle {
  color: #757575fb;
  text-decoration: line-through;
}
</style>


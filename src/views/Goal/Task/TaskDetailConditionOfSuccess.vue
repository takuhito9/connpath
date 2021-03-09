<template>
  <div>
    <div id="task__condition-of-success">
      <h3>
        <i
          class="material-icons "
          style="vertical-align: -5px; margin-left: 10px;"
          >rule</i
        >
        Condition of Success
        <button
          class="button__design material-icons"
          @click="cosAddDialog = !cosAddDialog"
          style="vertical-align: -5px;"
        >
          add_circle
        </button>
      </h3>
      <div id="task__condition-of-success__list" v-if="cos">
        <template v-if="cos.length">
          <div v-for="(condition, index) in cos" :key="condition.id">
            <template v-if="condition.cmplt">✔</template>
            <template v-else>□</template>
            <span style="position: relative"> {{ condition.cond }}</span>
            <span style="position: absolute; right: 11%">
              <button
                class="button__design material-icons"
                @click="deleteCondition(condition)"
              >
                delete
              </button>
              <button
                class="button__design material-icons"
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
      <template #header>
        <h4>
          <p>{{ cosUpdateBaseInput }}</p>
        </h4>
      </template>
      <div>
        <vs-input
          v-model="cosUpdateNewInput"
          placeholder="condition of success"
        ></vs-input>
      </div>
      <template #footer>
        <div>
          <vs-button
            @click="
              (cosUpdateDialog = false),
                updateCondition(cosUpdateNewInput, cosNth)
            "
            transparent
          >
            Ok
          </vs-button>
          <vs-button @click="cosUpdateDialog = false" dark transparent>
            Cancel
          </vs-button>
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
  cosNth: number;
}

export default Vue.extend({
  props: {
    cos: Array as Vue.PropType<Array<conditionOfSuccessType>>,
  },

  data(): dataType {
    return {
      cosAddDialog: false,
      cosAddInput: "",
      cosUpdateDialog: false,
      cosUpdateBaseInput: "",
      cosUpdateNewInput: "",
      cosNth: 0,
    };
  },
  methods: {
    addCondition: function(cond: string) {
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
    deleteCondition: function(cond: string) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      docRef.update({
        cos: firestore.FieldValue.arrayRemove(cond),
      });
    },
    showUpdateCondition: function(cond: string, index: number) {
      this.cosUpdateDialog = true;
      this.cosUpdateBaseInput = cond;
      this.cosNth = index;
    },
    updateCondition: function(cond: string, cosNth: number) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      let originalCos = vm.cos;
      originalCos[cosNth] = { cond: cond, cmplt: false };
      docRef
        .update({ cos: originalCos })
        .then((el) => {
          console.log(el);
          vm.cosUpdateNewInput = "";
        })
        .catch((err) => console.log(err));
    },
  },
});
</script>

<style lang="scss" scoped>
.button__design {
  border: none;
  background: none;
  color: #4c4c4c;
}
.button__design:hover,
.button__design:focus {
  color: #50c38f;
  transition: 0.2s;
}
#task__condition-of-success {
  text-align: left;
  font-weight: normal;
}
#task__condition-of-success__list {
  margin: 0em 4em 0em 3em;
}
</style>

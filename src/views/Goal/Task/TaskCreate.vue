<template>
  <div>
    <h4 class="goal__title">📈 {{ $store.state.selectingGoal.goal }}</h4>
    <h2>🏃🏻New Task</h2>
    <p>Enter the new task and its details.</p>
    <h1 id="task__title">👉 {{ task }}</h1>

    <input
      class="input__design"
      required
      border
      v-model="task"
      placeholder="Task"
    /><br />
    <textarea
      class="input__design"
      border
      v-model="deets"
      placeholder="Details"
    ></textarea>

    <div name="reason">
      <h2>Reason and Feedback</h2>
      <p>
        ❶ Reason : why you are doing this task. <br />
        ❷ Feedback : what you will get in return for completing the task.<br />
        Please tell us the above.
      </p>

      <div v-for="(reason, index) in reasons" :key="reason.id">
        <input
          class="input__design"
          required
          border
          v-model="reasons[index]"
          placeholder="❶ Reason"
        /><button
          class="button__design material-icons"
          @click="deleteReasonForm(index)"
        >
          delete
        </button>
      </div>
      <button
        class="button__design material-icons"
        style="margin-left: 85%;"
        @click="addReasonForm"
      >
        add_circle
      </button>

      <br /><br />

      <div v-for="(feedback, index) in feedbacks" :key="feedback.id">
        <input
          class="input__design"
          required
          border
          v-model="feedbacks[index]"
          placeholder="❷ Feedback"
        /><button
          class="button__design material-icons"
          @click="deleteFeedbackForm(index)"
        >
          delete
        </button>
      </div>
      <button
        class="button__design material-icons"
        style="margin-left: 85%;"
        @click="addFeedbackForm"
      >
        add_circle
      </button>
    </div>

    <div name="pre" class="predict">
      <h2>Let's predict.</h2>
      <div name="satis">
        <vs-tooltip>
          <label>
            <h3>
              😊 Predict how satisfied you will be when the task is completed.
            </h3>
            <input
              type="number"
              name="pre_satis"
              min="0"
              max="100"
              v-model.number="fdbk.pre_satis"
              class="number-input"
            /><span style="font-weight: bold;"> % / 100 % </span>
          </label>
          <template #tooltip>
            From 0 to 100
          </template>
        </vs-tooltip>
      </div>
      <div name="dfclt">
        <vs-tooltip>
          <label>
            <h3>
              🌋 Predict the difficulty of the task.
            </h3>
            <input
              type="number"
              name="pre_dfclt"
              min="0"
              max="10"
              v-model.number="fdbk.pre_dfclt"
              class="number-input"
            /><span style="font-weight: bold;"> Level / 10 Level</span>
          </label>
          <template #tooltip>
            From Level 0 to Level 10
          </template>
        </vs-tooltip>
      </div>
    </div>

    <div name="status" class="status">
      <h2>Status:{{ status }}</h2>
      <label for="0">
        <input
          class="radio__button"
          type="radio"
          name="status"
          value="0"
          v-model="status"
        />
        🦾 in progress
      </label>
      <br />
      <label for="1">
        <input
          class="radio__button"
          type="radio"
          name="status"
          value="1"
          v-model="status"
        />
        😪 not started
      </label>
    </div>

    <br />
    <button class="button__register material-icons" @click="setTask">
      done
    </button>
    <router-view></router-view>

    <div>
      <p>The list of uncompleted tasks is as follows</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";

interface taskObjectType {
  task: string;
  deets: string;
  status: number;
  cre_at: {
    seconds: number;
    nanoseconds: number;
  };
  fdbk: {
    pre_dfclt: number;
    pre_satis: number;
  };
  reasons: string[];
  feedbacks: string[];
}

export default Vue.extend({
  data(): taskObjectType {
    return {
      task: "",
      deets: "",
      cre_at: {
        seconds: 0,
        nanoseconds: 0,
      },
      fdbk: {
        pre_dfclt: 0,
        pre_satis: 0,
      },
      status: 0,
      reasons: [""],
      feedbacks: [""],
    };
  },
  methods: {
    addReasonForm: function() {
      this.reasons.push("");
    },
    deleteReasonForm: function(index: number) {
      this.reasons.splice(index, 1);
    },
    addFeedbackForm: function() {
      this.feedbacks.push("");
    },
    deleteFeedbackForm: function(index: number) {
      this.feedbacks.splice(index, 1);
    },
    setTask: function() {
      const vm = this;
      const userId = vm.$store.state.user.uid;
      const goalId = vm.$store.state.selectingGoal.docId;
      const docRef = db.collection(`users/${userId}/goals/${goalId}/tasks`);

      if (!vm.task) {
        alert("Task名は必須です");
      } else {
        let reasons: string[] = [];
        let feedbacks: string[] = [];
        const data = {
          task: vm.task,
          deets: vm.deets,
          fdbk: {
            pre_satis: vm.fdbk.pre_satis,
            pre_dfclt: vm.fdbk.pre_dfclt,
          },
          // 0 -> in_Progress, 1-> Not Started,  2 -> Done
          status: vm.status,
          cre_at: firestore.FieldValue.serverTimestamp(),
          reasons: reasons,
          feedbacks: feedbacks,
        };
        if (vm.reasons[0]) {
          data.reasons = vm.reasons;
        }
        if (vm.feedbacks[0]) {
          data.feedbacks = vm.feedbacks;
        }
        docRef
          .add(data)
          .then(function(docRef) {
            console.log(docRef, "Document Successfully Written!!!");
            vm.$router.push({
              name: "TaskDetail ",
              params: {
                goalId: goalId,
                taskId: docRef.id,
              },
            });
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.goal__title {
  color: #42b983;
}
.task__title {
  padding-left: 1em;
  text-indent: -1em;
  margin: 0em 9% 1em 0em;
}
.input__design {
  width: 80%;
  padding: 0.5em;
  font-size: 16px;
  border: solid 2px #e1e3e8;
  border-radius: 4px;
  margin: 0.5em 0em 0em 2em;
}
.number-input {
  padding: 0.5em;
  font-size: 1em;
  border: solid 2px #e1e3e8;
  border-radius: 4px;
  margin: 0em 0em 0em 2em;
}
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
.radio__button {
  height: 25px;
  width: 25px;
  cursor: pointer;
  margin-right: 10px;
  vertical-align: -7px;
  margin: 1em 1em 1em 2em;
}
.button__register {
  margin: 10px 20px;
  padding: 0.5em 3em;
  border-radius: 20px;
  border: 2px solid #4c4c4c5f;
  font-weight: bold;
  color: #4c4c4c;
  background: #f6f6f6;
}
.button__register:hover,
.button__register:focus {
  color: #f6f6f6;
  background: #42b983;
  transition: 0.2s;
}
</style>

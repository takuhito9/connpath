<template>
  <div>
    <h4 class="goal_title">📈 {{ $store.state.selectingGoal.goal }}</h4>
    <h2>🏃🏻New Task</h2>
    <p>Enter the new task and its details.</p>
    <h1 id="task_title">👉 {{ task }}</h1>

    <input class="input_text" v-model="task" placeholder="Task" />
    <textarea
      class="input_text"
      v-model="deets"
      placeholder="Details"
    ></textarea>

    <div name="reason">
      <h2>Reason and Feedback</h2>
      <p>❶ Reason : why you are doing this task. <br /></p>

      <div v-for="(reason, index) in reasons" :key="reason.id">
        <input
          class="input_text"
          v-model="reasons[index]"
          placeholder="❶ Reason"
        /><button
          class="button_positive material-icons"
          @click="deleteReasonForm(index)"
        >
          delete
        </button>
      </div>
      <button
        class="button_positive material-icons"
        style="margin-left: 85%"
        @click="addReasonForm"
      >
        add_circle
      </button>

      <br /><br />

      <p>
        ❷ Feedback : what you will get in return for completing the task.<br />
      </p>

      <div v-for="(feedback, index) in feedbacks" :key="feedback.id">
        <input
          class="input_text"
          v-model="feedbacks[index]"
          placeholder="❷ Feedback"
        /><button
          class="button_positive material-icons"
          @click="deleteFeedbackForm(index)"
        >
          delete
        </button>
      </div>
      <button
        class="button_positive material-icons"
        style="margin-left: 85%"
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
              class="input_number"
            /><span style="font-weight: bold"> % / 100 % </span>
          </label>
          <template #tooltip> From 0 to 100 </template>
        </vs-tooltip>
      </div>
      <div name="dfclt">
        <vs-tooltip>
          <label>
            <h3>🌋 Predict the difficulty of the task.</h3>
            <input
              type="number"
              name="pre_dfclt"
              min="0"
              max="10"
              v-model.number="fdbk.pre_dfclt"
              class="input_number"
            /><span style="font-weight: bold"> Level / 10 Level</span>
          </label>
          <template #tooltip> From Level 0 to Level 10 </template>
        </vs-tooltip>
      </div>
    </div>

    <div name="status" class="status">
      <h2>Status:{{ status }}</h2>
      <label for="0">
        <input
          class="input_radio"
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
          class="input_radio"
          type="radio"
          name="status"
          value="1"
          v-model="status"
        />
        😪 not started
      </label>
    </div>

    <br />
    <button class="button_register material-icons" @click="setTask">
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
    addReasonForm: function () {
      this.reasons.push("");
    },
    deleteReasonForm: function (index: number) {
      this.reasons.splice(index, 1);
    },
    addFeedbackForm: function () {
      this.feedbacks.push("");
    },
    deleteFeedbackForm: function (index: number) {
      this.feedbacks.splice(index, 1);
    },
    setTask: function () {
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
          .then(function (docRef) {
            console.log(docRef, "Document Successfully Written!!!");
            vm.$router.push({
              name: "TaskDetail",
              params: {
                goalId: goalId,
                taskId: docRef.id,
              },
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
  },
});
</script>


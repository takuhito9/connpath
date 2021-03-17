<template>
  <div class="task__motivation__position">
    <div>
      <h3>
        <i class="material-icons" style="vertical-align: -5px; ">
          help_outline
        </i>
        Reason
        <button
          @click="reasonAddDialog = !reasonAddDialog"
          class="material-icons button__design"
          style="vertical-align: -5px;"
        >
          add_circle
        </button>
      </h3>
      <template v-if="reasons">
        <div v-if="reasons.length">
          <div
            id="task__reason"
            v-for="(reason, index) in reasons"
            :key="reason.id"
          >
            <span style="position: relative">{{ reason }}</span>
            <span style="position: absolute; right: 11%">
              <button
                class="button__design material-icons button__design__delete"
                @click="deleteReason(reason)"
              >
                delete
              </button>
              <button
                class="button__design material-icons "
                @click="showUpdateReason(reason, index)"
              >
                edit
              </button>
            </span>
          </div>
        </div>
      </template>
      <template v-else>
        <p>Not Exist Reason</p>
      </template>
    </div>

    <br />

    <div>
      <h3>
        <span class="material-icons" style="vertical-align: -5px;">
          card_giftcard
        </span>
        Feedback
        <button
          @click="feedbackAddDialog = !feedbackAddDialog"
          class="material-icons button__design"
          style="vertical-align: -5px;"
        >
          add_circle
        </button>
      </h3>
      <template v-if="feedbacks">
        <div v-if="feedbacks.length">
          <div
            id="task__feedback"
            v-for="(feedback, index) in feedbacks"
            :key="feedback.id"
          >
            <span style="position: relative">{{ feedback }}</span>
            <span style="position: absolute; right: 11%">
              <button
                class="button__design material-icons button__design__delete"
                @click="deleteFeedback(feedback)"
              >
                delete
              </button>
              <button
                class="button__design material-icons"
                @click="showUpdateFeedback(feedback, index)"
              >
                edit
              </button>
            </span>
          </div>
        </div>
      </template>
      <template v-else>
        <p>Not Exist Feedback</p>
      </template>
    </div>
    <br />

    <!-- Update Reason -->
    <vs-dialog not-center v-model="reasonUpdateDialog">
      <template #header>
        <h4>
          <p>{{ reasonUpdateBaseInput }}</p>
        </h4>
      </template>
      <div>
        <vs-input
          v-model="reasonUpdateNewInput"
          placeholder="updete reason"
        ></vs-input>
      </div>
      <template #footer>
        <div>
          <vs-button
            @click="
              (reasonUpdateDialog = false),
                updateReason(reasonUpdateNewInput, reasonNth)
            "
            transparent
          >
            Ok
          </vs-button>
          <vs-button @click="reasonUpdateDialog = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <!-- Add Reason-->
    <vs-dialog not-center v-model="reasonAddDialog">
      <template #header>
        <h4>Input Reason</h4>
      </template>
      <div>
        <vs-input v-model="reasonAddInput" placeholder="reason"></vs-input>
      </div>
      <template #footer>
        <div>
          <vs-button
            @click="(reasonAddDialog = false), createReason(reasonAddInput)"
            transparent
          >
            Ok
          </vs-button>
          <vs-button @click="reasonAddDialog = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <!-- Update Feedback -->
    <vs-dialog not-center v-model="feedbackUpdateDialog">
      <template #header>
        <h4>
          <p>{{ feedbackUpdateBaseInput }}</p>
        </h4>
      </template>
      <div>
        <vs-input
          v-model="feedbackUpdateNewInput"
          placeholder="updete Feedback"
        ></vs-input>
      </div>
      <template #footer>
        <div>
          <vs-button
            @click="
              (feedbackUpdateDialog = false),
                updateFeedback(feedbackUpdateNewInput, feedbackNth)
            "
            transparent
          >
            Ok
          </vs-button>
          <vs-button @click="feedbackUpdateDialog = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <!-- Add Feedback-->
    <vs-dialog not-center v-model="feedbackAddDialog">
      <template #header>
        <h4>Input Feedback</h4>
      </template>
      <div>
        <vs-input v-model="feedbackAddInput" placeholder="feedback"></vs-input>
      </div>
      <template #footer>
        <div>
          <vs-button
            @click="
              (feedbackAddDialog = false), createFeedback(feedbackAddInput)
            "
            transparent
          >
            Ok
          </vs-button>
          <vs-button @click="feedbackAddDialog = false" dark transparent>
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

interface dataType {
  reasonAddDialog: boolean;
  reasonAddInput: string;
  reasonUpdateDialog: boolean;
  reasonUpdateBaseInput: string;
  reasonUpdateNewInput: string;
  reasonNth: number;

  feedbackAddDialog: boolean;
  feedbackAddInput: string;
  feedbackUpdateDialog: boolean;
  feedbackUpdateBaseInput: string;
  feedbackUpdateNewInput: string;
  feedbackNth: number;
}

export default Vue.extend({
  props: {
    reasons: Array as Vue.PropType<string[]>,
    feedbacks: Array as Vue.PropType<string[]>,
  },

  data(): dataType {
    return {
      reasonAddDialog: false,
      reasonAddInput: "",
      reasonUpdateDialog: false,
      reasonUpdateBaseInput: "",
      reasonUpdateNewInput: "",
      reasonNth: 0,

      feedbackAddDialog: false,
      feedbackAddInput: "",
      feedbackUpdateDialog: false,
      feedbackUpdateBaseInput: "",
      feedbackUpdateNewInput: "",
      feedbackNth: 0,
    };
  },
  methods: {
    createReason: function(reason: string) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      console.log(docRef);
      docRef
        .update({
          reasons: firestore.FieldValue.arrayUnion(reason),
        })
        .then((result) => {
          console.log(result);
          vm.reasonAddInput = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteReason: function(reason: string) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      docRef.update({
        reasons: firestore.FieldValue.arrayRemove(reason),
      });
    },
    showUpdateReason: function(reason: string, index: number) {
      this.reasonUpdateDialog = true;
      this.reasonUpdateBaseInput = reason;
      this.reasonNth = index;
    },
    updateReason: function(reason: string, reasonNth: number) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      let reasons = vm.reasons;
      reasons[reasonNth] = reason;
      docRef
        .update({ reasons })
        .then((el) => {
          console.log(el);
          vm.reasonUpdateNewInput = "";
        })
        .catch((err) => console.log(err));
    },

    createFeedback: function(feedback: string) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      console.log(docRef);
      docRef
        .update({
          feedbacks: firestore.FieldValue.arrayUnion(feedback),
        })
        .then((result) => {
          console.log(result);
          vm.feedbackAddInput = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteFeedback: function(feedback: string) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      docRef.update({
        feedbacks: firestore.FieldValue.arrayRemove(feedback),
      });
    },
    showUpdateFeedback: function(feedback: string, index: number) {
      this.feedbackUpdateDialog = true;
      this.feedbackUpdateBaseInput = feedback;
      this.feedbackNth = index;
    },
    updateFeedback: function(feedback: string, feedbackNth: number) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      let feedbacks = vm.feedbacks;
      feedbacks[feedbackNth] = feedback;
      docRef
        .update({ feedbacks })
        .then((el) => {
          console.log(el);
          vm.feedbackUpdateNewInput = "";
        })
        .catch((err) => console.log(err));
    },
  },
});
</script>

<style lang="scss" scoped>
.task__motivation__position {
  margin: 0px 0px 0px 10px;
}
#task__reason {
  margin: 0.2em 4em 0em 3em;
}
#task__feedback {
  margin: 0.2em 4em 0em 3em;
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
.button__design__delete:hover,
.button__design__delete:focus {
  color: #d44343fb;
  transition: 0.2s;
}
</style>

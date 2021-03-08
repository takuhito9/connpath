<template>
  <div>
    <h3 id="goal__title">
      <span class="material-icons" style="vertical-align: -5px; ">flag</span>
      {{ $store.state.selectingGoal.goal }}
    </h3>

    <div id="predict" name="predict">
      <h4>
        <vs-tooltip class="predict__status-horizontal">
          <span class="material-icons" style="vertical-align: -5px;">
            sentiment_very_satisfied
          </span>
          <span>{{ task.fdbk.pre_satis }} %</span>
          <template #tooltip>
            Satisfaction
          </template>
        </vs-tooltip>

        <vs-tooltip class="predict__status-horizontal">
          <span
            class="material-icons"
            style="vertical-align: -5px; margin-left: 20px;"
          >
            landscape
          </span>
          <span> Level {{ task.fdbk.pre_dfclt }}</span>
          <template #tooltip>
            Difficulty
          </template>
        </vs-tooltip>
      </h4>
    </div>
    <br />

    <h2 id="task__title">
      <i
        class="material-icons task__title__icon"
        style="vertical-align: -5px; margin-left: 10px;"
      >
        directions_run</i
      >
      {{ task.task }}
      <template>
        <span v-if="task.status == 0" class="in_progress">in progress</span>
        <span v-if="task.status == 1" class="not_started">not started</span>
        <span v-if="task.status == 2" class="complete">complete</span>
      </template>
    </h2>

    <p id="task__detail">{{ task.deets }}</p>
    <div id="task__condition-of-success">
      <h3>
        <i
          class="material-icons task__condition-of-success__icon"
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
      <div id="task__condition-of-success__list" v-if="task.cos">
        <template v-if="task.cos.length">
          <div v-for="(condition, index) in task.cos" :key="condition.id">
            <template v-if="condition.cmplt">✔</template>
            <template v-else>□</template>
            <span style="position: relative"> {{ condition.cond }}</span>
            <span style="position: absolute; right: 11%">
              <button
                class="button__design material-icons button__design-right-leaning"
                @click="deleteCondition(condition)"
              >
                delete
              </button>
              <button
                class="button__design material-icons button__design-right-leaning"
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

    <br /><br />

    <div id="tabs">
      <input type="radio" value="1" id="tab1" v-model="isActive" />
      <label for="tab1">Motivation</label>

      <input type="radio" value="2" id="tab2" v-model="isActive" />
      <label for="tab2">Solve</label>

      <input type="radio" value="3" id="tab3" v-model="isActive" />
      <label for="tab3">Notes</label>
    </div>

    <!-- <keep-alive> -->
    <div id="contents">
      <div v-if="isActive == '1'">
        <div class="multi-content-board">
          <div>
            <h3>
              <span class="material-icons" style="vertical-align: -5px; ">
                help_outline</span
              >
              Reason
              <button
                @click="reasonAddDialog = !reasonAddDialog"
                class="material-icons button__design"
                style="vertical-align: -5px;"
              >
                add_circle
              </button>
            </h3>
            <template v-if="task.reasons">
              <div v-if="task.reasons.length">
                <div
                  id="task__reason"
                  v-for="(reason, index) in task.reasons"
                  :key="reason.id"
                >
                  <span style="position: relative">{{ reason }}</span
                  ><span style="position: absolute; right: 11%">
                    <button
                      class="button__design material-icons button__design-right-leaning"
                      @click="deleteReason(reason)"
                    >
                      delete
                    </button>
                    <button
                      class="button__design material-icons button__design-right-leaning"
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
              <span class="material-icons" style="vertical-align: -5px;"
                >card_giftcard</span
              >
              Feedback
              <button
                @click="feedbackAddDialog = !feedbackAddDialog"
                class="material-icons button__design"
                style="vertical-align: -5px;"
              >
                add_circle
              </button>
            </h3>
            <template v-if="task.feedbacks">
              <div v-if="task.feedbacks.length">
                <div
                  id="task__feedback"
                  v-for="(feedback, index) in task.feedbacks"
                  :key="feedback.id"
                >
                  <span style="position: relative">{{ feedback }}</span
                  ><span style="position: absolute; right: 11%">
                    <button
                      class="button__design material-icons button__design-right-leaning"
                      @click="deleteFeedback(feedback)"
                    >
                      delete
                    </button>
                    <button
                      class="button__design material-icons button__design-right-leaning"
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
        </div>
      </div>
    </div>

    <div v-if="isActive == '2'">
      <div class="multi-content-board"><TaskHurdleList></TaskHurdleList></div>
    </div>

    <div v-if="isActive == '3'">
      <div class="multi-content-board"><Notes></Notes></div>
    </div>
    <!-- </keep-alive> -->
    <!-- Update Conditon of Dialog -->
    <vs-dialog width="" not-center v-model="cosUpdateDialog">
      <template #header>
        <h4 class="not-margin">
          <p>{{ cosUpdateBaseInput }}</p>
        </h4>
      </template>
      <div class="con-content">
        <vs-input
          v-model="cosUpdateNewInput"
          placeholder="condition of success"
        ></vs-input>
      </div>
      <template #footer>
        <div class="con-footer">
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
        <h4 class="not-margin">Input Condition of Success</h4>
      </template>
      <div class="con-content">
        <vs-input
          v-model="cosAddInput"
          placeholder="condition of success"
        ></vs-input>
      </div>
      <template #footer>
        <div class="con-footer">
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

    <!-- Update Reason -->
    <vs-dialog width="" not-center v-model="reasonUpdateDialog">
      <template #header>
        <h4 class="not-margin">
          <p>{{ reasonUpdateBaseInput }}</p>
        </h4>
      </template>
      <div class="con-content">
        <vs-input
          v-model="reasonUpdateNewInput"
          placeholder="updete reason"
        ></vs-input>
      </div>
      <template #footer>
        <div class="con-footer">
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
    <vs-dialog width="300px" not-center v-model="reasonAddDialog">
      <template #header>
        <h4 class="not-margin">Input Reason</h4>
      </template>
      <div class="con-content">
        <vs-input v-model="reasonAddInput" placeholder="reason"></vs-input>
      </div>
      <template #footer>
        <div class="con-footer">
          <vs-button
            @click="(reasonAddDialog = false), addReason(reasonAddInput)"
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
    <vs-dialog width="" not-center v-model="feedbackUpdateDialog">
      <template #header>
        <h4 class="not-margin">
          <p>{{ feedbackUpdateBaseInput }}</p>
        </h4>
      </template>
      <div class="con-content">
        <vs-input
          v-model="feedbackUpdateNewInput"
          placeholder="updete Feedback"
        ></vs-input>
      </div>
      <template #footer>
        <div class="con-footer">
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
    <vs-dialog width="300px" not-center v-model="feedbackAddDialog">
      <template #header>
        <h4 class="not-margin">Input Feedback</h4>
      </template>
      <div class="con-content">
        <vs-input v-model="feedbackAddInput" placeholder="feedback"></vs-input>
      </div>
      <template #footer>
        <div class="con-footer">
          <vs-button
            @click="(feedbackAddDialog = false), addFeedback(feedbackAddInput)"
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

    <br /><br /><br /><br />
    <button @click="deleteTask">Delete</button>
    <!-- <pre>{{ task }}</pre> -->
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";
import TaskHurdleList from "@/views/Goal/Task/TaskHurdleList.vue";
import Notes from "@/views/Goal/Note.vue";
interface taskObjectType {
  task: string;
  deets: string;
  status: number;
  cre_at: {
    seconds: number;
    nanoseconds: number;
  };
  cos: Array<{
    cond: string;
    cmplt: boolean;
  }>;
  fdbk: {
    pre_dfclt: number;
    pre_satis: number;
    post_dfclt: number;
    post_satis: number;
  };
  reasons: Array<string>;
  feedbacks: Array<string>;
  docId: string;
}
interface dataType {
  task: taskObjectType;
  cosAddDialog: boolean;
  cosAddInput: string;
  cosUpdateDialog: boolean;
  cosUpdateBaseInput: string;
  cosUpdateNewInput: string;
  cosNth: number;

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

  isActive: string;
}

export default Vue.extend({
  components: { TaskHurdleList, Notes },

  data(): dataType {
    return {
      task: {
        task: "",
        deets: "",
        status: 0,
        cre_at: {
          seconds: 0,
          nanoseconds: 0,
        },
        cos: [
          {
            cmplt: false,
            cond: "",
          },
        ],
        fdbk: {
          pre_dfclt: 0,
          pre_satis: 0,
          post_dfclt: 0,
          post_satis: 0,
        },
        reasons: [],
        feedbacks: [],
        docId: "",
      },
      cosAddDialog: false,
      cosAddInput: "",
      cosUpdateDialog: false,
      cosUpdateBaseInput: "",
      cosUpdateNewInput: "",
      cosNth: 0,

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

      isActive: "1",
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
      let originalCos = vm.task.cos;
      originalCos[cosNth] = { cond: cond, cmplt: false };
      docRef
        .update({ cos: originalCos })
        .then((el) => {
          console.log(el);
          vm.cosUpdateNewInput = "";
        })
        .catch((err) => console.log(err));
    },
    addReason: function(reason: string) {
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
      let reasons = vm.task.reasons;
      reasons[reasonNth] = reason;
      docRef
        .update({ reasons })
        .then((el) => {
          console.log(el);
          vm.reasonUpdateNewInput = "";
        })
        .catch((err) => console.log(err));
    },

    addFeedback: function(feedback: string) {
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
      let feedbacks = vm.task.feedbacks;
      feedbacks[feedbackNth] = feedback;
      docRef
        .update({ feedbacks })
        .then((el) => {
          console.log(el);
          vm.feedbackUpdateNewInput = "";
        })
        .catch((err) => console.log(err));
    },
    updateTask: function() {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const dogRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
    },
    deleteTask: function() {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const dogRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
      dogRef
        .delete()
        .then(function() {
          console.log("Delete");
        })
        .catch(function(error) {
          console.error("Don't Delete", error);
        });
    },
  },
  created() {
    const vm = this;
    const goalId = vm.$route.params.goalId;
    const taskId = vm.$route.params.taskId;
    const userId = vm.$store.state.user.uid;
    const docRef = db.doc(`users/${userId}/goals/${goalId}/tasks/${taskId}`);
    docRef.onSnapshot(function(doc) {
      const docData = doc.data();
      if (docData) {
        docData.docId = taskId;
        vm.task = docData as taskObjectType;
        vm.$store.commit("setCurrentTask", vm.task);
        console.log("Firebaseにアクセスしてデータを取得しました");
      } else {
        console.log(Error);
      }
    });
  },
});
</script>

<style lang="scss" scoped>
#goal__title {
  color: #42b983;
  padding-left: 2em;
  text-indent: -1em;
}
#predict {
  text-align: right;
  font-weight: normal;
}
.predict__status-horizontal {
  float: left;
}
#task__title {
  padding-left: 2em;
  text-indent: -1em;
}
#task__detail {
  text-align: left;
  font-weight: 500;
  margin: 0em 1em 0em 3em;
}
#task__condition-of-success {
  text-align: left;
  font-weight: normal;
}
#task__condition-of-success__list {
  margin: 0em 4em 0em 3em;
}
#task__reason {
  margin: 0.2em 4em 0em 3em;
}
#task__feedback {
  margin: 0.2em 4em 0em 3em;
}
.multi-content-board {
  background: #4a4a4a10;
  padding: 20px 40px 40px 40px;
  border-radius: 0% 20px 20px 20px;
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
ul {
  list-style: none;
}

#tabs {
  overflow: hidden;
}
#tabs input {
  display: none;
}
#tabs label {
  display: inline-block;
  line-height: 40px;
  width: 120px;
  text-align: center;
  cursor: pointer;
  background: #4a4a4a09;
  transition: 0.2s;
  border-radius: 10px 10px 0 0;
}
#tabs input:checked + label,
#tabs label:hover {
  background: #4a4a4a10;
  color: rgb(41, 41, 41);
}
#group {
  margin: 0em 0em 0.5em 0em;
  background: #f4f7f8;
  border-radius: 10px;
  padding: 1em 1em;
  word-break: normal;
}

.in_progress {
  background: rgba(84, 207, 255, 0.511);
  padding: 0.3rem;
  border-radius: 10%;
  font-size: 0.7em;
  vertical-align: 5px;
  white-space: nowrap;
}
.not_started {
  background: rgba(134, 133, 133, 0.301);
  padding: 0.3rem;
  border-radius: 10%;
  font-size: 0.7em;
  vertical-align: 5px;
  white-space: nowrap;
}
.complete {
  background: #42b983;
  padding: 0.3rem;
  border-radius: 10%;
  font-size: 0.7em;
  vertical-align: 5px;
  white-space: nowrap;
}
</style>

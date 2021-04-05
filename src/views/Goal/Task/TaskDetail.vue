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

    <TaskDetailConditionOfSuccess
      :cos="task.cos"
    ></TaskDetailConditionOfSuccess>

    <br />
    <Accordion>
      <AccordionItem>
        <template slot="accordion-trigger">
          <div id="task__motivation-announce">
            <button class="button__design task__motivation-announce__button">
              <i class="material-icons" style="vertical-align: -5px; ">
                bug_report
              </i>
              When your motivation drops...
            </button>
          </div>
        </template>
        <template slot="accordion-content">
          <TaskDetailMotivation
            :reasons="task.reasons"
            :feedbacks="task.feedbacks"
          ></TaskDetailMotivation>
        </template>
      </AccordionItem>
    </Accordion>
    <br />

    <div id="tabs">
      <input
        type="radio"
        value="TaskHurdleList"
        id="tab1"
        v-model="currentComponent"
      />
      <label for="tab1">Solve</label>

      <input type="radio" value="Notes" id="tab2" v-model="currentComponent" />
      <label for="tab2">Notes</label>
    </div>

    <div class="multi-content-board">
      <keep-alive>
        <component :is="currentComponent"></component>
      </keep-alive>
    </div>

    <br /><br /><br /><br />
    <button @click="deleteTask">Delete</button>
    <!-- <pre>{{ task }}</pre> -->
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";
import Notes from "@/views/Goal/Note.vue";
import Accordion from "@/components/Accordion.vue";
import AccordionItem from "@/components/AccordionItem.vue";
import TaskHurdleList from "@/views/Goal/Task/TaskHurdleList.vue";
import TaskDetailMotivation from "@/views/Goal/Task/TaskDetailMotivation.vue";
import TaskDetailConditionOfSuccess from "@/views/Goal/Task/TaskDetailConditionOfSuccess.vue";

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
  isActive: string;
  currentComponent: string;
}

export default Vue.extend({
  components: {
    TaskHurdleList,
    Notes,
    Accordion,
    AccordionItem,
    TaskDetailMotivation,
    TaskDetailConditionOfSuccess
  },

  data(): dataType {
    return {
      task: {
        task: "",
        deets: "",
        status: 0,
        cre_at: {
          seconds: 0,
          nanoseconds: 0
        },
        cos: [
          {
            cmplt: false,
            cond: ""
          }
        ],
        fdbk: {
          pre_dfclt: 0,
          pre_satis: 0,
          post_dfclt: 0,
          post_satis: 0
        },
        reasons: [],
        feedbacks: [],
        docId: ""
      },

      isActive: "1",
      currentComponent: "TaskHurdleList"
    };
  },
  methods: {
    testMethods() {
      const test = "message";
      console.log(test);
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
    }
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
  }
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

#task__motivation-announce {
  position: relative;
  margin: 0px auto;
  font-weight: 500;
  :hover,
  :focus {
    color: rgb(110, 66, 185);
    transition: 0.2s;
  }
  button {
    font-size: 1em;
  }
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
  font-weight: 600;
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

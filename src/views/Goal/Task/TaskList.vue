<template>
  <div>
    <h3>
      <i
        class="material-icons task__title__icon"
        style="vertical-align: -5px; margin-left: 10px;"
      >
        directions_run</i
      >
      Task
      <router-link
        style="text-decoration: none; color: rgb(44, 62, 80);"
        :to="{
          name: 'TaskCreate',
          params: { goalId: $store.state.selectingGoal.docId }
        }"
      >
        <button
          class="button__design material-icons"
          style="vertical-align: -5px"
        >
          add_circle
        </button>
      </router-link>
      <router-view />
    </h3>

    <div class="task__grid">
      <template v-if="isEmpty">
        <h2>you need add tasks</h2>
      </template>

      <template v-else>
        <button
          @click="accessTaskPage(task.docId, task)"
          class="task__item"
          v-for="task in tasks"
          :key="task.id"
        >
          <h4>
            {{ task.task }}
            <template>
              <span v-if="task.status == 0" class="in_progress"
                >in progress</span
              >
              <span v-if="task.status == 1" class="not_started"
                >not started</span
              >
              <span v-if="task.status == 2" class="complete">complete</span>
            </template>
          </h4>
        </button>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";
export default Vue.extend({
  data() {
    return {
      tasks: {},
      isEmpty: false,
      taskAddInput: "",
      dialogWidth: "600px"
    };
  },
  methods: {
    accessTaskPage(taskId: string, task: object) {
      const goalId = this.$store.state.selectingGoal.docId;
      this.$store.commit("setCurrentTask", task);
      this.$router
        .push({
          name: "TaskDetail",
          params: { goalId: goalId, taskId: taskId }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    const vm = this;
    const goalId = vm.$route.params.id;
    const CollectionRef = db.collection(
      `users/${vm.$store.state.user.uid}/goals/${goalId}/tasks`
    );
    /* Display the tasks in the following order.
        in_progress -> not_started -> done
        Limit items to eight. (Give priority to in_progress.) */
    CollectionRef.orderBy("status")
      .limit(12)
      .get()
      .then(function(querysnapshot) {
        const dataList = querysnapshot.docs.map(doc => ({
          docId: doc.id,
          ...doc.data() // spread
        }));
        console.log("firebaseにアクセスしました");
        vm.tasks = dataList;
        vm.isEmpty = querysnapshot.empty;
      });
  },
  computed: {}
});
</script>

<style lg="scss" scoped>
.task__grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin: 0em 0em 0em 3em;
}
.task__item {
  border-radius: 10px;
  background: rgb(235, 238, 239);
  border: 0;
  padding: 5px 20px;
  font-size: 15px;
  color: #2c3e50;
  text-align: center;
}
.task__item:hover,
.task__item:focus {
  background: #50c38f;
  color: rgb(241, 241, 241);
  transition: 0.2s;
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
.in_progress {
  background: rgba(84, 207, 255, 0.511);
  padding: 0.3rem;
  border-radius: 10%;
  font-size: 0.7em;
  vertical-align: 5px;
  white-space: nowrap;
  vertical-align: -0px;
}
.not_started {
  background: rgba(134, 133, 133, 0.301);
  padding: 0.3rem;
  border-radius: 10%;
  font-size: 0.7em;
  vertical-align: 5px;
  white-space: nowrap;
  vertical-align: -0px;
}
.complete {
  background: #42b983;
  padding: 0.3rem;
  border-radius: 10%;
  font-size: 0.7em;
  vertical-align: 5px;
  white-space: nowrap;
  vertical-align: -0px;
}
</style>

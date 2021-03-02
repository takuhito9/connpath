<template>
  <div>
    <h3>
      🏃🏻 Task
      <router-link
        style="text-decoration: none; color: rgb(44, 62, 80);"
        :to="{
          name: 'NewTask',
          params: { goalId: $store.state.selectingGoal.docId },
        }"
      >
        <span style="cursor: pointer;">➕</span>
      </router-link>
      <router-view />
    </h3>

    <div class="grid taskMargin">
      <template v-if="isEmpty">
        <h2>you need add tasks</h2>
      </template>

      <template v-else>
        <div
          @click="accessTaskPage(task.docId, task)"
          class="item"
          v-for="task in tasks"
          :key="task.id"
        >
          <div class="tasks">
            <h4>{{ task.task }}</h4>
          </div>
        </div>
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
      dialogWidth: "600px",
    };
  },
  methods: {
    accessTaskPage(taskId: string, task: object) {
      const goalId = this.$store.state.selectingGoal.docId;
      this.$store.commit("setCurrentTask", task);
      this.$router
        .push({ name: "Task", params: { goalId: goalId, taskId: taskId } })
        .catch((err) => {
          console.log(err);
        });
    },
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
        const dataList = querysnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(), // spread
        }));
        console.log("firebaseにアクセスしました");
        vm.tasks = dataList;
        vm.isEmpty = querysnapshot.empty;
      });
  },
  computed: {},
});
</script>

<style lg="scss" scoped>
.grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
.item {
  border-radius: 10px;
  background: rgb(235, 238, 239);
  padding: 5px 20px;
  margin: 5px;
  text-align: center;
  cursor: pointer;
}
.taskMargin {
  margin: 0em 0em 0em 3em;
}
</style>

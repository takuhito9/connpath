<template>
  <div>
    <br />
    <button @click="taskAddDialog = !taskAddDialog">
      ➕
    </button>
    <template v-if="isEmpty">
      <h1>you need add tasks</h1>
    </template>

    <template v-else>
      <div>
        <div v-for="task in tasks" :key="task.id">
          <div class="tasks">
            <h3>{{ task.task }} : {{ task.status }}</h3>
            <h4>{{ task.fdbk }}</h4>
            <p>{{ isEmpty }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Add Conditon of Dialog -->
    <vs-dialog
      :width="dialogWidth"
      full-screen
      scroll
      not-center
      v-model="taskAddDialog"
    >
      <template #header>
        <h4 class="not-margin">Input Task</h4>
      </template>
      <div class="con-content">
        <vs-input v-model="taskAddInput" placeholder="Task"></vs-input>
      </div>
      <template #footer>
        <div class="con-footer">
          <vs-button @click="addTask(taskAddInput)" transparent>
            Ok
          </vs-button>
          <vs-button @click="taskAddDialog = false" dark transparent>
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
export default Vue.extend({
  data() {
    return {
      tasks: {},
      isEmpty: false,
      taskAddDialog: false,
      taskAddInput: "",
      dialogWidth: "600px",
    };
  },
  methods: {
    addTask: function(task: string) {
      const vm = this;
      const userUId = vm.$store.state.user.uid;
      const goalId = vm.$store.state.selectingGoal.docId;
      const docRef = db.collection(`users/${userUId}/goals/${goalId}/tasks`);
      const data = {
        task: task,
        cre_at: firestore.FieldValue.serverTimestamp(),
        fdbk: {
          pre_dfclt: 0,
          pre_satis: 0,
          post_satis: 0,
          post_dfclt: 0,
        },
        // 0 -> in_Progress, 1-> Not Started,  2 -> Done
        status: "in_progress",
      };
      docRef
        .add(data)
        .then((el) => {
          console.log(el, "追加できたよ");
        })
        .catch((err) => {
          console.log(err);
        });
      // vm.taskAddDialog = false
      vm.dialogWidth = "1600px";
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
      .limit(6)
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

<style scoped>
.tasks {
  background: rgba(100, 148, 237, 0.486);
}
</style>

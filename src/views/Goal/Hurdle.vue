<template>
  <div>
    <h3>⛰ Hurdle & 💡 Solution <span @click="createNewHurdle"> ➕ </span></h3>
    <!-- <pre>CreateHurdle {{ CreateHurdle }}</pre> -->
    <!-- <pre>{{ CreateSolutions }}</pre> -->
    <div v-show="isCreateNewHurdle">
      <div class="new-hurdle-solution">
        <h4>
          <input
            class="createHurdleField inputDesign"
            placeholder="👉  NewHurdle"
            v-model="CreateHurdle"
            v-once
          />
        </h4>

        <div v-show="CreateHurdle">
          <div
            class="createSolutionField"
            v-for="(solution, index) in CreateSolutions"
            :key="solution.id"
          >
            <input
              class="inputDesign"
              placeholder="👉  NewSolution"
              v-model="CreateSolutions[index].sol"
            />
            <a @click="deleteSolutionForm(index)">🗑</a>
          </div>
          <a style="margin-left: 85%;" @click="addSolutionForm">➕</a>
        </div>

        <button @click="createHurdle">Submit</button>
      </div>
    </div>

    <div class="grid">
      <div v-for="hurdle in hurdles" :key="hurdle.id">
        <template>
          <div class="hurdle-solution">
            <Accordion>
              <AccordionItem>
                <!-- This slot will handle the title/header of the accordion and is the part you click on -->
                <template slot="accordion-trigger">
                  <ul class="ul-left-blank-space-delete">
                    <div class="hurdle">
                      <h4>
                        {{ hurdle.hurdle }}
                        <span>
                          {{
                            hurdle.cre_at.toDate().toLocaleDateString("ja-JP")
                          }}
                        </span>
                        <span>{{ hurdle.settled }} </span>
                      </h4>
                    </div>
                  </ul>
                </template>
                <!-- This slot will handle all the content that is passed to the accordion -->
                <template slot="accordion-content">
                  <div v-for="sol in hurdle.sols" :key="sol.id">
                    <ul>
                      <li class="solution">{{ sol.sol }} : {{ sol.worked }}</li>
                    </ul>
                  </div>
                  <a @click="updateHurdleAndSolutions(hurdle.docId)"> 🖋 </a>
                  <a @click="deleteHurdleAndSolutions(hurdle.docId)"> 🗑</a>
                </template>
              </AccordionItem>
            </Accordion>
          </div>
        </template>
      </div>
    </div>

    <pre>{{ hurdles }}</pre>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Accordion from "@/components/accordion.vue";
import AccordionItem from "@/components/accordion-item.vue";
import { db, firestore } from "@/main";
export default Vue.extend({
  data() {
    return {
      hurdles: {},
      newHurdle: "",
      isEmpty: false,
      isCreateNewHurdle: false,
      CreateHurdle: "",
      CreateSolutions: [
        {
          worked: false,
          //   cre_at: 0,
          sol: "",
        },
      ],
    };
  },
  components: {
    Accordion,
    AccordionItem,
  },
  methods: {
    createNewHurdle() {
      this.isCreateNewHurdle = true;
    },
    addSolutionForm() {
      this.CreateSolutions.push({
        worked: false,
        // cre_at: 0,
        sol: "",
      });
    },
    deleteSolutionForm(index: number) {
      this.CreateSolutions.splice(index, 1);
    },
    createHurdle() {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.collection(
        `users/${userId}/goals/${goalId}/tasks/${taskId}/hurdles`
      );
      docRef
        .add({
          hurdle: vm.CreateHurdle,
          settled: false,
          cre_at: firestore.FieldValue.serverTimestamp(),
          sols: vm.CreateSolutions,
        })
        .then((result) => {
          console.log(result);
          vm.isCreateNewHurdle = false;
          vm.CreateHurdle = "";
          vm.CreateSolutions = [
            {
              worked: false,
              //   cre_at: 0,
              sol: "",
            },
          ];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateHurdleAndSolutions(hurdle: string) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/tasks/${taskId}/hurdles/${hurdle}/`
      );
    },
    deleteHurdleAndSolutions(hurdle: string) {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/tasks/${taskId}/hurdles/${hurdle}/`
      );
      docRef
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
    const CollectionRef = db.collection(
      `users/${userId}/goals/${goalId}/tasks/${taskId}/hurdles`
    );
    /* Display the tasks in the following order.
        in_progress -> not_started -> done
        Limit items to eight. (Give priority to in_progress.) */
    console.log(CollectionRef);
    CollectionRef.orderBy("settled")
      .orderBy("cre_at")
      .limit(20)
      .onSnapshot(function(querysnapshot) {
        const dataList = querysnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(), // spread
        }));
        console.log("Hurdle : firebaseにアクセスしました");
        vm.hurdles = dataList;
        vm.isEmpty = querysnapshot.empty;
      });
  },
});
</script>

<style lang="scss" scoped>
h4 {
  margin: 0em 1em 0em 1em;
}
.hurdle {
  //   margin: 0em 0em 0em 1em;
  word-wrap: break-word;
  word-break: normal;
}
.solution {
  margin: 0.5em 1.5em 0em 1em;
  word-wrap: break-word;
  word-break: normal;
}
.grid {
  display: grid;
  gap: 0px 10px;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
}
.hurdle-solution {
  margin: 0em 0em 0.5em 0em;
  background: #f4f7f8;
  border-radius: 10px;
  padding: 1em 1em;
  word-break: normal;
}
.new-hurdle-solution {
  border: dashed 2px gray;
  margin: 0em 0em 0.5em 0em;
  background: #f4f7f8;
  border-radius: 10px;
  padding: 1em 1em;
  word-break: normal;
}

.ul-left-blank-space-delete {
  padding: 0;
}
.createHurdleField {
  padding-left: 10px;
}
.createSolutionField {
  padding-left: 5em;
}
.inputDesign {
  width: 85%;
  padding: 0.5em 0.5em;
  font-size: 16px;
  border: solid 0px #f4f7f8;
  background: #f4f7f8;
}
</style>

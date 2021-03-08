<template>
  <div>
    <h3>
      <span class="material-icons" style="vertical-align: -5px;">hiking</span>
      Hurdle &
      <span class="material-icons" style="vertical-align: -5px;"
        >lightbulb</span
      >
      Solution
      <button
        @click="createNewHurdle"
        class="material-icons button__design"
        style="vertical-align: -5px;"
      >
        add_circle
      </button>
    </h3>
    <div v-show="isCreateNewHurdle">
      <div class="hurdle-solution-create">
        <h4>
          <input
            class="hurdle-solution-create__field input-design"
            placeholder="👉  NewHurdle"
            v-model="CreateHurdle"
            v-once
          />
        </h4>

        <div v-show="CreateHurdle">
          <div
            class="hurdle-solution-create__solution-field"
            v-for="(solution, index) in CreateSolutions"
            :key="solution.id"
          >
            <input
              class="input-design"
              placeholder="👉  NewSolution"
              v-model="CreateSolutions[index].sol"
            />
            <button
              class="material-icons button__design"
              @click="deleteSolutionForm(index)"
            >
              delete
            </button>
          </div>
          <button
            class="material-icons button__design"
            style="margin-left: 85%;"
            @click="addSolutionForm"
          >
            add_circle
          </button>
        </div>

        <button class="button__register" @click="createHurdle">Submit</button>
      </div>
    </div>

    <div class="hurdle-solution__grid">
      <template v-if="isEmpty">
        <p>Not Exist Hurdle</p>
      </template>

      <template v-else>
        <div v-for="hurdle in hurdles" :key="hurdle.id">
          <template>
            <div class="hurdle-solution__list">
              <Accordion>
                <AccordionItem>
                  <!-- This slot will handle the title/header of the accordion and is the part you click on -->
                  <template slot="accordion-trigger">
                    <ul class="hurdle-solution__list-left-space">
                      <div>
                        <h4>
                          {{ hurdle.hurdle }}
                          <span>
                            {{
                              hurdle.cre_at.toDate().toLocaleDateString("ja-JP")
                            }}
                          </span>
                          <span
                            class="hurdle-solution__settled"
                            v-if="hurdle.settled"
                            >solved
                          </span>
                          <span
                            class="hurdle-solution__settled"
                            v-if="!hurdle.settled"
                          >
                            unresolved
                          </span>
                        </h4>
                      </div>
                    </ul>
                  </template>
                  <!-- This slot will handle all the content that is passed to the accordion -->
                  <template slot="accordion-content">
                    <div v-for="sol in hurdle.sols" :key="sol.id">
                      <ul>
                        <li class="solution__list">
                          <template v-if="!sol.sol"
                            >Not Exist Solution</template
                          >
                          <template v-else
                            >{{ sol.sol }} :
                            <span>{{ sol.worked }}</span></template
                          >
                        </li>
                      </ul>
                    </div>
                    <button
                      class="material-icons button__design"
                      @click="deleteHurdleAndSolutions(hurdle.docId)"
                    >
                      delete
                    </button>
                    <button
                      class="material-icons button__design"
                      @click="updateHurdleAndSolutions(hurdle.docId)"
                    >
                      edit
                    </button>
                  </template>
                </AccordionItem>
              </Accordion>
            </div>
          </template>
        </div>
      </template>
    </div>

    <pre>{{ hurdles }}</pre>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Accordion from "@/components/Accordion.vue";
import AccordionItem from "@/components/AccordionItem.vue";
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
      .orderBy("cre_at", "desc")
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

.hurdle-solution-create {
  border: dashed 2px gray;
  margin: 0em 0em 0.5em 0em;
  background: #f4f7f8;
  border-radius: 10px;
  padding: 1em 1em;
  word-break: normal;
}
.hurdle-solution-create__field {
  padding-left: 10px;
}
.hurdle-solution-create__solution-field {
  padding-left: 5em;
}
AccordionItem {
  position: relative;
}
.hurdle-solution__settled {
  background: #42b983;
  color: #f6f6f6;
  padding: 4px 12px;
  border-radius: 10px;
  position: absolute;
}
.hurdle-solution__grid {
  display: grid;
  gap: 0px 10px;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
}
.hurdle-solution__list {
  margin: 0em 0em 0.5em 0em;
  background: #f4f7f8;
  border-radius: 10px;
  padding: 1em 1em;
  word-break: normal;
}
.hurdle-solution__list-left-space {
  padding: 0;
}
.solution__list {
  margin: 0.5em 1.5em 0em 1em;
  word-wrap: break-word;
  word-break: normal;
}
.input-design {
  width: 85%;
  padding: 0.5em 0.5em;
  font-size: 16px;
  border: solid 0px #f4f7f8;
  background: #f4f7f8;
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
.button__register {
  margin: 10px 20px;
  padding: 0.5em 3em;
  border-radius: 20px;
  border: 2px solid #4c4c4c5f;
  font-weight: bold;
  color: #4c4c4c;
}
.button__register:hover,
.button__register:focus {
  color: #f6f6f6;
  background: #42b983;
  transition: 0.2s;
}
</style>

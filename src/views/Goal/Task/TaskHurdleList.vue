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
            <input
              class="input-design input-design-ref-link"
              placeholder="🔗 URL"
              v-model="CreateSolutions[index].ref"
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
        <button class="button__register" @click="closeHurdleSolutionForm">
          Close
        </button>
      </div>
    </div>

    <div class="hurdle-solution__grid">
      <template v-if="isEmpty">
        <p>Not Exist Hurdle</p>
      </template>

      <template v-else>
        <div v-for="(hurdle, hurdleIndex) in hurdles" :key="hurdle.id">
          <template>
            <div class="hurdle-solution__list">
              <Accordion>
                <AccordionItem>
                  <!-- This slot will handle the title/header of the accordion and is the part you click on -->
                  <template slot="accordion-trigger">
                    <ul>
                      <span
                        class="hurdle-solution__settled unresolved"
                        v-if="hurdle.settled"
                      >
                        solved
                      </span>
                      <span
                        class="hurdle-solution__settled solved "
                        v-if="!hurdle.settled"
                        @click="hurdleSolve()"
                      >
                        unresolved
                      </span>
                      <div class="hurdle-solution__title">
                        <h4>
                          {{ hurdle.hurdle }}
                        </h4>
                      </div>
                    </ul>
                  </template>
                  <!-- This slot will handle all the content that is passed to the accordion -->
                  <template slot="accordion-content">
                    <div v-for="(sol, solIndex) in hurdle.sols" :key="sol.id">
                      <ul>
                        <li class="solution__list">
                          <template v-if="!sol.sol">
                            Not Exist Solution
                          </template>
                          <template v-else>
                            {{ sol.sol }}
                            <vs-tooltip style="display: inline;">
                              <span
                                class="solution__userful"
                                v-if="
                                  hurdle.useful &&
                                    hurdle.useful.includes(solIndex)
                                "
                              >
                                ★
                              </span>
                              <template #tooltip>Useful</template>
                            </vs-tooltip>
                            <br />
                            <a
                              :href="sol.ref"
                              rel="noopener"
                              target="_blank"
                              class="solution__ref-link"
                              >{{ sol.ref }}</a
                            >
                          </template>
                        </li>
                      </ul>
                    </div>

                    <template v-if="hurdle.mini_note">
                      <hr class="hr__design" />
                      <div class="solution__mini-note">
                        <p>How was it resolved ?</p>
                        <p style="padding: 0em 0em 0em 1.5em;">
                          {{ hurdle.mini_note }}
                        </p>
                      </div>
                    </template>

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
                    <button
                      v-if="!hurdle.settled"
                      class="material-icons button__design"
                      @click="showDoneHurdle(hurdle.docId, hurdleIndex)"
                    >
                      done
                    </button>
                  </template>
                </AccordionItem>
              </Accordion>
            </div>
          </template>
        </div>
      </template>
    </div>

    <vs-dialog v-model="doneHurdleDialog">
      <template #header>Make the hurdle resolved.</template>
      <div class="dialog__design">
        <h3>
          {{ hurdles[doneHurdleIndex].hurdle }}
        </h3>
        <p>
          Choose a solution that was effective.
          <span>{{ checkedSolutions }}</span>
        </p>
        <div
          v-for="(sol, solIndex) in hurdles[doneHurdleIndex].sols"
          :key="sol.id"
        >
          <ul>
            <span>
              <input
                type="checkbox"
                class="check_box"
                :value="solIndex"
                :id="sol.sol"
                v-model="checkedSolutions"
              />
              {{ sol.sol }}
              <br />
              <a
                :href="sol.ref"
                rel="noopener"
                target="_blank"
                class="solution__ref-link"
                >{{ sol.ref }}
              </a>
            </span>
          </ul>
        </div>
        <br />
        <template>
          <p>Please record how you solved the problem.</p>
          <input class="input__design" v-model="miniNote" />
          <div>
            <i>If you don't have enough characters, record them in a Note.</i>
            <p><input type="checkbox" />Record the Note.</p>
          </div>
        </template>
        <button class="button__register" @click="doneHurdle">Solve</button>
      </div>
    </vs-dialog>
    <!-- <pre>{{ hurdles }}</pre> -->
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
          ref: "",
        },
      ],
      doneHurdleDialog: false,
      doneHurdleIndex: 0,
      doneHurdleDocId: "",
      checkedSolutions: [],
      miniNote: "",
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
        sol: "",
        ref: "",
      });
    },
    deleteSolutionForm(index: number) {
      this.CreateSolutions.splice(index, 1);
    },
    closeHurdleSolutionForm() {
      this.CreateHurdle = "";
      this.CreateSolutions = [
        {
          worked: false,
          sol: "",
          ref: "",
        },
      ];
      this.isCreateNewHurdle = false;
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
              sol: "",
              ref: "",
            },
          ];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showDoneHurdle(docId: string, index: number) {
      this.checkedSolutions = [];
      this.doneHurdleDialog = true;
      this.doneHurdleIndex = index;
      this.doneHurdleDocId = docId;
    },
    doneHurdle() {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const hurdleId = vm.doneHurdleDocId;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/tasks/${taskId}/hurdles/${hurdleId}/`
      );
      docRef
        .set(
          {
            settled: true,
            useful: vm.checkedSolutions,
            mini_note: vm.miniNote,
          },
          { merge: true }
        )
        .then((result) => {
          console.log(result);
          vm.doneHurdleDialog = false;
          vm.checkedSolutions = [];
          vm.miniNote = "";
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
  z-index: -1;
}
.hurdle-solution__settled {
  z-index: 10;
  color: #f6f6f6;
  padding: 3px 12px;
  border-radius: 10px 0px 10px 0px;
  position: absolute;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
.unresolved {
  background: #42b983ce;
}
.solved {
  background: #5b5b5b;
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
  // padding: 1em 1em;
  word-break: normal;
}
.hurdle-solution__title {
  margin: 0px;
  padding: 2em 1.5em 1.5em 1.5em;
}
.solution__mini-note {
  margin: 0px;
  padding: 0em 4em 0em 4em;
  text-align: left;
}
.solution__list {
  margin: 0em 3em 1em 3em;
  word-wrap: break-word;
  word-break: normal;
}
.solution__userful {
  color: #42b983;
}
.solution__ref-link {
  font-size: 14px;
  color: gray;
  text-decoration: none;
}
.solution__ref-link:hover,
.solution__ref-link:focus {
  color: #42b983;
}
.hr__design {
  margin: 1em 4em;
  border-top: 1px solid #cfcfcf72;
}
.input-design {
  width: 85%;
  padding: 0.5em 0.5em;
  font-size: 16px;
  border: solid 0px #f4f7f8;
  background: #f4f7f8;
}
.input-design-ref-link {
  color: gray;
  font-size: 14px;
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
.dialog__design {
  padding: 5em;
}
.input__design {
  width: 80%;
  padding: 0.5em;
  font-size: 16px;
  border: solid 2px #e1e3e8;
  border-radius: 4px;
  margin: 0.5em 0em 0em 2em;
}
</style>

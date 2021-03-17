<template>
  <div>
    <!-- Title -->
    <h3>
      <span class="material-icons" style="vertical-align: -5px;">hiking</span>
      Hurdle &
      <span class="material-icons" style="vertical-align: -5px;"
        >lightbulb</span
      >
      Solution
    </h3>
    <div>
      <button
        style="width: 93%;"
        @click="createNewHurdle"
        class="button__new__hurdle"
      >
        + Add Hurdle
      </button>
    </div>
    <!-- Create New Hurdle and Solution -->
    <div v-show="isCreateNewHurdle">
      <div class="hurdle-solution-create">
        <h4>
          <!-- Hurdle Form -->
          <i class="material-icons" style="vertical-align: -6px;">hiking</i>
          <input
            class="hurdle-solution-create__field input__design_create"
            placeholder="Please tell me what obstacles and hurdle I need to overcome."
            v-model="CreateHurdle"
            v-once
          />
        </h4>
        <div
          class="hurdle-solution-create__solution-field"
          v-for="(solution, index) in CreateSolutions"
          :key="solution.id"
        >
          <!-- Solution Form -->
          <div class="Bracket">
            <input
              class="input__design_create"
              placeholder="Enter your solution."
              v-model="CreateSolutions[index].sol"
            />
            <br />
            <input
              class="input__design_create input-design-ref-link"
              placeholder="URL of reference material."
              v-model="CreateSolutions[index].ref"
            />
            <button
              class="material-icons button__design"
              @click="deleteSolutionForm(index)"
            >
              delete
            </button>
          </div>
        </div>

        <!--  Increment Solution Buttom -->
        <button class="button__register" @click="addSolutionForm">
          <span class="material-icons " style="vertical-align: -6px;"
            >lightbulb</span
          >
          + Add Solution
        </button>

        <!-- Register Buttom -->
        <div>
          <button class="button__register" @click="createHurdle">Submit</button>
          <button
            class="button__register close__button"
            @click="closeHurdleSolutionForm"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Display Hurdle and Solution -->
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
                      <!-- Hurdle Settled Status bar -->
                      <button
                        class="hurdle-solution__settled solved "
                        v-if="hurdle.settled"
                        @click.stop="showSolvedToUnsolved(hurdle.docId)"
                      >
                        solved
                      </button>
                      <button
                        class="hurdle-solution__settled unsolved "
                        v-if="!hurdle.settled"
                        @click.stop=""
                      >
                        unsolved
                      </button>

                      <!-- hurdle Title and Edit, Delete Buttom -->
                      <div class="hurdle-solution__title">
                        <h4>
                          {{ hurdle.hurdle }}
                          <vs-tooltip class="hurdle__update__tooltip">
                            <button
                              @click.stop="
                                hurdleUpdateTooltip = !hurdleUpdateTooltip
                              "
                              class="material-icons button__design hurdle__update"
                            >
                              more_horiz
                            </button>
                            <template #tooltip>{{ hurdle.settled }}</template>
                          </vs-tooltip>

                          <button
                            class="material-icons button__design"
                            style="vertical-align: -6px;"
                            @click="deleteHurdleAndSolutions(hurdle.docId)"
                          >
                            delete
                          </button>
                          <button
                            class="material-icons button__design"
                            style="vertical-align: -6px;"
                            @click.stop="
                              showUpdateHurdleTitle(hurdle.hurdle, hurdle.docId)
                            "
                          >
                            edit
                          </button>
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
                            <button
                              class="material-icons button__design__delete"
                              style="vertical-align: -6px;"
                              @click="showDeleteSolution(sol, hurdle.docId)"
                            >
                              delete
                            </button>
                            <button
                              class="material-icons button__design"
                              style="vertical-align: -6px;"
                              @click="
                                showUpdateSolution(
                                  sol,
                                  hurdle.docId,
                                  hurdleIndex,
                                  solIndex
                                )
                              "
                            >
                              edit
                            </button>
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

                    <button
                      class="button__new__hurdle"
                      @click="showAddSolution(hurdle.docId)"
                    >
                      + Add Solution
                    </button>

                    <template v-if="hurdle.mini_note">
                      <hr class="hr__design" />
                      <div class="solution__mini-note">
                        <p>How was it resolved ?</p>
                        <p style="padding: 0em 0em 0em 1.5em;">
                          {{ hurdle.mini_note }}
                        </p>
                      </div>
                    </template>

                    <div style="padding: 0px 30px 20px 0px;">
                      <button
                        v-if="!hurdle.settled"
                        class="  solved__button"
                        @click="showDoneHurdle(hurdle.docId, hurdleIndex)"
                      >
                        Solved
                      </button>
                    </div>
                  </template>
                </AccordionItem>
              </Accordion>
            </div>
          </template>
        </div>
      </template>
    </div>

    <!-- Dialog done hurdle -->
    <template v-if="hurdles[doneHurdleIndex]">
      <vs-dialog v-model="doneHurdleDialog">
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

          <button class="button__register" @click="doneHurdle">
            👍 Solved.
          </button>
        </div>
      </vs-dialog>
    </template>

    <!--  -->
    <template>
      <vs-dialog v-model="solvedToUnsolvedDialog">
        <div>
          <p>
            Solved -> un solved ?
          </p>
          <button class="button__register" @click="solvedToUnsolved">
            un Solved.
          </button>
        </div>
      </vs-dialog>
    </template>

    <!--  -->
    <template>
      <vs-dialog v-model="updateHurdleTitleDialog">
        <div>
          <p>Current Title : {{ currentHurdleTitle }}</p>
          <input class="input__design" v-model="updateHurdleTitleText" />
          <button class="button__register" @click="updateHurdleTitle()">
            Update Title
          </button>
        </div>
      </vs-dialog>
    </template>

    <!--  -->
    <template>
      <vs-dialog v-model="addSolutionDialog">
        <div>
          <p>Add New Solution</p>
          <input class="input__design" v-model="addSolutionContent.sol" />
          <input class="input__design" v-model="addSolutionContent.ref" />
          <button class="button__register" @click="addSolution()">
            Add Solution
          </button>
        </div>
      </vs-dialog>
    </template>

    <!--  -->
    <template>
      <vs-dialog v-model="deleteSolutionDialog">
        <div>
          <p>Delete Solution ?</p>
          <button class="button__register" @click="deleteSolution()">
            Delete
          </button>
        </div>
      </vs-dialog>
    </template>

    <!--  -->
    <template>
      <vs-dialog v-model="updateSolutionDialog">
        <div>
          <p>Update?</p>
          <p>{{ updateSolutionBaseContent.sol }}</p>
          <p>{{ updateSolutionBaseContent.ref }}</p>

          <input v-model="updateSolutionNewContent.sol" />
          <input v-model="updateSolutionNewContent.ref" />
          <button class="button__register" @click="updateSolution()">
            Update
          </button>
        </div>
      </vs-dialog>
    </template>

    <!-- <pre>{{ hurdles }}</pre> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Accordion from "@/components/Accordion.vue";
import AccordionItem from "@/components/AccordionItem.vue";
import { db, firestore } from "@/main";

// interface hurdleSolutionDataType {
//   docId: string;
//   hurdle: string;
//   cre_at: {
//     second: number;
//     nanosecond: number;
//   };
//   useful?: Array<number>;
//   settled: boolean;
//   mini_note?: string;
//   sols: [
//     {
//       ref: string;
//       sol: string;
//       worked: boolean;
//     }
//   ];
// }

interface SolutionContentType {
  worked: boolean;
  sol: string;
  ref: string;
}

// interface dataType {
//   hurdles: hurdleSolutionDataType;
//   newHurdle: string;
//   isEmpty: boolean;

//   isCreateNewHurdle: boolean;
//   CreateHurdle: string;
//   CreateSolutions: SolutionContentType;

//   doneHurdleDialog: boolean;
//   doneHurdleIndex: number;
//   doneHurdleDocId: string;
//   checkedSolutions: [number];
//   miniNote: string;

//   hurdleUpdateTooltip: boolean;
//   solvedToUnsolvedDialog: boolean;
//   solvedToUnsolvedHurdleDocId: string;

//   updateHurdleTitleDialog: boolean;
//   currentHurdleTitle: string;
//   currentHurdleDocId: string;
//   updateHurdleTitleText: string;

//   addSolutionDialog: boolean;
//   addSolutionIndex: number;
//   addSolutionDocId: string;
//   addSolutionContent: {
//     ref: string;
//     sol: string;
//     worked: boolean;
//   };

//   deleteSolutionDialog: boolean;
//   deleteSolutionDocId: string;
//   deleteSolutionContent: {
//     ref: string;
//     sol: string;
//     worked: boolean;
//   };

//   updateSolutionDialog: boolean;
//   updateHurdleDocId: string;
//   updateHurdleNth: number;
//   updateSolutionNth: number;
//   updateSolutionBaseContent: {
//     ref: string;
//     sol: string;
//     worked: boolean;
//   };
//   updateSolutionNewContent: {
//     ref: string;
//     sol: string;
//     worked: boolean;
//   };
// }

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

      hurdleUpdateTooltip: false,
      solvedToUnsolvedDialog: false,
      solvedToUnsolvedHurdleDocId: "",

      updateHurdleTitleDialog: false,
      currentHurdleTitle: "",
      currentHurdleDocId: "",
      updateHurdleTitleText: "",

      addSolutionDialog: false,
      addSolutionIndex: 0,
      addSolutionDocId: "",
      addSolutionContent: {
        ref: "",
        sol: "",
        worked: false,
      },

      deleteSolutionDialog: false,
      deleteSolutionDocId: "",
      deleteSolutionContent: {
        ref: "",
        sol: "",
        worked: false,
      },

      updateSolutionDialog: false,
      updateHurdleDocId: "",
      updateHurdleNth: 0,
      updateSolutionNth: 0,
      updateSolutionBaseContent: {
        ref: "",
        sol: "",
        worked: false,
      },
      updateSolutionNewContent: {
        ref: "",
        sol: "",
        worked: false,
      },
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
    showAddSolution(docId: string) {
      this.addSolutionDialog = true;
      this.addSolutionDocId = docId;
    },
    addSolution() {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const hurdleId = vm.addSolutionDocId;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/tasks/${taskId}/hurdles/${hurdleId}/`
      );
      docRef
        .update({
          sols: firestore.FieldValue.arrayUnion(vm.addSolutionContent),
        })
        .then((result) => {
          console.log(result);
          vm.addSolutionContent = {
            ref: "",
            sol: "",
            worked: false,
          };
          vm.addSolutionDialog = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showDeleteSolution(content: SolutionContentType, docId: string) {
      this.deleteSolutionDialog = true;
      this.deleteSolutionDocId = docId;
      this.deleteSolutionContent = content;
    },
    deleteSolution() {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const hurdleId = vm.deleteSolutionDocId;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/tasks/${taskId}/hurdles/${hurdleId}/`
      );
      docRef
        .update({
          sols: firestore.FieldValue.arrayRemove(vm.deleteSolutionContent),
        })
        .then((result) => {
          console.log(result);
          vm.addSolutionContent = {
            ref: "",
            sol: "",
            worked: false,
          };
          vm.deleteSolutionDialog = false;
          vm.deleteSolutionContent = {
            ref: "",
            sol: "",
            worked: false,
          };
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showUpdateSolution(
      baseContent: SolutionContentType,
      hurdleDocId: string,
      hurdleIndex: number,
      solutionIndex: number
    ) {
      this.updateSolutionDialog = true;
      this.updateHurdleDocId = hurdleDocId;
      this.updateHurdleNth = hurdleIndex;
      this.updateSolutionNth = solutionIndex;
      this.updateSolutionBaseContent = baseContent;
    },
    updateSolution() {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const hurdleId = vm.updateHurdleDocId;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/tasks/${taskId}/hurdles/${hurdleId}/`
      );
      let baseSolutions = vm.hurdles[vm.updateHurdleNth].sols;
      baseSolutions[vm.updateSolutionNth] = vm.updateSolutionNewContent;
      docRef
        .update({ sols: baseSolutions })
        .then((el) => {
          console.log(el);
          vm.updateSolutionDialog = false;
          vm.updateSolutionNewContent = {
            ref: "",
            sol: "",
            worked: false,
          };
        })
        .catch((err) => console.log(err));
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
    showSolvedToUnsolved(docId: string) {
      this.solvedToUnsolvedDialog = true;
      this.solvedToUnsolvedHurdleDocId = docId;
    },
    solvedToUnsolved() {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const hurdleId = vm.solvedToUnsolvedHurdleDocId;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/tasks/${taskId}/hurdles/${hurdleId}/`
      );
      docRef
        .set(
          {
            settled: false,
          },
          { merge: true }
        )
        .then((result) => {
          console.log("complete", result);
          vm.solvedToUnsolvedDialog = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showUpdateHurdleTitle(hurdle: string, docId: string) {
      this.updateHurdleTitleDialog = true;
      this.currentHurdleTitle = hurdle;
      this.currentHurdleDocId = docId;
    },
    updateHurdleTitle() {
      const vm = this;
      const goalId = vm.$route.params.goalId;
      const taskId = vm.$route.params.taskId;
      const userId = vm.$store.state.user.uid;
      const hurdle = vm.currentHurdleDocId;
      const docRef = db.doc(
        `users/${userId}/goals/${goalId}/tasks/${taskId}/hurdles/${hurdle}/`
      );
      docRef
        .set(
          {
            hurdle: vm.updateHurdleTitleText,
          },
          { merge: true }
        )
        .then((result) => {
          console.log("complete", result);
          vm.updateHurdleTitleDialog = false;
          vm.updateHurdleTitleText = "";
        })
        .catch((err) => {
          console.log(err);
        });
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
        vm.hurdles = dataList;
        console.log(
          "Hurdle : firebaseにアクセスしました",
          "hurdlesの型は" + typeof vm.hurdles
        );
        console.log(vm.hurdles);
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
  padding: 4px 12px;
  border-radius: 10px 0px 10px 0px;
  position: absolute;
  font-size: 13px;
  font-weight: 500;
  box-shadow: none;
  cursor: pointer;
  border: none;
}
.solved {
  background: #42b983ce;
}
.solved:hover,
.solved:focus {
  background: orange;
  transition: 0.2s;
}

.unsolved {
  background: #5b5b5b;
}
.unsolved:hover,
.unsolved:focus {
  background: orange;
  transition: 0.2s;
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
.hurdle__update__tooltip {
  padding: 3px 12px;
  position: absolute;
  right: 0;
  top: 3px;
  top: 3px;
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
.create__button {
  color: #4c4c4c;
  border: none;
  background: none;
}
.create__button:hover,
.create__button:focus {
  color: #50c38f;
  transition: 0.2s;
}
.button__design {
  border: none;
  background: none;
  color: #4c4c4c68;
}
.button__design:hover,
.button__design:focus {
  color: #50c38f;
  transition: 0.2s;
}
.button__design__delete {
  border: none;
  background: none;
  color: #4c4c4c68;
}
.button__design__delete:hover,
.button__design__delete:focus {
  color: #d44343fb;
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
.button__new__hurdle {
  margin: 10px 20px;
  padding: 0.5em 2em;
  border-radius: 20px;
  border: 2px solid #4c4c4c5f;
  font-weight: bold;
  color: #4c4c4c;
}
.button__new__hurdle:hover,
.button__new__hurdle:focus {
  color: #f6f6f6;
  background: #42b983;
  transition: 0.2s;
}
.close__button:hover,
.close__button:focus {
  background: #d44343fb;
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
.input__design_create {
  width: 80%;
  padding: 0.5em;
  font-size: 16px;
  border: solid 2px #dedddd;
  border-radius: 4px;
  margin: 0.5em 0em 0em 2em;
  background: #f4f7f8;
}
.Bracket {
  border-left: 2px solid #dedddd;
  // border-bottom: 2px solid #dedddd;
}
.solved__button {
  padding: 0.5em 2em;
  font-size: 16px;
  border: solid 2px #989898;
  border-radius: 20px;
  display: block;
  margin: 0 0 0 auto;
}
.solved__button:hover,
.solved__button:focus {
  background: #50c38f;
  color: #f6f6f6;
  transition: 0.2s;
}
</style>

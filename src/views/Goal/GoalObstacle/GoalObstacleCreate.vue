<template>
  <div style="position: relative">
    <!-- First time after registering as Goal -->
    <!-- The Obstacle add button is not pressed. -->
    <template v-if="!editMode">
      <template>
        <template v-if="isObstExist">
          <button
            class="button_positive position"
            @click="toInputMode"
            style="margin-left: -3em"
          >
            <i
              class="material-icons"
              style="margin-right: 5%; vertical-align: -5px"
              add_solution_input
            >
              add_circle
            </i>
            <div style="margin: 0; padding: 0">
              <i
                class="material-icons"
                style="font-size: 12px; vertical-align: -2px"
                >hiking</i
              >
            </div>
          </button>
        </template>
        <template v-else>
          <button class="click_me" @click="toInputMode">
            <span>Register the Obstacle.</span>
          </button>
        </template>
      </template>
    </template>

    <!-- When the Add Obstacle button is pressed. -->
    <template v-else>
      <br />
      <div v-for="(obstacle, obstIndex) in inputObstacles" :key="obstacle.id">
        <i
          class="material-icons"
          style="vertical-align: -5px; padding-left: 2.8em; font-size: 16px"
          >hiking</i
        >
        <input
          class="input_text"
          style="width: 70%"
          v-model.trim="inputObstacles[obstIndex].obst"
          placeholder="Obstacle"
          ref="firstFocus"
          type="text"
        />
        <button
          class="button_positive material-icons"
          @click="deleteObstacleForm(obstIndex)"
        >
          delete
        </button>

        <div class="solution_position">
          <div
            v-for="(solution, solIndex) in inputObstacles[obstIndex].sols"
            :key="solution.id"
          >
            <div
              :class="[
                inputObstacles[obstIndex].sols.length >= 2 ? 'frame' : '',
              ]"
            >
              <i
                class="material-icons"
                style="
                  vertical-align: -5px;
                  padding-left: 1.9em;
                  font-size: 17px;
                "
                >lightbulb</i
              >

              <input
                class="input_text radius_fix input_position_correction"
                style="width: 70.5%"
                v-model.trim="solution.sol"
                placeholder="Solution"
                type="text"
              />
              <input
                class="input_text_url input_position_correction"
                style="width: 70.5%; margin-left: 4.1em"
                v-model.trim="solution.ref"
                placeholder="URL"
                type="url"
              />
              <button
                class="button_positive material-icons"
                @click="deleteSolutionForm(obstIndex, solIndex)"
              >
                delete
              </button>
            </div>
          </div>
        </div>

        <!-- Add Solution Form -->
        <button
          @click="addSolutionForm(obstIndex)"
          class="button_positive"
          style="padding-left: 36px; margin-bottom: 10px"
        >
          <i
            class="material-icons"
            style="margin-right: 5%; vertical-align: -5px"
          >
            add_circle
          </i>
          <div>
            <i
              class="material-icons"
              style="font-size: 12px; vertical-align: -2px"
              >lightbulb</i
            >
            Solution
          </div>
        </button>
        <br />
        <br />
        <br />
      </div>

      <!-- Add Obstacle Form -->
      <button
        @click="addObstacleForm"
        class="button_positive"
        style="padding-left: 1em; margin-bottom: 10px"
      >
        <i
          class="material-icons"
          style="margin-right: 10%; vertical-align: -5px"
        >
          add_circle
        </i>
        <div>
          <i
            class="material-icons"
            style="font-size: 12px; vertical-align: -2px"
            >hiking</i
          >

          Obstacle
        </div>
      </button>

      <button @click="setCancel()" class="button_cancel">Cancel</button>
      <button @click="setObstacles()" class="button_register">Register</button>
      <hr />
    </template>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";

interface obstaclesType {
  obst: string;
  sols: Array<{ sol: string; ref: string }>;
}

interface inputDataType {
  editMode: boolean;
  inputObstacles: Array<obstaclesType>;
}

export default Vue.extend({
  props: {
    isObstExist: { type: Boolean },
  },
  data(): inputDataType {
    return {
      editMode: false,
      inputObstacles: [
        {
          obst: "",
          sols: [
            {
              sol: "",
              ref: "",
            },
          ],
        },
      ],
    };
  },
  mounted() {},
  methods: {
    toInputMode() {
      this.editMode = true;
      // @ts-ignore
      this.$nextTick(() => this.$refs.firstFocus[0].focus());
    },

    addObstacleForm() {
      if (this.inputObstacles.length <= 5) {
        this.inputObstacles.push({
          obst: "",
          sols: [
            {
              sol: "",
              ref: "",
            },
          ],
        });
      } else {
        alert("多すぎ");
      }
    },
    deleteObstacleForm(index: number) {
      if (this.inputObstacles.length != 1) {
        this.inputObstacles.splice(index, 1);
      } else {
        alert("それ以上は消せません");
      }
    },
    addSolutionForm(obstIndex: number) {
      if (this.inputObstacles[obstIndex].sols.length <= 5) {
        this.inputObstacles[obstIndex].sols.push({ sol: "", ref: "" });
      } else {
        alert("多すぎ");
      }
    },
    deleteSolutionForm(obstIndex: number, solIndex: number) {
      if (this.inputObstacles[obstIndex].sols.length != 1) {
        this.inputObstacles[obstIndex].sols.splice(solIndex, 1);
      } else {
        alert("それ以上はけせません");
      }
    },
    initializeObstacles() {
      const vm = this;
      vm.inputObstacles = [
        {
          obst: "",
          sols: [
            {
              sol: "",
              ref: "",
            },
          ],
        },
      ];
    },
    setObstacles() {
      const vm = this;
      const setMultipleDocument = async () => {
        const userId = vm.$store.state.user.uid;
        const goalId = vm.$store.state.selectingGoal.docId;
        const docRef = db.collection(
          `users/${userId}/goals/${goalId}/obstacles`
        );
        const batch = db.batch();

        vm.inputObstacles.map((obstacles) => {
          batch.set(docRef.doc(), {
            obst: obstacles.obst,
            sols: obstacles.sols,
            cre_at: firestore.FieldValue.serverTimestamp(),
          });
        });
        await batch.commit();
      };
      setMultipleDocument();
      vm.initializeObstacles();
      vm.editMode = false;
    },
    setCancel() {
      const vm = this;
      vm.inputObstacles = [
        {
          obst: "",
          sols: [
            {
              sol: "",
              ref: "",
            },
          ],
        },
      ];
      vm.editMode = false;
    },
  },
});
</script>
<style lang="scss" scoped>
hr {
  border: 1px #d6d9da solid;
  width: 90%;
  text-align: left;
  margin-left: 0px;
}
.click_me {
  border: 7px dashed #d5d6d8;
  background: none;
  width: 90%;
  height: 10em;
  border-radius: 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 3em;
    font-weight: 700;
    color: #d5d6d8;
  }
  &:focus {
    border: 7px dashed #50c38f;
    transition: 0.3s;
    span {
      color: #50c38f;
      transition: 0.3s;
    }
  }
  &:hover {
    border: 7px dashed #50c38f;
    transition: 0.3s;
  }
}
.click_me.click_me:hover span {
  color: #50c38f;
  transition: 0.3s;
}

.position {
  position: absolute;
  top: -5em;
  left: 15.3em;
}

.solution_position {
  margin-left: 2em;
  padding-left: 2em;
}
.frame {
  border-left: 2px #e1e3e8 solid;
}
.input_position_correction {
  font-weight: normal;
  margin: 10px 5px 0px 16px;
}

.radius_fix {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>

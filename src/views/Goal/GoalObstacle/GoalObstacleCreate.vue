<template>
  <div style="position: relative">
    <!-- First time after registering as Goal -->
    <!-- The Obstacle add button is not pressed. -->
    <template v-if="!editMode">
      <template>
        <template v-if="isObstExist">
          <button class="button_positive add_button" @click="toEditMode">
            <i class="material-icons" style="vertical-align: -5px">
              add_circle
            </i>
            <div>
              <i
                class="material-icons"
                style="
                  vertical-align: -2px;
                  font-size: 15px;
                  margin-left: 0.1em;
                "
                >hiking</i
              >
            </div>
          </button>
        </template>
        <template v-else>
          <button class="click_me" @click="toEditMode">
            <span
              ><i
                class="material-icons"
                style="vertical-align: -6px; font-size: 1em"
              >
                add
              </i>
              Obstacle</span
            >
          </button>
        </template>
      </template>
    </template>

    <!-- When the Add Obstacle button is pressed. -->
    <template v-else>
      <hr />
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
        class="add_button button_positive"
        style="padding-bottom: 20px; padding-top: 1em"
      >
        <i class="material-icons" style="vertical-align: -5px"> add_circle </i>
        <div>
          <i
            class="material-icons"
            style="font-size: 16px; vertical-align: -2px"
            >hiking</i
          >
        </div>
      </button>

      <button
        @click="setCancel()"
        class="button_cancel"
        style="vertical-align: 20px"
      >
        Cancel
      </button>
      <button
        @click="setObstacles()"
        class="button_register"
        style="vertical-align: 20px"
      >
        Register
      </button>
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
    toEditMode() {
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
  border-top: 3px #e1e3e88f solid;
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
.add_button {
  position: absolute;
  left: -67px;
  background: #f4f7f8;
}
.click_me.click_me:hover span {
  color: #50c38f;
  transition: 0.3s;
}

.solution_position {
  margin-left: 2em;
  padding-left: 2em;
}
.frame {
  border-left: 3px #e1e3e88f solid;
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

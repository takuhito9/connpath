<template>
  <div>
    <!-- First time after registering as Goal -->
    <!-- The Obstacle add button is not pressed. -->
    <template v-if="!editMode">
      <button class="click_me" @click="toInputMode">
        <span class="add_it">Add it.</span>
      </button>
    </template>

    <!-- When the Add Obstacle button is pressed. -->
    <template v-else>
      <div v-for="(obstacle, obstIndex) in inputObstacles" :key="obstacle.id">
        <input
          class="input_text"
          v-model="inputObstacles[obstIndex].obst"
          placeholder="Obstacle"
          ref="firstFocus"
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
              <input
                class="input_text radius_fix input_position_correction"
                v-model="solution.sol"
                placeholder="Solution"
              />
              <input
                class="input_text_url input_position_correction"
                v-model="solution.ref"
                placeholder="URL"
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
          class="material-icons button_positive"
          @click="addSolutionForm(obstIndex)"
          style="margin-right: 10%; vertical-align: -5px"
        >
          add_circle
        </button>
      </div>

      <!-- Add Obstacle Form -->
      <button
        class="button_positive material-icons"
        @click="addObstacleForm"
        style="margin-right: 10%; vertical-align: -5px"
      >
        add_circle
      </button>
      <button @click="setCancel()" class="button_cancel">Cancel</button>
      <button @click="setObstacles()" class="button_register">Register</button>
    </template>

    <pre>{{ inputObstacles }}</pre>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db } from "@/main";

export default Vue.extend({
  data() {
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
          });
        });
        await batch.commit();
      };
      setMultipleDocument();
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
.click_me {
  border: 10px dashed #d5d6d8;
  background: none;
  width: 90%;
  height: 10em;
  border-radius: 10px 10px;

  &:focus {
    border: 10px dashed #50c38f;
    transition: 0.3s;
  }
  &:hover {
    border: 10px dashed #50c38f;
    transition: 0.3s;
  }
}
.click_me:focus .add_it {
  color: #50c38f;
  transition: 0.3s;
}
.click_me:hover .add_it {
  color: #50c38f;
  transition: 0.3s;
}
.add_it {
  font-size: 3em;
  font-weight: 700;
  color: #d5d6d8;
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

.input_text_url {
  width: 80%;
  height: 6px;
  position: relative;
  top: -7px;
  padding: 0.5em;
  background: #e1e3e8;
  font-size: 1em;
  color: #4c4c4c;
  border: solid 2px #e1e3e8;
  border-radius: 4px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: 0;
  &:focus {
    border: solid 2px #50c38f;
    transition: 0.2s;
  }
}
</style>

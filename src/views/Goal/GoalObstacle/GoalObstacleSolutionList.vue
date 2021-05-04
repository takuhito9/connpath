<template>
  <div style="position: relative">
    <button class="solution">
      <ul class="icon">
        <li>
          <button
            @click="openDeleteOverlay"
            class="material-icons button_negative hover_icons"
          >
            delete
          </button>
        </li>

        <li>
          <button
            @click="openUpdateOverlay"
            class="material-icons button_positive hover_icons"
          >
            edit
          </button>
        </li>
      </ul>

      <ul class="sol_ul">
        <li class="sol_li">
          <span class="line">{{ sol.sol }}</span>
          <br />
          <a class="link" target="blank" :href="sol.ref">{{ sol.ref }}</a>
        </li>
      </ul>
    </button>

    <focus-trap v-model="deleteFocusTrapIsActive">
      <div>
        <GoalObstacleSolutionDelete
          ref="deleteComponent"
          @closeDeleteOverlay="closeDeleteOverlay"
          v-if="deleteModal"
          :sol="sol"
          :solNth="solNth"
          :obstId="obstId"
        />
      </div>
    </focus-trap>

    <template>
      <focus-trap v-model="updateFocusTrapIsActive">
        <div>
          <GoalObstacleSolutionUpdate
            ref="updateComponent"
            @closeUpdateOverlay="closeUpdateOverlay"
            v-if="updateModal"
            :sols="sols"
            :sol="sol"
            :solNth="solNth"
            :obstId="obstId"
          />
        </div>
      </focus-trap>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { FocusTrap } from "focus-trap-vue";

import GoalObstacleSolutionDelete from "@/views/Goal/GoalObstacle/GoalObstacleSolutionDelete.vue";
import GoalObstacleSolutionUpdate from "@/views/Goal/GoalObstacle/GoalObstacleSolutionUpdate.vue";
interface solType {
  sol: string;
  ref: string;
}

export default Vue.extend({
  components: {
    FocusTrap,
    GoalObstacleSolutionUpdate,
    GoalObstacleSolutionDelete,
  },
  props: {
    sols: { type: Array as () => Array<solType> },
    sol: { type: Object as () => solType },
    solNth: { type: Number },
    obstId: { type: String },
  },
  data() {
    return {
      deleteModal: false,
      deleteFocusTrapIsActive: false,
      updateModal: false,
      updateFocusTrapIsActive: false,
    };
  },
  methods: {
    openDeleteOverlay() {
      this.deleteFocusTrapIsActive = true;
      this.deleteModal = true;
      // @ts-ignore
      this.$nextTick(() => this.$refs.deleteComponent.firstFocus());
    },
    closeDeleteOverlay() {
      this.deleteModal = false;
      this.deleteFocusTrapIsActive = false;
    },
    openUpdateOverlay() {
      this.updateFocusTrapIsActive = true;
      this.updateModal = true;
      // @ts-ignore
      this.$nextTick(() => this.$refs.updateComponent.firstFocus());
    },
    closeUpdateOverlay() {
      this.updateFocusTrapIsActive = false;
      this.updateModal = false;
    },
  },
});
</script>
<style lang="scss" scoped>
.solution {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #4c4c4c;
  display: block;

  width: 100%;
  padding: 7px 20px 0.1px 0px;
  border: none;
  background: none;
  font-size: 1em;
  text-align: left;
  &:hover {
    transition: 0.2s;
    background: #e5e8e9;
    border-radius: 10px;
  }
  &:focus {
    transition: 0.2s;
    background: #e5e8e9;
    border-radius: 10px;
  }
}

.solution ul.icon {
  list-style: none;
  float: right;
}
.solution ul.icon li {
  display: inline;
  margin-left: 5px;
}
.solution ul.icon li {
  opacity: 0;
}
.solution:focus ul.icon li {
  opacity: 0.5;
}
.solution:hover ul.icon li {
  opacity: 0.5;
}
.solution ul.icon li:focus {
  opacity: 1;
}
.solution ul.icon li:hover {
  opacity: 1;
}

.hover_icons {
  vertical-align: 5px;
  &:hover {
    opacity: 1;
  }
  &:focus {
    opacity: 1;
  }
}
.link {
  color: #95969c;
  text-decoration: none;
  &:hover {
    border-bottom: solid 1px #95969c;
  }
}
.sol_ul {
  list-style: none;

  .sol_li {
    margin-bottom: 10px;
    text-indent: -1.65em;

    &:before {
      vertical-align: -3px;
      font-family: "Material Icons";
      margin-right: 10px;
      content: "lightbulb";
    }
  }
}
</style>

<template>
  <div style="position: relative">
    <button class="item_hover">
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
    sols: Array as Vue.PropType<Array<solType>>,
    sol: Object as Vue.PropType<solType>,
    solNth: Number,
    obstId: String,
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

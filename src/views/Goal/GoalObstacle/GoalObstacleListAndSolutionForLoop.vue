<template>
  <div>
    <ul class="block obst_ul">
      <button class="item_hover" style="padding: 7px 1em 10px 1.5em">
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

        <li class="obst_li">
          <span class="line">{{ obst.obst }}</span>
        </li>
      </button>

      <!-- For Loop `Solution` -->
      <div style="margin-left: 2em; border-left: 3px #e1e3e88f solid">
        <div
          v-for="(sol, index) in obst.sols"
          :key="sol.id"
          style="margin-left: 15px"
        >
          <GoalObstacleSolutionList
            :sols="obst.sols"
            :sol="sol"
            :solNth="index"
            :obstId="obst.docId"
          />
        </div>
      </div>
    </ul>

    <!-- Add `Solution` -->
    <GoalObstacleSolutionAdd :obst="obst" />
    <br />

    <!-- Delete Obstacle -->
    <focus-trap v-model="deleteFocusTrapIsActive">
      <div>
        <GoalObstacleDelete
          ref="deleteComponent"
          @closeDeleteOverlay="closeDeleteOverlay"
          :obst="obst"
          v-if="deleteModal"
        />
      </div>
    </focus-trap>

    <!-- Update Obstacle -->
    <focus-trap v-model="updateFocusTrapIsActive">
      <div>
        <GoalObstacleUpdate
          ref="updateComponent"
          @closeUpdateOverlay="closeUpdateOverlay"
          v-if="updateModal"
          :obst="obst"
        />
      </div>
    </focus-trap>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import GoalObstacleSolutionList from "@/views/Goal/GoalObstacle/GoalObstacleSolutionList.vue";
import GoalObstacleSolutionAdd from "@/views/Goal/GoalObstacle/GoalObstacleSolutionAdd.vue";
import GoalObstacleDelete from "@/views/Goal/GoalObstacle/GoalObstacleDelete.vue";
import GoalObstacleUpdate from "@/views/Goal/GoalObstacle/GoalObstacleUpdate.vue";
import { FocusTrap } from "focus-trap-vue";

interface obstType {
  docId: string;
  obst: string;
  sols: {
    ref: string;
    sol: string;
  };
}
export default Vue.extend({
  components: {
    FocusTrap,
    GoalObstacleSolutionList,
    GoalObstacleSolutionAdd,
    GoalObstacleDelete,
    GoalObstacleUpdate,
  },
  props: {
    obst: { type: Object as () => obstType },
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
.line {
  background: -moz-linear-gradient(transparent 70%, #c3505033 70%);
  background: -webkit-linear-gradient(transparent 70%, #c3505033 70%);
  background: linear-gradient(transparent 70%, #c3505033 70%);
}
.block {
  padding-left: 1em;
  margin-left: 1em;
}
.obst_ul {
  list-style: none;
  margin-bottom: 5px;

  .obst_li {
    margin-bottom: 10px;
    text-indent: -1.7em;
    padding-left: 1em;

    &:before {
      vertical-align: -2px;
      font-family: "Material Icons";
      margin-right: 10px;
      content: "hiking";
    }
  }
}
</style>

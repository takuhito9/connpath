<template>
  <div>
    <ul style="padding-inline-start: 30px">
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

        <li class="indent">
          <template v-if="condition.cmplt">
            <button
              class="material-icons button_positive"
              style="vertical-align: -10px"
              @click="openDoneOverlay"
            >
              task_alt
            </button>
          </template>
          <template v-else>
            <button
              class="material-icons button_positive"
              style="vertical-align: -10px"
              @click="openDoneOverlay"
            >
              radio_button_unchecked
            </button>
          </template>
          <span
            :class="[condition.cmplt ? 'strink' : '']"
            style="vertical-align: -5px"
          >
            {{ condition.cond }}
          </span>
        </li>
      </button>
    </ul>

    <!-- Delete `Condition of Success` -->
    <focus-trap v-model="deleteFocusTrapIsActive">
      <div>
        <GoalConditionOfSuccessDelete
          ref="deleteComponent"
          @closeDeleteOverlay="closeDeleteOverlay"
          v-if="deleteModal"
          :condition="condition"
        />
      </div>
    </focus-trap>

    <!-- Update `Condition of Success` -->
    <focus-trap v-model="updateFocusTrapIsActive">
      <div>
        <GoalConditionOfSuccessUpdate
          ref="updateComponent"
          @closeUpdateOverlay="closeUpdateOverlay"
          v-if="updateModal"
          :condition="condition"
          :coss="coss"
          :nth="nth"
        />
      </div>
    </focus-trap>

    <!-- Done / Not Yet `Condition of Success` -->
    <focus-trap v-model="doneFocusTrapIsActive">
      <div>
        <GoalConditionOfSuccessDone
          ref="doneComponent"
          @closeDoneOverlay="closeDoneOverlay"
          v-if="doneModal"
          :condition="condition"
          :coss="coss"
          :nth="nth"
        />
      </div>
    </focus-trap>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GoalConditionOfSuccessDelete from "@/views/Goal/GoalConditionOfSuccess/GoalConditionOfSuccessDelete.vue";
import GoalConditionOfSuccessUpdate from "@/views/Goal/GoalConditionOfSuccess/GoalConditionOfSuccessUpdate.vue";
import GoalConditionOfSuccessDone from "@/views/Goal/GoalConditionOfSuccess/GoalConditionOfSuccessDone.vue";
import { FocusTrap } from "focus-trap-vue";

interface cosType {
  cond: string;
  cmplt: boolean;
}

export default Vue.extend({
  components: {
    GoalConditionOfSuccessDelete,
    GoalConditionOfSuccessUpdate,
    GoalConditionOfSuccessDone,
    FocusTrap,
  },
  props: {
    condition: { type: Object },
    coss: { type: Array as () => Array<cosType> },
    nth: { type: Number },
  },
  data() {
    return {
      deleteModal: false,
      deleteFocusTrapIsActive: false,
      updateModal: false,
      updateFocusTrapIsActive: false,
      doneModal: false,
      doneFocusTrapIsActive: false,
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
    openDoneOverlay() {
      this.doneFocusTrapIsActive = true;
      this.doneModal = true;
      // @ts-ignore
      this.$nextTick(() => this.$refs.doneComponent.firstFocus());
    },
    closeDoneOverlay() {
      this.doneFocusTrapIsActive = false;
      this.doneModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
}
.strink {
  text-decoration: line-through;
  color: #50c38f91;
}
.indent {
  padding-left: 2.7em;
  text-indent: -2.5em;
}
</style>

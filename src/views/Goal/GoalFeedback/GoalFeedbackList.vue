<template>
  <div>
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
            {{ feedback }}
          </li>
        </button>
      </ul>

      <!-- Delete `Condition of Success` -->
      <focus-trap v-model="deleteFocusTrapIsActive">
        <div>
          <GoalFeedbackDelete
            ref="deleteComponent"
            @closeDeleteOverlay="closeDeleteOverlay"
            v-if="deleteModal"
            :feedback="feedback"
          />
        </div>
      </focus-trap>

      <!-- Update `Condition of Success` -->
      <focus-trap v-model="updateFocusTrapIsActive">
        <div>
          <GoalFeedbackUpdate
            ref="updateComponent"
            @closeUpdateOverlay="closeUpdateOverlay"
            v-if="updateModal"
            :feedback="feedback"
            :fdbks="fdbks"
            :nth="nth"
          />
        </div>
      </focus-trap>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { FocusTrap } from "focus-trap-vue";
import GoalFeedbackDelete from "@/views/Goal/GoalFeedback/GoalFeedbackDelete.vue";
import GoalFeedbackUpdate from "@/views/Goal/GoalFeedback/GoalFeedbackUpdate.vue";

export default Vue.extend({
  components: {
    GoalFeedbackDelete,
    GoalFeedbackUpdate,
    FocusTrap,
  },

  props: {
    feedback: { type: String },
    fdbks: { type: Array as () => Array<string> },
    nth: { type: Number },
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
ul {
  list-style: none;
  margin: 0;
}
.indent {
  padding-left: 1em;
}
</style>

<template>
  <div>
    <h3>
      <i class="material-icons" style="vertical-align: -5px; margin-right: 2px"
        >card_giftcard
      </i>
      Feedback
    </h3>

    <div class="left_border">
      <div class="position_correction">
        <template v-if="!fdbks">
          <GoalFeedbackAdd :isFeedbackExist="fdbks.length >= 1" />
        </template>
        <template v-else>
          <div v-for="(feedback, index) in fdbks" :key="feedback.id">
            <GoalFeedbackList
              :feedback="feedback"
              :fdbks="fdbks"
              :nth="index"
            />
          </div>
          <GoalFeedbackAdd :isFeedbackExist="fdbks.length >= 1" />
        </template>
      </div>
    </div>
    <br />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GoalFeedbackList from "@/views/Goal/GoalFeedback/GoalFeedbackList.vue";
import GoalFeedbackAdd from "@/views/Goal/GoalFeedback/GoalFeedbackAdd.vue";

export default Vue.extend({
  components: {
    GoalFeedbackList,
    GoalFeedbackAdd,
  },
  props: {
    fdbks: Array as Vue.PropType<Array<string>>,
  },
  data() {
    return {
      feedbackAddDialog: false,
      feedbackAddInput: "",
    };
  },
});
</script>
<style lang="scss" scoped>
.position_correction {
  font-weight: normal;
  margin: 0em 0em 0.5em 0em;
}
.left_border {
  margin-left: 0.8em;
  border-left: 3px solid #e1e3e88f;
}
</style>

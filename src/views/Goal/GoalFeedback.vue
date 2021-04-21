<template>
  <div>
    <h3>
      <i class="material-icons" style="vertical-align: -5px; margin-right: 5px"
        >card_giftcard
      </i>
      Feedback
    </h3>
    <div v-for="feedback in fdbks" :key="feedback.id">
      <h4 class="position_correction">
        {{ feedback }}
      </h4>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    fdbks: Array as Vue.PropType<Array<string>>,
  },
});
</script>
<style lang="scss" scoped>
.position_correction {
  font-weight: normal;
  margin: 0em 0em 0.5em 3em;
}
</style>

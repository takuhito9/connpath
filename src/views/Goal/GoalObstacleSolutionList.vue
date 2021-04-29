<template>
  <div>
    <h4>{{ sol }}</h4>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
interface solType {
  sol: "";
  ref: "";
}

export default Vue.extend({
  data() {
    return {};
  },
  props: { sol: Object as Vue.PropType<solType> },
  methods: {},
});
</script>

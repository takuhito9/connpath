<template>
  <div>
    <h4>{{ obst }}</h4>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
interface obstType {
  obst: string;
  sols: {
    ref: string;
    sol: string;
  };
}

export default Vue.extend({
  data() {
    return {};
  },
  props: {
    obst: Object as Vue.PropType<obstType>,
  },
  methods: {
    updateSolutios() {},
  },
});
</script>

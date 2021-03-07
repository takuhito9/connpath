<template>
  <div>
    <h3>🖋 Note<span> ➕ </span></h3>

    <div class="grid"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  gap: 0px 10px;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
}
</style>

<template>
  <div id="overlay">
    <div id="content">
      <h1>Content</h1>
      <button @click="closeOverlay">閉じる</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Modal",
  props: ["val"],
  methods: {
    closeOverlay() {
      this.$emit("close");
    },
  },
});
</script>

<style lang='scss' scoped>
#overlay {
  z-index: 1000;
  position: fixed;
  overflow-x: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

#content {
  z-index: 1000;
  position: relative;
  width: 50%;
  padding-top: 5em;
  padding-bottom: 5em;
  text-align: center;
}

#content > img {
  width: 95%;
}
</style>

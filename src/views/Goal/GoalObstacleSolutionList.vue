<template>
  <div>
    <ul class="sol_ul">
      <li class="sol_li">
        {{ sol.sol }}
        <br />
        <a target="blank" :href="sol.ref">{{ sol.ref }}</a>
      </li>
    </ul>
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
<style lang="scss" scoped>
.sol_ul {
  list-style: none;

  .sol_li {
    margin-bottom: 10px;
    text-indent: -2em;

    &:before {
      vertical-align: -3px;
      font-family: "Material Icons";
      margin-right: 10px;
      content: "lightbulb";
    }
  }
}
</style>

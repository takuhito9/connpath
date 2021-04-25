<template>
  <div>
    <div>
      <ul v-for="obst in obsts" :key="obst.id" class="block obst_ul">
        <li class="obst_li">{{ obst.obst }}</li>
        <div style="border-left: 3px #e1e3e8 solid">
          <ul
            v-for="sol in obst.sols"
            :key="sol.id"
            class="solution_position sol_ul"
          >
            <li class="sol_li">
              {{ sol.sol }}
            </li>
          </ul>
        </div>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
interface obstsType {
  obst: string;
  sols: {
    ref: string;
    sol: string;
  };
}
export default Vue.extend({
  props: {
    obsts: Array as Vue.PropType<Array<obstsType>>,
  },
});
</script>
<style lang="scss" scoped>
.block {
  padding-bottom: 10px;
  padding-left: 1em;
  margin-left: 1em;
}
.solution_position {
  margin-left: 2em;
  padding-left: 2em;
}
.obst_ul {
  list-style: none;

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

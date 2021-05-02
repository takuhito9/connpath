<template>
  <div style="position: relative">
    <button class="solution">
      <GoalObstacleSolutionDelete @close="closeOverlay" v-if="del" />

      <ul class="icon">
        <li class="action_icon">
          <button
            @click="delDisplay"
            class="material-icons button_negative hover_icons"
          >
            delete
          </button>
        </li>

        <li>
          <button class="material-icons button_positive hover_icons">
            edit
          </button>
        </li>
      </ul>
      <ul class="sol_ul">
        <li class="sol_li">
          <span class="line">{{ sol.sol }}</span>
          <br />
          <a class="link" target="blank" :href="sol.ref">{{ sol.ref }}</a>
        </li>
      </ul>
    </button>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import GoalObstacleSolutionDelete from "@/views/Goal/GoalObstacle/GoalObstacleSolutionDelete.vue";
interface solType {
  sol: "";
  ref: "";
}

export default Vue.extend({
  components: {
    GoalObstacleSolutionDelete,
  },
  data() {
    return {
      del: false,
    };
  },
  props: { sol: Object as () => solType },
  methods: {
    delDisplay() {
      this.del = true;
    },
    closeOverlay() {
      this.del = false;
    },
  },
});
</script>
<style lang="scss" scoped>
.solution {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #4c4c4c;
  display: block;

  width: 100%;
  padding: 7px 20px 0.1px 0px;
  border: none;
  background: none;
  font-size: 1em;
  text-align: left;
  &:hover {
    transition: 0.2s;
    background: #e5e8e9;
    border-radius: 10px;
  }
  &:focus {
    transition: 0.2s;
    background: #e5e8e9;
    border-radius: 10px;
  }
}

.solution ul.icon {
  list-style: none;
  float: right;
}
.solution ul.icon li {
  display: inline;
  margin-left: 5px;
}
.solution ul.icon li {
  opacity: 0;
}
.solution:focus ul.icon li {
  opacity: 0.5;
}
.solution:hover ul.icon li {
  opacity: 0.5;
}
.solution ul.icon li:focus {
  opacity: 1;
}
.solution ul.icon li:hover {
  opacity: 1;
}

.hover_icons {
  vertical-align: 5px;
  &:hover {
    opacity: 1;
  }
  &:focus {
    opacity: 1;
  }
}
.link {
  color: #95969c;
  text-decoration: none;
  &:hover {
    border-bottom: solid 1px #95969c;
  }
}
.sol_ul {
  list-style: none;

  .sol_li {
    margin-bottom: 10px;
    text-indent: -1.65em;

    &:before {
      vertical-align: -3px;
      font-family: "Material Icons";
      margin-right: 10px;
      content: "lightbulb";
    }
  }
}
</style>

<template>
  <div>
    <div>
      <h3 class="obst_position">
        <i
          class="material-icons"
          style="vertical-align: -5px; margin-right: 5px"
          >hiking</i
        >Obstacles
      </h3>

      <div class="left_border">
        <h3 class="solution_position">
          <i
            class="material-icons"
            style="vertical-align: -5px; margin-right: 5px"
            >lightbulb</i
          >
          Solutions
        </h3>

        <div class="position_correction">
          <!-- If obstacle is unregistered -->
          <template v-if="!obsts.length">
            <GoalObstacleCreate :isObstExist="isObstExist" />
          </template>
          <template v-else>
            <GoalObstacleForLoop :obsts="obsts" />
            <GoalObstacleCreate
              :isObstExist="isObstExist"
              style="display: inline"
            />
          </template>
        </div>
      </div>
    </div>
    <br /><br />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db } from "@/main";
import GoalObstacleCreate from "@/views/Goal/GoalObstacle/GoalObstacleCreate.vue";
import GoalObstacleForLoop from "@/views/Goal/GoalObstacle/GoalObstacleForLoop.vue";
interface solType {
  sol: string;
  ref: string;
}

interface obstsType {
  docId: string;
  obst: string;
  sols: Array<solType>;
}

interface dataType {
  isObstExist: boolean;
  editMode: boolean;
  obsts: Array<obstsType>;
}

export default Vue.extend({
  components: {
    GoalObstacleCreate,
    GoalObstacleForLoop,
  },
  data(): dataType {
    return {
      isObstExist: false,
      editMode: false,
      obsts: [
        {
          docId: "",
          obst: "",
          sols: [
            {
              ref: "",
              sol: "",
            },
          ],
        },
      ],
    };
  },
  created() {
    const vm = this;
    const goalId = vm.$route.params.id;
    const userId = vm.$store.state.user.uid;
    const ref = db.collection(`users/${userId}/goals/${goalId}/obstacles`);
    ref.orderBy("cre_at").onSnapshot((querysnapshot) => {
      if (querysnapshot.docs.length == 0) {
        vm.isObstExist = false;
      } else {
        vm.isObstExist = true;
      }
      const dataList = querysnapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(), // spread
      }));
      console.log("obstacle: firebaseにアクセスしました");
      vm.obsts = dataList as Array<obstsType>;
    });
  },
});
</script>

<style lang="scss" scoped>
.position_correction {
  font-weight: normal;
  margin: 0em 0em 0.5em 3em;
}
.obst_position {
  margin: 1em 0em 0em 0em;
}
.solution_position {
  margin: 0.5em 0em 1em 2em;
}
.left_border {
  margin-left: 0.8em;
  border-left: 3px solid #e1e3e88f;
}
</style>

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
          <GoalObstacleCreate />
        </template>
        <template v-else>
          <GoalObstacleList :obsts="obsts" />
          <GoalObstacleCreate />
        </template>
      </div>
    </div>
  </div>
</template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db } from "@/main";
import GoalObstacleCreate from "@/views/Goal/GoalObstacleCreate.vue";
import GoalObstacleList from "@/views/Goal/GoalObstacleList.vue";

interface obstsType {
  docId: string;
  obst: string;
  sols: {
    ref: string;
    sol: string;
  };
}

interface dataType {
  editMode: boolean;
  obsts: Array<obstsType>;
}

export default Vue.extend({
  components: {
    GoalObstacleCreate,
    GoalObstacleList,
  },
  data(): dataType {
    return {
      editMode: false,
      obsts: [
        {
          docId: "",
          obst: "",
          sols: {
            ref: "",
            sol: "",
          },
        },
      ],
    };
  },
  created() {
    const vm = this;
    const goalId = vm.$route.params.id;
    const userId = vm.$store.state.user.uid;
    const ref = db.collection(`users/${userId}/goals/${goalId}/obstacles`);
    ref.onSnapshot((querysnapshot) => {
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
</style>

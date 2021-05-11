<template>
  <div>
    <div class="category">
      <p style="margin: 0 0 2em 0">
        <span class="wish">
          <i class="material-icons" style="vertical-align: -5px">arrow_right</i>
          {{ goal.wish }}</span
        >
      </p>

      <!-- Title -->
      <button class="goal_title item_hover_goal">
        <div class="indent">
          <ul class="icon">
            <li>
              <button
                @click="openTitleUpdateOverlay"
                class="material-icons button_positive"
              >
                edit
              </button>
            </li>
          </ul>
          <span class="material-icons" style="vertical-align: -4px">flag</span>
          {{ goal.goal }}
        </div>
      </button>

      <!-- Detail -->
      <button style="padding-left: 2em" class="item_hover">
        <div class="indent">
          <ul class="icon">
            <li>
              <button
                @click="openDetailUpdateOverlay"
                class="material-icons button_positive"
              >
                edit
              </button>
            </li>
          </ul>
          {{ goal.deets }}
        </div>
      </button>
    </div>

    <!-- Update Goal Title -->
    <focus-trap v-model="titleUpdateFocusTrapIsActive">
      <div>
        <GoalTitleUpdate
          ref="titleUpdateComponent"
          @closeTitleUpdateOverlay="closeTitleUpdateOverlay"
          v-if="titleUpdateModal"
          :goal="goal.goal"
        />
      </div>
    </focus-trap>

    <!-- Update Goal Detail -->
    <focus-trap v-model="detailUpdateFocusTrapIsActive">
      <div>
        <GoalDetailUpdate
          ref="detailUpdateComponent"
          @closeDetailUpdateOverlay="closeDetailUpdateOverlay"
          v-if="detailUpdateModal"
          :deets="goal.deets"
        />
      </div>
    </focus-trap>

    <!-- components -->
    <div class="category">
      <GoalFeedback :fdbks="goal.fdbks" />
    </div>
    <div class="category">
      <GoalConditionOfSuccessForLoop :coss="goal.coss" />
    </div>
    <div class="category">
      <GoalObstacle />
    </div>
    <div class="category">
      <TaskList />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db } from "@/main";
import { FocusTrap } from "focus-trap-vue";
import GoalTitleUpdate from "@/views/Goal/GoalTitleUpdate.vue";
import GoalDetailUpdate from "@/views/Goal/GoalDetailUpdate.vue";
import GoalConditionOfSuccessForLoop from "@/views/Goal/GoalConditionOfSuccess/GoalConditionOfSuccessForLoop.vue";
import GoalFeedback from "@/views/Goal//GoalFeedback/GoalFeedbackForLoop.vue";
import GoalObstacle from "@/views/Goal/GoalObstacle/GoalObstacle.vue";
import TaskList from "@/views/Goal/Task/TaskList.vue";

interface goalObjectType {
  wish: string;
  goal: string;
  fdbks: string[];
  coss: Array<{
    cond: string;
    cmplt: boolean;
  }>;
  deets: string;
  cre_at: {
    seconds: number;
    nanoseconds: number;
  };
  docId: string;
}

interface dataType {
  goal: goalObjectType;
  titleUpdateFocusTrapIsActive: boolean;
  titleUpdateModal: boolean;
  detailUpdateFocusTrapIsActive: boolean;
  detailUpdateModal: boolean;
}

export default Vue.extend({
  components: {
    GoalTitleUpdate,
    GoalDetailUpdate,
    TaskList,
    GoalConditionOfSuccessForLoop,
    GoalFeedback,
    GoalObstacle,
    FocusTrap,
  },
  data(): dataType {
    return {
      goal: {
        wish: "",
        goal: "",
        fdbks: [""],
        coss: [{ cond: "", cmplt: false }],
        deets: "",
        cre_at: {
          seconds: 0,
          nanoseconds: 0,
        },
        docId: "",
      },
      titleUpdateModal: false,
      titleUpdateFocusTrapIsActive: false,
      detailUpdateModal: false,
      detailUpdateFocusTrapIsActive: false,
    };
  },
  methods: {
    openTitleUpdateOverlay() {
      this.titleUpdateFocusTrapIsActive = true;
      this.titleUpdateModal = true;
      // @ts-ignore
      this.$nextTick(() => this.$refs.titleUpdateComponent.firstFocus());
    },
    closeTitleUpdateOverlay() {
      this.titleUpdateFocusTrapIsActive = false;
      this.titleUpdateModal = false;
    },
    openDetailUpdateOverlay() {
      this.detailUpdateFocusTrapIsActive = true;
      this.detailUpdateModal = true;
      // @ts-ignore
      this.$nextTick(() => this.$refs.detailUpdateComponent.firstFocus());
    },
    closeDetailUpdateOverlay() {
      this.detailUpdateFocusTrapIsActive = false;
      this.detailUpdateModal = false;
    },
  },
  created() {
    const vm = this;
    const goalId = vm.$route.params.id;
    const userId = vm.$store.state.user.uid;
    const docRef = db.doc(`users/${userId}/goals/${goalId}`);
    docRef.onSnapshot(function (doc) {
      const docData = doc.data();
      if (docData) {
        docData.docId = goalId;
        vm.goal = docData as goalObjectType;
        vm.$store.commit("setSelectingGoal", vm.goal);
        console.log("Firebaseにアクセスしてデータを取得しました");
      } else {
        console.log(Error);
      }
    });
  },
});
</script>

<style lang="scss" scoped>
.position_correction {
  font-weight: normal;
  margin: 0em 0em 0.5em 3em;
  width: 50%;
}
.category {
  padding-bottom: 1em;
}
.wish {
  background: #eaeded;
  border-radius: 10px;
  padding: 5px 10px;
}
.item_hover_goal {
  display: block;
  border: none;
  width: 100%;
  background: none;
  padding: 10px 10px 10px 1px;
  text-align: left;
  font-size: 1.8em;
  font-weight: 700;
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
.item_hover_goal ul.icon {
  list-style: none;
  float: right;
}
.item_hover_goal ul.icon li {
  display: inline;
  margin-left: 5px;
}
.item_hover_goal ul.icon li {
  opacity: 0;
}
.item_hover_goal:focus ul.icon li {
  opacity: 0.5;
}
.item_hover_goal:hover ul.icon li {
  opacity: 0.5;
}
.item_hover_goal ul.icon li:focus {
  opacity: 1;
}
.item_hover_goal ul.icon li:hover {
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
ul {
  list-style: none;
  margin: 0;
}
.indent {
  padding-left: 1em;
  text-indent: -0.5em;
}
</style>

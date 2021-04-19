<template>
  <div>
    <h4>Please enter your wishes and dreams.</h4>
    <input class="input_text" v-model="wish" placeholder="Wish" />

    <h4>What is the desired outcome regarding your wish ?</h4>
    <h1 style="color: #50c38f">{{ goal }}</h1>
    <input class="input_text" v-model="goal" placeholder="Outcome" />

    <h4>Please enter your Details.</h4>
    <textarea
      rows="3"
      class="input_text"
      v-model="deets"
      placeholder="Details"
    ></textarea>

    <h4>
      <i class="material-icons" style="vertical-align: -5px; margin-right: 5px">
        card_giftcard
      </i>
      Feedback
    </h4>
    <div :class="[feedbacks.length >= 2 ? 'frame' : '']">
      <div v-for="(feedback, index) in feedbacks" :key="feedback.id">
        <input
          class="input_text"
          v-model="feedbacks[index]"
          placeholder="Feedback"
        /><button
          class="button_positive material-icons"
          @click="deleteFeedbackForm(index)"
        >
          delete
        </button>
      </div>
      <button
        class="button_positive material-icons"
        style="margin-left: 85%"
        @click="addFeedbackForm"
      >
        add_circle
      </button>
    </div>

    <h4>
      <i class="material-icons" style="vertical-align: -5px; margin-right: 5px"
        >rule</i
      >
      Condition of Success
    </h4>
    <div :class="[coss.length >= 2 ? 'frame' : '']">
      <div v-for="(cos, index) in coss" :key="cos.id">
        <input
          class="input_text"
          v-model="coss[index].cond"
          placeholder="Condition of Success"
        /><button
          @click="deleteCossForm(index)"
          class="button_positive material-icons"
        >
          delete
        </button>
      </div>
      <button
        @click="addCossForm"
        class="button_positive material-icons"
        style="margin-left: 85%"
      >
        add_circle
      </button>
    </div>

    <button class="button_register" @click="setGoal">Register</button>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";

interface conditionOfSuccessType {
  cmplt: boolean;
  cond: string;
}

interface DataType {
  wish: string;
  goal: string;
  deets: string;
  feedbacks: string[];
  coss: conditionOfSuccessType[];
}

export default Vue.extend({
  data(): DataType {
    return {
      wish: "",
      goal: "",
      deets: "",
      feedbacks: [""],
      coss: [{ cmplt: false, cond: "" }],
    };
  },
  methods: {
    addFeedbackForm() {
      if (this.feedbacks.length <= 5) {
        this.feedbacks.push("");
      } else {
        alert("多すぎ");
      }
    },
    deleteFeedbackForm(index: number) {
      if (this.feedbacks.length != 1) {
        this.feedbacks.splice(index, 1);
      } else {
        alert("それ以上は消せません");
      }
    },
    addCossForm() {
      if (this.coss.length <= 5) {
        this.coss.push({ cmplt: false, cond: "" });
      } else {
        alert("多すぎ");
      }
    },
    deleteCossForm(index: number) {
      if (this.coss.length != 1) {
        this.coss.splice(index, 1);
      } else {
        alert("それ以上は消せません");
      }
    },
    setGoal() {
      const vm = this;
      const collectionRef = db.collection(
        `users/${vm.$store.state.user.uid}/goals`
      );

      if (!vm.goal) {
        alert("Goalは必須です");
      } else {
        const data = {
          wish: vm.wish,
          goal: vm.goal,
          deets: vm.deets,
          cos: vm.coss,
          fdbk: vm.feedbacks,
          cre_at: firestore.FieldValue.serverTimestamp(),
        };
        collectionRef
          .add(data)
          .then(function (docRef) {
            console.log(docRef, "Document Successfully Written!!!");
            vm.$router.push({
              name: "GoalDetail",
              params: {
                id: docRef.id,
              },
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.frame {
  border-left: 2px #e1e3e8 solid;
}
</style>

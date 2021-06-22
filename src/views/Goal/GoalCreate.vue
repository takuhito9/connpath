<template>
  <div>
    <div class="category">
      <h4>Please enter your wishes and dreams.</h4>
      <input class="input_text" v-model="wish" placeholder="Wish" />
    </div>

    <div class="category">
      <h4>What is the desired outcome regarding your wish ?</h4>
      <h1 style="color: #50c38f">{{ goal }}</h1>
      <input class="input_text" v-model="goal" placeholder="Outcome" />
    </div>

    <div class="category">
      <h4>Please enter your Details.</h4>
      <textarea
        rows="3"
        class="input_text"
        v-model="deets"
        placeholder="Details"
      ></textarea>
    </div>

    <div class="category">
      <h4>
        <i
          class="material-icons"
          style="vertical-align: -5px; margin-right: 5px"
        >
          card_giftcard
        </i>
        Feedback
        <button
          class="button_positive material-icons"
          style="margin-right: 10%; vertical-align: -5px"
          @click="addFeedbackForm"
        >
          add_circle
        </button>
      </h4>
      <div :class="[fdbks.length >= 2 ? 'frame' : '']">
        <div v-for="(feedback, index) in fdbks" :key="feedback.id">
          <input
            class="input_text"
            v-model="fdbks[index]"
            placeholder="Feedback"
          /><button
            class="button_positive material-icons"
            @click="deleteFeedbackForm(index)"
          >
            delete
          </button>
        </div>
      </div>
    </div>

    <div class="category">
      <h4>
        <i
          class="material-icons"
          style="vertical-align: -5px; margin-right: 5px"
          >rule</i
        >
        Condition of Success
        <button
          @click="addCossForm"
          class="button_positive material-icons"
          style="margin-right: 10%; vertical-align: -5px"
        >
          add_circle
        </button>
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
      </div>
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
  fdbks: string[];
  coss: conditionOfSuccessType[];
}

export default Vue.extend({
  data(): DataType {
    return {
      wish: "",
      goal: "",
      deets: "",
      fdbks: [""],
      coss: [{ cmplt: false, cond: "" }],
    };
  },
  methods: {
    addFeedbackForm() {
      if (this.fdbks.length <= 5) {
        this.fdbks.push("");
      } else {
        alert("多すぎ");
      }
    },
    deleteFeedbackForm(index: number) {
      if (this.fdbks.length != 1) {
        this.fdbks.splice(index, 1);
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
          coss: vm.coss,
          fdbks: vm.fdbks,
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
  border-left: 3px #e1e3e88f solid;
}
.category {
  padding-bottom: 1em;
}
</style>

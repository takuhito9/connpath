<template>
  <div>
    <h3>Please enter your wishes and dreams.</h3>
    <input class="input_text" placeholder="Wish" />

    <h3>Please enter your Outcome.</h3>
    <h1>{{ goal }}</h1>
    <input class="input_text" v-model="goal" placeholder="Outcome" />

    <h3>Please enter your Details.</h3>
    <input class="input_text" v-model="deets" placeholder="Details" />

    <button class="button_register" @click="setGoal">Register</button>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db, firestore } from "@/main";
export type DataType = {
  goal: string;
  deets: string;
};

export default Vue.extend({
  data(): DataType {
    return {
      goal: "",
      deets: "",
    };
  },
  methods: {
    setGoal() {
      const vm = this;
      const collectionRef = db.collection(
        `users/${vm.$store.state.user.uid}/goals`
      );

      if (!vm.goal) {
        alert("Goalは必須です");
      } else {
        const data = {
          goal: vm.goal,
          deets: vm.deets,
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

<template>
  <div>
    <h1>👉 {{ goal }}</h1>
    <input required border v-model="goal" placeholder="Goal" /><br />
    <input border v-model="deets" placeholder="Deets" /><br />

    <button @click="setGoal">Register</button>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
const Vuesax = require("vuesax");
import { auth, db, firestore } from "@/main";
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
          .then(function(docRef) {
            console.log(docRef, "Document Successfully Written!!!");
            vm.$router.push({
              name: "Goal",
              params: {
                id: docRef.id,
              },
            });
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
  },
});
</script>

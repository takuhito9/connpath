<template>
  <div class="signin">
    <h1>Sign in</h1>

    <template>
      <h2>Mail Address</h2>
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <button @click="mailSignin">Sign in</button>
    </template>

    <template>
      <h2>Google Auth</h2>
      <p>test</p>
      <button @click="googleSignin">Google Sign in</button>
    </template>

    <template>
      <h2>Sign Out</h2>
      <button @click="signOut">SignOut</button>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase";
import { auth, db, firestore } from "@/main";
export type DataType = {
  name: string;
  email: string;
  password: string;
};

export default Vue.extend({
  data(): DataType {
    return {
      name: "",
      email: "",
      password: "",
    };
  },

  methods: {
    mailSignin: function () {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          alert("Sign in" + user);
          this.$router.push("/");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    signOut: function () {
      auth
        .signOut()
        .then(() => {
          alert("サインアウトしました");
          // Sign-out successful.
        })
        .catch((error) => {
          console.log(error);
          // An error happened.
        });
    },
    googleSignin: function () {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth
        .signInWithPopup(provider)
        .then(() => {
          const userUid = auth.currentUser!.uid;
          const isRegisteredUserDoc = db.collection("users").orderBy(userUid);
          if (isRegisteredUserDoc == null) {
            db.collection("users")
              .doc(userUid)
              .set({
                email: auth.currentUser!.email,
                uid: auth.currentUser!.uid,
                cre_at: firestore.FieldValue.serverTimestamp(),
              })
              .then(function () {
                console.log("Saved to user information.");
              })
              .catch(function (error) {
                console.error("Error writing document: ", error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.$router.push("/");
    },
  },
  mounted() {},
  created() {},
});
</script>

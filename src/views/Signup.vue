<template>
  <div class="signup">
    <h2>Sign up</h2>
    <input type="text" placeholder="Email" v-model="email" />
    <input type="password" placeholder="Password" v-model="password" />
    <button @click="signup">Register</button>
    <p>
      Do you have an account?
      <router-link to="/signin">sign in now!!</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { auth } from "@/main";
export type DataType = {
  name: string;
  email: string;
};

export default Vue.extend({
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },

  methods: {
    signup: function () {
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert("Create account!! ");
          this.$router.push("/");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
});
</script>




<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/Signup">Signup</router-link> |
      <router-link to="/Signin">Signin</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
pre {
  background: #4a4a4a10;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.goalTitle {
  color: #42b983;
}
</style>
<script lang="ts">
import Vue from "vue";
import { auth } from "@/main";
export default Vue.extend({
  created() {
    const vm = this;
    auth.onAuthStateChanged(function(user) {
      if (user) {
        auth.onAuthStateChanged((user) => {
          vm.$store.commit("setUser", user);
        });
      }
    });
  },
});
</script>

<template>
  <div id="app">
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <div class="grid-container">
      <div class="sidebar">
        <div id="nav">
          <router-link to="/">Home</router-link><br />
          <router-link to="/Signup">Signup</router-link><br />
          <router-link to="/Signin">Signin</router-link>
        </div>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { auth } from "@/main";
export default Vue.extend({
  data() {
    return {
      active: true,
    };
  },
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

<style>
@media screen and (min-width: 480px) {
  /*　画面サイズが480pxからはここを読み込む　*/
  .grid-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 80px 1fr;
    gap: 0px 0px;
    grid-template-areas:
      "sidebar"
      "content";
  }
  .content {
    grid-area: content;
    margin: 1em 1em;
  }
  .sidebar {
    grid-area: sidebar;
    background: #4a4a4a10;
  }
}

@media screen and (min-width: 768px) and (max-width: 1024px) {
  /*　画面サイズが768pxから1024pxまではここを読み込む　*/
  .grid-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 80px 1fr;
    gap: 0px 0px;
    grid-template-areas:
      "sidebar"
      "content";
  }
  .content {
    grid-area: content;
    margin: 3em 5em;
  }
  .sidebar {
    grid-area: sidebar;
    background: #4a4a4a10;
  }
}

@media screen and (min-width: 1024px) {
  /*　画面サイズが1024pxからはここを読み込む　*/
  .grid-container {
    display: grid;
    grid-template-columns: 0.7fr 1.9fr 1fr 1fr;
    grid-template-rows: 0.1fr 1.9fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
      "sidebar . . ."
      "sidebar content content content"
      "sidebar content content content";
  }
  .content {
    grid-area: content;
    margin: 3em 6em;
  }
  .sidebar {
    grid-area: sidebar;
    background: #4a4a4a10;
  }
}

body {
  background: #f4f7f8;
  font-size: 1em;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgb(44, 62, 80);
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

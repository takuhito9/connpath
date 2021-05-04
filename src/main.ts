import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Firebase
import { firebaseConfig } from './firebase-config';
import firebase from 'firebase';
import "firebase/auth";
import * as firebaseui from "firebaseui";
import 'firebaseui/dist/firebaseui.css'

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const storage = firebase.storage();
export const auth = firebase.auth();
export const functions = firebase.functions();
export const authObject = firebase.auth;
export const firestore = firebase.firestore;
export const ui = new firebaseui.auth.AuthUI(firebase.auth());

auth.setPersistence(authObject.Auth.Persistence.SESSION)
db.enablePersistence({ synchronizeTabs: true })

Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Vuesax
  const Vuesax = require('vuesax')
  import 'vuesax/dist/vuesax.css' //Vuesax styles
Vue.use(Vuesax)

import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/Editor',
    name: 'Editor',
    component:()=>import('@/components/Editor.vue')
  },
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/NewGoal',
    name: "NewGoal",
    component: () => import('../views/NewGoal.vue')
  },
  {
    path: '/goal/:id',
    name: 'Goal',
    component: () => import('../views/Goal.vue'),
    props: true
  },
  {
    path: '/goal/:goalId/NewTask',
    name: 'NewTask',
    component:() => import('../views/Goal/NewTask.vue')
  },
    {
    path: '/goal/:goalId/task/:taskId',
    name: 'Task',
    component:() => import('../views/Goal/Task.vue')
  },
  // {
  //   path: '/goal/:goalId/task/:taskId/note/CreateNote',
  //   name: 'CreateNote',
  //   component:() => import('../views/Goal/CreateNote.vue')
  // },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/signin',
    name: 'Signin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Signin.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

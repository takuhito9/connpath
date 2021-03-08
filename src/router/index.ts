import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'goallist',
    component: () => import('@/views/Goal/GoalList.vue'),
  },
  {
    path: '/goalcreate',
    name: "GoalCreate",
    component: () => import('../views/Goal/GoalCreate.vue')
  },
  {
    path: '/goal/:id',
    name: 'GoalDetail',
    component: () => import('../views/Goal/GoalDetail.vue'),
    props: true
  },
  {
    path: '/goallist/:goalId/taskcreate',
    name: 'TaskCreate',
    component:() => import('../views/Goal/Task/TaskCreate.vue')
  },
    {
    path: '/goallist/:goalId/tasklist/:taskId',
    name: 'TaskDetail',
    component:() => import('../views/Goal/Task/TaskDetail.vue')
  },
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

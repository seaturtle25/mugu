import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/control',
    name: 'ControlPage',
    component: () => import('../views/ControlPage.vue')
  },
  {
    path: '/mugu',
    name: 'Mugu',
    component: () => import('../views/mugu.vue')
    path: '/addTimetable',
    name: 'AddTimetablePage',
    component: () => import('../views/AddTimetable.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

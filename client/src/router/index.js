import { createRouter, createWebHistory } from 'vue-router'
import DisplayView from '../views/DisplayView.vue'
import ControlView from '../views/ControlView.vue'

const routes = [
  { path: '/display', component: DisplayView },
  { path: '/control', component: ControlView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
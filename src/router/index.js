import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/title/',
  routes: [
    {
      path: '/',
      name: 'title',
      component: () => import ('@/views/title/title')
    }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      meta: {keepAlive: false},
      component: (resolve) => {
        require(['../views/index'], resolve)
      }
    }
  ]
})

export default router

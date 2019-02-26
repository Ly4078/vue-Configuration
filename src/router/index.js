import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/ready/login'
import Entering from '@/components/ready/entering'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },{
      path: '/Entering',
      name: 'Entering',
      component: Entering
    }
  ]
})

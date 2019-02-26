import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/ready/login'
import Entering from '@/components/ready/entering'
import Home from '@/components/system/homepage'
import Shop from '@/components/system/shop/shop'
import Moving from '@/components/system/moving/moving'
import Commodity from '@/components/system/commodity/commodity'
import Marketing from '@/components/system/marketing/marketing'
import Wallet from '@/components/system/wallet/wallet'
import Traffic from '@/components/system/traffic/traffic'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', //登录页面
      name: 'Login',
      component: Login
    },{
      path: '/Entering', //注册页面
      name: 'Entering',
      component: Entering
    },{
      path: '/Home',  //系统页面
      name: 'Home',
      component: Home,
      children: [
        {
          path:"/",   //店铺管理
          component:Shop
        },{
          path:"/Home/Shop",   //店铺管理
          component:Shop
        },{
          path:"/Home/Commodity",  //商品管理
          component:Commodity
        },{
          path:"/Home/Marketing",  //营销推广
          component:Marketing
        },{
          path:"/Home/Wallet",  //我的钱包
          component:Wallet
        },{
          path:"/Home/Moving",  //我的动态
          component:Moving
        },{
          path:"/Home/Traffic",  //营业数据
          component:Traffic
        },
      ]
    }
  ]
})

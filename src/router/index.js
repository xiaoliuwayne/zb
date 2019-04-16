import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Main from '../pages/Main.vue'
import Index from '../pages/Index.vue'
import OrdersList from '../pages/orders/OrdersList'
import Requirement from '../pages/orders/Requirement'
import Express from '../pages/orders/Express'
import Customer from '../pages/orders/Customer'
import Modify from '../pages/orders/Modify'
import Supplier from '../pages/orders/Supplier'

Vue.use(Router)
const routes = [
  {
    path: '/hellowold',
    name: 'HelloWorld',
    component: HelloWorld
  },
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/main',
    name: 'Main',
    component: Main
  },
  {
    path: '/orderslist',
    name: 'OrdersList',
    component: OrdersList
  },
  {
    path: '/requirement',
    name: 'Requirement',
    component: Requirement
  },
  {
    path: '/express',
    name: 'Express',
    component: Express
  },
  {
    path: '/customer',
    name: 'Customer',
    component: Customer
  },
  {
    path: '/modify',
    name: 'Modify',
    component: Modify
  },
  {
    path: '/supplier',
    name: 'Supplier',
    component: Supplier
  }
]

// export default new Router({
//   // mode: 'history',
//   routes: routes
// })

const router = new Router({
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (window._hmt) { // 测试
    if (to.path) {
      window._hmt.push(['_trackPageview', '/#' + to.fullPath])
    }
  }
  if (window._hmtl) { // 生产
    if (to.path) {
      window._hmtl.push(['_trackPageview', '/#' + to.fullPath])
    }
  }
  next()
})

export default router

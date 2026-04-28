import HomePage from '@/component/HomePage.vue'
import jobWeb from '@/component/jobWeb.vue'
import Thanking from '@/component/Thanking.vue'
import ShopVite from '@/component/ShopVite.vue'
import newHomePage from '@/component/newHomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    name: 'home',
    path: '/',
    component: HomePage
  },{
    name:'job',
    path:'/job',
    component:jobWeb
  },{
    name:'thank',
    path:'/thank',
    component:Thanking
  },{
    name:'shop',
    path:'/shop',
    component:ShopVite
  },{
    name:'shop-vite',
    path:'/shop-vite',
    component:newHomePage
  }
  ],
})

export default router

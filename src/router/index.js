import HomePage from '@/component/HomePage.vue'
import jobWeb from '@/component/jobWeb.vue'
import Thanking from '@/component/Thanking.vue'
import ShopVite from '@/component/ShopVite.vue'
import newHomePage from '@/component/shopviteChoices/newHomePage.vue'
import ShopViteHomePage from "@/component/shopviteChoices/ShopViteHomePage.vue"
import panel from '@/component/shopviteChoices/panel.vue'
import { createRouter, createWebHistory, useRoute } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    name: 'home',
    path: '/',
    component: HomePage
  }, {
    name: 'job',
    path: '/job',
    component: jobWeb
  }, {
    name: 'thank',
    path: '/thank',
    component: Thanking
  }, {
    name: 'shop',
    path: '/shop',
    component: ShopVite
  }, {
    name: 'shop-vite',
    path: '/shop-vite',
    component: newHomePage,
    children: [
      {
        name: 'ShopViteHomePage',
        path: '',
        component: ShopViteHomePage
      },{
        name:'Panel',
        path:'/panel',
        component:panel
      }
    ]
  }
  ],
})



export default router

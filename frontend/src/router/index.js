import HomePage from '@/component/HomePage.vue'
import jobWeb from '@/component/jobWeb.vue'
import Thanking from '@/component/Thanking.vue'
import ShopVite from '@/component/ShopVite.vue'
import newHomePage from '@/component/shopviteChoices/newHomePage.vue'
import ShopViteHomePage from '@/component/shopviteChoices/homepage/ShopViteHomePage.vue'
import panel from '@/component/shopviteChoices/homepage/panel.vue'
import createCenter from '@/component/shopviteChoices/homepage/createCenter.vue'
import RealTimeMonitor from '@/component/shopviteChoices/homepage/RealTimeMonitor.vue'
import UpdateLog from '@/views/shopvite/UpdateLog.vue'
import WorkBench from '@/views/shopvite/WorkBench.vue'
import DataScreen from '@/views/shopvite/DataScreen.vue'
import CustomerService from '@/views/shopvite/CustomerService.vue'
import Dashboard from '@/component/original/dashboard.vue'
import ButtonDemo from '@/views/vab/button.vue'
import FormDemo from '@/views/vab/form.vue'
import TableDemo from '@/views/vab/table.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录', hidden: true },
    },
    {
      path: '/',
      component: HomePage,
      children: [
        {
          name: 'home',
          path: '',
          component: Dashboard,
          meta: { title: '首页' },
        },
        {
          name: 'ButtonDemo',
          path: 'components/button',
          component: ButtonDemo,
          meta: { title: '按钮组件' },
        },
        {
          name: 'FormDemo',
          path: 'components/form',
          component: FormDemo,
          meta: { title: '表单组件' },
        },
        {
          name: 'TableDemo',
          path: 'components/table',
          component: TableDemo,
          meta: { title: '表格组件' },
        },
        {
          name: 'Profile',
          path: 'profile',
          component: () => import('@/views/profile/index.vue'),
          meta: { title: '个人中心' },
        },
        {
          name: 'Settings',
          path: 'settings',
          component: () => import('@/views/settings/index.vue'),
          meta: { title: '系统设置' },
        },
      ],
    },
    {
      name: 'job',
      path: '/job',
      component: jobWeb,
    },
    {
      name: 'thank',
      path: '/thank',
      component: Thanking,
    },
    {
      name: 'shop',
      path: '/shop',
      component: ShopVite,
    },
    {
      name: 'shop-vite',
      path: '/shop-vite',
      component: newHomePage,
      children: [
        {
          name: 'ShopViteHomePage',
          path: '',
          component: ShopViteHomePage,
          meta: { title: '首页' },
        },
        {
          name: 'Panel',
          path: 'panel',
          component: panel,
          meta: { title: '看板' },
        },
        {
          name: 'CreateCenter',
          path: 'create-center',
          component: createCenter,
          meta: { title: '创作中心' },
        },
        {
          name: 'RealTimeMonitor',
          path: 'monitor',
          component: RealTimeMonitor,
          meta: { title: '实时监控' },
        },
        {
          name: 'DataScreen',
          path: 'data-screen',
          component: DataScreen,
          meta: { title: '数据大屏' },
        },
        {
          name: 'CustomerService',
          path: 'customer-service',
          component: CustomerService,
          meta: { title: '客服端' },
        },
        {
          name: 'UpdateLog',
          path: 'update-log',
          component: UpdateLog,
          meta: { title: '更新日志' },
        },
        {
          name: 'ShopViteProfile',
          path: 'profile',
          component: () => import('@/views/profile/index.vue'),
          meta: { title: '个人中心' },
        },
        {
          name: 'ShopViteSettings',
          path: 'settings',
          component: () => import('@/views/settings/index.vue'),
          meta: { title: '系统设置' },
        },
        {
          name: 'AdminUsers',
          path: 'admin/users',
          component: () => import('@/views/shopvite/admin/UserManagement.vue'),
          meta: { title: '用户管理' },
        },
        {
          name: 'AdminPermissions',
          path: 'admin/permissions',
          component: () => import('@/views/shopvite/admin/PermissionManagement.vue'),
          meta: { title: '权限管理' },
        },
        {
          name: 'AdminGoods',
          path: 'admin/goods',
          component: () => import('@/views/shopvite/admin/GoodsManagement.vue'),
          meta: { title: '商品管理' },
        },
        {
          name: 'AdminGoodsStats',
          path: 'admin/goods-stats',
          component: () => import('@/views/shopvite/admin/GoodsStatistics.vue'),
          meta: { title: '商品统计' },
        },
        {
          name: 'AdminGoodsComments',
          path: 'admin/goods-comments',
          component: () => import('@/views/shopvite/admin/GoodsComments.vue'),
          meta: { title: '商品评论' },
        },
        {
          name: 'AdminWorkOrders',
          path: 'admin/work-orders',
          component: () => import('@/views/shopvite/admin/WorkOrders.vue'),
          meta: { title: '工单管理' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error/404',
    },
  ],
})

export default router

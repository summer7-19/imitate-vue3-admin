import Layout from '@/layouts/index.vue'

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'CatchAll',
    redirect: '/404',
    meta: { hidden: true },
  },
]

export const asyncRoutes = [
  {
    path: '/',
    name: 'Root',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled', affix: true },
      },
    ],
  },
  {
    path: '/vab',
    name: 'Vab',
    component: Layout,
    redirect: '/vab/table',
    meta: { title: '组件', icon: 'Menu' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/vab/table.vue'),
        meta: { title: '表格', icon: 'Grid', permissions: ['admin'] },
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/vab/form.vue'),
        meta: { title: '表单', icon: 'EditPen' },
      },
    ],
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Layout,
    redirect: '/shop/market',
    meta: { title: '模板市场', icon: 'Shop' },
    children: [
      {
        path: 'market',
        name: 'ShopMarket',
        component: () => import('@/component/ShopVite.vue'),
        meta: { title: '模板市场', icon: 'Goods' },
      },
    ],
  },
  {
    path: '/thank',
    name: 'Thank',
    component: Layout,
    redirect: '/thank/index',
    meta: { title: '支持我们', icon: 'Present' },
    children: [
      {
        path: 'index',
        name: 'ThankIndex',
        component: () => import('@/component/Thanking.vue'),
        meta: { title: '支持我们' },
      },
    ],
  },
  {
    path: '/shop-vite',
    name: 'ShopVite',
    component: () => import('@/component/shopviteChoices/newHomePage.vue'),
    redirect: '/shop-vite/home',
    meta: { hidden: true },
    children: [
      {
        path: 'home',
        name: 'ShopViteHomePage',
        component: () => import('@/component/shopviteChoices/homepage/ShopViteHomePage.vue'),
        meta: { title: 'Shop Vite 首页', hidden: true },
      },
      {
        path: 'panel',
        name: 'Panel',
        component: () => import('@/component/shopviteChoices/homepage/panel.vue'),
        meta: { title: '看板', hidden: true },
      },
      {
        path: 'creative-center',
        name: 'CreateCenter',
        component: () => import('@/component/shopviteChoices/homepage/createCenter.vue'),
        meta: { title: '创作中心', hidden: true },
      },
      {
        path: 'monitor',
        name: 'RealTimeMonitor',
        component: () => import('@/component/shopviteChoices/homepage/RealTimeMonitor.vue'),
        meta: { title: '实时监控', hidden: true },
      },
      {
        path: 'data-screen',
        name: 'DataScreen',
        component: () => import('@/views/shopvite/DataScreen.vue'),
        meta: { title: '数据大屏', hidden: true },
      },
      {
        path: 'customer-service',
        name: 'CustomerService',
        component: () => import('@/views/shopvite/CustomerService.vue'),
        meta: { title: '客服端', hidden: true },
      },
      {
        path: 'update-log',
        name: 'UpdateLog',
        component: () => import('@/views/shopvite/UpdateLog.vue'),
        meta: { title: '更新日志', hidden: true },
      },
    ],
  },
  {
    path: '/job',
    name: 'Job',
    component: () => import('@/component/jobWeb.vue'),
    meta: { hidden: true },
  },
]

import HomePage from '@/component/HomePage.vue'
import jobWeb from '@/component/jobWeb.vue'
import Thanking from '@/component/Thanking.vue'
import ShopVite from '@/component/ShopVite.vue'
import newHomePage from '@/component/shopviteChoices/newHomePage.vue'
import ShopViteHomePage from '@/component/shopviteChoices/homepage/ShopViteHomePage.vue'
import panel from '@/component/shopviteChoices/homepage/panel.vue'
import createCenter from '@/component/shopviteChoices/homepage/createCenter.vue'
import RealTimeMonitor from '@/component/shopviteChoices/homepage/RealTimeMonitor.vue'
import Tiles from '@/component/shopviteChoices/homepage/Tiles.vue'
import UpdateLog from '@/views/shopvite/UpdateLog.vue'
import WorkBench from '@/views/shopvite/WorkBench.vue'
import DataScreen from '@/views/shopvite/DataScreen.vue'
import LiquidGlass from '@/views/shopvite/LiquidGlass.vue'
import CustomerService from '@/views/shopvite/CustomerService.vue'
import IndependentLayout from '@/views/shopvite/IndependentLayout.vue'
import Dashboard from '@/component/original/dashboard.vue'
import ButtonDemo from '@/views/vab/button.vue'
import FormDemo from '@/views/vab/form.vue'
import TableDemo from '@/views/vab/table.vue'
import Unauthorized from '@/views/401.vue'
import NotFound from '@/views/404.vue'
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
        {
          name: 'Unauthorized',
          path: 'error/401',
          component: Unauthorized,
          meta: { title: '无权限' },
        },
        {
          name: 'NotFound',
          path: 'error/404',
          component: NotFound,
          meta: { title: '页面不存在' },
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
          name: 'Tiles',
          path: 'tiles',
          component: Tiles,
          meta: { title: '磁贴' },
        },
        {
          name: 'IndependentLayout',
          path: 'independent-layout',
          component: IndependentLayout,
          meta: { title: '独立布局' },
        },
        {
          name: 'DataScreen',
          path: 'data-screen',
          component: DataScreen,
          meta: { title: '数据大屏' },
        },
        {
          name: 'WorkBench',
          path: 'workbench',
          component: WorkBench,
          meta: { title: '工作台' },
        },
        {
          name: 'LiquidGlass',
          path: 'liquid-glass',
          component: LiquidGlass,
          meta: { title: '液态玻璃' },
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
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error/404',
    },
  ],
})

export default router

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { pinia } from '@/store/pinia'
import { useUserStore } from '@/store/modules/user'
import { useRoutesStore } from '@/store/modules/routes'
import { loginInterception, progressBar, routesWhiteList } from '@/config'
import getPageTitle from '@/utils/pageTitle'

NProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
})

router.beforeEach(async (to) => {
  if (progressBar) NProgress.start()
  document.title = getPageTitle(to.meta?.title)

  const userStore = useUserStore(pinia)
  const routesStore = useRoutesStore(pinia)
  const hasToken = loginInterception ? Boolean(userStore.accessToken) : true

  if (!hasToken) {
    if (routesWhiteList.includes(to.path)) {
      // 动态路由尚未注册时，受保护地址会先被兜底到 /404
      if (to.path === '/404' && to.redirectedFrom) {
        return `/login?redirect=${encodeURIComponent(to.redirectedFrom.fullPath)}`
      }
      return true
    }
    return `/login?redirect=${encodeURIComponent(to.fullPath)}`
  }

  if (to.path === '/login') {
    return '/'
  }

  if (routesStore.routesLoaded) {
    return true
  }

  try {
    const permissions = await userStore.getUserInfo()
    const accessRoutes = routesStore.generateRoutes(permissions)
    accessRoutes.forEach((route) => router.addRoute(route))

    const target = to.redirectedFrom?.fullPath || to.fullPath
    return { path: target, replace: true }
  } catch (error) {
    userStore.resetAccessToken()
    ElMessage.error(error?.message || '获取用户信息失败，请重新登录')
    return `/login?redirect=${encodeURIComponent(to.fullPath)}`
  }
})

router.afterEach(() => {
  if (progressBar) NProgress.done()
})

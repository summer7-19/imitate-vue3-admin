import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '@/router/routes'
import { buildMenuRoutes, filterAsyncRoutes } from '@/utils/handleRoutes'

export const useRoutesStore = defineStore('routes', {
  state: () => ({
    routes: [],
    partialRoutes: [],
    routesLoaded: false,
  }),
  getters: {
    menuRoutes: (state) => buildMenuRoutes(state.routes),
  },
  actions: {
    generateRoutes(permissions) {
      const accessRoutes = filterAsyncRoutes(asyncRoutes, permissions)
      this.partialRoutes = accessRoutes
      this.routes = [...constantRoutes, ...accessRoutes]
      this.routesLoaded = true
      return accessRoutes
    },
    resetRoutes() {
      this.routes = []
      this.partialRoutes = []
      this.routesLoaded = false
    },
  },
})

import { defineStore } from 'pinia'

// 兼容旧的 Shop Vite 页面，统一迁移到 src/store 后再逐步替换
export const useSidebarStore = defineStore('sideBar', {
  state: () => ({
    openSidebar: false,
    isOn: false,
  }),
  getters: {
    isSidebarOpen: (state) => state.openSidebar,
  },
  actions: {
    toggleSidebar() {
      this.openSidebar = !this.openSidebar
    },
    toggleOpenParts() {
      this.isOn = !this.isOn
    },
  },
})

export const useSideBarContent = defineStore('sideSee', {
  state: () => ({
    isOpen: false,
  }),
  getters: {
    getState: (state) => state.isOpen,
  },
  actions: {
    setState() {
      this.isOpen = !this.isOpen
    },
  },
})

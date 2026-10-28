import { defineStore } from 'pinia'
import { copyright, sidebarCollapsed, title } from '@/config'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    title,
    copyright,
    sidebarCollapsed,
  }),
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
  },
})

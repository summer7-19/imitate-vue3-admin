import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sideBar', {
  state: () => ({
    openSidebar: false,
    isOn:false
  }),
  getters: {
    isSidebarOpen: (state) => state.openSidebar
  },
  actions: {
    toggleSidebar() {
      this.openSidebar = !this.openSidebar
    },
    toggleOpenParts(){
      this.isOn=!this.isOn
    }
  }
})

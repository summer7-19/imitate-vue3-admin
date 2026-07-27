import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
// import SideBar from '@/component/original/sideBar.vue'
// import SideBarContent from '@/component/molecule/sideBarContent.vue'

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

export const useSideBarContent =defineStore(
  'sideSee',
  {
    state:()=>({ 
      isOpen:false
    }),
    getters:{
      getState: (state)=>state.isOpen
    },
    actions:{
      setState(){
        this.isOpen=!this.isOpen
      }
    }
  }
)


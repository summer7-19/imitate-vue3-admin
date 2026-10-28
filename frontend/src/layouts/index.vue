<script setup>
import Sidebar from './components/Sidebar.vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { useSettingsStore } from '@/store/modules/settings'

const settings = useSettingsStore()
</script>

<template>
  <div class="app-wrapper" :class="{ 'is-collapsed': settings.sidebarCollapsed }">
    <Sidebar />
    <div class="main-container">
      <AppHeader />
      <main class="app-main">
        <router-view />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
}

.main-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  height: 100%;
}

.app-main {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
</style>

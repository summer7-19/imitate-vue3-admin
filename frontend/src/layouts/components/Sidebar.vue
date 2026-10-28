<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRoutesStore } from '@/store/modules/routes'
import { useSettingsStore } from '@/store/modules/settings'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const routesStore = useRoutesStore()
const settings = useSettingsStore()

const activeMenu = computed(() => route.meta?.activeMenu || route.path)
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: settings.sidebarCollapsed }">
    <div class="logo">
      <div class="logo-mark">V</div>
      <span v-show="!settings.sidebarCollapsed" class="logo-title">
        {{ settings.title }}
      </span>
    </div>

    <el-scrollbar class="menu-scroll">
      <el-menu
        :default-active="activeMenu"
        :collapse="settings.sidebarCollapsed"
        :collapse-transition="false"
        background-color="#1f2d3d"
        text-color="#bfcbd9"
        active-text-color="#ffffff"
        router
      >
        <SidebarItem
          v-for="item in routesStore.menuRoutes"
          :key="item.path"
          :item="item"
        />
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 220px;
  height: 100%;
  background: #1f2d3d;
  transition: width 0.25s ease;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  display: flex;
  gap: 10px;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-mark {
  display: grid;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 9px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
  font-weight: 700;
}

.logo-title {
  overflow: hidden;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.menu-scroll {
  flex: 1;
  min-height: 0;
}

.sidebar :deep(.el-menu) {
  border-right: none;
}

.sidebar :deep(.el-menu-item),
.sidebar :deep(.el-sub-menu__title) {
  height: 46px;
  margin: 4px 8px;
  border-radius: 8px;
  line-height: 46px;
}

.sidebar :deep(.el-menu--collapse .el-menu-item),
.sidebar :deep(.el-menu--collapse .el-sub-menu__title) {
  width: 48px;
  margin: 4px auto;
}

.sidebar :deep(.el-menu-item.is-active) {
  background: #409eff !important;
}

.sidebar :deep(.el-menu-item:hover),
.sidebar :deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.08) !important;
}
</style>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Expand, Fold } from '@element-plus/icons-vue'
import { resetRouter } from '@/router'
import { useUserStore } from '@/store/modules/user'
import { useRoutesStore } from '@/store/modules/routes'
import { useSettingsStore } from '@/store/modules/settings'
import AppBreadcrumb from './AppBreadcrumb.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const routesStore = useRoutesStore()
const settings = useSettingsStore()

const displayName = computed(() => userStore.username || '未登录')
const roles = computed(() => userStore.permissions.join(', ') || '—')

async function handleCommand(command) {
  if (command !== 'logout') return

  try {
    await ElMessageBox.confirm('确定退出登录吗？', '提示', {
      type: 'warning',
      confirmButtonText: '退出',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  await userStore.logout()
  ElMessage.success('已退出登录')
  await router.replace('/login')
  routesStore.resetRoutes()
  resetRouter()
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <el-button text @click="settings.toggleSidebar">
        <el-icon :size="20">
          <Expand v-if="settings.sidebarCollapsed" />
          <Fold v-else />
        </el-icon>
      </el-button>
      <AppBreadcrumb />
    </div>

    <div class="header-right">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="user">
          <el-avatar :size="30" :src="userStore.avatar || undefined">
            {{ displayName.charAt(0).toUpperCase() }}
          </el-avatar>
          <span class="username">{{ displayName }}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>角色：{{ roles }}</el-dropdown-item>
            <el-dropdown-item divided command="logout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}

.header-left {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.user {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #303133;
  cursor: pointer;
}

.username {
  max-width: 140px;
  overflow: hidden;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

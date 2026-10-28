<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useThemeStore } from '@/store/modules/theme'
import { useLockStore } from '@/store/modules/lock'
import LockScreen from '@/component/header/LockScreen.vue'

const themeStore = useThemeStore()
const lockStore = useLockStore()

const locale = computed(() => (themeStore.locale === 'zh-cn' ? zhCn : en))
</script>

<template>
  <el-config-provider :locale="locale">
    <div class="app">
      <RouterView></RouterView>
    </div>
    <LockScreen v-if="lockStore.active" />
  </el-config-provider>
</template>

<style scoped>
.app {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
}
</style>

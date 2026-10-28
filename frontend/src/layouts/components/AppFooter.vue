<script setup>
import { useSettingsStore } from '@/store/modules/settings'

const settings = useSettingsStore()
</script>

<template>
  <footer class="app-footer">{{ settings.copyright }}</footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 38px;
  color: #909399;
  font-size: 12px;
  background: #fff;
  border-top: 1px solid #ebeef5;
}
</style>

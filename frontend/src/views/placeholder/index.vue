<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="placeholder">
    <el-empty description="该页面尚未迁移，先保留路由占位">
      <el-button type="primary" @click="router.push('/shop-vite')">
        返回首页
      </el-button>
    </el-empty>
  </div>
</template>

<style scoped>
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>

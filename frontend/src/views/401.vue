<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="error-page">
    <el-result
      icon="warning"
      title="401"
      sub-title="抱歉，当前账号没有权限访问该页面"
    >
      <template #extra>
        <el-button type="primary" @click="router.replace('/')">
          返回首页
        </el-button>
        <el-button @click="router.back()">返回上一页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background: #f5f7fa;
}
</style>

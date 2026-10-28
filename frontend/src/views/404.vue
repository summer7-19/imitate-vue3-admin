<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="error-page">
    <el-result
      icon="info"
      title="404"
      sub-title="页面走丢了，请检查地址是否正确"
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

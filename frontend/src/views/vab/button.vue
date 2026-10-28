<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

function handleLoading() {
  if (loading.value) return
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('加载完成')
  }, 1200)
}
</script>

<template>
  <div class="page">
    <el-card shadow="never">
      <template #header>
        <div>
          <h3>按钮组件</h3>
          <p>Element Plus 按钮的常用类型、尺寸与状态</p>
        </div>
      </template>

      <div class="section">
        <div class="label">按钮类型</div>
        <div class="row">
          <el-button>默认</el-button>
          <el-button type="primary">主要</el-button>
          <el-button type="success">成功</el-button>
          <el-button type="warning">警告</el-button>
          <el-button type="danger">危险</el-button>
          <el-button type="info">信息</el-button>
        </div>
      </div>

      <div class="section">
        <div class="label">朴素与圆角</div>
        <div class="row">
          <el-button type="primary" plain>朴素</el-button>
          <el-button type="success" round>圆角</el-button>
          <el-button type="warning" plain round>朴素圆角</el-button>
          <el-button link type="primary">文字按钮</el-button>
        </div>
      </div>

      <div class="section">
        <div class="label">尺寸</div>
        <div class="row">
          <el-button type="primary" size="large">大号</el-button>
          <el-button type="primary">默认</el-button>
          <el-button type="primary" size="small">小号</el-button>
        </div>
      </div>

      <div class="section">
        <div class="label">状态</div>
        <div class="row">
          <el-button type="primary" :loading="loading" @click="handleLoading">
            {{ loading ? '加载中' : '点击加载' }}
          </el-button>
          <el-button type="primary" disabled>禁用</el-button>
          <el-button type="primary" circle>
            <el-icon><Plus /></el-icon>
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
}

h3 {
  margin: 0 0 4px;
  font-size: 18px;
  color: var(--app-text-deep);
}

p {
  margin: 0;
  font-size: 12px;
  color: var(--app-text-ep);
}

.section {
  margin-bottom: 22px;
}

.section:last-child {
  margin-bottom: 0;
}

.label {
  margin-bottom: 10px;
  font-size: 13px;
  color: #606266;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>

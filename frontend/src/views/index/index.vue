<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  EditPen,
  Grid,
  Money,
  Present,
  Shop,
  ShoppingCart,
  TrendCharts,
  User,
} from '@element-plus/icons-vue'
import { getOverview } from '@/api/dashboard'
import { useGreeting } from '@/composables/useGreeting'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const greeting = useGreeting()
const userStore = useUserStore()

const loading = ref(false)
const stats = ref([])
const activities = ref([])
const icons = {
  sales: Money,
  users: User,
  orders: ShoppingCart,
  conversion: TrendCharts,
}
const allQuickLinks = [
  { title: '表格示例', path: '/vab/table', icon: Grid, permission: 'admin' },
  { title: '表单示例', path: '/vab/form', icon: EditPen },
  { title: '模板市场', path: '/shop/market', icon: Shop },
  { title: '支持我们', path: '/thank/index', icon: Present },
]
const quickLinks = computed(() =>
  allQuickLinks.filter(
    (link) =>
      !link.permission || userStore.permissions.includes(link.permission)
  )
)

function formatNumber(value) {
  return Number(value).toLocaleString('zh-CN')
}

async function fetchOverview() {
  loading.value = true
  try {
    const { data } = await getOverview()
    stats.value = data.stats || []
    activities.value = data.activities || []
  } catch {
    stats.value = []
    activities.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchOverview)
</script>

<template>
  <div v-loading="loading" class="page">
    <section class="welcome-card">
      <div>
        <h2>{{ greeting }}，{{ userStore.username || '访客' }}</h2>
        <p>工程骨架已经跑通，接下来可以逐步迁移 Shop Vite 页面。</p>
      </div>
      <span class="welcome-badge">Vue3 Admin Skeleton</span>
    </section>

    <el-row :gutter="16" class="stats">
      <el-col
        v-for="item in stats"
        :key="item.key"
        :xs="24"
        :sm="12"
        :lg="6"
      >
        <el-card shadow="hover" class="stat-card">
          <div class="stat-top">
            <span>{{ item.label }}</span>
            <el-icon class="stat-icon">
              <component :is="icons[item.key]" />
            </el-icon>
          </div>
          <div class="stat-value">
            {{ item.prefix }}{{ formatNumber(item.value) }}{{ item.suffix }}
          </div>
          <div class="stat-trend" :class="item.trend >= 0 ? 'up' : 'down'">
            {{ item.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}%
            <span>较上周</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="16">
        <el-card shadow="never" class="panel">
          <template #header>
            <div class="panel-header">
              <span>最近动态</span>
              <el-button text type="primary" @click="fetchOverview">
                刷新
              </el-button>
            </div>
          </template>

          <ul v-if="activities.length" class="activity-list">
            <li v-for="item in activities" :key="item.id">
              <el-avatar :size="32">
                {{ item.user.charAt(0).toUpperCase() }}
              </el-avatar>
              <div class="activity-main">
                <p><strong>{{ item.user }}</strong> {{ item.action }}</p>
                <span>{{ item.time }}</span>
              </div>
            </li>
          </ul>
          <el-empty v-else description="暂无动态" />
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card shadow="never" class="panel">
          <template #header>快捷入口</template>
          <div class="quick-links">
            <button
              v-for="link in quickLinks"
              :key="link.path"
              class="quick-link"
              @click="router.push(link.path)"
            >
              <el-icon><component :is="link.icon" /></el-icon>
              <span>{{ link.title }}</span>
            </button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
}

.welcome-card {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 22px 26px;
  margin-bottom: 16px;
  border-radius: 14px;
  background: linear-gradient(120deg, #1f6feb, #409eff 55%, #67c23a);
  color: #fff;
}

.welcome-card h2 {
  margin: 0 0 6px;
  font-size: 22px;
}

.welcome-card p {
  margin: 0;
  font-size: 13px;
  opacity: 0.85;
}

.welcome-badge {
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
}

.stats {
  margin-bottom: 16px;
}

.stat-card {
  margin-bottom: 16px;
  border: none;
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--app-text-ep);
  font-size: 13px;
}

.stat-icon {
  padding: 8px;
  border-radius: 10px;
  background: #ecf5ff;
  color: #409eff;
  font-size: 18px;
}

.stat-value {
  margin: 14px 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: var(--app-text-deep);
}

.stat-trend {
  font-size: 12px;
}

.stat-trend span {
  color: var(--app-text-placeholder);
}

.stat-trend.up {
  color: #67c23a;
}

.stat-trend.down {
  color: #f56c6c;
}

.panel {
  margin-bottom: 16px;
  border: none;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.activity-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.activity-list li {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
}

.activity-list li:last-child {
  border-bottom: none;
}

.activity-main {
  flex: 1;
}

.activity-main p {
  margin: 0 0 4px;
  font-size: 14px;
  color: #303133;
}

.activity-main span {
  font-size: 12px;
  color: var(--app-text-ep);
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.quick-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 18px 10px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  background: #fafcff;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-link:hover {
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-2px);
}
</style>

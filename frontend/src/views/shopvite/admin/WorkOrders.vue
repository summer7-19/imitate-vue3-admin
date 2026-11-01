<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshLeft, Search } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/modules/admin'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const admin = useAdminStore()

const keyword = ref('')
const type = ref('')
const priority = ref('')
const status = ref('')
const applied = reactive({ keyword: '', type: '', priority: '', status: '' })

const page = ref(1)
const pageSize = ref(10)

const statusOptions = ['待处理', '处理中', '已完成', '已关闭']
const typeOptions = ['售后', '物流', '退款', '咨询', '投诉']
const priorityOptions = ['高', '中', '低']

const filteredOrders = computed(() => {
  const kw = applied.keyword.trim().toLowerCase()
  return admin.workOrders.filter((item) => {
    if (applied.type && item.type !== applied.type) return false
    if (applied.priority && item.priority !== applied.priority) return false
    if (applied.status && item.status !== applied.status) return false
    if (!kw) return true
    return [item.id, item.user, item.content].some((field) => String(field).toLowerCase().includes(kw))
  })
})

const pagedOrders = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredOrders.value.slice(start, start + pageSize.value)
})

function statusCount(value) {
  return admin.workOrders.filter((item) => item.status === value).length
}

watch(pageSize, () => {
  page.value = 1
})

function clampPage() {
  const maxPage = Math.max(1, Math.ceil(filteredOrders.value.length / pageSize.value))
  if (page.value > maxPage) page.value = maxPage
}

function applyFilters() {
  applied.keyword = keyword.value
  applied.type = type.value
  applied.priority = priority.value
  applied.status = status.value
  page.value = 1
}

function resetFilters() {
  keyword.value = ''
  type.value = ''
  priority.value = ''
  status.value = ''
  applyFilters()
}

function typeTagType(value) {
  if (value === '投诉') return 'danger'
  if (value === '退款' || value === '售后') return 'warning'
  if (value === '物流') return 'primary'
  return 'info'
}

function priorityTagType(value) {
  if (value === '高') return 'danger'
  if (value === '中') return 'warning'
  return 'info'
}

function statusTagType(value) {
  if (value === '已完成') return 'success'
  if (value === '处理中') return 'primary'
  if (value === '待处理') return 'warning'
  return 'info'
}

const STATUS_MESSAGES = {
  待处理: '工单已重新打开',
  处理中: '工单已开始处理',
  已完成: '工单已标记完成',
  已关闭: '工单已关闭',
}

function setStatus(row, next) {
  admin.setOrderStatus(row.id, next)
  ElMessage.success(STATUS_MESSAGES[next])
}
</script>

<template>
  <div class="adminPage tablePage">
    <section class="adminCard tableCard">
      <div class="adminToolbar">
        <el-input v-model="keyword" placeholder="工单号 / 用户 / 内容" clearable @keyup.enter="applyFilters" />
        <el-select v-model="type" placeholder="工单类型" clearable>
          <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="priority" placeholder="优先级" clearable>
          <el-option v-for="item in priorityOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="status" placeholder="处理状态" clearable>
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="primary" :icon="Search" @click="applyFilters">查询</el-button>
        <el-button :icon="RefreshLeft" @click="resetFilters">重置</el-button>
        <span class="adminToolbarSpacer"></span>
        <span class="adminMuted">
          共 {{ admin.workOrders.length }} 条 · 待处理 {{ statusCount('待处理') }} · 处理中
          {{ statusCount('处理中') }}
        </span>
      </div>

      <div class="tableWrap">
      <el-table :data="pagedOrders" row-key="id" height="100%">
        <el-table-column label="序号" width="64" align="center">
          <template #default="{ $index }">{{ (page - 1) * pageSize + $index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="id" label="工单号" min-width="170" show-overflow-tooltip />
        <el-table-column label="类型" width="86" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" :type="typeTagType(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="user" label="用户" width="90" />
        <el-table-column label="优先级" width="86" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" :type="priorityTagType(row.priority)">{{ row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="工单内容" min-width="240" show-overflow-tooltip />
        <el-table-column prop="time" label="提交时间" width="140" />
        <el-table-column label="状态" width="92" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" :type="statusTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '待处理'" link type="primary" @click="setStatus(row, '处理中')">
              处理
            </el-button>
            <el-button v-if="row.status === '处理中'" link type="success" @click="setStatus(row, '已完成')">
              完成
            </el-button>
            <el-button
              v-if="row.status === '已关闭'"
              link
              type="primary"
              @click="setStatus(row, '待处理')"
            >
              重新打开
            </el-button>
            <el-button
              v-if="row.status !== '已完成' && row.status !== '已关闭'"
              link
              type="info"
              @click="setStatus(row, '已关闭')"
            >
              关闭
            </el-button>
            <el-button
              v-if="row.status === '已完成'"
              link
              type="info"
              @click="setStatus(row, '已关闭')"
            >
              归档
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="没有找到符合条件的工单" :image-size="72" />
        </template>
      </el-table>
      </div>

      <div class="adminPager">
        <span>共 {{ filteredOrders.length }} 条</span>
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          :total="filteredOrders.length"
          layout="sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </section>
  </div>
  <Footer />
</template>

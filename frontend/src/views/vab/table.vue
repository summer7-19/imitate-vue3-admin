<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import { getTableList } from '@/api/table'

const loading = ref(false)
const keyword = ref('')
const list = ref([])
const total = ref(0)
const pagination = reactive({
  page: 1,
  pageSize: 10,
})

async function fetchList() {
  loading.value = true
  try {
    const { data } = await getTableList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: keyword.value,
    })
    list.value = data.list || []
    total.value = data.total || 0
  } catch {
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchList()
}

function handleReset() {
  keyword.value = ''
  pagination.page = 1
  fetchList()
}

function handlePageChange(page) {
  pagination.page = page
  fetchList()
}

function handleSizeChange(size) {
  pagination.pageSize = size
  pagination.page = 1
  fetchList()
}

function handleAction(row, action) {
  ElMessage.info(`${action}：${row.name}`)
}

onMounted(fetchList)
</script>

<template>
  <div class="page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div>
            <h3>表格示例</h3>
            <p>数据来自 Mock 接口 /table/list</p>
          </div>
          <div class="toolbar">
            <el-input
              v-model="keyword"
              placeholder="搜索姓名 / 城市"
              clearable
              style="width: 220px"
              @keyup.enter="handleSearch"
            />
            <el-button type="primary" :icon="Search" @click="handleSearch">
              查询
            </el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="list"
        row-key="id"
        stripe
        border
      >
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="state" label="省份" width="140" />
        <el-table-column prop="city" label="城市" width="140" />
        <el-table-column prop="address" label="地址" min-width="220" />
        <el-table-column prop="zip" label="邮编" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleAction(row, '查看')">
              查看
            </el-button>
            <el-button link type="primary" @click="handleAction(row, '编辑')">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination
          background
          :current-page="pagination.page"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
}

.card-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.card-header h3 {
  margin: 0 0 4px;
  font-size: 18px;
  color: var(--app-text-deep);
}

.card-header p {
  margin: 0;
  font-size: 12px;
  color: var(--app-text-ep);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>

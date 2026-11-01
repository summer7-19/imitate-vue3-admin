<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Delete, Hide, RefreshLeft, Search } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/modules/admin'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const admin = useAdminStore()

const keyword = ref('')
const status = ref('')
const applied = reactive({ keyword: '', status: '' })

const page = ref(1)
const pageSize = ref(10)
const selection = ref([])

const statusOptions = ['待审核', '已通过', '已隐藏']

const filteredComments = computed(() => {
  const kw = applied.keyword.trim().toLowerCase()
  return admin.comments.filter((item) => {
    if (applied.status && item.status !== applied.status) return false
    if (!kw) return true
    return [item.id, item.goods, item.user, item.content].some((field) =>
      String(field).toLowerCase().includes(kw)
    )
  })
})

const pagedComments = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredComments.value.slice(start, start + pageSize.value)
})

const pendingCount = computed(() => admin.comments.filter((item) => item.status === '待审核').length)
const passedCount = computed(() => admin.comments.filter((item) => item.status === '已通过').length)
const averageRating = computed(() => {
  if (!admin.comments.length) return '0.0'
  const total = admin.comments.reduce((sum, item) => sum + item.rating, 0)
  return (total / admin.comments.length).toFixed(1)
})

const pendingSelection = computed(() => selection.value.filter((item) => item.status === '待审核'))

watch(pageSize, () => {
  page.value = 1
})

function clampPage() {
  const maxPage = Math.max(1, Math.ceil(filteredComments.value.length / pageSize.value))
  if (page.value > maxPage) page.value = maxPage
}

function applyFilters() {
  applied.keyword = keyword.value
  applied.status = status.value
  page.value = 1
}

function resetFilters() {
  keyword.value = ''
  status.value = ''
  applyFilters()
}

function statusTagType(value) {
  if (value === '已通过') return 'success'
  if (value === '待审核') return 'warning'
  return 'info'
}

function setStatus(row, next) {
  admin.setCommentStatus(row.id, next)
  ElMessage.success(next === '已通过' ? '评论已通过' : '评论已隐藏')
}

async function removeComment(row) {
  try {
    await ElMessageBox.confirm(`确定删除「${row.user}」对「${row.goods}」的评论吗？`, '删除评论', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  admin.removeComment(row.id)
  ElMessage.success('评论已删除')
  clampPage()
}

function approveSelected() {
  if (!pendingSelection.value.length) return
  pendingSelection.value.forEach((item) => admin.setCommentStatus(item.id, '已通过'))
  ElMessage.success(`已通过 ${pendingSelection.value.length} 条评论`)
  selection.value = []
}

async function removeSelected() {
  if (!selection.value.length) return
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selection.value.length} 条评论吗？`, '批量删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  selection.value.forEach((item) => admin.removeComment(item.id))
  selection.value = []
  ElMessage.success('选中评论已删除')
  clampPage()
}
</script>

<template>
  <div class="adminPage tablePage">
    <section class="adminCard tableCard">
      <div class="adminToolbar">
        <el-button type="success" plain :icon="Check" :disabled="!pendingSelection.length" @click="approveSelected">
          批量通过（{{ pendingSelection.length }}）
        </el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="!selection.length" @click="removeSelected">
          批量删除
        </el-button>
        <span class="adminMuted">
          共 {{ admin.comments.length }} 条 · 待审核 {{ pendingCount }} · 平均 {{ averageRating }} 分
        </span>
        <span class="adminToolbarSpacer"></span>
        <el-input v-model="keyword" placeholder="商品 / 用户 / 内容" clearable @keyup.enter="applyFilters" />
        <el-select v-model="status" placeholder="审核状态" clearable>
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="primary" :icon="Search" @click="applyFilters">查询</el-button>
        <el-button :icon="RefreshLeft" @click="resetFilters">重置</el-button>
      </div>

      <div class="tableWrap">
      <el-table :data="pagedComments" row-key="id" height="100%" @selection-change="selection = $event">
        <el-table-column type="selection" width="46" />
        <el-table-column label="序号" width="64" align="center">
          <template #default="{ $index }">{{ (page - 1) * pageSize + $index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="id" label="评论ID" width="96" />
        <el-table-column prop="goods" label="商品名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="user" label="用户" width="90" />
        <el-table-column label="评分" width="128">
          <template #default="{ row }">
            <el-rate :model-value="row.rating" disabled size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评论内容" min-width="240" show-overflow-tooltip />
        <el-table-column prop="time" label="评论时间" width="140" />
        <el-table-column label="状态" width="92" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" :type="statusTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status !== '已通过'" link type="success" @click="setStatus(row, '已通过')">
              通过
            </el-button>
            <el-button v-if="row.status !== '已隐藏'" link type="warning" @click="setStatus(row, '已隐藏')">
              <el-icon><Hide /></el-icon>隐藏
            </el-button>
            <el-button link type="danger" @click="removeComment(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="没有找到符合条件的评论" :image-size="72" />
        </template>
      </el-table>
      </div>

      <div class="adminPager">
        <span>共 {{ filteredComments.length }} 条</span>
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          :total="filteredComments.length"
          layout="sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </section>
  </div>
  <Footer />
</template>

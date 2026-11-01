<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Plus, RefreshLeft, Search, Star, StarFilled } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/modules/admin'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const admin = useAdminStore()

const keyword = ref('')
const category = ref('')
const status = ref('')
const recommend = ref('')
const applied = reactive({ keyword: '', category: '', status: '', recommend: '' })

const page = ref(1)
const pageSize = ref(10)
const selection = ref([])
const failedCovers = reactive({})

const dialogVisible = ref(false)
const dialogMode = ref('create')
const editingId = ref('')
const formRef = ref()
const form = reactive({
  name: '',
  category: '数码家电',
  cover: '',
  price: 99,
  stock: 10,
  status: '待上架',
})

const statusOptions = ['在售', '待上架', '已下架']

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
}

const filteredGoods = computed(() => {
  const kw = applied.keyword.trim().toLowerCase()
  return admin.goods.filter((item) => {
    if (kw && !item.name.toLowerCase().includes(kw) && !item.id.includes(kw)) return false
    if (applied.category && item.category !== applied.category) return false
    if (applied.status && item.status !== applied.status) return false
    if (applied.recommend) {
      const wanted = applied.recommend === '是'
      if (item.recommended !== wanted) return false
    }
    return true
  })
})

const pagedGoods = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredGoods.value.slice(start, start + pageSize.value)
})

const sellingCount = computed(() => admin.goods.filter((item) => item.status === '在售').length)
const lowStockCount = computed(() => admin.goods.filter((item) => item.stock <= 10).length)

watch(pageSize, () => {
  page.value = 1
})

function clampPage() {
  const maxPage = Math.max(1, Math.ceil(filteredGoods.value.length / pageSize.value))
  if (page.value > maxPage) page.value = maxPage
}

function applyFilters() {
  applied.keyword = keyword.value
  applied.category = category.value
  applied.status = status.value
  applied.recommend = recommend.value
  page.value = 1
}

function resetFilters() {
  keyword.value = ''
  category.value = ''
  status.value = ''
  recommend.value = ''
  applyFilters()
}

function resetForm() {
  form.name = ''
  form.category = '数码家电'
  form.cover = ''
  form.price = 99
  form.stock = 10
  form.status = '待上架'
  formRef.value?.clearValidate()
}

function openCreate() {
  dialogMode.value = 'create'
  editingId.value = ''
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'
  editingId.value = row.id
  form.name = row.name
  form.category = row.category
  form.cover = row.cover
  form.price = row.price
  form.stock = row.stock
  form.status = row.status
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const payload = {
    name: form.name.trim(),
    category: form.category,
    cover: form.cover.trim() || `https://picsum.photos/seed/vue012-${Date.now()}/160/160`,
    price: Number(form.price),
    stock: Number(form.stock),
    status: form.status,
  }

  if (dialogMode.value === 'edit') {
    admin.updateGoods(editingId.value, payload)
    ElMessage.success('商品信息已更新')
  } else {
    admin.addGoods(payload)
    ElMessage.success('商品已添加')
  }
  dialogVisible.value = false
  clampPage()
}

function statusTagType(value) {
  if (value === '在售') return 'success'
  if (value === '待上架') return 'warning'
  return 'info'
}

function toggleStatus(row) {
  const next = row.status === '在售' ? '已下架' : '在售'
  admin.updateGoods(row.id, { status: next })
  ElMessage.success(next === '在售' ? `「${row.name}」已上架` : `「${row.name}」已下架`)
}

function toggleRecommend(row) {
  admin.updateGoods(row.id, { recommended: !row.recommended })
  ElMessage.success(row.recommended ? `已推荐「${row.name}」` : `已取消推荐「${row.name}」`)
}

async function removeGoods(row) {
  try {
    await ElMessageBox.confirm(`确定删除商品「${row.name}」吗？`, '删除商品', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  admin.removeGoods([row.id])
  ElMessage.success('商品已删除')
  clampPage()
}

async function removeSelected() {
  if (!selection.value.length) return
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selection.value.length} 件商品吗？`, '批量删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  admin.removeGoods(selection.value.map((item) => item.id))
  selection.value = []
  ElMessage.success('选中商品已删除')
  clampPage()
}

function stockClass(stock) {
  if (stock === 0) return 'adminStockEmpty'
  if (stock <= 10) return 'adminStockLow'
  return ''
}
</script>

<template>
  <div class="adminPage tablePage">
    <section class="adminCard tableCard">
      <div class="adminToolbar">
        <div class="top">
          <el-button type="primary" :icon="Plus" @click="openCreate">添加</el-button>
          <el-button type="danger" plain :icon="Delete" :disabled="!selection.length" @click="removeSelected">
            批量删除
          </el-button>
          <span class="adminMuted">
            共 {{ admin.goods.length }} 件 · 在售 {{ sellingCount }} · 低库存 {{ lowStockCount }}
          </span>
          <span class="adminToolbarSpacer"></span>
        </div>
        <div class="bottom" style="display: flex;flex-direction: row;gap: 12px;">
          <el-input v-model="keyword" placeholder="请输入商品名称 / 商品ID" clearable @keyup.enter="applyFilters" />
          <el-select v-model="category" placeholder="商品分类" clearable>
            <el-option v-for="item in admin.categories" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select v-model="status" placeholder="状态" clearable>
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select v-model="recommend" placeholder="是否推荐" clearable>
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
          <el-button type="primary" :icon="Search" @click="applyFilters">查询</el-button>
          <el-button :icon="RefreshLeft" @click="resetFilters">重置</el-button>
        </div>
      </div>

      <div class="tableWrap">
        <el-table :data="pagedGoods" row-key="id" height="100%" @selection-change="selection = $event">
          <el-table-column type="selection" width="46" />
          <el-table-column label="序号" width="64" align="center">
            <template #default="{ $index }">{{ (page - 1) * pageSize + $index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="id" label="商品ID" min-width="120" show-overflow-tooltip />
          <el-table-column prop="name" label="商品名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="category" label="商品分类" min-width="100" />
          <el-table-column label="商品图" width="76" align="center">
            <template #default="{ row }">
              <img v-if="row.cover && !failedCovers[row.id]" class="adminThumb" :src="row.cover" :alt="row.name"
                loading="lazy" @error="failedCovers[row.id] = true" />
              <span v-else class="adminThumb adminThumbFallback">{{ row.name.slice(0, 1) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="售价" width="90" align="center">
            <template #default="{ row }"><span class="adminPrice">¥ {{ row.price }}</span></template>
          </el-table-column>
          <el-table-column prop="sales" label="销量" width="76" align="center" />
          <el-table-column label="库存" width="76" align="center">
            <template #default="{ row }">
              <span :class="stockClass(row.stock)">{{ row.stock }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="92" align="center">
            <template #default="{ row }">
              <el-tag size="small" :type="statusTagType(row.status)" effect="plain">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否推荐" width="90" align="center">
            <template #default="{ row }">
              <el-icon class="adminStar" :class="{ 'is-active': row.recommended }"
                :title="row.recommended ? '取消推荐' : '设为推荐'" @click="toggleRecommend(row)">
                <StarFilled v-if="row.recommended" />
                <Star v-else />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="时间" min-width="160" />
          <el-table-column label="操作" width="170" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
              <el-button link type="primary" @click="toggleStatus(row)">
                {{ row.status === '在售' ? '下架' : '上架' }}
              </el-button>
              <el-button link type="danger" @click="removeGoods(row)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="没有找到符合条件的商品" :image-size="72" />
          </template>
        </el-table>
      </div>

      <div class="adminPager">
        <span>共 {{ filteredGoods.length }} 条</span>
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5, 10, 20]"
          :total="filteredGoods.length" layout="sizes, prev, pager, next, jumper" background />
      </div>
    </section>

    <el-dialog v-model="dialogVisible" :title="dialogMode === 'edit' ? '编辑商品' : '添加商品'" width="520px"
      class="adminDialog" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="84px" @submit.prevent="submitForm">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" maxlength="30" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="form.category" style="width: 100%">
            <el-option v-for="item in admin.categories" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品图">
          <el-input v-model="form.cover" placeholder="图片地址，留空自动生成占位图" />
        </el-form-item>
        <el-form-item label="售价" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" :step="10" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in statusOptions" :key="item" :value="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
  <Footer />
</template>

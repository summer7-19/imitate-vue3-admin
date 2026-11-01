<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Plus, RefreshLeft, Search } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/modules/admin'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const admin = useAdminStore()

const keyword = ref('')
const appliedKeyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const selection = ref([])

const dialogVisible = ref(false)
const dialogMode = ref('create')
const editingId = ref('')
const formRef = ref()
const form = reactive({
  username: '',
  email: '',
  roles: ['test'],
})

const roleOptions = [
  { value: 'admin', label: 'admin（管理员）' },
  { value: 'editor', label: 'editor（编辑）' },
  { value: 'test', label: 'test（测试）' },
]

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 16, message: '用户名长度需在 2 到 16 个字符之间', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  roles: [{ type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }],
}

const filteredUsers = computed(() => {
  const kw = appliedKeyword.value.trim().toLowerCase()
  if (!kw) return admin.users
  return admin.users.filter((user) =>
    [user.username, user.email, user.id].some((field) => String(field).toLowerCase().includes(kw))
  )
})

const pagedUsers = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredUsers.value.slice(start, start + pageSize.value)
})

function clampPage() {
  const maxPage = Math.max(1, Math.ceil(filteredUsers.value.length / pageSize.value))
  if (page.value > maxPage) page.value = maxPage
}

watch(pageSize, () => {
  page.value = 1
})

watch(appliedKeyword, () => {
  page.value = 1
})

function applySearch() {
  appliedKeyword.value = keyword.value
}

function resetFilters() {
  keyword.value = ''
  appliedKeyword.value = ''
  page.value = 1
}

function resetForm() {
  form.username = ''
  form.email = ''
  form.roles = ['test']
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
  form.username = row.username
  form.email = row.email
  form.roles = [...row.roles]
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const duplicated = admin.users.some(
    (user) => user.username === form.username.trim() && user.id !== editingId.value
  )
  if (duplicated) {
    ElMessage.warning('该用户名已存在')
    return
  }

  if (dialogMode.value === 'edit') {
    const editingAdmin = admin.users.find((user) => user.id === editingId.value)?.username === 'admin'
    if (editingAdmin) form.username = 'admin'
    admin.updateUser(editingId.value, {
      username: form.username.trim(),
      email: form.email.trim(),
      roles: [...form.roles],
    })
    ElMessage.success('用户资料已更新')
  } else {
    admin.addUser({ username: form.username, email: form.email, roles: form.roles })
    ElMessage.success('用户已创建')
  }

  dialogVisible.value = false
  clampPage()
}

async function removeUser(row) {
  if (row.username === 'admin') {
    ElMessage.warning('内置 admin 账号不可删除')
    return
  }
  try {
    await ElMessageBox.confirm(`确定删除用户「${row.username}」吗？`, '删除用户', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  admin.removeUsers([row.id])
  ElMessage.success('用户已删除')
  clampPage()
}

async function removeSelected() {
  if (!selection.value.length) return
  if (selection.value.some((user) => user.username === 'admin')) {
    ElMessage.warning('批量操作中包含内置 admin 账号，请先取消勾选')
    return
  }
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selection.value.length} 个用户吗？`, '批量删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  admin.removeUsers(selection.value.map((user) => user.id))
  selection.value = []
  ElMessage.success('选中用户已删除')
  clampPage()
}

function roleTagType(role) {
  if (role === 'admin') return 'primary'
  if (role === 'editor') return 'success'
  return 'warning'
}
</script>

<template>
  <div class="adminPage tablePage">
    <section class="adminCard tableCard">
      <div class="adminToolbar">
        <el-button type="primary" :icon="Plus" @click="openCreate">添加</el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="!selection.length" @click="removeSelected">
          批量删除
        </el-button>
        <span class="adminToolbarSpacer"></span>
        <el-input v-model="keyword" placeholder="请输入用户名 / 邮箱" clearable @keyup.enter="applySearch" />
        <el-button type="primary" :icon="Search" @click="applySearch">查询</el-button>
        <el-button :icon="RefreshLeft" @click="resetFilters">重置</el-button>
      </div>

      <div class="tableWrap">
      <el-table :data="pagedUsers" row-key="id" height="100%" @selection-change="selection = $event">
        <el-table-column type="selection" width="46" />
        <el-table-column label="序号" width="64" align="center">
          <template #default="{ $index }">{{ (page - 1) * pageSize + $index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="id" label="id" min-width="180" show-overflow-tooltip />
        <el-table-column prop="username" label="用户名" min-width="110" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column label="角色" min-width="150">
          <template #default="{ row }">
            <div class="adminRoleTags">
              <el-tag v-for="role in row.roles" :key="role" size="small" effect="plain" :type="roleTagType(role)">
                {{ role }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="修改时间" min-width="170" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" :disabled="row.username === 'admin'" @click="removeUser(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="没有找到匹配的用户" :image-size="72" />
        </template>
      </el-table>
      </div>

      <div class="adminPager">
        <span>共 {{ filteredUsers.length }} 条</span>
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          :total="filteredUsers.length"
          layout="sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </section>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'edit' ? '编辑用户' : '添加用户'"
      width="460px"
      class="adminDialog"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="76px" @submit.prevent="submitForm">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            maxlength="16"
            placeholder="2–16 个字符"
            :disabled="dialogMode === 'edit' && form.username === 'admin'"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="name@example.com" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="form.roles" multiple collapse-tags placeholder="请选择角色" style="width: 100%">
            <el-option v-for="role in roleOptions" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
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

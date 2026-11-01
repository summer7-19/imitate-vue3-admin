<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Lock, Plus, RefreshLeft, Search } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/modules/admin'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const admin = useAdminStore()

const keyword = ref('')
const appliedKeyword = ref('')
const selection = ref([])

const dialogVisible = ref(false)
const dialogMode = ref('create')
const editingKey = ref('')
const formRef = ref()
const form = reactive({
  name: '',
  key: '',
  desc: '',
  permissions: ['dashboard'],
})

const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 12, message: '角色名称需在 2 到 12 个字符之间', trigger: 'blur' },
  ],
  key: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    {
      pattern: /^[a-z][a-z0-9_-]{1,15}$/,
      message: '以小写字母开头，2–16 位字母/数字/下划线',
      trigger: 'blur',
    },
  ],
  desc: [{ max: 40, message: '说明最多 40 个字符', trigger: 'blur' }],
  permissions: [
    {
      type: 'array',
      required: true,
      min: 1,
      message: '请至少勾选一项权限',
      trigger: 'change',
    },
  ],
}

const roleRows = computed(() => {
  const kw = appliedKeyword.value.trim().toLowerCase()
  return admin.roles
    .map((role) => {
      const keys = admin.rolePermissions[role.key] || []
      return {
        ...role,
        keys,
        count: keys.length,
        permissions: admin.permissionOptions.filter((item) => keys.includes(item.key)),
      }
    })
    .filter((role) => {
      if (!kw) return true
      return [role.name, role.key, role.desc].some((field) => String(field).toLowerCase().includes(kw))
    })
})

const editingInfo = computed(() => admin.roles.find((role) => role.key === editingKey.value))

function roleTagType(key) {
  if (key === 'admin') return 'primary'
  if (key === 'editor') return 'success'
  if (key === 'test') return 'warning'
  return 'info'
}

function applySearch() {
  appliedKeyword.value = keyword.value
  selection.value = []
}

function resetFilters() {
  keyword.value = ''
  applySearch()
}

function resetForm() {
  form.name = ''
  form.key = ''
  form.desc = ''
  form.permissions = ['dashboard']
  formRef.value?.clearValidate()
}

function openCreate() {
  dialogMode.value = 'create'
  editingKey.value = ''
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  if (row.key === 'admin') {
    ElMessage.info('管理员角色固定拥有全部权限')
    return
  }
  dialogMode.value = 'edit'
  editingKey.value = row.key
  form.name = row.name
  form.key = row.key
  form.desc = row.desc
  form.permissions = [...row.keys]
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

async function submitRole() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  if (dialogMode.value === 'create') {
    const added = admin.addRole({
      name: form.name,
      key: form.key,
      desc: form.desc,
      permissions: form.permissions,
    })
    if (!added) {
      ElMessage.warning('该角色标识已存在')
      return
    }
    ElMessage.success(`角色「${form.name.trim()}」已创建`)
  } else {
    admin.updateRole(editingKey.value, {
      name: form.name,
      desc: form.desc,
      permissions: form.permissions,
    })
    ElMessage.success(`角色「${form.name.trim()}」已更新`)
  }
  dialogVisible.value = false
}

async function removeRole(row) {
  if (row.key === 'admin') {
    ElMessage.warning('内置管理员角色不可删除')
    return
  }
  try {
    await ElMessageBox.confirm(`确定删除角色「${row.name}」吗？`, '删除角色', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  admin.removeRoles([row.key])
  ElMessage.success('角色已删除')
}

async function removeSelected() {
  if (!selection.value.length) return
  if (selection.value.some((role) => role.key === 'admin')) {
    ElMessage.warning('批量操作中包含管理员角色，请先取消勾选')
    return
  }
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selection.value.length} 个角色吗？`, '批量删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  admin.removeRoles(selection.value.map((role) => role.key))
  selection.value = []
  ElMessage.success('选中角色已删除')
}

function resetAll() {
  admin.resetPermissions()
  ElMessage.success('所有角色权限已恢复默认')
}
</script>

<template>
  <div class="adminPage tablePage">
    <section class="adminCard tableCard">
      <div class="adminToolbar">
        <el-button type="primary" :icon="Plus" @click="openCreate">添加角色</el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="!selection.length" @click="removeSelected">
          批量删除
        </el-button>
        <span class="adminToolbarSpacer"></span>
        <el-input v-model="keyword" placeholder="角色名称 / 标识" clearable @keyup.enter="applySearch" />
        <el-button type="primary" :icon="Search" @click="applySearch">查询</el-button>
        <el-button :icon="RefreshLeft" @click="resetFilters">重置</el-button>
        <el-button :icon="RefreshLeft" @click="resetAll">恢复默认</el-button>
      </div>

      <div class="tableWrap">
        <el-table
          :data="roleRows"
          row-key="key"
          height="100%"
          @selection-change="selection = $event"
        >
          <el-table-column type="selection" width="46" :selectable="(row) => row.key !== 'admin'" />
          <el-table-column label="序号" width="64" align="center">
            <template #default="{ $index }">{{ $index + 1 }}</template>
          </el-table-column>
          <el-table-column label="角色" min-width="110">
            <template #default="{ row }">
              <el-tag size="small" effect="plain" :type="roleTagType(row.key)">{{ row.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="key" label="角色标识" width="110">
            <template #default="{ row }">
              <span class="roleKey">{{ row.key }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已授权模块" min-width="280">
            <template #default="{ row }">
              <div class="permissionTags">
                <el-tag v-for="item in row.permissions" :key="item.key" size="small" effect="plain">
                  {{ item.label }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="权限数" width="92" align="center">
            <template #default="{ row }">
              <span class="permissionCount">{{ row.count }} / {{ admin.permissionOptions.length }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="说明" min-width="200" show-overflow-tooltip />
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <template v-if="row.key === 'admin'">
                <el-button link disabled>
                  <el-icon><Lock /></el-icon>
                  固定权限
                </el-button>
              </template>
              <template v-else>
                <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                <el-button link type="danger" @click="removeRole(row)">删除</el-button>
              </template>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="没有找到匹配的角色" :image-size="72" />
          </template>
        </el-table>
      </div>

      <div class="adminPager">
        <span>共 {{ roleRows.length }} 个角色</span>
      </div>
    </section>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '添加角色' : '编辑角色'"
      width="580px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" @submit.prevent="submitRole">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" maxlength="12" placeholder="例如：运营" />
        </el-form-item>
        <el-form-item label="角色标识" prop="key">
          <el-input
            v-model="form.key"
            maxlength="16"
            placeholder="例如：operator"
            :disabled="dialogMode === 'edit'"
          />
          <span v-if="dialogMode === 'edit'" class="fieldHint">角色标识创建后不可修改</span>
        </el-form-item>
        <el-form-item label="说明" prop="desc">
          <el-input v-model="form.desc" maxlength="40" show-word-limit placeholder="简要说明该角色的职责" />
        </el-form-item>
        <el-form-item label="功能权限" prop="permissions">
          <el-checkbox-group v-model="form.permissions" class="permissionGrid">
            <label v-for="item in admin.permissionOptions" :key="item.key" class="permissionItem">
              <el-checkbox :value="item.key">
                <span class="permissionLabel">{{ item.label }}</span>
                <span class="permissionKey">{{ item.key }}</span>
              </el-checkbox>
            </label>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRole">
          {{ dialogMode === 'create' ? '创建' : '保存' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
  <Footer />
</template>

<style scoped>
.roleKey {
  color: var(--app-text-muted);
  font-size: 11px;
  font-family: Consolas, Monaco, monospace;
}

.permissionTags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.permissionCount {
  color: var(--app-text-secondary);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.fieldHint {
  margin-top: 4px;
  color: var(--app-text-muted);
  font-size: 11px;
}

.permissionGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  width: 100%;
}

.permissionItem {
  display: flex;
  padding: 10px 12px;
  border: 1px solid var(--app-border-light);
  border-radius: 10px;
  background-color: var(--app-surface);
  transition: border-color 0.18s ease, background-color 0.18s ease;
}

.permissionItem:hover {
  border-color: var(--app-border-strong);
  background-color: var(--app-primary-softer);
}

.permissionItem :deep(.el-checkbox) {
  width: 100%;
  height: auto;
  margin-right: 0;
  align-items: flex-start;
}

.permissionItem :deep(.el-checkbox__label) {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 10px;
}

.permissionLabel {
  color: var(--app-text);
  font-size: 13px;
}

.permissionKey {
  color: var(--app-text-ghost);
  font-size: 10px;
  font-family: Consolas, Monaco, monospace;
  letter-spacing: 0.05em;
}
</style>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { submitForm } from '@/api/form'

const formRef = ref()
const loading = ref(false)
const submitted = ref(null)

const form = reactive({
  name: '',
  region: '',
  date: '',
  description: '',
  urgent: false,
})
const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  region: [{ required: true, message: '请选择区域', trigger: 'change' }],
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
}
const regionOptions = [
  { label: '华东', value: 'east' },
  { label: '华南', value: 'south' },
  { label: '华北', value: 'north' },
  { label: '西南', value: 'southwest' },
]

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const { data } = await submitForm({ ...form })
    submitted.value = data
    ElMessage.success(`提交成功：${data.name}`)
  } catch {
    // 错误提示由请求拦截器统一处理
  } finally {
    loading.value = false
  }
}

function handleReset() {
  formRef.value.resetFields()
  submitted.value = null
}
</script>

<template>
  <div class="page">
    <el-card shadow="never">
      <template #header>
        <div>
          <h3>表单示例</h3>
          <p>提交后由 Mock 接口 /form/submit 返回数据</p>
        </div>
      </template>

      <el-alert
        title="这是一个可复用的表单骨架：校验、提交 loading、结果回显都已接通。"
        type="info"
        :closable="false"
        show-icon
        class="tip"
      />

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="96px"
        class="form"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" clearable />
        </el-form-item>

        <el-form-item label="区域" prop="region">
          <el-select v-model="form.region" placeholder="请选择区域">
            <el-option
              v-for="item in regionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="是否加急">
          <el-switch v-model="form.urgent" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            maxlength="200"
            show-word-limit
            placeholder="请输入描述"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            提交
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-descriptions
        v-if="submitted"
        title="提交结果"
        :column="2"
        border
        class="result"
      >
        <el-descriptions-item label="名称">
          {{ submitted.name }}
        </el-descriptions-item>
        <el-descriptions-item label="区域">
          {{ submitted.region }}
        </el-descriptions-item>
        <el-descriptions-item label="日期">
          {{ submitted.date }}
        </el-descriptions-item>
        <el-descriptions-item label="加急">
          {{ submitted.urgent ? '是' : '否' }}
        </el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">
          {{ submitted.description || '—' }}
        </el-descriptions-item>
      </el-descriptions>
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

.tip {
  max-width: 720px;
  margin-bottom: 20px;
}

.form {
  max-width: 720px;
}

.result {
  max-width: 720px;
  margin-top: 24px;
}
</style>

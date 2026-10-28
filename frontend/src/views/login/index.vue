<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { title } from '@/config'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)
const form = reactive({
  username: 'admin',
  password: '123456',
})
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
const demos = [
  { username: 'admin', label: 'admin · 全部权限' },
  { username: 'editor', label: 'editor · 无表格权限' },
  { username: 'test', label: 'test · 双权限' },
]

function fillDemo(username) {
  form.username = username
  form.password = '123456'
}

async function handleLogin() {
  if (loading.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.login({ ...form })
    ElMessage.success('登录成功')
    const redirect =
      typeof route.query.redirect === 'string' &&
      route.query.redirect.startsWith('/')
        ? route.query.redirect
        : '/'
    await router.replace(redirect)
  } catch {
    // 错误提示由请求拦截器统一处理
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="logo">V</div>
        <div>
          <h1>{{ title }}</h1>
          <p>Vue 3 + Vite + Pinia + Element Plus</p>
        </div>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入账号"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-button
          type="primary"
          class="submit"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>
      </el-form>

      <div class="demos">
        <span>演示账号：</span>
        <el-tag
          v-for="demo in demos"
          :key="demo.username"
          class="demo-tag"
          effect="plain"
          @click="fillDemo(demo.username)"
        >
          {{ demo.label }}
        </el-tag>
      </div>
      <p class="hint">统一密码：123456</p>
    </div>

    <div class="copyright">© 2026 Vue012 Admin</div>
  </div>
</template>

<style scoped>
.login-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px 16px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 15% 20%, rgba(64, 158, 255, 0.22), transparent 32%),
    radial-gradient(circle at 85% 80%, rgba(103, 194, 58, 0.16), transparent 30%),
    #0f172a;
}

.login-card {
  width: min(420px, calc(100vw - 32px));
  padding: 36px 36px 28px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35);
}

.brand {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 28px;
}

.logo {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
}

.brand h1 {
  margin: 0;
  font-size: 22px;
  color: var(--app-text-deep);
}

.brand p {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--app-text-ep);
}

.submit {
  width: 100%;
  margin-top: 4px;
}

.demos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 24px;
  font-size: 12px;
  color: var(--app-text-ep);
}

.demo-tag {
  cursor: pointer;
}

.hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--app-text-placeholder);
}

.copyright {
  position: absolute;
  bottom: 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}
</style>

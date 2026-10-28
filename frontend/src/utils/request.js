import axios from 'axios'
import { ElMessage } from 'element-plus'
import {
  baseURL,
  contentType,
  invalidCode,
  messageDuration,
  noPermissionCode,
  requestTimeout,
  successCode,
  tokenName,
} from '@/config'
import { getAccessToken, removeAccessToken } from '@/utils/accessToken'
import { isArray } from '@/utils/validate'

const service = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
  },
})

service.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken()
    if (accessToken) {
      config.headers[tokenName] = accessToken
    }
    return config
  },
  (error) => Promise.reject(error)
)

async function handleCode(code, message) {
  if (code === invalidCode) {
    removeAccessToken()
    ElMessage.error(message || '登录状态已失效，请重新登录')
    if (window.location.pathname !== '/login') {
      const redirect = encodeURIComponent(
        `${window.location.pathname}${window.location.search}`
      )
      window.location.replace(`/login?redirect=${redirect}`)
    }
    return
  }

  if (code === noPermissionCode) {
    const { default: router } = await import('@/router')
    router.push('/error/401')
    return
  }

  ElMessage.error({
    message: message || `接口异常（${code}）`,
    duration: messageDuration,
  })
}

service.interceptors.response.use(
  (response) => {
    const { data, config } = response

    if (!data || typeof data !== 'object' || !('code' in data)) {
      return data
    }

    const codes = isArray(successCode) ? successCode : [successCode]
    if (codes.includes(data.code)) {
      return data
    }

    handleCode(data.code, data.msg)
    return Promise.reject(new Error(data.msg || `请求失败：${config.url}`))
  },
  (error) => {
    const message =
      error.response?.data?.msg ||
      (error.code === 'ECONNABORTED' ? '请求超时，请稍后重试' : '') ||
      error.message ||
      '网络请求失败'
    ElMessage.error({ message, duration: messageDuration })
    return Promise.reject(error)
  }
)

export default service

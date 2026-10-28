import { storage } from '@/config'

const PROFILE_KEY = 'vue012-admin:profile'

function getStorage() {
  return window[storage]
}

export function readProfileDraft() {
  try {
    const raw = getStorage().getItem(PROFILE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw)
    if (!saved || typeof saved !== 'object') return null
    const username = typeof saved.username === 'string' ? saved.username : ''
    const email = typeof saved.email === 'string' ? saved.email : ''
    return username || email ? { username, email } : null
  } catch {
    return null
  }
}

export function saveProfileDraft(draft) {
  try {
    getStorage().setItem(PROFILE_KEY, JSON.stringify(draft))
  } catch {
    // 隐私模式下写入失败时本次会话仍以 Pinia 内存值为准
  }
}

export function removeProfileDraft() {
  try {
    getStorage().removeItem(PROFILE_KEY)
  } catch {
    // 同上，清理失败不影响退出登录
  }
}

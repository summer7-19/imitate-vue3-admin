import { defineStore } from 'pinia'
import { login as loginApi, getUserInfo as getUserInfoApi, logout as logoutApi } from '@/api/user'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken'
import { readProfileDraft, removeProfileDraft, saveProfileDraft } from '@/utils/profileDraft'
import { tokenName } from '@/config'

export const useUserStore = defineStore('user', {
  state: () => {
    const draft = readProfileDraft()
    return {
      accessToken: getAccessToken(),
      username: draft?.username || '',
      avatar: '',
      email: draft?.email || '',
      permissions: [],
      profileDraft: draft,
    }
  },
  actions: {
    setPermissions(permissions) {
      this.permissions = permissions
    },
    async login(form) {
      const { data } = await loginApi(form)
      const accessToken = data?.[tokenName]
      if (!accessToken) {
        throw new Error('登录接口未返回 accessToken')
      }
      this.accessToken = accessToken
      setAccessToken(accessToken)
      return data
    },
    async getUserInfo() {
      const { data } = await getUserInfoApi(this.accessToken)
      if (!data) {
        throw new Error('获取用户信息失败')
      }
      this.username = this.profileDraft?.username || data.username || ''
      this.avatar = data.avatar || ''
      this.email = this.profileDraft?.email || data.email || ''
      this.permissions = Array.isArray(data.permissions) ? data.permissions : []
      return this.permissions
    },
    saveProfile({ username, email }) {
      const draft = { username: username.trim(), email: email.trim() }
      this.username = draft.username
      this.email = draft.email
      this.profileDraft = draft
      saveProfileDraft(draft)
      return draft
    },
    async logout() {
      try {
        await logoutApi()
      } finally {
        this.resetAccessToken()
        // 只有显式退出才清掉本地资料；接口失败触发的 resetAccessToken 要保留
        this.profileDraft = null
        removeProfileDraft()
      }
    },
    resetAccessToken() {
      this.accessToken = ''
      this.username = ''
      this.avatar = ''
      this.email = ''
      this.permissions = []
      removeAccessToken()
    },
  },
})

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Briefcase,
  Calendar,
  Check,
  EditPen,
  Female,
  Link,
  Male,
  OfficeBuilding,
  Plus,
  Refresh,
  SwitchButton,
  User,
} from '@element-plus/icons-vue'
import { useUserProfile } from '@/composables/useUserProfile'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const HISTORY_KEY = 'shop-vite:path-history'
const RECENT_LIMIT = 3
const PROFILE_KEY = 'shop-vite:profile-extra'
const DEFAULT_MOTTO = '富在术数，不在劳身；利在势居，不在力耕。'

const route = useRoute()
const router = useRouter()
const { userStore, isLoggedIn, displayName, avatarText, roleLabel, email } = useUserProfile()

const activeTab = ref('basic')

const profile = reactive({
  username: '',
  nickname: 'good luck',
  gender: '女',
  bio: DEFAULT_MOTTO,
  tags: ['腹黑', '怕麻烦', '小仙女', '仙气飘飘'],
  profession: '前端小白白',
  birthday: '1992/8/11',
  department: '',
  following: false,
  phone: '138****8888',
  wechat: '',
  github: '',
})

const savedSnapshot = ref('')
const currentSnapshot = computed(() => JSON.stringify(profile))
const dirty = computed(() => currentSnapshot.value !== savedSnapshot.value)

const genderOptions = ['女', '男', '保密']
const tagLimit = 8
const addingTag = ref(false)
const newTag = ref('')

const editDialog = ref(false)
const editForm = reactive({ profession: '', birthday: '', department: '' })

const recentVisits = ref([])

const identityRows = computed(() => [
  { key: 'profession', label: '职业', value: profile.profession || '未填写', icon: Briefcase },
  { key: 'birthday', label: '生日', value: profile.birthday || '未填写', icon: Calendar },
  { key: 'gender', label: '性别', value: profile.gender, icon: profile.gender === '男' ? Male : Female },
  { key: 'department', label: '部门', value: profile.department || '未填写', icon: OfficeBuilding },
])

const bindings = computed(() => [
  {
    key: 'email',
    label: '邮箱',
    icon: Link,
    value: email.value,
    desc: '邮箱随登录账号同步，暂不支持在本页解绑。',
    editable: false,
  },
  {
    key: 'phone',
    label: '手机号',
    icon: User,
    value: profile.phone,
    desc: '用于接收工单与安全提醒。',
    editable: true,
  },
  {
    key: 'wechat',
    label: '微信',
    icon: Link,
    value: profile.wechat,
    desc: '绑定后可通过微信扫码快捷登录。',
    editable: true,
  },
  {
    key: 'github',
    label: 'GitHub',
    icon: Link,
    value: profile.github,
    desc: '用于同步开源项目与 Issues。',
    editable: true,
  },
])

const followText = computed(() => (profile.following ? 'Following' : 'Follow me'))

function defaultsFor(name) {
  return {
    nickname: name === 'admin' ? 'good luck' : name || 'good luck',
  }
}

function loadProfile() {
  const name = userStore.username || ''
  Object.assign(profile, {
    username: name,
    nickname: defaultsFor(name).nickname,
    gender: '女',
    bio: DEFAULT_MOTTO,
    tags: ['腹黑', '怕麻烦', '小仙女', '仙气飘飘'],
    profession: '前端小白白',
    birthday: '1992/8/11',
    department: '',
    following: false,
    phone: '138****8888',
    wechat: '',
    github: '',
  })

  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null')
    if (saved && (!saved.username || saved.username === name)) {
      Object.assign(profile, {
        ...saved,
        username: name,
        tags: Array.isArray(saved.tags) ? [...saved.tags] : profile.tags,
      })
    }
  } catch {
    // 本地数据损坏时回退到默认资料
  }
  savedSnapshot.value = JSON.stringify(profile)
}

function persistProfile() {
  profile.username = userStore.username || ''
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    savedSnapshot.value = JSON.stringify(profile)
    return true
  } catch {
    ElMessage.error('本地存储不可用，资料未能保存')
    return false
  }
}

function saveProfile() {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录后再保存资料')
    return
  }
  if (!profile.nickname.trim()) {
    ElMessage.warning('昵称不能为空')
    return
  }
  if (persistProfile()) ElMessage.success('资料已保存')
}

function resetProfile() {
  if (!dirty.value) return
  loadProfile()
  ElMessage.info('已恢复为上次保存的资料')
}

function toggleFollow() {
  if (!isLoggedIn.value) {
    ElMessage.info('登录后即可关注该账号')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  profile.following = !profile.following
  persistProfile()
  ElMessage.success(profile.following ? '已关注，后续动态会提醒你' : '已取消关注')
}

function startAddTag() {
  if (profile.tags.length >= tagLimit) {
    ElMessage.warning(`最多只能添加 ${tagLimit} 个标签`)
    return
  }
  addingTag.value = true
  newTag.value = ''
}

function confirmAddTag() {
  const value = newTag.value.trim()
  if (!value) {
    addingTag.value = false
    return
  }
  if (value.length > 10) {
    ElMessage.warning('单个标签最多 10 个字符')
    return
  }
  if (profile.tags.includes(value)) {
    ElMessage.warning('该标签已存在')
    return
  }
  profile.tags.push(value)
  addingTag.value = false
  newTag.value = ''
}

function removeTag(tag) {
  profile.tags = profile.tags.filter((item) => item !== tag)
}

function openInfoEditor() {
  editForm.profession = profile.profession
  editForm.birthday = profile.birthday
  editForm.department = profile.department
  editDialog.value = true
}

function confirmInfoEditor() {
  profile.profession = editForm.profession.trim()
  profile.birthday = editForm.birthday
  profile.department = editForm.department.trim()
  editDialog.value = false
  if (isLoggedIn.value) persistProfile()
  ElMessage.success('资料卡已更新')
}

async function editBinding(row) {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录后再管理绑定')
    return
  }
  if (row.value) {
    try {
      await ElMessageBox.confirm(`确定解绑${row.label}「${row.value}」吗？`, `解绑${row.label}`, {
        type: 'warning',
        confirmButtonText: '解绑',
        cancelButtonText: '取消',
      })
    } catch {
      return
    }
    profile[row.key] = ''
    persistProfile()
    ElMessage.success(`${row.label}已解绑`)
    return
  }

  let input
  try {
    const result = await ElMessageBox.prompt(`请输入要绑定的${row.label}`, `绑定${row.label}`, {
      confirmButtonText: '绑定',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '内容不能为空',
    })
    input = result.value
  } catch {
    return
  }
  profile[row.key] = input.trim()
  persistProfile()
  ElMessage.success(`${row.label}绑定成功`)
}

function readRecentVisits() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]')
    if (!Array.isArray(saved)) return []
    return saved
      .filter((item) => item && typeof item.path === 'string' && typeof item.title === 'string')
      .slice(-RECENT_LIMIT)
      .reverse()
  } catch {
    return []
  }
}

function go(path) {
  if (path !== route.path) router.push(path)
}

async function refreshUserInfo() {
  if (!userStore.accessToken) {
    ElMessage.info('请先登录后再获取账号信息')
    return
  }
  try {
    await userStore.getUserInfo()
    ElMessage.success('账号信息已刷新')
  } catch (error) {
    ElMessage.error(error?.message || '获取用户信息失败')
  }
}

async function handleLogout() {
  if (!isLoggedIn.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  try {
    await ElMessageBox.confirm('确定要退出当前账号吗？', '退出登录', {
      type: 'warning',
      confirmButtonText: '退出',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  try {
    await userStore.logout()
  } catch {
    // 后端不可用时 logout 的 finally 仍会清理本地登录态
  }
  ElMessage.success('已退出登录')
  router.push({ path: '/login', query: { redirect: route.fullPath } })
}

watch(
  () => userStore.username,
  () => loadProfile()
)

onMounted(() => {
  loadProfile()
  recentVisits.value = readRecentVisits()
})
</script>

<template>
  <div class="profilePage">
    <el-alert
      v-if="!isLoggedIn"
      class="guestAlert"
      type="warning"
      show-icon
      :closable="false"
      title="当前处于访客状态"
      description="登录后才能保存资料、关注账号并管理绑定信息，以下内容仅作展示。"
    />

    <div class="profileGrid">
      <aside class="identityCard">
        <div class="identityTop">
          <span class="avatar">
            <img v-if="userStore.avatar" :src="userStore.avatar" :alt="displayName" />
            <template v-else>{{ avatarText }}</template>
          </span>
          <strong class="identityName">{{ displayName }}</strong>
          <span class="identityRole">{{ roleLabel }}</span>
          <p class="identityMotto">{{ profile.bio || DEFAULT_MOTTO }}</p>
          <button type="button" class="followBtn" :class="{ following: profile.following }" @click="toggleFollow">
            <el-icon>
              <Check v-if="profile.following" />
              <Plus v-else />
            </el-icon>
            <span>{{ followText }}</span>
          </button>
        </div>

        <div class="identityDivider" aria-hidden="true"></div>

        <div class="identityBlock">
          <div class="blockHead">
            <h3>账号信息</h3>
            <button type="button" class="iconBtn" title="编辑资料卡" @click="openInfoEditor">
              <el-icon><EditPen /></el-icon>
            </button>
          </div>
          <ul class="infoRows">
            <li v-for="row in identityRows" :key="row.key">
              <span class="infoIcon"><el-icon><component :is="row.icon" /></el-icon></span>
              <span class="infoLabel">{{ row.label }}</span>
              <span class="infoValue">{{ row.value }}</span>
            </li>
          </ul>
        </div>

        <div class="identityDivider" aria-hidden="true"></div>

        <div class="identityBlock">
          <h3 class="blockHeadTitle">最近访问</h3>
          <div v-if="recentVisits.length" class="recentList">
            <button v-for="item in recentVisits" :key="item.path" type="button" class="recentItem" @click="go(item.path)">
              <span class="recentTitle">{{ item.title }}</span>
              <span class="recentPath">{{ item.path }}</span>
            </button>
          </div>
          <p v-else class="emptyText">
            还没有浏览记录，
            <button type="button" class="inlineLink" @click="go('/shop-vite')">去逛一圈</button>
            就会出现在这里。
          </p>
        </div>

        <div class="identityActions">
          <el-button plain size="small" :icon="Refresh" @click="refreshUserInfo">刷新账号信息</el-button>
          <el-button plain size="small" type="danger" :icon="SwitchButton" @click="handleLogout">
            {{ isLoggedIn ? '退出登录' : '去登录' }}
          </el-button>
        </div>
      </aside>

      <section class="detailCard">
        <div class="tabBar" role="tablist">
          <button
            type="button"
            role="tab"
            class="tabItem"
            :class="{ active: activeTab === 'basic' }"
            :aria-selected="activeTab === 'basic'"
            @click="activeTab = 'basic'"
          >
            基本信息
          </button>
          <button
            type="button"
            role="tab"
            class="tabItem"
            :class="{ active: activeTab === 'binding' }"
            :aria-selected="activeTab === 'binding'"
            @click="activeTab = 'binding'"
          >
            账号绑定
          </button>
          <span v-if="dirty" class="dirtyHint">有未保存的修改</span>
        </div>

        <div v-if="activeTab === 'basic'" class="tabPanel">
          <el-form label-width="76px" label-position="left" class="profileForm" @submit.prevent>
            <el-form-item label="姓名">
              <div class="readonlyField">
                <span>{{ displayName }}</span>
                <i>登录账号，不可修改</i>
              </div>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="profile.nickname" maxlength="16" show-word-limit placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="profile.gender">
                <el-radio v-for="item in genderOptions" :key="item" :value="item">{{ item }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input
                v-model="profile.bio"
                type="textarea"
                :rows="3"
                maxlength="80"
                show-word-limit
                placeholder="写一句介绍自己的话"
              />
            </el-form-item>
            <el-form-item label="标签">
              <div class="tagEditor">
                <el-tag
                  v-for="tag in profile.tags"
                  :key="tag"
                  class="profileTag"
                  closable
                  effect="plain"
                  @close="removeTag(tag)"
                >
                  {{ tag }}
                </el-tag>

                <template v-if="addingTag">
                  <el-input
                    v-model="newTag"
                    class="tagInput"
                    size="small"
                    maxlength="10"
                    autofocus
                    placeholder="新标签"
                    @keyup.enter="confirmAddTag"
                  />
                  <el-button size="small" type="primary" @click="confirmAddTag">确定</el-button>
                  <el-button size="small" @click="addingTag = false">取消</el-button>
                </template>
                <button v-else type="button" class="addTagBtn" :disabled="profile.tags.length >= tagLimit" @click="startAddTag">
                  <el-icon><Plus /></el-icon>
                  添加
                </button>
              </div>
            </el-form-item>
          </el-form>

          <div class="formFooter">
            <span class="formHint">
              {{ isLoggedIn ? '资料保存在浏览器本地，与本账号绑定。' : '登录后才可以保存修改。' }}
            </span>
            <div class="formActions">
              <el-button :disabled="!dirty" @click="resetProfile">重置</el-button>
              <el-button type="primary" :disabled="!isLoggedIn || !dirty" @click="saveProfile">保存修改</el-button>
            </div>
          </div>
        </div>

        <div v-else class="tabPanel">
          <ul class="bindingList">
            <li v-for="row in bindings" :key="row.key" class="bindingItem">
              <span class="bindingIcon"><el-icon><component :is="row.icon" /></el-icon></span>
              <span class="bindingBody">
                <span class="bindingHead">
                  <strong>{{ row.label }}</strong>
                  <el-tag v-if="row.value" size="small" type="success" effect="plain">已绑定</el-tag>
                  <el-tag v-else size="small" type="info" effect="plain">未绑定</el-tag>
                </span>
                <span class="bindingValue">{{ row.value || '暂未绑定' }}</span>
                <span class="bindingDesc">{{ row.desc }}</span>
              </span>
              <el-button
                v-if="row.editable"
                link
                :type="row.value ? 'danger' : 'primary'"
                :disabled="!isLoggedIn"
                @click="editBinding(row)"
              >
                {{ row.value ? '解绑' : '绑定' }}
              </el-button>
              <span v-else class="bindingLocked">只读</span>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <el-dialog v-model="editDialog" title="编辑资料卡" width="420px" destroy-on-close>
      <el-form :model="editForm" label-width="64px">
        <el-form-item label="职业">
          <el-input v-model="editForm.profession" maxlength="16" placeholder="例如：前端小白白" />
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="editForm.birthday"
            type="date"
            value-format="YYYY/M/D"
            placeholder="选择生日"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="editForm.department" maxlength="16" placeholder="例如：体验设计部" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmInfoEditor">确定</el-button>
      </template>
    </el-dialog>
  </div>
  <Footer />
</template>

<style scoped>
.profilePage {
  flex: 1;
  min-height: 0;
  padding: 18px clamp(12px, 2vw, 24px);
  box-sizing: border-box;
  overflow-y: auto;
  background-color: var(--app-surface-plain);
  scrollbar-width: thin;
  scrollbar-color: var(--app-text-ghost) transparent;
}

.guestAlert {
  margin-bottom: 16px;
}

.profileGrid {
  display: grid;
  grid-template-columns: minmax(260px, 0.72fr) minmax(0, 1.4fr);
  align-items: start;
  gap: 18px;
}

.identityCard,
.detailCard {
  border: 1px solid var(--app-border-quiet);
  border-radius: 14px;
  background-color: var(--app-surface);
  box-shadow:
    0 1px 2px rgba(47, 58, 74, 0.04),
    0 12px 26px -20px rgba(47, 58, 74, 0.45);
}

.identityCard {
  padding: 26px 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.identityTop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92px;
  height: 92px;
  margin-bottom: 6px;
  overflow: hidden;
  color: #fff;
  font-size: 34px;
  font-weight: 600;
  border: 3px solid var(--app-surface);
  border-radius: 50%;
  background: linear-gradient(135deg, #4e88f3, #67c23a);
  box-shadow: 0 8px 20px -10px rgba(78, 136, 243, 0.65);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.identityName {
  color: var(--app-text-deeper);
  font-size: 18px;
  font-weight: 600;
}

.identityRole {
  padding: 1px 10px;
  color: var(--app-primary-strong);
  font-size: 11px;
  line-height: 19px;
  border-radius: 999px;
  background-color: var(--app-primary-soft);
}

.identityMotto {
  margin: 8px 0 4px;
  color: var(--app-text-soft);
  font-size: 12px;
  line-height: 1.7;
}

.followBtn {
  margin-top: 6px;
  width: 100%;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  font-size: 13px;
  border: none;
  border-radius: 9px;
  background: linear-gradient(135deg, #4e88f3, #3f74d8);
  box-shadow: 0 8px 18px -10px rgba(78, 136, 243, 0.9);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.followBtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 22px -12px rgba(78, 136, 243, 0.95);
}

.followBtn.following {
  color: var(--app-primary-strong);
  background: var(--app-primary-soft);
  box-shadow: none;
}

.followBtn:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.identityDivider {
  height: 1px;
  background-color: var(--app-border-divider);
}

.identityBlock {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.blockHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.blockHead h3,
.blockHeadTitle {
  margin: 0;
  color: var(--app-text-secondary);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.iconBtn {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-soft);
  font-size: 13px;
  border: 1px solid var(--app-border-cool);
  border-radius: 6px;
  background-color: var(--app-surface);
  cursor: pointer;
  transition: color 0.16s ease, border-color 0.16s ease, background-color 0.16s ease;
}

.iconBtn:hover {
  color: var(--app-primary);
  border-color: var(--app-primary);
  background-color: var(--app-primary-softer);
}

.infoRows {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.infoRows li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: 8px;
  transition: background-color 0.16s ease;
}

.infoRows li:hover {
  background-color: var(--app-surface-quiet);
}

.infoIcon {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  color: var(--app-primary);
  font-size: 13px;
  border-radius: 7px;
  background-color: var(--app-primary-softer);
}

.infoLabel {
  flex-shrink: 0;
  color: var(--app-text-soft);
  font-size: 12px;
}

.infoValue {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--app-text);
  font-size: 12px;
  font-weight: 500;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recentList {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.recentItem {
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  text-align: left;
  border: 1px solid var(--app-border-cool);
  border-radius: 8px;
  background-color: var(--app-surface);
  cursor: pointer;
  transition: border-color 0.16s ease, background-color 0.16s ease;
}

.recentItem:hover {
  border-color: var(--app-border-strong);
  background-color: var(--app-surface-quiet);
}

.recentTitle {
  min-width: 0;
  overflow: hidden;
  color: var(--app-text);
  font-size: 12px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recentPath {
  flex-shrink: 0;
  max-width: 52%;
  overflow: hidden;
  color: var(--app-text-muted);
  font-size: 10px;
  font-family: Consolas, Monaco, monospace;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.emptyText {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 12px;
  line-height: 1.7;
}

.inlineLink {
  padding: 0;
  color: var(--app-primary);
  font-size: 12px;
  border: none;
  background: none;
  text-decoration: underline dotted;
  cursor: pointer;
}

.inlineLink:hover {
  text-decoration-style: solid;
}

.identityActions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.detailCard {
  padding: 8px 22px 20px;
}

.tabBar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 0 0;
  border-bottom: 1px solid var(--app-border-divider);
}

.tabItem {
  position: relative;
  padding: 8px 14px 12px;
  color: var(--app-text-soft);
  font-size: 13px;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.16s ease;
}

.tabItem:hover {
  color: var(--app-text);
}

.tabItem.active {
  color: var(--app-primary);
  font-weight: 600;
}

.tabItem.active::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: -1px;
  height: 2px;
  border-radius: 2px;
  background-color: var(--app-primary);
}

.tabItem:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: -2px;
  border-radius: 6px;
}

.dirtyHint {
  margin-left: auto;
  padding: 1px 8px;
  color: #e6a23c;
  font-size: 11px;
  line-height: 18px;
  border-radius: 999px;
  background-color: rgba(230, 162, 60, 0.12);
}

.tabPanel {
  padding-top: 18px;
}

.profileForm :deep(.el-form-item) {
  margin-bottom: 18px;
}

.profileForm :deep(.el-form-item__label) {
  color: var(--app-text-soft);
  font-size: 12.5px;
  font-weight: 500;
}

.profileForm :deep(.el-input__wrapper),
.profileForm :deep(.el-textarea__inner) {
  border-radius: 8px;
}

.readonlyField {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  color: var(--app-text);
  font-size: 13px;
}

.readonlyField i {
  color: var(--app-text-muted);
  font-size: 11px;
  font-style: normal;
}

.tagEditor {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.profileTag {
  border-radius: 6px;
}

.tagInput {
  width: 120px;
}

.addTagBtn {
  height: 24px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 0 8px;
  color: var(--app-text-soft);
  font-size: 12px;
  border: 1px dashed var(--app-border-strong);
  border-radius: 6px;
  background-color: transparent;
  cursor: pointer;
  transition: color 0.16s ease, border-color 0.16s ease, background-color 0.16s ease;
}

.addTagBtn:hover:not(:disabled) {
  color: var(--app-primary);
  border-color: var(--app-primary);
  background-color: var(--app-primary-softer);
}

.addTagBtn:disabled {
  color: var(--app-text-muted);
  cursor: not-allowed;
}

.formFooter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px dashed var(--app-border-quiet);
}

.formHint {
  color: var(--app-text-muted);
  font-size: 11px;
  line-height: 1.6;
}

.formActions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.formActions :deep(.el-button + .el-button) {
  margin-left: 0;
}

.bindingList {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bindingItem {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--app-border-cool);
  border-radius: 10px;
  background-color: var(--app-surface);
  transition: border-color 0.16s ease, background-color 0.16s ease;
}

.bindingItem:hover {
  border-color: var(--app-border-strong);
  background-color: var(--app-primary-softer);
}

.bindingIcon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  color: var(--app-primary);
  font-size: 15px;
  border-radius: 9px;
  background-color: var(--app-primary-soft);
}

.bindingBody {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.bindingHead {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bindingHead strong {
  color: var(--app-text);
  font-size: 13px;
  font-weight: 600;
}

.bindingValue {
  overflow: hidden;
  color: var(--app-text-secondary);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bindingDesc {
  color: var(--app-text-muted);
  font-size: 11px;
  line-height: 1.5;
}

.bindingLocked {
  flex-shrink: 0;
  color: var(--app-text-ghost);
  font-size: 11px;
}

@keyframes cardIn {
  from {
    opacity: 0;
    translate: 0 12px;
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

.identityCard,
.detailCard {
  animation: cardIn 0.46s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.identityCard {
  animation-delay: 0.05s;
}

.detailCard {
  animation-delay: 0.1s;
}

@media (prefers-reduced-motion: reduce) {
  .identityCard,
  .detailCard {
    animation: none;
  }

  .followBtn,
  .iconBtn,
  .tabItem,
  .recentItem,
  .addTagBtn,
  .bindingItem,
  .infoRows li {
    transition: none;
  }
}

@media (max-width: 992px) {
  .profileGrid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 768px) {
  .profilePage {
    padding: 14px;
  }

  .detailCard {
    padding: 8px 16px 16px;
  }

  .profileForm :deep(.el-form-item) {
    flex-direction: column;
    align-items: stretch;
  }

  .profileForm :deep(.el-form-item__label) {
    justify-content: flex-start;
    padding-bottom: 6px;
  }

  .bindingItem {
    flex-wrap: wrap;
  }
}
</style>

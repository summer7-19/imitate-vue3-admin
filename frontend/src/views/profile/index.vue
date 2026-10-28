<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserProfile } from '@/composables/useUserProfile'

const HISTORY_KEY = 'shop-vite:path-history'
const RECENT_LIMIT = 4

const route = useRoute()
const router = useRouter()
const { userStore, isLoggedIn, displayName, avatarText, roleLabel, email } = useUserProfile()

const editing = ref(false)
const formRef = ref()
const form = reactive({ username: '', email: '' })

const rules = {
    username: [
        { required: true, message: '请填写昵称', trigger: 'blur' },
        { min: 2, max: 16, message: '昵称长度需在 2 到 16 个字符之间', trigger: 'blur' },
    ],
    email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
}

const infoRows = computed(() => [
    { label: '昵称', value: displayName.value },
    { label: '角色', value: roleLabel.value },
    { label: '邮箱', value: email.value || '未绑定邮箱' },
])

const recentVisits = ref([])

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

function startEdit() {
    form.username = userStore.username
    form.email = userStore.email
    editing.value = true
}

function cancelEdit() {
    editing.value = false
    formRef.value?.clearValidate()
}

async function submitProfile() {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return
    userStore.saveProfile({ username: form.username, email: form.email })
    editing.value = false
    ElMessage.success('资料已保存')
}

const shortcuts = [
    { title: '默认首页', desc: '返回系统概览', path: '/' },
    { title: '模板市场', desc: '浏览 /shop 模板', path: '/shop' },
    { title: 'Shop Vite', desc: '进入看板工作台', path: '/shop-vite' },
    { title: '系统设置', desc: '界面与偏好项', path: '/settings' },
]

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

function go(path) {
    if (path !== route.path) router.push(path)
}

function back() {
    if (window.history.state?.back) router.back()
    else go('/')
}

onMounted(() => {
    recentVisits.value = readRecentVisits()
})
</script>

<template>
    <div class="profilePage">
        <div class="pageHead">
            <button type="button" class="backBtn" @click="back">返回</button>
            <div class="titles">
                <h2>个人中心</h2>
                <!-- <p>账号信息来自后端 /userInfo，与模板市场、Shop Vite 头部共用同一份数据；昵称与邮箱可在本页修改。</p> -->
            </div>
            <el-button type="primary" plain @click="refreshUserInfo">
                <el-icon><Refresh /></el-icon><span>刷新账号信息</span>
            </el-button>
        </div>

        <div class="hero">
            <span class="heroAvatar">
                <img v-if="userStore.avatar" :src="userStore.avatar" :alt="displayName">
                <template v-else>{{ avatarText }}</template>
            </span>
            <div class="heroIdentity">
                <strong class="heroName">{{ displayName }}</strong>
                <span class="heroMail">{{ email || '未绑定邮箱' }}</span>
                <div class="heroTags">
                    <span class="tag">{{ roleLabel }}</span>
                </div>
            </div>
        </div>

        <div class="grid">
            <section class="card">
                <p class="cardEyebrow">01 · Account</p>
                <div class="titleRow">
                    <h3 class="cardTitle">账号资料</h3>
                    <div class="titleOps">
                        <button v-if="!editing" type="button" class="editBtn" :disabled="!isLoggedIn"
                            :title="isLoggedIn ? '编辑昵称与邮箱' : '登录后可编辑资料'" @click="startEdit">编辑</button>
                        <button type="button" class="editBtn logoutBtn" :disabled="!isLoggedIn"
                            :title="isLoggedIn ? '退出当前账号' : '当前未登录'" @click="handleLogout">退出登录</button>
                    </div>
                </div>
                <el-form v-if="editing" ref="formRef" :model="form" :rules="rules" label-position="top"
                    class="infoForm" @submit.prevent="submitProfile">
                    <el-form-item label="昵称" prop="username">
                        <el-input v-model="form.username" maxlength="16" show-word-limit placeholder="2–16 个字符" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" placeholder="name@example.com" />
                    </el-form-item>
                    <div class="formOps">
                        <el-button type="primary" @click="submitProfile">保存</el-button>
                        <el-button @click="cancelEdit">取消</el-button>
                    </div>
                </el-form>
                <ul v-else class="infoList">
                    <li v-for="row in infoRows" :key="row.label">
                        <span class="infoLabel">{{ row.label }}</span>
                        <strong class="infoValue">{{ row.value }}</strong>
                    </li>
                </ul>

                <div class="recentBlock">
                    <h4 class="blockTitle">最近访问</h4>
                    <div v-if="recentVisits.length" class="recentList">
                        <button v-for="item in recentVisits" :key="item.path" type="button" class="recentItem"
                            @click="go(item.path)">
                            <span class="recentTitle">{{ item.title }}</span>
                            <span class="recentPath">{{ item.path }}</span>
                        </button>
                    </div>
                    <p v-else class="emptyText">
                        还没有 Shop Vite 浏览记录，
                        <button type="button" class="inlineLink" @click="go('/shop-vite')">去逛一圈</button>
                        就会出现在这里。
                    </p>
                </div>
            </section>

            <section class="card shortcutCard">
                <p class="cardEyebrow">02 · Shortcuts</p>
                <h3 class="cardTitle">快捷入口</h3>
                <div class="shortcutGrid">
                    <button v-for="(item, index) in shortcuts" :key="item.path" type="button" class="shortcut"
                        :class="{ active: item.path === route.path }" @click="go(item.path)">
                        <i class="shortcutIndex">{{ String(index + 1).padStart(2, '0') }}</i>
                        <span class="shortcutBody">
                            <strong>{{ item.title }}</strong>
                            <span class="shortcutDesc">{{ item.desc }}</span>
                        </span>
                        <i class="shortcutPath">{{ item.path }}</i>
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.profilePage {
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background-color: var(--app-surface);
    border-radius: 10px;
}

.pageHead {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 4px 2px;
}

.backBtn {
    flex-shrink: 0;
    height: 30px;
    padding: 0 14px;
    color: var(--app-text-secondary);
    font-size: 12px;
    border: 1px solid var(--app-border-cool);
    border-radius: 8px;
    background-color: var(--app-surface);
    cursor: pointer;
    transition: background-color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.backBtn:hover {
    border-color: var(--app-border-strong);
    background-color: var(--app-surface-quiet);
    transform: translateY(-1px);
}

.titles {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.titles h2 {
    margin: 0;
    color: var(--app-text-deeper);
    font-size: 18px;
    font-weight: 600;
}

.titles p {
    margin: 0;
    color: var(--app-text-soft);
    font-size: 12px;
    line-height: 1.6;
}

.hero {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 20px;
    border: 1px solid var(--app-border-quiet);
    border-radius: 14px;
    background-color: var(--app-surface-quiet);
    box-shadow: 0 1px 2px rgba(47, 58, 74, 0.04), 0 10px 24px -14px rgba(47, 58, 74, 0.2);
}

.heroAvatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    flex-shrink: 0;
    overflow: hidden;
    color: var(--app-text-secondary);
    font-size: 26px;
    font-weight: 600;
    border: 1px solid var(--app-border-quiet);
    border-radius: 50%;
    background-color: var(--app-surface-mute);
}

.heroAvatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.heroIdentity {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.heroName {
    overflow: hidden;
    color: var(--app-text-deeper);
    font-size: 20px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.heroMail {
    color: var(--app-text-soft);
    font-size: 12px;
}

.heroTags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tag {
    padding: 2px 10px;
    color: var(--app-text-secondary);
    font-size: 11px;
    line-height: 18px;
    border-radius: 999px;
    background-color: var(--app-surface-mute);
}

.grid {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    align-items: start;
    gap: 18px;
}

.card {
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid var(--app-border-quiet);
    border-radius: 14px;
    background-color: var(--app-surface-bright);
    box-shadow: 0 1px 2px rgba(47, 58, 74, 0.05), 0 10px 24px -12px rgba(47, 58, 74, 0.26);
}

.cardEyebrow {
    margin: 0 0 -6px;
    color: var(--app-text-ghost);
    font-size: 11px;
    font-family: Consolas, Monaco, monospace;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}

.cardTitle {
    margin: 0;
    padding-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--app-text);
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid var(--app-border-divider);
}

.cardTitle::before {
    content: '';
    flex-shrink: 0;
    width: 3px;
    height: 13px;
    border-radius: 2px;
    background-color: color-mix(in srgb, var(--app-primary) 50%, var(--app-text-ghost));
}

.titleRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--app-border-divider);
}

.titleRow .cardTitle {
    flex: 1;
    min-width: 0;
    padding-bottom: 0;
    border-bottom: none;
}

.titleOps {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
}

.editBtn {
    flex-shrink: 0;
    height: 26px;
    padding: 0 12px;
    color: var(--app-primary);
    font-size: 12px;
    border: 1px solid var(--app-border-cool);
    border-radius: 7px;
    background-color: var(--app-surface);
    cursor: pointer;
    transition: border-color 0.18s ease, background-color 0.18s ease;
}

.editBtn:hover {
    border-color: var(--app-primary);
    background-color: var(--app-primary-softer);
}

.editBtn:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
}

.editBtn:disabled {
    color: var(--app-text-muted);
    border-color: var(--app-border-quiet);
    background-color: var(--app-surface-quiet);
    cursor: not-allowed;
}

.editBtn:disabled:hover {
    border-color: var(--app-border-quiet);
    background-color: var(--app-surface-quiet);
}

.logoutBtn {
    color: var(--el-color-danger);
    border-color: color-mix(in srgb, var(--el-color-danger) 35%, transparent);
}

.logoutBtn:hover {
    border-color: var(--el-color-danger);
    background-color: color-mix(in srgb, var(--el-color-danger) 8%, var(--app-surface));
}

.infoForm :deep(.el-form-item) {
    margin-bottom: 14px;
}

.infoForm :deep(.el-form-item__label) {
    padding-bottom: 4px;
    color: var(--app-text-soft);
    font-size: 12px;
    line-height: 1.4;
}

.formOps {
    display: flex;
    gap: 10px;
}

.formOps :deep(.el-button + .el-button) {
    margin-left: 0;
}

.infoList {
    margin: 0;
    padding: 0;
    list-style: none;
}

.infoList li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin: 0 -8px;
    padding: 9px 8px;
    font-size: 13px;
    border-bottom: 1px dashed var(--app-border-quiet);
    border-radius: 8px;
    transition: background-color 0.16s ease;
}

.infoList li:hover {
    background-color: var(--app-surface-quiet);
}

.infoList li:last-child {
    border-bottom: none;
}

.infoLabel {
    flex-shrink: 0;
    color: var(--app-text-soft);
}

.infoValue {
    min-width: 0;
    overflow: hidden;
    color: var(--app-text);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.shortcutGrid {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.shortcut {
    width: 100%;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    text-align: left;
    border: 1px solid var(--app-border-cool);
    border-radius: 10px;
    background-color: var(--app-surface);
    cursor: pointer;
    transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}

.shortcut:hover {
    border-color: var(--app-border-strong);
    background-color: var(--app-surface-quiet);
    box-shadow: inset 2px 0 0 color-mix(in srgb, var(--app-primary) 42%, transparent);
}

.shortcut:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
}

.shortcut .shortcutIndex {
    flex-shrink: 0;
    width: 16px;
    color: var(--app-text-ghost);
    font-size: 12px;
    font-family: Consolas, Monaco, monospace;
    font-style: normal;
    letter-spacing: 0.06em;
    transition: color 0.18s ease;
}

.shortcut:hover .shortcutIndex {
    color: var(--app-primary);
}

.shortcut.active {
    border-color: var(--app-border-strong);
    background-color: var(--app-surface-mute);
}

.shortcutBody {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.shortcutBody strong {
    color: var(--app-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.8;
}

.shortcutDesc {
    color: var(--app-text-soft);
    font-size: 11px;
    line-height: 1.4;
}

.shortcutPath {
    flex-shrink: 0;
    max-width: 46%;
    overflow: hidden;
    color: var(--app-text-muted);
    font-size: 10px;
    font-family: Consolas, Monaco, monospace;
    font-style: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.recentList {
    padding: 2px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.recentItem {
    padding: 9px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    text-align: left;
    border: 1px solid var(--app-border-cool);
    border-radius: 9px;
    background-color: var(--app-surface);
    cursor: pointer;
    transition: border-color 0.16s ease, background-color 0.16s ease;
}

.recentItem:hover {
    border-color: var(--app-border-strong);
    background-color: var(--app-surface-quiet);
}

.recentItem:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
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
    padding: 10px 0;
    color: var(--app-text-muted);
    font-size: 12px;
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

.inlineLink:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
    border-radius: 3px;
}

.recentBlock {
    margin-top: 4px;
    padding-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-top: 1px dashed var(--app-border-quiet);
}

.blockTitle {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--app-text-secondary);
    font-size: 12px;
    font-weight: 600;
}

.blockTitle::before {
    content: '';
    flex-shrink: 0;
    width: 3px;
    height: 11px;
    border-radius: 2px;
    background-color: color-mix(in srgb, var(--app-primary) 42%, var(--app-text-ghost));
}

.hint {
    margin: 0;
    color: var(--app-text-muted);
    font-size: 11px;
    line-height: 1.6;
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

.pageHead,
.hero,
.grid > .card {
    animation: cardIn 0.46s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.hero {
    animation-delay: 0.05s;
}

.grid > .card:nth-child(1) {
    animation-delay: 0.1s;
}

.grid > .card:nth-child(2) {
    animation-delay: 0.16s;
}

@media (prefers-reduced-motion: reduce) {

    .pageHead,
    .hero,
    .grid > .card {
        animation: none;
    }

    .infoList li,
    .shortcut,
    .shortcut .shortcutIndex,
    .recentItem,
    .editBtn {
        transition: none;
    }
}

@media (max-width: 768px) {
    .profilePage {
        padding: 14px;
    }

    .pageHead {
        flex-wrap: wrap;
    }

    .grid {
        grid-template-columns: 1fr;
    }

    .hero {
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
    }
}
</style>

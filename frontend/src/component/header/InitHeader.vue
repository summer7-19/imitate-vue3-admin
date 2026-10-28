<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useSideBarContent } from '@/store/modules/sidebar'
import { useThemeStore, FONT_SCALES, PRIMARY_PRESETS } from '@/store/modules/theme'
import { useLockStore } from '@/store/modules/lock'
import { useNotifications } from '@/composables/useNotifications'
import { useUserProfile } from '@/composables/useUserProfile'
import { useUserMenu } from '@/composables/useUserMenu'
import {
    ArrowDown,
    ArrowLeft,
    Bell,
    Brush,
    ChatDotRound,
    Check,
    Delete,
    FullScreen,
    Grid,
    Lock,
    Moon,
    Refresh,
    Search,
    Setting,
    Sunny,
    SwitchButton,
    User,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const store = useSideBarContent()
const themeStore = useThemeStore()
const lockStore = useLockStore()
const { items: notices, unread, push: pushNotice, markAll: markNoticesRead, clear: clearNotices } = useNotifications()

const searchPool = [
    { title: '首页', keywords: 'home shopvite 概览', path: '/shop-vite' },
    { title: '看板', keywords: 'panel 数据 图表 kpi', path: '/shop-vite/panel' },
    { title: '创作中心', keywords: 'create center 作品 创作', path: '/shop-vite/create-center' },
    { title: '实时监控', keywords: 'monitor 直播', path: '/shop-vite/monitor' },
    { title: '磁贴', keywords: 'tiles', path: '/shop-vite/tiles' },
    { title: '独立布局', keywords: 'layout 布局', path: '/shop-vite/independent-layout' },
    { title: '数据大屏', keywords: 'data screen 可视化', path: '/shop-vite/data-screen' },
    { title: '工作台', keywords: 'workbench todo 待办', path: '/shop-vite/workbench' },
    { title: '液态玻璃', keywords: 'liquid glass 音乐', path: '/shop-vite/liquid-glass' },
    { title: '客服端', keywords: 'customer service 聊天', path: '/shop-vite/customer-service' },
    { title: '更新日志', keywords: 'update log changelog', path: '/shop-vite/update-log' },
    { title: '模板市场', keywords: 'shop 商品 模板', path: '/shop' },
    { title: '就业广场', keywords: 'job 求职 招聘', path: '/job' },
    { title: '组件示例', keywords: 'button form table 按钮 表单 表格', path: '/components/table' }
]

const currentTitle = computed(() => route.meta.title || route.name || '首页')

const crumbs = computed(() => {
    const chain = route.matched
        .filter((item) => item.meta && item.meta.title)
        .map((item) => ({ title: item.meta.title, path: item.path }))
    if (route.path.startsWith('/shop-vite/') && chain.length) {
        chain.unshift({ title: '首页', path: '/shop-vite' })
    }
    return chain
})

const gridItems = searchPool.filter((item) => item.title && item.path)

const gridOpen = ref(false)
const themeOpen = ref(false)
const noticeOpen = ref(false)

function goGrid(item) {
    gridOpen.value = false
    if (item.path !== route.path) router.push(item.path)
}

function goCrumb(path) {
    if (path !== route.path) router.push(path)
}

function toggleDark() {
    const isDark = themeStore.toggleDark()
    pushNotice(isDark ? '已切换到暗色模式' : '已切换到亮色模式', `主题：${themeStore.primary}`)
}

function choosePrimary(preset) {
    themeStore.setPrimary(preset.value)
    pushNotice('主题色已更新', `${preset.label} ${preset.value}`)
}

function chooseFontScale(scale) {
    themeStore.setFontScale(scale.value)
    pushNotice('界面字号已调整', `${scale.label}（${Math.round(scale.value * 100)}%）`)
}

function toggleLocale() {
    const locale = themeStore.toggleLocale()
    pushNotice(locale === 'zh-cn' ? '界面语言：中文' : 'Interface language: English', 'Element Plus 组件文案已切换')
}

function lockScreen() {
    lockStore.lock()
    pushNotice('屏幕已锁定', '需要输入解锁码才能继续操作')
}

watch(noticeOpen, (open) => {
    if (!open && unread.value) markNoticesRead()
})

const HISTORY_KEY = 'shop-vite:path-history'
const MAX_HISTORY = 8

const history = ref(readHistory())
const trailRef = ref(null)

function readHistory() {
    try {
        const raw = sessionStorage.getItem(HISTORY_KEY)
        const saved = raw ? JSON.parse(raw) : []
        if (!Array.isArray(saved)) return []
        const seen = new Set()
        return saved
            .filter((item) => item && typeof item.path === 'string' && typeof item.title === 'string')
            .filter((item) => {
                if (seen.has(item.path)) return false
                seen.add(item.path)
                return true
            })
            .slice(-MAX_HISTORY)
    } catch {
        return []
    }
}

function persistHistory() {
    try {
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
    } catch {
        // 隐私模式下 sessionStorage 不可用时只保留本次内存记录
    }
}

function scrollTrailToEnd() {
    nextTick(() => {
        const el = trailRef.value
        if (el) el.scrollLeft = el.scrollWidth
    })
}

function recordRoute() {
    if (!route.path.startsWith('/shop-vite')) return

    const path = route.path
    const title = String(currentTitle.value)
    const last = history.value[history.value.length - 1]

    if (last?.path === path) {
        if (last.title !== title) {
            last.title = title
            persistHistory()
        }
        return
    }

    const visitedIndex = history.value.findIndex((item) => item.path === path)
    if (visitedIndex !== -1) {
        history.value = history.value.slice(0, visitedIndex + 1)
    } else {
        history.value = [...history.value, { title, path }].slice(-MAX_HISTORY)
    }
    persistHistory()
    scrollTrailToEnd()
}

watch(() => route.fullPath, recordRoute, { immediate: true })

function goHistory(item) {
    if (item.path !== route.path) router.push(item.path)
}

function clearHistory() {
    history.value = []
    recordRoute()
    pushNotice('浏览路径已清空', String(currentTitle.value))
    ElMessage.success('已清空浏览路径')
}

const keyword = ref('')
const searchOpen = ref(false)
let blurTimer

const searchResults = computed(() => {
    const kw = keyword.value.trim().toLowerCase()
    if (!kw) return []
    return searchPool
        .filter((item) => item.title.toLowerCase().includes(kw) || item.keywords.includes(kw))
        .slice(0, 6)
})

function goResult(item) {
    router.push(item.path)
    keyword.value = ''
    searchOpen.value = false
}

function handleSearch() {
    if (searchResults.value.length) {
        goResult(searchResults.value[0])
        return
    }
    if (keyword.value.trim()) ElMessage.info('未找到匹配的页面')
}

function openSearch() {
    clearTimeout(blurTimer)
    searchOpen.value = true
}

function closeSearch() {
    blurTimer = setTimeout(() => {
        searchOpen.value = false
    }, 150)
}

const isFullscreen = ref(false)
const refreshing = ref(false)

const { isLoggedIn, displayName, avatarText, roleLabel } = useUserProfile()
const { userStore, handleCommand: handleUserCommand } = useUserMenu()

function syncFullscreen() {
    const next = Boolean(document.fullscreenElement)
    const changed = next !== isFullscreen.value
    isFullscreen.value = next
    if (changed) pushNotice(next ? '已进入全屏' : '已退出全屏', String(currentTitle.value))
}

async function toggleFullscreen() {
    try {
        if (document.fullscreenElement) {
            await document.exitFullscreen()
        } else {
            await document.documentElement.requestFullscreen()
        }
    } catch {
        ElMessage.warning('当前浏览器不支持全屏')
    }
}

function refreshPage() {
    refreshing.value = true
    pushNotice('页面已刷新', String(currentTitle.value))
    window.location.reload()
}

function openAssistant() {
    if (route.path === '/shop-vite/customer-service') {
        ElMessage.info('已在客服端，可直接在输入框提问')
        return
    }
    router.push('/shop-vite/customer-service')
}

onMounted(() => {
    document.addEventListener('fullscreenchange', syncFullscreen)
    syncFullscreen()
    if (userStore.accessToken && !userStore.username) {
        userStore.getUserInfo().catch(() => {})
    }
})

onBeforeUnmount(() => {
    clearTimeout(blurTimer)
    document.removeEventListener('fullscreenchange', syncFullscreen)
})
</script>

<template>
    <div class="headerMain">
        <div class="header">
            <div class="left">
                <button class="backButton" type="button" title="展开/收起侧栏" @click="store.setState()">
                    <el-icon><ArrowLeft /></el-icon>
                </button>
                <el-popover v-model:visible="gridOpen" trigger="click" placement="bottom-start" :width="292"
                    popper-class="header-popper">
                    <template #reference>
                        <button class="iconBtn" type="button" title="应用宫格 · 快速导航">
                            <el-icon><Grid /></el-icon>
                        </button>
                    </template>
                    <div class="appGrid">
                        <button v-for="item in gridItems" :key="item.path" type="button" class="gridItem"
                            :class="{ active: item.path === route.path }" @click="goGrid(item)">
                            <span class="gridTitle">{{ item.title }}</span>
                            <span class="gridPath">{{ item.path }}</span>
                        </button>
                    </div>
                </el-popover>
                <el-breadcrumb v-if="crumbs.length > 1" class="crumbs" separator="/">
                    <el-breadcrumb-item v-for="(item, index) in crumbs" :key="`${item.path}-${index}`">
                        <button v-if="index < crumbs.length - 1" type="button" class="crumbLink"
                            :title="`前往 ${item.path}`" @click="goCrumb(item.path)">
                            {{ item.title }}
                        </button>
                        <span v-else class="crumbCurrent">{{ item.title }}</span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <span v-else class="pageTitle">{{ currentTitle }}</span>
            </div>
            <div class="right">
                <div class="search">
                    <el-icon class="searchIcon"><Search /></el-icon>
                    <input
                        v-model="keyword"
                        type="text"
                        placeholder="搜索页面 / 功能"
                        @focus="openSearch"
                        @blur="closeSearch"
                        @keyup.enter="handleSearch"
                    >
                    <ul v-if="searchOpen && keyword.trim()" class="searchResult">
                        <li v-for="item in searchResults" :key="item.path" @mousedown.prevent="goResult(item)">
                            <span>{{ item.title }}</span>
                            <i>{{ item.path }}</i>
                        </li>
                        <li v-if="!searchResults.length" class="empty">未找到相关页面</li>
                    </ul>
                </div>
                <button class="iconBtn" type="button" :title="themeStore.isDark ? '切换到亮色模式' : '切换到暗色模式'"
                    @click="toggleDark">
                    <el-icon>
                        <component :is="themeStore.isDark ? Moon : Sunny" />
                    </el-icon>
                </button>
                <el-popover v-model:visible="themeOpen" trigger="click" placement="bottom-end" :width="268"
                    popper-class="header-popper">
                    <template #reference>
                        <button class="iconBtn" type="button" title="主题色 / 界面字号">
                            <el-icon><Brush /></el-icon>
                        </button>
                    </template>
                    <div class="themePanel">
                        <div class="themeRow">
                            <span class="rowLabel">主题色</span>
                            <div class="swatches">
                                <button v-for="preset in PRIMARY_PRESETS" :key="preset.value" type="button"
                                    class="swatch" :class="{ picked: themeStore.primary === preset.value }"
                                    :style="{ backgroundColor: preset.value }" :title="`${preset.label} ${preset.value}`"
                                    @click="choosePrimary(preset)">
                                    <el-icon v-if="themeStore.primary === preset.value"><Check /></el-icon>
                                </button>
                            </div>
                        </div>
                        <div class="themeRow">
                            <span class="rowLabel">界面字号</span>
                            <el-radio-group :model-value="themeStore.fontScale" size="small"
                                @change="chooseFontScale">
                                <el-radio-button v-for="scale in FONT_SCALES" :key="scale.value" :value="scale.value">
                                    {{ scale.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </div>
                        <p class="themeHint">主题色、暗色与字号都会写入本地缓存，刷新后依旧生效。</p>
                    </div>
                </el-popover>
                <button class="iconBtn" type="button" title="锁屏" @click="lockScreen">
                    <el-icon><Lock /></el-icon>
                </button>
                <el-popover v-model:visible="noticeOpen" trigger="click" placement="bottom-end" :width="300"
                    popper-class="header-popper">
                    <template #reference>
                        <button class="iconBtn noticeBtn" type="button" title="通知中心">
                            <el-badge :value="unread" :hidden="!unread" :max="9" class="noticeBadge">
                                <el-icon><Bell /></el-icon>
                            </el-badge>
                        </button>
                    </template>
                    <div class="noticePanel">
                        <div class="noticeHead">
                            <strong>通知中心</strong>
                            <span class="noticeCount">未读 {{ unread }}</span>
                            <div class="noticeOps">
                                <button type="button" class="noticeOp" :disabled="!unread" title="全部标记已读"
                                    @click="markNoticesRead">
                                    <el-icon><Check /></el-icon>
                                </button>
                                <button type="button" class="noticeOp" :disabled="!notices.length" title="清空通知"
                                    @click="clearNotices">
                                    <el-icon><Delete /></el-icon>
                                </button>
                            </div>
                        </div>
                        <ul class="noticeList">
                            <li v-for="item in notices" :key="item.id" :class="{ unread: !item.read }">
                                <div class="noticeBody">
                                    <strong>{{ item.title }}</strong>
                                    <p v-if="item.detail">{{ item.detail }}</p>
                                    <time>{{ item.time }}</time>
                                </div>
                            </li>
                            <li v-if="!notices.length" class="noticeEmpty">本次会话还没有新的通知</li>
                        </ul>
                    </div>
                </el-popover>
                <button class="iconBtn langBtn" type="button" :title="themeStore.isChinese ? '切换为英文' : 'Switch to Chinese'"
                    @click="toggleLocale">
                    {{ themeStore.isChinese ? '中' : 'EN' }}
                </button>
                <button class="iconBtn" type="button" :class="{ spinning: refreshing }" title="刷新当前页"
                    @click="refreshPage">
                    <el-icon><Refresh /></el-icon>
                </button>
                <button
                    class="iconBtn"
                    type="button"
                    :title="isFullscreen ? '退出全屏' : '进入全屏'"
                    @click="toggleFullscreen"
                >
                    <el-icon><FullScreen /></el-icon>
                </button>
                <button class="iconBtn" type="button" title="AI 助手 · 联系客服" @click="openAssistant">
                    <el-icon><ChatDotRound /></el-icon>
                </button>
                <el-dropdown class="userDropdown" trigger="click" popper-class="user-dropdown-popper"
                    @command="handleUserCommand">
                    <button class="userInfo" type="button" title="账号菜单">
                        <span class="avatar">
                            <img v-if="userStore.avatar" :src="userStore.avatar" :alt="displayName">
                            <template v-else>{{ avatarText }}</template>
                        </span>
                        <span class="meta">
                            <strong>{{ displayName }}</strong>
                            <span>{{ roleLabel }}</span>
                        </span>
                        <el-icon class="userArrow"><ArrowDown /></el-icon>
                    </button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-if="isLoggedIn" command="profile">
                                <el-icon><User /></el-icon>
                                个人信息
                                <span class="dropdownHint">/profile</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="settings">
                                <el-icon><Setting /></el-icon>
                                系统设置
                                <span class="dropdownHint">/settings</span>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="!isLoggedIn" command="login">
                                <el-icon><SwitchButton /></el-icon>
                                登录账号
                                <span class="dropdownHint">/login</span>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="isLoggedIn" command="logout" divided class="dangerItem">
                                <el-icon><SwitchButton /></el-icon>
                                退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>

        <nav ref="trailRef" class="sideBarShow" aria-label="浏览路径">
            <span class="trailLabel">浏览路径</span>
            <template v-for="(item, index) in history" :key="item.path">
                <span v-if="index" class="trailSep" aria-hidden="true">/</span>
                <button
                    type="button"
                    class="option"
                    :class="{ active: item.path === route.path }"
                    :title="`${item.path}（点击回到这里）`"
                    @click="goHistory(item)"
                >
                    {{ item.title }}
                </button>
            </template>
            <span v-if="!history.length" class="trailEmpty">暂无记录</span>
            <button
                v-if="history.length"
                type="button"
                class="trailClear"
                title="清空浏览路径"
                @click="clearHistory"
            >
                <el-icon><Delete /></el-icon>
            </button>
        </nav>
    </div>
</template>

<style scoped>
.headerMain {
    width: 100%;
    height: 12%;
    min-height: 104px;
    border: 1px solid var(--app-border);
    background-color: var(--app-surface-raised);
    display: flex;
    flex-direction: column;
}

.header {
    width: 100%;
    height: 58%;
    min-height: 56px;
    border: 1px solid var(--app-border);
    display: flex;
    flex-direction: row;
    align-items: center;
}

.header .left {
    flex: 1;
    min-width: 0;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.backButton {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--app-text-body);
    font-size: 14px;
    border: none;
    border-radius: 50%;
    background: radial-gradient(circle at 32% 26%, var(--app-surface-hi) 0%, var(--app-surface-raised) 46%, var(--app-border-strong) 100%);
    box-shadow:
        0 2px 4px rgba(15, 23, 42, 0.16),
        0 6px 12px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.95),
        inset 0 -1px 2px rgba(15, 23, 42, 0.06);
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, color 0.18s ease;
}

.backButton .el-icon {
    transition: transform 0.18s ease;
}

.backButton:hover {
    color: var(--app-primary);
    transform: translateY(-1px);
    box-shadow:
        0 4px 8px rgba(78, 136, 243, 0.22),
        0 10px 18px rgba(15, 23, 42, 0.14),
        inset 0 1px 0 #fff;
}

.backButton:hover .el-icon {
    transform: translateX(-2px);
}

.backButton:active {
    transform: translateY(1px);
    box-shadow:
        0 1px 2px rgba(15, 23, 42, 0.2),
        inset 0 2px 4px rgba(15, 23, 42, 0.14);
}

.pageTitle {
    min-width: 0;
    overflow: hidden;
    color: var(--app-text);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.sideBarShow::-webkit-scrollbar {
    display: none;
}

.sideBarShow {
    scrollbar-width: none;
}

.trailLabel {
    flex-shrink: 0;
    margin-right: 2px;
    color: var(--app-text-soft);
    font-size: 10px;
    white-space: nowrap;
}

.trailSep {
    flex-shrink: 0;
    color: #c0c6d1;
    font-size: 10px;
}

.trailEmpty {
    flex-shrink: 0;
    color: var(--app-text-ghost);
    font-size: 10px;
}

.trailClear {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    margin-left: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--app-text-muted);
    font-size: 10px;
    border: none;
    border-radius: 6px;
    background-color: transparent;
    cursor: pointer;
    transition: color 0.18s ease, background-color 0.18s ease;
}

.trailClear:hover {
    color: #e34d59;
    background-color: rgba(227, 77, 89, 0.1);
}

.header .right {
    flex-shrink: 0;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
}

.header .right .search {
    position: relative;
    width: clamp(150px, 17vw, 220px);
    height: 34px;
    padding: 0 10px;
    box-sizing: border-box;
    color: var(--app-text-subtle);
    font-size: 12px;
    border: none;
    border-radius: 8px;
    background-color: transparent;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
    display: flex;
    align-items: center;
    gap: 6px;
    transition: box-shadow 0.2s ease;
}

.header .right .search:focus-within {
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.14);
}

.header .right .search .searchIcon {
    flex-shrink: 0;
    color: var(--app-text-soft);
    font-size: 13px;
}

.header .right .search input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    color: var(--app-text-body);
    font-size: 11px;
    border: none;
    outline: none;
    background-color: transparent;
}

.header .right .search input::placeholder {
    color: var(--app-text-muted);
}

.header .right .search .searchResult {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 40;
    width: 100%;
    max-height: 260px;
    margin: 0;
    padding: 4px 0;
    overflow-y: auto;
    list-style: none;
    color: var(--app-text-base);
    border-radius: 8px;
    background-color: var(--app-surface);
    box-shadow: 0 10px 25px rgba(21, 16, 16, 0.16);
}

.header .right .search .searchResult li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 12px;
    font-size: 11px;
    cursor: pointer;
}

.header .right .search .searchResult li:hover {
    color: var(--app-primary);
    background-color: var(--app-primary-softer);
}

.header .right .search .searchResult li i {
    overflow: hidden;
    color: var(--app-text-muted);
    font-size: 9px;
    font-style: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.header .right .search .searchResult li.empty {
    justify-content: center;
    color: var(--app-text-muted);
    cursor: default;
}

.header .right .iconBtn {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--app-text-body);
    font-size: 20px;
    border: none;
    border-radius: 8px;
    background: none;
    box-shadow: none;
    cursor: pointer;
    transition: transform 0.18s ease, color 0.18s ease;
}

.header .right .iconBtn:hover {
    color: var(--app-primary);
    transform: translateY(-1px);
}

.header .right .iconBtn:active {
    transform: translateY(0);
}

/* element-plus 的 reset 里有 button:focus-visible{outline:2px solid 主色}，点击后会留下描边 */
.header .right .iconBtn:focus,
.header .right .iconBtn:focus-visible {
    outline: none;
    border: none;
    box-shadow: none;
}

.header .right .iconBtn.spinning .el-icon {
    animation: btn-spin 0.8s linear infinite;
}

@keyframes btn-spin {
    to {
        transform: rotate(360deg);
    }
}

.header .right .userDropdown {
    display: inline-flex;
}

.header .right .userInfo {
    height: 34px;
    padding: 0 10px 0 4px;
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--app-text-base);
    font-size: 12px;
    white-space: nowrap;
    border: none;
    border-radius: 10px;
    background: linear-gradient(180deg, var(--app-surface), var(--app-surface-plain));
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.header .right .userInfo:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.14);
}

.header .right .userInfo:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.16);
}

.header .right .userInfo:focus,
.header .right .userInfo:focus-visible {
    outline: none;
    border: none;
}

.header .right .userInfo .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    overflow: hidden;
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    border-radius: 50%;
    background: linear-gradient(135deg, #6fa4ff, #4e88f3);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.header .right .userInfo .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.header .right .userInfo .meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
}

.header .right .userInfo .meta strong {
    max-width: 90px;
    overflow: hidden;
    font-size: 10px;
    font-weight: 600;
    text-overflow: ellipsis;
}

.header .right .userInfo .meta span {
    color: var(--app-text-muted);
    font-size: 8px;
}

.header .right .userInfo .userArrow {
    margin-left: 2px;
    color: var(--app-text-muted);
    font-size: 10px;
}

.sideBarShow {
    width: 100%;
    height: 40%;
    min-height: 46px;
    padding: 0 16px;
    border: 1px solid var(--app-border);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    overflow-x: auto;
}

.option {
    flex: 0 0 auto;
    min-width: 70px;
    height: 30px;
    padding: 0 16px;
    color: var(--app-primary);
    font-size: 12px;
    border: none;
    border-radius: 8px;
    background-color: transparent;
    box-shadow:
        0 1px 2px rgba(15, 23, 42, 0.1),
        0 4px 8px rgba(15, 23, 42, 0.07),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, color 0.18s ease;
}

.option:hover {
    color: var(--app-primary-strong);
    transform: translateY(-1px);
    box-shadow:
        0 2px 4px rgba(15, 23, 42, 0.12),
        0 8px 16px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.option.active {
    color: var(--app-primary-strong);
    font-weight: 600;
    box-shadow:
        inset 0 2px 5px rgba(15, 23, 42, 0.16);
    transform: none;
}

.header .left .crumbs {
    min-width: 0;
    font-size: 12px;
}

.header .left .crumbs :deep(.el-breadcrumb__separator) {
    margin: 0 6px;
    color: var(--app-text-ghost);
    font-size: 11px;
}

.crumbLink {
    padding: 2px 4px;
    color: var(--app-text-secondary);
    font-size: 12px;
    border: none;
    border-radius: 5px;
    background-color: transparent;
    cursor: pointer;
    transition: color 0.16s ease, background-color 0.16s ease;
}

.crumbLink:hover {
    color: var(--app-primary);
    background-color: var(--app-primary-softer);
}

.crumbCurrent {
    padding: 2px 4px;
    color: var(--app-text);
    font-size: 12px;
    font-weight: 600;
}

.langBtn {
    width: 34px;
    font-size: 14px;
    font-weight: 600;
}

.noticeBtn :deep(.el-badge__content.is-fixed) {
    top: 8px;
    right: 7px;
    min-width: 14px;
    height: 14px;
    padding: 0 3px;
    line-height: 14px;
    font-size: 9px;
}

.appGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.gridItem {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    padding: 8px;
    overflow: hidden;
    color: var(--app-text);
    border: 1px solid var(--app-border-quiet);
    border-radius: 8px;
    background-color: var(--app-surface);
    cursor: pointer;
    transition: transform 0.16s ease, border-color 0.16s ease, background-color 0.16s ease;
}

.gridItem:hover {
    border-color: var(--app-primary);
    background-color: var(--app-primary-softer);
    transform: translateY(-1px);
}

.gridItem.active {
    border-color: var(--app-primary);
    background-color: var(--app-primary-soft);
}

.gridTitle {
    max-width: 100%;
    overflow: hidden;
    font-size: 12px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.gridPath {
    max-width: 100%;
    overflow: hidden;
    color: var(--app-text-muted);
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.themePanel {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.themeRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.rowLabel {
    color: var(--app-text-secondary);
    font-size: 12px;
}

.swatches {
    display: flex;
    gap: 8px;
}

.swatch {
    width: 22px;
    height: 22px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 11px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.swatch:hover {
    transform: scale(1.12);
}

.swatch.picked {
    box-shadow:
        0 0 0 2px var(--app-surface),
        0 0 0 4px var(--app-primary);
}

.themeHint {
    margin: 0;
    padding-top: 8px;
    color: var(--app-text-muted);
    font-size: 11px;
    border-top: 1px solid var(--app-border-quiet);
}

.noticePanel {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.noticeHead {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--app-border-quiet);
}

.noticeHead strong {
    color: var(--app-text);
    font-size: 13px;
}

.noticeCount {
    color: var(--app-text-muted);
    font-size: 11px;
}

.noticeOps {
    margin-left: auto;
    display: flex;
    gap: 4px;
}

.noticeOp {
    width: 24px;
    height: 24px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--app-text-secondary);
    font-size: 12px;
    border: none;
    border-radius: 6px;
    background-color: transparent;
    cursor: pointer;
    transition: color 0.16s ease, background-color 0.16s ease;
}

.noticeOp:hover:not(:disabled) {
    color: var(--app-primary);
    background-color: var(--app-primary-softer);
}

.noticeOp:disabled {
    color: var(--app-text-ghost);
    cursor: not-allowed;
}

.noticeList {
    margin: 0;
    padding: 0;
    list-style: none;
    max-height: 250px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.noticeList li {
    padding: 8px;
    border-radius: 8px;
}

.noticeList li.unread {
    background-color: var(--app-primary-softer);
}

.noticeBody {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.noticeBody strong {
    color: var(--app-text);
    font-size: 12px;
    font-weight: 600;
}

.noticeBody p {
    margin: 0;
    color: var(--app-text-secondary);
    font-size: 11px;
}

.noticeBody time {
    color: var(--app-text-muted);
    font-size: 10px;
}

.noticeEmpty {
    padding: 12px 0;
    color: var(--app-text-muted);
    font-size: 11px;
    text-align: center;
}

@media (max-width: 992px) {
    .headerMain {
        height: auto;
        min-height: 0;
    }

    .header {
        height: auto;
        min-height: 56px;
        flex-wrap: wrap;
        padding: 6px 0;
    }

    .header .left {
        width: 100%;
    }

    .header .right {
        width: 100%;
        padding: 6px 10px 0;
    }

    .sideBarShow {
        height: auto;
        flex-wrap: wrap;
        padding: 6px 10px;
    }
}

@media (max-width: 768px) {
    .header .right .search {
        width: min(210px, 52vw);
    }

    .trailLabel {
        display: none;
    }
}

@media (max-width: 576px) {
    .header .right .search {
        flex: 1;
        width: auto;
        max-width: 200px;
    }

    .header .right .userInfo .meta {
        display: none;
    }
}
</style>

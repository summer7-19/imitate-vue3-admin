<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useSidebarStore, useSideBarContent } from '@/store/modules/sidebar'
import { useSettingsStore } from '@/store/modules/settings'
import pkg from '../../../package.json'

const deps = pkg.dependencies || {}
const devDeps = pkg.devDependencies || {}

const techStack = [
    { name: 'Vue', version: deps.vue, role: '渐进式框架，全部页面使用组合式 API' },
    { name: 'Vite', version: devDeps.vite, role: '开发服务器与生产构建' },
    { name: 'Vue Router', version: deps['vue-router'], role: '双版面路由与登录守卫' },
    { name: 'Pinia', version: deps.pinia, role: '用户、侧栏、设置状态' },
    { name: 'Element Plus', version: deps['element-plus'], role: '表单、弹层与提示组件' },
    { name: 'D3', version: deps.d3, role: '看板折线与柱状图' },
    { name: 'Axios', version: deps.axios, role: '接口请求与统一拦截' },
    { name: 'Express + Mock.js', version: '4.21 / 1.1', role: 'backend 目录的本地接口服务' },
].filter((item) => item.version)

const router = useRouter()
const sidebarStore = useSidebarStore()
const sideSeeStore = useSideBarContent()
const settingsStore = useSettingsStore()

const HISTORY_KEY = 'shop-vite:path-history'

const defaultSidebar = computed({
    get: () => sidebarStore.openSidebar,
    set: (value) => {
        if (value !== sidebarStore.openSidebar) sidebarStore.toggleSidebar()
    },
})

const shopViteSidebar = computed({
    get: () => sideSeeStore.isOpen,
    set: (value) => {
        if (value !== sideSeeStore.isOpen) sideSeeStore.setState()
    },
})

const layoutSidebarCollapsed = computed({
    get: () => settingsStore.sidebarCollapsed,
    set: (value) => {
        if (value !== settingsStore.sidebarCollapsed) settingsStore.toggleSidebar()
    },
})

const isFullscreen = ref(Boolean(document.fullscreenElement))

function syncFullscreen() {
    isFullscreen.value = Boolean(document.fullscreenElement)
}

async function toggleFullscreen() {
    try {
        if (document.fullscreenElement) await document.exitFullscreen()
        else await document.documentElement.requestFullscreen()
    } catch {
        ElMessage.warning('当前浏览器不支持全屏')
    }
}

function refreshPage() {
    window.location.reload()
}

function clearTrailHistory() {
    try {
        sessionStorage.removeItem(HISTORY_KEY)
        ElMessage.success('已清空 Shop Vite 浏览路径')
    } catch {
        ElMessage.warning('隐私模式下无法访问 sessionStorage')
    }
}

function back() {
    if (window.history.state?.back) router.back()
    else router.push('/')
}

onMounted(() => document.addEventListener('fullscreenchange', syncFullscreen))
onBeforeUnmount(() => document.removeEventListener('fullscreenchange', syncFullscreen))
</script>

<template>
    <div class="settingsPage">
        <div class="pageHead">
            <button type="button" class="backBtn" @click="back">返回</button>
            <div class="titles">
                <h2>系统设置</h2>
                <p>这里的每一项都会直接写入对应状态，刷新或切换页面后立即生效。</p>
            </div>
        </div>

        <div class="grid">
            <section class="card">
                <p class="cardEyebrow">01 · Preferences</p>
                <h3 class="cardTitle">布局与视图</h3>
                <h4 class="rowGroup">布局偏好</h4>
                <div class="row">
                    <div class="rowText">
                        <strong>默认页侧边栏展开</strong>
                        <span>控制面板（/）左侧栏是否摊开显示。</span>
                    </div>
                    <el-switch v-model="defaultSidebar" />
                </div>
                <div class="row">
                    <div class="rowText">
                        <strong>Shop Vite 侧边抽屉展开</strong>
                        <span>控制 /shop-vite 左侧导航抽屉的展开状态。</span>
                    </div>
                    <el-switch v-model="shopViteSidebar" />
                </div>
                <div class="row">
                    <div class="rowText">
                        <strong>框架侧栏收起</strong>
                        <span>Layout 版式页面（如 /index、/vab）的菜单栏宽度。</span>
                    </div>
                    <el-switch v-model="layoutSidebarCollapsed" active-text="收起" inactive-text="展开" inline-prompt />
                </div>

                <h4 class="rowGroup">视图与数据</h4>
                <div class="row">
                    <div class="rowText">
                        <strong>全屏显示</strong>
                        <span>当前状态：{{ isFullscreen ? '已进入全屏' : '窗口模式' }}。</span>
                    </div>
                    <el-button plain @click="toggleFullscreen">
                        <el-icon><FullScreen /></el-icon>
                        <span>{{ isFullscreen ? '退出全屏' : '进入全屏' }}</span>
                    </el-button>
                </div>
                <div class="row">
                    <div class="rowText">
                        <strong>刷新当前页</strong>
                        <span>重新加载页面与图表初始状态。</span>
                    </div>
                    <el-button plain @click="refreshPage">
                        <el-icon><Refresh /></el-icon><span>立即刷新</span>
                    </el-button>
                </div>
                <div class="row">
                    <div class="rowText">
                        <strong>清空 Shop Vite 浏览路径</strong>
                        <span>删除 sessionStorage 中的 shop-vite:path-history 记录。</span>
                    </div>
                    <el-button type="danger" plain @click="clearTrailHistory">
                        <el-icon><Delete /></el-icon><span>清空</span>
                    </el-button>
                </div>
            </section>

            <section class="card">
                <p class="cardEyebrow">02 · Stack</p>
                <h3 class="cardTitle">技术栈说明</h3>
                <p class="stackIntro">
                    前端由 Vite 独立构建（127.0.0.1:8091），经 /api 代理访问 Express Mock 服务（127.0.0.1:8090），
                    版本取自 package.json。
                </p>
                <ul class="stackList">
                    <li v-for="item in techStack" :key="item.name">
                        <span class="stackName">{{ item.name }}</span>
                        <span class="stackVersion">{{ item.version }}</span>
                        <span class="stackRole">{{ item.role }}</span>
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>

<style scoped>
.settingsPage {
    height: 100%;
    box-sizing: border-box;
    padding: 26px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    background-color: var(--app-surface);
    border-radius: 10px;
    scrollbar-width: thin;
    scrollbar-color: var(--app-text-ghost) transparent;
}

.settingsPage::-webkit-scrollbar {
    width: 8px;
}

.settingsPage::-webkit-scrollbar-track {
    background-color: transparent;
}

.settingsPage::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 8px;
    background-color: var(--app-text-ghost);
    background-clip: content-box;
}

.settingsPage::-webkit-scrollbar-thumb:hover {
    background-color: var(--app-text-soft);
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
    color: var(--app-primary);
    font-size: 12px;
    border: 1px solid rgba(78, 136, 243, 0.35);
    border-radius: 8px;
    background-color: rgba(78, 136, 243, 0.08);
    cursor: pointer;
    transition: background-color 0.18s ease, transform 0.18s ease;
}

.backBtn:hover {
    background-color: rgba(78, 136, 243, 0.16);
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

.grid {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 6fr);
    align-items: start;
    gap: 28px;
}

.card {
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 1px solid var(--app-border-quiet);
    border-radius: 14px;
    background-color: var(--app-surface);
    box-shadow: 0 1px 2px rgba(47, 58, 74, 0.05), 0 10px 24px -12px rgba(47, 58, 74, 0.26);
    transition: box-shadow 0.24s ease, transform 0.24s ease;
}

.card:hover {
    box-shadow: 0 2px 6px rgba(47, 58, 74, 0.06), 0 18px 32px -16px rgba(47, 58, 74, 0.32);
    transform: translateY(-2px);
}

.cardEyebrow {
    margin: 0 0 -8px;
    color: var(--app-text-ghost);
    font-size: 10px;
    font-family: Consolas, Monaco, monospace;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}

.cardTitle {
    margin: 0;
    padding-bottom: 10px;
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

.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 12px 14px;
    border: 1px solid var(--app-border-cool);
    border-radius: 10px;
    background-color: var(--app-surface);
    transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}

.row:hover {
    border-color: var(--app-border-strong);
    background-color: var(--app-primary-softer);
    box-shadow: inset 2px 0 0 color-mix(in srgb, var(--app-primary) 42%, transparent);
}

.rowText {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.rowText strong {
    color: var(--app-text);
    font-size: 13px;
    font-weight: 600;
}

.rowText span {
    color: var(--app-text-soft);
    font-size: 11px;
    line-height: 1.5;
}

.rowGroup {
    margin: 2px 0 -8px;
    color: var(--app-text-secondary);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
}

.stackIntro {
    margin: 0;
    color: var(--app-text-soft);
    font-size: 12px;
    line-height: 1.7;
}

.stackList {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 18px 20px;
}

.stackList li {
    padding: 12px 14px;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 8px;
    border: 1px solid var(--app-border-cool);
    border-radius: 10px;
    background-color: var(--app-surface);
    transition: border-color 0.18s ease, background-color 0.18s ease;
}

.stackList li:hover {
    border-color: var(--app-border-strong);
    background-color: var(--app-primary-softer);
}

.stackName {
    color: var(--app-text-deeper);
    font-size: 13px;
    font-weight: 600;
}

.stackVersion {
    padding: 0 7px;
    color: var(--app-primary-strong);
    font-size: 11px;
    line-height: 17px;
    font-family: Consolas, Monaco, monospace;
    font-variant-numeric: tabular-nums;
    border-radius: 5px;
    background-color: var(--app-primary-softer);
}

.stackRole {
    flex-basis: 100%;
    color: var(--app-text-soft);
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
.grid > .card {
    animation: cardIn 0.46s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.grid > .card:nth-child(1) {
    animation-delay: 0.04s;
}

.grid > .card:nth-child(2) {
    animation-delay: 0.1s;
}

@media (prefers-reduced-motion: reduce) {

    .pageHead,
    .grid > .card {
        animation: none;
    }

    .card,
    .row,
    .stackList li {
        transition: none;
    }
}

@media (max-width: 1200px) {
    .grid {
        gap: 22px;
    }
}

@media (max-width: 900px) {
    .grid {
        grid-template-columns: minmax(0, 1fr);
    }
}

@media (max-width: 768px) {
    .settingsPage {
        padding: 14px;
        gap: 14px;
    }

    .card {
        padding: 16px;
    }

    .row {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>

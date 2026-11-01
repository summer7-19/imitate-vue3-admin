<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ChatLineSquare,
  Delete,
  FullScreen,
  Goods,
  Lock,
  Refresh,
  Tickets,
  TrendCharts,
  UserFilled,
} from '@element-plus/icons-vue'
import { useSidebarStore, useSideBarContent } from '@/store/modules/sidebar'
import { useSettingsStore } from '@/store/modules/settings'
import { useUserStore } from '@/store/modules/user'
import Footer from '@/component/shopviteChoices/footer/footer.vue'
import pkg from '../../../package.json'

const deps = pkg.dependencies || {}
const devDeps = pkg.devDependencies || {}

const techStack = [
  { name: 'Vue', version: deps.vue, role: '渐进式框架，全部页面使用组合式 API' },
  { name: 'Vite', version: devDeps.vite, role: '开发服务器与生产构建' },
  { name: 'Vue Router', version: deps['vue-router'], role: '双版面路由与登录守卫' },
  { name: 'Pinia', version: deps.pinia, role: '用户、侧栏、设置与后台数据状态' },
  { name: 'Element Plus', version: deps['element-plus'], role: '表格、表单、弹层与提示组件' },
  { name: 'D3', version: deps.d3, role: '看板折线与柱状图' },
  { name: 'Axios', version: deps.axios, role: '接口请求与统一拦截' },
  { name: 'Express + Mock.js', version: '4.21 / 1.1', role: 'backend 目录的本地接口服务' },
].filter((item) => item.version)

const router = useRouter()
const sidebarStore = useSidebarStore()
const sideSeeStore = useSideBarContent()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

const isAdmin = computed(() => userStore.permissions.includes('admin'))

const quickLinks = [
  { title: '用户管理', desc: '维护账号、角色与批量删除', name: 'AdminUsers', icon: UserFilled },
  { title: '权限管理', desc: '按角色配置模块权限', name: 'AdminPermissions', icon: Lock },
  { title: '商品管理', desc: '商品上下架与库存维护', name: 'AdminGoods', icon: Goods },
  { title: '商品统计', desc: '销量与销售额汇总（未开放）', name: 'AdminGoodsStats', icon: TrendCharts },
  { title: '商品评论', desc: '审核、隐藏与删除评论', name: 'AdminGoodsComments', icon: ChatLineSquare },
  { title: '工单管理', desc: '处理售后、物流与投诉工单', name: 'AdminWorkOrders', icon: Tickets },
]

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

function openModule(name) {
  if (name !== router.currentRoute.value.name) router.push({ name })
}

onMounted(() => document.addEventListener('fullscreenchange', syncFullscreen))
onBeforeUnmount(() => document.removeEventListener('fullscreenchange', syncFullscreen))
</script>

<template>
  <div class="settingsPage">
    <div class="settingsGrid">
      <section class="settingsCard">
        <div class="cardHead">
          <p class="cardEyebrow">01 · Preferences</p>
          <h3 class="cardTitle">布局与视图</h3>
        </div>

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

      <section class="settingsCard">
        <div class="cardHead">
          <p class="cardEyebrow">02 · Stack</p>
          <h3 class="cardTitle">技术栈说明</h3>
        </div>
        <p class="stackIntro">
          前端由 Vite 开发服务器提供（127.0.0.1:5173），/api 请求代理到 backend 目录的 Express Mock
          服务（默认端口 5173，可通过 PORT 环境变量覆盖）。版本取自 package.json。
        </p>
        <ul class="stackList">
          <li v-for="item in techStack" :key="item.name">
            <span class="stackName">{{ item.name }}</span>
            <span class="stackVersion">{{ item.version }}</span>
            <span class="stackRole">{{ item.role }}</span>
          </li>
        </ul>
      </section>

      <section v-if="isAdmin" class="settingsCard modulesCard">
        <div class="cardHead">
          <p class="cardEyebrow">03 · Modules</p>
          <h3 class="cardTitle">后台模块</h3>
        </div>
        <div class="moduleGrid">
          <button
            v-for="item in quickLinks"
            :key="item.name"
            type="button"
            class="moduleLink"
            @click="openModule(item.name)"
          >
            <span class="moduleIcon"><el-icon><component :is="item.icon" /></el-icon></span>
            <span class="moduleBody">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </span>
          </button>
        </div>
      </section>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.settingsPage {
  flex: 1;
  min-height: 0;
  padding: 18px clamp(12px, 2vw, 24px);
  box-sizing: border-box;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--app-text-ghost) transparent;
}

.settingsGrid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: 18px;
}

.settingsCard {
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid var(--app-border-quiet);
  border-radius: 14px;
  background-color: var(--app-surface);
  box-shadow:
    0 1px 2px rgba(47, 58, 74, 0.04),
    0 12px 26px -20px rgba(47, 58, 74, 0.45);
}

.cardHead {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cardEyebrow {
  margin: 0;
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
  background-color: #94a3b8;
}

.rowGroup {
  margin: 2px 0 -4px;
  color: var(--app-text-secondary);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
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
  background-color: var(--app-surface-mute);
  box-shadow: inset 2px 0 0 #94a3b8;
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
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px 14px;
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
  background-color: var(--app-surface-mute);
}

.stackName {
  color: var(--app-text-deeper);
  font-size: 13px;
  font-weight: 600;
}

.stackVersion {
  padding: 0 7px;
  color: var(--app-text-secondary);
  font-size: 11px;
  line-height: 17px;
  font-family: Consolas, Monaco, monospace;
  font-variant-numeric: tabular-nums;
  border-radius: 5px;
  background-color: var(--app-surface-mute);
}

.stackRole {
  flex-basis: 100%;
  color: var(--app-text-soft);
  font-size: 11px;
  line-height: 1.6;
}

.modulesCard {
  grid-column: 1 / -1;
}

.moduleGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.moduleLink {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 15px;
  text-align: left;
  border: 1px solid var(--app-border-cool);
  border-radius: 10px;
  background-color: var(--app-surface);
  cursor: pointer;
  transition: border-color 0.18s ease, background-color 0.18s ease, transform 0.18s ease;
}

.moduleLink:hover {
  border-color: var(--app-border-strong);
  background-color: var(--app-surface-mute);
  transform: translateY(-1px);
}

.moduleLink:focus-visible {
  outline: 2px solid #94a3b8;
  outline-offset: 2px;
}

.moduleIcon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  color: var(--app-text-secondary);
  font-size: 15px;
  border-radius: 9px;
  background-color: var(--app-surface-mute);
}

.settingsPage :deep(.el-switch) {
  --el-switch-on-color: #94a3b8;
}

.moduleBody {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.moduleBody strong {
  color: var(--app-text);
  font-size: 13px;
  font-weight: 600;
}

.moduleBody span {
  color: var(--app-text-soft);
  font-size: 11px;
  line-height: 1.5;
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

.settingsCard {
  animation: cardIn 0.46s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.settingsCard:nth-child(1) {
  animation-delay: 0.04s;
}

.settingsCard:nth-child(2) {
  animation-delay: 0.1s;
}

.settingsCard:nth-child(3) {
  animation-delay: 0.16s;
}

@media (prefers-reduced-motion: reduce) {
  .settingsCard {
    animation: none;
  }

  .row,
  .stackList li,
  .moduleLink {
    transition: none;
  }
}

@media (max-width: 900px) {
  .settingsGrid {
    grid-template-columns: minmax(0, 1fr);
  }

  .modulesCard {
    grid-column: auto;
  }
}

@media (max-width: 768px) {
  .settingsPage {
    padding: 14px;
  }

  .settingsCard {
    padding: 16px;
  }

  .row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

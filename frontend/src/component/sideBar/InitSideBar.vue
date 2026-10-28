<script setup>
import { ref, computed, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSideBarContent } from '../../store/modules/sidebar'
import {
    House,
    Monitor,
    Box,
    MagicStick,
    Document,
    Setting,
    Reading,
    ShoppingBag,
    ChatDotRound,
    OfficeBuilding,
    Link,
    Coin,
    Odometer,
    Shop,
    VideoCamera,
    Grid,
    Menu,
    DataAnalysis,
    Service,
    Expand,
    Fold,
    Close,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const store = useSideBarContent()

const titleList = ref([
    { title: '首页', icon: markRaw(House), route: 'ShopViteHomePage', drawer: true },
    { title: '组件', icon: markRaw(Monitor), route: 'TableDemo', drawer: false },
    { title: '其他', icon: markRaw(Box), route: 'Tiles', drawer: true },
    { title: '操作', icon: markRaw(MagicStick), route: 'CreateCenter', drawer: true },
    { title: '模板', icon: markRaw(Document), route: 'shop', drawer: false },
    { title: '配置', icon: markRaw(Setting), route: 'IndependentLayout', drawer: true },
    { title: '单栏', icon: markRaw(Reading), route: 'DataScreen', drawer: true },
    { title: '商品', icon: markRaw(ShoppingBag), route: 'shop', drawer: false },
    { title: 'GPT', icon: markRaw(ChatDotRound), route: 'CustomerService', drawer: true },
    { title: '门户', icon: markRaw(OfficeBuilding), route: 'WorkBench', drawer: true },
    { title: '外链', icon: markRaw(Link), route: 'job', drawer: false },
    { title: '物料源', icon: markRaw(Coin), route: 'UpdateLog', drawer: true }
])

const itemList = ref([
    {
        title: '首页',
        name: 'ShopViteHomePage',
        icon: markRaw(House)
    },
    {
        title: '看板',
        name: 'Panel',
        icon: markRaw(Odometer)
    },
    {
        title: '创作中心',
        name: 'CreateCenter',
        icon: markRaw(Shop)
    },
    {
        title: '实时监控',
        name: 'RealTimeMonitor',
        icon: markRaw(VideoCamera),
        dot: '#10b981'
    },
    {
        title: '磁贴',
        name: 'Tiles',
        icon: markRaw(Grid)
    },
    {
        title: '独立布局',
        name: 'IndependentLayout',
        icon: markRaw(Menu)
    },
    {
        title: '数据大屏',
        name: 'DataScreen',
        icon: markRaw(DataAnalysis),
        badge: 'Hot',
        badgeType: 'danger'
    },
    {
        title: '工作台',
        name: 'WorkBench',
        icon: markRaw(Monitor)
    },
    {
        title: '液态玻璃',
        name: 'LiquidGlass',
        icon: markRaw(MagicStick)
    },
    {
        title: '客服端',
        name: 'CustomerService',
        icon: markRaw(Service),
        dot: '#ef4444'
    },
    {
        title: '更新日志',
        name: 'UpdateLog',
        icon: markRaw(Document),
        badge: '99+',
        badgeType: 'danger'
    }
])

const activeCategory = ref(0)
const hiddenText = ref(false)

const activeName = computed(() => String(route.name || 'ShopViteHomePage'))

function selectCategory(index) {
    activeCategory.value = index
    const target = titleList.value[index]
    if (!target) return
    if (target.route && route.name !== target.route) router.push({ name: target.route })
    if (target.drawer) {
        if (!store.isOpen) store.setState()
    } else if (store.isOpen) {
        store.setState()
    }
}

function handleSelect(name) {
    if (name !== route.name) router.push({ name })
    if (store.isOpen) store.setState()
}
</script>

<template>
    <div class="sideBar">
        <div class="sideBarTitle">
            <button type="button" class="logo-box" title="展开/收起菜单" @click="store.setState()">
                <el-icon :size="48">
                    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
                        <polygon points="15,20 85,20 50,88" fill="#757bfd" stroke-linejoin="round" />
                        <path d="M56 16 L38 50 L48 50 L42 82 L64 44 L53 44 Z" fill="#ffdf5d" />
                    </svg>
                </el-icon>
            </button>

            <div class="railList">
                <button v-for="(item, index) in titleList" :key="item.title" type="button" class="railItem"
                    :class="{ active: activeCategory === index }" :title="item.title"
                    @click="selectCategory(index)">
                    <el-icon :size="hiddenText ? 16 : 24">
                        <component :is="item.icon" />
                    </el-icon>
                    <span v-show="hiddenText" class="railTitle">{{ item.title }}</span>
                </button>
            </div>

            <div class="railActions">
                <button id="controlText" type="button" :title="hiddenText ? '隐藏分类文字' : '显示分类文字'"
                    @click="hiddenText = !hiddenText">
                    <el-icon :size="12">
                        <Fold v-if="hiddenText" />
                        <Expand v-else />
                    </el-icon>
                </button>
                <button id="controlSecSide" type="button" :title="store.isOpen ? '收起菜单' : '展开菜单'"
                    @click="store.setState()">
                    <el-icon :size="12">
                        <Close v-if="store.isOpen" />
                        <Menu v-else />
                    </el-icon>
                </button>
            </div>
        </div>

        <transition name="drawer">
            <div class="sideBarContent" v-show="store.isOpen">
                <div class="logo-title">
                    <span>Vue Shop Vite</span>
                </div>
                <el-menu class="second-sidebar-menu" :default-active="activeName" background-color="transparent"
                    text-color="#606773" active-text-color="#4e88f3" @select="handleSelect">
                    <el-menu-item v-for="item in itemList" :key="item.name" :index="item.name">
                        <el-icon>
                            <component :is="item.icon" />
                        </el-icon>
                        <span class="title">{{ item.title }}</span>
                        <span v-if="item.dot" class="dot" :style="{ backgroundColor: item.dot }"></span>
                        <span v-if="item.badge" class="badge" :class="item.badgeType">{{ item.badge }}</span>
                    </el-menu-item>
                </el-menu>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.sideBar {
    position: relative;
    width: 5.3%;
    min-width: 64px;
    max-width: 88px;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    overflow: visible;
}

.sideBar .sideBarTitle {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--app-border-on-dark);
    background-color: rgb(40, 44, 52);
}

.logo-box {
    width: 100%;
    height: 65px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
}

.railList {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
}

.railList::-webkit-scrollbar {
    width: 0;
}

.railItem {
    width: 75%;
    min-height: 52px;
    padding: 5px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2px;
    color: var(--app-text-placeholder);
    border: none;
    border-radius: 7px;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.railItem:hover {
    color: #fff;
    background-color: rgba(78, 136, 243, 0.55);
    transform: translateY(-1px);
    box-shadow:
        0 3px 7px rgba(0, 0, 0, 0.32),
        0 8px 16px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.railItem.active {
    color: #fff;
    background: linear-gradient(180deg, #5b93f5, rgb(78, 136, 243));
    box-shadow:
        0 3px 7px rgba(0, 0, 0, 0.32),
        0 8px 16px rgba(0, 0, 0, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.railItem:active {
    transform: translateY(1px);
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.3),
        inset 0 2px 5px rgba(0, 0, 0, 0.28);
}

.railTitle {
    max-width: 100%;
    font-size: 10px;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.railActions {
    flex-shrink: 0;
    padding: 8px 0 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

#controlText,
#controlSecSide {
    width: 72%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 7px;
    color: #fff;
    background: linear-gradient(180deg, #5b93f5, rgb(78, 136, 243));
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.35),
        0 6px 12px rgba(0, 0, 0, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}

#controlText:hover,
#controlSecSide:hover {
    transform: translateY(-1px);
    filter: brightness(1.06);
    box-shadow:
        0 4px 8px rgba(0, 0, 0, 0.38),
        0 9px 18px rgba(0, 0, 0, 0.24),
        inset 0 1px 0 rgba(255, 255, 255, 0.34);
}

#controlText:active,
#controlSecSide:active {
    transform: translateY(1px);
    filter: none;
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.35),
        inset 0 2px 5px rgba(0, 0, 0, 0.3);
}

.sideBar .sideBarContent {
    position: absolute;
    top: 0;
    left: 100%;
    z-index: 1;
    width: min(250px, 46vw);
    height: 100%;
    border: 1px solid var(--app-border);
    background-color: var(--app-surface);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* box-shadow:
        0 10px 28px rgba(15, 23, 42, 0.22),
        0 2px 6px rgba(15, 23, 42, 0.12); */
}

.drawer-enter-active,
.drawer-leave-active {
    transition: transform 0.32s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.24s ease;
}

.drawer-enter-from,
.drawer-leave-to {
    opacity: 0;
    transform: translateX(-24px);
}

.logo-title {
    width: 100%;
    height: 55px;
    flex-shrink: 0;
    font-size: 20px;
    color: #7f7f7f;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--app-border-light);
}

.second-sidebar-menu {
    flex: 1;
    min-height: 0;
    width: 100%;
    border-right: none;
    overflow-y: auto;
}

.second-sidebar-menu :deep(.el-menu-item) {
    margin: 10px auto;
    height: 35px;
    width: 92%;
    padding: 0 10px !important;
    color: rgb(96, 103, 115);
    font-size: 12px;
    border-radius: 7px;
    border: none;
    background: transparent;
    box-shadow: none;
    white-space: nowrap;
    transition: background-color 0.18s ease, color 0.18s ease;
}

.second-sidebar-menu :deep(.el-menu-item:hover) {
    color: var(--app-primary);
    background-color: var(--app-primary-softer);
}

.second-sidebar-menu :deep(.el-menu-item.is-active) {
    color: var(--app-primary);
    font-weight: 600;
    background-color: var(--app-primary-soft);
}

.second-sidebar-menu :deep(.el-menu-item .el-icon) {
    font-size: 14px;
}

.second-sidebar-menu :deep(.el-menu-item .title) {
    margin-left: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dot {
    margin-left: auto;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.badge {
    margin-left: auto;
    padding: 0 6px;
    line-height: 18px;
    font-size: 10px;
    color: #fff;
    border-radius: 9px;
    background-color: #f56c6c;
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .sideBar {
        width: 56px;
        min-width: 56px;
    }

    .sideBar .sideBarContent {
        width: min(84vw, 250px);
    }

    .railItem {
        width: 85%;
        min-height: 46px;
    }
}
</style>

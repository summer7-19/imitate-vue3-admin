<script setup>
import { ref, computed, markRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useSideBarContent } from '../../store/modules/sidebar'
import { useUserStore } from '../../store/modules/user'
import {
    House,
    Document,
    Setting,
    ShoppingBag,
    ChatDotRound,
    OfficeBuilding,
    Link,
    Coin,
    Odometer,
    Shop,
    VideoCamera,
    Menu,
    DataAnalysis,
    Service,
    Expand,
    Fold,
    Close,
    User,
    UserFilled,
    Lock,
    Goods,
    TrendCharts,
    List,
    ChatLineSquare,
    Tickets,
    Bell,
    Money,
    Box,
    Picture,
    FolderOpened,
    CollectionTag,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const store = useSideBarContent()
const userStore = useUserStore()

const isAdmin = computed(() => userStore.permissions.includes('admin'))

const titleList = ref([
    { title: '首页', icon: markRaw(House), route: 'ShopViteHomePage', drawer: true, group: 'default' },
    { title: '配置', icon: markRaw(Setting), route: null, drawer: true, group: 'config', adminOnly: true },
    { title: '商品', icon: markRaw(ShoppingBag), route: null, drawer: true, group: 'shop', adminOnly: true },
    { title: '客服', icon: markRaw(ChatDotRound), route: 'CustomerService', drawer: true, group: 'default' },
    { title: '门户', icon: markRaw(OfficeBuilding), route: 'WorkBench', drawer: true, group: 'default' },
    { title: '外链', icon: markRaw(Link), route: 'shop', drawer: false, group: 'default' },
    { title: '物料源', icon: markRaw(Coin), route: 'UpdateLog', drawer: true, group: 'default' }
])

const defaultItems = [
    { name: 'ShopViteHomePage', route: 'ShopViteHomePage', title: '首页', icon: markRaw(House) },
    { name: 'Panel', route: 'Panel', title: '看板', icon: markRaw(Odometer) },
    { name: 'CreateCenter', route: 'CreateCenter', title: '创作中心', icon: markRaw(Shop) },
    { name: 'RealTimeMonitor', route: 'RealTimeMonitor', title: '实时监控', icon: markRaw(VideoCamera), dot: '#10b981' },
    { name: 'DataScreen', route: 'DataScreen', title: '数据大屏', icon: markRaw(DataAnalysis), badge: 'Hot', badgeType: 'danger' },
    { name: 'CustomerService', route: 'CustomerService', title: '客服端', icon: markRaw(Service), dot: '#ef4444' },
    { name: 'UpdateLog', route: 'UpdateLog', title: '更新日志', icon: markRaw(Document), badge: '99+', badgeType: 'danger' }
]

const configItems = [
    { name: 'ShopViteProfile', route: 'ShopViteProfile', title: '个人中心', icon: markRaw(User) },
    { name: 'AdminUsers', route: 'AdminUsers', title: '用户管理', icon: markRaw(UserFilled) },
    { name: 'AdminPermissions', route: 'AdminPermissions', title: '权限管理', icon: markRaw(Lock) },
    { name: 'ShopViteSettings', route: 'ShopViteSettings', title: '系统设置', icon: markRaw(Setting) }
]

const shopItems = [
    { name: 'AdminGoods', route: 'AdminGoods', title: '商品管理', icon: markRaw(Goods) },
    { name: 'AdminGoodsStats', route: 'AdminGoodsStats', title: '商品统计', icon: markRaw(TrendCharts), dot: '#f56c6c' },
    { name: 'AdminGoodsComments', route: 'AdminGoodsComments', title: '商品评论', icon: markRaw(ChatLineSquare) },
    { name: 'AdminWorkOrders', route: 'AdminWorkOrders', title: '工单管理', icon: markRaw(Tickets) }
]

const CONFIG_ROUTES = configItems.map((item) => item.name)
const SHOP_ROUTES = shopItems.map((item) => item.name)

function groupOf(name) {
    if (CONFIG_ROUTES.includes(name)) return 'config'
    if (SHOP_ROUTES.includes(name)) return 'shop'
    return 'default'
}

const initialGroup = groupOf(String(route.name))
const activeCategory = ref(Math.max(0, titleList.value.findIndex((item) => item.group === initialGroup)))
const activeGroup = ref(initialGroup)
const hiddenText = ref(false)

const visibleTitles = computed(() =>
    titleList.value
        .map((item, index) => ({ ...item, index }))
        .filter((item) => !item.adminOnly || isAdmin.value)
)

const menuItems = computed(() => {
    if (!isAdmin.value) return defaultItems
    if (activeGroup.value === 'config') return configItems
    if (activeGroup.value === 'shop') return shopItems
    return defaultItems
})

const activeName = computed(() => String(route.name || 'ShopViteHomePage'))

function selectCategory(index) {
    activeCategory.value = index
    const target = titleList.value[index]
    if (!target) return
    activeGroup.value = target.group
    if (target.route && route.name !== target.route) router.push({ name: target.route })
    if (target.drawer && !store.isOpen) store.setState()
}

function handleSelect(name) {
    const item = menuItems.value.find((entry) => entry.name === name)
    if (!item) return
    if (!item.route) {
        ElMessage.info(`「${item.title}」页面尚未接入`)
        return
    }
    if (name !== route.name) router.push({ name: item.route })
}

watch(
    () => route.name,
    (name) => {
        const group = groupOf(String(name))
        if (group === 'default') return
        activeGroup.value = group
        const index = titleList.value.findIndex((item) => item.group === group)
        if (index >= 0) activeCategory.value = index
    }
)
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
                <button v-for="item in visibleTitles" :key="item.title" type="button" class="railItem"
                    :class="{ active: activeCategory === item.index }" :title="item.title"
                    @click="selectCategory(item.index)">
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
                    <el-menu-item v-for="item in menuItems" :key="item.name" :index="item.name">
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
    height: 64px;
    flex-shrink: 0;
    padding: 0 20px;
    font-size: 19px;
    color: #7f7f7f;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid var(--app-border-light);
}

.second-sidebar-menu {
    flex: 1;
    min-height: 0;
    width: 100%;
    padding: 8px 0;
    border-right: none;
    overflow-y: auto;
}

.second-sidebar-menu :deep(.el-menu-item) {
    margin: 4px auto;
    height: 44px;
    width: 92%;
    padding: 0 14px !important;
    gap: 10px;
    color: rgb(96, 103, 115);
    font-size: 13px;
    border-radius: 9px;
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
    font-size: 17px;
}

.second-sidebar-menu :deep(.el-menu-item .title) {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dot {
    margin-left: auto;
    width: 7px;
    height: 7px;
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

    .second-sidebar-menu :deep(.el-menu-item) {
        height: 40px;
        font-size: 12px;
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

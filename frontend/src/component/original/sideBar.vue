<template>
    <nav class="sideBar" :class="{ openSide: sideBarStore.openSidebar }" aria-label="主导航">
        <div class="brand" :class="{ collapsed: !sideBarStore.openSidebar }">
            <svg class="brandLogo" viewBox="0 0 24 24" aria-hidden="true">
                <path :d="brandPath" fill="currentColor"></path>
            </svg>
            <span v-show="sideBarStore.openSidebar" class="brandTitle">Vue3 Admin Better</span>
        </div>

        <el-scrollbar class="menuScroll">
            <el-menu class="el-menu-vertical-custom" :default-active="activeMenu" :default-openeds="openedMenus"
                :collapse="!sideBarStore.openSidebar" :collapse-transition="false" unique-opened router
                background-color="#323947" text-color="#fff" active-text-color="#ffd04b">
                <template v-for="item in menus" :key="item.name">
                    <el-sub-menu v-if="item.children?.length" :index="item.name">
                        <template #title>
                            <el-icon :size="22">
                                <svg :viewBox="item.viewBox">
                                    <path :d="item.pathData" fill="currentColor"></path>
                                </svg>
                            </el-icon>
                            <span>{{ item.name }}</span>
                        </template>
                        <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
                            {{ child.name }}
                        </el-menu-item>
                    </el-sub-menu>

                    <el-menu-item v-else :index="item.path">
                        <el-icon :size="22">
                            <svg :viewBox="item.viewBox">
                                <path :d="item.pathData" fill="currentColor"></path>
                            </svg>
                        </el-icon>
                        <template #title>
                            <span>{{ item.name }}</span>
                        </template>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-scrollbar>
    </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '../../store/modules/sidebar'

const sideBarStore = useSidebarStore()
const route = useRoute()

const brandPath = 'M1 3h4l7 12 7-12h4L12 22 1 3zm8.667 0L12 7l2.333-4h4.035L12 14 5.632 3h4.035z'

const menus = ref([
    {
        pathData: 'M512 128 128 447.936V896h255.936V640H640v256h255.936V447.936z',
        name: '首页',
        viewBox: '0 0 1024 1024',
        path: '/'
    },
    {
        pathData: 'M317.056 128 128 344.064V896h768V344.064L706.944 128zm-14.528-64h418.944a32 32 0 0 1 24.064 10.88l206.528 236.096A32 32 0 0 1 960 332.032V928a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V332.032a32 32 0 0 1 7.936-21.12L278.4 75.008A32 32 0 0 1 302.528 64',
        name: '组件',
        viewBox: '0 0 1024 1024',
        children: [
            { name: '按钮组件', path: '/components/button' },
            { name: '表单组件', path: '/components/form' },
            { name: '表格组件', path: '/components/table' }
        ]
    },
    {
        pathData: 'M317.056 128 128 344.064V896h768V344.064L706.944 128zm-14.528-64h418.944a32 32 0 0 1 24.064 10.88l206.528 236.096A32 32 0 0 1 960 332.032V928a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V332.032a32 32 0 0 1 7.936-21.12L278.4 75.008A32 32 0 0 1 302.528 64',
        name: '模板市场',
        viewBox: '0 0 1024 1024',
        path: '/shop'
    },
    {
        pathData: 'm64 448 832-320-128 704-446.08-243.328L832 192 242.816 545.472zm256 512V657.024L512 768z',
        name: '找工作',
        viewBox: '0 0 1024 1024',
        path: '/job'
    },
    {
        pathData: 'M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768m48-176a48 48 0 1 1-96 0 48 48 0 0 1 96 0m-48-464a32 32 0 0 1 32 32v288a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32',
        name: '错误页',
        viewBox: '0 0 1024 1024',
        children: [
            { name: '401 无权限', path: '/error/401' },
            { name: '404 找不到', path: '/error/404' }
        ]
    },
    {
        pathData: 'M176 416a112 112 0 1 0 0 224 112 112 0 0 0 0-224m0 64a48 48 0 1 1 0 96 48 48 0 0 1 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96',
        name: '支持我们',
        viewBox: '0 0 1024 1024',
        path: '/thank'
    }
])

const activeMenu = computed(() => route.path)

const openedMenus = computed(() =>
    menus.value
        .filter((item) => item.children?.some((child) => route.path.startsWith(child.path)))
        .map((item) => item.name)
)
</script>

<style scoped>
.sideBar {
    --sidebar-width: clamp(64px, 4.5vw, 96px);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 30;
    width: var(--sidebar-width);
    min-width: 64px;
    max-width: 96px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    color: #f7f3f3;
    border: 1px solid var(--app-border-on-dark);
    background-color: #323947;
    overflow: hidden;
    box-shadow: 6px 0 18px rgba(15, 23, 42, 0.16);
    transition: width 0.3s ease, box-shadow 0.3s ease;
}

.sideBar.openSide {
    width: min(250px, 84vw);
    min-width: 0;
    max-width: none;
    box-shadow: 16px 0 38px rgba(15, 23, 42, 0.3);
}

.brand {
    height: 64px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    overflow: hidden;
    white-space: nowrap;
}

.brand.collapsed {
    justify-content: center;
    padding: 0;
}

.brandLogo {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
}

.brandTitle {
    font-size: 20px;
    font-weight: 600;
    color: #f7f3f3;
}

.menuScroll {
    flex: 1;
    min-height: 0;
}

.el-menu-vertical-custom {
    width: 100%;
    border-right: none;
    background-color: #323947;
    padding: 10px;
    box-sizing: border-box;
}

.el-menu-vertical-custom.el-menu--collapse {
    width: 100%;
    padding: 10px 0;
}

.el-menu-vertical-custom :deep(.el-menu-item),
.el-menu-vertical-custom :deep(.el-sub-menu__title) {
    height: 46px;
    margin-bottom: 4px;
    border-radius: 5px;
    box-sizing: border-box;
}

.el-menu-vertical-custom.el-menu--collapse :deep(.el-menu-item),
.el-menu-vertical-custom.el-menu--collapse :deep(.el-sub-menu__title) {
    position: relative;
    width: 100%;
    margin: 0 0 4px;
    padding: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

.el-menu-vertical-custom.el-menu--collapse :deep(.el-menu-item > span),
.el-menu-vertical-custom.el-menu--collapse :deep(.el-sub-menu__title > span) {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    margin: 0 !important;
    overflow: hidden;
}

.el-menu-vertical-custom.el-menu--collapse :deep(.el-icon) {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    flex-shrink: 0;
    transform: translate(-50%, -50%);
}

.el-menu-vertical-custom.el-menu--collapse :deep(.el-sub-menu__icon-arrow) {
    display: none;
}

.el-menu-vertical-custom :deep(.el-menu-item:hover),
.el-menu-vertical-custom :deep(.el-sub-menu__title:hover) {
    background-color: rgb(44, 113, 169) !important;
}

.el-menu-vertical-custom:not(.el-menu--collapse) :deep(.el-sub-menu .el-menu-item) {
    min-width: 0;
    padding-left: 48px !important;
}

.el-menu-vertical-custom.el-menu--collapse :deep(.el-sub-menu .el-menu-item) {
    padding: 0 !important;
    justify-content: center;
}

@media (max-width: 768px) {
    .sideBar {
        width: 64px;
        min-width: 64px;
        max-width: 64px;
    }

    .sideBar.openSide {
        width: min(84vw, 250px);
        min-width: 0;
        max-width: none;
    }
}
</style>

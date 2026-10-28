<script setup>
import { ref } from 'vue'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const modes = [
    { key: 'sidebar', label: '侧边布局', desc: '导航固定在左侧，内容区获得最大的纵向空间。' },
    { key: 'top', label: '顶部布局', desc: '导航横向排列，适合菜单层级较浅的产品。' },
    { key: 'mixed', label: '混合布局', desc: '顶部承载全局功能，侧边承载业务菜单。' },
]

const activeMode = ref('sidebar')
const compact = ref(false)

const features = [
    '内容区自适应剩余宽高，不依赖固定百分比',
    '导航折叠后保留图标与悬浮提示',
    '窄屏时自动切换为顶部导航',
    '路由切换保持当前布局状态',
]
</script>

<template>
    <div class="page">
        <header class="pageHeader">
            <div>
                <h2>独立布局</h2>
                <p>对比三种常见后台布局结构，预览可随参数实时变化</p>
            </div>
            <label class="compactSwitch">
                <span>紧凑模式</span>
                <el-switch v-model="compact" />
            </label>
        </header>

        <div class="modeTabs">
            <button
                v-for="mode in modes"
                :key="mode.key"
                :class="{ active: activeMode === mode.key }"
                @click="activeMode = mode.key"
            >
                {{ mode.label }}
            </button>
        </div>

        <div class="layoutGrid">
            <section class="previewPanel">
                <div class="previewHeader">
                    <span>布局预览</span>
                    <span>{{ modes.find((mode) => mode.key === activeMode).label }}</span>
                </div>
                <div class="preview" :class="[activeMode, { compact }]">
                    <aside v-if="activeMode !== 'top'" class="rail">
                        <span class="dot"></span>
                        <span v-for="i in 4" :key="i" class="railItem"></span>
                    </aside>
                    <div class="stage">
                        <div v-if="activeMode !== 'sidebar'" class="topbar">
                            <span class="brand"></span>
                            <span v-for="i in 3" :key="i" class="navItem"></span>
                            <span class="user"></span>
                        </div>
                        <div class="cards">
                            <div v-for="i in 4" :key="i" class="card">
                                <span class="line long"></span>
                                <span class="line short"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="infoPanel">
                <h3>{{ modes.find((mode) => mode.key === activeMode).label }}</h3>
                <p class="desc">{{ modes.find((mode) => mode.key === activeMode).desc }}</p>
                <ul class="featureList">
                    <li v-for="feature in features" :key="feature">{{ feature }}</li>
                </ul>
                <div class="usage">
                    <span class="usageLabel">适用场景</span>
                    <p>{{ activeMode === 'top' ? '官网后台、工具型产品、菜单层级较浅的系统。' : activeMode === 'sidebar' ? '中后台管理系统、数据看板、菜单层级较深的系统。' : '大型平台后台，兼顾全局功能与业务分区。' }}</p>
                </div>
            </section>
        </div>
        <Footer />
    </div>
</template>

<style scoped>
.page {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 18px clamp(12px, 2vw, 24px);
    box-sizing: border-box;
    background-color: var(--app-surface-plain);
}

.pageHeader {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 18px;
}

.pageHeader h2 {
    margin: 0;
    color: var(--app-text);
    font-size: 20px;
}

.pageHeader p {
    margin: 4px 0 0;
    color: var(--app-text-soft);
    font-size: 13px;
}

.compactSwitch {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--app-text-secondary);
    font-size: 13px;
}

.modeTabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.modeTabs button {
    height: 34px;
    padding: 0 18px;
    border: none;
    border-radius: 17px;
    color: var(--app-text-secondary);
    font-size: 13px;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.1), 0 4px 8px rgba(15, 23, 42, 0.07),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.modeTabs button:hover {
    color: var(--app-primary-strong);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.12), 0 8px 16px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.modeTabs button.active {
    color: var(--app-primary-strong);
    font-weight: 500;
    box-shadow: inset 0 2px 5px rgba(15, 23, 42, 0.16);
}

.layoutGrid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(260px, 1fr);
    gap: 18px;
}

.previewPanel,
.infoPanel {
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.previewPanel {
    padding: 18px;
}

.previewHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    color: var(--app-text-soft);
    font-size: 13px;
}

.preview {
    display: flex;
    height: 340px;
    overflow: hidden;
    border: 1px solid #e3e9f2;
    border-radius: 8px;
    background-color: #f9fbff;
    transition: padding 0.2s;
}

.preview .rail {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    width: 64px;
    padding: 14px 0;
    background: linear-gradient(180deg, #2f3a4a, #44526a);
    transition: width 0.2s;
}

.preview.compact .rail {
    width: 46px;
    gap: 9px;
}

.preview .rail .dot {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background-color: var(--app-primary);
}

.preview .rail .railItem {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.22);
}

.preview .stage {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.preview .topbar {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    height: 52px;
    padding: 0 16px;
    background-color: var(--app-surface);
    border-bottom: 1px solid #e3e9f2;
    transition: height 0.2s;
}

.preview.compact .topbar {
    height: 42px;
}

.preview .topbar .brand {
    width: 54px;
    height: 14px;
    border-radius: 4px;
    background-color: var(--app-primary);
}

.preview .topbar .navItem {
    width: 40px;
    height: 10px;
    border-radius: 4px;
    background-color: #dfe6f0;
}

.preview .topbar .user {
    width: 24px;
    height: 24px;
    margin-left: auto;
    border-radius: 50%;
    background-color: #c7d6ee;
}

.preview .cards {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 18px;
    overflow-y: auto;
    transition: padding 0.2s;
}

.preview.compact .cards {
    gap: 8px;
    padding: 10px;
}

.preview .card {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 8px;
    min-height: 96px;
    padding: 14px;
    border-radius: 8px;
    background-color: var(--app-surface);
    border: 1px solid #e8eef7;
}

.preview .card .line {
    height: 10px;
    border-radius: 4px;
    background-color: #e5ecf5;
}

.preview .card .line.long {
    width: 76%;
}

.preview .card .line.short {
    width: 46%;
    background-color: #d7e4f7;
}

.infoPanel {
    padding: 20px;
}

.infoPanel h3 {
    margin: 0 0 10px;
    color: var(--app-text);
    font-size: 16px;
    font-weight: 500;
}

.infoPanel .desc {
    margin: 0 0 18px;
    color: var(--app-text-secondary);
    font-size: 13px;
    line-height: 1.7;
}

.infoPanel .featureList {
    margin: 0;
    padding-left: 18px;
}

.infoPanel .featureList li {
    margin-bottom: 10px;
    color: var(--app-text-secondary);
    font-size: 13px;
    line-height: 1.6;
}

.infoPanel .usage {
    margin-top: 20px;
    padding: 14px 16px;
    border-radius: 8px;
    background-color: #f4f8ff;
}

.infoPanel .usageLabel {
    color: var(--app-primary);
    font-size: 12px;
}

.infoPanel .usage p {
    margin: 6px 0 0;
    color: var(--app-text-subtle);
    font-size: 13px;
    line-height: 1.7;
}

@media (max-width: 992px) {
    .layoutGrid {
        grid-template-columns: 1fr;
    }

    .preview {
        height: 280px;
    }
}

@media (max-width: 576px) {
    .preview {
        height: 230px;
    }

    .preview .cards {
        grid-template-columns: 1fr;
    }
}
</style>

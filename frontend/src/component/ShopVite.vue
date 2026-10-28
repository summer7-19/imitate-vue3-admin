<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserProfile } from '@/composables/useUserProfile'
import { useUserMenu } from '@/composables/useUserMenu'

const { userStore, isLoggedIn, displayName, avatarText, roleLabel } = useUserProfile()
const { handleCommand: handleUserCommand } = useUserMenu()

const activeIndex = ref(0)
const payFilter = ref('all')
const cartCount = ref(0)

const list = ref([{
    name: '全部模板',
    path: 'M640 384v256H384V384zm64 0h192v256H704zm-64 512H384V704h256zm64 0V704h192v192zm-64-768v192H384V128zm64 0h192v192H704zM320 384v256H128V384zm0 512H128V704h192zm0-768v192H128V128z'
}, {
    name: '中后台管理',
    path: 'M359.168 768H160a32 32 0 0 1-32-32V192H64a32 32 0 0 1 0-64h896a32 32 0 1 1 0 64h-64v544a32 32 0 0 1-32 32H665.216l110.848 192h-73.856L591.36 768H433.024L322.176 960H248.32zM832 192H192v512h640zM342.656 534.656a32 32 0 1 1-45.312-45.312L444.992 341.76l125.44 94.08L679.04 300.032a32 32 0 1 1 49.92 39.936L581.632 524.224 451.008 426.24 342.656 534.592z'
}, {
    name: '企业官网',
    path: 'M192 128v704h384V128zm-32-64h448a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32'
}, {
    name: '博客网站',
    path: 'm469.952 554.24 52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z'
}, {
    name: '实用工具',
    path: 'M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896'
}, {
    name: 'AI 大模型',
    path: 'm161.92 580.736 29.888 58.88C171.328 659.776 160 681.728 160 704c0 82.304 155.328 160 352 160s352-77.696 352-160c0-22.272-11.392-44.16-31.808-64.32l30.464-58.432C903.936 615.808 928 657.664 928 704c0 129.728-188.544 224-416 224S96 833.728 96 704c0-46.592 24.32-88.576 65.92-123.264'
}, {
    name: '镜像加速',
    path: 'M320 288V128h64v352h256V128h64v160h160v64H704v128h160v64H704v128h160v64H704v160h-64V544H384v352h-64V736H128v-64h192V544H128v-64h192V352H128v-64z'
}, {
    name: '落地页',
    path: 'M512 128a384 384 0 1 0 0 768 384 384 0 0 0 0-768m0-64a448 448 0 1 1 0 896 448 448 0 0 1 0-896'
}])

const moudleList = ref([
    {
        id: 1,
        image_url: 'https://picsum.photos/400/400?random=201',
        name: 'Vue3 Admin Better',
        content: '开箱即用的中后台模板，内置权限、菜单、主题切换与常用业务组件。',
        category: '中后台管理',
        price: 0
    },
    {
        id: 2,
        image_url: 'https://picsum.photos/400/400?random=202',
        name: 'Element Plus Pro',
        content: '基于 Element Plus 的企业级中后台方案，支持暗色主题与多标签页。',
        category: '中后台管理',
        price: 299.00
    },
    {
        id: 3,
        image_url: 'https://picsum.photos/400/400?random=203',
        name: '星云企业官网',
        content: '响应式企业官网模板，包含产品展示、案例中心与联系我们页面。',
        category: '企业官网',
        price: 0
    },
    {
        id: 4,
        image_url: 'https://picsum.photos/400/400?random=204',
        name: '极简博客主题',
        content: 'Markdown 驱动的个人博客模板，支持暗色模式、标签归档与全文搜索。',
        category: '博客网站',
        price: 59.00
    },
    {
        id: 5,
        image_url: 'https://picsum.photos/400/400?random=205',
        name: '工具集导航站',
        content: '常用在线工具集合，内置 JSON 格式化、时间戳转换与编码工具。',
        category: '实用工具',
        price: 0
    },
    {
        id: 6,
        image_url: 'https://picsum.photos/400/400?random=206',
        name: 'AI 对话工作台',
        content: '多模型对话与知识库检索界面，支持流式输出与会话历史管理。',
        category: 'AI 大模型',
        price: 399.00
    },
    {
        id: 7,
        image_url: 'https://picsum.photos/400/400?random=207',
        name: '镜像加速面板',
        content: '一键切换镜像源的管理面板，支持延迟检测、状态监控与批量配置。',
        category: '镜像加速',
        price: 0
    },
    {
        id: 8,
        image_url: 'https://picsum.photos/400/400?random=208',
        name: 'SaaS 产品落地页',
        content: '高转化率的产品落地页模板，包含首屏、定价表与常见问题模块。',
        category: '落地页',
        price: 129.00
    },
    {
        id: 9,
        image_url: 'https://picsum.photos/400/400?random=209',
        name: '运营数据看板',
        content: '面向运营团队的数据看板，内置趋势图、渠道对比与指标卡片。',
        category: '中后台管理',
        price: 199.00
    },
    {
        id: 10,
        image_url: 'https://picsum.photos/400/400?random=210',
        name: '开源文档站',
        content: '简洁的文档站点模板，支持侧边栏目录、代码高亮与版本切换。',
        category: '博客网站',
        price: 0
    }
])

const filteredList = computed(() => {
    const category = list.value[activeIndex.value]?.name
    return moudleList.value.filter((item) => {
        if (category && category !== '全部模板' && item.category !== category) return false
        if (payFilter.value === 'paid' && item.price <= 0) return false
        if (payFilter.value === 'free' && item.price > 0) return false
        return true
    })
})

function selectCategory(index) {
    activeIndex.value = index
}

function formatPrice(price) {
    return price > 0 ? `$${price.toFixed(2)}` : '免费'
}

function buyTemplate(template) {
    ElMessage.success(`已提交「${template.name}」的购买申请（演示）`)
}

function addToCart(template) {
    cartCount.value += 1
    ElMessage.success(`已将「${template.name}」加入购物车`)
}

function sendSuggestion() {
    ElMessage.info('建议入口建设中，感谢你的反馈')
}
</script>

<template>
    <div class="shop">
        <div class="header">
            <div class="left">
                <span>Shop Vite模板市场</span>
            </div>
            <div class="right">
                <span v-if="cartCount" class="cartTip">购物车 {{ cartCount }}</span>
                <button @click="sendSuggestion">建议</button>
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
        <div class="mainBox">
            <div class="sideList">
                <div class="sideListHeader">
                    模板分类
                </div>
                <ul>
                    <li
                        v-for="(value, index) in list"
                        :key="value.name"
                        :class="{ active: activeIndex === index }"
                        @click="selectCategory(index)"
                    >
                        <span class="iconBox">
                            <svg viewBox="0 0 1024 1024" aria-hidden="true">
                                <path :d="value.path"></path>
                            </svg>
                        </span>
                        <span class="label">{{ value.name }}</span>
                    </li>
                </ul>
            </div>
            <div class="mainContent">
                <div class="mainHeader">
                    <span class="title">模板列表</span>
                    <div class="right">
                        <span>共 {{ filteredList.length }} 个模板</span>
                        <button :class="{ active: payFilter === 'all' }" @click="payFilter = 'all'">全部</button>
                        <button :class="{ active: payFilter === 'paid' }" @click="payFilter = 'paid'">付费</button>
                        <button :class="{ active: payFilter === 'free' }" @click="payFilter = 'free'">免费</button>
                    </div>
                </div>
                <div class="content">
                    <ul v-if="filteredList.length">
                        <li v-for="value in filteredList" :key="value.id">
                            <div class="top">
                                <img :src="value.image_url" :alt="value.name" loading="lazy">
                            </div>
                            <div class="info">
                                <div class="nameRow">
                                    <span class="name">{{ value.name }}</span>
                                    <span class="freeTag" :class="{ paid: value.price > 0 }">
                                        {{ value.price > 0 ? '付费' : '免费' }}
                                    </span>
                                </div>
                                <span class="desc">{{ value.content }}</span>
                                <span class="category">{{ value.category }}</span>
                            </div>
                            <div class="bottom">
                                <span class="price">{{ formatPrice(value.price) }}</span>
                                <div class="actions">
                                    <button class="pay" @click="buyTemplate(value)">购买</button>
                                    <button class="addCar" @click="addToCart(value)">加入购物车</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <el-empty v-else description="该分类下暂时没有符合条件的模板" :image-size="80" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.shop {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: #f7f8f9;
}

.shop .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    height: 56px;
    padding: 0 clamp(12px, 2vw, 24px);
    background-color: var(--app-surface);
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.08);
}

.shop .header .left {
    font-size: 20px;
    color: #3b4046;
}

.shop .header .right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.shop .header .cartTip {
    padding: 3px 10px;
    border-radius: 20px;
    color: #1f7a4d;
    font-size: 12px;
    background-color: #e6fbef;
}

.shop .header .right button {
    height: 30px;
    padding: 0 16px;
    border: 1px solid var(--app-border-strong);
    border-radius: 8px;
    color: #5e5d5d;
    font-size: 14px;
    background-color: var(--app-surface);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
}

.shop .header .right button:hover {
    color: #4fc3f7;
    border-color: #4fc3f7;
}

.shop .header .userDropdown {
    display: inline-flex;
}

.shop .header .right .userInfo {
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 10px 0 4px;
    border: 1px solid var(--app-border-light);
    border-radius: 999px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
    gap: 8px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.shop .header .right .userInfo:hover {
    color: #5e5d5d;
    border-color: #4fc3f7;
    box-shadow: 0 4px 12px rgba(79, 195, 247, 0.28);
}

.shop .header .userInfo .avatar {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    flex-shrink: 0;
    overflow: hidden;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    border-radius: 50%;
    background: linear-gradient(135deg, #7ddcff, #4fc3f7);
}

.shop .header .userInfo .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.shop .header .userInfo .meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.25;
}

.shop .header .userInfo .meta strong {
    max-width: 96px;
    overflow: hidden;
    color: #3b4046;
    font-size: 12px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.shop .header .userInfo .meta span {
    color: var(--app-text-muted);
    font-size: 10px;
}

.shop .header .userInfo .userArrow {
    color: var(--app-text-muted);
    font-size: 11px;
}

.shop .mainBox {
    flex: 1;
    min-height: 0;
    display: flex;
    gap: 16px;
    padding: clamp(10px, 1.4vw, 18px);
}

.shop .mainBox .sideList {
    flex-shrink: 0;
    width: clamp(168px, 14vw, 220px);
    overflow-y: auto;
    border-radius: 5px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.08);
}

.shop .mainBox .sideList .sideListHeader {
    margin: 12px 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--app-border-light);
    color: #a4a3a3;
    font-size: 20px;
}

.shop .mainBox .sideList ul {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0;
    padding: 0 8px 10px;
    list-style: none;
}

.shop .mainBox .sideList ul li {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    color: #5e5d5d;
    font-size: 15px;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
}

.shop .mainBox .sideList ul li .iconBox {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background-color: var(--app-surface-mute);
    transition: background-color 0.2s, box-shadow 0.2s;
}

.shop .mainBox .sideList ul li svg {
    width: 16px;
    height: 16px;
    fill: #7d8389;
    transition: fill 0.2s;
}

.shop .mainBox .sideList ul li:hover {
    background-color: #ebe6e6;
}

.shop .mainBox .sideList ul li.active {
    color: #34b7e8;
    background-color: #f0faff;
}

.shop .mainBox .sideList ul li.active .iconBox {
    background-color: rgba(79, 195, 247, 0.18);
    box-shadow: inset 0 0 0 1px rgba(79, 195, 247, 0.32);
}

.shop .mainBox .sideList ul li.active svg {
    fill: #34b7e8;
}

.shop .mainBox .mainContent {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    background-color: var(--app-surface);
    box-shadow: 0 0 5px #c2bebe;
}

.shop .mainBox .mainContent .mainHeader {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    min-height: 54px;
    padding: 10px 16px;
    box-shadow: 0 0 2px rgb(144, 142, 142);
}

.shop .mainBox .mainContent .mainHeader .title {
    margin-right: auto;
    color: #6f7377;
    font-size: 20px;
}

.shop .mainBox .mainContent .mainHeader .right {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    color: #8e8d8d;
    font-size: 14px;
}

.shop .mainBox .mainContent .mainHeader .right button {
    height: 28px;
    padding: 0 14px;
    border: 1px solid var(--app-border-strong);
    border-radius: 4px;
    color: #6f7377;
    font-size: 13px;
    background-color: var(--app-surface);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background-color 0.2s;
}

.shop .mainBox .mainContent .mainHeader .right button:hover,
.shop .mainBox .mainContent .mainHeader .right button.active {
    color: #fff;
    border-color: #4fc3f7;
    background-color: #4fc3f7;
}

.shop .mainBox .mainContent .content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 16px;
    font-size: 12px;
}

.shop .mainBox .mainContent .content ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 26px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.shop .mainBox .mainContent .content ul li {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 0.8rem;
    background-color: var(--app-surface);
    box-shadow: 0 0 2px rgb(144, 142, 142), 0 0 2px rgb(144, 142, 142);
    transition: box-shadow 0.2s, transform 0.2s;
}

.shop .mainBox .mainContent .content ul li:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(79, 195, 247, 0.35);
}

.shop .mainBox .mainContent .content ul li .top {
    height: 150px;
    flex-shrink: 0;
    background-color: var(--app-surface-line);
}

.shop .mainBox .mainContent .content ul li .top img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.shop .mainBox .mainContent .content ul li .info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    padding: 12px 14px 4px;
}

.shop .mainBox .mainContent .content ul li .info .nameRow {
    display: flex;
    align-items: center;
    gap: 8px;
}

.shop .mainBox .mainContent .content ul li .info .name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: #000;
    font-size: 14px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.shop .mainBox .mainContent .content ul li .info .freeTag {
    flex-shrink: 0;
    padding: 1px 7px;
    border-radius: 6px;
    color: #1f7a4d;
    font-size: 10px;
    background-color: #e6fbef;
}

.shop .mainBox .mainContent .content ul li .info .freeTag.paid {
    color: #b9772f;
    background-color: #fff4e5;
}

.shop .mainBox .mainContent .content ul li .info .desc {
    display: -webkit-box;
    overflow: hidden;
    color: #7d8389;
    font-size: 11px;
    line-height: 1.6;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.shop .mainBox .mainContent .content ul li .info .category {
    align-self: flex-start;
    padding: 1px 8px;
    border-radius: 6px;
    color: #5f6368;
    font-size: 10px;
    background-color: var(--app-surface-line);
}

.shop .mainBox .mainContent .content ul li .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 14px 14px;
}

.shop .mainBox .mainContent .content ul li .bottom .price {
    color: #955050;
    font-size: 18px;
    font-weight: 600;
}

.shop .mainBox .mainContent .content ul li .bottom .actions {
    display: flex;
    gap: 8px;
}

.shop .mainBox .mainContent .content ul li .bottom button {
    height: 30px;
    padding: 0 10px;
    border: none;
    border-radius: 0.2rem;
    color: #fff0f0;
    font-size: 11px;
    background-color: #65deeb;
    box-shadow: 0 0 4px #dedcdc;
    cursor: pointer;
    transition: box-shadow 0.2s, filter 0.2s;
}

.shop .mainBox .mainContent .content ul li .bottom button.addCar {
    color: #5c6b3a;
    background-color: #e9f7cf;
}

.shop .mainBox .mainContent .content ul li .bottom button:hover {
    filter: brightness(0.97);
    box-shadow: 0 0 15px #dad9b9;
}

@media (max-width: 992px) {
    .shop .mainBox {
        flex-direction: column;
        gap: 10px;
    }

    .shop .mainBox .sideList {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .shop .mainBox .sideList .sideListHeader {
        display: none;
    }

    .shop .mainBox .sideList ul {
        flex-direction: row;
        padding: 8px;
    }

    .shop .mainBox .sideList ul li {
        flex-shrink: 0;
        padding: 8px 12px;
        border-radius: 8px;
        white-space: nowrap;
    }
}

@media (max-width: 576px) {
    .shop .header .left {
        font-size: 17px;
    }

    .shop .header .userInfo .meta {
        display: none;
    }

    .shop .mainBox {
        padding: 10px;
    }

    .shop .mainBox .mainContent .mainHeader .title {
        font-size: 18px;
    }

    .shop .mainBox .mainContent .content ul {
        grid-template-columns: 1fr;
    }
}
</style>

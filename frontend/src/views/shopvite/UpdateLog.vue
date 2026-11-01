<script setup>
import { computed, ref } from 'vue'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const types = ['全部', '新增', '优化', '修复']
const activeType = ref('全部')

const logs = [
    {
        version: 'v2.4.0',
        date: '2026-10-20',
        type: '新增',
        title: '独立布局与液态玻璃主题上线',
        points: [
            '新增独立布局页，支持侧边、顶部与混合三种导航结构切换。',
            '新增液态玻璃风格页面，提供三套渐变背景。',
            '侧栏支持折叠状态记忆，刷新后保持上次选择。',
        ],
    },
    {
        version: 'v2.3.0',
        date: '2026-10-08',
        type: '优化',
        title: '看板与创作中心体验优化',
        points: [
            '看板指标卡改为真实数据源渲染，支持同比与环比展示。',
            '创作中心补充作品趋势图与粉丝增长明细。',
            '窄屏下首页卡片自动换行，修复横向溢出问题。',
        ],
    },
    {
        version: 'v2.2.1',
        date: '2026-09-26',
        type: '修复',
        title: '修复实时监控消息滚动异常',
        points: [
            '修复消息列表在长文本下无法自动滚动到底部的问题。',
            '修复切换会话后未读计数未清零的问题。',
        ],
    },
    {
        version: 'v2.2.0',
        date: '2026-09-12',
        type: '新增',
        title: '客服工作台与工单入口',
        points: [
            '新增客服端页面，支持快捷问题与模拟自动回复。',
            '新增工单状态筛选，可查看待处理与已完结工单。',
        ],
    },
    {
        version: 'v2.1.0',
        date: '2026-08-30',
        type: '优化',
        title: '模板市场筛选与购买流程',
        points: [
            '侧边分类与付费状态可组合筛选模板。',
            '补充模板数量统计与购物车提示，购买操作增加结果反馈。',
        ],
    },
]

const filteredLogs = computed(() => {
    if (activeType.value === '全部') return logs
    return logs.filter((log) => log.type === activeType.value)
})

const tagType = (type) => ({ 新增: 'success', 优化: 'primary', 修复: 'warning' }[type] || 'info')
</script>

<template>
    <div class="page">
        <header class="pageHeader">
            <div>
                <h2>更新日志</h2>
                <p>Shop Vite 的版本迭代与功能改进记录</p>
            </div>
            <div class="filters">
                <button
                    v-for="type in types"
                    :key="type"
                    :class="{ active: activeType === type }"
                    @click="activeType = type"
                >
                    {{ type }}
                </button>
            </div>
        </header>

        <div class="logList">
            <article v-for="log in filteredLogs" :key="log.version" class="logCard">
                <div class="version">
                    <span class="v">{{ log.version }}</span>
                    <span class="date">{{ log.date }}</span>
                </div>
                <div class="body">
                    <div class="titleRow">
                        <h3>{{ log.title }}</h3>
                        <el-tag size="small" :type="tagType(log.type)" effect="light">{{ log.type }}</el-tag>
                    </div>
                    <ul>
                        <li v-for="point in log.points" :key="point">{{ point }}</li>
                    </ul>
                </div>
            </article>
        </div>
        <el-empty v-if="!filteredLogs.length" description="该类型下暂无更新记录" :image-size="70" />
        
    </div>
    <Footer />
</template>

<style scoped>
.page {
    margin:0 0 0 20px;
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

.pageHeader .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.pageHeader .filters button {
    height: 30px;
    padding: 0 16px;
    border: none;
    border-radius: 15px;
    color: var(--app-text-secondary);
    font-size: 13px;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.1), 0 4px 8px rgba(15, 23, 42, 0.07),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.pageHeader .filters button:hover {
    color: var(--app-primary-strong);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.12), 0 8px 16px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.pageHeader .filters button.active {
    color: var(--app-primary-strong);
    font-weight: 500;
    box-shadow: inset 0 2px 5px rgba(15, 23, 42, 0.16);
}

.logList {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin: 0 50px;
}

.logCard {
    display: flex;
    gap: 20px;
    padding: 20px;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.logCard .version {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
    width: 108px;
}

.logCard .version .v {
    color: var(--app-primary);
    font-size: 18px;
    font-weight: 600;
}

.logCard .version .date {
    color: var(--app-text-muted);
    font-size: 12px;
}

.logCard .body {
    flex: 1;
    min-width: 0;
}

.logCard .body .titleRow {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
}

.logCard .body h3 {
    margin: 0;
    color: var(--app-text);
    font-size: 16px;
    font-weight: 500;
}

.logCard .body ul {
    margin: 12px 0 0;
    padding-left: 18px;
}

.logCard .body li {
    margin-bottom: 8px;
    color: var(--app-text-secondary);
    font-size: 13px;
    line-height: 1.7;
}

.logCard .body li:last-child {
    margin-bottom: 0;
}

@media (max-width: 576px) {
    .logCard {
        flex-direction: column;
        gap: 10px;
        padding: 16px;
    }

    .logCard .version {
        flex-direction: row;
        align-items: baseline;
        width: auto;
        gap: 10px;
    }

    .logCard .version .v {
        font-size: 16px;
    }
}
</style>

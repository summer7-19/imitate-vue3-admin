<script setup>
import Footer from '../footer/footer.vue'
import { computed, ref } from 'vue'

const list = [
    { date: '10-15', message: '关于打击网络暴力言论的公告' },
    { date: '10-14', message: '系统维护通知：今晚22:00-24:00进行系统升级' },
    { date: '10-13', message: '新功能上线：支持视频内容创作' },
    { date: '10-12', message: '关于优化用户体验的重要更新' },
    { date: '10-11', message: '创作者激励计划正式启动' },
    { date: '10-10', message: '关于内容审核标准的调整说明' },
    { date: '10-09', message: '平台安全防护升级完成' },
    { date: '10-08', message: '关于数据隐私保护的重要提醒' },
    { date: '10-07', message: '创作者认证功能正式开放' },
    { date: '10-06', message: '关于违规内容处理规则的更新' },
    { date: '10-05', message: '平台算法优化公告' },
    { date: '10-04', message: '关于用户反馈处理机制的改进' },
]

const creativeList = [
    { title: '程序员未来的出路在哪里？' },
    { title: '前端开发技术趋势分析' },
    { title: 'Vue3生态圈最新动态' },
    { title: '人工智能在编程中的应用' },
    { title: '远程办公时代的团队协作' },
    { title: '开源项目的商业模式探索' },
    { title: '低代码平台的发展前景' },
    { title: 'Web3.0技术架构解析' },
]

const stats = [
    { label: '粉丝数', value: '98,500', growth: '+2.4% 比昨天', tone: 'blue' },
    { label: '总播放', value: '1,286,430', growth: '+12.6% 比昨天', tone: 'green' },
    { label: '获赞数', value: '54,210', growth: '+3.8% 比昨天', tone: 'orange' },
]

const range = ref('7d')
const trendMap = {
    '7d': [1200, 1680, 1420, 2100, 1860, 2600, 2380],
    '30d': [820, 940, 880, 1100, 1020, 1260, 1180, 1420, 1360, 1580],
}
const labelsMap = {
    '7d': ['10-18', '10-19', '10-20', '10-21', '10-22', '10-23', '10-24'],
    '30d': ['09-25', '10-01', '10-07', '10-13', '10-19', '10-24'],
}

const trendPoints = computed(() => {
    const data = trendMap[range.value]
    const max = Math.max(...data)
    const step = 600 / (data.length - 1)
    return data
        .map((value, index) => `${(index * step).toFixed(1)},${(160 - (value / max) * 140).toFixed(1)}`)
        .join(' ')
})

const areaPoints = computed(() => `0,180 ${trendPoints.value} 600,180`)
const trendLabels = computed(() => labelsMap[range.value])

const works = [
    { title: '程序员未来的出路在哪里？', type: '图文', date: '10-23', views: 12034, likes: 892, status: '已发布' },
    { title: '前端开发技术趋势分析', type: '图文', date: '10-21', views: 8620, likes: 641, status: '已发布' },
    { title: 'Vue3 生态圈最新动态', type: '视频', date: '10-19', views: 23150, likes: 1780, status: '已发布' },
    { title: '人工智能在编程中的应用', type: '图文', date: '10-15', views: 4680, likes: 356, status: '审核中' },
    { title: '远程办公时代的团队协作', type: '图文', date: '10-12', views: 0, likes: 0, status: '草稿' },
]

const rankList = [
    { title: '把青春华章写在祖国大地上', tag: '热', tone: 'orange' },
    { title: '前端工程师的成长路径', tag: '荐', tone: 'blue' },
    { title: 'AI 辅助编程实践指南', tag: '新', tone: 'green' },
]

const formatNum = (value) => (value >= 10000 ? `${(value / 10000).toFixed(1)}w` : String(value))
</script>

<template>
    <div class="content">
        <div class="main">
            <div class="left">
                <div class="total">
                    <ul>
                        <li v-for="stat in stats" :key="stat.label" :class="stat.tone">
                            <div class="icon">{{ stat.label.slice(0, 1) }}</div>
                            <div class="statInfo">
                                <span class="label">{{ stat.label }}</span>
                                <strong>{{ stat.value }}</strong>
                                <span class="grow">{{ stat.growth }}</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="panel trend">
                    <div class="panelHeader">
                        <span>作品数据趋势</span>
                        <div class="rangeTabs">
                            <button :class="{ active: range === '7d' }" @click="range = '7d'">近 7 天</button>
                            <button :class="{ active: range === '30d' }" @click="range = '30d'">近 30 天</button>
                        </div>
                    </div>
                    <div class="chartWrap">
                        <svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#4e88f3" stop-opacity="0.24" />
                                    <stop offset="100%" stop-color="#4e88f3" stop-opacity="0" />
                                </linearGradient>
                            </defs>
                            <g class="grid">
                                <line v-for="i in 4" :key="i" x1="0" :y1="i * 40" x2="600" :y2="i * 40" />
                            </g>
                            <polygon :points="areaPoints" fill="url(#areaFill)" />
                            <polyline :points="trendPoints" class="trendLine" />
                        </svg>
                        <div class="axis">
                            <span v-for="label in trendLabels" :key="label">{{ label }}</span>
                        </div>
                    </div>
                </div>

                <div class="panel worksPanel">
                    <div class="panelHeader">
                        <span>我的作品</span>
                        <span class="muted">共 26 篇</span>
                    </div>
                    <ul class="works">
                        <li v-for="work in works" :key="work.title">
                            <div class="workMain">
                                <strong>{{ work.title }}</strong>
                                <span>{{ work.type }} · {{ work.date }}</span>
                            </div>
                            <span class="metric">{{ formatNum(work.views) }} 阅读</span>
                            <span class="metric">{{ formatNum(work.likes) }} 赞</span>
                            <span class="status" :class="work.status === '已发布' ? 'published' : work.status === '审核中' ? 'reviewing' : 'draft'">
                                {{ work.status }}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="right">
                <div class="activity">
                    <span class="activityTag">限时活动</span>
                    <strong>创作者激励计划</strong>
                    <p>发布优质内容即可参与流量扶持，本期名额 500 人。</p>
                    <button>立即参与</button>
                </div>

                <div class="panel announce">
                    <div class="panelHeader">
                        <span class="announceTitle"><i>公告</i>平台公告</span>
                        <span class="muted">更多</span>
                    </div>
                    <div class="message">
                        <ul>
                            <li v-for="value in list" :key="value.date + value.message">
                                <i>{{ value.date }}</i>
                                <span>{{ value.message }}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="panel rank">
                    <div class="panelHeader">
                        <span>热门榜单</span>
                        <span class="muted">实时更新</span>
                    </div>
                    <ul class="rankList">
                        <li v-for="(item, index) in rankList" :key="item.title">
                            <span class="rankNo" :class="item.tone">{{ index + 1 }}</span>
                            <div class="rankInfo">
                                <i>{{ item.title }}</i>
                                <span :class="['rankTag', item.tone]">{{ item.tag }}</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="panel creativity">
                    <div class="panelHeader">
                        <span>创作灵感</span>
                        <span class="muted">换一批</span>
                    </div>
                    <div class="question">
                        <span v-for="value in creativeList" :key="value.title">#{{ value.title }}#</span>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<style scoped>
.content {
    width: 100%;
    height: 88%;
    padding: 18px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--app-surface-mute);
}

.content::-webkit-scrollbar {
    width: 6px;
}

.content::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.2);
}

.content::-webkit-scrollbar-track {
    background: transparent;
}

.main {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr);
    gap: 18px;
}

.left,
.right {
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
}

.panel {
    padding: 18px;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.panelHeader {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 16px;
    color: var(--app-text);
    font-size: 14px;
    font-weight: 500;
}

.panelHeader .muted {
    color: var(--app-text-muted);
    font-size: 12px;
    font-weight: 400;
}

.total ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.total ul li {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 96px;
    padding: 18px;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.total .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
}

.total .blue .icon {
    background: linear-gradient(135deg, #6fa4ff, #4e88f3);
}

.total .green .icon {
    background: linear-gradient(135deg, #63d7ab, #34c38f);
}

.total .orange .icon {
    background: linear-gradient(135deg, #f7c07a, #f0a04b);
}

.total .statInfo {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
}

.total .label {
    color: var(--app-text-soft);
    font-size: 12px;
}

.total strong {
    color: var(--app-text);
    font-size: 19px;
    font-weight: 600;
}

.total .grow {
    color: #34c38f;
    font-size: 12px;
}

.rangeTabs {
    display: flex;
    gap: 8px;
}

.rangeTabs button {
    height: 28px;
    padding: 0 14px;
    border: none;
    border-radius: 14px;
    color: var(--app-text-secondary);
    font-size: 12px;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.1), 0 4px 8px rgba(15, 23, 42, 0.07),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.rangeTabs button:hover {
    color: var(--app-primary-strong);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.12), 0 8px 16px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.rangeTabs button.active {
    color: var(--app-primary-strong);
    font-weight: 500;
    box-shadow: inset 0 2px 5px rgba(15, 23, 42, 0.16);
}

.chartWrap {
    width: 100%;
}

.chartWrap svg {
    display: block;
    width: 100%;
    height: clamp(170px, 17vw, 220px);
}

.chartWrap .grid line {
    stroke: #eef1f5;
    stroke-width: 1;
    stroke-dasharray: 4 4;
}

.trendLine {
    fill: none;
    stroke: #4e88f3;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
}

.axis {
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
    color: var(--app-text-muted);
    font-size: 11px;
}

.works {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
}

.works li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid #f0f3f7;
}

.works li:last-child {
    padding-bottom: 0;
    border-bottom: none;
}

.works .workMain {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.works .workMain strong {
    overflow: hidden;
    color: var(--app-text);
    font-size: 14px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.works .workMain span {
    color: var(--app-text-muted);
    font-size: 12px;
}

.works .metric {
    flex-shrink: 0;
    color: var(--app-text-secondary);
    font-size: 12px;
}

.works .status {
    flex-shrink: 0;
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 11px;
}

.works .status.published {
    color: #1f7a4d;
    background-color: #e6fbef;
}

.works .status.reviewing {
    color: #b9772f;
    background-color: #fff4e5;
}

.works .status.draft {
    color: var(--app-text-secondary);
    background-color: var(--app-surface-line);
}

.activity {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 18px;
    border-radius: 10px;
    color: #fff;
    background: linear-gradient(135deg, #4e88f3, #7b6cf6);
    box-shadow: 0 8px 20px rgba(78, 136, 243, 0.28);
}

.activity .activityTag {
    align-self: flex-start;
    padding: 2px 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 11px;
    background-color: rgba(255, 255, 255, 0.22);
}

.activity strong {
    font-size: 18px;
    font-weight: 600;
}

.activity p {
    margin: 0;
    color: rgba(255, 255, 255, 0.82);
    font-size: 12px;
    line-height: 1.6;
}

.activity button {
    align-self: flex-start;
    margin-top: 6px;
    height: 32px;
    padding: 0 18px;
    border: none;
    border-radius: 16px;
    color: #fff;
    font-size: 12px;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.18), 0 6px 14px rgba(15, 23, 42, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.35);
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s;
}

.activity button:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(15, 23, 42, 0.2), 0 10px 20px rgba(15, 23, 42, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.activity button:active {
    transform: translateY(0);
    box-shadow: inset 0 2px 6px rgba(15, 23, 42, 0.28);
}

.announce .announceTitle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.announce .announceTitle i {
    padding: 2px 8px;
    border-radius: 5px;
    color: #fff;
    font-size: 11px;
    font-style: normal;
    background-color: var(--app-primary);
}

.announce .message {
    max-height: 230px;
    overflow-y: auto;
}

.announce .message::-webkit-scrollbar {
    width: 5px;
}

.announce .message::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #dfe4eb;
}

.announce .message ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

.announce .message li {
    display: flex;
    gap: 10px;
    padding: 9px 0;
    color: var(--app-text-subtle);
    font-size: 13px;
    line-height: 1.5;
}

.announce .message li i {
    flex-shrink: 0;
    color: var(--app-text-muted);
    font-size: 12px;
    font-style: normal;
}

.rankList {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.rankList li {
    display: flex;
    align-items: center;
    gap: 10px;
}

.rankNo {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    color: #fff;
    font-size: 12px;
    background-color: var(--app-text-muted);
}

.rankNo.orange {
    background-color: #f0a04b;
}

.rankNo.blue {
    background-color: var(--app-primary);
}

.rankNo.green {
    background-color: #34c38f;
}

.rankInfo {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.rankInfo i {
    flex: 1;
    overflow: hidden;
    color: var(--app-text-body);
    font-size: 13px;
    font-style: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.rankTag {
    flex-shrink: 0;
    padding: 1px 7px;
    border-radius: 5px;
    font-size: 11px;
}

.rankTag.orange {
    color: #b9772f;
    background-color: #fff4e5;
}

.rankTag.blue {
    color: var(--app-primary-strong);
    background-color: var(--app-primary-soft);
}

.rankTag.green {
    color: #1f7a4d;
    background-color: #e6fbef;
}

.creativity .question {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.creativity .question span {
    padding: 5px 10px;
    border-radius: 14px;
    color: var(--app-primary);
    font-size: 12px;
    background-color: #f2f6ff;
    cursor: pointer;
    transition: background-color 0.2s;
}

.creativity .question span:hover {
    background-color: #e4edff;
}

@media (max-width: 1200px) {
    .main {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .total ul {
        grid-template-columns: 1fr;
    }

    .works li {
        flex-wrap: wrap;
        gap: 8px 12px;
    }

    .works .workMain {
        flex: 1 1 100%;
    }
}

@media (max-width: 576px) {
    .content {
        padding: 12px;
    }

    .chartWrap svg {
        height: 150px;
    }
}
</style>

<script setup>
import { computed, ref } from 'vue'
import {
    Coin,
    Histogram,
    MagicStick,
    PieChart,
    Refresh,
    ShoppingBag,
    TrendCharts,
    User,
    Wallet,
} from '@element-plus/icons-vue'
import Footer from '../footer/footer.vue'
import illustration from '@/assets/img/panel-illustration.png'

const status = ref(0)

const kpis = [
    {
        label: '总收入',
        value: '1,256,789',
        change: '+15.2%',
        trend: 'up',
        tone: 'blue',
        icon: Wallet,
        bars: [12, 20, 15, 27, 22, 32, 25, 38],
    },
    {
        label: '总订单',
        value: '3,456',
        change: '+8.7%',
        trend: 'up',
        tone: 'green',
        icon: ShoppingBag,
        bars: [10, 16, 21, 14, 25, 19, 29, 34],
    },
    {
        label: '活跃用户',
        value: '2,847',
        change: '-2.1%',
        trend: 'down',
        tone: 'orange',
        icon: User,
        bars: [15, 12, 21, 17, 26, 20, 30, 23],
    },
    {
        label: '成交量',
        value: '512',
        change: '+6.3%',
        trend: 'up',
        tone: 'purple',
        icon: Coin,
        bars: [18, 12, 20, 25, 16, 28, 22, 33],
    },
]

const metrics = [
    { title: '数据挖掘', value: '18,197', percent: '14%', icon: MagicStick },
    { title: '内存占用', value: '1,228 KB', percent: '32%', icon: Refresh },
    { title: '硬盘占用', value: '1,833 GB', percent: '13%', icon: Coin },
]

const channels = [
    { name: '搜索引擎', value: 32, color: '#4a8bf5', elbow: [300, 68], side: 'right' },
    { name: '直接访问', value: 25, color: '#45c4c0', elbow: [282, 160], side: 'right' },
    { name: '邮件营销', value: 16, color: '#4ecb8d', elbow: [122, 140], side: 'left' },
    { name: '联盟广告', value: 15, color: '#f2c94c', elbow: [122, 76], side: 'left' },
    { name: '视频广告', value: 12, color: '#f4667f', elbow: [194, 30], side: 'left' },
]

const DONUT = { width: 420, height: 215, cx: 215, cy: 110, r: 58, stroke: 20 }

const donutSegments = computed(() => {
    const circumference = 2 * Math.PI * DONUT.r
    let accumulated = 0
    return channels.map((channel) => {
        const length = (channel.value / 100) * circumference
        const midAngle = -90 + ((accumulated + length / 2) / circumference) * 360
        const radian = (midAngle * Math.PI) / 180
        const segment = {
            ...channel,
            dashArray: `${length.toFixed(2)} ${(circumference - length).toFixed(2)}`,
            dashOffset: (-accumulated).toFixed(2),
            edge: [
                DONUT.cx + DONUT.r * Math.cos(radian),
                DONUT.cy + DONUT.r * Math.sin(radian),
            ],
        }
        accumulated += length
        return segment
    })
})

const spendRanking = [
    { name: '朱偏右', value: 87 },
    { name: '周星呈', value: 76 },
    { name: '林东东', value: 68 },
    { name: '付小小', value: 54 },
    { name: '曲丽丽', value: 23 },
]
const spendMax = Math.max(...spendRanking.map((item) => item.value))

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const CHART = { width: 660, height: 250, left: 46, right: 10, top: 14, bottom: 28, max: 5000 }
const SERIES = [
    { key: 'soft', values: [2950, 2150, 1750, 650, 2500, 4550, 3050, 2400, 1700, 900, 1650, 2300] },
    { key: 'strong', values: [1200, 1950, 2550, 800, 4250, 3200, 2800, 2100, 1450, 1100, 3150, 2550] },
]

const xAt = (index) =>
    CHART.left + (index * (CHART.width - CHART.left - CHART.right)) / (MONTHS.length - 1)
const yAt = (value) =>
    CHART.top + (1 - value / CHART.max) * (CHART.height - CHART.top - CHART.bottom)

const smoothPath = (values) => {
    const points = values.map((value, index) => ({ x: xAt(index), y: yAt(value) }))
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
    for (let i = 0; i < points.length - 1; i += 1) {
        const p0 = points[i - 1] || points[i]
        const p1 = points[i]
        const p2 = points[i + 1]
        const p3 = points[i + 2] || p2
        const c1x = p1.x + (p2.x - p0.x) / 6
        const c1y = p1.y + (p2.y - p0.y) / 6
        const c2x = p2.x - (p3.x - p1.x) / 6
        const c2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }
    return d
}

const areaPath = (values) => {
    const baseline = yAt(0).toFixed(1)
    return `${smoothPath(values)} L ${xAt(values.length - 1).toFixed(1)} ${baseline} L ${xAt(0).toFixed(1)} ${baseline} Z`
}

const softArea = computed(() => areaPath(SERIES[0].values))
const strongArea = computed(() => areaPath(SERIES[1].values))

const yTicks = [0, 1000, 2000, 3000, 4000, 5000].map((value) => ({
    value,
    y: yAt(value),
    label: value.toLocaleString('en-US'),
}))

const xTicks = MONTHS.map((label, index) => ({ label, x: xAt(index) }))

const tableData = [
    { date: '2016-05-03', name: '王小虎', state: '上海', city: '普陀区', address: '上海市普陀区金沙江路 1518 弄', zip: '200333' },
    { date: '2016-05-02', name: '王小虎', state: '上海', city: '普陀区', address: '上海市普陀区金沙江路 1518 弄', zip: '200333' },
    { date: '2016-05-04', name: '王小虎', state: '上海', city: '普陀区', address: '上海市普陀区金沙江路 1518 弄', zip: '200333' },
    { date: '2016-05-01', name: '王小虎', state: '上海', city: '普陀区', address: '上海市普陀区金沙江路 1518 弄', zip: '200333' },
    { date: '2016-05-08', name: '王小虎', state: '上海', city: '普陀区', address: '上海市普陀区金沙江路 1518 弄', zip: '200333' },
    { date: '2016-05-07', name: '王小虎', state: '上海', city: '普陀区', address: '上海市普陀区金沙江路 1518 弄', zip: '200333' },
    { date: '2016-05-07', name: '王小虎', state: '上海', city: '普陀区', address: '上海市普陀区金沙江路 1518 弄', zip: '200333' },
    { date: '2016-05-07', name: '王小虎', state: '上海', city: '普陀区', address: '上海市普陀区金沙江路 1518 弄', zip: '200333' },
    { date: '2016-05-07', name: '王小虎', state: '上海', city: '普陀区', address: '上海市普陀区金沙江路 1518 弄', zip: '200333' },
    { date: '2016-05-07', name: '王小虎', state: '上海', city: '普陀区', address: '上海市普陀区金沙江路 1518 弄', zip: '200333' },
]

const headerCellStyle = {
    background: 'var(--app-surface-sunken)',
    color: 'var(--app-text-soft)',
    fontWeight: 500,
}
</script>

<template>
    <div class="content">
        <section class="totalSitu">
            <ul>
                <li v-for="kpi in kpis" :key="kpi.label" :class="['kpi', kpi.tone]">
                    <span class="kpiIcon">
                        <el-icon :size="22"><component :is="kpi.icon" /></el-icon>
                    </span>
                    <div class="kpiInfo">
                        <strong>{{ kpi.value }}</strong>
                        <span class="kpiLabel">{{ kpi.label }}</span>
                        <span class="kpiChange" :class="kpi.trend">
                            <svg class="caret" viewBox="0 0 12 12" aria-hidden="true">
                                <path
                                    d="M2.5 8 6 4.5 9.5 8"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.6"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            {{ kpi.change }}
                        </span>
                    </div>
                    <div class="kpiBars" aria-hidden="true">
                        <i v-for="(bar, index) in kpi.bars" :key="index" :style="{ height: `${bar}px` }"></i>
                    </div>
                </li>
            </ul>
        </section>

        <section class="infoSitu">
            <div class="illusCard">
                <img :src="illustration" alt="团队数据协作插画" />
            </div>
            <article v-for="item in metrics" :key="item.title" class="infoCard">
                <div class="infoText">
                    <span class="infoTitle">{{ item.title }}</span>
                    <strong>{{ item.value }}</strong>
                    <span class="infoNote">
                        自上周以来
                        <svg class="caret" viewBox="0 0 12 12" aria-hidden="true">
                            <path
                                d="M2.5 8 6 4.5 9.5 8"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.6"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        <b>{{ item.percent }}</b>
                    </span>
                </div>
                <span class="infoIcon">
                    <el-icon :size="24"><component :is="item.icon" /></el-icon>
                </span>
            </article>
        </section>

        <section class="chartRow">
            <article class="card distCard">
                <header class="cardHead">
                    <el-icon><PieChart /></el-icon>
                    <span>分布</span>
                </header>
                <div class="cardBody">
                    <svg
                        class="donut"
                        :viewBox="`0 0 ${DONUT.width} ${DONUT.height}`"
                        role="img"
                        aria-label="渠道分布"
                    >
                        <g :transform="`rotate(-90 ${DONUT.cx} ${DONUT.cy})`">
                            <circle
                                v-for="segment in donutSegments"
                                :key="segment.name"
                                :cx="DONUT.cx"
                                :cy="DONUT.cy"
                                :r="DONUT.r"
                                fill="none"
                                :stroke="segment.color"
                                :stroke-width="DONUT.stroke"
                                :stroke-dasharray="segment.dashArray"
                                :stroke-dashoffset="segment.dashOffset"
                            />
                        </g>
                        <g v-for="segment in donutSegments" :key="`${segment.name}-label`">
                            <polyline
                                class="donutLeader"
                                :points="`${segment.edge[0].toFixed(1)},${segment.edge[1].toFixed(1)} ${segment.elbow[0]},${segment.elbow[1]}`"
                                fill="none"
                                stroke-width="1"
                            />
                            <text
                                class="donutLabel"
                                :x="segment.elbow[0] + (segment.side === 'right' ? 6 : -6)"
                                :y="segment.elbow[1] + 4"
                                :text-anchor="segment.side === 'right' ? 'start' : 'end'"
                            >
                                {{ segment.name }}
                            </text>
                        </g>
                    </svg>
                </div>
            </article>

            <article class="card trendCard">
                <header class="cardHead">
                    <el-icon><TrendCharts /></el-icon>
                    <span>趋势</span>
                </header>
                <div class="cardBody">
                    <svg
                        class="trendChart"
                        :viewBox="`0 0 ${CHART.width} ${CHART.height}`"
                        role="img"
                        aria-label="年度数据趋势"
                    >
                        <defs>
                            <linearGradient id="panel-trend-soft" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#8ccdf5" stop-opacity="0.92" />
                                <stop offset="100%" stop-color="#8ccdf5" stop-opacity="0.32" />
                            </linearGradient>
                            <linearGradient id="panel-trend-strong" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#4a90e2" stop-opacity="0.92" />
                                <stop offset="100%" stop-color="#4a90e2" stop-opacity="0.4" />
                            </linearGradient>
                        </defs>
                        <g class="grid">
                            <line
                                v-for="tick in yTicks"
                                :key="tick.value"
                                :x1="CHART.left"
                                :x2="CHART.width - CHART.right"
                                :y1="tick.y"
                                :y2="tick.y"
                            />
                        </g>
                        <path :d="softArea" fill="url(#panel-trend-soft)" />
                        <path :d="strongArea" fill="url(#panel-trend-strong)" />
                        <g class="yAxis">
                            <text
                                v-for="tick in yTicks"
                                :key="tick.label"
                                :x="CHART.left - 8"
                                :y="tick.y + 3.5"
                                text-anchor="end"
                            >
                                {{ tick.label }}
                            </text>
                        </g>
                        <g class="xAxis">
                            <text
                                v-for="tick in xTicks"
                                :key="tick.label"
                                :x="tick.x"
                                :y="CHART.height - 8"
                                text-anchor="middle"
                            >
                                {{ tick.label }}
                            </text>
                        </g>
                    </svg>
                </div>
            </article>

            <article class="card rankCard">
                <header class="cardHead">
                    <el-icon><Histogram /></el-icon>
                    <span>消费排行</span>
                </header>
                <div class="cardBody">
                    <ul class="spendList">
                        <li v-for="item in spendRanking" :key="item.name">
                            <span class="spendName">{{ item.name }}</span>
                            <div class="spendTrack">
                                <i
                                    class="spendBar"
                                    :style="{ width: `${(item.value / spendMax) * 84}%` }"
                                ></i>
                                <span class="spendValue">{{ item.value }}万元</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </article>
        </section>

        <section class="message">
            <div class="tabs">
                <ul>
                    <li :class="{ active: status === 0 }" @click="status = 0">配送管理</li>
                    <li :class="{ active: status === 1 }" @click="status = 1">区域管理</li>
                </ul>
            </div>
            <div class="tableWrap">
                <el-table :data="tableData" :header-cell-style="headerCellStyle" style="width: 100%">
                    <el-table-column prop="date" label="日期" width="200" />
                    <el-table-column label="配送信息">
                        <el-table-column prop="name" label="姓名" width="140" />
                        <el-table-column prop="state" :label="status === 0 ? '省份' : '区域'" width="120" />
                        <el-table-column prop="city" label="市区" width="120" />
                        <el-table-column prop="address" label="地址" min-width="260" show-overflow-tooltip />
                        <el-table-column prop="zip" label="邮编" width="120" />
                    </el-table-column>
                </el-table>
            </div>
        </section>

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

.content > * + * {
    margin-top: 18px;
}

/* ---------- 顶部渐变指标卡 ---------- */
.totalSitu ul {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.totalSitu .kpi {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 150px;
    padding: 22px 24px;
    overflow: hidden;
    border-radius: 8px;
    color: #fff;
}

.totalSitu .kpi.blue {
    background: linear-gradient(120deg, #5a8dfa 0%, #3f6fe4 100%);
}

.totalSitu .kpi.green {
    background: linear-gradient(120deg, #35d07e 0%, #1fb862 100%);
}

.totalSitu .kpi.orange {
    background: linear-gradient(120deg, #f7b34c 0%, #ee9b2b 100%);
}

.totalSitu .kpi.purple {
    background: linear-gradient(120deg, #b06ef5 0%, #9247e8 100%);
}

.totalSitu .kpiIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.2);
}

.totalSitu .kpiInfo {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
}

.totalSitu .kpiInfo strong {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: 0.2px;
    white-space: nowrap;
}

.totalSitu .kpiLabel {
    color: rgba(255, 255, 255, 0.92);
    font-size: 13px;
}

.totalSitu .kpiChange {
    display: flex;
    align-items: center;
    gap: 3px;
    color: rgba(255, 255, 255, 0.86);
    font-size: 12px;
}

.totalSitu .caret {
    width: 11px;
    height: 11px;
    flex-shrink: 0;
}

.totalSitu .kpiChange.down .caret {
    transform: rotate(180deg);
}

.totalSitu .kpiBars {
    position: absolute;
    right: 18px;
    bottom: 20px;
    display: flex;
    align-items: flex-end;
    gap: 5px;
    height: 40px;
}

.totalSitu .kpiBars i {
    display: block;
    width: 6px;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.32);
}

/* ---------- 插画 + 数据卡 ---------- */
.infoSitu {
    display: grid;
    grid-template-columns: minmax(160px, 0.42fr) repeat(3, minmax(0, 1fr));
    gap: 16px;
}

.illusCard {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 168px;
    padding: 10px;
    border: 1px solid var(--app-surface-line);
    border-radius: 8px;
    background-color: var(--app-surface);
}

.illusCard img {
    width: 100%;
    max-height: 148px;
    object-fit: contain;
}

.infoCard {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    min-height: 168px;
    padding: 22px 26px;
    border: 1px solid var(--app-surface-line);
    border-radius: 8px;
    background-color: var(--app-surface);
}

.infoText {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
}

.infoTitle {
    color: var(--app-text-soft);
    font-size: 13px;
}

.infoText strong {
    color: var(--app-text);
    font-size: 24px;
    font-weight: 600;
    line-height: 1.1;
    white-space: nowrap;
}

.infoNote {
    display: flex;
    align-items: center;
    gap: 3px;
    color: var(--app-text-muted);
    font-size: 13px;
}

.infoNote .caret {
    width: 11px;
    height: 11px;
    color: #2eb872;
}

.infoNote b {
    color: #2eb872;
    font-weight: 600;
}

.infoIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    color: #4a8bf5;
    background-color: color-mix(in srgb, #4a8bf5 10%, var(--app-surface));
}

/* ---------- 图表行 ---------- */
.chartRow {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.3fr) minmax(0, 0.95fr);
    gap: 16px;
}

.card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    border: 1px solid var(--app-surface-line);
    border-radius: 8px;
    background-color: var(--app-surface);
}

.cardHead {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-shrink: 0;
    height: 46px;
    padding: 0 18px;
    border-bottom: 1px solid var(--app-surface-line);
    color: var(--app-text);
    font-size: 14px;
    font-weight: 500;
}

.cardHead .el-icon {
    color: #a06ee6;
    font-size: 16px;
}

.cardBody {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    padding: 12px 16px 16px;
}

.donut {
    width: 100%;
    max-width: 460px;
    height: auto;
}

.donutLeader {
    stroke: var(--app-border-strong);
}

.donutLabel {
    fill: var(--app-text-subtle);
    font-size: 12px;
}

.trendChart {
    width: 100%;
    height: auto;
}

.trendChart .grid line {
    stroke: var(--app-surface-line);
    stroke-width: 1;
}

.trendChart .yAxis text,
.trendChart .xAxis text {
    fill: var(--app-text-muted);
    font-size: 11px;
}

.spendList {
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
    margin: 0;
    padding: 4px 4px 0;
    list-style: none;
}

.spendList li {
    display: flex;
    align-items: center;
    gap: 12px;
}

.spendName {
    flex-shrink: 0;
    width: 52px;
    color: var(--app-text-subtle);
    font-size: 12px;
}

.spendTrack {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.spendBar {
    display: block;
    flex-shrink: 0;
    height: 10px;
    border-radius: 5px;
    background: linear-gradient(90deg, #6ea4f8, #3f7aeb);
}

.spendValue {
    flex-shrink: 0;
    color: var(--app-text-subtle);
    font-size: 12px;
}

/* ---------- 表格 ---------- */
.message {
    border: 1px solid var(--app-surface-line);
    border-radius: 8px;
    background-color: var(--app-surface);
}

.tabs {
    border-bottom: 1px solid var(--app-surface-line);
}

.tabs ul {
    display: flex;
    gap: 20px;
    margin: 0;
    padding: 0 18px;
    list-style: none;
}

.tabs li {
    padding: 14px 2px;
    color: var(--app-text-secondary);
    font-size: 14px;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
}

.tabs li:hover,
.tabs li.active {
    color: var(--app-primary);
    border-bottom-color: var(--app-primary);
}

.tableWrap {
    padding: 0 0 6px;
}

.message :deep(.el-table th.el-table__cell) {
    color: var(--app-text-soft);
    font-size: 13px;
    font-weight: 500;
    vertical-align: middle;
}

.message :deep(.el-table td.el-table__cell) {
    color: var(--app-text-secondary);
    font-size: 13px;
}

.message :deep(.el-table__inner-wrapper::before) {
    display: none;
}

@media (max-width: 1280px) {
    .totalSitu ul {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .infoSitu {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .chartRow {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .rankCard {
        grid-column: span 2;
    }
}

@media (max-width: 992px) {
    .chartRow {
        grid-template-columns: 1fr;
    }

    .rankCard {
        grid-column: auto;
    }
}

@media (max-width: 576px) {
    .content {
        padding: 12px;
    }

    .totalSitu ul,
    .infoSitu {
        grid-template-columns: 1fr;
    }

    .totalSitu .kpi {
        min-height: 104px;
        padding: 16px 18px;
    }

    .infoCard {
        min-height: 120px;
        padding: 16px 18px;
    }
}
</style>

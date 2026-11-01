<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Histogram, TrendCharts } from '@element-plus/icons-vue'
import pkg from '../../../../package.json'
import Footer from '../footer/footer.vue'

const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }
const appVersion = pkg.version || '0.0.0'
const buildTime = __BUILD_TIME__
const depList = ['vite', 'vue', 'vue-router', 'pinia', 'element-plus', 'axios', 'd3']
    .filter((name) => allDeps[name])
    .map((name) => ({ name, version: allDeps[name] }))
const depRows = computed(() => {
    const rows = []
    for (let index = 0; index < depList.length; index += 4) {
        rows.push(depList.slice(index, index + 4))
    }
    return rows
})

let sayHai = ref('')
const time = new Date().getHours()
if (time >= 4 && time < 12) {
    sayHai.value = "Good Morning"
} else if (time >= 12 && time < 18) {
    sayHai.value = "Good Afternoon"
} else {
    sayHai.value = "Good Night"
}

const sellCards = [
    {
        label: '总销量',
        value: '￥16677.00',
        change: '自上周以来 +12.4%',
        tone: 'blue',
        points: '0,32 18,26 34,28 52,18 70,20 86,10 100,6',
    },
    {
        label: '活跃用户',
        value: '1,710',
        change: '自上周以来 +4.8%',
        tone: 'green',
        points: '0,30 18,24 34,26 52,16 70,18 86,12 100,8',
    },
    {
        label: '总成交',
        value: '18,831',
        change: '自上周以来 +9.1%',
        tone: 'orange',
        points: '0,28 18,22 34,24 52,14 70,16 86,10 100,5',
    },
    {
        label: '订单',
        value: '12,034',
        change: '自上周以来 +6.3%',
        tone: 'purple',
        points: '0,26 18,20 34,22 52,12 70,14 86,8 100,4',
    },
]

const trafficSets = {
    day: {
        mode: '日',
        labels: ['2023/11/4', '2023/11/5', '2023/11/6', '2023/11/7', '2023/11/8'],
        values: [3800, 3500, 3050, 3900, 2667],
    },
    week: {
        mode: '周',
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        values: [3100, 2860, 3420, 3180, 3700, 3960, 2860],
    },
}
const trafficMode = ref('day')
const trafficSet = computed(() => trafficSets[trafficMode.value])
const trafficActive = ref(null)

const AUTH_LABELS = ['0时', '2时', '4时', '6时', '8时', '10时', '12时', '14时', '16时', '18时', '20时', '22时', '24时']
const authSets = {
    week: { mode: '周', values: [10, 38, 52, 34, 20, 24, 33, 37, 39, 37, 34, 27, 21] },
    day: { mode: '日', values: [8, 30, 47, 31, 18, 22, 29, 34, 36, 33, 30, 25, 19] },
}
const authMode = ref('week')
const authSet = computed(() => authSets[authMode.value])
const authCountdown = ref(10)

const CHART = { width: 660, height: 240, left: 52, right: 26, top: 14, bottom: 30 }

const smoothPath = (points) => {
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

function buildChart(values, labels, max, tickStep, labelStep) {
    const plotWidth = CHART.width - CHART.left - CHART.right
    const plotHeight = CHART.height - CHART.top - CHART.bottom
    const gap = labels.length > 1 ? plotWidth / (labels.length - 1) : plotWidth
    const xAt = (index) => CHART.left + index * gap
    const yAt = (value) => CHART.top + (1 - value / max) * plotHeight
    const points = values.map((value, index) => ({
        x: xAt(index),
        y: yAt(value),
        label: labels[index],
        value,
        hitX: index === 0 ? CHART.left : xAt(index) - gap / 2,
        hitWidth: index === 0 || index === values.length - 1 ? gap / 2 : gap,
    }))
    const line = smoothPath(points)
    const baseline = yAt(0)
    const yTicks = []
    for (let value = 0; value <= max; value += tickStep) {
        yTicks.push({ label: value.toLocaleString('en-US'), y: yAt(value) })
    }
    const xTicks = points
        .map((point, index) => ({
            x: point.x,
            label: point.label,
            anchor: index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle',
        }))
        .filter((_, index) => index % labelStep === 0)
    return {
        points,
        line,
        area: `${line} L ${points[points.length - 1].x.toFixed(1)} ${baseline.toFixed(1)} L ${points[0].x.toFixed(1)} ${baseline.toFixed(1)} Z`,
        yTicks,
        xTicks,
        baseline,
    }
}

const trafficChart = computed(() =>
    buildChart(trafficSet.value.values, trafficSet.value.labels, 4000, 1000, 1)
)
const authChart = computed(() => buildChart(authSet.value.values, AUTH_LABELS, 60, 10, 2))
const authDots = computed(() => authChart.value.points.filter((_, index) => index % 2 === 0))

const trafficActivePoint = computed(() =>
    trafficActive.value === null ? null : trafficChart.value.points[trafficActive.value]
)

const trafficTipStyle = computed(() => {
    if (trafficActive.value === null) return null
    const { points } = trafficChart.value
    const point = points[trafficActive.value]
    const flip = trafficActive.value >= points.length - 2
    return {
        left: `${(point.x / CHART.width) * 100}%`,
        top: `${(point.y / CHART.height) * 100}%`,
        transform: flip ? 'translate(-106%, -118%)' : 'translate(6%, -118%)',
    }
})

function toggleTrafficMode() {
    trafficMode.value = trafficMode.value === 'day' ? 'week' : 'day'
    trafficActive.value = null
}

function toggleAuthMode() {
    authMode.value = authMode.value === 'week' ? 'day' : 'week'
}

const sellProgress = ref(0)
let sellRaf = 0

function formatCardValue(card, progress) {
    const match = card.value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/)
    if (!match) return card.value
    const [, prefix, raw, suffix] = match
    const target = Number(raw.replace(/,/g, ''))
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
    const current = target * progress
    const text = raw.includes(',')
        ? current.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : current.toFixed(decimals)
    return `${prefix}${text}${suffix}`
}

const cardValues = computed(() =>
    sellCards.map((card) => formatCardValue(card, sellProgress.value))
)

let countdownTimer = 0

onMounted(() => {
    const duration = 900
    const start = performance.now()
    const tick = (now) => {
        const t = Math.min((now - start) / duration, 1)
        sellProgress.value = 1 - Math.pow(1 - t, 3)
        if (t < 1) sellRaf = requestAnimationFrame(tick)
    }
    sellRaf = requestAnimationFrame(tick)
    countdownTimer = window.setInterval(() => {
        authCountdown.value = authCountdown.value > 1 ? authCountdown.value - 1 : 10
    }, 1000)
})

onBeforeUnmount(() => {
    cancelAnimationFrame(sellRaf)
    window.clearInterval(countdownTimer)
})

function notifyPurchase(name) {
    ElMessage.success(`已选择 ${name}，演示环境不会产生真实订单`)
}
</script>

<template>
    <div class="content">
        <div class="sayHai">
            <div class="left">
                <span class="logo">SV</span>
            </div>
            <div class="right">
                <div style="font-weight: 600;font-size: 18px;color: #000;margin-bottom: 0.3rem;">{{ sayHai }}
                </div>
                <div> Vue Shop Vite累计完成6种布局，3种主题，无数种颜色搭配，覆盖绝大多数使用场景，大幅提升开发效率</div>
            </div>
        </div>
        <div class="sellMsg">
            <ul>
                <li
                    v-for="(card, index) in sellCards"
                    :key="card.label"
                    :class="[card.tone, { highlight: index === 0 }]"
                >
                    <div class="left">
                        <p>{{ card.label }}</p>
                        <p class="num">{{ cardValues[index] }}</p>
                        <span>{{ card.change }}</span>
                    </div>
                    <svg class="spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
                        <polyline
                            :points="card.points"
                            pathLength="100"
                            fill="none"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </li>
            </ul>
        </div>
        <div class="dealMsg">
            <div class="deal">
                <div class="title">
                    <span>待处理</span>
                </div>
                <div class="content">
                    <ul>
                        <li class="message">
                            <div class="left"> </div>
                            <div class="right">
                                <div class="top">
                                    <span
                                        style="font-size: 14px;margin-right: 5px;color: red;font-weight: 600;">预警</span>
                                    <span>极光降噪耳机库存低于 20 件</span>
                                </div>
                                <div class="bottom">
                                    <span
                                        style="display: inline-block;width: 50px;text-align:center;border: 1px solid aqua;border-radius: 3px;color: aqua;margin-right: 5px;">完成</span>
                                    <span>补货申请已提交至供应链</span>
                                </div>
                            </div>
                        </li>
                        <li class="message">
                            <div class="left"></div>
                            <div class="right">
                                <div class="top">
                                    <span style="font-size: 14px;margin-right: 5px;font-weight: 600;">售后工单</span>
                                    <span>用户申请退款 · 订单 202610231028</span>
                                </div>
                                <div class="bottom">
                                    <span
                                        style="display: inline-block;width: 50px;text-align:center;border: 1px solid red;border-radius: 3px;color: red;margin-right: 5px;">未完成</span>
                                    <span>等待客服在 24 小时内处理</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="msg">
                <div class="title">
                    <span>依赖信息</span>
                    <span class="versionTag">当前版本：V{{ appVersion }} 构建时间：{{ buildTime }}</span>
                </div>
                <div class="content">
                    <table>
                        <tr v-for="(row, rowIndex) in depRows" :key="rowIndex">
                            <template v-for="slot in 4" :key="slot">
                                <td>{{ row[slot - 1]?.name }}</td>
                                <td>
                                    <span>{{ row[slot - 1]?.version }}</span>
                                </td>
                            </template>
                        </tr>
                    </table>
                    <div class="bottom">
                        <button id="buy" @click="notifyPurchase('一键购买')">
                            <span>一键购买</span></button>
                        <button id="shop-vite" @click="notifyPurchase('Shop Vite ￥1899')">
                            <span>shop-vite￥1899</span></button>
                        <button id="admin-plus" @click="notifyPurchase('Admin Plus ￥799')">
                            <span>admin-plus￥799</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="sugMsg">
            <div class="title">
                <span>经营意见</span>
            </div>
            <div class="content">
                <ul class="entrance">
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3L2 10h20L12 3z" />
                                <path d="M5 10v7" />
                                <path d="M10 10v7" />
                                <path d="M14 10v7" />
                                <path d="M19 10v7" />
                                <path d="M2 17h20" />
                                <path d="M2 21h20" />
                            </svg>

                        </div>
                        <div class="intr">
                            <div class="top"><span>工商建议</span></div>
                            <div class="bottom"><span>工商建议快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M14.5 9a3.5 3.5 0 1 0 0 6" />
                            </svg>


                        </div>
                        <div class="intr">
                            <div class="top"><span>商标管理</span></div>
                            <div class="bottom"><span>商标管理快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <rect x="5" y="3" width="14" height="18" rx="2" />
                                <path d="M5 8h14" />
                            </svg>


                        </div>
                        <div class="intr">
                            <div class="top"><span>专利查询</span></div>
                            <div class="bottom"><span>专利查询快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3L2 10h20L12 3z" />
                                <path d="M5 10v7" />
                                <path d="M10 10v7" />
                                <path d="M14 10v7" />
                                <path d="M19 10v7" />
                                <path d="M2 17h20" />
                                <path d="M2 21h20" />
                            </svg>

                        </div>
                        <div class="intr">
                            <div class="top"><span>著作权查询</span></div>
                            <div class="bottom"><span>著作权查询快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3L2 10h20L12 3z" />
                                <path d="M5 10v7" />
                                <path d="M10 10v7" />
                                <path d="M14 10v7" />
                                <path d="M19 10v7" />
                                <path d="M2 17h20" />
                                <path d="M2 21h20" />
                            </svg>

                        </div>
                        <div class="intr">
                            <div class="top"><span>证照管理</span></div>
                            <div class="bottom"><span>证照管理快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="M18 10h-2v4a2 2 0 0 1-2 2H8v2a2 2 0 0 0 2 2h3l4 4v-4h1a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z" />
                                <path
                                    d="M14 10V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1l-2 4 4-2h5a2 2 0 0 0 2-2z" />
                            </svg>


                        </div>
                        <div class="intr">
                            <div class="top"><span>纳税提醒</span></div>
                            <div class="bottom"><span>纳税提醒快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="8" y1="9" x2="8.01" y2="9" stroke-width="3" />
                                <line x1="16" y1="9" x2="16.01" y2="9" stroke-width="3" />
                                <path d="M8 16a4 4 0 0 1 8 0" />
                            </svg>


                        </div>
                        <div class="intr">
                            <div class="top"><span>温馨提示</span></div>
                            <div class="bottom"><span>温馨提示快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="7" cy="7" r="3" />
                                <circle cx="17" cy="7" r="3" />
                                <circle cx="7" cy="17" r="3" />
                                <circle cx="17" cy="17" r="3" />
                            </svg>


                        </div>
                        <div class="intr">
                            <div class="top"><span>全部应用</span></div>
                            <div class="bottom"><span>全部应用快捷入口</span></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="appMsg">
            <div class="mainSituation">
                <div class="title">
                    <span class="titleMain">
                        <el-icon><TrendCharts /></el-icon>
                        流量概况
                    </span>
                    <button type="button" class="periodChip green" @click="toggleTrafficMode">
                        {{ trafficSet.mode }}
                    </button>
                </div>
                <div class="content">
                    <div class="chartHost">
                        <svg
                            class="chartSvg"
                            :viewBox="`0 0 ${CHART.width} ${CHART.height}`"
                            role="img"
                            aria-label="流量概况趋势"
                            @mouseleave="trafficActive = null"
                        >
                            <defs>
                                <linearGradient id="trafficArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#a6d7f7" stop-opacity="0.9" />
                                    <stop offset="100%" stop-color="#dceffb" stop-opacity="0.35" />
                                </linearGradient>
                            </defs>
                            <line
                                class="axisLine"
                                :x1="CHART.left"
                                :x2="CHART.width - CHART.right"
                                :y1="trafficChart.baseline"
                                :y2="trafficChart.baseline"
                            />
                            <path :d="trafficChart.area" fill="url(#trafficArea)" />
                            <path class="lineStroke" :d="trafficChart.line" fill="none" />
                            <line
                                v-if="trafficActivePoint"
                                class="hoverLine"
                                :x1="trafficActivePoint.x"
                                :x2="trafficActivePoint.x"
                                :y1="CHART.top"
                                :y2="trafficChart.baseline"
                            />
                            <circle
                                v-for="point in trafficChart.points"
                                :key="`dot-${point.label}`"
                                class="dot"
                                :cx="point.x"
                                :cy="point.y"
                                r="3"
                            />
                            <circle
                                v-if="trafficActivePoint"
                                class="dot activeDot"
                                :cx="trafficActivePoint.x"
                                :cy="trafficActivePoint.y"
                                r="4"
                            />
                            <g class="yAxis">
                                <text
                                    v-for="tick in trafficChart.yTicks"
                                    :key="`y-${tick.label}`"
                                    :x="CHART.left - 10"
                                    :y="tick.y + 3.5"
                                    text-anchor="end"
                                >
                                    {{ tick.label }}
                                </text>
                            </g>
                            <g class="xAxis">
                                <text
                                    v-for="tick in trafficChart.xTicks"
                                    :key="`x-${tick.label}`"
                                    :x="tick.x"
                                    :y="CHART.height - 8"
                                    :text-anchor="tick.anchor"
                                >
                                    {{ tick.label }}
                                </text>
                            </g>
                            <rect
                                v-for="(point, index) in trafficChart.points"
                                :key="`hit-${point.label}`"
                                :x="point.hitX"
                                :y="CHART.top"
                                :width="point.hitWidth"
                                :height="trafficChart.baseline - CHART.top"
                                fill="transparent"
                                @mouseenter="trafficActive = index"
                            />
                        </svg>
                        <div v-if="trafficActivePoint" class="chartTip" :style="trafficTipStyle">
                            <span class="tipDate">{{ trafficActivePoint.label }}</span>
                            <div class="tipRow">
                                <i></i>
                                <span>浏览量</span>
                                <strong>{{ trafficActivePoint.value.toLocaleString('en-US') }}</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <div class="left">
                        <span>自上周以来
                            <span>提升 44%</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="getPower">
                <div class="title">
                    <span class="titleMain">
                        <el-icon><Histogram /></el-icon>
                        授权数
                    </span>
                    <button type="button" class="periodChip orange" @click="toggleAuthMode">
                        {{ authSet.mode }}
                    </button>
                </div>
                <div class="content">
                    <div class="chartHost">
                        <svg
                            class="chartSvg"
                            :viewBox="`0 0 ${CHART.width} ${CHART.height}`"
                            role="img"
                            aria-label="授权数趋势"
                        >
                            <line
                                class="axisLine"
                                :x1="CHART.left"
                                :x2="CHART.width - CHART.right"
                                :y1="authChart.baseline"
                                :y2="authChart.baseline"
                            />
                            <path class="lineStroke authStroke" :d="authChart.line" fill="none" />
                            <circle
                                v-for="point in authDots"
                                :key="`auth-${point.label}`"
                                class="dot"
                                :cx="point.x"
                                :cy="point.y"
                                r="3"
                            />
                            <g class="yAxis">
                                <text
                                    v-for="tick in authChart.yTicks"
                                    :key="`y-${tick.label}`"
                                    :x="CHART.left - 10"
                                    :y="tick.y + 3.5"
                                    text-anchor="end"
                                >
                                    {{ tick.label }}
                                </text>
                            </g>
                            <g class="xAxis">
                                <text
                                    v-for="tick in authChart.xTicks"
                                    :key="`x-${tick.label}`"
                                    :x="tick.x"
                                    :y="CHART.height - 8"
                                    :text-anchor="tick.anchor"
                                >
                                    {{ tick.label }}
                                </text>
                            </g>
                        </svg>
                    </div>
                </div>
                <div class="footer">
                    <div class="left">
                        <span>授权数：19,146</span>
                    </div>
                    <div class="right">
                        <span class="countdownChip">倒计时 {{ authCountdown }}s</span>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
</template>


<style scoped>
/* 内容区域 */
.container .mainContent .content {
    padding: 0 1%;
    width: 98%;
    height: 88%;
    overflow-y: overlay;
    overflow-x: hidden;
    background-color: #efeeee;
    /* border: 1px solid #000; */
}

.container .mainContent .content::-webkit-scrollbar {
    width: 6px;
}

.container .mainContent .content::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
}

.container .mainContent .content::-webkit-scrollbar-track {
    background: transparent;
}

.container .mainContent .content .sayHai {
    margin: 2% 0;
    width: 100%;
    height: 15%;
    background-color: var(--app-surface);
    border: 1px solid var(--app-border);
    display: flex;
    flex-direction: row;
}

.container .mainContent .content .sayHai .left {
    width: 7%;
    height: 100%;
    border-radius: 0.5rem;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .sayHai img {
    width: 60%;
    height: 60%;
    aspect-ratio: auto;
}

.container .mainContent .content .sayHai .right {
    margin-top: 2%;
    margin-left: 1%;
    /* width: 90%; */
    color: rgb(117, 117, 118);
    font-size: 14px;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .sellMsg {
    margin: 1.5% 0;
    width: 100%;
    height: 25%;
    background-color: var(--app-surface);
    border: 1px solid var(--app-border);
}

.container .mainContent .content .sellMsg ul {
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    /* justify-content: space-around; */
}

.container .mainContent .content .sellMsg ul li {
    margin-right: 2%;
    padding-top: 0.5%;
    box-sizing: border-box;
    width: 25%;
    height: 100%;
    border: 1px solid var(--app-border);
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    display: flex;
    flex-direction: row;
}

.container .mainContent .content .sellMsg ul li:last-child {
    margin-right: 0;
}

.container .mainContent .content .sellMsg ul li .left {
    padding-left: 1rem;
    width: 45%;
    height: 100%;
    font-size: 14px;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .sellMsg ul li .right {
    width: 55%;
    height: 100%;
    border: 1px solid var(--app-border);
}


/* 待处理区域 */


.container .mainContent .content .dealMsg {
    margin: 2% 0 0;
    height: 30%;
    background-color: var(--app-surface);
    border: 1px solid var(--app-border);
    display: flex;
    flex-direction: row;
}

.container .mainContent .content .dealMsg .deal {
    margin-right: 2%;
    width: 50%;
    height: 100%;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .dealMsg .title {
    margin-top: 1%;
    width: 100%;
    height: 15%;
    display: flex;
    align-items: center;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .dealMsg .title span {
    padding: 2%;
    color: #3d3b3b;
}

.container .mainContent .content .dealMsg .content {
    margin: 2% auto 1%;
    width: 96%;
    height: 65%;
    box-sizing: border-box;
    overflow: hidden;
    /* border: 1px solid #000; */
}

.container .mainContent .content .dealMsg .content ul {
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    height: 100%;
    /* border: 1px solid #000; */
    display: flex;
    flex-direction: row;
    align-items: center;
}

.container .mainContent .content .dealMsg .content ul li {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 48%;
    height: 90%;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .dealMsg .content ul li:first-child {
    margin-right: 4%;
}

.container .mainContent .content .dealMsg .content ul li .left {
    margin-right: 5%;
    width: 4%;
    height: 80%;
    border-radius: 10px;
    background-color: rgb(253, 78, 78);
    /* background-color: var(bgc); */
}

.container .mainContent .content .dealMsg .content ul li .right {
    width: 80%;
    height: 65%;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .dealMsg .content ul li .right .top {
    width: 100%;
    height: 49%;
    color: rgb(248, 66, 66);
    font-size: 12px;
    letter-spacing: 1px;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .dealMsg .content ul li .right .bottom {
    width: 100%;
    height: 49%;
    font-size: 13px;
    color: #646363;
    letter-spacing: 1px;
    border: 1px solid var(--app-border);
}

/* 依赖信息 */
.container .mainContent .content .dealMsg .msg {
    width: 50%;
    height: 100%;
    border: 1px solid var(--app-border);
}
.container .mainContent .content .dealMsg .msg .content {
    margin: 5px;
    padding: 10px;
    background-color: #fff;
}
.container .mainContent .content .dealMsg .msg .content table {
    width: 100%;
    height: 60%;
    text-align: center;
    border-collapse: collapse;
}

.container .mainContent .content .dealMsg .msg .content table td {
    border: 1px solid var(--app-border-light);
    font-weight: bold;
    font-size: 0.8rem;
}

.container .mainContent .content .dealMsg .msg .content table td span {
    font-weight: normal;
    color: #7a7878;
}

.container .mainContent .content .msg .title .versionTag {
    float: right;
    margin: 5px 8px;
    padding: 5px 5px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 70%;
    color: var(--app-primary);
    font-size: 11px;
    border: 1px solid var(--app-primary);
    border-radius: 5px;
}

.container .mainContent .content .msg .content .bottom {
    margin-top: 15px;
    height: 24%;
    border: 1px solid var(--app-border);
}

#buy,
#shop-vite,
#admin-plus {
    margin-right: 30px;
    padding: 0 25px;
    height: 100%;
    font-size: 13px;
    color: #ffffff;
    border-radius: 7px;
}

#buy {
    background-color: rgb(230, 162, 60);
}

#shop-vite,
#admin-plus {
    background-color: var(--app-primary);
}



/* 经营建议 */


.container .mainContent .content .sugMsg {
    margin: 1% 0;
    height: 30%;
    background-color: var(--app-surface);
    border: 1px solid var(--app-border);
}

.container .mainContent .content .sugMsg .title {
    margin-top: 1%;
    text-indent: 1rem;
    width: 100%;
    height: 15%;
    display: flex;
    align-items: center;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .sugMsg .title span {
    /* padding: 1%; */
    color: #3d3b3b;
}

.container .mainContent .content .sugMsg .content {
    height: 70%;
    overflow: hidden;
    /* border: 1px solid #000; */

}

.container .mainContent .content .sugMsg .content .entrance {
    margin: 1% auto 0;
    padding: 0;
    list-style: none;
    width: 98%;
    height: 90%;
    display: grid;
    grid-template-columns: repeat( 4,1fr);
    gap: 10px;
    /* border: 1px solid #000; */
}

.container .mainContent .content .sugMsg .content .entrance li {
    padding: 1%;
    width: 250px;
    height: 50px;
    display: flex;
    flex-direction: row;
    font-size: 12px;
    letter-spacing: 1px;
    /* border: 1px solid #000; */
}

.container .mainContent .content .sugMsg .content .entrance li .icon {
    margin-right: 2%;
    margin-top: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    stroke: #4772FA;
    border-radius: 10px;
    box-sizing: border-box;
    border: 1px solid rgb(78, 136, 243);
    background-color: rgba(78, 136, 243, 0.1);
}

.container .mainContent .content .sugMsg .content .entrance li .icon svg {
    width: 80%;
    height: 60%;
}

.container .mainContent .content .sugMsg .content .entrance li .icon:hover {
    background-color: var(--app-primary);
    stroke: #ffffff;
}

.container .mainContent .content .sugMsg .content .entrance li .intr {
    margin-top: 1.5%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 70%;
    height: 85%;
}

.container .mainContent .content .sugMsg .content .entrance li .intr .top {
    height: 50%;
    font-size: 14px;
    font-weight: 500;
}

.container .mainContent .content .sugMsg .content .entrance li .intr .bottom {
    height: 45%;
    text-indent: 0.1rem;
}

/* 应用详情 */


.container .mainContent .content .appMsg {
    height: 40%;
    background-color: var(--app-surface);
    border: 1px solid var(--app-border);
    display: flex;
    flex-direction: row;
}

.container .mainContent .content .appMsg .mainSituation {
    margin-right: 2%;
    width: 50%;
    height: 100%;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .appMsg .getPower {
    width: 50%;
    height: 100%;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .appMsg .title {
    margin-top: 1%;
    text-indent: 1rem;
    width: 100%;
    height: 13%;
    display: flex;
    align-items: center;
    border: 1px solid var(--app-border);
}

.container .mainContent .content .appMsg .title span {
    padding: 1%;
    color: #3d3b3b;
}
.container .mainContent .content .appMsg .content {
    margin: 0 auto;
    height: 70%;
    width: 90%;
    border: 1px solid var(--app-border);
}
.container .mainContent .content .appMsg .footer {
    height: 13%;
    margin-top: 1%;
    text-indent: 1rem;
    width: 100%;
}

</style>

<style scoped>
/* 布局尺寸统一为内容驱动，避免百分比高度在窄屏下互相挤压 */
.container .mainContent .content {
    width: 100%;
    padding: 18px;
    box-sizing: border-box;
    background-color: var(--app-surface-mute);
}

.container .mainContent .content > * + * {
    margin-top: 40px;
}

.container .mainContent .content .sayHai,
.container .mainContent .content .sellMsg,
.container .mainContent .content .dealMsg,
.container .mainContent .content .sugMsg,
.container .mainContent .content .appMsg {
    height: auto;
    margin: 0;
}

.container .mainContent .content > .sayHai + .sellMsg,
.container .mainContent .content > .sellMsg + .dealMsg,
.container .mainContent .content > .dealMsg + .sugMsg,
.container .mainContent .content > .sugMsg + .appMsg {
    margin-top: 40px;
}

.container .mainContent .content .sayHai {
    display: flex;
    align-items: center;
    gap: 18px;
    min-height: 104px;
    padding: 20px;
    border: 1px solid var(--app-border-quiet);
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.container .mainContent .content .sayHai .left {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #6fa4ff, #4e88f3);
}

.container .mainContent .content .sayHai .logo {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
}

.container .mainContent .content .sayHai .right {
    flex: 1;
    min-width: 0;
    width: auto;
    height: auto;
    margin: 0;
    border: none;
    color: var(--app-text-secondary);
    font-size: 13px;
    line-height: 1.7;
}

.container .mainContent .content .sellMsg {
    background-color: transparent;
    border: none;
}

.container .mainContent .content .sellMsg ul {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 26px;
    height: auto;
    background-color: transparent;
}

.container .mainContent .content .sellMsg ul li {
    position: relative;
    width: auto;
    height: auto;
    min-height: 112px;
    margin: 0;
    padding: 18px;
    background-color: var(--app-surface);
    border: 1px solid var(--app-border-quiet);
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.container .mainContent .content .sellMsg ul li.highlight {
    border: none;
    color: #fff;
    background: linear-gradient(135deg, #5ad0f4, #4e88f3);
    box-shadow: 0 8px 20px rgba(78, 136, 243, 0.28);
}

.container .mainContent .content .sellMsg ul li .left {
    width: auto;
    height: auto;
    padding-left: 0;
    border: none;
}

.container .mainContent .content .sellMsg p {
    margin: 0 0 4px;
    color: var(--app-text-soft);
    font-size: 13px;
    line-height: 1.4;
}

.container .mainContent .content .sellMsg .num {
    color: var(--app-text);
    font-size: 22px;
    font-weight: 600;
    white-space: nowrap;
}

.container .mainContent .content .sellMsg span {
    color: #34c38f;
    font-size: 12px;
}

.container .mainContent .content .sellMsg li.highlight p,
.container .mainContent .content .sellMsg li.highlight .num,
.container .mainContent .content .sellMsg li.highlight span {
    color: #fff;
}

.container .mainContent .content .sellMsg li.highlight span {
    opacity: 0.85;
}

.container .mainContent .content .sellMsg .spark {
    position: absolute;
    right: 12px;
    bottom: 12px;
    width: 64px;
    height: 28px;
}

.container .mainContent .content .sellMsg .spark polyline {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: spark-grow 1.1s ease-out forwards;
}

@keyframes spark-grow {
    to {
        stroke-dashoffset: 0;
    }
}

.container .mainContent .content .sellMsg li.blue .spark {
    stroke: #4e88f3;
}

.container .mainContent .content .sellMsg li.green .spark {
    stroke: #34c38f;
}

.container .mainContent .content .sellMsg li.orange .spark {
    stroke: #f0a04b;
}

.container .mainContent .content .sellMsg li.purple .spark {
    stroke: #8b78f0;
}

.container .mainContent .content .sellMsg li.highlight .spark {
    stroke: #fff;
    opacity: 0.75;
}

.container .mainContent .content .dealMsg {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    background-color: transparent;
    border: none;
}

.container .mainContent .content .dealMsg .deal,
.container .mainContent .content .dealMsg .msg {
    width: auto;
    height: auto;
    margin: 0;
    padding-bottom: 10px;
    overflow: hidden;
    border: 1px solid var(--app-border-quiet);
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.container .mainContent .content .dealMsg .title {
    height: 48px;
    margin: 0;
    padding: 0 18px;
    border: none;
    border-bottom: 1px solid #eef1f5;
}

.container .mainContent .content .dealMsg .title span {
    padding: 0;
    color: var(--app-text);
    font-size: 14px;
    font-weight: 500;
}

.container .mainContent .content .dealMsg .content {
    width: auto;
    height: auto;
    margin: 16px 18px 0;
    overflow: visible;
}

.container .mainContent .content .dealMsg .content ul {
    gap: 12px;
    height: auto;
}

.container .mainContent .content .dealMsg .content ul li {
    width: auto;
    height: auto;
    min-height: 96px;
    padding: 14px;
    border: 1px solid var(--app-border-quiet);
    border-radius: 8px;
    background-color: var(--app-surface-raised);
}

.container .mainContent .content .dealMsg .content ul li .left {
    flex-shrink: 0;
    align-self: stretch;
    width: 4px;
    height: auto;
    margin-right: 10px;
    background-color: #f56c6c;
}

.container .mainContent .content .dealMsg .content ul li .right {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: auto;
    height: auto;
    border: none;
}

.container .mainContent .content .dealMsg .content ul li .right .top,
.container .mainContent .content .dealMsg .content ul li .right .bottom {
    width: auto;
    height: auto;
    border: none;
    font-size: 11px;
    line-height: 1.6;
}

.container .mainContent .content .dealMsg .content ul li .right .top {
    color: #c0392b;
}

.container .mainContent .content .dealMsg .content ul li .right .bottom {
    color: var(--app-text-secondary);
}

.container .mainContent .content .dealMsg .msg .content table {
    height: auto;
    margin-top: 2px;
    border-collapse: collapse;
}

.container .mainContent .content .dealMsg .msg .content table td {
    padding: 10px 8px;
    border: 1px solid var(--app-border-quiet);
    color: var(--app-text-body);
    font-size: 12px;
    font-weight: 500;
}

.container .mainContent .content .dealMsg .msg .content table td:nth-child(odd) {
    color: var(--app-text-soft);
    font-weight: 400;
    background-color: #fafbfd;
}

.container .mainContent .content .dealMsg .msg .content table td span {
    color: var(--app-text-subtle);
}

.container .mainContent .content .dealMsg .msg .content .bottom {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    height: auto;
    margin-top: 16px;
    border: none;
}

.container .mainContent .content #buy,
.container .mainContent .content #shop-vite,
.container .mainContent .content #admin-plus {
    height: 34px;
    margin-right: 0;
    padding: 0 18px;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
    cursor: pointer;
}

.container .mainContent .content #buy {
    color: #b97711;
}

.container .mainContent .content #shop-vite,
.container .mainContent .content #admin-plus {
    color: var(--app-primary-strong);
}

.container .mainContent .content #buy:hover,
.container .mainContent .content #shop-vite:hover,
.container .mainContent .content #admin-plus:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.14), 0 8px 18px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.container .mainContent .content #buy:active,
.container .mainContent .content #shop-vite:active,
.container .mainContent .content #admin-plus:active {
    transform: translateY(0);
    box-shadow: inset 0 2px 5px rgba(15, 23, 42, 0.18);
}

.container .mainContent .content .sugMsg {
    padding: 0 0 18px;
    overflow: hidden;
    border: 1px solid var(--app-border-quiet);
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.container .mainContent .content .sugMsg .title {
    height: 48px;
    margin: 0;
    padding: 0 18px;
    border: none;
    border-bottom: 1px solid #eef1f5;
    text-indent: 0;
}

.container .mainContent .content .sugMsg .title span {
    padding: 0;
    color: var(--app-text);
    font-size: 14px;
    font-weight: 500;
}

.container .mainContent .content .sugMsg .content {
    height: auto;
    overflow: visible;
    background-color: var(--app-surface);
}

.container .mainContent .content .sugMsg .content .entrance {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    width: auto;
    height: auto;
    margin: 16px 18px 0;
    gap: 12px;
}

.container .mainContent .content .sugMsg .content .entrance li {
    width: auto;
    height: 68px;
    min-width: 0;
    align-items: center;
    padding: 10px 12px;
    border: 1px solid var(--app-border-quiet);
    border-radius: 8px;
    transition: border-color 0.2s, background-color 0.2s;
}

.container .mainContent .content .sugMsg .content .entrance li:hover {
    border-color: #b9cdf5;
    background-color: #f7faff;
}

.container .mainContent .content .sugMsg .content .entrance li .icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    margin: 0 10px 0 0;
    border-radius: 9px;
}

.container .mainContent .content .sugMsg .content .entrance li .icon svg {
    width: 22px;
    height: 22px;
}

.container .mainContent .content .sugMsg .content .entrance li .intr {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    width: auto;
    height: auto;
    margin: 0;
}

.container .mainContent .content .sugMsg .content .entrance li .intr .top {
    height: auto;
    color: var(--app-text-body);
    font-size: 13px;
    font-weight: 500;
}

.container .mainContent .content .sugMsg .content .entrance li .intr .bottom {
    height: auto;
    overflow: hidden;
    color: var(--app-text-muted);
    font-size: 11px;
    text-indent: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.container .mainContent .content .appMsg {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    border: none;
    background-color: transparent;
}

.container .mainContent .content .appMsg .mainSituation,
.container .mainContent .content .appMsg .getPower {
    display: flex;
    flex-direction: column;
    width: auto;
    height: auto;
    margin: 0;
    padding-bottom: 18px;
    overflow: hidden;
    border: 1px solid var(--app-border-quiet);
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.container .mainContent .content .appMsg .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    height: 46px;
    margin: 0;
    padding: 0 18px;
    border: none;
    text-indent: 0;
}

.container .mainContent .content .appMsg .title span {
    padding: 0;
    color: var(--app-text);
    font-size: 14px;
    font-weight: 500;
}

.container .mainContent .content .appMsg .title .titleMain {
    display: flex;
    align-items: center;
    gap: 7px;
}

.container .mainContent .content .appMsg .title .titleMain .el-icon {
    color: #a06ee6;
    font-size: 15px;
}

.periodChip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 24px;
    padding: 0 7px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    transition: filter 0.18s ease;
}

.periodChip:hover {
    filter: brightness(0.96);
}

.periodChip.green {
    color: #22b573;
    background-color: color-mix(in srgb, #22b573 13%, var(--app-surface));
}

.periodChip.orange {
    color: #e2a03f;
    background-color: color-mix(in srgb, #f0a04b 16%, var(--app-surface));
}

.container .mainContent .content .appMsg .content {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: auto;
    margin: 0;
    padding: 8px 18px 2px;
    border: none;
    background-color: transparent;
}

.container .mainContent .content .appMsg .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    height: auto;
    margin: 0;
    padding: 10px 18px 0;
    color: var(--app-text-soft);
    font-size: 12px;
    text-indent: 0;
}

.container .mainContent .content .appMsg .footer .left span span {
    margin-left: 6px;
    color: #34c38f;
}

.container .mainContent .content .appMsg .footer .right span {
    color: var(--app-primary);
}

.container .mainContent .content .chartHost {
    position: relative;
    width: 100%;
}

.container .mainContent .content .chartSvg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
}

.container .mainContent .content .chartSvg .axisLine {
    stroke: var(--app-surface-line);
    stroke-width: 1;
}

.container .mainContent .content .chartSvg .lineStroke {
    stroke: #5b9fe0;
    stroke-width: 1.6;
    stroke-linejoin: round;
    stroke-linecap: round;
}

.container .mainContent .content .chartSvg .authStroke {
    stroke: #5ba8e8;
    stroke-width: 1.8;
}

.container .mainContent .content .chartSvg .hoverLine {
    stroke: #b9c0ca;
    stroke-width: 1;
    stroke-dasharray: 3 3;
}

.container .mainContent .content .chartSvg .dot {
    fill: var(--app-surface);
    stroke: #5b9fe0;
    stroke-width: 1.6;
}

.container .mainContent .content .chartSvg .activeDot {
    fill: #5b9fe0;
    stroke: var(--app-surface);
    stroke-width: 2;
}

.container .mainContent .content .chartSvg .yAxis text,
.container .mainContent .content .chartSvg .xAxis text {
    fill: var(--app-text-muted);
    font-size: 11px;
}

.container .mainContent .content .chartTip {
    position: absolute;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 116px;
    padding: 9px 12px;
    border-radius: 6px;
    background-color: var(--app-surface);
    box-shadow: 0 6px 18px rgba(31, 45, 61, 0.16);
    pointer-events: none;
}

.container .mainContent .content .chartTip .tipDate {
    color: var(--app-text-muted);
    font-size: 11px;
}

.container .mainContent .content .chartTip .tipRow {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--app-text-soft);
    font-size: 12px;
}

.container .mainContent .content .chartTip .tipRow i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #5b9fe0;
}

.container .mainContent .content .chartTip .tipRow strong {
    margin-left: auto;
    color: var(--app-text);
    font-size: 13px;
    font-weight: 600;
}

.container .mainContent .content .appMsg .footer .countdownChip {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 9px;
    border-radius: 4px;
    color: #22b573;
    font-size: 12px;
    background-color: color-mix(in srgb, #22b573 13%, var(--app-surface));
}


@media (max-width: 1200px) {
    .container .mainContent .content .sellMsg ul {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .container .mainContent .content .sugMsg .content .entrance {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 992px) {
    .container .mainContent .content .dealMsg,
    .container .mainContent .content .appMsg {
        grid-template-columns: 1fr;
    }

    .container .mainContent .content .sugMsg .content .entrance {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 576px) {
    .container .mainContent .content {
        padding: 12px;
    }

    .container .mainContent .content > * + * {
        margin-top: 28px;
    }

    .container .mainContent .content > .sayHai + .sellMsg,
    .container .mainContent .content > .sellMsg + .dealMsg,
    .container .mainContent .content > .dealMsg + .sugMsg,
    .container .mainContent .content > .sugMsg + .appMsg {
        margin-top: 28px;
    }

    .container .mainContent .content .sellMsg ul,
    .container .mainContent .content .sugMsg .content .entrance {
        grid-template-columns: 1fr;
    }

    .container .mainContent .content .sayHai {
        padding: 14px;
    }
}
</style>
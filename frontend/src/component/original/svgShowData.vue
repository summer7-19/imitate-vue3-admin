<script setup>
import { onBeforeUnmount, onMounted, nextTick, ref } from 'vue'
import * as d3 from 'd3'

const rootRef = ref(null)

const list = ref([
    {
        title: '访问量',
        content: '近一周访问趋势',
        num: 46076,
        name: '总访问量',
        increase: '较昨日增长12.5%',
        userNum: '活跃用户2.3k'
    },
    {
        title: '授权数',
        content: '今日授权统计',
        num: 5614,
        name: '总授权数',
        increase: '较昨日增长8.3%',
        userNum: '今日新增156'
    },
    {
        title: '用户活跃度',
        content: '本周活跃统计',
        num: 16319,
        name: '活跃用户',
        increase: '较昨日增长15.2%',
        userNum: '在线时长2.5h'
    },
    {
        title: '系统性能',
        content: '资源占用监控',
        num: '98.5%',
        name: '系统可用性',
        increase: '运行正常',
        userNum: '响应时间120ms'
    }
])

const displayed = ref(list.value.map((item) => (typeof item.num === 'number' ? 0 : item.num)))

function animateNumbers() {
    const targets = list.value.map((item) => (typeof item.num === 'number' ? item.num : null))
    const start = performance.now()
    const duration = 1000
    const step = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        targets.forEach((target, index) => {
            if (target === null) return
            displayed.value[index] = Math.round(target * eased)
        })
        if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
}

const WEEK_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const WEEK_VALUES = [3280, 3620, 4010, 4380, 4870, 5310, 5860]
const WINDOW_DAYS = 3
const WINDOW_STEP_MS = 2500
const WINDOW_SLOTS = WEEK_LABELS.length - WINDOW_DAYS + 1

const trendWindow = { start: 0 }

function setTrendWindow(start) {
    trendWindow.start = start
    const end = start + WINDOW_DAYS
    trendChart.labels = WEEK_LABELS.slice(start, end)
    trendChart.values = WEEK_VALUES.slice(start, end)
    list.value[0].content = `${WEEK_LABELS[start]} → ${WEEK_LABELS[end - 1]} 增长`
}

const trendChart = {
    type: 'line',
    color: '#4e88f3',
    unit: '次',
    labels: [],
    values: [],
    // 固定成整周量程，窗口向前推进时折线整体抬升，增长过程才看得出来
    yDomain: [0, d3.max(WEEK_VALUES)]
}

setTrendWindow(0)

const charts = [
    trendChart,
    {
        type: 'bar',
        color: '#4e88f3',
        unit: '次',
        labels: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
        values: [86, 148, 320, 412, 366, 254, 132]
    },
    {
        type: 'area',
        color: '#7c6ff3',
        unit: '人',
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        values: [1260, 1480, 1320, 1620, 1780, 1910, 1540]
    },
    {
        type: 'column',
        unit: '%',
        items: [
            { label: 'CPU', value: 45, color: '#4e88f3' },
            { label: '内存', value: 62, color: '#7c6ff3' },
            { label: '磁盘', value: 38, color: '#4e88f3' },
            { label: '网络', value: 28, color: '#7c6ff3' }
        ]
    }
]

const MARGIN = { top: 10, right: 8, bottom: 18, left: 32 }

const tip = ref({ show: false, x: 0, y: 0, text: '' })

function showTip(container, px, py, label, value, unit) {
    const root = rootRef.value
    if (!root) return
    const rootBox = root.getBoundingClientRect()
    const box = container.getBoundingClientRect()
    tip.value = {
        show: true,
        x: box.left - rootBox.left + px,
        y: box.top - rootBox.top + py,
        text: `${label} · ${value}${unit}`,
    }
}

function hideTip() {
    tip.value.show = false
}

const AXIS_FONT = 8
const AXIS_COLOR = '#b4bac6'
const GRID_COLOR = '#eef1f6'

function createSvg(container) {
    const width = Math.max(container.clientWidth, 80)
    const height = Math.max(container.clientHeight, 60)
    d3.select(container).selectAll('svg').remove()
    const svg = d3.select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('role', 'img')
        .attr('aria-label', '图表')
    return { svg, width, height }
}

function formatTick(value) {
    return Math.abs(value) >= 1000 ? `${value / 1000}k` : `${value}`
}

function drawAxisGrid(svg, { width, height, y, xLabels, xAt }) {
    const ticks = y.ticks(4)

    const grid = svg.append('g')
    grid.selectAll('line')
        .data(ticks)
        .join('line')
        .attr('x1', MARGIN.left)
        .attr('x2', width - MARGIN.right)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', GRID_COLOR)
        .attr('stroke-width', 1)
    grid.selectAll('text')
        .data(ticks)
        .join('text')
        .attr('x', MARGIN.left - 5)
        .attr('y', (d) => y(d))
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'central')
        .attr('font-size', AXIS_FONT)
        .attr('fill', AXIS_COLOR)
        .text((d) => formatTick(d))

    svg.append('line')
        .attr('x1', MARGIN.left)
        .attr('x2', width - MARGIN.right)
        .attr('y1', height - MARGIN.bottom)
        .attr('y2', height - MARGIN.bottom)
        .attr('stroke', '#dfe4ec')
        .attr('stroke-width', 1)

    svg.append('g')
        .selectAll('text')
        .data(xLabels)
        .join('text')
        .attr('x', (_, i) => xAt(i))
        .attr('y', height - MARGIN.bottom + 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', AXIS_FONT)
        .attr('fill', AXIS_COLOR)
        .text((d) => d)
}

function addHitLayer(svg, { width, height, slots, onHit, onLeave }) {
    svg.append('g')
        .selectAll('rect')
        .data(slots)
        .join('rect')
        .attr('x', (d) => d.left)
        .attr('y', MARGIN.top)
        .attr('width', (d) => d.right - d.left)
        .attr('height', height - MARGIN.top - MARGIN.bottom)
        .attr('fill', 'transparent')
        .on('mouseenter', (event, d) => onHit(d))
        .on('mousemove', (event, d) => onHit(d))
        .on('mouseleave', () => onLeave())
}

function drawSeries(container, chart, animate) {
    const { svg, width, height } = createSvg(container)
    const isBar = chart.type === 'bar'
    const band = isBar
        ? d3.scaleBand()
            .domain(d3.range(chart.values.length))
            .range([MARGIN.left, width - MARGIN.right])
            .padding(0.42)
        : null
    const point = !isBar
        ? d3.scalePoint()
            .domain(d3.range(chart.values.length))
            .range([MARGIN.left + 3, width - MARGIN.right - 3])
        : null
    const centerX = (i) => (isBar ? band(i) + band.bandwidth() / 2 : point(i))
    const y = d3.scaleLinear()
        .domain(chart.yDomain || [0, d3.max(chart.values)])
        .nice()
        .range([height - MARGIN.bottom, MARGIN.top])

    drawAxisGrid(svg, { width, height, y, xLabels: chart.labels, xAt: centerX })

    if (isBar) {
        const bars = svg.append('g')
            .selectAll('rect')
            .data(chart.values)
            .join('rect')
            .attr('x', (_, i) => band(i))
            .attr('width', band.bandwidth())
            .attr('rx', 2.5)
            .attr('fill', chart.color)
            .attr('opacity', 0.85)
            .attr('y', (d) => (animate ? y(0) : y(d)))
            .attr('height', (d) => (animate ? 0 : y(0) - y(d)))

        if (animate) {
            bars.transition()
                .duration(900)
                .delay((_, i) => i * 55)
                .ease(d3.easeCubicOut)
                .attr('y', (d) => y(d))
                .attr('height', (d) => y(0) - y(d))
        }
    } else {
        const line = d3.line()
            .x((_, i) => point(i))
            .y((d) => y(d))
            .curve(d3.curveMonotoneX)

        if (chart.type === 'area') {
            const gradientId = `area-${chart.color.replace('#', '')}`
            const gradient = svg.append('defs')
                .append('linearGradient')
                .attr('id', gradientId)
                .attr('x1', '0')
                .attr('y1', '0')
                .attr('x2', '0')
                .attr('y2', '1')
            gradient.append('stop').attr('offset', '0%').attr('stop-color', chart.color).attr('stop-opacity', 0.35)
            gradient.append('stop').attr('offset', '100%').attr('stop-color', chart.color).attr('stop-opacity', 0.02)

            const areaPath = svg.append('path')
                .datum(chart.values)
                .attr('fill', `url(#${gradientId})`)
                .attr('d', d3.area()
                    .x((_, i) => point(i))
                    .y0(height - MARGIN.bottom)
                    .y1((d) => y(d))
                    .curve(d3.curveMonotoneX))
                .attr('opacity', animate ? 0 : 1)

            if (animate) {
                areaPath.transition().delay(150).duration(700).ease(d3.easeCubicOut).attr('opacity', 1)
            }
        }

        const linePath = svg.append('path')
            .datum(chart.values)
            .attr('fill', 'none')
            .attr('stroke', chart.color)
            .attr('stroke-width', 2)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
            .attr('d', line)

        if (animate) {
            const length = linePath.node().getTotalLength()
            linePath
                .attr('stroke-dasharray', `${length} ${length}`)
                .attr('stroke-dashoffset', length)
                .transition()
                .duration(950)
                .ease(d3.easeCubicOut)
                .attr('stroke-dashoffset', 0)
                .on('end', function () {
                    d3.select(this).attr('stroke-dasharray', null).attr('stroke-dashoffset', null)
                })
        }

        const dots = svg.append('g')
            .selectAll('circle')
            .data(chart.values)
            .join('circle')
            .attr('cx', (_, i) => point(i))
            .attr('cy', (d) => y(d))
            .attr('fill', '#fff')
            .attr('stroke', chart.color)
            .attr('stroke-width', 1.5)
            .attr('r', animate ? 0 : 2.5)

        if (animate) {
            dots.transition()
                .delay((_, i) => 180 + i * 70)
                .duration(260)
                .attr('r', 2.5)
        }
    }

    const rule = svg.append('line')
        .attr('y1', MARGIN.top)
        .attr('y2', height - MARGIN.bottom)
        .attr('stroke', chart.color)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 3')
        .attr('opacity', 0)

    const marker = svg.append('circle')
        .attr('r', 4)
        .attr('fill', chart.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0)

    const step = (width - MARGIN.right - MARGIN.left) / chart.values.length
    const slots = chart.values.map((value, index) => {
        const cx = centerX(index)
        return {
            left: MARGIN.left + index * step,
            right: MARGIN.left + (index + 1) * step,
            cx,
            cy: y(value),
            label: chart.labels[index],
            value,
        }
    })

    addHitLayer(svg, {
        width,
        height,
        slots,
        onHit: (d) => {
            rule.attr('x1', d.cx).attr('x2', d.cx).attr('opacity', 0.5)
            marker.attr('cx', d.cx).attr('cy', d.cy).attr('opacity', 1)
            showTip(container, d.cx, d.cy - 8, d.label, d.value, chart.unit)
        },
        onLeave: () => {
            rule.attr('opacity', 0)
            marker.attr('opacity', 0)
            hideTip()
        },
    })
}

function drawColumn(container, chart, animate) {
    const { svg, width, height } = createSvg(container)
    const band = d3.scaleBand()
        .domain(chart.items.map((d) => d.label))
        .range([MARGIN.left, width - MARGIN.right])
        .padding(0.5)
    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - MARGIN.bottom, MARGIN.top])

    drawAxisGrid(svg, {
        width,
        height,
        y,
        xLabels: chart.items.map((d) => d.label),
        xAt: (i) => band(chart.items[i].label) + band.bandwidth() / 2,
    })

    const bars = svg.append('g')
        .selectAll('rect')
        .data(chart.items)
        .join('rect')
        .attr('x', (d) => band(d.label))
        .attr('width', band.bandwidth())
        .attr('rx', 2.5)
        .attr('fill', (d) => d.color)
        .attr('opacity', 0.85)

    const labels = svg.append('g')
        .selectAll('text')
        .data(chart.items)
        .join('text')
        .attr('x', (d) => band(d.label) + band.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', AXIS_FONT)
        .attr('font-weight', 600)
        .attr('fill', '#6b7280')

    if (animate) {
        bars.attr('y', y(0)).attr('height', 0)
            .transition()
            .duration(950)
            .delay((_, i) => i * 90)
            .ease(d3.easeCubicOut)
            .attr('y', (d) => y(d.value))
            .attr('height', (d) => y(0) - y(d.value))

        labels.attr('y', (d) => y(d.value) - 4).text('0%')
            .transition()
            .duration(950)
            .delay((_, i) => i * 90)
            .ease(d3.easeCubicOut)
            .tween('text', function (d) {
                const interpolate = d3.interpolate(0, d.value)
                const node = d3.select(this)
                return (t) => node.text(`${Math.round(interpolate(t))}%`)
            })
    } else {
        bars.attr('y', (d) => y(d.value)).attr('height', (d) => y(0) - y(d.value))
        labels.attr('y', (d) => y(d.value) - 4).text((d) => `${d.value}%`)
    }

    const step = (width - MARGIN.right - MARGIN.left) / chart.items.length
    const slots = chart.items.map((item, index) => {
        const cx = band(item.label) + band.bandwidth() / 2
        return {
            left: MARGIN.left + index * step,
            right: MARGIN.left + (index + 1) * step,
            cx,
            cy: y(item.value),
            label: item.label,
            value: item.value,
        }
    })

    addHitLayer(svg, {
        width,
        height,
        slots,
        onHit: (d) => showTip(container, d.cx, d.cy - 8, d.label, d.value, chart.unit),
        onLeave: hideTip,
    })
}

function drawAll(animate = false) {
    if (!rootRef.value) return
    charts.forEach((chart, index) => {
        const container = rootRef.value.querySelector(`.svg_${index}`)
        if (!container) return
        if (chart.type === 'column') drawColumn(container, chart, animate)
        else drawSeries(container, chart, animate)
    })
}

let raf = 0
let observer
let windowTimer = 0
let lastSize = ''

function advanceTrend() {
    if (!rootRef.value) return
    setTrendWindow((trendWindow.start + 1) % WINDOW_SLOTS)
    const container = rootRef.value.querySelector('.svg_0')
    if (container) drawSeries(container, trendChart, true)
}

function readSize() {
    return rootRef.value ? `${rootRef.value.clientWidth}x${rootRef.value.clientHeight}` : ''
}

onMounted(async () => {
    await nextTick()
    animateNumbers()
    drawAll(true)
    windowTimer = setInterval(advanceTrend, WINDOW_STEP_MS)
    lastSize = readSize()
    observer = new ResizeObserver(() => {
        const size = readSize()
        if (!size || size === lastSize) return
        lastSize = size
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => drawAll(false))
    })
    observer.observe(rootRef.value)
})

onBeforeUnmount(() => {
    observer?.disconnect()
    clearInterval(windowTimer)
    cancelAnimationFrame(raf)
})
</script>

<template>
    <div ref="rootRef" class="svgShowData">
        <ul>
            <li v-for="(item, index) in list" :key="item.title">
                <div class="title">{{ item.title }}</div>
                <div class="content">
                    <div class="left">{{ item.content }}</div>
                    <div class="right">
                        <div class="num">{{ displayed[index] }}</div>
                        <div class="name">{{ item.name }}</div>
                    </div>
                </div>
                <div :class="`svg_${index}`"></div>
                <div class="bottom">
                    <div class="left">{{ item.increase }}</div>
                    <div class="right">{{ item.userNum }}</div>
                </div>
            </li>
        </ul>
        <span v-if="tip.show" class="chartTip" :style="{ left: `${tip.x}px`, top: `${tip.y}px` }">{{ tip.text }}</span>
    </div>
</template>

<style scoped>
.svgShowData {
    position: relative;
    margin-top: 0;
    height: clamp(250px, 30vh, 320px);
    min-height: 0;
}

.svgShowData ul {
    margin: 0;
    padding: 0;
    list-style: none;
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 14px;
}

.svgShowData ul li {
    padding: 14px 16px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--app-border-light);
    border-radius: 10px;
    background-color: var(--app-surface);
    color-scheme: var(--app-color-scheme);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.svgShowData ul li:last-child {
    margin-right: 0;
}

.svgShowData ul li .title {
    flex: 0 0 auto;
    height: auto;
    padding: 0 0 10px;
    font-size: 13px;
    color: #000;
    font-weight: 550;
    border-bottom: 1px solid var(--app-border-light);
}

.svgShowData ul li .content {
    display: flex;
    flex-direction: row;
    flex: 0 0 auto;
    height: auto;
    min-height: 56px;
    padding: 10px 0;
    line-height: 1.5;
    border-bottom: 1px solid var(--app-border-light);
    position: relative;
}

.svgShowData ul li .content .left {
    padding-top: 1%;
    width: 50%;
    font-size: 14px;
    color: var(--app-text-title);
}

.svgShowData ul li .content .right {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 6px;
    font-size: 22px;
    line-height: 1.2;
    text-align: right;
}

.svgShowData ul li .content .right .num {
    padding-bottom: 0;
    height: auto;
    line-height: 1.2;
}

.svgShowData ul li .content .right .name {
    height: auto;
    color: var(--app-text-warm);
    font-size: 10px;
    line-height: 1.2;
    text-align: right;
}

.svgShowData ul li [class*='svg_'] {
    flex: 1;
    height: auto;
    min-height: 104px;
}

.svgShowData .chartTip {
    position: absolute;
    z-index: 3;
    transform: translate(-50%, -120%);
    padding: 4px 8px;
    border-radius: 6px;
    background-color: rgba(47, 58, 74, 0.9);
    color: #fff;
    font-size: 12px;
    line-height: 1.4;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(47, 58, 74, 0.24);
}

.svgShowData ul li .bottom {
    flex: 0 0 auto;
    height: auto;
    padding-top: 8px;
    color: var(--app-text-faint);
    font-size: 12px;
}

.svgShowData ul li .bottom .left {
    float: left;
}

.svgShowData ul li .bottom .right {
    float: right;
}

@media (max-width: 992px) {
    .svgShowData {
        height: auto;
        min-height: 0;
    }

    .svgShowData ul {
        flex-wrap: wrap;
        gap: 12px;
    }

    .svgShowData ul li {
        flex: 1 1 calc(50% - 12px);
        height: 256px;
        padding: 12px 14px;
        margin-right: 0;
    }
}

@media (max-width: 576px) {
    .svgShowData ul li {
        flex: 1 1 100%;
    }
}
</style>

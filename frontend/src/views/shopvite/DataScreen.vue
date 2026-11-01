<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
const now = ref(new Date())
const clockTimer = window.setInterval(() => {
    now.value = new Date()
}, 1000)

const timeText = computed(() =>
    now.value.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
)
const dateText = computed(() =>
    now.value.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' })
)

const kpis = [
    { label: '今日订单', value: '1,286', change: '+8.4%', up: true },
    { label: '销售额', value: '¥92,340', change: '+12.1%', up: true },
    { label: '活跃用户', value: '3,842', change: '-2.3%', up: false },
    { label: '支付转化率', value: '12.6%', change: '+1.2%', up: true },
]

const days = [
    { day: '周一', value: 58, amount: '7.2k' },
    { day: '周二', value: 72, amount: '8.9k' },
    { day: '周三', value: 64, amount: '7.9k' },
    { day: '周四', value: 86, amount: '10.6k' },
    { day: '周五', value: 95, amount: '11.7k' },
    { day: '周六', value: 78, amount: '9.6k' },
    { day: '周日', value: 68, amount: '8.4k' },
]

const channels = [
    { name: '自然搜索', value: 42, color: '#5ac8fa' },
    { name: '内容推荐', value: 28, color: '#4e88f3' },
    { name: '活动投放', value: 18, color: '#9b8cff' },
    { name: '直接访问', value: 12, color: '#34d399' },
]

const regions = [
    { name: '华东', value: '32.6%' },
    { name: '华南', value: '24.1%' },
    { name: '华北', value: '19.8%' },
    { name: '西南', value: '14.3%' },
    { name: '其他', value: '9.2%' },
]

onBeforeUnmount(() => {
    window.clearInterval(clockTimer)
})
</script>

<template>
    <div class="page">
        <header class="pageHeader">
            <div>
                <h2>数据大屏</h2>
                <p>核心经营指标实时概览</p>
            </div>
            <div class="clock">
                <strong>{{ timeText }}</strong>
                <span>{{ dateText }}</span>
            </div>
        </header>

        <div class="kpiGrid">
            <div v-for="kpi in kpis" :key="kpi.label" class="kpiCard">
                <span class="label">{{ kpi.label }}</span>
                <strong>{{ kpi.value }}</strong>
                <span class="change" :class="{ down: !kpi.up }">{{ kpi.change }} 较昨日</span>
            </div>
        </div>

        <div class="panels">
            <section class="panel chartPanel">
                <div class="panelHeader">
                    <h3>近 7 日销售额</h3>
                    <span>单位：千元</span>
                </div>
                <div class="chart">
                    <div v-for="item in days" :key="item.day" class="chartCol">
                        <span class="value">{{ item.amount }}</span>
                        <div class="barTrack">
                            <div class="barFill" :style="{ height: `${item.value}%` }"></div>
                        </div>
                        <span class="day">{{ item.day }}</span>
                    </div>
                </div>
            </section>

            <section class="panel">
                <div class="panelHeader">
                    <h3>流量渠道占比</h3>
                    <span>实时</span>
                </div>
                <ul class="channelList">
                    <li v-for="channel in channels" :key="channel.name">
                        <div class="channelTop">
                            <span>{{ channel.name }}</span>
                            <span>{{ channel.value }}%</span>
                        </div>
                        <div class="channelTrack">
                            <div
                                class="channelFill"
                                :style="{ width: `${channel.value}%`, backgroundColor: channel.color }"
                            ></div>
                        </div>
                    </li>
                </ul>
            </section>

            <section class="panel">
                <div class="panelHeader">
                    <h3>区域销售排行</h3>
                    <span>占比</span>
                </div>
                <ul class="regionList">
                    <li v-for="(region, index) in regions" :key="region.name">
                        <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
                        <span class="name">{{ region.name }}</span>
                        <span class="value">{{ region.value }}</span>
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>

<style scoped>
.page {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 18px clamp(12px, 2vw, 24px);
    box-sizing: border-box;
    color: #dbe7f5;
    background: radial-gradient(circle at 20% 0%, #16324f 0%, #0d1b2a 45%, #0a1420 100%);
}

.pageHeader {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 25px;
}

.pageHeader h2 {
    margin: 0;
    color: #f2f7ff;
    font-size: 20px;
}

.pageHeader p {
    margin: 4px 0 0;
    color: #7f95ad;
    font-size: 13px;
}

.pageHeader .clock {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
}

.pageHeader .clock strong {
    color: #5ac8fa;
    font-size: 22px;
    letter-spacing: 1px;
}

.pageHeader .clock span {
    color: #7f95ad;
    font-size: 12px;
}

.kpiGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
}

.kpiCard {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 18px;
    border: 1px solid rgba(90, 200, 250, 0.18);
    border-radius: 10px;
    background: rgba(21, 42, 63, 0.72);
    box-shadow: 0 0 18px rgba(90, 200, 250, 0.08) inset;
}

.kpiCard .label {
    color: #8ea4ba;
    font-size: 13px;
}

.kpiCard strong {
    color: #f2f7ff;
    font-size: 26px;
    font-weight: 600;
}

.kpiCard .change {
    color: #34d399;
    font-size: 12px;
}

.kpiCard .change.down {
    color: #f87171;
}

.panels {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
}

.panel {
    padding: 18px;
    border: 1px solid rgba(90, 200, 250, 0.14);
    border-radius: 10px;
    background: rgba(17, 34, 52, 0.78);
}

.panelHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.panelHeader h3 {
    margin: 0;
    color: #dbe7f5;
    font-size: 15px;
    font-weight: 500;
}

.panelHeader span {
    color: #7f95ad;
    font-size: 12px;
}

.chart {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: clamp(170px, 20vw, 240px);
}

.chartCol {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: 1;
    height: 100%;
}

.chartCol .value {
    color: #8ea4ba;
    font-size: 11px;
}

.chartCol .barTrack {
    flex: 1;
    display: flex;
    align-items: flex-end;
    width: 100%;
    max-width: 28px;
    border-radius: 5px;
    background: rgba(90, 200, 250, 0.08);
}

.chartCol .barFill {
    width: 100%;
    border-radius: 5px;
    background: linear-gradient(180deg, #5ac8fa, #2f7fd0);
    transition: height 0.5s ease;
}

.chartCol .day {
    color: #7f95ad;
    font-size: 12px;
}

.channelList {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.channelTop {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    color: #b9cbdd;
    font-size: 13px;
}

.channelTrack {
    height: 8px;
    overflow: hidden;
    border-radius: 4px;
    background: rgba(90, 200, 250, 0.1);
}

.channelFill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
}

.regionList {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.regionList li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(90, 200, 250, 0.06);
}

.regionList .rank {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    color: #7f95ad;
    font-size: 12px;
    background: rgba(127, 149, 173, 0.18);
}

.regionList .rank.top {
    color: #0d1b2a;
    background: #5ac8fa;
}

.regionList .name {
    flex: 1;
    color: #b9cbdd;
    font-size: 13px;
}

.regionList .value {
    color: #5ac8fa;
    font-size: 13px;
}

@media (max-width: 576px) {
    .chart {
        height: 170px;
    }

    .pageHeader .clock {
        align-items: flex-start;
    }
}
</style>

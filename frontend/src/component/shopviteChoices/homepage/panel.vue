<script setup>
import Footer from '../footer/footer.vue'
import { computed, ref } from 'vue'

const status = ref(0)

const kpis = [
    {
        label: '总收入',
        value: '¥1,256,789',
        change: '+15.2% 较上周',
        icon: '¥',
        tone: 'blue',
        spark: '0,30 16,26 32,28 48,18 64,21 80,10 100,4',
    },
    {
        label: '订单量',
        value: '8,642',
        change: '+6.8% 较上周',
        icon: '单',
        tone: 'green',
        spark: '0,28 16,24 32,18 48,22 64,14 80,16 100,8',
    },
    {
        label: '新增用户',
        value: '1,208',
        change: '+3.4% 较上周',
        icon: '人',
        tone: 'orange',
        spark: '0,26 16,22 32,24 48,16 64,18 80,12 100,9',
    },
    {
        label: '退款率',
        value: '1.8%',
        change: '-0.6% 较上周',
        icon: '退',
        tone: 'purple',
        spark: '0,8 16,12 32,10 48,18 64,16 80,24 100,28',
    },
]

const rankings = [
    {
        title: '热销商品 TOP3',
        color: '#4e88f3',
        items: [
            { name: '极光降噪无线耳机', value: '2,314 件', percent: 92 },
            { name: '智能恒温水杯', value: '1,806 件', percent: 72 },
            { name: '复古机械键盘', value: '1,245 件', percent: 50 },
        ],
    },
    {
        title: '活跃区域 TOP3',
        color: '#34c38f',
        items: [
            { name: '广东 · 深圳', value: '3,120 单', percent: 88 },
            { name: '浙江 · 杭州', value: '2,486 单', percent: 70 },
            { name: '上海 · 浦东新区', value: '1,932 单', percent: 55 },
        ],
    },
    {
        title: '渠道来源 TOP3',
        color: '#f0a04b',
        items: [
            { name: '自然搜索', value: '42.6%', percent: 86 },
            { name: '内容推荐', value: '31.2%', percent: 63 },
            { name: '活动投放', value: '18.4%', percent: 37 },
        ],
    },
]

const channels = [
    { name: '自然搜索', value: 42, color: '#4e88f3' },
    { name: '内容推荐', value: 28, color: '#34c38f' },
    { name: '活动投放', value: 18, color: '#f0a04b' },
    { name: '直接访问', value: 12, color: '#9b8cff' },
]

const regions = [
    { name: '华东', percent: 34 },
    { name: '华南', percent: 27 },
    { name: '华北', percent: 21 },
    { name: '西南', percent: 18 },
]

const weekTrend = [
    { day: '周一', value: 58 },
    { day: '周二', value: 72 },
    { day: '周三', value: 64 },
    { day: '周四', value: 86 },
    { day: '周五', value: 95 },
    { day: '周六', value: 78 },
    { day: '周日', value: 68 },
]

const donutStyle = computed(() => {
    let start = 0
    const stops = channels.map((channel) => {
        const end = start + channel.value
        const segment = `${channel.color} ${start}% ${end}%`
        start = end
        return segment
    })
    return { background: `conic-gradient(${stops.join(', ')})` }
})

const tableData = [
    { date: '2026-10-23', name: '陈晓', state: '广东省', city: '深圳市', address: '南山区科技园 12 栋', zip: '518000' },
    { date: '2026-10-23', name: '林悦', state: '浙江省', city: '杭州市', address: '西湖区文三路 88 号', zip: '310000' },
    { date: '2026-10-22', name: '王浩', state: '江苏省', city: '南京市', address: '鼓楼区中山路 45 号', zip: '210000' },
    { date: '2026-10-22', name: '赵敏', state: '上海市', city: '浦东新区', address: '张江路 200 号 3 层', zip: '200120' },
    { date: '2026-10-21', name: '周宁', state: '四川省', city: '成都市', address: '高新区天府三街 66 号', zip: '610000' },
    { date: '2026-10-21', name: '吴凡', state: '北京市', city: '海淀区', address: '中关村大街 27 号', zip: '100080' },
    { date: '2026-10-20', name: '郑楠', state: '广东省', city: '广州市', address: '天河区体育西路 103 号', zip: '510000' },
    { date: '2026-10-20', name: '孙然', state: '湖北省', city: '武汉市', address: '洪山区光谷大道 77 号', zip: '430000' },
]
</script>

<template>
    <div class="content">
        <div class="totalSitu">
            <ul>
                <li v-for="kpi in kpis" :key="kpi.label" :class="['kpi', kpi.tone]">
                    <div class="icon">{{ kpi.icon }}</div>
                    <div class="info">
                        <span class="label">{{ kpi.label }}</span>
                        <strong>{{ kpi.value }}</strong>
                        <span class="change">{{ kpi.change }}</span>
                    </div>
                    <svg class="spark" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
                        <polyline
                            :points="kpi.spark"
                            fill="none"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </li>
            </ul>
        </div>

        <div class="dataSitu">
            <ul>
                <li v-for="ranking in rankings" :key="ranking.title">
                    <div class="title">{{ ranking.title }}</div>
                    <ul class="rankItems">
                        <li v-for="(item, index) in ranking.items" :key="item.name">
                            <span class="rankNo">{{ index + 1 }}</span>
                            <div class="rankBody">
                                <div class="rankTop">
                                    <span class="rankName">{{ item.name }}</span>
                                    <span class="rankValue">{{ item.value }}</span>
                                </div>
                                <div class="rankTrack">
                                    <div
                                        class="rankFill"
                                        :style="{ width: `${item.percent}%`, backgroundColor: ranking.color }"
                                    ></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <div class="docu">
            <ul>
                <li>
                    <div class="title">订单渠道分布</div>
                    <div class="donutWrap">
                        <div class="donut" :style="donutStyle">
                            <div class="donutHole">
                                <strong>8,642</strong>
                                <span>总订单</span>
                            </div>
                        </div>
                        <ul class="legend">
                            <li v-for="channel in channels" :key="channel.name">
                                <i :style="{ backgroundColor: channel.color }"></i>
                                <span>{{ channel.name }}</span>
                                <strong>{{ channel.value }}%</strong>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <div class="title">用户地区分布</div>
                    <ul class="regionBars">
                        <li v-for="region in regions" :key="region.name">
                            <div class="regionTop">
                                <span>{{ region.name }}</span>
                                <span>{{ region.percent }}%</span>
                            </div>
                            <div class="regionTrack">
                                <div class="regionFill" :style="{ width: `${region.percent}%` }"></div>
                            </div>
                        </li>
                    </ul>
                </li>
                <li>
                    <div class="title">近 7 日订单趋势</div>
                    <div class="weekChart">
                        <div v-for="item in weekTrend" :key="item.day" class="weekCol">
                            <div class="weekTrack">
                                <div class="weekFill" :style="{ height: `${item.value}%` }"></div>
                            </div>
                            <span>{{ item.day }}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <div class="message">
            <div class="title">
                <ul>
                    <li :class="{ active: status === 0 }" @click="status = 0">配送管理</li>
                    <li :class="{ active: status === 1 }" @click="status = 1">区域管理</li>
                </ul>
            </div>
            <div class="body">
                <el-table :data="tableData" height="100%" style="width: 100%">
                    <el-table-column prop="date" label="日期" width="120" />
                    <el-table-column prop="name" label="姓名" width="100" />
                    <el-table-column prop="zip" label="邮编" width="100" />
                    <el-table-column prop="state" :label="status === 0 ? '省份' : '区域'" width="110" />
                    <el-table-column prop="city" label="市区" width="130" />
                    <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip />
                </el-table>
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

.content > * + * {
    margin-top: 20px;
}

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
    gap: 14px;
    min-height: 112px;
    padding: 18px;
    overflow: hidden;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.totalSitu .kpi .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    color: #fff;
    font-size: 17px;
    font-weight: 600;
}

.totalSitu .kpi.blue .icon {
    background: linear-gradient(135deg, #6fa4ff, #4e88f3);
}

.totalSitu .kpi.green .icon {
    background: linear-gradient(135deg, #63d7ab, #34c38f);
}

.totalSitu .kpi.orange .icon {
    background: linear-gradient(135deg, #f7c07a, #f0a04b);
}

.totalSitu .kpi.purple .icon {
    background: linear-gradient(135deg, #b3a6ff, #8b78f0);
}

.totalSitu .kpi .info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
}

.totalSitu .kpi .label {
    color: var(--app-text-soft);
    font-size: 12px;
}

.totalSitu .kpi .info strong {
    color: var(--app-text);
    font-size: 19px;
    font-weight: 600;
    white-space: nowrap;
}

.totalSitu .kpi .change {
    color: #34c38f;
    font-size: 12px;
}

.totalSitu .kpi .spark {
    position: absolute;
    right: 10px;
    bottom: 12px;
    width: 76px;
    height: 30px;
    opacity: 0.55;
}

.totalSitu .kpi.blue .spark {
    stroke: #4e88f3;
}

.totalSitu .kpi.green .spark {
    stroke: #34c38f;
}

.totalSitu .kpi.orange .spark {
    stroke: #f0a04b;
}

.totalSitu .kpi.purple .spark {
    stroke: #8b78f0;
}

.dataSitu > ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.dataSitu > ul > li {
    padding: 18px;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.dataSitu .title {
    margin-bottom: 16px;
    color: var(--app-text);
    font-size: 14px;
    font-weight: 500;
}

.dataSitu .rankItems {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.dataSitu .rankItems li {
    display: flex;
    align-items: center;
    gap: 10px;
}

.dataSitu .rankNo {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: var(--app-text-soft);
    font-size: 11px;
    background-color: var(--app-surface-sunken);
}

.dataSitu .rankBody {
    flex: 1;
    min-width: 0;
}

.dataSitu .rankTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 5px;
    font-size: 12px;
}

.dataSitu .rankName {
    overflow: hidden;
    color: var(--app-text-subtle);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dataSitu .rankValue {
    flex-shrink: 0;
    color: var(--app-text-soft);
}

.dataSitu .rankTrack {
    height: 6px;
    overflow: hidden;
    border-radius: 3px;
    background-color: var(--app-surface-sunken);
}

.dataSitu .rankFill {
    height: 100%;
    border-radius: 3px;
}

.docu > ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.docu > ul > li {
    padding: 18px;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.docu .title {
    margin-bottom: 16px;
    color: var(--app-text);
    font-size: 14px;
    font-weight: 500;
}

.docu .donutWrap {
    display: flex;
    align-items: center;
    gap: clamp(12px, 1.5vw, 20px);
}

.docu .donut {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(100px, 9vw, 124px);
    height: clamp(100px, 9vw, 124px);
    border-radius: 50%;
}

.docu .donutHole {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 65%;
    height: 65%;
    border-radius: 50%;
    background-color: var(--app-surface);
}

.docu .donutHole strong {
    color: var(--app-text);
    font-size: 15px;
}

.docu .donutHole span {
    color: var(--app-text-muted);
    font-size: 11px;
}

.docu .legend {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.docu .legend li {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--app-text-secondary);
    font-size: 12px;
}

.docu .legend i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.docu .legend strong {
    margin-left: auto;
    color: var(--app-text);
    font-weight: 500;
}

.docu .regionBars {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.docu .regionTop {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: var(--app-text-secondary);
    font-size: 12px;
}

.docu .regionTrack {
    height: 8px;
    overflow: hidden;
    border-radius: 4px;
    background-color: var(--app-surface-sunken);
}

.docu .regionFill {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #7faaf7, #4e88f3);
}

.docu .weekChart {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: clamp(104px, 9vw, 132px);
}

.docu .weekCol {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: 1;
    height: 100%;
}

.docu .weekTrack {
    flex: 1;
    display: flex;
    align-items: flex-end;
    width: 100%;
    max-width: 24px;
    border-radius: 4px;
    background-color: var(--app-surface-sunken);
}

.docu .weekFill {
    width: 100%;
    border-radius: 4px;
    background: linear-gradient(180deg, #7faaf7, #4e88f3);
}

.docu .weekCol span {
    color: var(--app-text-muted);
    font-size: 11px;
}

.message {
    display: flex;
    flex-direction: column;
    height: 360px;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.message .title {
    flex-shrink: 0;
    border-bottom: 1px solid #eef1f5;
}

.message .title ul {
    display: flex;
    gap: 20px;
    margin: 0;
    padding: 0 18px;
    list-style: none;
}

.message .title li {
    padding: 14px 2px;
    color: var(--app-text-secondary);
    font-size: 14px;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
}

.message .title li:hover,
.message .title li.active {
    color: var(--app-primary);
    border-bottom-color: var(--app-primary);
}

.message .body {
    flex: 1;
    min-height: 0;
    padding: 10px 12px 12px;
}

@media (max-width: 1200px) {
    .totalSitu ul {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 992px) {
    .dataSitu > ul,
    .docu > ul {
        grid-template-columns: 1fr;
    }

    .message {
        height: auto;
        min-height: 320px;
    }

    .message .body {
        height: 320px;
    }
}

@media (max-width: 576px) {
    .content {
        padding: 12px;
    }

    .totalSitu ul {
        grid-template-columns: 1fr;
    }

    .totalSitu .kpi {
        min-height: 88px;
    }

    .docu .donutWrap {
        flex-direction: column;
        align-items: flex-start;
    }

    .docu .legend {
        width: 100%;
    }
}
</style>

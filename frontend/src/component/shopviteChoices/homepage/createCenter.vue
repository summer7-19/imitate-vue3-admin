<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Apple, ChatDotRound, Coin, MagicStick, Promotion, Reading, TrendCharts, Trophy, User } from '@element-plus/icons-vue'
import Footer from '../footer/footer.vue'

const announcements = [
  { date: '10-15', message: '关于打击网络暴力言论的公告' },
  { date: '10-14', message: '系统维护通知：今晚22:00-24:00进行系统升级' },
  { date: '10-13', message: '新功能上线：支持视频内容创作' },
  { date: '10-12', message: '关于优化用户体验的重要更新' },
  { date: '10-11', message: '创作者激励计划正式启动' },
  { date: '10-10', message: '关于内容审核标准的调整说明' },
]

const stats = [
  { label: '粉丝数', value: '98,500', note: '比昨天', delta: '24%', trend: 'down', tone: 'pink', icon: User },
  { label: '总阅读量', value: '693,700', note: '环比', delta: '12%', trend: 'up', tone: 'blue', icon: Reading },
  { label: '累计收益', value: '72,000', note: '比昨天', delta: '16%', trend: 'down', tone: 'orange', icon: Coin },
]

const works = [
  {
    date: '2023/10/14',
    title: '绝佳的 vue3 + vite7 前端框架',
    cover: 'https://picsum.photos/seed/shop-vite-work-1/120/120',
    metrics: [
      { label: '展现量', value: 6999 },
      { label: '阅读量', value: 899 },
      { label: '评论量', value: 19 },
      { label: '点赞', value: 189 },
    ],
  },
  {
    date: '2023/10/13',
    title: 'TypeScript 高级类型系统详解',
    cover: 'https://picsum.photos/seed/shop-vite-work-2/120/120',
    metrics: [
      { label: '展现量', value: 1999 },
      { label: '阅读量', value: 499 },
      { label: '评论量', value: 9 },
      { label: '点赞', value: 29 },
    ],
  },
  {
    date: '2023/10/12',
    title: '微前端架构设计与实践指南',
    cover: 'https://picsum.photos/seed/shop-vite-work-3/120/120',
    metrics: [
      { label: '展现量', value: 1999 },
      { label: '阅读量', value: 499 },
      { label: '评论量', value: 9 },
      { label: '点赞', value: 29 },
    ],
  },
  {
    date: '2023/10/11',
    title: 'React 18 新特性深度解析',
    cover: 'https://picsum.photos/seed/shop-vite-work-4/120/120',
    metrics: [
      { label: '展现量', value: 1999 },
      { label: '阅读量', value: 499 },
      { label: '评论量', value: 9 },
      { label: '点赞', value: 29 },
    ],
  },
]

const banners = [
  { src: 'https://picsum.photos/seed/shop-vite-banner-1/900/340', alt: '创作者活动主视觉' },
  { src: 'https://picsum.photos/seed/shop-vite-banner-2/900/340', alt: '平台专题推荐' },
]
const bannerIndex = ref(0)
let bannerTimer = 0

function selectBanner(index) {
  bannerIndex.value = index
  restartBannerTimer()
}

function restartBannerTimer() {
  window.clearInterval(bannerTimer)
  bannerTimer = window.setInterval(() => {
    bannerIndex.value = (bannerIndex.value + 1) % banners.length
  }, 4500)
}

const ranks = [
  { title: '把青春华章写在祖国大地上', tag: '热门', tone: 'blue', icon: Apple },
  { title: '科技创新引领未来发展', tag: '推荐', tone: 'green', icon: 'ring' },
  { title: '数字化转型助力企业升级', tag: '精选', tone: 'orange', icon: ChatDotRound },
  { title: '人工智能改变生活方式', tag: '热门', tone: 'red', icon: Promotion },
  { title: '可持续发展理念深入人心', tag: '推荐', tone: 'orange', icon: ChatDotRound },
]

const creativeList = [
  '程序员未来的出路在哪里？',
  '前端开发技术趋势分析',
  'Vue3生态圈最新动态',
  '人工智能在编程中的应用',
  '远程办公时代的团队协作',
  '开源项目的商业模式探索',
]

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

onMounted(restartBannerTimer)
onBeforeUnmount(() => window.clearInterval(bannerTimer))
</script>

<template>
  <div class="content">
    <div class="layout">
      <section class="colMain">
        <div class="statRow">
          <div v-for="item in stats" :key="item.label" class="stat">
            <span class="statIcon" :class="item.tone">
              <el-icon><component :is="item.icon" /></el-icon>
            </span>
            <span class="statLabel">{{ item.label }}</span>
            <strong class="statValue">{{ item.value }}</strong>
            <span class="statChange">
              {{ item.note }}
              <em :class="item.trend">{{ item.delta }}</em>
            </span>
          </div>
        </div>

        <div class="timeline">
          <article v-for="work in works" :key="work.date" class="timelineItem">
            <p class="timelineDate">{{ work.date }}</p>
            <div class="workCard">
              <img class="workCover" :src="work.cover" :alt="work.title" loading="lazy" />
              <span class="workTitle">{{ work.title }}</span>
              <div class="workMetrics">
                <div v-for="metric in work.metrics" :key="metric.label" class="metric">
                  <strong>{{ metric.value.toLocaleString('en-US') }}</strong>
                  <span>{{ metric.label }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <section class="panel trendPanel">
          <header class="panelHead">
            <span class="headMain">
              <el-icon class="trendIcon"><TrendCharts /></el-icon>
              <span>趋势</span>
            </span>
          </header>
          <div class="chartWrap">
            <svg :viewBox="`0 0 ${CHART.width} ${CHART.height}`" role="img" aria-label="年度数据趋势">
              <defs>
                <linearGradient id="trend-soft" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#8ccdf5" stop-opacity="0.92" />
                  <stop offset="100%" stop-color="#8ccdf5" stop-opacity="0.32" />
                </linearGradient>
                <linearGradient id="trend-strong" x1="0" y1="0" x2="0" y2="1">
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
              <path :d="softArea" fill="url(#trend-soft)" />
              <path :d="strongArea" fill="url(#trend-strong)" />
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
        </section>
      </section>

      <aside class="colSide">
        <section class="panel announcePanel">
          <header class="panelHead">
            <span class="badge">公告</span>
          </header>
          <ul class="announceList">
            <li v-for="item in announcements" :key="item.date">
              <i>{{ item.date }}</i>
              <span :title="item.message">{{ item.message }}</span>
            </li>
          </ul>
        </section>

        <div class="banner">
          <img :src="banners[bannerIndex].src" :alt="banners[bannerIndex].alt" />
          <div class="bannerDots">
            <button
              v-for="(item, index) in banners"
              :key="item.src"
              type="button"
              class="dot"
              :class="{ active: index === bannerIndex }"
              :aria-label="`第 ${index + 1} 张`"
              @click="selectBanner(index)"
            ></button>
          </div>
        </div>

        <section class="panel rankPanel">
          <header class="panelHead">
            <span class="headMain">
              <el-icon class="rankIconHead"><Trophy /></el-icon>
              <span>榜单</span>
            </span>
          </header>
          <ul class="rankList">
            <li v-for="(item, index) in ranks" :key="item.title">
              <span v-if="index < 3" class="crown" :class="`crown-${index + 1}`">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M4 18.4h16M3.2 7.6l4.4 3.3L12 4.8l4.4 6.1 4.4-3.3-1.8 9.2H5L3.2 7.6z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span v-else class="rankNo">{{ index + 1 }}</span>
              <span class="appIcon" :class="`tone-${item.tone}`">
                <svg v-if="item.icon === 'ring'" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="4.5" />
                </svg>
                <el-icon v-else><component :is="item.icon" /></el-icon>
              </span>
              <div class="rankBody">
                <span class="rankTitle" :title="item.title">{{ item.title }}</span>
                <span class="rankTag">{{ item.tag }}</span>
              </div>
            </li>
          </ul>
        </section>

        <section class="panel inspirationPanel">
          <header class="panelHead">
            <span class="headMain">
              <el-icon class="ideaIcon"><MagicStick /></el-icon>
              <span>创作灵感</span>
            </span>
          </header>
          <ul class="topics">
            <li v-for="topic in creativeList" :key="topic">#{{ topic }} #</li>
          </ul>
        </section>
      </aside>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.content {
  width: 100%;
  height: 88%;
  padding: 16px 18px 0;
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
  background-color: rgba(0, 0, 0, 0.16);
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 2.35fr) minmax(280px, 1fr);
  gap: 18px;
  align-items: start;
}

.colMain,
.colSide {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.statRow {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 6px 4px 2px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 4px 10px;
}

.statIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 9px;
  font-size: 18px;
}

.statIcon.pink {
  color: #ef6a8b;
  background-color: color-mix(in srgb, #ef6a8b 13%, var(--app-surface));
}

.statIcon.blue {
  color: #4e88f3;
  background-color: color-mix(in srgb, #4e88f3 13%, var(--app-surface));
}

.statIcon.orange {
  color: #e6934a;
  background-color: color-mix(in srgb, #e6934a 15%, var(--app-surface));
}

.statLabel {
  color: var(--app-text-soft);
  font-size: 12px;
}

.statValue {
  color: var(--app-text-deep);
  font-size: 23px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.statChange {
  color: var(--app-text-muted);
  font-size: 12px;
}

.statChange em {
  margin-left: 4px;
  font-style: normal;
  font-weight: 500;
}

.statChange em.up {
  color: #34c38f;
}

.statChange em.down {
  color: #f56c6c;
}

.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 10px;
  width: 1px;
  background-color: var(--app-border-quiet);
}

.timelineItem {
  position: relative;
}

.timelineItem::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 5px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #d6dbe4;
  box-shadow: 0 0 0 3px var(--app-surface-mute);
}

.timelineDate {
  margin: 0 0 8px;
  color: var(--app-text-muted);
  font-size: 12px;
  letter-spacing: 0.3px;
}

.workCard {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 20px;
  border: 1px solid var(--app-border-quiet);
  border-radius: 6px;
  background-color: var(--app-surface);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.workCard:hover {
  border-color: var(--app-border-strong);
  box-shadow: 0 6px 16px -10px rgba(31, 45, 61, 0.35);
}

.workCover {
  flex-shrink: 0;
  width: 58px;
  height: 58px;
  border-radius: 6px;
  object-fit: cover;
  background-color: var(--app-surface-sunken);
}

.workTitle {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--app-text-body);
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workMetrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(64px, 1fr));
  gap: 10px;
  width: min(52%, 520px);
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.metric strong {
  color: var(--app-text-deep);
  font-size: 17px;
  font-weight: 600;
}

.metric span {
  color: var(--app-text-muted);
  font-size: 12px;
}

.panel {
  border: 1px solid var(--app-border-quiet);
  border-radius: 6px;
  background-color: var(--app-surface);
}

.panelHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: 52px;
  padding: 0 18px;
  border-bottom: 1px solid var(--app-surface-line);
  color: var(--app-text-body);
  font-size: 15px;
}

.headMain {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.trendIcon {
  color: #7c6ff3;
  font-size: 16px;
}

.rankIconHead {
  color: #7c6ff3;
  font-size: 16px;
}

.ideaIcon {
  color: #c56ad6;
  font-size: 16px;
}

.chartWrap {
  padding: 14px 16px 10px;
}

.chartWrap svg {
  display: block;
  width: 100%;
  height: auto;
}

.grid line {
  stroke: var(--app-border-quiet);
  stroke-width: 1;
}

.yAxis text,
.xAxis text {
  fill: var(--app-text-muted);
  font-size: 10.5px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 11px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  background-color: var(--app-primary);
}

.announceList {
  margin: 0;
  padding: 8px 18px 16px;
  list-style: none;
}

.announceList li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  color: var(--app-text-subtle);
  font-size: 13px;
}

.announceList li i {
  flex-shrink: 0;
  color: var(--app-text-muted);
  font-size: 12px;
  font-style: normal;
}

.announceList li span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.banner {
  position: relative;
  height: 168px;
  overflow: hidden;
  border: 1px solid var(--app-border-quiet);
  border-radius: 6px;
  background-color: var(--app-surface-sunken);
}

.banner img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bannerDots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  padding: 0;
  border: none;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.62);
  cursor: pointer;
  transition: width 0.22s ease, background-color 0.22s ease;
}

.dot.active {
  width: 17px;
  background-color: #fff;
}

.rankList {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 14px 18px 18px;
  list-style: none;
}

.rankList li {
  display: flex;
  align-items: center;
  gap: 14px;
}

.crown,
.rankNo {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
}

.crown svg {
  width: 20px;
  height: 20px;
}

.crown-1 {
  color: #f0663f;
}

.crown-2 {
  color: #b8912a;
}

.crown-3 {
  color: #e0b03c;
}

.rankNo {
  border-radius: 50%;
  color: var(--app-text-muted);
  font-size: 12px;
  background-color: var(--app-surface-quiet);
}

.appIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  color: #fff;
  font-size: 22px;
}

.appIcon svg {
  width: 22px;
  height: 22px;
}

.tone-blue {
  background-color: #4e88f3;
}

.tone-green {
  background-color: #2fb36e;
}

.tone-orange {
  background-color: #f0a04b;
}

.tone-red {
  background-color: #f0424d;
}

.rankBody {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.rankTitle {
  overflow: hidden;
  color: var(--app-text-body);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rankTag {
  align-self: flex-start;
  padding: 1px 7px;
  border-radius: 3px;
  color: #fff;
  font-size: 11px;
  line-height: 15px;
  background-color: #f0a04b;
}

.topics {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 10px 18px 16px;
  list-style: none;
}

.topics li {
  color: var(--app-text-body);
  font-size: 13px;
  line-height: 27px;
  cursor: pointer;
  transition: color 0.18s ease;
}

.topics li:hover {
  color: var(--app-primary);
}

@media (max-width: 1200px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 720px) {
  .statRow {
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
  }

  .workCard {
    flex-wrap: wrap;
    gap: 12px 16px;
  }

  .workTitle {
    flex: 1 1 60%;
  }

  .workMetrics {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .workCard,
  .dot,
  .topics li {
    transition: none;
  }
}
</style>

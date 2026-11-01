<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, FullScreen, MagicStick, Odometer, VideoCamera, VideoPause, VideoPlay } from '@element-plus/icons-vue'
import Footer from '../footer/footer.vue'

const DURATION = 60
const streamCover = 'https://picsum.photos/seed/shop-vite-live-room/1280/720'

const modeOptions = ['普通直播', '控流直播', '视频直播']
const activeMode = ref('普通直播')

const progress = ref(2)
const playing = ref(true)
const speed = ref(1)
const muted = ref(false)
const playerRef = ref(null)
let playTimer = 0

const pad = (value) => String(value).padStart(2, '0')
function formatTime(seconds) {
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}

const timeText = computed(() => formatTime(progress.value))
const durationText = computed(() => formatTime(DURATION))

function togglePlay() {
  playing.value = !playing.value
}

function toggleSpeed() {
  speed.value = speed.value === 1 ? 2 : 1
}

function seek(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  if (!rect.width) return
  const ratio = (event.clientX - rect.left) / rect.width
  progress.value = Math.min(DURATION, Math.max(0, Math.round(ratio * DURATION)))
}

function capture() {
  ElMessage.success('已保存当前画面截图（演示）')
}

async function enterFullscreen() {
  const player = playerRef.value
  if (!player) return
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await player.requestFullscreen()
    }
  } catch {
    ElMessage.warning('当前浏览器不支持全屏')
  }
}

const filter = ref('全部')
const filterOptions = ['全部', '用户admin', '系统']
const messages = ref([
  { user: '用户admin', content: '马上就要开始了，好激动！', time: '13:09:12' },
  { user: '用户admin', content: '马上就要开始了，好激动！', time: '13:09:12' },
  { user: '用户admin', content: '马上就要开始了，好激动！', time: '13:09:12' },
  { user: '用户admin', content: '马上就要开始了，好激动！', time: '13:09:12' },
  { user: '用户admin', content: '马上就要开始了，好激动！', time: '13:09:12' },
])
const draft = ref('')
const chatListRef = ref(null)

const visibleMessages = computed(() =>
  filter.value === '全部' ? messages.value : messages.value.filter((item) => item.user === filter.value)
)

function nowTime() {
  const now = new Date()
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function scrollToBottom() {
  nextTick(() => {
    const list = chatListRef.value
    if (list) list.scrollTop = list.scrollHeight
  })
}

function sendMessage() {
  const content = draft.value.trim()
  if (!content) return
  messages.value.push({ user: '我', content, time: nowTime() })
  filter.value = '全部'
  draft.value = ''
  scrollToBottom()
}

const streams = [
  { name: '主流', bitrate: '6 Mbps', fps: 60 },
  { name: '热备', bitrate: '6 Mbps', fps: 60 },
  { name: '冷备', bitrate: '6 Mbps', fps: 60 },
]
const activeStream = ref('热备')
const cdn = ref('KS')
const playFormat = ref('Hls')
const qualities = ['原画', '高清', '标清']
const quality = ref('原画')

function switchQuality() {
  const next = (qualities.indexOf(quality.value) + 1) % qualities.length
  quality.value = qualities[next]
  ElMessage.success(`已切换清晰度：${quality.value}`)
}

function switchStream() {
  activeStream.value = activeStream.value === '主流' ? '热备' : '主流'
  ElMessage.success(`已切换到${activeStream.value}`)
}

function switchPadding() {
  ElMessage.info('已推送垫片画面，观众将看到等待页（演示）')
}

onMounted(() => {
  playTimer = window.setInterval(() => {
    if (!playing.value) return
    progress.value = Math.min(DURATION, progress.value + speed.value)
    if (progress.value >= DURATION) progress.value = 0
  }, 1000)
  scrollToBottom()
})

onBeforeUnmount(() => window.clearInterval(playTimer))
</script>

<template>
  <div class="content">
    <div class="monitorGrid">
      <section class="card chatCard">
        <header class="cardHead">
          <el-icon class="liveIcon"><ChatDotRound /></el-icon>
          <span>聊天窗口</span>
        </header>
        <div class="chatBody">
          <div class="chatTools">
            <el-select v-model="filter" class="chatFilter" size="small">
              <el-option v-for="item in filterOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
          <ul ref="chatListRef" class="msgList">
            <li v-for="(item, index) in visibleMessages" :key="`${item.time}-${index}`" class="msgItem">
              <span class="msgUser">{{ item.user }}</span>
              <p class="msgText">{{ item.content }}</p>
              <time class="msgTime">{{ item.time }}</time>
            </li>
            <li v-if="!visibleMessages.length" class="msgEmpty">暂无该用户的留言</li>
          </ul>
          <form class="composer" @submit.prevent="sendMessage">
            <input v-model="draft" type="text" placeholder="输入留言…" maxlength="200" />
            <button type="submit" :disabled="!draft.trim()">发送</button>
          </form>
        </div>
      </section>

      <div class="centerCol">
        <section class="card previewCard">
          <header class="cardHead">
            <el-icon class="liveIcon"><VideoPlay /></el-icon>
            <span>直播预览</span>
          </header>
          <div ref="playerRef" class="player">
            <img class="stream" :src="streamCover" alt="直播间画面" />
            <div class="controlBar">
              <div class="progress" @click="seek">
                <i :style="{ width: `${(progress / DURATION) * 100}%` }"></i>
              </div>
              <button type="button" class="playBtn" :title="playing ? '暂停' : '播放'" @click="togglePlay">
                <el-icon v-if="playing"><VideoPause /></el-icon>
                <el-icon v-else><VideoPlay /></el-icon>
              </button>
              <span class="time">{{ timeText }}/{{ durationText }}</span>
              <div class="controlRight">
                <button type="button" class="pill" @click="capture">截图</button>
                <button type="button" class="pill" @click="toggleSpeed">{{ speed }}x</button>
                <button type="button" class="plainBtn" :title="muted ? '取消静音' : '静音'" @click="muted = !muted">
                  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                    <path d="M4 9.5v5h3.2L12 18V6L7.2 9.5H4z" fill="currentColor" />
                    <path
                      v-if="!muted"
                      d="M15.4 8.6a4.6 4.6 0 0 1 0 6.8M18 6.4a8 8 0 0 1 0 11.2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                    />
                    <path
                      v-else
                      d="M15.6 9.4l4.8 5.2M20.4 9.4l-4.8 5.2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
                <button type="button" class="plainBtn" title="全屏" @click="enterFullscreen">
                  <el-icon><FullScreen /></el-icon>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="card modeCard">
          <header class="cardHead">
            <el-icon class="liveIcon"><VideoCamera /></el-icon>
            <span>直播方式</span>
          </header>
          <div class="modeTabs">
            <button
              v-for="item in modeOptions"
              :key="item"
              type="button"
              class="modeTab"
              :class="{ active: activeMode === item }"
              @click="activeMode = item"
            >
              {{ item }}
            </button>
          </div>
        </section>
      </div>

      <aside class="sideCol">
        <section class="card actionsCard">
          <header class="cardHead">
            <el-icon class="liveIcon"><MagicStick /></el-icon>
            <span>快捷操作</span>
          </header>
          <div class="actionList">
            <button type="button" class="actionBtn" @click="switchQuality">切换清晰度</button>
            <button type="button" class="actionBtn" @click="switchStream">主备流切换</button>
            <button type="button" class="actionBtn" @click="switchPadding">推流垫片</button>
          </div>
        </section>

        <section class="card statusCard">
          <header class="cardHead">
            <el-icon class="liveIcon"><Odometer /></el-icon>
            <span>直播状态</span>
          </header>
          <div class="statusBody">
            <template v-for="stream in streams" :key="stream.name">
              <div class="statusDivider"><span>{{ stream.name }}</span></div>
              <div class="streamRow">
                <span>码率 {{ stream.bitrate }}</span>
                <span>帧率 {{ stream.fps }}</span>
              </div>
            </template>

            <div class="statusDivider"><span>画面信息</span></div>
            <div class="infoGrid">
              <div class="infoItem"><span>线路</span><strong>{{ activeStream }}</strong></div>
              <div class="infoItem"><span>CDN</span><strong>{{ cdn }}</strong></div>
              <div class="infoItem"><span>播放格式</span><strong>{{ playFormat }}</strong></div>
              <div class="infoItem"><span>画质</span><strong>{{ quality }}</strong></div>
            </div>
          </div>
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

.monitorGrid {
  display: grid;
  grid-template-columns: minmax(250px, 21fr) minmax(0, 60fr) minmax(250px, 19fr);
  gap: 16px;
  align-items: stretch;
}

.card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--app-border-quiet);
  border-radius: 6px;
  background-color: var(--app-surface);
}

.cardHead {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  height: 52px;
  padding: 0 18px;
  border-bottom: 1px solid var(--app-surface-line);
  color: var(--app-text-body);
  font-size: 15px;
  font-weight: 500;
}

.liveIcon {
  color: #c56ad6;
  font-size: 16px;
}

.chatCard {
  min-height: 560px;
}

.chatBody {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  gap: 10px;
  padding: 14px 16px 16px;
}

.chatTools {
  flex-shrink: 0;
}

.chatFilter {
  width: 112px;
}

.chatFilter :deep(.el-select__wrapper) {
  min-height: 32px;
  padding: 4px 10px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px var(--app-border) inset;
}

.msgList {
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 2px 4px 2px 0;
  overflow-y: auto;
  overflow-x: hidden;
  list-style: none;
}

.msgList::-webkit-scrollbar {
  width: 5px;
}

.msgList::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: var(--app-border-strong);
}

.msgList::-webkit-scrollbar-track {
  background: transparent;
}

.msgItem {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px 4px 9px;
  border-radius: 5px;
  transition: background-color 0.18s ease;
}

.msgItem:hover {
  background-color: var(--app-surface-quiet);
}

.msgUser {
  color: #e6a23c;
  font-size: 13px;
}

.msgText {
  margin: 0;
  color: var(--app-text-base);
  font-size: 13px;
  line-height: 1.5;
  word-break: break-word;
}

.msgTime {
  color: var(--app-text-muted);
  font-size: 12px;
  letter-spacing: 0.5px;
}

.msgEmpty {
  padding: 18px 4px;
  color: var(--app-text-muted);
  font-size: 12px;
  text-align: center;
}

.composer {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.composer input {
  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid var(--app-border);
  border-radius: 4px;
  outline: none;
  color: var(--app-text-body);
  font-size: 13px;
  background-color: var(--app-surface);
  transition: border-color 0.18s ease;
}

.composer input:focus {
  border-color: var(--app-primary);
}

.composer input::placeholder {
  color: var(--app-text-placeholder);
}

.composer button {
  flex-shrink: 0;
  width: 64px;
  height: 36px;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 13px;
  letter-spacing: 1px;
  background-color: var(--app-primary);
  cursor: pointer;
  transition: background-color 0.18s ease, opacity 0.18s ease;
}

.composer button:hover:not(:disabled) {
  background-color: var(--app-primary-strong);
}

.composer button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.centerCol {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.previewCard {
  flex: 1;
}

.player {
  position: relative;
  flex: 1;
  min-height: 300px;
  overflow: hidden;
  background-color: #000;
}

.stream {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.controlBar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 12px 8px;
  color: #fff;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.58));
}

.progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.progress i {
  display: block;
  height: 100%;
  background-color: var(--app-primary);
  transition: width 0.4s linear;
}

.playBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  color: #fff;
  font-size: 18px;
  background: none;
  cursor: pointer;
}

.time {
  font-size: 12px;
  letter-spacing: 0.4px;
  color: rgba(255, 255, 255, 0.92);
}

.controlRight {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.pill {
  padding: 3px 10px;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.pill:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.plainBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  color: #fff;
  font-size: 16px;
  background: none;
  cursor: pointer;
  opacity: 0.92;
  transition: opacity 0.18s ease;
}

.plainBtn:hover {
  opacity: 1;
}

.controlBar button:focus-visible,
.modeTab:focus-visible,
.actionBtn:focus-visible,
.composer button:focus-visible {
  outline: none;
}

.modeTabs {
  display: flex;
  padding: 14px 18px 16px;
}

.modeTab {
  height: 30px;
  padding: 0 14px;
  border: 1px solid var(--app-border);
  color: var(--app-text-subtle);
  font-size: 13px;
  background-color: var(--app-surface);
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
}

.modeTab + .modeTab {
  border-left: none;
}

.modeTab:first-child {
  border-radius: 4px 0 0 4px;
}

.modeTab:last-child {
  border-radius: 0 4px 4px 0;
}

.modeTab:hover {
  color: var(--app-primary);
}

.modeTab.active {
  border-color: var(--app-primary);
  color: #fff;
  background-color: var(--app-primary);
}

.sideCol {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.actionsCard {
  flex-shrink: 0;
}

.actionList {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 18px 16px;
}

.actionBtn {
  height: 40px;
  border: none;
  border-radius: 4px;
  color: var(--app-primary);
  font-size: 13px;
  background-color: color-mix(in srgb, var(--app-primary) 8%, var(--app-surface));
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.actionBtn:hover {
  background-color: color-mix(in srgb, var(--app-primary) 15%, var(--app-surface));
}

.statusCard {
  flex: 1;
}

.statusBody {
  padding: 6px 18px 18px;
}

.statusDivider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 14px 0 10px;
  color: var(--app-text-secondary);
  font-size: 13px;
}

.statusDivider::before,
.statusDivider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--app-border-quiet);
}

.streamRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 6px;
  color: var(--app-text-subtle);
  font-size: 13px;
}

.infoGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 18px;
  padding: 0 6px 2px;
}

.infoItem {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--app-text-subtle);
  font-size: 13px;
}

.infoItem strong {
  color: var(--app-text-body);
  font-weight: 500;
}

@media (max-width: 1200px) {
  .monitorGrid {
    grid-template-columns: minmax(260px, 1fr) minmax(0, 2fr);
  }

  .sideCol {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: stretch;
  }

  .actionsCard,
  .statusCard {
    flex: 1;
  }
}

@media (max-width: 760px) {
  .monitorGrid {
    grid-template-columns: minmax(0, 1fr);
  }

  .chatCard {
    min-height: 420px;
  }

  .sideCol {
    grid-column: auto;
    flex-direction: column;
  }

  .player {
    min-height: 220px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .msgItem,
  .pill,
  .modeTab,
  .actionBtn,
  .progress i {
    transition: none;
  }
}
</style>

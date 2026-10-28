<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { ElMessage } from 'element-plus'
import Footer from '../footer/footer.vue'

const filters = ['全部', '提问', '订单', '系统']
const filter = ref('全部')
const input = ref('')
const chatRef = ref(null)

const messages = ref([
    { id: 1, user: '用户admin', content: '这件商品还有优惠券吗？', time: '10:10:10', type: '提问' },
    { id: 2, user: '用户小鹿', content: '刚下单了极光降噪耳机，麻烦尽快发货～', time: '10:11:02', type: '订单' },
    { id: 3, user: '系统', content: '主播已开启「提前购」活动，库存同步完成。', time: '10:11:35', type: '系统' },
    { id: 4, user: '用户Kevin', content: '耳机支持蓝牙 5.3 吗？', time: '10:12:08', type: '提问' },
    { id: 5, user: '用户阿雪', content: '订单 202610231028 申请修改收货地址。', time: '10:13:20', type: '订单' },
    { id: 6, user: '用户Nora', content: '直播间声音有点小，能调大一点吗？', time: '10:14:06', type: '提问' },
    { id: 7, user: '系统', content: '当前在线人数突破 1,200，推流状态稳定。', time: '10:14:58', type: '系统' },
    { id: 8, user: '用户大鹏', content: '这款和上一代有什么区别？', time: '10:15:32', type: '提问' },
])

const filteredMessages = computed(() => {
    if (filter.value === '全部') return messages.value
    return messages.value.filter((message) => message.type === filter.value)
})

const pad = (num) => String(num).padStart(2, '0')
function nowTime() {
    const date = new Date()
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function scrollToBottom() {
    nextTick(() => {
        if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight
    })
}

function send() {
    const content = input.value.trim()
    if (!content) return
    messages.value.push({ id: Date.now(), user: '我', content, time: nowTime(), type: '提问' })
    input.value = ''
    filter.value = '全部'
    scrollToBottom()
}

const methods = [
    { name: '普通直播', desc: '标准推流模式，适合日常带货与内容讲解。' },
    { name: '控流直播', desc: '按网络状况动态调整码率，弱网下优先保证流畅度。' },
    { name: '视频直播', desc: '循环播放预置视频，适合无人值守的长时间直播。' },
]
const activeMethod = ref(0)

const playing = ref(true)
const resolution = ref('1080P')
const resolutions = ['720P', '1080P', '4K']
const viewCount = ref('1,286')

const metrics = ref([
    { label: '在线人数', value: '1,286' },
    { label: '推流码率', value: '4.2 Mbps' },
    { label: '平均延迟', value: '180 ms' },
    { label: '丢帧率', value: '0.02%' },
])

let refreshTimer = null

function handleAction(action) {
    if (action === '切换清晰度') {
        const index = resolutions.indexOf(resolution.value)
        resolution.value = resolutions[(index + 1) % resolutions.length]
        ElMessage.success(`已切换至 ${resolution.value}`)
        return
    }
    if (action === '主备流切换') {
        ElMessage.success('已切换至备用流，画面将在 2 秒内恢复')
        return
    }
    ElMessage.info('推流垫片已下发，请留意画面变化')
}

function selectMethod(index) {
    activeMethod.value = index
}

function refreshStatus() {
    if (refreshTimer) return
    refreshTimer = window.setTimeout(() => {
        const viewers = 1200 + Math.floor(Math.random() * 200)
        viewCount.value = viewers.toLocaleString('en-US')
        metrics.value[0].value = viewCount.value
        metrics.value[2].value = `${160 + Math.floor(Math.random() * 60)} ms`
        refreshTimer = null
        ElMessage.success('状态已刷新')
    }, 400)
}

onBeforeUnmount(() => {
    if (refreshTimer) window.clearTimeout(refreshTimer)
})
</script>

<template>
    <div class="content">
        <div class="main">
            <section class="left panel">
                <div class="title">
                    <span>聊天窗口</span>
                    <span class="count">{{ filteredMessages.length }}</span>
                </div>
                <div class="comment">
                    <div class="search">
                        <el-select v-model="filter" class="select">
                            <el-option v-for="item in filters" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div ref="chatRef" class="commentContent">
                        <ul>
                            <li v-for="message in filteredMessages" :key="message.id">
                                <div class="msgTop">
                                    <span class="user">{{ message.user }}</span>
                                    <span class="type" :class="message.type">{{ message.type }}</span>
                                    <span class="time">{{ message.time }}</span>
                                </div>
                                <p>{{ message.content }}</p>
                            </li>
                        </ul>
                        <el-empty
                            v-if="!filteredMessages.length"
                            description="暂无该类型消息"
                            :image-size="60"
                        />
                    </div>
                    <div class="send">
                        <input v-model="input" type="text" placeholder="输入消息…" @keyup.enter="send">
                        <button @click="send">发送</button>
                    </div>
                </div>
            </section>

            <section class="center">
                <div class="monitor panel">
                    <div class="title">
                        <span>直播预览</span>
                        <span class="liveBadge" :class="{ off: !playing }">{{ playing ? 'LIVE' : '已暂停' }}</span>
                    </div>
                    <div class="video" :class="{ paused: !playing }">
                        <div class="glow"></div>
                        <div class="videoMeta">
                            <span>在线 {{ viewCount }}</span>
                            <span>{{ resolution }}</span>
                        </div>
                        <button class="playBtn" @click="playing = !playing">
                            {{ playing ? '暂停' : '播放' }}
                        </button>
                        <span class="videoHint">模拟直播画面 · 无损推流</span>
                    </div>
                </div>
                <div class="methods panel">
                    <div class="title">直播方式</div>
                    <div class="methodChoose">
                        <ul>
                            <li
                                v-for="(method, index) in methods"
                                :key="method.name"
                                :class="{ active: activeMethod === index }"
                                @click="selectMethod(index)"
                            >
                                {{ method.name }}
                            </li>
                        </ul>
                        <p>{{ methods[activeMethod].desc }}</p>
                    </div>
                </div>
            </section>

            <section class="right">
                <div class="actions panel">
                    <div class="title">快捷操作</div>
                    <div class="choose">
                        <button @click="handleAction('切换清晰度')">切换清晰度（{{ resolution }}）</button>
                        <button @click="handleAction('主备流切换')">主备流切换</button>
                        <button @click="handleAction('推流垫片')">推流垫片</button>
                    </div>
                </div>
                <div class="status panel">
                    <div class="title">直播状态</div>
                    <ul class="statusList">
                        <li v-for="metric in metrics" :key="metric.label">
                            <span>{{ metric.label }}</span>
                            <strong>{{ metric.value }}</strong>
                        </li>
                    </ul>
                    <button class="refresh" @click="refreshStatus">刷新状态</button>
                </div>
            </section>
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
    grid-template-columns: minmax(240px, 0.95fr) minmax(360px, 2fr) minmax(220px, 0.9fr);
    gap: 18px;
    height: calc(100% - 2px);
    min-height: 540px;
}

.left,
.center,
.right {
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
    min-height: 0;
}

.panel {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-shrink: 0;
    height: 52px;
    padding: 0 18px;
    box-sizing: border-box;
    color: var(--app-text);
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid #eef1f5;
}

.title .count {
    padding: 1px 8px;
    border-radius: 9px;
    color: var(--app-primary);
    font-size: 11px;
    font-weight: 400;
    background-color: var(--app-primary-soft);
}

.left .comment {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 14px 16px 16px;
}

.left .search {
    flex-shrink: 0;
    padding-bottom: 12px;
}

.left .search .select {
    width: 120px;
}

.left .commentContent {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.left .commentContent::-webkit-scrollbar {
    width: 5px;
}

.left .commentContent::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #dfe4eb;
}

.left .commentContent ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

.left .commentContent li {
    margin-bottom: 10px;
    padding: 12px;
    border-radius: 8px;
    background-color: var(--app-surface-bright);
    transition: background-color 0.2s;
}

.left .commentContent li:hover {
    background-color: #effafd;
}

.left .commentContent .msgTop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
}

.left .commentContent .user {
    color: #b9772f;
    font-size: 12px;
    font-weight: 500;
}

.left .commentContent .type {
    padding: 0 6px;
    border-radius: 4px;
    font-size: 10px;
    line-height: 16px;
}

.left .commentContent .type.提问 {
    color: var(--app-primary-strong);
    background-color: var(--app-primary-soft);
}

.left .commentContent .type.订单 {
    color: #1f7a4d;
    background-color: #e6fbef;
}

.left .commentContent .type.系统 {
    color: var(--app-text-secondary);
    background-color: #eef1f5;
}

.left .commentContent .time {
    margin-left: auto;
    color: var(--app-text-ghost);
    font-size: 11px;
}

.left .commentContent p {
    margin: 0;
    color: #4b5157;
    font-size: 13px;
    line-height: 1.6;
    word-break: break-word;
}

.left .send {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
    padding-top: 12px;
}

.left .send input {
    flex: 1;
    min-width: 0;
    height: 34px;
    padding: 0 10px;
    border: 1px solid #dfe4eb;
    border-radius: 6px;
    outline: none;
    color: var(--app-text-body);
    font-size: 13px;
    transition: border-color 0.2s;
}

.left .send input:focus {
    border-color: var(--app-primary);
}

.left .send button {
    flex-shrink: 0;
    width: 72px;
    height: 36px;
    border: none;
    border-radius: 8px;
    color: var(--app-primary-strong);
    font-size: 13px;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
}

.left .send button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.14), 0 8px 18px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.left .send button:active {
    transform: translateY(0);
    box-shadow: inset 0 2px 5px rgba(15, 23, 42, 0.18);
}

.center .monitor {
    flex: 1;
    min-height: 240px;
}

.liveBadge {
    padding: 2px 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 11px;
    font-weight: 400;
    background-color: #f56c6c;
    letter-spacing: 1px;
}

.liveBadge.off {
    background-color: var(--app-text-muted);
}

.video {
    position: relative;
    flex: 1;
    min-height: 200px;
    margin: 16px;
    overflow: hidden;
    border-radius: 8px;
    background: radial-gradient(circle at 30% 30%, #2f4b78 0%, #16263d 55%, #0e1826 100%);
}

.video .glow {
    position: absolute;
    top: -30%;
    right: -10%;
    width: 60%;
    height: 80%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(78, 136, 243, 0.45), transparent 65%);
    animation: breathe 4s ease-in-out infinite;
}

.video.paused .glow {
    animation-play-state: paused;
    opacity: 0.4;
}

.videoMeta {
    position: absolute;
    top: 12px;
    left: 12px;
    right: 12px;
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.85);
    font-size: 12px;
}

.videoMeta span {
    padding: 2px 8px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.28);
}

.playBtn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 42px;
    padding: 0 24px;
    border: none;
    border-radius: 21px;
    color: #fff;
    font-size: 14px;
    background-color: transparent;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35), 0 10px 24px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.55);
    cursor: pointer;
    transition: box-shadow 0.2s;
}

.playBtn:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4), 0 14px 30px rgba(0, 0, 0, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.playBtn:active {
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.45);
}

.videoHint {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.6);
    font-size: 11px;
    white-space: nowrap;
}

.center .methods {
    flex-shrink: 0;
}

.methodChoose {
    padding: 16px 18px 18px;
}

.methodChoose ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.methodChoose li {
    padding: 8px 16px;
    color: var(--app-text-secondary);
    font-size: 13px;
    border: none;
    border-radius: 16px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.1), 0 4px 8px rgba(15, 23, 42, 0.07),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.methodChoose li:first-child,
.methodChoose li:last-child {
    border-radius: 16px;
}

.methodChoose li:hover {
    color: var(--app-primary-strong);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.12), 0 8px 16px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.methodChoose li.active {
    color: var(--app-primary-strong);
    font-weight: 500;
    box-shadow: inset 0 2px 5px rgba(15, 23, 42, 0.16);
}

.methodChoose p {
    margin: 12px 0 0;
    color: var(--app-text-soft);
    font-size: 12px;
    line-height: 1.6;
}

.right .actions .choose {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px 18px 18px;
}

.right .actions .choose button {
    height: 38px;
    padding: 0 16px;
    border: none;
    border-radius: 8px;
    color: var(--app-primary-strong);
    font-size: 13px;
    text-align: left;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.right .actions .choose button:hover {
    color: var(--app-primary-strong);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.14), 0 8px 18px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.right .actions .choose button:active {
    transform: translateY(0);
    box-shadow: inset 0 2px 5px rgba(15, 23, 42, 0.18);
}

.right .status {
    flex: 1;
    min-height: 0;
}

.statusList {
    margin: 0;
    padding: 8px 18px 0;
    list-style: none;
}

.statusList li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px dashed #eef1f5;
    font-size: 13px;
}

.statusList li:last-child {
    border-bottom: none;
}

.statusList span {
    color: var(--app-text-soft);
}

.statusList strong {
    color: var(--app-text);
    font-weight: 500;
}

.right .status .refresh {
    margin: 12px 18px 18px;
    height: 36px;
    border: none;
    border-radius: 8px;
    color: var(--app-text-subtle);
    font-size: 13px;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.right .status .refresh:hover {
    color: var(--app-primary-strong);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.14), 0 8px 18px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.right .status .refresh:active {
    transform: translateY(0);
    box-shadow: inset 0 2px 5px rgba(15, 23, 42, 0.18);
}

@keyframes breathe {
    0%,
    100% {
        transform: scale(1);
        opacity: 0.55;
    }

    50% {
        transform: scale(1.15);
        opacity: 0.9;
    }
}

@media (max-width: 1200px) {
    .main {
        grid-template-columns: 1fr;
        height: auto;
    }

    .left {
        height: 420px;
    }

    .center .monitor {
        min-height: 320px;
    }

    .right {
        flex-direction: row;
    }

    .right .actions,
    .right .status {
        flex: 1;
        min-height: 220px;
    }
}

@media (max-width: 768px) {
    .right {
        flex-direction: column;
    }

    .right .actions,
    .right .status {
        min-height: 0;
    }

    .videoHint {
        display: none;
    }
}

@media (max-width: 576px) {
    .content {
        padding: 12px;
    }

    .left {
        height: 380px;
    }

    .methodChoose li {
        flex: 1;
        padding: 6px 8px;
        text-align: center;
    }
}
</style>

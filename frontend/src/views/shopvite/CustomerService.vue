<script setup>
import { nextTick, onBeforeUnmount, ref } from 'vue'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const agents = [
    { name: '客服小云', avatar: '云', status: '在线', desc: '负责订单与售后咨询' },
    { name: '客服阿哲', avatar: '哲', status: '忙碌', desc: '负责技术与账号问题' },
    { name: '客服米粒', avatar: '米', status: '离线', desc: '负责发票与商务合作' },
]

const activeIndex = ref(0)
const input = ref('')
const chatRef = ref(null)

const quickQuestions = ['如何修改登录密码？', '订单多久发货？', '可以开发票吗？']

const messages = ref([
    { id: 1, from: 'agent', text: '你好，我是 Shop Vite 客服小云，很高兴为你服务。请问遇到什么问题了？', time: '09:20' },
    { id: 2, from: 'user', text: '我昨晚下的单，大概什么时候发货？', time: '09:21' },
    { id: 3, from: 'agent', text: '现货商品一般在 24 小时内发出，节假日会顺延。你可以在「我的订单」里查看物流状态。', time: '09:21' },
])

const replies = [
    '收到，我先帮你确认一下，请稍等片刻。',
    '这个问题通常可以通过「设置 - 账号安全」自助解决，需要我给你详细步骤吗？',
    '已为你记录，稍后会有专员跟进处理，请留意站内消息。',
    '感谢你的耐心等待，还有其他可以帮你的吗？',
]
let replyIndex = 0
let replyTimer = null

const pad = (num) => String(num).padStart(2, '0')
function nowTime() {
    const date = new Date()
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function scrollToBottom() {
    nextTick(() => {
        if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight
    })
}

function selectAgent(index) {
    activeIndex.value = index
}

function send(text) {
    const content = (text ?? input.value).trim()
    if (!content) return
    messages.value.push({ id: Date.now(), from: 'user', text: content, time: nowTime() })
    input.value = ''
    scrollToBottom()

    if (replyTimer) window.clearTimeout(replyTimer)
    replyTimer = window.setTimeout(() => {
        messages.value.push({
            id: Date.now() + 1,
            from: 'agent',
            text: replies[replyIndex % replies.length],
            time: nowTime(),
        })
        replyIndex += 1
        scrollToBottom()
        replyTimer = null
    }, 900)
}

onBeforeUnmount(() => {
    if (replyTimer) window.clearTimeout(replyTimer)
})
</script>

<template>
    <div class="page">
        <header class="pageHeader">
            <div>
                <h2>客服端</h2>
                <p>在线解答用户问题，消息发送后会收到模拟回复</p>
            </div>
            <span class="serviceStatus"><i></i>服务中</span>
        </header>

        <div class="chatLayout">
            <aside class="contacts">
                <button
                    v-for="(agent, index) in agents"
                    :key="agent.name"
                    :class="{ active: activeIndex === index }"
                    @click="selectAgent(index)"
                >
                    <span class="avatar">{{ agent.avatar }}</span>
                    <span class="info">
                        <span class="name">{{ agent.name }}</span>
                        <span class="state" :class="{ busy: agent.status === '忙碌', offline: agent.status === '离线' }">
                            {{ agent.status }}
                        </span>
                    </span>
                </button>
            </aside>

            <section class="chat">
                <div class="chatHeader">
                    <div class="chatTitle">
                        <strong>{{ agents[activeIndex].name }}</strong>
                        <span>{{ agents[activeIndex].desc }}</span>
                    </div>
                    <span class="autoTag">自动回复已开启</span>
                </div>

                <div ref="chatRef" class="messages">
                    <div v-for="message in messages" :key="message.id" class="message" :class="message.from">
                        <span v-if="message.from === 'agent'" class="avatar">
                            {{ agents[activeIndex].avatar }}
                        </span>
                        <div class="bubbleWrap">
                            <span class="bubble">{{ message.text }}</span>
                            <span class="time">{{ message.time }}</span>
                        </div>
                    </div>
                </div>

                <div class="quickList">
                    <button v-for="question in quickQuestions" :key="question" @click="send(question)">
                        {{ question }}
                    </button>
                </div>

                <div class="inputRow">
                    <el-input
                        v-model="input"
                        placeholder="输入问题，按 Enter 发送"
                        @keyup.enter="send()"
                    />
                    <button class="sendBtn" @click="send()">发送</button>
                </div>
            </section>
        </div>
        <Footer />
    </div>
</template>

<style scoped>
.page {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 18px clamp(12px, 2vw, 24px);
    box-sizing: border-box;
    background-color: var(--app-surface-plain);
}

.pageHeader {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
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

.serviceStatus {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #1f7a4d;
    font-size: 13px;
}

.serviceStatus i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #34d399;
    box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.18);
}

.chatLayout {
    flex: 1;
    min-height: 0;
    display: flex;
    gap: 18px;
}

.contacts {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 220px;
    padding: 12px;
    overflow-y: auto;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.contacts button {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: none;
    border-radius: 8px;
    background-color: transparent;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s;
}

.contacts button:hover,
.contacts button.active {
    background-color: #eef4ff;
}

.avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    background: linear-gradient(135deg, #7faaf7, #4e88f3);
}

.contacts .info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.contacts .name {
    color: var(--app-text);
    font-size: 14px;
}

.contacts .state {
    color: #34d399;
    font-size: 12px;
}

.contacts .state.busy {
    color: #f59e0b;
}

.contacts .state.offline {
    color: var(--app-text-ghost);
}

.chat {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.chatHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-shrink: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #eef1f5;
}

.chatTitle {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.chatTitle strong {
    color: var(--app-text);
    font-size: 15px;
    font-weight: 500;
}

.chatTitle span {
    color: var(--app-text-muted);
    font-size: 12px;
}

.autoTag {
    flex-shrink: 0;
    padding: 3px 10px;
    border-radius: 12px;
    color: var(--app-primary);
    font-size: 12px;
    background-color: var(--app-primary-soft);
}

.messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 20px;
    background-color: var(--app-surface-raised);
}

.message {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
}

.message.user {
    justify-content: flex-end;
}

.message .avatar {
    width: 32px;
    height: 32px;
    font-size: 13px;
}

.bubbleWrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: min(72%, 520px);
}

.message.user .bubbleWrap {
    align-items: flex-end;
}

.bubble {
    padding: 10px 14px;
    border-radius: 10px;
    color: var(--app-text-body);
    font-size: 13px;
    line-height: 1.6;
    background-color: var(--app-surface);
    box-shadow: 0 1px 3px rgba(47, 58, 74, 0.08);
    word-break: break-word;
}

.message.user .bubble {
    color: #fff;
    background-color: var(--app-primary);
}

.time {
    color: var(--app-text-ghost);
    font-size: 11px;
}

.quickList {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    flex-shrink: 0;
    padding: 12px 20px 0;
    border-top: 1px solid #eef1f5;
}

.quickList button {
    height: 30px;
    padding: 0 14px;
    border: none;
    border-radius: 15px;
    color: var(--app-primary-strong);
    font-size: 12px;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.1), 0 4px 8px rgba(15, 23, 42, 0.07),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
}

.quickList button:hover {
    color: var(--app-primary-strong);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.12), 0 8px 16px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.quickList button:active {
    transform: translateY(0);
    box-shadow: inset 0 2px 5px rgba(15, 23, 42, 0.16);
}

.inputRow {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
    padding: 12px 20px 18px;
}

.inputRow :deep(.el-input) {
    flex: 1;
}

.sendBtn {
    flex-shrink: 0;
    width: 84px;
    height: 38px;
    border: none;
    border-radius: 8px;
    color: var(--app-primary-strong);
    font-size: 14px;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
}

.sendBtn:hover {
    color: var(--app-primary-strong);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.14), 0 8px 18px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.sendBtn:active {
    transform: translateY(0);
    box-shadow: inset 0 2px 5px rgba(15, 23, 42, 0.18);
}

@media (max-width: 768px) {
    .chatLayout {
        flex-direction: column;
    }

    .contacts {
        flex-direction: row;
        width: 100%;
        padding: 8px;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .contacts button {
        flex-shrink: 0;
    }

    .contacts .info {
        display: none;
    }

    .bubbleWrap {
        max-width: 84%;
    }
}
</style>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Lock, Unlock } from '@element-plus/icons-vue'
import { useLockStore } from '@/store/modules/lock'
import { useNotifications } from '@/composables/useNotifications'

const lockStore = useLockStore()
const { push } = useNotifications()

const clock = ref(new Date().toLocaleString('zh-CN', { hour12: false }))
const first = ref('')
const second = ref('')
const attempt = ref('')
const shaking = ref(false)
let timer

function pad(value) {
    return String(value).padStart(2, '0')
}

function tick() {
    const now = new Date()
    clock.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function reject(message) {
    shaking.value = true
    setTimeout(() => {
        shaking.value = false
    }, 420)
    ElMessage.error(message)
}

function submitCode() {
    if (!/^\d{4,8}$/.test(first.value)) {
        reject('解锁码需为 4-8 位数字')
        return
    }
    if (first.value !== second.value) {
        reject('两次输入的解锁码不一致')
        second.value = ''
        return
    }
    lockStore.setCode(first.value)
    first.value = ''
    second.value = ''
    ElMessage.success('解锁码已设置，请输入解锁码恢复使用')
}

function submitUnlock() {
    if (lockStore.unlock(attempt.value)) {
        push('屏幕已解锁', `解锁时间 ${clock.value}`)
        attempt.value = ''
        return
    }
    attempt.value = ''
    reject('解锁码不正确')
}

onMounted(() => {
    tick()
    timer = setInterval(tick, 1000)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
    <div class="lockScreen" :class="{ shaking }">
        <div class="lockPanel">
            <div class="clock">
                <el-icon class="lockIcon">
                    <Lock />
                </el-icon>
                <strong>{{ clock }}</strong>
                <span>屏幕已锁定，界面操作暂时不可用</span>
            </div>

            <form v-if="!lockStore.code" class="lockForm" @submit.prevent="submitCode">
                <p class="tip">首次锁屏请设置 4-8 位数字解锁码</p>
                <el-input v-model="first" type="password" maxlength="8" placeholder="请输入解锁码"
                    autocomplete="off" />
                <el-input v-model="second" type="password" maxlength="8" placeholder="请再次输入确认"
                    autocomplete="off" />
                <el-button type="primary" native-type="submit">
                    <el-icon><Lock /></el-icon>
                    锁定并保存
                </el-button>
            </form>

            <form v-else class="lockForm" @submit.prevent="submitUnlock">
                <p class="tip">请输入解锁码</p>
                <el-input v-model="attempt" type="password" maxlength="8" placeholder="解锁码"
                    autocomplete="off" show-password />
                <el-button type="primary" native-type="submit">
                    <el-icon><Unlock /></el-icon>
                    解锁
                </el-button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.lockScreen {
    position: fixed;
    inset: 0;
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
        radial-gradient(circle at 24% 18%, rgba(78, 136, 243, 0.32), transparent 58%),
        radial-gradient(circle at 78% 82%, rgba(124, 111, 243, 0.28), transparent 55%),
        rgba(12, 16, 24, 0.9);
    backdrop-filter: blur(6px);
}

.lockPanel {
    width: min(360px, 86vw);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    color: #e8ecf3;
    border: 1px solid var(--app-border-on-dark);
    border-radius: 16px;
    background-color: rgba(23, 27, 36, 0.9);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}

.shaking {
    animation: lock-shake 0.42s ease;
}

@keyframes lock-shake {
    0%, 100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-8px);
    }

    75% {
        transform: translateX(8px);
    }
}

.lockScreen .clock {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.lockScreen .clock .lockIcon {
    font-size: 30px;
    color: #9dc0ff;
}

.lockScreen .clock strong {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
}

.lockScreen .clock span {
    color: #98a2b3;
    font-size: 12px;
}

.lockScreen .lockForm {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.lockScreen .lockForm .tip {
    margin: 0;
    color: #98a2b3;
    font-size: 12px;
    text-align: center;
}
</style>

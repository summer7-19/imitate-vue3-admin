import { computed, reactive } from 'vue'

const STORAGE_KEY = 'shop-vite:notifications'
const MAX_ITEMS = 20

function readSaved() {
    try {
        const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
        if (!Array.isArray(saved)) return []
        return saved.filter((item) => item && typeof item.title === 'string').slice(0, MAX_ITEMS)
    } catch {
        return []
    }
}

const state = reactive({ items: readSaved() })

function persist() {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
        // 隐私模式下 sessionStorage 不可用时只保留本次内存记录
    }
}

function formatTime(date) {
    const pad = (value) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function useNotifications() {
    const items = computed(() => state.items)
    const unread = computed(() => state.items.filter((item) => !item.read).length)

    // 只记录本次会话里真实发生过的事件，不放置示例数据
    function push(title, detail = '') {
        state.items.unshift({ id: `${Date.now()}-${title}`, title, detail, read: false, time: formatTime(new Date()) })
        state.items = state.items.slice(0, MAX_ITEMS)
        persist()
    }

    function markAll() {
        state.items.forEach((item) => {
            item.read = true
        })
        persist()
    }

    function clear() {
        state.items = []
        persist()
    }

    return { items, unread, push, markAll, clear }
}

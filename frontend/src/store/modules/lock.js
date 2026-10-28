import { defineStore } from 'pinia'

const STORAGE_KEY = 'shop-vite:lock'

function readSaved() {
    try {
        const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
        if (!saved || typeof saved !== 'object') return { active: false, code: '' }
        return { active: Boolean(saved.active), code: typeof saved.code === 'string' ? saved.code : '' }
    } catch {
        return { active: false, code: '' }
    }
}

export const useLockStore = defineStore('lock', {
    state: () => readSaved(),
    actions: {
        persist() {
            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ active: this.active, code: this.code }))
            } catch {
                // 隐私模式下 sessionStorage 不可用时只保留本次内存状态
            }
        },
        lock() {
            this.active = true
            this.persist()
        },
        // 首次锁屏需要先设置解锁码，之后每次解锁都要校验它
        setCode(code) {
            this.code = code
            this.persist()
        },
        unlock(code) {
            if (!this.code || code !== this.code) return false
            this.active = false
            this.persist()
            return true
        },
    },
})

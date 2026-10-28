import { defineStore } from 'pinia'

const STORAGE_KEY = 'shop-vite:theme'

export const PRIMARY_PRESETS = [
    { label: '海蓝', value: '#4e88f3' },
    { label: '紫罗兰', value: '#7c6ff3' },
    { label: '松绿', value: '#2fa96a' },
    { label: '琥珀', value: '#e6934a' },
    { label: '珊瑚', value: '#e35d6a' },
]

export const FONT_SCALES = [
    { label: '小', value: 0.9 },
    { label: '标准', value: 1 },
    { label: '大', value: 1.12 },
]

const DEFAULTS = {
    isDark: false,
    primary: PRIMARY_PRESETS[0].value,
    fontScale: 1,
    locale: 'zh-cn',
}

function readSaved() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
        return saved && typeof saved === 'object' ? saved : {}
    } catch {
        return {}
    }
}

export const useThemeStore = defineStore('theme', {
    state: () => ({ ...DEFAULTS, ...readSaved() }),
    getters: {
        isChinese: (state) => state.locale === 'zh-cn',
    },
    actions: {
        apply() {
            const root = document.documentElement
            root.classList.toggle('dark', this.isDark)
            root.style.setProperty('--app-primary', this.primary)
            root.style.setProperty('--el-color-primary', this.primary)
            root.style.setProperty('--el-color-primary-dark-2', `color-mix(in srgb, ${this.primary} 80%, #000)`)
            for (let level = 1; level <= 9; level += 1) {
                root.style.setProperty(
                    `--el-color-primary-light-${level}`,
                    `color-mix(in srgb, ${this.primary} ${100 - level * 10}%, var(--app-surface))`,
                )
            }

            const app = document.getElementById('app')
            if (app) {
                // zoom 会同比放大布局盒，反向收缩宽高可避免出现滚动条
                app.style.zoom = String(this.fontScale)
                app.style.width = `${100 / this.fontScale}%`
                app.style.height = `${100 / this.fontScale}%`
            }

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    isDark: this.isDark,
                    primary: this.primary,
                    fontScale: this.fontScale,
                    locale: this.locale,
                }))
            } catch {
                // 隐私模式下 localStorage 不可用时只保留本次内存状态
            }
        },
        toggleDark() {
            this.isDark = !this.isDark
            this.apply()
            return this.isDark
        },
        setPrimary(value) {
            this.primary = value
            this.apply()
        },
        setFontScale(value) {
            this.fontScale = value
            this.apply()
        },
        toggleLocale() {
            this.locale = this.locale === 'zh-cn' ? 'en' : 'zh-cn'
            this.apply()
            return this.locale
        },
    },
})

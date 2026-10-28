import { computed } from 'vue'
import { useUserStore } from '@/store/modules/user'

const PERMISSION_LABELS = {
    admin: '管理员',
    editor: '编辑',
    dashboard: '看板',
    table: '表格',
}

function labelOf(code) {
    return PERMISSION_LABELS[code] || code
}

export function useUserProfile() {
    const userStore = useUserStore()

    const isLoggedIn = computed(() => Boolean(userStore.accessToken))
    const displayName = computed(
        () => userStore.username || (isLoggedIn.value ? '已登录用户' : '访客')
    )
    const avatarText = computed(() => {
        if (userStore.username) return userStore.username.slice(0, 1).toUpperCase()
        return isLoggedIn.value ? 'U' : '访'
    })
    const permissionText = computed(() =>
        userStore.permissions.length
            ? userStore.permissions.map(labelOf).join(' / ')
            : '暂无权限信息'
    )
    const permissionItems = computed(() =>
        userStore.permissions.map((code) => ({ code, label: labelOf(code) }))
    )
    const email = computed(() => userStore.email)

    const roleLabel = computed(() => {
        if (!isLoggedIn.value) return '未登录'
        const permissions = userStore.permissions
        if (!permissions.length) return '已登录'
        if (permissions.includes('admin')) return '管理员'
        if (permissions.includes('editor')) return '编辑'
        return permissions.map(labelOf).join(' / ')
    })

    return {
        userStore,
        isLoggedIn,
        displayName,
        avatarText,
        roleLabel,
        permissionText,
        permissionItems,
        email,
    }
}

import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

export function useUserMenu() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    function goLogin() {
        router.push({ path: '/login', query: { redirect: route.fullPath } })
    }

    function goProfile() {
        router.push('/profile')
    }

    function goSettings() {
        router.push('/settings')
    }

    async function logout() {
        if (!userStore.accessToken) {
            goLogin()
            return
        }
        try {
            await ElMessageBox.confirm('确定要退出当前账号吗？', '退出登录', {
                type: 'warning',
                confirmButtonText: '退出',
                cancelButtonText: '取消',
            })
        } catch {
            return
        }
        try {
            await userStore.logout()
        } catch {
            // 后端不可用时 logout 的 finally 仍会清理本地登录态
        }
        ElMessage.success('已退出登录')
        goLogin()
    }

    function handleCommand(command) {
        if (command === 'login') return goLogin()
        if (command === 'profile') return goProfile()
        if (command === 'settings') return goSettings()
        if (command === 'logout') return logout()
        return undefined
    }

    return { userStore, goLogin, goProfile, goSettings, logout, handleCommand }
}

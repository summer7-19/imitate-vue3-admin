<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => router.push('/')
</script>

<template>
    <div class="thanking">
        <div class="card">
            <div class="badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
                </svg>
            </div>
            <h1>感谢您的支持</h1>
            <p>您的支持是我们前进的动力</p>
            <p>希望我的代码可以帮助你</p>
            <div class="actions">
                <button class="primary" @click="goHome">返回首页</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.thanking {
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(circle at 50% 0%, var(--app-primary-softer) 0%, var(--app-surface-raised) 45%, var(--app-surface) 100%);
    overflow: auto;
}

.card {
    padding: clamp(32px, 6vw, 64px) clamp(28px, 7vw, 80px);
    width: min(560px, 100%);
    text-align: center;
    letter-spacing: 3px;
    line-height: 2;
    color: #46555c;
    background-color: #ffffff;
    border-radius: 18px;
    box-shadow: 0 18px 45px rgba(96, 148, 166, 0.16);
    animation: rise 0.6s ease both;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-6px);
    box-shadow: 0 26px 55px rgba(96, 148, 166, 0.22);
}

.badge {
    margin: 0 auto 18px;
    width: 64px;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #b2e7f8;
    border-radius: 50%;
    background-color: rgba(183, 184, 184, 0.14);
}

.badge svg {
    width: 30px;
    height: 30px;
}

h1 {
    margin: 0 0 12px;
    font-size: clamp(30px, 5vw, 48px);
    line-height: 1.35;
    color: #93cadd;
}

p {
    margin: 0;
    font-size: clamp(14px, 1.8vw, 17px);
    color: #66777e;
}

.actions {
    margin-top: 32px;
}

.primary {
    padding: 0 34px;
    height: 44px;
    font-size: 15px;
    letter-spacing: 2px;
    color: #ffffff;
    border: none;
    border-radius: 22px;
    background-color: #b1e0f1;
    cursor: pointer;
    transition: background-color 0.25s ease, transform 0.25s ease;
}

.primary:hover {
    background-color: #95cadd;
}

.primary:active {
    transform: scale(0.97);
}

@keyframes rise {
    from {
        opacity: 0;
        transform: translateY(18px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 576px) {
    .thanking {
        padding: 16px;
    }

    .card {
        letter-spacing: 2px;
    }
}
</style>

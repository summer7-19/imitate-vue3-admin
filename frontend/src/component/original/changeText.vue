<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const repoUrl = 'https://github.com/zxwk1998/vue3-admin-better'
const index = ref(0)
const text = ref([
    'Hello World',
    'Hello Vue',
    'Hello JavaScript',
    'Hello TypeScript',
])

let timer

onMounted(() => {
    timer = setInterval(() => {
        index.value = (index.value + 1) % text.value.length
    }, 3000)
})

onBeforeUnmount(() => {
    clearInterval(timer)
})
</script>

<template>
    <transition name="slide-up" mode="out-in">
        <div :key="index" id="text">** &nbsp;{{ text[index] }}</div>
    </transition>
    <div class="bless">
        <div class="left">
            <p>
                <a :href="repoUrl" target="_blank" rel="noopener noreferrer" class="star">star:19k</a>
                愿您新的一年平安喜乐，万事顺意，所得皆所愿！
                <a :href="repoUrl" target="_blank" rel="noopener noreferrer">admin-plus演示地址</a> ，
                <RouterLink to="/shop-vite">shop-vite演示地址</RouterLink>
            </p>
        </div>
        <div class="right">
            <svg viewBox="0 0 250 250" width="100%" height="100%" aria-hidden="true">
                <path fill="rgb(64,158,255)" d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z">
                </path>
                <path fill="#fff" class="octo-arm"
                    d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                    style="transform-origin: 130px 106px;"></path>
                <path fill="#fff" class="octo-body"
                    d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z">
                </path>
            </svg>
        </div>
    </div>
</template>

<style scoped>
a {
    text-decoration: none;
}

#text {
    margin-top: 5px;
    width: 100%;
    min-height: 22px;
    font-size: 14px;
    color: #999;
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(25%);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translateY(-25%);
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.5s ease;
}

.bless {
    height: 10%;
    min-height: 72px;
    padding: 12px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    position: relative;
    background-color: var(--app-surface);
    border: 1px solid var(--app-border-light);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.bless .left {
    padding: 0;
    flex: 1;
    min-width: 0;
}

.bless .left p {
    overflow-wrap: anywhere;
}

.bless .left .star {
    display: inline-block;
    padding: 0 6px;
    background-color: black;
    color: white;
}

.bless .right {
    flex-shrink: 0;
    width: clamp(32px, 5.5%, 60px);
    height: 90%;
    margin-right: 6px;
    border-radius: 10px;
}

.bless .right .octo-arm {
    animation: octocat-wave 560ms ease-in-out infinite;
}

@keyframes octocat-wave {
    0% {
        transform: rotate(15deg);
    }

    50% {
        transform: rotate(-45deg);
    }

    100% {
        transform: rotate(20deg);
    }
}

@media (max-width: 576px) {
    .bless {
        height: auto;
        padding: 8px 0;
    }

    .bless .left {
        font-size: 12px;
        line-height: 1.6;
    }
}
</style>

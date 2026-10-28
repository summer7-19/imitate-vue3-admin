<script setup>
import { ref } from 'vue'
import pkg from '../../../package.json'

const deps = pkg.dependencies || {}
const devDeps = pkg.devDependencies || {}

const list = ref([
    { name: 'Vue 版本', v: deps.vue },
    { name: 'Vue Router', v: deps['vue-router'] },
    { name: 'Pinia 版本', v: deps.pinia },
    { name: 'Axios 版本', v: deps.axios },
    { name: 'Element Plus', v: deps['element-plus'] },
    { name: 'Vite 版本', v: devDeps.vite }
].filter((item) => item.v))

const version = ref([
    {
        name: '构建时间',
        detail: __BUILD_TIME__
    },
    {
        name: '运行环境',
        detail: import.meta.env.MODE
    },
    {
        name: '用户代理',
        detail: navigator.userAgent
    }
])
</script>

<template>
    <div class="versionInfo">
        <div class="content">
            <p>依赖信息</p>
            <p>Vite 版本</p>
            <ul>
                <li v-for="value in list" :key="value.name">
                    <div class="version">{{ value.name }}</div>
                    <div class="details">{{ value.v }}</div>
                </li>
            </ul>
            <div class="msg">
                <div class="msgContent">
                    <p class="msgTitle">系统信息</p>
                    <div class="msgDetail" v-for="value in version" :key="value.name">
                        <div class="left">{{ value.name }}</div>
                        <div class="right" :title="value.detail">{{ value.detail }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.versionInfo {
    margin-top: 0;
    width: 100%;
    height: auto;
    min-height: 366px;
    color-scheme: var(--app-color-scheme);
    background-color: var(--app-surface);
    border: 1px solid var(--app-border-light);
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.versionInfo .content {
    display: flex;
    flex-direction: column;
    padding: 16px 18px;
    height: auto;
    box-sizing: border-box;
}

.versionInfo .content > p {
    font-size: 14px;
    color: #5b5a5a;
}

.versionInfo .content > p + p {
    margin-top: 6px;
    color: var(--app-text-soft);
    font-size: 12px;
}

.versionInfo .content ul {
    flex-shrink: 0;
    margin: 10px 0 14px;
    list-style: none;
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.versionInfo .content ul li {
    padding: 12px 10px;
    flex: 1;
    min-width: 0;
    font-size: 14px;
    text-align: center;
    border: 1px solid var(--app-border-light);
    border-radius: 8px;
    background-color: rgb(249, 250, 252);
    position: relative;
    transition: transform 0.2s ease, border-color 0.2s ease;
}

.versionInfo .content ul li:hover {
    transform: translateY(-2px);
    border-color: var(--app-border-strong);
    background-color: var(--app-surface);
}

.versionInfo .content ul li:last-child {
    margin-right: 0;
}

.versionInfo .content ul li .version {
    color: #5b5a5a;
}

.versionInfo .content ul li .details {
    margin-top: 4px;
    font-weight: 600;
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.versionInfo .content .msg {
    flex: 1;
    min-height: 196px;
    margin-top: 0;
    height: auto;
    overflow: hidden;
    border: 1px solid var(--app-border-light);
    border-radius: 8px;
    background-color: rgb(249, 250, 252);
}

.versionInfo .content .msg .msgContent {
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 12px 14px;
    height: auto;
    box-sizing: border-box;
}

.versionInfo .content .msg .msgContent .msgTitle {
    flex-shrink: 0;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--app-border-light);
    font-size: 16px;
    font-weight: 500;
    color: var(--app-text);
}

.versionInfo .content .msg .msgContent .msgDetail {
    flex-shrink: 0;
    padding: 8px 4px;
    font-size: 14px;
    color: #5b5a5a;
    border-bottom: 1px solid var(--app-border-light);
    display: flex;
    flex-direction: row;
    gap: 12px;
}

.versionInfo .content .msg .msgContent .msgDetail:last-child {
    border-bottom: none;
}

.versionInfo .content .msg .msgContent .msgDetail .left {
    flex-shrink: 0;
}

.versionInfo .content .msg .msgContent .msgDetail .right {
    margin-left: auto;
    max-width: 75%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: right;
}

@media (max-width: 992px) {
    .versionInfo {
        height: auto;
        min-height: 0;
    }

    .versionInfo .content ul {
        flex-wrap: wrap;
        gap: 8px;
    }

    .versionInfo .content ul li {
        flex: 1 1 calc(33.33% - 8px);
        margin-right: 0;
    }

    .versionInfo .content .msg {
        height: auto;
        min-height: 196px;
    }
}

@media (max-width: 576px) {
    .versionInfo .content ul li {
        flex: 1 1 calc(50% - 8px);
    }

    .versionInfo .content .msg {
        min-height: 244px;
    }

    .versionInfo .content .msg .msgContent .msgDetail {
        flex-direction: column;
        gap: 2px;
    }

    .versionInfo .content .msg .msgContent .msgDetail .right {
        max-width: 100%;
        text-align: left;
    }
}
</style>

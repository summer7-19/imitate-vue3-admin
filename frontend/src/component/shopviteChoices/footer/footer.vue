<script setup>
import { useRoute } from 'vue-router'
import pkg from '../../../../package.json'

const route = useRoute()

const deps = { ...pkg.dependencies, ...pkg.devDependencies }

const depList = [
    { name: 'Vue', value: deps.vue },
    { name: 'Vue Router', value: deps['vue-router'] },
    { name: 'Pinia', value: deps.pinia },
    { name: 'Element Plus', value: deps['element-plus'] },
    { name: 'Axios', value: deps.axios },
    { name: 'D3', value: deps.d3 },
    { name: 'Vite', value: deps.vite },
].filter((item) => item.value)

const year = new Date().getFullYear()
const buildTime = __BUILD_TIME__
const mode = import.meta.env.MODE
const appVersion = pkg.version || '0.0.0'
</script>

<template>
    <div class="chooseFun footer">
        <span class="copy">Copyright © {{ year }} Vue Shop Vite</span>
        <span class="divider" aria-hidden="true"></span>
        <span class="meta">版本 V{{ appVersion }}</span>
        <span class="meta">构建 {{ buildTime }}</span>
        <span class="meta">环境 {{ mode }}</span>
        <span class="meta path" :title="route.fullPath">路由 {{ route.path }}</span>
        <el-popover placement="top" trigger="click" :width="280">
            <template #reference>
                <button type="button" class="versionBtn" title="查看依赖版本说明">版本说明</button>
            </template>
            <div class="versionPop">
                <p class="versionPopTitle">依赖版本</p>
                <ul class="versionPopList">
                    <li v-for="item in depList" :key="item.name">
                        <span>{{ item.name }}</span>
                        <strong>{{ item.value.replace(/^[\^~]/, '') }}</strong>
                    </li>
                </ul>
                <p class="versionPopTip">版本号取自 frontend/package.json，构建时间在每次打包时重新生成。</p>
            </div>
        </el-popover>
    </div>
</template>

<style scoped>
.chooseFun {
    grid-column: 1 / -1;
    margin: 14px auto 24px;
    width: 100%;
    min-height: 40px;
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 8px 14px;
    box-sizing: border-box;
    color: #767575;
    font-size: 12px;
    text-align: center;
    border: 1px solid var(--app-border);
    background-color: var(--app-surface);
    border-radius: 8px;
}

.copy {
    flex-shrink: 0;
    font-weight: 600;
    color: #5b6472;
}

.divider {
    width: 1px;
    height: 14px;
    background-color: var(--app-border-strong);
}

.meta {
    padding: 2px 8px;
    color: #7d8590;
    font-size: 11px;
    border-radius: 6px;
    background-color: #f4f6fa;
}

.path {
    max-width: 40%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.versionBtn {
    height: 26px;
    padding: 0 12px;
    color: var(--app-primary);
    font-size: 11px;
    border: 1px solid rgba(78, 136, 243, 0.4);
    border-radius: 13px;
    background-color: rgba(78, 136, 243, 0.08);
    cursor: pointer;
    transition: background-color 0.18s ease, transform 0.18s ease;
}

.versionBtn:hover {
    background-color: rgba(78, 136, 243, 0.16);
    transform: translateY(-1px);
}

.versionPop {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 2px;
}

.versionPopTitle {
    margin: 0;
    padding-bottom: 6px;
    color: var(--app-text);
    font-size: 13px;
    font-weight: 600;
    border-bottom: 1px solid #edf1f7;
}

.versionPopList {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.versionPopList li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 3px 0;
    font-size: 12px;
}

.versionPopList li span {
    color: var(--app-text-soft);
}

.versionPopList li strong {
    color: var(--app-text);
    font-weight: 600;
}

.versionPopTip {
    margin: 0;
    padding-top: 6px;
    color: var(--app-text-muted);
    font-size: 11px;
    line-height: 1.6;
    border-top: 1px dashed #edf1f7;
}
</style>

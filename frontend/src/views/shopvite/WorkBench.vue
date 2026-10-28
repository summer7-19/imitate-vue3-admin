<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentAdd, Promotion, Plus, UserFilled } from '@element-plus/icons-vue'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const hour = new Date().getHours()
const greeting = computed(() => {
    if (hour < 6) return '夜深了，注意休息'
    if (hour < 12) return '早上好，开始今天的创作吧'
    if (hour < 18) return '下午好，继续保持节奏'
    return '晚上好，记得回顾今天的进展'
})

const todos = reactive([
    { id: 1, text: '确认首页视觉稿的最终版本', done: true },
    { id: 2, text: '整理模板市场的分类规则', done: false },
    { id: 3, text: '补充客服自动回复的常见问题', done: false },
    { id: 4, text: '检查窄屏下的表格横向滚动', done: false },
    { id: 5, text: '输出本周数据看板复盘', done: false },
])

const finishedCount = computed(() => todos.filter((todo) => todo.done).length)

const quickActions = [
    { label: '新建项目', icon: Plus },
    { label: '发起审批', icon: DocumentAdd },
    { label: '写日报', icon: Promotion },
    { label: '邀请成员', icon: UserFilled },
]

const projects = ref([
    { name: 'Shop Vite 官网改版', owner: '设计组', progress: 82, status: '进行中' },
    { name: '模板市场 2.0', owner: '前端组', progress: 64, status: '联调中' },
    { name: '数据看板重构', owner: '数据组', progress: 38, status: '开发中' },
    { name: '客服工作台迁移', owner: '体验组', progress: 96, status: '验收中' },
])

const weeklyDone = [
    { day: '周一', count: 3 },
    { day: '周二', count: 5 },
    { day: '周三', count: 2 },
    { day: '周四', count: 6 },
    { day: '周五', count: 4 },
    { day: '周六', count: 1 },
    { day: '周日', count: 2 },
]

function handleAction(label) {
    ElMessage.info(`「${label}」为演示入口，流程暂未接入`)
}

function toggleTodo(todo) {
    if (todo.done) {
        ElMessage.success(`已完成：${todo.text}`)
    }
}
</script>

<template>
    <div class="page">
        <header class="pageHeader">
            <div>
                <h2>工作台</h2>
                <p>{{ greeting }}，今天还有 {{ todos.length - finishedCount }} 项待办</p>
            </div>
            <span class="date">2026 年 10 月 24 日 · 周六</span>
        </header>

        <div class="stats">
            <div class="statCard">
                <span class="label">待办事项</span>
                <strong>{{ todos.length - finishedCount }}</strong>
                <span class="hint">已完成 {{ finishedCount }} 项</span>
            </div>
            <div class="statCard">
                <span class="label">进行中项目</span>
                <strong>{{ projects.length }}</strong>
                <span class="hint">其中 2 个本周交付</span>
            </div>
            <div class="statCard">
                <span class="label">本周完成</span>
                <strong>{{ weeklyDone.reduce((sum, item) => sum + item.count, 0) }}</strong>
                <span class="hint">较上周 +12%</span>
            </div>
        </div>

        <div class="quickActions">
            <button v-for="action in quickActions" :key="action.label" @click="handleAction(action.label)">
                <el-icon><component :is="action.icon" /></el-icon>
                <span>{{ action.label }}</span>
            </button>
        </div>

        <div class="columns">
            <section class="panel todoPanel">
                <div class="panelHeader">
                    <h3>我的待办</h3>
                    <span>{{ finishedCount }}/{{ todos.length }}</span>
                </div>
                <ul class="todoList">
                    <li v-for="todo in todos" :key="todo.id">
                        <el-checkbox v-model="todo.done" @change="toggleTodo(todo)">
                            <span :class="{ done: todo.done }">{{ todo.text }}</span>
                        </el-checkbox>
                    </li>
                </ul>
            </section>

            <section class="panel">
                <div class="panelHeader">
                    <h3>本周完成量</h3>
                    <span>共 23 项</span>
                </div>
                <div class="weeklyBars">
                    <div v-for="item in weeklyDone" :key="item.day" class="barItem">
                        <div class="barTrack">
                            <div class="barFill" :style="{ height: `${item.count * 14}%` }"></div>
                        </div>
                        <span>{{ item.day }}</span>
                    </div>
                </div>
            </section>
        </div>

        <section class="panel">
            <div class="panelHeader">
                <h3>近期项目</h3>
                <span>按更新时间排序</span>
            </div>
            <div class="projectList">
                <div v-for="project in projects" :key="project.name" class="projectItem">
                    <div class="projectInfo">
                        <span class="name">{{ project.name }}</span>
                        <span class="meta">{{ project.owner }} · {{ project.status }}</span>
                    </div>
                    <el-progress
                        :percentage="project.progress"
                        :stroke-width="8"
                        :show-text="false"
                        color="#4e88f3"
                    />
                    <span class="percent">{{ project.progress }}%</span>
                </div>
            </div>
        </section>
        <Footer />
    </div>
</template>

<style scoped>
.page {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 18px clamp(12px, 2vw, 24px);
    box-sizing: border-box;
    background-color: var(--app-surface-plain);
}

.pageHeader {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
}

.pageHeader h2 {
    margin: 0;
    color: var(--app-text);
    font-size: 20px;
}

.pageHeader p {
    margin: 4px 0 0;
    color: var(--app-text-soft);
    font-size: 13px;
}

.pageHeader .date {
    color: var(--app-text-muted);
    font-size: 13px;
}

.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
}

.statCard {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 18px;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.statCard .label {
    color: var(--app-text-soft);
    font-size: 13px;
}

.statCard strong {
    color: var(--app-text);
    font-size: 28px;
    line-height: 1.2;
}

.statCard .hint {
    color: var(--app-primary);
    font-size: 12px;
}

.quickActions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin: 20px 0;
}

.quickActions button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 46px;
    padding: 0 18px;
    border: none;
    border-radius: 10px;
    color: var(--app-primary-strong);
    font-size: 14px;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
}

.quickActions button:hover {
    color: var(--app-primary-strong);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.14), 0 8px 18px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.quickActions button:active {
    transform: translateY(0);
    box-shadow: inset 0 2px 5px rgba(15, 23, 42, 0.18);
}

.columns {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
}

.panel {
    padding: 18px;
    border-radius: 10px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.06);
}

.panelHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.panelHeader h3 {
    margin: 0;
    color: var(--app-text);
    font-size: 15px;
    font-weight: 500;
}

.panelHeader span {
    color: var(--app-text-muted);
    font-size: 12px;
}

.todoList {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.todoList .done {
    color: var(--app-text-ghost);
    text-decoration: line-through;
}

.weeklyBars {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8px;
    height: 160px;
    padding: 0 4px;
}

.barItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
    height: 100%;
}

.barTrack {
    flex: 1;
    display: flex;
    align-items: flex-end;
    width: 100%;
    max-width: 26px;
    border-radius: 6px;
    background-color: #f1f4f9;
}

.barFill {
    width: 100%;
    min-height: 6px;
    border-radius: 6px;
    background: linear-gradient(180deg, #7faaf7, #4e88f3);
    transition: height 0.4s ease;
}

.barItem span {
    color: var(--app-text-muted);
    font-size: 12px;
}

.projectList {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.projectItem {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 2fr) 44px;
    align-items: center;
    gap: 16px;
}

.projectInfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.projectInfo .name {
    overflow: hidden;
    color: var(--app-text);
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.projectInfo .meta {
    color: var(--app-text-muted);
    font-size: 12px;
}

.projectItem .percent {
    color: var(--app-text-secondary);
    font-size: 13px;
    text-align: right;
}

@media (max-width: 992px) {
    .columns {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 576px) {
    .projectItem {
        grid-template-columns: 1fr 44px;
    }

    .projectItem :deep(.el-progress) {
        grid-column: 1 / -1;
    }

    .weeklyBars {
        height: 130px;
    }
}
</style>

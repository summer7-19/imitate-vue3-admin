<template>
    <div class="sideBar" :class="{ 'openSide': sideBarStore.openSidebar }">
        <div class="content">
            <ul>
                <li v-for="(value, index) in options"
                    :style="{ backgroundColor: index === activeIndex ? 'rgb(44, 113, 169)' : 'transparent' }"
                    @click="jumpRoute(value, index)" @mouseover="index === 2 ? isOn = true : isOn = false" @mouseleave="leaveSide">
                    <div class="pic" v-show="value.pathData">
                        <svg :viewBox="value.viewBox" width="80%" height="100%">
                            <path fill="#fff" :d="value.pathData"></path>
                        </svg>
                    </div>
                    <div v-show="sideBarStore.openSidebar" class="right" :class="{'open': changeList}">{{ value.name }}</div>
                </li>
            </ul>
        </div>
    </div>
    <div class="openParts" v-show="sideBarStore.openSidebar" :class="{'isOpen':changeList}">
        <button @click="openList" :style="{backgroundColor:activeIndex===2?'rgb(44, 113, 169)':'transparent'}">
            <span>{{ changeList ? '>' : '<' }}</span>
        </button>
    </div>
    <div class="selectPart" v-show="(isOn || isOnPart) && !sideBarStore.openSidebar" @mouseover="isOnPart = true" @mouseleave="isOnPart = false">
        <ul>
            <li v-for="value in componentList" :key="value.name">
                <a :href="value.path">{{ value.name }}</a>
            </li>
        </ul>
    </div>
</template>
<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.sideBar {
    width: 3%;
    height: 100%;
    color: #f7f3f3;
    border: 1px solid #000;
    background-color: black;
    transition: width 0.5s;
}

.sideBar img {
    background-color: #111010;
}

.sideBar.openSide {
    width: 13%;
    text-align: center;
}

.sideBar .content {
    padding-top: 10%;
    width: 100%;
    height: 70%;
}

.sideBar .content ul {
    margin-top: 5%;
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    list-style: none;
}

.sideBar .content ul li {
    margin: 0px 1rem 1rem 0;
    flex: 1;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    border-radius: 5px;
}

.sideBar .content ul li:hover {
    background-color: rgb(44, 113, 169) !important;
}

.sideBar .content ul li .pic {
    margin-left: 5%;
    margin-top: 2%;
    width: 2rem;
    height: 65%;
    color: #f7f3f3;
}
.sideBar .content ul li .pic svg {
    vertical-align: middle;
}
.sideBar .content ul li .right {
    padding-top: 7%;
    padding-left: 2rem;
    font-size: 14px;
}
.sideBar .content ul li .right.open {
    padding-top: 2.5%;
}
.sideBar .content ul li:first-child {
    pointer-events: none;
}

.sideBar .content ul li:first-child .right {
    padding-top: 2px;
    padding-left: 5px;
    font-size: 22px;
}

.selectPart {
    position: absolute;
    left: 4%;
    top: 20%;
    width: 5%;
    height: 70%;
    z-index: 1000;
    background-color: #3a3838;
}

.selectPart ul {
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.selectPart ul li {
    flex: 1;
    margin: 1%;
    font-size: 12px;
    color: #f7f3f3;
    cursor: pointer;
}

.selectPart ul li a {
    color: #f7f3f3;
    text-decoration: none;
}

.openParts {
    position: absolute;
    left: 10%;
    top: 23%;
}
.openParts.isOpen{
    top: 18.5%;
}
.openParts button {
    color: #f7f3f3;
    font-size: 15px;
    border: none;
    background-color: #050505;
}

.sideBar .footer {
    margin-top: 10px;
    height: 10%;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 86%;
    left: 1.5%;
}

.sideBar .footer button {
    margin: 15px auto;
}
</style>

<script setup>
import { ref } from 'vue'
import { useSidebarStore } from '../../stores/sideBar';
import { useRouter, RouterView } from 'vue-router';
const sideBarStore = useSidebarStore()
let activeIndex = ref(1)
let isOn = ref(false)
let isOnPart = ref(false)
const router = useRouter()
const putList = ref([])
const changeList = ref(false)
const leaveSide = () => {
    setTimeout(() => {
        isOn.value = false
    },700)
}

const openList = () => {
    changeList.value = !changeList.value
    if (changeList.value) {
        putList.value = options.value
        options.value = [...options.value.slice(0,3),...componentList.value,...options.value.slice(3)]
    } else {
        options.value = putList.value
    }
}
const options = ref([
    {
        'pathData': 'M1 3h4l7 12 7-12h4L12 22 1 3zm8.667 0L12 7l2.333-4h4.035L12 14 5.632 3h4.035z',
        'name': 'Vue3 Admin Better',
        'viewBox': '0 0 24 24'
    },
    {
        'pathData': 'M512 128 128 447.936V896h255.936V640H640v256h255.936V447.936z',
        'name': '首页',
        'viewBox': '0 0 1024 1024',
        'path': '/'
    },
    {
        'pathData': 'M317.056 128 128 344.064V896h768V344.064L706.944 128zm-14.528-64h418.944a32 32 0 0 1 24.064 10.88l206.528 236.096A32 32 0 0 1 960 332.032V928a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V332.032a32 32 0 0 1 7.936-21.12L278.4 75.008A32 32 0 0 1 302.528 64',
        'name': '组件',
        'viewBox': '0 0 1024 1024'
    },
    {
        'pathData': 'M317.056 128 128 344.064V896h768V344.064L706.944 128zm-14.528-64h418.944a32 32 0 0 1 24.064 10.88l206.528 236.096A32 32 0 0 1 960 332.032V928a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V332.032a32 32 0 0 1 7.936-21.12L278.4 75.008A32 32 0 0 1 302.528 64',
        'name': '模板市场',
        'viewBox': '0 0 1024 1024',
        'path': '/shop'
    },
    {
        'pathData': 'm64 448 832-320-128 704-446.08-243.328L832 192 242.816 545.472zm256 512V657.024L512 768z',
        'name': '找工作',
        'viewBox': '0 0 1024 1024',
        'path': '/job'
    },
    {
        'pathData': 'M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768m48-176a48 48 0 1 1-96 0 48 48 0 0 1 96 0m-48-464a32 32 0 0 1 32 32v288a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32',
        'name': '错误页',
        'viewBox': '0 0 1024 1024'
    },
    {
        'pathData': 'M176 416a112 112 0 1 0 0 224 112 112 0 0 0 0-224m0 64a48 48 0 1 1 0 96 48 48 0 0 1 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96',
        'name': '支持我们',
        'viewBox': '0 0 1024 1024',
        'path': '/thank'
    }
])
const componentList = ref([
    {
        'path': '/',
        'name': '首页'
    },
    {
        'path': '/shop',
        'name': '模板市场'
    },
    {
        'path': '/job',
        'name': '找工作'
    },
    {
        'path': '/thank',
        'name': '支持我们'
    }
])
function jumpRoute(item, index) {
    activeIndex.value = index
    router.push(item.path)
}
</script>
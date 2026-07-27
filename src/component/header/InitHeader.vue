<script setup>
import { ref } from 'vue'
import InitSideBar from '../sideBar/InitSideBar.vue';
import { useSideBarContent } from '@/stores/sideBar.js';
const store = useSideBarContent()
const list = ref([
    {
        title: "Home",
        content: "Lorem"
    },
    {
        title: "About",
        content: "Lorem"
    },
    {
        title: "Contact",
        content: "Lorem"
    },
    {
        title: "Blog",
        content: "Lorem"
    }, {
        title: "Shop",
        content: "Lorem"
    }
])
</script>

<template>
    <div class="headerMain">
        <div class="header">
            <div class="left">
                <button @click="store.setState">
                    < </button>
                        <button>工具</button>
                        <span>drggg</span>
                        <span>/</span>
                        <span>yyy</span>
            </div>
            <div class="right">
                <div class="search">
                    <span>搜索</span>
                </div>
                <button id="changeColor">^</button>
                <button id="talkAi">1</button>
                <button id="user">1</button>
                <button id="user">1</button>
                <button id="user">1</button>
                <button id="user">1</button>
                <button id="user">1</button>
                <button id="user">1</button>
                <button id="user">1</button>
                <button id="user">1</button>
                <button id="user">1</button>
                <div class="userInfo">
                    <span>用户信息</span>
                </div>
            </div>

        </div>
        <div class="sideBarShow">
            <div class="option" v-for="value in list">
                <span>{{ value.title }}</span>
                <!-- <span>X</span> -->
            </div>
        </div>
    </div>
</template>


<style scoped>
.headerMain{
    width: 100%;
    height: 12%;
    border: 1px solid #000;
}
.header {
    width: 100%;
    height: 58%;
    border: 1px solid #000;
    opacity: 0.6;
    display: flex;
    flex-direction: row;
}

.header .left {
    width: 15%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    border: 1px solid #000;
}

.header .left button {
    margin: 0 3%;
    height: 40%;
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 5px;
}

.header .right {
    margin-left: auto;
    width: 45%;
    height: 100%;
    border: 1px solid #0b0b0b;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
}

.header .right .search {
    width: 18%;
    height: 55%;
    color: #fff;
    font-size: 16px;
    border: 1px solid #000;
    border-radius: 5px;
    background-color: #1c5f89;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.header .right button {
    margin: 0 1%;
    width: 5%;
    height: 35%;
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 5px;
}

.header .right .userInfo {
    margin: 0 1%;
    width: 15%;
    border: 1px solid #000;
}

.sideBarShow {
    margin: 0 auto;
    width: 100%;
    height: 40%;
    border: 1px solid #000;
    opacity: 0.6;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.option {
    margin: 0 1%;
    width: 4.5%;
    height: 70%;
    border: 1px solid rgb(78, 136, 243);
    border-radius: 5px;
    font-size: 14px;
    color: rgb(78, 136, 243);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
<script setup>
import { ref } from 'vue'
const list = ref([
    {
        name: 'vue版本',
        v: '3.2.0'
    },
    {
        name: 'Vue router',
        v: '4.0.0'
    },
    {
        name: 'Vuex版本',
        v: '4.0.0'
    },
    {
        name: 'Axios版本',
        v: '0.21.1'
    },
    {
        name: 'Element-plus',
        v: '2.0.0'
    },
    {
        name: 'Sass版本',
        v:'1.45.1'
    }
])
const version = ref([
    {
        name:'构建时间',
        detail:'2025-12-22 11:02:43'
    },{
        name:'运行环境',
        detail:'production'
    },{
        name:'用户代理',
        detail:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
    }
])
</script>

<template>
    <div class="versionInfo">
        <div class="content">
            <p>依赖信息</p>
            <p>Rspack版本</p>
            <ul>
                <li v-for="value in list">
                    <div class="version">{{ value.name }}</div>
                    <div class="details">^{{ value.v }}</div>
                </li>
            </ul>
            <div class="msg">
                <div class="msgContent">
                     <p style="border-bottom: 1px solid #c9c7c7;font-size: 20px;color: black;margin-bottom: 0.5%;padding-bottom: 0.5%;">系统信息</p>
                     <div class="msgDetail" v-for="value in version">
                        <div class="left">{{ value.name }}</div>
                        <div class="right">{{ value.detail }}</div>
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
    margin-top: 1%;
    width: 100%;
    height: 45%;
    color-scheme:light ;
    background-color: #fff;
    border-radius: 10px;
    /* border: 1px solid #000; */
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 
                0 4px 10px rgba(0, 0, 0, 0.1);
}
.versionInfo .content {
    padding: 1%;
    height: 100%;
}
.versionInfo .content p {
    font-size: 14px;
    color: #5b5a5a;
}
.versionInfo .content ul {
    list-style: none;
    height: 20%;
    display: flex;
    flex-direction: row;
}

.versionInfo .content ul li {
    margin-right:1%;
    padding-top: 10px;
    flex: 1;
    font-size: 14px;
    text-align: center;
    /* border: 1px solid #5d5d5d; */
    border-radius: 7px;
    background-color: rgb(241, 245, 249);
    box-shadow: 0 10px 25px rgba(186, 185, 185, 0.1), 
                0 4px 10px rgba(140, 137, 137, 0.1);
    position: relative; 
    /* z-index: 999; */
}
.versionInfo .content ul li:hover {
    transform: translateY(-5%);
    background-color: #fff;
}
.versionInfo .content ul li:last-child {
    margin-right: 0;
}
.versionInfo .content ul li .version {
    color: #5b5a5a;
}
.versionInfo .content ul li .details {
    font-weight: 600;
    font-size: 20px;
}
.versionInfo .content .msg{
    margin-top: 1%;
    height: 55%;
    border-radius: 5px;
    background-color: rgb(245, 247, 249);
    box-shadow: 0 10px 25px rgba(221, 218, 218, 0.1), 
                0 4px 10px rgba(0, 0, 0, 0.1);
}
.versionInfo .content .msg .msgContent {
    padding: 1%;
    height: 100%;
}
.versionInfo .content .msg .msgContent .msgDetail{
    padding: 5px;
    font-size: 16px;
    color: #5b5a5a;
    border-bottom: 1px solid #c9c7c7;
    display: flex;
    flex-direction: row;
    position: relative;
}
.versionInfo .content .msg .msgContent .msgDetail .left{
    float: left;
}
.versionInfo .content .msg .msgContent .msgDetail .right{
    position: absolute;
    right: 0%;
    float: right;
}
</style>

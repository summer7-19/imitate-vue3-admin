<script setup>
import { ref } from 'vue'
const activeIndex = ref(0)
const list = ref([{
    name: '全部模板',
    path: 'M640 384v256H384V384zm64 0h192v256H704zm-64 512H384V704h256zm64 0V704h192v192zm-64-768v192H384V128zm64 0h192v192H704zM320 384v256H128V384zm0 512H128V704h192zm0-768v192H128V128z'
}, {
    name: '中后台管理',
    path: 'M359.168 768H160a32 32 0 0 1-32-32V192H64a32 32 0 0 1 0-64h896a32 32 0 1 1 0 64h-64v544a32 32 0 0 1-32 32H665.216l110.848 192h-73.856L591.36 768H433.024L322.176 960H248.32zM832 192H192v512h640zM342.656 534.656a32 32 0 1 1-45.312-45.312L444.992 341.76l125.44 94.08L679.04 300.032a32 32 0 1 1 49.92 39.936L581.632 524.224 451.008 426.24 342.656 534.592z'
}, {
    name: '企业官网',
    path: 'M192 128v704h384V128zm-32-64h448a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32'
}, {
    name: '博客网站',
    path: 'm469.952 554.24 52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z'
}, {
    name: '实用工具',
    path: 'M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896'
}, {
    name: 'AI 大模型',
    path: 'm161.92 580.736 29.888 58.88C171.328 659.776 160 681.728 160 704c0 82.304 155.328 160 352 160s352-77.696 352-160c0-22.272-11.392-44.16-31.808-64.32l30.464-58.432C903.936 615.808 928 657.664 928 704c0 129.728-188.544 224-416 224S96 833.728 96 704c0-46.592 24.32-88.576 65.92-123.264'
}, {
    name: '镜像加速',
    path: 'M320 288V128h64v352h256V128h64v160h160v64H704v128h160v64H704v128h160v64H704v160h-64V544H384v352h-64V736H128v-64h192V544H128v-64h192V352H128v-64z'
}, {
    name: '落地页',
    path: 'M512 128a384 384 0 1 0 0 768 384 384 0 0 0 0-768m0-64a448 448 0 1 1 0 896 448 448 0 0 1 0-896'
}
])


const moudleList = ref([
    {
        "id": 1,
        "image_url": "https://picsum.photos/400/400?random=101",
        "name": "极光系列 降噪无线耳机",
        "content": "采用主动降噪技术，续航长达40小时，为您带来沉浸式的音频体验。",
        "price": 799.00
    },
    {
        "id": 2,
        "image_url": "https://picsum.photos/400/400?random=102",
        "name": "极简主义 智能手环 8代",
        "content": "全天候血氧监测，1.62英寸AMOLED大屏，支持150+种运动模式。",
        "price": 249.50
    },
    {
        "id": 3,
        "image_url": "https://picsum.photos/400/400?random=103",
        "name": "复古机械键盘 (青轴)",
        "content": "打字机风格键帽，全键无冲设计，配合多色RGB灯效，重温经典手感。",
        "price": 458.00
    },
    {
        "id": 4,
        "image_url": "https://picsum.photos/400/400?random=104",
        "name": "手冲咖啡 进阶套装",
        "content": "包含高硼硅玻璃滤杯、细口手冲壶及精选阿拉比卡咖啡豆。",
        "price": 188.00
    },
    {
        "id": 5,
        "image_url": "https://picsum.photos/400/400?random=105",
        "name": "轻量化 户外双肩包",
        "content": "防泼水面料，人体工学减负设计，20L大容量满足周边游需求。",
        "price": 299.00
    },
    {
        "id": 6,
        "image_url": "https://picsum.photos/400/400?random=106",
        "name": "智能恒温 电加热水杯",
        "content": "三档控温，5分钟快速沸腾，机身小巧轻便，差旅必备神器。",
        "price": 129.00
    },
    {
        "id": 7,
        "image_url": "https://picsum.photos/400/400?random=107",
        "name": "北欧风 实木氛围台灯",
        "content": "天然胡桃木底座，支持无极调光，暖黄灯光营造温馨居家氛围。",
        "price": 88.50
    },
    {
        "id": 8,
        "image_url": "https://picsum.photos/400/400?random=108",
        "name": "限定版 宇航员潮玩摆件",
        "content": "精密电镀工艺，星空细节刻画，是书桌展示与礼品赠送的绝佳选择。",
        "price": 365.00
    }
])
</script>

<template>
    <div class="shop">
        <div class="header">
            <div class="left">
                <span>Shop Vite模板市场</span>
            </div>
            <div class="right">
                <button>建议</button>
            </div>
        </div>
        <div class="mainBox">
            <div class="sideList">
                <div class="sideListHeader">
                    模板分类
                </div>
                <ul>
                    <li v-for="(value, index) in list" :style="{ color: activeIndex === index ? '#4fc3f7' : '#5e5d5d' }"
                        @click="activeIndex = index">
                        <svg viewBox="0 0 1024 1024" width="12%" style="vertical-align: middle;"
                            :style="{ fill: activeIndex === index ? '#4fc3f7' : '#5e5d5d' }">
                            <path :d="value.path"></path>
                        </svg>
                        <span style="margin-left: 1rem;">{{ value.name }}</span>
                    </li>
                </ul>
            </div>
            <div class="mainContent">
                <div class="mainHeader">
                    <span style="font-size:22px; position: absolute;top: 25%;left: 2%;">模板列表</span>
                    <div class="right">
                        <span>共xxx个模板</span>
                        <button>全部</button>
                        <button>付费</button>
                        <button>免费</button>
                    </div>
                </div>
                <div>
                </div>
                <div class="content">
                    <ul>
                        <li v-for="value in moudleList">
                            <div class="top"><img :src="value.image_url" alt="pic"></div>
                            <div style="padding-left: 0.1rem;font-size: 16px;color: #000;font-weight: 500;">{{ value.name }}</div>
                            <span style="padding-left: 1.1rem;">{{ value.content }}</span>
                            <div class="bottom">
                                <span>${{ value.price }}</span>
                                <button id="pay">购买</button>
                                <button id="addCar">加入购物车</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>


    </div>
</template>

<style scoped>
.shop {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.shop .header {
    width: 100%;
    height: 6%;
    box-shadow: 0 0 5px #9a9696;
    position: relative;
}

.shop .header .left {
    position: absolute;
    top: 25%;
    padding-left: 0.5rem;
    font-size: 20px;
}

.shop .header .right {
    position: absolute;
    top: 25%;
    left: 95%;
}

.shop .mainBox {
    margin-top: 1%;
    width: 100%;
    height: 94%;
    display: flex;
    flex-direction: row;
}

.shop .mainBox .sideList {
    margin-left: 1%;
    width: 12%;
    /* border: 1px solid #000; */
    border-radius: 5px;
    box-shadow: 0 0 5px #9a9696;
}

.shop .mainBox .sideList .sideListHeader {
    margin: 5% 5%;
    height: 5%;
    border-bottom: 1px solid #d7d2d2;
    font-size: 22px;
    color: #a4a3a3;
}

.shop .mainBox .sideList ul {
    height: 90%;
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
}

.shop .mainBox .sideList ul li {
    padding: 0.7rem;
    font-size: 16px;
}

.shop .mainBox .sideList ul li:hover {
    background-color: #ebe6e6;
}

.shop .mainBox .mainContent {
    margin: 0 1.5%;
    width: 85%;
    /* border: 1px solid #000; */
    box-shadow: 0 0 5px #c2bebe;
    border-radius: 5px;
}

.shop .mainBox .mainContent .mainHeader {
    width: 100%;
    height: 8%;
    /* border: 1px solid #000; */
    display: flex;
    flex-direction: row;
    position: relative;
    box-shadow: 0 0 2px rgb(144, 142, 142);
}

.shop .mainBox .mainContent .mainHeader span {
    color: #8e8d8d;
}

.shop .mainBox .mainContent .mainHeader .right {
    width: 50%;
    position: absolute;
    top: 30%;
    left: 80%;
    font-size: 18px;
}

.shop .mainBox .mainContent .mainHeader .right button {
    margin-left: 3%;
    border: 1px solid #8e8d8d;
    background-color: #fff;
    box-shadow: 0 0 2px #8e8d8d;
}

.shop .mainBox .mainContent .content {
    width: 100%;
    height: 90%;
    overflow-y: auto;
    overflow-x: hidden;
}

.shop .mainBox .mainContent .content ul {
    padding: 0;
    margin: 1%;
    width: 100%;
    height: 100%;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}

.shop .mainBox .mainContent .content ul li {
    width: 30%;
    height: 50%;
    margin: 1.5%;
    font-size: 16px;
    color: #5e5d5d;
    position: relative;
    border-radius: 0.8rem;
    box-shadow: 0 0 2px rgb(144, 142, 142),0 0px 2px rgb(144, 142, 142);
}

.shop .mainBox .mainContent .content ul li .top {
    width: 100%;
    height: 65%;
}
.shop .mainBox .mainContent .content ul li .top img {
    width: 100%;
    height: 100%;
    border-radius: 0.8rem 0.8rem 0 0;
    aspect-ratio: auto;
}
.shop .mainBox .mainContent .content ul li .bottom {
    width: 100%;
    height: 5%;
    padding:0 5%;
    font-size: 22px;
    color: #955050;
    position: absolute;
    top: 87%;
}

.shop .mainBox .mainContent .content ul li .bottom button {
    float: right;
    padding: 0.8%;
    border: none;
    color: #fff0f0;
    background-color: #fff;
    box-shadow: 0 0 4px #dedcdc;
    border-radius: 0.2rem;
    background-color: #65deeb;
    position: absolute;
    top: 75%;
    left: 58%;
}
.shop .mainBox .mainContent .content ul li .bottom button:last-child {
    left: 70%;
    color: #7a7979;
    background-color: #e9f7cf;
}
.shop .mainBox .mainContent .content ul li .bottom button:hover {
    box-shadow: 0 0 15px #dad9b9;
}
</style>

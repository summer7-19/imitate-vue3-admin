<script setup>
import { ref, onMounted } from 'vue';
import sideBar from './original/sideBar.vue';
let sayHai = ref('')
const time = new Date().getHours()
const titleList = ref([
    {
        title: "Home",
    },
    {
        title: "About",
    },
    {
        title: "Contact",
    }, {
        title: "Blog",
    }, {
        title: "Shop",
    }, {
        title: "Login",
    }
]);

const itemList = ref([
    {
        title: "Home",
    },
    {
        title: "About",
    },
    {
        title: "Contact",
    }, {
        title: "Blog",
    }, {
        title: "Shop",
    }, {
        title: "Login",
    }
])

const tableList = ref([
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
    }, {
    },
    {
        title: "Blog",
        content: "Lorem"
    }, {
        title: "Shop",
        content: "Lorem"
    }
])


onMounted(() => {
    if (time >= 4 && time < 12) {
        sayHai.value = "Good Morning"
    } else if (time >= 12 && time < 18) {
        sayHai.value = "Good Afternoon"
    } else {
        sayHai.value = "Good Night"
    }
})
</script>
<template>
    <!-- <sideBar/> -->
    <div class="container">
        <div class="sideBar">
            <div class="sideBarTitle">
                <span>Menu</span>
                <ul>
                    <li v-for="value in titleList">
                        <!-- <svg viewBox="0 0 1024 1024">
                            <path :d="">

                            </path>
                        </svg> -->
                        <span>{{ value.title }}</span>
                    </li>
                </ul>
            </div>
            <div class="sideBarContent">
                <span>Vue</span>
                <ul>
                    <li v-for="value in itemList">
                        {{ value.title }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="mainContent">
            <div class="header"></div>
            <div class="sideBarShow"></div>
            <div class="content">
                <div class="sayHai">
                    <div class="left">
                        <img src="" alt="">
                    </div>
                    <div class="right">
                        <div style="font-weight: 600;font-size: 18px;color: #000;margin-bottom: 0.3rem;">{{ sayHai }}
                        </div>
                        <div> Vue Shop Vite累计完成6种布局，3种主题，无数种颜色搭配，覆盖绝大多数使用场景，大幅提升开发效率</div>
                    </div>
                </div>
                <div class="sellMsg">
                    <ul>
                        <li style="color:#fff;background-color: rgb(90, 208, 244);">
                            <div class="left">
                                <p>总销量</p>
                                <p style="font-size: 24px;padding-left: 0.55rem;">￥9193.00</p>
                                <span>自上周以来</span>
                            </div>
                            <div class="right"></div>
                        </li>
                        <li>
                            <div class="left">
                                <p>活跃用户</p>
                                <p style="font-size: 24px;padding-left: 0.55rem;">15,864</p>
                                <span>自上周以来</span>
                            </div>
                            <div class="right"></div>
                        </li>
                        <li>
                            <div class="left">
                                <p>总成交</p>
                                <p style="font-size: 24px;padding-left: 0.55rem;">8,467</p>
                                <span>自上周以来</span>
                            </div>
                            <div class="right"></div>
                        </li>
                        <li>
                            <div class="left">
                                <p>订单</p>
                                <p style="font-size: 24px;padding-left: 0.55rem;">10,695</p>
                                <span>自上周以来</span>
                            </div>
                            <div class="right"></div>
                        </li>
                    </ul>
                </div>
                <div class="dealMsg">
                    <div class="deal">
                        <div class="title">
                            <span>待处理</span>
                        </div>
                        <div class="content">

                        </div>
                    </div>
                    <div class="msg">
                        <div class="title">
                            <span>依赖信息</span>
                            <span style="float: right;">weswc</span>
                        </div>
                        <div class="content">
                            <!-- <table>
                                <tr v-for="value in tableList">
                                    <th>{{ value.title }}</th>
                                    <td>{{ value.content}}</td>
                                </tr>
                            </table> -->
                            <div class="grid" v-for="value in tableList">
                                <div class="gridTitle">{{ value.title }}</div>
                                <div class="gridContent">{{ value.content }}</div>
                            </div>
                            <div class="bottom"></div>
                        </div>
                    </div>
                </div>
                <div class="sugMsg">
                    <div class="title">
                        <span>经营意见</span>
                    </div>
                    <div class="content"></div>
                </div>
                <div class="appMsg">
                    <div class="mainSituation">
                        <div class="title">
                            <span>流量概况</span>
                        </div>
                        <div class="content"></div>
                    </div>
                    <div class="getPower">
                        <div class="title">
                            <span>流量概况</span>
                        </div>
                        <div class="content"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chooseFun"></div>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
}

.container .sideBar {
    width: 15%;
    height: 100%;
    /* border: 1px solid #000; */
    display: flex;
    flex-direction: row;
}

.container .sideBar .sideBarTitle {
    width: 20%;
    height: 100%;
    border: 1px solid #000;
    background-color: rgb(95, 92, 92);
}

.container .sideBar .sideBarTitle ul {
    width: 100%;
    height: 80%;
    margin: 2rem 0 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
}

.container .sideBar .sideBarTitle ul li {
    margin: 5% auto;
    width: 100%;
    flex: 1;
    font-size: 16px;
    color: aliceblue;
    border: 1px solid #000;
}

.container .sideBar .sideBarContent {
    width: 80%;
    height: 100%;
    border: 1px solid #000;
}

.container .sideBar .sideBarContent ul {
    width: 100%;
    height: 50%;
    margin: 1.5rem 0 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
}

.container .sideBar .sideBarContent ul li {
    margin: 5% auto;
    width: 100%;
    flex: 1;
    font-size: 16px;
    border: 1px solid #000;
}

.container .mainContent {
    /* flex: 1; */
    width: 85%;
    display: flex;
    flex-direction: column;
}

.container .mainContent .header {
    width: 100%;
    height: 6.2%;
    border: 1px solid #000;
    opacity: 0.6;
}

.container .mainContent .sideBarShow {
    width: 100%;
    height: 5%;
    border: 1px solid #000;
    opacity: 0.6;
}

.container .mainContent .content {
    padding: 0 1%;
    width: 98%;
    /* height: 88.8%; */
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #f3f1f1;
    border: 1px solid #000;
}

.container .mainContent .content .sayHai {
    margin: 2% 0;
    width: 100%;
    height: 15%;
    border: 1px solid #000;
    display: flex;
    flex-direction: row;
}

.container .mainContent .content .sayHai .left {
    width: 10%;
    height: 100%;
    border-radius: 0.5rem;
    border: 1px solid #000;
}

.container .mainContent .content .sayHai img {
    width: 60%;
    height: 60%;
    aspect-ratio: auto;
}

.container .mainContent .content .sayHai .right {
    margin-top: 2%;
    /* width: 90%; */
    color: rgb(117, 117, 118);
    font-size: 12px;
    border: 1px solid #000;
}

.container .mainContent .content .sellMsg {
    margin: 2% 0;
    width: 100%;
    height: 20%;
    border: 1px solid #000;
}

.container .mainContent .content .sellMsg ul {
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    /* justify-content: space-around; */
}

.container .mainContent .content .sellMsg ul li {
    margin-right: 2%;
    width: 25%;
    height: 100%;
    border: 1px solid #000;
    display: flex;
    flex-direction: row;
}

.container .mainContent .content .sellMsg ul li:last-child {
    margin-right: 0;
}

.container .mainContent .content .sellMsg ul li .left {
    padding-left: 0.5rem;
    width: 40%;
    height: 100%;
    font-size: 14px;
    border: 1px solid #000;
}

.container .mainContent .content .sellMsg ul li .right {
    width: 60%;
    height: 100%;
    border: 1px solid #000;
}

.container .mainContent .content .dealMsg {
    margin: 2% 0;
    height: 25%;
    border: 1px solid #000;
    display: flex;
    flex-direction: row;
}

.container .mainContent .content .dealMsg .deal {
    margin-right: 2%;
    width: 50%;
    height: 100%;
    border: 1px solid #000;
}

.container .mainContent .content .dealMsg .msg {
    width: 50%;
    height: 100%;
    border: 1px solid #000;
}

.container .mainContent .content .dealMsg .title {
    margin-top: 2%;
    width: 100%;
    height: 15%;
    border: 1px solid #000;
}

.container .mainContent .content .dealMsg .title span {
    padding: 2%;
    color: #3d3b3b;
}

.container .mainContent .content .dealMsg .content {
    margin: 2%;
    width: 94%;
    height: 60%;
    border: 1px solid #000;
}

.container .mainContent .content .dealMsg .content .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

/* .container .mainContent .content .dealMsg .content table{
    
    border: 1px solid #000;
} */

.container .mainContent .content .sugMsg {
    margin: 2% 0;
    height: 25%;
    border: 1px solid #000;
}

.container .mainContent .content .sugMsg .title {
    margin-top: 1%;
    width: 100%;
    height: 20%;
    border: 1px solid #000;
}

.container .mainContent .content .sugMsg .title span {
    padding: 1%;
    color: #3d3b3b;
}

.container .mainContent .content .sugMsg .content {
    height: 70%;
    border: 1px solid #000;
    
}

.container .mainContent .content .appMsg {
    height: 35%;
    border: 1px solid #000;
    display: flex;
    flex-direction: row;
}
.container .mainContent .content .appMsg .mainSituation{
    margin-right: 2%;
    width: 50%;
    height: 100%;
    border: 1px solid #000;
}
.container .mainContent .content .appMsg .getPower {
    width: 50%;
    height: 100%;
    border: 1px solid #000;
}
.container .mainContent .content .appMsg .title {
    margin-top: 1%;
    width: 100%;
    height: 15%;
    border: 1px solid #000;
}

.container .mainContent .content .appMsg .title span {
    padding: 1%;
    color: #3d3b3b;
}
</style>
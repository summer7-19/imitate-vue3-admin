<script setup>
import { ref, onMounted } from 'vue';
import Footer from './footer/footer.vue';
let sayHai = ref('')
let isOpen = ref(false)
const time = new Date().getHours()
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
                        <p style="font-size: 24px;padding-left: 0.8rem;">￥16677.00</p>
                        <span style="">自上周以来</span>
                    </div>
                    <div class="right"></div>
                </li>
                <li>
                    <div class="left">
                        <p>活跃用户</p>
                        <p style="font-size: 24px;padding-left: 0.55rem;">1,710</p>
                        <span>自上周以来</span>
                    </div>
                    <div class="right"></div>
                </li>
                <li>
                    <div class="left">
                        <p>总成交</p>
                        <p style="font-size: 24px;padding-left: 0.55rem;">18,831</p>
                        <span>自上周以来</span>
                    </div>
                    <div class="right"></div>
                </li>
                <li>
                    <div class="left">
                        <p>订单</p>
                        <p style="font-size: 24px;padding-left: 0.55rem;">12,034</p>
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
                    <ul>
                        <li class="message">
                            <div class="left">

                            </div>
                            <div class="right">
                                <div class="top">
                                    <span
                                        style="font-size: 18px;margin-right: 5px;color: red;font-weight: 600;">预警</span>
                                    <span>产品</span>
                                </div>
                                <div class="bottom">
                                    <span
                                        style="display: inline-block;width: 50px;text-align:center;border: 1px solid aqua;border-radius: 3px;color: aqua;margin-right: 5px;">完成</span>
                                    <span>预警原因</span>
                                </div>
                            </div>
                        </li>
                        <li class="message">
                            <div class="left"></div>
                            <div class="right">
                                <div class="top">
                                    <span style="font-size: 18px;margin-right: 5px;font-weight: 600;">售后工单</span>
                                    <span>用户</span>
                                </div>
                                <div class="bottom">
                                    <span
                                        style="display: inline-block;width: 50px;text-align:center;border: 1px solid red;border-radius: 3px;color: red;margin-right: 5px;">未完成</span>
                                    <span>订单号</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="msg">
                <div class="title">
                    <span>依赖信息</span>
                    <span
                        style="float: right;margin-right: 5%;margin-top: 5px;padding: 5px 10px;display: flex;align-items: center;box-sizing: border-box;height: 70%;border-radius: 5px;border: 1px solid rgb(78, 136, 243);font-size: 11px;color: rgb(78, 136, 243);outline: rgb(78, 136, 243);">
                        当前版本：V40.0.1 部署时间：2026-07-04 19:39:39
                    </span>
                </div>
                <div class="content">
                    <table>
                        <tr>
                            <td>vite</td>
                            <td>
                                <span>^7.3.1</span>
                            </td>
                            <td>vue</td>
                            <td>
                                <span>^3.5.33</span>
                            </td>
                            <td>element-plus</td>
                            <td>
                                <span>^2.13.7</span>
                            </td>
                            <td>typescript</td>
                            <td>
                                <span>^6.0.3</span>
                            </td>

                        </tr>
                        <tr>
                            <td>eslint</td>
                            <td>
                                <span>^10.2.1</span>
                            </td>
                            <td>vite</td>
                            <td>
                                <span>^7.3.1</span>
                            </td>
                            <td>vue</td>
                            <td>
                                <span>^3.5.33</span>
                            </td>
                            <td>element-plus</td>
                            <td>
                                <span>^2.13.7</span>
                            </td>
                        </tr>
                    </table>
                    <!-- <div class="grid" v-for="value in tableList">
                                <div class="gridTitle">{{ value.title }}</div>
                                <div class="gridContent">{{ value.content }}</div>
                            </div> -->
                    <div class="bottom">
                        <button id="buy">
                            <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100"
                                        height="100">
                                        <g fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <polygon points="25,20 75,20 95,45 50,90 5,45 25,20" />
                                        </g>
                                    </svg> -->
                            <span>一键购买</span></button>
                        <button id="shop-vite">
                            <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100"
                                        height="100">
                                        <g fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <polygon points="25,20 75,20 95,45 50,90 5,45 25,20" />
                                        </g>
                                    </svg> -->
                            <span>shop-vite￥1899</span></button>
                        <button id="admin-plus">
                            <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100"
                                        height="100">
                                        <g fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <polygon points="25,20 75,20 95,45 50,90 5,45 25,20" />
                                        </g>
                                    </svg> -->
                            <span>admin-plus￥799</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="sugMsg">
            <div class="title">
                <span>经营意见</span>
            </div>
            <div class="content">
                <ul class="entrance">
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3L2 10h20L12 3z" />
                                <path d="M5 10v7" />
                                <path d="M10 10v7" />
                                <path d="M14 10v7" />
                                <path d="M19 10v7" />
                                <path d="M2 17h20" />
                                <path d="M2 21h20" />
                            </svg>

                        </div>
                        <div class="intr">
                            <div class="top"><span>工商建议</span></div>
                            <div class="bottom"><span>工商建议快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M14.5 9a3.5 3.5 0 1 0 0 6" />
                            </svg>


                        </div>
                        <div class="intr">
                            <div class="top"><span>商标管理</span></div>
                            <div class="bottom"><span>商标管理快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <rect x="5" y="3" width="14" height="18" rx="2" />
                                <path d="M5 8h14" />
                            </svg>


                        </div>
                        <div class="intr">
                            <div class="top"><span>专利查询</span></div>
                            <div class="bottom"><span>专利查询快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3L2 10h20L12 3z" />
                                <path d="M5 10v7" />
                                <path d="M10 10v7" />
                                <path d="M14 10v7" />
                                <path d="M19 10v7" />
                                <path d="M2 17h20" />
                                <path d="M2 21h20" />
                            </svg>

                        </div>
                        <div class="intr">
                            <div class="top"><span>著作权查询</span></div>
                            <div class="bottom"><span>著作权查询快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3L2 10h20L12 3z" />
                                <path d="M5 10v7" />
                                <path d="M10 10v7" />
                                <path d="M14 10v7" />
                                <path d="M19 10v7" />
                                <path d="M2 17h20" />
                                <path d="M2 21h20" />
                            </svg>

                        </div>
                        <div class="intr">
                            <div class="top"><span>证照管理</span></div>
                            <div class="bottom"><span>证照管理快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="M18 10h-2v4a2 2 0 0 1-2 2H8v2a2 2 0 0 0 2 2h3l4 4v-4h1a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z" />
                                <path
                                    d="M14 10V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1l-2 4 4-2h5a2 2 0 0 0 2-2z" />
                            </svg>


                        </div>
                        <div class="intr">
                            <div class="top"><span>纳税提醒</span></div>
                            <div class="bottom"><span>纳税提醒快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="8" y1="9" x2="8.01" y2="9" stroke-width="3" />
                                <line x1="16" y1="9" x2="16.01" y2="9" stroke-width="3" />
                                <path d="M8 16a4 4 0 0 1 8 0" />
                            </svg>


                        </div>
                        <div class="intr">
                            <div class="top"><span>温馨提示</span></div>
                            <div class="bottom"><span>温馨提示快捷入口</span></div>
                        </div>
                    </li>
                    <li>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="7" cy="7" r="3" />
                                <circle cx="17" cy="7" r="3" />
                                <circle cx="7" cy="17" r="3" />
                                <circle cx="17" cy="17" r="3" />
                            </svg>


                        </div>
                        <div class="intr">
                            <div class="top"><span>全部应用</span></div>
                            <div class="bottom"><span>全部应用快捷入口</span></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="appMsg">
            <div class="mainSituation">
                <div class="title">
                    <span>流量概况</span>
                </div>
                <div class="content"></div>
                <div class="footer">
                    <div class="left">
                        <span>自上周以来
                            <span>提升44%</span>
                        </span>
                    </div>
                    <div class="right">
                        <span></span>
                    </div>
                </div>
            </div>
            <div class="getPower">
                <div class="title">
                    <span>授权概况</span>
                </div>
                <div class="content"></div>
                <div class="footer">
                    <div class="left">
                        <span>授权数：18,148</span>
                    </div>
                    <div class="right">
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
</template>


<style scoped>
/* 内容区域 */
.container .mainContent .content {
    padding: 0 1%;
    width: 98%;
    height: 88%;
    
    overflow-y: overlay;
    overflow-x: hidden;
    background-color: #fdfafa;
    /* border: 1px solid #000; */
}

.container .mainContent .content::-webkit-scrollbar {
    width: 6px;
}

.container .mainContent .content::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
}

.container .mainContent .content::-webkit-scrollbar-track {
    background: transparent;
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
    width: 7%;
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
    margin-left: 1%;
    /* width: 90%; */
    color: rgb(117, 117, 118);
    font-size: 14px;
    border: 1px solid #000;
}

.container .mainContent .content .sellMsg {
    margin: 1.5% 0;
    width: 100%;
    height: 25%;
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
    padding-top: 0.5%;
    box-sizing: border-box;
    width: 25%;
    height: 100%;
    border: 1px solid #000;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    display: flex;
    flex-direction: row;
}

.container .mainContent .content .sellMsg ul li:last-child {
    margin-right: 0;
}

.container .mainContent .content .sellMsg ul li .left {
    padding-left: 1rem;
    width: 45%;
    height: 100%;
    font-size: 14px;
    border: 1px solid #000;
}

.container .mainContent .content .sellMsg ul li .right {
    width: 55%;
    height: 100%;
    border: 1px solid #000;
}


/* 待处理区域 */


.container .mainContent .content .dealMsg {
    margin: 2% 0 0;
    height: 30%;
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

.container .mainContent .content .dealMsg .title {
    margin-top: 1%;
    width: 100%;
    height: 15%;
    display: flex;
    align-items: center;
    border: 1px solid #000;
}

.container .mainContent .content .dealMsg .title span {
    padding: 2%;
    color: #3d3b3b;
}

.container .mainContent .content .dealMsg .content {
    margin: 3% auto 1%;
    width: 96%;
    height: 65%;
    box-sizing: border-box;
    overflow: hidden;
    /* border: 1px solid #000; */
}

.container .mainContent .content .dealMsg .content ul {
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    height: 100%;
    /* border: 1px solid #000; */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.container .mainContent .content .dealMsg .content ul li {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 48%;
    height: 90%;
    border: 1px solid #000;
}

.container .mainContent .content .dealMsg .content ul li:first-child {
    margin-right: 4%;
}

.container .mainContent .content .dealMsg .content ul li .left {
    margin-right: 5%;
    width: 4%;
    height: 80%;
    border-radius: 10px;
    background-color: rgb(253, 78, 78);
    /* background-color: var(bgc); */
}

.container .mainContent .content .dealMsg .content ul li .right {
    width: 80%;
    height: 65%;
    border: 1px solid #000;
}

.container .mainContent .content .dealMsg .content ul li .right .top {
    width: 100%;
    height: 49%;
    color: rgb(248, 66, 66);
    font-size: 12px;
    letter-spacing: 1px;
    border: 1px solid #000;
}

.container .mainContent .content .dealMsg .content ul li .right .bottom {
    width: 100%;
    height: 49%;
    font-size: 13px;
    color: #646363;
    letter-spacing: 1px;
    border: 1px solid #000;
}

/* 依赖信息 */


.container .mainContent .content .dealMsg .msg {
    width: 50%;
    height: 100%;
    border: 1px solid #000;
}

.container .mainContent .content .dealMsg .msg .content table {
    width: 100%;
    height: 60%;
    text-align: center;
    border-collapse: collapse;
}

.container .mainContent .content .dealMsg .msg .content table td {
    border: 1px solid #646363;
    font-weight: bold;
    font-size: 0.8rem;
}

.container .mainContent .content .dealMsg .msg .content table td span {
    font-weight: normal;
    color: #797777;
}

.container .mainContent .content .msg .content .bottom {
    margin-top: 15px;
    height: 24%;
    border: 1px solid #000;
}

#buy,
#shop-vite,
#admin-plus {
    margin-right: 30px;
    padding: 0 25px;
    height: 100%;
    font-size: 13px;
    color: #ffffff;
    border-radius: 7px;
}

#buy {
    background-color: rgb(230, 162, 60);
}

#shop-vite,
#admin-plus {
    background-color: rgb(78, 136, 243);
}



/* 经营建议 */


.container .mainContent .content .sugMsg {
    margin: 1% 0;
    height: 30%;
    border: 1px solid #000;
}

.container .mainContent .content .sugMsg .title {
    margin-top: 1%;
    text-indent: 1rem;
    width: 100%;
    height: 15%;
    display: flex;
    align-items: center;
    border: 1px solid #000;
}

.container .mainContent .content .sugMsg .title span {
    /* padding: 1%; */
    color: #3d3b3b;
}

.container .mainContent .content .sugMsg .content {
    height: 70%;
    overflow: hidden;
    /* border: 1px solid #000; */

}

.container .mainContent .content .sugMsg .content .entrance {
    margin: 1% auto 0;
    padding: 0;
    list-style: none;
    width: 98%;
    height: 90%;
    display: grid;
    grid-template-columns: repeat( 4,1fr);
    gap: 10px;
    /* border: 1px solid #000; */
}

.container .mainContent .content .sugMsg .content .entrance li {
    padding: 1%;
    width: 250px;
    height: 50px;
    display: flex;
    flex-direction: row;
    font-size: 12px;
    letter-spacing: 1px;
    /* border: 1px solid #000; */
}

.container .mainContent .content .sugMsg .content .entrance li .icon {
    margin-right: 2%;
    margin-top: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    stroke: #4772FA;
    border-radius: 10px;
    box-sizing: border-box;
    border: 1px solid rgb(78, 136, 243);
    background-color: rgba(78, 136, 243, 0.1);
}

.container .mainContent .content .sugMsg .content .entrance li .icon svg {
    width: 80%;
    height: 60%;
}

.container .mainContent .content .sugMsg .content .entrance li .icon:hover {
    background-color: rgb(78, 136, 243);
    stroke: #ffffff;
}

.container .mainContent .content .sugMsg .content .entrance li .intr {
    margin-top: 1.5%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 70%;
    height: 85%;
}

.container .mainContent .content .sugMsg .content .entrance li .intr .top {
    height: 50%;
    font-size: 14px;
    font-weight: 500;
}

.container .mainContent .content .sugMsg .content .entrance li .intr .bottom {
    height: 45%;
    text-indent: 0.1rem;
}

/* 应用详情 */


.container .mainContent .content .appMsg {
    height: 40%;
    border: 1px solid #000;
    display: flex;
    flex-direction: row;
}

.container .mainContent .content .appMsg .mainSituation {
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
    text-indent: 1rem;
    width: 100%;
    height: 13%;
    display: flex;
    align-items: center;
    border: 1px solid #9d9c9c;
}

.container .mainContent .content .appMsg .title span {
    padding: 1%;
    color: #3d3b3b;
}
.container .mainContent .content .appMsg .content {
    margin: 0 auto;
    height: 70%;
    width: 90%;
    border: 1px solid #7d7b7b;
}
.container .mainContent .content .appMsg .footer {
    height: 13%;
    margin-top: 1%;
    text-indent: 1rem;
    width: 100%;
}

</style>
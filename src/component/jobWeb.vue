<script setup>
import sideBar from './original/sideBar.vue'
import { onMounted, onUnmounted, ref } from 'vue'
const isShow = ref(true)
const waitIsShow = ref(false)
const list = ref([
    {
        comment: 'xxx',
        commentNum: 10,
        seeNum: 1000,
        likeNum: 100,
        dislikeNum: 10,
    }, {
        comment: 'xxx',
        commentNum: 10,
        seeNum: 1000,
        likeNum: 100,
        dislikeNum: 10,
    }, {
        comment: 'xxx',
        commentNum: 10,
        seeNum: 1000,
        likeNum: 100,
        dislikeNum: 10,
    }, {
        comment: 'xxx',
        commentNum: 10,
        seeNum: 1000,
        likeNum: 100,
        dislikeNum: 10,
    }, {
        comment: 'xxx',
        commentNum: 10,
        seeNum: 1000,
        likeNum: 100,
        dislikeNum: 10,
    }, {
        comment: 'xxx',
        commentNum: 10,
        seeNum: 1000,
        likeNum: 100,
        dislikeNum: 10,
    }, {
        comment: 'xxx',
        commentNum: 10,
        seeNum: 1000,
        likeNum: 100,
        dislikeNum: 10,
    }, {
        comment: 'xxx',
        commentNum: 10,
        seeNum: 1000,
        likeNum: 100,
        dislikeNum: 10,
    }
])
const onScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        waitIsShow.value = true
    }
    else waitIsShow.value = false
};
// onMounted(() => {
//     mainBox.value?.addEventListener('scroll', () => {
//         handleScroll()
//     })
// })
// onUnmounted(() => {
//     mainBox.value?.removeEventListener('scroll', () => {
//         handleScroll()
//     })
// })
</script>

<template>
    <sideBar></sideBar>
    <div class="jobWeb" @scroll="onScroll">
        <div class="header">
            <span>好工作就业参考网</span>
            <button>登录</button>
            <button>注册</button>
        </div>
        <div class="mainBox">
            <div class="input">
                <div class="left">
                    <input type="text" placeholder="公司/内容关键字">
                </div>
                <div class="right">
                    <button>查询</button>
                </div>
            </div>
            <div class="tooltip" v-show="isShow">
                <p>温馨提示：请文明发言，不得触犯国家法律法规，希望每一个发帖人都可以为后来者提供真实的就业经验与公司参考，在这里你可以分享求职路上的点滴经历，写下你的求职日记，吐槽那些防不胜防的求职陷阱；聊聊不同公司的真实工作体验，给应届生和求职者提点建议，帮大家避开弯路。
                    要是想帮公司招人，或者需要找短期兼职，直接发帖即可。</p>
                <button @click="isShow = !isShow">X</button>
            </div>
            <div class="comment">
                <div class="commentHeader">
                    <select name="province" id="provinces">
                        <option value="">全国</option>
                        <option value="">北京</option>
                    </select>
                    <select name="city" id="citys">
                        <option value="">所有城市</option>
                        <option value="">北京城区</option>
                        <!-- <option value="" v-for="value in source">value</option> -->
                    </select>
                    <select name="" id="">
                        <option value="">时间倒序</option>
                        <option value="">点赞量倒序</option>
                        <option value="">访问量倒序</option>
                        <option value="">最后回复倒序</option>
                    </select>
                    <select name="" id="">
                        <option value="">全部分类</option>
                        <option value="">避雷</option>
                        <option value="">推荐</option>
                    </select>
                    <button class="post">
                        发送新帖
                    </button>
                </div>
                <div class="commentContent">
                    <ul>
                        <li v-for="(value, index) in list">
                            <div class="commentPic">
                                <svg viewBox="0 0 24 24">
                                    <circle cx="12" cy="7" r="6" fill="#f6e2b8">匿名</circle>
                                </svg>
                            </div>
                            <div class="commentMsg">
                                <div>{{ value.comment }}</div>
                                <button>
                                    <svg viewBox="0 0 24 24">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <span>匿名</span>
                                </button>
                                <button>
                                    <svg viewBox="0 0 24 24">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    <span>{{ value.seeNum }}</span>
                                </button>
                                <button>
                                    <svg viewBox="0 0 24 24">
                                        <path
                                            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                                        </path>
                                    </svg>
                                    <span>{{ value.commentNum }}评论</span>
                                </button>
                                <button>
                                    <svg viewBox="0 0 24 24">
                                        <path
                                            d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3">
                                        </path>
                                    </svg>
                                    <span>赞{{ value.likeNum }}</span>
                                </button>
                                <button>
                                    <svg viewBox="0 0 24 24">
                                        <path
                                            d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3">
                                        </path>
                                    </svg>
                                    <span>踩{{ value.dislikeNum }}</span>
                                </button>
                            </div>
                        </li>
                    </ul>

                </div>

            </div>

        </div>
        <div class="wait" v-show="waitIsShow">
            <svg class="spinner" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
        </div>
    </div>
</template>
<style scoped>
* {
    margin: 0;
    padding: 0;
    border: none;
    box-sizing: border-box;
    list-style: none;
}

svg {
    width: 0%;
    height: 0;
}

input:focus,
select:focus {
    outline: none;
}

.jobWeb {
    width: 100%;
    height: 100%;
    background-color: rgb(245, 247, 248);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.jobWeb .header {
    padding: 15px 0 0 10px;
    height: 7% !important;
    flex-shrink: 0;
    /* border: 1px solid #000; */
    background-color: #fff;
    box-shadow: 0 2px 2px #e8e6e6;
    position: relative;
}

.jobWeb .header span {
    color: #91f9b9;
    font-weight: 600;
}

.jobWeb .header button {
    width: 4%;
    height: 65%;
    position: absolute;
    left: 90%;
    top: 15%;
    color: #91f9b9;
    font-size: 16px;
    background-color: #faf8f8;
    border-radius: 10px;
}

.jobWeb .header button:nth-child(2) {
    left: 95%;
}

.jobWeb .mainBox {
    margin: 0 auto;
    /* flex: 1; */
    height: auto;
    width: 65%;
}

.jobWeb .mainBox .input {
    margin: 1.5% auto;
    width: 25%;
    height: 3%;
    display: flex;
    flex-direction: row;
    /* border: 1px solid #000; */
    border-radius: 25px;
    background-color: #fff;
    box-shadow: 0 4px 10px #e8fcda, 0 4px 10px #e8fcda;
}

.jobWeb .mainBox .input .left {
    margin-left: 4%;
    margin-top: 1%;
    width: 75%;
    height: 100%;
}

.jobWeb .mainBox .input .left input {
    width: 100%;
    height: 85%;
    border: none;
    letter-spacing: 1px;
    border-radius: 25px;
}

.jobWeb .mainBox .input .right {
    width: 25%;
    height: 100%;
}

.jobWeb .mainBox .input .right button {
    width: 100%;
    height: 100%;
    border: none;
    background-color: #91f9b9;
    border-radius: 0 15px 15px 0;
}

.jobWeb .mainBox .tooltip {
    margin-top: 1%;
    padding: 0.8%;
    box-sizing: border-box;
    width: 100%;
    position: relative;
    color: #e4a25c;
    font-size: 16px;
    border-radius: 10px;
    border: 1px solid #e99c4a;
    background-color: #faf8d7;
}

.jobWeb .mainBox .tooltip button {
    position: absolute;
    left: 98.8%;
    top: 3%;
    width: 1%;
    color: #c6c5a9;
    background-color: #faf8d7;
}

.jobWeb .mainBox .comment {
    margin-top: 1.5%;
    width: 100%;
    /* flex: 1; */
    height: 90%;
}

.jobWeb .mainBox .comment .commentHeader {
    width: 100%;
    height: 6%;
}

.jobWeb .mainBox .comment .commentHeader select {
    margin-right: 3%;
    height: 55%;
    width: 8%;
    color: #313131;
    font-size: 14px;
    border-radius: 10px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, .15), 0 2px 2px rgba(0, 0, 0, .15);
}

.jobWeb .mainBox .comment .commentHeader .post {
    float: right;
    width: 10%;
    height: 70%;
    font-size: 16px;
    color: #646262;
    background-color: #91f9b9;
    border-radius: 10px;
}

.jobWeb .mainBox .comment .commentContent {
    width: 100%;
    height: 85%;
}

.jobWeb .mainBox .comment .commentContent ul {
    width: 100%;
    height: 100%;
    /* display: flex;
    flex-direction: column; */
}

.jobWeb .mainBox .comment .commentContent ul li {
    margin: 2% 0;
    width: 100%;
    /* flex: 1; */
    height: 7rem;
    /* height: 13%; */
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    position: relative;
    display: flex;
    flex-direction: row;
}

.jobWeb .mainBox .comment .commentContent ul li:first-child {
    margin-top: 0%;
}

.jobWeb .mainBox .comment .commentContent ul li:hover {
    box-shadow: 0 4px 8px rgb(208, 245, 208);
}

.jobWeb .mainBox .comment .commentContent ul li .commentPic {
    position: absolute;
    top: 25%;
    left: -2%;
    width: 15%;
    height: 90%;
}

.jobWeb .mainBox .comment .commentContent ul li .commentPic svg {
    width: 90%;
    height: 90%;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg {
    position: absolute;
    left: 8%;
    top: 25%;
    width: 91%;
    height: 100%;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg div {
    margin: 0 1.2%;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg div:hover {
    color: rgb(149, 219, 163);
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg button {
    margin: 0.8%;
    width: 5%;
    height: 20%;
    color: #878585;
    font-size: 12px;
    border-radius: 5px;
    background-color: #faf8f8;
    box-shadow: 0 1px 1px #878585;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg button svg {
    width: 25%;
    height: 60%;
    fill: none;
    vertical-align: middle;
    stroke: #878585;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg button:hover {
    transform: translateY(-10%);
}

.jobWeb .wait {
    margin: 3% auto;
    margin-bottom: 0;
    width: 100%;
    height: 5%;
}

.jobWeb .wait .spinner {
    animation: rotate 2s linear infinite;
    width: 100%;
    height: 80%;
}

.spinner .path {
    stroke: #c1c3c6;
    stroke-linecap: round;
    /* 1. 保持 dasharray 固定：40是弧长，110是间隙 */
    stroke-dasharray: 40, 110;
    /* 2. 只做旋转动画，或者配合 offset 动画 */
    animation: dash-fixed 1.5s linear infinite;
}

@keyframes dash-fixed {
    0% {
        stroke-dashoffset: 0;
    }

    100% {
        /* 偏移量设为周长的负值，实现顺滑循环 */
        stroke-dashoffset: -150;
    }
}
</style>
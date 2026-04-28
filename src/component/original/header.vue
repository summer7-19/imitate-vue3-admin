<template>
    <div class="header">
        <div class="headerContent">
            <div class="left">
                <div class="backButton" @click="sidebarStore.toggleSidebar" >
                    <button v-show="!sidebarStore.openSidebar">></button>
                    <button v-show="sidebarStore.openSidebar">
                        < </button>
                </div>
                <span>首页</span>
            </div>
            <div class="right">
                <button>
                    <svg viewBox="0 0 1024 1024" width="80%" height="100%">
                        <path fill="#787777"
                            d="m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64z">
                        </path>
                    </svg>
                </button>
                <button>
                    <svg viewBox="0 0 1024 1024" width="80%" height="100%">
                        <path fill="#787777"
                            d="M896 448H128v192a64 64 0 0 0 64 64h192v192h256V704h192a64 64 0 0 0 64-64zm-770.752-64c0-47.552 5.248-90.24 15.552-128 14.72-54.016 42.496-107.392 83.2-160h417.28l-15.36 70.336L736 96h211.2c-24.832 42.88-41.92 96.256-51.2 160a664 664 0 0 0-6.144 128H960v256a128 128 0 0 1-128 128H704v160a32 32 0 0 1-32 32H352a32 32 0 0 1-32-32V768H192A128 128 0 0 1 64 640V384zm64 0h636.544c-2.048-45.824.256-91.584 6.848-137.216 4.48-30.848 10.688-59.776 18.688-86.784h-96.64l-221.12 141.248L561.92 160H256.512c-25.856 37.888-43.776 75.456-53.952 112.832-8.768 32.064-13.248 69.12-13.312 111.168">
                        </path>
                    </svg>
                </button>
                <button>
                    <svg viewBox="0 0 1024 1024" width="80%" height="100%">
                        <path fill="#787777"
                            d="M771.776 794.88A384 384 0 0 1 128 512h64a320 320 0 0 0 555.712 216.448H654.72a32 32 0 1 1 0-64h149.056a32 32 0 0 1 32 32v148.928a32 32 0 1 1-64 0v-50.56zM276.288 295.616h92.992a32 32 0 0 1 0 64H220.16a32 32 0 0 1-32-32V178.56a32 32 0 0 1 64 0v50.56A384 384 0 0 1 896.128 512h-64a320 320 0 0 0-555.776-216.384z">
                        </path>
                    </svg>
                </button>
                <div class="userMsg">
                    <img data-v-789cae51 src="https://gcore.jsdelivr.net/gh/zxwk1998/image/avatar/avatar_3.png"
                        alt="用户头像" class="user-avatar">
                    <div class="userInfo">
                        <div>admin</div>
                        <span>管理员</span>

                    </div>
                    <div class="userPanel" @click="isClick = !isClick">
                        <svg viewBox="0 0 1024 1024" width="90%" height="100%">
                            <path fill="#787777"
                                d="M831.872 340.864 512 652.672 192.128 340.864a30.59 30.59 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.59 30.59 0 0 0-42.752 0z">
                            </path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="userPanelContent" :class="{ isShow: !isClick }">
        <div class="userPanelContentBg">
            <div class="userHeader">
                <img src="https://gcore.jsdelivr.net/gh/zxwk1998/image/avatar/avatar_3.png" alt="用户头像"
                    class="userPanelAvatar">
                <div class="userPanelInfo">
                    <div>admin</div>
                    <span>邮箱：</span>
                </div>
            </div>
            <div class="userChoose">
                <div class="systemSet">
                    <ul>
                        <li>
                            <svg viewBox="0 0 1024 1024" height="65%">
                                <path
                                    d="M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384m0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512m320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0">
                                </path>
                            </svg>
                            <span><a href="#">个人中心</a></span>
                        </li>
                        <li>
                            <svg viewBox="0 0 1024 1024" height="65%">
                                <path
                                    d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357 357 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a352 352 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357 357 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294 294 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293 293 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294 294 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288 288 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293 293 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a288 288 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256">
                                </path>
                            </svg>
                            <span><a href="#">系统设置</a></span>
                        </li>
                    </ul>
                </div>
                <div class="userLink">
                    <ul>
                        <li v-for="value in linkList">
                            <svg viewBox="0 0 1024 1024" height="65%">
                                <path
                                    d="M715.648 625.152 670.4 579.904l90.496-90.56c75.008-74.944 85.12-186.368 22.656-248.896-62.528-62.464-173.952-52.352-248.96 22.656L444.16 353.6l-45.248-45.248 90.496-90.496c100.032-99.968 251.968-110.08 339.456-22.656 87.488 87.488 77.312 239.424-22.656 339.456l-90.496 90.496zm-90.496 90.496-90.496 90.496C434.624 906.112 282.688 916.224 195.2 828.8c-87.488-87.488-77.312-239.424 22.656-339.456l90.496-90.496 45.248 45.248-90.496 90.56c-75.008 74.944-85.12 186.368-22.656 248.896 62.528 62.464 173.952 52.352 248.96-22.656l90.496-90.496zm0-362.048 45.248 45.248L398.848 670.4 353.6 625.152z">
                                </path>
                            </svg>
                            <span><a :href="value.link">{{ value.name }}</a></span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="backLogin">
                <svg viewBox="0 0 1024 1024" height="65%">
                    <path
                        d="M352 159.872V230.4a352 352 0 1 0 320 0v-70.528A416.128 416.128 0 0 1 512 960a416 416 0 0 1-160-800.128">
                    </path>
                    <path d="M512 64q32 0 32 32v320q0 32-32 32t-32-32V96q0-32 32-32"></path>
                </svg>
                <span>退出登录</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    list-style: none;
    text-decoration: none;
}

a {
    color: #787777;
}

svg {
    vertical-align: middle;
}

.header {
    width: 100%;
    height: 5%;
    /* 如果是侧边栏的内容，高度为10% */
    /* border: 1px solid #000; */
    background-color: #fff;
    position: relative;
    color-scheme: light;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05),
        0 2px 5px rgba(0, 0, 0, 0.05);
}

.header .headerContent {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: row;
    /* border-bottom: 1px solid #000; */
    position: absolute;
    top: 25%;
}

.headerContent .left {
    margin-left: 1%;
    width: 5%;
    height: 100%;
    display: flex;
    flex-direction: row;
}

.headerContent .left span {
    padding-left: 15px;
    line-height: 2.2;
    font-size: 14px;
    color: #787777;
}

.headerContent .left .backButton {
    margin-top: 0;
    width: 20%;
}

.headerContent .left .backButton button {
    width: 100%;
    height: 60%;
    border: none;
    background-color: rgba(255, 255, 255, 0);
    border-radius: 5px;
    box-shadow: 0 10px 25px rgba(21, 16, 16, 0.1),
        0 5px 10px rgba(0, 0, 0, 0.1);
}


.headerContent .right {
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: row;
    position: absolute;
    left: 85%;
    top: -10%;
}

.headerContent .right button {
    margin: 2px 5px;
    width: 5%;
    height: 75%;
    border: none;
    background-color: rgba(255, 255, 255, 0);
    border-radius: 5px;
    box-shadow: 0 10px 25px rgba(21, 16, 16, 0.1),
        0 5px 10px rgba(0, 0, 0, 0.1);
}

.headerContent .right .userMsg {
    width: 70%;
    display: flex;
    flex-direction: row;
}

.headerContent .right .userMsg .user-avatar {
    margin-top: -2%;
    margin-left: 5%;
    width: 11%;
    border-radius: 50%;
}

.headerContent .right .userMsg .userInfo {
    margin-left: 2%;
    font-size: 12px;
    font-weight: 600;
}

.headerContent .right .userMsg .userInfo span {
    font-size: 10px;
    color: #bbb9b9;
}

.headerContent .right .userMsg .userPanel {
    margin-left: 3%;
    width: 5%;
    height: 100%;
}

.userPanelContent {
    position: absolute;
    top: 7%;
    left: 88%;
    width: 11%;
    height: 45%;
    opacity: 1;
    transition: height 0.5s;
    border-radius: 10px;
    background-color: rgb(254, 253, 253);
    box-shadow: 0 10px 25px rgba(21, 16, 16, 0.1),
        0 5px 10px rgba(0, 0, 0, 0.1);
    z-index: 999;
}

/* 后续改成动画效果 */
.userPanelContent.isShow {
    height: 0;
    opacity: 0;
}

.userPanelContent .userPanelContentBg {
    margin: 2% auto;
    width: 96%;
    height: 100%;

}

.userPanelContent .userPanelContentBg .userHeader {
    padding: 15px;
    height: 13%;
    display: flex;
    background-color: #4a9bd5;
    border-radius: 5px 5px 0 0;
}

.userPanelContent .userPanelContentBg .userHeader .userPanelAvatar {
    width: 25%;
    height: 80%;
    border-radius: 50%;
}

.userPanelContent .userPanelContentBg .userHeader .userPanelInfo {
    margin-left: 5%;
    width: 60%;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
}

.userPanelContent .userPanelContentBg .userHeader .userPanelInfo span {
    font-size: 12px;
    font-weight: normal;
}

.userPanelContent .userPanelContentBg .userChoose {
    height: 70%;
    fill: rgb(96, 98, 102);
    color: rgb(96, 98, 102);
    background-color: #fff;
}

.userPanelContent .userPanelContentBg .userChoose .systemSet {
    height: 25%;
    padding-bottom: 5%;
    border-bottom: 1px solid #000;
}

.userPanelContent .userPanelContentBg .userChoose .systemSet ul {
    height: 100%;
    margin: 0;
    padding: 0;
}

.userPanelContent .userPanelContentBg .userChoose .systemSet ul li {
    height: 45%;
    padding: 1% 0;
    font-size: 14px;
    line-height: 2;
    color: #787777;
}

.userPanelContent .userPanelContentBg .userChoose .systemSet ul li svg {
    width: 25%;
}

.userPanelContent .userPanelContentBg .userChoose .systemSet ul li:hover {
    fill: rgb(64, 158, 255);
    background-color: #f1f3f5;
}

.userPanelContent .userPanelContentBg .userChoose .systemSet ul li:hover span a {
    color: rgb(64, 158, 255);
}

.userPanelContent .userPanelContentBg .userChoose .userLink {
    padding-top: 2%;
    height: 70%;
}

.userPanelContent .userPanelContentBg .userChoose .userLink ul {
    margin: 0;
    padding: 0;
    height: 100%;
}

.userPanelContent .userPanelContentBg .userChoose .userLink ul li {
    height: 16%;
    font-size: 14px;
    line-height: 2;
}

.userPanelContent .userPanelContentBg .userChoose .userLink ul li svg {
    width: 25%;
}

.userPanelContent .userPanelContentBg .userChoose .userLink ul li:hover {
    fill: rgb(64, 158, 255);
    background-color: #f1f3f5;
}

.userPanelContent .userPanelContentBg .userChoose .userLink ul li:hover span a {
    color: rgb(64, 158, 255);
}

.userPanelContent .userPanelContentBg .backLogin {
    height: 7%;
    color: #787777;
    font-size: 12px;
    border-radius: 0 0 5px 5px;
}

.userPanelContent .userPanelContentBg .backLogin svg {
    fill: #787777;
    width: 25%;
}

.userPanelContent .userPanelContentBg .backLogin:hover {
    color: rgb(64, 158, 255);
    background-color: #f1f3f5;
}

.userPanelContent .userPanelContentBg .backLogin:hover svg {
    fill: rgb(64, 158, 255);
}
</style>

<script setup>
import { ref } from 'vue'
import { useSidebarStore } from '../../stores/sideBar';
const sidebarStore = useSidebarStore();
console.log(sidebarStore);
const isClick = ref(false);
const linkList = ref([{
    name: 'GitHub 地址',
    link: '#'
}, {
    name: '码云地址',
    link: '#'
}, {
    name: 'Admin Pro 地址',
    link: '#'
}, {
    name: 'Admin Plus 地址',
    link: '#'
}, {
    name: 'Shop Vite 地址',
    link: '#'
}, {
    name: '好工作就业参考网',
    link: '#'
}
]);
</script>

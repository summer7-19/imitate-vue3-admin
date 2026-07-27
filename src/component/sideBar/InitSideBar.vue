<script setup>
import { ref } from "vue";
import { useSideBarContent }  from '../../stores/sideBar'
import { useRouter } from "vue-router";
const router = useRouter();
const store=useSideBarContent()
console.log(store.open)
const titleList = ref([
    {
        title: "首页",
    },
    {
        title: "组件",
    },
    {
        title: "其他",
    }, {
        title: "操作",
    }, {
        title: "模板",
    }, {
        title: "配置",
    }, {
        title: "单栏",
    }, {
        title: "商品",
    }, {
        title: "GPT",
    }, {
        title: "门户",
    }, {
        title: "外链",
    }, {
        title: "物料源",
    }
]);

const itemList = ref([
    {
        title: "首页",
        name: "ShopViteHomePage",
    },
    {
        title: "看板",
        name: "Panel",
    },
    {
        title: "创作中心",
    }, {
        title: "实时监控",
    }, {
        title: "磁贴",
    }, {
        title: "独立布局",
    }, {
        title: "磁贴",
    }, {
        title: "独立布局",
    }, {
        title: "数据大屏",
    }, {
        title: "工作台",
    }, {
        title: "液态玻璃",
    }, {
        title: "客服端",
    }, {
        title: "更新日志",
    }
])


const switchRouter= (routerName)=>{
    router.push({name:routerName})
}
</script>

<template>
    <div class="sideBar" :class=" { open :store.isOpen} ">
            <div class="sideBarTitle" :class=" { isOpen:store.isOpen} ">
                <span><img src="../../assets/img/lqr_logo.png" alt=""></span>
                <ul>
                    <li v-for="value in titleList">
                        <!-- <svg viewBox="0 0 1024 1024">
                            <path :d="">

                            </path>
                        </svg> -->
                        <!-- <svg view-box="24 24 0 0" :path="{{ value.path }}"></svg> -->
                        <span>{{ value.title }}</span>
                    </li>
                </ul>
                <button id="controlText">text</button>
                <button id="controlSecSide" @click="store.setState()">show</button>
            </div>
            <div class="sideBarContent" v-show="store.isOpen">
                <span>Vue Shop Vite</span>
                <ul>
                    <li v-for="value in itemList" @click="switchRouter(value.name)">
                        {{ value.title }}
                    </li>
                </ul>
            </div>
        </div>
</template>


<style scoped>
.sideBar{
    width: 5.3%;
     height: 100%;
    /* border: 1px solid #000; */
    display: flex;
    flex-direction: row;
    transition: width 0.5s ease-in-out;
}
.sideBar.open{
    width: 17.5%;
}

/* 侧边栏  第一个  */
.sideBar .sideBarTitle {
    width: 100%;
    height: 100%;
    border: 1px solid #000;
    background-color: rgb(40, 44, 52);
    /* transition: width 0.2s ease-in-out !important; */
}
.sideBar .sideBarTitle.isOpen{
    width: 30%;
}
.sideBar .sideBarTitle span img{
    display: block;
    margin: 2% auto;
    width: 80%;
    height: 7%;
    object-fit: cover;
}
.sideBar .sideBarTitle ul {
    width: 100%;
    height: 79%;
    margin: 0;
    padding: 0;
    list-style: none;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    /* background-color: rgb(40, 44, 52); */
}

.sideBar .sideBarTitle ul li {
    margin: 15% auto;
    box-sizing: border-box;
    width: 80%;
    height: 65px;
    font-size: 12px;
    color: aliceblue;
    border: 1px solid #2d2b2b;
    display: flex;
    justify-content: center;
    align-items: center;
}
.sideBar .sideBarTitle ul li:hover {
    background-color: rgb(78, 136, 243);
    border-radius: 5px;
}

#controlText, #controlSecSide{
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 35px;
    border: none;
    border-radius: 5px;
    background-color:rgb(78, 136, 243);
}
#controlSecSide{
    margin-top: 20%;
}

/* 第二个侧边栏 */

.sideBar .sideBarContent {
    width: 80%;
    height: 100%;
    border: 1px solid #000;
}

.sideBar .sideBarContent span {
    display: block;
    width: 100%;
    height: 7%;
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: #7f7f7f;
}

.sideBar .sideBarContent ul {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
}

.sideBar .sideBarContent ul li {
    margin: 2% auto;
    width: 95%;
    height: 38px;
    text-indent: 1.5rem;
    color: #575757;
    border: 1px solid #000;
    display: flex;
    align-items: center;
}
.sideBar .sideBarContent ul li:hover {
    background-color: #b5dcef;
    border-radius: 5px;
}

</style>
<template>
    <div class="options">
        <ul>
            <li v-for="(value, index) in list" @click="router.push('/shop-vite')">
                <div class="listDiv">
                    <div class="licontent">
                        <div class="svgImg" :style="{backgroundColor:value.bgColor}">
                            <svg viewBox="0 0 1024 1024" width="60%" height="100%">
                                <path fill="#fff" :d="value.pathData"></path>
                            </svg>
                        </div>
                        <div id="title">{{ value.title }}</div>
                        <div id="descript">{{ value.description }}</div>
                    </div>
                    <div class="left">**{{ value.seeNum }}</div>
                    <div class="right">{{ value.num }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>
<style scoped>
li {
    list-style: none;
}

.options {
    margin-top: 1%;
    height: 20%;
}

.options ul {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
}

.options ul li {
    flex: 1;
    margin-right: 2%;
    height: 100%;
    /* border: 1px solid #000; */
    border-radius: 8px;
    background-color: #fff;
    color-scheme:light ;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 
                0 4px 10px rgba(0, 0, 0, 0.1);
}

.options ul li:last-child {
    margin-right: 0;
}

.options ul li .listDiv {
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
}

.options ul li .listDiv:hover {
    transform: translateY(-5%);
}

.options ul li .listDiv .licontent {
    padding-top: 3%;
    position: absolute;
    top: 10%;
    left: 15%;
    width: 70%;
    height: 70%;
    line-height: 1.5;
    font-size: 16px;
    border-bottom: 1px solid #dcdbdb;
}


.options ul li .listDiv .licontent .svgImg {
    margin: 0 auto;
    width: 36%;
    height: 42%;
    border-radius: 10px;
}

.options ul li .listDiv .licontent .svgImg:hover {
    transform: translateY(-10%);
}

.options ul li .listDiv .licontent #descript {
    width: 100%;
    height: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    line-height: 1.5;
    color: #828080;
    word-break: break-all;
}

.options ul li .listDiv .left {
    font-size: 14px;
    color: #565454;
    position: absolute;
    top: 83%;
    left: 5%;
    width: 50%;
}

.options ul li .listDiv .right {
    font-size: 14px;
    color: #565454;
    position: absolute;
    top: 83%;
    right: -5%;
    width: 50%;
}
</style>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const list = ref([
    {
        "title": "视频播放器",
        "description": "支持多种格式的视频播放",
        "seeNum": "178K",
        "num": "97K",
        'bgColor':'rgb(255, 192, 105)',
        'pathData':'M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768m-48-247.616L668.608 512 464 375.616zm10.624-342.656 249.472 166.336a48 48 0 0 1 0 79.872L474.624 718.272A48 48 0 0 1 400 678.336V345.6a48 48 0 0 1 74.624-39.936z'
    },
    {
        "title": "表格",
        "description": "功能强大的数据表格组件",
        "seeNum": "821K",
        "num": "33K",
        'bgColor':'rgb(92, 219, 211)',
        'pathData':'M640 384v256H384V384zm64 0h192v256H704zm-64 512H384V704h256zm64 0V704h192v192zm-64-768v192H384V128zm64 0h192v192H704zM320 384v256H128V384zm0 512H128V704h192zm0-768v192H128V128z'
    },
    {
        "title": "源码",
        "description": "开源项目源码下载",
        "seeNum": "248K",
        "num": "45K",
        'bgColor':'rgb(179, 127, 235)',
        'pathData':'M176 416a112 112 0 1 0 0 224 112 112 0 0 0 0-224m0 64a48 48 0 1 1 0 96 48 48 0 0 1 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96'
    },
    {
        "title": "书籍",
        "description": "技术文档和教程",
        "seeNum": "407K",
        "num": "98K",
        'bgColor':'rgb(105, 192, 255)',
        'pathData':'m512 863.36 384-54.848v-638.72L525.568 222.72a96 96 0 0 1-27.136 0L128 169.792v638.72zM137.024 106.432l370.432 52.928a32 32 0 0 0 9.088 0l370.432-52.928A64 64 0 0 1 960 169.792v638.72a64 64 0 0 1-54.976 63.36l-388.48 55.488a32 32 0 0 1-9.088 0l-388.48-55.488A64 64 0 0 1 64 808.512v-638.72a64 64 0 0 1 73.024-63.36'
    },
    {
        "title": "公告",
        "description": "系统公告和通知",
        "seeNum": "315K",
        "num": "58K",
        'bgColor':'rgb(255, 133, 192)',
        'pathData':'M256 768h512V448a256 256 0 1 0-512 0zm256-640a320 320 0 0 1 320 320v384H192V448a320 320 0 0 1 320-320'
    },
    {
        "title": "礼物",
        "description": "免费资源和福利",
        "seeNum": "891K",
        "num": "66K",
        'bgColor':'rgb(255, 214, 102)',
        'pathData':'M480 896V640H192v-64h288V320H192v576zm64 0h288V320H544v256h288v64H544zM128 256h768v672a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32z'
    },
    {
        "title": "公平的世界",
        "description": "开源社区贡献",
        "seeNum": "490K",
        "num": "80K",
        'bgColor':'rgb(255, 156, 110)',
        'pathData':'M176 416a112 112 0 1 0 0 224 112 112 0 0 0 0-224m0 64a48 48 0 1 1 0 96 48 48 0 0 1 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96'
    },
    {
        "title": "休息一下",
        "description": "放松心情，享受生活",
        "seeNum": "664K",
        "num": "78K",
        'bgColor':'rgb(149, 222, 100)',
        'pathData':'M736 800V160H160v640a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64m64-544h63.552a96 96 0 0 1 96 96v224a96 96 0 0 1-96 96H800v128a128 128 0 0 1-128 128H224A128 128 0 0 1 96 800V128a32 32 0 0 1 32-32h640a32 32 0 0 1 32 32zm0 64v288h63.552a32 32 0 0 0 32-32V352a32 32 0 0 0-32-32z'
    }
])
</script>

<script setup>
import { ref, onMounted } from 'vue';
let sayHai = ref('')
let isOpen = ref(false)
const time = new Date().getHours()
import Footer from './footer/footer.vue';
import InitHeader from '../header/InitHeader.vue'
import InitSideBar from '../sideBar/InitSideBar.vue';
import { useRouter } from 'vue-router';
const router = useRouter()
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
        <InitSideBar />
        <div class="mainContent" :class="{ open: store.isOpen }">
            <InitHeader />
            <router-view></router-view>
        </div>
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

.container .mainContent {
    width: 94.7%;
    display: flex;
    flex-direction: column;
    transition: width 0.5s ease-in-out;
}

.container .mainContent.open {
    /* flex: 1; */
    width: 82.5%;
}

/* 选项区域 */

.container .mainContent .sideBarShow {
    margin: 0 auto;
    width: 100%;
    height: 5%;
    border: 1px solid #000;
    opacity: 0.6;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.container .mainContent .sideBarShow .option {
    margin: 0 1%;
    width: 4.5%;
    height: 70%;
    border: 1px solid rgb(78, 136, 243);
    border-radius: 5px;
    color: rgb(78, 136, 243);
    display: flex;
    justify-content: center;
    align-items: center;
}

.container .mainContent .sideBarShow .option:hover {
    /* background-color: #fff; */
}


</style>
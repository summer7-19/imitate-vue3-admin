<template>
    <sideBar />
    <div class="HomePage" :class="{ sideOpen: sidebarStore.openSidebar }">
        <Header></Header>
        <div class="mainbox" :class="{ dashboard: route.name === 'home' }">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import sideBar from './original/sideBar.vue';
import Header from './original/header.vue';
import { useSidebarStore } from '../store/modules/sidebar';

const route = useRoute();
const sidebarStore = useSidebarStore();
</script>

<style>
.HomePage {
    min-width: 0;
    min-height: 0;
    flex: 1;
    margin-left: clamp(64px, 4.5vw, 96px);
    overflow-x: hidden;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: margin-left 0.3s ease;
}

.HomePage.sideOpen {
    margin-left: min(250px, 84vw);
}

.HomePage .header {
    flex-shrink: 0;
    width: 100%;
    height: 56px;
    min-height: 56px;
}

.HomePage .mainbox {
    flex: 1;
    min-height: 0;
    margin: 0 1%;
    background-color: rgb(245, 247, 248);
}

.HomePage .mainbox.dashboard {
    padding: 16px;
    box-sizing: border-box;
}

.HomePage .mainbox.dashboard > * + * {
    margin-top: 14px;
}

@media (max-width: 768px) {
    .HomePage {
        margin-left: 64px;
    }

    .HomePage.sideOpen {
        margin-left: min(84vw, 250px);
    }

    .HomePage .mainbox.dashboard {
        padding: 12px;
    }

    .HomePage .mainbox.dashboard > * + * {
        margin-top: 12px;
    }
}
</style>

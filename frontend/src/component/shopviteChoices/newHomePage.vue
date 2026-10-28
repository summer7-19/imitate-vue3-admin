<script setup>
import InitHeader from '../header/InitHeader.vue'
import InitSideBar from '../sideBar/InitSideBar.vue'
import { useSideBarContent } from '../../store/modules/sidebar'

const sidebar = useSideBarContent()
</script>

<template>
    <div class="container">
        <InitSideBar />
        <div class="mainContent" :class="{ sideOpen: sidebar.isOpen }">
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
    overflow: hidden;
}

.container .mainContent {
    position: relative;
    z-index: 2;
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: margin-left 0.34s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.34s ease;
}

.container .mainContent.sideOpen {
    margin-left: min(250px, 46vw);
    box-shadow: -14px 0 32px rgba(15, 23, 42, 0.16);
}

.container .mainContent > :deep(.headerMain) {
    flex-shrink: 0;
}

.container .mainContent > :deep(.footer) {
    flex-shrink: 0;
}

@media (max-width: 992px) {
    .container .mainContent {
        overflow-y: auto;
    }

    .container .mainContent :deep(.content) {
        height: auto !important;
        overflow-y: visible;
    }
}

@media (max-width: 768px) {
    .container .mainContent.sideOpen {
        margin-left: min(84vw, 250px);
    }
}
</style>

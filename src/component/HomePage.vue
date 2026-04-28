<template>
    <sideBar/>
    <div class="HomePage">
        <!-- <div class="header"> -->
        <Header></Header>
        <div class="mainbox">
            <changeText></changeText>
            <chooseOptions></chooseOptions>
            <svgShowData></svgShowData>
            <versionInfo></versionInfo>
        </div>
        <!-- </div> -->
    </div>
</template>
<script setup>
import sideBar from './original/sideBar.vue';
import Header from './original/header.vue';
import changeText from './original/changeText.vue';
import chooseOptions from './original/chooseOptions.vue';
import svgShowData from './original/svgShowData.vue';
import versionInfo from './original/versionInfo.vue';
</script>
<style>
.HomePage {
    min-height: 0;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
    /* border: 1px solid #000; */
    display: flex;
    flex-direction: column;
    position: relative;
}

.HomePage .header {
    width: 100%;
    height: 5%;
}

.HomePage .mainbox {
    margin: 0 1%;
    min-height: 94%;
    background-color: rgb(245, 247, 248);
}
</style>
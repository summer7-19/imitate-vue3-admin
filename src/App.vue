<script setup>
import HomePage from './component/HomePage.vue';
import SideBar from './component/original/sideBar.vue';
import jobWeb from './component/jobWeb.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app">
    <!-- <SideBar /> -->
    <!-- <HomePage /> -->
     <RouterView></RouterView>
  </div>
</template>

<style scoped>
.app{
  height: 100%; 
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  /* border: 1px solid #000; */
  /* background-color: rgb(246, 248, 249); */
}
</style>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const items = computed(() =>
  route.matched.filter((item) => item.meta?.title && !item.meta?.hidden)
)
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-if="items.length === 0">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in items" :key="item.path">
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const children = computed(() =>
  (props.item.children || []).filter((child) => !child.meta?.hidden)
)
const hasChildren = computed(() => children.value.length > 0)
</script>

<template>
  <el-sub-menu v-if="hasChildren" :index="item.path">
    <template #title>
      <el-icon v-if="item.meta?.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta?.title }}</span>
    </template>
    <SidebarItem
      v-for="child in children"
      :key="child.path"
      :item="child"
    />
  </el-sub-menu>

  <el-menu-item v-else :index="item.path">
    <el-icon v-if="item.meta?.icon">
      <component :is="item.meta.icon" />
    </el-icon>
    <template #title>
      <span>{{ item.meta?.title }}</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div>我是App</div>
  <el-button round plain type="primary" :icon="Edit">按钮</el-button>
  <router-view></router-view>
</template>

<style scoped></style>

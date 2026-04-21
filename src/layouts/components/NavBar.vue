<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { removeLocalToken } from '@/utils/auth'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

/**
 * 下拉菜单
 *   1. 首页
 *   2. 项目地址
 *   3. 退出登录
 *     3.1. 确认框
 *     3.2. 清空用户信息
 *     3.3. 跳转到登录页
 */
const router = useRouter()
const userStore = useUserStore()
const handleCommand = async (command: string) => {
  if (command === 'home') {
    // 1. 首页
    router.push('/')
  } else if (command === 'projects') {
    // 2. 项目地址
    window.open('https://github.com/u7663394/intelliAdmin-vue3-ts', '_blank')
  } else if (command === 'logout') {
    // 3.1. 确认框
    await ElMessageBox.confirm('您确定要退出登录吗?', '退出提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    // 3.2. 清空用户信息
    userStore.setToken('')
    removeLocalToken()
    // 3.3. 跳转到登录页
    router.push('/login')
  }
}
</script>

<template>
  <div class="nav-bar">
    <!-- breadcrumb -->
    <div></div>
    <!-- dropdown -->
    <el-dropdown @command="handleCommand">
      <div class="user-wrapper">管理员</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="home">首页</el-dropdown-item>
          <el-dropdown-item command="projects">项目地址</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.nav-bar {
  height: 60px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .user-wrapper {
    outline: none;
    cursor: default;
    color: var(--el-color-black);
  }
}
</style>

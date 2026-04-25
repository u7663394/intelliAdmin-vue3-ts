<script setup lang="ts">
import { getRoleListAPI } from '@/apis/system'
import type { Role } from '@/types/system'
import { ref } from 'vue'
import user from '@/assets/user.svg'
import activeUser from '@/assets/user-active.svg'

/**
 * 获取角色列表 + 渲染
 */
const roleLoading = ref(false)
const roleList = ref<Role[]>([])
const getRoleList = async () => {
  roleLoading.value = true
  const res = await getRoleListAPI()
  roleList.value = res.data
  roleLoading.value = false
}
getRoleList()

/**
 * 点击激活高亮
 */
const activeIndex = ref(0)
const changeRole = (index: number) => {
  activeIndex.value = index
}
</script>

<template>
  <div class="role-container">
    <div class="left-wrapper" v-loading="roleLoading">
      <div
        v-for="(item, index) in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{ active: index === activeIndex }"
        @click="changeRole(index)"
      >
        <div class="role-info">
          <img :src="index === activeIndex ? activeUser : user" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <img src="@/assets/more.svg" class="icon" />
        </div>
      </div>
      <el-button class="addBtn" size="small">添加角色</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;
    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;
      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }
    .role-info {
      display: flex;
      align-items: center;
      .icon {
        margin-right: 10px;
        width: 20px;
      }
    }
    .more {
      display: flex;
      align-items: center;
      .icon {
        width: 15px;
      }
    }
    .addBtn {
      width: 100%;
      margin-top: 20px;
    }
  }
  .right-wrapper {
    flex: 1;
    .tree-wrapper {
      display: flex;
      justify-content: space-between;
      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }
    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }
    .user-wrapper {
      padding: 20px;
    }
  }
}
</style>

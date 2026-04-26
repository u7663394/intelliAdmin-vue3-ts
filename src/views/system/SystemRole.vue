<script setup lang="ts">
import {
  delRoleUserAPI,
  getRoleDetailAPI,
  getRoleListAPI,
  getRoleUserAPI,
  getTreeListAPI,
} from '@/apis/system'
import type { Role, RoleData, RoleUser } from '@/types/system'
import { ref } from 'vue'
import user from '@/assets/user.svg'
import activeUser from '@/assets/user-active.svg'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 获取角色列表 + 渲染
 */
const activeName = ref('tree')
const roleLoading = ref(false)
const roleList = ref<Role[]>([])

const getRoleList = async () => {
  roleLoading.value = true
  const res = await getRoleListAPI()
  roleList.value = res.data
  getRoleDetail(roleList.value[0]!.roleId!)
  getRoleUserList(roleList.value[0]!.roleId!)
  roleLoading.value = false
}
getRoleList()

/**
 * 点击激活高亮
 */
const activeIndex = ref(0)
const changeRole = (index: number) => {
  activeIndex.value = index
  const roleId = roleList.value[index]!.roleId
  if (roleId) {
    getRoleDetail(roleId)
    getRoleUserList(roleId)
  }
}

/**
 * 获取权限树列表
 */
const treeList = ref<RoleData[]>([])
const getTreeList = async () => {
  const res = await getTreeListAPI()
  treeList.value = res.data
  addDisabled(treeList.value)
}
getTreeList()

/**
 * 递归禁用
 */
const addDisabled = (treeList: RoleData[]) => {
  treeList.forEach((ele) => {
    ele.disabled = true
    // 递归处理
    if (ele.children) {
      addDisabled(ele.children)
    }
  })
}

/**
 * 获取角色详情
 *   1. 调接口获取权限列表
 *   2. 遍历权限树，设置选中状态
 */
const treeRef = ref()
const permList = ref<number[]>([])
const getRoleDetail = async (roleId: number) => {
  // 1. 调接口
  const res = await getRoleDetailAPI(roleId)
  permList.value = res.data.perms
  // 2. 遍历树，设置状态
  treeRef.value.forEach((ele: any, index: number) => {
    ele.setCheckedKeys(permList.value[index]!)
  })
}

/**
 * 获取角色成员列表
 */
const roleUserList = ref<RoleUser[]>([])
const getRoleUserList = async (roleId: number) => {
  const res = await getRoleUserAPI(roleId)
  roleUserList.value = res.data.rows
}

/**
 * 编辑 + 删除角色
 */
const router = useRouter()
const onCommand = async (command: string, roldId: number) => {
  // 1. 编辑角色
  if (command === 'edit') {
    router.push(`/roleAdd?id=${roldId}`)
  }
  // 2. 删除角色
  if (command === 'del') {
    await ElMessageBox.confirm('是否确认删除当前角色?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await delRoleUserAPI(roldId + '')
    await getRoleList()
    ElMessage.success('删除成功!')
    activeIndex.value = 0
  }
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
        <el-tooltip effect="dark" :content="item.roleName" placement="top">
          <div class="role-info">
            <img :src="index === activeIndex ? activeUser : user" class="icon" />
            {{ item.roleName }}
          </div>
        </el-tooltip>
        <div class="more">
          <el-dropdown @command="onCommand($event, item.roleId!)">
            <span class="el-dropdown-link">
              <img src="@/assets/more.svg" class="icon" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="edit">编辑角色</el-dropdown-item>
                <el-dropdown-item command="del">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="small" @click="$router.push('/roleAdd')">添加角色</el-button>
    </div>
    <!-- 右侧权限和成员 -->
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="tree">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="treeRef"
                :data="item.children"
                node-key="id"
                :props="{ label: 'title' }"
                show-checkbox
                :default-expand-all="true"
              ></el-tree>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员(${roleUserList.length})`" name="member">
          <div class="user-wrapper">
            <el-table :data="roleUserList">
              <el-table-column type="index" width="250" label="序号" />
              <el-table-column prop="name" label="员工姓名" />
              <el-table-column prop="userName" label="登录账号" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
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

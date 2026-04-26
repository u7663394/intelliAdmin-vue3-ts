<script setup lang="ts">
import { getTreeListAPI } from '@/apis/system'
import type { RoleData } from '@/types/system'
import { ElMessage, ElTree } from 'element-plus'
import { ref } from 'vue'

/**
 * 步骤增加与减少
 */
const activeStep = ref(0)

const decreseStep = () => {
  if (activeStep.value === 0) {
    return ElMessage.warning('已经是第一步了')
  }
  activeStep.value--
}

const increseStep = async () => {
  if (activeStep.value === 2) {
    return ElMessage.warning('已经是最后一步了')
  }
  if (activeStep.value === 0) {
    await roleFormRef.value.validate()
  }
  if (activeStep.value === 1) {
    // 先置空: 防止累加
    roleForm.value.perms = []
    // 获取所有树组件的选中项
    treeRef.value!.forEach((ele: any) => {
      roleForm.value.perms.push(ele.getCheckedKeys())
    })
    // 如果没有选中, 提示
    if (roleForm.value.perms.flat().length === 0) {
      return ElMessage.warning('请至少选择一个权限')
    }
  }
  activeStep.value++
  // 展示已选权限
  diabledTreeRef.value!.forEach((tree, index) => {
    tree.setCheckedKeys(roleForm.value.perms[index])
  })
}

/**
 * 第一步: 角色信息表单数据
 */
const roleFormRef = ref()

const roleForm = ref({
  roleName: '',
  remark: '',
  perms: [] as any[],
})

const roleRules = ref({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
})

/**
 * 第二步: 权限树数据
 */
const treeRef = ref()
const treeList = ref<RoleData[]>([])
const getTreeList = async () => {
  const res = await getTreeListAPI()
  treeList.value = res.data
}
getTreeList()

/**
 * 第三步: 禁用树组件, 展示已选权限
 */
const diabledTreeRef = ref<InstanceType<typeof ElTree>[]>()
</script>

<template>
  <div class="add-role">
    <header class="add-header">
      <el-page-header content="添加角色" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="step-container">
        <!-- 
        step 组件: 
          1. active: 当前高亮步骤
          2. direction: 步骤展示方向
        -->
        <el-steps direction="vertical" :active="activeStep">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div v-show="activeStep === 0" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="roleFormRef" class="form-box" :model="roleForm" :rules="roleRules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="activeStep === 1" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="treeRef"
                :data="item.children"
                show-checkbox
                default-expand-all
                node-key="id"
                highlight-current
                :props="{ label: 'title' }"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="activeStep === 2" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in treeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="diabledTreeRef"
                  :data="item.children"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  :highlight-current="false"
                  :props="{ label: 'title', disabled: () => true }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button v-if="activeStep > 0" @click="decreseStep">上一步</el-button>
        <el-button v-if="activeStep < 2" type="primary" @click="increseStep">下一步</el-button>
        <el-button v-if="activeStep === 2" type="primary">确认添加</el-button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;
  .add-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;
    .left {
      span {
        margin-right: 4px;
      }
      .arrow {
        cursor: pointer;
      }
    }
    .right {
      text-align: right;
    }
  }
  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 30px;
    display: flex;
    .step-container {
      height: 400px;
      width: 200px;
    }
    .form-container {
      flex: 1;
      background-color: #fff;
      overflow-y: auto;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
          display: flex;
          flex-wrap: wrap;
        }
        .info {
          font-size: 14px;
          color: #666;
          .form-item {
            margin-bottom: 20px;
          }
        }
      }
      .form-box {
        width: 600px;
        display: flex;
        flex-direction: column;
      }
    }
  }
  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
    z-index: 10001;
  }
  .tree-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .tree-item {
      flex: 1;
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
}
</style>

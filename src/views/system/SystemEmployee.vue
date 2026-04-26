<script setup lang="ts">
import { createEmployeeAPI, delEmployeeAPI, getEmployeeListAPI } from '@/apis/employee'
import { getRoleListAPI } from '@/apis/system'
import type { Employee, EmployeeParams } from '@/types/employee'
import type { Role } from '@/types/system'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

/**
 * 获取员工列表 + 渲染
 */
const loading = ref(false)
const total = ref(0)
const employeeList = ref<Employee[]>([])

const params = ref<EmployeeParams>({
  page: 1,
  pageSize: 10,
  name: '',
})

const getEmployeeList = async () => {
  loading.value = true
  const res = await getEmployeeListAPI(params.value)
  employeeList.value = res.data.rows
  total.value = res.data.total
  loading.value = false
}
getEmployeeList()

const pageChange = (newPage: number) => {
  params.value.page = newPage
  getEmployeeList()
}

/**
 * 添加员工表单与弹窗
 */
const dialogVisible = ref(false)
const roleList = ref<Role[]>([])

const addForm = ref({
  name: '',
  phonenumber: '',
  roleId: '',
  status: 1,
  userName: '',
})

const addFormRules = ref({
  name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
  phonenumber: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  roleId: [{ required: true, message: '请分配角色', trigger: 'blur' }],
  status: [{ required: true, message: '请选择员工状态', trigger: 'blur' }],
})

/**
 * 添加员工
 */
const addEmployee = async () => {
  dialogVisible.value = true
  const res = await getRoleListAPI()
  roleList.value = res.data
}

/**
 * 确认添加
 */
const addFormRef = ref()
const confirmAdd = async () => {
  // 1. 调用接口
  await createEmployeeAPI(addForm.value)
  ElMessage.success('添加成功')
  // 2. 关闭弹框
  dialogVisible.value = false
  // 3. 重新获取列表
  getEmployeeList()
  // 4. 清空旧表单
  addFormRef.value.resetFields()
}

/**
 * 删除员工
 */
const delEmployee = async (id: string) => {
  // 1. 确认框
  await ElMessageBox.confirm('删除员工后将不可恢复, 确认删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  // 2. 调接口
  await delEmployeeAPI(id)
  /// 3. 提示 + 刷新列表
  ElMessage.success('删除成功')
  getEmployeeList()
}
</script>

<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="addEmployee">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table" v-loading="loading">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column align="center" type="index" label="序号" width="100" />
        <el-table-column align="center" label="员工姓名" width="115" prop="name" />
        <el-table-column align="center" label="登录账号" width="115" prop="userName" />
        <el-table-column align="center" label="联系方式" width="115" prop="phonenumber" />
        <el-table-column align="center" label="角色" width="115" prop="roleName" />
        <el-table-column align="center" label="状态" width="115">
          <template #default="scope">
            {{ scope.row.status === 0 ? '正常' : '停用' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="添加时间" prop="createTime" width="200" />
        <el-table-column align="center" label="操作" fixed="right" width="220">
          <template #default="{ row }">
            <el-button size="small" type="text">编辑</el-button>
            <el-button size="small" type="text" @click="delEmployee(row.id)">删除</el-button>
            <el-button size="small" type="text">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container" style="float: right">
      <el-pagination
        layout="total, prev, pager, next"
        :page-size="params.pageSize"
        :total="total"
        @current-change="pageChange"
      />
    </div>
    <!-- 添加员工 -->
    <el-dialog
      title="添加员工"
      width="480px"
      v-model="dialogVisible"
      @close="dialogVisible = false"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="addForm.phonenumber" />
          </el-form-item>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId!"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}
.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  .search-label {
    width: 100px;
  }
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>

<script setup lang="ts">
import { getEmployeeListAPI } from '@/apis/employee'
import type { Employee, EmployeeParams } from '@/types/employee'
import { lo } from 'element-plus/es/locale/index.mjs'
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
      <el-button type="primary">添加员工</el-button>
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
          <template #default>
            <el-button size="small" type="text">编辑</el-button>
            <el-button size="small" type="text">删除</el-button>
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

<script setup lang="ts">
import { delEnterpriseAPI, getEnterpriseListAPI, getRentBuildListAPI } from '@/apis/enterprise'
import type { Enterprise, EnterpriseListParams } from '@/types/enterprise'
import { ElMessage, ElMessageBox, type FormRules } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 获取企业列表并渲染
 */
const total = ref(0)
const exterpriseList = ref<Enterprise[]>([])
const params = ref<EnterpriseListParams>({
  page: 1,
  pageSize: 10,
  name: '',
})

const getExterpriseList = async () => {
  const res = await getEnterpriseListAPI(params.value)
  exterpriseList.value = res.data?.rows
  total.value = res.data?.total
}
getExterpriseList()

/**
 * 联系电话脱敏
 */
const formatContactNumber = (row: any) => {
  const contactNumber = row.contactNumber
  if (contactNumber.length === 11) {
    return contactNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
  return contactNumber
}

/**
 * 分页事件
 */
const pageChange = (newPage: number) => {
  params.value.page = newPage
  getExterpriseList()
}

/**
 * 搜索
 */
const searchLoading = ref(false)
const onSearch = async () => {
  searchLoading.value = true
  params.value.page = 1
  await getExterpriseList()
  searchLoading.value = false
}

/**
 * 编辑企业
 */
const router = useRouter()
const editRent = (id: string) => {
  router.push(`/enterpriseAdd?id=${id}`)
}

/**
 * 删除企业
 */
const onDelete = async (id: string) => {
  await ElMessageBox.confirm('确认删除该企业吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await delEnterpriseAPI(id)
  getExterpriseList()
  ElMessage.success('删除成功!')
}

/**
 * 添加合同对话框
 */
const buildList = ref<{ id: string; name: string }[]>([])
const rentDialogVisible = ref(false)

const addRent = async () => {
  rentDialogVisible.value = true
  const res = await getRentBuildListAPI()
  buildList.value = res.data
}

const closeDialog = () => {
  rentDialogVisible.value = false
}

/**
 * 添加合同表单
 */
const rentForm = ref({
  buildingId: undefined,
  contractId: undefined,
  contractUrl: '',
  enterpriseId: undefined,
  type: 0,
  rentTime: [],
})

const rentRules = ref<FormRules>({
  buildingId: [{ required: true, message: '请选择楼宇', trigger: 'change' }],
  rentTime: [{ required: true, message: '请选择租赁日期', trigger: 'change' }],
  contractId: [{ required: false, message: '请上传合同文件' }],
})
</script>

<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input
        v-model="params.name"
        clearable
        placeholder="请输入企业名称"
        class="search-main"
        @clear="onSearch"
      />
      <el-button :loading="searchLoading" type="primary" @click="onSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/enterpriseAdd')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table" v-loading="searchLoading">
      <el-table style="width: 100%" :data="exterpriseList">
        <el-table-column align="center" type="index" label="序号" width="120" />
        <el-table-column align="center" label="企业名称" width="320" prop="name" />
        <el-table-column align="center" label="联系人" prop="contact" />
        <el-table-column
          align="center"
          label="联系电话"
          prop="contactNumber"
          :formatter="formatContactNumber"
        />
        <el-table-column align="center" label="操作" width="350">
          <template #default="scope">
            <el-button size="small" type="text" @click="addRent">添加合同</el-button>
            <el-dialog
              :modal="false"
              title="添加合同"
              v-model="rentDialogVisible"
              width="580px"
              @close="closeDialog"
            >
              <!-- 表单区域 -->
              <div class="form-container">
                <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
                  <el-form-item label="租赁楼宇" prop="buildingId">
                    <el-select v-model="rentForm.buildingId" placeholder="请选择">
                      <el-option
                        v-for="item in buildList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="租赁起止日期" prop="rentTime">
                    <el-date-picker
                      v-model="rentForm.rentTime"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                  <el-form-item label="租赁合同" prop="contractId">
                    <el-upload action="#">
                      <el-button size="small" type="primary" plain>上传合同文件</el-button>
                      <div style="margin-left: 15px" slot="tip" class="el-upload__tip">
                        支持扩展名：.doc .pdf, 文件大小不超过5M
                      </div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </div>
              <template #footer>
                <el-button size="small" @click="closeDialog">取 消</el-button>
                <el-button size="small" type="primary">确 定</el-button>
              </template>
            </el-dialog>
            <el-button size="small" type="text">查看</el-button>
            <el-button size="small" type="text" @click="editRent(scope.row.id)">编辑</el-button>
            <el-button size="small" type="text" @click="onDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container" style="float: right">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.building-container {
  padding: 20px;
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

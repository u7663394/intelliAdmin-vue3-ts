<script setup lang="ts">
import {
  createRentAPI,
  delEnterpriseAPI,
  getEnterpriseListAPI,
  getRentBuildListAPI,
  getRentListAPI,
  outRentAPI,
  uploadAPI,
} from '@/apis/enterprise'
import type { Enterprise, EnterpriseListParams } from '@/types/enterprise'
import {
  ElMessage,
  ElMessageBox,
  type FormRules,
  type UploadRawFile,
  type UploadRequestOptions,
} from 'element-plus'
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
  exterpriseList.value = res.data?.rows.map((ele) => {
    return {
      ...ele,
      rentList: [],
    }
  })
  total.value = res.data?.total
}
getExterpriseList()

/**
 * 获取合同列表并渲染
 */
const rentLoading = ref(false)
const expandRowKeys = ref<string[]>([])

const handleExpand = async (row: any, rows: any[]) => {
  const isExpend = rows.find((item) => item.id === row.id)
  // 展开时，获取合同列表并渲染
  if (isExpend) {
    rentLoading.value = true
    const res = await getRentListAPI(row.id)
    res.data.forEach((ele) => {
      row.rentList.push(ele)
    })
    expandRowKeys.value.push(row.id)
    rentLoading.value = false
  } else {
    // 关闭时，把当前行的合同列表清空
    row.rentList.splice(0)
    expandRowKeys.value = expandRowKeys.value.filter((value) => value !== row.id)
  }
}

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

const addRent = async (id: string) => {
  rentDialogVisible.value = true
  const res = await getRentBuildListAPI()
  buildList.value = res.data
  rentForm.value.enterpriseId = id
}

const closeDialog = () => {
  rentDialogVisible.value = false
}

/**
 * 添加合同表单
 */
const rentForm = ref<any>({
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

/**
 * 上传合同文件
 */
const beforeUpload = (file: UploadRawFile) => {
  // 1. 校验文件类型
  const allowType = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ].includes(file.type)
  // 2. 校验文件大小
  const isValidSize = file.size / 1024 / 1024 < 5
  // 3. 提示错误信息
  if (!allowType) ElMessage.error('上传合同文件只能是 .doc, .pdf 格式')
  if (!isValidSize) ElMessage.error('上传合同文件大小不能超过 5MB')
  // 最后返回 boolean 值，决定是否上传
  return allowType && isValidSize
}

const contractList = ref<any>([])
const uploadHandle = async (options: UploadRequestOptions) => {
  const file = options.file
  // 1. 构造 FormData 对象
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'contract')
  // 2. 调用上传接口
  const res: any = await uploadAPI(formData)
  rentForm.value.contractId = res.data.id
  rentForm.value.contractUrl = res.data.url
  contractList.value.push({ name: file.name, url: res.data.url })
}

/**
 * 确认添加合同
 *   1. 验证表单
 *   2. 调用添加接口
 *   3. 刷新企业列表
 *   4. 关闭对话框并清空表单
 */
const addForm = ref()
const confirmAdd = async () => {
  // 1. 验证表单
  await addForm.value.validate()
  // 2. 调用添加接口
  const { buildingId, contractId, contractUrl, enterpriseId, type } = rentForm.value
  await createRentAPI({
    buildingId,
    contractId,
    contractUrl,
    enterpriseId,
    type,
    startTime: rentForm.value.rentTime[0],
    endTime: rentForm.value.rentTime[1],
  })
  ElMessage.success('添加合同成功')
  // 3. 刷新企业列表
  getExterpriseList()
  // 4. 关闭对话框并清空表单
  rentDialogVisible.value = false
  addForm.value.resetFields()
  rentForm.value.contractUrl = ''
  rentForm.value.contractId = ''
  contractList.value = []
}

/**
 * 格式化合同状态
 *   1. :type 属性控制标签颜色
 *   2. 标签内容显示文本
 */
const formatInfoType = (status: number) => {
  switch (status) {
    case 0:
      return 'warning'
    case 1:
      return 'success'
    case 2:
      return 'info'
    case 3:
      return 'danger'
  }
}

const formatStatus = (type: number) => {
  switch (type) {
    case 0:
      return '待生效'
    case 1:
      return '生效中'
    case 2:
      return '已到期'
    case 3:
      return '已退租'
  }
}

/**
 * 退租功能
 *   1. 确认框
 *   2. 调用退租接口
 *   3. 重新渲染 + 提示
 */
const outRent = async (rentId: string, rowId: string) => {
  // 1. 确认框
  await ElMessageBox.confirm('确认退租吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  // 2. 调用退租接口
  await outRentAPI(rentId)
  // 2. 重新渲染 + 提示
  await getExterpriseList()
  expandRowKeys.value = []
  ElMessage.success('退租成功!')
}
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
      <el-table
        style="width: 100%"
        :data="exterpriseList"
        @expand-change="handleExpand"
        row-key="id"
        :expand-row-keys="expandRowKeys"
      >
        <!-- 展开部分 -->
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-table :data="row.rentList" v-loading="rentLoading">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime" />
              <el-table-column align="center" label="合同状态">
                <template #default="scope">
                  <el-tag :type="formatInfoType(scope.row.status)">
                    {{ formatStatus(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="250">
                <template #default="scope">
                  <el-button size="small" type="text">续租</el-button>
                  <el-button
                    size="small"
                    type="text"
                    :disabled="scope.row.status === 3"
                    @click="outRent(scope.row.id, row.id)"
                    >退租</el-button
                  >
                  <el-button size="small" type="text" :disabled="!(scope.row.status === 3)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
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
            <el-button size="small" type="text" @click="addRent(scope.row.id)">添加合同</el-button>
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
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
                  <el-form-item label="租赁合同" prop="contractId">
                    <el-upload
                      action="#"
                      :http-request="uploadHandle"
                      :before-upload="beforeUpload"
                      :file-list="contractList"
                      >>
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
                <el-button size="small" type="primary" @click="confirmAdd">确 定</el-button>
              </template>
            </el-dialog>
            <el-button
              size="small"
              type="text"
              @click="$router.push(`/enterpriseDetail?id=${scope.row.id}`)"
              >查看</el-button
            >
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

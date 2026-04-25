<script setup lang="ts">
import { createEnterpriseAPI, getIndustryListAPI, uploadAPI } from '@/apis/enterprise'
import type { EnterpriseParams, Industry } from '@/types/enterprise'
import { validMobile } from '@/utils/validate'
import {
  ElMessage,
  type UploadRawFile,
  type UploadRequestOptions,
  type UploadUserFile,
} from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 表单数据绑定 + 校验
 */
const addForm = ref<EnterpriseParams>({
  name: '',
  legalPerson: '',
  registeredAddress: '',
  industryCode: '', // 所在行业
  contact: '',
  contactNumber: '',
  businessLicenseUrl: '', // 营业执照url
  businessLicenseId: '',
})

const addRules = ref({
  name: [{ required: true, message: '企业名称为必填', trigger: 'blur' }],
  legalPerson: [{ required: true, message: '法人为必填', trigger: 'blur' }],
  registeredAddress: [{ required: true, message: '注册地址为必填', trigger: 'blur' }],
  industryCode: [{ required: true, message: '所在行业为必填', trigger: 'change' }],
  contact: [{ required: true, message: '企业联系人为必填', trigger: 'blur' }],
  contactNumber: [
    { required: true, message: '企业联系人电话为必填', trigger: 'blur' },
    { validator: validMobile, trigger: 'blur' },
  ],
  businessLicenseId: [{ required: false, message: '请上传营业执照', trigger: 'blur' }],
})

/**
 * 渲染行业列表
 */
const industryList = ref<Industry[]>([])
const getIndustryList = async () => {
  const res = await getIndustryListAPI()
  industryList.value = res.data
}
getIndustryList()

/**
 * 上传营业执照
 *   1. 包装为 FormData 对象
 *   2. 调用上传接口
 *   3. 回存表单数据
 *   4. 更新上传组件 -> 显示已上传的文件
 */
const fileList = ref<UploadUserFile[]>([])
const uploadRequest = async (options: UploadRequestOptions) => {
  const file = options.file
  // 1. 包装为 FormData 对象
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'businessLicense')
  // 2. 调用上传接口
  const res: any = await uploadAPI(formData)
  // 3. 回存表单数据
  addForm.value.businessLicenseId = res.data.id
  addForm.value.businessLicenseUrl = res.data.url
  // 4. 更新上传组件 -> 本地显示已上传的文件
  fileList.value.push({
    name: file.name,
    url: res.data.url,
  })
}

/**
 * 文件上传前校验
 */
const onExceed = () => {
  ElMessage.error('只能上传一张营业执照')
}

const beforeUpload = (file: UploadRawFile) => {
  // 1. 校验文件类型
  const allowType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
  // 2. 校验文件大小 （byte -> kb -> mb）
  const isValidSize = file.size / 1024 / 1024 < 5
  // 3. 不满足条件则提示错误
  if (!allowType) ElMessage.error('上传图片只能是 PNG/JPG/JPEG 格式')
  if (!isValidSize) ElMessage.error('上传图片大小不能超过 5MB')
  // 返回 boolean 决定是否上传
  return allowType && isValidSize
}

/**
 * 重置表单
 */
const ruleForm = ref()
const resetForm = () => {
  ruleForm.value.resetFields()
  fileList.value = []
}

/**
 * 提交表单
 *   1. 表单校验
 *   2. 调用添加接口
 *   3. 提示成功 + 返回
 */
const router = useRouter()
const submitForm = async () => {
  // 1. 表单校验
  await ruleForm.value.validate()
  // 2. 调用添加接口
  await createEnterpriseAPI(addForm.value)
  // 3. 提示成功 + 返回
  ElMessage.success('添加成功')
  router.back()
}
</script>

<template>
  <div class="add-enterprise">
    <header class="add-header">
      <el-page-header content="添加企业" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form ref="ruleForm" :model="addForm" :rules="addRules" label-width="100px">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <el-upload
                action="#"
                :file-list="fileList"
                :http-request="uploadRequest"
                :before-upload="beforeUpload"
                :limit="1"
                :on-exceed="onExceed"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div style="margin-left: 15px" slot="tip" class="el-upload__tip">
                  支持扩展名：.png .jpg .jpeg, 文件大小不得超过5M
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.add-enterprise {
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
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

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

          .el-form-item {
            width: 50%;
          }
        }
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
  }
}
</style>

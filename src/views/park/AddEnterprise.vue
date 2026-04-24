<script setup lang="ts">
import { getIndustryListAPI, uploadAPI } from '@/apis/enterprise'
import type { EnterpriseParams, Industry } from '@/types/enterprise'
import type { UploadRequestOptions, UploadUserFile } from 'element-plus'
import { ref } from 'vue'

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
          <el-form ref="ruleForm" label-width="100px">
            <el-form-item label="企业名称">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照">
              <el-upload action="#" :file-list="fileList" :http-request="uploadRequest">
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
        <el-button>重置</el-button>
        <el-button type="primary">确定</el-button>
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

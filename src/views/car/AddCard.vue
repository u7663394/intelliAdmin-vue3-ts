<script lang="ts" setup>
import { createCardAPI } from '@/apis/card'
import type { CardParms } from '@/types/card'
import { validateCarNumber } from '@/utils/validate'
import { ElMessage, ElMessageBox, type FormRules } from 'element-plus'
import { lo } from 'element-plus/es/locale/index.mjs'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 车辆信息表单
 *   1. 表单数据绑定
 *   2. 校验
 */
const carInfoForm = ref<CardParms>({
  personName: 'Test User',
  phoneNumber: '13312345678',
  carNumber: '川A12345',
  carBrand: 'Test Brand',
})

const carInfoRules = ref<FormRules<CardParms>>({
  personName: [{ required: true, message: '请输入车主姓名', trigger: 'blur' }],
  phoneNumber: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[34578]\d{9}$/, message: '请输入正确格式手机号' },
  ],
  carNumber: [
    { required: true, message: '请输入车辆号码', trigger: 'blur' },
    { validator: validateCarNumber, trigger: 'blur' },
  ],
  carBrand: [{ required: true, message: '请输入车辆品牌', trigger: 'blur' }],
})

/**
 * 月卡缴费信息表单
 *   1. 表单数据绑定
 *   2. 校验
 */
const feeForm = ref({
  payTime: [],
  paymentAmount: undefined,
  paymentMethod: undefined,
})

const feeFormRules = ref({
  payTime: [{ required: true, message: '请选择支付时间' }],
  paymentAmount: [{ required: true, message: '请输入支付金额', trigger: 'blur' }],
  paymentMethod: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
})

/**
 * 支付方式列表
 */
const payMethodList = [
  { id: 'Alipay', name: '支付宝' },
  { id: 'WeChat', name: '微信' },
  { id: 'Cash', name: '线下' },
]

/**
 * 提交表单
 *   1. 校验
 *   2. 调用接口
 */
const carInfoFormRef = ref()
const feeFormRef = ref()
const router = useRouter()
const loading = ref(false)

const onConfirm = async () => {
  // 1. 校验表单
  await carInfoFormRef.value.validate()
  await feeFormRef.value.validate()
  // 2. 调用接口
  const payload = {
    paymentAmount: feeForm.value.paymentAmount,
    paymentMethod: feeForm.value.paymentMethod,
    ...carInfoForm.value,
    // 单独处理时间
    cardStartDate: feeForm.value.payTime[0],
    cardEndDate: feeForm.value.payTime[1],
  }
  loading.value = true
  await createCardAPI(payload)
  loading.value = false
  ElMessage.success('添加月卡成功')
  router.back()
}

/**
 * 重置表单
 *   1. 确认框
 *   2. 重置表单数据
 */
const onReset = async () => {
  // 1. 确认框
  await ElMessageBox.confirm('确定要重置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  // 2. 重置表单数据
  carInfoFormRef.value.resetFields()
  feeFormRef.value.resetFields()
}
</script>

<template>
  <div class="add-card">
    <header class="add-header">
      <!-- 
       header 组件: 
         1. content: 标题
         2. @back: 点击返回按钮的回调函数
      -->
      <el-page-header content="添加月卡" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form
            ref="carInfoFormRef"
            :model="carInfoForm"
            :rules="carInfoRules"
            label-width="100px"
          >
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="feeFormRef" label-width="100px" :model="feeForm" :rules="feeFormRules">
            <el-form-item label="有效日期" prop="payTime">
              <!-- 
               date-picker 组件:
                 1. type: 日期选择器的类型，支持 date、daterange、datetime、datetimerange 等
                 2. value-format: 绑定值的格式
                 3. range-separator: 选择范围时的分隔符
              -->
              <el-date-picker
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-model="feeForm.payTime"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="feeForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod" clearable>
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onConfirm" :loading="loading">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;
  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
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
    .preview {
      img {
        width: 100px;
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

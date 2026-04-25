<script lang="ts" setup>
import { getRuleListAPI } from '@/apis/car'
import type { Car, CarListParams } from '@/types/car'
import { ref } from 'vue'
import { utils, writeFileXLSX } from 'xlsx'

/**
 * 获取规则列表 + 渲染
 */
const ruleList = ref<Car[]>([])
const total = ref(0)
const showLoading = ref(false)
const params = ref<CarListParams>({
  page: 1,
  pageSize: 5,
})

const getRuleList = async () => {
  showLoading.value = true
  const res = await getRuleListAPI(params.value)
  ruleList.value = res.data.rows
  total.value = res.data.total
  showLoading.value = false
}
getRuleList()

const chargeType: any = {
  duration: '时长收费',
  turn: '按次收费',
  partition: '分段消费',
}

/**
 * 导出为 Excel
 */

// 表头英文字段
const tableHeaderKeys = [
  'ruleNumber',
  'ruleName',
  'freeDuration',
  'chargeCeiling',
  'chargeType',
  'ruleNameView',
]
// 表头中文字段
const tableHeaderValues = [
  '计费规则编号',
  '计费规则名称',
  '免费时长(分钟)',
  '收费上线(元)',
  '计费方式',
  '计费规则',
]

const exportToExcel = () => {
  // 0. 处理业务数据
  const sheetData = ruleList.value.map((ele: any) => {
    const output: any = {}
    tableHeaderKeys.forEach((key) => {
      if (key === 'chargeType') {
        output[key] = chargeType[ele[key]]
      } else {
        output[key] = ele[key]
      }
    })
    return output
  })
  // 1. 创建一个新的 workbook
  const workbook = utils.book_new()
  // 2. 创建一个 worksheet, 传入 sheetData 数据
  const worksheet = utils.json_to_sheet(sheetData)
  // 3. 把 worksheet 添加到 workbook 中, 并命名为 'Data'
  utils.book_append_sheet(workbook, worksheet, 'Data')
  // 4. 改写表头
  utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
  // 5. 导出 Excel 文件
  writeFileXLSX(workbook, '停车计费规则.xlsx')
}
</script>

<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary">增加停车计费规则</el-button>
      <el-button @click="exportToExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table v-loading="showLoading" :data="ruleList" style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="100" />
        <el-table-column align="center" label="计费规则编号" prop="ruleNumber" />
        <el-table-column align="center" label="计费规则名称" prop="ruleName" />
        <el-table-column align="center" label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column align="center" label="收费上限(元)" prop="chargeCeiling" />
        <el-table-column align="center" label="计费方式">
          <template #default="scope">
            {{ chargeType[scope.row.chargeType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="计费规则" prop="ruleNameView" />
        <el-table-column align="center" label="操作" fixed="right" width="200">
          <template #default>
            <el-button size="small" type="text">编辑</el-button>
            <el-button size="small" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}
.rules .el-form-item {
  padding: 0 10px;
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

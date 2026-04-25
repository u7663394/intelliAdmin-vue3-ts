<script lang="ts" setup>
import { getRuleListAPI } from '@/apis/car'
import type { Car, CarListParams } from '@/types/car'
import { ref } from 'vue'

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
</script>

<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary">增加停车计费规则</el-button>
      <el-button>导出Excel</el-button>
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

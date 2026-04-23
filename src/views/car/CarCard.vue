<script setup lang="ts">
import { getCardListAPI } from '@/apis/card'
import type { Card, CardListParams } from '@/types/card'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 获取月卡列表数据并渲染
 */
const params = ref<CardListParams>({
  page: 1,
  pageSize: 5,
  carNumber: '',
  personName: '',
  cardStatus: '',
})

const loading = ref(false)
const cardList = ref<Card[]>([])
const total = ref(0)
const getCardList = async () => {
  loading.value = true
  const res = await getCardListAPI(params.value)
  cardList.value = res.data.rows
  total.value = res.data.total
  loading.value = false
}
getCardList()

const formatStatus = (row: Card) => {
  return row.cardStatus === 0 ? '可用' : '已过期'
}

/**
 * 分页
 */
const pageChange = (newPage: number) => {
  params.value.page = newPage
  getCardList()
}

const sizeChange = (newSize: number) => {
  params.value.pageSize = newSize
  getCardList()
}

/**
 * 搜索功能
 */
const cardStatusList = [
  { id: -1, name: '全部' },
  { id: 0, name: '可用' },
  { id: 1, name: '已过期' },
]

const onSearch = () => {
  params.value.page = 1
  getCardList()
}

/**
 * 重置功能
 */
const onReset = () => {
  params.value = {
    page: 1,
    pageSize: 5,
    carNumber: '',
    personName: '',
    cardStatus: '',
  }
  getCardList()
}

/**
 * 编辑功能: 跳转传递 id 参数
 */
const router = useRouter()
const editCard = (id: string) => {
  router.push(`/cardAdd?id=${id}`)
}
</script>

<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名：</span>
      <el-input
        v-model="params.personName"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus" style="width: 240px">
        <el-option
          v-for="item in cardStatusList"
          :key="item.id"
          :value="item.id!"
          :label="item.name"
        />
      </el-select>
      <el-button type="primary" class="search-btn" @click="onSearch">查询</el-button>
      <el-button type="danger" class="search-btn" @click="onReset">重置</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/cardAdd')">添加月卡</el-button>
      <el-button>批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table v-loading="loading" style="width: 100%" :data="cardList">
        <el-table-column type="index" label="序号" width="100" align="center" />
        <el-table-column label="车主名称" prop="personName" align="center" />
        <el-table-column label="联系方式" prop="phoneNumber" align="center" />
        <el-table-column label="车牌号码" prop="carNumber" align="center" />
        <el-table-column label="车辆品牌" prop="carBrand" align="center" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" align="center" />
        <el-table-column label="状态" prop="cardStatus" align="center" :formatter="formatStatus" />
        <el-table-column label="操作" fixed="right" width="300" align="center">
          <template #default="scope">
            <el-button size="small" type="text">续费</el-button>
            <el-button size="small" type="text">查看</el-button>
            <el-button size="small" type="text" @click="editCard(scope.row.id)">编辑</el-button>
            <el-button size="small" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination
        style="float: right; margin-top: 10px"
        v-model:current-page="params.page"
        v-model:page-size="params.pageSize"
        :page-sizes="[2, 5, 10, 20]"
        layout="total, prev, pager, next,  sizes"
        :total="total"
        @current-change="pageChange"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
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

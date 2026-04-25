<script setup lang="ts">
import { downloadContract, getEnterpriseDetailAPI } from '@/apis/enterprise'
import type { EnterpriseDetail } from '@/types/enterprise'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 获取企业详情 + 渲染
 *
 * 预处理预览地址:
 *   1. PDF: 浏览器直接打开
 *   2. doc 文件: 需要拼接前缀预览地址
 */
const previewURL = 'https://view.officeapps.live.com/op/view.aspx?src='
const route = useRoute()
const form = ref<EnterpriseDetail>({} as EnterpriseDetail)
const getDetail = async () => {
  if (!route.query.id) return
  const res = await getEnterpriseDetailAPI(route.query.id as string)
  // 预处理预览地址
  res.data.rent.forEach((ele) => {
    const url = ele.contractUrl
    // 获取文件后缀, 是 .doc 的话拼接
    const fileExtension = url!.slice(url!.lastIndexOf('.'))
    if (fileExtension === '.doc') {
      ele.contractUrl = previewURL + ele.contractUrl
    }
  })
  form.value = res.data
}
getDetail()

/**
 * 下载合同
 *   1. 调用接口获取文件流
 *   2. 利用 URL.createObjectURL() 创建一个指向该文件流的 URL
 *   3. 创建一个 a 标签, 设置 href 为上一步创建的 URL
 *   4. a.download 指定下载文件名
 *   5. 触发 a 标签的 click 事件, 开始下载
 */
const onDownload = async (row: any) => {
  // 1. 调用接口
  const data = await downloadContract(row.contractId)
  // 2. 创建 URL
  const url = window.URL.createObjectURL(data)
  // 3. 创建 a 标签
  const a = document.createElement('a')
  a.href = url
  // 4. 指定下载文件名
  a.download = row.contractName || ''
  // 5. 触发点击下载
  a.click()
}
</script>

<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="查看企业" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">租赁记录</div>
        <div class="table-container">
          <el-table :data="form.rent" style="width: 100%" border>
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="buildingName" label="租赁楼宇" width="180" />
            <el-table-column label="租赁起止时间" width="280">
              <template #default="{ row }"> {{ row.startTime }} - {{ row.endTime }} </template>
            </el-table-column>
            <el-table-column label="租赁合同(点击预览)">
              <template #default="{ row }">
                <el-button type="text">
                  <a :href="row.contractUrl" target="_blank">
                    {{ row.contractName }}
                  </a>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="录入时间" />
            <el-table-column prop="address" label="操作">
              <template #default="{ row }">
                <el-button type="text" @click="onDownload(row)"> 合同下载 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.detail-enterprise {
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
      margin-bottom: 20px;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
    }
    .table-container {
      padding: 20px;
    }
    .preview {
      img {
        width: 100px;
      }
    }
  }
}
</style>

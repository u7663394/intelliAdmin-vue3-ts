import type {
  EnterpriseDetail,
  EnterpriseListData,
  EnterpriseListParams,
  EnterpriseParams,
  Industry,
} from '@/types/enterprise'
import { request } from '@/utils/reuqest'

// 获取企业列表
export const getEnterpriseListAPI = (params: EnterpriseListParams) => {
  return request<EnterpriseListData>('/park/enterprise', 'GET', params)
}

// 获取行业列表
export const getIndustryListAPI = () => {
  return request<Industry[]>('/park/industry')
}

// 上传文件接口
export const uploadAPI = (data: FormData) => {
  return request('/upload', 'POST', data)
}

// 添加企业接口
export const createEnterpriseAPI = (data: EnterpriseParams) => {
  return request('/park/enterprise', 'POST', data)
}

// 获取企业详情
export const getEnterpriseDetailAPI = (id: string) => {
  return request<EnterpriseDetail>(`/park/enterprise/${id}`)
}

// 更新企业接口
export const updateEnterpriseAPI = (data: EnterpriseParams) => {
  return request('/park/enterprise', 'PUT', data)
}

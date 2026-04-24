import type { EnterpriseListData, EnterpriseListParams } from '@/types/enterprise'
import { request } from '@/utils/reuqest'

// 获取企业列表
export const getEnterpriseListAPI = (params: EnterpriseListParams) => {
  return request<EnterpriseListData>('/park/enterprise', 'GET', params)
}

import type { CardDetail, CardListData, CardListParams, CardParms } from '@/types/card'
import { request } from '@/utils/reuqest'

// 获取月卡列表
export const getCardListAPI = (params: CardListParams) => {
  return request<CardListData>('/parking/card/list', 'GET', params)
}

// 创建月卡
export const createCardAPI = (data: CardParms) => {
  return request('/parking/card', 'POST', data)
}

// 获取月卡详情
export const getCardDetailAPI = (id: string) => {
  return request<CardDetail>(`/parking/card/detail/${id}`, 'GET')
}

// 编辑月卡
export const updateCardAPI = (data: CardParms) => {
  return request('/parking/card/edit', 'PUT', data)
}

// 删除月卡
export const delCardAPI = (id: string) => {
  return request(`/parking/card/${id}`, 'DELETE')
}

// 批量删除月卡
export const delAllCardAPI = (ids: number[]) => {
  return request(`/parking/card/${ids.join(',')}`, 'DELETE')
}

import type { CardListData, CardListParams, CardParms } from '@/types/card'
import { request } from '@/utils/reuqest'

// 获取月卡列表
export const getCardListAPI = (params: CardListParams) => {
  return request<CardListData>('/parking/card/list', 'GET', params)
}

// 创建月卡
export const createCardAPI = (data: CardParms) => {
  return request('/parking/card', 'POST', data)
}

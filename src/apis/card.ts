import type { CardListData, CardListParams } from '@/types/card'
import { request } from '@/utils/reuqest'

// 获取月卡列表
export const getCardListAPI = (params: CardListParams) => {
  return request<CardListData>('/parking/card/list', 'GET', params)
}

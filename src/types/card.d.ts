// 月卡列表参数
export interface CardListParams {
  cardStatus?: string
  carNumber?: string
  page: number
  pageSize: number
  personName?: string
}

// 月卡列表数据
export interface CardListData {
  rows: Card[]
  total: number
}

// 月卡
export interface Card {
  carBrand: string
  cardStatus: number
  carNumber: string
  id: number
  personName: string
  phoneNumber: string
  totalEffectiveDate: number
}

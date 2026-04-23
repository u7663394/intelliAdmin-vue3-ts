// 车辆列表参数
export interface CardListParams {
  cardStatus?: string
  carNumber?: string
  page: number
  pageSize: number
  personName?: string
}

// 车辆列表数据
export interface CardListData {
  rows: Card[]
  total: number
}

// 车辆
export interface Card {
  carBrand: string
  cardStatus: number
  carNumber: string
  id: number
  personName: string
  phoneNumber: string
  totalEffectiveDate: number
}

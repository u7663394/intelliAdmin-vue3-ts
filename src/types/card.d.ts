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

// 添加月卡参数
export interface CardParms {
  carBrand?: string
  cardEndDate?: string
  cardStartDate?: string
  carNumber?: string
  paymentAmount?: string
  paymentMethod?: 'Alipay' | 'WeChat' | 'Cash'
  personName?: string
  phoneNumber?: string
  carInfoId?: number
  rechargeId?: number
}

// 月卡详情
export interface CardDetail {
  carBrand: string
  cardEndDate: string
  cardStartDate: string
  cardStatus: number
  carInfoId: number
  carNumber: string
  paymentAmount: number
  paymentMethod: 'Alipay' | 'WeChat' | 'Cash'
  personName: string
  phoneNumber: string
  rechargeId: number
}

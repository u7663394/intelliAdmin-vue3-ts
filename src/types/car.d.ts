export interface CarListParams {
  cardStatus?: string
  carNumber?: string
  page: number
  pageSize: number
  personName?: string
}

export interface CarListData {
  rows: Car[]
  total: number
}

export interface Car {
  carBrand: string
  cardStatus: number
  carNumber: string
  id: string
  personName: string
  Number: string
  totalEffectiveDate: number
}

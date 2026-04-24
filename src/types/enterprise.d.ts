export interface EnterpriseListParams {
  name?: string
  page?: number
  pageSize?: number
}

export interface EnterpriseListData {
  rows: Enterprise[]
  total: number
}

export interface Enterprise {
  contact: string
  contactNumber: string
  demoFlag: number
  id: number
  name: string
}

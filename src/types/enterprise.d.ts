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

export interface Industry {
  industryCode: number
  industryName: string
}

export interface EnterpriseParams {
  businessLicenseId: string
  businessLicenseUrl?: string
  contact: string
  contactNumber: string
  industryCode: string
  legalPerson: string
  name: string
  registeredAddress: string
  id?: string
}

export interface EnterpriseFile {
  id: string
  name: string
  url: string
}

export interface EnterpriseDetail {
  businessLicenseId: string
  businessLicenseName: string
  businessLicenseUrl: string
  contact: string
  contactNumber: string
  id: number
  industryCode: string
  industryName: string
  legalPerson: string
  name: string
  registeredAddress: string
  rent: Rent[]
}

export interface Rent {
  contractId?: number
  contractName?: string
  contractUrl?: string
  createTime?: string
  endTime?: string
  id?: number
  name?: string
  startTime?: string
  status?: number
  buildingId?: string | number
  enterpriseId?: string | number
  type?: any
}

export interface Datum {
  endTime: string
  exitFlag: number
  id: string
  name: string
  startTime: string
  renewFlag: number
  status: number
}

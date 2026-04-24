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

/**
 * empty object
 */
export interface EnterpriseParams {
  businessLicenseId: string
  businessLicenseUrl?: string
  contact: string
  contactNumber: string
  industryCode: string
  legalPerson: string
  name: string
  registeredAddress: string
}

export interface EnterpriseFile {
  id: string
  name: string
  url: string
}

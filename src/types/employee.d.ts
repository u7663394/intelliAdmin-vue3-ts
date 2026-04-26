export interface EmployeeParams {
  name?: string
  page?: number
  pageSize?: number
}

export interface EmployeeData {
  rows: Employee[]
  total: number
}

export interface Employee {
  id: number
  name: string
  phonenumber: string
  roleId: number
  roleName: string
  status: number
  userName: string
}

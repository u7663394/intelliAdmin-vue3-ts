import type { EmployeeData, EmployeeParams } from '@/types/employee'
import { request } from '@/utils/reuqest'

// 获取员工列表
export const getEmployeeListAPI = (params: EmployeeParams) => {
  return request<EmployeeData>('/park/sys/user', 'GET', params)
}

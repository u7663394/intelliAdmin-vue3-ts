import type { Employee, EmployeeData, EmployeeParams } from '@/types/employee'
import { request } from '@/utils/reuqest'

// 获取员工列表
export const getEmployeeListAPI = (params: EmployeeParams) => {
  return request<EmployeeData>('/park/sys/user', 'GET', params)
}

// 添加员工接口
export const createEmployeeAPI = (data: Employee) => {
  return request('/park/sys/user', 'POST', data)
}

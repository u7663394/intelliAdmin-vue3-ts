import type { Role, RoleData, RoleDetail, RoleParams, RoleUserData } from '@/types/system'
import { request } from '@/utils/reuqest'

// 获取角色列表
export const getRoleListAPI = () => {
  return request<Role[]>('/park/sys/role')
}

// 获取权限树列表
export const getTreeListAPI = () => {
  return request<RoleData[]>('/park/sys/permision/all/tree')
}

// 获取角色详情
export const getRoleDetailAPI = (roleId: number) => {
  return request<RoleDetail>(`/park/sys/role/${roleId}`)
}

// 获取角色成员
export const getRoleUserAPI = (roleId: number) => {
  return request<RoleUserData>(`/park/sys/roleUser/${roleId}`)
}

// 添加角色成员
export const createRoleUserAPI = (data: RoleParams) => {
  return request('/park/sys/role', 'POST', data)
}

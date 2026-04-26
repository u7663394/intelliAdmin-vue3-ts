import type { Role, RoleData } from '@/types/system'
import { request } from '@/utils/reuqest'

// 获取角色列表
export const getRoleListAPI = () => {
  return request<Role[]>('/park/sys/role')
}

// 获取权限树列表
export const getTreeListAPI = () => {
  return request<RoleData[]>('/park/sys/permision/all/tree')
}

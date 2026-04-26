export interface Role {
  remark?: string
  roleId?: number
  roleName?: string
}

export interface RoleData {
  children?: RoleData[]
  id?: number
  title?: string
  disabled?: boolean
}

export interface RoleDetail {
  perms: number[]
  remark: string // 备注
  roleId: string
  roleName: string
  userTotal: number // 角色人数
}

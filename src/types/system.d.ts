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

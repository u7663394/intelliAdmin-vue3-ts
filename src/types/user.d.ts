export interface LoginParams {
  password: string
  username: string
}

export interface Profile {
  id: number
  menus: string[]
  name: string
  permissions: string[] // 用户权限列表
  roleId: number
  roleName: string
}

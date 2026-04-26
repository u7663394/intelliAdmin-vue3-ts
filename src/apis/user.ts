import type { LoginParams, Profile } from '@/types/user'
import { request } from '@/utils/reuqest'

// 登录接口
export const loginAPI = (data: LoginParams) => {
  return request<{ token: string }>('/park/login', 'POST', data)
}

// 获取用户信息
export const getProfileAPI = () => {
  return request<Profile>('/park/user/profile')
}

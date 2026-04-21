import type { LoginParams } from '@/types/user'
import { request } from '@/utils/reuqest'

// 登录接口
export const loginAPI = (data: LoginParams) => {
  return request<{ token: string }>('/park/login', 'POST', data)
}

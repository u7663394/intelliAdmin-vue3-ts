// 封装操作 cookie 的方法包
import { TOKEN_KEY } from '@/constants'
import Cookies from 'js-cookie'

export const getLocalToken = () => {
  return Cookies.get(TOKEN_KEY)
}

// expires: 7 表示 7 天后过期
export const setLocalToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 })
}

export const removeLocalToken = () => {
  Cookies.remove(TOKEN_KEY)
}

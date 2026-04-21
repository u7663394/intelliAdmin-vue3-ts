import axios, { type Method } from 'axios'
import { getLocalToken, removeLocalToken } from './auth'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const instance = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/tj',
  timeout: 15000,
})

instance.interceptors.request.use(
  (config) => {
    const token = getLocalToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    ElMessage.error(error.response.data.msg)
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response.status === 401) {
      // 1. 清空用户数据
      const userStore = useUserStore()
      userStore.setToken('')
      removeLocalToken()
      // 2. 跳转到登录
      router.push('/login')
      // 3. 提示
      ElMessage.error('登录状态无效，请重新登录')
    } else {
      ElMessage.error(error.response.data.msg)
    }
    return Promise.reject(error)
  },
)

export default instance

/**
 * 封装请求函数, 便于 api 中的调用
 *
 * 说明：
 *   1. request<T = any, R = AxiosResponse<T>>
 *      T：响应体 response.data 的类型
 *      R：整个返回值类型（默认是 AxiosResponse<T>）
 *   2. 以前 axios 默认返回的是完整响应对象：
 *      res = { data: { name: string }, status: number, ... }
 *   3. 现在在响应拦截器中，直接返回 res.data
 *   4. 后端的通用返回结构：{ code, message, data }
 *      可以抽取一个通用类型 Data<T>
 */
type Data<T> = {
  code: number
  message: string
  data: T
}

const request = <T>(url: string, method: Method = 'GET', submitData?: object) => {
  const config: any = { url, method }
  if (method.toUpperCase() === 'GET') {
    config.params = submitData
  } else {
    config.data = submitData
  }
  return instance.request<T, Data<T>>(config)
}

export { request }

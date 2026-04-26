import { useUserStore } from './stores/user'
import router from './router'
import { getProfileAPI } from './apis/user'

/**
 * 路由前置守卫 -> 访问权限控制
 *
 * 语法:
 *   1. return false: 取消跳转 (停留在当前页)
 *   2. return '/path': 重定向到指定路径
 *   3. return undefined or true: 放行
 */
const wihteList = ['/login', '/404']
router.beforeEach(async (to) => {
  // 没有 token 且不访问白名单 -> 重定向到登录页
  const userStore = useUserStore()
  if (!userStore.token && !wihteList.includes(to.path)) {
    return '/login'
  }
  // 已有 token 但没有 profile.id -> 获取并设置用户信息
  if (userStore.token && !userStore.profile.id) {
    const res = await getProfileAPI()
    userStore.setProfile(res.data)
    // 获取用户权限数据
    const firstRoutePerms = getFirstRoutePerms(res.data.permissions)
    const secondRoutePerms = getSecondRoutePerms(res.data.permissions)
  }
})

/**
 * 处理一级路由权限数据
 *   1. split(':') 按冒号分隔
 *   2. ...new Set(arr) 数组去重
 */
const getFirstRoutePerms = (permsArr: string[]) => {
  const newArr = permsArr.map((ele) => {
    return ele.split(':')[0]
  })
  return [...new Set(newArr)]
}

/**
 * 处理二级路由权限数据
 */
const getSecondRoutePerms = (permsArr: string[]) => {
  const newArr = permsArr.map((ele) => {
    const arr = ele.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  return [...new Set(newArr)]
}

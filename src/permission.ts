import { useUserStore } from './stores/user'
import router from './router'

/**
 * 路由前置守卫 -> 访问权限控制
 *
 * 语法:
 *   1. return false: 取消跳转 (停留在当前页)
 *   2. return '/path': 重定向到指定路径
 *   3. return undefined or true: 放行
 */
const wihteList = ['/login', '/404']
router.beforeEach((to) => {
  // 没有 token 且不访问白名单 -> 重定向到登录页
  const userStore = useUserStore()
  if (!userStore.token && !wihteList.includes(to.path)) {
    return '/login'
  }
})

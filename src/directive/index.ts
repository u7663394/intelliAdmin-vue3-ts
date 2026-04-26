import { useUserStore } from '@/stores/user'
import type { Directive } from 'vue'

/**
 * 自定义全局指令
 *
 * 语法:
 *   1. el: 指令绑定的元素，可以用来直接操作 DOM
 *   2. binding: 包含指令信息的对象
 *   3. binding.value: 传递给指令的值
 *   4. 常用钩子函数为 mounted 和 update
 *      分别在元素被插入 DOM 和更新时调用
 *
 * 举例:
 *   <button v-auth="'user:add'">添加用户</button>
 *     - el 为该 button 元素
 *     - binding.value 为 'user:add'
 */

const adminPerms = '*:*:*'

export const auth: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const perms = userStore.profile.permissions
    // 管理员
    if (perms.includes(adminPerms)) return
    // 其他
    if (!perms.includes(binding.value)) {
      el.remove()
    }
  },
}

import { resetRouter, routes } from '@/router'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const useMenuStore = defineStore('menu', () => {
  // 1. menuList: 存储菜单列表数据
  const menuList = ref<RouteRecordRaw[]>([...routes])
  // 2. setMenuList: 更新菜单列表数据的方法
  const setMenuList = (filterRoutes: RouteRecordRaw[]) => {
    menuList.value = [...menuList.value, ...filterRoutes]
  }
  // 3. resetMenu: 重置菜单列表数据的方法
  const resetMenu = () => {
    menuList.value = [...routes]
    resetRouter()
  }
  return { menuList, setMenuList, resetMenu }
})

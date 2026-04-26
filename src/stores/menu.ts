import { routes } from '@/router'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref<RouteRecordRaw[]>([...routes])
  const setMenuList = (filterRoutes: RouteRecordRaw[]) => {
    menuList.value = [...menuList.value, ...filterRoutes]
  }
  return { menuList, setMenuList }
})

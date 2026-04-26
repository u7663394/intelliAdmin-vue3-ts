import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '@/styles/progress.scss'

// 静态路由: 不需要做权限控制，每一个用户都可以看到，只初始化一次
export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: { hidden: true },
  },
  {
    path: '/',
    redirect: '/workbench',
    meta: { hidden: true },
  },
  {
    path: '/workbench',
    component: MainLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/workbench/WorkbenchPage.vue'),
        meta: { title: '工作台', icon: 'workbench' },
      },
    ],
  },
  {
    path: '/cardAdd',
    component: () => import('@/views/car/AddCard.vue'),
    meta: { hidden: true, title: '月卡管理' },
  },
  {
    path: '/enterpriseAdd',
    component: () => import('@/views/park/AddEnterprise.vue'),
    meta: { hidden: true, title: '企业管理' },
  },
  {
    path: '/enterpriseDetail',
    component: () => import('@/views/park/EnterpriseDetail.vue'),
    meta: { hidden: true, title: '企业详情' },
  },
  {
    path: '/roleAdd',
    component: () => import('@/views/system/AddRole.vue'),
    meta: { hidden: true, title: '操作角色' },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound.vue'),
    meta: { hidden: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes,
})

NProgress.configure({
  showSpinner: false,
})

router.beforeEach(() => {
  NProgress.start()
})

/**
 * 路由后置守卫:
 *   1. 页面标题设置
 *   2. 组件加载进度条
 */
router.afterEach((to) => {
  // 1. 页面标题设置
  document.title = to.meta.title ? `intelliAdmin-${to.meta.title}` : 'intelliAdmin'
  // 2. 组件加载进度条
  NProgress.done()
})

/**
 * 重置路由: 用户登出时清除动态路由，避免下次登录时权限问题
 */
export function resetRouter() {
  router.getRoutes().forEach((ele) => {
    if (ele.name && router.hasRoute(ele.name)) {
      router.removeRoute(ele.name)
    }
  })
}

export default router

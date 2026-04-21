import { getLocalToken, setLocalToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. token
  const token = ref(getLocalToken() || '')
  // 2. setToken
  function setToken(newToken: string) {
    token.value = newToken
    setLocalToken(newToken)
  }
  // 最后 return
  return { token, setToken }
})

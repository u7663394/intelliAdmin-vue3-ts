import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. token
  const token = ref('')
  // 2. setToken
  function setToken(newToken: string) {
    token.value = newToken
  }
  // 最后 return
  return { token, setToken }
})

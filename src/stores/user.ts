import type { Profile } from '@/types/user'
import { getLocalToken, setLocalToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. token + setToken
  const token = ref(getLocalToken() || '')
  const setToken = (newToken: string) => {
    token.value = newToken
    setLocalToken(newToken)
  }
  // 2. profile + setProfile
  const profile = ref<any>({})
  const setProfile = (newProfile: Profile) => {
    profile.value = newProfile
  }
  // 最后 return
  return { token, setToken, profile, setProfile }
})

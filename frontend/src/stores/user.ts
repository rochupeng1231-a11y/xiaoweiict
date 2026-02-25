import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/api/auth'

export const useUserStore = defineStore(
  'user',
  () => {
    // 从 localStorage 读取初始状态
    const getTokenFromStorage = () => {
      try {
        return localStorage.getItem('token') || ''
      } catch {
        return ''
      }
    }

    const getUserFromStorage = () => {
      try {
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr) : null
      } catch {
        return null
      }
    }

    const token = ref<string>(getTokenFromStorage())
    const user = ref<UserInfo | null>(getUserFromStorage())

    const isAuthenticated = computed(() => !!token.value && token.value !== '')

    const setToken = (newToken: string) => {
      token.value = newToken
      localStorage.setItem('token', newToken)
    }

    const setUser = (userInfo: UserInfo) => {
      user.value = userInfo
      localStorage.setItem('user', JSON.stringify(userInfo))
    }

    const logout = () => {
      token.value = ''
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

    return {
      token,
      user,
      isAuthenticated,
      setToken,
      setUser,
      logout
    }
  }
)

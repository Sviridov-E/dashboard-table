import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  refreshToken: string | null
  accessToken: string | null
  rememberMe: boolean
  login: (
    tokens: { refreshToken: string; accessToken: string },
    rememberMe: boolean
  ) => void
  logout: VoidFunction
}

export const useSessionAuthStore = create(
  persist<AuthState>(
    set => ({
      refreshToken: null,
      accessToken: null,
      rememberMe: false,
      login: ({ refreshToken, accessToken }, rememberMe) => {
        if (rememberMe) {
          localStorage.setItem('auth-rememberMe', 'true')
        } else {
          localStorage.removeItem('auth-rememberMe')
        }
        return set({ refreshToken, accessToken, rememberMe })
      },
      logout: () => {
        localStorage.removeItem('auth-rememberMe')
        set({ refreshToken: null, accessToken: null, rememberMe: false })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: name => {
          return localStorage.getItem(name) || sessionStorage.getItem(name)
        },
        setItem: (name, value) => {
          if (localStorage.getItem('auth-rememberMe') === 'true') {
            localStorage.setItem(name, value)
          } else {
            sessionStorage.setItem(name, value)
          }
        },
        removeItem: name => {
          localStorage.removeItem(name)
          sessionStorage.removeItem(name)
          localStorage.removeItem('auth-rememberMe')
        },
      })),
    }
  )
)

import { create } from 'zustand'

interface AuthState {
  refreshToken: string | null
  accessToken: string | null
  login: (tokens: { refreshToken: string; accessToken: string }) => void
  logout: VoidFunction
}

export const useSessionAuthStore = create<AuthState>(set => ({
  refreshToken: null,
  accessToken: null,
  login: ({ refreshToken, accessToken }) => set({ refreshToken, accessToken }),
  logout: () => set({ refreshToken: null, accessToken: null }),
}))

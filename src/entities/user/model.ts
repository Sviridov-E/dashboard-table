import { create } from 'zustand'

interface UserState {
  user: { username: string; id: number } | null
  isPending: boolean
  startCheckUser: VoidFunction
  finishCheckUser: VoidFunction
  login: (user: NonNullable<UserState['user']>) => void
  logout: VoidFunction
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  isPending: false,
  startCheckUser: () => set({ isPending: true }),
  finishCheckUser: () => set({ isPending: false }),
  login: user => set({ user }),
  logout: () => set({ user: null, isPending: false }),
}))

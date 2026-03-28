import { useSessionAuthStore } from '@/entities/auth'
import { useUserStore } from '@/entities/user'

export const useLogout = () => {
  const resetUser = useUserStore(store => store.logout)
  const resetTokens = useSessionAuthStore(store => store.logout)

  return () => {
    resetTokens()
    resetUser()
  }
}

import { checkAuth } from '@/entities/auth'
import { useUserStore } from '@/entities/user'

export const checkUser = async () => {
  const { startCheckUser, login, finishCheckUser, isPending, user } =
    useUserStore.getState()

  if (isPending || user) return

  startCheckUser()

  try {
    const user = await checkAuth()
    if (user) {
      login(user)
    }
  } finally {
    finishCheckUser()
  }
}

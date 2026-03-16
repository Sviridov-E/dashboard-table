import { useSessionAuthStore } from '@/entities/auth'
import { useUserStore } from '@/entities/user'
import z from 'zod'

const authError = new Error('При аутентификации возникла ошибка')

export const login = async ({
  remember,
  ...loginData
}: {
  username: string
  password: string
  remember: boolean
}) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...loginData,
      /**
       * куки не используем и храним токены в памяти, т.к. доступа к серверу у нас нет
       * и мы не сможем удалить куки при "гостевом" режиме
       */
      expiresInMins: 0,
    }),
  })

  if (!res.ok) {
    throw authError
  }

  const json = await res.json()

  try {
    const { username, id, accessToken, refreshToken } = z
      .object({
        id: z.number(),
        username: z.string(),
        accessToken: z.string(),
        refreshToken: z.string(),
      })
      .parse(json)

    useUserStore.getState().login({ username, id })

    useSessionAuthStore
      .getState()
      .login({ accessToken, refreshToken }, remember)
  } catch (e) {
    if (e instanceof Error) console.error(e.message)
    throw authError
  }
}

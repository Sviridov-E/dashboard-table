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
      // если не запоминаем, то куки не используем и храним токены в памяти
      expiresInMins: remember ? 60 : 0,
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

    if (!remember) {
      useSessionAuthStore.getState().login({ accessToken, refreshToken })
    }
  } catch (e) {
    if (e instanceof Error) console.error(e.message)
    throw authError
  }
}

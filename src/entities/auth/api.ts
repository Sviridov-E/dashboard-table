import z from 'zod'
import { useSessionAuthStore } from './model'

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' }

export const refresh = (() => {
  let cacheRefreshPromise: Promise<string> | null = null

  const fn = async () => {
    const { refreshToken, rememberMe } = useSessionAuthStore.getState()

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: refreshToken
        ? JSON.stringify({
            refreshToken,
            expiresInMins: 0,
          })
        : null,
    })

    const json = await response.json()

    if (!response.ok) {
      throw new Error('Необходимо заного пройти аутентификацию')
    }

    const newTokens = z
      .object({
        accessToken: z.string(),
        refreshToken: z.string(),
      })
      .parse(json)

    // если храним токены локально без кук
    useSessionAuthStore.getState().login(newTokens, rememberMe)

    return newTokens.accessToken
  }

  return async () => {
    if (cacheRefreshPromise) return cacheRefreshPromise

    cacheRefreshPromise = fn()

    cacheRefreshPromise.finally(() => {
      cacheRefreshPromise = null
    })

    return cacheRefreshPromise
  }
})()

export const authFetch = async <T extends object>(
  url: string,
  params?: Parameters<typeof fetch>[1]
) => {
  const { accessToken } = useSessionAuthStore.getState()

  let response = await fetch(url, {
    ...params,
    // Кладём токен в header
    headers: {
      ...DEFAULT_HEADERS,
      Authorization: `Bearer ${accessToken}`,
      ...(params?.headers || {}),
    },
  })

  if (response.status === 401) {
    /**
     * Если при 401 accessToken вовсе нет - значит нужно заного войти в систему
     */
    if (!accessToken) {
      throw new Error('Необходимо заного пройти аутентификацию')
    }
    try {
      const newAccessToken = await refresh()

      response = await fetch(url, {
        ...params,
        // Кладём токен в header
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${newAccessToken}`,
          ...(params?.headers || {}),
        },
      })
    } catch (refreshError) {
      if (refreshError instanceof Error) {
        console.error(refreshError.message)
      }
      throw refreshError
    }
  }

  try {
    const json = await response.json()

    if (!response.ok) {
      throw new Error(json.message || 'Во время запроса возникла ошибка')
    }

    return json as T
  } catch (error) {
    if (error instanceof Error) throw error
  }
}

export const checkAuth = async () => {
  try {
    return await authFetch<{ username: string; id: number }>('/api/auth/me')
  } catch {
    return null
  }
}

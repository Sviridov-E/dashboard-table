import z from 'zod'
import { useSessionAuthStore } from './model'

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' }

export const refresh = (() => {
  let cacheRefreshPromise: Promise<string> | null = null

  const fn = async () => {
    const { refreshToken } = useSessionAuthStore.getState()

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: refreshToken ? 'omit' : 'include',
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
    if (refreshToken) {
      useSessionAuthStore.getState().login(newTokens)
    }

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
    ...(accessToken
      ? {
          // Кладём токен в header
          headers: {
            ...DEFAULT_HEADERS,
            Authorization: `Bearer ${accessToken}`,
            ...(params?.headers || {}),
          },
        }
      : {
          // Используем токены из cookies
          credentials: 'include',
          headers: { ...DEFAULT_HEADERS, ...(params?.headers || {}) },
        }),
  })

  if (response.status === 401) {
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
        console.log(refreshError.message)
      }
      // useSessionAuthStore.getState().logout();
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
    if (error instanceof Error)
      // useSessionAuthStore.getState().logout();
      throw error
  }
}

export const checkAuth = async () => {
  try {
    return await authFetch<{ username: string; id: number }>('/api/auth/me')
  } catch {
    return null
  }
}

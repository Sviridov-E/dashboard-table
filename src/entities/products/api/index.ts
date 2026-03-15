import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Product } from '../types'

interface ProductsResponse {
  products: Product[]
  total: number
}

export const useProducts = (
  authFetch: <T extends object>(
    url: string,
    params?: RequestInit | undefined
  ) => Promise<T | undefined>,
  {
    page,
    countPerPage,
    sort,
    order,
    query,
  }: {
    page: number
    countPerPage: number
    sort: string | null
    order: 'asc' | 'desc' | null
    query: string | null
  }
) =>
  useQuery<ProductsResponse>({
    queryKey: ['products', { page, sort, order, countPerPage, query }],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams(
          [
            ['limit', countPerPage],
            ['skip', (page - 1) * countPerPage || null],
            ['sortBy', sort || null],
            ['order', sort ? order : null],
            ['q', query],
          ]
            .filter(([, value]) => value !== null)
            .map(([key, value]) => [key, value?.toString()]) as string[][]
        ).toString()
        const data = await authFetch<ProductsResponse>(
          `/api/products${query ? '/search' : ''}?${searchParams}`
        )
        if (!data) throw new Error('')
        return data
      } catch (e) {
        if (e instanceof Error) toast.error(e.message)
        throw e
      }
    },
    placeholderData: keepPreviousData,
  })

import { authFetch } from '@/entities/auth'
import type { ProductsStore } from '@/entities/products'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'

const createdProductSchema = z.object({
  title: z.string(),
  price: z.number(),
  brand: z.string().optional(),
  rating: z.number().optional(),
  sku: z.string().optional(),
})

export type NewProduct = z.infer<typeof createdProductSchema>

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newProduct: NewProduct) => {
      return authFetch('/api/products/add', {
        method: 'POST',
        body: JSON.stringify(newProduct),
      })
    },

    onSuccess: createdProduct => {
      let newProduct: NewProduct | null = null
      try {
        newProduct = z.parse(createdProductSchema, createdProduct)
      } catch (e) {
        toast.error('Ошибка при создании товара')
        throw e
      }
      toast.success('Товар успешно добавлен')

      queryClient.setQueriesData(
        { queryKey: ['products'] },
        (oldProducts: ProductsStore) => {
          if (!oldProducts) return
          return {
            ...oldProducts,
            products: [newProduct, ...oldProducts.products],
            total: oldProducts.total + 1,
          }
        }
      )
    },

    onError: () => {
      toast.error('Ошибка при создании товара')
    },
  })
}

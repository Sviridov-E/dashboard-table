// features/create-product/ui/CreateProductModal.tsx
import { validation } from '@/shared/lib'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateProduct, type NewProduct } from '../model/use-create-product'
import { Input } from './input'

const getNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  const numPrice = Number(value)
  if (isNaN(numPrice)) return null
  return numPrice
}

const prepareValue: {
  [Key in keyof NewProduct]?: (value: unknown) => NewProduct[Key] | null
} = {
  price: getNumber,
  rating: getNumber,
}

export const ProductModal = () => {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useCreateProduct()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewProduct>()

  useEffect(() => {
    if (!open) reset()
  }, [reset, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='h-10.5 px-5 text-base'>
          <PlusCircle className='mr-1 size-5' /> Добавить
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавление нового товара</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(data => {
            const cleanedData = Object.entries(data).reduce(
              (acc, [key, value]) => {
                const resultValue =
                  key in prepareValue
                    ? (prepareValue[key as keyof NewProduct]?.(value) ?? null)
                    : value
                return resultValue ? { ...acc, [key]: resultValue } : acc
              },
              {} as NewProduct
            )
            mutate(cleanedData, {
              onSuccess: () => {
                setOpen(false)
              },
            })
          })}
          className='space-y-4'
        >
          <Input
            {...register('title', {
              required: validation.required(),
              maxLength: validation.maxLength(30),
            })}
            placeholder='Apple Iphone 17 Pro Max'
            label='Название товара'
            error={errors.title ? errors.title.message : null}
            className='space-y-1'
          />

          <Input
            {...register('price', {
              required: validation.required(),
              min: validation.min(0),
              pattern: {
                value: /^\d{0,10}(\.\d\d)?$/,
                message: 'Введите реальную цену',
              },
            })}
            type='number'
            placeholder='129999'
            step='0.01'
            label='Цена'
            error={errors.price ? errors.price.message : null}
            className='space-y-1'
          />

          <Input
            {...register('brand', {
              maxLength: validation.maxLength(15),
            })}
            label='Вендор'
            placeholder='Apple'
            error={errors.brand ? errors.brand.message : null}
            className='space-y-1'
          />

          <Input
            {...register('rating', {
              pattern: {
                value: /(^[0-4](\.\d)?$)|(^5(\.0)?$)/,
                message: 'Введите рейтинг от 0 до 5',
              },
            })}
            type='number'
            step='0.1'
            placeholder='4.8'
            label='Рейтинг'
            error={errors.rating ? errors.rating.message : null}
            className='space-y-1'
          />

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Сохранение...' : 'Добавить'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

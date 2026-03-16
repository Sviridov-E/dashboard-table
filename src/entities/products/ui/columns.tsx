import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui'
import { Checkbox } from '@/shared/ui/checkbox'
import type { ColumnDef, Table } from '@tanstack/react-table'
import { ArrowUpDown, CircleEllipsis, Plus } from 'lucide-react'
import type { Product } from '../types'
import { ItemPreviewCell } from './item-preview-cell'

const getSortableHeader =
  ({ name, title }: { name: string; title: string }) =>
  ({ table }: { table: Table<Product> }) => {
    const { onSort } = table.options.meta as { onSort: (id: string) => void }

    return (
      <div
        className='flex items-center justify-center cursor-pointer hover:text-black transition-colors'
        onClick={() => onSort(name)}
      >
        {title}
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </div>
    )
  }

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    size: 45,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Наименование',
    cell: ({ row }) => {
      const { title, thumbnail, category } = row.original

      return (
        <ItemPreviewCell
          title={title}
          thumbnail={thumbnail}
          category={category}
        />
      )
    },
  },
  {
    accessorKey: 'brand',
    header: getSortableHeader({ name: 'brand', title: 'Вендор' }),
    size: 120,
    cell: ({ getValue }) => {
      const brand = getValue<string>()

      if (!brand) return null

      return <span className='font-bold text-base'>{brand}</span>
    },
  },
  {
    accessorKey: 'sku',
    header: 'Артикул',
    size: 200,
    cell: ({ getValue }) => {
      const sku = getValue<string>()

      if (!sku) return null

      return <span className='text-base'>{sku}</span>
    },
  },
  {
    accessorKey: 'rating',
    header: getSortableHeader({ name: 'rating', title: 'Оценка' }),
    size: 80,
    cell: ({ getValue }) => {
      const rating = getValue<number>()

      if (!rating) return null

      const roundedRating = Math.round(rating * 10) / 10

      return (
        <span className='text-base'>
          <span className={cn(roundedRating < 3 && 'text-red-600')}>
            {roundedRating}
          </span>
          <span>/5</span>
        </span>
      )
    },
  },
  {
    accessorKey: 'price',
    header: getSortableHeader({ name: 'price', title: 'Цена, ₽' }),
    size: 180,
    cell: ({ getValue }) => {
      const price = getValue<number>()

      if (!price) return null

      const priceString = price.toLocaleString('ru-RU', {
        currency: 'RUB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })

      return (
        <span className='text-base font-mono'>
          {priceString.slice(0, -3)}
          <span className='text-neutral-4 00'>{priceString.slice(-3)}</span>
        </span>
      )
    },
  },
  {
    id: 'actions',
    size: 115,
    cell: () => {
      return (
        <div className='flex gap-8 items-center'>
          <Button className='px-3 h-7'>
            <Plus className='size-6' />
          </Button>
          <Button variant='ghost' className='h-8 w-6 p-0'>
            <CircleEllipsis className='size-6' />
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]

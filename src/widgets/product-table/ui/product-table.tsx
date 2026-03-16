import { authFetch } from '@/entities/auth'
import { useProducts } from '@/entities/products'
import { columns } from '@/entities/products/ui/columns'
import { ProductModal } from '@/features/create-product'
import { SearchProduct } from '@/features/search-products'
import { cn, getDeclension } from '@/shared/lib'
import { Button, FullscreenSpinner } from '@/shared/ui'
import { DataTable } from '@/shared/ui/data-table'
import { RefreshCw } from 'lucide-react'
import { useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useScrolledDown } from '../lib/use-scrolled-down'
import { ProgressBar } from './progress-bar'
import { TablePagination } from './table-pagination'

const LIMIT = 20

type SortDirection = 'asc' | 'desc'

export const ProductTable = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1')
  const sort = searchParams.get('sortBy') || null
  const order = (searchParams.get('order') || 'asc') as SortDirection
  const query = searchParams.get('q') || null

  const { data, isLoading, isFetching, refetch } = useProducts(authFetch, {
    countPerPage: LIMIT,
    page,
    sort,
    order,
    query,
  })
  const totalPages = Math.ceil((data?.total || 0) / LIMIT)

  const handleSort = (field: string) => {
    const isCurrentField = sort === field
    const newOrder = isCurrentField && order === 'asc' ? 'desc' : 'asc'

    setSearchParams({
      page: '1',
      sortBy: field,
      order: newOrder,
    })
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      params.set('page', newPage.toString())
      return params
    })
  }

  const scrollRef = useRef<null | HTMLDivElement>(null)
  const { scrolledDown } = useScrolledDown({ scrollRef })

  if (isLoading) return <FullscreenSpinner />

  return (
    <div className='pt-5 '>
      <div className='w-screen fixed top-0 z-10'>
        {isFetching && (
          <div className='h-2'>
            <ProgressBar />
          </div>
        )}
      </div>
      <div className='md:h-25 md:py-0 py-4  bg-card flex gap-4 md:items-center justify-center md:px-8 px-4 relative md:flex-row flex-col'>
        <h2 className='text-2xl font-bold md:absolute left-8 top-0 bottom-0 flex items-center'>
          Товары
        </h2>
        <div className='md:w-5xl md:max-w-[calc(100vw-510px)]'>
          <SearchProduct />
        </div>
      </div>

      <div className='mt-8 bg-card'>
        <div className='md:mb-4 md:p-8 p-4 md:gap-0 gap-4 flex justify-between flex-col-reverse md:flex-row md:items-center'>
          <h2 className='text-xl font-bold  '>Все позиции</h2>
          <div className='flex gap-2 justify-between md:justify-normal'>
            <Button
              onClick={() => refetch()}
              variant='outline'
              className='size-10.5'
            >
              <RefreshCw className='size-5 text-gray-600' />
            </Button>
            <ProductModal />
          </div>
        </div>

        <div className='w-full md:px-8 px-4 overflow-x-auto min-h-[calc(100vh-385px)]'>
          <DataTable
            columns={columns}
            data={data?.products ?? []}
            onSort={handleSort}
            sort={sort}
            order={order}
            isFetching={isFetching}
          />
        </div>

        <div
          className={cn(
            'md:py-10 py-6 px-8 md:sticky bottom-0 bg-card transition-shadow',
            !scrolledDown && 'md:shadow-lg shadow-black'
          )}
        >
          <div className='flex items-center justify-between flex-col-reverse gap-4 md:flex-row'>
            <div className='text-lg text-muted-foreground whitespace-nowrap md:min-h-7'>
              {!!data?.products.length && (
                <>
                  {getDeclension(
                    ['Показан', 'Показано', 'Показано'],
                    data.products.length
                  )}
                  <span className='text-foreground px-2'>
                    {data.products.length === 1
                      ? '1'
                      : `${(page - 1) * LIMIT + 1}-${Math.min(data?.total || 0, page * LIMIT)}`}
                  </span>
                  из<span className='text-foreground px-2'>{data?.total}</span>
                </>
              )}
            </div>

            <TablePagination
              page={page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>

        <div ref={scrollRef} className='relative h-px w-full' />
      </div>
    </div>
  )
}

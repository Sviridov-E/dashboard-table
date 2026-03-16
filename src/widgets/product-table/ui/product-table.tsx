import { authFetch } from '@/entities/auth'
import { useProducts } from '@/entities/products'
import { columns } from '@/entities/products/ui/columns'
import { ProductModal } from '@/features/create-product'
import { SearchProduct } from '@/features/search-products'
import { cn, getDeclension } from '@/shared/lib'
import { Button, FullscreenSpinner } from '@/shared/ui'
import { DataTable } from '@/shared/ui/data-table'
import { RefreshCw } from 'lucide-react'
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

  const { scrolledDown, setScrollAnchorRef } = useScrolledDown()

  if (isLoading) return <FullscreenSpinner />

  return (
    <div className='pt-5'>
      <div className='fixed top-0 z-10 w-screen'>
        {isFetching && (
          <div className='h-2'>
            <ProgressBar />
          </div>
        )}
      </div>
      <div className='relative flex flex-col justify-center gap-4 bg-card px-4 py-4 md:h-25 md:flex-row md:items-center md:px-8 md:py-0'>
        <h2 className='top-0 bottom-0 left-8 flex items-center text-2xl font-bold md:absolute'>
          Товары
        </h2>
        <div className='md:w-5xl md:max-w-[calc(100vw-510px)]'>
          <SearchProduct />
        </div>
      </div>

      <div className='mt-8 bg-card'>
        <div className='flex flex-col-reverse justify-between gap-4 p-4 md:mb-4 md:flex-row md:items-center md:gap-0 md:p-8'>
          <h2 className='text-xl font-bold'>Все позиции</h2>
          <div className='flex justify-between gap-2 md:justify-normal'>
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

        <div className='min-h-[calc(100vh-385px)] w-full overflow-x-auto px-4 md:px-8'>
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
            'bottom-0 bg-card px-8 py-6 transition-shadow md:sticky md:py-10',
            !scrolledDown && 'shadow-black md:shadow-lg'
          )}
        >
          <div className='flex flex-col-reverse items-center justify-between gap-4 md:flex-row'>
            <div className='text-lg whitespace-nowrap text-muted-foreground md:min-h-7'>
              {!!data?.products.length && (
                <>
                  {getDeclension(
                    ['Показан', 'Показано', 'Показано'],
                    data.products.length
                  )}
                  <span className='px-2 text-foreground'>
                    {data.products.length === 1
                      ? '1'
                      : `${(page - 1) * LIMIT + 1}-${Math.min(data?.total || 0, page * LIMIT)}`}
                  </span>
                  из<span className='px-2 text-foreground'>{data?.total}</span>
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

        <div ref={setScrollAnchorRef} className='relative h-px w-full' />
      </div>
    </div>
  )
}

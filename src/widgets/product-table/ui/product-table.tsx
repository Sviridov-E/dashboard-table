import { authFetch } from '@/entities/auth'
import { useProducts } from '@/entities/products'
import { columns } from '@/entities/products/ui/columns'
import { SearchProduct } from '@/features/search-products'
import { DataTable } from '@/shared/ui/data-table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'
import { useSearchParams } from 'react-router-dom'

const LIMIT = 20

type SortDirection = 'asc' | 'desc'

export const ProductTable = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1')
  const sort = searchParams.get('sortBy') || null
  const order = (searchParams.get('order') || 'asc') as SortDirection
  const query = searchParams.get('q') || null

  const { data, isLoading, isFetching } = useProducts(authFetch, {
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

  if (isLoading) return <div>Загрузка товаров...</div>

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Товары</h1>
      <div className='mb-4'>
        <SearchProduct />
      </div>
      <div style={{ opacity: isFetching ? 0.5 : 1 }}>
        <DataTable
          columns={columns}
          data={data?.products ?? []}
          onSort={handleSort}
          sort={sort}
          order={order}
        />
      </div>

      <div className='flex items-center justify-between py-4'>
        <div className='text-sm text-muted-foreground'>
          Показано {(page - 1) * LIMIT + 1}-
          {Math.min(data?.total || 0, page * LIMIT)} из {data?.total}
        </div>

        <Pagination>
          <PaginationContent>
            {page !== 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {page !== totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, page + 1))
                  }
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

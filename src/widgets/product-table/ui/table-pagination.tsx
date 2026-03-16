import { cn } from '@/shared/lib'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'

export const TablePagination = ({
  handlePageChange,
  page,
  totalPages,
}: {
  page: number
  totalPages: number
  handlePageChange: (page: number) => void
}) => {
  if (totalPages < 2) return null

  return (
    <Pagination>
      <PaginationContent className='w-full justify-between gap-2 md:w-auto md:justify-normal'>
        <PaginationItem className={cn(page === 1 && 'md:hidden')}>
          <PaginationPrevious
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            className='size-10 rounded-sm border border-neutral-400 text-neutral-500 md:mr-1 md:size-7.5 md:border-0'
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => {
          const isActive = page === i + 1
          return (
            <PaginationItem key={i} className='hidden md:block'>
              <PaginationLink
                className={cn(
                  'size-7.5 rounded-sm border border-neutral-300 text-sm text-neutral-400',
                  isActive &&
                    'border-none bg-indigo-400 text-white hover:bg-indigo-400 hover:text-white'
                )}
                isActive={isActive}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem className={cn(page === totalPages && 'md:hidden')}>
          <PaginationNext
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            className='size-10 rounded-sm border border-neutral-400 text-neutral-500 md:ml-1 md:size-7.5 md:border-0'
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

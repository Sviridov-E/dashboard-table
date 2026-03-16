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
      <PaginationContent className='gap-2 w-full justify-between md:w-auto md:justify-normal'>
        <PaginationItem className={cn(page === 1 && 'md:hidden')}>
          <PaginationPrevious
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            className='text-neutral-500 size-10 md:size-7.5 rounded-sm md:mr-1 md:border-0 border border-neutral-400'
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => {
          const isActive = page === i + 1
          return (
            <PaginationItem key={i} className='md:block hidden'>
              <PaginationLink
                className={cn(
                  'size-7.5 border border-neutral-300 text-sm text-neutral-400 rounded-sm',
                  isActive &&
                    'border-none text-white bg-indigo-400 hover:text-white hover:bg-indigo-400'
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
            className='text-neutral-500 size-10 md:size-7.5 rounded-sm md:ml-1 md:border-0 border border-neutral-400'
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

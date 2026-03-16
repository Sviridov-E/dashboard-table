import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { cn } from '../lib'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onSort: (field: string) => void
  sort: string | null
  order: 'asc' | 'desc'
  isFetching: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onSort,
  sort,
  order,
  isFetching,
}: DataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    meta: { onSort },
    state: {
      sorting: sort ? [{ id: sort, desc: order === 'desc' }] : undefined,
    },
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header, index) => (
              <TableHead
                key={header.id}
                className={cn(
                  'overflow-hidden',
                  'py-6 text-base font-bold text-neutral-300',
                  header.id !== 'title' && 'text-center',
                  !index && 'pl-4'
                )}
                style={{
                  width:
                    header.column.id === 'title'
                      ? 'auto'
                      : `${header.getSize()}px`,
                }}
              >
                <span className='truncate'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </span>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody
        className={cn(
          'transition-[filter]',
          isFetching && 'opacity-50 blur-sm'
        )}
      >
        {data.length ? (
          table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? 'selected' : null}
              className='group transition-colors data-[state=selected]:bg-muted/50'
            >
              {row.getVisibleCells().map((cell, index) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    cell.column.id !== 'title' && 'text-center',
                    'overflow-hidden',
                    // Индикатор выбранной строки
                    'relative',
                    index === 0 &&
                      'pl-4 group-data-[state=selected]:before:absolute group-data-[state=selected]:before:top-0 group-data-[state=selected]:before:left-0 group-data-[state=selected]:before:h-full group-data-[state=selected]:before:w-0.75 group-data-[state=selected]:before:bg-primary'
                  )}
                  style={{
                    width:
                      cell.column.id === 'title'
                        ? 'auto'
                        : `${cell.column.getSize()}px`,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className='h-24 text-center'>
              Нет данных.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

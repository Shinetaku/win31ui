import { useState, type ReactNode, type TableHTMLAttributes } from 'react'
import { flexRender, type ColumnDef, type SortingState } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel, useLegacyTable, type LegacyFeatures } from '@tanstack/react-table/legacy'
import { cls } from './Input'

/** Locale-aware text comparison; numeric values compare numerically. */
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export interface Win31TableColumn<T> {
  key: string
  header: ReactNode
  /** Cell content; may return rich nodes (icons) for display. */
  accessor?: (row: T) => ReactNode
  /**
   * Sort key used instead of the accessor result when the accessor renders
   * rich content that has no meaningful ordering.
   */
  sortValue?: (row: T) => string | number
  width?: number | string
  /** Defaults to true; requires sortValue or accessor to actually sort. */
  sortable?: boolean
}

export interface Win31TableProps<T> extends TableHTMLAttributes<HTMLTableElement> {
  columns: Array<Win31TableColumn<T>>
  data: ReadonlyArray<T>
  /** Returns a stable unique id for a row. */
  rowKey: (row: T) => string
  /** Key of the currently highlighted row; `null` when nothing is selected. */
  selectedRowKey?: string | null
  /** Called when a row is clicked; selecting again returns `null` plus the row. */
  onRowSelect?: (rowKey: string | null, row: T) => void
}

/**
 * Windows 3.1 grid table (bordered cells, flat header). Sorting is internal
 * (`asc` on first header click, `desc` on second) and exposed to assistive
 * tech via `aria-sort`; row selection is controlled via `selectedRowKey`.
 */
export function Win31Table<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  selectedRowKey,
  onRowSelect,
  className,
  ...rest
}: Win31TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columnDefs: Array<ColumnDef<LegacyFeatures, T>> = columns.map((column) => {
    const sortValue = column.sortValue
    return {
      id: column.key,
      header: () => column.header,
      cell: (info) => info.getValue(),
      accessorFn: (row: T) => {
        const accessor = column.accessor
        return accessor ? accessor(row) : ''
      },
      sortingFn: sortValue
        ? (a: { original?: T }, b: { original?: T }, _columnId: string) => {
            const rowA = (a.original ?? {}) as T
            const rowB = (b.original ?? {}) as T
            const value = sortValue(rowA)
            const other = sortValue(rowB)
            if (typeof value === 'number' && typeof other === 'number') return value - other
            return collator.compare(String(value), String(other))
          }
        : undefined,
      enableSorting:
        (column.sortable ?? true) && (sortValue !== undefined || column.accessor !== undefined)
    }
  })

  const table = useLegacyTable<T>({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel<T>(),
    getSortedRowModel: getSortedRowModel<T>(),
    state: { sorting },
    onSortingChange: setSorting,
    getRowId: (row) => rowKey(row)
  })

  return (
    <table className={cls('win31-table', className)} {...rest}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const column = header.column
              const sorted = column.getIsSorted()
              const headerTemplate = column.columnDef.header
              const canSort = column.getCanSort()
              const indicator =
                sorted === 'asc' ? ' ▲' : sorted === 'desc' ? ' ▼' : ''
              const content = (
                <>
                  {header.isPlaceholder || headerTemplate == null
                    ? null
                    : flexRender(headerTemplate, header.getContext())}
                  <span aria-hidden="true">{indicator}</span>
                </>
              )
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
                  style={{ width: columns.find((def) => def.key === column.id)?.width }}
                >
                  {/* Sortable headers are buttons so keyboard users can sort. */}
                  {canSort ? (
                    <button
                      type="button"
                      className="win31-table-sort"
                      onClick={column.getToggleSortingHandler()}
                    >
                      {content}
                    </button>
                  ) : (
                    content
                  )}
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className={cls(row.id === selectedRowKey && 'is-selected')}
            onClick={() => onRowSelect?.(row.id === selectedRowKey ? null : row.id, row.original)}
          >
            {row.getVisibleCells().map((cell) => {
              const cellTemplate = cell.column.columnDef.cell
              return <td key={cell.id}>{cellTemplate != null ? flexRender(cellTemplate, cell.getContext()) : null}</td>
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

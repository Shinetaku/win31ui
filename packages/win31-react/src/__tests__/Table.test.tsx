import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31Table } from '../components/Table'

interface Fruit {
  id: string
  name: string
  qty: number
}

const data: Fruit[] = [
  { id: 'f1', name: 'Banana', qty: 3 },
  { id: 'f2', name: 'Apple', qty: 10 },
  { id: 'f3', name: 'Cherry', qty: 1 }
]

const columns = [
  { key: 'name', header: 'Name', accessor: (row: Fruit) => row.name },
  { key: 'qty', header: 'Qty', accessor: (row: Fruit) => row.qty }
]

describe('Win31Table', () => {
  it('renders header and one row per data item', () => {
    render(<Win31Table columns={columns} data={data} rowKey={(row) => row.id} />)
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Qty' })).toBeInTheDocument()
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(4)
    const body = screen.getByRole('table')
    expect(within(body).getByRole('cell', { name: 'Banana' })).toBeInTheDocument()
    expect(within(body).getByRole('cell', { name: '3' })).toBeInTheDocument()
  })

  it('sorts a numeric column via the header button and sets aria-sort', () => {
    render(<Win31Table columns={columns} data={data} rowKey={(row) => row.id} />)
    // The th stays non-interactive; sorting lives on the inner button.
    const qtyHeader = screen.getByRole('columnheader', { name: 'Qty' })
    expect(qtyHeader).not.toHaveAttribute('aria-sort')
    const qtyButton = screen.getByRole('button', { name: 'Qty' })
    // Numeric columns sort descending first (TanStack default), then ascending.
    fireEvent.click(qtyButton)
    expect(qtyHeader).toHaveAttribute('aria-sort', 'descending')
    const rowsDesc = screen.getAllByRole('row')
    expect(rowsDesc[1]).toHaveTextContent('Apple')
    expect(rowsDesc[2]).toHaveTextContent('Banana')
    expect(rowsDesc[3]).toHaveTextContent('Cherry')
    fireEvent.click(screen.getByRole('button', { name: 'Qty' }))
    expect(qtyHeader).toHaveAttribute('aria-sort', 'ascending')
    const rowsAsc = screen.getAllByRole('row')
    expect(rowsAsc[1]).toHaveTextContent('Cherry')
  })

  it('keeps non-sortable columns as plain header text without a button', () => {
    render(
      <Win31Table
        columns={[{ key: 'name', header: 'Name', accessor: (row: Fruit) => row.name, sortable: false }, ...columns.slice(1)]}
        data={data}
        rowKey={(row) => row.id}
      />
    )
    expect(
      screen.getByRole('columnheader', { name: 'Name' }).querySelector('button')
    ).toBeNull()
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('Banana')
  })

  it('fires onRowSelect on row clicks, toggling off when already selected', () => {
    const onRowSelect = vi.fn()
    render(
      <Win31Table columns={columns} data={data} rowKey={(row) => row.id} selectedRowKey="f3" onRowSelect={onRowSelect} />
    )
    expect(screen.getByRole('cell', { name: 'Cherry' }).closest('tr')).toHaveClass('is-selected')
    fireEvent.click(screen.getByRole('cell', { name: 'Banana' }))
    expect(onRowSelect).toHaveBeenCalledWith('f1', data[0])
    fireEvent.click(screen.getByRole('cell', { name: 'Cherry' }))
    expect(onRowSelect).toHaveBeenCalledWith(null, data[2])
  })
})

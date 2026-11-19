import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31List, type Win31ListItem } from '../components/List'

const columns = [
  { key: 'name', header: 'Name', width: '1.7fr' },
  { key: 'type', header: 'Type', width: '70px' },
  { key: 'params', header: 'Parameters' }
]

const items: Array<Win31ListItem> = [
  { id: 'e1', label: '441YXJ2500012', cells: { type: 'Order', params: '60m / 80%' }, group: true, icon: true },
  { id: 'n1', label: '075****1046', cells: { type: 'Number', params: 'Inherited' }, indent: 1, icon: true },
  { id: 'n2', label: '075****1047', cells: { type: 'Number', params: '30m / 20%' }, indent: 1, icon: true }
]

describe('Win31List', () => {
  it('renders the header grid and all rows with cells', () => {
    render(<Win31List columns={columns} items={items} aria-label="onboarding" />)
    expect(screen.getByRole('listbox', { name: 'onboarding' })).not.toBeNull()
    expect(screen.getByText('441YXJ2500012')).not.toBeNull()
    expect(screen.getByText('60m / 80%')).not.toBeNull()
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('applies group, indent and icon classes', () => {
    render(<Win31List columns={columns} items={items} />)
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveClass('is-group')
    expect(options[0]?.querySelector('.icon')).not.toBeNull()
    expect(options[1]?.querySelectorAll('.indent')).toHaveLength(1)
  })

  it('highlights the controlled selection and reports clicks', () => {
    const onSelect = vi.fn()
    render(<Win31List columns={columns} items={items} selectedId="n1" onSelect={onSelect} />)
    const options = screen.getAllByRole('option')
    expect(options[1]).toHaveClass('is-current')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(options[2]!)
    expect(onSelect).toHaveBeenCalledWith('n2')
  })

  it('moves the selection with the keyboard', () => {
    const onSelect = vi.fn()
    render(<Win31List columns={columns} items={items} selectedId="e1" onSelect={onSelect} />)
    const list = screen.getByRole('listbox')
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    expect(onSelect).toHaveBeenLastCalledWith('n1')
    fireEvent.keyDown(list, { key: 'End' })
    expect(onSelect).toHaveBeenLastCalledWith('n2')
    fireEvent.keyDown(list, { key: 'Home' })
    expect(onSelect).toHaveBeenLastCalledWith('e1')
  })
})

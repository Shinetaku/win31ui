import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31ListBox } from '../components/ListBox'

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', disabled: true },
  { value: 'c', label: 'Gamma' }
]

describe('Win31ListBox', () => {
  it('renders options and marks the selected one', () => {
    render(<Win31ListBox options={options} value="a" aria-label="Pick" />)
    const list = screen.getByRole('listbox', { name: 'Pick' })
    expect(list).toHaveClass('win31-listbox')
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.getByRole('option', { name: 'Alpha' })).toHaveClass('win31-listbox-item', 'is-selected')
    expect(screen.getByRole('option', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'Beta' })).toHaveAttribute('aria-disabled', 'true')
  })

  it('fires onChange on item click and ignores disabled items', () => {
    const onChange = vi.fn()
    render(<Win31ListBox options={options} value="a" onChange={onChange} />)
    fireEvent.click(screen.getByRole('option', { name: 'Beta' }))
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('option', { name: 'Gamma' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('c')
  })

  it('ArrowDown/ArrowUp skip disabled items', () => {
    const onChange = vi.fn()
    const { rerender } = render(<Win31ListBox options={options} value="a" onChange={onChange} />)
    const list = screen.getByRole('listbox')
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('c')
    rerender(<Win31ListBox options={options} value="c" onChange={onChange} />)
    fireEvent.keyDown(list, { key: 'ArrowUp' })
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('Home/End jump to first/last enabled item', () => {
    const onChange = vi.fn()
    const { rerender } = render(<Win31ListBox options={options} value="c" onChange={onChange} />)
    const list = screen.getByRole('listbox')
    fireEvent.keyDown(list, { key: 'Home' })
    expect(onChange).toHaveBeenCalledWith('a')
    rerender(<Win31ListBox options={options} value="a" onChange={onChange} />)
    fireEvent.keyDown(list, { key: 'End' })
    expect(onChange).toHaveBeenCalledWith('c')
    onChange.mockClear()
    rerender(<Win31ListBox options={options} value="a" onChange={onChange} />)
    fireEvent.keyDown(list, { key: 'Home' })
    expect(onChange).not.toHaveBeenCalled()
  })
})

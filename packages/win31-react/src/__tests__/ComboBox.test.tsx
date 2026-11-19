import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31ComboBox } from '../components/ComboBox'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'gfruit', label: 'G-Fruit' }
]

describe('Win31ComboBox', () => {
  it('opens and closes the list with the button', () => {
    render(<Win31ComboBox options={options} />)
    const input = screen.getByRole('combobox')
    const toggle = screen.getByRole('button', { name: 'Toggle list' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(input).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('option')).toHaveLength(4)
    fireEvent.click(toggle)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('filters options by label and value, case-insensitive', () => {
    render(<Win31ComboBox options={options} value="cherry" />)
    expect(screen.getByDisplayValue('Cherry')).toBeInTheDocument()
    const input = screen.getByRole('combobox')
    fireEvent.click(screen.getByRole('button', { name: 'Toggle list' }))
    fireEvent.change(input, { target: { value: '' } })
    expect(screen.getAllByRole('option')).toHaveLength(4)
    fireEvent.change(input, { target: { value: 'AN' } })
    const filtered = screen.getAllByRole('option')
    expect(filtered).toHaveLength(1)
    expect(filtered[0]).toHaveTextContent('Banana')
    fireEvent.change(input, { target: { value: 'gfruit' } })
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: 'G-Fruit' })).toBeInTheDocument()
  })

  it('fills the input, fires onChange and closes when picking an option', () => {
    const onChange = vi.fn()
    render(<Win31ComboBox options={options} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Toggle list' }))
    fireEvent.click(screen.getByRole('option', { name: 'Apple' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('apple')
    expect(screen.getByDisplayValue('Apple')).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes on Escape and on outside clicks', () => {
    render(<Win31ComboBox options={options} />)
    const input = screen.getByRole('combobox')
    fireEvent.click(screen.getByRole('button', { name: 'Toggle list' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Toggle list' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Win31Input, Win31Textarea } from '../components/Input'

describe('Win31Input', () => {
  it('renders a text input with the win31-input class', () => {
    render(<Win31Input placeholder="name" />)
    const input = screen.getByPlaceholderText('name')
    expect(input).toHaveClass('win31-input')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('passes value changes through and forwards refs', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Win31Input ref={ref} defaultValue="abc" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.value).toBe('abc')
    fireEvent.change(ref.current!, { target: { value: 'xyz' } })
    expect(ref.current?.value).toBe('xyz')
  })

  it('supports disabled state', () => {
    render(<Win31Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})

describe('Win31Textarea', () => {
  it('renders a textarea with the win31-textarea class', () => {
    render(<Win31Textarea aria-label="notes" defaultValue="hello" />)
    const area = screen.getByRole('textbox', { name: 'notes' })
    expect(area).toHaveClass('win31-textarea')
    expect(area).toHaveValue('hello')
  })
})

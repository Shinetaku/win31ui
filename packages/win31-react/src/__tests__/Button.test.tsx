import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31Button } from '../components/Button'

describe('Win31Button', () => {
  it('renders with base class and type=button by default', () => {
    render(<Win31Button>OK</Win31Button>)
    const btn = screen.getByRole('button', { name: 'OK' })
    expect(btn).toHaveClass('win31-button')
    expect(btn).toHaveAttribute('type', 'button')
  })

  it('applies variant classes', () => {
    render(
      <Win31Button small isDefault pressed>
        Go
      </Win31Button>
    )
    expect(screen.getByRole('button', { name: 'Go' })).toHaveClass('is-small', 'is-default', 'is-pressed')
  })

  it('fires onClick and merges extra classes', () => {
    const onClick = vi.fn()
    render(
      <Win31Button className="extra" onClick={onClick}>
        Hit
      </Win31Button>
    )
    const btn = screen.getByRole('button', { name: 'Hit' })
    expect(btn).toHaveClass('extra')
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('supports submit type and disabled state', () => {
    render(
      <Win31Button type="submit" disabled>
        Send
      </Win31Button>
    )
    const btn = screen.getByRole('button', { name: 'Send' })
    expect(btn).toHaveAttribute('type', 'submit')
    expect(btn).toBeDisabled()
  })
})

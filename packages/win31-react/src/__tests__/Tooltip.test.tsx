import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31Tooltip } from '../components/Tooltip'

describe('Win31Tooltip', () => {
  it('renders only the trigger while not hovered', () => {
    render(
      <Win31Tooltip content="tip text">
        <button>trigger</button>
      </Win31Tooltip>
    )
    expect(screen.getByRole('button', { name: 'trigger' })).toBeInTheDocument()
    expect(document.querySelector('.win31-tooltip')).toBeNull()
  })

  it('shows the tip on hover and hides on leave', () => {
    render(
      <Win31Tooltip content="tip text" delay={0}>
        <button>trigger</button>
      </Win31Tooltip>
    )
    const trigger = screen.getByRole('button', { name: 'trigger' })
    fireEvent.mouseEnter(trigger)
    const tip = document.querySelector('.win31-tooltip')
    expect(tip).not.toBeNull()
    expect(tip).toHaveTextContent('tip text')
    expect(tip).toHaveStyle({ position: 'fixed' })
    fireEvent.mouseLeave(trigger)
    expect(document.querySelector('.win31-tooltip')).toBeNull()
  })

  it('shows the tip on keyboard focus and hides on blur', () => {
    render(
      <Win31Tooltip content="tip text" delay={0}>
        <button>trigger</button>
      </Win31Tooltip>
    )
    const trigger = screen.getByRole('button', { name: 'trigger' })
    fireEvent.focus(trigger)
    expect(document.querySelector('.win31-tooltip')).not.toBeNull()
    fireEvent.blur(trigger)
    expect(document.querySelector('.win31-tooltip')).toBeNull()
  })

  it('keeps the trigger element own handlers working', () => {
    const onEnter = vi.fn()
    render(
      <Win31Tooltip content="tip" delay={0}>
        <button onMouseEnter={onEnter}>trigger</button>
      </Win31Tooltip>
    )
    fireEvent.mouseEnter(screen.getByRole('button'))
    expect(onEnter).toHaveBeenCalledOnce()
    expect(document.querySelector('.win31-tooltip')).not.toBeNull()
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31Window } from '../components/Window'

describe('Win31Window', () => {
  it('renders title bar and body', () => {
    render(<Win31Window title="My App">content</Win31Window>)
    const win = document.querySelector('.win31-window')
    expect(win).not.toBeNull()
    expect(screen.getByText('My App')).toHaveClass('win31-titlebar-text')
    expect(screen.getByText('content')).toHaveClass('win31-window-body')
  })

  it('applies dialog and maximized classes', () => {
    const { rerender } = render(<Win31Window title="x" dialog />)
    expect(document.querySelector('.win31-window')).toHaveClass('is-dialog')
    rerender(<Win31Window title="x" maximized />)
    expect(document.querySelector('.win31-window')).toHaveClass('is-maximized')
    rerender(<Win31Window title="x" />)
    expect(document.querySelector('.win31-window')).not.toHaveClass('is-dialog', 'is-maximized')
  })

  it('routes control buttons to the callbacks', () => {
    const onMinimize = vi.fn()
    const onMaximize = vi.fn()
    const onClose = vi.fn()
    render(
      <Win31Window title="x" onMinimize={onMinimize} onMaximize={onMaximize} onClose={onClose} />
    )
    fireEvent.click(screen.getByRole('button', { name: 'minimize' }))
    fireEvent.click(screen.getByRole('button', { name: 'maximize' }))
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(onMinimize).toHaveBeenCalledOnce()
    expect(onMaximize).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('supports hideTitleBar and custom body classes', () => {
    render(
      <Win31Window title="x" hideTitleBar bodyClassName="is-flush">
        body
      </Win31Window>
    )
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByText('body')).toHaveClass('is-flush')
  })

  it('passes bodyProps to the body element', () => {
    const onDoubleClick = vi.fn()
    render(
      <Win31Window title="x" bodyProps={{ onDoubleClick }}>
        body
      </Win31Window>
    )
    fireEvent.dblClick(screen.getByText('body'))
    expect(onDoubleClick).toHaveBeenCalledOnce()
  })
})

describe('Win31Window manual dragging', () => {
  it('moves the window with pointer events and stops after pointer up', () => {
    const { container } = render(<Win31Window title="x" dragMode="manual">body</Win31Window>)
    const win = container.querySelector('.win31-window') as HTMLElement
    const bar = win.querySelector('.win31-titlebar') as HTMLElement

    // jsdom reports every rect as 0, so offsets are clientX/clientY and the
    // window starts pinned at (0,0) — the assertions verify the delta math.
    fireEvent.pointerDown(bar, { button: 0, pointerId: 1, clientX: 100, clientY: 60 })
    expect(win.style.position).toBe('fixed')
    expect(win.style.left).toBe('0px')
    expect(win.style.top).toBe('0px')

    fireEvent.pointerMove(bar, { pointerId: 1, clientX: 180, clientY: 140 })
    expect(win.style.left).toBe('80px')
    expect(win.style.top).toBe('80px')

    fireEvent.pointerUp(bar, { pointerId: 1, clientX: 300, clientY: 300 })
    fireEvent.pointerMove(bar, { pointerId: 1, clientX: 500, clientY: 500 })
    expect(win.style.left).toBe('80px')
    expect(win.style.top).toBe('80px')
  })

  it('ignores drags that start on control buttons', () => {
    const { container } = render(<Win31Window title="x" dragMode="manual">body</Win31Window>)
    const win = container.querySelector('.win31-window') as HTMLElement
    const close = screen.getByRole('button', { name: 'close' })
    fireEvent.pointerDown(close, { button: 0, pointerId: 1, clientX: 10, clientY: 10 })
    expect(win.style.position).toBe('')
  })

  it('does not drag when dragMode is none', () => {
    const { container } = render(<Win31Window title="x">body</Win31Window>)
    const win = container.querySelector('.win31-window') as HTMLElement
    const bar = win.querySelector('.win31-titlebar') as HTMLElement
    fireEvent.pointerDown(bar, { button: 0, pointerId: 1, clientX: 100, clientY: 60 })
    expect(win.style.position).toBe('')
  })
})

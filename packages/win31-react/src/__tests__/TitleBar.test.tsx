import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31TitleBar } from '../components/TitleBar'

describe('Win31TitleBar', () => {
  it('renders caption, system menu and the three control buttons', () => {
    render(<Win31TitleBar title="Untitled - Notepad" />)
    expect(screen.getByText('Untitled - Notepad')).toHaveClass('win31-titlebar-text')
    expect(document.querySelector('.win31-sysmenu')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'minimize' })).toHaveAttribute('data-btn', 'min')
    expect(screen.getByRole('button', { name: 'maximize' })).toHaveAttribute('data-btn', 'max')
    expect(screen.getByRole('button', { name: 'close' })).toHaveAttribute('data-btn', 'close')
  })

  it('reports pressed controls to onControl', () => {
    const onControl = vi.fn()
    render(<Win31TitleBar title="x" onControl={onControl} />)
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    fireEvent.click(screen.getByRole('button', { name: 'minimize' }))
    expect(onControl).toHaveBeenNthCalledWith(1, 'close')
    expect(onControl).toHaveBeenNthCalledWith(2, 'minimize')
  })

  it('hides system menu and controls on demand', () => {
    render(<Win31TitleBar title="x" showSystemMenu={false} controls={false} />)
    expect(document.querySelector('.win31-sysmenu')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('marks inactive windows with the is-inactive class', () => {
    const { rerender } = render(<Win31TitleBar title="x" />)
    expect(document.querySelector('.win31-titlebar')).not.toHaveClass('is-inactive')
    rerender(<Win31TitleBar title="x" active={false} />)
    expect(document.querySelector('.win31-titlebar')).toHaveClass('is-inactive')
  })

  it('adds the Tauri drag region attribute', () => {
    render(<Win31TitleBar title="x" dragMode="tauri" />)
    expect(document.querySelector('.win31-titlebar')).toHaveAttribute('data-tauri-drag-region')
  })

  it('marks Electron drag mode with the is-electron-drag class', () => {
    render(<Win31TitleBar title="x" dragMode="electron" />)
    expect(document.querySelector('.win31-titlebar')).toHaveClass('is-electron-drag')
  })
})

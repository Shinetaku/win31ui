import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31Dialog } from '../components/Dialog'

describe('Win31Dialog', () => {
  it('renders nothing while closed', () => {
    const { container } = render(<Win31Dialog open={false}>body</Win31Dialog>)
    expect(container).toBeEmptyDOMElement()
    expect(document.querySelector('.win31-window.is-dialog')).toBeNull()
    expect(document.querySelector('.win31-dialog-backdrop')).toBeNull()
  })

  it('renders a portaled dialog with title, body and dialog semantics', () => {
    render(
      <Win31Dialog open title="Confirm">
        body
      </Win31Dialog>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('win31-window', 'is-dialog')
    expect(dialog.tagName).toBe('DIALOG')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Confirm')
    expect(screen.getByText('Confirm')).toHaveClass('win31-titlebar-text')
    expect(screen.getByText('body')).toHaveClass('win31-window-body')
    expect(dialog).toHaveFocus()
  })

  it('applies the inline width', () => {
    render(
      <Win31Dialog open width={400}>
        body
      </Win31Dialog>
    )
    expect(screen.getByRole('dialog')).toHaveStyle({ width: '400px' })
  })

  it('closes on the Esc close request unless closeOnEsc is false', () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <Win31Dialog open onClose={onClose} closeOnEsc={false}>
        body
      </Win31Dialog>
    )
    const dialog = screen.getByRole('dialog')
    // The platform delivers Esc as a cancelable `cancel` event on <dialog>.
    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }))
    expect(onClose).not.toHaveBeenCalled()

    rerender(
      <Win31Dialog open onClose={onClose}>
        body
      </Win31Dialog>
    )
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: false, cancelable: true }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes from the title bar close control', () => {
    const onClose = vi.fn()
    render(
      <Win31Dialog open onClose={onClose}>
        body
      </Win31Dialog>
    )
    expect(screen.queryByRole('button', { name: 'minimize' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes on backdrop click only when closeOnBackdrop is set', () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <Win31Dialog open onClose={onClose}>
        body
      </Win31Dialog>
    )
    // With showModal() a click on the ::backdrop area targets the dialog itself.
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()

    rerender(
      <Win31Dialog open onClose={onClose} closeOnBackdrop>
        body
      </Win31Dialog>
    )
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders the buttons slot in the bottom row', () => {
    render(
      <Win31Dialog
        open
        buttons={
          <>
            <button>OK</button>
            <button>Cancel</button>
          </>
        }
      >
        body
      </Win31Dialog>
    )
    expect(screen.getByText('OK').closest('.win31-dialog-buttons')).not.toBeNull()
    expect(screen.getByText('Cancel').closest('.win31-dialog-buttons')).not.toBeNull()
  })

  it('omits the button row when no buttons are given', () => {
    render(<Win31Dialog open>body</Win31Dialog>)
    expect(document.querySelector('.win31-dialog-buttons')).toBeNull()
  })
})

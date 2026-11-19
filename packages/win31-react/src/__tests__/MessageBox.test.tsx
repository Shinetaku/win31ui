import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31MessageBox } from '../components/MessageBox'

describe('Win31MessageBox', () => {
  it('renders nothing while closed', () => {
    const { container } = render(<Win31MessageBox open={false} message="hidden" />)
    expect(container).toBeEmptyDOMElement()
    expect(document.querySelector('.win31-window.is-dialog')).toBeNull()
  })

  it('renders the icon matching the type, defaulting to info', () => {
    const { rerender } = render(<Win31MessageBox open type="stop" message="m" />)
    expect(document.querySelector('.win31-msg-icon.stop')).not.toBeNull()

    rerender(<Win31MessageBox open type="warn" message="m" />)
    expect(document.querySelector('.win31-msg-icon.warn')).not.toBeNull()
    expect(document.querySelector('.win31-msg-icon.stop')).toBeNull()

    rerender(<Win31MessageBox open message="m" />)
    expect(document.querySelector('.win31-msg-icon.info')).not.toBeNull()
  })

  it('shows the message and the optional detail', () => {
    render(<Win31MessageBox open message="main text" detail="detail text" />)
    expect(screen.getByText('main text')).toBeInTheDocument()
    expect(screen.getByText('detail text')).toBeInTheDocument()
    expect(document.querySelector('.win31-msgbox-row')).not.toBeNull()
  })

  it('renders OK by default, marks it default and reports ok', () => {
    const onResult = vi.fn()
    const onClose = vi.fn()
    render(<Win31MessageBox open message="m" onResult={onResult} onClose={onClose} />)
    const ok = screen.getByRole('button', { name: 'OK' })
    expect(ok).toHaveClass('is-default')
    fireEvent.click(ok)
    expect(onResult).toHaveBeenCalledOnce()
    expect(onResult).toHaveBeenCalledWith('ok')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders preset buttons and reports the pressed one', () => {
    const onResult = vi.fn()
    render(<Win31MessageBox open message="m" buttons={['retry', 'abort', 'ignore']} onResult={onResult} />)
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abort' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ignore' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Abort' }))
    expect(onResult).toHaveBeenCalledWith('abort')
  })

  it('marks only the isDefault button', () => {
    render(<Win31MessageBox open message="m" buttons={['yes', 'no']} isDefault="no" />)
    expect(screen.getByRole('button', { name: 'No' })).toHaveClass('is-default')
    expect(screen.getByRole('button', { name: 'Yes' })).not.toHaveClass('is-default')
  })

  it('supports buttonLabels overrides', () => {
    const onResult = vi.fn()
    render(
      <Win31MessageBox
        open
        message="m"
        buttons={['yes', 'no']}
        buttonLabels={{ yes: '是', no: '否' }}
        onResult={onResult}
      />
    )
    expect(screen.queryByRole('button', { name: 'Yes' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '是' }))
    expect(onResult).toHaveBeenCalledWith('yes')
  })
})

import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31Desktop, Win31DesktopIcon } from '../components/Desktop'

const iconProps = { icon: 'icon.png', label: 'My App' }

describe('Win31Desktop', () => {
  it('renders a full-area container for its children', () => {
    render(
      <Win31Desktop>
        <div>app window</div>
      </Win31Desktop>
    )
    expect(document.querySelector('.win31-desktop')).not.toBeNull()
    expect(document.querySelector('.win31-desktop')).toHaveTextContent('app window')
  })
})

describe('Win31DesktopIcon', () => {
  it('renders bitmap, label and flex display when visible', () => {
    const { container } = render(<Win31DesktopIcon {...iconProps} />)
    const icon = container.querySelector('.win31-desktop-icon')
    expect(icon).not.toBeNull()
    expect(icon?.querySelector('img')).toHaveAttribute('src', 'icon.png')
    expect(icon).toHaveTextContent('My App')
    expect(icon).toHaveStyle({ display: 'flex' })
  })

  it('renders nothing when visible is false', () => {
    const { container } = render(<Win31DesktopIcon {...iconProps} visible={false} />)
    expect(container.querySelector('.win31-desktop-icon')).toBeNull()
  })

  it('restores on click and positions with x/y', () => {
    const onRestore = vi.fn()
    const { container } = render(
      <Win31DesktopIcon {...iconProps} x={20} y={30} onRestore={onRestore} />
    )
    const icon = container.querySelector('.win31-desktop-icon') as HTMLElement
    fireEvent.click(icon)
    expect(onRestore).toHaveBeenCalledOnce()
    expect(icon.style.left).toBe('20px')
    expect(icon.style.top).toBe('30px')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Win31Toolbar, Win31ToolbarSeparator } from '../components/Toolbar'
import { Win31StatusBar, Win31StatusPane } from '../components/StatusBar'

describe('Win31Toolbar', () => {
  it('renders children and the path caption', () => {
    render(
      <Win31Toolbar path="VBSS:\Demo">
        <button type="button">Open</button>
      </Win31Toolbar>
    )
    expect(screen.getByRole('button', { name: 'Open' })).not.toBeNull()
    expect(screen.getByText('VBSS:\\Demo')).toHaveClass('win31-path')
    expect(document.querySelector('.win31-toolbar')).not.toBeNull()
  })

  it('renders drives strip only when showDrives is set', () => {
    const { rerender } = render(<Win31Toolbar />)
    expect(document.querySelector('.win31-drives')).toBeNull()
    rerender(<Win31Toolbar showDrives />)
    expect(document.querySelector('.win31-drives')).not.toBeNull()
  })
})

describe('Win31ToolbarSeparator', () => {
  it('renders the groove span', () => {
    render(<Win31ToolbarSeparator />)
    expect(document.querySelector('.win31-toolbar-sep')).not.toBeNull()
  })
})

describe('Win31StatusBar', () => {
  it('contains sunken panes', () => {
    render(
      <Win31StatusBar>
        <Win31StatusPane>Ready</Win31StatusPane>
        <Win31StatusPane>CAPS</Win31StatusPane>
      </Win31StatusBar>
    )
    expect(document.querySelector('.win31-statusbar')).not.toBeNull()
    expect(document.querySelectorAll('.win31-status-pane')).toHaveLength(2)
    expect(screen.getByText('Ready')).toHaveClass('win31-status-pane')
  })
})

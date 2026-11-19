import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  Win31Menu,
  Win31MenuBar,
  Win31MenuItem,
  Win31MenuLink,
  Win31MenuSeparator
} from '../components/MenuBar'

function renderFileMenu(onSelect: () => void = vi.fn()) {
  return render(
    <Win31MenuBar>
      <Win31Menu label="File">
        <Win31MenuItem onSelect={onSelect}>Open</Win31MenuItem>
        <Win31MenuItem accel="Ctrl+S">Save</Win31MenuItem>
        <Win31MenuItem checked>Grid</Win31MenuItem>
        <Win31MenuSeparator />
        <Win31MenuItem disabled>Locked</Win31MenuItem>
      </Win31Menu>
      <Win31MenuLink href="#help">Help</Win31MenuLink>
    </Win31MenuBar>
  )
}

function openFileMenu() {
  fireEvent.click(screen.getByRole('menuitem', { name: 'File' }))
}

describe('Win31MenuBar', () => {
  it('renders the container with the menubar role and class', () => {
    renderFileMenu()
    expect(screen.getByRole('menubar')).toHaveClass('win31-menubar')
  })

  it('renders menu bar links with href and click handling', () => {
    const onClick = vi.fn()
    render(
      <Win31MenuBar>
        <Win31MenuLink href="#docs" onClick={onClick}>
          Docs
        </Win31MenuLink>
      </Win31MenuBar>
    )
    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link).toHaveClass('win31-menubar-link')
    expect(link).toHaveAttribute('href', '#docs')
    fireEvent.click(link)
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe('Win31Menu', () => {
  it('keeps the dropdown closed until the label is clicked', () => {
    renderFileMenu()
    expect(screen.queryByRole('menu')).toBeNull()
    const label = screen.getByRole('menuitem', { name: 'File' })
    expect(label).toHaveAttribute('aria-haspopup', 'menu')
    expect(label).toHaveAttribute('aria-expanded', 'false')
    openFileMenu()
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(label).toHaveAttribute('aria-expanded', 'true')
    expect(document.querySelector('.win31-menu')).toHaveClass('win31-menu', 'is-open')
  })

  it('toggles closed when the label is clicked again', () => {
    renderFileMenu()
    const label = screen.getByRole('menuitem', { name: 'File' })
    fireEvent.click(label)
    fireEvent.click(label)
    expect(screen.queryByRole('menu')).toBeNull()
    expect(label).toHaveAttribute('aria-expanded', 'false')
    expect(document.querySelector('.win31-menu')).not.toHaveClass('is-open')
  })

  it('closes on Escape', () => {
    renderFileMenu()
    openFileMenu()
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'File' }), { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('closes on document clicks outside the menu', () => {
    renderFileMenu()
    openFileMenu()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).toBeNull()
  })
})

describe('Win31MenuItem', () => {
  it('selects on click, fires onSelect once and closes the menu', () => {
    const onSelect = vi.fn()
    renderFileMenu(onSelect)
    openFileMenu()
    fireEvent.click(screen.getByRole('menuitem', { name: 'Open' }))
    expect(onSelect).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('selects on Enter exactly once', () => {
    const onSelect = vi.fn()
    renderFileMenu(onSelect)
    openFileMenu()
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Open' }), { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('renders the accel caption and the checked mark class', () => {
    renderFileMenu()
    openFileMenu()
    expect(screen.getByText('Ctrl+S')).toHaveClass('accel')
    expect(screen.getByRole('menuitem', { name: /Grid/ })).toHaveClass('win31-menu-check')
  })

  it('ignores activation of disabled items and keeps the menu open', () => {
    const onSelect = vi.fn()
    renderFileMenu(onSelect)
    openFileMenu()
    const item = screen.getByRole('menuitem', { name: 'Locked' })
    expect(item).toBeDisabled()
    fireEvent.click(item)
    fireEvent.keyDown(item, { key: 'Enter' })
    expect(onSelect).not.toHaveBeenCalled()
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('renders separators with the token class', () => {
    renderFileMenu()
    openFileMenu()
    expect(document.querySelector('hr.win31-menu-separator')).not.toBeNull()
  })
})

describe('Win31MenuBar keyboard model (app-menus)', () => {
  function renderTwoMenus() {
    return render(
      <Win31MenuBar>
        <Win31Menu label="File">
          <Win31MenuItem>Open</Win31MenuItem>
          <Win31MenuItem>Save</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label="Edit">
          <Win31MenuItem>Copy</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label="View">
          <Win31MenuItem>Grid</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>
    )
  }

  it('exposes a single tab stop on the first trigger (roving tabindex)', () => {
    renderTwoMenus()
    const labels = screen.getAllByRole('menuitem', { name: /^(File|Edit|View)$/ })
    expect(labels[0]).toHaveAttribute('tabindex', '0')
    expect(labels[1]).toHaveAttribute('tabindex', '-1')
    expect(labels[2]).toHaveAttribute('tabindex', '-1')
  })

  it('moves between triggers with arrow keys and wraps at the ends', () => {
    renderTwoMenus()
    const labels = screen.getAllByRole('menuitem', { name: /^(File|Edit|View)$/ })
    fireEvent.keyDown(labels[0]!, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(labels[1])
    expect(labels[1]).toHaveAttribute('tabindex', '0')
    fireEvent.keyDown(labels[1]!, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(labels[2])
    // wrap from the last trigger back to the first
    fireEvent.keyDown(labels[2]!, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(labels[0])
    fireEvent.keyDown(labels[0]!, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(labels[2])
  })

  it('opens the focused menu with ArrowDown and closes it with Escape', () => {
    renderTwoMenus()
    const file = screen.getByRole('menuitem', { name: 'File' })
    fireEvent.keyDown(file, { key: 'ArrowDown' })
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(file).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
    expect(file).toHaveAttribute('aria-expanded', 'false')
  })

  it('walks the dropdown items with ArrowDown/ArrowUp', () => {
    renderTwoMenus()
    const file = screen.getByRole('menuitem', { name: 'File' })
    fireEvent.keyDown(file, { key: 'ArrowDown' })
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' })
    expect(document.activeElement).toHaveTextContent('Open')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(document.activeElement).toHaveTextContent('Save')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
    expect(document.activeElement).toHaveTextContent('Open')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
    // Above the first item the focus returns to the trigger.
    expect(document.activeElement).toBe(file)
  })

  it('switches menus on hover while another menu is open', () => {
    renderTwoMenus()
    const file = screen.getByRole('menuitem', { name: 'File' })
    fireEvent.click(file)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    const edit = screen.getByRole('menuitem', { name: 'Edit' })
    fireEvent.pointerEnter(edit.closest('.win31-menu')!)
    expect(screen.getByText('Copy')).toBeInTheDocument()
    expect(screen.queryByText('Open')).toBeNull()
  })

  it('closes the dropdown when focus leaves the menu', () => {
    renderTwoMenus()
    const file = screen.getByRole('menuitem', { name: 'File' })
    fireEvent.click(file)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.blur(file.closest('.win31-menu')!, { relatedTarget: document.body })
    expect(screen.queryByRole('menu')).toBeNull()
  })
})

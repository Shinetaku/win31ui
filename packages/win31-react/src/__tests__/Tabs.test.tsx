import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31Tabs } from '../components/Tabs'

const items = [
  { id: 'one', label: 'One', content: 'First pane' },
  { id: 'two', label: 'Two', content: 'Second pane' },
  { id: 'three', label: 'Three', content: 'Third pane' }
]

describe('Win31Tabs', () => {
  it('renders a tablist with the first tab active by default', () => {
    render(<Win31Tabs items={items} />)
    expect(screen.getByRole('tablist')).toHaveClass('win31-tabs')
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    const first = screen.getByRole('tab', { name: 'One' })
    expect(first).toHaveClass('win31-tab', 'is-active')
    expect(first).toHaveAttribute('aria-selected', 'true')
    expect(first).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('First pane')
  })

  it('honours defaultActiveId for uncontrolled use', () => {
    render(<Win31Tabs items={items} defaultActiveId="two" />)
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveClass('is-active')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Second pane')
  })

  it('switches the panel on click and reports onChange', () => {
    const onChange = vi.fn()
    render(<Win31Tabs items={items} onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Three' }))
    expect(onChange).toHaveBeenCalledWith('three')
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveClass('is-active')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Third pane')
  })

  it('stays on the controlled activeId until the prop changes', () => {
    const onChange = vi.fn()
    const { rerender } = render(<Win31Tabs items={items} activeId="one" onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Two' }))
    expect(onChange).toHaveBeenCalledWith('two')
    expect(screen.getByRole('tab', { name: 'One' })).toHaveClass('is-active')
    rerender(<Win31Tabs items={items} activeId="two" onChange={onChange} />)
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveClass('is-active')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Second pane')
  })

  it('links the panel to the active tab by id', () => {
    render(<Win31Tabs items={items} />)
    const tab = screen.getByRole('tab', { name: 'One' })
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', tab.id)
  })

  it('moves focus and activation with ArrowRight and ArrowLeft, wrapping around', () => {
    const onChange = vi.fn()
    render(<Win31Tabs items={items} onChange={onChange} />)
    const list = screen.getByRole('tablist')
    fireEvent.keyDown(list, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Second pane')
    expect(onChange).toHaveBeenCalledWith('two')
    fireEvent.keyDown(list, { key: 'ArrowLeft' })
    fireEvent.keyDown(list, { key: 'ArrowLeft' })
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Third pane')
    expect(onChange).toHaveBeenCalledWith('three')
  })

  it('ignores keys other than the arrow keys', () => {
    render(<Win31Tabs items={items} />)
    fireEvent.keyDown(screen.getByRole('tablist'), { key: ' ' })
    expect(screen.getByRole('tabpanel')).toHaveTextContent('First pane')
  })
})

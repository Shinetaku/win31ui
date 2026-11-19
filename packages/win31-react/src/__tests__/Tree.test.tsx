import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31Tree } from '../components/Tree'

const nodes = [
  {
    id: 'root',
    label: 'Root',
    children: [
      { id: 'child', label: 'Child', children: [{ id: 'leaf', label: 'Leaf' }] },
      { id: 'solo', label: 'Solo' }
    ]
  }
]

describe('Win31Tree', () => {
  it('renders rows collapsed by default and expanded ids from defaultExpandedIds', () => {
    const { unmount } = render(<Win31Tree nodes={nodes} />)
    expect(screen.getByRole('treeitem', { name: 'Root' })).toBeInTheDocument()
    expect(screen.queryByRole('treeitem', { name: 'Child' })).not.toBeInTheDocument()
    unmount()
    render(<Win31Tree nodes={nodes} defaultExpandedIds={['root']} />)
    expect(screen.getByRole('treeitem', { name: 'Child' })).toBeInTheDocument()
    expect(screen.queryByRole('treeitem', { name: 'Leaf' })).not.toBeInTheDocument()
  })

  it('sets aria-expanded and boxed caret characters per node state', () => {
    render(<Win31Tree nodes={nodes} defaultExpandedIds={['root', 'child']} />)
    const root = screen.getByRole('treeitem', { name: 'Root' })
    const child = screen.getByRole('treeitem', { name: 'Child' })
    const solo = screen.getByRole('treeitem', { name: 'Solo' })
    expect(root).toHaveAttribute('aria-expanded', 'true')
    expect(child).toHaveAttribute('aria-expanded', 'true')
    expect(solo).not.toHaveAttribute('aria-expanded')
    expect(root.querySelector('.win31-tree-caret')).toHaveTextContent('−')
    expect(screen.getByText('Leaf').closest('.win31-tree-row')?.querySelector('.win31-tree-caret')).toHaveTextContent('')
    fireEvent.click(child.querySelector('.win31-tree-caret') as Element)
    expect(screen.getByRole('treeitem', { name: 'Child' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('treeitem', { name: 'Child' }).querySelector('.win31-tree-caret')).toHaveTextContent('+')
  })

  it('renders a custom node icon in place of the placeholder box', () => {
    const iconNodes = [
      { id: 'a', label: 'Folder', icon: <svg data-testid="node-icon" /> }
    ]
    render(<Win31Tree nodes={iconNodes} />)
    expect(screen.getByTestId('node-icon')).toBeInTheDocument()
    const holder = document.querySelector('.win31-tree-icon')
    expect(holder).toHaveClass('has-image')
    // leaf: caret box is transparent/empty
    expect(screen.getByText('Folder').closest('.win31-tree-row')?.querySelector('.win31-tree-caret')).toHaveTextContent('')
  })

  it('clicking a row toggles expansion and fires onSelect', () => {
    const onSelect = vi.fn()
    render(<Win31Tree nodes={nodes} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('treeitem', { name: 'Root' }))
    expect(onSelect).toHaveBeenCalledWith('root')
    expect(screen.getByRole('treeitem', { name: 'Child' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('treeitem', { name: 'Root' }))
    expect(screen.queryByRole('treeitem', { name: 'Child' })).not.toBeInTheDocument()
  })

  it('marks the selected row with is-current', () => {
    render(<Win31Tree nodes={nodes} defaultExpandedIds={['root']} selectedId="solo" />)
    expect(screen.getByRole('treeitem', { name: 'Solo' })).toHaveClass('win31-tree-row', 'is-current')
    expect(screen.getByRole('treeitem', { name: 'Root' })).not.toHaveClass('is-current')
  })
})

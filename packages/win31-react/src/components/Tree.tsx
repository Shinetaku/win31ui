import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { cls } from './Input'

export interface Win31TreeNode {
  id: string
  label: ReactNode
  /** Child nodes; a node with children shows a caret and can expand/collapse. */
  children?: Array<Win31TreeNode>
  /** Custom 16px icon content (e.g. an inline SVG); replaces the placeholder box. */
  icon?: ReactNode
}

export interface Win31TreeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> {
  nodes: Array<Win31TreeNode>
  /** Id of the currently selected node; `null` when nothing is selected. */
  selectedId?: string | null
  /** Called with the id of the clicked node. */
  onSelect?: (id: string) => void
  /** Node ids that are expanded on first render. */
  defaultExpandedIds?: ReadonlyArray<string>
}

/**
 * Windows 3.1 tree view: indented rows with triangle carets. Expansion state
 * is internal (initialized from `defaultExpandedIds`); clicking the caret or
 * the row toggles expansion, clicking the row also fires `onSelect`.
 */
export function Win31Tree({ nodes, selectedId, onSelect, defaultExpandedIds, ...rest }: Win31TreeProps) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set(defaultExpandedIds ?? []))

  const toggle = (id: string): void => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const renderLevel = (level: Array<Win31TreeNode>, depth: number): ReactNode =>
    level.map((node) => {
      const hasChildren = node.children !== undefined && node.children.length > 0
      const isOpen = expanded.has(node.id)
      return (
        <div key={node.id}>
          <div
            role="treeitem"
            aria-expanded={hasChildren ? isOpen : undefined}
            className={cls('win31-tree-row', node.id === selectedId && 'is-current')}
            onClick={() => {
              if (hasChildren) toggle(node.id)
              onSelect?.(node.id)
            }}
          >
            <span className="win31-tree-caret" aria-hidden="true">
              {hasChildren ? (isOpen ? '−' : '+') : ''}
            </span>
            <span className={cls('win31-tree-icon', node.icon ? 'has-image' : '')} aria-hidden="true">
              {node.icon ?? null}
            </span>
            <span>{node.label}</span>
          </div>
          {hasChildren && isOpen ? (
            <div className="win31-tree" role="group" style={{ paddingLeft: 20 }}>
              {renderLevel(node.children ?? [], depth + 1)}
            </div>
          ) : null}
        </div>
      )
    })

  return (
    <div className="win31-tree" role="tree" {...rest}>
      {renderLevel(nodes, 0)}
    </div>
  )
}

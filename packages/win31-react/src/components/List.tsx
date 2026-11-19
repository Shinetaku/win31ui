import type { HTMLAttributes, ReactNode } from 'react'
import { cls } from './Input'

export interface Win31ListColumn {
  key: string
  header: ReactNode
  /** CSS grid track (e.g. `'1.7fr'`, `'70px'`). Defaults to `'1fr'`. */
  width?: string
}

export interface Win31ListItem {
  id: string
  /** Primary cell content (name / number). */
  label: ReactNode
  /** Contents of the remaining columns, keyed by `Win31ListColumn.key`. */
  cells?: Record<string, ReactNode>
  /** Renders the row as a bold group header (`is-group`). */
  group?: boolean
  /** Indentation levels for hierarchical rows (20px each). */
  indent?: number
  /** Shows the 21x22 pixel file icon before the label. */
  icon?: boolean
}

export interface Win31ListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  columns: Array<Win31ListColumn>
  items: ReadonlyArray<Win31ListItem>
  /** Id of the highlighted row (controlled). */
  selectedId?: string | null
  /** Called with the row id when a row is clicked or focused with the keyboard. */
  onSelect?: (id: string) => void
}

/**
 * Windows 3.1 detail list (`win31-list`): a grid header plus rows with
 * optional indentation, pixel icons and group styling. Selection is
 * controlled via `selectedId`; Arrow/Home/End keys move it.
 */
export function Win31List({
  columns,
  items,
  selectedId,
  onSelect,
  className,
  'aria-label': ariaLabel,
  ...rest
}: Win31ListProps) {
  const gridTemplate = columns.map((column) => column.width ?? '1fr').join(' ')

  const moveSelection = (delta: 1 | -1 | 'home' | 'end') => {
    if (items.length === 0 || !onSelect) return
    const current = items.findIndex((item) => item.id === selectedId)
    const nextIndex =
      delta === 'home'
        ? 0
        : delta === 'end'
          ? items.length - 1
          : Math.min(Math.max(current + delta, 0), items.length - 1)
    const next = items[nextIndex]
    if (next) onSelect(next.id)
  }

  return (
    <div
      role="listbox"
      aria-label={ariaLabel}
      className={cls('win31-list', className)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          moveSelection(1)
        } else if (event.key === 'ArrowUp') {
          event.preventDefault()
          moveSelection(-1)
        } else if (event.key === 'Home') {
          event.preventDefault()
          moveSelection('home')
        } else if (event.key === 'End') {
          event.preventDefault()
          moveSelection('end')
        }
      }}
      {...rest}
    >
      <div className="win31-list-header" style={{ gridTemplateColumns: gridTemplate }}>
        {columns.map((column) => (
          <span key={column.key}>{column.header}</span>
        ))}
      </div>
      {items.map((item) => {
        const selected = item.id === selectedId
        return (
          <div
            key={item.id}
            role="option"
            aria-selected={selected}
            className={cls('win31-list-row', item.group && 'is-group', selected && 'is-current')}
            style={{ gridTemplateColumns: gridTemplate }}
            onClick={() => onSelect?.(item.id)}
          >
            <span>
              {item.indent
                ? Array.from({ length: item.indent }, (_, index) => <span key={index} className="indent" />)
                : null}
              {item.icon ? <span className="icon" /> : null}
              {item.label}
            </span>
            {columns.slice(1).map((column) => (
              <span key={column.key}>{item.cells?.[column.key] ?? null}</span>
            ))}
          </div>
        )
      })}
    </div>
  )
}

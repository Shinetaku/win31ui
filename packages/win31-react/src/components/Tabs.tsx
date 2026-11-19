import {
  useId,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from 'react'
import { cls } from './Input'

export interface Win31TabItem {
  /** Stable id of the tab; reported through `onChange` and used as the React key. */
  id: string
  /** Caption rendered on the tab button. */
  label: ReactNode
  /** Body rendered inside the panel while this tab is active. */
  content?: ReactNode
}

export interface Win31TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Tabs rendered in order. */
  items: Win31TabItem[]
  /** Active tab id when controlled; omit for uncontrolled use. */
  activeId?: string
  /** Initially active tab id when uncontrolled. Defaults to the first item. */
  defaultActiveId?: string
  /** Called with the new tab id after the active tab changes. */
  onChange?: (id: string) => void
}

/**
 * Windows 3.1 tab strip (`role="tablist"`) plus the active tab's panel below it.
 * ArrowLeft/ArrowRight move focus and activate the neighbouring tab, wrapping
 * at both ends.
 */
export function Win31Tabs({
  items,
  activeId,
  defaultActiveId,
  onChange,
  className,
  onKeyDown,
  ...rest
}: Win31TabsProps) {
  const baseId = useId()
  const [innerId, setInnerId] = useState(defaultActiveId ?? items[0]?.id)
  const currentId = activeId ?? innerId

  function select(id: string) {
    if (activeId === undefined) setInnerId(id)
    onChange?.(id)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    const count = items.length
    const index = items.findIndex(item => item.id === currentId)
    if (count === 0 || index < 0) return
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + delta + count) % count
    const next = items[nextIndex]
    if (!next) return
    select(next.id)
    const tabs = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    tabs[nextIndex]?.focus()
  }

  const activeItem = items.find(item => item.id === currentId)

  return (
    <>
      <div role="tablist" className={cls('win31-tabs', className)} onKeyDown={handleKeyDown} {...rest}>
        {items.map(item => {
          const active = item.id === currentId
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel`}
              tabIndex={active ? 0 : -1}
              className={cls('win31-tab', active ? 'is-active' : '')}
              onClick={() => select(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {activeItem !== undefined ? (
        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${activeItem.id}`}
          className="win31-tabpanel"
        >
          {activeItem.content}
        </div>
      ) : null}
    </>
  )
}

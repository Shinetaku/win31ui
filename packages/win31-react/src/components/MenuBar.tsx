import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode
} from 'react'
import { cls } from './Input'

export type Win31MenuBarProps = HTMLAttributes<HTMLDivElement>

const menuLabels = (bar: HTMLElement | null): Array<HTMLButtonElement> =>
  Array.from(bar?.querySelectorAll<HTMLButtonElement>(':scope > .win31-menu > .win31-menu-label') ?? [])

/**
 * Windows 3.1 menu bar strip: place `Win31Menu` and `Win31MenuLink` children
 * inside. The bar is a single keyboard stop per the ARIA menubar model —
 * `ArrowLeft`/`ArrowRight` move between menu titles (wrapping), `ArrowDown`
 * opens the focused menu, and `Tab` leaves the bar closing every menu.
 */
export function Win31MenuBar({ className, onKeyDown, ...rest }: Win31MenuBarProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Roving tabindex: only the active title is tabbable; arrows move the stop.
  useEffect(() => {
    menuLabels(rootRef.current).forEach((label, index) => {
      label.tabIndex = index === activeIndex ? 0 : -1
    })
  }, [activeIndex])

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    const target = event.target as HTMLElement
    const label = target.closest<HTMLButtonElement>('.win31-menu-label')
    if (!label) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const items = menuLabels(rootRef.current)
      const delta = event.key === 'ArrowRight' ? 1 : -1
      const nextIndex = (items.indexOf(label) + delta + items.length) % items.length
      setActiveIndex(nextIndex)
      items[nextIndex]?.focus({ preventScroll: true })
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      label.click()
    }
  }

  return (
    <div ref={rootRef} role="menubar" className={cls('win31-menubar', className)} onKeyDown={handleKeyDown} {...rest} />
  )
}

const MenuCloseContext = createContext<() => void>(() => {})

export interface Win31MenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Caption rendered on the clickable menu-bar button. */
  label: ReactNode
}

/**
 * Menu on a `Win31MenuBar`: clicking or pressing `Enter`/`ArrowDown` on the
 * label toggles the dropdown. With a menu of the same bar already open,
 * pointing at another title switches to it. The dropdown closes on item
 * selection, Escape, clicks outside, and when focus leaves the menu.
 */
export function Win31Menu({ label, className, children, onKeyDown, onBlur, ...rest }: Win31MenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  // `<u>F</u>ile` renders fine but its computed accessible name splits into
  // "F ile"; expose the plain textContent as the label instead.
  const [accName, setAccName] = useState<string | undefined>(undefined)

  useEffect(() => {
    setAccName(buttonRef.current?.textContent ?? undefined)
  }, [label])

  useEffect(() => {
    if (!open) return
    function handleDocumentMouseDown(event: MouseEvent) {
      const target = event.target as Node
      if (rootRef.current && !rootRef.current.contains(target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleDocumentMouseDown)
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown)
  }, [open])

  function close() {
    setOpen(false)
    buttonRef.current?.focus({ preventScroll: true })
  }

  function toggle() {
    setOpen((value) => !value)
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.key === 'Escape') {
      event.stopPropagation()
      close()
      return
    }
    // ArrowUp/Down walk the dropdown items (skipping disabled ones).
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const dropdown = rootRef.current?.querySelector('.win31-menu-dropdown')
      const items = Array.from(
        dropdown?.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]:not([disabled])') ?? []
      )
      const current = items.indexOf(document.activeElement as HTMLButtonElement)
      if (items.length === 0 || current === items.length - 1 && event.key === 'ArrowDown') return
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      const next = current + delta
      if (next < 0) {
        buttonRef.current?.focus({ preventScroll: true })
        return
      }
      items[Math.min(next, items.length - 1)]?.focus({ preventScroll: true })
    }
  }

  function handleBlur(event: ReactFocusEvent<HTMLDivElement>) {
    onBlur?.(event)
    // Focus leaving the menu (Tab or the bar's arrow movement) closes it.
    if (event.relatedTarget instanceof Node && rootRef.current?.contains(event.relatedTarget)) return
    if (event.relatedTarget === null && rootRef.current?.matches(':focus-within')) return
    setOpen(false)
  }

  function handlePointerEnter() {
    // With another menu of the same bar open, pointing here switches to this one.
    const barRoot = rootRef.current?.parentElement
    const openMenus = Array.from(barRoot?.querySelectorAll('.win31-menu.is-open') ?? [])
    if (openMenus.length === 0) return
    for (const menu of openMenus) {
      if (menu !== rootRef.current) {
        const otherLabel = menu.querySelector<HTMLButtonElement>('.win31-menu-label')
        if (otherLabel) otherLabel.click()
      }
    }
    if (!open) buttonRef.current?.click()
    buttonRef.current?.focus({ preventScroll: true })
  }

  return (
    <div
      ref={rootRef}
      className={cls('win31-menu', open ? 'is-open' : '', className)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onPointerEnter={handlePointerEnter}
      {...rest}
    >
      <button
        ref={buttonRef}
        type="button"
        role="menuitem"
        className="win31-menu-label"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={accName}
        onClick={toggle}
      >
        {label}
      </button>
      {open ? (
        <div className="win31-menu-dropdown" role="menu">
          <MenuCloseContext.Provider value={close}>{children}</MenuCloseContext.Provider>
        </div>
      ) : null}
    </div>
  )
}

export interface Win31MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Called when the item is activated with a click or Enter, before the menu closes. */
  onSelect?: () => void
  /** Shortcut caption rendered right-aligned, e.g. `Ctrl+S`. */
  accel?: string
  /** Shows the leading check mark used for toggle items. */
  checked?: boolean
}

/** Selectable entry of a `Win31Menu` dropdown; choosing it closes the menu. */
export const Win31MenuItem = forwardRef<HTMLButtonElement, Win31MenuItemProps>(
  function Win31MenuItem(
    { onSelect, accel, checked, disabled, className, children, onClick, onKeyDown, ...rest },
    ref
  ) {
    const close = useContext(MenuCloseContext)

    function activate() {
      if (disabled) return
      onSelect?.()
      close()
    }

    function handleClick(event: ReactMouseEvent<HTMLButtonElement>) {
      onClick?.(event)
      activate()
    }

    function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
      onKeyDown?.(event)
      if (event.key === 'Enter') {
        event.preventDefault()
        activate()
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        className={cls('win31-menu-item', checked ? 'win31-menu-check' : '', className)}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
        {accel !== undefined ? <span className="accel">{accel}</span> : null}
      </button>
    )
  }
)

export type Win31MenuSeparatorProps = HTMLAttributes<HTMLHRElement>

/** Horizontal groove separating groups of menu items. */
export function Win31MenuSeparator({ className, ...rest }: Win31MenuSeparatorProps) {
  return <hr role="separator" className={cls('win31-menu-separator', className)} {...rest} />
}

export type Win31MenuLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>

/** Plain hyperlink on the menu bar; no dropdown, styled by `win31-menubar-link`. */
export const Win31MenuLink = forwardRef<HTMLAnchorElement, Win31MenuLinkProps>(
  function Win31MenuLink({ className, ...rest }, ref) {
    return <a ref={ref} className={cls('win31-menubar-link', className)} {...rest} />
  }
)

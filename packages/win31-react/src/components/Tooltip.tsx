import {
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  isValidElement,
  type ClassAttributes,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

/** Props mixed into the single trigger element by {@link Win31Tooltip}. */
type Win31TooltipTriggerProps = ClassAttributes<HTMLElement> & {
  onMouseEnter?: (event: ReactMouseEvent) => void
  onMouseLeave?: (event: ReactMouseEvent) => void
  onFocus?: (event: ReactFocusEvent) => void
  onBlur?: (event: ReactFocusEvent) => void
}

export interface Win31TooltipProps {
  /** Content shown inside the yellow tip box. */
  content: ReactNode
  /** Milliseconds to wait before the tip appears. Defaults to 500. */
  delay?: number
  /** Single element that triggers the tip on hover and keyboard focus. */
  children: ReactElement
}

/** Vertical gap between the trigger and the tip, in pixels. */
const TIP_GAP = 4

/**
 * Windows 3.1 tooltip: yellow `win31-tooltip` box portaled to the body and
 * placed just below the trigger element. Shows on hover/focus, hides on
 * leave/blur; renders nothing while hidden.
 */
export function Win31Tooltip({ content, delay = 500, children }: Win31TooltipProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const timer = useRef<number | undefined>(undefined)
  const triggerRef = useRef<HTMLElement>(null)

  const show = () => {
    window.clearTimeout(timer.current)
    if (delay <= 0) {
      setOpen(true)
      return
    }
    timer.current = window.setTimeout(() => setOpen(true), delay)
  }

  const hide = () => {
    window.clearTimeout(timer.current)
    setOpen(false)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Measure after the tip exists (first painted at 0,0) and place it below
  // the trigger's bounding rect.
  useLayoutEffect(() => {
    if (!open) return
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) setPos({ top: rect.bottom + TIP_GAP, left: rect.left })
  }, [open])

  if (!isValidElement(children)) return null

  const child = children as ReactElement<Win31TooltipTriggerProps>
  const childProps = child.props
  const trigger = cloneElement(child, {
    ref: triggerRef,
    onMouseEnter: (event: ReactMouseEvent) => {
      childProps.onMouseEnter?.(event)
      show()
    },
    onMouseLeave: (event: ReactMouseEvent) => {
      childProps.onMouseLeave?.(event)
      hide()
    },
    onFocus: (event: ReactFocusEvent) => {
      childProps.onFocus?.(event)
      show()
    },
    onBlur: (event: ReactFocusEvent) => {
      childProps.onBlur?.(event)
      hide()
    },
  })

  if (!open || typeof document === 'undefined') return trigger

  return (
    <>
      {trigger}
      {createPortal(
        <div className="win31-tooltip" style={{ position: 'fixed', top: pos.top, left: pos.left }}>
          {content}
        </div>,
        document.body
      )}
    </>
  )
}

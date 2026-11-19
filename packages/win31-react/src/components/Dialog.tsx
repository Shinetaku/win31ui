import { useEffect, useRef, type DialogHTMLAttributes, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cls } from './Input'
import { Win31TitleBar, type Win31WindowControl } from './TitleBar'

export interface Win31DialogProps
  extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onCancel' | 'title'> {
  /** Whether the dialog is currently shown. Renders nothing while false. */
  open: boolean
  /** Called when the dialog requests to close (close control, Esc or backdrop click). */
  onClose?: () => void
  /** Caption shown in the title bar. */
  title?: ReactNode
  /** Action buttons rendered in the bottom `win31-dialog-buttons` row. */
  buttons?: ReactNode
  /** Honors the `Esc` close request. Defaults to true. */
  closeOnEsc?: boolean
  /** Closes when the backdrop is clicked. Defaults to false. */
  closeOnBackdrop?: boolean
  /** Fixed dialog width in pixels, applied as an inline style. */
  width?: number
  children?: ReactNode
}

/**
 * Windows 3.1 modal dialog built on the native `<dialog>` element: opening
 * calls `showModal()`, so the top layer, focus trapping, the `Esc` close
 * request (`cancel` event) and focus restoration are provided by the
 * platform. Styled as the `win31-window.is-dialog` frame with a close-only
 * title bar, a body and an optional bottom button row.
 */
export function Win31Dialog({
  open,
  onClose,
  title,
  buttons,
  closeOnEsc = true,
  closeOnBackdrop = false,
  width,
  className,
  style,
  children,
  ...rest
}: Win31DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Bridge the declarative `open` prop to the imperative modal API.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      // Progressive enhancement: browsers that understand `closedby` also
      // accept light dismiss declaratively; set it before opening.
      if (closeOnBackdrop) dialog.setAttribute('closedby', 'any')
      else dialog.removeAttribute('closedby')
      dialog.showModal()
      dialog.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, closeOnBackdrop])

  if (!open || typeof document === 'undefined') return null

  const handleControl = (control: Win31WindowControl) => {
    if (control === 'close') onClose?.()
  }

  const handleCancel = (event: { preventDefault: () => void }) => {
    // Esc reached the dialog; route it through the controlled state.
    event.preventDefault()
    if (closeOnEsc) onClose?.()
  }

  const handleClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    // With showModal() the event target is the dialog element itself when the
    // click lands on the ::backdrop area outside the content.
    if (closeOnBackdrop && event.target === dialogRef.current) onClose?.()
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : undefined}
      className={cls('win31-window', 'is-dialog', className)}
      style={{ ...(width !== undefined ? { width } : null), ...style }}
      onCancel={handleCancel}
      onClick={handleClick}
      {...rest}
    >
      <Win31TitleBar title={title} controls={['close']} onControl={handleControl} />
      <div className="win31-window-body">{children}</div>
      {buttons != null ? <div className="win31-dialog-buttons">{buttons}</div> : null}
    </dialog>,
    document.body
  )
}

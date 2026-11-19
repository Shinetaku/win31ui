import type { HTMLAttributes, ReactNode } from 'react'
import { cls } from './Input'

export interface Win31DesktopProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Windows 3.1 desktop: an absolutely positioned, full-area layout container
 * that hosts app windows and minimized {@link Win31DesktopIcon}s. Requires
 * the `.win31-desktop` rule in `packages/win31-react/styles.css` (the class
 * does not exist in the tokens stylesheet).
 */
export function Win31Desktop({ className, children, ...rest }: Win31DesktopProps) {
  return (
    <div className={cls('win31-desktop', className)} {...rest}>
      {children}
    </div>
  )
}

export interface Win31DesktopIconProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Image URL of the icon bitmap. */
  icon: string
  /** Caption shown below the bitmap. */
  label: ReactNode
  /** Called when the icon is clicked, i.e. the minimized app is restored. */
  onRestore?: () => void
  /** Renders nothing when false. Defaults to true. */
  visible?: boolean
  /** Horizontal position in pixels; overrides the stylesheet default. */
  x?: number
  /** Vertical position in pixels; overrides the stylesheet default. */
  y?: number
}

/**
 * Windows 3.1 desktop icon representing a minimized app: a bitmap plus a
 * navy caption. Clicking it restores the app via `onRestore`; pass extra
 * handlers such as `onDoubleClick` to open applications.
 */
export function Win31DesktopIcon({
  icon,
  label,
  onRestore,
  visible = true,
  x,
  y,
  ...rest
}: Win31DesktopIconProps) {
  if (!visible) return null
  return (
    <div
      className="win31-desktop-icon"
      style={{
        // tokens default to `display: none` until `body.is-minimized`;
        // visibility is owned by this component instead.
        display: 'flex',
        ...(x !== undefined ? { left: x } : null),
        ...(y !== undefined ? { top: y } : null),
      }}
      onClick={onRestore}
      {...rest}
    >
      <img src={icon} alt="" />
      <span>{label}</span>
    </div>
  )
}

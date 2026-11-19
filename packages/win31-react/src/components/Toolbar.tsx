import type { HTMLAttributes, ReactNode } from 'react'
import { cls } from './Input'

export interface Win31ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional drives icon strip rendered first (bitmap from tokens). */
  showDrives?: boolean
  /** Right-aligned path caption, e.g. `VBSS:\Quality\Onboarding`. */
  path?: ReactNode
  children?: ReactNode
}

/** Toolbar strip below the menu bar: buttons, separators, optional path caption. */
export function Win31Toolbar({ showDrives, path, className, children, ...rest }: Win31ToolbarProps) {
  return (
    <div className={cls('win31-toolbar', className)} {...rest}>
      {showDrives ? <span className="win31-drives" /> : null}
      {children}
      {path !== undefined ? <span className="win31-path">{path}</span> : null}
    </div>
  )
}

/** Vertical groove separating toolbar groups. */
export function Win31ToolbarSeparator(props: HTMLAttributes<HTMLSpanElement>) {
  const { className, ...rest } = props
  return <span className={cls('win31-toolbar-sep', className)} {...rest} />
}

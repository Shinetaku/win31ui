import type { HTMLAttributes, ReactNode } from 'react'
import { cls } from './Input'

export interface Win31FieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Text rendered before the control. */
  label?: ReactNode
  /** Pass the `id` of the labelled control for accessibility. */
  htmlFor?: string
  children?: ReactNode
}

/** Horizontal `label + control` row used by Win31 forms. */
export function Win31Field({ label, htmlFor, className, children, ...rest }: Win31FieldProps) {
  return (
    <div className={cls('win31-field', className)} {...rest}>
      {label !== undefined ? (
        <label className="win31-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {children}
    </div>
  )
}

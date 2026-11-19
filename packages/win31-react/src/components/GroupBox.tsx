import type { FieldsetHTMLAttributes, ReactNode } from 'react'
import { cls } from './Input'

export interface Win31GroupBoxProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Caption rendered in the frame of the group box. */
  legend?: ReactNode
}

/** Windows 3.1 group box: etched fieldset frame with an embedded caption. */
export function Win31GroupBox({ legend, className, children, ...rest }: Win31GroupBoxProps) {
  return (
    <fieldset className={cls('win31-groupbox', className)} {...rest}>
      {legend !== undefined ? <legend>{legend}</legend> : null}
      {children}
    </fieldset>
  )
}

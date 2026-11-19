import { forwardRef, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { cls } from './Input'

export interface Win31CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text rendered after the box; clicking it toggles the checkbox. */
  label?: ReactNode
}

/** Windows 3.1 checkbox: 16px sunken square with a hand-drawn check mark. */
export const Win31Checkbox = forwardRef<HTMLInputElement, Win31CheckboxProps>(
  function Win31Checkbox({ label, className, id, ...rest }, ref) {
    return (
      <span className={cls('win31-check-label', className)}>
        <input ref={ref} id={id} type="checkbox" className="win31-check" {...rest} />
        {label !== undefined ? <label htmlFor={id}>{label}</label> : null}
      </span>
    )
  }
)

export interface Win31RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text rendered after the button; clicking it selects the radio. */
  label?: ReactNode
}

/** Windows 3.1 radio button: 16px sunken circle with a dot when checked. */
export const Win31Radio = forwardRef<HTMLInputElement, Win31RadioProps>(
  function Win31Radio({ label, className, id, ...rest }, ref) {
    return (
      <span className={cls('win31-radio-label', className)}>
        <input ref={ref} id={id} type="radio" className="win31-radio" {...rest} />
        {label !== undefined ? <label htmlFor={id}>{label}</label> : null}
      </span>
    )
  }
)

/** Convenience change handler helper used by form components. */
export function checkedOf(event: ChangeEvent<HTMLInputElement>): boolean {
  return event.target.checked
}

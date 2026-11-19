import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

export type Win31InputProps = InputHTMLAttributes<HTMLInputElement>

/** Windows 3.1 single-line text input: 27px high, sunken bevel. */
export const Win31Input = forwardRef<HTMLInputElement, Win31InputProps>(
  function Win31Input({ className, type = 'text', ...rest }, ref) {
    return <input ref={ref} type={type} className={cls('win31-input', className)} {...rest} />
  }
)

export type Win31TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

/** Windows 3.1 multi-line text area, sunken bevel, resizing disabled. */
export const Win31Textarea = forwardRef<HTMLTextAreaElement, Win31TextareaProps>(
  function Win31Textarea({ className, ...rest }, ref) {
    return <textarea ref={ref} className={cls('win31-textarea', className)} {...rest} />
  }
)

export function cls(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

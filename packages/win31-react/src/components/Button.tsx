import { forwardRef, type ButtonHTMLAttributes } from 'react'

export interface Win31ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Renders the compact 26px-high variant. */
  small?: boolean
  /** Adds the double outline used for the default action button of a dialog. */
  isDefault?: boolean
  /** Keeps the pressed bevel visual. */
  pressed?: boolean
}

/**
 * Windows 3.1 push button: 30px high, 1px black border, raised bevel.
 * All native `type` values pass through; `type` defaults to `'button'`.
 */
export const Win31Button = forwardRef<HTMLButtonElement, Win31ButtonProps>(
  function Win31Button({ small, isDefault, pressed, type = 'button', className, ...rest }, ref) {
    const cls = ['win31-button', small ? 'is-small' : '', isDefault ? 'is-default' : '', pressed ? 'is-pressed' : '', className ?? '']
      .filter(Boolean)
      .join(' ')
    return <button ref={ref} type={type} className={cls} {...rest} />
  }
)

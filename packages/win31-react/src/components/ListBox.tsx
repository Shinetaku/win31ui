import type { HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { cls } from './Input'

export interface Win31ListBoxOption {
  value: string
  label: ReactNode
  /** When true the item cannot be selected by click or keyboard. */
  disabled?: boolean
}

export interface Win31ListBoxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: Array<Win31ListBoxOption>
  /** Currently selected option value; `null` when nothing is selected. */
  value?: string | null
  /** Called with the newly selected option value. */
  onChange?: (value: string) => void
}

/**
 * Windows 3.1 list box: sunken bordered list with highlighted selection.
 * Fully controlled; keyboard support: ArrowUp/ArrowDown move the selection
 * (skipping disabled items), Home/End jump to the first/last enabled item.
 */
export function Win31ListBox({ options, value, onChange, className, onKeyDown, ...rest }: Win31ListBoxProps) {
  const select = (next: string | undefined): void => {
    if (next !== undefined && next !== value) onChange?.(next)
  }

  const step = (delta: 1 | -1): void => {
    const current = options.findIndex((option) => option.value === value)
    let index = current === -1 ? (delta === 1 ? -1 : options.length) : current
    for (;;) {
      index += delta
      const option = options[index]
      if (!option) return
      if (!option.disabled) {
        onChange?.(option.value)
        return
      }
    }
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      step(-1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      select(options.find((option) => !option.disabled)?.value)
    } else if (event.key === 'End') {
      event.preventDefault()
      const enabled = options.filter((option) => !option.disabled)
      select(enabled[enabled.length - 1]?.value)
    }
  }

  return (
    <div className={cls('win31-listbox', className)} role="listbox" tabIndex={0} onKeyDown={handleKeyDown} {...rest}>
      {options.map((option) => (
        <div
          key={option.value}
          role="option"
          aria-selected={option.value === value}
          aria-disabled={option.disabled || undefined}
          className={cls('win31-listbox-item', option.value === value && 'is-selected')}
          onClick={option.disabled ? undefined : () => onChange?.(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  )
}

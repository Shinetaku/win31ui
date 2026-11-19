import { forwardRef, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { cls } from './Input'

export interface Win31NumberFieldProps {
  /** Current numeric value (controlled). */
  value: number
  min?: number
  max?: number
  /** Increment used by the spinner buttons and arrow keys. Defaults to 1. */
  step?: number
  onChange?: (value: number) => void
  disabled?: boolean
  id?: string
  'aria-label'?: string
  className?: string
}

/**
 * Windows 3.1 spinner: sunken numeric input with up/down micro buttons.
 * Typing is buffered locally; invalid text is tolerated while typing and
 * clamped back to the last valid value on blur or arrow-key commit.
 */
export const Win31NumberField = forwardRef<HTMLInputElement, Win31NumberFieldProps>(
  function Win31NumberField(
    { value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY, step = 1, onChange, disabled, id, 'aria-label': ariaLabel, className },
    ref
  ) {
    const [text, setText] = useState(() => String(value))
    const lastProp = useRef(value)

    useEffect(() => {
      if (value !== lastProp.current) {
        setText(String(value))
        lastProp.current = value
      }
    }, [value])

    const clamp = (next: number) => Math.min(Math.max(next, min), max)

    const commit = (parsed: number) => {
      const clamped = clamp(parsed)
      setText(String(clamped))
      onChange?.(clamped)
    }

    const onInput = (raw: string) => {
      setText(raw)
      const parsed = Number(raw)
      if (raw.trim() !== '' && Number.isFinite(parsed)) {
        onChange?.(clamp(parsed))
      }
    }

    const bump = (delta: number, event?: ReactKeyboardEvent) => {
      event?.preventDefault()
      commit((Number.isFinite(Number(text)) ? Number(text) : value) + delta)
    }

    return (
      <span className={cls('win31-spin', className)}>
        <input
          ref={ref}
          id={id}
          type="text"
          inputMode="numeric"
          role="spinbutton"
          aria-label={ariaLabel}
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-valuenow={value}
          disabled={disabled}
          className="win31-input"
          value={text}
          onChange={(event) => onInput(event.target.value)}
          onBlur={() => {
            const parsed = Number(text)
            commit(Number.isFinite(parsed) ? parsed : value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp') bump(step, event)
            else if (event.key === 'ArrowDown') bump(-step, event)
          }}
        />
        <span className="win31-spin-buttons">
          <button type="button" className="win31-spin-btn up" aria-label="increment" disabled={disabled} onClick={() => bump(step)} />
          <button type="button" className="win31-spin-btn down" aria-label="decrement" disabled={disabled} onClick={() => bump(-step)} />
        </span>
      </span>
    )
  }
)

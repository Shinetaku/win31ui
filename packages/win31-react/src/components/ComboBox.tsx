import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cls } from './Input'

export interface Win31ComboBoxOption {
  value: string
  label: ReactNode
}

export interface Win31ComboBoxProps {
  options: Array<Win31ComboBoxOption>
  /** Called with the chosen option value when an item in the list is picked. */
  onChange?: (value: string) => void
  /** Value of the option pre-selected on first render; also seeds the input text. */
  value?: string | null
  /** Accessible name of the input and of the dropdown list. */
  'aria-label'?: string
  /** Extra class merged onto the root `win31-combo` span. */
  className?: string
}

/**
 * Windows 3.1 combo box: editable input with a dropdown arrow button. Typing
 * filters the options by label or value (case-insensitive); picking an option
 * fills the input, fires `onChange` and closes the list. Esc and outside
 * clicks close the list.
 */
export function Win31ComboBox({ options, onChange, value, className, 'aria-label': ariaLabel }: Win31ComboBoxProps) {
  const labelOf = (option: Win31ComboBoxOption | undefined): string => {
    if (!option) return ''
    return typeof option.label === 'string' ? option.label : option.value
  }

  const rootRef = useRef<HTMLSpanElement | null>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(() => labelOf(options.find((option) => option.value === value)))

  const needle = query.toLowerCase()
  const filtered = options.filter((option) => {
    const label = typeof option.label === 'string' ? option.label.toLowerCase() : ''
    return label.includes(needle) || option.value.toLowerCase().includes(needle)
  })

  useEffect(() => {
    if (!open) return
    const onDocMouseDown = (event: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  return (
    <span ref={rootRef} className={cls('win31-combo', className)}>
      <input
        className="win31-input"
        role="combobox"
        aria-expanded={open}
        aria-label={ariaLabel}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
        }}
      />
      <button type="button" className="win31-combo-btn" aria-label="Toggle list" onClick={() => setOpen((current) => !current)} />
      {open ? (
        <div className="win31-listbox" role="listbox" aria-label={ariaLabel}>
          {filtered.map((option) => (
            <div
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={cls('win31-listbox-item', option.value === value && 'is-selected')}
              onClick={() => {
                onChange?.(option.value)
                setQuery(labelOf(option))
                setOpen(false)
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      ) : null}
    </span>
  )
}

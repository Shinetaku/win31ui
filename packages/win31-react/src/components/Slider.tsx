import { useCallback, useRef, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { cls } from './Input'

export interface Win31SliderProps {
  /** Current value (controlled). */
  value: number
  min?: number
  max?: number
  /** Increment used by pointer steps and arrow keys. Defaults to 1. */
  step?: number
  onChange?: (value: number) => void
  /** Accessible label. */
  'aria-label'?: string
  disabled?: boolean
  className?: string
}

/**
 * Windows 3.1 slider: sunken groove, raised thumb and tick marks.
 * Supports pointer dragging plus Arrow/Home/End keys. Fully controlled.
 */
export function Win31Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  'aria-label': ariaLabel,
  disabled,
  className
}: Win31SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const span = Math.max(max - min, step)

  const clamp = useCallback((next: number) => Math.min(Math.max(next, min), max), [min, max])

  const ratio = span > 0 ? (value - min) / span : 0
  // 10px side insets + 12px thumb width, matching the tokens stylesheet.
  const thumbLeft = `calc(10px + ${ratio.toFixed(4)} * (100% - 32px))`

  const valueFromPointer = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect || rect.width <= 32) return value
      const usable = rect.width - 32
      const x = Math.min(Math.max(clientX - rect.left - 10 - 6, 0), usable)
      return clamp(min + (x / usable) * span)
    },
    [clamp, min, span, value]
  )

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return
    event.currentTarget.setPointerCapture(event.pointerId)
    onChange?.(Math.round(valueFromPointer(event.clientX) / step) * step)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || !event.currentTarget.hasPointerCapture(event.pointerId)) return
    onChange?.(Math.round(valueFromPointer(event.clientX) / step) * step)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const jump = { ArrowLeft: -step, ArrowRight: step, PageDown: -step * 10, PageUp: step * 10 } as const
    if (event.key in jump) {
      const delta = jump[event.key as keyof typeof jump]
      event.preventDefault()
      onChange?.(clamp(value + delta))
    } else if (event.key === 'Home') {
      event.preventDefault()
      onChange?.(min)
    } else if (event.key === 'End') {
      event.preventDefault()
      onChange?.(max)
    }
  }

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? undefined : 0}
      className={cls('win31-slider', className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
    >
      <div className="win31-slider-track" />
      <div className="win31-slider-ticks" />
      <div className="win31-slider-thumb" style={{ left: thumbLeft }} />
    </div>
  )
}

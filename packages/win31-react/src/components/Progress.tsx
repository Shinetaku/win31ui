import { forwardRef, type HTMLAttributes } from 'react'
import { cls } from './Input'

export interface Win31ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value between `min` (default 0) and `max`. */
  value: number
  /** Upper bound of the range. Defaults to 100. */
  max?: number
  /** Lower bound of the range. Defaults to 0. */
  min?: number
  /** Show `xx%` caption after the bar. */
  showLabel?: boolean
}

/** Windows 3.1 progress bar: sunken well with striped blue blocks. */
export const Win31ProgressBar = forwardRef<HTMLDivElement, Win31ProgressBarProps>(
  function Win31ProgressBar({ value, max = 100, min = 0, showLabel, className, ...rest }, ref) {
    const span = Math.max(max - min, 1)
    const clamped = Math.min(Math.max(value, min), max)
    const percent = Math.round(((clamped - min) / span) * 100)
    return (
      <span className={className}>
        <div
          ref={ref}
          role="progressbar"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={clamped}
          className="win31-progress"
          {...rest}
        >
          <div className="win31-progress-bar" style={{ width: `${percent}%` }} />
        </div>
        {showLabel ? <span className="win31-progress-label">{percent}%</span> : null}
      </span>
    )
  }
)

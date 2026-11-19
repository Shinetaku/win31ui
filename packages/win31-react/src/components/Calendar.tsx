import { useState, type HTMLAttributes } from 'react'
import { cls } from './Input'

export interface Win31CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Selected date in `yyyy-mm-dd` format (controlled). */
  value?: string
  /** Called with the selected `yyyy-mm-dd` when a day is clicked. */
  onChange?: (date: string) => void
  /** Visible month in `yyyy-mm` format (controlled). */
  month?: string
  /** Initially visible month (`yyyy-mm`) when uncontrolled. Defaults to today. */
  defaultMonth?: string
  /** First day of week: `0` = Sunday (default), `1` = Monday. */
  weekStart?: 0 | 1
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const

/**
 * Windows 3.1 Calendar month view: weekday header, day grid and month
 * navigation (`<` / `>`). Days render as buttons; the selected day is
 * highlighted with the selection colors and today is outlined.
 */
export function Win31Calendar({
  value,
  onChange,
  month,
  defaultMonth,
  weekStart = 0,
  className,
  ...rest
}: Win31CalendarProps) {
  const [innerMonth, setInnerMonth] = useState(() => defaultMonth ?? currentMonth())
  const viewMonth = month ?? innerMonth

  const [year, weekDayOrder] = parseMonth(viewMonth)
  const firstWeekday = (new Date(year, weekDayOrder, 1).getDay() - weekStart + 7) % 7
  const daysInMonth = new Date(year, weekDayOrder + 1, 0).getDate()
  const todayIso = toIso(new Date())

  const order = Array.from({ length: 7 }, (_, i) => (i + weekStart) % 7)

  const shiftMonth = (delta: number) => {
    const next = new Date(year, weekDayOrder + delta, 1)
    const nextMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`
    if (month === undefined) setInnerMonth(nextMonth)
  }

  return (
    <div className={cls('win31-calendar', className)} {...rest}>
      <div className="win31-calendar-header">
        <button
          type="button"
          className="win31-button is-small"
          aria-label="previous month"
          onClick={() => shiftMonth(-1)}
        >
          &lt;
        </button>
        <span className="win31-calendar-month">
          {new Date(year, weekDayOrder, 1).toLocaleString('en-US', { month: 'long' })} {year}
        </span>
        <button
          type="button"
          className="win31-button is-small"
          aria-label="next month"
          onClick={() => shiftMonth(1)}
        >
          &gt;
        </button>
      </div>
      <div className="win31-calendar-grid" role="grid">
        <div className="win31-calendar-row" role="row">
          {order.map((index) => (
            <span key={index} className="win31-calendar-weekday" role="columnheader">
              {WEEKDAYS[index]}
            </span>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, week) => (
          <div key={week} className="win31-calendar-row" role="row">
            {Array.from({ length: 7 }, (_, day) => {
              const dayNumber = week * 7 + day - firstWeekday + 1
              const valid = dayNumber >= 1 && dayNumber <= daysInMonth
              if (!valid) {
                return (
                  <span key={day} className="win31-calendar-day is-empty" role="gridcell" />
                )
              }
              const iso = `${viewMonth}-${String(dayNumber).padStart(2, '0')}`
              const selected = value === iso
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={selected}
                  aria-label={iso}
                  className={cls(
                    'win31-calendar-day',
                    selected && 'is-selected',
                    iso === todayIso && 'is-today'
                  )}
                  onClick={() => onChange?.(iso)}
                >
                  {dayNumber}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function parseMonth(month: string): [number, number] {
  const [yearRaw, monthRaw] = month.split('-').map((part) => Number(part))
  const year = yearRaw ?? new Date().getFullYear()
  const parsed = monthRaw ?? 1
  return [year, Math.min(Math.max(parsed, 1), 12) - 1]
}

function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

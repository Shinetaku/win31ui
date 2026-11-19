import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Win31Calendar } from '../components/Calendar'

describe('Win31Calendar', () => {
  it('renders the month header and weekday row', () => {
    render(<Win31Calendar month="2026-11" value="2026-11-19" />)
    expect(screen.getByText('November 2026')).not.toBeNull()
    for (const weekday of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) {
      expect(screen.getByText(weekday)).not.toBeNull()
    }
  })

  it('selects a day and reports the ISO date', () => {
    const onChange = vi.fn()
    render(<Win31Calendar month="2026-11" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: '2026-11-19' }))
    expect(onChange).toHaveBeenCalledWith('2026-11-19')
  })

  it('highlights the controlled selected date', () => {
    render(<Win31Calendar month="2026-11" value="2026-11-05" />)
    const day = screen.getByRole('button', { name: '2026-11-05' })
    expect(day).toHaveClass('is-selected')
    expect(day).toHaveAttribute('aria-pressed', 'true')
  })

  it('navigates months with the header buttons', () => {
    render(<Win31Calendar defaultMonth="2026-11" />)
    fireEvent.click(screen.getByRole('button', { name: 'next month' }))
    expect(screen.getByText('December 2026')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'previous month' }))
    fireEvent.click(screen.getByRole('button', { name: 'previous month' }))
    expect(screen.getByText('October 2026')).not.toBeNull()
  })

  it('keeps the controlled month fixed when the month prop is set', () => {
    render(<Win31Calendar month="2026-11" />)
    fireEvent.click(screen.getByRole('button', { name: 'next month' }))
    expect(screen.getByText('November 2026')).not.toBeNull()
  })

  it('supports Monday week start', () => {
    render(<Win31Calendar month="2026-11" weekStart={1} />)
    const weekdays = document.querySelectorAll('.win31-calendar-weekday')
    expect(weekdays[0]?.textContent).toBe('Mo')
    expect(weekdays[6]?.textContent).toBe('Su')
  })

  it('renders empty cells for leading gaps', () => {
    // 2026-11 starts on Sunday with weekStart=0, so no leading gap; use a month
    // that starts mid-week instead.
    render(<Win31Calendar month="2026-12" />)
    expect(document.querySelectorAll('.win31-calendar-day.is-empty').length).toBeGreaterThan(0)
  })
})

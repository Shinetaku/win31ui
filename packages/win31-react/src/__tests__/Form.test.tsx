import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Win31Checkbox, Win31Radio } from '../components/Checkbox'
import { Win31NumberField } from '../components/NumberField'
import { Win31ProgressBar } from '../components/Progress'
import { Win31Slider } from '../components/Slider'

function HarnessCheckbox({ onChange }: { onChange?: (checked: boolean) => void }) {
  const [checked, setChecked] = useState(false)
  return (
    <Win31Checkbox
      id="c1"
      label="Enable"
      checked={checked}
      onChange={(event) => {
        setChecked(event.target.checked)
        onChange?.(event.target.checked)
      }}
    />
  )
}

describe('Win31Checkbox', () => {
  it('renders label association and toggles controlled state', () => {
    const onChange = vi.fn()
    render(<HarnessCheckbox onChange={onChange} />)
    const input = screen.getByLabelText('Enable')
    expect(input).toHaveClass('win31-check')
    fireEvent.click(input)
    expect(input).toBeChecked()
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('renders without a label', () => {
    render(<Win31Checkbox aria-label="bare" />)
    expect(screen.getByRole('checkbox', { name: 'bare' })).not.toBeNull()
  })
})

describe('Win31Radio', () => {
  it('joins a radio group by name', () => {
    render(
      <form>
        <Win31Radio id="r1" name="size" label="Small" value="s" defaultChecked />
        <Win31Radio id="r2" name="size" label="Large" value="l" />
      </form>
    )
    const small = screen.getByLabelText('Small')
    const large = screen.getByLabelText('Large')
    expect(small).toBeChecked()
    fireEvent.click(large)
    expect(large).toBeChecked()
    expect(small).not.toBeChecked()
  })
})

describe('Win31ProgressBar', () => {
  it('maps value to striped bar width and aria values', () => {
    render(<Win31ProgressBar value={30} showLabel />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveClass('win31-progress')
    expect(bar).toHaveAttribute('aria-valuenow', '30')
    expect(document.querySelector<HTMLElement>('.win31-progress-bar')?.style.width).toBe('30%')
    expect(screen.getByText('30%')).not.toBeNull()
  })

  it('clamps out-of-range values', () => {
    render(<Win31ProgressBar value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(document.querySelector<HTMLElement>('.win31-progress-bar')?.style.width).toBe('100%')
  })

  it('supports custom ranges', () => {
    render(<Win31ProgressBar value={5} min={0} max={10} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '5')
    expect(document.querySelector<HTMLElement>('.win31-progress-bar')?.style.width).toBe('50%')
  })
})

describe('Win31Slider', () => {
  it('positions the thumb by ratio and exposes aria values', () => {
    render(<Win31Slider value={50} aria-label="volume" />)
    const slider = screen.getByRole('slider', { name: 'volume' })
    expect(slider).toHaveClass('win31-slider')
    expect(slider).toHaveAttribute('aria-valuenow', '50')
    const thumb = document.querySelector<HTMLElement>('.win31-slider-thumb')
    expect(thumb?.style.left).toContain('0.5')
  })

  it('changes value with arrow keys', () => {
    const onChange = vi.fn()
    render(<Win31Slider value={10} onChange={onChange} aria-label="s" />)
    const slider = screen.getByRole('slider', { name: 's' })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith(11)
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(onChange).toHaveBeenLastCalledWith(0)
    fireEvent.keyDown(slider, { key: 'End' })
    expect(onChange).toHaveBeenLastCalledWith(100)
    fireEvent.keyDown(slider, { key: 'PageUp' })
    // PageUp/PageDown jump by step * 10 (step=1 → +10 from the current value).
    expect(onChange).toHaveBeenLastCalledWith(20)
  })

  it('steps from pointer down position using jsdom rect math', () => {
    const onChange = vi.fn()
    render(<Win31Slider value={0} min={0} max={100} onChange={onChange} aria-label="s2" />)
    const slider = screen.getByRole('slider', { name: 's2' })
    // jsdom rect is all zeros → usable width <= 32 → pointer keeps the value.
    fireEvent.pointerDown(slider, { pointerId: 1, button: 0, clientX: 5 })
    expect(onChange).toHaveBeenCalledWith(0)
  })
})

describe('Win31NumberField', () => {
  function HarnessNumberField(props: {
    initialValue: number
    min?: number
    max?: number
    step?: number
    onChange?: (value: number) => void
    label: string
  }) {
    const [value, setValue] = useState(props.initialValue)
    return (
      <Win31NumberField
        value={value}
        min={props.min}
        max={props.max}
        step={props.step}
        aria-label={props.label}
        onChange={(next) => {
          setValue(next)
          props.onChange?.(next)
        }}
      />
    )
  }

  it('renders spin buttons and bumps by step', () => {
    const onChange = vi.fn()
    render(<HarnessNumberField initialValue={5} onChange={onChange} label="count" />)
    fireEvent.click(screen.getByRole('button', { name: 'increment' }))
    expect(onChange).toHaveBeenLastCalledWith(6)
    fireEvent.click(screen.getByRole('button', { name: 'decrement' }))
    // Decrements start from the current controlled value (6), not the initial one.
    expect(onChange).toHaveBeenLastCalledWith(5)
  })

  it('clamps bumped values to min/max', () => {
    const onChange = vi.fn()
    render(
      <HarnessNumberField initialValue={2} min={1} max={3} step={5} onChange={onChange} label="count2" />
    )
    fireEvent.click(screen.getByRole('button', { name: 'increment' }))
    expect(onChange).toHaveBeenLastCalledWith(3)
    fireEvent.click(screen.getByRole('button', { name: 'decrement' }))
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('commits typed numbers and clamps on blur', () => {
    const onChange = vi.fn()
    render(<HarnessNumberField initialValue={10} min={1} max={20} onChange={onChange} label="count3" />)
    const input = screen.getByRole('spinbutton', { name: 'count3' })
    fireEvent.change(input, { target: { value: '15' } })
    expect(onChange).toHaveBeenLastCalledWith(15)
    fireEvent.change(input, { target: { value: '999' } })
    expect(onChange).toHaveBeenLastCalledWith(20)
    fireEvent.blur(input)
    expect(input).toHaveValue('20')
  })

  it('bumps with arrow keys', () => {
    const onChange = vi.fn()
    render(<HarnessNumberField initialValue={0} onChange={onChange} label="count4" />)
    const input = screen.getByRole('spinbutton', { name: 'count4' })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(onChange).toHaveBeenLastCalledWith(1)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(onChange).toHaveBeenLastCalledWith(0)
  })

  it('tolerates non-numeric text while typing and restores on blur', () => {
    const onChange = vi.fn()
    render(<HarnessNumberField initialValue={7} onChange={onChange} label="count5" />)
    const input = screen.getByRole('spinbutton', { name: 'count5' })
    fireEvent.change(input, { target: { value: 'abc' } })
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.blur(input)
    expect(input).toHaveValue('7')
  })
})

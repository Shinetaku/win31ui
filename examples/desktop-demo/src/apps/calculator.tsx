import { useState, type CSSProperties } from 'react'
import {
  Win31Button,
  Win31Input,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuLink,
  Win31MessageBox
} from '@win31ui/react'

interface CalculatorAppProps {
  onClose: () => void
}

type Operator = '+' | '-' | '*' | '/'

/** Keypad rows: five operator columns plus the memory column at the right. */
const KEYPAD_ROWS: ReadonlyArray<ReadonlyArray<string>> = [
  ['7', '8', '9', '/', 'sqrt', 'MS'],
  ['4', '5', '6', '*', '%', 'MR'],
  ['1', '2', '3', '-', '1/x', 'M+'],
  ['0', '+/-', '.', '+', '=']
]

const digitKeyStyle: CSSProperties = {
  gridColumn: 'span 1',
  padding: '2px 0'
}

const spanStyle: CSSProperties = { gridColumn: 'span 2', padding: '2px 0' }

function formatNumber(value: number): string {
  const rounded = Math.round(value * 1e10) / 1e10
  return String(rounded)
}

/** Calculator replica: Win3.1 layout with digit pad, unary ops and memory keys. */
export function CalculatorApp({ onClose }: CalculatorAppProps) {
  const [display, setDisplay] = useState('0')
  const [accumulator, setAccumulator] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [waiting, setWaiting] = useState(true)
  const [memory, setMemory] = useState<number | null>(null)
  const [error, setError] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const currentValue = () => Number(display)

  const show = (value: number) => {
    setDisplay(formatNumber(value))
    setWaiting(true)
    setError(false)
  }

  const showError = (message: string) => {
    setDisplay(message)
    setError(true)
    setWaiting(true)
  }

  const inputDigit = (digit: string) => {
    if (error) return
    if (waiting) {
      setDisplay(digit)
      setWaiting(false)
      return
    }
    setDisplay((current) => (current === '0' ? digit : current + digit))
  }

  const inputDecimal = () => {
    if (error) return
    if (waiting) {
      setDisplay('0.')
      setWaiting(false)
      return
    }
    setDisplay((current) => (current.includes('.') ? current : `${current}.`))
  }

  const applyOperator = (left: number, right: number, op: Operator): number => {
    if (op === '+') return left + right
    if (op === '-') return left - right
    if (op === '*') return left * right
    if (right === 0) return Number.NaN
    return left / right
  }

  const chooseOperator = (op: Operator) => {
    if (error) return
    const value = currentValue()
    if (accumulator !== null && operator !== null && !waiting) {
      const result = applyOperator(accumulator, value, operator)
      setAccumulator(result)
      setDisplay(formatNumber(result))
    } else {
      setAccumulator(value)
    }
    setOperator(op)
    setWaiting(true)
  }

  const equals = () => {
    if (error || accumulator === null || operator === null) return
    const result = applyOperator(accumulator, currentValue(), operator)
    if (Number.isNaN(result) || !Number.isFinite(result)) {
      setAccumulator(null)
      setOperator(null)
      showError('Cannot divide by zero')
      return
    }
    setAccumulator(null)
    setOperator(null)
    show(result)
  }

  const clearAll = () => {
    setDisplay('0')
    setAccumulator(null)
    setOperator(null)
    setWaiting(true)
    setError(false)
  }

  const clearEntry = () => {
    setDisplay('0')
    setWaiting(true)
    setError(false)
  }

  const backspace = () => {
    if (error || waiting) return
    setDisplay((current) => (current.length <= 1 || (current.length === 2 && current.startsWith('-')) ? '0' : current.slice(0, -1)))
  }

  const unary = (kind: 'sqrt' | '1/x' | '+/-') => {
    if (error) return
    const value = currentValue()
    if (kind === 'sqrt') show(Math.sqrt(value))
    else if (kind === '1/x') {
      if (value === 0) showError('Cannot divide by zero')
      else show(1 / value)
    } else {
      if (waiting) setDisplay((current) => formatNumber(-Number(current)))
      else setDisplay((current) => (current.startsWith('-') ? current.slice(1) : `-${current}`))
    }
  }

  const percent = () => {
    if (error) return
    show(currentValue() / 100)
  }

  const memoryAction = (kind: 'MC' | 'MR' | 'MS' | 'M+') => {
    if (kind === 'MC') setMemory(null)
    else if (kind === 'MR') {
      if (memory !== null) show(memory)
    } else if (kind === 'MS') setMemory(currentValue())
    else setMemory((current) => (current ?? 0) + currentValue())
  }

  const press = (key: string) => {
    if (key === 'MC' || key === 'MR' || key === 'MS' || key === 'M+') memoryAction(key)
    else if (key === '=') equals()
    else if (key === 'C') clearAll()
    else if (key === 'CE') clearEntry()
    else if (key === 'Back') backspace()
    else if (key === 'sqrt' || key === '1/x' || key === '+/-') unary(key)
    else if (key === '%') percent()
    else if (key === '.') inputDecimal()
    else if (key === '+' || key === '-' || key === '*' || key === '/') chooseOperator(key)
    else inputDigit(key)
  }

  const memoryLabel = memory !== null ? 'M' : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>E</u>dit</>}>
          <Win31MenuItem disabled>Copy</Win31MenuItem>
          <Win31MenuItem disabled>Paste</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>V</u>iew</>}>
          <Win31MenuItem checked onSelect={() => undefined}>Basic</Win31MenuItem>
          <Win31MenuItem disabled>Scientific</Win31MenuItem>
        </Win31Menu>
        <Win31MenuLink
          href="#about-calculator"
          onClick={(event) => {
            event.preventDefault()
            setAboutOpen(true)
          }}
        >
          <u>H</u>elp
        </Win31MenuLink>
      </Win31MenuBar>

      <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
        <Win31Input
          aria-label="calculator display"
          value={`${memoryLabel}${display}`}
          readOnly
          style={{ textAlign: 'right', fontFamily: 'var(--win31-font-mono)' }}
        />
        <div
          role="group"
          aria-label="calculator keypad"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 4,
            flex: 1,
            minHeight: 0,
            gridAutoRows: '1fr'
          }}
        >
          <Win31Button small style={spanStyle} onClick={() => press('Back')}>Back</Win31Button>
          <Win31Button small style={spanStyle} onClick={() => press('CE')}>CE</Win31Button>
          <Win31Button small style={digitKeyStyle} onClick={() => press('C')}>C</Win31Button>
          <Win31Button small style={digitKeyStyle} onClick={() => memoryAction('MC')}>MC</Win31Button>

          {KEYPAD_ROWS.map((row) =>
            row.map((key) => (
              <Win31Button key={key} small style={digitKeyStyle} onClick={() => press(key)}>
                {key === 'sqrt' ? '√' : key}
              </Win31Button>
            ))
          )}
        </div>
      </div>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="Calculator — win31ui replica"
        detail="Basic arithmetic, unary ops and memory keys on a CSS grid keypad."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

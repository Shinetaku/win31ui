import { useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Win31Input, Win31Menu, Win31MenuBar, Win31MenuItem, Win31MessageBox } from '@win31ui/react'
import type { AppWindowProps } from '../apps'

const BANNER = [
  '=====================',
  '  T E R M I N A L  ',
  '=====================',
  '',
  'Terminal emulation is not implemented in this demo.',
  'Type EXIT and press Enter to close.',
  ''
]

const TERMINAL_CONTENT_STYLE = {
  background: '#000000',
  color: '#ffffff',
  fontFamily: 'var(--win31-font-mono)',
  fontSize: 13,
  padding: 12
} as const

/** Terminal replica: black-screen stub that closes on EXIT and echoes unknown commands. */
export function TerminalApp({ onClose }: AppWindowProps) {
  const [lines, setLines] = useState<ReadonlyArray<string>>([])
  const [input, setInput] = useState('')
  const [aboutOpen, setAboutOpen] = useState(false)

  const handleSubmit = (): void => {
    const command = input.trim().toLowerCase()
    setInput('')
    if (command === 'exit' || command === 'quit') {
      onClose()
      return
    }
    setLines((current) => [...current, `Unknown command: ${input.trim()}`])
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem accel="Alt+F4" onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setAboutOpen(true)}>About Terminal...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...TERMINAL_CONTENT_STYLE, flex: 1, minHeight: 0, whiteSpace: 'pre-wrap' }}>
          {BANNER.join('\n')}
          {lines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        <div style={{ ...TERMINAL_CONTENT_STYLE, display: 'flex' }}>
          <span style={{ whiteSpace: 'pre' }}>{'C:\\> '}</span>
          <Win31Input
            aria-label="terminal command"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, background: '#000000', color: '#ffffff', border: 'none', fontFamily: 'var(--win31-font-mono)' }}
          />
        </div>
      </div>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="win31ui Terminal"
        detail="Terminal emulation stub for the demo."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

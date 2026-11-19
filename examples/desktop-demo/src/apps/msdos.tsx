import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import {
  Win31Input,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem
} from '@win31ui/react'
import { driveTree, findDir } from '../fs'
import type { AppWindowProps } from '../apps'

interface TerminalLine {
  id: number
  text: string
}

const PROMPT = 'C:\\VBSS>'

const BOOT_LINES = [
  'Microsoft(R) MS-DOS(R) Version 6.22',
  '        (C)Copyright Microsoft Corp 1981-1993.',
  '',
  'Type HELP for a list of supported commands.',
  ''
]

const HELP_LINES = [
  'DIR      Lists the files in C:\\VBSS.',
  'CLS      Clears the screen.',
  'HELP     Shows this command list.',
  'VER      Shows the Windows version.',
  'EXIT     Closes the MS-DOS Prompt.'
]

const terminalStyle = {
  background: '#000',
  color: '#fff',
  fontFamily: 'var(--win31-font-mono)',
  fontSize: 14,
  lineHeight: 1.4
} as const

/** Builds the fake DIR output for C:\VBSS from the simulated file system. */
function dirListing(): Array<string> {
  const dir = findDir(driveTree, 'vbss')
  if (!dir) return ['File not found']
  const lines = [' Volume in drive C is VBSS', ' Directory of C:\\VBSS', '']
  let total = 0
  for (const file of dir.files) {
    total += file.size
    lines.push(`${file.name.padEnd(16)}${String(file.size).padStart(9)}  ${file.modified}  ${file.time}`)
  }
  lines.push(
    '',
    `        ${dir.files.length} file(s)   ${total.toLocaleString('en-US')} bytes`
  )
  return lines
}

/** MS-DOS Prompt replica: fake terminal with dir / cls / help / ver / exit. */
export function MsDosApp({ onClose }: AppWindowProps) {
  const [lines, setLines] = useState<Array<TerminalLine>>(() =>
    BOOT_LINES.map((text, index) => ({ id: index, text }))
  )
  const [command, setCommand] = useState('')
  const seq = useRef(BOOT_LINES.length)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [lines])

  const pushLines = (texts: Array<string>) => {
    setLines((current) => [...current, ...texts.map((text) => ({ id: seq.current++, text }))])
  }

  const run = (rawInput: string) => {
    const name = rawInput.trim().toLowerCase().split(/\s+/)[0]
    if (name === undefined || name === '') {
      pushLines([PROMPT + rawInput])
    } else if (name === 'cls') {
      setLines([])
    } else if (name === 'exit') {
      onClose()
      return
    } else if (name === 'dir') {
      pushLines([PROMPT + rawInput, ...dirListing()])
    } else if (name === 'ver') {
      pushLines([PROMPT + rawInput, '', 'Windows 3.1 (win31ui demo)'])
    } else if (name === 'help') {
      pushLines([PROMPT + rawInput, ...HELP_LINES])
    } else {
      pushLines([PROMPT + rawInput, 'Bad command or file name'])
    }
    setCommand('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') run(command)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => pushLines([PROMPT, ...HELP_LINES])}>
            Command <u>R</u>eference
          </Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <div ref={scrollRef} style={{ ...terminalStyle, flex: 1, minHeight: 0, overflow: 'auto', padding: '6px 8px' }}>
        {lines.map((line) => (
          <div key={line.id}>{line.text.length > 0 ? line.text : '\u00A0'}</div>
        ))}
      </div>

      <div style={{ ...terminalStyle, display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px 8px' }}>
        <span>{PROMPT}</span>
        <Win31Input
          aria-label="MS-DOS command"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={onKeyDown}
          style={{ ...terminalStyle, flex: 1, border: 'none', boxShadow: 'none' }}
        />
      </div>
    </div>
  )
}

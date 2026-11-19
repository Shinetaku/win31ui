import { useState, type KeyboardEvent } from 'react'
import {
  Win31Button,
  Win31ComboBox,
  Win31Dialog,
  Win31Field,
  Win31Input,
  Win31MenuBar,
  Win31Menu,
  Win31MenuLink,
  Win31MenuItem,
  Win31MenuSeparator,
  Win31MessageBox,
  Win31NumberField,
  Win31StatusBar,
  Win31StatusPane,
  Win31Textarea,
  Win31Toolbar,
  Win31ToolbarSeparator
} from '@win31ui/react'

interface WriteAppProps {
  onClose: () => void
}

const fonts = [
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Fixedsys', label: 'Fixedsys' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Arial', label: 'Arial' },
  { value: 'SimSun', label: 'SimSun' }
]

type Alignment = 'left' | 'center' | 'right'

const alignGlyph: Record<Alignment, string> = { left: '⯇', center: '≡', right: '⯈' }

/** Write (word processor) replica: font toolbar, ruler, page, caret status. */
export function WriteApp({ onClose }: WriteAppProps) {
  const [text, setText] = useState(
    'Write your quality-inspection notes here.\r\n\r\nThis editor is powered by @win31ui/react.'
  )
  const [font, setFont] = useState('Times New Roman')
  const [fontSize, setFontSize] = useState(16)
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [align, setAlign] = useState<Alignment>('left')
  const [wordWrap, setWordWrap] = useState(true)
  const [caret, setCaret] = useState({ line: 1, column: 1 })
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [printOpen, setPrintOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const updateCaret = (element: HTMLTextAreaElement) => {
    const upto = element.value.slice(0, element.selectionStart)
    const lines = upto.split('\n')
    setCaret({ line: lines.length, column: (lines[lines.length - 1]?.length ?? 0) + 1 })
  }

  const insertTimestamp = () => {
    const stamp = new Date().toLocaleString()
    setText((current) => `${current}\r\n[${stamp}]`)
  }

  const findNext = () => {
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase())
    if (searchTerm && index >= 0) {
      setText((current) => `${current}\r\n↑ found "${searchTerm}" at character ${index + 1}`)
    }
    setSearchOpen(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'F5') {
      event.preventDefault()
      insertTimestamp()
    }
  }

  const words = text.split(/\s+/).filter(Boolean).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem onSelect={() => setText('')}>New</Win31MenuItem>
          <Win31MenuItem onSelect={() => setPrintOpen(true)}>Print...</Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>E</u>dit</>}>
          <Win31MenuItem disabled>Cut</Win31MenuItem>
          <Win31MenuItem disabled>Copy</Win31MenuItem>
          <Win31MenuItem disabled>Paste</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>S</u>earch</>}>
          <Win31MenuItem accel="Ctrl+F" onSelect={() => setSearchOpen(true)}>Find...</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>F</u>ormat</>}>
          <Win31MenuItem checked={align === 'left'} onSelect={() => setAlign('left')}>Left</Win31MenuItem>
          <Win31MenuItem checked={align === 'center'} onSelect={() => setAlign('center')}>Centered</Win31MenuItem>
          <Win31MenuItem checked={align === 'right'} onSelect={() => setAlign('right')}>Right</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>I</u>nsert</>}>
          <Win31MenuItem accel="F5" onSelect={insertTimestamp}>Time/Date</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>V</u>iew</>}>
          <Win31MenuItem checked={wordWrap} onSelect={() => setWordWrap((value) => !value)}>Word Wrap</Win31MenuItem>
        </Win31Menu>
        <Win31MenuLink
          href="#about-write"
          onClick={(event) => {
            event.preventDefault()
            setAboutOpen(true)
          }}
        >
          <u>H</u>elp
        </Win31MenuLink>
      </Win31MenuBar>

      <Win31Toolbar>
        <Win31ComboBox aria-label="font" value={font} onChange={setFont} options={fonts} />
        <Win31NumberField value={fontSize} min={8} max={72} onChange={setFontSize} aria-label="font size" />
        <Win31ToolbarSeparator />
        <Win31Button small pressed={bold} onClick={() => setBold((value) => !value)} aria-pressed={bold}>
          <b>B</b>
        </Win31Button>
        <Win31Button small pressed={italic} onClick={() => setItalic((value) => !value)} aria-pressed={italic}>
          <i>I</i>
        </Win31Button>
        <Win31Button small disabled>
          <u>U</u>
        </Win31Button>
        <Win31ToolbarSeparator />
        {(['left', 'center', 'right'] as const).map((mode) => (
          <Win31Button
            key={mode}
            small
            pressed={align === mode}
            aria-label={mode}
            aria-pressed={align === mode}
            onClick={() => setAlign(mode)}
          >
            {alignGlyph[mode]}
          </Win31Button>
        ))}
        <Win31Button small disabled>• List</Win31Button>
      </Win31Toolbar>

      <div className="demo-ruler" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>

      <div className="demo-write-workspace">
        <div className="demo-write-page">
          <Win31Textarea
            aria-label="editor"
            value={text}
            wrap={wordWrap ? 'soft' : 'off'}
            onChange={(event) => setText(event.target.value)}
            onSelect={(event) => updateCaret(event.currentTarget)}
            onKeyUp={(event) => updateCaret(event.currentTarget)}
            onClick={(event) => updateCaret(event.currentTarget)}
            onKeyDown={onKeyDown}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              boxShadow: 'none',
              background: 'transparent',
              resize: 'none',
              padding: '12px 40px',
              fontFamily: `"${font}", serif`,
              fontSize,
              fontWeight: bold ? 700 : 400,
              fontStyle: italic ? 'italic' : 'normal',
              textAlign: align
            }}
          />
        </div>
      </div>

      <Win31StatusBar>
        <Win31StatusPane style={{ flex: '0 0 90px' }}>{words} words</Win31StatusPane>
        <Win31StatusPane style={{ flex: '0 0 110px' }}>{text.length} characters</Win31StatusPane>
        <Win31StatusPane style={{ flex: '0 0 110px' }}>
          Ln {caret.line}, Col {caret.column}
        </Win31StatusPane>
        <Win31StatusPane>{wordWrap ? 'Word wrap on' : 'Word wrap off'}</Win31StatusPane>
      </Win31StatusBar>

      <Win31MessageBox
        open={printOpen}
        type="info"
        message="Send document to LPT1?"
        buttons={['ok', 'cancel']}
        isDefault="ok"
        onResult={() => setPrintOpen(false)}
      />

      <Win31Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Find"
        width={380}
        buttons={
          <>
            <Win31Button isDefault onClick={findNext}>
              Find Next
            </Win31Button>
            <Win31Button onClick={() => setSearchOpen(false)}>Cancel</Win31Button>
          </>
        }
      >
        <Win31Field label="Find What:" htmlFor="write-find">
          <Win31Input
            id="write-find"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </Win31Field>
      </Win31Dialog>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="Write — win31ui replica"
        detail="Font toolbar uses Win31ComboBox + Win31NumberField; the editor is Win31Textarea."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

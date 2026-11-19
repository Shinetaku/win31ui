import { useState } from 'react'
import {
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuLink,
  Win31MenuSeparator,
  Win31MessageBox,
  Win31StatusBar,
  Win31StatusPane,
  Win31Textarea
} from '@win31ui/react'

interface NotepadAppProps {
  onClose: () => void
}

/** Notepad replica: plain editor with char/line status panes. */
export function NotepadApp({ onClose }: NotepadAppProps) {
  const [text, setText] = useState('')
  const [printOpen, setPrintOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const lines = text.length === 0 ? 0 : text.split('\n').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem onSelect={() => setText('')}>New</Win31MenuItem>
          <Win31MenuItem onSelect={() => setPrintOpen(true)}>Print</Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>E</u>dit</>}>
          <Win31MenuItem disabled>Undo</Win31MenuItem>
          <Win31MenuItem disabled>Cut</Win31MenuItem>
          <Win31MenuItem disabled>Paste</Win31MenuItem>
        </Win31Menu>
        <Win31MenuLink
          href="#about-notepad"
          onClick={(event) => {
            event.preventDefault()
            setAboutOpen(true)
          }}
        >
          <u>H</u>elp
        </Win31MenuLink>
      </Win31MenuBar>

      <div style={{ flex: 1, minHeight: 0, padding: 4 }}>
        <Win31Textarea
          aria-label="notepad editor"
          value={text}
          onChange={(event) => setText(event.target.value)}
          style={{ width: '100%', height: '100%', resize: 'none' }}
        />
      </div>

      <Win31StatusBar>
        <Win31StatusPane style={{ flex: '0 0 120px' }}>{text.length} chars</Win31StatusPane>
        <Win31StatusPane>{lines} lines</Win31StatusPane>
      </Win31StatusBar>

      <Win31MessageBox
        open={printOpen}
        type="info"
        message="Send document to LPT1?"
        buttons={['ok']}
        onResult={() => setPrintOpen(false)}
      />
      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="Notepad — win31ui replica"
        detail="A minimal plain-text editor built with Win31Textarea."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import {
  Win31Button,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuSeparator,
  Win31MessageBox,
  Win31StatusBar,
  Win31StatusPane,
  Win31Textarea
} from '@win31ui/react'
import type { AppWindowProps } from '../apps'

const UNAVAILABLE = 'Clipboard access is not available in this browser.'

/** Clipboard Viewer replica: shows the current system clipboard text. */
export function ClipboardApp({ onClose }: AppWindowProps) {
  const [text, setText] = useState('')
  const [aboutOpen, setAboutOpen] = useState(false)

  const refresh = useCallback(() => {
    navigator.clipboard
      ?.readText()
      .then((value) => setText(value))
      .catch(() => setText(UNAVAILABLE))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem onSelect={refresh}>Re<u>f</u>resh</Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>E</u>dit</>}>
          <Win31MenuItem disabled>Cut</Win31MenuItem>
          <Win31MenuItem disabled>Copy</Win31MenuItem>
          <Win31MenuItem disabled>Paste</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setAboutOpen(true)}>About Clipboard Viewer...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <Win31Textarea
        aria-label="clipboard contents"
        value={text}
        readOnly
        style={{ flex: 1, minHeight: 0, width: '100%', resize: 'none' }}
      />

      <div style={{ display: 'flex', padding: '4px 8px', background: 'var(--win31-frame)' }}>
        <Win31Button small onClick={refresh}>
          Refresh
        </Win31Button>
      </div>

      <Win31StatusBar>
        <Win31StatusPane style={{ flex: '0 0 110px' }}>{text.length} characters</Win31StatusPane>
        <Win31StatusPane>System clipboard (text only)</Win31StatusPane>
      </Win31StatusBar>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="Clipboard Viewer — win31ui demo"
        detail="Reads text from the browser clipboard via navigator.clipboard."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

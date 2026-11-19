import { useState } from 'react'
import {
  Win31Button,
  Win31Checkbox,
  Win31GroupBox,
  Win31Input,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuSeparator,
  Win31MessageBox
} from '@win31ui/react'
import type { AppWindowProps } from '../apps'

/** PIF Editor replica: program information file form with memory options. */
export function PifEditorApp({ onClose }: AppWindowProps) {
  const [title, setTitle] = useState('ONBOARD.EXE')
  const [commandLine, setCommandLine] = useState('C:\\VBSS\\ONBOARD.EXE')
  const [initialDirectory, setInitialDirectory] = useState('C:\\VBSS')
  const [needsMemory, setNeedsMemory] = useState(true)
  const [needsEms, setNeedsEms] = useState(false)
  const [needsXms, setNeedsXms] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem onSelect={() => setSavedOpen(true)}>
            <u>S</u>ave
          </Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setAboutOpen(true)}>About PIF Editor...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Win31GroupBox legend="Program Title" style={{ padding: '4px 8px' }}>
          <Win31Input
            aria-label="program title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            style={{ width: '100%' }}
          />
        </Win31GroupBox>
        <Win31GroupBox legend="Command Line" style={{ padding: '4px 8px' }}>
          <Win31Input
            aria-label="command line"
            value={commandLine}
            onChange={(event) => setCommandLine(event.target.value)}
            style={{ width: '100%' }}
          />
        </Win31GroupBox>
        <Win31GroupBox legend="Initial Directory" style={{ padding: '4px 8px' }}>
          <Win31Input
            aria-label="initial directory"
            value={initialDirectory}
            onChange={(event) => setInitialDirectory(event.target.value)}
            style={{ width: '100%' }}
          />
        </Win31GroupBox>
        <Win31GroupBox legend="Memory Requirements" style={{ padding: '4px 8px' }}>
          <div style={{ display: 'grid', gap: 4 }}>
            <Win31Checkbox
              id="pif-memory"
              label="Memory Requirements"
              checked={needsMemory}
              onChange={(event) => setNeedsMemory(event.target.checked)}
            />
            <Win31Checkbox
              id="pif-ems"
              label="EMS Memory"
              checked={needsEms}
              onChange={(event) => setNeedsEms(event.target.checked)}
            />
            <Win31Checkbox
              id="pif-xms"
              label="XMS Memory"
              checked={needsXms}
              onChange={(event) => setNeedsXms(event.target.checked)}
            />
          </div>
        </Win31GroupBox>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '4px 8px', background: 'var(--win31-frame)' }}>
        <Win31Button isDefault onClick={() => setSavedOpen(true)}>
          OK
        </Win31Button>
        <Win31Button onClick={onClose}>Cancel</Win31Button>
      </div>

      <Win31MessageBox
        open={savedOpen}
        type="info"
        message="PIF saved (demo)"
        buttons={['ok']}
        onResult={() => setSavedOpen(false)}
        onClose={() => setSavedOpen(false)}
      />

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="PIF Editor — win31ui demo"
        detail="Edits program information files for non-Windows applications."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

import { useState } from 'react'
import {
  Win31GroupBox,
  Win31Menu,
  Win31MenuBar,
  Win31MenuItem,
  Win31MessageBox
} from '@win31ui/react'
import type { AppWindowProps } from '../apps'

/** Object Packager replica: Appearance/Content panes stub for embedding objects. */
export function ObjectPackagerApp({ onClose }: AppWindowProps) {
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>E</u>dit</>}>
          <Win31MenuItem disabled>Insert <u>I</u>con...</Win31MenuItem>
          <Win31MenuItem disabled><u>P</u>aste</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem accel="Alt+F4" onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setAboutOpen(true)}>About Object Packager...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 8, padding: 8 }}>
        <Win31GroupBox legend="Appearance" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 96 }}>
            <span aria-hidden="true" style={{ fontSize: 32, lineHeight: 1 }}>▚</span>
          </div>
        </Win31GroupBox>

        <Win31GroupBox legend="Content" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 96, padding: 8, textAlign: 'center' }}>
            Embed an object by pasting content here. (demo)
          </div>
        </Win31GroupBox>
      </div>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="win31ui Object Packager"
        detail="Object embedding stub for the demo."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

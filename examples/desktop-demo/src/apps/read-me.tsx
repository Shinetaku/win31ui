import { Win31MenuBar, Win31Menu, Win31MenuItem, Win31Textarea } from '@win31ui/react'
import type { AppWindowProps } from '../apps'

const README_TEXT = `win31ui - Windows 3.1 UI for the Web
=====================================

win31ui is a React component library that replicates the Windows 3.1
desktop look: beveled buttons, sunken inputs, etched group boxes, menu
bars with mnemonics, message boxes and a Program Manager shell. Every
color and metric comes from CSS variables (--win31-*) in
@win31ui/tokens - no gradients, rounded corners or modern shadows.

This desktop demo runs the Program Manager with the Main, Accessories,
Games and StartUp groups. File Manager browses a simulated C: drive,
Write shows the editor components, and Control Panel switches themes.

More replica applications live in the Main group: Print Manager,
Clipboard Viewer, MS-DOS Prompt, Windows Setup, PIF Editor and this
Read Me document. Everything is rendered with @win31ui/react.
`

/** Read Me replica: read-only document describing win31ui and the demo. */
export function ReadMeApp({ onClose }: AppWindowProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>
      <Win31Textarea
        aria-label="Read Me document"
        value={README_TEXT}
        readOnly
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          border: 'none',
          boxShadow: 'none',
          background: 'transparent',
          resize: 'none',
          padding: '10px 12px'
        }}
      />
    </div>
  )
}

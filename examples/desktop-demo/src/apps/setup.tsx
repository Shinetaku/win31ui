import { useState } from 'react'
import {
  Win31Button,
  Win31Dialog,
  Win31Field,
  Win31GroupBox,
  Win31Input,
  Win31ListBox,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MessageBox
} from '@win31ui/react'
import type { AppWindowProps } from '../apps'

const DISPLAY_OPTIONS = [
  { value: 'vga', label: 'VGA or Higher Resolution' },
  { value: 'ega', label: 'EGA 640x350, 16 Colors' },
  { value: 'cga', label: 'CGA 640x200, 2 Colors' },
  { value: 'mono', label: 'Monochrome 720x329' }
]

/** Windows Setup replica: system settings list and Change System Settings dialog. */
export function WindowsSetupApp({ onClose }: AppWindowProps) {
  const [display, setDisplay] = useState('vga')
  const [draftDisplay, setDraftDisplay] = useState('vga')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)

  const displayLabel = DISPLAY_OPTIONS.find((option) => option.value === display)?.label ?? display

  const settings = [
    { label: 'Display:', value: displayLabel },
    { label: 'Keyboard:', value: 'Enhanced 101/102-key US' },
    { label: 'Mouse:', value: 'Microsoft Mouse or Compatible Pointing Device' },
    { label: 'Network:', value: 'None Installed' }
  ]

  const openDialog = () => {
    setDraftDisplay(display)
    setDialogOpen(true)
  }

  const saveSettings = () => {
    setDisplay(draftDisplay)
    setDialogOpen(false)
    setSavedOpen(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>O</u>ptions</>}>
          <Win31MenuItem onSelect={openDialog}>Change <u>S</u>ystem Settings...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <Win31GroupBox legend="System Settings" style={{ margin: 8, padding: '4px 8px' }}>
        {settings.map((item) => (
          <Win31Field key={item.label} label={item.label}>
            <Win31Input value={item.value} readOnly disabled style={{ flex: 1 }} />
          </Win31Field>
        ))}
      </Win31GroupBox>

      <Win31Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Change System Settings"
        width={430}
        buttons={
          <>
            <Win31Button isDefault onClick={saveSettings}>
              OK
            </Win31Button>
            <Win31Button onClick={() => setDialogOpen(false)}>Cancel</Win31Button>
          </>
        }
      >
        <Win31Field label="Display:">
          <Win31ListBox
            aria-label="display adapter"
            value={draftDisplay}
            onChange={setDraftDisplay}
            options={DISPLAY_OPTIONS}
            style={{ flex: 1, height: 118 }}
          />
        </Win31Field>
      </Win31Dialog>

      <Win31MessageBox
        open={savedOpen}
        type="info"
        message="Settings saved (demo)"
        buttons={['ok']}
        onResult={() => setSavedOpen(false)}
        onClose={() => setSavedOpen(false)}
      />
    </div>
  )
}

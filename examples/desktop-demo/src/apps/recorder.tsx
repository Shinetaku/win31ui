import { useState } from 'react'
import {
  Win31Button,
  Win31ListBox,
  Win31Menu,
  Win31MenuBar,
  Win31MenuItem,
  Win31MessageBox,
  Win31StatusPane,
  Win31StatusBar
} from '@win31ui/react'
import type { AppWindowProps } from '../apps'

interface MacroEvent {
  value: string
  label: string
}

const INITIAL_EVENTS: ReadonlyArray<MacroEvent> = [
  { value: '1', label: '1. Click [100, 200]' },
  { value: '2', label: '2. Double-click [320, 240]' },
  { value: '3', label: '3. Type "Hello"' },
  { value: '4', label: '4. Click [80, 60]' }
]

/** Macro Recorder replica: recorded event list with Record/Stop/Playback controls. */
export function RecorderApp({ onClose }: AppWindowProps) {
  const [events, setEvents] = useState<ReadonlyArray<MacroEvent>>(INITIAL_EVENTS)
  const [selected, setSelected] = useState<string | null>(INITIAL_EVENTS[0]?.value ?? null)
  const [aboutOpen, setAboutOpen] = useState(false)

  const recordStep = (): void => {
    const next = events.length + 1
    setEvents((current) => [...current, { value: String(next), label: `${next}. Recorded step` }])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem accel="Alt+F4" onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setAboutOpen(true)}>About Macro Recorder...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <Win31Button small onClick={recordStep}>Record</Win31Button>
          <Win31Button small>Stop</Win31Button>
          <Win31Button small>Playback</Win31Button>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <Win31ListBox
            aria-label="recorded events"
            value={selected}
            onChange={setSelected}
            options={events.map((event) => ({ value: event.value, label: event.label }))}
          />
        </div>
      </div>

      <Win31StatusBar>
        <Win31StatusPane style={{ flex: '0 0 110px' }}>{events.length} events</Win31StatusPane>
        <Win31StatusPane>Macro Recorder</Win31StatusPane>
      </Win31StatusBar>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="win31ui Macro Recorder"
        detail="Simulated macro event list for the demo."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

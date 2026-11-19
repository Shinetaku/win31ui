import { useState } from 'react'
import {
  Win31Calendar,
  Win31GroupBox,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuLink,
  Win31MenuSeparator,
  Win31MessageBox,
  Win31Textarea
} from '@win31ui/react'

interface CalendarAppProps {
  onClose: () => void
}

/** Calendar replica: month picker plus per-day notes editor. */
export function CalendarApp({ onClose }: CalendarAppProps) {
  const [selected, setSelected] = useState('2026-11-19')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [aboutOpen, setAboutOpen] = useState(false)

  const updateNote = (value: string) => {
    setNotes((current) => ({ ...current, [selected]: value }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31MenuLink
          href="#about-calendar"
          onClick={(event) => {
            event.preventDefault()
            setAboutOpen(true)
          }}
        >
          <u>H</u>elp
        </Win31MenuLink>
      </Win31MenuBar>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: 6,
          display: 'grid',
          gridTemplateColumns: '1fr 260px',
          gap: 8,
          alignItems: 'start'
        }}
      >
        <Win31Calendar value={selected} onChange={setSelected} />
        <Win31GroupBox legend="Notes for selected day" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Win31Textarea
            aria-label="notes for selected day"
            value={notes[selected] ?? ''}
            onChange={(event) => updateNote(event.target.value)}
            style={{ width: '100%', height: 180, resize: 'none' }}
          />
        </Win31GroupBox>
      </div>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="Calendar — win31ui replica"
        detail="Win31Calendar drives a notes map keyed by the selected yyyy-mm-dd."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

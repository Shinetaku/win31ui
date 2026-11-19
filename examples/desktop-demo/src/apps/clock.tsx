import { useEffect, useState } from 'react'
import {
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuLink,
  Win31MessageBox
} from '@win31ui/react'

interface ClockAppProps {
  onClose: () => void
}

type ClockMode = 'analog' | 'digital'

const FACE_SIZE = 220

const hands = [
  { key: 'hour', width: 4, height: 60 },
  { key: 'minute', width: 3, height: 80 },
  { key: 'second', width: 2, height: 90 }
] as const

const clockFaceStyle = {
  width: FACE_SIZE,
  height: FACE_SIZE,
  borderRadius: '50%',
  border: '1px solid var(--win31-border)',
  background: 'var(--win31-window-bg)',
  position: 'relative'
} as const

/** Clock replica: analog CSS dial or digital readout, switched from Settings. */
export function ClockApp({ onClose }: ClockAppProps) {
  const [mode, setMode] = useState<ClockMode>('analog')
  const [now, setNow] = useState(() => new Date())
  const [aboutOpen, setAboutOpen] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const angles = {
    hour: (hours % 12) * 30 + minutes * 0.5,
    minute: minutes * 6 + seconds * 0.1,
    second: seconds * 6
  }

  const time = now.toLocaleTimeString('en-US', { hour12: false })
  const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>S</u>ettings</>}>
          <Win31MenuItem checked={mode === 'analog'} onSelect={() => setMode('analog')}>Analog</Win31MenuItem>
          <Win31MenuItem checked={mode === 'digital'} onSelect={() => setMode('digital')}>Digital</Win31MenuItem>
        </Win31Menu>
        <Win31MenuLink
          href="#about-clock"
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 8
        }}
      >
        {mode === 'analog' ? (
          <div style={clockFaceStyle} role="img" aria-label={`analog clock showing ${time}`}>
            {hands.map((hand) => (
              <div
                key={hand.key}
                style={{
                  position: 'absolute',
                  bottom: '50%',
                  left: '50%',
                  width: hand.width,
                  height: hand.height,
                  background: 'var(--win31-text)',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) rotate(${angles[hand.key]}deg)`
                }}
              />
            ))}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--win31-text)',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        ) : (
          <>
            <div
              style={{
                fontSize: 42,
                fontFamily: 'var(--win31-font-mono)',
                textAlign: 'center',
                color: 'var(--win31-text)'
              }}
            >
              {time}
            </div>
            <div style={{ textAlign: 'center', color: 'var(--win31-text)' }}>{date}</div>
          </>
        )}
      </div>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="Clock — win31ui replica"
        detail="Analog dial is pure CSS; digital mode uses the monospace token font."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

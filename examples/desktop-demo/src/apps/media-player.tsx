import { useEffect, useState } from 'react'
import {
  Win31Button,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MessageBox,
  Win31ProgressBar,
  Win31Slider,
  Win31StatusPane,
  Win31StatusBar
} from '@win31ui/react'
import type { AppWindowProps } from '../apps'

const MEDIA_FILE = 'C:\\WINDOWS\\SMARTART.WAV (demo)'

/** Media Player replica: simulated transport controls with progress slider and bar. */
export function MediaPlayerApp({ onClose }: AppWindowProps) {
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [notAvailableOpen, setNotAvailableOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setPosition((value) => Math.min(value + 1, 100))
    }, 300)
    return () => window.clearInterval(timer)
  }, [playing])

  useEffect(() => {
    if (playing && position >= 100) setPlaying(false)
  }, [playing, position])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem onSelect={() => setNotAvailableOpen(true)}><u>O</u>pen...</Win31MenuItem>
          <Win31MenuItem accel="Alt+F4" onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setAboutOpen(true)}>About Media Player...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: 12
        }}
      >
        <div className="win31-label">Media Player</div>
        <Win31ProgressBar value={position} style={{ width: 280 }} showLabel />
        <div style={{ width: 280 }}>
          <Win31Slider
            aria-label="playback position"
            min={0}
            max={100}
            value={position}
            onChange={setPosition}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, padding: '4px 8px', background: 'var(--win31-frame)' }}>
        <Win31Button small onClick={() => setPlaying((value) => !value)}>
          {playing ? 'Pause' : 'Play'}
        </Win31Button>
        <Win31Button
          small
          onClick={() => {
            setPlaying(false)
            setPosition(0)
          }}
        >
          Stop
        </Win31Button>
        <Win31Button small onClick={() => setNotAvailableOpen(true)}>
          Eject
        </Win31Button>
      </div>

      <Win31StatusBar>
        <Win31StatusPane style={{ flex: '0 0 120px' }}>{playing ? 'Playing' : 'Stopped'}</Win31StatusPane>
        <Win31StatusPane>{MEDIA_FILE}</Win31StatusPane>
      </Win31StatusBar>

      <Win31MessageBox
        open={notAvailableOpen}
        type="info"
        message="File Open is not available in the demo"
        buttons={['ok']}
        onResult={() => setNotAvailableOpen(false)}
      />
      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="win31ui Media Player"
        detail="Simulated playback transport for the demo."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

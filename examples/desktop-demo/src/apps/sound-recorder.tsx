import { useEffect, useState } from 'react'
import {
  Win31Button,
  Win31Menu,
  Win31MenuBar,
  Win31MenuItem,
  Win31MessageBox,
  Win31Slider,
  Win31StatusPane,
  Win31StatusBar
} from '@win31ui/react'
import type { AppWindowProps } from '../apps'

type RecorderPhase = 'idle' | 'recording' | 'playing'

const BAR_COUNT = 20
const BAR_MIN = 8
const BAR_MAX = 40

/** Deterministic base heights so the initial render is stable (SSR safe). */
const BASE_BARS: ReadonlyArray<number> = Array.from(
  { length: BAR_COUNT },
  (_, index) => BAR_MIN + ((index * 13) % (BAR_MAX - BAR_MIN + 1))
)

function nextLevels(): Array<number> {
  return BASE_BARS.map((base) => {
    const jitter = Math.floor(Math.random() * 9) - 4
    return Math.min(Math.max(base + jitter, BAR_MIN), BAR_MAX)
  })
}

/** Sound Recorder replica: simulated level bars with record/playback animation. */
export function SoundRecorderApp({ onClose }: AppWindowProps) {
  const [phase, setPhase] = useState<RecorderPhase>('idle')
  const [levels, setLevels] = useState<ReadonlyArray<number>>(BASE_BARS)
  const [position, setPosition] = useState(0)
  const [aboutOpen, setAboutOpen] = useState(false)

  useEffect(() => {
    if (phase === 'idle') return
    const timer = window.setInterval(() => setLevels(nextLevels()), 150)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'recording') return
    const timer = window.setTimeout(() => setPhase('idle'), 3000)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing') return
    if (position >= 100) {
      setPhase('idle')
      return
    }
    const timer = window.setTimeout(() => setPosition((value) => Math.min(value + 2, 100)), 150)
    return () => window.clearTimeout(timer)
  }, [phase, position])

  const statusText = phase === 'recording' ? 'Recording' : phase === 'playing' ? 'Playing' : 'Not recording'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem accel="Alt+F4" onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setAboutOpen(true)}>About Sound Recorder...</Win31MenuItem>
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
          gap: 14,
          padding: 12
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 2,
            height: 44,
            padding: 4,
            border: '1px solid var(--win31-border)',
            background: 'var(--win31-window-bg)'
          }}
        >
          {levels.map((height, index) => (
            <div
              key={index}
              style={{
                width: 5,
                height,
                background: 'var(--win31-titlebar-active)'
              }}
            />
          ))}
        </div>

        <div style={{ width: 220 }}>
          <Win31Slider aria-label="playback position" min={0} max={100} value={position} disabled />
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          <Win31Button small onClick={() => setPhase('recording')}>Record</Win31Button>
          <Win31Button small onClick={() => setPhase('playing')}>Play</Win31Button>
          <Win31Button
            small
            onClick={() => {
              setPhase('idle')
              setPosition(0)
              setLevels(BASE_BARS)
            }}
          >
            Stop
          </Win31Button>
        </div>
      </div>

      <Win31StatusBar>
        <Win31StatusPane style={{ flex: '0 0 90px' }}>Length 0:03.00</Win31StatusPane>
        <Win31StatusPane>{statusText}</Win31StatusPane>
      </Win31StatusBar>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="win31ui Sound Recorder"
        detail="Simulated recording levels for the demo."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

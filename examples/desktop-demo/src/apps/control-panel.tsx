import { useEffect, useState } from 'react'
import {
  Win31Button,
  Win31Checkbox,
  Win31GroupBox,
  Win31ProgressBar,
  Win31Radio,
  Win31Slider,
  Win31Tabs,
  win31Themes
} from '@win31ui/react'
import { useDemoTheme } from '../theme-context'

/** Control Panel replica: color schemes (themes) and audio sliders. */
export function ControlPanelDemo() {
  const { theme, setTheme } = useDemoTheme()
  const [volume, setVolume] = useState(70)
  const [balance, setBalance] = useState(50)
  const [muted, setMuted] = useState(false)
  const [testProgress, setTestProgress] = useState(0)

  useEffect(() => {
    if (testProgress <= 0 || testProgress >= 100) return
    const timer = window.setInterval(() => setTestProgress((value) => Math.min(value + 10, 100)), 120)
    return () => window.clearInterval(timer)
  }, [testProgress])

  return (
    <div style={{ padding: 10 }}>
      <Win31Tabs
        items={[
          {
            id: 'color',
            label: 'Color',
            content: (
              <Win31GroupBox legend="Color Scheme" style={{ margin: '4px 0 10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {win31Themes.map((item) => (
                    <Win31Radio
                      key={item}
                      id={`scheme-${item}`}
                      name="color-scheme"
                      label={item === 'light' ? 'Windows Default' : item.charAt(0).toUpperCase() + item.slice(1)}
                      value={item}
                      checked={theme === item}
                      onChange={() => setTheme(item)}
                    />
                  ))}
                </div>
              </Win31GroupBox>
            )
          },
          {
            id: 'audio',
            label: 'Audio',
            content: (
              <>
                <Win31GroupBox legend="Volume" style={{ margin: '4px 0 10px' }}>
                  <div className="demo-copy-row">
                    <span className="win31-label">Volume:</span>
                    <Win31Slider
                      value={volume}
                      onChange={setVolume}
                      aria-label="volume"
                      disabled={muted}
                    />
                    <span className="win31-label">{muted ? 'Muted' : volume}</span>
                  </div>
                  <div className="demo-copy-row">
                    <span className="win31-label">Balance:</span>
                    <Win31Slider value={balance} min={0} max={100} onChange={setBalance} aria-label="balance" />
                  </div>
                  <Win31Checkbox
                    id="mute"
                    label="Mute all audio devices"
                    checked={muted}
                    onChange={(event) => setMuted(event.target.checked)}
                  />
                </Win31GroupBox>
                <div className="demo-copy-row">
                  <Win31Button
                    small
                    onClick={() => {
                      setTestProgress(0)
                      setTestProgress(10)
                    }}
                  >
                    Test Sound
                  </Win31Button>
                  <Win31ProgressBar value={testProgress} style={{ width: 180 }} showLabel />
                </div>
              </>
            )
          }
        ]}
      />
    </div>
  )
}

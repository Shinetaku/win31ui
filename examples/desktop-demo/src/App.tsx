import { useRef, useState, type CSSProperties } from 'react'
import {
  Win31Desktop,
  Win31MessageBox,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuSeparator,
  Win31Provider,
  Win31Window,
  type Win31Theme
} from '@win31ui/react'
import { apps, groupTitles, type AppDef, type AppGroupId } from './apps'
import { DemoThemeContext } from './theme-context'
import { Win31AppIcon } from './icons'

type WindowKey = `group:${AppGroupId}` | `app:${string}`

interface WindowState {
  open: boolean
  minimized: boolean
  maximized: boolean
  x: number
  y: number
  z: number
}

const groupIcons: Record<AppGroupId, string> = {
  main: 'main',
  accessories: 'accessories',
  games: 'games',
  startup: 'startup'
}

const groupWidths: Record<AppGroupId, number> = {
  main: 500,
  accessories: 560,
  games: 300,
  startup: 320
}

const initialGroups: Record<AppGroupId, WindowState> = {
  main: { open: true, minimized: false, maximized: false, x: 60, y: 90, z: 201 },
  accessories: { open: true, minimized: false, maximized: false, x: 90, y: 330, z: 202 },
  games: { open: true, minimized: false, maximized: false, x: 690, y: 400, z: 203 },
  startup: { open: false, minimized: false, maximized: false, x: 24, y: 520, z: 204 }
}

/** Windows 3.1 Program Manager shell: program groups, app windows, menus. */
export function DesktopApp() {
  const [theme, setTheme] = useState<Win31Theme>('light')
  const [groups, setGroups] = useState(initialGroups)
  const [appStates, setAppStates] = useState<Record<string, WindowState>>({})
  const [focused, setFocused] = useState<WindowKey>('group:main')
  const [aboutOpen, setAboutOpen] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
  const [minimizeOnUse, setMinimizeOnUse] = useState(false)
  const [saveSettings, setSaveSettings] = useState(true)
  const openSeq = useRef(0)

  const states: Record<WindowKey, WindowState> = {
    ...Object.fromEntries(
      (Object.keys(groups) as AppGroupId[]).map((id) => [`group:${id}`, groups[id]])
    ),
    ...Object.fromEntries(
      Object.keys(appStates).map((id) => [`app:${id}`, appStates[id]])
    )
  } as Record<WindowKey, WindowState>

  const topZ = Math.max(...Object.values(states).map((win) => win.z))

  // Focus only bumps z; it must never overwrite other window flags (like
  // a freshly cleared `minimized`) with stale closure state.
  const focus = (key: WindowKey) => {
    setFocused(key)
    if (key.startsWith('group:')) {
      const id = key.slice(6) as AppGroupId
      setGroups((prev) => {
        const current = prev[id]
        if (!current) return prev
        const maxZ = Math.max(...Object.values(prev).map((win) => win.z))
        if (current.z === maxZ) return prev
        return { ...prev, [id]: { ...current, z: maxZ + 1 } }
      })
    } else {
      const id = key.slice(4)
      setAppStates((prev) => {
        const current = prev[id]
        if (!current) return prev
        const maxZ = Math.max(...Object.values(prev).map((win) => win.z))
        if (current.z === maxZ) return prev
        return { ...prev, [id]: { ...current, z: maxZ + 1 } }
      })
    }
  }

  const setWindow = (key: WindowKey, state: WindowState) => {
    if (key.startsWith('group:')) {
      const id = key.slice(6) as AppGroupId
      setGroups((prev) => ({ ...prev, [id]: state }))
    } else {
      const id = key.slice(4)
      setAppStates((prev) => ({ ...prev, [id]: state }))
    }
  }

  const openApp = (app: AppDef) => {
    const key: WindowKey = `app:${app.id}`
    const existing = appStates[app.id]
    if (existing) {
      setWindow(key, { ...existing, minimized: false })
      focus(key)
      return
    }
    const seq = (openSeq.current += 1)
    setWindow(key, {
      open: true,
      minimized: false,
      maximized: false,
      x: 140 + (seq % 6) * 28,
      y: 80 + (seq % 6) * 28,
      z: 400 + seq
    })
    setFocused(key)
  }

  const closeApp = (id: string) => {
    setAppStates((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const focusGroup = (id: AppGroupId) => {
    const key: WindowKey = `group:${id}`
    setGroups((prev) => ({ ...prev, [id]: { ...prev[id], open: true, minimized: false } }))
    focus(key)
  }

  const minimizeGroup = (id: AppGroupId) => {
    setGroups((prev) => ({ ...prev, [id]: { ...prev[id], minimized: true } }))
  }

  const tile = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const w = Math.floor((width - 60) / 2)
    const h = Math.floor((height - 120) / 2)
    setGroups((prev) => ({
      main: { ...prev.main!, open: true, minimized: false, x: 16, y: 16 },
      accessories: { ...prev.accessories!, open: true, minimized: false, x: 16 + w + 12, y: 16 },
      games: { ...prev.games!, open: true, minimized: false, x: 16, y: 16 + h + 12 },
      startup: { ...prev.startup!, open: true, minimized: false, x: 16 + w + 12, y: 16 + h + 12 }
    }))
  }

  const cascade = () => {
    setGroups((prev) => ({
      main: { ...prev.main!, open: true, minimized: false, x: 60, y: 40 },
      accessories: { ...prev.accessories!, open: true, minimized: false, x: 90, y: 70 },
      games: { ...prev.games!, open: true, minimized: false, x: 120, y: 100 },
      startup: { ...prev.startup!, open: true, minimized: false, x: 150, y: 130 }
    }))
  }

  return (
    <Win31Provider theme={theme}>
      <DemoThemeContext.Provider value={{ theme, setTheme }}>
      <Win31Desktop className="demo-desktop">
        <Win31Window
          title="Program Manager"
          maximized
          dragMode="none"
          bodyClassName="is-flush"
          className="demo-pm"
        >
          <Win31MenuBar>
            <Win31Menu label={<><u>F</u>ile</>}>
              <Win31MenuItem disabled>R<u>u</u>n...</Win31MenuItem>
              <Win31MenuSeparator />
              <Win31MenuItem onSelect={() => setExitOpen(true)}>E<u>x</u>it...</Win31MenuItem>
            </Win31Menu>
            <Win31Menu label={<><u>O</u>ptions</>}>
              <Win31MenuItem checked={minimizeOnUse} onSelect={() => setMinimizeOnUse((value) => !value)}>
                Minimize on Use
              </Win31MenuItem>
              <Win31MenuItem checked={saveSettings} onSelect={() => setSaveSettings((value) => !value)}>
                Save Settings on Exit
              </Win31MenuItem>
            </Win31Menu>
            <Win31Menu label={<><u>W</u>indow</>}>
              <Win31MenuItem onSelect={cascade}>Cascade</Win31MenuItem>
              <Win31MenuItem onSelect={tile}>Tile</Win31MenuItem>
              <Win31MenuSeparator />
              {(Object.keys(groupTitles) as AppGroupId[]).map((id, index) => (
                <Win31MenuItem key={id} accel={String(index + 1)} onSelect={() => focusGroup(id)}>
                  {index + 1} {groupTitles[id]}
                </Win31MenuItem>
              ))}
            </Win31Menu>
            <Win31Menu label={<><u>H</u>elp</>}>
              <Win31MenuItem onSelect={() => setAboutOpen(true)}>About Program Manager...</Win31MenuItem>
            </Win31Menu>
          </Win31MenuBar>

          <div className="demo-pm-desktop">
            {(Object.keys(groupTitles) as AppGroupId[]).map((id) => {
              const group = groups[id]
              if (!group.open || group.minimized) return null
              const style: CSSProperties = {
                left: group.x,
                top: group.y,
                width: groupWidths[id],
                zIndex: group.z,
                position: 'fixed'
              }
              return (
                <Win31Window
                  key={id}
                  title={groupTitles[id]}
                  active={focused === `group:${id}`}
                  dragMode="manual"
                  style={style}
                  bodyClassName="is-flush"
                  controls={['minimize']}
                  onMinimize={() => minimizeGroup(id)}
                  onMouseDownCapture={() => focus(`group:${id}`)}
                >
                  <div className="demo-group-grid">
                    {apps
                      .filter((app) => app.group === id)
                      .map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          className="demo-group-item"
                          onDoubleClick={() => openApp(app)}
                        >
                          <Win31AppIcon id={app.icon} size={32} />
                          <span>{app.title}</span>
                        </button>
                      ))}
                    {id === 'startup' ? <span className="win31-muted" style={{ padding: 8 }}>empty</span> : null}
                  </div>
                </Win31Window>
              )
            })}

            {Object.keys(appStates).map((id) => {
              const app = apps.find((candidate) => candidate.id === id)
              if (!app) return null
              const state = appStates[id]!
              if (!state.open || state.minimized) return null
              const style: CSSProperties = {
                left: state.x,
                top: state.y,
                width: app.width,
                ...(app.height ? { height: app.height } : null),
                zIndex: state.z,
                position: 'fixed'
              }
              const Component = app.component
              return (
                <Win31Window
                  key={id}
                  className="demo-window"
                  title={app.title}
                  active={focused === `app:${id}`}
                  dragMode="manual"
                  style={style}
                  bodyClassName="is-flush"
                  onMouseDownCapture={() => focus(`app:${id}`)}
                  onMinimize={() => setWindow(`app:${id}`, { ...state, minimized: true })}
                  onMaximize={() => setWindow(`app:${id}`, { ...state, maximized: !state.maximized })}
                  onClose={() => closeApp(id)}
                >
                  <Component onClose={() => closeApp(id)} />
                </Win31Window>
              )
            })}

            {/* minimized groups dock at the bottom of the Program Manager */}
            {(Object.keys(groupTitles) as AppGroupId[]).map((id, index) => {
              const group = groups[id]
              if (!group.open || !group.minimized) return null
              return (
                <button
                  key={id}
                  type="button"
                  className="demo-group-item demo-docked-group"
                  style={{ position: 'fixed', left: 20 + index * 90, bottom: 8, zIndex: 250 }}
                  onClick={() => focusGroup(id)}
                >
                  <Win31AppIcon id={groupIcons[id]} size={32} />
                  <span>{groupTitles[id]}</span>
                </button>
              )
            })}
          </div>
        </Win31Window>

        <Win31MessageBox
          open={aboutOpen}
          type="info"
          message="Program Manager — win31ui"
          detail="A Windows 3.1 desktop replica built with @win31ui/react."
          buttons={['ok']}
          onResult={() => setAboutOpen(false)}
        />

        <Win31MessageBox
          open={exitOpen}
          type="info"
          message="This demo cannot exit Windows."
          detail="Close this message box to keep exploring."
          buttons={['ok']}
          onResult={() => setExitOpen(false)}
        />
      </Win31Desktop>
      </DemoThemeContext.Provider>
    </Win31Provider>
  )
}

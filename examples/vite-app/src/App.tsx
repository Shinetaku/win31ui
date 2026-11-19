import { useState } from 'react'
import iconFile from '@win31ui/react/assets/img/file.png'
import {
  Win31Button,
  Win31Checkbox,
  Win31ComboBox,
  Win31DesktopIcon,
  Win31Dialog,
  Win31Field,
  Win31Input,
  Win31ListBox,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuSeparator,
  Win31MessageBox,
  Win31NumberField,
  Win31ProgressBar,
  Win31Provider,
  Win31Radio,
  Win31Slider,
  Win31StatusBar,
  Win31StatusPane,
  Win31Table,
  Win31Tabs,
  Win31TitleBar,
  Win31Toolbar,
  Win31ToolbarSeparator,
  Win31Tooltip,
  Win31Tree,
  Win31Window,
  win31Themes,
  type Win31DragMode,
  type Win31Theme
} from '@win31ui/react'

interface OrderRow {
  id: string
  orderNo: string
  enterprise: string
  numbers: number
}

const orderRows: OrderRow[] = [
  { id: '1', orderNo: 'SO-2026-0001', enterprise: 'ACME', numbers: 120 },
  { id: '2', orderNo: 'SO-2026-0002', enterprise: 'Globex', numbers: 86 },
  { id: '3', orderNo: 'SO-2026-0003', enterprise: 'Initech', numbers: 240 }
]

const treeNodes = [
  {
    id: 'e1',
    label: 'ACME Corp',
    children: [
      { id: 'o1', label: 'SO-0001', children: [{ id: 'n1', label: '0101...0001' }, { id: 'n2', label: '0101...0002' }] },
      { id: 'o2', label: 'SO-0002' }
    ]
  },
  { id: 'e2', label: 'Globex' }
]

export function App() {
  const [theme, setTheme] = useState<Win31Theme>('light')
  const [dragMode, setDragMode] = useState<Win31DragMode>('manual')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('Ready.')
  const [progress, setProgress] = useState(40)
  const [volume, setVolume] = useState(60)
  const [count, setCount] = useState(3)
  const [enabled, setEnabled] = useState(true)
  const [size, setSize] = useState('a')
  const [activeTab, setActiveTab] = useState('general')
  const [listValue, setListValue] = useState<string | null>('p12')
  const [comboValue, setComboValue] = useState('13')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [messageOpen, setMessageOpen] = useState(false)
  const [iconVisible, setIconVisible] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  return (
    <Win31Provider theme={theme}>
      <div style={{ padding: 16, display: 'grid', gap: 12, maxWidth: 760 }}>
        <Win31MenuBar>
          <Win31Menu label="File">
            <Win31MenuItem accel="Ctrl+N" onSelect={() => setMessage('New file.')}>
              New
            </Win31MenuItem>
            <Win31MenuItem accel="Ctrl+O" onSelect={() => setMessage('Opened.')}>
              Open...
            </Win31MenuItem>
            <Win31MenuSeparator />
            <Win31MenuItem checked onSelect={() => setMessage('Auto-save toggled.')}>
              Auto-save
            </Win31MenuItem>
            <Win31MenuSeparator />
            <Win31MenuItem onSelect={() => setMessage('Exit clicked.')}>
              Exit
            </Win31MenuItem>
          </Win31Menu>
          <Win31Menu label="View">
            <Win31MenuItem onSelect={() => setIconVisible((visible) => !visible)}>
              {iconVisible ? 'Hide desktop icon' : 'Show desktop icon'}
            </Win31MenuItem>
          </Win31Menu>
        </Win31MenuBar>

        <Win31Toolbar>
          <Win31Button small onClick={() => setMessage(`Hello, ${name || 'world'}!`)}>
            Greet
          </Win31Button>
          <Win31ToolbarSeparator />
          <Win31Button small onClick={() => setDialogOpen(true)}>
            Dialog
          </Win31Button>
          <Win31ToolbarSeparator />
          <Win31Button small onClick={() => setMessageOpen(true)}>
            MessageBox
          </Win31Button>
          <span className="win31-path">VBSS:\Demo\Main</span>
        </Win31Toolbar>

        <Win31Window
          title="Win31 React Demo — Notepad"
          dragMode={dragMode}
          onMinimize={() => setMessage('Minimized.')}
          onMaximize={() => setMessage('Maximized.')}
          onClose={() => setMessage('Closed (window still rendered in demo).')}
        >
          <Win31Field label="Name:">
            <Win31Input value={name} onChange={(event) => setName(event.target.value)} placeholder="type here" />
          </Win31Field>
          <Win31Field label="Theme:">
            <select
              className="win31-select"
              value={theme}
              onChange={(event) => setTheme(event.target.value as Win31Theme)}
            >
              {win31Themes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Win31Field>
          <Win31Field label="Drag:">
            <select
              className="win31-select"
              value={dragMode}
              onChange={(event) => setDragMode(event.target.value as Win31DragMode)}
            >
              {(['none', 'manual', 'electron', 'tauri'] as const).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Win31Field>
          <div style={{ display: 'flex', gap: 8 }}>
            <Win31Button isDefault>OK</Win31Button>
            <Win31Button>Cancel</Win31Button>
          </div>
        </Win31Window>

        <Win31Window title="Form Controls">
          <Win31Field label="Progress:">
            <Win31ProgressBar value={progress} showLabel style={{ width: 200 }} />
            <Win31Button small onClick={() => setProgress((p) => (p + 20) % 120)}>
              Step
            </Win31Button>
          </Win31Field>
          <Win31Field label="Volume:">
            <Win31Slider value={volume} onChange={setVolume} aria-label="volume" />
            <span className="win31-label">{volume}</span>
          </Win31Field>
          <Win31Field label="Count:">
            <Win31NumberField value={count} min={1} max={100} onChange={setCount} aria-label="count" />
          </Win31Field>
          <Win31Field label="Options:">
            <Win31Checkbox id="opt-enable" label="Enable logging" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            <Win31Radio id="opt-a" name="size" label="Daily" value="a" checked={size === 'a'} onChange={() => setSize('a')} />
            <Win31Radio id="opt-b" name="size" label="Weekly" value="b" checked={size === 'b'} onChange={() => setSize('b')} />
          </Win31Field>
        </Win31Window>

        <Win31Window title="Data Views" bodyClassName="is-flush">
          <Win31Tabs
            activeId={activeTab}
            onChange={setActiveTab}
            items={[
              {
                id: 'general',
                label: 'General',
                content: (
                  <div style={{ padding: 12, display: 'grid', gap: 8 }}>
                    <Win31Field label="Platform:">
                      <Win31ListBox
                        aria-label="platform"
                        value={listValue}
                        onChange={setListValue}
                        options={[
                          { value: 'p07', label: '07 SIP Gateway' },
                          { value: 'p08', label: '08 SIP Gateway 2' },
                          { value: 'p12', label: '12 SIP Gateway 2 SC' },
                          { value: 'p13', label: '13 SIP Gateway 2 SH', disabled: true }
                        ]}
                      />
                    </Win31Field>
                    <Win31Field label="Gateway:">
                      <Win31ComboBox
                        aria-label="gateway"
                        value={comboValue}
                        onChange={setComboValue}
                        options={[
                          { value: '07', label: '07' },
                          { value: '08', label: '08' },
                          { value: '12', label: '12' },
                          { value: '17', label: '17' }
                        ]}
                      />
                    </Win31Field>
                    <Win31Tooltip content="Double-click a row to open the order.">
                      <span className="win31-label">Hover for help</span>
                    </Win31Tooltip>
                  </div>
                )
              },
              {
                id: 'tree',
                label: 'Enterprise Tree',
                content: (
                  <div style={{ padding: 12 }}>
                    <Win31Tree
                      nodes={treeNodes}
                      selectedId={selectedNode}
                      onSelect={setSelectedNode}
                      defaultExpandedIds={['e1']}
                      aria-label="enterprise tree"
                    />
                  </div>
                )
              },
              {
                id: 'orders',
                label: 'Orders',
                content: (
                  <div style={{ padding: 12 }}>
                    <Win31Table<OrderRow>
                      aria-label="orders"
                      rowKey={(row) => row.id}
                      selectedRowKey={selectedOrder}
                      onRowSelect={(key) => setSelectedOrder(key)}
                      columns={[
                        { key: 'orderNo', header: 'Order No.', accessor: (row) => row.orderNo },
                        { key: 'enterprise', header: 'Enterprise', accessor: (row) => row.enterprise },
                        { key: 'numbers', header: 'Numbers', accessor: (row) => row.numbers }
                      ]}
                      data={orderRows}
                    />
                  </div>
                )
              }
            ]}
          />
        </Win31Window>

        <Win31StatusBar>
          <Win31StatusPane>{message}</Win31StatusPane>
          <Win31StatusPane style={{ flex: '0 0 120px' }}>{dragMode} drag</Win31StatusPane>
        </Win31StatusBar>
      </div>

      <Win31Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Onboarding Parameters"
        width={420}
        buttons={
          <>
            <Win31Button isDefault onClick={() => setDialogOpen(false)}>
              OK
            </Win31Button>
            <Win31Button onClick={() => setDialogOpen(false)}>Cancel</Win31Button>
          </>
        }
      >
        <Win31Field label="Ratio (%):">
          <Win31NumberField value={10} min={1} max={100} aria-label="ratio" />
        </Win31Field>
        <Win31Field label="Period (min):">
          <Win31NumberField value={30} min={1} max={1440} aria-label="period" />
        </Win31Field>
      </Win31Dialog>

      <Win31MessageBox
        open={messageOpen}
        type="warn"
        message="Deploy the onboarding changes?"
        detail="This will notify the quality-inspection platform."
        buttons={['yes', 'no']}
        isDefault="yes"
        onResult={(button) => {
          setMessage(`MessageBox result: ${button}`)
          setMessageOpen(false)
        }}
      />

      {iconVisible ? (
        <Win31DesktopIcon icon={iconFile} label="Notepad" onRestore={() => setIconVisible(false)} />
      ) : null}
    </Win31Provider>
  )
}

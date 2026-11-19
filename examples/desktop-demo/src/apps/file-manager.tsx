import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Win31Button,
  Win31Dialog,
  Win31Field,
  Win31Input,
  Win31ListBox,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuSeparator,
  Win31MessageBox,
  Win31ProgressBar,
  Win31StatusBar,
  Win31StatusPane,
  Win31Table,
  Win31Toolbar,
  Win31ToolbarSeparator,
  Win31Tooltip,
  Win31Tree,
  type Win31TreeProps
} from '@win31ui/react'
import { Win31AppIcon } from '../icons'
import {
  dirRow,
  driveTree,
  findDir,
  findDirByPath,
  parentPath,
  type FsDir,
  type FsFile
} from '../fs'

interface FileManagerAppProps {
  onClose: () => void
}

function nameCell(file: FsFile): ReactNode {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Win31AppIcon id={file.directory ? 'folder' : 'file'} size={16} />
      {file.name}
    </span>
  )
}

/** File Manager replica: drive tree with folders, file details, Disk menu. */
export function FileManagerApp({ onClose }: FileManagerAppProps) {
  const [dirId, setDirId] = useState('vbss')
  const [dirOnly, setDirOnly] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [pathInput, setPathInput] = useState('C:\\VBSS')

  const [openOpen, setOpenOpen] = useState(false)
  const [openName, setOpenName] = useState('README.TXT')
  const [openPlace, setOpenPlace] = useState<string | null>('vbss')

  const [copyOpen, setCopyOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formatOpen, setFormatOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const dir = findDir(driveTree, dirId) ?? driveTree[0]!

  useEffect(() => {
    if (!copyOpen || progress >= 100) return
    const timer = window.setInterval(() => setProgress((value) => Math.min(value + 5, 100)), 60)
    return () => window.clearInterval(timer)
  }, [copyOpen, progress])

  const clock = useClock()

  const enterDir = (next: FsDir) => {
    setDirId(next.id)
    setSelectedFile(null)
    setPathInput(next.path)
  }

  const onTreeSelect: Win31TreeProps['onSelect'] = (id) => {
    const next = findDir(driveTree, id)
    if (next) enterDir(next)
  }

  const goToPath = () => {
    const target = findDirByPath(driveTree, pathInput) ?? findDirByPath(driveTree, `${pathInput}\\`)
    if (target) enterDir(target)
  }

  const goUp = () => {
    if (dir.id === 'c') return
    const parent = findDirByPath(driveTree, parentPath(dir.path) ?? 'C:\\')
    if (parent) enterDir(parent)
  }

  const startCopy = () => {
    setProgress(0)
    setCopyOpen(true)
  }

  const rows: Array<FsFile> = [...(dir.children?.map(dirRow) ?? []), ...dir.files]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem accel="Ctrl+O" onSelect={() => setOpenOpen(true)}>
            <u>O</u>pen...
          </Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={onClose}>Clo<u>s</u>e</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>D</u>isk</>}>
          <Win31MenuItem onSelect={startCopy}>Copy <u>D</u>isk...</Win31MenuItem>
          <Win31MenuItem onSelect={() => setFormatOpen(true)}>Format Disk...</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>V</u>iew</>}>
          <Win31MenuItem checked={!dirOnly} onSelect={() => setDirOnly(false)}>
            Tree and File Detail
          </Win31MenuItem>
          <Win31MenuItem checked={dirOnly} onSelect={() => setDirOnly(true)}>
            Tree Only
          </Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setAboutOpen(true)}>About File Manager...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <Win31Toolbar>
        <Win31Button small onClick={() => enterDir(driveTree[0]!)}>
          C:
        </Win31Button>
        <Win31Tooltip content="Move to the parent directory.">
          <Win31Button small onClick={goUp}>
            Up
          </Win31Button>
        </Win31Tooltip>
        <Win31ToolbarSeparator />
        <Win31Tooltip content="Refresh the directory listing (F5).">
          <Win31Button small onClick={() => setSelectedFile(null)}>
            Refresh
          </Win31Button>
        </Win31Tooltip>
      </Win31Toolbar>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 8px', background: 'var(--win31-frame)' }}>
        <span className="win31-label">Directory:</span>
        <Win31Input
          aria-label="directory path"
          value={pathInput}
          onChange={(event) => setPathInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') goToPath()
          }}
          style={{ flex: 1 }}
        />
        <Win31Button small onClick={goToPath}>
          Go
        </Win31Button>
      </div>

      <div className="demo-file-manager" style={dirOnly ? { gridTemplateColumns: 'minmax(0,1fr)' } : undefined}>
        {!dirOnly ? (
          <div className="demo-pane">
            <div className="demo-pane-title">Directories</div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
              <Win31Tree
                nodes={treeNodes()}
                selectedId={dirId}
                onSelect={onTreeSelect}
                defaultExpandedIds={['c', 'windows']}
                aria-label="directories"
              />
            </div>
          </div>
        ) : null}

        <div className="demo-pane">
          <div className="demo-pane-title">{dir.path} — File Details</div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <Win31Table<FsFile>
              aria-label="file details"
              rowKey={(file) => (file.directory ? `dir:${file.dirId}` : file.name)}
              selectedRowKey={selectedFile}
              onRowSelect={(key, file) => {
                setSelectedFile(key)
                if (file.directory && file.dirId) {
                  const target = findDir(driveTree, file.dirId)
                  if (target) enterDir(target)
                }
              }}
              columns={[
                { key: 'name', header: 'Name', accessor: (file) => nameCell(file), sortValue: (file) => file.name },
                { key: 'size', header: 'Size', accessor: (file) => (file.directory ? '' : file.size.toLocaleString('en-US')), sortValue: (file) => file.size },
                { key: 'type', header: 'Type', accessor: (file) => file.type },
                { key: 'modified', header: 'Date / Time', accessor: (file) => `${file.modified} ${file.time}` }
              ]}
              data={rows}
            />
          </div>
        </div>
      </div>

      <Win31StatusBar>
        <Win31StatusPane style={{ flex: '0 0 110px' }}>
          {rows.length} items {dir.files.reduce((sum, file) => sum + file.size, 0).toLocaleString('en-US')} bytes
        </Win31StatusPane>
        <Win31StatusPane>{dir.path}</Win31StatusPane>
        <Win31StatusPane style={{ flex: '0 0 70px' }}>{clock}</Win31StatusPane>
      </Win31StatusBar>

      <Win31Dialog
        open={openOpen}
        onClose={() => setOpenOpen(false)}
        title="Open"
        width={420}
        closeOnBackdrop
        buttons={
          <>
            <Win31Button isDefault onClick={() => setOpenOpen(false)}>
              OK
            </Win31Button>
            <Win31Button onClick={() => setOpenOpen(false)}>Cancel</Win31Button>
          </>
        }
      >
        <div className="demo-open-layout">
          <div>
            <div className="win31-label">Directories:</div>
            <Win31ListBox
              aria-label="open place"
              value={openPlace}
              onChange={setOpenPlace}
              options={[
                { value: 'c', label: 'C:\\' },
                { value: 'windows', label: 'WINDOWS' },
                { value: 'vbss', label: 'VBSS' },
                { value: 'dos', label: 'DOS' }
              ]}
            />
          </div>
          <div>
            <Win31Field label="File Name:" htmlFor="fm-open-name">
              <Win31Input id="fm-open-name" value={openName} onChange={(event) => setOpenName(event.target.value)} />
            </Win31Field>
            <Win31Field label="Save as type:">
              <Win31Input defaultValue="All Files (*.*)" disabled />
            </Win31Field>
          </div>
        </div>
      </Win31Dialog>

      <Win31Dialog
        open={copyOpen}
        onClose={() => setCopyOpen(false)}
        title="Copying Disk"
        width={420}
        buttons={<Win31Button onClick={() => setCopyOpen(false)}>Cancel</Win31Button>}
      >
        <div>Copy drive A: to drive A:</div>
        <div className="demo-copy-row">
          <Win31ProgressBar value={progress} style={{ width: 260 }} showLabel />
        </div>
        <div className="win31-muted">{progress < 100 ? 'Reading source disk...' : 'Copy complete.'}</div>
      </Win31Dialog>

      <Win31MessageBox
        open={formatOpen}
        type="warn"
        message="Format will erase ALL data on drive A:."
        detail="Continue with format?"
        buttons={['yes', 'no']}
        isDefault="no"
        onResult={(button) => {
          if (button === 'yes') setSelectedFile(null)
          setFormatOpen(false)
        }}
      />

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="win31ui File Manager"
        detail="React replica of Windows 3.1 — every component in one demo."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

function treeNodes(): Win31TreeProps['nodes'] {
  const toNode = (dir: FsDir): Win31TreeProps['nodes'][number] => ({
    id: dir.id,
    label: dir.label,
    icon: <Win31AppIcon id="folder" />,
    children: dir.children?.map(toNode)
  })
  return driveTree.map(toNode)
}

function useClock(): string {
  const [now, setNow] = useState(() => new Date())
  const timer = useRef<number | null>(null)
  useEffect(() => {
    timer.current = window.setInterval(() => setNow(new Date()), 1000)
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current)
    }
  }, [])
  return now.toLocaleTimeString('en-US', { hour12: false })
}

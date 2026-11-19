import { useState } from 'react'
import {
  Win31Button,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuSeparator,
  Win31MessageBox,
  Win31StatusBar,
  Win31StatusPane,
  Win31Table
} from '@win31ui/react'
import type { AppWindowProps } from '../apps'

interface PrintJob {
  id: number
  name: string
  size: string
  status: string
}

const initialQueue: Array<PrintJob> = [
  { id: 1, name: 'ONBOARDING.DOC', size: '140 KB', status: 'Printing' },
  { id: 2, name: 'PLAN.WRI', size: '25 KB', status: 'Pending' },
  { id: 3, name: 'README.TXT', size: '4 KB', status: 'Pending' }
]

/** Print Manager replica: printer queue table with pause / cancel actions. */
export function PrintManagerApp({ onClose }: AppWindowProps) {
  const [queue, setQueue] = useState(initialQueue)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const pausePrinting = () => {
    setPaused((value) => !value)
    setNotice(paused ? 'Printing resumed.' : 'Printing paused.')
  }

  const cancelJob = () => {
    if (selectedId === null) return
    const job = queue.find((item) => item.id === selectedId)
    setQueue((current) => current.filter((item) => item.id !== selectedId))
    setSelectedId(null)
    setNotice(`Print job ${job?.name ?? ''} cancelled.`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>P</u>rinter</>}>
          <Win31MenuItem onSelect={pausePrinting}>{paused ? 'Resume Printing' : 'Pause Printing'}</Win31MenuItem>
          <Win31MenuItem disabled={selectedId === null} onSelect={cancelJob}>
            <u>C</u>ancel Job
          </Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>V</u>iew</>}>
          <Win31MenuItem onSelect={() => setSelectedId(null)}>Refre<u>s</u>h</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setNotice('Print Manager — win31ui demo replica.')}>
            About Print Manager...
          </Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 8 }}>
        <Win31Table<PrintJob>
          aria-label="print queue"
          rowKey={(job) => String(job.id)}
          selectedRowKey={selectedId === null ? null : String(selectedId)}
          onRowSelect={(key) => setSelectedId(key === null ? null : Number(key))}
          columns={[
            { key: 'name', header: 'Job', accessor: (job) => job.name, sortValue: (job) => job.name },
            { key: 'size', header: 'Size', accessor: (job) => job.size, sortValue: (job) => job.size },
            { key: 'status', header: 'Status', accessor: (job) => job.status, sortValue: (job) => job.status }
          ]}
          data={queue}
        />
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '2px 8px 6px', background: 'var(--win31-frame)' }}>
        <Win31Button small onClick={pausePrinting}>
          {paused ? 'Resume Printing' : 'Pause Printing'}
        </Win31Button>
        <Win31Button small disabled={selectedId === null} onClick={cancelJob}>
          Cancel Job
        </Win31Button>
      </div>

      <Win31StatusBar>
        <Win31StatusPane style={{ flex: '0 0 90px' }}>{queue.length} jobs</Win31StatusPane>
        <Win31StatusPane>{paused ? 'printer paused' : 'printer ready'}</Win31StatusPane>
      </Win31StatusBar>

      <Win31MessageBox
        open={notice !== null}
        type="info"
        message={notice ?? ''}
        buttons={['ok']}
        onResult={() => setNotice(null)}
        onClose={() => setNotice(null)}
      />
    </div>
  )
}

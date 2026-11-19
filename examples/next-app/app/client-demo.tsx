'use client'

import { useState } from 'react'
import {
  Win31Button,
  Win31Dialog,
  Win31Field,
  Win31Input,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MessageBox,
  Win31Table,
  Win31Tabs,
  Win31Window
} from '@win31ui/react'

interface ContactRow {
  id: string
  name: string
  city: string
}

const contacts: ContactRow[] = [
  { id: '1', name: 'Chen Wei', city: 'Chengdu' },
  { id: '2', name: 'Liu Yang', city: 'Shanghai' },
  { id: '3', name: 'Zhao Min', city: 'Beijing' }
]

/**
 * Interactive demo rendered inside a Client Component boundary; Next.js
 * still server-renders this subtree to HTML, then hydrates it.
 */
export function ClientDemo() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [messageOpen, setMessageOpen] = useState(false)
  const [result, setResult] = useState('Ready.')
  const [activeTab, setActiveTab] = useState('tab-a')
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      <Win31MenuBar>
        <Win31Menu label="File">
          <Win31MenuItem accel="Ctrl+N" onSelect={() => setResult('New.')}>
            New
          </Win31MenuItem>
          <Win31MenuItem onSelect={() => setDialogOpen(true)}>Open dialog...</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label="Help">
          <Win31MenuItem onSelect={() => setMessageOpen(true)}>About...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <Win31Window title="Client Demo — hydrated SSR" bodyClassName="is-flush">
        <Win31Tabs
          activeId={activeTab}
          onChange={setActiveTab}
          items={[
            {
              id: 'tab-a',
              label: 'Contacts',
              content: (
                <div style={{ padding: 12 }}>
                  <Win31Table<ContactRow>
                    aria-label="contacts"
                    rowKey={(row) => row.id}
                    selectedRowKey={selected}
                    onRowSelect={(key) => setSelected(key)}
                    columns={[
                      { key: 'name', header: 'Name', accessor: (row) => row.name },
                      { key: 'city', header: 'City', accessor: (row) => row.city }
                    ]}
                    data={contacts}
                  />
                </div>
              )
            },
            {
              id: 'tab-b',
              label: 'Actions',
              content: (
                <div style={{ padding: 12, display: 'flex', gap: 8 }}>
                  <Win31Button isDefault onClick={() => setDialogOpen(true)}>
                    Open dialog
                  </Win31Button>
                  <Win31Button onClick={() => setMessageOpen(true)}>Show message</Win31Button>
                </div>
              )
            }
          ]}
        />
        <div className="win31-statusbar">
          <span className="win31-status-pane">{result}</span>
        </div>
      </Win31Window>

      <Win31Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Open Order"
        buttons={
          <Win31Button isDefault onClick={() => setDialogOpen(false)}>
            OK
          </Win31Button>
        }
      >
        <Win31Field label="Order No.:">
          <Win31Input placeholder="SO-2026-0001" />
        </Win31Field>
      </Win31Dialog>

      <Win31MessageBox
        open={messageOpen}
        type="info"
        message="win31ui 0.1.0 — Next.js SSR demo."
        buttons={['ok']}
        onResult={() => setMessageOpen(false)}
      />
    </>
  )
}

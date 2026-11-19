import { Win31Button, Win31Field, Win31GroupBox, Win31Input, Win31Window } from '@win31ui/react'
import { ClientDemo } from './client-demo'
import { ThemeSwitcher } from './theme-switcher'

/**
 * Server Component: static windows render to HTML on the server.
 * Interactive widgets live in `ClientDemo` (client boundary, still SSR'd).
 */
export default function Page() {
  return (
    <div style={{ padding: 16, display: 'grid', gap: 12, maxWidth: 760 }}>
      <ThemeSwitcher />

      <Win31Window title="Server Rendered Window" bodyClassName="is-flush">
        <div className="win31-toolbar">
          <span className="win31-drives" />
          <span className="win31-path">VBSS:\SSR\Demo</span>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <Win31GroupBox legend="Enterprise">
            <Win31Field label="Company:">
              <Win31Input placeholder="rendered on the server" />
            </Win31Field>
            <Win31Field label="Order No.:">
              <Win31Input defaultValue="SO-2026-0001" />
            </Win31Field>
          </Win31GroupBox>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Win31Button isDefault>OK</Win31Button>
            <Win31Button>Cancel</Win31Button>
          </div>
        </div>
        <div className="win31-statusbar">
          <span className="win31-status-pane">SSR output — view source to verify.</span>
        </div>
      </Win31Window>

      <ClientDemo />
    </div>
  )
}

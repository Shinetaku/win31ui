import { useState } from 'react'
import {
  Win31Button,
  Win31GroupBox,
  Win31MenuBar,
  Win31MenuLink,
  Win31MessageBox,
  Win31StatusBar,
  Win31StatusPane,
  Win31Textarea
} from '@win31ui/react'

interface CharacterMapAppProps {
  onClose: () => void
}

const CHARACTERS: ReadonlyArray<string> = [
  ...Array.from({ length: 96 }, (_, index) => String.fromCharCode(0x20 + index)),
  ...'©®°±µ¶•½¼¾€¥£'
]

/** Character Map replica: glyph grid, magnified preview and copy buffer. */
export function CharacterMapApp({ onClose }: CharacterMapAppProps) {
  const [copied, setCopied] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)

  const append = (character: string) => {
    setSelected(character)
    setCopied((current) => current + character)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31MenuLink
          href="#about-charmap"
          onClick={(event) => {
            event.preventDefault()
            setAboutOpen(true)
          }}
        >
          <u>H</u>elp
        </Win31MenuLink>
      </Win31MenuBar>

      <div style={{ flex: 1, minHeight: 0, padding: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          role="group"
          aria-label="character grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 3
          }}
        >
          {CHARACTERS.map((character, index) => (
            <Win31Button
              // 0x20 (space) and repeating glyphs need a stable positional key.
              key={`${index}-${character}`}
              small
              pressed={selected === character}
              aria-label={`character ${character}`}
              onClick={() => append(character)}
              style={{ padding: '2px 0' }}
            >
              {character === ' ' ? '\u00A0' : character}
            </Win31Button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 8, alignItems: 'start' }}>
          <Win31GroupBox legend="Preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 72 }}>
            <span style={{ fontSize: 36, fontFamily: 'var(--win31-font-mono)', lineHeight: 1 }}>
              {selected === ' ' ? '\u00A0' : (selected ?? '')}
            </span>
          </Win31GroupBox>
          <Win31GroupBox legend="Characters to copy">
            <Win31Textarea
              aria-label="characters to copy"
              value={copied}
              readOnly
              style={{ width: '100%', height: 44, resize: 'none' }}
            />
          </Win31GroupBox>
        </div>
      </div>

      <Win31StatusBar>
        <Win31StatusPane style={{ flex: '0 0 160px' }}>{copied.length} characters copied</Win31StatusPane>
        <Win31StatusPane>Click a glyph to append it</Win31StatusPane>
      </Win31StatusBar>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="Character Map — win31ui replica"
        detail="96 printable ASCII glyphs plus common symbols on a CSS grid."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

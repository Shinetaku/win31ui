import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import {
  Win31Button,
  Win31Menu,
  Win31MenuBar,
  Win31MenuItem,
  Win31MessageBox,
  Win31Slider
} from '@win31ui/react'
import type { AppWindowProps } from '../apps'

type PaintTool = 'pencil' | 'eraser' | 'brush'

const CANVAS_WIDTH = 560
const CANVAS_HEIGHT = 360

const PALETTE: ReadonlyArray<string> = [
  '#000000',
  '#808080',
  '#800000',
  '#ff0000',
  '#ffff00',
  '#808000',
  '#008000',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#000080',
  '#ff00ff',
  '#800080',
  '#c0c0c0',
  '#ffffff'
]

const TOOLS: ReadonlyArray<{ id: PaintTool; label: string }> = [
  { id: 'pencil', label: 'Pencil' },
  { id: 'eraser', label: 'Eraser' },
  { id: 'brush', label: 'Brush' }
]

/** Paintbrush replica: canvas drawing with tools, 16-color palette and line width. */
export function PaintbrushApp({ onClose }: AppWindowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawingRef = useRef(false)
  const lastRef = useRef<{ x: number; y: number } | null>(null)

  const [tool, setTool] = useState<PaintTool>('pencil')
  const [color, setColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)
  const [aboutOpen, setAboutOpen] = useState(false)

  useEffect(() => {
    fillWhite()
  }, [])

  function fillWhite(): void {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  function pointOf(event: ReactPointerEvent<HTMLCanvasElement>): { x: number; y: number } | null {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>): void {
    const canvas = canvasRef.current
    const point = pointOf(event)
    if (!canvas || !point) return
    canvas.setPointerCapture(event.pointerId)
    drawingRef.current = true
    lastRef.current = point
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>): void {
    if (!drawingRef.current) return
    const ctx = canvasRef.current?.getContext('2d')
    const point = pointOf(event)
    const last = lastRef.current
    if (!ctx || !point || !last) return
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    lastRef.current = point
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLCanvasElement>): void {
    drawingRef.current = false
    lastRef.current = null
    const canvas = canvasRef.current
    if (canvas?.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>F</u>ile</>}>
          <Win31MenuItem onSelect={fillWhite}><u>N</u>ew</Win31MenuItem>
          <Win31MenuItem accel="Alt+F4" onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setAboutOpen(true)}>About Paintbrush...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 8, padding: 6 }}>
        <div className="demo-paint-tools">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TOOLS.map((entry) => (
              <Win31Button
                key={entry.id}
                small
                pressed={tool === entry.id}
                onClick={() => setTool(entry.id)}
                style={{ width: 64 }}
              >
                {entry.label}
              </Win31Button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 14px)', gap: 2 }}>
            {PALETTE.map((entry) => (
              <Win31Button
                key={entry}
                small
                aria-label={`color ${entry}`}
                onClick={() => setColor(entry)}
                style={{
                  width: 14,
                  height: 14,
                  padding: 0,
                  background: entry,
                  outline: color === entry ? '1px solid var(--win31-border)' : 'none',
                  outlineOffset: 1
                }}
              />
            ))}
          </div>

          <div className="win31-label">Line Width: {lineWidth}</div>
          <Win31Slider
            aria-label="line width"
            min={1}
            max={20}
            value={lineWidth}
            onChange={setLineWidth}
          />

          <Win31Button small onClick={fillWhite}>Clear</Win31Button>
        </div>

        <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{
              background: 'var(--win31-window-bg)',
              border: '1px solid var(--win31-border)',
              display: 'block',
              cursor: 'crosshair',
              touchAction: 'none'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
        </div>
      </div>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="win31ui Paintbrush"
        detail="Canvas drawing demo with Win31 tools and palette."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

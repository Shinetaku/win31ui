import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  Win31Button,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuSeparator,
  Win31MessageBox,
  Win31StatusBar,
  Win31StatusPane
} from '@win31ui/react'

interface AppWindowProps {
  onClose: () => void
}

type Matrix = boolean[][]
type GameStatus = 'ready' | 'playing' | 'won' | 'lost'

const SIZE = 9
const MINE_COUNT = 10
const FLAG = '⚑'
const MINE = '✱'

/** Classic Minesweeper digit colors, keyed by neighbor mine count. */
const NUMBER_COLORS: Record<number, string> = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080'
}

const STATUS_TEXT: Record<GameStatus, string> = {
  ready: 'Ready',
  playing: 'Playing',
  won: 'You won! Click Game > New to play again.',
  lost: 'Boom! Click Game > New to try again.'
}

function makeMatrix(value: boolean): Matrix {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => value))
}

/** Randomly scatter MINE_COUNT mines over the 9x9 field. */
function placeMines(): Matrix {
  const mines = makeMatrix(false)
  let placed = 0
  while (placed < MINE_COUNT) {
    const row = Math.floor(Math.random() * SIZE)
    const col = Math.floor(Math.random() * SIZE)
    if (mines[row]![col]) continue
    mines[row]![col] = true
    placed += 1
  }
  return mines
}

function isInside(row: number, col: number): boolean {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE
}

function neighborMines(mines: Matrix, row: number, col: number): number {
  let count = 0
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if ((dr !== 0 || dc !== 0) && isInside(row + dr, col + dc) && mines[row + dr]![col + dc]) {
        count += 1
      }
    }
  }
  return count
}

/** Reveal `row`,`col` plus the flood-filled region of zero-neighbor cells. */
function floodReveal(mines: Matrix, revealed: Matrix, row: number, col: number): Matrix {
  const next = revealed.map((cells) => [...cells])
  const stack: Array<[number, number]> = [[row, col]]
  while (stack.length > 0) {
    const top = stack.pop()
    if (top === undefined) break
    const [r, c] = top
    if (!isInside(r, c) || next[r]![c] || mines[r]![c]) continue
    next[r]![c] = true
    if (neighborMines(mines, r, c) === 0) {
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          if (isInside(r + dr, c + dc)) stack.push([r + dr, c + dc])
        }
      }
    }
  }
  return next
}

function countSafeRemaining(mines: Matrix, revealed: Matrix): number {
  let count = 0
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (!mines[row]![col] && !revealed[row]![col]) count += 1
    }
  }
  return count
}

/** Minesweeper replica: 9x9 beginner field, flood fill, flags and F2-style New game. */
export function MinesweeperApp({ onClose }: AppWindowProps) {
  const [mines, setMines] = useState<Matrix>(placeMines)
  const [revealed, setRevealed] = useState<Matrix>(() => makeMatrix(false))
  const [flagged, setFlagged] = useState<Matrix>(() => makeMatrix(false))
  const [status, setStatus] = useState<GameStatus>('ready')
  const [aboutOpen, setAboutOpen] = useState(false)

  const isOver = status === 'won' || status === 'lost'
  const flagCount = flagged.flat().filter(Boolean).length

  const newGame = () => {
    setMines(placeMines())
    setRevealed(makeMatrix(false))
    setFlagged(makeMatrix(false))
    setStatus('ready')
  }

  const toggleFlag = (row: number, col: number) => {
    if (isOver || revealed[row]![col]) return
    setFlagged(flagged.map((cells, r) => (r === row ? cells.map((cell, c) => (c === col ? !cell : cell)) : cells)))
  }

  const reveal = (row: number, col: number) => {
    if (isOver || revealed[row]![col] || flagged[row]![col]) return
    if (mines[row]![col]) {
      setRevealed(revealed.map((cells, r) => cells.map((cell, c) => cell || mines[r]![c]!)))
      setStatus('lost')
      return
    }
    const next = floodReveal(mines, revealed, row, col)
    setRevealed(next)
    setStatus(countSafeRemaining(mines, next) === 0 ? 'won' : 'playing')
  }

  const cellContent = (row: number, col: number): ReactNode => {
    if (!revealed[row]![col]) return flagged[row]![col] ? FLAG : ''
    if (mines[row]![col]) return <span style={{ color: '#ff0000' }}>{MINE}</span>
    const count = neighborMines(mines, row, col)
    if (count === 0) return ''
    return <span style={{ color: NUMBER_COLORS[count] }}>{count}</span>
  }

  const cellStyle = (row: number, col: number): CSSProperties => {
    const base: CSSProperties = {
      width: 22,
      height: 22,
      minWidth: 0,
      padding: 0,
      fontSize: 13,
      fontFamily: 'var(--win31-font-ui)'
    }
    if (revealed[row]![col]) {
      return {
        ...base,
        boxShadow: 'none',
        border: '1px solid var(--win31-button-dark)',
        background: mines[row]![col] ? 'var(--win31-button-dark)' : 'var(--win31-button-face)'
      }
    }
    return base
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>G</u>ame</>}>
          <Win31MenuItem accel="F2" onSelect={newGame}>
            <u>N</u>ew
          </Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setAboutOpen(true)}>About Minesweeper...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, background: 'var(--win31-frame)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${SIZE}, 22px)`,
            padding: 4,
            background: 'var(--win31-frame)',
            border: '1px solid var(--win31-border)'
          }}
        >
          {mines.map((cells, row) =>
            cells.map((_, col) => (
              <Win31Button
                key={`${row}-${col}`}
                small
                aria-label={`cell ${row + 1},${col + 1}`}
                style={cellStyle(row, col)}
                onClick={() => reveal(row, col)}
                onContextMenu={(event) => {
                  event.preventDefault()
                  toggleFlag(row, col)
                }}
              >
                {cellContent(row, col)}
              </Win31Button>
            ))
          )}
        </div>
      </div>

      <Win31StatusBar>
        <Win31StatusPane style={{ flex: '0 0 110px' }}>{`Mines: ${MINE_COUNT - flagCount}`}</Win31StatusPane>
        <Win31StatusPane>{STATUS_TEXT[status]}</Win31StatusPane>
      </Win31StatusBar>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="win31ui Minesweeper"
        detail="Beginner field: 9x9 grid with 10 mines. Left-click clears, right-click flags. Press Game > New (F2) to restart."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  Win31Button,
  Win31MenuBar,
  Win31Menu,
  Win31MenuItem,
  Win31MenuSeparator,
  Win31MessageBox
} from '@win31ui/react'

interface AppWindowProps {
  onClose: () => void
}

const SUITS = ['♠', '♥', '♦', '♣'] as const
type Suit = (typeof SUITS)[number]

interface Card {
  suit: Suit
  /** 1 = Ace ... 13 = King. */
  rank: number
}

/** Tableau card; only the last card of a column starts face up. */
interface TableauCard {
  card: Card
  faceUp: boolean
}

interface GameState {
  stock: Card[]
  waste: Card[]
  foundations: Card[][]
  tableau: TableauCard[][]
}

const CARD_WIDTH = 42
const CARD_HEIGHT = 58
const TABLEAU_COLUMNS = 7

const RANK_LABELS: Record<number, string> = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' }

function rankLabel(rank: number): string {
  return RANK_LABELS[rank] ?? String(rank)
}

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank += 1) deck.push({ suit, rank })
  }
  return deck
}

function shuffled(deck: Card[]): Card[] {
  const next = [...deck]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = next[i]!
    next[i] = next[j]!
    next[j] = a
  }
  return next
}

/** Deal a fresh Klondike layout: 7 tableau columns, 4 foundations, stock+waste. */
function deal(): GameState {
  const deck = shuffled(createDeck())
  let index = 0
  const tableau: TableauCard[][] = []
  for (let col = 0; col < TABLEAU_COLUMNS; col += 1) {
    const pile: TableauCard[] = []
    for (let i = 0; i <= col; i += 1) {
      pile.push({ card: deck[index++]!, faceUp: i === col })
    }
    tableau.push(pile)
  }
  return {
    stock: deck.slice(index),
    waste: [],
    foundations: SUITS.map(() => []),
    tableau
  }
}

function cardStyle(): CSSProperties {
  return {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    boxSizing: 'border-box',
    border: '1px solid var(--win31-border)',
    fontFamily: 'var(--win31-font-ui)',
    userSelect: 'none',
    flex: '0 0 auto'
  }
}

function emptySlot(label: string): ReactNode {
  return (
    <div
      aria-label={label}
      style={{ ...cardStyle(), background: 'transparent', color: 'var(--win31-window-bg)', fontSize: 11, textAlign: 'center' }}
    >
      {label}
    </div>
  )
}

interface CardViewProps {
  card?: Card
  faceUp: boolean
  isClickable: boolean
  onClick?: () => void
}

function CardView({ card, faceUp, isClickable, onClick }: CardViewProps) {
  if (card === undefined || !faceUp) {
    return (
      <div
        style={{
          ...cardStyle(),
          background: 'var(--win31-titlebar-active)',
          boxShadow: 'inset 0 0 0 1px var(--win31-button-light)',
          cursor: isClickable ? 'pointer' : 'default'
        }}
        onClick={isClickable ? onClick : undefined}
      />
    )
  }
  const isRed = card.suit === '♥' || card.suit === '♦'
  return (
    <div
      style={{
        ...cardStyle(),
        background: 'var(--win31-window-bg)',
        color: isRed ? '#ff0000' : '#000000',
        position: 'relative',
        cursor: isClickable ? 'pointer' : 'default'
      }}
      onClick={isClickable ? onClick : undefined}
    >
      <span style={{ position: 'absolute', top: 2, left: 3, fontSize: 10, lineHeight: 1 }}>
        {rankLabel(card.rank)}
        {card.suit}
      </span>
      <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 20 }}>
        {card.suit}
      </span>
    </div>
  )
}

/** Simplified Klondike solitaire: click the stock to draw, click a top card to auto-play it to its foundation. */
export function SolitaireApp({ onClose }: AppWindowProps) {
  const [state, setState] = useState<GameState>(deal)
  const [aboutOpen, setAboutOpen] = useState(false)

  const newDeal = () => setState(deal())

  const drawFromStock = () => {
    setState((prev) => {
      if (prev.stock.length === 0) {
        if (prev.waste.length === 0) return prev
        return {
          ...prev,
          stock: [...prev.waste].reverse(),
          waste: []
        }
      }
      const top = prev.stock[prev.stock.length - 1]!
      return { ...prev, stock: prev.stock.slice(0, -1), waste: [...prev.waste, top] }
    })
  }

  const playWasteToFoundation = () => {
    setState((prev) => {
      const card = prev.waste[prev.waste.length - 1]
      if (card === undefined) return prev
      const pileIndex = SUITS.indexOf(card.suit)
      const pile = prev.foundations[pileIndex]!
      if (pile.length + 1 !== card.rank) return prev
      return {
        ...prev,
        waste: prev.waste.slice(0, -1),
        foundations: prev.foundations.map((p, i) => (i === pileIndex ? [...p, card] : p))
      }
    })
  }

  const playTableauToFoundation = (col: number) => {
    setState((prev) => {
      const pile = prev.tableau[col]!
      const top = pile[pile.length - 1]
      if (top === undefined || !top.faceUp) return prev
      const pileIndex = SUITS.indexOf(top.card.suit)
      const foundation = prev.foundations[pileIndex]!
      if (foundation.length + 1 !== top.card.rank) return prev
      const rest = pile.slice(0, -1).map((entry, i) => (i === pile.length - 2 ? { ...entry, faceUp: true } : entry))
      return {
        ...prev,
        tableau: prev.tableau.map((p, i) => (i === col ? rest : p)),
        foundations: prev.foundations.map((p, i) => (i === pileIndex ? [...p, top.card] : p))
      }
    })
  }

  const topWaste = state.waste[state.waste.length - 1]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Win31MenuBar>
        <Win31Menu label={<><u>G</u>ame</>}>
          <Win31MenuItem onSelect={newDeal}>
            <u>D</u>eal
          </Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={onClose}>E<u>x</u>it</Win31MenuItem>
        </Win31Menu>
        <Win31Menu label={<><u>H</u>elp</>}>
          <Win31MenuItem onSelect={() => setAboutOpen(true)}>About Solitaire...</Win31MenuItem>
        </Win31Menu>
      </Win31MenuBar>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, padding: 10, background: '#008000', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              style={{ position: 'relative' }}
              onClick={drawFromStock}
              role="button"
              aria-label="stock"
              title={`${state.stock.length} cards`}
            >
              {state.stock.length === 0 ? emptySlot('Stock') : <CardView card={state.stock[state.stock.length - 1]} faceUp={false} isClickable />}
            </div>
            <div aria-label="waste" style={{ position: 'relative' }}>
              {topWaste === undefined ? emptySlot('Waste') : <CardView card={topWaste} faceUp isClickable onClick={playWasteToFoundation} />}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            {SUITS.map((suit, i) => {
              const pile = state.foundations[i]!
              const top = pile[pile.length - 1]
              return (
                <div key={suit} aria-label={`${suit} foundation`} style={{ position: 'relative' }}>
                  {top === undefined ? emptySlot(suit) : <CardView card={top} faceUp isClickable={false} />}
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          {state.tableau.map((pile, col) => (
            <div key={col} aria-label={`tableau ${col + 1}`} style={{ display: 'flex', flexDirection: 'column', flex: '0 0 auto' }}>
              {pile.length === 0 ? emptySlot('') : null}
              {pile.map((entry, i) => (
                <div key={`${entry.card.suit}-${entry.card.rank}`} style={{ marginTop: i === 0 ? 0 : -40, position: 'relative' }}>
                  <CardView
                    card={entry.card}
                    faceUp={entry.faceUp}
                    isClickable={entry.faceUp && i === pile.length - 1}
                    onClick={() => playTableauToFoundation(col)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Win31Button small onClick={newDeal}>
            Deal
          </Win31Button>
          <span style={{ color: 'var(--win31-window-bg)', fontFamily: 'var(--win31-font-ui)', fontSize: 12 }}>
            Drag &amp; drop is simplified: click a card to send it to its foundation.
          </span>
        </div>
      </div>

      <Win31MessageBox
        open={aboutOpen}
        type="info"
        message="win31ui Solitaire"
        detail="Simplified Klondike. Click the stock to draw one card; click the waste or a face-up tableau top card to auto-play it to its foundation. Game > Deal re-deals."
        buttons={['ok']}
        onResult={() => setAboutOpen(false)}
      />
    </div>
  )
}

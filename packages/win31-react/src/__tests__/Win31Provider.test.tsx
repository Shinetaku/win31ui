import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { applyWin31Theme, Win31Provider, useWin31Theme, win31Themes } from '../theme/Win31Provider'

function Probe() {
  const theme = useWin31Theme()
  return <span data-testid="probe">{theme}</span>
}

afterEach(cleanup)

describe('Win31Provider', () => {
  it('sets data-win31-theme and provides the theme to children', () => {
    render(
      <Win31Provider theme="dark">
        <Probe />
      </Win31Provider>
    )
    expect(document.documentElement.dataset.win31Theme).toBe('dark')
    expect(screen.getByTestId('probe')).toHaveTextContent('dark')
  })

  it('removes the data attribute for the default light theme', () => {
    document.documentElement.dataset.win31Theme = 'dark'
    render(
      <Win31Provider theme="light">
        <Probe />
      </Win31Provider>
    )
    expect(document.documentElement.dataset.win31Theme).toBeUndefined()
    expect(screen.getByTestId('probe')).toHaveTextContent('light')
  })

  it('updates the attribute when theme changes', () => {
    const { rerender } = render(
      <Win31Provider theme="emerald">
        <Probe />
      </Win31Provider>
    )
    rerender(
      <Win31Provider theme="cinnamon">
        <Probe />
      </Win31Provider>
    )
    expect(document.documentElement.dataset.win31Theme).toBe('cinnamon')
  })

  it('exports every theme name from the tokens stylesheet', () => {
    expect([...win31Themes]).toEqual(['light', 'dark', 'fun', 'mahogany', 'emerald', 'cinnamon'])
  })
})

describe('applyWin31Theme', () => {
  it('accepts an explicit root element', () => {
    const root = document.createElement('div')
    applyWin31Theme('fun', root)
    expect(root.dataset.win31Theme).toBe('fun')
    applyWin31Theme('light', root)
    expect(root.dataset.win31Theme).toBeUndefined()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Win31GroupBox } from '../components/GroupBox'

describe('Win31GroupBox', () => {
  it('renders a fieldset with the token class and a legend', () => {
    render(
      <Win31GroupBox legend="Account">
        <p>Fields</p>
      </Win31GroupBox>
    )
    const box = screen.getByRole('group', { name: 'Account' })
    expect(box).toHaveClass('win31-groupbox')
    expect(box.tagName).toBe('FIELDSET')
    expect(screen.getByText('Fields')).toBeInTheDocument()
  })

  it('renders without a legend when omitted', () => {
    const { container } = render(<Win31GroupBox>content</Win31GroupBox>)
    expect(container.querySelector('legend')).toBeNull()
    expect(container.querySelector('fieldset')).toHaveTextContent('content')
  })

  it('passes fieldset attributes through and merges classes', () => {
    render(
      <Win31GroupBox legend="Opts" className="extra" disabled name="opts">
        <input />
      </Win31GroupBox>
    )
    const box = document.querySelector('fieldset.win31-groupbox.extra') as HTMLFieldSetElement
    expect(box).toBeDisabled()
    expect(box).toHaveAttribute('name', 'opts')
    expect(box.querySelector('input')).toBeDisabled()
  })
})

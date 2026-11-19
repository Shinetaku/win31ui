import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Win31Field } from '../components/Field'

describe('Win31Field', () => {
  it('renders label and control in the win31-field row', () => {
    render(
      <Win31Field label="Name:" htmlFor="name">
        <input id="name" />
      </Win31Field>
    )
    expect(screen.getByText('Name:')).toHaveClass('win31-label')
    expect(screen.getByText('Name:')).toHaveAttribute('for', 'name')
    expect(document.querySelector('.win31-field')).not.toBeNull()
    expect(document.getElementById('name')).not.toBeNull()
  })

  it('omits the label element when label is not provided', () => {
    render(
      <Win31Field>
        <input aria-label="lonely" />
      </Win31Field>
    )
    expect(document.querySelector('label')).toBeNull()
    expect(screen.getByRole('textbox', { name: 'lonely' })).not.toBeNull()
  })
})

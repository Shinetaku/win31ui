import { iconSVG } from './icons-data'

export interface Win31AppIconProps {
  /** Icon id from icons-data (e.g. `'filemanager'`, `'folder'`, `'solitaire'`). */
  id: string
  /** Square size in pixels. Defaults to 32. */
  size?: number
}

/** Renders one of the pixel-perfect 32x32 SVG app icons. */
export function Win31AppIcon({ id, size = 32 }: Win31AppIconProps) {
  return (
    <span
      aria-hidden="true"
      className="win31-app-icon"
      style={{ width: size, height: size, display: 'inline-block' }}
      dangerouslySetInnerHTML={{ __html: iconSVG(id) }}
    />
  )
}

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cls } from './Input'
import { useManualDrag } from '../hooks/useManualDrag'

/** Control buttons of a title bar. */
export type Win31WindowControl = 'minimize' | 'maximize' | 'close'

/**
 * How the title bar moves its window:
 * - `none`    — static (default)
 * - `manual`  — pointer dragging handled by this library
 * - `electron`— delegates to the OS via `-webkit-app-region: drag`
 * - `tauri`   — delegates to Tauri via `data-tauri-drag-region`
 */
export type Win31DragMode = 'none' | 'manual' | 'electron' | 'tauri'

export interface Win31TitleBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Centered window caption. */
  title?: ReactNode
  /** Renders the system-menu box on the left. Defaults to true. */
  showSystemMenu?: boolean
  /** Right-aligned control buttons; `false` hides all of them. */
  controls?: ReadonlyArray<Win31WindowControl> | false
  /** Grey bar for background windows. Defaults to true. */
  active?: boolean
  /** Fired when a control button is pressed. */
  onControl?: (control: Win31WindowControl) => void
  /** See {@link Win31DragMode}. Ignored while the window is maximized. */
  dragMode?: Win31DragMode
}

/**
 * Windows 3.1 title bar: 31px tall, navy background when active,
 * system-menu box, centered caption and bevel control buttons.
 */
export const Win31TitleBar = forwardRef<HTMLDivElement, Win31TitleBarProps>(
  function Win31TitleBar(
    {
      title,
      showSystemMenu = true,
      controls = ['minimize', 'maximize', 'close'],
      active = true,
      onControl,
      dragMode = 'none',
      className,
      ...rest
    },
    ref
  ) {
    const manual = useManualDrag(dragMode === 'manual')

    return (
      <div
        ref={ref}
        className={cls(
          'win31-titlebar',
          !active && 'is-inactive',
          dragMode === 'manual' && 'is-manual-drag',
          dragMode === 'electron' && 'is-electron-drag',
          className
        )}
        {...(dragMode === 'tauri' ? { 'data-tauri-drag-region': true } : {})}
        {...(dragMode === 'manual' ? manual : {})}
        {...rest}
      >
        {showSystemMenu ? <span className="win31-sysmenu" aria-hidden="true" /> : null}
        <span className="win31-titlebar-text">{title}</span>
        {controls ? (
          <span className="win31-titlebar-buttons">
            {controls.map((control) => (
              <button
                key={control}
                type="button"
                className="win31-btn-control"
                data-btn={control === 'minimize' ? 'min' : control === 'maximize' ? 'max' : 'close'}
                aria-label={control}
                onClick={() => onControl?.(control)}
              />
            ))}
          </span>
        ) : null}
      </div>
    )
  }
)

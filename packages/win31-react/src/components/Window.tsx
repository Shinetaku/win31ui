import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cls } from './Input'
import { Win31TitleBar, type Win31DragMode, type Win31WindowControl } from './TitleBar'

export interface Win31WindowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Window caption shown in the title bar. */
  title?: ReactNode
  /** Grey title bar for background windows. Defaults to true. */
  active?: boolean
  /** Renders the window pinned to the viewport edges. */
  maximized?: boolean
  /** Renders as a modal-style floating window. */
  dialog?: boolean
  /** Title bar control buttons; `false` hides all of them. */
  controls?: ReadonlyArray<Win31WindowControl> | false
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
  /** See {@link Win31DragMode}. Manual dragging is disabled while maximized. */
  dragMode?: Win31DragMode
  /** Omit the built-in title bar and compose your own. */
  hideTitleBar?: boolean
  /** Extra classes for the body, e.g. `'is-flush'` for edge-to-edge content. */
  bodyClassName?: string
  bodyProps?: Omit<HTMLAttributes<HTMLDivElement>, 'children'>
  children?: ReactNode
}

/**
 * Windows 3.1 window frame: 1px black border, 3px chrome padding,
 * title bar on top and a white body. Use `hideTitleBar` + `Win31TitleBar`
 * for custom bars. In Electron/Tauri pass `dragMode='electron'|'tauri'`
 * to let the host move the real window.
 */
export const Win31Window = forwardRef<HTMLDivElement, Win31WindowProps>(
  function Win31Window(
    {
      title,
      active = true,
      maximized,
      dialog,
      controls = ['minimize', 'maximize', 'close'],
      onMinimize,
      onMaximize,
      onClose,
      dragMode = 'none',
      hideTitleBar,
      bodyClassName,
      bodyProps,
      className,
      children,
      ...rest
    },
    ref
  ) {
    const handleControl = (control: Win31WindowControl) => {
      if (control === 'minimize') onMinimize?.()
      else if (control === 'maximize') onMaximize?.()
      else onClose?.()
    }

    return (
      <div
        ref={ref}
        className={cls('win31-window', maximized && 'is-maximized', dialog && 'is-dialog', className)}
        {...rest}
      >
        {hideTitleBar ? null : (
          <Win31TitleBar
            title={title}
            active={active}
            controls={controls}
            dragMode={maximized ? 'none' : dragMode}
            onControl={handleControl}
          />
        )}
        <div className={cls('win31-window-body', bodyClassName)} {...bodyProps}>
          {children}
        </div>
      </div>
    )
  }
)

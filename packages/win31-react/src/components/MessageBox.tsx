import type { ReactNode } from 'react'
import { Win31Button } from './Button'
import { Win31Dialog } from './Dialog'
import { cls } from './Input'

/** Preset message box buttons. */
export type Win31MessageBoxButton = 'ok' | 'cancel' | 'yes' | 'no' | 'retry' | 'abort' | 'ignore'

/** Icon shown at the left of the message. */
export type Win31MessageBoxType = 'info' | 'warn' | 'stop'

const DEFAULT_LABELS: Record<Win31MessageBoxButton, string> = {
  ok: 'OK',
  cancel: 'Cancel',
  yes: 'Yes',
  no: 'No',
  retry: 'Retry',
  abort: 'Abort',
  ignore: 'Ignore',
}

export interface Win31MessageBoxProps {
  /** Whether the message box is currently shown. */
  open: boolean
  /** Called when the box closes without a result (close control or Esc). */
  onClose?: () => void
  /** Icon at the left of the message. Defaults to `'info'`. */
  type?: Win31MessageBoxType
  /** Main message text. */
  message: ReactNode
  /** Optional secondary text below the message. */
  detail?: ReactNode
  /** Preset buttons, in order. Defaults to `['ok']`. */
  buttons?: ReadonlyArray<Win31MessageBoxButton>
  /** Overrides the default English label of a preset button. */
  buttonLabels?: Partial<Record<Win31MessageBoxButton, ReactNode>>
  /** Called with the id of the pressed preset button. */
  onResult?: (button: string) => void
  /** Preset button drawn with the `is-default` double outline. Defaults to `'ok'`. */
  isDefault?: Win31MessageBoxButton
}

/**
 * Windows 3.1 message box: a {@link Win31Dialog} showing a `win31-msg-icon`,
 * a message (plus optional detail) and a row of preset buttons that report
 * their id via `onResult` before closing.
 */
export function Win31MessageBox({
  open,
  onClose,
  type = 'info',
  message,
  detail,
  buttons = ['ok'],
  buttonLabels,
  onResult,
  isDefault = 'ok',
}: Win31MessageBoxProps) {
  return (
    <Win31Dialog
      open={open}
      onClose={onClose}
      buttons={buttons.map((button) => (
        <Win31Button
          key={button}
          isDefault={button === isDefault}
          onClick={() => {
            onResult?.(button)
            onClose?.()
          }}
        >
          {buttonLabels?.[button] ?? DEFAULT_LABELS[button]}
        </Win31Button>
      ))}
    >
      <div className="win31-msgbox-row">
        <span className={cls('win31-msg-icon', type)} aria-hidden="true" />
        <div>
          <div>{message}</div>
          {detail != null ? <div>{detail}</div> : null}
        </div>
      </div>
    </Win31Dialog>
  )
}

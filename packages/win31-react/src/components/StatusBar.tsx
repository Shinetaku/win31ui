import type { HTMLAttributes } from 'react'
import { cls } from './Input'

export type Win31StatusBarProps = HTMLAttributes<HTMLDivElement>

/** Bottom status strip of a window: place `Win31StatusPane` children inside. */
export function Win31StatusBar({ className, ...rest }: Win31StatusBarProps) {
  return <div className={cls('win31-statusbar', className)} {...rest} />
}

export type Win31StatusPaneProps = HTMLAttributes<HTMLSpanElement>

/** Sunken pane inside the status bar. Text overflows with an ellipsis. */
export function Win31StatusPane({ className, ...rest }: Win31StatusPaneProps) {
  return <span className={cls('win31-status-pane', className)} {...rest} />
}

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react'

interface DragState {
  pointerId: number
  offsetX: number
  offsetY: number
}

/**
 * Pointer-based dragging for `.win31-window`. Enabled only when `enabled` is
 * true; ignores presses originating from buttons (min/max/close) and works
 * with pointer capture so the drag survives fast cursor movement.
 */
export function useManualDrag(enabled: boolean) {
  const state = useRef<DragState | null>(null)

  const findWindow = (element: HTMLElement): HTMLElement | null =>
    element.closest<HTMLElement>('.win31-window')

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || event.button !== 0) return
      if ((event.target as HTMLElement).closest('button')) return
      const bar = event.currentTarget
      const win = findWindow(bar)
      if (!win) return
      const rect = win.getBoundingClientRect()
      state.current = {
        pointerId: event.pointerId,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top
      }
      win.style.position = 'fixed'
      win.style.margin = '0'
      win.style.left = `${rect.left}px`
      win.style.top = `${rect.top}px`
      bar.setPointerCapture(event.pointerId)
    },
    [enabled]
  )

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const drag = state.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const win = findWindow(event.currentTarget)
    if (!win) return
    win.style.left = `${Math.round(event.clientX - drag.offsetX)}px`
    win.style.top = `${Math.round(event.clientY - drag.offsetY)}px`
  }, [])

  const endDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const drag = state.current
    if (!drag || drag.pointerId !== event.pointerId) return
    state.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }, [])

  return { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag }
}

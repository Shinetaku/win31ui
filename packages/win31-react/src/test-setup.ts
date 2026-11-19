import '@testing-library/jest-dom/vitest'

// jsdom lacks the PointerEvent constructor and pointer capture API, both used
// by the drag implementation and by fireEvent.pointerDown in tests.
class PointerEventPolyfill extends MouseEvent {
  public pointerId: number
  public pointerType: string
  public isPrimary: boolean

  constructor(type: string, params: PointerEventInit = {}) {
    super(type, params)
    this.pointerId = params.pointerId ?? 0
    this.pointerType = params.pointerType ?? ''
    this.isPrimary = params.isPrimary ?? false
  }
}

if (typeof window !== 'undefined' && typeof window.PointerEvent === 'undefined') {
  ;(window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventPolyfill
}

if (typeof Element !== 'undefined' && !Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
  Element.prototype.hasPointerCapture = () => false
}

// jsdom does not implement the native dialog modal API used by Win31Dialog.
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open')
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}

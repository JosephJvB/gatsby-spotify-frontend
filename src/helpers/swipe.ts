export type ISwipeCB = (coords: ISwipeCoords) => void
export interface ISwipeCoords {
  startX: number
  endX: number
  startY: number
  endY: number
}
export default class SwipeListener implements ISwipeCoords {
  listening = false
  startX = 0
  endX = 0
  startY = 0
  endY = 0
  cb: ISwipeCB
  constructor(cb: ISwipeCB) {
    this.cb = cb
  }
  onTouchStart(e: React.TouchEvent) {
    this.listening = true
    this.startX = e.touches[0].clientX
    this.startY = e.touches[0].clientY
  }
  onTouchMove(e: React.TouchEvent) {
    if (!this.listening) {
      return
    }
    this.endX = e.touches[e.touches.length - 1].clientX
    this.endY = e.touches[e.touches.length - 1].clientY
  }
  onTouchEnd(): void {
    const coords: ISwipeCoords = {
      startX: this.startX,
      endX: this.endX,
      startY: this.startY,
      endY: this.endY,
    }
    this.startX = 0
    this.endX = 0
    this.startY = 0
    this.endY = 0
    this.listening = false
    return this.cb(coords)
  }
}
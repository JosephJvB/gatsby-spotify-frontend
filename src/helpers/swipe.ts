export type ISwipeDirection = 'none' | 'left' | 'right' | 'up' | 'down'
export type ISwipeCB = (direction: ISwipeDirection) => void
export interface ISwipeCoords {
  startX: number
  endX: number
  startY: number
  endY: number
}

const SWIPE_PX_THRESHHOLD = 20

export default class SwipeListener implements ISwipeCoords {
  listening = false
  startX = 0
  endX = 0
  startY = 0
  endY = 0
  constructor(
    private directions: ISwipeDirection[],
    private cb: ISwipeCB,
  ) {}
  onTouchStart(e: TouchEvent) {
    this.listening = true
    this.startX = e.touches[0].clientX
    this.startY = e.touches[0].clientY
    this.endX = this.startX
    this.endY = this.startY
  }
  onTouchMove(e: TouchEvent) {
    if (!this.listening) {
      return
    }
    this.endX = e.touches[e.touches.length - 1].clientX
    this.endY = e.touches[e.touches.length - 1].clientY
  }
  onTouchEnd(): void {
    const diffX = this.endX - this.startX
    const diffY = this.endY - this.startY
    const absX = Math.abs(diffX)
    const absY = Math.abs(diffY)
    if (absX < SWIPE_PX_THRESHHOLD && absY < SWIPE_PX_THRESHHOLD) {
      return this.complete('none')
    }
    if (absX > absY) {
      return this.complete(
        diffX > 0 ? 'right' : 'left'
      )
    }
    if (absY > absX) {
      return this.complete(
        diffY > 0 ? 'down' : 'up'
      )
    }
  }
  private complete(direction: ISwipeDirection) {
    this.startX = 0
    this.endX = 0
    this.startY = 0
    this.endY = 0
    this.listening = false

    if (this.directions.includes(direction)) {
      this.cb(direction)
    }
  }
}
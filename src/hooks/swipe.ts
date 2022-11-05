import React from 'react';
import SwipeListener, { ISwipeDirection } from '../helpers/swipe';

// i think this is a bad hook
// if user swipes right twice, direction is the same, which does not trigger a re-render
// so I use timeout to reset direction, so next swipe has a new direction.
// this causes many re-renders of component with useEffect(() => {}, [direction])
// it's not causing issues, but it is not a good solution.

export const useSwipe = (ref: React.RefObject<HTMLDivElement>) => {
  const [direction, setDirection] = React.useState<ISwipeDirection>('none')
  const swipeListener = new SwipeListener(['left', 'right', 'up', 'down'], (direction: ISwipeDirection) => {
    setDirection(direction)
    setTimeout(() => {
      setDirection('none')
    }, 5)
  })
  ref.current?.addEventListener('touchstart', (event: TouchEvent) => {
    swipeListener.onTouchStart(event)
  })
  ref.current?.addEventListener('touchmove', (event: TouchEvent) => {
    swipeListener.onTouchMove(event)
  })
  ref.current?.addEventListener('touchend', () => {
    swipeListener.onTouchEnd()
  })
  return direction
}
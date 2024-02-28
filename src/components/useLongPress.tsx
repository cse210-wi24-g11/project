import { useEffect, useRef, useState } from 'react'

type MouseEventWithMovement = React.MouseEvent & {
  movementX?: number
  movementY?: number
}

export const useLongPress = (callback: () => void, timeout: number = 300) => {
  const [startLongPress, setStartLongPress] = useState(false)

  const timerIdRef = useRef<number | null>(null)
  useEffect(() => {
    if (startLongPress) {
      timerIdRef.current = window.setTimeout(() => {
        setStartLongPress(false)
        callback()
      }, timeout)
    } else if (timerIdRef.current) {
      clearTimeout(timerIdRef.current)
    }
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    }
  }, [callback, timeout, startLongPress])

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchMove: () => setStartLongPress(false),
    onMouseMove: (e: MouseEventWithMovement) => {
      // Check if properties are defined before using them
      if (e.movementX !== undefined && e.movementY !== undefined) {
        if (e.movementX !== 0 || e.movementY !== 0) {
          setStartLongPress(false)
        }
      }
    },
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
  }
}

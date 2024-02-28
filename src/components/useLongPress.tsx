// src/components/mood_icon/useLongPress.tsx
import { useEffect, useRef } from 'react'

export const useLongPress = (callback: () => void, timeout: number = 300) => {
  const startLongPress = useRef<boolean>(false)
  const timerIdRef = useRef<number | null>(null)

  useEffect(() => {
    const handleMouseDown = () => {
      startLongPress.current = true
      timerIdRef.current = window.setTimeout(() => {
        startLongPress.current && callback()
        startLongPress.current = false
      }, timeout)
    }

    const handleMouseUp = () => {
      startLongPress.current = false
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    }

    const handleMouseLeave = () => {
      startLongPress.current = false
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    }

    const handleTouchMove = () => {
      startLongPress.current = false
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    }

    const handleTouchStart = () => {
      startLongPress.current = true
      timerIdRef.current = window.setTimeout(() => {
        startLongPress.current && callback()
        startLongPress.current = false
      }, timeout)
    }

    const handleTouchEnd = () => {
      startLongPress.current = false
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)

      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    }
  }, [callback, timeout])

  return {
    onMouseDown: () => startLongPress.current && callback(),
    onMouseUp: () => (startLongPress.current = false),
    onMouseLeave: () => (startLongPress.current = false),
    onTouchMove: () => (startLongPress.current = false),
    onMouseMove: (e: React.MouseEvent) => {
      // Optionally handle mouse move events
      console.log(e)
    },
    onTouchStart: () => startLongPress.current && callback(),
    onTouchEnd: () => (startLongPress.current = false),
  }
}

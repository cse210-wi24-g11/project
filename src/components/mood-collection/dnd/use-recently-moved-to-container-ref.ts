import { useEffect, useRef } from 'react'

export function useRecentlyMovedToNewContainerRef(items: unknown) {
  const recentlyMovedToNewContainerRef = useRef(false)

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainerRef.current = false
    })
  }, [items])

  return recentlyMovedToNewContainerRef
}

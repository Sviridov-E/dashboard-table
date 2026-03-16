import { useCallback, useEffect, useRef, useState } from 'react'

export const useScrolledDown = () => {
  const [scrolledDown, setScrolledDown] = useState(
    document.documentElement.clientHeight +
      document.documentElement.scrollTop ===
      document.documentElement.scrollHeight
  )

  const observerRef = useRef<IntersectionObserver | null>(null)

  const setScrollAnchorRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Если сенсор пересекается с низом экрана, значит мы проскроллили вниз
          setScrolledDown(entry.isIntersecting)
        },
        {
          threshold: [0.1],
          rootMargin: '0px',
        }
      )

      observer.observe(node)
      observerRef.current = observer
    }
  }, [])

  useEffect(
    () => () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    },
    []
  )

  return { setScrollAnchorRef, scrolledDown }
}

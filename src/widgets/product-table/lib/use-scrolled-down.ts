import { useEffect, useState } from 'react'

export const useScrolledDown = ({
  scrollRef,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>
}) => {
  const [scrolledDown, setScrolledDown] = useState(
    document.documentElement.clientHeight +
      document.documentElement.scrollTop ===
      document.documentElement.scrollHeight
  )
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Если сенсор пересекается с низом экрана, значит мы проскроллили вниз
        setScrolledDown(entry.isIntersecting)
      },
      { threshold: [1] }
    )

    if (scrollRef.current) {
      observer.observe(scrollRef.current)
    }

    return () => observer.disconnect()
  }, [scrollRef])

  return { scrollRef, scrolledDown }
}

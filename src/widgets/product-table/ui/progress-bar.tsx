import { Progress } from '@/shared/ui/progress'
import { useEffect, useState } from 'react'

export const ProgressBar = () => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let first = true
    const interval = setInterval(() => {
      setValue(prev => {
        if (first) {
          first = false
          return 30
        }
        if (prev >= 95) return prev

        const diff = Math.random() * 30
        return Math.min(prev + diff, 95)
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <Progress
      value={value}
      className='h-full w-full rounded-none bg-transparent duration-300'
    />
  )
}

import { Input } from '@/shared/ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'

export const SearchProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [value, setValue] = useState(searchParams.get('q') || '')

  const debouncedSet = useDebouncedCallback((value: string) => {
    setSearchParams(searchParams => {
      const resultParams = new URLSearchParams(searchParams)
      if (value.trim()) resultParams.set('q', value)
      else resultParams.delete('q')
      return resultParams
    })
  }, 700)

  return (
    <div className='relative w-full max-w-sm'>
      <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        className='pl-9'
        placeholder='Поиск по названию...'
        value={value}
        onChange={e => {
          const newValue = e.target.value
          setValue(newValue)
          debouncedSet(newValue)
        }}
      />
    </div>
  )
}

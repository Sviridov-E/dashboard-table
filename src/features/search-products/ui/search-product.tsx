import { Button } from '@/shared/ui'
import { Input } from '@/shared/ui/input'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'

export const SearchProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [value, setValue] = useState(searchParams.get('q') || '')

  const debouncedSet = useDebouncedCallback((value: string) => {
    setSearchParams(searchParams => {
      const resultParams = new URLSearchParams(searchParams)
      if (value.trim()) {
        resultParams.set('q', value)
        resultParams.delete('page')
      } else resultParams.delete('q')
      return resultParams
    })
  }, 700)

  return (
    <div className='relative w-full'>
      <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        className='h-12 border-0 bg-neutral-100 pl-9 md:text-sm'
        placeholder='Найти'
        value={value}
        onChange={e => {
          const newValue = e.target.value
          setValue(newValue)
          debouncedSet(newValue)
        }}
      />

      {value && (
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 p-0 hover:bg-transparent hover:text-foreground active:-translate-y-1/2'
          onClick={() => {
            setValue('')
            debouncedSet.cancel()
            setSearchParams(searchParams => {
              const resultParams = new URLSearchParams(searchParams)
              resultParams.delete('q')
              return resultParams
            })
          }}
        >
          <X className='h-4 w-4' />
        </Button>
      )}
    </div>
  )
}

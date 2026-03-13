import { Field, FieldLabel } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'

import { User } from 'lucide-react'
import { useId } from 'react'

export const SignInInput = ({
  label,
  type,
  placeholder,
  className,
}: {
  label: string
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  className?: string
}) => {
  const id = useId()
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id} className='text-lg'>
        {label}
      </FieldLabel>
      <div className='relative'>
        <User
          className='absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'
          size={24}
        />
        <Input
          className='h-14 pl-13 md:text-lg'
          placeholder={placeholder}
          id={id}
          type={type}
        />
      </div>
    </Field>
  )
}

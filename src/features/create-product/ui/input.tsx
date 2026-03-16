import { cn } from '@/shared/lib'
import { Field, FieldDescription, FieldLabel } from '@/shared/ui/field'
import { Input as ShadcnInput } from '@/shared/ui/input'

import { useId, type HTMLProps } from 'react'

export const Input = ({
  label,
  className,
  error,
  ...inputProps
}: {
  label: string
  placeholder?: string
  className?: string
  error?: string | null
} & HTMLProps<HTMLInputElement>) => {
  const id = useId()
  return (
    <Field className={cn(className, 'gap-1')} data-invalid={!!error}>
      <FieldLabel htmlFor={id} className='mb-0 text-lg'>
        {label}
      </FieldLabel>
      <div>
        <ShadcnInput
          className='h-10 md:text-lg'
          {...inputProps}
          aria-invalid={!!error}
          id={id}
        />
      </div>
      {!!error && <FieldDescription>{error}</FieldDescription>}
    </Field>
  )
}

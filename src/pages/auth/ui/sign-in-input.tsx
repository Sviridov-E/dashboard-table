import { Field, FieldDescription, FieldLabel } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'

import React, { useId, type HTMLProps } from 'react'

export const SignInInput = ({
  label,
  className,
  error,
  Icon,
  actionButton,
  ...inputProps
}: {
  label: string
  placeholder?: string
  className?: string
  error?: string | null
  Icon: React.ForwardRefExoticComponent<
    Omit<{ className?: string; size?: number }, 'ref'> &
      React.RefAttributes<SVGSVGElement>
  >
  actionButton?: React.ReactNode
} & HTMLProps<HTMLInputElement>) => {
  const id = useId()
  return (
    <Field className={className} data-invalid={!!error}>
      <FieldLabel htmlFor={id} className='text-lg'>
        {label}
      </FieldLabel>
      <div className='relative'>
        <Icon
          className='absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'
          size={24}
        />
        <Input
          className='h-14 pl-13 md:text-lg'
          {...inputProps}
          aria-invalid={!!error}
          id={id}
        />
        {actionButton}
      </div>
      {!!error && <FieldDescription>{error}</FieldDescription>}
    </Field>
  )
}

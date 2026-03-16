import { useUserStore } from '@/entities/user'
import { validation } from '@/shared/lib'
import { Button } from '@/shared/ui'
import { Checkbox } from '@/shared/ui/checkbox'
import { Field } from '@/shared/ui/field'
import { Label } from '@/shared/ui/label'
import { Spinner } from '@/shared/ui/spinner'
import { Lock, LockKeyhole, UnlockKeyhole, User, X } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { login } from './lib/login'
import { Logo } from './ui/logo'
import { SignInInput } from './ui/sign-in-input'

interface AuthFormValues {
  username: string
  password: string
  remember: boolean
}

export const AuthPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    resetField,
  } = useForm<AuthFormValues>()

  const { user, idleStatus } = useUserStore()

  const navigate = useNavigate()

  const [pending, setPending] = useState(false)

  const onSubmit: SubmitHandler<AuthFormValues> = async ({
    username,
    password,
    remember,
  }) => {
    setPending(true)
    try {
      await login({ username, password, remember })
      navigate('/', { replace: true })
      setPending(false)
    } catch (e) {
      setPending(false)
      toast.error('Ошибка', {
        description:
          e instanceof Error ? e.message : 'При аутентификации возникла ошибка',
      })
    }
  }

  const [showPass, setShowPass] = useState(false)

  if (user && idleStatus === 'done') return <Navigate to='/' />

  return (
    <div className='flex min-h-screen w-screen items-center justify-center'>
      <div className='w-131.75 rounded-4xl bg-card p-1.5  shadow-[0_24px_32px_#0000000a]'>
        <div className='p-px rounded-[calc(var(--radius-4xl)-6px)] bg-linear-to-b from-20% from-neutral-200 to-transparent'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='bg-card md:px-12 px-6 py-12 flex flex-col items-center rounded-[calc(var(--radius-4xl)-7px)] bg-linear-to-b to-50% from-[#23232308] to-transparent'
          >
            <Logo className='mb-8' />

            <h1 className='text-center text-3xl md:text-[40px]/[110%] font-semibold tracking-[-0.015em] text-gray-800'>
              Добро пожаловать!
            </h1>

            <span className='mt-3  block text-center text-lg/6 font-medium text-gray-300'>
              Пожалуйста, авторизуйтесь
            </span>

            <div className='w-full'>
              <SignInInput
                {...register('username', {
                  required: validation.required(),
                  maxLength: validation.maxLength(15),
                  minLength: validation.minLength(4),
                })}
                error={errors.username ? errors.username.message : null}
                label='Логин'
                className='mt-8'
                Icon={User}
                actionButton={
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-1 top-1/2 h-12 w-12 -translate-y-1/2 active:-translate-y-1/2 p-0 hover:bg-transparent hover:text-gray-500 focus:border-none focus:ring-0! text-gray-300'
                    onClick={() => {
                      resetField('username')
                    }}
                  >
                    <X className='size-6' />
                  </Button>
                }
              />
              <SignInInput
                {...register('password', {
                  required: validation.required(),
                  maxLength: validation.maxLength(15),
                  minLength: validation.minLength(8),
                })}
                error={errors.password ? errors.password.message : null}
                label='Пароль'
                type={showPass ? 'text' : 'password'}
                className='mt-4'
                Icon={Lock}
                actionButton={
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-1 top-1/2 h-12 w-12 -translate-y-1/2 active:-translate-y-1/2 p-0 hover:bg-transparent hover:text-gray-500 focus:border-none focus:ring-0! text-gray-300'
                    onClick={() => {
                      setShowPass(state => !state)
                    }}
                  >
                    {showPass ? (
                      <UnlockKeyhole className='size-6' />
                    ) : (
                      <LockKeyhole className='size-6' />
                    )}
                  </Button>
                }
              />
            </div>

            <Field orientation='horizontal' className='mt-4'>
              <Controller
                name='remember'
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Checkbox
                      id='remember-checkbox'
                      checked={value}
                      onCheckedChange={onChange}
                    />
                  )
                }}
              />
              <Label
                htmlFor='remember-checkbox'
                className='text-base text-gray-400'
              >
                Запомнить данные
              </Label>
            </Field>

            <Button className='mt-5 w-full relative' disabled={pending}>
              {pending ? <Spinner className='size-7' /> : 'Войти'}
            </Button>

            <div className='mt-4 w-full flex items-center gap-2.5'>
              <hr className='grow border-gray-300' />
              <span className='shrink-0 text-base text-gray-300'>или</span>
              <hr className='grow border-gray-300' />
            </div>

            <div className='mt-8'>
              <span className='text-lg text-gray-500'>
                Нет аккаунта?
                <Button variant='link' className=' h-auto underline'>
                  Создать
                </Button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

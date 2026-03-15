import { authFetch } from '@/entities/auth'
import { useUserStore } from '@/entities/user'
import { validation } from '@/shared/lib'
import { Button } from '@/shared/ui'
import { Checkbox } from '@/shared/ui/checkbox'
import { Field } from '@/shared/ui/field'
import { Label } from '@/shared/ui/label'
import { useEffect } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { login } from './lib/login'
import { SignInInput } from './ui/SignInInput'

interface AuthFormValues {
  username: string
  password: string
  remember: boolean
}

// @ts-expect-error temporary
window.isAuth = () => {
  try {
    authFetch('/api/auth/me').then(console.log)
  } catch (e) {
    console.error(e)
  }
}
export const AuthPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AuthFormValues>()

  const { user } = useUserStore()

  useEffect(() => {
    // @ts-expect-error temporary
    window.getUser = () => {
      console.log(user)
    }
  }, [user])

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<AuthFormValues> = async ({
    username,
    password,
    remember,
  }) => {
    try {
      await login({ username, password, remember })
      navigate('/', { replace: true })
    } catch (e) {
      toast.error('Ошибка', {
        description:
          e instanceof Error ? e.message : 'При аутентификации возникла ошибка',
      })
    }
  }

  return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-gray-50'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-131.75 rounded-3xl bg-white p-12'
      >
        <h1 className='text-center text-[40px]/[110%] font-semibold tracking-[-0.015em] text-gray-800'>
          Добро пожаловать!
        </h1>
        <span className='mt-3 block text-center text-lg/6 font-medium text-gray-200'>
          Пожалуйста, авторизуйтесь
        </span>

        <div>
          <SignInInput
            {...register('username', {
              required: validation.required(),
              maxLength: validation.maxLength(15),
              minLength: validation.minLength(4),
            })}
            error={errors.username ? errors.username.message : null}
            label='Логин'
            className='mt-8'
          />
          <SignInInput
            {...register('password', {
              required: validation.required(),
              maxLength: validation.maxLength(15),
              minLength: validation.minLength(8),
            })}
            error={errors.password ? errors.password.message : null}
            label='Пароль'
            type='password'
            className='mt-4'
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
          <Label htmlFor='remember-checkbox'>Запомнить данные</Label>
        </Field>

        <Button className='mt-5 w-full'>Войти</Button>
      </form>
    </div>
  )
}

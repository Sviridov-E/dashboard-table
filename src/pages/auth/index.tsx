import { Button } from '@/shared/ui'
import { Checkbox } from '@/shared/ui/checkbox'
import { Field } from '@/shared/ui/field'
import { Label } from '@/shared/ui/label'
import { SignInInput } from './ui/SignInInput'

export const AuthPage = () => {
  return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-gray-50'>
      <div className='w-131.75 rounded-3xl bg-white p-12'>
        <h1 className='text-center text-[40px]/[110%] font-semibold tracking-[-0.015em] text-gray-800'>
          Добро пожаловать!
        </h1>
        <span className='mt-3 block text-center text-lg/6 font-medium text-gray-200'>
          Пожалуйста, авторизуйтесь
        </span>

        <div>
          <SignInInput label='Логин' className='mt-8' />
          <SignInInput label='Пароль' type='password' className='mt-4' />
        </div>

        <Field orientation='horizontal' className='mt-4'>
          <Checkbox id='remember-checkbox' name='remember-checkbox' />
          <Label htmlFor='remember-checkbox'>Запомнить данные</Label>
        </Field>

        <Button className='mt-5 w-full'>Войти</Button>
      </div>
    </div>
  )
}

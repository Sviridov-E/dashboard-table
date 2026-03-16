import { Spinner } from './spinner'

export const FullscreenSpinner = () => (
  <div className='flex h-screen w-screen items-center justify-center'>
    <Spinner className='size-16' />
  </div>
)

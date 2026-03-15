import { AuthPage } from '@/pages/auth'
import { DashboardPage } from '@/pages/dashboard'
import { Toaster } from '@/shared/ui/sonner'
import { useEffect } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import { checkUser } from './lib/check-auth'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
])

function App() {
  useEffect(() => {
    checkUser()
  }, [])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position='bottom-center' richColors />
    </>
  )
}

export default App

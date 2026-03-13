import { AuthPage } from '@/pages/auth'
import { DashboardPage } from '@/pages/dashboard'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '*',
    element: <Navigate to='/login' replace />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App

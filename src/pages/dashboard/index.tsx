import { useUserStore } from '@/entities/user'
import { Navigate } from 'react-router-dom'

export const DashboardPage = () => {
  const { user } = useUserStore()

  if (!user) {
    return <Navigate to='/login' />
  }

  return <h1>Dashboard Page</h1>
}

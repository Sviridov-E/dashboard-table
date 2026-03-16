import { useUserStore } from '@/entities/user'
import { FullscreenSpinner } from '@/shared/ui'
import { ProductTable } from '@/widgets/product-table'
import { Navigate } from 'react-router-dom'

export const DashboardPage = () => {
  const user = useUserStore(store => store.user)
  const idleStatus = useUserStore(store => store.idleStatus)

  if (!user) {
    if (idleStatus !== 'done') return <FullscreenSpinner />

    return <Navigate to='/login' />
  }

  return <ProductTable />
}

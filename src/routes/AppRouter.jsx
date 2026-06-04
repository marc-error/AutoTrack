import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import HomePage from '../pages/HomePage'
import SearchPage from '../pages/SearchPage'
import BrowsePage from '../pages/BrowsePage'
import InventoryPage from '../pages/InventoryPage'
import VehiclePage from '../pages/VehiclePage'
import BillingPage from '../pages/BillingPage'
import ReportsPage from '../pages/ReportsPage'
import NotificationPage from '../pages/NotificationPage'
import MembersPage from '../pages/MembersPage'
import HistoryPage from '../pages/HistoryPage'
import AccountPage from '../pages/AccountPage'
import ProtectedRoute from '../utils/protectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'browse', element: <BrowsePage /> },
      {
        path: 'inventory',
        element: (
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'vehicle',
        element: (
          <ProtectedRoute>
            <VehiclePage />
          </ProtectedRoute>
        )
      },
      {
        path: 'billing',
        element: (
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute requiredRole="manager">
            <ReportsPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'notification',
        element: (
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'members',
        element: (
          <ProtectedRoute requiredRole="admin">
            <MembersPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        )
      },
      { path: 'account', element: <AccountPage /> },
    ],
  },
])

export default router

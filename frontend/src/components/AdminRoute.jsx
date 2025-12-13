import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, accessToken } = useAuth()
  const location = useLocation()

  if (!accessToken) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  const roles = Array.isArray(user?.roles) ? user.roles : []
  const isAdmin = roles.includes('System_Admin') || roles.includes('Hospital_Admin')
  if (!isAdmin) return <Navigate to="/" replace /> // Hoặc trang "Không có quyền truy cập"

  return children
}

import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'

export default function DashboardLayout() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}

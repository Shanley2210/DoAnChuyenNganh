import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { accessToken, logout } = useAuth()
  const navigate = useNavigate()
  const onLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <nav className="appbar">
      <div className="container" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/">Home</Link>
        <Link to="/specialties">Specialties</Link>
        <Link to="/services">Services</Link>
        <Link to="/doctor">Doctors</Link>
        <Link to="/doctor/appointments">My Appointments</Link>
        <Link to="/patient/profile">My Profile</Link>
        <Link to="/patient/appointments/edit">Edit Appointment</Link>
        <Link to="/patient/appointments/cancel">Cancel Appointment</Link>
        <Link to="/admin/create-hospital-admin">Create Hospital Admin</Link>
        <Link to="/admin/permissions">Permissions</Link>
        <div className="spacer" />
        {accessToken ? (
          <button className="btn btn-primary" onClick={onLogout}>Logout</button>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import VerifyOtp from './pages/auth/VerifyOtp'
import CreateHospitalAdmin from './pages/admin/CreateHospitalAdmin'
import Permissions from './pages/admin/Permissions'
import Doctors from './pages/doctor/Doctors'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import Profile from './pages/patient/Profile'
import EditAppointment from './pages/patient/EditAppointment'
import CancelAppointment from './pages/patient/CancelAppointment'
import Specialties from './pages/Specialties'
import Services from './pages/Services'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          <Route path="/admin/create-hospital-admin" element={<ProtectedRoute><CreateHospitalAdmin /></ProtectedRoute>} />
          <Route path="/admin/permissions" element={<ProtectedRoute><Permissions /></ProtectedRoute>} />

          <Route path="/doctor" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/doctor/appointments" element={<ProtectedRoute><DoctorAppointments /></ProtectedRoute>} />

          <Route path="/patient/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/patient/appointments/edit" element={<ProtectedRoute><EditAppointment /></ProtectedRoute>} />
          <Route path="/patient/appointments/cancel" element={<ProtectedRoute><CancelAppointment /></ProtectedRoute>} />

          <Route path="/specialties" element={<Specialties />} />
          <Route path="/services" element={<Services />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}

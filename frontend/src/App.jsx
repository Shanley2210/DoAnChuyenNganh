import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import AdminLayout from './layouts/AdminLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Auth Pages
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import VerifyOtp from './pages/auth/VerifyOtp'

// Admin Pages
import CreateHospitalAdmin from './pages/admin/CreateHospitalAdmin'
import Permissions from './pages/admin/Permissions'
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'

// Doctor Pages
import Doctors from './pages/patient/Doctors'
import DoctorAppointments from './pages/doctor/DoctorAppointments'

// Patient Pages
import Profile from './pages/patient/Profile'
import EditAppointment from './pages/patient/EditAppointment'
import CancelAppointment from './pages/patient/CancelAppointment'
import PatientDashboard from './pages/patient/Dashboard'
import PatientAppointments from './pages/patient/PatientAppointments'
import CreatePatientProfile from './pages/patient/CreatePatientProfile'

// Public Pages
import Home from './pages/Home'
import Specialties from './pages/Specialties'
import Services from './pages/Services'

// Route Guards
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<DashboardLayout />} >
        <Route index element={<Home />} />
        <Route path="specialties" element={<Specialties />} />
        <Route path="services" element={<Services />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* Dashboard Routes (Patient, Doctor) */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<Doctors />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/patient/profile" element={<Profile />} />
        <Route path="/patient/profile/create" element={<CreatePatientProfile />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/patient/appointments/edit" element={<EditAppointment />} />
        <Route path="/patient/appointments/cancel" element={<CancelAppointment />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="create-hospital-admin" element={<CreateHospitalAdmin />} />
        <Route path="permissions" element={<Permissions />} />
        <Route path="users" element={<ManageUsers />} />
        {/* Thêm các route admin khác ở đây */}
      </Route>

      {/* Not Found */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}


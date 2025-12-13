import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import VerifyOtp from './pages/auth/VerifyOtp';

// Admin Pages
import CreateHospitalAdmin from './pages/admin/CreateHospitalAdmin';
import Permissions from './pages/admin/Permissions';
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';

// Patient Pages
import Profile from './pages/patient/Profile';
import CreatePatientProfile from './pages/patient/CreatePatientProfile';

// Public Pages
import Home from './pages/Home';
import Specialties from './pages/Specialties';
import Services from './pages/Services';

// Route Guards
import AdminRoute from './components/AdminRoute';
import DetailDoctor from './pages/patient/DetailDortor';
import PatientAppointment from './pages/patient/PatientAppointment';
import DoctorRoute from './components/DoctorRoute';
import DoctorLayout from './layouts/DoctorLayout';
import DoctorDashboard from './pages/doctor/DoctorDashBoard';
import AllDoctor from './pages/patient/AllDoctor';
import AllService from './pages/patient/AllService';
import AllSpecialty from './pages/patient/AllSpecialty';
import DoctorSpeciaty from './pages/patient/DoctorSpeciaty';

export default function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/' element={<DashboardLayout />}>
                <Route index element={<Home />} />
                <Route path='specialties' element={<Specialties />} />
                <Route path='services' element={<Services />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/verify-otp' element={<VerifyOtp />} />

                <Route path='/patient/profile' element={<Profile />} />
                <Route
                    path='/patient/profile/create'
                    element={<CreatePatientProfile />}
                />
                <Route path='/doctor/detail/:id' element={<DetailDoctor />} />
                <Route
                    path='/patient-appointment'
                    element={<PatientAppointment />}
                />
                <Route path='/all-doctors' element={<AllDoctor />} />
                <Route path='/all-services' element={<AllService />} />
                <Route path='/all-specialty' element={<AllSpecialty />} />
                <Route
                    path='/doctor-specialty/:id'
                    element={<DoctorSpeciaty />}
                />
            </Route>

            {/* Admin Routes */}
            <Route
                path='/admin'
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route
                    path='create-hospital-admin'
                    element={<CreateHospitalAdmin />}
                />
                <Route path='permissions' element={<Permissions />} />
                <Route path='users' element={<ManageUsers />} />
                {/* Thêm các route admin khác ở đây */}
            </Route>

            <Route
                path='/doctor'
                element={
                    <DoctorRoute>
                        <DoctorLayout />
                    </DoctorRoute>
                }
            >
                <Route index element={<DoctorDashboard />} />
            </Route>

            {/* Not Found */}
            <Route path='*' element={<Navigate to='/' />} />
        </Routes>
    );
}

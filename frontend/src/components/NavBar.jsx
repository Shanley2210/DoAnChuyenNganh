import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, accessToken, logout } = useAuth()
  const navigate = useNavigate()
  const onLogout = () => {
    logout()
    navigate('/')
  }
  const roles = Array.isArray(user?.roles) ? user.roles : []
  const isAdmin = roles.includes('System_Admin') || roles.includes('Hospital_Admin')
  const isDoctor = roles.includes('Doctor')
  return (
    <nav className="appbar">
      <div className="container" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {!accessToken && (
          <>
            <Link to="/">Trang chủ</Link>
            <Link to="/specialties">Chuyên khoa</Link>
            <Link to="/services">Dịch vụ</Link>
            <Link to="/doctor">Bác sĩ</Link>
          </>
        )}
        {accessToken && isAdmin && (
          <>
            <Link to="/admin/permissions">Phân quyền</Link>
            <Link to="/admin/create-hospital-admin">Tạo admin</Link>
            <Link to="/admin/users">Quản lý tài khoản</Link>
          </>
        )}
        {accessToken && !isAdmin && isDoctor && (
          <>
            <Link to="/">Trang chủ</Link>
            <Link to="/specialties">Chuyên khoa</Link>
            <Link to="/services">Dịch vụ</Link>
            <Link to="/doctor">Bác sĩ</Link>
            <Link to="/doctor/appointments">Lịch hẹn của bác sĩ</Link>
          </>
        )}
        {accessToken && !isAdmin && !isDoctor && (
          <>
            <Link to="/">Trang chủ</Link>
            <Link to="/specialties">Chuyên khoa</Link>
            <Link to="/services">Dịch vụ</Link>
            <Link to="/doctor">Bác sĩ</Link>
            <Link to="/patient/appointments">Hồ sơ bệnh nhân</Link>
            <Link to="/patient/profile/create">Tạo hồ sơ bệnh nhân</Link>
            <Link to="/patient/appointments/edit">Chỉnh sửa lịch hẹn</Link>
            <Link to="/patient/appointments/cancel">Hủy lịch hẹn</Link>
          </>
        )}
        <div className="spacer" />
        {accessToken ? (
          <button className="btn btn-primary" onClick={onLogout}>Đăng xuất</button>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { noAuthApi } from '../../services/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRegister = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const { data } = await noAuthApi.post('/api/auth/register', form)
      if (data.errCode === 0) {
        setMsg('Đăng ký thành công. Vui lòng kiểm tra email để nhận OTP.')
        setStep(2)
      } else {
        setMsg(data.errMessage || 'Lỗi')
      }
    } catch (err) {
      setMsg('Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const { data } = await noAuthApi.post('/api/auth/verify-email', { email: form.email, otp })
      if (data.errCode === 0) {
        setMsg('Xác thực email thành công. Bạn có thể đăng nhập ngay bây giờ.')
        setTimeout(() => navigate('/'), 1500)
      } else {
        setMsg(data.errMessage || 'Lỗi')
      }
    } catch (err) {
      setMsg('Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setMsg('')
    setLoading(true)
    try {
      const { data } = await noAuthApi.post('/api/auth/resend-otp', { email: form.email })
      if (data.errCode === 0) {
        setMsg('Đã gửi lại OTP. Vui lòng kiểm tra email.')
      } else {
        setMsg(data.errMessage || 'Lỗi')
      }
    } catch (err) {
      setMsg('Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: '24px auto' }}>
      <h2>Đăng ký</h2>
      <p className="text-muted" style={{ marginBottom: 12 }}>
        {step === 1 ? 'Tạo tài khoản mới.' : 'Nhập mã OTP được gửi đến email của bạn.'}
      </p>
      {step === 1 ? (
        <form onSubmit={handleRegister} className="form-grid">
          <div>
            <label>Họ tên</label>
            <input className="input" name="name" placeholder="Nguyễn Văn A" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label>Email</label>
            <input className="input" type="email" name="email" placeholder="example@test.com" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label>Số điện thoại</label>
            <input className="input" name="phone" placeholder="0912345678" value={form.phone} onChange={onChange} required />
          </div>
          <div>
            <label>Mật khẩu</label>
            <input className="input" type="password" name="password" placeholder="••••••" value={form.password} onChange={onChange} required minLength={3} />
          </div>
          <div>
            <label>Xác nhận mật khẩu</label>
            <input className="input" type="password" name="confirmPassword" placeholder="••••••" value={form.confirmPassword} onChange={onChange} required minLength={3} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyEmail} className="form-grid">
          <div>
            <label>Mã OTP</label>
            <input className="input" name="otp" placeholder="••••••" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Đang xác thực...' : 'Xác thực'}</button>
            <button className="btn btn-link" type="button" onClick={handleResendOtp} disabled={loading}>Gửi lại OTP</button>
          </div>
        </form>
      )}
      {msg && <div className={`alert ${msg.includes('thành công') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
    </div>
  )
}

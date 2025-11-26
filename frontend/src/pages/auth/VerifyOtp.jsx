import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { noAuthApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function VerifyOtp() {
  const [form, setForm] = useState({ email: '', otp: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const { data } = await noAuthApi.post('/api/auth/verify-email', form)
      if (data.errCode === 0) {
        setMsg('Xác thực OTP thành công')
        const accessToken = data.accessToken || data.tokens?.accessToken
        const refreshToken = data.refreshToken || data.tokens?.refreshToken
        if (accessToken && refreshToken) {
          login(accessToken, refreshToken)
          navigate('/')
        }
      }
      else setMsg(data.errMessage || 'OTP không hợp lệ')
    } catch (err) {
      setMsg('Lỗi kết nối')
    } finally { setLoading(false) }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '24px auto' }}>
      <h2>Xác thực OTP</h2>
      <p className="text-muted" style={{ marginBottom: 12 }}>Nhập email đã đăng ký và OTP được gửi đến hộp thư của bạn.</p>
      <form onSubmit={onSubmit} className="form-grid">
        <div>
          <label>Email</label>
          <input className="input" name="email" placeholder="example@test.com" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label>OTP</label>
          <input className="input" name="otp" placeholder="123456" value={form.otp} onChange={onChange} required />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Đang xác thực...' : 'Xác thực'}</button>
      </form>
      {msg && <div className={`alert ${msg.startsWith('Xác thực OTP thành công') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
    </div>
  )
}

import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { noAuthApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const payload = { emailOrPhone: form.email, password: form.password }
      const { data } = await noAuthApi.post('/api/auth/login', payload)
      if (data.errCode === 0) {
        const accessToken = data.accessToken || data.tokens?.accessToken
        const refreshToken = data.refreshToken || data.tokens?.refreshToken
        if (accessToken && refreshToken) {
          login(accessToken, refreshToken)
        }
        const from = location.state?.from?.pathname || '/'
        navigate(from)
      } else setMsg(data.errMessage || 'Đăng nhập thất bại')
    } catch (err) {
      setMsg('Lỗi kết nối')
    } finally { setLoading(false) }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '24px auto' }}>
      <h2>Đăng nhập</h2>
      <p className="text-muted" style={{ marginBottom: 12 }}>Nhập email và mật khẩu để tiếp tục.</p>
      <form onSubmit={onSubmit} className="form-grid">
        <div>
          <label>Email</label>
          <input className="input" type="email" name="email" placeholder="example@test.com" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label>Mật khẩu</label>
          <input className="input" type="password" name="password" placeholder="••••••" value={form.password} onChange={onChange} required minLength={3} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </form>
      {msg && <div className="alert alert-error">{msg}</div>}
    </div>
  )
}

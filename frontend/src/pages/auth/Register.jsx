import React, { useState } from 'react'
import { noAuthApi } from '../../services/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const { data } = await noAuthApi.post('/api/auth/register', form)
      if (data.errCode === 0) setMsg('Đăng ký thành công. Vui lòng kiểm tra email để nhận OTP.')
      else setMsg(data.errMessage || 'Lỗi')
    } catch (err) {
      setMsg('Lỗi kết nối')
    } finally { setLoading(false) }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: '24px auto' }}>
      <h2>Đăng ký</h2>
      <p className="text-muted" style={{ marginBottom: 12 }}>Tạo tài khoản mới và nhận OTP qua email.</p>
      <form onSubmit={onSubmit} className="form-grid">
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
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}</button>
      </form>
      {msg && <div className={`alert ${msg.startsWith('Đăng ký thành công') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
    </div>
  )
}

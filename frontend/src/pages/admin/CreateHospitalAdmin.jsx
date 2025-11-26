import React, { useState } from 'react'
import { api } from '../../services/api'

export default function CreateHospitalAdmin() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/admin/hospital-admin', form)
      if (data.errCode === 0) setMsg('Tạo quản trị viên bệnh viện thành công')
      else setMsg(data.errMessage || 'Lỗi')
    } catch (err) {
      setMsg('Lỗi kết nối hoặc không có quyền')
    } finally { setLoading(false) }
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '24px auto' }}>
      <h2>Tạo quản trị viên bệnh viện</h2>
      <p className="text-muted" style={{ marginBottom: 12 }}>Nhập thông tin người dùng và xác nhận mật khẩu.</p>
      <form onSubmit={onSubmit} className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <label>Tên</label>
          <input className="input" name="name" placeholder="Tên" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <label>Email</label>
          <input className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label>Số điện thoại</label>
          <input className="input" name="phone" placeholder="Số điện thoại" value={form.phone} onChange={onChange} required />
        </div>
        <div>
          <label>Mật khẩu</label>
          <input className="input" type="password" name="password" placeholder="••••••" value={form.password} onChange={onChange} required />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Xác nhận mật khẩu</label>
          <input className="input" type="password" name="confirmPassword" placeholder="••••••" value={form.confirmPassword} onChange={onChange} required />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo'}</button>
        </div>
      </form>
      {msg && <div className={`alert ${msg.includes('thành công') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
    </div>
  )
}

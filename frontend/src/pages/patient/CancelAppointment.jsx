import React, { useState } from 'react'
import { api } from '../../services/api'

export default function CancelAppointment() {
  const [id, setId] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const { data } = await api.delete(`/api/patient/appointments/${id}`)
      if (data.errCode === 0) setMsg('Hủy lịch hẹn thành công')
      else setMsg(data.errMessage || 'Lỗi')
    } catch (err) {
      setMsg('Lỗi kết nối hoặc không có quyền')
    } finally { setLoading(false) }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '24px auto' }}>
      <h2>Hủy lịch hẹn</h2>
      <p className="text-muted" style={{ marginBottom: 12 }}>Nhập ID lịch hẹn bạn muốn hủy.</p>
      <form onSubmit={onSubmit} className="form-grid">
        <div>
          <label>Appointment ID</label>
          <input className="input" placeholder="ID" value={id} onChange={(e)=>setId(e.target.value)} required />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Đang hủy...' : 'Hủy lịch hẹn'}</button>
      </form>
      {msg && <div className={`alert ${msg.includes('thành công') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
    </div>
  )
}

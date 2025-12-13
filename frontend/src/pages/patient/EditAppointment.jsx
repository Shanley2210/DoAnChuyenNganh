import React, { useState } from 'react'
import { api } from '../../services/api'

export default function EditAppointment() {
  const [form, setForm] = useState({ id: '', doctorId: '', slotId: '', serviceId: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const id = form.id
      const payload = { doctorId: form.doctorId, slotId: form.slotId, serviceId: form.serviceId }
      const { data } = await api.put(`/api/patient/appointments/${id}`, payload)
      if (data.errCode === 0) setMsg('Cập nhật lịch hẹn thành công')
      else setMsg(data.errMessage || 'Lỗi')
    } catch (err) {
      setMsg('Lỗi kết nối hoặc không có quyền')
    } finally { setLoading(false) }
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '24px auto' }}>
      <h2>Cập nhật lịch hẹn</h2>
      <p className="text-muted" style={{ marginBottom: 12 }}>Nhập ID lịch hẹn và thông tin cần cập nhật.</p>
      <form onSubmit={onSubmit} className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Appointment ID</label>
          <input className="input" name="id" placeholder="ID" value={form.id} onChange={onChange} required />
        </div>
        <div>
          <label>Doctor ID</label>
          <input className="input" name="doctorId" placeholder="Doctor ID" value={form.doctorId} onChange={onChange} />
        </div>
        <div>
          <label>Slot ID</label>
          <input className="input" name="slotId" placeholder="Slot ID" value={form.slotId} onChange={onChange} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Service ID</label>
          <input className="input" name="serviceId" placeholder="Service ID" value={form.serviceId} onChange={onChange} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Đang cập nhật...' : 'Cập nhật'}</button>
        </div>
      </form>
      {msg && <div className={`alert ${msg.includes('thành công') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
    </div>
  )
}

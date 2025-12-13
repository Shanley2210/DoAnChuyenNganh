import React, { useState } from 'react'
import { api } from '../../services/api'

export default function CreatePatientProfile() {
  const [form, setForm] = useState({ dob: '', gender: '', ethnicity: '', address: '', insuranceTerm: '', insuranceNumber: '', familyAddress: '', notePMH: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/patient/profile', form)
      if (data.errCode === 0) setMsg('Tạo hồ sơ thành công')
      else setMsg(data.errMessage || 'Lỗi')
    } catch (err) {
      setMsg('Lỗi kết nối hoặc không có quyền')
    } finally { setLoading(false) }
  }

  return (
    <div className="card" style={{ maxWidth: 720, margin: '24px auto' }}>
      <h2>Tạo hồ sơ bệnh nhân</h2>
      <p className="text-muted" style={{ marginBottom: 12 }}>Nhập thông tin để tạo hồ sơ của bạn</p>
      {msg && <div className={`alert ${msg.includes('thành công') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
      <form onSubmit={onSubmit} className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <label>Ngày sinh</label>
          <input className="input" name="dob" placeholder="YYYY-MM-DD" value={form.dob} onChange={onChange} />
        </div>
        <div>
          <label>Giới tính</label>
          <input className="input" name="gender" placeholder="1/0" value={form.gender} onChange={onChange} />
        </div>
        <div>
          <label>Dân tộc</label>
          <input className="input" name="ethnicity" placeholder="Kinh..." value={form.ethnicity} onChange={onChange} />
        </div>
        <div>
          <label>Địa chỉ</label>
          <input className="input" name="address" placeholder="Địa chỉ" value={form.address} onChange={onChange} />
        </div>
        <div>
          <label>Hạn BH</label>
          <input className="input" name="insuranceTerm" placeholder="YYYY-MM-DD" value={form.insuranceTerm} onChange={onChange} />
        </div>
        <div>
          <label>Số BH</label>
          <input className="input" name="insuranceNumber" placeholder="Số BH" value={form.insuranceNumber} onChange={onChange} />
        </div>
        <div>
          <label>Địa chỉ gia đình</label>
          <input className="input" name="familyAddress" placeholder="Địa chỉ" value={form.familyAddress} onChange={onChange} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Ghi chú</label>
          <input className="input" name="notePMH" placeholder="Ghi chú" value={form.notePMH} onChange={onChange} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo hồ sơ'}</button>
        </div>
      </form>
    </div>
  )
}

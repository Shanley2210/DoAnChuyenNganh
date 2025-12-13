import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'

export default function DoctorAppointments() {
  const [items, setItems] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setMsg('')
      setLoading(true)
      try {
        const { data } = await api.get('/api/doctor/appointments')
        if (data.errCode === 0) setItems(data.data || [])
        else setMsg(data.errMessage || 'Lỗi')
      } catch (e) {
        setMsg('Lỗi kết nối hoặc không có quyền')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="card" style={{ margin: '24px auto' }}>
      <h2>Lịch hẹn của tôi</h2>
      <p className="text-muted" style={{ marginBottom: 12 }}>{loading ? 'Đang tải...' : ''}</p>
      {msg && <div className="alert alert-error" style={{ marginTop: 8 }}>{msg}</div>}
      {!msg && !loading && items.length === 0 && (
        <p className="text-muted">Không có lịch hẹn.</p>
      )}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12, display: 'grid', gap: 10 }}>
        {items.map((d, idx) => (
          <li key={idx} className="card" style={{ padding: 12 }}>
            <div style={{ fontWeight: 600 }}>Lịch hẹn #{d?.id || idx + 1}</div>
            <div className="text-muted" style={{ fontSize: 14 }}>Bác sĩ: {d?.doctor?.name || d?.doctorName || 'N/A'}</div>
            <div className="text-muted" style={{ fontSize: 14 }}>Thời gian: {d?.time || d?.slot || d?.createdAt || ''}</div>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, color: '#94a3b8', marginTop: 8 }}>{JSON.stringify(d, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  )
}

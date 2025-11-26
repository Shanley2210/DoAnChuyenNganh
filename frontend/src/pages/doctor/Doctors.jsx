import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'

export default function Doctors() {
  const [items, setItems] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      setMsg('')
      try {
        const { data } = await api.get('/api/doctor/all')
        if (data.errCode === 0) setItems(data.data || [])
        else setMsg(data.errMessage || 'Lỗi')
      } catch (e) {
        setMsg('Lỗi kết nối hoặc không có quyền')
      }
    }
    load()
  }, [])

  return (
    <div className="card" style={{ margin: '24px auto' }}>
      <h2>Tất cả bác sĩ</h2>
      {msg && <div className="alert alert-error" style={{ marginTop: 8 }}>{msg}</div>}
      {!msg && items.length === 0 && (
        <p className="text-muted">Không có dữ liệu.</p>
      )}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12, display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr 1fr' }}>
        {items.map((d, idx) => (
          <li key={idx} className="card" style={{ padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{d?.name || d?.fullName || 'Bác sĩ'}</div>
            <div className="text-muted" style={{ fontSize: 14 }}>{d?.email || d?.phone || ''}</div>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, color: '#94a3b8', marginTop: 8 }}>{JSON.stringify(d, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  )
}

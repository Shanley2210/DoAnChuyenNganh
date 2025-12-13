import React, { useEffect, useMemo, useState } from 'react'
import { noAuthApi } from '../services/api'

export default function Services() {
  const [items, setItems] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const formatVND = (val) => {
    const n = Number(val)
    if (Number.isNaN(n)) return val ?? ''
    try { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n) } catch { return `${n}₫` }
  }

  useEffect(() => {
    const load = async () => {
      setMsg('')
      setLoading(true)
      try {
        const { data } = await noAuthApi.get('/api/service')
        if (data.errCode === 0) setItems(data.data || [])
        else setMsg(data.errMessage || 'Lỗi')
      } catch (e) {
        setMsg('Lỗi kết nối')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(d =>
      String(d?.name || '').toLowerCase().includes(q) ||
      String(d?.description || '').toLowerCase().includes(q)
    )
  }, [items, query])

  return (
    <div className="card" style={{ margin: '24px auto' }}>
      <div className="row-between" style={{ marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Tất cả dịch vụ</h2>
        <input className="input" placeholder="Tìm dịch vụ" value={query} onChange={(e)=>setQuery(e.target.value)} style={{ width: 260 }} />
      </div>
      {msg && <div className="alert alert-error" style={{ marginTop: 8 }}>{msg}</div>}
      {loading && <p className="text-muted" style={{ marginTop: 8 }}>Đang tải...</p>}
      {!loading && !msg && filtered.length === 0 && (
        <p className="text-muted">Không có dữ liệu.</p>
      )}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }} className="grid-responsive">
        {filtered.map((d, idx) => (
          <li key={idx} className="card card-hover" style={{ padding: 12 }}>
            <div className="row-between">
              <div style={{ fontWeight: 700, fontSize: 16 }}>{d?.name || 'Dịch vụ'}</div>
              <span className={`badge ${d?.status === 'active' ? 'success' : 'warning'}`}>{d?.status || 'unknown'}</span>
            </div>
            <div className="text-muted" style={{ fontSize: 14, marginTop: 6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d?.description || ''}</div>
            <div className="row-between" style={{ marginTop: 10 }}>
              <div className="text-muted">Thời lượng: <strong>{d?.durationMinutes} phút</strong></div>
              <div><strong>{formatVND(d?.price)}</strong></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

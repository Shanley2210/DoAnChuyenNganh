import React, { useEffect, useState } from 'react'
import { noAuthApi } from '../services/api'

export default function Specialties() {
  const [items, setItems] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  const imageUrl = (path) => {
    if (!path) return ''
    return path.startsWith('http') ? path : path
  }

  useEffect(() => {
    const load = async () => {
      setMsg('')
      setLoading(true)
      try {
        const { data } = await noAuthApi.get('/api/specialty')
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

  return (
    <div className="card" style={{ margin: '24px auto' }}>
      <h2>Tất cả chuyên khoa</h2>
      {msg && <div className="alert alert-error" style={{ marginTop: 8 }}>{msg}</div>}
      {loading && <p className="text-muted" style={{ marginTop: 8 }}>Đang tải...</p>}
      {!loading && !msg && items.length === 0 && (
        <p className="text-muted">Không có dữ liệu.</p>
      )}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }} className="grid-responsive">
        {items.map((d, idx) => (
          <li key={idx} className="card card-hover" style={{ padding: 12 }}>
            <div className="media" style={{ backgroundImage: `url('${imageUrl(d?.image)}')` }} />
            <div className="row-between" style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{d?.name || 'Chuyên khoa'}</div>
              <span className={`badge ${d?.status === 'active' ? 'success' : 'warning'}`}>{d?.status || 'unknown'}</span>
            </div>
            <div className="text-muted" style={{ fontSize: 14, marginTop: 6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {d?.description || ''}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

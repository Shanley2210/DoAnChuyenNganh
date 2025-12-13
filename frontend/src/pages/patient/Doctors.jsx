import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'

export default function Doctors() {
  const [items, setItems] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const formatVND = (val) => {
    const n = Number(val)
    if (Number.isNaN(n)) return val ?? ''
    try { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n) } catch { return `${n}₫` }
  }

  const imageUrl = (path) => {
    if (!path) return ''
    return path.startsWith('http') ? path : path
  }

  useEffect(() => {
    const load = async () => {
      setMsg('')
      setLoading(true)
      try {
        const { data } = await api.get('/api/doctor/all')
        if (data.errCode === 0) setItems(data.data || [])
        else setMsg(data.errMessage || 'Lỗi')
      } catch (e) {
        setMsg('Lỗi kết nối hoặc không có quyền')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(d => {
      const name = String(d?.user?.name || '').toLowerCase()
      const degree = String(d?.degree || '').toLowerCase()
      const address = String(d?.address || '').toLowerCase()
      const room = String(d?.room || '').toLowerCase()
      return name.includes(q) || degree.includes(q) || address.includes(q) || room.includes(q)
    })
  }, [items, query])

  return (
    <div className="card" style={{ margin: '24px auto' }}>
      <div className="row-between" style={{ marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Tất cả bác sĩ</h2>
        <input className="input" placeholder="Tìm bác sĩ theo tên, học vị, phòng..." value={query} onChange={(e)=>setQuery(e.target.value)} style={{ width: 300 }} />
      </div>
      {msg && <div className="alert alert-error" style={{ marginTop: 8 }}>{msg}</div>}
      {loading && <p className="text-muted" style={{ marginTop: 8 }}>Đang tải...</p>}
      {!loading && !msg && filtered.length === 0 && (
        <p className="text-muted">Không có dữ liệu.</p>
      )}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }} className="grid-responsive">
        {filtered.map((d, idx) => {
          const name = d?.user?.name || 'Bác sĩ'
          const email = d?.user?.email || ''
          const phone = d?.user?.phone || ''
          return (
            <li key={idx} className="card card-hover" style={{ padding: 12 }}>
              <div className="media" style={{ backgroundImage: `url('${imageUrl(d?.image)}')` }} />
              <div className="row-between" style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{name}</div>
                <span className={`badge ${d?.status === 'active' ? 'success' : 'warning'}`}>{d?.status || 'unknown'}</span>
              </div>
              <div className="text-muted" style={{ fontSize: 14, marginTop: 6 }}>{d?.degree || ''}</div>
              <div className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>{d?.address || ''}</div>
              <div className="row-between" style={{ marginTop: 10 }}>
                <div className="text-muted">Phòng: <strong>{d?.room || '-'}</strong></div>
                <div><strong>{formatVND(d?.price)}</strong></div>
              </div>
              <div className="row-between" style={{ marginTop: 8 }}>
                <div className="text-muted" style={{ fontSize: 13 }}>{email}</div>
                <button className="btn" onClick={() => setSelected(d)}>Xem</button>
              </div>
            </li>
          )
        })}
      </ul>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="card" style={{ width: 640 }} onClick={(e)=>e.stopPropagation()}>
            <div className="row-between" style={{ marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>{selected?.user?.name || 'Bác sĩ'}</h3>
              <span className={`badge ${selected?.status === 'active' ? 'success' : 'warning'}`}>{selected?.status || 'unknown'}</span>
            </div>
            <div className="media media-contain" style={{ height: 220, backgroundImage: `url('${imageUrl(selected?.image)}')` }} />
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8, marginTop: 12 }}>
              <div><strong>Email</strong></div><div>{selected?.user?.email || '-'}</div>
              <div><strong>SĐT</strong></div><div>{selected?.user?.phone || '-'}</div>
              <div><strong>Học vị</strong></div><div>{selected?.degree || '-'}</div>
              <div><strong>Phòng</strong></div><div>{selected?.room || '-'}</div>
              <div><strong>Địa chỉ</strong></div><div>{selected?.address || '-'}</div>
              <div><strong>Giá khám</strong></div><div>{formatVND(selected?.price)}</div>
            </div>
            <div style={{ textAlign: 'right', marginTop: 12 }}>
              <button className="btn" onClick={() => setSelected(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

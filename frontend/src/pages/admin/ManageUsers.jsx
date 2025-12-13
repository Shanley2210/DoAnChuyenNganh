import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/api/admin/users')
      if (data.errCode === 0) setUsers(Array.isArray(data.data) ? data.data : [])
      else setError(data.errMessage || 'Không tải được danh sách')
    } catch (e) {
      setError('Lỗi kết nối hoặc không có quyền')
    } finally {
      setLoading(false)
    }
  }

  const viewDetail = async (id) => {
    setBusyId(id)
    setError('')
    try {
      const { data } = await api.get(`/api/admin/users/${id}`)
      if (data.errCode === 0) setSelected(data.data)
      else setError(data.errMessage || 'Không lấy được chi tiết')
    } catch (e) {
      setError('Lỗi kết nối hoặc không có quyền')
    } finally {
      setBusyId(null)
    }
  }

  const deleteUser = async (id) => {
    const ok = window.confirm('Xóa người dùng này? Hành động không thể hoàn tác.')
    if (!ok) return
    setBusyId(id)
    setError('')
    try {
      const { data } = await api.delete(`/api/admin/users/${id}`)
      if (data.errCode === 0) {
        setUsers(prev => prev.filter(u => u.id !== id))
      } else setError(data.errMessage || 'Xóa thất bại')
    } catch (e) {
      setError('Lỗi kết nối hoặc không có quyền')
    } finally {
      setBusyId(null)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  useEffect(() => {
    if (selected) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(u =>
      String(u.name || '').toLowerCase().includes(q) ||
      String(u.email || '').toLowerCase().includes(q) ||
      String(u.phone || '').toLowerCase().includes(q)
    )
  }, [users, query])

  return (
    <div className="card" style={{ maxWidth: 1200, margin: '24px auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Quản lý tài khoản user bệnh viện</h2>
        <div className="spacer" />
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên, email, SĐT"
          style={{ width: 280 }}
        />
        <button className="btn" onClick={fetchUsers} disabled={loading}>
          {loading ? 'Đang tải...' : 'Tải lại'}
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 12 }}>{error}</div>}

      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>ID</th>
              <th style={{ textAlign: 'left' }}>Tên</th>
              <th style={{ textAlign: 'left' }}>Email</th>
              <th style={{ textAlign: 'left' }}>SĐT</th>
              <th style={{ textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn" onClick={() => viewDetail(u.id)} disabled={busyId===u.id}>Xem</button>{' '}
                  <button className="btn btn-danger" onClick={() => deleteUser(u.id)} disabled={busyId===u.id}>Xóa</button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 16 }}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="card" style={{ width: 560, maxWidth: '100%', background: 'rgba(15,23,42,0.98)' }} onClick={(e)=>e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Chi tiết người dùng</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 8, columnGap: 12 }}>
              <div className="text-muted"><strong>ID</strong></div><div>{selected.id}</div>
              <div className="text-muted"><strong>Tên</strong></div><div>{selected.name}</div>
              <div className="text-muted"><strong>Email</strong></div><div>{selected.email}</div>
              <div className="text-muted"><strong>SĐT</strong></div><div>{selected.phone}</div>
              <div className="text-muted"><strong>Vai trò</strong></div><div>{(selected.roles||[]).map(r=>r.name).join(', ')}</div>
            </div>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button className="btn" onClick={() => setSelected(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

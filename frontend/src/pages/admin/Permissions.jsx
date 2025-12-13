import React, { useState } from 'react'
import { api } from '../../services/api'

export default function Permissions() {
  const [grantForm, setGrantForm] = useState({ userId: '', permissionId: '' })
  const [revokeForm, setRevokeForm] = useState({ userId: '', permissionId: '' })
  const [msg, setMsg] = useState('')
  const [loadingGrant, setLoadingGrant] = useState(false)
  const [loadingRevoke, setLoadingRevoke] = useState(false)

  const onGrant = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoadingGrant(true)
    try {
      const { data } = await api.post('/api/admin/user-permission', grantForm)
      if (data.errCode === 0) setMsg('Cấp quyền thành công')
      else setMsg(data.errMessage || 'Lỗi')
    } catch (err) {
      setMsg('Lỗi kết nối hoặc không có quyền')
    } finally { setLoadingGrant(false) }
  }

  const onRevoke = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoadingRevoke(true)
    try {
      const { data } = await api.delete(`/api/admin/user-permission/${revokeForm.userId}/${revokeForm.permissionId}`)
      if (data.errCode === 0) setMsg('Hủy quyền thành công')
      else setMsg(data.errMessage || 'Lỗi')
    } catch (err) {
      setMsg('Lỗi kết nối hoặc không có quyền')
    } finally { setLoadingRevoke(false) }
  }

  return (
    <div className="card" style={{ margin: '24px auto' }}>
      <h2>Quyền người dùng</h2>
      <p className="text-muted" style={{ marginBottom: 12 }}>Cấp hoặc hủy quyền cho người dùng theo ID.</p>
      <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <form onSubmit={onGrant} className="form-grid" style={{ maxWidth: 480 }}>
          <h3>Cấp quyền</h3>
          <div>
            <label>User ID</label>
            <input className="input" name="userId" placeholder="User ID" value={grantForm.userId} onChange={(e)=>setGrantForm({ ...grantForm, userId: e.target.value })} required />
          </div>
          <div>
            <label>Permission ID</label>
            <input className="input" name="permissionId" placeholder="Permission ID" value={grantForm.permissionId} onChange={(e)=>setGrantForm({ ...grantForm, permissionId: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loadingGrant}>{loadingGrant ? 'Đang cấp...' : 'Cấp quyền'}</button>
        </form>
        <form onSubmit={onRevoke} className="form-grid" style={{ maxWidth: 480 }}>
          <h3>Hủy quyền</h3>
          <div>
            <label>User ID</label>
            <input className="input" name="userId" placeholder="User ID" value={revokeForm.userId} onChange={(e)=>setRevokeForm({ ...revokeForm, userId: e.target.value })} required />
          </div>
          <div>
            <label>Permission ID</label>
            <input className="input" name="permissionId" placeholder="Permission ID" value={revokeForm.permissionId} onChange={(e)=>setRevokeForm({ ...revokeForm, permissionId: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loadingRevoke}>{loadingRevoke ? 'Đang hủy...' : 'Hủy quyền'}</button>
        </form>
      </div>
      {msg && <div className={`alert ${msg.includes('thành công') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
    </div>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'
import { X } from 'lucide-react'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

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

  const viewDetail = async (user) => {
    setSelected(user)
    setBusyId(user.id)
    setDetailError('')
    setDetailLoading(true)
    try {
      const { data } = await api.get(`/api/admin/users/${user.id}`)
      if (data.errCode === 0) setSelected(data.data)
      else setDetailError(data.errMessage || 'Không lấy được chi tiết')
    } catch (e) {
      setDetailError('Lỗi kết nối hoặc không có quyền')
    } finally {
      setBusyId(null)
      setDetailLoading(false)
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
    const base = !q
      ? users
      : users.filter(u =>
          String(u.name || '').toLowerCase().includes(q) ||
          String(u.email || '').toLowerCase().includes(q) ||
          String(u.phone || '').toLowerCase().includes(q)
        )
    return [...base].sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0))
  }, [users, query])

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <div className='flex items-center gap-3 mb-4'>
        <h2 className='text-xl font-bold text-gray-800 m-0'>Quản lý tài khoản user bệnh viện</h2>
        <div className='flex-1' />
        <input
          className='w-72 border rounded p-2 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Tìm theo tên, email, SĐT'
        />
        <button
          className='px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
          onClick={fetchUsers}
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 'Tải lại'}
        </button>
      </div>

      {error && (
        <div className='mb-3 px-3 py-2 rounded border bg-red-50 text-red-700 border-red-200'>
          {error}
        </div>
      )}

      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-blue-50 text-blue-800 text-sm'>
              <th className='p-3'>ID</th>
              <th className='p-3'>Tên</th>
              <th className='p-3'>Email</th>
              <th className='p-3'>SĐT</th>
              <th className='p-3 text-right'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className='border-b hover:bg-gray-50'>
                <td className='p-3'>{u.id}</td>
                <td className='p-3'>{u.name}</td>
                <td className='p-3'>{u.email}</td>
                <td className='p-3'>{u.phone}</td>
                <td className='p-3 text-right'>
                  <button
                    className='bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50'
                    onClick={() => viewDetail(u)}
                    disabled={busyId===u.id}
                  >
                    Xem
                  </button>{' '}
                  <button
                    className='bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 disabled:opacity-50'
                    onClick={() => deleteUser(u.id)}
                    disabled={busyId===u.id}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className='text-center text-gray-500 py-4'>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4' onClick={() => setSelected(null)}>
          <div className='bg-white rounded-lg w-full max-w-lg shadow-xl overflow-hidden' onClick={(e)=>e.stopPropagation()}>
            <div className='flex justify-between items-center p-4 border-b'>
              <h3 className='text-lg font-bold text-gray-800'>Chi tiết người dùng</h3>
              <button onClick={() => setSelected(null)} className='p-1 hover:bg-gray-100 rounded-full cursor-pointer'>
                <X size={20} />
              </button>
            </div>
            <div className='p-6 max-h-[80vh] overflow-y-auto'>
              {detailLoading && (
                <div className='mb-3 text-sm text-gray-500'>Đang tải chi tiết...</div>
              )}
              {detailError && (
                <div className='mb-3 px-3 py-2 rounded border bg-red-50 text-red-700 border-red-200'>{detailError}</div>
              )}
              <div className='grid grid-cols-3 gap-3 text-sm'>
                <div className='text-gray-500 font-medium'>ID</div><div className='col-span-2'>{selected.id}</div>
                <div className='text-gray-500 font-medium'>Tên</div><div className='col-span-2'>{selected.name}</div>
                <div className='text-gray-500 font-medium'>Email</div><div className='col-span-2'>{selected.email}</div>
                <div className='text-gray-500 font-medium'>SĐT</div><div className='col-span-2'>{selected.phone}</div>
                <div className='text-gray-500 font-medium'>Vai trò</div><div className='col-span-2'>{(selected.roles||[]).map(r=>r.name).join(', ')}</div>
              </div>
              <div className='flex justify-end gap-2 pt-4 mt-4 border-t'>
                <button className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700' onClick={() => setSelected(null)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

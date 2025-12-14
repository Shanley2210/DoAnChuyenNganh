import React, { useState } from 'react'
import { api } from '../../services/api'

export default function CreateHospitalAdmin() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/admin/hospital-admin', form)
      if (data.errCode === 0) setMsg('Tạo quản trị viên bệnh viện thành công')
      else setMsg(data.errMessage || 'Lỗi')
    } catch (err) {
      setMsg('Lỗi kết nối hoặc không có quyền')
    } finally { setLoading(false) }
  }

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h2 className='text-xl font-bold text-gray-800'>Tạo quản trị viên bệnh viện</h2>
      <p className='text-gray-500 mb-4'>Nhập thông tin người dùng và xác nhận mật khẩu.</p>
      <form onSubmit={onSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='text-sm font-medium'>Tên</label>
          <input className='w-full border p-2 rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500' name='name' placeholder='Tên' value={form.name} onChange={onChange} required />
        </div>
        <div>
          <label className='text-sm font-medium'>Email</label>
          <input className='w-full border p-2 rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500' name='email' placeholder='Email' value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label className='text-sm font-medium'>Số điện thoại</label>
          <input className='w-full border p-2 rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500' name='phone' placeholder='Số điện thoại' value={form.phone} onChange={onChange} required />
        </div>
        <div>
          <label className='text-sm font-medium'>Mật khẩu</label>
          <input className='w-full border p-2 rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500' type='password' name='password' placeholder='••••••' value={form.password} onChange={onChange} required />
        </div>
        <div className='md:col-span-2'>
          <label className='text-sm font-medium'>Xác nhận mật khẩu</label>
          <input className='w-full border p-2 rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500' type='password' name='confirmPassword' placeholder='••••••' value={form.confirmPassword} onChange={onChange} required />
        </div>
        <div className='md:col-span-2 flex justify-end'>
          <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50' type='submit' disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo'}</button>
        </div>
      </form>
      {msg && (
        <div className={`mt-4 px-3 py-2 rounded border ${msg.includes('thành công') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {msg}
        </div>
      )}
    </div>
  )
}

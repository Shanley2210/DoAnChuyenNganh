import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreatePatientProfile() {
    const [form, setForm] = useState({
        dob: '',
        gender: '',
        ethnicity: '',
        address: '',
        insuranceTerm: '',
        insuranceNumber: '',
        familyAddress: '',
        notePMH: ''
    });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setLoading(true);
        try {
            const { data } = await api.post('/api/patient/profile', form);
            if (data.errCode === 0) {
                setMsg('Tạo hồ sơ thành công');
                navigate('/patient/profile');
            } else setMsg(data.errMessage || 'Lỗi');
        } catch (err) {
            setMsg('Lỗi kết nối hoặc không có quyền');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-100 p-6'>
            <h2 className='text-2xl font-bold text-gray-800 text-center mb-2'>
                Tạo hồ sơ bệnh nhân
            </h2>

            <p className='text-sm text-gray-500 text-center mb-6'>
                Nhập thông tin để tạo hồ sơ của bạn
            </p>

            {msg && (
                <div
                    className={`mb-4 rounded-lg px-4 py-3 text-sm border ${
                        msg.includes('thành công')
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                >
                    {msg}
                </div>
            )}

            <form
                onSubmit={onSubmit}
                className='grid grid-cols-1 md:grid-cols-2 gap-4'
            >
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Ngày sinh
                    </label>
                    <input
                        name='dob'
                        value={form.dob}
                        onChange={onChange}
                        placeholder='YYYY-MM-DD'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Giới tính
                    </label>
                    <input
                        name='gender'
                        value={form.gender}
                        onChange={onChange}
                        placeholder='Nam / Nữ'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Dân tộc
                    </label>
                    <input
                        name='ethnicity'
                        value={form.ethnicity}
                        onChange={onChange}
                        placeholder='Kinh...'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Địa chỉ
                    </label>
                    <input
                        name='address'
                        value={form.address}
                        onChange={onChange}
                        placeholder='Địa chỉ hiện tại'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Hạn BH
                    </label>
                    <input
                        name='insuranceTerm'
                        value={form.insuranceTerm}
                        onChange={onChange}
                        placeholder='YYYY-MM-DD'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Số BH
                    </label>
                    <input
                        name='insuranceNumber'
                        value={form.insuranceNumber}
                        onChange={onChange}
                        placeholder='Số bảo hiểm'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Địa chỉ gia đình
                    </label>
                    <input
                        name='familyAddress'
                        value={form.familyAddress}
                        onChange={onChange}
                        placeholder='Địa chỉ gia đình'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                    />
                </div>

                <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Ghi chú
                    </label>
                    <textarea
                        name='notePMH'
                        value={form.notePMH}
                        onChange={onChange}
                        placeholder='Ghi chú tiền sử bệnh'
                        rows={3}
                        className='w-full rounded-lg border border-gray-300 px-4 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                    />
                </div>

                <div className='md:col-span-2'>
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full mt-2 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Đang tạo...' : 'Tạo hồ sơ'}
                    </button>
                </div>
            </form>
        </div>
    );
}

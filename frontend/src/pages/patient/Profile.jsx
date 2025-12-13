import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import dayjs from 'dayjs'

export default function Profile() {
    const [profile, setProfile] = useState(null);
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
    const [loadingLoad, setLoadingLoad] = useState(false);

    const load = async () => {
        setMsg('');
        setLoadingLoad(true);
        try {
            const { data } = await api.get('/api/patient/profile');
            if (data.errCode === 0) {
                setProfile(data.data || null);
                const p = data.data || {};
                setForm({
                    dob: p.dob ? dayjs(p.dob).format('YYYY-MM-DD') : '',
                    gender: p.gender?.toString?.() || '',
                    ethnicity: p.ethnicity || '',
                    address: p.address || '',
                    insuranceTerm: p.insuranceTerm
                        ? dayjs(p.insuranceTerm).format('YYYY-MM-DD')
                        : '',
                    insuranceNumber: p.insuranceNumber || '',
                    familyAddress: p.familyAddress || '',
                    notePMH: p.notePMH || ''
                });
            } else setMsg(data.errMessage || 'Lỗi');
        } catch {
            setMsg('Lỗi kết nối hoặc không có quyền');
        } finally {
            setLoadingLoad(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setLoading(true);
        try {
            const { data } = await api.put('/api/patient/profile', form);
            if (data.errCode === 0) {
                setMsg('Cập nhật hồ sơ bệnh nhân thành công');
                load();
            } else setMsg(data.errMessage || 'Lỗi');
        } catch {
            setMsg('Lỗi kết nối hoặc không có quyền');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-1'>
                Hồ sơ bệnh nhân
            </h2>
            <p className='text-sm text-gray-500 mb-4'>
                {loadingLoad
                    ? 'Đang tải dữ liệu...'
                    : 'Cập nhật thông tin của bạn'}
            </p>

            {msg && (
                <div
                    className={`mb-4 rounded-lg px-4 py-2 text-sm font-medium ${
                        msg.includes('thành công')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {msg}
                </div>
            )}

            {/* Thông tin cố định */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div>
                    <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Họ và tên
                    </label>
                    <input
                        className='w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm'
                        value={profile?.user?.name || ''}
                        disabled
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Email
                    </label>
                    <input
                        className='w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm'
                        value={profile?.user?.email || ''}
                        disabled
                    />
                </div>
                <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Số điện thoại
                    </label>
                    <input
                        className='w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm'
                        value={profile?.user?.phone || ''}
                        disabled
                    />
                </div>
            </div>

            {/* Form chỉnh sửa */}
            <form
                onSubmit={onSubmit}
                className='grid grid-cols-1 md:grid-cols-2 gap-4'
            >
                {[
                    ['dob', 'Ngày sinh', 'YYYY-MM-DD'],
                    ['gender', 'Giới tính', '1 / 0'],
                    ['ethnicity', 'Dân tộc', 'Kinh...'],
                    ['address', 'Địa chỉ', 'Địa chỉ'],
                    ['insuranceTerm', 'Hạn BH', 'YYYY-MM-DD'],
                    ['insuranceNumber', 'Số BH', 'Số bảo hiểm'],
                    ['familyAddress', 'Địa chỉ gia đình', 'Địa chỉ']
                ].map(([name, label, placeholder]) => (
                    <div key={name}>
                        <label className='block text-sm font-medium text-gray-600 mb-1'>
                            {label}
                        </label>
                        <input
                            name={name}
                            placeholder={placeholder}
                            value={form[name]}
                            onChange={onChange}
                            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none'
                        />
                    </div>
                ))}

                <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Ghi chú
                    </label>
                    <textarea
                        name='notePMH'
                        placeholder='Ghi chú tiền sử bệnh'
                        value={form.notePMH}
                        onChange={onChange}
                        rows={3}
                        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none'
                    />
                </div>

                <div className='md:col-span-2 flex justify-end'>
                    <button
                        type='submit'
                        disabled={loading || loadingLoad}
                        className='rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition'
                    >
                        {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </form>
        </div>
    );
}

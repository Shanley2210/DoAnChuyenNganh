import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { noAuthApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function VerifyOtp() {
    const [form, setForm] = useState({ email: '', otp: '' });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setLoading(true);
        try {
            const { data } = await noAuthApi.post(
                '/api/auth/verify-email',
                form
            );
            if (data.errCode === 0) {
                setMsg('Xác thực OTP thành công');
                const accessToken =
                    data.accessToken || data.tokens?.accessToken;
                const refreshToken =
                    data.refreshToken || data.tokens?.refreshToken;
                if (accessToken && refreshToken) {
                    login(accessToken, refreshToken);
                    setTimeout(() => navigate('/'), 1500);
                }
            } else setMsg(data.errMessage || 'OTP không hợp lệ');
        } catch (err) {
            setMsg('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-100 p-6'>
            <h2 className='text-2xl font-bold text-gray-800 text-center mb-2'>
                Xác thực OTP
            </h2>

            <p className='text-sm text-gray-500 text-center mb-6'>
                Nhập email đã đăng ký và mã OTP được gửi đến hộp thư của bạn
            </p>

            <form onSubmit={onSubmit} className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Email
                    </label>
                    <input
                        type='email'
                        name='email'
                        value={form.email}
                        onChange={onChange}
                        required
                        placeholder='example@test.com'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Mã OTP
                    </label>
                    <input
                        name='otp'
                        value={form.otp}
                        onChange={onChange}
                        required
                        placeholder='123456'
                        className='w-full text-center tracking-widest text-lg rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                    />
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full mt-2 rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed'
                >
                    {loading ? 'Đang xác thực...' : 'Xác thực'}
                </button>
            </form>

            {msg && (
                <div
                    className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                        msg.startsWith('Xác thực OTP thành công')
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                >
                    {msg}
                </div>
            )}
        </div>
    );
}

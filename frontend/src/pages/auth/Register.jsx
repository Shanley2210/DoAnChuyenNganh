import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { noAuthApi } from '../../services/api';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setMsg('');
        setLoading(true);
        try {
            const { data } = await noAuthApi.post('/api/auth/register', form);
            if (data.errCode === 0) {
                setMsg(
                    'Đăng ký thành công. Vui lòng kiểm tra email để nhận OTP.'
                );
                setStep(2);
            } else {
                setMsg(data.errMessage || 'Lỗi');
            }
        } catch (err) {
            setMsg('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setMsg('');
        setLoading(true);
        try {
            const { data } = await noAuthApi.post('/api/auth/verify-email', {
                email: form.email,
                otp
            });
            if (data.errCode === 0) {
                setMsg(
                    'Xác thực email thành công. Bạn có thể đăng nhập ngay bây giờ.'
                );
                setTimeout(() => navigate('/'), 1500);
            } else {
                setMsg(data.errMessage || 'Lỗi');
            }
        } catch (err) {
            setMsg('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setMsg('');
        setLoading(true);
        try {
            const { data } = await noAuthApi.post('/api/auth/resend-otp', {
                email: form.email
            });
            if (data.errCode === 0) {
                setMsg('Đã gửi lại OTP. Vui lòng kiểm tra email.');
            } else {
                setMsg(data.errMessage || 'Lỗi');
            }
        } catch (err) {
            setMsg('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-100 p-6'>
            <h2 className='text-2xl font-bold text-gray-800 text-center mb-2'>
                Đăng ký
            </h2>

            <p className='text-sm text-gray-500 text-center mb-6'>
                {step === 1
                    ? 'Tạo tài khoản mới'
                    : 'Nhập mã OTP được gửi đến email của bạn'}
            </p>

            {step === 1 ? (
                <form onSubmit={handleRegister} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Họ tên
                        </label>
                        <input
                            name='name'
                            value={form.name}
                            onChange={onChange}
                            required
                            placeholder='Nguyễn Văn A'
                            className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

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
                            className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Số điện thoại
                        </label>
                        <input
                            name='phone'
                            value={form.phone}
                            onChange={onChange}
                            required
                            placeholder='0912345678'
                            className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Mật khẩu
                        </label>
                        <input
                            type='password'
                            name='password'
                            value={form.password}
                            onChange={onChange}
                            required
                            minLength={3}
                            placeholder='••••••'
                            className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type='password'
                            name='confirmPassword'
                            value={form.confirmPassword}
                            onChange={onChange}
                            required
                            minLength={3}
                            placeholder='••••••'
                            className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full mt-2 rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60'
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyEmail} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Mã OTP
                        </label>
                        <input
                            name='otp'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder='••••••'
                            className='w-full text-center tracking-widest rounded-lg border border-gray-300 px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    <div className='flex justify-between items-center gap-3'>
                        <button
                            type='submit'
                            disabled={loading}
                            className='flex-1 rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60'
                        >
                            {loading ? 'Đang xác thực...' : 'Xác thực'}
                        </button>

                        <button
                            type='button'
                            onClick={handleResendOtp}
                            disabled={loading}
                            className='text-sm font-semibold text-blue-600 hover:underline disabled:opacity-60'
                        >
                            Gửi lại OTP
                        </button>
                    </div>
                </form>
            )}
            <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600'>
                    Đã có tài khoản?
                    <span
                        onClick={() => navigate('/login')}
                        className='ml-1 text-blue-600 font-semibold cursor-pointer hover:underline'
                    >
                        Đăng nhập
                    </span>
                </p>
            </div>
            {msg && (
                <div
                    className={`mt-4 rounded-lg px-4 py-3 text-sm border ${
                        msg.includes('thành công')
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

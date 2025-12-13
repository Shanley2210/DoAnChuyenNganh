import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { noAuthApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setLoading(true);

        try {
            const payload = {
                emailOrPhone: form.email,
                password: form.password
            };

            const { data } = await noAuthApi.post('/api/auth/login', payload);

            if (data.errCode !== 0) {
                setMsg(data.errMessage || 'Đăng nhập thất bại');
                return;
            }

            const accessToken = data.accessToken || data.tokens?.accessToken;
            const refreshToken = data.refreshToken || data.tokens?.refreshToken;

            if (!accessToken || !refreshToken) {
                setMsg('Không đủ dữ liệu xác thực');
                return;
            }

            login(accessToken, refreshToken);

            try {
                const decoded = jwtDecode(accessToken);
                const roles = Array.isArray(decoded?.roles)
                    ? decoded.roles
                    : [];

                if (
                    roles.includes('System_Admin') ||
                    roles.includes('Hospital_Admin')
                ) {
                    navigate('/admin', { replace: true });
                    return;
                }

                if (roles.includes('Doctor')) {
                    navigate('/doctor', { replace: true });
                    return;
                }
            } catch {
                // Ignore decoding errors
            }

            const from = location.state?.from?.pathname;
            if (
                from &&
                !['/', '/login', '/register', '/verify-otp'].includes(from)
            ) {
                navigate(from, { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch {
            setMsg('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg border p-6'>
            <h2 className='text-2xl font-bold text-center mb-2'>Đăng nhập</h2>
            <p className='text-sm text-gray-500 text-center mb-6'>
                Nhập email và mật khẩu
            </p>

            <form onSubmit={onSubmit} className='space-y-4'>
                <input
                    type='email'
                    name='email'
                    value={form.email}
                    onChange={onChange}
                    placeholder='Email'
                    required
                    className='w-full border rounded px-4 py-2'
                />
                <input
                    type='password'
                    name='password'
                    value={form.password}
                    onChange={onChange}
                    placeholder='Mật khẩu'
                    required
                    className='w-full border rounded px-4 py-2'
                />
                <button
                    type='submit'
                    disabled={loading}
                    className='w-full bg-blue-600 text-white py-2 rounded'
                >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>
            <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600'>
                    Chưa có tài khoản?
                    <span
                        onClick={() => navigate('/register')}
                        className='ml-1 text-blue-600 font-semibold cursor-pointer hover:underline'
                    >
                        Đăng ký
                    </span>
                </p>
            </div>

            {msg && <div className='mt-4 text-sm text-red-600'>{msg}</div>}
        </div>
    );
}

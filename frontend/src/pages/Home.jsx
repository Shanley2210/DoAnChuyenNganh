import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Search,
    MapPin,
    Phone,
    Menu,
    X,
    User,
    Clock,
    Star,
    ChevronRight,
    Activity,
    Stethoscope,
    HeartPulse,
    CalendarCheck,
    Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [checkedProfile, setCheckedProfile] = useState(false);

    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!isAuthenticated) {
                setCheckedProfile(true);
                return;
            }

            try {
                const res = await api.get('/api/patient/profile');

                if (res.data?.errCode === 0) {
                    setProfile(res.data.data);
                } else {
                    setProfile(null);
                }
            } catch (e) {
                setProfile(null);
            } finally {
                setCheckedProfile(true);
            }
        };

        fetchProfile();
    }, [isAuthenticated]);

    return (
        <header className='sticky top-0 z-50 bg-white shadow-sm'>
            <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
                {/* Logo */}
                <div
                    className='flex items-center gap-2 cursor-pointer'
                    onClick={() => navigate('/')}
                >
                    <div className='bg-blue-600 p-2 rounded-lg'>
                        <HeartPulse className='text-white w-6 h-6' />
                    </div>
                    <div>
                        <h1 className='text-xl font-bold text-gray-800 leading-none'>
                            HealthCare
                        </h1>
                        <p className='text-xs text-gray-500 font-medium'>
                            Hệ thống đặt lịch
                        </p>
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className='hidden md:flex items-center gap-8'>
                    <a
                        className='text-gray-600 cursor-pointer hover:text-blue-600 font-medium text-sm transition-colors'
                        onClick={() => navigate('/all-specialty')}
                    >
                        Chuyên Khoa
                    </a>
                    <a
                        onClick={() => navigate('/all-services')}
                        className='text-gray-600 cursor-pointer hover:text-blue-600 font-medium text-sm transition-colors'
                    >
                        Dịch Vụ
                    </a>
                    <a
                        onClick={() => navigate('/all-doctors')}
                        className='text-gray-600 cursor-pointer hover:text-blue-600 font-medium text-sm transition-colors'
                    >
                        Bác Sĩ
                    </a>
                </nav>

                {/* Search & Support */}
                <div className='hidden md:flex items-center gap-4'>
                    <div className='flex items-center gap-2 text-blue-500 text-sm'>
                        <span
                            className='font-semibold cursor-pointer hover:underline'
                            onClick={() => navigate('/patient-appointment')}
                        >
                            Lịch hẹn
                        </span>
                    </div>
                    {!isAuthenticated && (
                        <button
                            className='bg-blue-100 text-blue-700 cursor-pointer px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-200'
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </button>
                    )}

                    {isAuthenticated && checkedProfile && !profile && (
                        <button
                            className='bg-red-100 text-red-700 cursor-pointer px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-200'
                            onClick={() => navigate('/patient/profile/create')}
                        >
                            Tạo hồ sơ
                        </button>
                    )}

                    {isAuthenticated && profile && (
                        <div className='flex items-center gap-3'>
                            <div
                                className='flex items-center gap-1 cursor-pointer hover:underline text-gray-700 font-semibold text-sm'
                                onClick={() => navigate('/patient/profile')}
                            >
                                <User size={16} />
                                {profile?.user?.name}
                            </div>
                            <button
                                onClick={logout}
                                className='text-sm cursor-pointer text-red-600 font-semibold hover:underline'
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className='md:hidden p-2'
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className='md:hidden bg-white border-t p-4 space-y-4'>
                    <a
                        className='block text-gray-700 font-medium py-2 border-b border-gray-100'
                        onClick={() => navigate('/all-specialty')}
                    >
                        Chuyên Khoa
                    </a>
                    <a
                        onClick={() => navigate('/all-services')}
                        className='block text-gray-700 font-medium py-2 border-b border-gray-100'
                    >
                        Dịch Vụ
                    </a>
                    <a
                        onClick={() => navigate('/all-doctors')}
                        className='block text-gray-700 font-medium py-2 border-b border-gray-100'
                    >
                        Bác Sĩ
                    </a>
                    <button className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mt-4'>
                        Đăng nhập / Đăng ký
                    </button>
                </div>
            )}
        </header>
    );
};

const HeroBanner = () => {
    return (
        <div className='relative bg-linear-to-r from-blue-600 to-cyan-500 py-16 md:py-24'>
            <div className='container mx-auto px-4 text-center text-white'>
                <h2 className='text-3xl md:text-5xl font-bold mb-4'>
                    Chăm sóc sức khỏe toàn diện
                </h2>
                <p className='text-blue-100 text-lg mb-8 max-w-2xl mx-auto'>
                    Đặt lịch khám nhanh chóng với các bác sĩ hàng đầu và dịch vụ
                    y tế chất lượng cao.
                </p>

                {/* Search Box */}
                <div className='max-w-3xl mx-auto bg-white rounded-full p-2 flex shadow-xl transform translate-y-6 md:translate-y-0'>
                    <div className='flex-1 flex items-center px-4 border-r border-gray-200'>
                        <Search className='text-gray-400 w-5 h-5 mr-3' />
                        <input
                            type='text'
                            placeholder='Tìm chuyên khoa, bác sĩ...'
                            className='w-full py-2 outline-none text-gray-700 placeholder-gray-400'
                        />
                    </div>
                    <button className='bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-8 rounded-full transition-colors hidden md:block'>
                        Tìm kiếm
                    </button>
                    <button className='bg-yellow-400 p-3 rounded-full md:hidden'>
                        <Search className='text-blue-900 w-5 h-5' />
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className='container mx-auto px-4 mt-12 grid grid-cols-2 md:grid-cols-4 gap-4'>
                {[
                    {
                        icon: <Stethoscope size={24} />,
                        text: 'Khám Chuyên khoa'
                    },
                    { icon: <Activity size={24} />, text: 'Khám Tổng quát' },
                    { icon: <Clock size={24} />, text: 'Lịch sử đặt khám' },
                    { icon: <MapPin size={24} />, text: 'Cơ sở y tế gần bạn' }
                ].map((action, idx) => (
                    <div
                        key={idx}
                        className='bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center text-white hover:bg-white/20 cursor-pointer transition-all border border-white/10'
                    >
                        <div className='mb-2 p-2 bg-white/20 rounded-full'>
                            {action.icon}
                        </div>
                        <span className='font-medium text-sm text-center'>
                            {action.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Cập nhật SectionTitle nhận thêm onClick cho nút xem thêm
const SectionTitle = ({ title, linkText = 'Xem thêm', onClick }) => (
    <div className='flex justify-between items-end mb-6'>
        <h3 className='text-2xl font-bold text-gray-800 pl-4 border-l-4 border-blue-600'>
            {title}
        </h3>
        <button
            onClick={onClick}
            className='text-blue-600 font-semibold text-sm hover:underline flex items-center'
        >
            {linkText} <ChevronRight size={16} />
        </button>
    </div>
);

const SpecialtyList = ({ specialties }) => {
    const navigate = useNavigate();

    return (
        <section className='py-12 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <SectionTitle
                    title='Chuyên khoa phổ biến'
                    onClick={() => navigate('/all-specialty')}
                />
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                    {specialties.map((item) => (
                        <div
                            key={item.id}
                            // Thêm sự kiện navigate khi click vào chuyên khoa
                            onClick={() =>
                                navigate(`/doctor-specialty/${item.id}`)
                            }
                            className='group bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-100'
                        >
                            <div className='h-32 overflow-hidden'>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                                    onError={(e) => {
                                        e.target.src =
                                            'https://placehold.co/400x300?text=Specialty';
                                    }}
                                />
                            </div>
                            <div className='p-4 text-center'>
                                <h4 className='font-semibold text-gray-800 group-hover:text-blue-600 transition-colors'>
                                    {item.name}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const DoctorList = ({ doctors }) => {
    const navigate = useNavigate();

    return (
        <section className='py-12 bg-white'>
            <div className='container mx-auto px-4'>
                <SectionTitle
                    title='Bác sĩ nổi bật'
                    onClick={() => navigate('/all-doctors')}
                />
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {doctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            className='bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all flex flex-col items-center text-center group'
                        >
                            <div className='w-24 h-24 rounded-full overflow-hidden border-2 border-blue-100 mb-4 group-hover:border-blue-500 transition-colors'>
                                <img
                                    src={doctor.image}
                                    alt={doctor.user.name}
                                    className='w-full h-full object-cover'
                                    onError={(e) => {
                                        e.target.src =
                                            'https://placehold.co/300x300?text=Doctor';
                                    }}
                                />
                            </div>
                            <h4 className='font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-600'>
                                {doctor.degree} {doctor.user.name}
                            </h4>
                            <p className='text-gray-500 text-sm mb-2'>
                                {doctor.specialtyName || 'Chuyên khoa'}
                            </p>
                            <div className='mt-auto w-full pt-4 border-t border-gray-100'>
                                <div className='flex justify-center items-center gap-1 text-yellow-500 text-sm mb-2'>
                                    <Star size={14} fill='currentColor' />
                                    <Star size={14} fill='currentColor' />
                                    <Star size={14} fill='currentColor' />
                                    <Star size={14} fill='currentColor' />
                                    <Star size={14} fill='currentColor' />
                                    <span className='text-gray-400 ml-1'>
                                        (50+)
                                    </span>
                                </div>
                                <div className='flex justify-between items-center px-2'>
                                    <span className='font-bold text-blue-600'>
                                        {formatCurrency(doctor.price)}
                                    </span>
                                    <button
                                        className='text-xs cursor-pointer bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all'
                                        onClick={() =>
                                            navigate(
                                                `/doctor/detail/${doctor.id}`
                                            )
                                        }
                                    >
                                        Chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ServiceList = ({ services }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isBooking, setIsBooking] = useState(false);

    const handleBookService = async (serviceId) => {
        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để đặt lịch dịch vụ.');
            navigate('/login');
            return;
        }

        const confirmBooking = window.confirm(
            'Bạn có chắc chắn muốn đặt lịch cho dịch vụ này?'
        );
        if (!confirmBooking) return;

        setIsBooking(true);

        try {
            const res = await api.post('/api/patient/appointments', {
                serviceId: serviceId
            });

            if (res.data && res.data.errCode === 0) {
                alert('Đặt lịch dịch vụ thành công! Vui lòng kiểm tra email.');
            } else {
                alert(
                    res.data?.message || 'Đặt lịch thất bại. Vui lòng thử lại.'
                );
            }
        } catch (error) {
            console.error('Lỗi khi đặt dịch vụ:', error);
            alert('Lỗi hệ thống. Vui lòng thử lại sau.');
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <section className='py-12 bg-blue-50 relative'>
            {isBooking && (
                <div className='fixed inset-0 bg-black/20 z-9999 flex items-center justify-center backdrop-blur-[2px]'>
                    <div className='bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-3'>
                        <Loader2 className='animate-spin text-blue-600 w-10 h-10' />
                        <span className='text-gray-800 font-semibold'>
                            Đang xử lý đặt lịch...
                        </span>
                    </div>
                </div>
            )}

            <div className='container mx-auto px-4'>
                <SectionTitle
                    title='Dịch vụ y tế'
                    linkText='Xem tất cả'
                    onClick={() => navigate('/all-services')}
                />
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className='bg-white rounded-xl p-6 shadow-sm border border-transparent hover:border-blue-200 transition-all flex flex-col h-full'
                        >
                            <div className='flex justify-between items-start mb-4'>
                                <div className='bg-blue-100 p-3 rounded-lg text-blue-600'>
                                    <Activity size={24} />
                                </div>
                                <span className='bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded'>
                                    {service.durationMinutes} phút
                                </span>
                            </div>
                            <h4 className='text-xl font-bold text-gray-800 mb-2'>
                                {service.name}
                            </h4>
                            <p className='text-gray-500 text-sm mb-6 grow line-clamp-2'>
                                {service.description}
                            </p>
                            <div className='flex items-center justify-between mt-auto'>
                                <span className='text-lg font-bold text-blue-600'>
                                    {formatCurrency(service.price)}
                                </span>
                                <button
                                    onClick={() =>
                                        !isBooking &&
                                        handleBookService(service.id)
                                    }
                                    disabled={isBooking}
                                    className={`
                                    px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors
                                    ${
                                        isBooking
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                                    }
                                    `}
                                >
                                    <CalendarCheck size={16} />
                                    Đặt lịch
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className='bg-gray-900 text-gray-300 py-12'>
            <div className='container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8'>
                <div>
                    <div className='flex items-center gap-2 mb-4 text-white'>
                        <div className='bg-blue-600 p-1.5 rounded'>
                            <HeartPulse className='w-5 h-5' />
                        </div>
                        <span className='text-xl font-bold'>HealthCare</span>
                    </div>
                    <p className='text-sm text-gray-400 mb-4'>
                        Nền tảng y tế sức khỏe toàn diện, kết nối người dùng với
                        các bác sĩ và cơ sở y tế hàng đầu.
                    </p>
                    <div className='flex gap-2 text-gray-400'>
                        <MapPin size={16} />
                        <span className='text-sm'>Hồ Chí Minh, Việt Nam</span>
                    </div>
                </div>

                <div>
                    <h4 className='text-white font-bold mb-4'>Liên kết</h4>
                    <ul className='space-y-2 text-sm'>
                        <li>
                            <a href='#' className='hover:text-blue-400'>
                                Về chúng tôi
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-blue-400'>
                                Dành cho bác sĩ
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-blue-400'>
                                Dành cho bệnh nhân
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-blue-400'>
                                Gói khám doanh nghiệp
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className='text-white font-bold mb-4'>Hỗ trợ</h4>
                    <ul className='space-y-2 text-sm'>
                        <li>
                            <a href='#' className='hover:text-blue-400'>
                                Câu hỏi thường gặp
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-blue-400'>
                                Điều khoản sử dụng
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-blue-400'>
                                Chính sách bảo mật
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-blue-400'>
                                Quy trình hoàn tiền
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className='text-white font-bold mb-4'>Tải ứng dụng</h4>
                    <div className='flex flex-col gap-3'>
                        <button className='bg-gray-800 border border-gray-700 hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-3 transition-colors'>
                            <div className='w-6 h-6 bg-gray-600 rounded-full'></div>
                            <div className='text-left'>
                                <div className='text-[10px] uppercase'>
                                    Get it on
                                </div>
                                <div className='text-sm font-bold text-white'>
                                    Google Play
                                </div>
                            </div>
                        </button>
                        <button className='bg-gray-800 border border-gray-700 hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-3 transition-colors'>
                            <div className='w-6 h-6 bg-gray-600 rounded-full'></div>
                            <div className='text-left'>
                                <div className='text-[10px] uppercase'>
                                    Download on the
                                </div>
                                <div className='text-sm font-bold text-white'>
                                    App Store
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div className='container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500'>
                &copy; 2025 HealthCare System. All rights reserved.
            </div>
        </footer>
    );
};

// --- MAIN APP COMPONENT ---
const Home = () => {
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctors = await api.get('/api/doctor/all');
                if (doctors.data && doctors.data.errCode === 0) {
                    setDoctors(doctors.data.data);
                }
                const specialties = await api.get('/api/specialty');
                if (specialties.data && specialties.data.errCode === 0) {
                    setSpecialties(specialties.data.data);
                }
                const services = await api.get('/api/service');
                if (services.data && services.data.errCode === 0) {
                    setServices(services.data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className='min-h-screen flex flex-col justify-center items-center bg-gray-50'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4'></div>
                <p className='text-gray-500 font-medium animate-pulse'>
                    Đang tải dữ liệu y tế...
                </p>
            </div>
        );
    }

    return (
        <div className='font-sans text-gray-600 bg-white min-h-screen flex flex-col'>
            <Header />
            <main className='grow'>
                <HeroBanner />

                {/* Sections */}
                <SpecialtyList specialties={specialties} />
                <DoctorList doctors={doctors} />
                <ServiceList services={services} />
            </main>
            <Footer />
        </div>
    );
};

export default Home;

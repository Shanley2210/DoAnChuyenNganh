import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    Clock,
    ChevronLeft,
    Star,
    Share2,
    ThumbsUp,
    MessageCircle,
    Phone,
    Menu,
    X,
    User,
    HeartPulse,
    Loader2 // Import icon loading
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// --- UTILS HELPERS ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Number(amount));
};

const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);

        const day = date.getDay();
        const dd = date.getDate();
        const mm = date.getMonth() + 1;

        let label = '';
        if (i === 0) {
            label = `Hôm nay - ${dd}/${mm}`;
        } else {
            const dayNames = [
                'Chủ nhật',
                'Thứ 2',
                'Thứ 3',
                'Thứ 4',
                'Thứ 5',
                'Thứ 6',
                'Thứ 7'
            ];
            label = `${dayNames[day]} - ${dd}/${mm}`;
        }

        days.push({
            label: label,
            value: date.getTime()
        });
    }
    return days;
};

const formatDateForApi = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(Number(timestamp));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
};

const formatTimeDisplay = (startIso, endIso) => {
    if (!startIso || !endIso) return '';

    const format = (iso) => {
        const date = new Date(iso);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return `${format(startIso)} - ${format(endIso)}`;
};

// --- COMPONENT: HEADER ---
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

                <button
                    className='md:hidden p-2'
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

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

// --- COMPONENT: DOCTOR HEADER ---
const DoctorHeader = ({ doctor }) => (
    <div className='bg-white shadow-sm border-b mb-4'>
        <div className='container mx-auto px-4 py-4'>
            <button className='cursor-pointer flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors'>
                <ChevronLeft size={20} /> Quay lại
            </button>

            <div className='flex flex-col md:flex-row gap-6'>
                <div className='shrink-0 mx-auto md:mx-0'>
                    <img
                        src={doctor.image}
                        alt={doctor.user.name}
                        className='w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-50 shadow-md'
                        onError={(e) => {
                            e.target.src =
                                'https://placehold.co/150x150?text=Doctor';
                        }}
                    />
                </div>

                <div className='grow text-center md:text-left'>
                    <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
                        {doctor.degree} {doctor.user.name}
                    </h1>
                    <p className='text-gray-600 mb-3 md:w-3/4'>
                        Nguyên Trưởng khoa {doctor.specialty?.name} - Bệnh viện
                        Chợ Rẫy. Hơn 20 năm kinh nghiệm trong khám và điều trị
                        các bệnh lý {doctor.specialty?.name}.
                    </p>

                    <div className='flex flex-col md:flex-row gap-4 justify-center md:justify-start text-sm text-gray-500 mb-4'>
                        <div className='flex items-center gap-1'>
                            <MapPin size={16} />
                            <span>{doctor.address}</span>
                        </div>
                        <div className='flex items-center gap-1 text-yellow-500'>
                            <Star size={16} fill='currentColor' />
                            <span>4.9 (200+ đánh giá)</span>
                        </div>
                    </div>

                    <div className='flex gap-3 justify-center md:justify-start'>
                        <button className='cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-50 text-gray-600 text-sm'>
                            <ThumbsUp size={16} /> Thích
                        </button>
                        <button className='cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-50 text-gray-600 text-sm'>
                            <Share2 size={16} /> Chia sẻ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- COMPONENT: SCHEDULE SECTION ---
const ScheduleSection = ({ doctorId, price, address, room }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateOptions, setDateOptions] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [isBooking, setIsBooking] = useState(false); // State loading khi đặt lịch
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Init Date Options
    useEffect(() => {
        const days = getNext7Days();
        setDateOptions(days);
        if (days && days.length > 0) {
            setSelectedDate(days[0].value);
        }
    }, []);

    // Fetch Slots khi Date hoặc DoctorId thay đổi
    useEffect(() => {
        const fetchSlots = async () => {
            if (!selectedDate || !doctorId) return;

            setLoadingSlots(true);
            try {
                const formattedDate = formatDateForApi(selectedDate);
                const res = await api.get(
                    `/api/doctor/slots/${doctorId}?date=${formattedDate}`
                );

                if (res.data && res.data.errCode === 0) {
                    setSlots(res.data.data);
                } else {
                    setSlots([]);
                }
            } catch (error) {
                console.error('Error fetching slots:', error);
                setSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [selectedDate, doctorId]);

    // XỬ LÝ ĐẶT LỊCH KHÁM
    const handleBooking = async (slotId) => {
        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để đặt lịch khám.');
            navigate('/login');
            return;
        }

        const isConfirmed = window.confirm(
            'Bạn có chắc chắn muốn đặt lịch khám vào khung giờ này?'
        );
        if (!isConfirmed) return;

        // Bắt đầu loading
        setIsBooking(true);

        try {
            const response = await api.post('/api/patient/appointments', {
                doctorId: doctorId,
                slotId: slotId
            });

            if (response.data && response.data.errCode === 0) {
                alert(
                    'Đặt lịch khám bệnh thành công! Vui lòng kiểm tra email.'
                );
            } else {
                alert(
                    response.data?.message ||
                        'Đặt lịch thất bại. Vui lòng thử lại.'
                );
            }
        } catch (error) {
            console.error('Lỗi đặt lịch:', error);
            alert('Lỗi hệ thống. Vui lòng thử lại sau.');
        } finally {
            // Kết thúc loading (chạy kể cả khi thành công hay thất bại)
            setIsBooking(false);
        }
    };

    return (
        <div className='bg-white rounded-lg shadow-sm border p-6 h-full relative'>
            {/* Overlay Loading khi đang đặt lịch */}
            {isBooking && (
                <div className='absolute inset-0 bg-white/70 z-50 flex items-center justify-center rounded-lg backdrop-blur-[1px]'>
                    <div className='flex flex-col items-center gap-2'>
                        <Loader2 className='animate-spin text-blue-600 w-8 h-8' />
                        <span className='text-blue-600 font-semibold text-sm'>
                            Đang xử lý...
                        </span>
                    </div>
                </div>
            )}

            {/* Date Selector */}
            <div className='mb-6'>
                <div className='flex items-center gap-2 font-bold text-gray-800 mb-3 uppercase text-sm border-b pb-2'>
                    <Calendar size={18} className='text-blue-600' /> Lịch khám
                </div>
                <select
                    className='cursor-pointer w-full md:w-1/2 p-2 border-b-2 border-gray-300 text-blue-600 font-semibold focus:outline-none focus:border-blue-600 text-sm md:text-base'
                    onChange={(e) => setSelectedDate(e.target.value)}
                    value={selectedDate || ''}
                    disabled={isBooking}
                >
                    {dateOptions.map((day, idx) => (
                        <option key={idx} value={day.value}>
                            {day.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Slots Grid */}
            <div className='mb-6'>
                <div className='flex items-center gap-2 text-gray-600 text-sm mb-4'>
                    <Clock size={16} />
                    <span>Chọn và đặt (Phí đặt lịch 0đ)</span>
                </div>

                {loadingSlots ? (
                    <div className='flex justify-center items-center py-4'>
                        <div className='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600'></div>
                    </div>
                ) : slots && slots.length > 0 ? (
                    <div className='grid grid-cols-4 md:grid-cols-8 gap-2'>
                        {slots.map((slot) => {
                            const timeLabel = formatTimeDisplay(
                                slot.startTime,
                                slot.endTime
                            );

                            // Kiểm tra trạng thái full
                            const isFull =
                                slot.isFull === true ||
                                slot.status === 'full' ||
                                (slot.currentNumber &&
                                    slot.maxNumber &&
                                    slot.currentNumber >= slot.maxNumber);

                            return (
                                <button
                                    key={slot.id}
                                    disabled={isFull || isBooking}
                                    className={`
                                        py-2 px-1 text-xs md:text-sm rounded transition-all border border-transparent truncate
                                        ${
                                            isFull
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-yellow-50 hover:bg-yellow-400 hover:text-white text-gray-800 hover:shadow-md cursor-pointer font-medium'
                                        }
                                    `}
                                    onClick={() =>
                                        !isFull && handleBooking(slot.id)
                                    }
                                >
                                    {timeLabel}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <p className='text-gray-500 italic'>
                        Không có lịch khám cho ngày này.
                    </p>
                )}
            </div>

            {/* Address & Price Info */}
            <div className='border-t pt-4 text-sm'>
                <div className='mb-3'>
                    <h4 className='font-semibold text-gray-700 uppercase text-xs mb-1'>
                        Địa chỉ khám
                    </h4>
                    <p className='font-medium text-gray-800'>{address}</p>
                    <p className='text-gray-500'>Phòng {room}</p>
                </div>

                <div className='flex items-center gap-2 border-t border-dashed pt-3 mt-3'>
                    <span className='font-semibold text-gray-700 uppercase text-xs'>
                        Giá khám:
                    </span>
                    <span className='font-bold text-gray-800 text-base'>
                        {formatCurrency(price)}
                    </span>
                    <span className='cursor-pointer text-xs text-gray-500 ml-auto hover:text-blue-600'>
                        Xem chi tiết
                    </span>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: DOCTOR INFO EXTRA ---
const DoctorInfoExtra = () => (
    <div className='bg-white rounded-lg shadow-sm border p-6 h-full text-sm text-gray-600'>
        <h3 className='uppercase text-gray-800 font-bold mb-4 border-b pb-2'>
            Thông tin chi tiết
        </h3>
        <div className='space-y-4'>
            <div>
                <strong className='text-gray-700 block mb-1'>
                    Bảo hiểm áp dụng:
                </strong>
                <ul className='list-disc pl-5 space-y-1'>
                    <li>Bảo hiểm Y tế nhà nước</li>
                    <li>Bảo hiểm bảo lãnh (PVI, BaoViet, Insmart...)</li>
                </ul>
            </div>
            <div>
                <strong className='text-gray-700 block mb-1'>
                    Chuyên trị:
                </strong>
                <p>
                    Đau đầu, mất ngủ, rối loạn tiền đình, tai biến mạch máu não,
                    đau thần kinh tọa, bệnh Parkinson...
                </p>
            </div>
            <div className='bg-blue-50 p-3 rounded text-blue-800'>
                <strong className='mb-1 flex items-center gap-1'>
                    <MessageCircle size={14} /> Lưu ý:
                </strong>
                <p>
                    Vui lòng mang theo kết quả xét nghiệm cũ (nếu có) khi đi
                    khám.
                </p>
            </div>
        </div>
    </div>
);

// --- MAIN PAGE ---
const DetailDoctor = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            if (!id) return;
            try {
                const res = await api.get(`/api/doctor/detail/${id}`);
                if (res.data && res.data.errCode === 0) {
                    setDoctor(res.data.data);
                }
            } catch (e) {
                console.error('Failed to fetch doctor info', e);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    if (loading)
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600'></div>
            </div>
        );

    if (!doctor)
        return (
            <div className='text-center p-10'>
                Không tìm thấy thông tin bác sĩ.
            </div>
        );

    return (
        <div className='bg-gray-50 min-h-screen font-sans pb-12'>
            <Header />
            <DoctorHeader doctor={doctor} />

            <div className='container mx-auto px-4'>
                <div className='flex flex-col gap-6'>
                    <div>
                        {/* Truyền doctorId vào ScheduleSection */}
                        <ScheduleSection
                            doctorId={doctor.id}
                            price={doctor.price}
                            address={doctor.address}
                            room={doctor.room}
                        />
                    </div>

                    <div>
                        <DoctorInfoExtra />
                    </div>

                    <div className='bg-white rounded-lg shadow-sm border p-6'>
                        <h3 className='text-lg font-bold text-gray-800 mb-3'>
                            Giới thiệu
                        </h3>
                        <div className='text-gray-600 leading-relaxed space-y-2'>
                            <p>
                                Bác sĩ <strong>{doctor.user.name}</strong> là
                                một trong những chuyên gia hàng đầu về{' '}
                                {doctor.specialty?.name} tại Việt Nam.
                            </p>
                            <p>
                                Với bề dày kinh nghiệm làm việc tại các bệnh
                                viện lớn, bác sĩ đã điều trị thành công cho hàng
                                nghìn bệnh nhân mắc các bệnh lý phức tạp.
                            </p>
                            <p>
                                Phương châm làm việc: "Tận tâm - Chuyên nghiệp -
                                Hiệu quả".
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailDoctor;

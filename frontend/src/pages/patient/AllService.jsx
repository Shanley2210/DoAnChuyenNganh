import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// --- UTILS ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

const AllService = () => {
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false); // State loading cho việc đặt lịch

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // 1. Fetch dữ liệu thật từ API thay vì Mock Data
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/api/service');
                if (res.data && res.data.errCode === 0) {
                    setServices(res.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách dịch vụ:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // 2. Logic đặt lịch (Copy từ Home)
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

    // Filter logic
    const filteredServices = services.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='bg-gray-50 min-h-screen font-sans relative'>
            {/* Overlay Loading khi đang đặt lịch */}
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

            {/* Header */}
            <div className='bg-white sticky top-0 z-10 shadow-sm border-b'>
                <div className='container mx-auto px-4 h-16 flex items-center gap-4'>
                    <button
                        onClick={() => navigate(-1)}
                        className='p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors'
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className='text-xl font-bold text-gray-800'>
                        Dịch vụ Y tế
                    </h1>
                </div>
            </div>

            <div className='container mx-auto px-4 py-8'>
                {/* Search Bar */}
                <div className='max-w-xl mx-auto mb-10 relative'>
                    <input
                        type='text'
                        placeholder='Tìm kiếm dịch vụ, gói khám...'
                        className='w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search
                        className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'
                        size={20}
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className='flex flex-col justify-center items-center py-12'>
                        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4'></div>
                        <p className='text-gray-500'>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <>
                        {filteredServices.length === 0 ? (
                            <div className='text-center py-12 text-gray-500'>
                                Không tìm thấy dịch vụ nào phù hợp.
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {filteredServices.map((service) => (
                                    <div
                                        key={service.id}
                                        className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full'
                                    >
                                        <div className='h-48 overflow-hidden relative'>
                                            {/* Xử lý ảnh fallback nếu API không trả về ảnh hoặc ảnh lỗi */}
                                            <img
                                                src={
                                                    service.image ||
                                                    'https://placehold.co/400x300?text=Service'
                                                }
                                                alt={service.name}
                                                className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                                                onError={(e) => {
                                                    e.target.src =
                                                        'https://placehold.co/400x300?text=Service';
                                                }}
                                            />
                                            <div className='absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700 flex items-center gap-1'>
                                                {/* API thường trả về durationMinutes, fallback về duration nếu cần */}
                                                <Clock size={12} />{' '}
                                                {service.durationMinutes ||
                                                    service.duration ||
                                                    30}{' '}
                                                phút
                                            </div>
                                        </div>

                                        <div className='p-5 flex flex-col grow'>
                                            <h3 className='font-bold text-xl text-gray-800 mb-2'>
                                                {service.name}
                                            </h3>
                                            <p className='text-gray-500 text-sm mb-4 line-clamp-3 grow'>
                                                {service.description}
                                            </p>

                                            <div className='border-t pt-4 mt-auto'>
                                                <div className='flex items-center justify-between mb-4'>
                                                    <span className='text-gray-500 text-xs uppercase font-semibold'>
                                                        Chi phí trọn gói
                                                    </span>
                                                    <span className='text-lg font-bold text-blue-600'>
                                                        {formatCurrency(
                                                            service.price
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Nút Đặt ngay (Full width) - Đã bỏ nút Chi tiết */}
                                                <button
                                                    onClick={() =>
                                                        !isBooking &&
                                                        handleBookService(
                                                            service.id
                                                        )
                                                    }
                                                    disabled={isBooking}
                                                    className={`
                                                        w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-white shadow-sm transition-colors
                                                        ${
                                                            isBooking
                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                : 'bg-blue-600 hover:bg-blue-700'
                                                        }
                                                    `}
                                                >
                                                    {isBooking ? (
                                                        <Loader2
                                                            size={20}
                                                            className='animate-spin'
                                                        />
                                                    ) : (
                                                        <CheckCircle
                                                            size={20}
                                                        />
                                                    )}
                                                    {isBooking
                                                        ? 'Đang xử lý...'
                                                        : 'Đặt lịch ngay'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllService;

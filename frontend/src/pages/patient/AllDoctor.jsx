import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Stethoscope, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

const AllDoctor = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get('/api/doctor/all');
                if (response.data && response.data.errCode === 0) {
                    setDoctors(response.data.data);
                } else {
                    setDoctors([]);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter((doc) => {
        const name = doc.user?.name?.toLowerCase() || '';
        const degree = doc.degree?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || degree.includes(search);
    });

    // Cập nhật đường dẫn cho khớp với trang Home
    const handleDoctorClick = (id) => {
        navigate(`/doctor/detail/${id}`);
    };

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
        <div className='min-h-screen bg-gray-50 py-8 px-4 font-sans'>
            <div className='container mx-auto max-w-6xl'>
                {/* Header & Search */}
                <div className='mb-8 text-center'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>
                        Đội ngũ Bác sĩ Chuyên khoa
                    </h1>
                    <p className='text-gray-500 mb-6'>
                        Đặt lịch khám với các bác sĩ hàng đầu một cách nhanh
                        chóng.
                    </p>

                    <div className='relative max-w-lg mx-auto'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <Search className='h-5 w-5 text-gray-400' />
                        </div>
                        <input
                            type='text'
                            className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm'
                            placeholder='Tìm kiếm bác sĩ, thạc sĩ, chuyên khoa...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Empty State */}
                {!loading && filteredDoctors.length === 0 && (
                    <div className='text-center py-12'>
                        <div className='text-gray-400 text-lg'>
                            Không tìm thấy bác sĩ phù hợp.
                        </div>
                    </div>
                )}

                {/* Doctor Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filteredDoctors.map((doc) => (
                        <div
                            key={doc.id}
                            // Sự kiện click chuyển trang
                            onClick={() => handleDoctorClick(doc.id)}
                            // Class "cursor-pointer" để hiển thị icon bàn tay
                            className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col'
                        >
                            {/* Image Section */}
                            <div className='h-48 overflow-hidden bg-gray-100 relative'>
                                <img
                                    src={doc.image}
                                    alt={doc.user?.name}
                                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                                    onError={(e) => {
                                        e.target.src =
                                            'https://placehold.co/300x300?text=Doctor';
                                    }}
                                />
                            </div>

                            {/* Content Section */}
                            <div className='p-5 flex flex-col flex-1'>
                                <div className='mb-2'>
                                    <h3 className='text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1'>
                                        {doc.degree} {doc.user?.name}
                                    </h3>
                                    <p className='text-sm text-blue-500 font-medium flex items-center gap-1 mt-1'>
                                        <Stethoscope size={14} />
                                        {doc.specialty?.name || 'Chuyên khoa'}
                                    </p>
                                </div>

                                <div className='h-px bg-gray-100 my-3'></div>

                                <div className='space-y-2 text-sm text-gray-600 mb-4 flex-1'>
                                    <div className='flex items-start gap-2'>
                                        <MapPin
                                            size={16}
                                            className='text-gray-400 mt-0.5 shrink-0'
                                        />
                                        <span className='line-clamp-2'>
                                            {doc.address ||
                                                'Chưa cập nhật địa chỉ'}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-gray-400 font-medium'>
                                            Giá khám:
                                        </span>
                                        <span className='text-gray-900 font-bold'>
                                            {formatCurrency(doc.price)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllDoctor;

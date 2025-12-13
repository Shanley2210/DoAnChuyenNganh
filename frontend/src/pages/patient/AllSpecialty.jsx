import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const AllSpecialty = () => {
    const [specialties, setSpecialties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const res = await api.get('/api/specialty');
                if (res.data && res.data.errCode === 0) {
                    setSpecialties(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching specialties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialties();
    }, []);

    // Filter logic
    const filteredSpecialties = specialties.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='bg-gray-50 min-h-screen font-sans'>
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
                        Tất cả Chuyên khoa
                    </h1>
                </div>
            </div>

            <div className='container mx-auto px-4 py-8'>
                {/* Search Bar */}
                <div className='max-w-xl mx-auto mb-10 relative'>
                    <input
                        type='text'
                        placeholder='Tìm kiếm chuyên khoa...'
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
                        <Loader2 className='animate-spin text-blue-600 w-10 h-10 mb-2' />
                        <span className='text-gray-500 text-sm'>
                            Đang tải dữ liệu...
                        </span>
                    </div>
                ) : (
                    <>
                        {filteredSpecialties.length === 0 ? (
                            <div className='text-center py-12 text-gray-500'>
                                Không tìm thấy chuyên khoa nào phù hợp.
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                                {filteredSpecialties.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() =>
                                            navigate(
                                                `/doctor-specialty/${item.id}`
                                            )
                                        }
                                        className='group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer flex flex-col h-full'
                                    >
                                        <div className='h-48 overflow-hidden relative'>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                                                onError={(e) => {
                                                    e.target.src =
                                                        'https://placehold.co/400x300?text=Specialty';
                                                }}
                                            />
                                            <div className='absolute inset-0 bg-liner-to-t from-black/50 to-transparent opacity-60'></div>
                                        </div>
                                        <div className='p-4 flex flex-col grow'>
                                            <h3 className='font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors'>
                                                {item.name}
                                            </h3>
                                            <div className='flex justify-between items-center mt-auto pt-2'>
                                                <span className='text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded'>
                                                    Xem chi tiết
                                                </span>
                                                <button className='text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100'>
                                                    <ArrowRight size={18} />
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

export default AllSpecialty;

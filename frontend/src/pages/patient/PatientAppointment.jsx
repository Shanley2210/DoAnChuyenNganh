import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    FileText,
    CheckCircle,
    AlertCircle,
    ChevronLeft,
    Stethoscope,
    Activity,
    MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

// --- UTILS ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Number(amount));
};

const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusConfig = (status) => {
    switch (status) {
        case 'pending':
            return {
                color: 'bg-yellow-100 text-yellow-800',
                text: 'Chờ xác nhận',
                icon: AlertCircle
            };
        case 'confirmed':
            return {
                color: 'bg-green-100 text-green-800',
                text: 'Đã xác nhận',
                icon: CheckCircle
            };
        case 'cancelled':
            return {
                color: 'bg-red-100 text-red-800',
                text: 'Đã hủy',
                icon: AlertCircle
            };
        case 'completed':
            return {
                color: 'bg-blue-100 text-blue-800',
                text: 'Hoàn thành',
                icon: CheckCircle
            };
        default:
            return {
                color: 'bg-gray-100 text-gray-800',
                text: status,
                icon: FileText
            };
    }
};

// --- COMPONENT ---
const PatientAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // SỬA ĐỔI: Loại bỏ logic kiểm tra .ok và .json() của fetch thuần
                const response = await api.get('/api/patient/appointments');

                // Với Axios, dữ liệu backend trả về nằm trong response.data
                const resData = response.data;

                if (resData && resData.errCode === 0) {
                    setAppointments(resData.data);
                } else {
                    console.error('Error fetching data:', resData?.message);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            </div>
        );
    }

    return (
        <div className='bg-gray-50 min-h-screen font-sans pb-10'>
            {/* Header */}
            <div className='bg-white shadow-sm border-b sticky top-0 z-10'>
                <div className='container mx-auto px-4 h-16 flex items-center gap-3'>
                    <button
                        onClick={() => navigate(-1)}
                        className='p-2 hover:bg-gray-100 rounded-full text-gray-600'
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className='text-xl font-bold text-gray-800'>
                        Lịch sử cuộc hẹn
                    </h1>
                </div>
            </div>

            {/* List */}
            <div className='container mx-auto px-4 py-6 max-w-3xl'>
                {appointments.length === 0 ? (
                    <div className='text-center py-10 text-gray-500'>
                        Bạn chưa có cuộc hẹn nào.
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {appointments.map((apt) => {
                            const StatusIcon = getStatusConfig(apt.status).icon;

                            // Xác định loại cuộc hẹn (Bác sĩ hay Dịch vụ)
                            const isDoctorAppointment = !!apt.doctor;
                            const title = isDoctorAppointment
                                ? `Bác sĩ ${apt.doctor.user.name}`
                                : apt.service?.name;
                            const typeLabel = isDoctorAppointment
                                ? 'Khám chuyên khoa'
                                : 'Dịch vụ y tế';
                            const price = isDoctorAppointment
                                ? apt.doctor.price
                                : apt.service?.price;

                            // Thời gian hiển thị
                            const displayDate =
                                isDoctorAppointment && apt.slot
                                    ? formatDate(apt.slot.startTime)
                                    : formatDate(apt.createdAt);

                            const displayTime =
                                isDoctorAppointment && apt.slot
                                    ? `${formatTime(
                                          apt.slot.startTime
                                      )} - ${formatTime(apt.slot.endTime)}`
                                    : formatTime(apt.createdAt);

                            return (
                                <div
                                    key={apt.id}
                                    className='bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow'
                                >
                                    <div className='p-5'>
                                        <div className='flex justify-between items-start mb-4'>
                                            <div className='flex gap-4'>
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                                        isDoctorAppointment
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-purple-100 text-purple-600'
                                                    }`}
                                                >
                                                    {isDoctorAppointment ? (
                                                        <Stethoscope
                                                            size={24}
                                                        />
                                                    ) : (
                                                        <Activity size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
                                                        {typeLabel}
                                                    </p>
                                                    <h3 className='text-lg font-bold text-gray-800 leading-tight'>
                                                        {title}
                                                    </h3>
                                                    {isDoctorAppointment && (
                                                        <div className='flex items-center gap-1 text-gray-500 text-sm mt-1'>
                                                            <MapPin size={14} />
                                                            <span>
                                                                Phòng{' '}
                                                                {
                                                                    apt.doctor
                                                                        .room
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                                                    getStatusConfig(apt.status)
                                                        .color
                                                }`}
                                            >
                                                <StatusIcon size={12} />
                                                {
                                                    getStatusConfig(apt.status)
                                                        .text
                                                }
                                            </span>
                                        </div>

                                        <div className='border-t border-dashed pt-4 flex flex-col sm:flex-row justify-between gap-4'>
                                            <div className='flex items-center gap-6'>
                                                <div>
                                                    <p className='text-xs text-gray-500 mb-1 flex items-center gap-1'>
                                                        <Calendar size={12} />{' '}
                                                        Ngày
                                                    </p>
                                                    <p className='font-medium text-gray-700'>
                                                        {displayDate}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className='text-xs text-gray-500 mb-1 flex items-center gap-1'>
                                                        <Clock size={12} /> Giờ
                                                    </p>
                                                    <p className='font-medium text-gray-700'>
                                                        {displayTime}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='text-right'>
                                                <p className='text-xs text-gray-500 mb-1'>
                                                    Tổng tiền
                                                </p>
                                                <p className='text-lg font-bold text-blue-600'>
                                                    {formatCurrency(price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='bg-gray-50 px-5 py-3 text-xs text-gray-500 flex justify-between items-center'>
                                        <span>Mã đặt hẹn: #{apt.id}</span>
                                        <span>
                                            Đặt lúc: {formatDate(apt.createdAt)}{' '}
                                            {formatTime(apt.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientAppointment;

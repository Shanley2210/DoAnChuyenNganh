import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    CheckCircle,
    Play,
    FileText,
    X,
    Save,
    Pill,
    Stethoscope,
    AlertCircle,
    Activity
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext'; // 1. Import useAuth

// --- UTILS ---
const getStatusBadge = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'confirmed':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'examining':
            return 'bg-purple-100 text-purple-800 border-purple-200 animate-pulse';
        case 'completed':
            return 'bg-green-100 text-green-800 border-green-200';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'pending':
            return 'Chờ xác nhận';
        case 'confirmed':
            return 'Sẵn sàng khám';
        case 'examining':
            return 'Đang khám';
        case 'completed':
            return 'Đã xong';
        default:
            return status;
    }
};

const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const calculateAge = (dob) => {
    if (!dob) return '?';
    return new Date().getFullYear() - new Date(dob).getFullYear();
};

// --- COMPONENTS ---

// 1. Modal Khám Bệnh
const ExaminationModal = ({ isOpen, onClose, patient, onSave }) => {
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [notes, setNotes] = useState('');
    const [reExamDate, setReExamDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSymptoms('');
            setDiagnosis('');
            setPrescription('');
            setNotes('');
            setReExamDate('');
        }
    }, [isOpen]);

    if (!isOpen || !patient) return null;

    const handleSave = () => {
        if (!diagnosis) return alert('Vui lòng nhập chẩn đoán');

        onSave(patient.id, {
            symptoms,
            diagnosis,
            prescription,
            notes,
            reExamDate
        });
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col'>
                <div className='bg-blue-600 text-white p-4 flex justify-between items-center sticky top-0 z-10'>
                    <div className='flex items-center gap-2'>
                        <Stethoscope size={24} />
                        <h2 className='text-xl font-bold'>Phiếu Khám Bệnh</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='p-1 hover:bg-blue-700 rounded-full cursor-pointer'
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='md:col-span-1 bg-gray-50 p-4 rounded-lg border h-fit'>
                        <div className='text-center mb-4'>
                            <div className='w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-700 font-bold text-2xl'>
                                {patient.patientName.charAt(0)}
                            </div>
                            <h3 className='font-bold text-lg text-gray-800'>
                                {patient.patientName}
                            </h3>
                            <p className='text-sm text-gray-500'>
                                {patient.patientGender} -{' '}
                                {calculateAge(patient.patientDob)} tuổi
                            </p>
                        </div>
                        <div className='space-y-3 text-sm'>
                            <div>
                                <label className='font-semibold text-gray-700 block'>
                                    Lý do/Tiền sử:
                                </label>
                                <p className='text-gray-800 bg-white p-2 rounded border'>
                                    {patient.history}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='md:col-span-2 space-y-4'>
                        <div>
                            <label className='font-semibold text-gray-700 mb-1 flex items-center gap-2'>
                                <Activity size={18} className='text-red-500' />{' '}
                                Triệu chứng lâm sàng
                            </label>
                            <textarea
                                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-20'
                                placeholder='Mô tả các triệu chứng hiện tại...'
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className='font-semibold text-gray-700 mb-1 flex items-center gap-2'>
                                <FileText size={18} className='text-blue-600' />{' '}
                                Chẩn đoán bệnh{' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <textarea
                                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-20'
                                placeholder='Nhập kết quả chẩn đoán...'
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className='font-semibold text-gray-700 mb-1 flex items-center gap-2'>
                                <Pill size={18} className='text-green-600' />{' '}
                                Chỉ định thuốc / Đơn thuốc
                            </label>
                            <textarea
                                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none min-h-25'
                                placeholder='Tên thuốc - Liều lượng - Cách dùng...'
                                value={prescription}
                                onChange={(e) =>
                                    setPrescription(e.target.value)
                                }
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='font-semibold text-gray-700 mb-1 flex items-center gap-2'>
                                    <AlertCircle
                                        size={18}
                                        className='text-orange-600'
                                    />{' '}
                                    Lời dặn
                                </label>
                                <textarea
                                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-12.5'
                                    placeholder='Ghi chú thêm...'
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className='font-semibold text-gray-700 mb-1 flex items-center gap-2'>
                                    <Calendar
                                        size={18}
                                        className='text-blue-500'
                                    />{' '}
                                    Hẹn tái khám
                                </label>
                                <input
                                    type='date'
                                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-12.5'
                                    value={reExamDate}
                                    onChange={(e) =>
                                        setReExamDate(e.target.value)
                                    }
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='p-4 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0'>
                    <button
                        onClick={onClose}
                        className='px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium cursor-pointer'
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSave}
                        className='px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-lg cursor-pointer'
                    >
                        <Save size={18} /> Hoàn tất & Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

// 2. Main Dashboard Component
const DoctorDashboard = () => {
    const { logout } = useAuth(); // 2. Lấy hàm logout
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/doctor/appointments');
                if (response.data && response.data.errCode === 0) {
                    const rawData = response.data.data;
                    const formattedData = rawData.map((item) => ({
                        id: item.id,
                        patientName:
                            item.patient?.user?.name || 'Chưa cập nhật',
                        patientGender:
                            item.patient?.gender === '1'
                                ? 'Nam'
                                : item.patient?.gender === '0'
                                ? 'Nữ'
                                : 'Khác',
                        patientDob: item.patient?.dob,
                        time: item.slot
                            ? `${formatTime(
                                  item.slot.startTime
                              )} - ${formatTime(item.slot.endTime)}`
                            : 'TBD',
                        date: item.slot?.startTime,
                        status: item.status,
                        reason: 'Khám bệnh theo yêu cầu',
                        history: item.patient?.notePMH || 'Chưa có ghi nhận',
                        diagnosis: ''
                    }));
                    setAppointments(formattedData);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter((apt) => {
        if (activeTab === 'all') return true;
        return apt.status === activeTab;
    });

    const handleAccept = async (id) => {
        try {
            const res = await api.put('/api/doctor/confirm-appointment', {
                appointmentId: id
            });

            if (res.data && res.data.errCode === 0) {
                setAppointments((prev) =>
                    prev.map((apt) =>
                        apt.id === id ? { ...apt, status: 'confirmed' } : apt
                    )
                );
                alert('Đã xác nhận lịch hẹn thành công!');
            } else {
                alert(res.data.errMessage || 'Xác nhận thất bại');
            }
        } catch (error) {
            console.error('Error confirming appointment:', error);
            alert('Lỗi kết nối đến server');
        }
    };

    const handleStartExam = (patient) => {
        setAppointments((prev) =>
            prev.map((apt) =>
                apt.id === patient.id ? { ...apt, status: 'examining' } : apt
            )
        );
        setCurrentPatient(patient);
        setIsExamModalOpen(true);
    };

    const handleFinishExam = async (id, medicalData) => {
        try {
            const payload = {
                appointmentId: id,
                symptoms: medicalData.symptoms,
                diagnosis: medicalData.diagnosis,
                prescription: medicalData.prescription,
                soapNotes: medicalData.notes,
                reExamDate: medicalData.reExamDate || null
            };

            const res = await api.post(
                '/api/doctor/complete-examination',
                payload
            );

            if (res.data && res.data.errCode === 0) {
                setAppointments((prev) =>
                    prev.map((apt) =>
                        apt.id === id ? { ...apt, status: 'completed' } : apt
                    )
                );
                setIsExamModalOpen(false);
                setCurrentPatient(null);
                alert('Đã lưu hồ sơ bệnh án thành công!');
            } else {
                alert(res.data.errMessage || 'Lưu bệnh án thất bại');
            }
        } catch (error) {
            console.error('Error saving examination:', error);
            alert('Lỗi kết nối đến server');
        }
    };

    return (
        <div className='bg-gray-100 min-h-screen font-sans'>
            <header className='bg-white shadow px-6 py-4 flex justify-between items-center'>
                <div className='flex items-center gap-2 cursor-pointer'>
                    <div className='bg-blue-600 p-2 rounded-lg text-white'>
                        <Stethoscope size={20} />
                    </div>
                    <span className='font-bold text-xl text-gray-800'>
                        Doctor<span className='text-blue-600'>Portal</span>
                    </span>
                </div>

                {/* 3. Cập nhật phần Header bên phải */}
                <div className='flex items-center gap-4'>
                    {/* Nút Đăng xuất */}
                    <button
                        onClick={logout}
                        className='text-sm cursor-pointer text-red-600 font-semibold hover:underline'
                    >
                        Đăng xuất
                    </button>

                    {/* Đường kẻ phân cách */}
                    <div className='h-8 w-px bg-gray-200'></div>

                    {/* Thông tin bác sĩ */}
                    <div className='flex items-center gap-4 cursor-pointer'>
                        <div className='text-right hidden md:block'>
                            <p className='font-bold text-sm text-gray-800'>
                                BS. Nguyễn Hoàng Long
                            </p>
                            <p className='text-xs text-green-600 font-medium flex items-center justify-end gap-1'>
                                <span className='w-2 h-2 rounded-full bg-green-500'></span>{' '}
                                Online
                            </p>
                        </div>
                        <div className='w-10 h-10 rounded-full bg-gray-200 overflow-hidden'>
                            <img
                                src='https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100'
                                alt='Avatar'
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className='container mx-auto px-4 py-8'>
                <div className='mb-6 flex flex-col md:flex-row justify-between items-end gap-4'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800 mb-1'>
                            Lịch làm việc hôm nay
                        </h1>
                        <p className='text-gray-500 text-sm flex items-center gap-2'>
                            <Calendar size={16} />{' '}
                            {new Date().toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className='flex bg-white rounded-lg p-1 shadow-sm border'>
                        {[
                            { id: 'all', label: 'Tất cả' },
                            { id: 'pending', label: 'Chờ duyệt' },
                            { id: 'confirmed', label: 'Sắp tới' },
                            { id: 'completed', label: 'Đã khám' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className='text-center py-12'>
                        <div className='animate-spin inline-block w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent'></div>
                    </div>
                ) : (
                    <div className='bg-white rounded-xl shadow border overflow-hidden'>
                        <table className='w-full text-left border-collapse'>
                            <thead className='bg-gray-50 text-gray-600 text-sm font-semibold uppercase'>
                                <tr>
                                    <th className='p-4'>Bệnh nhân</th>
                                    <th className='p-4'>Thời gian</th>
                                    <th className='p-4'>Tiền sử / Ghi chú</th>
                                    <th className='p-4'>Trạng thái</th>
                                    <th className='p-4 text-right'>
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {filteredAppointments.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan='5'
                                            className='p-8 text-center text-gray-500 italic'
                                        >
                                            Không có lịch hẹn nào.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAppointments.map((apt) => (
                                        <tr
                                            key={apt.id}
                                            className='hover:bg-gray-50 transition-colors cursor-pointer'
                                        >
                                            <td className='p-4'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold'>
                                                        {apt.patientName.charAt(
                                                            0
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className='font-bold text-gray-800'>
                                                            {apt.patientName}
                                                        </p>
                                                        <p className='text-xs text-gray-500'>
                                                            {apt.patientGender}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='p-4'>
                                                <div className='flex items-center gap-2 text-gray-700 font-medium bg-gray-100 px-3 py-1 rounded w-fit text-sm'>
                                                    <Clock size={14} />{' '}
                                                    {apt.time}
                                                </div>
                                            </td>
                                            <td className='p-4 max-w-xs truncate text-gray-600 text-sm'>
                                                {apt.history}
                                            </td>
                                            <td className='p-4'>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                                                        apt.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(apt.status)}
                                                </span>
                                            </td>
                                            <td className='p-4 text-right'>
                                                {apt.status === 'pending' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAccept(
                                                                apt.id
                                                            );
                                                        }}
                                                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ml-auto shadow-sm cursor-pointer'
                                                    >
                                                        <CheckCircle
                                                            size={16}
                                                        />{' '}
                                                        Chấp nhận
                                                    </button>
                                                )}

                                                {apt.status === 'confirmed' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStartExam(
                                                                apt
                                                            );
                                                        }}
                                                        className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ml-auto shadow-sm animate-pulse cursor-pointer'
                                                    >
                                                        <Play size={16} /> Bắt
                                                        đầu khám
                                                    </button>
                                                )}

                                                {apt.status === 'examining' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrentPatient(
                                                                apt
                                                            );
                                                            setIsExamModalOpen(
                                                                true
                                                            );
                                                        }}
                                                        className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ml-auto shadow-sm cursor-pointer'
                                                    >
                                                        <Stethoscope
                                                            size={16}
                                                        />{' '}
                                                        Đang khám...
                                                    </button>
                                                )}

                                                {apt.status === 'completed' && (
                                                    <button className='text-gray-400 cursor-not-allowed px-4 py-2 text-sm font-medium ml-auto flex items-center gap-2'>
                                                        <CheckCircle
                                                            size={16}
                                                        />{' '}
                                                        Đã hoàn thành
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <ExaminationModal
                isOpen={isExamModalOpen}
                onClose={() => setIsExamModalOpen(false)}
                patient={currentPatient}
                onSave={handleFinishExam}
            />
        </div>
    );
};

export default DoctorDashboard;

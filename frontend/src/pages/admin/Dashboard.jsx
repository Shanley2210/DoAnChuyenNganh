import React, { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    Activity,
    BriefcaseMedical,
    Plus,
    Edit,
    Trash2,
    X,
    Search,
    LayoutDashboard,
    CheckCircle,
    Upload,
    Clock,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const SHIFTS = [
    { key: 'C1', label: 'Ca Sáng', time: '08:00 - 12:00' },
    { key: 'C2', label: 'Ca Chiều', time: '13:00 - 17:00' },
    { key: 'C3', label: 'Ca Tối', time: '18:00 - 22:00' }
];

const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);

const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};
const getLocalDateString = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Sử dụng getFullYear/Month/Date để lấy theo giờ hệ thống (Local Time) thay vì UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
// --- COMPONENTS ---

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg w-full max-w-4xl shadow-xl overflow-hidden'>
                <div className='flex justify-between items-center p-4 border-b'>
                    <h3 className='text-lg font-bold text-gray-800'>{title}</h3>
                    <button
                        onClick={onClose}
                        className='p-1 hover:bg-gray-100 rounded-full cursor-pointer'
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className='p-6 max-h-[85vh] overflow-y-auto'>
                    {children}
                </div>
            </div>
        </div>
    );
};

// 2. Doctor Management (Giữ nguyên logic cũ)
const DoctorManager = ({ doctors, specialties, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImg, setPreviewImg] = useState('');

    const initialFormState = {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        specialtyId: '',
        dob: '',
        gender: 'M',
        ethnicity: '',
        address: '',
        degree: '',
        room: '',
        price: '',
        status: 'active',
        image: null
    };

    const [formData, setFormData] = useState(initialFormState);

    const openModal = (doc = null) => {
        setEditingDoc(doc);
        if (doc) {
            setFormData({
                name: doc?.user?.name || doc.name || '',
                email: doc?.user?.email || doc.email || '',
                phone: doc?.user?.phone || doc.phone || '',
                password: '',
                confirmPassword: '',
                specialtyId: doc.specialtyId || '',
                dob: doc?.user?.dob
                    ? new Date(doc.user.dob).toISOString().split('T')[0]
                    : '',
                gender: doc?.user?.gender || 'M',
                ethnicity: doc?.user?.ethnicity || '',
                address: doc?.user?.address || '',
                degree: doc.degree || '',
                room: doc.room || '',
                price: doc.price || '',
                status: doc?.user?.status || 'active',
                image: null
            });
            setPreviewImg(doc?.user?.image || '');
        } else {
            setFormData({
                ...initialFormState,
                specialtyId: specialties[0]?.id || ''
            });
            setPreviewImg('');
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('specialtyId', formData.specialtyId);
            data.append('dob', formData.dob);
            data.append('gender', formData.gender);
            data.append('ethnicity', formData.ethnicity);
            data.append('address', formData.address);
            data.append('degree', formData.degree);
            data.append('room', formData.room);
            if (formData.image) data.append('image', formData.image);

            if (editingDoc) {
                const userId = editingDoc.userId || editingDoc.user?.id;
                data.append('status', formData.status);
                const res = await api.put(
                    `/api/admin/doctors/${userId}`,
                    data,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                );
                if (res.data && res.data.errCode === 0) {
                    if (formData.price) {
                        await api.post(
                            `/api/admin/doctorprice/${editingDoc.id}`,
                            { price: Number(formData.price) }
                        );
                    }
                    alert('Cập nhật thành công');
                    refreshData();
                    setIsModalOpen(false);
                } else {
                    alert(res.data.errMessage);
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    alert('Mật khẩu không khớp');
                    setIsLoading(false);
                    return;
                }
                data.append('password', formData.password);
                data.append('confirmPassword', formData.confirmPassword);
                const res = await api.post('/api/admin/doctors', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (res.data && res.data.errCode === 0) {
                    if (formData.price && res.data.data?.id) {
                        await api.post(
                            `/api/admin/doctorprice/${res.data.data.id}`,
                            { price: Number(formData.price) }
                        );
                    }
                    alert('Tạo mới thành công');
                    refreshData();
                    setIsModalOpen(false);
                } else {
                    alert(res.data.errMessage);
                }
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi hệ thống');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-gray-800'>
                    Quản lý Bác sĩ
                </h2>
                <button
                    onClick={() => openModal()}
                    className='bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700'
                >
                    <Plus size={18} /> Thêm Bác sĩ
                </button>
            </div>
            <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-gray-100 text-gray-600 text-sm'>
                            <th className='p-3'>ID</th>
                            <th className='p-3'>Thông tin</th>
                            <th className='p-3'>Chuyên khoa</th>
                            <th className='p-3'>Giá khám</th>
                            <th className='p-3'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doc) => (
                            <tr
                                key={doc.id}
                                className='border-b hover:bg-gray-50'
                            >
                                <td className='p-3 font-mono text-sm'>
                                    {doc.id}
                                </td>
                                <td className='p-3'>
                                    <div className='flex items-center gap-3'>
                                        {doc?.user?.image && (
                                            <img
                                                src={doc.user.image}
                                                alt=''
                                                className='w-10 h-10 rounded-full object-cover'
                                            />
                                        )}
                                        <div>
                                            <div className='font-medium'>
                                                {doc?.user?.name}
                                            </div>
                                            <div className='text-xs text-gray-500'>
                                                {doc?.user?.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className='p-3 text-sm'>
                                    {specialties.find(
                                        (s) => s.id == doc.specialtyId
                                    )?.name || 'N/A'}
                                </td>
                                <td className='p-3 text-blue-600 font-medium'>
                                    {formatCurrency(doc.price)}
                                </td>
                                <td className='p-3'>
                                    <button
                                        onClick={() => openModal(doc)}
                                        className='text-yellow-500 hover:text-yellow-600'
                                    >
                                        <Edit size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Modal rendering omitted for brevity but logic exists above */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDoc ? 'Cập nhật' : 'Thêm mới'}
            >
                <form
                    onSubmit={handleSubmit}
                    className='grid grid-cols-2 gap-4'
                >
                    {/* Simplified Form fields based on formData state */}
                    <div className='col-span-2 md:col-span-1'>
                        <label className='text-sm font-medium'>Họ tên</label>
                        <input
                            className='w-full border p-2 rounded'
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value
                                })
                            }
                            required
                        />
                    </div>
                    <div className='col-span-2 md:col-span-1'>
                        <label className='text-sm font-medium'>Email</label>
                        <input
                            type='email'
                            className='w-full border p-2 rounded'
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                            }
                            required
                        />
                    </div>
                    <div className='col-span-2 md:col-span-1'>
                        <label className='text-sm font-medium'>SĐT</label>
                        <input
                            className='w-full border p-2 rounded'
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value
                                })
                            }
                            required
                        />
                    </div>
                    {!editingDoc && (
                        <div className='col-span-2 md:col-span-1'>
                            <label className='text-sm font-medium'>
                                Mật khẩu
                            </label>
                            <input
                                type='password'
                                className='w-full border p-2 rounded'
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value
                                    })
                                }
                                required
                            />
                        </div>
                    )}
                    {!editingDoc && (
                        <div className='col-span-2 md:col-span-1'>
                            <label className='text-sm font-medium'>
                                Nhập lại MK
                            </label>
                            <input
                                type='password'
                                className='w-full border p-2 rounded'
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: e.target.value
                                    })
                                }
                                required
                            />
                        </div>
                    )}
                    <div className='col-span-2 md:col-span-1'>
                        <label className='text-sm font-medium'>
                            Chuyên khoa
                        </label>
                        <select
                            className='w-full border p-2 rounded'
                            value={formData.specialtyId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    specialtyId: e.target.value
                                })
                            }
                        >
                            {specialties.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='col-span-2 md:col-span-1'>
                        <label className='text-sm font-medium'>Giá</label>
                        <input
                            type='number'
                            className='w-full border p-2 rounded'
                            value={formData.price}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    price: e.target.value
                                })
                            }
                        />
                    </div>
                    <div className='col-span-2 md:col-span-1'>
                        <label className='text-sm font-medium'>Ảnh</label>
                        <input
                            type='file'
                            onChange={handleImageChange}
                            className='w-full'
                        />
                    </div>
                    <div className='col-span-2 flex justify-end gap-2 pt-4'>
                        <button
                            type='button'
                            onClick={() => setIsModalOpen(false)}
                            className='px-4 py-2 border rounded'
                        >
                            Hủy
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 bg-blue-600 text-white rounded'
                        >
                            {isLoading ? '...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// 3. Schedule Management (UPDATED)
const ScheduleManager = ({ doctors }) => {
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);

    // Auto-select first doctor
    useEffect(() => {
        if (doctors.length > 0 && !selectedDoctor) {
            setSelectedDoctor(doctors[0].id);
        }
    }, [doctors, selectedDoctor]);

    // Hàm lấy dữ liệu
    const fetchSchedules = async () => {
        if (!selectedDoctor) return;
        setLoading(true);
        try {
            const res = await api.get(`/api/admin/schedules/${selectedDoctor}`);
            if (res.data && res.data.errCode === 0) {
                setSchedules(res.data.data);
            } else {
                setSchedules([]);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [selectedDoctor]);

    // --- SỬA LỖI Ở ĐÂY ---
    // Lọc lịch theo ngày đã chọn, sử dụng hàm getLocalDateString để fix lệch múi giờ
    const currentSchedules = schedules.filter((s) => {
        const scheduleDateLocal = getLocalDateString(s.workDate);
        return scheduleDateLocal === selectedDate;
    });

    const handleCreateSchedule = async (shiftKey) => {
        if (!selectedDoctor || !selectedDate) return;

        const shiftLabel =
            SHIFTS.find((s) => s.key === shiftKey)?.label || shiftKey;
        // Format tên: Lịch Ca Sáng - 2025-12-13
        const scheduleName = `Lịch ${shiftLabel} - ${selectedDate}`;

        if (
            !window.confirm(
                `Xác nhận đăng ký ${shiftLabel} ngày ${selectedDate}?`
            )
        )
            return;

        try {
            const payload = {
                name: scheduleName,
                workDate: selectedDate,
                shift: shiftKey,
                status: 'active'
            };

            const res = await api.post(
                `/api/admin/schedules/${selectedDoctor}`,
                payload
            );

            if (res.data && res.data.errCode === 0) {
                // Refresh lại dữ liệu ngay lập tức
                await fetchSchedules();
            } else {
                const msg =
                    {
                        1: 'Thiếu tham số',
                        2: 'Ca làm việc không hợp lệ',
                        3: 'Lịch làm việc đã tồn tại'
                    }[res.data.errCode] ||
                    res.data.errMessage ||
                    'Lỗi đăng ký lịch';
                alert(msg);
            }
        } catch (error) {
            console.error('Error creating schedule:', error);
            alert('Lỗi hệ thống khi tạo lịch');
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        if (!window.confirm('Bạn có chắc muốn hủy lịch làm việc này?')) return;

        try {
            const res = await api.delete(`/api/admin/schedules/${scheduleId}`);
            if (res.data && res.data.errCode === 0) {
                // Cập nhật state local ngay để UI phản hồi nhanh
                setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
            } else {
                alert(res.data.errMessage || 'Lỗi khi xóa lịch');
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
            alert('Lỗi hệ thống khi xóa lịch');
        }
    };

    return (
        <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-gray-800'>
                    Quản lý Lịch làm việc
                </h2>
                <button
                    onClick={fetchSchedules}
                    className='text-blue-600 hover:bg-blue-50 p-2 rounded-full cursor-pointer'
                    title='Tải lại dữ liệu'
                >
                    <Activity size={20} />
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                <div>
                    <label className='block text-sm font-medium mb-2'>
                        Chọn Bác sĩ
                    </label>
                    <select
                        className='w-full border rounded p-3 bg-gray-50 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500'
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                        {doctors.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.degree} - {d?.user?.name || d.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-medium mb-2'>
                        Chọn Ngày
                    </label>
                    <input
                        type='date'
                        className='w-full border rounded p-3 bg-gray-50 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500'
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            <div className='border-t pt-6'>
                <h3 className='font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                    <Calendar size={20} /> Danh sách ca làm việc ngày{' '}
                    {selectedDate}
                </h3>

                {loading && schedules.length === 0 ? (
                    <div className='text-center py-4 text-gray-500'>
                        Đang tải lịch...
                    </div>
                ) : (
                    <div className='grid grid-cols-1 gap-6'>
                        {SHIFTS.map((shift) => {
                            // Tìm lịch trong danh sách đã lọc
                            const existingSchedule = currentSchedules.find(
                                (s) => s.shift === shift.key
                            );
                            const isRegistered = !!existingSchedule;

                            return (
                                <div
                                    key={shift.key}
                                    className={`border rounded-lg p-4 transition-all ${
                                        isRegistered
                                            ? 'bg-white border-green-500 shadow-sm'
                                            : 'bg-gray-50 border-gray-200 opacity-80 hover:opacity-100'
                                    }`}
                                >
                                    <div className='flex justify-between items-center mb-4 pb-2 border-b border-dashed'>
                                        <div>
                                            <h4
                                                className={`text-lg font-bold ${
                                                    isRegistered
                                                        ? 'text-green-700'
                                                        : 'text-gray-700'
                                                }`}
                                            >
                                                {shift.label}
                                            </h4>
                                            <div className='text-sm text-gray-500 flex items-center gap-1 mt-1'>
                                                <Clock size={14} /> {shift.time}
                                            </div>
                                        </div>
                                        <div>
                                            {isRegistered ? (
                                                <span className='flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-semibold'>
                                                    <CheckCircle size={14} /> Đã
                                                    đăng ký
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleCreateSchedule(
                                                            shift.key
                                                        )
                                                    }
                                                    className='bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors cursor-pointer'
                                                >
                                                    <Plus size={16} /> Đăng ký
                                                    ca này
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isRegistered && (
                                        <div>
                                            <div className='flex justify-between items-center mb-2'>
                                                <span className='text-sm font-semibold text-gray-700'>
                                                    Danh sách khung giờ khám
                                                    (Slots):
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteSchedule(
                                                            existingSchedule.id
                                                        )
                                                    }
                                                    className='text-red-500 hover:text-red-700 text-xs underline flex items-center gap-1 cursor-pointer'
                                                >
                                                    <Trash2 size={12} /> Hủy
                                                    toàn bộ ca
                                                </button>
                                            </div>

                                            <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2'>
                                                {existingSchedule.slots &&
                                                existingSchedule.slots.length >
                                                    0 ? (
                                                    existingSchedule.slots.map(
                                                        (slot, index) => (
                                                            <div
                                                                key={
                                                                    slot.id ||
                                                                    index
                                                                }
                                                                className='bg-blue-50 text-blue-700 border border-blue-100 rounded px-2 py-2 text-center text-sm font-medium hover:bg-blue-100 transition-colors cursor-default'
                                                            >
                                                                {formatTime(
                                                                    slot.startTime
                                                                )}
                                                                {slot.endTime &&
                                                                    ` - ${formatTime(
                                                                        slot.endTime
                                                                    )}`}
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div className='col-span-full text-sm text-gray-400 italic py-2'>
                                                        Chưa có slot nào được
                                                        tạo cho ca này (Có thể
                                                        do lỗi Backend hoặc chưa
                                                        load kịp).
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// 4. Specialty Management (Giữ nguyên)
const SpecialtyManager = ({ specialties, setSpecialties }) => {
    // ... (Giữ nguyên code từ phần trước)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImg, setPreviewImg] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        status: 'active'
    });

    const openModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setFormData({
                name: item.name,
                description: item.description,
                image: null,
                status: item.status || 'active'
            });
            setPreviewImg(item.image);
        } else {
            setFormData({
                name: '',
                description: '',
                image: null,
                status: 'active'
            });
            setPreviewImg('');
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('status', formData.status);
        if (formData.image) data.append('image', formData.image);

        try {
            if (editingItem) {
                const res = await api.put(
                    `/api/admin/specialty/${editingItem.id}`,
                    data,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                if (res.data && res.data.errCode === 0) {
                    const updatedList = await api.get('/api/specialty');
                    if (updatedList.data.errCode === 0)
                        setSpecialties(updatedList.data.data);
                    setIsModalOpen(false);
                } else alert(res.data.errMessage);
            } else {
                const res = await api.post('/api/admin/specialty', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (res.data && res.data.errCode === 0) {
                    const updatedList = await api.get('/api/specialty');
                    if (updatedList.data.errCode === 0)
                        setSpecialties(updatedList.data.data);
                    setIsModalOpen(false);
                } else alert(res.data.errMessage);
            }
        } catch (error) {
            console.error(error);
            alert('Error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Xóa chuyên khoa?')) {
            try {
                const res = await api.delete(`/api/admin/specialty/${id}`);
                if (res.data.errCode === 0)
                    setSpecialties(specialties.filter((s) => s.id !== id));
                else alert(res.data.errMessage);
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-gray-800'>
                    Quản lý Chuyên khoa
                </h2>
                <button
                    onClick={() => openModal()}
                    className='bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700'
                >
                    <Plus size={18} /> Thêm Chuyên khoa
                </button>
            </div>
            <div className='grid grid-cols-1 gap-4'>
                {specialties.map((spec) => (
                    <div
                        key={spec.id}
                        className='border rounded-lg p-4 flex justify-between items-start'
                    >
                        <div className='flex gap-4'>
                            {spec.image && (
                                <img
                                    src={spec.image}
                                    alt={spec.name}
                                    className='w-16 h-16 object-cover rounded'
                                />
                            )}
                            <div>
                                <h3 className='font-bold text-lg text-blue-800'>
                                    {spec.name}
                                </h3>
                                <p className='text-gray-600 text-sm mt-1 line-clamp-2'>
                                    {spec.description}
                                </p>
                                <span className='text-xs bg-gray-100 px-2 py-1 rounded'>
                                    {spec.status}
                                </span>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <button
                                onClick={() => openModal(spec)}
                                className='text-gray-500 hover:text-blue-600'
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(spec.id)}
                                className='text-gray-500 hover:text-red-600'
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'Sửa' : 'Thêm'}
            >
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <input
                        className='w-full border p-2 rounded'
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder='Tên'
                        required
                    />
                    <textarea
                        className='w-full border p-2 rounded h-24'
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value
                            })
                        }
                        placeholder='Mô tả'
                    />
                    <input type='file' onChange={handleImageChange} />
                    <select
                        className='w-full border p-2 rounded'
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                        }
                    >
                        <option value='active'>Active</option>
                        <option value='inactive'>Inactive</option>
                    </select>
                    <button
                        type='submit'
                        className='bg-blue-600 text-white px-4 py-2 rounded w-full'
                    >
                        {isLoading ? '...' : 'Lưu'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

// 5. Service Management (Giữ nguyên)
const ServiceManager = ({ services, setServices }) => {
    // ... (Giữ nguyên code từ phần trước)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        durationMinutes: '',
        status: 'active'
    });

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(
            item
                ? {
                      name: item.name,
                      description: item.description || '',
                      price: item.price,
                      durationMinutes: item.durationMinutes || item.duration,
                      status: item.status || 'active'
                  }
                : {
                      name: '',
                      description: '',
                      price: '',
                      durationMinutes: '',
                      status: 'active'
                  }
        );
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = {
            name: formData.name,
            description: formData.description,
            durationMinutes: Number(formData.durationMinutes),
            price: Number(formData.price),
            status: formData.status
        };
        try {
            if (editingItem) {
                const res = await api.put(
                    `/api/admin/services/${editingItem.id}`,
                    payload
                );
                if (res.data.errCode === 0) {
                    setServices(
                        services.map((s) =>
                            s.id === editingItem.id
                                ? { ...s, ...payload, id: editingItem.id }
                                : s
                        )
                    );
                    setIsModalOpen(false);
                } else alert(res.data.errMessage);
            } else {
                const res = await api.post('/api/admin/services', payload);
                if (res.data.errCode === 0) {
                    setServices([
                        ...services,
                        res.data.data || { ...payload, id: Date.now() }
                    ]);
                    setIsModalOpen(false);
                } else alert(res.data.errMessage);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Xóa dịch vụ?')) {
            try {
                const res = await api.delete(`/api/admin/services/${id}`);
                if (res.data.errCode === 0)
                    setServices(services.filter((s) => s.id !== id));
                else alert(res.data.errMessage);
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-gray-800'>
                    Quản lý Dịch vụ
                </h2>
                <button
                    onClick={() => openModal()}
                    className='bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700'
                >
                    <Plus size={18} /> Thêm Dịch vụ
                </button>
            </div>
            <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-blue-50 text-blue-800 text-sm'>
                            <th className='p-3'>Tên</th>
                            <th className='p-3'>Mô tả</th>
                            <th className='p-3'>Thời gian</th>
                            <th className='p-3'>Giá</th>
                            <th className='p-3'>Trạng thái</th>
                            <th className='p-3'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((svc) => (
                            <tr
                                key={svc.id}
                                className='border-b hover:bg-gray-50'
                            >
                                <td className='p-3 font-medium'>{svc.name}</td>
                                <td className='p-3 text-sm text-gray-500 truncate max-w-xs'>
                                    {svc.description}
                                </td>
                                <td className='p-3 text-sm'>
                                    {svc.durationMinutes || svc.duration}p
                                </td>
                                <td className='p-3 font-bold text-gray-700'>
                                    {formatCurrency(svc.price)}
                                </td>
                                <td className='p-3 text-sm'>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${
                                            svc.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100'
                                        }`}
                                    >
                                        {svc.status}
                                    </span>
                                </td>
                                <td className='p-3 flex gap-2'>
                                    <button
                                        onClick={() => openModal(svc)}
                                        className='text-blue-600 p-1'
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(svc.id)}
                                        className='text-red-600 p-1'
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'Sửa' : 'Thêm'}
            >
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <input
                        className='w-full border p-2 rounded'
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder='Tên'
                        required
                    />
                    <textarea
                        className='w-full border p-2 rounded'
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value
                            })
                        }
                        placeholder='Mô tả'
                    />
                    <div className='grid grid-cols-2 gap-2'>
                        <input
                            type='number'
                            className='w-full border p-2 rounded'
                            value={formData.durationMinutes}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    durationMinutes: e.target.value
                                })
                            }
                            placeholder='Phút'
                            required
                        />
                        <input
                            type='number'
                            className='w-full border p-2 rounded'
                            value={formData.price}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    price: e.target.value
                                })
                            }
                            placeholder='VND'
                            required
                        />
                    </div>
                    <select
                        className='w-full border p-2 rounded'
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                        }
                    >
                        <option value='active'>Active</option>
                        <option value='inactive'>Inactive</option>
                    </select>
                    <button
                        type='submit'
                        className='w-full bg-blue-600 text-white py-2 rounded'
                    >
                        {isLoading ? '...' : 'Lưu'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

// --- MAIN APP ---
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const { logout } = useAuth();

    const fetchData = async () => {
        try {
            const doctors = await api.get('/api/doctor/all');
            if (doctors.data && doctors.data.errCode === 0)
                setDoctors(doctors.data.data);

            const specialties = await api.get('/api/specialty');
            if (specialties.data && specialties.data.errCode === 0)
                setSpecialties(specialties.data.data);

            const services = await api.get('/api/service');
            if (services.data && services.data.errCode === 0)
                setServices(services.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const MENU_ITEMS = [
        { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
        { id: 'doctors', label: 'Quản lý Bác sĩ', icon: Users },
        { id: 'schedule', label: 'Lịch làm việc', icon: Calendar },
        {
            id: 'specialties',
            label: 'Quản lý Chuyên khoa',
            icon: BriefcaseMedical
        },
        { id: 'services', label: 'Quản lý Dịch vụ', icon: Activity }
    ];

    const renderContent = () => {
        if (loading)
            return (
                <div className='flex items-center justify-center h-full'>
                    <div className='text-gray-500 font-medium'>
                        Đang tải dữ liệu...
                    </div>
                </div>
            );

        switch (activeTab) {
            case 'doctors':
                return (
                    <DoctorManager
                        doctors={doctors}
                        setDoctors={setDoctors}
                        specialties={specialties}
                        refreshData={fetchData}
                    />
                );
            case 'schedule':
                return <ScheduleManager doctors={doctors} />;
            case 'specialties':
                return (
                    <SpecialtyManager
                        specialties={specialties}
                        setSpecialties={setSpecialties}
                    />
                );
            case 'services':
                return (
                    <ServiceManager
                        services={services}
                        setServices={setServices}
                    />
                );
            default:
                return (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        <div className='bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-gray-500 text-sm font-medium uppercase'>
                                        Tổng bác sĩ
                                    </p>
                                    <h3 className='text-3xl font-bold text-gray-800'>
                                        {doctors.length}
                                    </h3>
                                </div>
                                <Users className='text-blue-500 w-10 h-10 opacity-20' />
                            </div>
                        </div>
                        <div className='bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-gray-500 text-sm font-medium uppercase'>
                                        Chuyên khoa
                                    </p>
                                    <h3 className='text-3xl font-bold text-gray-800'>
                                        {specialties.length}
                                    </h3>
                                </div>
                                <BriefcaseMedical className='text-green-500 w-10 h-10 opacity-20' />
                            </div>
                        </div>
                        <div className='bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-gray-500 text-sm font-medium uppercase'>
                                        Dịch vụ
                                    </p>
                                    <h3 className='text-3xl font-bold text-gray-800'>
                                        {services.length}
                                    </h3>
                                </div>
                                <Activity className='text-purple-500 w-10 h-10 opacity-20' />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className='flex h-screen bg-gray-100 font-sans'>
            <aside className='w-64 bg-gray-900 text-white shrink-0 hidden md:flex flex-col'>
                <div className='h-16 flex items-center px-6 border-b border-gray-800'>
                    <span className='text-xl font-bold tracking-wider'>
                        HealthCare<span className='text-blue-500'>Admin</span>
                    </span>
                </div>
                <nav className='flex-1 py-6 space-y-1 px-3'>
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                                    activeTab === item.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
                <div className='p-4 border-t border-gray-800'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center'>
                            A
                        </div>
                        <div>
                            <p className='text-sm font-medium'>Administrator</p>
                            <p className='text-xs text-gray-500'>
                                admin@healthcare.com
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
            <div className='flex-1 flex flex-col overflow-hidden'>
                <header className='h-16 bg-white shadow-sm flex items-center justify-between px-6'>
                    <h1 className='text-lg font-semibold text-gray-800'>
                        {MENU_ITEMS.find((i) => i.id === activeTab)?.label}
                    </h1>
                    <div className='flex items-center gap-4'>
                        <button className='p-2 text-gray-400 hover:bg-gray-100 rounded-full cursor-pointer'>
                            <Search size={20} />
                        </button>
                        <div className='h-8 w-px bg-gray-200'></div>
                        <button
                            onClick={logout}
                            className='text-sm cursor-pointer text-red-600 font-semibold hover:underline'
                        >
                            Đăng xuất
                        </button>
                    </div>
                </header>
                <main className='flex-1 overflow-y-auto p-6'>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

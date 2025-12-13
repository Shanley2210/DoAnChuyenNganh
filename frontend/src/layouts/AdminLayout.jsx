import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar'; // Bạn có thể tạo một AdminNavBar riêng sau này

export default function AdminLayout() {
    return (
        <div>
            <Outlet />
        </div>
    );
}

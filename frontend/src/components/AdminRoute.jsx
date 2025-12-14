import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
    const { accessToken } = useAuth();
    const location = useLocation();

    if (!accessToken) {
        return <Navigate to='/' state={{ from: location }} replace />;
    }

    let roles = [];
    try {
        const decoded = jwtDecode(accessToken);
        roles = Array.isArray(decoded?.roles) ? decoded.roles : [];
    } catch {
        return <Navigate to='/' replace />;
    }

    const isAdmin =
        roles.includes('System_Admin') || roles.includes('Hospital_Admin');

    if (!isAdmin) {
        return <Navigate to='/' replace />;
    }

    return children;
}

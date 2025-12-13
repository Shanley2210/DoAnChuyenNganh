import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(
        () => localStorage.getItem('accessToken') || ''
    );
    const [refreshToken, setRefreshToken] = useState(
        () => localStorage.getItem('refreshToken') || ''
    );
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            try {
                const decoded = jwtDecode(accessToken);
                setUser(decoded);
            } catch {
                setUser(null);
            }
        } else {
            localStorage.removeItem('accessToken');
            setUser(null);
        }
    }, [accessToken]);

    useEffect(() => {
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        else localStorage.removeItem('refreshToken');
    }, [refreshToken]);

    const login = (a, r) => {
        setAccessToken(a);
        setRefreshToken(r);
    };

    const logout = () => {
        setAccessToken('');
        setRefreshToken('');
        setUser(null);
    };

    const isAuthenticated = !!accessToken;

    const value = useMemo(
        () => ({
            user,
            accessToken,
            refreshToken,
            isAuthenticated,
            login,
            logout
        }),
        [user, accessToken, refreshToken, isAuthenticated]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

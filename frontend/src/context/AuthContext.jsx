import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || '')
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken') || '')

  useEffect(() => {
    if (accessToken) localStorage.setItem('accessToken', accessToken)
    else localStorage.removeItem('accessToken')
  }, [accessToken])

  useEffect(() => {
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    else localStorage.removeItem('refreshToken')
  }, [refreshToken])

  const login = (a, r) => {
    setAccessToken(a)
    setRefreshToken(r)
  }

  const logout = () => {
    setAccessToken('')
    setRefreshToken('')
  }

  const value = useMemo(() => ({ accessToken, refreshToken, login, logout, setAccessToken, setRefreshToken }), [accessToken, refreshToken])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

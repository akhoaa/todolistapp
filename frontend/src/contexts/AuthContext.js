import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance, { onAxiosError } from '../utils/axiosInstance';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { _id, name, email, role, ... }
  const [loading, setLoading] = useState(true);

  // Lấy user info từ backend nếu có JWT
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
    // Listen for axios errors
    const handler = (type) => {
      if (type === '401') {
        setUser(null);
        // Chỉ redirect nếu không phải đang ở trang auth
        if (!['/signin', '/signup', '/forgot', '/verify'].includes(window.location.pathname)) {
          window.location.href = '/signin';
        }
      }
      if (type === '403') {
        alert('Bạn không đủ quyền thực hiện thao tác này!');
      }
    };
    onAxiosError(handler);
    return () => {
      // Không cần remove listener vì app context sống suốt app
    };
  }, []);

  // Đăng nhập thành công: setUser
  const login = (userData) => {
    setUser(userData);
  };

  // Đăng xuất: xóa user
  const logout = () => {
    setUser(null);
    // Có thể gọi API logout nếu cần
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
} 
import { useCallback } from 'react';

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export const useAuth = () => {
    const getToken = useCallback(() => {
        return localStorage.getItem('token');
    }, []);

    const getUser = useCallback(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }, []);

    const setAuth = useCallback((token, user) => {
        if (token) localStorage.setItem('token', token);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            if (user.name) localStorage.setItem('userName', user.name);
        }
    }, []);

    const clearAuth = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('user');
    }, []);

    const isAuthenticated = useCallback(() => {
        const token = getToken();
        if (!token) return false;
        const payload = parseJwt(token);
        if (payload && payload.exp) {
            return payload.exp * 1000 > Date.now();
        }
        return true;
    }, [getToken]);

    const getAuthHeaders = useCallback(() => {
        const token = getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    }, [getToken]);

    const logout = useCallback((redirectTo = '/') => {
        clearAuth();
        window.location.href = redirectTo;
    }, [clearAuth]);

    return {
        getAuthHeaders,
        getToken,
        isAuthenticated,
        logout,
        getUser,
        setAuth,
        clearAuth
    };
};
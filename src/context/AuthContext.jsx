import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = '/api/auth';

    useEffect(() => {
        // Check session from server
        const checkSession = async () => {
            try {
                const response = await fetch(`${API_BASE}/me.php`, { credentials: 'include' });
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Session check failed", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // ??' Session Heartbeat: keep session alive every 15 minutes '?????
        const heartbeat = setInterval(async () => {
            try {
                const res = await fetch(`${API_BASE}/me.php`, { credentials: 'include' });
                const data = await res.json();
                if (data.success && data.user) {
                    setUser(data.user);
                } else {
                    // Session expired ??let user know
                    setUser(null);
                }
            } catch (e) {
                console.warn('Session heartbeat failed:', e);
            }
        }, 15 * 60 * 1000); // 15분마 return () => clearInterval(heartbeat);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE}/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.success) {
                // login.php row can drift from me.php; completeness uses fields like business_no/description
                let nextUser = data.user;
                try {
                    const meRes = await fetch(`${API_BASE}/me.php`, { credentials: 'include' });
                    const meData = await meRes.json();
                    if (meData.success && meData.user) {
                        nextUser = meData.user;
                    }
                } catch (e) {
                    console.warn('Post-login user sync failed:', e);
                }
                setUser(nextUser);
                return { success: true, user: nextUser };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Login error", error);
            return { success: false, message: "서버 오류가 발생했습니다." };
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE}/logout.php`, { credentials: 'include' });
            setUser(null);
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const withdraw = async () => {
        try {
            const response = await fetch(`${API_BASE}/withdraw.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: user?.id })
            });
            const data = await response.json();
            if (data.success) {
                setUser(null);
            }
            return data;
        } catch (error) {
            console.error("Withdraw error", error);
            return { success: false, message: "회원 탈퇴 처리 중 오류가 발생했습니다." };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await fetch(`${API_BASE}/register.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Signup error", error);
            return { success: false, message: "회원가입 처리 중 오류" };
        }
    };

    const sendVerification = async (email, country) => {
        try {
            const response = await fetch(`${API_BASE}/send_verification.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, country })
            });
            return await response.json();
        } catch (error) {
            console.error("Send verification error", error);
            return { success: false, message: "인증 코드 발송 중 오류" };
        }
    };

    const verifyEmail = async (email, code) => {
        try {
            const response = await fetch(`${API_BASE}/verify_email.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, code })
            });
            return await response.json();
        } catch (error) {
            console.error("Verify email error", error);
            return { success: false, message: "인증 중 오류" };
        }
    };

    // Placeholder functions for now - Admin API logic needs dedicated endpoints if used often
    // Or we leave them as "Note: Implement API later" if not critical for now. 
    // Given the task scale, I'll log a warning or standard implementation if simple.
    // toggleUserBlock and changePassword were in context, but now should be in AdminUsers page logic' // Actually, context provided them to be accessible globally. Let's keep signature but use API.

    // Re-fetch user data from session (e.g. after image upload)
    const refreshUser = async () => {
        try {
            const response = await fetch(`${API_BASE}/me.php`, { credentials: 'include' });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Refresh user failed:', error);
        }
    };

    const updateUserProfile = async (updatedData) => {
        try {
            const response = await fetch('/api/users/update_profile.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedData)
            });
            const data = await response.json();
            if (data.success && data.user) {
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, message: data.message || '프로필 수정에 실패했습니다.' };
            }
        } catch (error) {
            console.error("Profile update error:", error);
            return { success: false, message: "서버 오류가 발생했습니다. 다시 시도해주세요." };
        }
    };

    const toggleUserBlock = async (targetEmail) => {
        try {
            const response = await fetch(`/api/users/toggle_block.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: targetEmail })
            });
            const data = await response.json();
            if (data.success) {
                return data.status;
            }
            return null;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const changePassword = async (targetEmail, newPassword) => {
        try {
            const response = await fetch('/api/users/change_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: targetEmail, new_password: newPassword })
            });
            const data = await response.json();
            return data.success;
        } catch (e) {
            console.error("Password change error:", e);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, withdraw, signup, sendVerification, verifyEmail, loading, updateUserProfile, refreshUser, toggleUserBlock, changePassword }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

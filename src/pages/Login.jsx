import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password).then(result => {
            if (result.success) {
                // Route based on user role
                const role = result.user?.role;
                if (role === 'superadmin' || role === 'admin') {
                    navigate('/admin');
                } else if (role === 'vendor') {
                    navigate('/vendor');
                } else {
                    navigate('/seller');
                }
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary p-4">
            <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">SpaceMatch</h1>
                    <p className="text-gray-500 mt-2">관리자 및 셀러 로그인</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md hover:shadow-lg"
                    >
                        로그인
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        아직 계정이 없으신가요?{' '}
                        <Link to="/signup" className="text-primary hover:underline font-medium">
                            회원가입
                        </Link>
                    </p>
                    <a
                        href="http://pf.kakao.com/_xjGxoRX/chat"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block w-full py-2 text-center bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 font-medium transition-colors"
                    >
                        💬 문의하기
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;

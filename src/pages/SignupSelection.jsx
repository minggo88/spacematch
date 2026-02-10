import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Building2 } from 'lucide-react';

const SignupSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary px-4">
            <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary mb-4">SpaceMatch</h1>
                    <p className="text-xl text-gray-600">회원가입 유형을 선택해주세요</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Seller Option */}
                    <button
                        onClick={() => navigate('/signup/seller')}
                        className="flex flex-col items-center p-10 border-2 border-gray-100 rounded-2xl hover:border-primary hover:bg-indigo-50 transition-all group text-left"
                    >
                        <div className="p-6 bg-indigo-100 rounded-full mb-6 group-hover:bg-indigo-200 transition-colors">
                            <ShoppingBag className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">셀러 (브랜드)</h2>
                        <p className="text-gray-500 text-center leading-relaxed">
                            팝업스토어를 열고 싶은 브랜드인가요?<br />
                            딱 맞는 공간을 찾아보세요.
                        </p>
                    </button>

                    {/* Vendor Option */}
                    <button
                        onClick={() => navigate('/signup/vendor')}
                        className="flex flex-col items-center p-10 border-2 border-gray-100 rounded-2xl hover:border-primary hover:bg-indigo-50 transition-all group text-left"
                    >
                        <div className="p-6 bg-indigo-100 rounded-full mb-6 group-hover:bg-indigo-200 transition-colors">
                            <Building2 className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">벤더 (공간 호스트)</h2>
                        <p className="text-gray-500 text-center leading-relaxed">
                            공간을 보유하고 계신가요?<br />
                            매력적인 브랜드를 유치해보세요.
                        </p>
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        이미 계정이 있으신가요?{' '}
                        <Link to="/login" className="text-primary hover:underline font-bold">
                            로그인하기
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupSelection;

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Building, Camera, Save, User, Mail, Phone, FileText, Package, MapPin, Globe, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const VendorProfile = () => {
    const { user, refreshUser } = useAuth();
    const { t } = useTranslation('common');
    const fileInputRef = useRef(null);
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        business_no: '',
        company_name: '',
        description: '',
        address: '',
        website: '',
        categories: '',
    });

    const [passwords, setPasswords] = useState({ current: '', new_password: '', confirm: '' });
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                business_no: user.business_no || '',
                company_name: user.company_name || '',
                description: user.description || '',
                address: user.address || '',
                website: user.website || '',
                categories: user.categories || '',
            });
        }
    }, [user]);

    const showToast = (msg, type = 'success') => setToast({ message: msg, type });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast('이미지 크기는 5MB 이하여야 합니다.', 'error');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch(`${API_BASE}/users/upload_profile_image.php`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                if (refreshUser) refreshUser();
                showToast('프로필 이미지가 업데이트되었습니다.');
            } else {
                showToast(data.message || '업로드 실패', 'error');
            }
        } catch (e) {
            showToast('이미지 업로드에 실패했습니다.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/users/update_profile.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                showToast('프로필이 저장되었습니다.');
                if (refreshUser) refreshUser();
            } else {
                showToast(data.message || '저장 실패', 'error');
            }
        } catch (e) {
            showToast('프로필 저장에 실패했습니다.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!passwords.current || !passwords.new_password) {
            showToast('현재 비밀번호와 새 비밀번호를 입력해주세요.', 'error');
            return;
        }
        if (passwords.new_password !== passwords.confirm) {
            showToast('새 비밀번호가 일치하지 않습니다.', 'error');
            return;
        }
        if (passwords.new_password.length < 6) {
            showToast('비밀번호는 6자 이상이어야 합니다.', 'error');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/users/change_password.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ current_password: passwords.current, new_password: passwords.new_password })
            });
            const data = await res.json();
            if (data.success) {
                showToast('비밀번호가 변경되었습니다.');
                setPasswords({ current: '', new_password: '', confirm: '' });
                setShowPasswordSection(false);
            } else {
                showToast(data.message || '비밀번호 변경 실패', 'error');
            }
        } catch (e) {
            showToast('비밀번호 변경에 실패했습니다.', 'error');
        } finally {
            setSaving(false);
        }
    };

    // Profile completion
    const completionItems = [
        { label: '이름', done: !!form.name },
        { label: '이메일', done: !!form.email },
        { label: '전화번호', done: !!form.phone },
        { label: '사업자번호', done: !!form.business_no },
        { label: '회사명', done: !!form.company_name },
        { label: '소개', done: !!form.description },
    ];
    const completionPercent = Math.round((completionItems.filter(i => i.done).length / completionItems.length) * 100);

    if (!user) return null;

    return (
        <>
            <div className="max-w-3xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <Building className="text-teal-600 dark:text-teal-400" size={28} />
                        벤더 프로필 관리
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">회사 정보와 계정 설정을 관리합니다</p>
                </div>

                {/* Profile Completion */}
                {completionPercent < 100 && (
                    <div className="mb-6 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200 dark:border-teal-700/50 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-bold text-teal-800 dark:text-teal-300">프로필 완성도 {completionPercent}%</p>
                        </div>
                        <div className="w-full bg-teal-200/50 dark:bg-teal-800/30 rounded-full h-2 mb-3">
                            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${completionPercent}%` }} />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {completionItems.map(item => (
                                <span key={item.label} className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${item.done ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'}`}>
                                    {item.done ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Profile Image */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center overflow-hidden shadow-lg">
                                {user.profile_image ? (
                                    <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Building className="text-white" size={40} />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                            >
                                <Camera size={14} />
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 rounded-lg text-xs font-bold">
                                <Building size={10} /> 벤더
                            </span>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
                            <User size={16} className="text-indigo-500" /> 기본 정보
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'name', label: '이름', icon: User, type: 'text' },
                                { name: 'email', label: '이메일', icon: Mail, type: 'email', disabled: true },
                                { name: 'phone', label: '전화번호', icon: Phone, type: 'tel' },
                                { name: 'business_no', label: '사업자등록번호', icon: FileText, type: 'text' },
                            ].map(field => (
                                <div key={field.name}>
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">{field.label}</label>
                                    <div className="relative">
                                        <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            disabled={field.disabled}
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100 ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
                            <Briefcase size={16} className="text-teal-500" /> 회사 정보
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">회사명</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={form.company_name}
                                        onChange={handleChange}
                                        placeholder="회사명을 입력하세요"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">회사 소개</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="회사를 소개해 주세요 (유통 분야, 취급 품목 등)"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100 resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">주소</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="사무실 주소"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">웹사이트</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="url"
                                            name="website"
                                            value={form.website}
                                            onChange={handleChange}
                                            placeholder="https://"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">취급 품목</label>
                                    <div className="relative">
                                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            name="categories"
                                            value={form.categories}
                                            onChange={handleChange}
                                            placeholder="예: 화장품, 건강식품"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-teal-200 dark:shadow-teal-900/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        {saving ? '저장 중...' : '프로필 저장'}
                    </button>
                </form>

                {/* Password Change */}
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                    <button
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                        className="w-full flex items-center justify-between text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                        <span>🔒 비밀번호 변경</span>
                        <span className="text-xs text-gray-400">{showPasswordSection ? '접기' : '펼치기'}</span>
                    </button>
                    {showPasswordSection && (
                        <div className="mt-4 space-y-3">
                            <input
                                type="password"
                                placeholder="현재 비밀번호"
                                value={passwords.current}
                                onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none text-sm font-medium dark:text-gray-100"
                            />
                            <input
                                type="password"
                                placeholder="새 비밀번호 (6자 이상)"
                                value={passwords.new_password}
                                onChange={e => setPasswords(p => ({ ...p, new_password: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none text-sm font-medium dark:text-gray-100"
                            />
                            <input
                                type="password"
                                placeholder="새 비밀번호 확인"
                                value={passwords.confirm}
                                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none text-sm font-medium dark:text-gray-100"
                            />
                            <button
                                onClick={handlePasswordChange}
                                disabled={saving}
                                className="w-full py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-colors"
                            >
                                비밀번호 변경
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};

export default VendorProfile;

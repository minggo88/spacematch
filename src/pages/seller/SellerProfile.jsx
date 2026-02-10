import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Building, Lock, Save, Camera, Tag, Instagram, ImagePlus, Trash2 } from 'lucide-react';

const CATEGORY_OPTIONS = [
    { value: 'fashion', label: '패션/잡화' },
    { value: 'beauty', label: '뷰티' },
    { value: 'food', label: '푸드/음료' },
    { value: 'living', label: '리빙/라이프스타일' },
    { value: 'art', label: '아트/디자인' },
    { value: 'stationery', label: '문구/스테이셔너리' },
    { value: 'digital', label: '디지털/전자기기' },
    { value: 'activity', label: '스포츠/액티비티' },
    { value: 'eco', label: '친환경/에코라이프' },
    { value: 'pet', label: '반려동물' },
    { value: 'kids', label: '키즈/유아' },
    { value: 'handmade', label: '핸드메이드/수공예' },
    { value: 'vintage', label: '빈티지/중고' },
    { value: 'perfume', label: '향수/디퓨저' },
    { value: 'book', label: '도서/매거진' },
    { value: 'other', label: '기타' }
];

const SellerProfile = () => {
    const { user, updateUserProfile, refreshUser, changePassword } = useAuth();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    // Initialize profile with current user data
    const [profile, setProfile] = useState({
        name: user.name || '',
        email: user.email || '',
        brandName: user.brandName || user.brand_name || '',
        phone: user.phone || '',
        description: user.description || '',
        category: user.category || '',
        instagram: user.instagram || ''
    });
    const [saving, setSaving] = useState(false);
    const [sellerPhotos, setSellerPhotos] = useState([]);
    const [photoUploading, setPhotoUploading] = useState(false);
    const photoInputRef = useRef(null);

    const [previewImage, setPreviewImage] = useState(user.profile_image || null);

    // Sync local profile + preview with user context whenever it changes
    useEffect(() => {
        setProfile({
            name: user.name || '',
            email: user.email || '',
            brandName: user.brandName || user.brand_name || '',
            phone: user.phone || '',
            description: user.description || '',
            category: user.category || '',
            instagram: user.instagram || ''
        });
        if (user.profile_image) {
            setPreviewImage(user.profile_image);
        }
    }, [user]);

    // Fetch seller product photos
    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const res = await fetch(`/api/users/get_seller_photos.php`, { credentials: 'include' });
                const data = await res.json();
                if (data.success) {
                    setSellerPhotos(data.photos);
                }
            } catch (err) {
                console.error('Failed to load seller photos:', err);
            }
        };
        fetchPhotos();
    }, []);

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show instant local preview
        const localPreview = URL.createObjectURL(file);
        setPreviewImage(localPreview);

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/users/upload_profile_image.php', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const responseText = await response.text();
            console.log('Upload response status:', response.status);
            console.log('Upload response body:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseErr) {
                console.error('Failed to parse response:', responseText);
                alert('서버 응답 오류 (JSON 파싱 실패). 콘솔을 확인해주세요.');
                // Keep local preview even if server response parsing fails
                return;
            }

            if (data.success) {
                // Use server URL for persistent display
                setPreviewImage(data.imageUrl);
                await refreshUser();
                alert('프로필 사진이 변경되었습니다.');
            } else {
                // Revert preview on failure
                setPreviewImage(user.profile_image || null);
                alert(data.message || '프로필 업로드 실패');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setPreviewImage(user.profile_image || null);
            alert('업로드 중 오류: ' + error.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            URL.revokeObjectURL(localPreview);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (sellerPhotos.length >= 5) {
            alert('\uCD5C\uB300 5\uC7A5\uAE4C\uC9C0 \uC5C5\uB85C\uB4DC \uAC00\uB2A5\uD569\uB2C8\uB2E4.');
            return;
        }

        setPhotoUploading(true);
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await fetch('/api/users/upload_seller_photos.php', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setSellerPhotos(prev => [...prev, data.photo]);
                alert('사진이 업로드되었습니다.');
            } else {
                alert(data.message || '사진 업로드에 실패했습니다.');
            }
        } catch (err) {
            console.error('Photo upload error:', err);
            alert('사진 업로드 중 오류가 발생했습니다.');
        } finally {
            setPhotoUploading(false);
            e.target.value = '';
        }
    };

    const handleDeletePhoto = async (photoId) => {
        if (!confirm('이 사진을 삭제하시겠습니까?')) return;
        try {
            const res = await fetch('/api/users/delete_seller_photo.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ photo_id: photoId })
            });
            const data = await res.json();
            if (data.success) {
                setSellerPhotos(prev => prev.filter(p => p.id !== photoId));
            } else {
                alert(data.message || '삭제에 실패했습니다.');
            }
        } catch (err) {
            alert('\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const result = await updateUserProfile(profile);
            if (result?.success !== false) {
                // Re-fetch user from server to ensure AuthContext is fully synced
                await refreshUser();
                alert('프로필이 성공적으로 업데이트되었습니다.');
            } else {
                alert(result.message || '프로필 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('Profile update failed:', error);
            alert('프로필 업데이트에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const submitPasswordChange = () => {
        if (passwordData.newPassword.length < 4) {
            alert('비밀번호는 4자 이상이어야 합니다.');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('\uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.');
            return;
        }
        changePassword(user.email, passwordData.newPassword);
        setPasswordData({ newPassword: '', confirmPassword: '' });
        alert('\uBE44\uBC00\uBC88\uD638\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4.');
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-12">

            {/* Profile Header */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-10"></div>

                <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-4xl font-bold text-indigo-600 shadow-inner border-4 border-white overflow-hidden">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile" className="w-full h-full object-cover" onError={() => setPreviewImage(null)} />
                        ) : (
                            user.name[0]
                        )}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />

                    <button
                        onClick={triggerFileInput}
                        disabled={uploading}
                        className="absolute bottom-1 right-1 p-2 bg-indigo-600 rounded-full text-white shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {uploading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Camera size={16} />
                        )}
                    </button>
                </div>

                <div className="text-center md:text-left z-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{user.name}</h2>
                    <p className="text-gray-500 font-medium mb-4">{user.email}</p>
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100">
                        {user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : user.role === 'vendor' ? 'Vendor Account' : 'Seller Account'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <User className="text-indigo-500" size={20} />
                                기본 정보 설정
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">담당자 이름</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium"
                                    />
                                </div>
                                {!['admin', 'superadmin'].includes(user.role) && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">브랜드명</label>
                                        <input
                                            type="text"
                                            name="brandName"
                                            value={profile.brandName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium"
                                            placeholder="브랜드 이름을 입력하세요"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">이메일 계정</label>
                                    <div className="relative opacity-60">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-transparent rounded-xl cursor-not-allowed font-medium text-gray-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">연락처</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Category & Instagram */}
                            {user.role === 'seller' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            <Tag size={14} className="inline mr-1 text-indigo-500" />
                                            품목 카테고리
                                        </label>
                                        <select
                                            name="category"
                                            value={profile.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium appearance-none"
                                        >
                                            <option value="">카테고리 선택</option>
                                            {CATEGORY_OPTIONS.map(c => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            <Instagram size={14} className="inline mr-1 text-pink-500" />
                                            인스타그램
                                        </label>
                                        <input
                                            type="text"
                                            name="instagram"
                                            value={profile.instagram}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium"
                                            placeholder="@username"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Product Photos */}
                            {user.role === 'seller' && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <ImagePlus size={14} className="inline mr-1 text-emerald-500" />
                                        상품 사진 (최대 5장)
                                    </label>
                                    <p className="text-xs text-gray-400 mb-3">판매 중인 상품 또는 브랜드 사진을 등록해 주세요. 벤더가 셀러 검색 시 사진을 확인합니다.</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                        {sellerPhotos.map(photo => (
                                            <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                                <img src={photo.image_url} alt="상품" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePhoto(photo.id)}
                                                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {sellerPhotos.length < 5 && (
                                            <button
                                                type="button"
                                                onClick={() => photoInputRef.current?.click()}
                                                disabled={photoUploading}
                                                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors disabled:opacity-50"
                                            >
                                                {photoUploading ? (
                                                    <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <ImagePlus size={24} />
                                                        <span className="text-xs mt-1 font-medium">추가</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={photoInputRef}
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    {['admin', 'superadmin'].includes(user.role) ? '소개' : '브랜드 소개 및 판매 정보'}
                                </label>
                                {!['admin', 'superadmin'].includes(user.role) && (
                                    <p className="text-xs text-gray-400 mb-2">판매하시는 상품, 판매 방식, 브랜드 스토리를 자유롭게 작성해 주세요. 벤더가 셀러 검색 시 이 정보를 확인합니다.</p>
                                )}
                                <textarea
                                    name="description"
                                    value={profile.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium resize-none"
                                    placeholder="핸드메이드 소품을 제작하고 있습니다. 주로 창업박람회와 플리마켓에 참여하며, 온라인 쇼핑몰도 운영 중입니다. 소량 맞춤 제작도 가능합니다."
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={saving} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50">
                                    <Save size={18} /> {saving ? '저장 중..' : '정보 저장하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Password Change Area */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Lock className="text-rose-500" size={20} />
                                보안 설정
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">새 비밀번호</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="새 비밀번호 입력"
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">비밀번호 확인</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="비밀번호 다시 입력"
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium"
                                />
                            </div>
                            <button
                                onClick={submitPasswordChange}
                                type="button"
                                className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all mt-2"
                            >
                                비밀번호 변경
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;

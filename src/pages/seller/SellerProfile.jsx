import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Building, Lock, Save, Camera, Tag, Instagram, ImagePlus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Globe } from 'lucide-react';

const SellerProfile = () => {
    const { user, updateUserProfile, refreshUser, changePassword } = useAuth();
    const { showToast } = useToast();
    const { t } = useTranslation('seller');

    const CATEGORY_OPTIONS = [
        { value: 'fashion', label: t('profilePage.categoryFashion') },
        { value: 'beauty', label: t('profilePage.categoryBeauty') },
        { value: 'food', label: t('profilePage.categoryFood') },
        { value: 'living', label: t('profilePage.categoryLiving') },
        { value: 'art', label: t('profilePage.categoryArt') },
        { value: 'stationery', label: t('profilePage.categoryStationery') },
        { value: 'digital', label: t('profilePage.categoryDigital') },
        { value: 'activity', label: t('profilePage.categoryActivity') },
        { value: 'eco', label: t('profilePage.categoryEco') },
        { value: 'pet', label: t('profilePage.categoryPet') },
        { value: 'kids', label: t('profilePage.categoryKids') },
        { value: 'handmade', label: t('profilePage.categoryHandmade') },
        { value: 'vintage', label: t('profilePage.categoryVintage') },
        { value: 'perfume', label: t('profilePage.categoryPerfume') },
        { value: 'book', label: t('profilePage.categoryBook') },
        { value: 'other', label: t('profilePage.categoryOther') }
    ];
    const COUNTRY_OPTIONS_LIST = [
        { value: 'ko', label: '🇰🇷 대한민국 (Korea)' },
        { value: 'vi', label: '🇻🇳 Việt Nam' },
        { value: 'ja', label: '🇯🇵 日本 (Japan)' },
        { value: 'en', label: '🇺🇸 United States' },
        { value: 'en-GB', label: '🇬🇧 United Kingdom' },
        { value: 'en-CA', label: '🇨🇦 Canada (English)' },
        { value: 'fr-CA', label: '🇨🇦 Canada (Français)' },
        { value: 'th', label: '🇹🇭 ประเทศไทย (Thailand)' },
        { value: 'km', label: '🇰🇭 កម្ពុជា (Cambodia)' },
        { value: 'ru', label: '🇷🇺 Россия (Russia)' },
        { value: 'uk', label: '🇺🇦 Україна (Ukraine)' },
    ];
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
        instagram: user.instagram || '',
        country: user.country || 'ko'
    });
    const [saving, setSaving] = useState(false);
    const [sellerPhotos, setSellerPhotos] = useState([]);
    const [photoUploading, setPhotoUploading] = useState(false);
    const photoInputRef = useRef(null);

    const [previewImage, setPreviewImage] = useState(user.profile_image || null);

    // Visibility toggle state
    const [isPublic, setIsPublic] = useState(() => {
        const val = user.is_public;
        return val === undefined || val === null || val === '1' || val === 1 ? true : false;
    });
    const [togglingVisibility, setTogglingVisibility] = useState(false);

    // Sync local profile + preview with user context whenever it changes
    useEffect(() => {
        setProfile({
            name: user.name || '',
            email: user.email || '',
            brandName: user.brandName || user.brand_name || '',
            phone: user.phone || '',
            description: user.description || '',
            category: user.category || '',
            instagram: user.instagram || '',
            country: user.country || 'ko'
        });
        if (user.profile_image) {
            setPreviewImage(user.profile_image);
        }
        // Sync visibility
        const val = user.is_public;
        setIsPublic(val === undefined || val === null || val === '1' || val === 1 ? true : false);
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

    const handlePhoneChange = (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        let formatted = raw;
        if (raw.length > 3 && raw.length <= 7) {
            formatted = raw.slice(0, 3) + '-' + raw.slice(3);
        } else if (raw.length > 7) {
            formatted = raw.slice(0, 3) + '-' + raw.slice(3, 7) + '-' + raw.slice(7, 11);
        }
        setProfile({ ...profile, phone: formatted });
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
                showToast(t('profilePage.serverParseError'), 'error');
                // Keep local preview even if server response parsing fails
                return;
            }

            if (data.success) {
                // Use server URL for persistent display
                setPreviewImage(data.imageUrl);
                await refreshUser();
                showToast(t('profilePage.profileImageUpdated'), 'success');
            } else {
                // Revert preview on failure
                setPreviewImage(user.profile_image || null);
                showToast(data.message || t('profilePage.profileUploadFailed'), 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setPreviewImage(user.profile_image || null);
            showToast(t('profilePage.uploadError') + error.message, 'error');
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
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const remaining = 10 - sellerPhotos.length;
        if (remaining <= 0) {
            showToast(t('profilePage.maxPhotos'), 'warning');
            return;
        }

        const toUpload = files.slice(0, remaining);
        if (files.length > remaining) {
            showToast(t('profilePage.remainingPhotos', { count: remaining }), 'warning');
        }

        setPhotoUploading(true);
        let successCount = 0;
        let lastError = null;

        for (const file of toUpload) {
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
                    successCount++;
                } else {
                    lastError = data.message || t('profilePage.photoUploadFailed');
                }
            } catch (err) {
                console.error('Photo upload error:', err);
                lastError = t('profilePage.photoUploadError');
            }
        }

        if (successCount > 0) {
            showToast(t('profilePage.photosUploaded', { count: successCount }), 'success');
        }
        if (lastError) {
            showToast(lastError, 'error');
        }

        setPhotoUploading(false);
        e.target.value = '';
    };

    const handleDeletePhoto = async (photoId) => {
        if (!confirm(t('profilePage.deletePhotoConfirm'))) return;
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
                showToast(data.message || t('profilePage.deleteFailed'), 'error');
            }
        } catch (err) {
            showToast(t('common:error'), 'error');
        }
    };

    const movePhoto = async (index, direction) => {
        const newPhotos = [...sellerPhotos];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newPhotos.length) return;
        [newPhotos[index], newPhotos[targetIndex]] = [newPhotos[targetIndex], newPhotos[index]];
        setSellerPhotos(newPhotos);
        try {
            await fetch('/api/users/reorder_seller_photos.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ order: newPhotos.map(p => p.id) })
            });
        } catch (err) {
            console.error('Reorder error:', err);
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
                showToast(t('profilePage.profileUpdated'), 'success');
            } else {
                showToast(result.message || t('profilePage.profileUpdateFailed'), 'error');
            }
        } catch (error) {
            console.error('Profile update failed:', error);
            showToast(t('profilePage.profileUpdateFailed'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const submitPasswordChange = () => {
        if (passwordData.newPassword.length < 4) {
            showToast(t('profilePage.passwordMinLength'), 'warning');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast(t('profilePage.passwordMismatch'), 'warning');
            return;
        }
        changePassword(user.email, passwordData.newPassword);
        setPasswordData({ newPassword: '', confirmPassword: '' });
        showToast(t('profilePage.passwordChanged'), 'success');
    };

    const toggleVisibility = async () => {
        setTogglingVisibility(true);
        try {
            const newValue = isPublic ? 0 : 1;
            const result = await updateUserProfile({ is_public: newValue });
            if (result?.success !== false) {
                setIsPublic(!isPublic);
                await refreshUser();
            } else {
                showToast(result.message || t('profilePage.visibilityFailed'), 'error');
            }
        } catch (error) {
            console.error('Visibility toggle failed:', error);
            showToast(t('profilePage.visibilityError'), 'error');
        } finally {
            setTogglingVisibility(false);
        }
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

            {/* Visibility Toggle Card */}
            {user.role === 'seller' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 md:p-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${isPublic
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-gray-100 text-gray-400'
                                }`}>
                                {isPublic ? <Eye size={22} /> : <EyeOff size={22} />}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{t('profilePage.visibilityTitle')}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {isPublic
                                        ? t('profilePage.visibilityPublic')
                                        : t('profilePage.visibilityHidden')}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={toggleVisibility}
                            disabled={togglingVisibility}
                            className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-offset-1 disabled:opacity-50 flex-shrink-0 ${isPublic
                                ? 'bg-emerald-500 focus:ring-emerald-500/20'
                                : 'bg-gray-300 focus:ring-gray-300/20'
                                }`}
                        >
                            <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${isPublic ? 'translate-x-6' : 'translate-x-0'
                                }`}>
                                {togglingVisibility && (
                                    <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <User className="text-indigo-500" size={20} />
                                {t('profilePage.basicInfo')}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('profilePage.contactName')}</label>
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
                                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('profilePage.brandName')}</label>
                                        <input
                                            type="text"
                                            name="brandName"
                                            value={profile.brandName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium"
                                            placeholder={t('profilePage.brandPlaceholder')}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('profilePage.emailAccount')}</label>
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
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('profilePage.phone')}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handlePhoneChange}
                                            placeholder="010-0000-0000"
                                            maxLength={13}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Globe size={14} className="inline mr-1 text-indigo-500" />
                                    {t('profilePage.country', '국가')}
                                </label>
                                <select
                                    name="country"
                                    value={profile.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium appearance-none"
                                >
                                    {COUNTRY_OPTIONS_LIST.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category & Instagram */}
                            {user.role === 'seller' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            <Tag size={14} className="inline mr-1 text-indigo-500" />
                                            {t('profilePage.categoryLabel')}
                                        </label>
                                        <select
                                            name="category"
                                            value={profile.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium appearance-none"
                                        >
                                            <option value="">{t('profilePage.categorySelect')}</option>
                                            {CATEGORY_OPTIONS.map(c => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            <Instagram size={14} className="inline mr-1 text-pink-500" />
                                            {t('profilePage.instagram')}
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
                                        {t('profilePage.productPhotos')}
                                    </label>
                                    <p className="text-xs text-gray-400 mb-3">{t('profilePage.productPhotosDesc')}</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                        {sellerPhotos.map((photo, idx) => (
                                            <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                                <img src={photo.image_url} alt={t('profilePage.productAlt')} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                                                <div className="absolute top-1 left-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {idx > 0 && (
                                                        <button type="button" onClick={() => movePhoto(idx, -1)}
                                                            className="p-1 bg-white/90 rounded-md shadow hover:bg-white transition-colors">
                                                            <ArrowUp size={12} className="text-gray-700" />
                                                        </button>
                                                    )}
                                                    {idx < sellerPhotos.length - 1 && (
                                                        <button type="button" onClick={() => movePhoto(idx, 1)}
                                                            className="p-1 bg-white/90 rounded-md shadow hover:bg-white transition-colors">
                                                            <ArrowDown size={12} className="text-gray-700" />
                                                        </button>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePhoto(photo.id)}
                                                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity">{idx + 1}</span>
                                            </div>
                                        ))}
                                        {sellerPhotos.length < 10 && (
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
                                                        <span className="text-xs mt-1 font-medium">{t('profilePage.addPhoto')}</span>
                                                        <span className="text-[10px] text-gray-300">{sellerPhotos.length}/10</span>
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
                                        multiple
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    {['admin', 'superadmin'].includes(user.role) ? t('profilePage.descriptionAdmin') : t('profilePage.descriptionSeller')}
                                </label>
                                {!['admin', 'superadmin'].includes(user.role) && (
                                    <p className="text-xs text-gray-400 mb-2">{t('profilePage.descriptionHint')}</p>
                                )}
                                <textarea
                                    name="description"
                                    value={profile.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium resize-none"
                                    placeholder={t('profilePage.descriptionPlaceholder')}
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={saving} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50">
                                    <Save size={18} /> {saving ? t('profilePage.saving') : t('profilePage.saveInfo')}
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
                                {t('profilePage.securitySettings')}
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('profilePage.newPassword')}</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder={t('profilePage.newPasswordPlaceholder')}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('profilePage.confirmPassword')}</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder={t('profilePage.confirmPasswordPlaceholder')}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium"
                                />
                            </div>
                            <button
                                onClick={submitPasswordChange}
                                type="button"
                                className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all mt-2"
                            >
                                {t('profilePage.changePassword')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;

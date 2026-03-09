import React, { useState, useEffect, useRef } from 'react';
import { X, Store, MapPin, Filter, Plus, Trash2, Camera, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, Users, Calendar, Minus, BarChart3, Tag, Paperclip, FileText, Download } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode';

const API_BASE = '/api';

const CATEGORY_OPTIONS = [
    { value: 'fashion', label: '패션/잡화' },
    { value: 'beauty', label: '뷰티' },
    { value: 'food', label: '푸드/음료' },
    { value: 'living', label: '리빙/라이프스타일' },
    { value: 'art', label: '아트/디자인' },
    { value: 'stationery', label: '문구/오피스' },
    { value: 'digital', label: '디지털/테크' },
    { value: 'activity', label: '스포츠/액티비티' },
    { value: 'eco', label: '친환경/에코라이프' },
    { value: 'pet', label: '반려동물' },
    { value: 'kids', label: '키즈/유아' },
    { value: 'handmade', label: '핸드메이드/수공예' },
    { value: 'vintage', label: '빈티지/중고' },
    { value: 'perfume', label: '향수/디퓨저' },
    { value: 'book', label: '도서/매거진' },
];

const TARGET_CUSTOMER_OPTIONS = [
    { value: '20대 여성', label: '20대 여성' },
    { value: '30대 여성', label: '30대 여성' },
    { value: '20대 남성', label: '20대 남성' },
    { value: '30대 남성', label: '30대 남성' },
    { value: '10대 청소년', label: '10대 청소년' },
    { value: '40대 이상', label: '40대 이상' },
    { value: '대학생', label: '대학생' },
    { value: '직장인', label: '직장인' },
    { value: '주부', label: '주부' },
    { value: '가족 단위', label: '가족 단위' },
    { value: '커플', label: '커플' },
    { value: '외국인 관광객', label: '외국인 관광객' },
    { value: '유아/어린이 동반', label: '유아/어린이 동반' },
    { value: 'MZ세대', label: 'MZ세대' },
    { value: '반려동물 동반', label: '반려동물 동반' },
    { value: '프리랜서/크리에이터', label: '프리랜서/크리에이터' },
    { value: '패션 관심층', label: '패션 관심층' },
    { value: '뷰티 관심층', label: '뷰티 관심층' },
    { value: 'F&B 관심층', label: 'F&B 관심층' },
    { value: '건강/웰니스 관심층', label: '건강/웰니스 관심층' },
];

const VenueModal = ({
    isOpen,
    onClose,
    venue, // null for create mode
    initialData, // Optional: pre-fill data for duplicate mode (venue=null + initialData=object)
    onSubmit, // (formData) => Promise
    isAdmin = false,
    onDelete // Optional: for delete action within modal if needed
}) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        detailAddress: '',
        region: '',
        description: '',
        price: '',
        commission_rate: '',
        pricing_unit: 'daily',
        type: 'popup',
        images: [],
        attachments: [],
        recruitment_start: '',
        recruitment_end: '',
        event_periods: [{ start: '', end: '' }],
        recruitment_closed: false,
        max_sellers: '',
        avg_sales: '',
        sales_unit: 'monthly',
        popular_categories: [],
        target_customers: []
    });
    const [eventPeriodCount, setEventPeriodCount] = useState(1);
    const [customCategory, setCustomCategory] = useState('');
    const [attachmentFiles, setAttachmentFiles] = useState([]);
    const attachmentInputRef = useRef(null);

    // Address State
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    // File Upload State
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    // Initial Data Loading
    // Determine mode: edit / duplicate / create
    const isDuplicateMode = !venue && !!initialData;

    useEffect(() => {
        if (isOpen) {
            // Source data is either edit venue or duplicate initialData
            const source = venue || initialData;
            if (source) {
                // Parse event_periods from JSON or build from legacy fields
                let periods = [{ start: '', end: '' }];
                if (!isDuplicateMode) {
                    // Only carry over periods for edit mode
                    if (source.event_periods) {
                        try {
                            const parsed = typeof source.event_periods === 'string' ? JSON.parse(source.event_periods)
                                : source.event_periods;
                            if (Array.isArray(parsed) && parsed.length > 0) periods = parsed;
                        } catch { /* ignored */ }
                    } else if (source.event_start || source.event_end) {
                        periods = [{ start: source.event_start || '', end: source.event_end || '' }];
                    }
                }
                setFormData({
                    name: source.name || '',
                    location: source.location || '',
                    detailAddress: '',
                    region: source.region || '',
                    description: source.description || '',
                    price: source.price ? String(source.price) : '',
                    commission_rate: source.commission_rate ? String(source.commission_rate) : '',
                    pricing_unit: source.pricing_unit || 'daily',
                    type: source.type || 'popup',
                    size: source.size || 'medium',
                    images: source.images || [],
                    // Dates: reset for duplicate, keep for edit
                    recruitment_start: isDuplicateMode ? '' : (source.recruitment_start || ''),
                    recruitment_end: isDuplicateMode ? '' : (source.recruitment_end || ''),
                    event_periods: periods,
                    recruitment_closed: isDuplicateMode ? false : (source.recruitment_closed ? true : false),
                    max_sellers: source.max_sellers ?? '',
                    avg_sales: source.avg_sales || '',
                    sales_unit: source.sales_unit || 'monthly',
                    popular_categories: (() => {
                        try {
                            const p = typeof source.popular_categories === 'string' ? JSON.parse(source.popular_categories)
                                : source.popular_categories;
                            return Array.isArray(p) ? p : [];
                        } catch { return []; }
                    })(),
                    target_customers: (() => {
                        try {
                            const t = typeof source.target_customers === 'string' ? JSON.parse(source.target_customers)
                                : source.target_customers;
                            return Array.isArray(t) ? t : [];
                        } catch { return []; }
                    })(),
                    attachments: (() => {
                        try {
                            const a = typeof source.attachments === 'string' ? JSON.parse(source.attachments)
                                : source.attachments;
                            return Array.isArray(a) ? a : [];
                        } catch { return []; }
                    })()
                });
                setEventPeriodCount(periods.length);
            } else {
                setFormData({
                    name: '',
                    location: '',
                    detailAddress: '',
                    region: '',
                    description: '',
                    price: '',
                    commission_rate: '',
                    pricing_unit: 'daily',
                    type: 'popup',
                    size: 'medium',
                    images: [],
                    recruitment_start: '',
                    recruitment_end: '',
                    event_periods: [{ start: '', end: '' }],
                    recruitment_closed: false,
                    max_sellers: '',
                    avg_sales: '',
                    sales_unit: 'monthly',
                    popular_categories: [],
                    target_customers: []
                });
                setEventPeriodCount(1);
                setCustomCategory('');
            }
            setSelectedFiles([]);
            setIsPostcodeOpen(false);
        }
    }, [isOpen, venue, initialData]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // File Handlers ??track files paired with their blob URL for proper sync
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            const newEntries = filesArray.map(file => ({
                file,
                blobUrl: URL.createObjectURL(file)
            }));
            setSelectedFiles(prev => [...prev, ...newEntries]);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newEntries.map(e => e.blobUrl)]
            }));
        }
    };

    const removeImage = (index) => {
        const removedUrl = formData.images[index];
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        // Remove from selectedFiles if it's a blob
        if (removedUrl && removedUrl.startsWith('blob:')) {
            setSelectedFiles(prev => prev.filter(entry => entry.blobUrl !== removedUrl));
        }
    };

    const moveImage = (fromIndex, direction) => {
        const toIndex = fromIndex + direction;
        if (toIndex < 0 || toIndex >= formData.images.length) return;
        const currentImages = [...formData.images];
        setFormData(prev => {
            const newImages = [...prev.images];
            [newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]];
            return { ...prev, images: newImages };
        });
        // Also swap in selectedFiles mapping if both are blobs
        setSelectedFiles(prev => {
            const newFiles = [...prev];
            const fromEntry = newFiles.findIndex(e => e.blobUrl === currentImages[fromIndex]);
            const toEntry = newFiles.findIndex(e => e.blobUrl === currentImages[toIndex]);
            if (fromEntry !== -1 && toEntry !== -1) {
                [newFiles[fromEntry], newFiles[toEntry]] = [newFiles[toEntry], newFiles[fromEntry]];
            }
            return newFiles;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct submission data
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('location', `${formData.location} ${formData.detailAddress}`.trim());
        submitData.append('region', formData.region || '');
        submitData.append('price', formData.price);
        submitData.append('commission_rate', formData.commission_rate || '0');
        submitData.append('description', formData.description);
        submitData.append('pricing_unit', formData.pricing_unit);
        submitData.append('type', formData.type);
        submitData.append('size', formData.size);

        // Recruitment fields
        if (formData.recruitment_start) {
            submitData.append('recruitment_start', formData.recruitment_start);
        }
        if (formData.recruitment_end) {
            submitData.append('recruitment_end', formData.recruitment_end);
        }
        // Event periods ??send as JSON and also set first period as legacy event_start/event_end
        const periods = (formData.event_periods || []).filter(p => p.start || p.end);
        submitData.append('event_periods', JSON.stringify(periods));
        if (periods.length > 0) {
            if (periods[0].start) submitData.append('event_start', periods[0].start);
            if (periods[0].end) submitData.append('event_end', periods[0].end);
        }
        submitData.append('recruitment_closed', formData.recruitment_closed ? '1' : '0');
        submitData.append('max_sellers', formData.max_sellers || '0');
        submitData.append('avg_sales', formData.avg_sales || '');
        submitData.append('sales_unit', formData.sales_unit || 'monthly');
        submitData.append('popular_categories', JSON.stringify(formData.popular_categories || []));
        submitData.append('target_customers', JSON.stringify(formData.target_customers || []));

        // Separate existing images vs new files — maintain order from formData.images
        const existingImages = formData.images.filter(img => typeof img === 'string' && !img.startsWith('blob:'));
        existingImages.forEach(img => submitData.append('existing_images[]', img));

        // Append NEW files in the order they appear in formData.images
        const blobOrder = formData.images.filter(img => img.startsWith('blob:'));
        blobOrder.forEach(blobUrl => {
            const entry = selectedFiles.find(e => e.blobUrl === blobUrl);
            if (entry) submitData.append('images[]', entry.file);
        });

        // Attachments
        const existingAttachments = (formData.attachments || []).filter(a => typeof a === 'string');
        existingAttachments.forEach(a => submitData.append('existing_attachments[]', a));
        attachmentFiles.forEach(f => submitData.append('attachments[]', f));

        if (venue?.id) {
            submitData.append('id', venue.id);
        }

        await onSubmit(submitData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">

                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Store size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{venue ? '공간 정보 수정' : isDuplicateMode ? '공간 복제 등록' : '새 공간 등록'}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{venue ? '등록된 공간 정보를 수정합니다' : isDuplicateMode ? '기존 공간을 복제하여 새로 등록합니다' : '새로운 공간을 등록하여 서비스해보세요'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                    <form id="venue-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 is-required">공간 이름</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                placeholder="수원 팝업 스페이스 A"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all font-medium focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">주소 *</label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        readOnly
                                        value={formData.location}
                                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed"
                                        placeholder="주소 검색 버튼을 클릭하세요"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsPostcodeOpen(true)}
                                        className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all whitespace-nowrap"
                                    >
                                        📍 검색</button>
                                </div>
                                <input
                                    name="detailAddress"
                                    value={formData.detailAddress}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100"
                                    placeholder="상세 주소 (예: 1층 101호)"
                                />
                            </div>
                            {isPostcodeOpen && (
                                <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="bg-gray-50 p-2 flex justify-end">
                                        <button type="button" onClick={() => setIsPostcodeOpen(false)}><X size={18} /></button>
                                    </div>
                                    <DaumPostcode
                                        onComplete={(data) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                location: data.address,
                                                region: data.sido || ''
                                            }));
                                            setIsPostcodeOpen(false);
                                        }}
                                        style={{ height: '400px' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Type & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">공간 유형</label>
                                <div className="relative">
                                    <select
                                        name="type"
                                        value={['popup', 'gallery', 'cafe', 'showroom', 'fleamarket'].includes(formData.type) ? formData.type : 'other'}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormData(prev => ({ ...prev, type: val === 'other' ? '' : val }));
                                        }}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all appearance-none font-medium text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="popup">팝업스토어</option>
                                        <option value="fleamarket">플리마켓</option>
                                        <option value="gallery">갤러리</option>
                                        <option value="cafe">카페</option>
                                        <option value="showroom">쇼룸</option>
                                        <option value="other">기타 (직접 입력)</option>
                                    </select>
                                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                                {!['popup', 'gallery', 'cafe', 'showroom', 'fleamarket'].includes(formData.type) && (
                                    <input
                                        type="text"
                                        value={formData.type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                        placeholder="유형 직접 입력"
                                        className="mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">공간 크기</label>
                                <div className="relative">
                                    <select
                                        name="size"
                                        value={formData.size}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all appearance-none font-medium text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="small">소형 (Small)</option>
                                        <option value="medium">중형 (Medium)</option>
                                        <option value="large">대형 (Large)</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">가격</label>
                                <div className="flex gap-2">
                                    <select
                                        name="pricing_unit"
                                        value={formData.pricing_unit}
                                        onChange={handleFormChange}
                                        className="w-1/3 px-2 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 outline-none font-medium text-sm text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="daily">일 단위</option>
                                        <option value="weekly">주 단위</option>
                                        <option value="monthly">월 단위</option>
                                    </select>
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm"></span>
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            min="0"
                                            value={formData.price}
                                            onChange={handleFormChange}
                                            placeholder="0"
                                            className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all font-bold text-gray-800 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                                {formData.price === '0' || formData.price === 0 ? (
                                    <p className="mt-1.5 text-xs text-emerald-600 font-medium">💚 무료로 설정됩니다</p>
                                ) : null}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">수수료 (%)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">%</span>
                                    <input
                                        type="number"
                                        name="commission_rate"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={formData.commission_rate}
                                        onChange={handleFormChange}
                                        placeholder="0"
                                        className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all font-bold text-gray-800 dark:text-gray-100"
                                    />
                                </div>
                                <p className="mt-1.5 text-xs text-gray-400">매출 기반 수수료 퍼센트를 입력하세요</p>
                            </div>

                            {/* 모집 기간 설정 */}
                            <div className="col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock size={16} className="text-blue-600" />
                                    <p className="text-xs text-gray-400 mb-3">이 공간에서 인기 있는 카테고리를 선택하세요 (복수 선택 가능)</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">모집 시작</label>
                                        <input
                                            type="date"
                                            name="recruitment_start"
                                            value={formData.recruitment_start}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">모집 마감</label>
                                        <input
                                            type="date"
                                            name="recruitment_end"
                                            value={formData.recruitment_end}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center mt-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, recruitment_closed: !prev.recruitment_closed }))}
                                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${formData.recruitment_closed
                                            ? 'bg-gray-700 text-white shadow-md'
                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                                            }`}
                                    >
                                        {formData.recruitment_closed ? '🔒 모집 완료' : '모집 진행 중'}
                                    </button>
                                </div>
                                {formData.recruitment_end && !formData.recruitment_closed && (() => {
                                    const today = new Date(); today.setHours(0, 0, 0, 0);
                                    const dl = new Date(formData.recruitment_end); dl.setHours(0, 0, 0, 0);
                                    const diff = Math.ceil((dl - today) / (1000 * 60 * 60 * 24));
                                    return (
                                        <p className={`mt-2 text-xs font-bold ${diff <= 0 ? 'text-red-500' : diff <= 3 ? 'text-orange-500' : 'text-blue-500'}`}>
                                            {diff < 0 ? '마감됨' : diff === 0 ? '오늘 마감!' : `D-${diff} (${diff}일 남음)`}
                                        </p>
                                    );
                                })()}
                            </div>

                            {/* 행사 기간 설정 */}
                            <div className="col-span-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 p-4 rounded-xl border border-purple-100 dark:border-purple-900/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar size={16} className="text-purple-600" />
                                    <label className="text-sm font-bold text-purple-800 dark:text-purple-300">행사 기간 설정</label>
                                    <div className="ml-auto flex items-center gap-2">
                                        <span className="text-xs text-purple-600 font-medium">기간 </span>
                                        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const n = Math.max(1, eventPeriodCount - 1);
                                                    setEventPeriodCount(n);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        event_periods: prev.event_periods.slice(0, n)
                                                    }));
                                                }}
                                                className="px-2 py-1.5 text-purple-600 hover:bg-purple-50 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                value={eventPeriodCount}
                                                onChange={(e) => {
                                                    const n = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
                                                    setEventPeriodCount(n);
                                                    setFormData(prev => {
                                                        const current = prev.event_periods || [];
                                                        const newPeriods = Array.from({ length: n }, (_, i) =>
                                                            current[i] || { start: '', end: '' }
                                                        );
                                                        return { ...prev, event_periods: newPeriods };
                                                    });
                                                }}
                                                className="w-12 text-center py-1.5 text-sm font-bold text-purple-800 dark:text-purple-300 outline-none border-x border-purple-200 dark:border-purple-800 bg-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const n = Math.min(20, eventPeriodCount + 1);
                                                    setEventPeriodCount(n);
                                                    setFormData(prev => {
                                                        const current = prev.event_periods || [];
                                                        return { ...prev, event_periods: [...current, { start: '', end: '' }] };
                                                    });
                                                }}
                                                className="px-2 py-1.5 text-purple-600 hover:bg-purple-50 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {(formData.event_periods || []).map((period, idx) => (
                                        <div key={idx} className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 border border-purple-100 dark:border-purple-900/50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">기간 {idx + 1}</span>
                                                {idx > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                event_periods: prev.event_periods.filter((_, i) => i !== idx)
                                                            }));
                                                        }}
                                                        className="ml-auto text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">시작일</label>
                                                    <input
                                                        type="date"
                                                        value={period.start || ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setFormData(prev => {
                                                                const updated = [...prev.event_periods];
                                                                updated[idx] = { ...updated[idx], start: val };
                                                                return { ...prev, event_periods: updated };
                                                            });
                                                        }}
                                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">종료일</label>
                                                    <input
                                                        type="date"
                                                        value={period.end || ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setFormData(prev => {
                                                                const updated = [...prev.event_periods];
                                                                updated[idx] = { ...updated[idx], end: val };
                                                                return { ...prev, event_periods: updated };
                                                            });
                                                        }}
                                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Max Sellers */}
                            <div className="col-span-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Users size={16} className="text-emerald-600" />
                                    <label className="text-sm font-bold text-emerald-800 dark:text-emerald-300">모집 인원 설정</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        name="max_sellers"
                                        value={formData.max_sellers}
                                        onChange={handleFormChange}
                                        placeholder="0 (무제한)"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-emerald-500 rounded-xl outline-none transition-all font-bold text-gray-800 dark:text-gray-100 focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-500">이 공간에 입점할 수 있는 최대 셀러 수를 설정하세요. 0은 무제한입니다.</p>
                            </div>
                        </div>

                        {/* 평균 매출 */}
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/50">
                            <div className="flex items-center gap-2 mb-3">
                                <BarChart3 size={16} className="text-amber-600" />
                                <label className="text-sm font-bold text-amber-800 dark:text-amber-300">평균 매출 (선택)</label>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="avg_sales"
                                    value={formData.avg_sales}
                                    onChange={handleFormChange}
                                    placeholder="예: 500만원, 약 50만원"
                                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500 rounded-xl outline-none transition-all font-medium focus:ring-4 focus:ring-amber-500/10 text-gray-900 dark:text-gray-100"
                                />
                                <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                    {[{ v: 'daily', l: '일' }, { v: 'weekly', l: '주' }, { v: 'monthly', l: '월' }].map(opt => (
                                        <button
                                            key={opt.v}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, sales_unit: opt.v }))}
                                            className={`px-3.5 py-3 text-sm font-bold transition-colors ${formData.sales_unit === opt.v ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-amber-50'}`}
                                        >
                                            {opt.l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">이 공간에서 예상되는 평균 매출과 기준 단위를 선택하세요</p>
                        </div>

                        {/* 인기 카테고리 */}
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 p-4 rounded-2xl border border-teal-100 dark:border-teal-900/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Tag size={16} className="text-teal-600" />
                                <label className="text-sm font-bold text-teal-800 dark:text-teal-300">인기 카테고리 (선택)</label>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {CATEGORY_OPTIONS.map(cat => {
                                    const isSelected = (formData.popular_categories || []).includes(cat.value);
                                    return (
                                        <button
                                            key={cat.value}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => {
                                                    const current = prev.popular_categories || [];
                                                    const updated = isSelected
                                                        ? current.filter(c => c !== cat.value)
                                                        : [...current, cat.value];
                                                    return { ...prev, popular_categories: updated };
                                                });
                                            }}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${isSelected
                                                ? 'bg-teal-600 text-white shadow-sm'
                                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-teal-300'
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    );
                                })}
                                {/* Custom categories chips */}
                                {(formData.popular_categories || []).filter(c => !CATEGORY_OPTIONS.some(opt => opt.value === c)).map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, popular_categories: prev.popular_categories.filter(x => x !== c) }))}
                                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-600 text-white shadow-sm flex items-center gap-1"
                                    >
                                        {c} <X size={10} />
                                    </button>
                                ))}
                            </div>
                            {/* Custom category input */}
                            <div className="flex gap-1.5 mt-3">
                                <input
                                    type="text"
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    placeholder="기타 직접 입력 (쉼표로 여러 개 가능)"
                                    className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-teal-500 rounded-lg outline-none text-xs font-medium text-gray-900 dark:text-gray-100"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const vals = customCategory.split(',').map(v => v.trim()).filter(v => v && !(formData.popular_categories || []).includes(v));
                                            if (vals.length > 0) {
                                                setFormData(prev => ({ ...prev, popular_categories: [...(prev.popular_categories || []), ...vals] }));
                                                setCustomCategory('');
                                            }
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const vals = customCategory.split(',').map(v => v.trim()).filter(v => v && !(formData.popular_categories || []).includes(v));
                                        if (vals.length > 0) {
                                            setFormData(prev => ({ ...prev, popular_categories: [...(prev.popular_categories || []), ...vals] }));
                                            setCustomCategory('');
                                        }
                                    }}
                                    className="px-2.5 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Target Customers */}
                        <div className="bg-orange-50/50 dark:bg-orange-950/30 rounded-2xl p-4 border border-orange-100 dark:border-orange-900/50">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                                    <Users size={13} className="text-orange-600" />
                                </div>
                                <label className="text-sm font-bold text-orange-800 dark:text-orange-300">주요 고객층 (선택, 복수 가능)</label>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {TARGET_CUSTOMER_OPTIONS.map(opt => {
                                    const isSelected = (formData.target_customers || []).includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => {
                                                    const current = prev.target_customers || [];
                                                    const updated = isSelected
                                                        ? current.filter(c => c !== opt.value)
                                                        : [...current, opt.value];
                                                    return { ...prev, target_customers: updated };
                                                });
                                            }}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${isSelected
                                                ? 'bg-orange-500 text-white shadow-sm'
                                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-300'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                                {/* Custom customer type chips */}
                                {(formData.target_customers || []).filter(c => !TARGET_CUSTOMER_OPTIONS.some(opt => opt.value === c)).map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, target_customers: prev.target_customers.filter(x => x !== c) }))}
                                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500 text-white shadow-sm flex items-center gap-1"
                                    >
                                        {c} <X size={10} />
                                    </button>
                                ))}
                            </div>
                            {/* Custom customer type input */}
                            <div className="flex gap-1.5">
                                <input
                                    type="text"
                                    value={formData._customCustomer || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, _customCustomer: e.target.value }))}
                                    placeholder="기타 직접 입력 (쉼표로 여러 개: 시니어, 1인가구)"
                                    className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-orange-400 rounded-lg outline-none text-xs font-medium text-gray-900 dark:text-gray-100"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const vals = (formData._customCustomer || '').split(',').map(v => v.trim()).filter(v => v && !(formData.target_customers || []).includes(v));
                                            if (vals.length > 0) {
                                                setFormData(prev => ({ ...prev, target_customers: [...(prev.target_customers || []), ...vals], _customCustomer: '' }));
                                            }
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const vals = (formData._customCustomer || '').split(',').map(v => v.trim()).filter(v => v && !(formData.target_customers || []).includes(v));
                                        if (vals.length > 0) {
                                            setFormData(prev => ({ ...prev, target_customers: [...(prev.target_customers || []), ...vals], _customCustomer: '' }));
                                        }
                                    }}
                                    className="px-2.5 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                            {(formData.target_customers || []).length > 0 && (
                                <p className="text-[10px] text-orange-500 mt-2 font-medium">
                                    {(formData.target_customers || []).length}개 선택됨
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">공간 소개</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                rows={5}
                                placeholder="공간의 매력 포인트와 특징을 자세히 적어주세요"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all resize-none font-medium leading-relaxed text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📸 공간 이미지 갤러리</label>
                            <p className="text-xs text-gray-400 mb-3">첫 번째 사진이 대표 이미지로 사용됩니다. 드래그로 순서를 변경하세요.</p>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative group border border-gray-200 dark:border-gray-700">
                                        <img src={img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                        {/* 대표 badge */}
                                        {idx === 0 && (
                                            <span className="absolute top-1.5 left-1.5 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm z-10">
                                                대표
                                            </span>
                                        )}
                                        {/* Overlay with actions */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px] flex flex-col items-center justify-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors"
                                                title="삭제"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moveImage(idx, -1)}
                                                    disabled={idx === 0}
                                                    className={`p-1.5 rounded-lg transition-colors ${idx === 0 ? 'bg-white/20 text-white/40 cursor-not-allowed' : 'bg-white/80 hover:bg-white text-gray-700'}`}
                                                    title="위로"
                                                >
                                                    <ChevronLeft size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveImage(idx, 1)}
                                                    disabled={idx === formData.images.length - 1}
                                                    className={`p-1.5 rounded-lg transition-colors ${idx === formData.images.length - 1 ? 'bg-white/20 text-white/40 cursor-not-allowed' : 'bg-white/80 hover:bg-white text-gray-700'}`}
                                                    title="아래로"
                                                >
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {formData.images.length < 10 && (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all gap-2 cursor-pointer group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center transition-colors">
                                            <Camera size={18} />
                                        </div>
                                        <span className="text-xs font-bold">추가</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Attachments */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📎 첨부파일 <span className="text-gray-400 font-normal">(선택, 여러 파일 가능)</span></label>
                            <p className="text-xs text-gray-400 mb-3">입점 신청서, 사업자등록증, 계약서 등 관련 서류를 첨부하세요 (PDF, DOC, HWP, 이미지)</p>

                            {/* Existing + new attachments list */}
                            {((formData.attachments || []).length > 0 || attachmentFiles.length > 0) && (
                                <div className="space-y-2 mb-3">
                                    {(formData.attachments || []).map((att, idx) => (
                                        <div key={`existing-${idx}`} className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <FileText size={16} className="text-indigo-500 flex-shrink-0" />
                                            <span className="text-xs font-medium text-gray-700 flex-1 truncate">{att.split('/').pop()}</span>
                                            <a href={`/${att}`} target="_blank" rel="noreferrer" className="p-1 text-indigo-500 hover:text-indigo-700"><Download size={14} /></a>
                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== idx) }))} className="p-1 text-red-400 hover:text-red-600"><X size={14} /></button>
                                        </div>
                                    ))}
                                    {attachmentFiles.map((file, idx) => (
                                        <div key={`new-${idx}`} className="flex items-center gap-2 p-2.5 bg-indigo-50 rounded-xl border border-indigo-200">
                                            <FileText size={16} className="text-indigo-500 flex-shrink-0" />
                                            <span className="text-xs font-medium text-indigo-700 flex-1 truncate">{file.name}</span>
                                            <span className="text-[10px] text-indigo-400">{(file.size / 1024).toFixed(0)}KB</span>
                                            <button type="button" onClick={() => setAttachmentFiles(prev => prev.filter((_, i) => i !== idx))} className="p-1 text-red-400 hover:text-red-600"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div
                                onClick={() => attachmentInputRef.current?.click()}
                                className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-all"
                            >
                                <Paperclip size={16} />
                                <span className="text-xs font-bold">파일 첨부하기</span>
                            </div>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.hwp,.jpg,.jpeg,.png,.gif,.webp"
                                ref={attachmentInputRef}
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    setAttachmentFiles(prev => [...prev, ...files]);
                                    e.target.value = '';
                                }}
                                className="hidden"
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 md:p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between sticky bottom-0 z-10">
                    {/* Delete Button (only in edit mode) */}
                    <div>
                        {onDelete && venue && (
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete();
                                }}
                                className="px-5 py-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={18} />
                                삭제</button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            form="venue-form"
                            className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center gap-2"
                        >
                            {venue ? <><CheckCircle2 size={18} /> 수정 완료</> : isDuplicateMode ? <><Plus size={18} /> 복제 등록</> : <><Plus size={18} /> 베뉴 등록</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueModal;

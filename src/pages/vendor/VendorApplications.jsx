import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, MessageSquare, CheckCircle, XCircle, ChevronDown, Mail, Phone, Instagram, Search, Calendar, Clock, Tag, AlertTriangle, X } from 'lucide-react';

const API_BASE = '/api';

const CATEGORY_LABELS = {
    fashion: '패션/잡화', beauty: '뷰티', food: '푸드/음료',
    living: '리빙/라이프스타일', art: '아트/디자인', stationery: '문구/스테이셔너리',
    digital: '디지털/전자기기', activity: '스포츠/액티비티', eco: '친환경/에코라이프',
    pet: '반려동물', kids: '키즈/유아', handmade: '핸드메이드/수공예',
    vintage: '빈티지/중고', perfume: '향수/디퓨저', book: '도서/매거진'
};

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}분 전`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}시간 전`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}일 전`;
    return new Date(dateStr).toLocaleDateString('ko-KR');
};

const calcExperience = (joinedAt) => {
    if (!joinedAt) return null;
    const diff = Date.now() - new Date(joinedAt).getTime();
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    if (months < 1) return '신규';
    if (months < 12) return `${months}개월`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years}년 ${rem}개월` : `${years}년`;
};

const VendorApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appFilterCategory, setAppFilterCategory] = useState('all');
    const [appFilterStatus, setAppFilterStatus] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Confirm modal state
    const [confirmModal, setConfirmModal] = useState(null);
    // Toast notification state
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchApplications = () => {
        setLoading(true);
        fetch(`${API_BASE}/applications/get_applications.php`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setApplications(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchApplications(); }, []);

    const handleApplicationAction = (appId, status, applicantName) => {
        const isApprove = status === 'approved';
        setConfirmModal({
            title: isApprove ? '입점 신청 승인' : '입점 신청 거절',
            message: `"${applicantName || ''}"님의 입점 신청을 ${isApprove ? '승인' : '거절'}하시겠습니까?`,
            type: isApprove ? 'success' : 'danger',
            confirmLabel: isApprove ? '승인' : '거절',
            onConfirm: () => {
                fetch(`${API_BASE}/applications/update_status.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ id: appId, status: status })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            showToast(isApprove ? '승인 처리되었습니다.' : '거절 처리되었습니다.', 'success');
                            fetchApplications();
                        } else {
                            showToast('처리 실패: ' + data.message, 'error');
                        }
                    })
                    .catch(() => showToast('처리 중 오류가 발생했습니다.', 'error'));
                setConfirmModal(null);
            }
        });
    };

    // Stats
    const pendingApps = applications.filter(a => a.status === 'pending').length;
    const approvedApps = applications.filter(a => a.status === 'approved').length;
    const rejectedApps = applications.filter(a => a.status === 'rejected').length;

    // Filtered
    const filteredApplications = applications.filter(app => {
        const matchesCategory = appFilterCategory === 'all' || app.applicant_category === appFilterCategory ||
            (appFilterCategory === 'other' && !Object.keys(CATEGORY_LABELS).includes(app.applicant_category));
        const matchesStatus = appFilterStatus === 'all' || app.status === appFilterStatus;

        // Search by name, brand, keywords, email
        let matchesSearch = true;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const nameMatch = (app.applicant_name || '').toLowerCase().includes(q);
            const brandMatch = (app.applicant_brand || '').toLowerCase().includes(q);
            const emailMatch = (app.applicant_email || '').toLowerCase().includes(q);
            const venueMatch = (app.venue_name || '').toLowerCase().includes(q);
            const kwMatch = Array.isArray(app.applicant_keywords) && app.applicant_keywords.some(kw => kw.toLowerCase().includes(q));
            const catMatch = (CATEGORY_LABELS[app.applicant_category] || app.applicant_category || '').toLowerCase().includes(q);
            matchesSearch = nameMatch || brandMatch || emailMatch || venueMatch || kwMatch || catMatch;
        }

        return matchesCategory && matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-200 border-t-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900">입점 신청 관리</h1>
                <p className="text-sm text-gray-500 mt-1">내 공간에 들어온 입점 신청을 확인하고 관리하세요.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: '전체', count: applications.length, color: 'text-gray-900', bg: 'bg-white border-gray-200' },
                    { label: '대기', count: pendingApps, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
                    { label: '승인', count: approvedApps, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                    { label: '거절', count: rejectedApps, color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-3 border text-center`}>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.count}</p>
                        <p className="text-[11px] font-bold text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search + Filter */}
            <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="셀러 이름, 브랜드, 키워드, 공간명으로 검색.."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none bg-white"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-700">
                        {filteredApplications.length}건의 신청
                    </p>
                    <div className="flex gap-2">
                        <select value={appFilterStatus} onChange={(e) => setAppFilterStatus(e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                            <option value="all">전체 상태</option>
                            <option value="pending">대기중</option>
                            <option value="approved">승인</option>
                            <option value="rejected">거절</option>
                        </select>
                        <select value={appFilterCategory} onChange={(e) => setAppFilterCategory(e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                            <option value="all">전체 카테고리</option>
                            <option value="fashion">패션/잡화</option>
                            <option value="beauty">뷰티</option>
                            <option value="food">푸드/음료</option>
                            <option value="living">리빙/라이프</option>
                            <option value="art">아트/디자인</option>
                            <option value="other">기타</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Application List */}
            {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <MessageSquare className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-400 font-medium text-sm">조건에 맞는 신청이 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredApplications.map(app => {
                        const initial = (app.applicant_name || '?')[0];
                        const isExpanded = expandedId === app.id;
                        const experience = calcExperience(app.applicant_joined_at);
                        const keywords = Array.isArray(app.applicant_keywords) ? app.applicant_keywords : [];
                        const statusConfig = {
                            pending: { label: '대기중', dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50' },
                            approved: { label: '승인됨', dot: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50' },
                            rejected: { label: '거절됨', dot: 'bg-red-400', text: 'text-red-600', bg: 'bg-red-50' },
                        }[app.status] || { label: app.status, dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50' };

                        return (
                            <div key={app.id} className={`bg-white rounded-2xl border transition-all duration-200 ${app.status === 'pending' ? 'border-amber-200 shadow-sm' : 'border-gray-100'}`}>
                                {/* Summary Row */}
                                <div
                                    className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-2xl"
                                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-extrabold flex-shrink-0 ${app.status === 'pending'
                                            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                                            : app.status === 'approved'
                                                ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                                                : 'bg-gradient-to-br from-gray-300 to-gray-400'
                                            }`}>
                                            {initial}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-900 text-sm truncate">{app.applicant_name || '이름 없음'}</h4>
                                                {app.applicant_brand && (
                                                    <span className="text-xs text-indigo-500 font-medium hidden sm:inline truncate">{app.applicant_brand}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Store size={11} className="text-gray-400 flex-shrink-0" />
                                                <span className="text-xs text-gray-500 truncate">{app.venue_name}</span>
                                                <span className="text-gray-300 text-xs">·</span>
                                                <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(app.created_at)}</span>
                                            </div>
                                            {app.selected_period && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Calendar size={10} className="text-amber-500 flex-shrink-0" />
                                                    <span className="text-[11px] text-amber-600 font-medium truncate">
                                                        {app.selected_period.start ? new Date(app.selected_period.start).toLocaleDateString('ko-KR') : ''} ~ {app.selected_period.end ? new Date(app.selected_period.end).toLocaleDateString('ko-KR') : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${statusConfig.bg} ${statusConfig.text} hidden sm:inline-flex items-center gap-1`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                                                {statusConfig.label}
                                            </span>
                                            <span className={`w-2 h-2 rounded-full ${statusConfig.dot} sm:hidden`}></span>
                                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Detail */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 border-t border-gray-100">
                                        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Left: Message + Actions (moved to top) */}
                                            <div className="space-y-3">
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">신청 메시지</p>
                                                <div className="p-3.5 bg-gray-50 rounded-xl min-h-[80px]">
                                                    <p className={`text-sm leading-relaxed ${app.message ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                                                        {app.message || '메시지가 없습니다.'}
                                                    </p>
                                                </div>

                                                {app.status === 'pending' && (
                                                    <div className="flex gap-2 pt-1">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleApplicationAction(app.id, 'approved', app.applicant_name); }}
                                                            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                                        >
                                                            <CheckCircle size={15} />
                                                            승인
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleApplicationAction(app.id, 'rejected', app.applicant_name); }}
                                                            className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-1.5"
                                                        >
                                                            <XCircle size={15} />
                                                            거절
                                                        </button>
                                                    </div>
                                                )}
                                                {app.status === 'approved' && (
                                                    <div className="p-2.5 text-center bg-emerald-50 rounded-xl">
                                                        <p className="text-xs font-bold text-emerald-600">이미 승인된 완료된 신청입니다.</p>
                                                    </div>
                                                )}
                                                {app.status === 'rejected' && (
                                                    <div className="p-2.5 text-center bg-red-50 rounded-xl">
                                                        <p className="text-xs font-bold text-red-500">거절된 신청입니다.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right: Seller Profile (moved to bottom) */}
                                            <div className="space-y-3">
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">셀러 상세 정보</p>

                                                {/* Info Items */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Tag size={14} className="text-indigo-400 flex-shrink-0" />
                                                        <span className="text-gray-500 w-16 flex-shrink-0">판매 품목</span>
                                                        <span className="font-medium text-gray-800">{CATEGORY_LABELS[app.applicant_category] || app.applicant_category || '미입력'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Mail size={14} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-500 w-16 flex-shrink-0">이메일</span>
                                                        <span className="text-gray-700">{app.applicant_email || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Phone size={14} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-500 w-16 flex-shrink-0">연락처</span>
                                                        <span className="text-gray-700">{app.applicant_phone || '미제공'}</span>
                                                    </div>
                                                    {app.applicant_instagram && (
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <Instagram size={14} className="text-pink-400 flex-shrink-0" />
                                                            <span className="text-gray-500 w-16 flex-shrink-0">인스타</span>
                                                            <a href={`https://instagram.com/${app.applicant_instagram.replace('@', '')}`}
                                                                target="_blank" rel="noopener noreferrer"
                                                                className="text-pink-600 font-medium hover:underline">
                                                                @{app.applicant_instagram.replace('@', '')}
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Clock size={14} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-500 w-16 flex-shrink-0">활동 기간</span>
                                                        <span className="text-gray-700">{experience || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-500 w-16 flex-shrink-0">참여 일자</span>
                                                        <span className="text-gray-700">{app.created_at ? new Date(app.created_at).toLocaleDateString('ko-KR') : '-'}</span>
                                                    </div>
                                                    {/* Selected Event Period */}
                                                    {app.selected_period && (
                                                        <div className="mt-2 p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Calendar size={14} className="text-amber-500 flex-shrink-0" />
                                                                <span className="text-amber-700 font-medium">희망 행사 기간</span>
                                                                <span className="font-bold text-gray-800">
                                                                    {app.selected_period.start ? new Date(app.selected_period.start).toLocaleDateString('ko-KR') : '미정'}
                                                                    {' ~ '}
                                                                    {app.selected_period.end ? new Date(app.selected_period.end).toLocaleDateString('ko-KR') : '미정'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Keywords */}
                                                {keywords.length > 0 && (
                                                    <div className="pt-1">
                                                        <p className="text-[10px] font-bold text-gray-400 mb-1.5">키워드</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {keywords.map((kw, i) => (
                                                                <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[11px] font-bold">{kw}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Bio */}
                                                {app.applicant_description && (
                                                    <div className="p-3 bg-gray-50 rounded-xl">
                                                        <p className="text-[10px] font-bold text-gray-400 mb-1">셀러 자기소개</p>
                                                        <p className="text-sm text-gray-700 leading-relaxed">{app.applicant_description}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {/* Confirm Modal */}
            {confirmModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className={`p-5 flex items-center gap-3 ${confirmModal.type === 'danger' ? 'bg-red-50' : confirmModal.type === 'success' ? 'bg-emerald-50' : 'bg-amber-50'
                            }`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmModal.type === 'danger' ? 'bg-red-100' : confirmModal.type === 'success' ? 'bg-emerald-100' : 'bg-amber-100'
                                }`}>
                                {confirmModal.type === 'success'
                                    ? <CheckCircle size={20} className="text-emerald-500" />
                                    : <AlertTriangle size={20} className={confirmModal.type === 'danger' ? 'text-red-500' : 'text-amber-500'} />}
                            </div>
                            <h3 className="text-base font-bold text-gray-900">{confirmModal.title}</h3>
                        </div>
                        <div className="p-5">
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{confirmModal.message}</p>
                        </div>
                        <div className="px-5 pb-5 flex gap-3">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors text-white ${confirmModal.type === 'danger' ? 'bg-red-500 hover:bg-red-600'
                                    : confirmModal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600'
                                        : 'bg-amber-500 hover:bg-amber-600'
                                    }`}
                            >
                                {confirmModal.confirmLabel || '확인'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]">
                    <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-sm ${toast.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {toast.type === 'success'
                            ? <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                            : <XCircle size={18} className="text-red-500 flex-shrink-0" />}
                        <span className="text-sm font-bold">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-2 p-0.5 hover:bg-black/5 rounded-full transition-colors">
                            <X size={14} className="text-gray-400" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorApplications;

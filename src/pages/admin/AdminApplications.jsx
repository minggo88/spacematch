import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Check, X, ShieldAlert, ShieldCheck, Search, Filter, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const AdminApplications = () => {
    const { applications, updateApplicationStatus } = useData();
    const { toggleUserBlock } = useAuth();
    const [selectedApp, setSelectedApp] = useState(null);
    const [sellerDetails, setSellerDetails] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterVenue, setFilterVenue] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    // Refresh seller details when modal is open
    useEffect(() => {
        if (selectedApp) {
            const users = JSON.parse(localStorage.getItem('spacematch_users') || '[]');
            const user = users.find(u => u.email === selectedApp.sellerId);
            setSellerDetails(user || {});
        }
    }, [selectedApp]);

    // Derived Data
    const sortedApps = [...applications].sort((a, b) => new Date(b.created_at || b.appliedAt) - new Date(a.created_at || a.appliedAt));
    const filteredApps = sortedApps.filter(app => {
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || (app.sellerCategory && app.sellerCategory === filterCategory) || (filterCategory === 'other' && !['fashion', 'beauty', 'food', 'living', 'art', 'stationery', 'digital', 'activity', 'eco', 'pet', 'kids', 'handmade', 'vintage', 'perfume', 'book'].includes(app.sellerCategory));
        const venueName = app.venue_name || app.venueName || '';
        const matchesVenue = filterVenue === 'all' || venueName === filterVenue;
        const name = (app.applicant_name || app.sellerName || '').toLowerCase();
        const email = (app.applicant_email || app.sellerEmail || '').toLowerCase();
        const venue = venueName.toLowerCase();
        const term = searchTerm.toLowerCase();
        const matchesSearch = !term || name.includes(term) || email.includes(term) || venue.includes(term);
        return matchesStatus && matchesCategory && matchesVenue && matchesSearch;
    });

    // Unique venue names for venue filter
    const uniqueVenues = [...new Set(applications.map(a => a.venue_name || a.venueName).filter(Boolean))].sort();

    // Stats
    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        approved: applications.filter(a => a.status === 'approved').length,
        rejected: applications.filter(a => a.status === 'rejected').length
    };

    const handleViewDetails = (app) => {
        const users = JSON.parse(localStorage.getItem('spacematch_users') || '[]');
        const emailToFind = app.applicant_email || app.sellerId;
        const user = users.find(u => u.email === emailToFind);
        setSellerDetails(user || {});
        setSelectedApp(app);
    };

    // Helper to safely get date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
    };

    const closeDetail = () => {
        setSelectedApp(null);
        setSellerDetails(null);
    };

    const handleBlockToggle = () => {
        if (!selectedApp) return;
        const isBlocked = sellerDetails.status === 'blocked';
        const actionText = isBlocked ? '차단 해제' : '차단';
        setConfirmModal({
            title: `사용자 ${actionText}`,
            message: `${selectedApp.sellerName}님을 ${actionText}하시겠습니까?`,
            type: isBlocked ? 'success' : 'danger',
            confirmLabel: actionText,
            onConfirm: () => {
                setConfirmModal(null);
                const newStatus = toggleUserBlock(selectedApp.sellerId);
                setSellerDetails({ ...sellerDetails, status: newStatus });
                showToast(`사용자가 ${newStatus === 'blocked' ? '차단' : '차단 해제'}되었습니다.`, newStatus === 'blocked' ? 'error' : 'success');
            }
        });
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-24">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">입점 신청 관리</h1>
                    <p className="text-gray-500 mt-2 font-medium">입점 신청 내역을 검토하고 승인 여부를 결정합니다.</p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => setFilterStatus('all')} className={`p-4 rounded-2xl border transition-all ${filterStatus === 'all' ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white border-gray-100 hover:border-indigo-100'}`}>
                    <p className="text-gray-500 text-xs font-bold uppercase">전체 신청</p>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">{stats.total}</p>
                </button>
                <button onClick={() => setFilterStatus('pending')} className={`p-4 rounded-2xl border transition-all ${filterStatus === 'pending' ? 'bg-yellow-50 border-yellow-200 ring-2 ring-yellow-100' : 'bg-white border-gray-100 hover:border-yellow-100'}`}>
                    <p className="text-yellow-600 text-xs font-bold uppercase">심사 대기</p>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">{stats.pending}</p>
                </button>
                <button onClick={() => setFilterStatus('approved')} className={`p-4 rounded-2xl border transition-all ${filterStatus === 'approved' ? 'bg-green-50 border-green-200 ring-2 ring-green-100' : 'bg-white border-gray-100 hover:border-green-100'}`}>
                    <p className="text-green-600 text-xs font-bold uppercase">승인됨</p>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">{stats.approved}</p>
                </button>
                <button onClick={() => setFilterStatus('rejected')} className={`p-4 rounded-2xl border transition-all ${filterStatus === 'rejected' ? 'bg-red-50 border-red-200 ring-2 ring-red-100' : 'bg-white border-gray-100 hover:border-red-100'}`}>
                    <p className="text-red-500 text-xs font-bold uppercase">거절됨</p>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">{stats.rejected}</p>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="브랜드명, 이메일, 베뉴명 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                    />
                </div>
                {/* Category Filter */}
                <div className="relative">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all appearance-none cursor-pointer"
                    >
                        <option value="all">모든 카테고리</option>
                        <option value="fashion">패션/잡화</option>
                        <option value="beauty">뷰티</option>
                        <option value="food">푸드/음료</option>
                        <option value="living">리빙/라이프스타일</option>
                        <option value="art">아트/디자인</option>
                        <option value="stationery">문구/오피스</option>
                        <option value="digital">디지털/가전</option>
                        <option value="activity">스포츠/액티비티</option>
                        <option value="eco">친환경/제로웨이스트</option>
                        <option value="pet">반려동물</option>
                        <option value="kids">키즈/육아</option>
                        <option value="handmade">핸드메이드/수공예</option>
                        <option value="vintage">빈티지/중고</option>
                        <option value="perfume">향수/디퓨저</option>
                        <option value="book">도서/매거진</option>
                        <option value="other">기타 (직접 입력)</option>
                    </select>
                </div>
                {/* Venue Filter */}
                <div className="relative">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                        value={filterVenue}
                        onChange={(e) => setFilterVenue(e.target.value)}
                        className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all appearance-none cursor-pointer"
                    >
                        <option value="all">모든 베뉴</option>
                        {uniqueVenues.map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">신청 브랜드</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">카테고리</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">신청 베뉴</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">신청일</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">상태</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApps.map(app => (
                                <tr key={app.id} className="hover:bg-gray-50/80 transition-colors cursor-pointer group" onClick={() => handleViewDetails(app)}>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{app.applicant_name || app.sellerName}</div>
                                        <div className="text-xs text-gray-500">{app.applicant_email || app.sellerEmail}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 capitalize">
                                            {app.sellerCategory || '-'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700">{app.venue_name || app.venueName}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {formatDate(app.created_at || app.appliedAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                                            ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {app.status === 'pending' ? '심사 대기' : app.status === 'approved' ? '승인됨' : '거절됨'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        {app.status === 'pending' && (
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        updateApplicationStatus(app.id, 'approved');
                                                    }}
                                                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                    title="승인"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        updateApplicationStatus(app.id, 'rejected');
                                                    }}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                    title="거절"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredApps.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-400">
                                        해당하는 신청 내역이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile List View */}
                <div className="md:hidden">
                    {filteredApps.map(app => (
                        <div key={app.id} className="p-5 border-b border-gray-100 last:border-0 active:bg-gray-50" onClick={() => handleViewDetails(app)}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900">{app.applicant_name || app.sellerName}</h3>
                                    <p className="text-xs text-gray-500">{app.applicant_email || app.sellerEmail}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold
                                ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {app.status === 'pending' ? '대기' : app.status === 'approved' ? '승인' : '거절'}
                                </span>
                            </div>
                            <div className="space-y-1 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">카테고리</span>
                                    <span className="text-gray-900 capitalize">{app.sellerCategory || '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">베뉴</span>
                                    <span className="text-gray-900">{app.venue_name || app.venueName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">신청일</span>
                                    <span className="text-gray-900">{formatDate(app.created_at || app.appliedAt)}</span>
                                </div>
                            </div>
                            {app.status === 'pending' && (
                                <div className="grid grid-cols-2 gap-3 mt-4" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => updateApplicationStatus(app.id, 'approved')}
                                        className="py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-green-200"
                                    >
                                        승인
                                    </button>
                                    <button
                                        onClick={() => updateApplicationStatus(app.id, 'rejected')}
                                        className="py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold"
                                    >
                                        거절
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredApps.length === 0 && (
                        <div className="py-12 text-center text-gray-400">내역이 없습니다.</div>
                    )}
                </div>
            </div>

            {/* Detail Modal (Preserved logic, improved style) */}
            {
                selectedApp && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={closeDetail}>
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-xl font-extrabold text-gray-900">신청 상세 정보</h3>
                                <button onClick={closeDetail} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Brand Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                        {(selectedApp.applicant_name || selectedApp.sellerName || '?')[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{selectedApp.applicant_name || selectedApp.sellerName}</h4>
                                        <p className="text-sm text-gray-500">{selectedApp.applicant_email || selectedApp.sellerEmail}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded uppercase font-bold">
                                            {selectedApp.sellerCategory || '-'}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Info */}
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">신청 베뉴</label>
                                        <p className="font-bold text-gray-900">{selectedApp.venue_name || selectedApp.venueName}</p>
                                    </div>
                                    <div className="text-right">
                                        <label className="text-xs font-bold text-gray-400 uppercase">현재 상태</label>
                                        <p className={`font-bold ${selectedApp.status === 'pending' ? 'text-yellow-600' :
                                            selectedApp.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedApp.status === 'pending' ? '심사 대기 중' : selectedApp.status === 'approved' ? '승인됨' : '거절됨'}
                                        </p>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">소개글</label>
                                        <div className="bg-white border border-gray-200 p-4 rounded-xl text-sm text-gray-600 leading-relaxed min-h-[80px]">
                                            {sellerDetails?.description || '소개글이 없습니다.'}
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">인스타그램</span>
                                            <span className="text-indigo-600 font-medium cursor-pointer hover:underline">{sellerDetails?.instagram || '-'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">연락처</span>
                                            <span className="font-medium text-gray-700">{sellerDetails?.phone || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-gray-200">
                                            <span className="text-gray-500 text-sm">계정 상태</span>
                                            <button
                                                onClick={handleBlockToggle}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${sellerDetails?.status === 'blocked'
                                                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {sellerDetails?.status === 'blocked' ? (
                                                    <><ShieldAlert size={12} /> 차단 해제</>
                                                ) : (
                                                    <><ShieldCheck size={12} /> 사용자 차단</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {selectedApp.status === 'pending' && (
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => {
                                                updateApplicationStatus(selectedApp.id, 'approved');
                                                closeDetail();
                                            }}
                                            className="py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                                        >
                                            승인하기
                                        </button>
                                        <button
                                            onClick={() => {
                                                updateApplicationStatus(selectedApp.id, 'rejected');
                                                closeDetail();
                                            }}
                                            className="py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:text-red-600 transition-colors"
                                        >
                                            거절하기
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            <ConfirmModal modal={confirmModal} onClose={() => setConfirmModal(null)} />
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default AdminApplications;

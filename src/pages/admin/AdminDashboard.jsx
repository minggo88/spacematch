import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import {
    Store, ClipboardList, CheckCircle, AlertCircle, Check, X, MapPin,
    TrendingUp, Users, Activity, Calendar, ArrowRight, Star, Clock,
    AlertTriangle, XCircle
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const AdminDashboard = () => {
    const { venues, applications, fetchVenues } = useData();
    const navigate = useNavigate();

    // Local State
    const [pendingVenues, setPendingVenues] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    // Initial Data Handling
    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch Pending Venues
                const pendingRes = await fetch(`${API_BASE}/venues/get_pending_venues.php`, { credentials: 'include' });
                const pendingData = await pendingRes.json();
                if (Array.isArray(pendingData)) setPendingVenues(pendingData);

                // Fetch Recent Users (Mocking or simple fetch if endpoint exists, using basic get_users for now)
                // Since we don't have a specific "recent users" API optimized for dashboard, 
                // we'll rely on global stats or assume we might add it later. 
                // For now, let's just focus on venue/app stats which are available via context or simple endpoints.
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    // Derived Stats
    const stats = useMemo(() => {
        const totalVenues = venues.length;
        const totalApps = applications.length;
        const pendingApps = applications.filter(a => a.status === 'pending').length;
        const approvedApps = applications.filter(a => a.status === 'approved').length;

        // Mock growth data (since we don't have historical data DB yet)
        const growth = {
            venues: '+12%',
            users: '+5%',
            apps: '+28%'
        };

        return { totalVenues, totalApps, pendingApps, approvedApps, growth };
    }, [venues, applications]);

    // Quick Action Handlers
    const handleVenueAction = (venueId, status) => {
        const isApprove = status === 'approved';
        setConfirmModal({
            title: isApprove ? '공간 승인' : '공간 반려',
            message: isApprove ? '이 공간을 승인하시겠습니까?' : '이 공간을 반려하시겠습니까?',
            type: isApprove ? 'success' : 'danger',
            confirmLabel: isApprove ? '승인' : '반려',
            onConfirm: () => {
                setConfirmModal(null);
                fetch(`${API_BASE}/venues/manage_venue_status.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ id: venueId, status })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            showToast('처리되었습니다.', 'success');
                            const newPendings = pendingVenues.filter(v => v.id !== venueId);
                            setPendingVenues(newPendings);
                            fetchVenues();
                        } else {
                            showToast(data.message, 'error');
                        }
                    });
            }
        });
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-24">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">대시보드</h1>
                    <p className="text-gray-500 mt-2 font-medium">플랫폼의 주요 현황을 한눈에 확인하세요</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-gray-400">{new Date().toLocaleDateString()}</p>
                    <p className="text-indigo-600 font-bold text-sm">시스템 정상 가동</p>
                </div>
            </div>

            {/* 2. KPI Cards (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="총 등록 베뉴"
                    value={stats.totalVenues}
                    unit="건"
                    icon={Store}
                    color="indigo"
                    trend={stats.growth.venues}
                />
                <KPICard
                    title="신규 입점 신청"
                    value={stats.pendingApps}
                    unit="건"
                    icon={ClipboardList}
                    color="orange"
                    trend={stats.growth.apps}
                    alert={stats.pendingApps > 0}
                />
                <KPICard
                    title="총 활성 사용자"
                    value="1,240"
                    unit="건"
                    icon={Users}
                    color="emerald"
                    trend={stats.growth.users}
                    sub="Mock Data"
                />
                <KPICard
                    title="누적 매칭 완료"
                    value={stats.approvedApps}
                    unit="건"
                    icon={CheckCircle}
                    color="blue"
                    trend="+15%"
                />
            </div>

            {/* 3. Main Dashboard Content (2-Column Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Main, 2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Pending Venues Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                                <AlertCircle size={20} className="text-orange-500" />
                                공간 심사 대기 {pendingVenues.length > 0 && (
                                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">{pendingVenues.length}</span>
                                )}
                            </h3>
                            <button
                                onClick={() => navigate('/admin/venues')}
                                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                전체 보기 <ArrowRight size={14} />
                            </button>
                        </div>

                        {pendingVenues.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-green-500" size={32} />
                                </div>
                                <p className="text-gray-900 font-bold">대기중인 심사가 없습니다.</p>
                                <p className="text-gray-500 text-sm mt-1">모든 공간 심사가 완료되었습니다!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {pendingVenues.slice(0, 3).map(venue => (
                                    <div key={venue.id} className="p-5 md:p-6 flex flex-col sm:flex-row gap-5 hover:bg-gray-50 transition-colors">
                                        {/* Image */}
                                        <div className="w-full sm:w-32 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative group">
                                            {venue.images && venue.images[0] ? (
                                                <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                                    <Store size={24} />
                                                </div>
                                            )}
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-lg truncate">{venue.name}</h4>
                                            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1 truncate">
                                                <MapPin size={14} /> {venue.location}
                                            </p>
                                            <div className="flex items-center gap-3 mt-3 text-xs font-medium text-gray-500">
                                                <span>{venue.owner_name}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span>{new Date(venue.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        {/* Actions */}
                                        <div className="flex sm:flex-col gap-2 justify-center">
                                            <button
                                                onClick={() => handleVenueAction(venue.id, 'approved')}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5"
                                            >
                                                승인
                                            </button>
                                            <button
                                                onClick={() => handleVenueAction(venue.id, 'rejected')}
                                                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 hover:text-red-500 transition-colors"
                                            >
                                                반려
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Platform Activity Chart (Visual Only - CSS) */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-extrabold text-gray-900">플랫폼 성장률 (주간)</h3>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">신규 접속</span>
                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">신규 신청</span>
                            </div>
                        </div>

                        {/* CSS Bar Chart Implementation */}
                        <div className="h-48 flex items-end justify-between gap-2 md:gap-4 px-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                                const height1 = [40, 65, 45, 80, 55, 30, 45][i]; // Mock data
                                const height2 = [20, 40, 30, 60, 35, 15, 25][i];
                                return (
                                    <div key={day} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                        <div className="w-full max-w-[40px] flex gap-1 items-end h-full relative">
                                            <div style={{ height: `${height1}%` }} className="w-1/2 bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-600"></div>
                                            <div style={{ height: `${height2}%` }} className="w-1/2 bg-indigo-200 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-300"></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 group-hover:text-indigo-600">{day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar, 1/3 width) */}
                <div className="space-y-8">

                    {/* Recent Applications Activity */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-indigo-600" />
                            최근 신청 이력
                        </h3>
                        <div className="space-y-6">
                            {applications.slice(-5).reverse().map((app, idx) => {
                                // Relative time display
                                const created = app.created_at ? new Date(app.created_at) : null;
                                let timeLabel = '';
                                if (created) {
                                    const diffMs = Date.now() - created.getTime();
                                    const diffMin = Math.floor(diffMs / 60000);
                                    const diffHr = Math.floor(diffMs / 3600000);
                                    const diffDay = Math.floor(diffMs / 86400000);
                                    if (diffMin < 1) timeLabel = '방금';
                                    if (diffMin < 60) timeLabel = `${diffMin}분 전`;
                                    else if (diffHr < 24) timeLabel = `${diffHr}시간 전`;
                                    else if (diffDay < 7) timeLabel = `${diffDay}일 전`;
                                    else timeLabel = created.toLocaleDateString();
                                }
                                return (
                                    <div key={app.id || idx} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-gray-200">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{app.venue_name || app.venueName || '베뉴'}</p>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{timeLabel}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">
                                            <span className="font-semibold text-gray-700">{app.applicant_name || app.sellerName || app.user_name || '신청자'}</span>님이 신청했습니다.
                                        </p>
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {app.status === 'pending' ? '심사중' : app.status === 'approved' ? '승인' : '거절'}
                                        </span>
                                    </div>
                                );
                            })}
                            {applications.length === 0 && (
                                <p className="text-gray-400 text-sm text-center">최근 활동이 없습니다.</p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/admin/applications')}
                            className="w-full mt-6 py-3 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
                        >
                            모든 내역 보기
                        </button>
                    </div>

                    {/* Quick Links / Banner */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-lg p-6 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                            <Store size={120} />
                        </div>
                        <h3 className="text-xl font-bold relative z-10 mb-2">공간 관리</h3>
                        <p className="text-indigo-100 text-sm relative z-10 mb-6 max-w-[200px]">
                            새로운 베뉴 큐레이션을 기획하거나 카테고리를 관리해보세요.</p>
                        <button
                            onClick={() => navigate('/admin/venues')}
                            className="relative z-10 bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            바로가기</button>
                    </div>

                </div>
            </div>

            <ConfirmModal modal={confirmModal} onClose={() => setConfirmModal(null)} />
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

// Reusable KPI Card Component
const KPICard = ({ title, value, unit, icon: Icon, color, trend, alert, sub }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        orange: 'bg-orange-50 text-orange-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
    };

    return (
        <div className={`bg-white p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md ${alert ? 'border-orange-200 ring-2 ring-orange-50' : 'border-gray-100'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <TrendingUp size={12} /> {trend}
                    </div>
                )}
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
                <h2 className="text-3xl font-extrabold text-gray-900">{value}</h2>
                <span className="text-gray-400 font-bold text-sm">{unit}</span>
            </div>
            {sub && <p className="text-xs text-gray-300 mt-2 font-mono">{sub}</p>}
        </div>
    );
};

export default AdminDashboard;

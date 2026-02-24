import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, Shield, Store, ClipboardList, CheckCircle, XCircle, Clock, Ban, ShieldAlert, Award } from 'lucide-react';

const API_BASE = '/api';

const AdminUserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchUserDetail = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/get_user_detail.php?id=${id}`);
            const data = await res.json();
            if (data.success) {
                setUserData(data);
            } else {
                setError(data.message || '\uc0ac\uc6a9\uc790 \uc815\ubcf4\ub97c \ubd88\ub7ec\uc62c \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.');
            }
        } catch (err) {
            console.error(err);
            setError('\ub124\ud2b8\uc6cc\ud06c \uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (error) return <div className="p-8 text-center text-red-500 font-bold">{error} <br /><button onClick={() => navigate(-1)} className="mt-4 text-sm text-gray-500 hover:underline">{'\ub4a4\ub85c \uac00\uae30'}</button></div>;
    if (!userData) return null;

    const { user, venues, applications, stats } = userData;

    return (
        <div className="pb-20 max-w-6xl mx-auto space-y-8 animate-fadeIn">
            {/* Header / Profile Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50 to-transparent opacity-50"></div>

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 transition-colors relative z-10">
                    <ArrowLeft size={18} /> {'\ubaa9\ub85d\uc73c\ub85c \ub3cc\uc544\uac00\uae30'}
                </button>

                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border-4 border-white shadow-lg">
                        <User size={40} />
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.role === 'host' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                user.role === 'seller' ? 'bg-green-50 text-green-700 border-green-100' :
                                    user.role === 'superadmin' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                        'bg-purple-50 text-purple-700 border-purple-100'
                                }`}>
                                {user.role === 'superadmin' ? '\uc288\ud37c\uad00\ub9ac\uc790' : user.role === 'admin' ? '\uad00\ub9ac\uc790' : user.role === 'host' ? '\ubca4\ub354' : '\uc140\ub7ec'}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${user.status === 'blocked' ? 'bg-red-500' : 'bg-emerald-500'
                                }`}>
                                {user.status === 'blocked' ? '\ucc28\ub2e8\ub428' : '\uc815\uc0c1 \ud65c\ub3d9 \uc911'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-400" />
                                {user.phone || '\uc804\ud654\ubc88\ud638 \ubbf8\ub4f1\ub85d'}
                            </div>
                            {user.business_no && (
                                <div className="flex items-center gap-2">
                                    <Shield size={16} className="text-gray-400" />
                                    {'\uc0ac\uc5c5\uc790#'} {user.business_no}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                {'\uac00\uc785\uc77c:'} {new Date(user.created_at).toLocaleDateString()}
                            </div>
                            {user.role === 'host' && (
                                <div className="flex items-center gap-2">
                                    <Award size={16} className="text-gray-400" />
                                    {'\ubca0\ub274 \ub4f1\ub85d \ud55c\ub3c4:'} {user.venue_limit}{'\uac1c'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.role === 'host' ? (
                    <>
                        <StatCard icon={Store} label={'\ucd1d \ub4f1\ub85d \ubca0\ub274'} value={stats.total_venues} color="text-blue-600" bg="bg-blue-50" />
                        <StatCard icon={CheckCircle} label={'\uc2b9\uc778\ub41c \ubca0\ub274'} value={stats.approved_venues} color="text-green-600" bg="bg-green-50" />
                        <StatCard icon={Clock} label={'\uc2b9\uc778 \ub300\uae30\uc911'} value={stats.pending_venues} color="text-yellow-600" bg="bg-yellow-50" />
                    </>
                ) : user.role === 'seller' ? (
                    <>
                        <StatCard icon={ClipboardList} label={'\ucd1d \uc785\uc810 \uc2e0\uccad'} value={stats.total_applications} color="text-indigo-600" bg="bg-indigo-50" />
                        <StatCard icon={CheckCircle} label={'\uc2b9\uc778\ub41c \uc2e0\uccad'} value={stats.approved_applications} color="text-green-600" bg="bg-green-50" />
                        <StatCard icon={Clock} label={'\ub300\uae30\uc911\uc778 \uc2e0\uccad'} value={stats.pending_applications} color="text-yellow-600" bg="bg-yellow-50" />
                    </>
                ) : (
                    <div className="col-span-3 bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500">
                        {user.role === 'superadmin' ? '\uc288\ud37c\uad00\ub9ac\uc790' : '\uad00\ub9ac\uc790'} {'\uacc4\uc815\uc785\ub2c8\ub2e4'}
                    </div>
                )}
            </div>

            {/* Activity List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">
                        {user.role === 'host' ? '\ub4f1\ub85d\ub41c \ubca0\ub274 \ubaa9\ub85d' : user.role === 'seller' ? '\uc785\uc810 \uc2e0\uccad \ub0b4\uc5ed' : '\ud65c\ub3d9 \ub0b4\uc5ed'}
                    </h3>
                </div>

                <div className="p-6">
                    {user.role === 'host' && venues.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {venues.map(venue => (
                                <div key={venue.id} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                                    <div className="h-40 bg-gray-100 relative">
                                        {venue.images && venue.images[0] ? (
                                            <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-300"><Store size={32} /></div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <StatusBadge status={venue.status} />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-900 truncate">{venue.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1 truncate">{venue.location}</p>
                                        <div className="mt-3 flex justify-between items-center">
                                            <span className="text-sm font-bold text-indigo-600">{'\u20a9'}{parseInt(venue.price).toLocaleString()}</span>
                                            <span className="text-xs text-gray-400">{venue.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : user.role === 'seller' && applications.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="p-3">{'\uc2e0\uccad\uc77c'}</th>
                                        <th className="p-3">{'\ub300\uc0c1 \ubca0\ub274'}</th>
                                        <th className="p-3">{'\uc704\uce58'}</th>
                                        <th className="p-3">{'\uba54\uc2dc\uc9c0'}</th>
                                        <th className="p-3">{'\uc0c1\ud0dc'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {applications.map(app => (
                                        <tr key={app.id}>
                                            <td className="p-3 text-gray-600">{new Date(app.created_at).toLocaleDateString()}</td>
                                            <td className="p-3 font-bold text-gray-900">{app.venue_name}</td>
                                            <td className="p-3 text-gray-600">{app.venue_location}</td>
                                            <td className="p-3 text-gray-600 max-w-xs truncate" title={app.message}>{app.message}</td>
                                            <td className="p-3"><StatusBadge status={app.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            {'\ub370\uc774\ud130\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${bg} ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    let styles = "bg-gray-100 text-gray-600";
    let text = status;

    if (status === 'approved') {
        styles = "bg-green-100 text-green-700";
        text = "\uc2b9\uc778\ub428";
    } else if (status === 'pending') {
        styles = "bg-yellow-100 text-yellow-700";
        text = "\ub300\uae30\uc911";
    } else if (status === 'rejected') {
        styles = "bg-red-100 text-red-700";
        text = "\uac70\uc808\ub428";
    } else if (status === 'blocked') {
        styles = "bg-red-500 text-white";
        text = "\ucc28\ub2e8\ub428";
    }

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${styles}`}>
            {text}
        </span>
    );
};

export default AdminUserDetail;

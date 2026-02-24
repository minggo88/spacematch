import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Trash2, RotateCcw, XCircle, Search, ChevronDown,
    AlertTriangle, CheckCircle, RefreshCw, Package
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const TABLE_LABEL_KEYS = {
    ads: 'ads',
    venues: 'venues',
    community_posts: 'communityPosts',
    seller_photos: 'sellerPhotos',
    applications: 'applications',
    users: 'users',
    popups: 'popups',
};

const AdminTrash = () => {
    const { t } = useTranslation('admin');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tables, setTables] = useState([]);
    const [filterTable, setFilterTable] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);

    const perPage = 20;
    const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

    const fetchTrash = useCallback(async () => {
        try {
            const params = new URLSearchParams({ page });
            if (filterTable) params.append('table_name', filterTable);
            if (searchTerm) params.append('search', searchTerm);
            const res = await fetch(`/api/trash/list_trash.php?${params}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setItems(data.items || []);
                setTotal(data.total || 0);
                setTables(data.tables || []);
            }
        } catch { showToast(t('trashPage.loadFailed'), 'error'); }
        finally { setLoading(false); }
    }, [filterTable, searchTerm, page, showToast]);

    useEffect(() => { fetchTrash(); }, [fetchTrash]);

    const handleRestore = async (id) => {
        try {
            const res = await fetch('/api/trash/restore.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            showToast(data.message, data.success ? 'success' : 'error');
            if (data.success) fetchTrash();
        } catch { showToast(t('trashPage.restoreFailed'), 'error'); }
    };

    const handlePermanentDelete = async (id) => {
        setConfirmModal({
            title: t('trashPage.confirmDelete'),
            message: t('trashPage.confirmDeleteMsg', { title: '' }),
            onConfirm: async () => {
                try {
                    const res = await fetch('/api/trash/permanent_delete.php', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                        body: JSON.stringify({ id })
                    });
                    const data = await res.json();
                    showToast(data.message, data.success ? 'success' : 'error');
                    if (data.success) fetchTrash();
                } catch { showToast(t('trashPage.deleteFailed'), 'error'); }
                setConfirmModal(null);
            }
        });
    };

    const handleBatchRestore = async () => {
        for (const id of selectedIds) { await handleRestore(id); }
        setSelectedIds(new Set());
    };

    const handleBatchPermanentDelete = () => {
        setConfirmModal({
            title: t('trashPage.batchDelete'),
            message: t('trashPage.batchDeleteMsg', { count: selectedIds.size }),
            onConfirm: async () => {
                try {
                    const res = await fetch('/api/trash/permanent_delete.php', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                        body: JSON.stringify({ ids: [...selectedIds] })
                    });
                    const data = await res.json();
                    showToast(data.message, data.success ? 'success' : 'error');
                    if (data.success) { setSelectedIds(new Set()); fetchTrash(); }
                } catch { showToast(t('trashPage.deleteFailed'), 'error'); }
                setConfirmModal(null);
            }
        });
    };

    const toggleSelect = (id) => {
        const next = new Set(selectedIds);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedIds(next);
    };
    const toggleAll = () => {
        if (items.every(i => selectedIds.has(i.id))) setSelectedIds(new Set());
        else setSelectedIds(new Set(items.map(i => i.id)));
    };

    const totalPages = Math.ceil(total / perPage);
    const allSelected = items.length > 0 && items.every(i => selectedIds.has(i.id));

    const formatDate = (d) => {
        if (!d) return '';
        const date = new Date(d);
        const now = new Date();
        const diff = now - date;
        if (diff < 60000) return t('trashPage.justNow');
        if (diff < 3600000) return t('trashPage.minutesAgo', { count: Math.floor(diff / 60000) });
        if (diff < 86400000) return t('trashPage.hoursAgo', { count: Math.floor(diff / 3600000) });
        if (diff < 604800000) return t('trashPage.daysAgo', { count: Math.floor(diff / 86400000) });
        return date.toLocaleDateString();
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center">
                        <Trash2 className="text-white" size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">{t('trashPage.title')}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('trashPage.subtitle')}</p>
                    </div>
                </div>
                <button onClick={fetchTrash} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <RefreshCw size={16} /> {t('trashPage.refresh')}
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-3 mb-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }} placeholder={t('trashPage.searchPlaceholder')} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-medium text-sm dark:text-white" />
                    </div>
                    <div className="relative">
                        <select value={filterTable} onChange={e => { setFilterTable(e.target.value); setPage(1); }} className="w-full md:w-48 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm dark:text-white">
                            <option value="">{t('trashPage.allTables')}</option>
                            {tables.map(tbl => (<option key={tbl} value={tbl}>{t(`trashPage.table_${TABLE_LABEL_KEYS[tbl]}`, tbl)}</option>))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
                <p className="text-xs text-gray-400">{t('trashPage.totalItems', { count: total })}</p>
            </div>

            {/* Batch action toolbar */}
            {selectedIds.size > 0 && (
                <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{t('trashPage.selectedCount', { count: selectedIds.size })}</span>
                    <div className="h-5 w-px bg-indigo-200 dark:bg-indigo-500/30" />
                    <button onClick={handleBatchRestore} className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1">
                        <RotateCcw size={13} /> {t('trashPage.batchRestore')}
                    </button>
                    <button onClick={handleBatchPermanentDelete} className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-1">
                        <XCircle size={13} /> {t('trashPage.batchDeleteBtn')}
                    </button>
                    <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium">{t('trashPage.deselectAll')}</button>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" /></div>
            ) : items.length === 0 ? (
                <div className="text-center py-20">
                    <Trash2 className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">{t('trashPage.noItems')}</h3>
                    <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">{t('trashPage.noItemsDesc')}</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">
                                    <th className="w-10 px-4 py-3"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" /></th>
                                    <th className="text-left px-3 py-3">{t('trashPage.title_col')}</th>
                                    <th className="text-left px-3 py-3">{t('trashPage.sourceTable')}</th>
                                    <th className="text-left px-3 py-3">{t('trashPage.deletedBy')}</th>
                                    <th className="text-left px-3 py-3">{t('trashPage.deletedAt')}</th>
                                    <th className="text-center px-3 py-3 w-28">{t('trashPage.action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/30">
                                {items.map(item => {
                                    const isSelected = selectedIds.has(item.id);
                                    return (
                                        <tr key={item.id} className={`transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/20 ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-500/5' : ''}`}>
                                            <td className="px-4 py-3 text-center">
                                                <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(item.id)} className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Package size={14} className="text-gray-400 flex-shrink-0" />
                                                    <span className="font-bold text-gray-900 dark:text-white truncate max-w-[250px]">{item.item_label || `#${item.record_id}`}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-[11px] font-bold">
                                                    {t(`trashPage.table_${TABLE_LABEL_KEYS[item.table_name]}`, item.table_name)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400">{item.deleted_by_name || '-'}</td>
                                            <td className="px-3 py-3 text-xs text-gray-400" title={item.deleted_at}>{formatDate(item.deleted_at)}</td>
                                            <td className="px-3 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button onClick={() => handleRestore(item.id)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 transition-colors" title={t('trashPage.restore')}>
                                                        <RotateCcw size={13} />
                                                    </button>
                                                    <button onClick={() => handlePermanentDelete(item.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors" title={t('trashPage.permanentDelete')}>
                                                        <XCircle size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/20 border-t border-gray-100 dark:border-gray-700/30 flex items-center justify-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${page === p ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>{p}</button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            {confirmModal && <ConfirmModal modal={{ ...confirmModal, type: 'danger', confirmLabel: confirmModal.title }} onClose={() => setConfirmModal(null)} />}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default AdminTrash;

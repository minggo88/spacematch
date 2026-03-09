import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Database, Table2, BarChart3, HardDrive, Rows3, Search, ChevronLeft, ChevronRight,
    Pencil, Trash2, Check, X, RefreshCw, Server, Shield, Key, Hash, Type, CheckSquare,
    Calendar, Link2, ArrowUpDown, ArrowUp, ArrowDown, Eye, Code, Columns3,
    Info, Filter, Layers, ChevronDown, CheckCircle, XCircle,
    Wrench, Users, Cpu, FileX, FileText, AlertTriangle,
    Plus, Download, Zap
} from 'lucide-react';
import Toast from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = '/api';

// ??' Type color badges '???????????????????????????????????????????????????????????????????
const typeColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('int')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (t.includes('varchar')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (t.includes('text')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (t.includes('date') || t.includes('time')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (t.includes('decimal') || t.includes('float') || t.includes('double')) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (t.includes('enum')) return 'bg-pink-100 text-pink-700 border-pink-200';
    if (t.includes('json')) return 'bg-cyan-100 text-cyan-700 border-cyan-200';
    if (t.includes('blob')) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
};

const formatSize = (kb) => {
    if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${kb.toFixed(1)} KB`;
};

const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const SuperAdminDatabase = () => {
    const { t } = useTranslation('admin');
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [dbEnv, setDbEnv] = useState('production');
    const [overview, setOverview] = useState(null);
    const [loadingOverview, setLoadingOverview] = useState(true);

    // Table browser
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [loadingTable, setLoadingTable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCol, setSortCol] = useState('');
    const [sortDir, setSortDir] = useState('ASC');

    // Structure view
    const [structureData, setStructureData] = useState(null);
    const [loadingStructure, setLoadingStructure] = useState(false);

    // Edit / Delete
    const [editingCell, setEditingCell] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Batch selection
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [batchDeleting, setBatchDeleting] = useState(false);
    const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);

    // Detail panel for a specific table in dashboard
    const [detailTable, setDetailTable] = useState(null);

    // Row detail (expand)
    const [expandedRow, setExpandedRow] = useState(null);

    // Cache maintenance
    const [cacheInfo, setCacheInfo] = useState(null);
    const [loadingCache, setLoadingCache] = useState(false);
    const [clearingCache, setClearingCache] = useState({});
    const [clearConfirm, setClearConfirm] = useState(null);

    // Insert row
    const [showInsertModal, setShowInsertModal] = useState(false);
    const [insertData, setInsertData] = useState({});
    const [inserting, setInserting] = useState(false);

    // Export
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Optimize
    const [optimizeResults, setOptimizeResults] = useState(null);
    const [optimizing, setOptimizing] = useState(false);
    const [optimizeConfirm, setOptimizeConfirm] = useState(null);

    // Toast notification
    const [toast, setToast] = useState(null);
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    // Access check
    useEffect(() => {
        if (user && user.role !== 'superadmin') navigate('/admin');
    }, [user, navigate]);

    // Fetch overview
    const fetchOverview = useCallback(async () => {
        setLoadingOverview(true);
        try {
            const res = await fetch(`${API_BASE}/database/database_info.php?action=overview&db=${dbEnv}`, { credentials: 'include' });
            const data = await res.json();
            if (!data.error) setOverview(data);
        } catch (e) { console.error(e); }
        setLoadingOverview(false);
    }, [dbEnv]);

    useEffect(() => { fetchOverview(); }, [fetchOverview]);

    // Fetch cache info
    const fetchCacheInfo = useCallback(async () => {
        setLoadingCache(true);
        try {
            const res = await fetch(`${API_BASE}/database/clear_cache.php?action=scan`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setCacheInfo(data);
        } catch (e) { console.error(e); }
        setLoadingCache(false);
    }, []);

    // Clear specific cache type
    const clearCache = useCallback(async (type) => {
        setClearingCache(prev => ({ ...prev, [type]: true }));
        try {
            const res = await fetch(`${API_BASE}/database/clear_cache.php?action=clear`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ type })
            });
            const data = await res.json();
            if (data.success) {
                showToast(type === 'all' ? t('superAdminDbPage.allCacheCleared', '전체 캐시 정리 완료') : t('superAdminDbPage.cacheCleared', '캐시 정리 완료'));
                fetchCacheInfo();
            } else {
                showToast(data.error || t('superAdminDbPage.cacheClearFailed', '캐시 정리 실패'), 'error');
            }
        } catch (e) { console.error(e); showToast(t('superAdminDbPage.cacheClearError', '캐시 정리 중 오류'), 'error'); }
        setClearingCache(prev => ({ ...prev, [type]: false }));
        setClearConfirm(null);
    }, [showToast, fetchCacheInfo, t]);

    // Fetch table data
    const fetchTableData = useCallback(async (table, page = 1, search = '', sort = '', dir = 'ASC') => {
        setLoadingTable(true);
        try {
            const params = new URLSearchParams({ action: 'table_data', db: dbEnv, table, page, limit: 50, search, sort, dir });
            const res = await fetch(`${API_BASE}/database/database_info.php?${params}`, { credentials: 'include' });
            const data = await res.json();
            if (!data.error) setTableData(data);
        } catch (e) { console.error(e); }
        setLoadingTable(false);
    }, [dbEnv]);

    // Fetch structure
    const fetchStructure = useCallback(async (table) => {
        setLoadingStructure(true);
        try {
            const res = await fetch(`${API_BASE}/database/database_info.php?action=table_structure&db=${dbEnv}&table=${table}`, { credentials: 'include' });
            const data = await res.json();
            if (!data.error) setStructureData(data);
        } catch (e) { console.error(e); }
        setLoadingStructure(false);
    }, [dbEnv]);

    const openTable = (tableName, tab = 'tables') => {
        setSelectedTable(tableName);
        setCurrentPage(1);
        setSearchTerm('');
        setSortCol('');
        setSortDir('ASC');
        setActiveTab(tab);
        setSelectedRows(new Set());
        setBatchDeleteConfirm(false);
        if (tab === 'tables') fetchTableData(tableName, 1, '', '', 'ASC');
        if (tab === 'structure') fetchStructure(tableName);
    };

    const handleSort = (colName) => {
        let newDir = 'ASC';
        if (sortCol === colName && sortDir === 'ASC') newDir = 'DESC';
        setSortCol(colName);
        setSortDir(newDir);
        setCurrentPage(1);
        fetchTableData(selectedTable, 1, searchTerm, colName, newDir);
    };

    const handlePageChange = (p) => { setCurrentPage(p); setSelectedRows(new Set()); setBatchDeleteConfirm(false); fetchTableData(selectedTable, p, searchTerm, sortCol, sortDir); };
    const handleSearch = () => { setCurrentPage(1); setSelectedRows(new Set()); setBatchDeleteConfirm(false); fetchTableData(selectedTable, 1, searchTerm, sortCol, sortDir); };

    // Edit
    const isDevMode = dbEnv === 'development';
    const startEdit = (rowIdx, field, val) => {
        if (isDevMode) { showToast(t('superAdminDbPage.devEditError'), 'error'); return; }
        setEditingCell({ row: rowIdx, field }); setEditValue(val || '');
    };
    const cancelEdit = () => { setEditingCell(null); setEditValue(''); };
    const saveEdit = async () => {
        if (!tableData || !editingCell) return;
        setSaving(true);
        try {
            const row = tableData.rows[editingCell.row];
            const res = await fetch(`${API_BASE}/database/database_info.php?action=update_row&db=${dbEnv}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ table: selectedTable, primary_key: tableData.primary_key, primary_value: row[tableData.primary_key], field: editingCell.field, value: editValue })
            });
            const data = await res.json();
            if (data.success) {
                const newRows = [...tableData.rows];
                newRows[editingCell.row] = { ...newRows[editingCell.row], [editingCell.field]: editValue };
                setTableData({ ...tableData, rows: newRows });
                cancelEdit();
            }
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    // Delete
    const handleDelete = async (pv) => {
        if (isDevMode) { showToast(t('superAdminDbPage.devDeleteError'), 'error'); return; }
        try {
            const res = await fetch(`${API_BASE}/database/database_info.php?action=delete_row&db=${dbEnv}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ table: selectedTable, primary_key: tableData.primary_key, primary_value: pv })
            });
            const data = await res.json();
            if (data.success) { setDeleteConfirm(null); fetchTableData(selectedTable, currentPage, searchTerm, sortCol, sortDir); fetchOverview(); }
        } catch (e) { console.error(e); }
    };

    // Batch Delete
    const toggleRowSelect = (pkValue) => {
        setSelectedRows(prev => {
            const next = new Set(prev);
            if (next.has(pkValue)) next.delete(pkValue);
            else next.add(pkValue);
            return next;
        });
    };
    const toggleSelectAll = () => {
        if (!tableData?.rows || !tableData.primary_key) return;
        const allPKs = tableData.rows.map(r => r[tableData.primary_key]);
        const allSelected = allPKs.every(pk => selectedRows.has(pk));
        if (allSelected) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(allPKs));
        }
    };
    const handleBatchDelete = async () => {
        if (isDevMode) { showToast(t('superAdminDbPage.devDeleteError'), 'error'); return; }
        if (selectedRows.size === 0) return;
        setBatchDeleting(true);
        try {
            const res = await fetch(`${API_BASE}/database/database_info.php?action=batch_delete&db=${dbEnv}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ table: selectedTable, primary_key: tableData.primary_key, primary_values: Array.from(selectedRows) })
            });
            const data = await res.json();
            if (data.success) {
                showToast(t('superAdminDbPage.batchDeleteSuccess', { count: data.affected_rows }));
                setSelectedRows(new Set());
                setBatchDeleteConfirm(false);
                fetchTableData(selectedTable, currentPage, searchTerm, sortCol, sortDir);
                fetchOverview();
            } else {
                showToast(data.error || t('superAdminDbPage.deleteFailed'), 'error');
            }
        } catch (e) { console.error(e); showToast(t('superAdminDbPage.deleteError'), 'error'); }
        setBatchDeleting(false);
    };

    // Insert new row
    const openInsertModal = () => {
        if (!tableData?.columns) return;
        const defaults = {};
        tableData.columns.forEach(col => {
            if (col.Extra?.includes('auto_increment')) return;
            defaults[col.Field] = col.Default !== null ? String(col.Default) : '';
        });
        setInsertData(defaults);
        setShowInsertModal(true);
    };
    const handleInsert = async () => {
        if (!selectedTable || isDevMode) return;
        setInserting(true);
        try {
            const filteredData = {};
            for (const [k, v] of Object.entries(insertData)) {
                if (v !== '' && v !== undefined) filteredData[k] = v;
            }
            const res = await fetch(`${API_BASE}/database/database_info.php?action=insert_row&db=${dbEnv}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ table: selectedTable, data: filteredData })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message || t('superAdminDbPage.insertSuccess', '행이 추가되었습니다.'));
                setShowInsertModal(false);
                fetchTableData(selectedTable, currentPage, searchTerm, sortCol, sortDir);
                fetchOverview();
            } else {
                showToast(data.error || t('superAdminDbPage.insertFailed', '추가 실패'), 'error');
            }
        } catch (e) { console.error(e); showToast(t('superAdminDbPage.insertError', '추가 중 오류'), 'error'); }
        setInserting(false);
    };

    // Export table data
    const handleExport = (format) => {
        if (!selectedTable) return;
        const params = new URLSearchParams({ action: 'export_table', db: dbEnv, table: selectedTable, format, search: searchTerm });
        window.open(`${API_BASE}/database/database_info.php?${params}`, '_blank');
        setShowExportMenu(false);
    };

    // Optimize table
    const handleOptimize = async (tableName = null) => {
        setOptimizing(true);
        try {
            const body = tableName ? { table: tableName } : { all: true };
            const res = await fetch(`${API_BASE}/database/database_info.php?action=optimize_table&db=${dbEnv}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message || t('superAdminDbPage.optimizeSuccess', '최적화 완료'));
                setOptimizeResults(data);
                fetchOverview();
            } else {
                showToast(data.error || t('superAdminDbPage.optimizeFailed', '최적화 실패'), 'error');
            }
        } catch (e) { console.error(e); showToast(t('superAdminDbPage.optimizeError', '최적화 중 오류'), 'error'); }
        setOptimizing(false);
        setOptimizeConfirm(null);
    };

    // Dashboard - table categories
    const tableCategories = useMemo(() => {
        if (!overview?.tables) return [];
        const cats = {
            [t('superAdminDbPage.catUsers')]: { icon: '\ud83d\udc64', tables: [], keywords: ['user', 'session', 'profile', 'banned', 'seller_photo'] },
            [t('superAdminDbPage.catVenues')]: { icon: '\ud83c\udfe2', tables: [], keywords: ['venue', 'space', 'room'] },
            [t('superAdminDbPage.catApplications')]: { icon: '\ud83d\udcdd', tables: [], keywords: ['application', 'apply', 'cancellation'] },
            [t('superAdminDbPage.catCommunity')]: { icon: '\ud83d\udcac', tables: [], keywords: ['community'] },
            [t('superAdminDbPage.catNotifications')]: { icon: '\ud83d\udd14', tables: [], keywords: ['notification', 'alert', 'push_sub'] },
            [t('superAdminDbPage.catPromotions')]: { icon: '\ud83c\udf1f', tables: [], keywords: ['promotion', 'recruit', 'campaign'] },
            [t('superAdminDbPage.catPayments', '결제/정산')]: { icon: '\ud83d\udcb3', tables: [], keywords: ['payment', 'settlement'] },
            [t('superAdminDbPage.catChat', '채팅')]: { icon: '\ud83d\udcac', tables: [], keywords: ['chat_', 'conversation'] },
            [t('superAdminDbPage.catAds', '광고')]: { icon: '\ud83d\udce2', tables: [], keywords: ['ads', 'adsense', 'ad_daily', 'ad_share'] },
            [t('superAdminDbPage.catDistribution', '유통/배송')]: { icon: '\ud83d\ude9a', tables: [], keywords: ['proposal', 'shipment', 'distribution'] },
            [t('superAdminDbPage.catStats', '매출통계')]: { icon: '\ud83d\udcca', tables: [], keywords: ['seller_stat'] },
            [t('superAdminDbPage.catOther')]: { icon: '\ud83d\udce6', tables: [], keywords: [] }
        };
        overview.tables.forEach(tbl => {
            const name = tbl.name.toLowerCase();
            let placed = false;
            for (const [catName, cat] of Object.entries(cats)) {
                if (catName !== t('superAdminDbPage.catOther') && cat.keywords.some(kw => name.includes(kw))) {
                    cat.tables.push(tbl);
                    placed = true;
                    break;
                }
            }
            if (!placed) cats[t('superAdminDbPage.catOther')].tables.push(tbl);
        });
        return Object.entries(cats).filter(([, c]) => c.tables.length > 0);
    }, [overview]);

    const maxRows = overview ? Math.max(...overview.tables.map(t => t.row_count), 1) : 1;

    if (!user || user.role !== 'superadmin') {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                    <Shield size={48} className="mx-auto mb-4 text-red-400" />
                    <p className="font-bold text-lg">{t('superAdminDbPage.noAccess')}</p>
                    <p className="text-sm mt-1">{t('superAdminDbPage.superAdminOnly')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                        <Database className="text-indigo-600" size={28} />
                        {t('superAdminDbPage.title')}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {t('superAdminDbPage.subtitle')}
                        {overview && <span className="ml-2 text-xs text-gray-400">&middot; MySQL {overview.version} &middot; {overview.charset}</span>}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        <button onClick={() => setDbEnv('development')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${dbEnv === 'development' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
                            <Eye size={13} /> Dev <span className="text-[10px] opacity-75">{t('superAdminDbPage.readOnly')}</span>
                        </button>
                        <button onClick={() => setDbEnv('production')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${dbEnv === 'production' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
                            <Server size={13} /> Prod <span className="text-[10px] opacity-75">{t('superAdminDbPage.editable')}</span>
                        </button>
                    </div>
                    <button onClick={fetchOverview} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors" title={t('superAdminDbPage.refresh')}>
                        <RefreshCw size={16} className={`text-gray-600 ${loadingOverview ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {[
                    { key: 'dashboard', icon: BarChart3, label: t('superAdminDbPage.tabDashboard'), shortLabel: t('superAdminDbPage.tabDashboardShort') },
                    { key: 'tables', icon: Table2, label: t('superAdminDbPage.tabTables'), shortLabel: t('superAdminDbPage.tabTablesShort') },
                    { key: 'structure', icon: Columns3, label: t('superAdminDbPage.tabStructure'), shortLabel: t('superAdminDbPage.tabStructureShort') },
                    { key: 'maintenance', icon: Wrench, label: t('superAdminDbPage.tabMaintenance', '유지관리'), shortLabel: '🧹' },
                ].map(tab => (
                    <button key={tab.key} onClick={() => { setActiveTab(tab.key); if (tab.key === 'maintenance' && !cacheInfo) fetchCacheInfo(); }}
                        className={`flex-1 px-2 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 ${activeTab === tab.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <tab.icon size={16} />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.shortLabel}</span>
                    </button>
                ))}
            </div>

            {/* Environment Banner */}
            {dbEnv === 'development' ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <Eye size={18} className="text-amber-600 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-amber-800">{t('superAdminDbPage.devModeTitle')}</p>
                        <p className="text-xs text-amber-600">{t('superAdminDbPage.devModeDesc')}</p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                    <Shield size={18} className="text-red-600 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-red-800">{t('superAdminDbPage.prodModeTitle')}</p>
                        <p className="text-xs text-red-600">{t('superAdminDbPage.prodModeDesc')}</p>
                    </div>
                </div>
            )}

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
                <div className="space-y-6">
                    {loadingOverview ? (
                        <div className="flex items-center justify-center py-20"><RefreshCw size={32} className="animate-spin text-indigo-400" /></div>
                    ) : overview ? (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {[
                                    { label: t('superAdminDbPage.database'), value: overview.database, icon: Database, color: 'indigo', small: true },
                                    { label: t('superAdminDbPage.tableCount'), value: overview.table_count, icon: Table2, color: 'violet' },
                                    { label: t('superAdminDbPage.totalRows'), value: overview.total_rows.toLocaleString(), icon: Rows3, color: 'emerald' },
                                    { label: t('superAdminDbPage.totalColumns'), value: overview.total_columns, icon: Columns3, color: 'blue' },
                                    { label: t('superAdminDbPage.dataSize'), value: formatSize(overview.total_data_kb), icon: HardDrive, color: 'amber' },
                                    { label: t('superAdminDbPage.indexSize'), value: formatSize(overview.total_index_kb), icon: Key, color: 'pink' },
                                ].map((card, i) => (
                                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className={`w-9 h-9 bg-${card.color}-100 rounded-xl flex items-center justify-center mb-2`}>
                                            <card.icon size={18} className={`text-${card.color}-600`} />
                                        </div>
                                        <p className={`${card.small ? 'text-sm' : 'text-xl'} font-extrabold text-gray-900 truncate`}>{card.value}</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">{card.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Size Distribution */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                                    <HardDrive size={18} className="text-indigo-500" />
                                    {t('superAdminDbPage.tableSizeDist')}
                                </h3>
                                <div className="flex gap-1 h-8 rounded-xl overflow-hidden bg-gray-100">
                                    {overview.tables
                                        .filter(t => t.size_kb > 0)
                                        .sort((a, b) => b.size_kb - a.size_kb)
                                        .map((t, i) => {
                                            const pct = (t.size_kb / overview.total_size_kb) * 100;
                                            const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-cyan-500', 'bg-red-400', 'bg-blue-400', 'bg-orange-400', 'bg-teal-400'];
                                            return pct >= 1 ? (
                                                <div key={t.name} className={`${colors[i % colors.length]} relative group cursor-pointer transition-opacity hover:opacity-80`}
                                                    style={{ width: `${pct}%` }} title={`${t.name}: ${formatSize(t.size_kb)} (${pct.toFixed(1)}%)`}>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                                        <span className="font-bold">{t.name}</span>
                                                        <br />{formatSize(t.size_kb)} ({pct.toFixed(1)}%)
                                                    </div>
                                                </div>
                                            ) : null;
                                        })
                                    }
                                </div>
                                <div className="flex flex-wrap gap-3 mt-3">
                                    {overview.tables.filter(t => t.size_kb > 0).sort((a, b) => b.size_kb - a.size_kb).slice(0, 8).map((t, i) => {
                                        const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-cyan-500', 'bg-red-400', 'bg-blue-400'];
                                        return (
                                            <div key={t.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <div className={`w-2.5 h-2.5 rounded-sm ${colors[i % colors.length]}`} />
                                                <span className="font-medium">{t.name}</span>
                                                <span className="text-gray-400">{formatSize(t.size_kb)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Categorized Tables */}
                            <div className="space-y-4">
                                {tableCategories.map(([catName, cat]) => (
                                    <div key={catName} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                                            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                                <span className="text-base">{cat.icon}</span>
                                                {catName}
                                                <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.tables.length}</span>
                                            </h3>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {cat.tables.sort((a, b) => b.row_count - a.row_count).map(table => (
                                                <div key={table.name} className="px-4 sm:px-5 py-3 hover:bg-indigo-50/30 cursor-pointer transition-colors group"
                                                    onClick={() => setDetailTable(detailTable === table.name ? null : table.name)}>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">{table.name}</p>
                                                                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded font-medium hidden sm:inline">{table.engine}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-[11px] text-gray-400 flex-wrap">
                                                                <span>{table.column_count} {t('superAdminDbPage.columns')}</span>
                                                                <span>{table.indexes.length} {t('superAdminDbPage.indexes')}</span>
                                                                <span className="hidden sm:inline">{table.foreign_keys.length} FK</span>
                                                                <span>{formatSize(table.size_kb)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <p className="text-sm font-bold text-gray-600">{table.row_count.toLocaleString()}</p>
                                                            <div className="hidden sm:flex gap-1">
                                                                <button onClick={(e) => { e.stopPropagation(); openTable(table.name, 'tables'); }}
                                                                    className="p-1.5 hover:bg-indigo-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors" title={t('superAdminDbPage.viewTable')}>
                                                                    <Eye size={14} />
                                                                </button>
                                                                <button onClick={(e) => { e.stopPropagation(); openTable(table.name, 'structure'); }}
                                                                    className="p-1.5 hover:bg-violet-100 rounded-lg text-gray-400 hover:text-violet-600 transition-colors" title={t('superAdminDbPage.viewStructure')}>
                                                                    <Code size={14} />
                                                                </button>
                                                            </div>
                                                            <ChevronDown size={14} className={`text-gray-300 transition-transform ${detailTable === table.name ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </div>
                                                    {/* Progress bar */}
                                                    <div className="w-full bg-gray-100 rounded-full h-2 sm:h-3 overflow-hidden mt-2">
                                                        <div className={`h-full rounded-full transition-all duration-500 ${table.row_count / maxRows > 0.7 ? 'bg-red-400' : table.row_count / maxRows > 0.4 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                                            style={{ width: `${Math.max(3, (table.row_count / maxRows) * 100)}%` }} />
                                                    </div>
                                                    {/* Mobile action buttons */}
                                                    <div className="flex gap-2 mt-2 sm:hidden">
                                                        <button onClick={(e) => { e.stopPropagation(); openTable(table.name, 'tables'); }}
                                                            className="flex-1 py-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded-lg flex items-center justify-center gap-1">
                                                            <Eye size={12} /> {t('superAdminDbPage.table')}
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); openTable(table.name, 'structure'); }}
                                                            className="flex-1 py-1.5 text-[10px] font-bold text-violet-600 bg-violet-50 rounded-lg flex items-center justify-center gap-1">
                                                            <Code size={12} /> {t('superAdminDbPage.structure')}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 text-gray-400">{t('superAdminDbPage.noData')}</div>
                    )}
                </div>
            )}

            {/* TABLES TAB */}
            {activeTab === 'tables' && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select value={selectedTable || ''} onChange={(e) => e.target.value && openTable(e.target.value, 'tables')}
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300">
                            <option value="">{t('superAdminDbPage.selectTable')}</option>
                            {overview?.tables?.map(t2 => <option key={t2.name} value={t2.name}>{t2.name} ({t2.row_count.toLocaleString()} {t('superAdminDbPage.rows')}, {t2.column_count} {t('superAdminDbPage.columns')})</option>)}
                        </select>
                        {selectedTable && (
                            <div className="flex gap-2">
                                <div className="relative flex-1 sm:flex-none">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder={t('superAdminDbPage.search')} value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                                </div>
                                <button onClick={handleSearch} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">{t('superAdminDbPage.searchBtn')}</button>
                            </div>
                        )}
                    </div>

                    {loadingTable ? (
                        <div className="flex items-center justify-center py-20"><RefreshCw size={32} className="animate-spin text-indigo-400" /></div>
                    ) : tableData ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        {tableData.table}
                                        <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{tableData.total_rows.toLocaleString()} {t('superAdminDbPage.totalRowCount')}</span>
                                    </h3>
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                        {t('superAdminDbPage.page')} {tableData.page}/{tableData.total_pages} &middot; PK: <span className="font-medium text-indigo-500">{tableData.primary_key || 'N/A'}</span>
                                        {sortCol && <span> &middot; {t('superAdminDbPage.sortLabel')}: <span className="font-medium">{sortCol} {sortDir}</span></span>}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {!isDevMode && tableData.primary_key && selectedRows.size > 0 && (
                                        batchDeleteConfirm ? (
                                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                                                <span className="text-xs font-bold text-red-700">{t('superAdminDbPage.deleteCount', { count: selectedRows.size })}</span>
                                                <button onClick={handleBatchDelete} disabled={batchDeleting}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
                                                    {batchDeleting ? t('superAdminDbPage.deleting') : t('superAdminDbPage.confirm')}
                                                </button>
                                                <button onClick={() => setBatchDeleteConfirm(false)}
                                                    className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors">{t('superAdminDbPage.cancel')}</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setBatchDeleteConfirm(true)}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 border border-red-200 transition-colors">
                                                <Trash2 size={13} />
                                                {selectedRows.size}{t('superAdminDbPage.selectedDelete', { count: selectedRows.size }).replace(String(selectedRows.size), '')}
                                            </button>
                                        )
                                    )}
                                    {/* Insert Row Button */}
                                    {!isDevMode && (
                                        <button onClick={openInsertModal}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 border border-emerald-200 transition-colors">
                                            <Plus size={13} />
                                            {t('superAdminDbPage.addRow', '행 추가')}
                                        </button>
                                    )}
                                    {/* Export Button */}
                                    <div className="relative">
                                        <button onClick={() => setShowExportMenu(!showExportMenu)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 border border-blue-200 transition-colors">
                                            <Download size={13} />
                                            {t('superAdminDbPage.export', '내보내기')}
                                        </button>
                                        {showExportMenu && (
                                            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20 min-w-[120px]">
                                                <button onClick={() => handleExport('csv')} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                    <FileText size={13} className="text-emerald-500" /> CSV
                                                </button>
                                                <button onClick={() => handleExport('json')} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                    <Code size={13} className="text-blue-500" /> JSON
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => fetchTableData(selectedTable, currentPage, searchTerm, sortCol, sortDir)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><RefreshCw size={14} className="text-gray-400" /></button>
                                </div>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            {!isDevMode && tableData.primary_key && (
                                                <th className="px-2 py-3 text-center bg-gray-50 z-10 w-8">
                                                    <input type="checkbox"
                                                        checked={tableData.rows.length > 0 && tableData.rows.every(r => selectedRows.has(r[tableData.primary_key]))}
                                                        onChange={toggleSelectAll}
                                                        className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                                </th>
                                            )}
                                            <th className="px-2 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 w-8">#</th>
                                            {tableData.columns.map(col => (
                                                <th key={col.Field} className="px-2.5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                                                    onClick={() => handleSort(col.Field)}>
                                                    <div className="flex items-center gap-1">
                                                        {col.Key === 'PRI' && <Key size={10} className="text-amber-500" />}
                                                        {col.Field}
                                                        {sortCol === col.Field ? (sortDir === 'ASC' ? <ArrowUp size={10} className="text-indigo-500" /> : <ArrowDown size={10} className="text-indigo-500" />) : <ArrowUpDown size={9} className="text-gray-300" />}
                                                    </div>
                                                    <div className={`text-[9px] font-medium normal-case mt-0.5 ${typeColor(col.Type)} inline-block px-1 rounded`}>{col.Type}</div>
                                                </th>
                                            ))}
                                            <th className="px-2 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16">{t('superAdminDbPage.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {tableData.rows.map((row, rowIdx) => {
                                            const pkVal = tableData.primary_key ? row[tableData.primary_key] : null;
                                            const isSelected = pkVal !== null && selectedRows.has(pkVal);
                                            return (
                                                <React.Fragment key={rowIdx}>
                                                    <tr className={`hover:bg-indigo-50/30 transition-colors ${expandedRow === rowIdx ? 'bg-indigo-50/20' : ''} ${isSelected ? 'bg-indigo-50/40' : ''}`}>
                                                        {!isDevMode && tableData.primary_key && (
                                                            <td className="px-2 py-2 text-center">
                                                                <input type="checkbox" checked={isSelected}
                                                                    onChange={() => toggleRowSelect(pkVal)}
                                                                    className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                                            </td>
                                                        )}
                                                        <td className="px-2 py-2 text-[10px] text-gray-400 sticky left-0 bg-white z-10">
                                                            <button onClick={() => setExpandedRow(expandedRow === rowIdx ? null : rowIdx)}
                                                                className="hover:text-indigo-600 transition-colors font-medium">
                                                                {(currentPage - 1) * 50 + rowIdx + 1}
                                                            </button>
                                                        </td>
                                                        {tableData.columns.map(col => {
                                                            const isEditing = editingCell?.row === rowIdx && editingCell?.field === col.Field;
                                                            const isPK = col.Field === tableData.primary_key;
                                                            const val = row[col.Field];
                                                            return (
                                                                <td key={col.Field} className="px-2.5 py-2">
                                                                    {isEditing ? (
                                                                        <div className="flex items-center gap-1">
                                                                            <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                                                                                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                                                                                className="px-2 py-1 border border-indigo-300 rounded-lg text-xs w-full min-w-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-200" autoFocus />
                                                                            <button onClick={saveEdit} disabled={saving} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={12} /></button>
                                                                            <button onClick={cancelEdit} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><X size={12} /></button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className={`max-w-[180px] truncate text-xs ${isPK ? 'font-bold text-indigo-600' : 'text-gray-700'} ${!isPK && tableData.primary_key && !isDevMode ? 'cursor-pointer hover:text-indigo-600' : ''}`}
                                                                            onClick={() => !isPK && tableData.primary_key && !isDevMode && startEdit(rowIdx, col.Field, val)}
                                                                            title={val != null ? String(val) : 'NULL'}>
                                                                            {val != null ? (
                                                                                String(val).length > 45 ? String(val).substring(0, 45) + '\u2026' : String(val)
                                                                            ) : <span className="text-gray-300 italic text-[10px]">NULL</span>}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                        {!isDevMode && <td className="px-2 py-2 text-center">
                                                            {tableData.primary_key && (
                                                                deleteConfirm === row[tableData.primary_key] ? (
                                                                    <div className="flex items-center gap-1 justify-center">
                                                                        <button onClick={() => handleDelete(row[tableData.primary_key])} className="px-2 py-0.5 bg-red-500 text-white rounded text-[10px] font-bold">{t('superAdminDbPage.confirm')}</button>
                                                                        <button onClick={() => setDeleteConfirm(null)} className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-bold">{t('superAdminDbPage.cancel')}</button>
                                                                    </div>
                                                                ) : (
                                                                    <button onClick={() => setDeleteConfirm(row[tableData.primary_key])} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                                                        <Trash2 size={13} />
                                                                    </button>
                                                                )
                                                            )}
                                                        </td>}
                                                    </tr>
                                                    {expandedRow === rowIdx && (
                                                        <tr>
                                                            <td colSpan={tableData.columns.length + (isDevMode || !tableData.primary_key ? 2 : 3)} className="px-5 py-4 bg-indigo-50/30 border-y border-indigo-100">
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                                    {tableData.columns.map(col => (
                                                                        <div key={col.Field} className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                                {col.Key === 'PRI' && <Key size={10} className="text-amber-500" />}
                                                                                <span className="text-[10px] font-bold text-gray-500 uppercase">{col.Field}</span>
                                                                                <span className={`text-[9px] px-1 rounded border ${typeColor(col.Type)}`}>{col.Type}</span>
                                                                            </div>
                                                                            <p className="text-sm text-gray-800 break-all whitespace-pre-wrap">
                                                                                {row[col.Field] != null ? String(row[col.Field]) : <span className="text-gray-300 italic">NULL</span>}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>);
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-gray-100">
                                {/* Mobile: Select All */}
                                {!isDevMode && tableData.primary_key && tableData.rows.length > 0 && (
                                    <div className="p-3 bg-gray-50 flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox"
                                                checked={tableData.rows.every(r => selectedRows.has(r[tableData.primary_key]))}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                            <span className="text-xs font-bold text-gray-600">{t('superAdminDbPage.selectAll')}</span>
                                        </label>
                                        {selectedRows.size > 0 && (
                                            <span className="text-xs font-bold text-indigo-600">{t('superAdminDbPage.selectedCount', { count: selectedRows.size })}</span>
                                        )}
                                    </div>
                                )}
                                {tableData.rows.map((row, rowIdx) => {
                                    const pkVal = tableData.primary_key ? row[tableData.primary_key] : null;
                                    const isSelected = pkVal !== null && selectedRows.has(pkVal);
                                    return (
                                        <div key={rowIdx} className={`p-4 ${isSelected ? 'bg-indigo-50/40' : ''}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {!isDevMode && tableData.primary_key && (
                                                        <input type="checkbox" checked={isSelected}
                                                            onChange={() => toggleRowSelect(pkVal)}
                                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                                    )}
                                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                        #{(currentPage - 1) * 50 + rowIdx + 1}
                                                        {tableData.primary_key && ` · ${tableData.primary_key}: ${row[tableData.primary_key]}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {!isDevMode && tableData.primary_key && (
                                                        deleteConfirm === row[tableData.primary_key] ? (
                                                            <div className="flex items-center gap-1">
                                                                <button onClick={() => handleDelete(row[tableData.primary_key])} className="px-2 py-0.5 bg-red-500 text-white rounded text-[10px] font-bold">{t('superAdminDbPage.confirm')}</button>
                                                                <button onClick={() => setDeleteConfirm(null)} className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-bold">{t('superAdminDbPage.cancel')}</button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => setDeleteConfirm(row[tableData.primary_key])} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                {tableData.columns.slice(0, expandedRow === rowIdx ? undefined : 5).map(col => {
                                                    const val = row[col.Field];
                                                    const isPK = col.Field === tableData.primary_key;
                                                    const isEditing = editingCell?.row === rowIdx && editingCell?.field === col.Field;
                                                    return (
                                                        <div key={col.Field} className="flex gap-2 text-xs">
                                                            <span className={`w-24 flex-shrink-0 font-bold truncate ${isPK ? 'text-amber-600' : 'text-gray-400'}`}>
                                                                {isPK && '\ud83d\udd11 '}{col.Field}
                                                            </span>
                                                            {isEditing ? (
                                                                <div className="flex items-center gap-1 flex-1">
                                                                    <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                                                                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                                                                        className="px-2 py-0.5 border border-indigo-300 rounded text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-indigo-200" autoFocus />
                                                                    <button onClick={saveEdit} disabled={saving} className="p-0.5 text-emerald-600"><Check size={12} /></button>
                                                                    <button onClick={cancelEdit} className="p-0.5 text-gray-400"><X size={12} /></button>
                                                                </div>
                                                            ) : (
                                                                <span className={`flex-1 text-gray-700 truncate ${!isPK && tableData.primary_key ? 'cursor-pointer active:text-indigo-600' : ''}`}
                                                                    onClick={() => !isPK && tableData.primary_key && startEdit(rowIdx, col.Field, val)}>
                                                                    {val != null ? String(val) : <span className="text-gray-300 italic">NULL</span>}
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {tableData.columns.length > 5 && (
                                                <button onClick={() => setExpandedRow(expandedRow === rowIdx ? null : rowIdx)}
                                                    className="mt-2 text-[10px] font-bold text-indigo-500 hover:text-indigo-700">
                                                    {expandedRow === rowIdx ? t('superAdminDbPage.fold') : t('superAdminDbPage.showMore', { count: tableData.columns.length - 5 })}
                                                </button>
                                            )}
                                        </div>);
                                })}
                            </div>

                            {/* Pagination */}
                            {tableData.total_pages > 1 && (
                                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                                    <p className="text-[11px] text-gray-400">{(currentPage - 1) * 50 + 1}~{Math.min(currentPage * 50, tableData.total_rows)} / {tableData.total_rows.toLocaleString()}</p>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => handlePageChange(1)} disabled={currentPage <= 1} className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30">&laquo;</button>
                                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={14} /></button>
                                        {Array.from({ length: Math.min(7, tableData.total_pages) }, (_, i) => {
                                            let pn;
                                            if (tableData.total_pages <= 7) pn = i + 1;
                                            else if (currentPage <= 4) pn = i + 1;
                                            else if (currentPage >= tableData.total_pages - 3) pn = tableData.total_pages - 6 + i;
                                            else pn = currentPage - 3 + i;
                                            return (
                                                <button key={pn} onClick={() => handlePageChange(pn)}
                                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${pn === currentPage ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                                                    {pn}
                                                </button>
                                            );
                                        })}
                                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= tableData.total_pages} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={14} /></button>
                                        <button onClick={() => handlePageChange(tableData.total_pages)} disabled={currentPage >= tableData.total_pages} className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30">&raquo;</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Table2 size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-400 font-medium">{t('superAdminDbPage.selectTablePrompt')}</p>
                            <p className="text-xs text-gray-300 mt-1">{t('superAdminDbPage.clickToEdit')}</p>
                        </div>
                    )}
                </div>
            )}

            {/* STRUCTURE TAB */}
            {activeTab === 'structure' && (
                <div className="space-y-4">
                    <select value={selectedTable || ''} onChange={(e) => e.target.value && openTable(e.target.value, 'structure')}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300">
                        <option value="">{t('superAdminDbPage.selectTable')}</option>
                        {overview?.tables?.map(t2 => <option key={t2.name} value={t2.name}>{t2.name}</option>)}
                    </select>

                    {loadingStructure ? (
                        <div className="flex items-center justify-center py-20"><RefreshCw size={32} className="animate-spin text-indigo-400" /></div>
                    ) : structureData ? (
                        <div className="space-y-4">
                            {/* Column Detail Cards */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Columns3 size={18} className="text-violet-500" />
                                        {structureData.table} &mdash; {"\ucee8\ub7fc \uc0c1\uc138"}
                                        <span className="text-xs font-normal text-gray-400">{structureData.columns.length}</span>
                                    </h3>
                                </div>
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">#</th>
                                                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">{t('superAdminDbPage.column')}</th>
                                                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">{t('superAdminDbPage.type')}</th>
                                                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">{t('superAdminDbPage.null')}</th>
                                                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">{t('superAdminDbPage.key')}</th>
                                                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">{t('superAdminDbPage.default')}</th>
                                                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">{t('superAdminDbPage.extra')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {structureData.columns.map((col, i) => (
                                                <tr key={col.Field} className="hover:bg-indigo-50/20 transition-colors">
                                                    <td className="px-4 py-2.5 text-xs text-gray-400">{i + 1}</td>
                                                    <td className="px-4 py-2.5">
                                                        <div className="flex items-center gap-1.5">
                                                            {col.Key === 'PRI' && <Key size={12} className="text-amber-500" />}
                                                            {col.Key === 'MUL' && <Link2 size={12} className="text-blue-500" />}
                                                            {col.Key === 'UNI' && <Hash size={12} className="text-violet-500" />}
                                                            <span className="text-sm font-bold text-gray-800">{col.Field}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <span className={`px-2 py-0.5 rounded text-[11px] border font-medium ${typeColor(col.Type)}`}>{col.Type}</span>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <span className={`text-xs font-medium ${col.Null === 'YES' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                            {col.Null === 'YES' ? '\u2714' : '\u2716'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        {col.Key ? (
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${col.Key === 'PRI' ? 'bg-amber-100 text-amber-700' : col.Key === 'UNI' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                {col.Key}
                                                            </span>
                                                        ) : <span className="text-gray-300">-</span>}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-xs text-gray-600">{col.Default !== null ? String(col.Default) : <span className="text-gray-300 italic">{t('superAdminDbPage.noDefault')}</span>}</td>
                                                    <td className="px-4 py-2.5 text-xs text-gray-600">{col.Extra || <span className="text-gray-300">-</span>}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Mobile card view */}
                                <div className="md:hidden divide-y divide-gray-100">
                                    {structureData.columns.map((col, i) => (
                                        <div key={col.Field} className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold text-gray-400">#{i + 1}</span>
                                                {col.Key === 'PRI' && <Key size={12} className="text-amber-500" />}
                                                {col.Key === 'MUL' && <Link2 size={12} className="text-blue-500" />}
                                                {col.Key === 'UNI' && <Hash size={12} className="text-violet-500" />}
                                                <span className="text-sm font-bold text-gray-800">{col.Field}</span>
                                                {col.Key && (
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${col.Key === 'PRI' ? 'bg-amber-100 text-amber-700' : col.Key === 'UNI' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {col.Key}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-[11px]">
                                                <span className={`px-2 py-0.5 rounded border font-medium ${typeColor(col.Type)}`}>{col.Type}</span>
                                                <span className={`font-medium ${col.Null === 'YES' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                    NULL: {col.Null === 'YES' ? '\u2714' : '\u2716'}
                                                </span>
                                                {col.Default !== null && <span className="text-gray-500">{t('superAdminDbPage.defaultLabel')}: {String(col.Default)}</span>}
                                                {col.Extra && <span className="text-gray-500">{col.Extra}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Indexes */}
                            {structureData.indexes.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-gray-100">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <Key size={18} className="text-amber-500" />
                                            {t('superAdminDbPage.indexInfo')}
                                            <span className="text-xs font-normal text-gray-400">{structureData.indexes.length}</span>
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {structureData.indexes.map((idx, i) => (
                                            <div key={i} className="px-4 py-3 flex items-center justify-between gap-2">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{idx.Key_name}</p>
                                                    <div className="flex flex-wrap gap-2 mt-1 text-[11px]">
                                                        <span className="text-gray-600 font-medium">{idx.Column_name}</span>
                                                        <span className="text-gray-400">{idx.Index_type}</span>
                                                        {idx.Cardinality && <span className="text-gray-400">{t('superAdminDbPage.cardinality')}: {idx.Cardinality}</span>}
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${!idx.Non_unique ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {!idx.Non_unique ? 'Unique' : 'Non-unique'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CREATE TABLE SQL */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Code size={18} className="text-cyan-500" />
                                        CREATE TABLE DDL
                                    </h3>
                                </div>
                                <div className="p-5">
                                    <pre className="bg-gray-900 text-green-400 rounded-xl p-4 overflow-x-auto text-xs leading-relaxed font-mono whitespace-pre-wrap">
                                        {structureData.create_sql}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Columns3 size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-400 font-medium">{t('superAdminDbPage.selectTableStructure')}</p>
                            <p className="text-xs text-gray-300 mt-1">{t('superAdminDbPage.structureDetail')}</p>
                        </div>
                    )}
                </div>
            )}

            {/* MAINTENANCE TAB */}
            {activeTab === 'maintenance' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                                <Wrench size={20} className="text-amber-500" />
                                {t('superAdminDbPage.maintenanceTitle', '서버 캐시 관리')}
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">{t('superAdminDbPage.maintenanceDesc', '서버에 쌓인 캐시 파일을 스캔하고 정리합니다')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {cacheInfo && (
                                clearConfirm === 'all' ? (
                                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                                        <AlertTriangle size={14} className="text-red-500" />
                                        <span className="text-xs font-bold text-red-700">{t('superAdminDbPage.clearAllConfirm', '전체 정리하시겠습니까?')}</span>
                                        <button onClick={() => clearCache('all')} disabled={clearingCache['all']}
                                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
                                            {clearingCache['all'] ? '...' : t('superAdminDbPage.confirm', '확인')}
                                        </button>
                                        <button onClick={() => setClearConfirm(null)}
                                            className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors">{t('superAdminDbPage.cancel', '취소')}</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setClearConfirm('all')}
                                        className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:from-red-600 hover:to-orange-600 transition-all shadow-md">
                                        <Trash2 size={15} />
                                        {t('superAdminDbPage.clearAll', '전체 정리')}
                                    </button>
                                )
                            )}
                            <button onClick={fetchCacheInfo}
                                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors" title="Refresh">
                                <RefreshCw size={16} className={`text-gray-600 ${loadingCache ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {cacheInfo && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
                                    <HardDrive size={18} className="text-indigo-600" />
                                </div>
                                <p className="text-xl font-extrabold text-gray-900">{cacheInfo.totalSizeFormatted}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{t('superAdminDbPage.totalCacheSize', '전체 캐시 용량')}</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
                                    <Layers size={18} className="text-emerald-600" />
                                </div>
                                <p className="text-xl font-extrabold text-gray-900">{cacheInfo.totalCount}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{t('superAdminDbPage.totalCacheItems', '전체 캐시 항목')}</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center mb-2">
                                    <Users size={18} className="text-violet-600" />
                                </div>
                                <p className="text-xl font-extrabold text-gray-900">{cacheInfo.caches?.sessions?.count || 0}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{t('superAdminDbPage.expiredSessions', '만료 세션')}</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                <div className="w-9 h-9 bg-cyan-100 rounded-xl flex items-center justify-center mb-2">
                                    <Cpu size={18} className="text-cyan-600" />
                                </div>
                                <p className="text-xl font-extrabold text-gray-900">{cacheInfo.caches?.opcache?.count || 0}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">OPcache Scripts</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center mb-2">
                                    <Trash2 size={18} className="text-amber-600" />
                                </div>
                                <p className="text-xl font-extrabold text-gray-900">{cacheInfo.caches?.trash?.count || 0}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{t('superAdminDbPage.trashRecords', '휴지통 기록')}</p>
                            </div>
                        </div>
                    )}

                    {loadingCache ? (
                        <div className="flex items-center justify-center py-20"><RefreshCw size={32} className="animate-spin text-indigo-400" /></div>
                    ) : cacheInfo ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(cacheInfo.caches || {}).map(([key, cache]) => {
                                const iconMap = {
                                    sessions: <Users size={22} className="text-violet-500" />,
                                    opcache: <Cpu size={22} className="text-cyan-500" />,
                                    temp: <FileX size={22} className="text-orange-500" />,
                                    logs: <FileText size={22} className="text-rose-500" />,
                                    trash: <Trash2 size={22} className="text-amber-500" />
                                };
                                const colorMap = {
                                    sessions: 'violet', opcache: 'cyan', temp: 'orange', logs: 'rose', trash: 'amber'
                                };
                                const color = colorMap[key] || 'gray';
                                const isClearing = clearingCache[key];
                                const hasItems = cache.count > 0 || (key === 'opcache' && cache.available);
                                const lang = t('lang', 'ko');

                                return (
                                    <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-11 h-11 bg-${color}-50 rounded-xl flex items-center justify-center`}>
                                                        {iconMap[key]}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-sm">{lang === 'en' ? (cache.labelEn || cache.label) : cache.label}</h3>
                                                        <p className="text-[11px] text-gray-400 mt-0.5">{lang === 'en' ? (cache.descriptionEn || cache.description) : cache.description}</p>
                                                    </div>
                                                </div>
                                                {hasItems ? (
                                                    <span className={`px-2 py-1 bg-${color}-50 text-${color}-600 rounded-lg text-[11px] font-bold`}>
                                                        {cache.count}{key !== 'opcache' ? ` ${t('superAdminDbPage.items', '개')}` : ' scripts'}
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded-lg text-[11px] font-bold">
                                                        {t('superAdminDbPage.clean', '깨끗')}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="flex-1">
                                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                        <div className={`h-full rounded-full bg-${color}-400 transition-all duration-500`}
                                                            style={{ width: `${Math.min(100, cacheInfo.totalSize > 0 ? (cache.size / cacheInfo.totalSize) * 100 : 0)}%` }} />
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-600 flex-shrink-0">{cache.sizeFormatted || '0 B'}</span>
                                            </div>

                                            {key === 'opcache' && cache.hitRate > 0 && (
                                                <div className="flex items-center gap-2 mb-3 text-xs">
                                                    <span className="text-gray-400">Hit Rate:</span>
                                                    <span className="font-bold text-cyan-600">{cache.hitRate}%</span>
                                                </div>
                                            )}

                                            {key === 'trash' && cache.totalCount > 0 && (
                                                <div className="flex items-center gap-2 mb-3 text-xs">
                                                    <span className="text-gray-400">{t('superAdminDbPage.totalTrash', '전체 휴지통')}:</span>
                                                    <span className="font-bold text-amber-600">{cache.totalCount}{t('superAdminDbPage.items', '개')}</span>
                                                </div>
                                            )}

                                            {cache.files && cache.files.length > 0 && (
                                                <details className="mb-3">
                                                    <summary className="text-[11px] font-bold text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                                                        {t('superAdminDbPage.fileList', '파일 목록')} ({cache.count})
                                                    </summary>
                                                    <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-2 space-y-1">
                                                        {cache.files.map((f, i) => (
                                                            <div key={i} className="flex items-center justify-between text-[10px] text-gray-500">
                                                                <span className="truncate flex-1 font-mono">{f.name}</span>
                                                                <span className="flex-shrink-0 ml-2 text-gray-400">{f.age_hours}h ago</span>
                                                            </div>
                                                        ))}
                                                        {cache.count > cache.files.length && (
                                                            <p className="text-[10px] text-gray-300 text-center pt-1">... +{cache.count - cache.files.length} more</p>
                                                        )}
                                                    </div>
                                                </details>
                                            )}

                                            {cache.path && (
                                                <div className="text-[10px] text-gray-300 font-mono truncate mb-3" title={cache.path}>
                                                    📁 {cache.path}
                                                </div>
                                            )}

                                            {hasItems ? (
                                                clearConfirm === key ? (
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => clearCache(key)} disabled={isClearing}
                                                            className={`flex-1 py-2 bg-${color}-500 text-white rounded-xl text-xs font-bold hover:bg-${color}-600 disabled:opacity-50 transition-colors`}>
                                                            {isClearing ? <RefreshCw size={14} className="animate-spin mx-auto" /> : t('superAdminDbPage.confirmClear', '정리 실행')}
                                                        </button>
                                                        <button onClick={() => setClearConfirm(null)}
                                                            className="py-2 px-4 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">
                                                            {t('superAdminDbPage.cancel', '취소')}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setClearConfirm(key)}
                                                        className={`w-full py-2.5 bg-${color}-50 text-${color}-600 rounded-xl text-xs font-bold hover:bg-${color}-100 border border-${color}-100 transition-colors flex items-center justify-center gap-1.5`}>
                                                        <Trash2 size={13} />
                                                        {t('superAdminDbPage.clearThis', '정리하기')}
                                                    </button>
                                                )
                                            ) : (
                                                <div className="w-full py-2.5 bg-gray-50 text-gray-300 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                                                    <CheckCircle size={13} />
                                                    {t('superAdminDbPage.noItemsToClear', '정리할 항목 없음')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Wrench size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-400 font-medium">{t('superAdminDbPage.maintenanceEmpty', '스캔 버튼을 클릭하여 캐시 현황을 확인하세요')}</p>
                        </div>
                    )}

                    {/* OPTIMIZE TABLE Section */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Zap size={18} className="text-yellow-500" />
                                    {t('superAdminDbPage.optimizeTitle', '테이블 최적화')}
                                </h3>
                                <p className="text-[11px] text-gray-400 mt-0.5">{t('superAdminDbPage.optimizeDesc', 'OPTIMIZE TABLE을 실행하여 디스크 공간을 회수하고 성능을 개선합니다')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {optimizeConfirm === 'all' ? (
                                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
                                        <span className="text-xs font-bold text-yellow-700">{t('superAdminDbPage.optimizeAllConfirm', '전체 테이블을 최적화하시겠습니까?')}</span>
                                        <button onClick={() => handleOptimize(null)} disabled={optimizing}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-xs font-bold hover:bg-yellow-600 disabled:opacity-50 transition-colors">
                                            {optimizing ? '...' : t('superAdminDbPage.confirm', '확인')}
                                        </button>
                                        <button onClick={() => setOptimizeConfirm(null)}
                                            className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors">{t('superAdminDbPage.cancel', '취소')}</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setOptimizeConfirm('all')}
                                        className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl text-sm font-bold hover:from-yellow-500 hover:to-amber-600 transition-all shadow-md">
                                        <Zap size={15} />
                                        {t('superAdminDbPage.optimizeAll', '전체 최적화')}
                                    </button>
                                )}
                            </div>
                        </div>

                        {optimizing && (
                            <div className="px-5 py-8 flex items-center justify-center">
                                <RefreshCw size={24} className="animate-spin text-yellow-400 mr-3" />
                                <span className="text-sm font-bold text-gray-500">{t('superAdminDbPage.optimizing', '최적화 중...')}</span>
                            </div>
                        )}

                        {optimizeResults && !optimizing && (
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                    <CheckCircle size={18} className="text-emerald-500" />
                                    <div>
                                        <p className="text-sm font-bold text-emerald-800">{optimizeResults.message}</p>
                                        {optimizeResults.total_saved_kb !== undefined && (
                                            <p className="text-xs text-emerald-600 mt-0.5">
                                                {t('superAdminDbPage.savedSpace', '절약 용량')}: {formatSize(Math.abs(optimizeResults.total_saved_kb))}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {optimizeResults.results && (
                                    <div className="max-h-60 overflow-y-auto space-y-1">
                                        {optimizeResults.results.map((r, i) => (
                                            <div key={i} className="flex items-center justify-between text-xs px-3 py-2 hover:bg-gray-50 rounded-lg">
                                                <span className="font-bold text-gray-700">{r.table}</span>
                                                <div className="flex items-center gap-3 text-gray-400">
                                                    <span>{formatSize(r.before_kb)}</span>
                                                    <span className="text-gray-300">→</span>
                                                    <span>{formatSize(r.after_kb)}</span>
                                                    {r.saved_kb > 0 && <span className="text-emerald-500 font-bold">-{formatSize(r.saved_kb)}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {!optimizeResults && !optimizing && (
                            <div className="p-5 text-center text-gray-400 text-xs">
                                <Zap size={24} className="mx-auto mb-2 text-gray-300" />
                                {t('superAdminDbPage.optimizeHint', '전체 최적화 버튼을 클릭하여 모든 테이블을 최적화하세요')}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* INSERT ROW MODAL */}
            {showInsertModal && tableData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowInsertModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                                <Plus size={18} className="text-emerald-500" />
                                {t('superAdminDbPage.insertTitle', '새 행 추가')} — {selectedTable}
                            </h3>
                            <button onClick={() => setShowInsertModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={16} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-3">
                            {tableData.columns.map(col => {
                                const isAutoIncrement = col.Extra?.includes('auto_increment');
                                const isNullable = col.Null === 'YES';
                                return (
                                    <div key={col.Field}>
                                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1">
                                            {col.Key === 'PRI' && <Key size={10} className="text-amber-500" />}
                                            {col.Field}
                                            <span className={`px-1 py-0.5 rounded text-[9px] border ${typeColor(col.Type)}`}>{col.Type}</span>
                                            {isNullable && <span className="text-[9px] text-gray-300">NULL OK</span>}
                                            {isAutoIncrement && <span className="text-[9px] text-gray-300 italic">AUTO</span>}
                                        </label>
                                        {isAutoIncrement ? (
                                            <input type="text" disabled value="(자동 생성)" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-400 cursor-not-allowed" />
                                        ) : (
                                            <input
                                                type="text"
                                                value={insertData[col.Field] || ''}
                                                onChange={e => setInsertData(prev => ({ ...prev, [col.Field]: e.target.value }))}
                                                placeholder={col.Default !== null ? `기본: ${col.Default}` : (isNullable ? 'NULL (비워 두기 가능)' : '필수 입력')}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
                            <button onClick={() => setShowInsertModal(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">
                                {t('superAdminDbPage.cancel', '취소')}
                            </button>
                            <button onClick={handleInsert} disabled={inserting}
                                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-1.5">
                                {inserting ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                                {inserting ? t('superAdminDbPage.inserting', '추가 중...') : t('superAdminDbPage.insertBtn', '행 추가')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default SuperAdminDatabase;

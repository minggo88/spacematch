import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, ShieldCheck, ShieldOff, Loader2, Save, RefreshCw, AlertTriangle, Lock, Unlock, Users, Clock, Globe, Zap, Code2, Search, CheckCircle2, XCircle, AlertCircle, Wrench, Activity } from 'lucide-react';

const API_BASE = '/api';

const SETTINGS_META = {
    maintenance_mode: {
        labelKey: 'maintenanceMode',
        descKey: 'maintenanceModeDesc',
        icon: AlertTriangle,
        type: 'toggle',
        danger: true,
    },
    force_https: {
        labelKey: 'forceHttps',
        descKey: 'forceHttpsDesc',
        icon: Lock,
        type: 'toggle',
    },
    block_suspicious_ips: {
        labelKey: 'blockSuspiciousIps',
        descKey: 'blockSuspiciousIpsDesc',
        icon: Shield,
        type: 'toggle',
    },
    allow_registration: {
        labelKey: 'allowRegistration',
        descKey: 'allowRegistrationDesc',
        icon: Users,
        type: 'toggle',
    },
    enable_api_rate_limit: {
        labelKey: 'apiRateLimit',
        descKey: 'apiRateLimitDesc',
        icon: Zap,
        type: 'toggle',
    },
    max_login_attempts: {
        labelKey: 'maxLoginAttempts',
        descKey: 'maxLoginAttemptsDesc',
        icon: Lock,
        type: 'number',
        min: 1,
        max: 20,
    },
    session_timeout_minutes: {
        labelKey: 'sessionTimeout',
        descKey: 'sessionTimeoutDesc',
        icon: Clock,
        type: 'number',
        min: 5,
        max: 1440,
    },
    disable_devtools_block: {
        labelKey: 'disableDevtoolsBlock',
        descKey: 'disableDevtoolsBlockDesc',
        icon: Code2,
        type: 'toggle',
    },
};

const SEVERITY_CONFIG = {
    critical: { color: 'red', label: '심각', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
    high: { color: 'orange', label: '높음', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
    medium: { color: 'yellow', label: '보통', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-amber-100 text-amber-700' },
    low: { color: 'blue', label: '낮음', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
};

const GRADE_CONFIG = {
    A: { color: 'text-emerald-500', bg: 'bg-emerald-50', label: '매우 안전' },
    B: { color: 'text-blue-500', bg: 'bg-blue-50', label: '양호' },
    C: { color: 'text-yellow-500', bg: 'bg-yellow-50', label: '주의 필요' },
    D: { color: 'text-orange-500', bg: 'bg-orange-50', label: '위험' },
    F: { color: 'text-red-500', bg: 'bg-red-50', label: '매우 위험' },
};

const AdminSecurity = () => {
    const { t } = useTranslation('admin');
    const [activeTab, setActiveTab] = useState('settings');
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Audit state
    const [auditData, setAuditData] = useState(null);
    const [auditLoading, setAuditLoading] = useState(false);
    const [fixingItems, setFixingItems] = useState({});

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/security_settings.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setSettings(data.settings);
                setDirty(false);
            }
        } catch (err) {
            console.error(t('securityPage.settingsLoadFailed'), err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: prev[key] === '1' ? '0' : '1' }));
        setDirty(true);
    };

    const handleNumber = (key, value) => {
        const meta = SETTINGS_META[key];
        const num = Math.max(meta.min || 1, Math.min(meta.max || 9999, parseInt(value) || 0));
        setSettings(prev => ({ ...prev, [key]: String(num) }));
        setDirty(true);
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/admin/security_settings.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ settings }),
            });
            const data = await res.json();
            if (data.success) {
                setDirty(false);
                setLastSaved(new Date());
            } else {
                alert(t('securityPage.saveFailed') + (data.message || t('securityPage.unknownError')));
            }
        } catch (err) {
            alert(t('securityPage.saveError') + err.message);
        } finally {
            setSaving(false);
        }
    };

    // ─── Audit Functions ───
    const runAudit = async () => {
        setAuditLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/security_audit.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setAuditData(data.audit);
            }
        } catch (err) {
            console.error('Security audit failed:', err);
        } finally {
            setAuditLoading(false);
        }
    };

    const applyFix = async (fixId) => {
        setFixingItems(prev => ({ ...prev, [fixId]: true }));
        try {
            const res = await fetch(`${API_BASE}/admin/security_audit.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ fix_id: fixId }),
            });
            const data = await res.json();
            if (data.success && data.results?.[0]?.success) {
                // Re-run audit after fix
                await runAudit();
            } else {
                alert('수정 실패: ' + (data.results?.[0]?.message || '알 수 없는 오류'));
            }
        } catch (err) {
            alert('수정 중 오류: ' + err.message);
        } finally {
            setFixingItems(prev => ({ ...prev, [fixId]: false }));
        }
    };

    const fixAll = async () => {
        if (!auditData) return;
        const fixableChecks = auditData.checks.filter(c => c.fixable && c.status !== 'pass');
        for (const check of fixableChecks) {
            await applyFix(check.fix_id);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    const StatusIcon = ({ status }) => {
        if (status === 'pass') return <CheckCircle2 size={18} className="text-emerald-500" />;
        if (status === 'fail') return <XCircle size={18} className="text-red-500" />;
        return <AlertCircle size={18} className="text-amber-500" />;
    };

    const fixableFailCount = auditData?.checks?.filter(c => c.fixable && c.status !== 'pass').length || 0;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <ShieldCheck size={20} />
                        </div>
                        {t('securityPage.title')}
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">{t('securityPage.subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    {activeTab === 'settings' && (
                        <>
                            <button
                                onClick={fetchSettings}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-gray-600 transition-colors"
                            >
                                <RefreshCw size={14} />
                                {t('securityPage.refresh')}
                            </button>
                            <button
                                onClick={saveSettings}
                                disabled={!dirty || saving}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${dirty
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {saving ? t('securityPage.saving') : t('securityPage.saveChanges')}
                            </button>
                        </>
                    )}
                    {activeTab === 'audit' && (
                        <>
                            <button
                                onClick={runAudit}
                                disabled={auditLoading}
                                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-indigo-200"
                            >
                                {auditLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                                {auditLoading ? '점검 중...' : '보안 점검 실행'}
                            </button>
                            {fixableFailCount > 0 && (
                                <button
                                    onClick={fixAll}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-emerald-200"
                                >
                                    <Wrench size={14} />
                                    전체 자동 수정 ({fixableFailCount})
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {lastSaved && activeTab === 'settings' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-700 font-medium flex items-center gap-2">
                    <ShieldCheck size={14} />
                    {t('securityPage.lastSaved')} {lastSaved.toLocaleTimeString()}
                </div>
            )}

            {/* Tab Switcher */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Shield size={14} />
                        보안 설정
                    </div>
                </button>
                <button
                    onClick={() => { setActiveTab('audit'); if (!auditData) runAudit(); }}
                    className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'audit'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Activity size={14} />
                        서버 보안 점검
                        {auditData && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${auditData.summary.failed > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {auditData.summary.grade}
                            </span>
                        )}
                    </div>
                </button>
            </div>

            {/* ═══ TAB: Settings ═══ */}
            {activeTab === 'settings' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {Object.entries(SETTINGS_META).map(([key, meta]) => {
                            const Icon = meta.icon;
                            const isOn = settings[key] === '1';
                            const isDanger = meta.danger;

                            return (
                                <div
                                    key={key}
                                    className={`bg-white rounded-2xl border p-5 transition-all duration-300 ${isDanger && isOn
                                        ? 'border-red-200 bg-red-50/30 shadow-sm shadow-red-100'
                                        : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3.5 flex-1">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDanger && isOn
                                                ? 'bg-red-100 text-red-600'
                                                : isOn
                                                    ? 'bg-emerald-100 text-emerald-600'
                                                    : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                                    {t(`securityPage.${meta.labelKey}`)}
                                                    {isDanger && isOn && (
                                                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{t('securityPage.danger')}</span>
                                                    )}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{t(`securityPage.${meta.descKey}`)}</p>
                                            </div>
                                        </div>

                                        {meta.type === 'toggle' ? (
                                            <button
                                                onClick={() => handleToggle(key)}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${isOn
                                                    ? isDanger
                                                        ? 'bg-red-500'
                                                        : 'bg-emerald-500'
                                                    : 'bg-gray-300'
                                                    }`}
                                            >
                                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${isOn ? 'left-[26px]' : 'left-0.5'
                                                    }`} />
                                            </button>
                                        ) : (
                                            <input
                                                type="number"
                                                value={settings[key] || ''}
                                                onChange={(e) => handleNumber(key, e.target.value)}
                                                min={meta.min}
                                                max={meta.max}
                                                className="w-20 px-3 py-1.5 text-sm font-bold text-center bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Security Status */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Shield size={18} />
                            {t('securityPage.securitySummary')}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { label: 'HTTPS', active: settings.force_https === '1' },
                                { label: t('securityPage.ipBlock'), active: settings.block_suspicious_ips === '1' },
                                { label: t('securityPage.apiLimit'), active: settings.enable_api_rate_limit === '1' },
                                { label: t('securityPage.maintenanceLabel'), active: settings.maintenance_mode === '1', warn: true },
                                { label: t('securityPage.devtoolsLabel'), active: settings.disable_devtools_block === '1', warn: true },
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${item.active
                                    ? item.warn
                                        ? 'bg-red-500/20 text-red-300'
                                        : 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-white/10 text-gray-400'
                                    }`}>
                                    {item.active
                                        ? item.warn ? <ShieldOff size={14} /> : <ShieldCheck size={14} />
                                        : <ShieldOff size={14} />
                                    }
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* ═══ TAB: Audit ═══ */}
            {activeTab === 'audit' && (
                <>
                    {auditLoading && !auditData && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 size={32} className="animate-spin text-indigo-500" />
                            <p className="text-gray-500 font-medium">서버 보안 점검 중...</p>
                        </div>
                    )}

                    {auditData && (
                        <>
                            {/* Score Card */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className={`col-span-1 md:col-span-1 rounded-2xl border p-6 flex flex-col items-center justify-center gap-2 ${GRADE_CONFIG[auditData.summary.grade]?.bg || 'bg-gray-50'}`}>
                                    <span className={`text-6xl font-black ${GRADE_CONFIG[auditData.summary.grade]?.color || 'text-gray-500'}`}>
                                        {auditData.summary.grade}
                                    </span>
                                    <span className="text-sm font-bold text-gray-600">{GRADE_CONFIG[auditData.summary.grade]?.label}</span>
                                    <span className="text-2xl font-extrabold text-gray-900">{auditData.summary.score}점</span>
                                </div>
                                <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-4">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-1">
                                        <CheckCircle2 size={24} className="text-emerald-500" />
                                        <span className="text-3xl font-black text-emerald-600">{auditData.summary.passed}</span>
                                        <span className="text-xs font-medium text-gray-400">통과</span>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-1">
                                        <XCircle size={24} className="text-red-500" />
                                        <span className="text-3xl font-black text-red-600">{auditData.summary.failed}</span>
                                        <span className="text-xs font-medium text-gray-400">실패</span>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-1">
                                        <AlertCircle size={24} className="text-amber-500" />
                                        <span className="text-3xl font-black text-amber-600">{auditData.summary.warned}</span>
                                        <span className="text-xs font-medium text-gray-400">경고</span>
                                    </div>
                                </div>
                            </div>

                            {/* Audit Items */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                    <Search size={18} />
                                    점검 항목 ({auditData.checks.length}개)
                                </h3>
                                {auditData.checks.map((check, idx) => {
                                    const sev = SEVERITY_CONFIG[check.severity] || SEVERITY_CONFIG.medium;
                                    return (
                                        <div
                                            key={idx}
                                            className={`bg-white rounded-2xl border p-5 transition-all ${check.status === 'fail' ? 'border-red-200 shadow-sm shadow-red-50' : check.status === 'warn' ? 'border-amber-200' : 'border-gray-100'}`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="mt-0.5">
                                                        <StatusIcon status={check.status} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="font-bold text-gray-900 text-sm">{check.title}</h4>
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${sev.badge}`}>
                                                                {sev.label}
                                                            </span>
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${check.status === 'pass' ? 'bg-emerald-100 text-emerald-700' : check.status === 'fail' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                {check.status === 'pass' ? '통과' : check.status === 'fail' ? '실패' : '경고'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-0.5">{check.description}</p>
                                                        <p className={`text-xs mt-1.5 font-medium ${check.status === 'pass' ? 'text-emerald-600' : check.status === 'fail' ? 'text-red-600' : 'text-amber-600'}`}>
                                                            {check.detail}
                                                        </p>
                                                    </div>
                                                </div>
                                                {check.fixable && check.status !== 'pass' && (
                                                    <button
                                                        onClick={() => applyFix(check.fix_id)}
                                                        disabled={fixingItems[check.fix_id]}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex-shrink-0 disabled:opacity-50"
                                                    >
                                                        {fixingItems[check.fix_id] ? (
                                                            <Loader2 size={12} className="animate-spin" />
                                                        ) : (
                                                            <Wrench size={12} />
                                                        )}
                                                        {fixingItems[check.fix_id] ? '수정 중...' : '자동 수정'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Audit timestamp */}
                            <div className="text-center text-xs text-gray-400 mt-4">
                                마지막 점검: {auditData.timestamp}
                            </div>
                        </>
                    )}

                    {!auditLoading && !auditData && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                                <Shield size={32} className="text-indigo-500" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">서버 보안 점검</h3>
                            <p className="text-sm text-gray-500 text-center max-w-md">
                                서버의 보안 상태를 자동으로 점검합니다.<br />
                                .htaccess 보호, 파일 업로드 보안, SQL Injection 방어 등을 확인합니다.
                            </p>
                            <button
                                onClick={runAudit}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-200 mt-2"
                            >
                                <Search size={16} />
                                보안 점검 시작
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminSecurity;

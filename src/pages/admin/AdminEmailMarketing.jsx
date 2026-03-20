import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Mail, Send, Eye, Users, ShoppingBag, Building, Truck, Image, Link2,
    Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, ChevronDown,
    FileText, BarChart3, Sparkles, TestTube, Loader2, Filter
} from 'lucide-react';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const AdminEmailMarketing = () => {
    const { t } = useTranslation('common');

    // Compose tab state
    const [subject, setSubject] = useState('');
    const [htmlBody, setHtmlBody] = useState('');
    const [ctaText, setCtaText] = useState('');
    const [ctaUrl, setCtaUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [targetRole, setTargetRole] = useState('all');
    const [showPreview, setShowPreview] = useState(false);

    // Campaign history
    const [campaigns, setCampaigns] = useState([]);
    const [recipientCounts, setRecipientCounts] = useState({});
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [activeTab, setActiveTab] = useState('compose');

    // Toast
    const [toast, setToast] = useState(null);
    const showToast = (msg, type = 'success') => setToast({ message: msg, type });

    // Fetch campaign history + recipient counts
    const fetchCampaigns = () => {
        setLoading(true);
        fetch(`${API_BASE}/email/get_campaigns.php`, { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setCampaigns(data.campaigns || []);
                    setRecipientCounts(data.recipient_counts || {});
                }
            })
            .catch(() => showToast('데이터 로드 실패', 'error'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCampaigns(); }, []);

    const currentRecipientCount = recipientCounts[targetRole] ?? 0;

    // Send email
    const handleSend = (testOnly = false) => {
        if (!subject.trim() || !htmlBody.trim()) {
            showToast('제목과 내용을 입력해주세요.', 'error');
            return;
        }
        if (!testOnly && currentRecipientCount === 0) {
            showToast('수신 대상이 없습니다.', 'error');
            return;
        }
        if (!testOnly && !window.confirm(`정말 ${currentRecipientCount}명에게 메일을 발송하시겠습니까?`)) return;

        setSending(true);
        fetch(`${API_BASE}/email/send_marketing_email.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                subject,
                html_body: htmlBody,
                cta_text: ctaText,
                cta_url: ctaUrl,
                image_url: imageUrl,
                target_role: targetRole,
                test_only: testOnly
            })
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    showToast(data.message, 'success');
                    if (!testOnly) {
                        fetchCampaigns();
                        setSubject('');
                        setHtmlBody('');
                        setCtaText('');
                        setCtaUrl('');
                        setImageUrl('');
                    }
                } else {
                    showToast(data.message || '발송 실패', 'error');
                }
            })
            .catch(() => showToast('네트워크 오류', 'error'))
            .finally(() => setSending(false));
    };

    // Preview HTML
    const previewHtml = useMemo(() => {
        let img = '';
        if (imageUrl) {
            img = `<div style="text-align:center; margin:20px 0;"><img src="${imageUrl}" alt="img" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);" /></div>`;
        }
        let cta = '';
        if (ctaUrl && ctaText) {
            cta = `<div style="text-align:center; padding:24px 0;"><a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;">${ctaText}</a></div>`;
        }
        return `
            <div style="background:#f5f5f7;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899);padding:28px 40px;text-align:center;">
                        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">SpaceMatch</h1>
                    </div>
                    <div style="padding:32px 40px;">
                        <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;font-weight:700;">${subject || '(제목 없음)'}</h2>
                        ${img}
                        <div style="color:#555;font-size:15px;line-height:1.8;">${htmlBody || '<p style="color:#ccc;">내용을 입력해주세요...</p>'}</div>
                    </div>
                    ${cta}
                    <div style="padding:16px 40px;border-top:1px solid rgba(0,0,0,0.08);text-align:center;">
                        <p style="margin:0;color:#999;font-size:11px;">
                            <a href="#" style="color:#999;text-decoration:underline;">수신 거부</a> | SpaceMatch 마케팅 메일
                        </p>
                    </div>
                </div>
            </div>
        `;
    }, [subject, htmlBody, ctaText, ctaUrl, imageUrl]);

    const roleOptions = [
        { value: 'all', label: '전체', icon: Users },
        { value: 'seller', label: '셀러', icon: ShoppingBag },
        { value: 'host', label: '호스트', icon: Building },
        { value: 'vendor', label: '벤더', icon: Truck },
    ];

    const formatDate = (dateStr) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        } catch { return dateStr; }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-200">
                        <Mail size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">이메일 마케팅</h1>
                        <p className="text-sm text-gray-500 mt-1">이메일 인증 완료 고객에게 광고 메일을 발송합니다</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('compose')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'compose'
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    <FileText size={16} />
                    메일 작성
                </button>
                <button
                    onClick={() => { setActiveTab('history'); fetchCampaigns(); }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'history'
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    <BarChart3 size={16} />
                    발송 이력
                    {campaigns.length > 0 && (
                        <span className="bg-white/20 text-[11px] px-1.5 py-0.5 rounded-md">{campaigns.length}</span>
                    )}
                </button>
            </div>

            {/* ──────── COMPOSE TAB ──────── */}
            {activeTab === 'compose' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Left: Editor */}
                    <div className="space-y-5">
                        {/* Subject */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                            <label className="text-xs font-bold text-gray-500 block mb-2">📌 메일 제목</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                placeholder="예: SpaceMatch 3월 특별 프로모션 안내"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 font-medium text-sm transition-all"
                            />
                        </div>

                        {/* Image URL */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                            <label className="text-xs font-bold text-gray-500 block mb-2 flex items-center gap-1.5">
                                <Image size={12} /> 이미지 URL (선택)
                            </label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 font-medium text-sm transition-all"
                            />
                            {imageUrl && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
                                    <img src={imageUrl} alt="preview" className="w-full h-auto max-h-48 object-cover" onError={e => e.target.style.display = 'none'} />
                                </div>
                            )}
                        </div>

                        {/* HTML Body */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                            <label className="text-xs font-bold text-gray-500 block mb-2">📝 메일 내용 (HTML 지원)</label>
                            <textarea
                                value={htmlBody}
                                onChange={e => setHtmlBody(e.target.value)}
                                rows={12}
                                placeholder={`<h3>SpaceMatch 프로모션 안내</h3>\n<p>안녕하세요!</p>\n<p>새로운 공간이 등록되었습니다.</p>\n\n<p>HTML 태그를 사용하여 <strong>굵은 글씨</strong>, <em>기울임</em>, <a href="#">링크</a> 등을 자유롭게 활용하세요.</p>`}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 text-sm font-mono leading-relaxed transition-all resize-y"
                            />
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {[
                                    { label: '<b>굵게</b>', code: '<strong>텍스트</strong>' },
                                    { label: '<i>기울임</i>', code: '<em>텍스트</em>' },
                                    { label: '🔗 링크', code: '<a href="URL">텍스트</a>' },
                                    { label: '📋 목록', code: '<ul><li>항목1</li><li>항목2</li></ul>' },
                                    { label: '--- 구분선', code: '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;">' },
                                ].map((btn, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setHtmlBody(prev => prev + '\n' + btn.code)}
                                        className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-500 transition-colors"
                                        dangerouslySetInnerHTML={{ __html: btn.label }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                            <label className="text-xs font-bold text-gray-500 block mb-2 flex items-center gap-1.5">
                                <Link2 size={12} /> CTA 버튼 (선택)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={ctaText}
                                    onChange={e => setCtaText(e.target.value)}
                                    placeholder="버튼 텍스트 (예: 자세히 보기)"
                                    className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-sm"
                                />
                                <input
                                    type="url"
                                    value={ctaUrl}
                                    onChange={e => setCtaUrl(e.target.value)}
                                    placeholder="https://spacematch.net/..."
                                    className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-sm"
                                />
                            </div>
                        </div>

                        {/* Target & Send */}
                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200 p-5">
                            <label className="text-xs font-bold text-gray-600 block mb-3 flex items-center gap-1.5">
                                <Filter size={12} /> 수신 대상
                            </label>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {roleOptions.map(opt => {
                                    const Icon = opt.icon;
                                    const cnt = recipientCounts[opt.value] ?? 0;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => setTargetRole(opt.value)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${targetRole === opt.value
                                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300'
                                                }`}
                                        >
                                            <Icon size={14} />
                                            {opt.label}
                                            <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${targetRole === opt.value ? 'bg-white/20' : 'bg-gray-100'}`}>
                                                {cnt}명
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-white/60 rounded-xl">
                                <Sparkles size={14} className="text-violet-500" />
                                <span className="text-xs font-bold text-gray-700">
                                    이메일 인증 완료 + 수신 동의 사용자: <span className="text-violet-600 text-sm">{currentRecipientCount}명</span>
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleSend(true)}
                                    disabled={sending}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-violet-300 text-violet-600 rounded-xl font-bold text-sm hover:bg-violet-50 disabled:opacity-50 transition-all"
                                >
                                    {sending ? <Loader2 size={16} className="animate-spin" /> : <TestTube size={16} />}
                                    테스트 발송
                                </button>
                                <button
                                    onClick={() => handleSend(false)}
                                    disabled={sending || currentRecipientCount === 0}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg shadow-violet-200"
                                >
                                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    전체 발송 ({currentRecipientCount}명)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Preview */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <Eye size={16} className="text-violet-500" />
                                실시간 미리보기
                            </div>
                            <span className="text-[11px] text-gray-400">SpaceMatch 브랜드 템플릿</span>
                        </div>
                        <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                            <iframe
                                srcDoc={previewHtml}
                                className="w-full border-0"
                                style={{ minHeight: '600px', height: '100%' }}
                                title="Email Preview"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ──────── HISTORY TAB ──────── */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                            <Clock size={20} className="text-violet-500" />
                            발송 이력
                        </h2>
                        <button
                            onClick={fetchCampaigns}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors"
                        >
                            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                            새로고침
                        </button>
                    </div>

                    {campaigns.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Mail size={28} className="text-gray-300" />
                            </div>
                            <p className="text-sm font-bold text-gray-400">발송 이력이 없습니다</p>
                            <p className="text-xs text-gray-300 mt-1">첫 번째 마케팅 메일을 발송해보세요</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {campaigns.map(c => {
                                const successRate = c.total_recipients > 0 ? Math.round((c.sent_count / c.total_recipients) * 100) : 0;
                                const roleLabel = c.target_role === 'all' ? '전체' : c.target_role === 'seller' ? '셀러' : c.target_role === 'host' ? '호스트' : '벤더';
                                return (
                                    <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="px-2 py-0.5 bg-violet-50 text-violet-600 border border-violet-200 rounded-md text-[10px] font-extrabold">
                                                        {roleLabel}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${c.sent_count > 0
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                        : 'bg-gray-50 text-gray-400 border border-gray-200'
                                                        }`}>
                                                        {c.sent_count > 0 ? '완료' : '대기'}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-900 truncate">{c.subject}</h3>
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                                    <Clock size={10} />
                                                    {formatDate(c.created_at)}
                                                    {c.sender_name && (
                                                        <span className="text-gray-300">• {c.sender_name}</span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <div className="text-center">
                                                    <p className="text-lg font-extrabold text-gray-900">{c.total_recipients}</p>
                                                    <p className="text-[10px] font-bold text-gray-400">대상</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-lg font-extrabold text-emerald-600">{c.sent_count}</p>
                                                    <p className="text-[10px] font-bold text-gray-400">성공</p>
                                                </div>
                                                {c.failed_count > 0 && (
                                                    <div className="text-center">
                                                        <p className="text-lg font-extrabold text-red-500">{c.failed_count}</p>
                                                        <p className="text-[10px] font-bold text-gray-400">실패</p>
                                                    </div>
                                                )}
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center">
                                                    <span className="text-sm font-extrabold text-violet-600">{successRate}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminEmailMarketing;

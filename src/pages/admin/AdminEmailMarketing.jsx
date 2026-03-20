import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Mail, Send, Eye, Users, ShoppingBag, Building, Truck, Image, Link2,
    Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw,
    FileText, BarChart3, Sparkles, TestTube, Loader2, Filter,
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered, Type, Palette, Heading1, Heading2, Minus, Upload, ImagePlus
} from 'lucide-react';
import Toast from '../../components/Toast';

const API_BASE = '/api';

/* ─────────────── WYSIWYG Toolbar Button ─────────────── */
const ToolBtn = ({ icon: Icon, label, active, onClick, disabled, className = '' }) => (
    <button
        type="button"
        onMouseDown={e => { e.preventDefault(); onClick?.(); }}
        disabled={disabled}
        title={label}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${active
            ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            } disabled:opacity-30 ${className}`}
    >
        <Icon size={15} />
    </button>
);

const AdminEmailMarketing = () => {
    const { t } = useTranslation('common');

    // Compose state
    const [subject, setSubject] = useState('');
    const [ctaText, setCtaText] = useState('');
    const [ctaUrl, setCtaUrl] = useState('');
    const [targetRole, setTargetRole] = useState('all');

    // WYSIWYG editor
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [editorHtml, setEditorHtml] = useState('');
    const [uploading, setUploading] = useState(false);

    // Campaign history
    const [campaigns, setCampaigns] = useState([]);
    const [recipientCounts, setRecipientCounts] = useState({});
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [activeTab, setActiveTab] = useState('compose');

    // Toast
    const [toast, setToast] = useState(null);
    const showToast = (msg, type = 'success') => setToast({ message: msg, type });

    // ─── Editor Commands ───
    const execCmd = useCallback((cmd, value = null) => {
        document.execCommand(cmd, false, value);
        editorRef.current?.focus();
        syncEditorHtml();
    }, []);

    const syncEditorHtml = useCallback(() => {
        if (editorRef.current) {
            setEditorHtml(editorRef.current.innerHTML);
        }
    }, []);

    const handleFormat = (cmd) => execCmd(cmd);

    const handleHeading = (level) => {
        execCmd('formatBlock', `<h${level}>`);
    };

    const handleColor = (color) => {
        execCmd('foreColor', color);
    };

    const handleLink = () => {
        const url = prompt('링크 URL을 입력하세요:', 'https://');
        if (url) execCmd('createLink', url);
    };

    const handleHR = () => {
        execCmd('insertHTML', '<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">');
    };

    // ─── Image Upload ───
    const handleImageUpload = async (file) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            showToast('이미지 크기는 5MB 이하여야 합니다.', 'error');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${API_BASE}/email/upload_image.php`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                const imgHtml = `<div style="text-align:center;margin:16px 0;"><img src="${data.full_url || data.url}" alt="uploaded" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);" /></div>`;
                execCmd('insertHTML', imgHtml);
                showToast('이미지가 삽입되었습니다.', 'success');
            } else {
                showToast(data.message || '이미지 업로드 실패', 'error');
            }
        } catch {
            showToast('이미지 업로드 중 오류 발생', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleImageBtnClick = () => fileInputRef.current?.click();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
        e.target.value = '';
    };

    // ─── Paste handler (clean up pasted content, handle pasted images) ───
    const handlePaste = (e) => {
        const items = e.clipboardData?.items;
        if (items) {
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) handleImageUpload(file);
                    return;
                }
            }
        }
        // Let text paste through normally
        setTimeout(syncEditorHtml, 10);
    };

    // ─── Drop handler ───
    const handleDrop = (e) => {
        const files = e.dataTransfer?.files;
        if (files?.length) {
            for (const file of files) {
                if (file.type.startsWith('image/')) {
                    e.preventDefault();
                    handleImageUpload(file);
                    return;
                }
            }
        }
    };

    // ─── Fetch campaigns ───
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

    // ─── Send email ───
    const handleSend = (testOnly = false) => {
        const body = editorRef.current?.innerHTML || '';
        if (!subject.trim() || !body.trim() || body === '<br>') {
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
                html_body: body,
                cta_text: ctaText,
                cta_url: ctaUrl,
                image_url: '',
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
                        if (editorRef.current) editorRef.current.innerHTML = '';
                        setEditorHtml('');
                        setCtaText('');
                        setCtaUrl('');
                    }
                } else {
                    showToast(data.message || '발송 실패', 'error');
                }
            })
            .catch(() => showToast('네트워크 오류', 'error'))
            .finally(() => setSending(false));
    };

    // ─── Preview HTML ───
    const previewHtml = useMemo(() => {
        const body = editorHtml || '';
        let cta = '';
        if (ctaUrl && ctaText) {
            cta = `<div style="text-align:center;padding:24px 0;"><a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;">${ctaText}</a></div>`;
        }
        return `
            <div style="background:#f5f5f7;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899);padding:28px 40px;text-align:center;">
                        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">SpaceMatch</h1>
                    </div>
                    <div style="padding:32px 40px;">
                        <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;font-weight:700;">${subject || '(제목 없음)'}</h2>
                        <div style="color:#555;font-size:15px;line-height:1.8;">${body || '<p style="color:#ccc;">내용을 입력해주세요...</p>'}</div>
                    </div>
                    ${cta}
                    <div style="padding:16px 40px;border-top:1px solid rgba(0,0,0,0.08);text-align:center;">
                        <p style="margin:0;color:#999;font-size:11px;"><a href="#" style="color:#999;text-decoration:underline;">수신 거부</a> | SpaceMatch 마케팅 메일</p>
                    </div>
                </div>
            </div>`;
    }, [subject, editorHtml, ctaText, ctaUrl]);

    const roleOptions = [
        { value: 'all', label: '전체', icon: Users },
        { value: 'seller', label: '셀러', icon: ShoppingBag },
        { value: 'host', label: '호스트', icon: Building },
        { value: 'vendor', label: '벤더', icon: Truck },
    ];

    const colorPalette = ['#1a1a2e', '#e74c3c', '#e67e22', '#f1c40f', '#27ae60', '#3498db', '#8e44ad', '#ec4899'];

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        } catch { return dateStr; }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-200">
                        <Mail size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">이메일 마케팅</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">이메일 인증 완료 고객에게 광고 메일을 발송합니다</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button onClick={() => setActiveTab('compose')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'compose' ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 border border-gray-200 dark:border-gray-700'}`}>
                    <FileText size={16} /> 메일 작성
                </button>
                <button onClick={() => { setActiveTab('history'); fetchCampaigns(); }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 border border-gray-200 dark:border-gray-700'}`}>
                    <BarChart3 size={16} /> 발송 이력
                    {campaigns.length > 0 && <span className="bg-white/20 text-[11px] px-1.5 py-0.5 rounded-md">{campaigns.length}</span>}
                </button>
            </div>

            {/* ═════════ COMPOSE TAB ═════════ */}
            {activeTab === 'compose' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Left: Editor */}
                    <div className="space-y-5">
                        {/* Subject */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2">📌 메일 제목</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                                placeholder="예: SpaceMatch 3월 특별 프로모션 안내"
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 font-medium text-sm bg-white dark:bg-gray-700 dark:text-white transition-all" />
                        </div>

                        {/* ═══ WYSIWYG Editor ═══ */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                                {/* Text formatting group */}
                                <ToolBtn icon={Bold} label="굵게" onClick={() => handleFormat('bold')} />
                                <ToolBtn icon={Italic} label="기울임" onClick={() => handleFormat('italic')} />
                                <ToolBtn icon={Underline} label="밑줄" onClick={() => handleFormat('underline')} />
                                <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />

                                {/* Headings */}
                                <ToolBtn icon={Heading1} label="제목1" onClick={() => handleHeading(2)} />
                                <ToolBtn icon={Heading2} label="제목2" onClick={() => handleHeading(3)} />
                                <ToolBtn icon={Type} label="본문" onClick={() => execCmd('formatBlock', '<p>')} />
                                <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />

                                {/* Alignment */}
                                <ToolBtn icon={AlignLeft} label="왼쪽정렬" onClick={() => handleFormat('justifyLeft')} />
                                <ToolBtn icon={AlignCenter} label="가운데정렬" onClick={() => handleFormat('justifyCenter')} />
                                <ToolBtn icon={AlignRight} label="오른쪽정렬" onClick={() => handleFormat('justifyRight')} />
                                <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />

                                {/* Lists */}
                                <ToolBtn icon={List} label="글머리 기호" onClick={() => handleFormat('insertUnorderedList')} />
                                <ToolBtn icon={ListOrdered} label="번호 매기기" onClick={() => handleFormat('insertOrderedList')} />
                                <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />

                                {/* Link & HR */}
                                <ToolBtn icon={Link2} label="링크 삽입" onClick={handleLink} />
                                <ToolBtn icon={Minus} label="구분선" onClick={handleHR} />
                                <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />

                                {/* Image */}
                                <button
                                    type="button"
                                    onMouseDown={e => { e.preventDefault(); handleImageBtnClick(); }}
                                    disabled={uploading}
                                    title="이미지 삽입"
                                    className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-bold text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all disabled:opacity-50"
                                >
                                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={15} />}
                                    <span className="hidden sm:inline">이미지</span>
                                </button>
                                <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />

                                {/* Colors */}
                                <div className="flex items-center gap-0.5">
                                    <Palette size={13} className="text-gray-400 mr-0.5" />
                                    {colorPalette.map(c => (
                                        <button key={c} type="button"
                                            onMouseDown={e => { e.preventDefault(); handleColor(c); }}
                                            className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600 hover:scale-125 transition-transform"
                                            style={{ background: c }}
                                            title={c}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Editable area */}
                            <div
                                ref={editorRef}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={syncEditorHtml}
                                onPaste={handlePaste}
                                onDrop={handleDrop}
                                className="min-h-[320px] max-h-[500px] overflow-y-auto px-5 py-4 text-sm text-gray-800 dark:text-gray-200 leading-relaxed outline-none prose prose-sm max-w-none
                                    [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-2 [&_h2]:mt-4
                                    [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mb-2 [&_h3]:mt-3
                                    [&_p]:mb-2 [&_a]:text-violet-600 [&_a]:underline
                                    [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                                    [&_li]:mb-1 [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-3 [&_img]:mx-auto [&_img]:max-w-full
                                    [&_hr]:my-4 [&_hr]:border-gray-200"
                                data-placeholder="여기에 메일 내용을 작성하세요. 텍스트를 입력하고 툴바를 사용하여 서식을 적용할 수 있습니다. 이미지는 드래그 앤 드롭 또는 클립보드에서 붙여넣기도 가능합니다."
                                style={{ minHeight: 320 }}
                            />
                            {uploading && (
                                <div className="px-5 py-2 bg-violet-50 dark:bg-violet-900/20 border-t border-violet-200 dark:border-violet-800 flex items-center gap-2 text-xs font-bold text-violet-600">
                                    <Loader2 size={12} className="animate-spin" /> 이미지 업로드 중...
                                </div>
                            )}
                            {/* Placeholder CSS */}
                            <style>{`
                                [contenteditable]:empty:before {
                                    content: attr(data-placeholder);
                                    color: #9ca3af;
                                    pointer-events: none;
                                    display: block;
                                }
                            `}</style>
                        </div>

                        {/* CTA Button */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2 flex items-center gap-1.5">
                                <Link2 size={12} /> CTA 버튼 (선택)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" value={ctaText} onChange={e => setCtaText(e.target.value)}
                                    placeholder="버튼 텍스트 (예: 자세히 보기)"
                                    className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-sm bg-white dark:bg-gray-700 dark:text-white" />
                                <input type="url" value={ctaUrl} onChange={e => setCtaUrl(e.target.value)}
                                    placeholder="https://spacematch.net/..."
                                    className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-sm bg-white dark:bg-gray-700 dark:text-white" />
                            </div>
                        </div>

                        {/* Target & Send */}
                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-2xl border border-violet-200 dark:border-violet-800 p-5">
                            <label className="text-xs font-bold text-gray-600 dark:text-gray-400 block mb-3 flex items-center gap-1.5">
                                <Filter size={12} /> 수신 대상
                            </label>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {roleOptions.map(opt => {
                                    const Icon = opt.icon;
                                    const cnt = recipientCounts[opt.value] ?? 0;
                                    return (
                                        <button key={opt.value} onClick={() => setTargetRole(opt.value)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${targetRole === opt.value
                                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-300'}`}>
                                            <Icon size={14} />
                                            {opt.label}
                                            <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${targetRole === opt.value ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>{cnt}명</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                                <Sparkles size={14} className="text-violet-500" />
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    수신 대상: <span className="text-violet-600 text-sm">{currentRecipientCount}명</span>
                                    <span className="text-gray-400 ml-1">(이메일 인증 + 수신 동의)</span>
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleSend(true)} disabled={sending}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-800 border-2 border-violet-300 dark:border-violet-700 text-violet-600 rounded-xl font-bold text-sm hover:bg-violet-50 dark:hover:bg-violet-900/20 disabled:opacity-50 transition-all">
                                    {sending ? <Loader2 size={16} className="animate-spin" /> : <TestTube size={16} />}
                                    테스트 발송
                                </button>
                                <button onClick={() => handleSend(false)} disabled={sending || currentRecipientCount === 0}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg shadow-violet-200">
                                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    전체 발송 ({currentRecipientCount}명)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Preview */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                <Eye size={16} className="text-violet-500" /> 실시간 미리보기
                            </div>
                            <span className="text-[11px] text-gray-400">SpaceMatch 브랜드 템플릿</span>
                        </div>
                        <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                            <iframe srcDoc={previewHtml} className="w-full border-0" style={{ minHeight: 600, height: '100%' }} title="Preview" />
                        </div>
                    </div>
                </div>
            )}

            {/* ═════════ HISTORY TAB ═════════ */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
                            <Clock size={20} className="text-violet-500" /> 발송 이력
                        </h2>
                        <button onClick={fetchCampaigns} disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 transition-colors">
                            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> 새로고침
                        </button>
                    </div>

                    {campaigns.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                                    <div key={c.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="px-2 py-0.5 bg-violet-50 dark:bg-violet-900/30 text-violet-600 border border-violet-200 dark:border-violet-700 rounded-md text-[10px] font-extrabold">{roleLabel}</span>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${c.sent_count > 0
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-200 dark:border-emerald-700'
                                                        : 'bg-gray-50 dark:bg-gray-700 text-gray-400 border border-gray-200 dark:border-gray-600'}`}>
                                                        {c.sent_count > 0 ? '완료' : '대기'}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{c.subject}</h3>
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                                    <Clock size={10} /> {formatDate(c.created_at)}
                                                    {c.sender_name && <span className="text-gray-300">• {c.sender_name}</span>}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <div className="text-center">
                                                    <p className="text-lg font-extrabold text-gray-900 dark:text-white">{c.total_recipients}</p>
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
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
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

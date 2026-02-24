import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
    MessageCircle, Send, Search, ArrowLeft, X, User, Clock,
    Globe, Check, CheckCheck, FileText, Download, Paperclip, Headphones
} from 'lucide-react';
import { COUNTRY_FLAGS } from '../../components/CountryBadge';

const API_BASE = '/api';
const POLL_INTERVAL = 5000;

const AdminCS = () => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation('chat');

    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [mobileShowMessages, setMobileShowMessages] = useState(false);

    const messagesEndRef = useRef(null);
    const lastMsgIdRef = useRef(0);
    const pollRef = useRef(null);
    const inputRef = useRef(null);

    // Fetch CS conversations
    const fetchConversations = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/chat/conversations.php?type=cs`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setConversations(data.conversations || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    const fetchMessages = useCallback(async (convId, isPolling = false) => {
        if (!convId) return;
        try {
            const afterParam = isPolling && lastMsgIdRef.current > 0 ? `&after_id=${lastMsgIdRef.current}` : '';
            const res = await fetch(`${API_BASE}/chat/messages.php?conversation_id=${convId}${afterParam}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success && data.messages?.length > 0) {
                if (isPolling) setMessages(prev => [...prev, ...data.messages]);
                else setMessages(data.messages);
                const maxId = Math.max(...data.messages.map(m => parseInt(m.id)));
                lastMsgIdRef.current = maxId;
            } else if (!isPolling) setMessages([]);
        } catch (e) { console.error(e); }
    }, []);

    const markAsRead = useCallback(async (convId) => {
        try {
            await fetch(`${API_BASE}/chat/messages.php`, {
                method: 'PUT', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation_id: convId })
            });
        } catch (e) { /* ignore */ }
    }, []);

    useEffect(() => { fetchConversations(); }, [fetchConversations]);

    const selectConv = (conv) => {
        setActiveConv(conv);
        setMobileShowMessages(true);
        lastMsgIdRef.current = 0;
        fetchMessages(conv.id);
        markAsRead(conv.id);
    };

    useEffect(() => {
        if (!activeConv) return;
        pollRef.current = setInterval(() => {
            fetchMessages(activeConv.id, true);
            fetchConversations();
        }, POLL_INTERVAL);
        return () => clearInterval(pollRef.current);
    }, [activeConv, fetchMessages, fetchConversations]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || !activeConv || sending) return;
        const text = inputText.trim();
        setInputText('');
        setSending(true);
        try {
            const res = await fetch(`${API_BASE}/chat/messages.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation_id: activeConv.id, text })
            });
            const data = await res.json();
            if (data.success) {
                setMessages(prev => [...prev, data.message]);
                lastMsgIdRef.current = parseInt(data.message.id);
                fetchConversations();
            }
        } catch (e) { console.error(e); }
        finally { setSending(false); inputRef.current?.focus(); }
    };

    const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = (now - d) / 1000;
        if (diff < 60) return t('justNow');
        if (diff < 3600) return t('minutesAgo', { count: Math.floor(diff / 60) });
        if (diff < 86400) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString();
    };

    const getDisplayText = (msg) => {
        if (!msg.translated_texts || Object.keys(msg.translated_texts).length === 0) return msg.original_text;
        if (String(msg.sender_id) === String(user.id)) return msg.original_text;
        const viewerLang = user?.country || i18n.language || 'ko';
        return msg.translated_texts[viewerLang] || msg.original_text;
    };

    const filteredConvs = conversations.filter(c =>
        !searchTerm || c.other_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-100px)] lg:h-[calc(100vh-80px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Headphones size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-gray-900">{t('csTitle')}</h1>
                    <p className="text-xs text-gray-500">{t('csSubtitle')}</p>
                </div>
                <span className="ml-auto text-sm font-bold text-gray-400">{conversations.length} {t('csInquiries')}</span>
            </div>

            {/* Main */}
            <div className="flex-1 flex bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden min-h-0">
                {/* List */}
                <div className={`w-full lg:w-80 border-r border-gray-100 flex flex-col ${mobileShowMessages ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder={t('searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 border-none" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-6 h-6 border-2 border-teal-200 border-t-teal-500 rounded-full animate-spin" />
                            </div>
                        ) : filteredConvs.length > 0 ? filteredConvs.map(conv => {
                            const isActive = activeConv?.id === conv.id;
                            const unread = parseInt(conv.unread_count || 0);
                            const flag = COUNTRY_FLAGS[conv.other_country];
                            return (
                                <div key={conv.id} onClick={() => selectConv(conv)}
                                    className={`flex items-center gap-3 p-3.5 cursor-pointer transition-all rounded-2xl mx-2 my-1 ${isActive ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 shadow-sm' : 'hover:bg-gray-50'}`}>
                                    <div className="relative flex-shrink-0">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white font-bold overflow-hidden">
                                            {conv.other_profile_image ? <img src={conv.other_profile_image} alt="" className="w-full h-full object-cover" /> : conv.other_name?.[0] || '?'}
                                        </div>
                                        {flag && <span className="absolute -bottom-0.5 -right-0.5 text-xs">{flag.flag}</span>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-bold truncate">{conv.other_name}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${conv.other_role === 'host' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                    {conv.other_role === 'host' ? t('host') : t('seller')}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-400">{formatTime(conv.last_message_at)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 truncate max-w-[160px]">{conv.last_message || t('noMessages')}</span>
                                            {unread > 0 && <span className="flex-shrink-0 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                                <Headphones size={28} className="text-gray-300 mb-3" />
                                <p className="text-sm font-bold text-gray-400">{t('noCSInquiries')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className={`flex-1 flex flex-col ${!mobileShowMessages ? 'hidden lg:flex' : 'flex'}`}>
                    {activeConv ? (
                        <>
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white">
                                <button onClick={() => { setMobileShowMessages(false); setActiveConv(null); }} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg">
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white font-bold overflow-hidden">
                                    {activeConv.other_profile_image ? <img src={activeConv.other_profile_image} alt="" className="w-full h-full object-cover" /> : activeConv.other_name?.[0]}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">{activeConv.other_name}</h3>
                                    <span className="text-[10px] text-gray-500">{activeConv.other_email}</span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                                {messages.map(msg => {
                                    const isMine = String(msg.sender_id) === String(user.id);
                                    const displayText = getDisplayText(msg);
                                    return (
                                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3`}>
                                            {!isMine && (
                                                <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0 mr-2 mt-1">
                                                    {msg.sender_profile_image ? <img src={msg.sender_profile_image} alt="" className="w-full h-full object-cover" /> : msg.sender_name?.[0]}
                                                </div>
                                            )}
                                            <div className={`max-w-[70%] flex flex-col ${isMine ? 'items-end' : ''}`}>
                                                {!isMine && <span className="text-[11px] text-gray-500 mb-1 ml-1">{msg.sender_name}</span>}
                                                <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${isMine ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-br-md' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md'}`}>
                                                    {msg.file_url && msg.message_type === 'image' && <img src={msg.file_url} alt="" className="max-w-full rounded-xl max-h-60 object-cover mb-1" />}
                                                    {msg.message_type === 'text' && <p className="text-sm whitespace-pre-wrap break-words">{displayText}</p>}
                                                    {msg.file_url && msg.message_type === 'file' && (
                                                        <a href={msg.file_url} download className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isMine ? 'bg-white/20' : 'bg-gray-50'}`}>
                                                            <FileText size={16} /> <span className="text-sm truncate">{msg.file_name}</span>
                                                        </a>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-gray-400 mt-0.5 mx-1">{formatTime(msg.created_at)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-3 border-t border-gray-100 bg-white">
                                <div className="flex items-end gap-2">
                                    <textarea ref={inputRef} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown}
                                        placeholder={t('csReplyPlaceholder')} rows={1}
                                        className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 resize-none border-none max-h-32" style={{ minHeight: '44px' }} />
                                    <button onClick={handleSend} disabled={!inputText.trim() || sending}
                                        className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${inputText.trim() ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <Headphones size={40} className="text-gray-300 mb-4" />
                            <h3 className="text-lg font-black text-gray-600 mb-2">{t('selectCSConversation')}</h3>
                            <p className="text-sm text-gray-400">{t('selectCSConversationDesc')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCS;

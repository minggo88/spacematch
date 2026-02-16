import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import {
    MessageCircle, Send, Paperclip, Image, FileText, X, ArrowLeft,
    Search, Check, CheckCheck, Clock, Download, Play, Globe, Eye,
    Smile, MoreVertical, Phone, Video, ChevronDown, Headset,
    UserPlus, ArrowUpDown, Languages
} from 'lucide-react';
import { COUNTRY_FLAGS } from '../components/CountryBadge';

const API_BASE = '/api';
const POLL_INTERVAL = 2000;

const LANG_OPTIONS = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
    { code: 'en-CA', label: 'English (CA)', flag: '🇨🇦' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'th', label: 'ภาษาไทย', flag: '🇹🇭' },
    { code: 'km', label: 'ភាសាខ្មែរ', flag: '🇰🇭' },
    { code: 'fr-CA', label: 'Français', flag: '🇨🇦' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'uk', label: 'Українська', flag: '🇺🇦' },
];

const ChatPage = ({ isPopup = false }) => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation('chat');
    const [searchParams] = useSearchParams();

    // State
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showTranslation, setShowTranslation] = useState(true);
    const [mobileShowMessages, setMobileShowMessages] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [csConnecting, setCsConnecting] = useState(false);
    const [sortBy, setSortBy] = useState('latest'); // latest, unread, name
    const [adminViewLang, setAdminViewLang] = useState(user?.country || 'ko');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
    const isSuperAdmin = user?.role === 'superadmin';

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const lastMsgIdRef = useRef(0);
    const pollRef = useRef(null);
    const inputRef = useRef(null);

    // ─── Fetch conversations (admin gets CS only) ───
    const fetchConversations = useCallback(async () => {
        try {
            const url = isAdmin
                ? `${API_BASE}/chat/conversations.php?type=cs`
                : `${API_BASE}/chat/conversations.php`;
            const res = await fetch(url, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setConversations(data.conversations || []);
            }
        } catch (e) {
            console.error('Failed to fetch conversations:', e);
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    // ─── Fetch messages ───
    const fetchMessages = useCallback(async (convId, isPolling = false) => {
        if (!convId) return;
        try {
            const afterParam = isPolling && lastMsgIdRef.current > 0 ? `&after_id=${lastMsgIdRef.current}` : '';
            const res = await fetch(`${API_BASE}/chat/messages.php?conversation_id=${convId}${afterParam}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success && data.messages?.length > 0) {
                if (isPolling) {
                    setMessages(prev => [...prev, ...data.messages]);
                } else {
                    setMessages(data.messages);
                }
                const maxId = Math.max(...data.messages.map(m => parseInt(m.id)));
                lastMsgIdRef.current = maxId;
            } else if (!isPolling) {
                setMessages([]);
            }
        } catch (e) {
            console.error('Failed to fetch messages:', e);
        }
    }, []);

    // ─── Mark as read ───
    const markAsRead = useCallback(async (convId) => {
        try {
            await fetch(`${API_BASE}/chat/messages.php`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation_id: convId })
            });
        } catch (e) { /* ignore */ }
    }, []);

    // ─── Initial load ───
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // ─── Handle URL param for opening specific conversation ───
    useEffect(() => {
        const targetUser = searchParams.get('user');
        if (targetUser && conversations.length > 0) {
            const existing = conversations.find(c =>
                String(c.other_user_id) === String(targetUser) ||
                String(c.participant_1) === String(targetUser) ||
                String(c.participant_2) === String(targetUser)
            );
            if (existing) {
                handleSelectConversation(existing);
            } else {
                // Create new conversation
                createConversation(parseInt(targetUser));
            }
        }
    }, [searchParams, conversations.length]);

    // ─── Create conversation ───
    const createConversation = async (targetUserId) => {
        try {
            // Pre-check permission
            const permRes = await fetch(`${API_BASE}/chat/chat_permission.php?target_id=${targetUserId}`, { credentials: 'include' });
            const permData = await permRes.json();
            if (permData.success && !permData.allowed) {
                alert(permData.message || '채팅 권한이 없습니다.');
                return;
            }

            const res = await fetch(`${API_BASE}/chat/conversations.php`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_user_id: targetUserId })
            });
            const data = await res.json();
            if (data.success) {
                await fetchConversations();
                setActiveConv(data.conversation);
                setMobileShowMessages(true);
                lastMsgIdRef.current = 0;
                fetchMessages(data.conversation.id);
            } else if (data.error_code === 'NO_PERMISSION') {
                alert(data.message || '채팅 권한이 없습니다.');
            }
        } catch (e) {
            console.error('Failed to create conversation:', e);
        }
    };

    // ─── Connect to CS admin ───
    const connectToCS = async () => {
        if (csConnecting) return;
        setCsConnecting(true);
        try {
            const res = await fetch(`${API_BASE}/chat/cs_admin.php`, { credentials: 'include' });
            const data = await res.json();
            if (!data.success) {
                alert(data.message || t('csConnectFailed', 'CS 연결에 실패했습니다.'));
                return;
            }

            // If existing CS conversation, open it directly
            if (data.is_existing && data.existing_conversation_id) {
                const existing = conversations.find(c => String(c.id) === String(data.existing_conversation_id));
                if (existing) {
                    handleSelectConversation(existing);
                    return;
                }
            }

            // Create new CS conversation with the admin
            const convRes = await fetch(`${API_BASE}/chat/conversations.php`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_user_id: data.admin_id, type: 'cs' })
            });
            const convData = await convRes.json();
            if (convData.success) {
                await fetchConversations();
                setActiveConv(convData.conversation);
                setMobileShowMessages(true);
                lastMsgIdRef.current = 0;
                fetchMessages(convData.conversation.id);
            } else {
                alert(convData.message || t('csCreateFailed', 'CS 대화 생성에 실패했습니다.'));
            }
        } catch (e) {
            console.error('CS connect error:', e);
            alert(t('csConnectError', 'CS 연결 중 오류가 발생했습니다.'));
        } finally {
            setCsConnecting(false);
        }
    };

    // ─── Select conversation ───
    const handleSelectConversation = (conv) => {
        setActiveConv(conv);
        setMobileShowMessages(true);
        lastMsgIdRef.current = 0;
        fetchMessages(conv.id);
        markAsRead(conv.id);
    };

    // ─── Polling ───
    useEffect(() => {
        if (!activeConv) return;

        pollRef.current = setInterval(() => {
            fetchMessages(activeConv.id, true);
            fetchConversations(); // refresh unread counts
        }, POLL_INTERVAL);

        return () => clearInterval(pollRef.current);
    }, [activeConv, fetchMessages, fetchConversations]);

    // ─── Auto-scroll ───
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ─── Send message ───
    const handleSend = async () => {
        if (!inputText.trim() || !activeConv || sending) return;
        const text = inputText.trim();
        setInputText('');
        setSending(true);

        try {
            const res = await fetch(`${API_BASE}/chat/messages.php`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation_id: activeConv.id, text })
            });
            const data = await res.json();
            if (data.success) {
                setMessages(prev => [...prev, data.message]);
                lastMsgIdRef.current = parseInt(data.message.id);
                fetchConversations();
            }
        } catch (e) {
            console.error('Failed to send message:', e);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    // ─── File upload ───
    const handleFileUpload = async (file) => {
        if (!activeConv || uploading) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('conversation_id', activeConv.id);

        try {
            const res = await fetch(`${API_BASE}/chat/upload.php`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setMessages(prev => [...prev, data.message]);
                lastMsgIdRef.current = parseInt(data.message.id);
                fetchConversations();
            }
        } catch (e) {
            console.error('Failed to upload file:', e);
        } finally {
            setUploading(false);
        }
    };

    // ─── Drag & drop ───
    const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
    const handleDragLeave = () => setDragOver(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
    };

    // ─── Key handler ───
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ─── Get display text for message ───
    const getDisplayText = (msg) => {
        if (!showTranslation || !msg.translated_texts || Object.keys(msg.translated_texts).length === 0) {
            return msg.original_text;
        }
        // Admin can pick any language via dropdown
        const viewerLang = isAdmin ? adminViewLang : (user?.country || i18n.language || 'ko');

        // For admin: always show in the selected language (even their own messages)
        // For non-admin: show own messages as original
        if (!isAdmin && String(msg.sender_id) === String(user.id)) {
            return msg.original_text;
        }

        // Try exact match first, then base language fallback (en-GB → en, fr-CA → fr)
        if (msg.translated_texts[viewerLang]) {
            return msg.translated_texts[viewerLang];
        }
        const baseLang = viewerLang.split('-')[0];
        if (baseLang !== viewerLang && msg.translated_texts[baseLang]) {
            return msg.translated_texts[baseLang];
        }
        return msg.original_text;
    };

    // ─── Format time ───
    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = (now - d) / 1000;
        if (diff < 60) return t('justNow');
        if (diff < 3600) return t('minutesAgo', { count: Math.floor(diff / 60) });
        if (diff < 86400) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diff < 604800) return t('daysAgo', { count: Math.floor(diff / 86400) });
        return d.toLocaleDateString();
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1048576 * 1024) return (bytes / 1048576).toFixed(1) + ' MB';
        return (bytes / (1048576 * 1024)).toFixed(2) + ' GB';
    };

    // ─── Search users for superadmin new chat ───
    const searchUsers = useCallback(async (term) => {
        if (!term || term.length < 1) { setSearchResults([]); return; }
        setSearchingUsers(true);
        try {
            const res = await fetch(`${API_BASE}/users/get_users.php?search=${encodeURIComponent(term)}&limit=10`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setSearchResults((data.users || []).filter(u => u.id !== user.id));
            }
        } catch (e) { console.error(e); }
        finally { setSearchingUsers(false); }
    }, [user?.id]);

    const startNewCSChat = async (targetUserId) => {
        setShowNewChatModal(false);
        setUserSearchTerm('');
        setSearchResults([]);
        try {
            const res = await fetch(`${API_BASE}/chat/conversations.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_user_id: targetUserId, type: 'cs' })
            });
            const data = await res.json();
            if (data.success) {
                await fetchConversations();
                setActiveConv(data.conversation);
                setMobileShowMessages(true);
                lastMsgIdRef.current = 0;
                fetchMessages(data.conversation.id);
            }
        } catch (e) { console.error(e); }
    };

    // ─── Filter & Sort conversations ───
    const filteredConvs = (() => {
        let result = conversations.filter(c =>
            !searchTerm || c.other_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        switch (sortBy) {
            case 'unread':
                result = [...result].sort((a, b) => (parseInt(b.unread_count) || 0) - (parseInt(a.unread_count) || 0));
                break;
            case 'name':
                result = [...result].sort((a, b) => (a.other_name || '').localeCompare(b.other_name || ''));
                break;
            default: // latest
                break; // already sorted by last_message_at DESC from API
        }
        return result;
    })();

    // ─── Render conversation list item ───
    const renderConvItem = (conv) => {
        const isActive = activeConv?.id === conv.id;
        const unread = parseInt(conv.unread_count || 0);
        const flag = COUNTRY_FLAGS[conv.other_country];

        return (
            <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition-all rounded-2xl mx-2 my-1 ${isActive
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-100 dark:border-indigo-800 shadow-sm'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
            >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                        {conv.other_profile_image ? (
                            <img src={conv.other_profile_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                            conv.other_name?.[0] || '?'
                        )}
                    </div>
                    {flag && (
                        <span className="absolute -bottom-0.5 -right-0.5 text-sm">{flag.flag}</span>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-sm font-bold truncate ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-gray-100'}`}>{conv.other_name}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">{conv.last_message_at ? formatTime(conv.last_message_at) : ''}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                            {conv.last_message_type === 'image' ? '📷 ' + t('photo') :
                                conv.last_message_type === 'video' ? '🎥 ' + t('video') :
                                    conv.last_message_type === 'file' ? '📎 ' + t('file') :
                                        conv.last_message || t('noMessages')}
                        </span>
                        {unread > 0 && (
                            <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">{unread > 99 ? '99+' : unread}</span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ─── Render message bubble ───
    const renderMessage = (msg, idx) => {
        const isMine = String(msg.sender_id) === String(user.id);
        const displayText = getDisplayText(msg);
        const isTranslated = showTranslation && msg.translated_texts && Object.keys(msg.translated_texts).length > 0 && !isMine;
        const isFile = ['image', 'video', 'file'].includes(msg.message_type);

        return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3 group`}>
                {/* Other user avatar */}
                {!isMine && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0 mr-2 mt-1">
                        {msg.sender_profile_image ? (
                            <img src={msg.sender_profile_image} alt="" className="w-full h-full object-cover" />
                        ) : msg.sender_name?.[0] || '?'}
                    </div>
                )}

                <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                    {/* Sender name (for other user) */}
                    {!isMine && (
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mb-1 ml-1">{msg.sender_name}</span>
                    )}

                    {/* Bubble */}
                    <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${isMine
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                        }`}>

                        {/* Image */}
                        {msg.message_type === 'image' && msg.file_url && (
                            <a href={msg.file_url} target="_blank" rel="noreferrer" className="block mb-1">
                                <img src={msg.file_url} alt="" className="max-w-full rounded-xl max-h-60 object-cover" />
                            </a>
                        )}

                        {/* Video */}
                        {msg.message_type === 'video' && msg.file_url && (
                            <div className="mb-1">
                                <video src={msg.file_url} controls className="max-w-full rounded-xl max-h-60" />
                            </div>
                        )}

                        {/* File */}
                        {msg.message_type === 'file' && msg.file_url && (
                            <a href={msg.file_url} download={msg.file_name} className={`flex items-center gap-2 mb-1 px-3 py-2 rounded-xl ${isMine ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
                                <FileText size={18} className={isMine ? 'text-white/80' : 'text-gray-500'} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isMine ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>{msg.file_name}</p>
                                    <p className={`text-[10px] ${isMine ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`}>{formatFileSize(msg.file_size)}</p>
                                </div>
                                <Download size={14} className={isMine ? 'text-white/70' : 'text-gray-400'} />
                            </a>
                        )}

                        {/* Text */}
                        {msg.message_type === 'text' && (
                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{displayText}</p>
                        )}

                        {/* Translation indicator */}
                        {isTranslated && msg.message_type === 'text' && (
                            <div className={`flex items-center gap-1 mt-1.5 pt-1.5 border-t ${isMine ? 'border-white/20' : 'border-gray-100 dark:border-gray-600'}`}>
                                <Globe size={10} className={isMine ? 'text-white/50' : 'text-gray-400 dark:text-gray-500'} />
                                <span className={`text-[10px] ${isMine ? 'text-white/50' : 'text-gray-400 dark:text-gray-500'}`}>{t('autoTranslated')}</span>
                            </div>
                        )}
                    </div>

                    {/* Time + read status */}
                    <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'mr-1 justify-end' : 'ml-1'}`}>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">{formatTime(msg.created_at)}</span>
                        {isMine && (
                            msg.is_read == 1 ?
                                <CheckCheck size={12} className="text-indigo-400" /> :
                                <Check size={12} className="text-gray-300" />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ─── Render ───
    return (
        <div className={isPopup ? 'h-full flex flex-col' : 'h-[calc(100vh-100px)] lg:h-[calc(100vh-80px)] flex flex-col'}>
            {/* Header — hidden in popup mode */}
            {!isPopup && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <MessageCircle size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900">{t('title')}</h1>
                            <p className="text-xs text-gray-500">{t('subtitle')}</p>
                        </div>
                    </div>
                    {/* Translation toggle */}
                    <button
                        onClick={() => setShowTranslation(!showTranslation)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${showTranslation
                            ? 'bg-indigo-100 text-indigo-600 shadow-sm'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        <Globe size={14} />
                        {t('autoTranslate')}
                    </button>
                </div>
            )}

            {/* Main chat area */}
            <div className="flex-1 flex bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden min-h-0">

                {/* ─── Conversation List (left panel) ─── */}
                <div className={`w-full lg:w-80 border-r border-gray-100 dark:border-gray-700 flex flex-col ${mobileShowMessages ? 'hidden lg:flex' : 'flex'}`}>
                    {/* CS Quick Connect + Search + Sort */}
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 space-y-2">
                        {/* CS Quick Connect Banner (non-admin only) */}
                        {!isAdmin && (
                            <button
                                onClick={connectToCS}
                                disabled={csConnecting}
                                className="w-full flex items-center gap-3 px-3.5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group"
                            >
                                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    {csConnecting ? (
                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Headset size={18} />
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold leading-tight">{t('csConnect', 'CS 상담 연결')}</p>
                                    <p className="text-[10px] text-white/70 mt-0.5">{t('csConnectDesc', '관리자와 바로 대화할 수 있습니다')}</p>
                                </div>
                                <ArrowLeft size={14} className="rotate-180 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        )}

                        {/* Superadmin: New Chat button */}
                        {isSuperAdmin && (
                            <button
                                onClick={() => setShowNewChatModal(true)}
                                className="w-full flex items-center gap-3 px-3.5 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group"
                            >
                                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <UserPlus size={18} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold leading-tight">{t('newChat', '새 채팅')}</p>
                                    <p className="text-[10px] text-white/70 mt-0.5">{t('newChatDesc', '사용자와 새 대화를 시작합니다')}</p>
                                </div>
                                <ArrowLeft size={14} className="rotate-180 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        )}

                        {/* Search + Sort row */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 border-none"
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-2 py-2.5 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 border-none cursor-pointer"
                                title={t('sort', '정렬')}
                            >
                                <option value="latest">{t('sortLatest', '최신순')}</option>
                                <option value="unread">{t('sortUnread', '안 읽은 순')}</option>
                                <option value="name">{t('sortName', '이름순')}</option>
                            </select>
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                            </div>
                        ) : filteredConvs.length > 0 ? (
                            filteredConvs.map(renderConvItem)
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-4">
                                    <MessageCircle size={28} className="text-gray-300 dark:text-gray-500" />
                                </div>
                                <p className="text-sm font-bold text-gray-400 dark:text-gray-300 mb-1">{t('noConversations')}</p>
                                <p className="text-xs text-gray-300 dark:text-gray-500" style={{ wordBreak: 'keep-all' }}>{t('noConversationsDesc')}</p>
                            </div>
                        )}
                    </div>

                    {/* New Chat Modal for Superadmin */}
                    {showNewChatModal && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4" onClick={() => setShowNewChatModal(false)}>
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                    <h3 className="text-base font-bold text-gray-900">{t('newChat', '새 채팅')}</h3>
                                    <button onClick={() => setShowNewChatModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={t('searchUser', '사용자 검색...')}
                                            value={userSearchTerm}
                                            onChange={(e) => { setUserSearchTerm(e.target.value); searchUsers(e.target.value); }}
                                            className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 border-none"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
                                    {searchingUsers ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        searchResults.map(u => (
                                            <button
                                                key={u.id}
                                                onClick={() => startNewCSChat(u.id)}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-xl transition-colors text-left"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold overflow-hidden">
                                                    {u.profile_image ? <img src={u.profile_image} alt="" className="w-full h-full object-cover" /> : u.name?.[0] || '?'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{u.name}</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${u.role === 'vendor' ? 'bg-emerald-100 text-emerald-600' : u.role === 'seller' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                                                            {u.role}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 truncate">{u.email}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    ) : userSearchTerm ? (
                                        <p className="text-center text-sm text-gray-400 py-8">{t('noResults', '검색 결과가 없습니다')}</p>
                                    ) : (
                                        <p className="text-center text-sm text-gray-400 py-8">{t('searchUserHint', '이름이나 이메일로 검색하세요')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Message area (right panel) ─── */}
                <div className={`flex-1 flex flex-col ${!mobileShowMessages ? 'hidden lg:flex' : 'flex'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {activeConv ? (
                        <>
                            {/* Chat header */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                                <button
                                    onClick={() => { setMobileShowMessages(false); setActiveConv(null); }}
                                    className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold overflow-hidden">
                                    {activeConv.other_profile_image ? (
                                        <img src={activeConv.other_profile_image} alt="" className="w-full h-full object-cover" />
                                    ) : activeConv.other_name?.[0] || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{activeConv.other_name}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeConv.other_role === 'vendor' ? 'bg-emerald-100 text-emerald-600' : activeConv.other_role === 'admin' || activeConv.other_role === 'superadmin' ? 'bg-teal-100 text-teal-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                            {activeConv.other_role === 'vendor' ? t('vendor') : activeConv.other_role === 'admin' || activeConv.other_role === 'superadmin' ? 'CS' : t('seller')}
                                        </span>
                                        {COUNTRY_FLAGS[activeConv.other_country] && (
                                            <span className="text-xs">{COUNTRY_FLAGS[activeConv.other_country].flag}</span>
                                        )}
                                    </div>
                                </div>
                                {/* Admin: Language selector for translations */}
                                {isAdmin && (
                                    <select
                                        value={adminViewLang}
                                        onChange={(e) => setAdminViewLang(e.target.value)}
                                        className="px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 border border-gray-200 dark:border-gray-600 dark:text-gray-200 cursor-pointer"
                                        title={t('viewLanguage', '보기 언어')}
                                    >
                                        {LANG_OPTIONS.map(l => (
                                            <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Messages */}
                            <div className={`flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-850 ${dragOver ? 'ring-2 ring-indigo-300 ring-inset bg-indigo-50/30 dark:bg-indigo-900/30' : ''}`}>
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <div className="w-16 h-16 bg-indigo-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-3">
                                            <Smile size={28} className="text-indigo-300 dark:text-indigo-400" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-400 dark:text-gray-300">{t('startConversation')}</p>
                                        <p className="text-xs text-gray-300 dark:text-gray-500 mt-1">{t('startConversationDesc')}</p>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map(renderMessage)}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}

                                {/* Drag overlay */}
                                {dragOver && (
                                    <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center pointer-events-none z-10">
                                        <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                                            <Paperclip size={20} className="text-indigo-500" />
                                            <span className="font-bold text-indigo-600">{t('dropFile')}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input area */}
                            <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
                                <div className="flex items-end gap-2">
                                    {/* File attach */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-colors flex-shrink-0"
                                    >
                                        <Paperclip size={18} />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="*/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                                            e.target.value = '';
                                        }}
                                    />

                                    {/* Text input */}
                                    <div className="flex-1 relative">
                                        <textarea
                                            ref={inputRef}
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={t('inputPlaceholder')}
                                            rows={1}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 resize-none border-none max-h-32"
                                            style={{ minHeight: '44px' }}
                                        />
                                    </div>

                                    {/* Send button */}
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputText.trim() || sending}
                                        className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${inputText.trim()
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                            }`}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>

                                {uploading && (
                                    <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
                                        <div className="w-4 h-4 border-2 border-indigo-200 dark:border-indigo-700 border-t-indigo-500 rounded-full animate-spin" />
                                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{t('uploading')}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* No conversation selected */
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                                <MessageCircle size={36} className="text-indigo-300 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-base font-black text-gray-700 dark:text-gray-200 mb-1.5 whitespace-nowrap">{t('selectConversation')}</h3>
                            <p className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">{t('selectConversationDesc')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

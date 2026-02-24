import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Trash2, ChevronLeft, ChevronRight, PenLine, X, User, Clock, ImagePlus, Tag, Filter, Edit3, Check, CornerDownRight, MessageCircle, Heart, Eye, Flame, Share2, Link2, ExternalLink, ShieldAlert, Search, Hash, AtSign, MapPin, Store, Calendar, ClipboardList, AlertTriangle, CheckCircle, TrendingUp, Zap, Crown, ArrowUpDown, Users, BarChart3, ArrowLeft, ArrowRight, Pin, Megaphone, ChevronDown, Globe, Bookmark, BookmarkCheck, Vote, BarChart2, Trophy, ShoppingBag, Star, Building2, UserPlus, CalendarDays, HelpCircle, Handshake, Newspaper, Network, CalendarClock, Flag } from 'lucide-react';
import AdSlot from '../../components/AdSlot';
import TranslatedText from '../../components/TranslatedText';
import CountryBadge, { COUNTRY_FLAGS } from '../../components/CountryBadge';
import { getDisplayName, countryToLang } from '../../utils/translateText';
import { useDemoGuard } from '../../hooks/useDemoGuard';

const API_BASE = '/api/community';

// Community-specific label sets
const COMMON_LABEL_KEYS = ['labels.free', 'labels.question', 'labels.infoShare', 'labels.review', 'labels.jobSeeker', 'labels.info', 'labels.other'];
const COMMON_LABEL_KO = ['자유', '질문', '정보공유', '후기', '구인/구직', '정보', '기타'];

const SELLER_EXTRA_LABEL_KEYS = ['labels.salesProof', 'labels.productPromo', 'labels.venueReview', 'labels.knowhow', 'labels.poll'];
const SELLER_EXTRA_LABEL_KO = ['매출인증', '제품홍보', '베뉴후기', '노하우', '투표'];

const VENDOR_EXTRA_LABEL_KEYS = ['labels.spaceShowcase', 'labels.sellerRecruit', 'labels.event', 'labels.operationQA', 'labels.sellerReview'];
const VENDOR_EXTRA_LABEL_KO = ['공간자랑', '셀러모집', '이벤트', '운영Q&A', '셀러후기'];

const GENERAL_EXTRA_LABEL_KEYS = ['labels.successStory', 'labels.industryNews', 'labels.networking', 'labels.eventSchedule'];
const GENERAL_EXTRA_LABEL_KO = ['성공사례', '업계뉴스', '네트워킹', '행사일정'];

const COMMUNITY_CONFIG = {
    seller: {
        categories: [
            { id: 'free', labelKey: 'categories.free', icon: 'MessageSquare', color: 'text-blue-600 bg-blue-100' },
            { id: 'info', labelKey: 'categories.info', icon: 'Info', color: 'text-emerald-600 bg-emerald-100' },
        ],
        titleKey: 'sellerCommunity',
        subtitleKey: 'sellerSubtitle',
        gradient: 'from-violet-500 to-purple-600',
        accentBg: 'bg-violet-50',
        accentText: 'text-violet-600',
        accentBorder: 'border-violet-200',
        buttonBg: 'bg-violet-600 hover:bg-violet-700',
        labelColor: 'bg-violet-100 text-violet-700 border-violet-200',
        labelActiveColor: 'bg-violet-600 text-white',
        labelKeys: [...COMMON_LABEL_KEYS, ...SELLER_EXTRA_LABEL_KEYS],
        labelKoValues: [...COMMON_LABEL_KO, ...SELLER_EXTRA_LABEL_KO],
    },
    host: {
        titleKey: 'hostCommunity',
        subtitleKey: 'hostSubtitle',
        gradient: 'from-emerald-500 to-teal-600',
        accentBg: 'bg-emerald-50',
        accentText: 'text-emerald-600',
        accentBorder: 'border-emerald-200',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
        labelColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        labelActiveColor: 'bg-emerald-600 text-white',
        labelKeys: [...COMMON_LABEL_KEYS, ...VENDOR_EXTRA_LABEL_KEYS],
        labelKoValues: [...COMMON_LABEL_KO, ...VENDOR_EXTRA_LABEL_KO],
    },
    general: {
        titleKey: 'generalCommunity',
        subtitleKey: 'generalSubtitle',
        gradient: 'from-blue-500 to-indigo-600',
        accentBg: 'bg-blue-50',
        accentText: 'text-blue-600',
        accentBorder: 'border-blue-200',
        buttonBg: 'bg-blue-600 hover:bg-blue-700',
        labelColor: 'bg-blue-100 text-blue-700 border-blue-200',
        labelActiveColor: 'bg-blue-600 text-white',
        labelKeys: [...COMMON_LABEL_KEYS, ...GENERAL_EXTRA_LABEL_KEYS],
        labelKoValues: [...COMMON_LABEL_KO, ...GENERAL_EXTRA_LABEL_KO],
    }
};

// Fallback (now derived from config)
const DEFAULT_LABEL_KEYS = COMMON_LABEL_KEYS;
const LABEL_KO_VALUES = COMMON_LABEL_KO;

const CommunityPage = ({ type = 'general' }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('community');
    const config = COMMUNITY_CONFIG[type] || COMMUNITY_CONFIG.general;
    // Label options: use community-specific labels from config
    const currentLabelKeys = config.labelKeys || DEFAULT_LABEL_KEYS;
    const currentLabelKoValues = config.labelKoValues || LABEL_KO_VALUES;
    const LABEL_OPTIONS = currentLabelKeys.map((key, i) => ({ ko: currentLabelKoValues[i], display: t(key) }));
    const DEFAULT_LABELS = LABEL_OPTIONS.map(opt => opt.display);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(null); // { message: string }
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showWriteForm, setShowWriteForm] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', label: '', keywords: '', is_notice: 0 });
    const [notices, setNotices] = useState([]);
    const [noticesExpanded, setNoticesExpanded] = useState(false);
    const [newPhotos, setNewPhotos] = useState([]);
    const [photoPreviewUrls, setPhotoPreviewUrls] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [expandedPost, setExpandedPost] = useState(null);
    const [availableLabels, setAvailableLabels] = useState([]);
    const [filterLabel, setFilterLabel] = useState('');
    const [photoViewerImages, setPhotoViewerImages] = useState([]);
    const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
    const photoInputRef = useRef(null);
    const highlightRef = useRef(null);
    const shareMenuRef = useRef(null);
    const popularScrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [scrollStartX, setScrollStartX] = useState(0);
    const hasDraggedRef = useRef(false);
    const [editingPost, setEditingPost] = useState(null);
    const [editData, setEditData] = useState({ title: '', content: '', label: '' });
    const [shareMenuPostId, setShareMenuPostId] = useState(null);
    const [copiedPostId, setCopiedPostId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    // Enhanced role badge system
    const getRoleBadge = useCallback((role) => {
        switch (role) {
            case 'superadmin': return { label: t('badgeSuperAdmin'), color: 'bg-gradient-to-r from-red-500 to-orange-500 text-white', icon: Crown };
            case 'admin': return { label: t('roleAdmin'), color: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white', icon: ShieldAlert };
            case 'host': return { label: t('roleHost'), color: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white', icon: Building2 };
            case 'seller': return { label: t('roleSeller'), color: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white', icon: ShoppingBag };
            default: return { label: t('badgeUser'), color: 'bg-gray-100 text-gray-600', icon: User };
        }
    }, [t]);
    const { isDemoUser, demoAlert } = useDemoGuard();

    // Activity level badge helper
    const getActivityBadge = useCallback((level) => {
        const badges = {
            1: { emoji: '🌱', label: 'Lv.1', color: 'text-green-500' },
            2: { emoji: '🌿', label: 'Lv.2', color: 'text-emerald-500' },
            3: { emoji: '🌳', label: 'Lv.3', color: 'text-teal-600' },
            4: { emoji: '⭐', label: 'Lv.4', color: 'text-amber-500' },
            5: { emoji: '👑', label: 'Lv.5', color: 'text-red-500' },
        };
        return badges[level] || badges[1];
    }, []);

    // Report modal state
    const [reportModal, setReportModal] = useState(null); // { postId }
    const [reportReason, setReportReason] = useState('');
    const [reportDetail, setReportDetail] = useState('');
    const [reportSubmitting, setReportSubmitting] = useState(false);

    // Map Korean DB label values → i18n keys for translation (build dynamically from config)
    const LABEL_KO_TO_KEY = useMemo(() => {
        const map = {};
        const keys = config.labelKeys || DEFAULT_LABEL_KEYS;
        const koVals = config.labelKoValues || LABEL_KO_VALUES;
        keys.forEach((key, i) => { map[koVals[i]] = key; });
        return map;
    }, [config]);
    const translateLabel = (label) => {
        const key = LABEL_KO_TO_KEY[label];
        return key ? t(key) : label;
    };
    // Translate hashtag using community.json hashtags map
    const translateTag = (tag) => {
        const translated = t(`hashtags.${tag}`, { defaultValue: '' });
        return translated || tag;
    };
    // Reverse: translated display text → Korean DB value
    const toLabelKo = (displayLabel) => {
        const opt = LABEL_OPTIONS.find(o => o.display === displayLabel);
        return opt ? opt.ko : displayLabel;
    };

    // Confirm modal + Toast state
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // @Mention state
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionResults, setMentionResults] = useState([]);
    const [showMentionDropdown, setShowMentionDropdown] = useState(false);
    const [mentionCursorPos, setMentionCursorPos] = useState(0);
    const contentTextareaRef = useRef(null);

    // Profile popup state
    const categoryLabels = { free: t('categories.free'), info: t('categories.info'), question: t('labels.question'), review: t('labels.review'), tip: t('labels.info') };
    const [profileData, setProfileData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profilePopup, setProfilePopup] = useState(null);

    // Comment state
    const [commentsMap, setCommentsMap] = useState({}); // { postId: [comments] }
    const [commentCounts, setCommentCounts] = useState({}); // { postId: count }
    const [commentInput, setCommentInput] = useState(''); // current comment text
    const [replyingTo, setReplyingTo] = useState(null); // { commentId, userName }
    const [replyInput, setReplyInput] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // Popular posts & likes
    const [popularPosts, setPopularPosts] = useState([]);

    // Double-tap like animation
    const [doubleTapHeart, setDoubleTapHeart] = useState(null);
    const lastTapRef = useRef({});

    // Bookmark state
    const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
    const [showBookmarks, setShowBookmarks] = useState(false);

    // Poll state
    const [pollData, setPollData] = useState({}); // { postId: pollInfo }
    const [newPollOptions, setNewPollOptions] = useState(['', '']); // For write form
    const [showPollForm, setShowPollForm] = useState(false);
    const [pollEndDate, setPollEndDate] = useState('');

    // Sort & Mode (DC Inside style)
    const [sortBy, setSortBy] = useState('latest'); // latest, likes, comments, views
    const [feedMode, setFeedMode] = useState('all'); // all, best, hot

    // Country filter — auto-landing on user's country
    const [countryFilter, setCountryFilter] = useState('all');

    // Notification highlight
    const [searchParams, setSearchParams] = useSearchParams();
    const [highlightedPostId, setHighlightedPostId] = useState(null);


    // Trending hashtags (computed from popular posts keywords)
    const trendingTags = useMemo(() => {
        const tagCount = {};
        [...popularPosts, ...posts].forEach(p => {
            if (p.keywords && Array.isArray(p.keywords)) {
                p.keywords.forEach(kw => {
                    const tag = kw.trim().toLowerCase();
                    if (tag) tagCount[tag] = (tagCount[tag] || 0) + 1;
                });
            }
        });
        return Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([tag]) => tag);
    }, [popularPosts, posts]);

    // Close share menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
                setShareMenuPostId(null);
            }
        };
        if (shareMenuPostId) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [shareMenuPostId]);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            let url = `${API_BASE}/community_posts.php?type=${type}&page=${page}`;

            // Bookmark mode: fetch from bookmark API instead
            if (feedMode === 'bookmarks') {
                url = `${API_BASE}/community_bookmarks.php?type=${type}&page=${page}`;
                const res = await fetch(url, { credentials: 'include' });
                const data = await res.json();
                if (data.success) {
                    setPosts(data.posts || []);
                    setTotalPages(data.totalPages || 1);
                    const bm = new Set();
                    (data.posts || []).forEach(p => bm.add(p.id));
                    setBookmarkedPosts(bm);
                }
                return;
            }

            if (filterLabel) url += `&label=${encodeURIComponent(filterLabel)}`;
            if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery.trim())}`;
            if (sortBy !== 'latest') url += `&sort=${sortBy}`;
            if (feedMode === 'best') url += `&mode=best`;
            if (countryFilter && countryFilter !== 'all') url += `&country=${encodeURIComponent(countryFilter)}`;
            const res = await fetch(url, { credentials: 'include' });
            if (res.status === 403) {
                const data = await res.json();
                setAccessDenied({ message: data.message || t('accessDeniedMessage') });
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (data.success) {
                setPosts(data.posts || []);
                setTotalPages(data.totalPages || 1);
                if (data.labels) setAvailableLabels(data.labels);
                // Initialize bookmark state from server
                const bm = new Set();
                (data.posts || []).forEach(p => { if (p.is_bookmarked) bm.add(p.id); });
                setBookmarkedPosts(bm);
            }
        } catch (err) {
            console.error('Failed to load posts:', err);
        } finally {
            setLoading(false);
        }
    }, [type, page, filterLabel, searchQuery, sortBy, feedMode, countryFilter]);

    const fetchPopularPosts = useCallback(async () => {
        try {
            let url = `${API_BASE}/community_popular.php?type=${type}`;
            if (countryFilter && countryFilter !== 'all') url += `&country=${encodeURIComponent(countryFilter)}`;
            const res = await fetch(url, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setPopularPosts(data.posts || []);
        } catch (err) {
            console.error('Failed to load popular posts:', err);
        }
    }, [type, countryFilter]);

    const fetchNotices = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/community_posts.php?type=${type}&notices=1`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setNotices(data.notices || []);
        } catch (err) { console.error('Failed to load notices:', err); }
    }, [type]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    useEffect(() => {
        fetchPopularPosts();
    }, [fetchPopularPosts]);

    // Handle notification highlight: auto-expand and scroll to the highlighted post
    useEffect(() => {
        const highlightId = searchParams.get('highlight');
        if (highlightId && posts.length > 0) {
            const postId = parseInt(highlightId, 10);
            const postExists = posts.find(p => p.id === postId);
            if (postExists) {
                setHighlightedPostId(postId);
                setExpandedPost(postId);
                if (!commentsMap[postId]) {
                    fetchComments(postId);
                }
                // Scroll to the post after a brief delay for rendering
                setTimeout(() => {
                    highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    setHighlightedPostId(null);
                }, 4000);
                // Clean up URL params
                searchParams.delete('highlight');
                setSearchParams(searchParams, { replace: true });
            }
        }
    }, [posts, searchParams]);

    // Handle shared post link: auto-expand and scroll to the post (?post=ID)
    useEffect(() => {
        const sharedPostId = searchParams.get('post');
        if (!sharedPostId) return;

        const postId = parseInt(sharedPostId, 10);
        if (isNaN(postId)) return;

        const activatePost = (targetPost) => {
            setHighlightedPostId(targetPost.id);
            setExpandedPost(targetPost.id);
            if (!commentsMap[targetPost.id]) {
                fetchComments(targetPost.id);
            }
            incrementViewCount(targetPost.id);
            setTimeout(() => {
                document.getElementById(`post-${targetPost.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 400);
            setTimeout(() => { setHighlightedPostId(null); }, 4000);
            searchParams.delete('post');
            setSearchParams(searchParams, { replace: true });
        };

        // First check if the post is already loaded on the current page
        const existingPost = posts.find(p => p.id === postId);
        if (existingPost) {
            activatePost(existingPost);
            return;
        }

        // If posts are loaded but the post isn't found, fetch it from the API
        if (posts.length > 0 || !loading) {
            (async () => {
                try {
                    const res = await fetch(`${API_BASE}/community_posts.php?type=${type}&post_id=${postId}`, { credentials: 'include' });
                    const data = await res.json();
                    if (data.success && data.post) {
                        // Inject the fetched post at the top of the posts list
                        setPosts(prev => {
                            const alreadyExists = prev.find(p => p.id === data.post.id);
                            if (alreadyExists) return prev;
                            return [data.post, ...prev];
                        });
                        // Activate after a brief delay for React to render
                        setTimeout(() => activatePost(data.post), 200);
                    }
                } catch (err) {
                    console.error('Failed to fetch shared post:', err);
                }
            })();
        }
    }, [posts, searchParams, loading]);

    const handlePhotoSelect = (e) => {
        const files = Array.from(e.target.files);
        const remaining = 10 - newPhotos.length;
        const toAdd = files.slice(0, remaining);

        setNewPhotos(prev => [...prev, ...toAdd]);

        toAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPhotoPreviewUrls(prev => [...prev, ev.target.result]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const removePhoto = (index) => {
        setNewPhotos(prev => prev.filter((_, i) => i !== index));
        setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const movePhoto = (index, direction) => {
        const newIdx = direction === 'left' ? index - 1 : index + 1;
        if (newIdx < 0 || newIdx >= newPhotos.length) return;
        setNewPhotos(prev => {
            const arr = [...prev];
            [arr[index], arr[newIdx]] = [arr[newIdx], arr[index]];
            return arr;
        });
        setPhotoPreviewUrls(prev => {
            const arr = [...prev];
            [arr[index], arr[newIdx]] = [arr[newIdx], arr[index]];
            return arr;
        });
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        if (isDemoUser) { demoAlert('글 작성'); return; }
        if (!newPost.title.trim() || !newPost.content.trim()) {
            showToast(t('titleContentRequired'), 'error');
            return;
        }
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('type', type);
            formData.append('title', newPost.title);
            formData.append('content', newPost.content);
            formData.append('label', toLabelKo(newPost.label));
            const keywordsStr = newPost.keywords || '';
            const keywordsArr = keywordsStr.split(/[,#]/).map(k => k.trim()).filter(Boolean);
            if (keywordsArr.length > 0) {
                formData.append('keywords', JSON.stringify(keywordsArr));
            }
            newPhotos.forEach(file => {
                formData.append('photos[]', file);
            });
            if (isAdmin && newPost.is_notice > 0) {
                formData.append('is_notice', newPost.is_notice.toString());
            }
            formData.append('original_lang', i18n.language || 'ko');

            const res = await fetch(`${API_BASE}/community_posts.php`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                // Create poll if poll options were filled
                const validPollOptions = newPollOptions.filter(o => o.trim());
                if (validPollOptions.length >= 2 && (newPost.label === t('labels.poll') || showPollForm)) {
                    try {
                        await fetch(`${API_BASE}/community_polls.php`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                                post_id: data.post.id,
                                options: validPollOptions,
                                end_date: pollEndDate || null
                            })
                        });
                    } catch { }
                }

                if (data.post.is_notice > 0) {
                    setNotices(prev => [data.post, ...prev]);
                } else {
                    setPosts(prev => [data.post, ...prev]);
                }
                setNewPost({ title: '', content: '', label: '', keywords: '', is_notice: 0 });
                setNewPhotos([]);
                setPhotoPreviewUrls([]);
                setShowWriteForm(false);
                setNewPollOptions(['', '']);
                setShowPollForm(false);
                setPollEndDate('');
                if (data.post.label && !availableLabels.includes(data.post.label)) {
                    setAvailableLabels(prev => [...prev, data.post.label]);
                }
                showToast(t('postCreated'), 'success');
            } else {
                showToast(data.message || t('postCreateFailed'), 'error');
            }
        } catch (err) {
            showToast(t('postCreateError'), 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (isDemoUser) { demoAlert('글 삭제'); return; }
        setConfirmModal({
            title: t('deletePostTitle'),
            message: t('deletePostMessage'),
            confirmLabel: t('deletePostConfirm'),
            onConfirm: async () => {
                setConfirmModal(null);
                setCommentsMap(prev => { const n = { ...prev }; delete n[postId]; return n; });
                setCommentCounts(prev => { const n = { ...prev }; delete n[postId]; return n; });
                try {
                    const res = await fetch(`${API_BASE}/community_delete.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ post_id: postId })
                    });
                    const data = await res.json();
                    if (data.success) {
                        setPosts(prev => prev.filter(p => p.id !== postId));
                        if (expandedPost === postId) setExpandedPost(null);
                        showToast(t('postDeleted'), 'success');
                    } else {
                        showToast(t('postDeleteFailed'), 'error');
                    }
                } catch (err) {
                    showToast(t('postDeleteError'), 'error');
                }
            }
        });
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000);
        if (diff < 60) return t('timeSecondsAgo', { count: diff });
        if (diff < 3600) return t('timeMinutesAgo', { count: Math.floor(diff / 60) });
        if (diff < 86400) return t('timeHoursAgo', { count: Math.floor(diff / 3600) });
        if (diff < 604800) return t('timeDaysAgo', { count: Math.floor(diff / 86400) });
        return d.toLocaleDateString();
    };

    // Bookmark toggle handler
    const handleToggleBookmark = async (e, postId) => {
        e.stopPropagation();
        if (isDemoUser) { demoAlert('북마크'); return; }
        try {
            const res = await fetch(`${API_BASE}/community_bookmarks.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ post_id: postId })
            });
            const data = await res.json();
            if (data.success) {
                setBookmarkedPosts(prev => {
                    const next = new Set(prev);
                    if (data.bookmarked) { next.add(postId); showToast(t('bookmarkAdded')); }
                    else { next.delete(postId); showToast(t('bookmarkRemoved')); }
                    return next;
                });
            }
        } catch { }
    };

    // Poll vote handler
    const handlePollVote = async (pollId, optionId, postId) => {
        if (isDemoUser) { demoAlert('투표'); return; }
        try {
            const res = await fetch(`${API_BASE}/community_polls.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action: 'vote', poll_id: pollId, option_id: optionId })
            });
            const data = await res.json();
            if (data.success) {
                setPollData(prev => ({
                    ...prev,
                    [postId]: {
                        ...prev[postId],
                        options: data.options,
                        total_votes: data.total_votes,
                        user_voted: data.user_voted,
                    }
                }));
                showToast(t('pollVote') + '!');
            } else {
                showToast(data.message || t('pollAlreadyVoted'), 'error');
            }
        } catch { }
    };

    // Fetch poll data for a post
    const fetchPollData = async (postId) => {
        try {
            const res = await fetch(`${API_BASE}/community_polls.php?post_id=${postId}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success && data.poll) {
                setPollData(prev => ({ ...prev, [postId]: data.poll }));
            }
        } catch { }
    };

    // Report handler
    const handleSubmitReport = async () => {
        if (!reportModal || !reportReason) return;
        if (isDemoUser) { demoAlert('신고'); return; }
        setReportSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/community_reports.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    post_id: reportModal.postId,
                    reason: reportReason,
                    detail: reportDetail || null
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast(t('reportSubmitted'), 'success');
                setReportModal(null);
                setReportReason('');
                setReportDetail('');
            } else {
                showToast(data.message || t('reportFailed'), 'error');
            }
        } catch {
            showToast(t('reportFailed'), 'error');
        } finally {
            setReportSubmitting(false);
        }
    };

    const openPhotoViewer = (photos, startIndex) => {
        setPhotoViewerImages(photos);
        setPhotoViewerIndex(startIndex);
    };

    const closePhotoViewer = () => {
        setPhotoViewerImages([]);
        setPhotoViewerIndex(0);
    };

    const startEditing = (post) => {
        setEditingPost(post.id);
        setEditData({ title: post.title, content: post.content, label: post.label || '' });
    };

    const handleEditPost = async (postId) => {
        if (isDemoUser) { demoAlert('글 수정'); return; }
        if (!editData.title.trim() || !editData.content.trim()) {
            showToast(t('titleContentRequired'), 'error');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/community_posts.php`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ post_id: postId, ...editData })
            });
            const data = await res.json();
            if (data.success) {
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...editData } : p));
                setEditingPost(null);
                showToast(t('postUpdated'), 'success');
            }
        } catch (err) {
            showToast(t('postUpdateError'), 'error');
        }
    };

    // ===== COMMENT FUNCTIONS =====
    const fetchComments = async (postId) => {
        try {
            const res = await fetch(`${API_BASE}/community_comments.php?post_id=${postId}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setCommentsMap(prev => ({ ...prev, [postId]: data.comments || [] }));
                setCommentCounts(prev => ({ ...prev, [postId]: data.total || 0 }));
            }
        } catch (err) {
            console.error('Failed to load comments:', err);
        }
    };

    const handleSubmitComment = async (postId) => {
        if (isDemoUser) { demoAlert('댓글 작성'); return; }
        if (!commentInput.trim()) return;
        setSubmittingComment(true);
        try {
            const res = await fetch(`${API_BASE}/community_comments.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ post_id: postId, content: commentInput, original_lang: i18n.language || 'ko' })
            });
            const data = await res.json();
            if (data.success) {
                setCommentInput('');
                fetchComments(postId);
            } else {
                showToast(t('commentCreateFailed'), 'error');
            }
        } catch (err) {
            showToast(t('commentCreateError'), 'error');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleSubmitReply = async (postId, parentId) => {
        if (isDemoUser) { demoAlert('답글 작성'); return; }
        if (!replyInput.trim()) return;
        setSubmittingComment(true);
        try {
            const res = await fetch(`${API_BASE}/community_comments.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ post_id: postId, parent_id: parentId, content: replyInput, original_lang: i18n.language || 'ko' })
            });
            const data = await res.json();
            if (data.success) {
                setReplyInput('');
                setReplyingTo(null);
                fetchComments(postId);
            } else {
                showToast(t('replyCreateFailed'), 'error');
            }
        } catch (err) {
            showToast(t('replyCreateError'), 'error');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (isDemoUser) { demoAlert('댓글 삭제'); return; }
        setConfirmModal({
            title: t('deleteCommentTitle'),
            message: t('deleteCommentMessage'),
            type: 'danger',
            confirmLabel: t('deleteCommentConfirm'),
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const res = await fetch(`${API_BASE}/community_comments.php`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ comment_id: commentId })
                    });
                    const data = await res.json();
                    if (data.success) {
                        fetchComments(postId);
                        showToast(t('commentDeleted'), 'success');
                    } else {
                        showToast(t('commentDeleteFailed'), 'error');
                    }
                } catch (err) {
                    showToast(t('commentDeleteError'), 'error');
                }
            }
        });
    };

    // Like toggle (optimistic)
    const handleToggleLike = async (e, postId) => {
        e.stopPropagation();
        if (isDemoUser) { demoAlert('좋아요'); return; }
        // Optimistic update
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_liked: !p.is_liked, like_count: p.is_liked ? p.like_count - 1 : p.like_count + 1 } : p));
        setPopularPosts(prev => prev.map(p => p.id === postId ? { ...p, is_liked: !p.is_liked, like_count: p.is_liked ? p.like_count - 1 : p.like_count + 1 } : p));
        try {
            const res = await fetch(`${API_BASE}/community_likes.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId })
            });
            const data = await res.json();
            if (data.success) {
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_liked: data.liked, like_count: data.like_count } : p));
            }
        } catch (err) { console.error('Like toggle failed:', err); }
    };

    // Comment like toggle (optimistic)
    const handleToggleCommentLike = async (e, postId, commentId) => {
        e.stopPropagation();
        // Optimistic update in commentsMap
        setCommentsMap(prev => {
            const updated = { ...prev };
            if (!updated[postId]) return updated;
            updated[postId] = updated[postId].map(c => {
                if (c.id === commentId) {
                    return { ...c, is_liked: !c.is_liked, like_count: c.is_liked ? (c.like_count || 1) - 1 : (c.like_count || 0) + 1 };
                }
                if (c.replies) {
                    return { ...c, replies: c.replies.map(r => r.id === commentId ? { ...r, is_liked: !r.is_liked, like_count: r.is_liked ? (r.like_count || 1) - 1 : (r.like_count || 0) + 1 } : r) };
                }
                return c;
            });
            return updated;
        });
        try {
            const res = await fetch(`${API_BASE}/community_comment_likes.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment_id: commentId })
            });
            const data = await res.json();
            if (data.success) {
                setCommentsMap(prev => {
                    const updated = { ...prev };
                    if (!updated[postId]) return updated;
                    updated[postId] = updated[postId].map(c => {
                        if (c.id === commentId) return { ...c, is_liked: data.liked, like_count: data.like_count };
                        if (c.replies) return { ...c, replies: c.replies.map(r => r.id === commentId ? { ...r, is_liked: data.liked, like_count: data.like_count } : r) };
                        return c;
                    });
                    return updated;
                });
            }
        } catch (err) { console.error('Comment like toggle failed:', err); }
    };

    // View count increment
    const incrementViewCount = async (postId) => {
        try {
            await fetch(`${API_BASE}/community_likes.php`, {
                method: 'PUT', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId })
            });
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, view_count: (p.view_count || 0) + 1 } : p));
        } catch (err) { /* silent */ }
    };

    // Load comments when a post is expanded
    const handleTogglePost = (postId) => {
        const isExpanding = expandedPost !== postId;
        setExpandedPost(isExpanding ? postId : null);
        setReplyingTo(null);
        setReplyInput('');
        setCommentInput('');
        if (isExpanding) {
            if (!commentsMap[postId]) fetchComments(postId);
            incrementViewCount(postId);
        }
    };

    // Navigate to a popular post
    const goToPopularPost = (postId) => {
        // If on page 1 and post exists, just expand; otherwise navigate
        const found = posts.find(p => p.id === postId);
        if (found) {
            setExpandedPost(postId);
            if (!commentsMap[postId]) fetchComments(postId);
            incrementViewCount(postId);
            setTimeout(() => {
                document.getElementById(`post-${postId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            setFilterLabel('');
            setPage(1);
            setHighlightedPostId(postId);
            setExpandedPost(postId);
        }
    };

    // Fetch public profile for popup
    const openUserProfile = async (e, userId) => {
        e.stopPropagation();
        setProfilePopup(userId);
        setProfileData(null);
        setProfileLoading(true);
        try {
            const [profileRes, activityRes] = await Promise.all([
                fetch(`/api/users/get_public_profile.php?id=${userId}`, { credentials: 'include' }),
                fetch(`${API_BASE}/community_activity.php?user_id=${userId}`, { credentials: 'include' })
            ]);
            const profileJson = await profileRes.json();
            const activityJson = await activityRes.json();
            if (profileJson.success) {
                setProfileData({
                    ...profileJson,
                    activity: activityJson.success ? activityJson.activity : null
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setProfileLoading(false);
        }
    };

    // Double-tap like handler
    const handleDoubleTap = (e, postId) => {
        const now = Date.now();
        const lastTap = lastTapRef.current[postId] || 0;
        if (now - lastTap < 350) {
            // Double tap detected
            const post = posts.find(p => p.id === postId);
            if (post && !post.is_liked) {
                handleToggleLike(e, postId);
            }
            setDoubleTapHeart(postId);
            setTimeout(() => setDoubleTapHeart(null), 900);
            lastTapRef.current[postId] = 0;
        } else {
            lastTapRef.current[postId] = now;
        }
    };

    // Check if post is new (within 24h) or hot (5+ likes)
    const getPostBadge = (post) => {
        const created = new Date(post.created_at);
        const hoursDiff = (Date.now() - created.getTime()) / (1000 * 60 * 60);
        if ((post.like_count || 0) >= 5) return 'hot';
        if (hoursDiff < 24) return 'new';
        return null;
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-6">
            {/* Community Header Banner */}
            <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-6 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full"></div>
                    <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-white rounded-full"></div>
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <MessageSquare size={28} />
                            <h1 className="text-2xl md:text-3xl font-extrabold">{t(config.titleKey)}</h1>
                        </div>
                        <p className="text-white/80 text-sm">{t(config.subtitleKey)}</p>
                    </div>
                    <button
                        onClick={() => { if (isDemoUser) { demoAlert('글 작성'); return; } setShowWriteForm(!showWriteForm); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur rounded-xl font-bold text-sm hover:bg-white/30 transition-colors"
                    >
                        <PenLine size={16} />
                        {t('writePost')}
                    </button>
                </div>
                {/* Real-time Activity Indicator */}
                <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-white/90 text-xs font-medium" dangerouslySetInnerHTML={{ __html: t('currentViewers', { count: Math.max(3, Math.floor((posts.reduce((s, p) => s + (p.view_count || 0), 0) / Math.max(1, posts.length)) * 0.08 + popularPosts.length * 2)) }) }} />
                    </div>
                    <span className="text-white/60 text-xs">{t('todayPosts', { count: posts.filter(p => { const d = new Date(p.created_at); const now = new Date(); return d.toDateString() === now.toDateString(); }).length })}</span>
                </div>
            </div>

            {/* Mode Tabs + Sort */}
            <div className="flex items-center gap-2">
                <div className="flex-1 overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 min-w-max">
                        {[
                            { key: 'all', label: t('feedAll'), icon: <BarChart3 size={13} /> },
                            { key: 'best', label: t('feedBest'), icon: <Crown size={13} /> },
                            { key: 'bookmarks', label: t('myBookmarks'), icon: <Bookmark size={13} /> },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => { setFeedMode(tab.key); setPage(1); }}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${feedMode === tab.key
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                                {tab.key === 'best' && <span className="text-[9px] text-amber-500 font-extrabold">🏅</span>}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Sort Dropdown */}
                <div className="flex items-center gap-1 flex-shrink-0 bg-gray-50 rounded-xl px-2.5 py-2">
                    <ArrowUpDown size={12} className="text-gray-400" />
                    <select
                        value={sortBy}
                        onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                        className="text-xs font-bold text-gray-600 bg-transparent border-none outline-none cursor-pointer"
                    >
                        <option value="latest">{t('sortBy.latest')}</option>
                        <option value="likes">{t('sortBy.likes')}</option>
                        <option value="comments">{t('sortBy.comments')}</option>
                        <option value="views">{t('sortBy.views')}</option>
                    </select>
                </div>
            </div>

            {/* 🔥 Trending Hashtags */}
            {trendingTags.length > 0 && (
                <div className="overflow-x-auto -mx-1 px-1 scrollbar-hide">
                    <div className="flex items-center gap-1.5 py-1 min-w-max">
                        <Flame size={14} className="text-orange-400 flex-shrink-0" />
                        <span className="text-[10px] font-bold text-gray-400 mr-1">{t('trendingTags')}</span>
                        {trendingTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => {
                                    if (searchQuery === tag) {
                                        setSearchQuery('');
                                    } else {
                                        setSearchQuery(tag);
                                    }
                                    setPage(1);
                                }}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${searchQuery === tag
                                    ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-sm'
                                    : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'
                                    }`}
                            >
                                #{translateTag(tag)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 🌍 Country Filter Tabs */}
            <div className="overflow-x-auto -mx-1 px-1 scrollbar-hide">
                <div className="flex items-center gap-1.5 py-1 min-w-max">
                    <Globe size={14} className="text-gray-400 flex-shrink-0" />
                    <button
                        onClick={() => { setCountryFilter('all'); setPage(1); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${countryFilter === 'all'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        🌍 {t('allCountries')}
                    </button>
                    {Object.entries(COUNTRY_FLAGS).map(([code, info]) => (
                        <button
                            key={code}
                            onClick={() => { setCountryFilter(code); setPage(1); }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${countryFilter === code
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-sm'
                                : code === user?.country
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <span>{info.flag}</span>
                            <span>{i18n.language === 'ko' ? info.name : info.nameEn}</span>
                            {code === user?.country && countryFilter !== code && (
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none bg-white"
                />
            </div>

            {/* Label Filter */}
            {
                availableLabels.length > 0 && (
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-2 min-w-max py-0.5">
                            <Filter size={14} className="text-gray-400" />
                            <button
                                onClick={() => { setFilterLabel(''); setPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${filterLabel === '' ? config.labelActiveColor : config.labelColor}`}
                            >
                                {t('all')}
                            </button>
                            {availableLabels.map(lbl => (
                                <button
                                    key={lbl}
                                    onClick={() => { setFilterLabel(lbl); setPage(1); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${filterLabel === lbl ? config.labelActiveColor : config.labelColor}`}
                                >
                                    {translateLabel(lbl)}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* 🔥 Trending Hashtags */}
            {
                trendingTags.length > 0 && (
                    <div className="relative overflow-hidden bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-yellow-950/20 rounded-2xl border border-orange-100 dark:border-orange-800/40 p-4">
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-400 rounded-full blur-2xl"></div>
                            <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-yellow-400 rounded-full blur-xl"></div>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                    <TrendingUp size={13} className="text-white" />
                                </div>
                                <span className="text-sm font-extrabold text-gray-800 dark:text-gray-100">{t('trending')}</span>
                                <span className="text-[10px] text-orange-500 dark:text-orange-400 font-bold bg-orange-100 dark:bg-orange-900/50 px-2 py-0.5 rounded-full">LIVE</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {trendingTags.map((tag, i) => (
                                    <button
                                        key={tag}
                                        onClick={() => { setSearchQuery(tag); setPage(1); }}
                                        className="group flex items-center gap-1 px-3 py-1.5 bg-white/80 dark:bg-white/10 backdrop-blur border border-orange-100 dark:border-orange-800/40 rounded-full text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white hover:border-transparent transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
                                    >
                                        <Hash size={11} className="text-orange-400 group-hover:text-white/80" />
                                        {translateTag(tag)}
                                        {i === 0 && <Flame size={11} className="text-orange-500 group-hover:text-yellow-200 ml-0.5" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Popular Posts Section */}
            {
                popularPosts.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                                <Flame size={15} className="text-white" />
                            </div>
                            <h2 className="font-extrabold text-gray-900 dark:text-gray-100 text-sm">{t('popularRanking')}</h2>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium ml-auto">{t('last7days')}</span>
                        </div>
                        <div className="relative group">
                            {/* Left Arrow */}
                            <button
                                onClick={() => { const el = popularScrollRef.current; if (el) el.scrollBy({ left: -280, behavior: 'smooth' }); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {/* Right Arrow */}
                            <button
                                onClick={() => { const el = popularScrollRef.current; if (el) el.scrollBy({ left: 280, behavior: 'smooth' }); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-sm"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <div
                                ref={popularScrollRef}
                                className="flex gap-3 overflow-x-auto p-4 scroll-smooth cursor-grab active:cursor-grabbing select-none"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                                onMouseDown={(e) => {
                                    setIsDragging(true);
                                    hasDraggedRef.current = false;
                                    setDragStartX(e.clientX);
                                    setScrollStartX(popularScrollRef.current?.scrollLeft || 0);
                                }}
                                onMouseMove={(e) => {
                                    if (!isDragging) return;
                                    e.preventDefault();
                                    const dx = e.clientX - dragStartX;
                                    if (Math.abs(dx) > 5) hasDraggedRef.current = true;
                                    if (popularScrollRef.current) {
                                        popularScrollRef.current.scrollLeft = scrollStartX - dx;
                                    }
                                }}
                                onMouseUp={() => setIsDragging(false)}
                                onMouseLeave={() => setIsDragging(false)}
                            >
                                {popularPosts.map((pp, idx) => {
                                    const rankColors = [
                                        'border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/30 shadow-amber-100 dark:shadow-none',
                                        'border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/80 dark:to-slate-800/60 shadow-gray-100 dark:shadow-none',
                                        'border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30 shadow-orange-100 dark:shadow-none',
                                    ];
                                    const medals = ['🏆', '🥈', '🥉'];
                                    const rankStyle = idx < 3 ? rankColors[idx] : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800';
                                    const engagementScore = (pp.like_count || 0) * 3 + (pp.comment_count || 0) * 2 + (pp.view_count || 0);
                                    return (
                                        <div
                                            key={pp.id}
                                            onClick={() => { if (!hasDraggedRef.current) goToPopularPost(pp.id); }}
                                            className={`flex-shrink-0 w-60 sm:w-72 rounded-xl border-2 p-4 cursor-pointer hover:shadow-lg transition-all duration-200 group/card hover:-translate-y-0.5 ${rankStyle}`}
                                        >
                                            <div className="flex items-center justify-between mb-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{medals[idx] || `#${idx + 1}`}</span>
                                                    {idx < 3 && <span className="text-[10px] font-extrabold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">{idx === 0 ? t('rank1') : idx === 1 ? t('rank2') : t('rank3')}</span>}
                                                </div>
                                                {pp.label && (
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${config.labelColor}`}>{pp.label}</span>
                                                )}
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors leading-tight mb-2">{pp.title}</h4>
                                            <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500">
                                                <span className="truncate font-medium">{getDisplayName(pp, countryToLang(user?.country))}</span>
                                                <div className="flex items-center gap-2.5">
                                                    <span className="flex items-center gap-0.5">
                                                        <Heart size={10} className={pp.is_liked ? 'text-red-500 fill-red-500' : ''} />
                                                        {pp.like_count}
                                                    </span>
                                                    <span className="flex items-center gap-0.5">
                                                        <MessageCircle size={10} />
                                                        {pp.comment_count || 0}
                                                    </span>
                                                    <span className="flex items-center gap-0.5">
                                                        <Eye size={10} />
                                                        {pp.view_count}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Engagement bar */}
                                            <div className="mt-2.5 flex items-center gap-2">
                                                <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${idx === 0 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : idx === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' : idx === 2 ? 'bg-gradient-to-r from-orange-300 to-amber-400' : 'bg-gray-300'}`}
                                                        style={{ width: `${Math.min(100, (engagementScore / Math.max(1, ((popularPosts[0]?.like_count || 0) * 3 + (popularPosts[0]?.comment_count || 0) * 2 + (popularPosts[0]?.view_count || 0)))) * 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[9px] font-bold text-gray-400 flex items-center gap-0.5"><Zap size={8} />{engagementScore}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Write Form Modal */}
            {
                showWriteForm && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) { setShowWriteForm(false); setNewPhotos([]); setPhotoPreviewUrls([]); } }}>
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        {/* Modal Content */}
                        <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border ${config.accentBorder}`}
                            style={{ scrollbarWidth: 'thin' }}>
                            {/* Modal Header */}
                            <div className={`sticky top-0 z-10 flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r ${config.gradient} text-white rounded-t-2xl`}>
                                <h3 className="font-bold flex items-center gap-2 text-lg">
                                    <PenLine size={20} />
                                    {t('writePost')}
                                </h3>
                                <button onClick={() => { setShowWriteForm(false); setNewPhotos([]); setPhotoPreviewUrls([]); }}
                                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            {/* Modal Body */}
                            <div className="p-6">
                                <form onSubmit={handleSubmitPost} className="space-y-4">
                                    {/* Admin Notice Type Selector */}
                                    {isAdmin && (
                                        <div className="mb-1">
                                            <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                                                <Megaphone size={12} />
                                                {t('noticeType')}
                                            </label>
                                            <div className="flex gap-2">
                                                {[{ v: 0, l: t('noticeNormal'), icon: null, color: 'bg-white text-gray-600 border-gray-200' },
                                                { v: 1, l: t('noticeGeneral'), icon: <Megaphone size={11} />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                                                { v: 2, l: t('noticeRequired'), icon: <Pin size={11} />, color: 'bg-red-50 text-red-700 border-red-200' }
                                                ].map(opt => (
                                                    <button
                                                        key={opt.v}
                                                        type="button"
                                                        onClick={() => setNewPost(p => ({ ...p, is_notice: opt.v }))}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${newPost.is_notice === opt.v
                                                            ? (opt.v === 2 ? 'bg-red-500 text-white border-red-500 shadow-sm' : opt.v === 1 ? 'bg-blue-500 text-white border-blue-500 shadow-sm' : 'bg-gray-800 text-white border-gray-800 shadow-sm')
                                                            : opt.color + ' hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {opt.icon}
                                                        {opt.l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Label Selection */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                                            <Tag size={12} />
                                            {t('selectLabel')}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {DEFAULT_LABELS.map(lbl => (
                                                <button
                                                    key={lbl}
                                                    type="button"
                                                    onClick={() => setNewPost(p => ({ ...p, label: p.label === lbl ? '' : lbl }))}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${newPost.label === lbl
                                                        ? config.labelActiveColor + ' shadow-sm scale-105'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {lbl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t('titlePlaceholder')}
                                        value={newPost.title}
                                        onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-sm"
                                    />
                                    {/* Content */}
                                    <div className="relative">
                                        <textarea
                                            ref={contentTextareaRef}
                                            placeholder={t('contentPlaceholder')}
                                            value={newPost.content}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setNewPost(p => ({ ...p, content: val }));
                                                // @mention detection
                                                const cursorPos = e.target.selectionStart;
                                                const textBefore = val.substring(0, cursorPos);
                                                const mentionMatch = textBefore.match(/@([\w\uAC00-\uD7A3]*)$/);
                                                if (mentionMatch) {
                                                    const q = mentionMatch[1];
                                                    setMentionQuery(q);
                                                    if (q.length >= 1) {
                                                        fetch(`/api/users/search_users.php?q=${encodeURIComponent(q)}`, { credentials: 'include' })
                                                            .then(r => r.json())
                                                            .then(data => {
                                                                setMentionResults(data.users || []);
                                                                setShowMentionDropdown((data.users || []).length > 0);
                                                            });
                                                    }
                                                } else {
                                                    setShowMentionDropdown(false);
                                                }
                                            }}
                                            rows={6}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium resize-none"
                                        />
                                        {/* @Mention Dropdown */}
                                        {
                                            showMentionDropdown && mentionResults.length > 0 && (
                                                <div className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                                                    {mentionResults.map(mu => (
                                                        <button
                                                            key={mu.id}
                                                            type="button"
                                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 transition-colors text-left"
                                                            onClick={() => {
                                                                const content = newPost.content;
                                                                const before = content.substring(0, mentionCursorPos);
                                                                const after = content.substring(mentionCursorPos);
                                                                const mentionStart = before.lastIndexOf('@');
                                                                const newContent = before.substring(0, mentionStart) + `@${mu.name} ` + after;
                                                                setNewPost(p => ({ ...p, content: newContent }));
                                                                setShowMentionDropdown(false);
                                                                setMentionResults([]);
                                                                setTimeout(() => contentTextareaRef.current?.focus(), 50);
                                                            }}
                                                        >
                                                            <div className="w-7 h-7 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                                {mu.profile_image ? (
                                                                    <img src={mu.profile_image} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <User size={14} className="text-gray-500" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <span className="text-sm font-bold text-gray-900">{mu.name}</span>
                                                                <span className="ml-2 text-[10px] text-gray-400 font-medium">{mu.role === 'seller' ? '' : mu.role === 'host' ? 'Host' : mu.role}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Keywords Input */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                                            <Hash size={12} />
                                            {t('keywordsLabel')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('keywordsPlaceholder')}
                                            value={newPost.keywords}
                                            onChange={e => setNewPost(p => ({ ...p, keywords: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">{t('keywordsHint')}</p>
                                    </div>

                                    {/* Poll Options (shown when '투표' label is selected) */}
                                    {(newPost.label === t('labels.poll') || showPollForm) && (
                                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100">
                                            <label className="block text-xs font-bold text-indigo-600 mb-3 flex items-center gap-1">
                                                <BarChart2 size={12} />
                                                {t('pollTitle')}
                                            </label>
                                            <div className="space-y-2">
                                                {newPollOptions.map((opt, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-indigo-400 w-5">{idx + 1}</span>
                                                        <input
                                                            type="text"
                                                            placeholder={t('pollOptionPlaceholder', { index: idx + 1 })}
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const updated = [...newPollOptions];
                                                                updated[idx] = e.target.value;
                                                                setNewPollOptions(updated);
                                                            }}
                                                            className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm"
                                                        />
                                                        {newPollOptions.length > 2 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setNewPollOptions(prev => prev.filter((_, i) => i !== idx))}
                                                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {newPollOptions.length < 6 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setNewPollOptions(prev => [...prev, ''])}
                                                    className="mt-2 text-xs font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                                                >
                                                    + {t('pollAddOption')}
                                                </button>
                                            )}
                                            <div className="mt-3 flex items-center gap-2">
                                                <label className="text-xs font-bold text-gray-500">{t('pollEndDate')}:</label>
                                                <input
                                                    type="datetime-local"
                                                    value={pollEndDate}
                                                    onChange={(e) => setPollEndDate(e.target.value)}
                                                    className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Photo Upload */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                                            <ImagePlus size={12} />
                                            {t('maxImages', { count: 10 })}
                                        </label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {photoPreviewUrls.map((url, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                                    {/* Order badge */}
                                                    <span className="absolute top-1 left-1 w-5 h-5 bg-black/60 text-white text-[10px] font-bold rounded-md flex items-center justify-center">
                                                        {idx + 1}
                                                    </span>
                                                    {/* Delete button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(idx)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                    {/* Reorder buttons */}
                                                    {newPhotos.length > 1 && (
                                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {idx > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => movePhoto(idx, 'left')}
                                                                    className="p-1 bg-black/60 text-white rounded-md hover:bg-black/80 transition-colors"
                                                                >
                                                                    <ArrowLeft size={10} />
                                                                </button>
                                                            )}
                                                            {idx < newPhotos.length - 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => movePhoto(idx, 'right')}
                                                                    className="p-1 bg-black/60 text-white rounded-md hover:bg-black/80 transition-colors"
                                                                >
                                                                    <ArrowRight size={10} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {newPhotos.length < 10 && (
                                                <button
                                                    type="button"
                                                    onClick={() => photoInputRef.current?.click()}
                                                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                                                >
                                                    <ImagePlus size={20} />
                                                    <span className="text-[10px] mt-1 font-medium">{newPhotos.length}/10</span>
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            ref={photoInputRef}
                                            onChange={handlePhotoSelect}
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                        />
                                    </div>

                                    {/* Action Buttons - sticky at bottom */}
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => { setShowWriteForm(false); setNewPhotos([]); setPhotoPreviewUrls([]); }}
                                            className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm transition-colors"
                                        >
                                            {t('cancel')}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className={`px-6 py-2.5 ${config.buttonBg} text-white rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50`}
                                        >
                                            <Send size={14} />
                                            {submitting ? t('submitting') : t('publish')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Ad Section - Community Top */}
            <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('sponsor')}</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>
                <AdSlot slotId={`${type}_community_top`} format="banner" />
            </div>

            {/* Access Denied */}
            {
                accessDenied ? (
                    <div className="bg-white rounded-2xl border border-red-100 p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <ShieldAlert size={32} className="text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{t('accessDenied')}</h3>
                        <p className="text-gray-500 text-sm mb-6">{accessDenied.message}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                        >
                            <ChevronLeft size={16} />
                            {t('goBack')}
                        </button>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                        {feedMode === 'bookmarks' ? (
                            <>
                                <Bookmark className="mx-auto text-amber-300 mb-4" size={48} />
                                <p className="text-gray-500 font-medium">{t('noBookmarks')}</p>
                                <p className="text-gray-400 text-sm mt-1">{t('noBookmarksDesc')}</p>
                            </>
                        ) : (
                            <>
                                <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500 font-medium">{t('noPostsYet')}</p>
                                <p className="text-gray-400 text-sm mt-1">{t('writeFirstPost')}</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Notice Strip */}
                        {notices.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                {notices.filter(n => n.is_notice === 2).map(n => (
                                    <div key={n.id}
                                        onClick={() => { setExpandedPost(n.id); const el = document.getElementById(`post-${n.id}`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); else goToPopularPost(n.id); }}
                                        className="flex items-center gap-2 px-3 py-2 border-b border-gray-50 last:border-b-0 cursor-pointer hover:bg-red-50/50 transition-colors"
                                    >
                                        <Pin size={12} className="text-red-500 flex-shrink-0" />
                                        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex-shrink-0">{t('requiredNotice')}</span>
                                        <span className="text-xs font-bold text-gray-800 truncate">{n.title}</span>
                                        <span className="text-[10px] text-gray-400 ml-auto flex-shrink-0">{new Date(n.created_at).toLocaleDateString('ko-KR')}</span>
                                    </div>
                                ))}
                                {notices.filter(n => n.is_notice === 1).length > 0 && (
                                    <>
                                        {(noticesExpanded ? notices.filter(n => n.is_notice === 1) : notices.filter(n => n.is_notice === 1).slice(0, 2)).map(n => (
                                            <div key={n.id}
                                                onClick={() => { setExpandedPost(n.id); const el = document.getElementById(`post-${n.id}`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); else goToPopularPost(n.id); }}
                                                className="flex items-center gap-2 px-3 py-2 border-b border-gray-50 last:border-b-0 cursor-pointer hover:bg-blue-50/50 transition-colors"
                                            >
                                                <Megaphone size={12} className="text-blue-500 flex-shrink-0" />
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex-shrink-0">{t('notice')}</span>
                                                <span className="text-xs text-gray-700 truncate">{n.title}</span>
                                                <span className="text-[10px] text-gray-400 ml-auto flex-shrink-0">{new Date(n.created_at).toLocaleDateString('ko-KR')}</span>
                                            </div>
                                        ))}
                                        {notices.filter(n => n.is_notice === 1).length > 2 && (
                                            <button
                                                onClick={() => setNoticesExpanded(!noticesExpanded)}
                                                className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                                            >
                                                <ChevronDown size={12} className={`transition-transform ${noticesExpanded ? 'rotate-180' : ''}`} />
                                                {noticesExpanded ? t('foldNotices') : t('moreNotices', { count: notices.filter(n => n.is_notice === 1).length - 2 })}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                        {posts.map((post, postIdx) => {
                            const roleBadge = getRoleBadge(post.user_role);
                            const isExpanded = expandedPost === post.id;
                            const hasPhotos = post.photos && post.photos.length > 0;
                            const postBadge = getPostBadge(post);

                            const isHighlighted = highlightedPostId === post.id;

                            return (
                                <React.Fragment key={post.id}>
                                    {/* Repeating feed ad: first at index 2, then every 5 posts */}
                                    {(postIdx === 2 || (postIdx > 2 && (postIdx - 2) % 5 === 0)) && (
                                        <AdSlot slotId={`${type}_community_feed`} format="native" className="my-3" />
                                    )}
                                    <div
                                        id={`post-${post.id}`}
                                        ref={isHighlighted ? highlightRef : undefined}
                                        className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all ${isHighlighted
                                            ? 'border-amber-400 ring-2 ring-amber-300 animate-pulse shadow-amber-100 shadow-lg'
                                            : 'border-gray-100'
                                            }`}
                                    >
                                        <div
                                            className="p-5 cursor-pointer relative"
                                            onClick={(e) => { handleDoubleTap(e, post.id); handleTogglePost(post.id); }}
                                        >
                                            {/* Double-tap heart animation */}
                                            {doubleTapHeart === post.id && (
                                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                                    <Heart size={64} className="text-red-500 fill-red-500" style={{ animation: 'heartBurst 0.8s ease-out forwards' }} />
                                                </div>
                                            )}
                                            {/* NEW / HOT Badge */}
                                            {postBadge && (
                                                <div className="absolute top-3 right-3 z-10">
                                                    {postBadge === 'hot' ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-extrabold rounded-full shadow-sm">
                                                            <Flame size={10} /> HOT
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-extrabold rounded-full shadow-sm">
                                                            <Zap size={10} /> NEW
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all"
                                                    onClick={(e) => openUserProfile(e, post.user_id)}
                                                >
                                                    {post.profile_image ? (
                                                        <img src={post.profile_image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={18} className="text-gray-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span
                                                            className="font-bold text-gray-900 text-sm cursor-pointer hover:text-indigo-600 transition-colors"
                                                            onClick={(e) => openUserProfile(e, post.user_id)}
                                                        >{getDisplayName(post, countryToLang(user?.country))}</span>
                                                        {type === 'general' && (() => {
                                                            const RoleBadgeIcon = roleBadge.icon;
                                                            return (
                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-0.5 ${roleBadge.color}`}>
                                                                    {RoleBadgeIcon && <RoleBadgeIcon size={9} />}
                                                                    {roleBadge.label}
                                                                </span>
                                                            );
                                                        })()}
                                                        {/* Activity Level Badge */}
                                                        {(() => {
                                                            const actBadge = getActivityBadge(post.activity_level || 1);
                                                            return (
                                                                <span className={`text-[10px] font-bold ${actBadge.color}`} title={t('activityLevel', { level: actBadge.label })}>
                                                                    {actBadge.emoji}{actBadge.label}
                                                                </span>
                                                            );
                                                        })()}
                                                        {post.label && (
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${config.labelColor}`}>
                                                                {translateLabel(post.label)}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {formatDate(post.created_at)}
                                                        </span>
                                                        {hasPhotos && (
                                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                                <ImagePlus size={10} />
                                                                {post.photos.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 truncate">
                                                        <TranslatedText text={post.title} sourceLang={post.original_lang} showBadge={false} />
                                                        {commentCounts[post.id] > 0 && (
                                                            <span className="ml-2 text-xs font-medium text-gray-400 inline-flex items-center gap-0.5">
                                                                <MessageCircle size={11} />
                                                                {commentCounts[post.id]}
                                                            </span>
                                                        )}
                                                    </h3>
                                                    {/* Cover Image for non-expanded cards */}
                                                    {!isExpanded && hasPhotos && (
                                                        <div className="mt-2 rounded-xl overflow-hidden h-36 bg-gray-100">
                                                            <img src={post.photos[0].image_url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                                        </div>
                                                    )}
                                                    {!isExpanded && (
                                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2"><TranslatedText text={post.content} sourceLang={post.original_lang} showBadge={false} /></p>
                                                    )}
                                                    {/* Keyword Chips */}
                                                    {post.keywords && post.keywords.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {post.keywords.map((kw, ki) => (
                                                                <button
                                                                    key={ki}
                                                                    onClick={(e) => { e.stopPropagation(); setSearchQuery(kw); setPage(1); }}
                                                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer"
                                                                >
                                                                    #{kw}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {/* Like / View count / Share / Bookmark bar */}
                                                    <div className="flex items-center gap-3 mt-3">
                                                        <button
                                                            onClick={(e) => handleToggleLike(e, post.id)}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${post.is_liked ? 'text-red-500 bg-red-50 scale-105' : 'text-gray-400 hover:text-red-400 hover:bg-red-50/50'}`}
                                                        >
                                                            <Heart size={18} className={`transition-transform ${post.is_liked ? 'fill-red-500 scale-110' : ''}`} />
                                                            <span className="tabular-nums">{post.like_count || 0}</span>
                                                        </button>
                                                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                                            <MessageCircle size={16} />
                                                            <span className="tabular-nums">{commentCounts[post.id] || 0}</span>
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                                            <Eye size={16} />
                                                            <span className="tabular-nums">{post.view_count || 0}</span>
                                                        </span>
                                                        <div className="relative" ref={shareMenuPostId === post.id ? shareMenuRef : undefined}>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const shareUrl = `${window.location.origin}/api/community/share_preview.php?post=${post.id}&type=${type}`;
                                                                    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
                                                                        const shareText = `[SpaceMatch ${config.title}] ${post.title}`;
                                                                        navigator.share({ title: shareText, text: `${shareText}\n${post.content?.substring(0, 100)}...`, url: shareUrl }).catch(() => { });
                                                                        // Increment share count
                                                                        fetch(`${API_BASE}/community_posts.php?type=${type}&increment_share=${post.id}`, { credentials: 'include' }).catch(() => { });
                                                                    } else {
                                                                        setShareMenuPostId(shareMenuPostId === post.id ? null : post.id);
                                                                    }
                                                                }}
                                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${shareMenuPostId === post.id ? 'text-indigo-500 bg-indigo-50' : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50/50'}`}
                                                                title={t('shareTitle')}
                                                            >
                                                                <Share2 size={16} />
                                                                <span>{t('share')}{post.share_count > 0 ? ` ${post.share_count}` : ''}</span>
                                                            </button>

                                                            {/* Share Dropdown */}
                                                            {shareMenuPostId === post.id && (
                                                                <div
                                                                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                                                    style={{ animation: 'fadeInUp 0.2s ease-out' }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                                                        <p className="text-xs font-bold text-gray-700">{t('shareTitle')}</p>
                                                                    </div>
                                                                    <div className="p-1.5">
                                                                        {/* Copy Link */}
                                                                        <button
                                                                            onClick={async () => {
                                                                                const shareUrl = `${window.location.origin}/api/community/share_preview.php?post=${post.id}&type=${type}`;
                                                                                try {
                                                                                    await navigator.clipboard.writeText(shareUrl);
                                                                                } catch {
                                                                                    const ta = document.createElement('textarea');
                                                                                    ta.value = shareUrl;
                                                                                    document.body.appendChild(ta);
                                                                                    ta.select();
                                                                                    document.execCommand('copy');
                                                                                    document.body.removeChild(ta);
                                                                                }
                                                                                setCopiedPostId(post.id);
                                                                                setTimeout(() => setCopiedPostId(null), 2000);
                                                                                setTimeout(() => setShareMenuPostId(null), 1500);
                                                                                // Increment share count
                                                                                fetch(`${API_BASE}/community_posts.php?type=${type}&increment_share=${post.id}`, { credentials: 'include' }).catch(() => { });
                                                                            }}
                                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors group"
                                                                        >
                                                                            {copiedPostId === post.id ? (
                                                                                <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-lg">
                                                                                    <Check size={16} className="text-emerald-600" />
                                                                                </div>
                                                                            ) : (
                                                                                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 group-hover:bg-indigo-100 rounded-lg transition-colors">
                                                                                    <Link2 size={16} className="text-gray-500 group-hover:text-indigo-600" />
                                                                                </div>
                                                                            )}
                                                                            <div className="text-left">
                                                                                <p className={`text-sm font-bold ${copiedPostId === post.id ? 'text-emerald-600' : 'text-gray-700'}`}>
                                                                                    {copiedPostId === post.id ? t('linkCopied') : t('copyLink')}
                                                                                </p>
                                                                                <p className="text-[10px] text-gray-400">{t('copyLinkDesc')}</p>
                                                                            </div>
                                                                        </button>

                                                                        {/* KakaoTalk */}
                                                                        <button
                                                                            onClick={() => {
                                                                                const shareUrl = `${window.location.origin}/api/community/share_preview.php?post=${post.id}&type=${type}`;
                                                                                const text = `[SpaceMatch ${t(config.titleKey)}] ${post.title}`;
                                                                                const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
                                                                                window.open(kakaoUrl, '_blank', 'width=500,height=600');
                                                                                setShareMenuPostId(null);
                                                                                // Increment share count
                                                                                fetch(`${API_BASE}/community_posts.php?type=${type}&increment_share=${post.id}`, { credentials: 'include' }).catch(() => { });
                                                                            }}
                                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-yellow-50 transition-colors group"
                                                                        >
                                                                            <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-lg">
                                                                                <svg viewBox="0 0 24 24" width="16" height="16" fill="#3C1E1E">
                                                                                    <path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.69 1.76 5.04 4.4 6.38l-1.12 4.12c-.1.36.3.65.6.44L10.5 18.5c.49.06 1 .1 1.5.1 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" />
                                                                                </svg>
                                                                            </div>
                                                                            <div className="text-left">
                                                                                <p className="text-sm font-bold text-gray-700">{t('kakaoTalk')}</p>
                                                                                <p className="text-[10px] text-gray-400">{t('kakaoTalkDesc')}</p>
                                                                            </div>
                                                                        </button>

                                                                        {/* X (Twitter) Share */}
                                                                        <button
                                                                            onClick={() => {
                                                                                const shareUrl = `${window.location.origin}/api/community/share_preview.php?post=${post.id}&type=${type}`;
                                                                                const text = `${post.title} - SpaceMatch ${t(config.titleKey)}`;
                                                                                const hashtags = (post.keywords || []).slice(0, 3).join(',');
                                                                                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}${hashtags ? `&hashtags=${encodeURIComponent(hashtags)}` : ''}`;
                                                                                window.open(twitterUrl, '_blank', 'width=550,height=420');
                                                                                setShareMenuPostId(null);
                                                                                fetch(`${API_BASE}/community_posts.php?type=${type}&increment_share=${post.id}`, { credentials: 'include' }).catch(() => { });
                                                                            }}
                                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors group"
                                                                        >
                                                                            <div className="w-8 h-8 flex items-center justify-center bg-gray-900 rounded-lg">
                                                                                <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
                                                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                                                </svg>
                                                                            </div>
                                                                            <div className="text-left">
                                                                                <p className="text-sm font-bold text-gray-700">{t('xTwitter')}</p>
                                                                                <p className="text-[10px] text-gray-400">{t('xTwitterDesc')}</p>
                                                                            </div>
                                                                        </button>

                                                                        {/* Native Share (only if supported) */}
                                                                        {navigator.share && (
                                                                            <button
                                                                                onClick={async () => {
                                                                                    const shareUrl = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
                                                                                    const shareText = `[SpaceMatch ${t(config.titleKey)}] ${post.title}`;
                                                                                    try {
                                                                                        await navigator.share({ title: shareText, text: `${shareText}\n${post.content?.substring(0, 100)}...`, url: shareUrl });
                                                                                    } catch (e) { }
                                                                                    setShareMenuPostId(null);
                                                                                }}
                                                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group"
                                                                            >
                                                                                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg">
                                                                                    <ExternalLink size={16} className="text-blue-600" />
                                                                                </div>
                                                                                <div className="text-left">
                                                                                    <p className="text-sm font-bold text-gray-700">{t('shareOther')}</p>
                                                                                    <p className="text-[10px] text-gray-400">{t('shareOtherDesc')}</p>
                                                                                </div>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Bookmark button */}
                                                        <button
                                                            onClick={(e) => handleToggleBookmark(e, post.id)}
                                                            className={`ml-auto flex items-center gap-1 px-2 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${bookmarkedPosts.has(post.id) ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50/50'}`}
                                                            title={t('bookmark')}
                                                        >
                                                            {bookmarkedPosts.has(post.id) ? <BookmarkCheck size={16} className="fill-amber-500" /> : <Bookmark size={16} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="px-5 pb-5 border-t border-gray-50">
                                                <div className="pt-4">
                                                    {editingPost === post.id ? (
                                                        <div className="space-y-3">
                                                            <div className="flex flex-wrap gap-2 mb-2">
                                                                {DEFAULT_LABELS.map(lbl => (
                                                                    <button
                                                                        key={lbl}
                                                                        type="button"
                                                                        onClick={(e) => { e.stopPropagation(); setEditData(d => ({ ...d, label: d.label === lbl ? '' : lbl })); }}
                                                                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${editData.label === lbl ? config.labelActiveColor : 'bg-white text-gray-500 border-gray-200'
                                                                            }`}
                                                                    >
                                                                        {lbl}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={editData.title}
                                                                onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-indigo-400"
                                                                onClick={e => e.stopPropagation()}
                                                            />
                                                            <textarea
                                                                value={editData.content}
                                                                onChange={e => setEditData(d => ({ ...d, content: e.target.value }))}
                                                                rows={4}
                                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 resize-none"
                                                                onClick={e => e.stopPropagation()}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                                                            <TranslatedText text={post.content} sourceLang={post.original_lang} as="p" />
                                                        </div>
                                                    )}

                                                    {/* Post Photos */}
                                                    {hasPhotos && (
                                                        <div className={`grid gap-2 mt-4 ${post.photos.length === 1 ? 'grid-cols-1' : post.photos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                                            {post.photos.map((photo, idx) => (
                                                                <div
                                                                    key={photo.id || idx}
                                                                    className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
                                                                    onClick={(e) => { e.stopPropagation(); openPhotoViewer(post.photos, idx); }}
                                                                >
                                                                    <img src={photo.image_url} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Poll UI (if post has poll data) */}
                                                {(() => {
                                                    const poll = pollData[post.id];
                                                    if (!poll) {
                                                        // Fetch poll data on expand if label matches
                                                        if (isExpanded && (post.label === '투표' || post.label === 'Poll' || post.label === '投票' || post.label === 'Bình chọn' || post.label === 'โหวต' || post.label === 'ការបោះឆ្នោត' || post.label === 'Опрос' || post.label === 'Опитування')) {
                                                            if (!pollData[post.id] && !pollData[`loading_${post.id}`]) {
                                                                setPollData(prev => ({ ...prev, [`loading_${post.id}`]: true }));
                                                                fetchPollData(post.id);
                                                            }
                                                        }
                                                        return null;
                                                    }

                                                    const hasVoted = poll.user_voted !== null;
                                                    const showResults = hasVoted || poll.is_ended;

                                                    return (
                                                        <div className="mt-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <h5 className="text-sm font-bold text-indigo-700 flex items-center gap-1.5">
                                                                    <BarChart2 size={14} />
                                                                    {t('pollTitle')}
                                                                </h5>
                                                                <span className="text-xs text-gray-400">
                                                                    {t('pollTotalVotes', { count: poll.total_votes })}
                                                                </span>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {poll.options.map(opt => {
                                                                    const pct = poll.total_votes > 0 ? Math.round((opt.vote_count / poll.total_votes) * 100) : 0;
                                                                    const isSelected = poll.user_voted === opt.id;

                                                                    return showResults ? (
                                                                        <div key={opt.id} className="relative">
                                                                            <div className={`relative overflow-hidden rounded-lg px-3 py-2.5 border ${isSelected ? 'border-indigo-400 bg-white' : 'border-gray-200 bg-white'}`}>
                                                                                <div
                                                                                    className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${isSelected ? 'bg-indigo-100' : 'bg-gray-100'}`}
                                                                                    style={{ width: `${pct}%` }}
                                                                                />
                                                                                <div className="relative flex items-center justify-between">
                                                                                    <span className={`text-sm font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                                                        {isSelected && <CheckCircle size={12} className="inline mr-1" />}
                                                                                        {opt.option_text}
                                                                                    </span>
                                                                                    <span className={`text-xs font-bold ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>
                                                                                        {pct}%
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            key={opt.id}
                                                                            onClick={(e) => { e.stopPropagation(); handlePollVote(poll.id, opt.id, post.id); }}
                                                                            className="w-full text-left px-3 py-2.5 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-400 transition-all text-sm font-medium text-gray-700"
                                                                        >
                                                                            {opt.option_text}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                            {poll.end_date && (
                                                                <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                                                    <CalendarClock size={10} />
                                                                    {t('pollEndDate')}: {new Date(poll.end_date).toLocaleString()}
                                                                </p>
                                                            )}
                                                            {poll.is_ended && (
                                                                <p className="text-xs text-red-400 font-bold mt-1">{t('pollEnded')}</p>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                                {post.can_manage && (
                                                    <div className="mt-4 flex justify-end gap-3">
                                                        {editingPost === post.id ? (
                                                            <>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setEditingPost(null); }}
                                                                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                                                                >
                                                                    <X size={12} />
                                                                    {t('cancel')}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleEditPost(post.id); }}
                                                                    className="text-xs text-green-500 hover:text-green-700 flex items-center gap-1 transition-colors font-bold"
                                                                >
                                                                    <Check size={12} />
                                                                    {t('editDone')}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); startEditing(post); }}
                                                                    className="text-xs text-blue-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                                                >
                                                                    <Edit3 size={12} />
                                                                    {t('edit')}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                                                                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                                                                >
                                                                    <Trash2 size={12} />
                                                                    {t('delete')}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Report button (not for own posts) */}
                                                {!post.is_mine && (
                                                    <div className={`${post.can_manage ? '' : 'mt-4'} flex justify-end`}>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setReportModal({ postId: post.id }); setReportReason(''); setReportDetail(''); }}
                                                            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                                                        >
                                                            <Flag size={12} />
                                                            {t('reportPost')}
                                                        </button>
                                                    </div>
                                                )}

                                                {/* ===== COMMENTS SECTION ===== */}
                                                <div className="mt-6 pt-5 border-t border-gray-100">
                                                    <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
                                                        <MessageCircle size={16} />
                                                        {t('comment')} {commentCounts[post.id] > 0 && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{commentCounts[post.id]}</span>}
                                                    </h4>

                                                    {/* Comment Input */}
                                                    <div className="flex gap-2 mb-4">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                                                            {user?.profile_image ? (
                                                                <img src={user.profile_image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <User size={14} className="text-gray-500" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={commentInput}
                                                                onChange={e => setCommentInput(e.target.value)}
                                                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(post.id); } }}
                                                                placeholder={t('writeComment')}
                                                                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                                                                onClick={e => e.stopPropagation()}
                                                            />
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleSubmitComment(post.id); }}
                                                                disabled={submittingComment || !commentInput.trim()}
                                                                className={`px-3 py-2 ${config.buttonBg} text-white rounded-xl text-sm font-bold transition-all disabled:opacity-40 flex-shrink-0`}
                                                            >
                                                                <Send size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Comments List */}
                                                    {commentsMap[post.id] && commentsMap[post.id].length > 0 ? (
                                                        <div className="space-y-3">
                                                            {commentsMap[post.id].map(comment => {
                                                                const cBadge = getRoleBadge(comment.user_role);
                                                                return (
                                                                    <div key={comment.id} className="group/comment">
                                                                        {/* Top-level comment */}
                                                                        <div className="flex gap-2.5">
                                                                            <div className="w-7 h-7 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-white flex-shrink-0 overflow-hidden mt-0.5">
                                                                                {comment.profile_image ? (
                                                                                    <img src={comment.profile_image} alt="" className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                    <User size={12} className="text-gray-500" />
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                                                    <span className="text-xs font-bold text-gray-800">{getDisplayName(comment, countryToLang(user?.country))}</span>
                                                                                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${cBadge.color}`}>{cBadge.label}</span>
                                                                                    <span className="text-[10px] text-gray-400">{formatDate(comment.created_at)}</span>
                                                                                </div>
                                                                                <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap"><TranslatedText text={comment.content} sourceLang={comment.original_lang} /></p>
                                                                                {comment.country && <CountryBadge country={comment.country} size="xs" className="mt-1" />}
                                                                                <div className="flex items-center gap-3 mt-1">
                                                                                    <button
                                                                                        onClick={(e) => handleToggleCommentLike(e, post.id, comment.id)}
                                                                                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${comment.is_liked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-50/50'}`}
                                                                                    >
                                                                                        <Heart size={12} className={comment.is_liked ? 'fill-red-500' : ''} />
                                                                                        {comment.like_count > 0 && comment.like_count}
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={(e) => { e.stopPropagation(); setReplyingTo(replyingTo?.commentId === comment.id ? null : { commentId: comment.id, userName: getDisplayName(comment, countryToLang(user?.country)) }); setReplyInput(''); }}
                                                                                        className="text-[11px] text-gray-400 hover:text-indigo-500 font-medium flex items-center gap-1 transition-colors"
                                                                                    >
                                                                                        <CornerDownRight size={10} />
                                                                                        {t('reply')}</button>
                                                                                    {comment.can_delete && (
                                                                                        <button
                                                                                            onClick={(e) => { e.stopPropagation(); handleDeleteComment(post.id, comment.id); }}
                                                                                            className="text-[11px] text-gray-400 hover:text-red-500 font-medium flex items-center gap-1 transition-colors opacity-0 group-hover/comment:opacity-100"
                                                                                        >
                                                                                            <Trash2 size={10} />
                                                                                            {t('delete')}
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Reply Input */}
                                                                        {replyingTo?.commentId === comment.id && (
                                                                            <div className="ml-9 mt-2 flex gap-2">
                                                                                <input
                                                                                    type="text"
                                                                                    value={replyInput}
                                                                                    onChange={e => setReplyInput(e.target.value)}
                                                                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitReply(post.id, comment.id); } }}
                                                                                    placeholder={t('replyPlaceholder', { name: replyingTo.userName })}
                                                                                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                                                                                    onClick={e => e.stopPropagation()}
                                                                                    autoFocus
                                                                                />
                                                                                <button
                                                                                    onClick={(e) => { e.stopPropagation(); handleSubmitReply(post.id, comment.id); }}
                                                                                    disabled={submittingComment || !replyInput.trim()}
                                                                                    className={`px-2.5 py-1.5 ${config.buttonBg} text-white rounded-lg text-xs font-bold transition-all disabled:opacity-40`}
                                                                                >
                                                                                    <Send size={12} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={(e) => { e.stopPropagation(); setReplyingTo(null); setReplyInput(''); }}
                                                                                    className="px-2 py-1.5 text-gray-400 hover:text-gray-600 text-xs"
                                                                                >
                                                                                    <X size={12} />
                                                                                </button>
                                                                            </div>
                                                                        )}

                                                                        {/* Replies */}
                                                                        {comment.replies && comment.replies.length > 0 && (
                                                                            <div className="ml-9 mt-2 space-y-2 pl-3 border-l-2 border-gray-100">
                                                                                {comment.replies.map(reply => {
                                                                                    const rBadge = getRoleBadge(reply.user_role);
                                                                                    return (
                                                                                        <div key={reply.id} className="flex gap-2 group/reply">
                                                                                            <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md flex items-center justify-center text-white flex-shrink-0 overflow-hidden mt-0.5">
                                                                                                {reply.profile_image ? (
                                                                                                    <img src={reply.profile_image} alt="" className="w-full h-full object-cover" />
                                                                                                ) : (
                                                                                                    <User size={10} className="text-gray-500" />
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                                                                    <span className="text-[11px] font-bold text-gray-800">{getDisplayName(reply, countryToLang(user?.country))}</span>
                                                                                                    <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${rBadge.color}`}>{rBadge.label}</span>
                                                                                                    <span className="text-[10px] text-gray-400">{formatDate(reply.created_at)}</span>
                                                                                                </div>
                                                                                                <p className="text-xs text-gray-700 mt-0.5 whitespace-pre-wrap">{reply.content}</p>
                                                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                                                    <button
                                                                                                        onClick={(e) => handleToggleCommentLike(e, post.id, reply.id)}
                                                                                                        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium transition-all ${reply.is_liked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-50/50'}`}
                                                                                                    >
                                                                                                        <Heart size={10} className={reply.is_liked ? 'fill-red-500' : ''} />
                                                                                                        {reply.like_count > 0 && reply.like_count}
                                                                                                    </button>
                                                                                                    {reply.can_delete && (
                                                                                                        <button
                                                                                                            onClick={(e) => { e.stopPropagation(); handleDeleteComment(post.id, reply.id); }}
                                                                                                            className="text-[10px] text-gray-400 hover:text-red-500 font-medium flex items-center gap-1 transition-colors opacity-0 group-hover/reply:opacity-100"
                                                                                                        >
                                                                                                            <Trash2 size={9} />
                                                                                                            {t('delete')}</button>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : commentsMap[post.id] ? (
                                                        <p className="text-xs text-gray-400 text-center py-2">{t('noComments')}</p>
                                                    ) : (
                                                        <div className="flex justify-center py-3">
                                                            <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                )
            }

            {/* Pagination */}
            {
                totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-4">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm font-medium text-gray-600 px-3">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )
            }

            {/* Photo Viewer Modal */}
            {
                photoViewerImages.length > 0 && (
                    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center" onClick={closePhotoViewer}>
                        <button className="absolute top-4 right-4 text-white/80 hover:text-white p-2" onClick={closePhotoViewer}>
                            <X size={28} />
                        </button>
                        <div className="flex items-center gap-4 max-w-4xl w-full px-4" onClick={e => e.stopPropagation()}>
                            {photoViewerImages.length > 1 && (
                                <button
                                    className="text-white/60 hover:text-white p-2 flex-shrink-0"
                                    onClick={() => setPhotoViewerIndex(i => (i - 1 + photoViewerImages.length) % photoViewerImages.length)}
                                >
                                    <ChevronLeft size={32} />
                                </button>
                            )}
                            <div className="flex-1 flex items-center justify-center">
                                <img
                                    src={photoViewerImages[photoViewerIndex]?.image_url}
                                    alt=""
                                    className="max-h-[80vh] max-w-full object-contain rounded-lg"
                                />
                            </div>
                            {photoViewerImages.length > 1 && (
                                <button
                                    className="text-white/60 hover:text-white p-2 flex-shrink-0"
                                    onClick={() => setPhotoViewerIndex(i => (i + 1) % photoViewerImages.length)}
                                >
                                    <ChevronRight size={32} />
                                </button>
                            )}
                        </div>
                        {photoViewerImages.length > 1 && (
                            <div className="absolute bottom-6 text-white/60 text-sm font-medium">
                                {photoViewerIndex + 1} / {photoViewerImages.length}
                            </div>
                        )}
                    </div>
                )
            }
            {/* User Profile Popup Modal */}
            {
                profilePopup && (
                    <div
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => { setProfilePopup(null); setProfileData(null); }}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                            style={{ animation: 'fadeInUp 0.25s ease-out' }}
                        >
                            {profileLoading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                </div>
                            ) : profileData ? (
                                <>
                                    {/* Header */}
                                    <div className="relative p-6 pb-4 border-b border-gray-100">
                                        <button
                                            onClick={() => { setProfilePopup(null); setProfileData(null); }}
                                            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                                                {profileData.user.profile_image ? (
                                                    <img src={profileData.user.profile_image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={28} className="text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-xl font-extrabold text-gray-900">{profileData.user.name}</h3>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${profileData.user.role === 'host' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        profileData.user.role === 'seller' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            'bg-purple-50 text-purple-700 border-purple-100'
                                                        }`}>
                                                        {profileData.user.role === 'host' ? t('roleHost') : profileData.user.role === 'seller' ? t('roleSeller') : profileData.user.role === 'superadmin' ? t('roleSuperAdmin') : t('roleAdmin')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={11} />
                                                        {t('joinDate')}: {new Date(profileData.user.created_at).toLocaleDateString()}
                                                    </span>
                                                    {(profileData.user.product_category || profileData.user.category) && (
                                                        <span className="flex items-center gap-1">
                                                            <Tag size={11} />
                                                            {profileData.user.product_category || profileData.user.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Activity Stats */}
                                    <div className="grid grid-cols-3 gap-0 border-b border-gray-100">
                                        <div className="text-center py-4 border-r border-gray-50">
                                            <p className="text-lg font-extrabold text-gray-900">{profileData.community_stats?.post_count || 0}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{t('profilePosts')}</p>
                                        </div>
                                        <div className="text-center py-4 border-r border-gray-50">
                                            <p className="text-lg font-extrabold text-gray-900">{profileData.community_stats?.comment_count || 0}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{t('profileComments')}</p>
                                        </div>
                                        <div className="text-center py-4">
                                            <p className="text-lg font-extrabold text-gray-900">
                                                {profileData.user.role === 'host' ? (profileData.stats?.total_venues || 0) : (profileData.stats?.total_applications || 0)}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                {profileData.user.role === 'host' ? t('registeredVenues') : t('applicationActivity')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Activity Level Card */}
                                    {profileData.activity && (
                                        <div className="px-5 py-4 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">{profileData.activity.level_emoji}</span>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {t('activityLevel', { level: `Lv.${profileData.activity.level}` })}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400">
                                                            {t('activityScore')}: {profileData.activity.total_activity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                                    <span>📝 {profileData.activity.post_count}</span>
                                                    <span>💬 {profileData.activity.comment_count}</span>
                                                    <span>❤️ {profileData.activity.received_likes}</span>
                                                </div>
                                            </div>
                                            {/* Level progress bar */}
                                            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-green-400 via-amber-400 to-red-400 rounded-full transition-all"
                                                    style={{ width: `${Math.min(100, (profileData.activity.total_activity / 100) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Seller Product Photos */}
                                    {profileData.seller_photos && profileData.seller_photos.length > 0 && (
                                        <div className="p-5 border-b border-gray-100">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                                                <ImagePlus size={14} className="text-indigo-500" />
                                                {t('sellerProducts')}
                                            </h4>
                                            <div className="grid grid-cols-4 gap-2">
                                                {profileData.seller_photos.map(photo => (
                                                    <div key={photo.id} className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                                        <img src={photo.image_url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Vendor Venues */}
                                    {profileData.user.role === 'host' && profileData.venues && profileData.venues.length > 0 && (
                                        <div className="p-5 border-b border-gray-100">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                                                <Store size={14} className="text-blue-500" />
                                                {t('registeredVenuesList')}
                                            </h4>
                                            <div className="space-y-2">
                                                {profileData.venues.map(venue => (
                                                    <div key={venue.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                            {venue.images && venue.images[0] ? (
                                                                <img src={venue.images[0]} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center"><Store size={16} className="text-gray-400" /></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 truncate">{venue.name}</p>
                                                            <p className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                                                                <MapPin size={9} />
                                                                {venue.location}
                                                            </p>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded">{venue.type}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Seller Applications (Activity) */}
                                    {profileData.user.role === 'seller' && profileData.applications && profileData.applications.length > 0 && (
                                        <div className="p-5">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                                                <ClipboardList size={14} className="text-green-500" />
                                                {t('activityArea')}
                                            </h4>
                                            <div className="space-y-2">
                                                {profileData.applications.map(app => (
                                                    <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 truncate">{app.venue_name}</p>
                                                            <p className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                                                                <MapPin size={9} />
                                                                {app.venue_location}
                                                            </p>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 flex-shrink-0">{app.venue_type}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* No activity fallback */}
                                    {((!profileData.venues || profileData.venues.length === 0) &&
                                        (!profileData.applications || profileData.applications.length === 0) &&
                                        (!profileData.seller_photos || profileData.seller_photos.length === 0)) && (
                                            <div className="p-8 text-center text-gray-400 text-sm">
                                                {t('noActivityArea')}
                                            </div>
                                        )}
                                </>
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    {t('profileLoadError')}
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
            {/* Confirm Modal */}
            {
                confirmModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className={`p-5 flex items-center gap-3 ${confirmModal.type === 'danger' ? 'bg-red-50' : 'bg-amber-50'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmModal.type === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
                                    <AlertTriangle size={20} className={confirmModal.type === 'danger' ? 'text-red-500' : 'text-amber-500'} />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">{confirmModal.title}</h3>
                            </div>
                            <div className="p-5">
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{confirmModal.message}</p>
                            </div>
                            <div className="px-5 pb-5 flex gap-3">
                                <button onClick={() => setConfirmModal(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">
                                    {t('cancel')}
                                </button>
                                <button onClick={confirmModal.onConfirm} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors text-white ${confirmModal.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}>
                                    {confirmModal.confirmLabel || t('confirm')}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Toast Notification */}
            {
                toast && (
                    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]">
                        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-sm ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                            {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" /> : <X size={18} className="text-red-500 flex-shrink-0" />}
                            <span className="text-sm font-bold">{toast.message}</span>
                            <button onClick={() => setToast(null)} className="ml-2 p-0.5 hover:bg-black/5 rounded-full transition-colors"><X size={14} className="text-gray-400" /></button>
                        </div>
                    </div>
                )
            }

            {/* Floating Action Button (Write) */}
            {
                !showWriteForm && user && (
                    <button
                        onClick={() => setShowWriteForm(true)}
                        className={`fixed bottom-[5.5rem] right-6 w-14 h-14 ${config.buttonBg} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 hover:scale-110 active:scale-95`}
                        title={t('writePost')}
                    >
                        <PenLine size={22} />
                    </button>
                )
            }

            {/* Report Modal */}
            {reportModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={() => setReportModal(null)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Flag size={18} className="text-red-500" />
                                {t('reportPost')}
                            </h3>
                            <button onClick={() => setReportModal(null)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={18} className="text-gray-400" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{t('reportDesc')}</p>
                        <div className="space-y-2 mb-4">
                            {[
                                { key: 'spam', label: t('reportSpam') },
                                { key: 'inappropriate', label: t('reportInappropriate') },
                                { key: 'advertising', label: t('reportAdvertising') },
                                { key: 'other', label: t('reportOther') },
                            ].map(r => (
                                <label key={r.key}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${reportReason === r.key ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="report_reason" value={r.key}
                                        checked={reportReason === r.key}
                                        onChange={() => setReportReason(r.key)}
                                        className="accent-red-500" />
                                    <span className="text-sm font-medium text-gray-700">{r.label}</span>
                                </label>
                            ))}
                        </div>
                        {reportReason === 'other' && (
                            <textarea
                                placeholder={t('reportDetailPlaceholder')}
                                value={reportDetail}
                                onChange={e => setReportDetail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none mb-4"
                                rows={3}
                            />
                        )}
                        <button
                            onClick={handleSubmitReport}
                            disabled={!reportReason || reportSubmitting}
                            className="w-full py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {reportSubmitting ? '...' : t('submitReport')}
                        </button>
                    </div>
                </div>
            )}

            {/* Heart burst animation CSS */}
            <style>{`
                @keyframes heartBurst {
                    0% { transform: scale(0); opacity: 1; }
                    50% { transform: scale(1.3); opacity: 0.8; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `}</style>
        </div >
    );
};

export default CommunityPage;

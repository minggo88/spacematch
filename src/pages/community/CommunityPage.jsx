import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Trash2, ChevronLeft, ChevronRight, PenLine, X, User, Clock, ImagePlus, Tag, Filter, Edit3, Check, CornerDownRight, MessageCircle, Heart, Eye, Flame, Share2, Link2, ExternalLink, ShieldAlert, Search, Hash, AtSign, MapPin, Store, Calendar, ClipboardList, AlertTriangle, CheckCircle } from 'lucide-react';
import AdSlot from '../../components/AdSlot';

const API_BASE = '/api/community';

const COMMUNITY_CONFIG = {
    seller: {
        categories: [
            { id: 'free', label: '자유게시판', icon: 'MessageSquare', color: 'text-blue-600 bg-blue-100' },
            { id: 'info', label: '정보공유', icon: 'Info', color: 'text-emerald-600 bg-emerald-100' },
        ],
        title: '셀러 커뮤니티',
        subtitle: '셀러들의 자유로운 소통 공간',
        gradient: 'from-violet-500 to-purple-600',
        accentBg: 'bg-violet-50',
        accentText: 'text-violet-600',
        accentBorder: 'border-violet-200',
        buttonBg: 'bg-violet-600 hover:bg-violet-700',
        labelColor: 'bg-violet-100 text-violet-700 border-violet-200',
        labelActiveColor: 'bg-violet-600 text-white',
    },
    vendor: {
        title: '벤더 커뮤니티',
        subtitle: '벤더들의 경험과 정보 공유 공간',
        gradient: 'from-emerald-500 to-teal-600',
        accentBg: 'bg-emerald-50',
        accentText: 'text-emerald-600',
        accentBorder: 'border-emerald-200',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
        labelColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        labelActiveColor: 'bg-emerald-600 text-white',
    },
    general: {
        title: '전체 커뮤니티',
        subtitle: '모든 회원의 소통 공간',
        gradient: 'from-blue-500 to-indigo-600',
        accentBg: 'bg-blue-50',
        accentText: 'text-blue-600',
        accentBorder: 'border-blue-200',
        buttonBg: 'bg-blue-600 hover:bg-blue-700',
        labelColor: 'bg-blue-100 text-blue-700 border-blue-200',
        labelActiveColor: 'bg-blue-600 text-white',
    }
};

const DEFAULT_LABELS = ['자유', '질문', '정보공유', '후기', '구인/구직', '정보', '기타'];

const CommunityPage = ({ type = 'general' }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(null); // { message: string }
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showWriteForm, setShowWriteForm] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', label: '', keywords: '' });
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
    const categoryLabels = { free: '자유게시판', info: '정보공유', question: '질문', review: '후기', tip: '팁/노하우' };
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

    // Notification highlight
    const [searchParams, setSearchParams] = useSearchParams();
    const [highlightedPostId, setHighlightedPostId] = useState(null);

    const config = COMMUNITY_CONFIG[type] || COMMUNITY_CONFIG.general;

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
            if (filterLabel) url += `&label=${encodeURIComponent(filterLabel)}`;
            if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery.trim())}`;
            const res = await fetch(url, { credentials: 'include' });
            if (res.status === 403) {
                const data = await res.json();
                setAccessDenied({ message: data.message || '이 커뮤니티에 접근 권한이 없습니다.' });
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (data.success) {
                setPosts(data.posts || []);
                setTotalPages(data.totalPages || 1);
                if (data.labels) setAvailableLabels(data.labels);
            }
        } catch (err) {
            console.error('Failed to load posts:', err);
        } finally {
            setLoading(false);
        }
    }, [type, page, filterLabel, searchQuery]);

    const fetchPopularPosts = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/community_popular.php?type=${type}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setPopularPosts(data.posts || []);
        } catch (err) {
            console.error('Failed to load popular posts:', err);
        }
    }, [type]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

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

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        if (!newPost.title.trim() || !newPost.content.trim()) {
            showToast('제목과 내용을 입력하세요.', 'error');
            return;
        }
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('type', type);
            formData.append('title', newPost.title);
            formData.append('content', newPost.content);
            formData.append('label', newPost.label);
            const keywordsStr = newPost.keywords || '';
            const keywordsArr = keywordsStr.split(/[,#]/).map(k => k.trim()).filter(Boolean);
            if (keywordsArr.length > 0) {
                formData.append('keywords', JSON.stringify(keywordsArr));
            }
            newPhotos.forEach(file => {
                formData.append('photos[]', file);
            });

            const res = await fetch(`${API_BASE}/community_posts.php`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setPosts(prev => [data.post, ...prev]);
                setNewPost({ title: '', content: '', label: '', keywords: '' });
                setNewPhotos([]);
                setPhotoPreviewUrls([]);
                setShowWriteForm(false);
                if (data.post.label && !availableLabels.includes(data.post.label)) {
                    setAvailableLabels(prev => [...prev, data.post.label]);
                }
                showToast('게시글을 등록했습니다!', 'success');
            } else {
                showToast(data.message || '게시글 등록에 실패했습니다.', 'error');
            }
        } catch (err) {
            showToast('게시글 등록 중 오류가 발생했습니다.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async (postId) => {
        setConfirmModal({
            title: '게시글 삭제',
            message: '이 게시글을 삭제하시겠습니까?',
            confirmLabel: '삭제',
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
                        showToast('게시글이 삭제되었습니다.', 'success');
                    } else {
                        showToast('게시글 삭제에 실패했습니다.', 'error');
                    }
                } catch (err) {
                    showToast('삭제 중 오류가 발생했습니다.', 'error');
                }
            }
        });
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000);
        if (diff < 60) return `${diff}초 전`;
        if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
        return d.toLocaleDateString('ko-KR');
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'seller': return { label: '셀러', color: 'bg-violet-100 text-violet-700' };
            case 'vendor': return { label: '벤더', color: 'bg-emerald-100 text-emerald-700' };
            case 'admin': return { label: '관리자', color: 'bg-red-100 text-red-700' };
            case 'superadmin': return { label: '최고관리자', color: 'bg-yellow-100 text-yellow-700' };
            default: return { label: '사용자', color: 'bg-gray-100 text-gray-700' };
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
        if (!editData.title.trim() || !editData.content.trim()) {
            showToast('제목과 내용을 입력하세요.', 'error');
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
                showToast('게시글이 수정되었습니다.', 'success');
            }
        } catch (err) {
            showToast('수정 중 오류가 발생했습니다.', 'error');
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
        if (!commentInput.trim()) return;
        setSubmittingComment(true);
        try {
            const res = await fetch(`${API_BASE}/community_comments.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ post_id: postId, content: commentInput })
            });
            const data = await res.json();
            if (data.success) {
                setCommentInput('');
                fetchComments(postId);
            } else {
                showToast('댓글 등록에 실패했습니다.', 'error');
            }
        } catch (err) {
            showToast('등록 중 오류가 발생했습니다.', 'error');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleSubmitReply = async (postId, parentId) => {
        if (!replyInput.trim()) return;
        setSubmittingComment(true);
        try {
            const res = await fetch(`${API_BASE}/community_comments.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ post_id: postId, parent_id: parentId, content: replyInput })
            });
            const data = await res.json();
            if (data.success) {
                setReplyInput('');
                setReplyingTo(null);
                fetchComments(postId);
            } else {
                showToast('답글 등록에 실패했습니다.', 'error');
            }
        } catch (err) {
            showToast('등록 중 오류가 발생했습니다.', 'error');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        setConfirmModal({
            title: '댓글 삭제',
            message: '이 댓글을 삭제하시겠습니까?',
            type: 'danger',
            confirmLabel: '삭제',
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
                        showToast('댓글이 삭제되었습니다.', 'success');
                    } else {
                        showToast('댓글 삭제에 실패했습니다.', 'error');
                    }
                } catch (err) {
                    showToast('댓글 삭제 중 오류가 발생했습니다.', 'error');
                }
            }
        });
    };

    // Like toggle (optimistic)
    const handleToggleLike = async (e, postId) => {
        e.stopPropagation();
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
            const res = await fetch(`${API_BASE}/community_likes.php`, {
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
            const res = await fetch(`/api/users/get_public_profile.php?id=${userId}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setProfileData(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setProfileLoading(false);
        }
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
                            <h1 className="text-2xl md:text-3xl font-extrabold">{config.title}</h1>
                        </div>
                        <p className="text-white/80 text-sm">{config.subtitle}</p>
                    </div>
                    <button
                        onClick={() => setShowWriteForm(!showWriteForm)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur rounded-xl font-bold text-sm hover:bg-white/30 transition-colors"
                    >
                        <PenLine size={16} />
                        글쓰기
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    placeholder="제목, 내용, 작성자, 키워드로 검색.."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none bg-white"
                />
            </div>

            {/* Label Filter */}
            {
                availableLabels.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter size={14} className="text-gray-400" />
                        <button
                            onClick={() => { setFilterLabel(''); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${filterLabel === '' ? config.labelActiveColor : config.labelColor}`}
                        >
                            전체
                        </button>
                        {availableLabels.map(lbl => (
                            <button
                                key={lbl}
                                onClick={() => { setFilterLabel(lbl); setPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${filterLabel === lbl ? config.labelActiveColor : config.labelColor}`}
                            >
                                {lbl}
                            </button>
                        ))}
                    </div>
                )
            }

            {/* Popular Posts Section */}
            {
                popularPosts.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2">
                            <Flame size={18} className="text-orange-500" />
                            <h2 className="font-bold text-gray-900 text-sm">🔥 인기 글</h2>
                            <span className="text-[10px] text-gray-400 font-medium">최근 7일</span>
                        </div>
                        <div className="relative group">
                            {/* Left Arrow */}
                            <button
                                onClick={() => { const el = popularScrollRef.current; if (el) el.scrollBy({ left: -260, behavior: 'smooth' }); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {/* Right Arrow */}
                            <button
                                onClick={() => { const el = popularScrollRef.current; if (el) el.scrollBy({ left: 260, behavior: 'smooth' }); }}
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
                                {popularPosts.map((pp, idx) => (
                                    <div
                                        key={pp.id}
                                        onClick={() => { if (!hasDraggedRef.current) goToPopularPost(pp.id); }}
                                        className="flex-shrink-0 w-56 sm:w-64 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group/card"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-extrabold text-orange-500">#{idx + 1}</span>
                                            {pp.label && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${config.labelColor}`}>{pp.label}</span>
                                            )}
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover/card:text-indigo-600 transition-colors leading-tight mb-2">{pp.title}</h4>
                                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                                            <span className="truncate">{pp.user_name}</span>
                                            <div className="flex items-center gap-2">
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
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Write Form */}
            {
                showWriteForm && (
                    <div className={`${config.accentBg} rounded-2xl border ${config.accentBorder} p-6 shadow-sm`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`font-bold ${config.accentText} flex items-center gap-2`}>
                                <PenLine size={18} />
                                게시글 작성
                            </h3>
                            <button onClick={() => setShowWriteForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitPost} className="space-y-4">
                            {/* Label Selection */}
                            <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                                <Tag size={12} />
                                라벨 선택
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
                            <input
                                type="text"
                                placeholder="제목을 입력하세요"
                                value={newPost.title}
                                onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-sm"
                            />
                            {/* Content */}
                            <div className="relative">
                                <textarea
                                    ref={contentTextareaRef}
                                    placeholder="내용을 입력하세요.. (@로 사용자 멘션 가능)"
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
                                    rows={5}
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
                                                        <span className="ml-2 text-[10px] text-gray-400 font-medium">{mu.role === 'seller' ? '' : mu.role === 'vendor' ? '벤더' : mu.role}</span>
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
                                    키워드 (선택사항)
                                </label>
                                <input
                                    type="text"
                                    placeholder="#키워드1, #키워드2 또는 키워드1, 키워드2"
                                    value={newPost.keywords}
                                    onChange={e => setNewPost(p => ({ ...p, keywords: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">콤마(,) 또는 해시태그(#)로 구분하여 입력</p>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                                    <ImagePlus size={12} />
                                    사진 첨부 (최대 10장)
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {photoPreviewUrls.map((url, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(idx)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                            >
                                                <X size={10} />
                                            </button>
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

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setShowWriteForm(false); setNewPhotos([]); setPhotoPreviewUrls([]); }}
                                    className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`px-6 py-2.5 ${config.buttonBg} text-white rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50`}
                                >
                                    <Send size={14} />
                                    {submitting ? '등록 중..' : '게시하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }

            {/* Ad Slot E - Between write form and posts */}
            <AdSlot slotId="community_e" format="banner" />

            {/* Access Denied */}
            {
                accessDenied ? (
                    <div className="bg-white rounded-2xl border border-red-100 p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <ShieldAlert size={32} className="text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">접근 권한이 없습니다</h3>
                        <p className="text-gray-500 text-sm mb-6">{accessDenied.message}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                        >
                            <ChevronLeft size={16} />
                            돌아가기
                        </button>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                        <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500 font-medium">아직 게시글이 없습니다.</p>
                        <p className="text-gray-400 text-sm mt-1">첫 번째 게시글을 작성해 보세요!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map((post, postIdx) => {
                            const roleBadge = getRoleBadge(post.user_role);
                            const isExpanded = expandedPost === post.id;
                            const hasPhotos = post.photos && post.photos.length > 0;

                            const isHighlighted = highlightedPostId === post.id;

                            return (
                                <React.Fragment key={post.id}>
                                    {postIdx === 5 && <AdSlot slotId="community_f" format="banner" />}
                                    <div
                                        id={`post-${post.id}`}
                                        ref={isHighlighted ? highlightRef : undefined}
                                        className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all ${isHighlighted
                                            ? 'border-amber-400 ring-2 ring-amber-300 animate-pulse shadow-amber-100 shadow-lg'
                                            : 'border-gray-100'
                                            }`}
                                    >
                                        <div
                                            className="p-5 cursor-pointer"
                                            onClick={() => handleTogglePost(post.id)}
                                        >
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
                                                        >{post.user_name}</span>
                                                        {type === 'general' && (
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${roleBadge.color}`}>
                                                                {roleBadge.label}
                                                            </span>
                                                        )}
                                                        {post.label && (
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${config.labelColor}`}>
                                                                {post.label}
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
                                                    <h3 className="font-bold text-gray-900 truncate">{post.title}
                                                        {commentCounts[post.id] > 0 && (
                                                            <span className="ml-2 text-xs font-medium text-gray-400 inline-flex items-center gap-0.5">
                                                                <MessageCircle size={11} />
                                                                {commentCounts[post.id]}
                                                            </span>
                                                        )}
                                                    </h3>
                                                    {!isExpanded && (
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{post.content}</p>
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
                                                    {/* Like / View count / Share bar */}
                                                    <div className="flex items-center gap-4 mt-2.5">
                                                        <button
                                                            onClick={(e) => handleToggleLike(e, post.id)}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${post.is_liked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-50/50'}`}
                                                        >
                                                            <Heart size={18} className={post.is_liked ? 'fill-red-500' : ''} />
                                                            <span>{post.like_count || 0}</span>
                                                        </button>
                                                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                                            <Eye size={16} />
                                                            <span>{post.view_count || 0}</span>
                                                        </span>
                                                        <div className="relative" ref={shareMenuPostId === post.id ? shareMenuRef : undefined}>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
                                                                        const shareUrl = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
                                                                        const shareText = `[SpaceMatch ${config.title}] ${post.title}`;
                                                                        navigator.share({ title: shareText, text: `${shareText}\n${post.content?.substring(0, 100)}...`, url: shareUrl }).catch(() => { });
                                                                    } else {
                                                                        setShareMenuPostId(shareMenuPostId === post.id ? null : post.id);
                                                                    }
                                                                }}
                                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${shareMenuPostId === post.id ? 'text-indigo-500 bg-indigo-50' : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50/50'}`}
                                                                title="공유하기"
                                                            >
                                                                <Share2 size={16} />
                                                                <span>공유</span>
                                                            </button>

                                                            {/* Share Dropdown */}
                                                            {shareMenuPostId === post.id && (
                                                                <div
                                                                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                                                    style={{ animation: 'fadeInUp 0.2s ease-out' }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                                                        <p className="text-xs font-bold text-gray-700">공유하기</p>
                                                                    </div>
                                                                    <div className="p-1.5">
                                                                        {/* Copy Link */}
                                                                        <button
                                                                            onClick={async () => {
                                                                                const shareUrl = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
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
                                                                                    {copiedPostId === post.id ? '복사 완료!' : '링크 복사'}
                                                                                </p>
                                                                                <p className="text-[10px] text-gray-400">URL이 클립보드로 복사됩니다</p>
                                                                            </div>
                                                                        </button>

                                                                        {/* KakaoTalk */}
                                                                        <button
                                                                            onClick={() => {
                                                                                const shareUrl = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
                                                                                const text = `[SpaceMatch ${config.title}] ${post.title}`;
                                                                                const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
                                                                                window.open(kakaoUrl, '_blank', 'width=500,height=600');
                                                                                setShareMenuPostId(null);
                                                                            }}
                                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-yellow-50 transition-colors group"
                                                                        >
                                                                            <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-lg">
                                                                                <svg viewBox="0 0 24 24" width="16" height="16" fill="#3C1E1E">
                                                                                    <path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.69 1.76 5.04 4.4 6.38l-1.12 4.12c-.1.36.3.65.6.44L10.5 18.5c.49.06 1 .1 1.5.1 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" />
                                                                                </svg>
                                                                            </div>
                                                                            <div className="text-left">
                                                                                <p className="text-sm font-bold text-gray-700">카카오톡</p>
                                                                                <p className="text-[10px] text-gray-400">카카오톡으로 공유합니다</p>
                                                                            </div>
                                                                        </button>

                                                                        {/* Native Share (only if supported) */}
                                                                        {navigator.share && (
                                                                            <button
                                                                                onClick={async () => {
                                                                                    const shareUrl = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
                                                                                    const shareText = `[SpaceMatch ${config.title}] ${post.title}`;
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
                                                                                    <p className="text-sm font-bold text-gray-700">다른 앱으로 공유</p>
                                                                                    <p className="text-[10px] text-gray-400">시스템 공유 메뉴를 엽니다</p>
                                                                                </div>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
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
                                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                                                            {post.content.split(/(@[\w\uAC00-\uD7A3]+)/g).map((part, i) =>
                                                                /^@[\w\uAC00-\uD7A3]+$/.test(part)
                                                                    ? <span key={i} className="text-indigo-600 font-bold bg-indigo-50 px-0.5 rounded">{part}</span>
                                                                    : part
                                                            )}
                                                        </p>
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
                                                {post.can_manage && (
                                                    <div className="mt-4 flex justify-end gap-3">
                                                        {editingPost === post.id ? (
                                                            <>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setEditingPost(null); }}
                                                                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                                                                >
                                                                    <X size={12} />
                                                                    취소
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleEditPost(post.id); }}
                                                                    className="text-xs text-green-500 hover:text-green-700 flex items-center gap-1 transition-colors font-bold"
                                                                >
                                                                    <Check size={12} />
                                                                    수정 완료
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); startEditing(post); }}
                                                                    className="text-xs text-blue-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                                                >
                                                                    <Edit3 size={12} />
                                                                    수정
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                                                                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                                                                >
                                                                    <Trash2 size={12} />
                                                                    삭제
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {/* ===== COMMENTS SECTION ===== */}
                                                <div className="mt-6 pt-5 border-t border-gray-100">
                                                    <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
                                                        <MessageCircle size={16} />
                                                        댓글 {commentCounts[post.id] > 0 && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{commentCounts[post.id]}</span>}
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
                                                                placeholder="댓글을 입력하세요.."
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
                                                                                    <span className="text-xs font-bold text-gray-800">{comment.user_name}</span>
                                                                                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${cBadge.color}`}>{cBadge.label}</span>
                                                                                    <span className="text-[10px] text-gray-400">{formatDate(comment.created_at)}</span>
                                                                                </div>
                                                                                <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">{comment.content}</p>
                                                                                <div className="flex items-center gap-3 mt-1">
                                                                                    <button
                                                                                        onClick={(e) => handleToggleCommentLike(e, post.id, comment.id)}
                                                                                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${comment.is_liked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-50/50'}`}
                                                                                    >
                                                                                        <Heart size={12} className={comment.is_liked ? 'fill-red-500' : ''} />
                                                                                        {comment.like_count > 0 && comment.like_count}
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={(e) => { e.stopPropagation(); setReplyingTo(replyingTo?.commentId === comment.id ? null : { commentId: comment.id, userName: comment.user_name }); setReplyInput(''); }}
                                                                                        className="text-[11px] text-gray-400 hover:text-indigo-500 font-medium flex items-center gap-1 transition-colors"
                                                                                    >
                                                                                        <CornerDownRight size={10} />
                                                                                        답글</button>
                                                                                    {comment.can_delete && (
                                                                                        <button
                                                                                            onClick={(e) => { e.stopPropagation(); handleDeleteComment(post.id, comment.id); }}
                                                                                            className="text-[11px] text-gray-400 hover:text-red-500 font-medium flex items-center gap-1 transition-colors opacity-0 group-hover/comment:opacity-100"
                                                                                        >
                                                                                            <Trash2 size={10} />
                                                                                            삭제
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
                                                                                    placeholder={`@${replyingTo.userName} 에게 답글...`}
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
                                                                                                    <span className="text-[11px] font-bold text-gray-800">{reply.user_name}</span>
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
                                                                                                            삭제</button>
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
                                                        <p className="text-xs text-gray-400 text-center py-2">아직 댓글이 없습니다. 첫 댓글을 남겨보세요</p>
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
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${profileData.user.role === 'vendor' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        profileData.user.role === 'seller' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            'bg-purple-50 text-purple-700 border-purple-100'
                                                        }`}>
                                                        {profileData.user.role === 'vendor' ? '벤더' : profileData.user.role === 'seller' ? '셀러' : profileData.user.role === 'superadmin' ? '최고관리자' : '관리자'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={11} />
                                                        가입일: {new Date(profileData.user.created_at).toLocaleDateString()}
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
                                            <p className="text-[10px] text-gray-400 font-medium">게시글</p>
                                        </div>
                                        <div className="text-center py-4 border-r border-gray-50">
                                            <p className="text-lg font-extrabold text-gray-900">{profileData.community_stats?.comment_count || 0}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">댓글</p>
                                        </div>
                                        <div className="text-center py-4">
                                            <p className="text-lg font-extrabold text-gray-900">
                                                {profileData.user.role === 'vendor' ? (profileData.stats?.total_venues || 0) : (profileData.stats?.total_applications || 0)}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                {profileData.user.role === 'vendor' ? '등록 베뉴' : '입점 활동'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Seller Product Photos */}
                                    {profileData.seller_photos && profileData.seller_photos.length > 0 && (
                                        <div className="p-5 border-b border-gray-100">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                                                <ImagePlus size={14} className="text-indigo-500" />
                                                판매 상품
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
                                    {profileData.user.role === 'vendor' && profileData.venues && profileData.venues.length > 0 && (
                                        <div className="p-5 border-b border-gray-100">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                                                <Store size={14} className="text-blue-500" />
                                                등록된 베뉴
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
                                                활동 위치 (입점 지역)
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
                                                아직 활동 지역이 없습니다.
                                            </div>
                                        )}
                                </>
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    프로필 정보를 불러올 수 없습니다.
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
                                    취소
                                </button>
                                <button onClick={confirmModal.onConfirm} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors text-white ${confirmModal.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}>
                                    {confirmModal.confirmLabel || '확인'}
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
        </div>
    );
};

export default CommunityPage;

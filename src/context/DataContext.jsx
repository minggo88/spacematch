import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [venues, setVenues] = useState([]);
    const [applications, setApplications] = useState([]);
    const [wishlist, setWishlist] = useState([]); // [{userId, venueId}]
    const [notifications, setNotifications] = useState([]); // [{id, toUserEmail, message, type, date, isRead}]
    const seenNotifIds = useRef(new Set()); // Track which notifications we've already shown browser alerts for
    const isFirstLoad = useRef(true); // Don't show browser notifications for initial load

    const API_BASE = '/api';

    // Browser notification helper
    const showBrowserNotification = useCallback((title, body, link) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                const notif = new Notification(title, {
                    body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: 'spacematch-' + Date.now(),
                    requireInteraction: false,
                    silent: false
                });
                if (link) {
                    notif.onclick = () => {
                        window.focus();
                        window.location.href = link;
                        notif.close();
                    };
                }
                // Auto-close after 8 seconds
                setTimeout(() => notif.close(), 8000);
            } catch (e) {
                console.warn('Browser notification failed:', e);
            }
        }
    }, []);

    const fetchVenues = async () => {
        try {
            const res = await fetch(`${API_BASE}/venues/get_venues.php`, { credentials: 'include' });
            const data = await res.json();
            if (Array.isArray(data)) setVenues(data);
        } catch (e) { console.error(e); }
    };

    const fetchApplications = async () => {
        try {
            const res = await fetch(`${API_BASE}/applications/get_applications.php`, { cache: 'no-store', credentials: 'include' });
            const data = await res.json();
            if (Array.isArray(data)) setApplications(data);
            else if (data.message) console.warn(data.message);
        } catch (e) { console.error(e); }
    };

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API_BASE}/notifications/get_notifications.php`, { credentials: 'include' });
            const data = await res.json();
            if (Array.isArray(data)) {
                // Detect NEW notifications and show browser alerts
                if (!isFirstLoad.current) {
                    data.forEach(n => {
                        const nId = String(n.id);
                        if (!seenNotifIds.current.has(nId) && n.is_read == 0) {
                            // New unread notification ??show browser notification
                            showBrowserNotification('SpaceMatch', n.message, n.link);
                        }
                    });
                }
                // Update seen IDs
                const currentIds = new Set(data.map(n => String(n.id)));
                seenNotifIds.current = currentIds;
                isFirstLoad.current = false;
                setNotifications(data);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchVenues();
        fetchApplications();
        fetchWishlist();

        // Smart notification polling: only poll if authenticated
        let notifInterval = null;
        const startPolling = async () => {
            await fetchNotifications();
            notifInterval = setInterval(fetchNotifications, 30000);
        };
        // Check if session exists before starting polling
        fetch(`${API_BASE}/auth/me.php`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => { if (data.success) startPolling(); })
            .catch(() => { });

        return () => { if (notifInterval) clearInterval(notifInterval); };
    }, []);

    const addVenue = async (venue) => {
        try {
            const res = await fetch(`${API_BASE}/venues/add_venue.php`, {
                method: 'POST',
                credentials: 'include',
                body: venue instanceof FormData ? venue : JSON.stringify(venue),
                ...(venue instanceof FormData ? {} : { headers: { 'Content-Type': 'application/json' } })
            });
            const data = await res.json();
            if (data.success) {
                fetchVenues();
                return { ...venue, id: data.id };
            }
        } catch (e) { console.error(e); }
        return null;
    };

    const applyForVenue = async (application) => {
        try {
            const res = await fetch(`${API_BASE}/applications/submit_application.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(application)
            });
            const data = await res.json();
            if (data.success) {
                await fetchApplications();
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Network or Server Error" };
        }
    };

    const updateApplicationStatus = async (appId, status) => {
        try {
            const res = await fetch(`${API_BASE}/applications/update_status.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: appId, status })
            });
            const data = await res.json();
            if (data.success) {
                setApplications(prev => prev.map(app => app.id === appId ? { ...app, status } : app));
                // Refetch venues so approved_count updates (occupancy display)
                if (status === 'approved' || status === 'rejected' || status === 'cancelled') {
                    fetchVenues();
                }
            }
        } catch (e) { console.error(e); }
    };

    // Wishlist: Server-side + Local State
    const saveWishlist = (newWishlist) => {
        setWishlist(newWishlist);
        localStorage.setItem('spacematch_wishlist', JSON.stringify(newWishlist));
    };

    // Fetch server-side wishlist on mount and merge with localStorage
    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${API_BASE}/wishlist/get_wishlist.php`, { credentials: 'include' });
            const serverVenueIds = await res.json();
            if (Array.isArray(serverVenueIds) && serverVenueIds.length > 0) {
                // Merge server wishlist into local state
                const localWishlist = JSON.parse(localStorage.getItem('spacematch_wishlist') || '[]');
                const serverEntries = serverVenueIds.map(vid => ({
                    userId: 'server', venueId: String(vid), addedAt: new Date().toISOString()
                }));
                // Merge: keep local items + add server items not already present
                const merged = [...localWishlist];
                serverEntries.forEach(se => {
                    if (!merged.some(m => String(m.venueId) === String(se.venueId))) {
                        merged.push(se);
                    }
                });
                saveWishlist(merged);
            }
        } catch (e) { /* ignore */ }
    };

    const toggleWishlist = (userId, venueId) => {
        const exists = wishlist.find(w => w.userId === userId && w.venueId === venueId);
        let newWishlist;
        if (exists) {
            newWishlist = wishlist.filter(w => !(w.userId === userId && w.venueId === venueId));
        } else {
            newWishlist = [...wishlist, { userId, venueId, addedAt: new Date().toISOString() }];
        }
        saveWishlist(newWishlist);

        // Also persist to server (fire-and-forget)
        fetch(`${API_BASE}/wishlist/toggle_wishlist.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ venue_id: venueId })
        }).catch(() => { });

        return !exists;
    };

    // Notification Handlers (API)
    const markAsRead = async (notifId) => {
        try {
            await fetch(`${API_BASE}/notifications/mark_read.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: notifId })
            });
            setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: 1 } : n));
        } catch (e) { console.error(e); }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(`${API_BASE}/notifications/mark_read.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ all: true })
            });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        } catch (e) { console.error(e); }
    }

    const deleteReadNotifications = async () => {
        try {
            await fetch(`${API_BASE}/notifications/delete_read.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            setNotifications(prev => prev.filter(n => n.is_read == 0));
        } catch (e) { console.error(e); }
    };

    // Delete Venue
    const deleteVenue = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/venues/delete_venue.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                setVenues(prev => prev.filter(v => v.id !== id && v.id !== String(id)));
                return { success: true };
            } else {
                alert(data.message || '삭제 실패');
                return { success: false, message: data.message };
            }
        } catch (e) {
            console.error(e);
            alert('오류가 발생했습니다.');
            return { success: false };
        }
    };

    return (
        <DataContext.Provider value={{
            venues, applications, wishlist, notifications,
            addVenue, deleteVenue, applyForVenue, updateApplicationStatus,
            toggleWishlist, markAsRead, markAllAsRead, deleteReadNotifications,
            fetchVenues, fetchApplications, fetchNotifications
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);

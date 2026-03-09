import React, { useState, useEffect, useRef } from 'react';

const API_BASE = '/api/ads';

const SLOT_SIZES = {
    banner: { pc: { width: '100%', height: 250 }, mobile: { width: '100%', height: 150 } },
    card: { pc: { width: '100%', height: 'auto' }, mobile: { width: '100%', height: 'auto' } },
    native: { pc: { width: '100%', height: 'auto' }, mobile: { width: '100%', height: 'auto' } },
};

const AdSlot = ({ slotId, format = 'banner', className = '', country = '' }) => {
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adsenseConfig, setAdsenseConfig] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const containerRef = useRef(null);

    // Detect mobile viewport
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let cancelled = false;
        const fetchAd = async () => {
            try {
                const params = new URLSearchParams({ slot_id: slotId });
                if (country) params.set('country', country);
                const res = await fetch(`${API_BASE}/get_ads.php?${params.toString()}`);
                const data = await res.json();
                if (!cancelled) {
                    setAd(data.ad || null);
                }

                // Only check AdSense config if no self-hosted ad found
                if (!data.ad) {
                    try {
                        const res2 = await fetch(`${API_BASE}/adsense_config.php`, { credentials: 'include' });
                        if (res2.ok) {
                            const data2 = await res2.json();
                            if (!cancelled && data2.success && data2.config) {
                                setAdsenseConfig(data2.config);
                            }
                        }
                        // Silently ignore 403/401 — user is not admin
                    } catch { /* AdSense config optional */ }
                }
            } catch (err) {
                // silently ignore ad fetch errors
            }

            if (!cancelled) setLoading(false);
        };
        fetchAd();
        return () => { cancelled = true; };
    }, [slotId, country]);

    // Determine which image URL to use (mobile-first if available)
    const getImageUrl = () => {
        if (!ad) return null;
        if (isMobile && ad.mobile_image_url) return ad.mobile_image_url;
        return ad.image_url;
    };

    const handleClick = async () => {
        if (!ad) return;
        // Track click
        try {
            await fetch(`${API_BASE}/track_click.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ad_id: ad.id }),
            });
        } catch { /* silent */ }

        if (ad.click_url) {
            window.open(ad.click_url, '_blank', 'noopener,noreferrer');
        }
    };

    // Loading skeleton
    if (loading) {
        if (format === 'card') {
            return (
                <div className={`bg-gray-50 rounded-2xl border border-dashed border-gray-200 overflow-hidden animate-pulse ${className}`}>
                    <div className="aspect-[16/9] bg-gray-100" />
                </div>
            );
        }
        if (format === 'native') {
            return (
                <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse ${className}`}>
                    <div className="p-5">
                        <div className="h-3 bg-gray-100 rounded w-16 mb-3" />
                        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                        <div className="h-40 bg-gray-50 rounded-xl" />
                    </div>
                </div>
            );
        }
        return (
            <div className={`w-full flex justify-center py-3 ${className}`}>
                <div className="w-full h-[150px] md:h-[250px] bg-gray-50 rounded-2xl border border-dashed border-gray-200 animate-pulse" />
            </div>
        );
    }

    // Self-hosted ad
    if (ad) {
        if (format === 'card') {
            return (
                <div
                    className={`relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group ${className}`}
                    onClick={handleClick}
                >
                    <div className="absolute top-2 right-2 z-10">
                        <span className="text-[9px] font-bold text-gray-300 bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded">광고 · AD</span>
                    </div>
                    <img
                        src={getImageUrl()}
                        alt={ad.title}
                        className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="p-4">
                        <p className="text-sm font-bold text-gray-700 truncate">{ad.title}</p>
                    </div>
                </div>
            );
        }

        if (format === 'native') {
            return (
                <div
                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group ${className}`}
                    onClick={handleClick}
                >
                    <div className="p-5">
                        {/* Sponsored label */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                스폰서드
                            </span>
                            <span className="text-[10px] text-gray-300">· AD</span>
                        </div>
                        {/* Title */}
                        <h4 className="text-sm font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                            {ad.title}
                        </h4>
                        {/* Image */}
                        {getImageUrl() && (
                            <div className="relative rounded-xl overflow-hidden mb-3">
                                <img
                                    src={getImageUrl()}
                                    alt={ad.title}
                                    className="w-full max-h-[240px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                        )}
                        {/* CTA */}
                        {ad.click_url && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">자세히 보기 →</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Banner format
        return (
            <div className={`w-full flex justify-center py-4 ${className}`}>
                <div
                    className="relative w-full cursor-pointer group"
                    onClick={handleClick}
                >
                    <div className="absolute top-2 right-3 z-10">
                        <span className="text-[9px] font-bold text-gray-300 bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded">광고 · AD</span>
                    </div>
                    <img
                        src={getImageUrl()}
                        alt={ad.title}
                        className="w-full h-[150px] md:h-[250px] object-cover rounded-2xl border border-gray-200 group-hover:shadow-lg transition-shadow duration-300"
                    />
                    {ad.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl px-5 py-4">
                            <p className="text-white font-bold text-sm md:text-base truncate">{ad.title}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // AdSense fallback
    if (adsenseConfig && adsenseConfig.is_enabled && adsenseConfig.client_id) {
        const slotConfig = adsenseConfig.slot_configs?.[slotId];
        if (slotConfig) {
            if (format === 'card') {
                return (
                    <div className={`relative bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 overflow-hidden ${className}`}>
                        <div className="absolute top-2 right-2 z-10">
                            <span className="text-[9px] font-bold text-gray-300 px-1.5 py-0.5 rounded">광고 · AD</span>
                        </div>
                        <div className="p-4 min-h-[200px] flex items-center justify-center">
                            <ins
                                className="adsbygoogle"
                                style={{ display: 'block', width: '100%', height: '200px' }}
                                data-ad-client={adsenseConfig.client_id}
                                data-ad-slot={slotConfig}
                                data-ad-format="auto"
                                data-full-width-responsive="true"
                            />
                        </div>
                    </div>
                );
            }
            return (
                <div className={`w-full flex justify-center py-3 ${className}`}>
                    <div className="relative w-full rounded-2xl border border-dashed border-gray-200 overflow-hidden bg-gray-50/50">
                        <div className="absolute top-2 right-3 z-10">
                            <span className="text-[9px] font-bold text-gray-300 px-1.5 py-0.5 rounded">광고 · AD</span>
                        </div>
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block', width: '100%', height: '250px' }}
                            data-ad-client={adsenseConfig.client_id}
                            data-ad-slot={slotConfig}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        />
                    </div>
                </div>
            );
        }
    }

    // No ad and no AdSense ??render nothing
    return null;
};

export default AdSlot;

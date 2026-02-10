import React, { useState, useEffect, useRef } from 'react';

const API_BASE = '/api/ads';

const SLOT_SIZES = {
    banner: { pc: { width: 728, height: 90 }, mobile: { width: 320, height: 100 } },
    card: { pc: { width: '100%', height: 'auto' }, mobile: { width: '100%', height: 'auto' } },
};

const AdSlot = ({ slotId, format = 'banner', className = '' }) => {
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adsenseConfig, setAdsenseConfig] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        const fetchAd = async () => {
            try {
                const res = await fetch(`${API_BASE}/get_ads.php?slot_id=${slotId}`);
                const data = await res.json();
                if (!cancelled) {
                    setAd(data.ad || null);
                }
            } catch (err) {
                console.error('Ad fetch error:', err);
            }

            // If no self-hosted ad, check AdSense config
            try {
                const res2 = await fetch(`${API_BASE}/adsense_config.php`, { credentials: 'include' });
                const data2 = await res2.json();
                if (!cancelled && data2.success && data2.config) {
                    setAdsenseConfig(data2.config);
                }
            } catch { /* AdSense config optional */ }

            if (!cancelled) setLoading(false);
        };
        fetchAd();
        return () => { cancelled = true; };
    }, [slotId]);

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
        return (
            <div className={`w-full flex justify-center py-3 ${className}`}>
                <div className="w-full max-w-3xl h-[90px] md:h-[90px] bg-gray-50 rounded-xl border border-dashed border-gray-200 animate-pulse" />
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
                        src={ad.image_url}
                        alt={ad.title}
                        className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="p-4">
                        <p className="text-sm font-bold text-gray-700 truncate">{ad.title}</p>
                    </div>
                </div>
            );
        }

        // Banner format
        return (
            <div className={`w-full flex justify-center py-4 ${className}`}>
                <div
                    className="relative w-full max-w-3xl mx-4 cursor-pointer group"
                    onClick={handleClick}
                >
                    <div className="absolute top-1.5 right-2 z-10">
                        <span className="text-[9px] font-bold text-gray-300 bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded">광고 · AD</span>
                    </div>
                    <img
                        src={ad.image_url}
                        alt={ad.title}
                        className="w-full h-auto max-h-[100px] object-cover rounded-xl border border-gray-200 group-hover:shadow-md transition-shadow duration-300"
                    />
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
                    <div className="relative w-full max-w-3xl mx-4 rounded-xl border border-dashed border-gray-200 overflow-hidden bg-gray-50/50">
                        <div className="absolute top-1 right-2 z-10">
                            <span className="text-[9px] font-bold text-gray-300 px-1.5 py-0.5 rounded">광고 · AD</span>
                        </div>
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block', width: '100%', height: '90px' }}
                            data-ad-client={adsenseConfig.client_id}
                            data-ad-slot={slotConfig}
                            data-ad-format="horizontal"
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

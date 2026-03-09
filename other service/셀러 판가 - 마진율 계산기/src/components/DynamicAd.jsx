import { useState, useEffect } from 'react'
import './DynamicAd.css'

const API_BASE = '/api/ads'

export default function DynamicAd({ slotId }) {
    const [ad, setAd] = useState(null)

    useEffect(() => {
        fetchAd()
    }, [slotId])

    const fetchAd = async () => {
        try {
            const res = await fetch(`${API_BASE}/list_ads.php?slot_id=${slotId}&active_only=1`)
            const data = await res.json()
            if (data.success && data.ads?.length > 0) {
                // Pick highest priority active ad
                const sorted = data.ads
                    .filter(a => a.is_active == 1)
                    .sort((a, b) => (parseInt(b.priority) || 0) - (parseInt(a.priority) || 0))
                const picked = sorted[0]
                if (picked) {
                    setAd(picked)
                    // Track impression
                    trackEvent(picked.id, 'view')
                }
            }
        } catch {
            // Silent fail — no ad shown
        }
    }

    const trackEvent = async (adId, type) => {
        try {
            await fetch(`${API_BASE}/track.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ad_id: adId, event: type })
            })
        } catch {
            // Silent
        }
    }

    const handleClick = () => {
        if (!ad) return
        trackEvent(ad.id, 'click')
        if (ad.click_url) {
            window.open(ad.click_url, '_blank', 'noopener,noreferrer')
        }
    }

    if (!ad) return null

    return (
        <section className="dynamic-ad section">
            <div className="container">
                <span className="dynamic-ad__label">추천 서비스</span>
                <div className="dynamic-ad__banner" onClick={handleClick} role="button" tabIndex={0}>
                    {ad.image_url ? (
                        <img src={ad.image_url} alt={ad.title} className="dynamic-ad__img" />
                    ) : (
                        <div className="dynamic-ad__content">
                            <span className="dynamic-ad__badge">AD</span>
                            <div className="dynamic-ad__text">
                                <h3 className="h3">{ad.title}</h3>
                            </div>
                            <span className="dynamic-ad__cta">자세히 보기 →</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

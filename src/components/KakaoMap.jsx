import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Filter, ChevronDown, X } from 'lucide-react';

/**
 * Map Component using Leaflet + OpenStreetMap
 * 
 * Props:
 *   venues     - Array of venue objects with { id, name, location, latitude, longitude }
 *   center     - { lat, lng } to center the map (default: Seoul)
 *   zoom       - Zoom level 1-18 (default: 12)
 *   height     - Map height (default: '400px')
 *   singleMode - If true, show single venue with larger marker
 *   onMarkerClick - (venue) => void, callback when a marker is clicked
 *   className  - Additional CSS classes
 */

// ─── Seoul district data with center coordinates ───
const SEOUL_DISTRICTS = {
    '강남구': { lat: 37.4959, lng: 127.0628, zoom: 14 },
    '강동구': { lat: 37.5500, lng: 127.1470, zoom: 14 },
    '강북구': { lat: 37.6380, lng: 127.0270, zoom: 14 },
    '강서구': { lat: 37.5600, lng: 126.8490, zoom: 14 },
    '관악구': { lat: 37.4780, lng: 126.9520, zoom: 14 },
    '광진구': { lat: 37.5480, lng: 127.0860, zoom: 14 },
    '구로구': { lat: 37.4950, lng: 126.8580, zoom: 14 },
    '금천구': { lat: 37.4570, lng: 126.8960, zoom: 14 },
    '노원구': { lat: 37.6550, lng: 127.0580, zoom: 14 },
    '도봉구': { lat: 37.6680, lng: 127.0470, zoom: 14 },
    '동대문구': { lat: 37.5740, lng: 127.0400, zoom: 14 },
    '동작구': { lat: 37.5080, lng: 126.9380, zoom: 14 },
    '마포구': { lat: 37.5660, lng: 126.9010, zoom: 14 },
    '서대문구': { lat: 37.5780, lng: 126.9370, zoom: 14 },
    '서초구': { lat: 37.4920, lng: 127.0090, zoom: 14 },
    '성동구': { lat: 37.5510, lng: 127.0410, zoom: 14 },
    '성북구': { lat: 37.6060, lng: 127.0170, zoom: 14 },
    '송파구': { lat: 37.5140, lng: 127.1060, zoom: 14 },
    '양천구': { lat: 37.5270, lng: 126.8660, zoom: 14 },
    '영등포구': { lat: 37.5260, lng: 126.8970, zoom: 14 },
    '용산구': { lat: 37.5320, lng: 126.9810, zoom: 14 },
    '은평구': { lat: 37.6170, lng: 126.9220, zoom: 14 },
    '종로구': { lat: 37.5730, lng: 126.9790, zoom: 14 },
    '중구': { lat: 37.5610, lng: 126.9960, zoom: 14 },
    '중랑구': { lat: 37.5960, lng: 127.0940, zoom: 14 },
};

// ─── Major regions with center coordinates ───
const REGIONS = {
    '서울 전체': { lat: 37.5665, lng: 126.9780, zoom: 11 },
    '경기도': { lat: 37.2750, lng: 127.0090, zoom: 9 },
    '인천': { lat: 37.4563, lng: 126.7052, zoom: 11 },
    '부산': { lat: 35.1796, lng: 129.0756, zoom: 11 },
    '대구': { lat: 35.8714, lng: 128.6014, zoom: 11 },
    '대전': { lat: 36.3504, lng: 127.3845, zoom: 11 },
    '광주': { lat: 35.1595, lng: 126.8526, zoom: 11 },
    '제주': { lat: 33.4996, lng: 126.5312, zoom: 10 },
};

const KakaoMap = ({
    venues = [],
    center = null,
    zoom = 12,
    height = '400px',
    singleMode = false,
    onMarkerClick = null,
    className = ''
}) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [mapError, setMapError] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [activeTab, setActiveTab] = useState('region'); // 'region' | 'district'
    const filterRef = useRef(null);

    // Filter venues that have valid coordinates
    const validVenues = venues.filter(v => v.latitude && v.longitude);

    // Extract unique districts from venue locations
    const venueDistricts = [...new Set(validVenues.map(v => {
        if (!v.location) return null;
        // Extract district (구) from address like "서울 강남구 ..."
        const match = v.location.match(/([가-힣]+구)/);
        return match ? match[1] : null;
    }).filter(Boolean))];

    // Close filter on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setShowFilter(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load Leaflet CSS + JS dynamically
    useEffect(() => {
        if (!mapRef.current) return;
        let cancelled = false;

        const loadLeaflet = () => {
            return new Promise((resolve, reject) => {
                if (window.L) {
                    resolve();
                    return;
                }

                if (!document.querySelector('link[href*="leaflet"]')) {
                    const css = document.createElement('link');
                    css.rel = 'stylesheet';
                    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    css.crossOrigin = '';
                    document.head.appendChild(css);
                }

                if (!document.querySelector('script[src*="leaflet"]')) {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.crossOrigin = '';
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to load Leaflet'));
                    document.head.appendChild(script);
                } else {
                    const check = setInterval(() => {
                        if (window.L) { clearInterval(check); resolve(); }
                    }, 100);
                    setTimeout(() => { clearInterval(check); reject(new Error('Timeout')); }, 10000);
                }
            });
        };

        loadLeaflet()
            .then(() => {
                if (cancelled || !mapRef.current) return;
                initMap();
                setMapLoaded(true);
            })
            .catch(err => {
                console.error('Map load error:', err);
                if (!cancelled) setMapError(true);
            });

        return () => {
            cancelled = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update markers when venues change
    useEffect(() => {
        if (mapInstanceRef.current && mapLoaded) {
            updateMarkers();
        }
    }, [venues, mapLoaded]);

    const initMap = () => {
        const L = window.L;

        let centerLat = 37.5665;
        let centerLng = 126.9780;

        if (center) {
            centerLat = center.lat;
            centerLng = center.lng;
        } else if (validVenues.length === 1) {
            centerLat = parseFloat(validVenues[0].latitude);
            centerLng = parseFloat(validVenues[0].longitude);
        } else if (validVenues.length > 1) {
            const avgLat = validVenues.reduce((sum, v) => sum + parseFloat(v.latitude), 0) / validVenues.length;
            const avgLng = validVenues.reduce((sum, v) => sum + parseFloat(v.longitude), 0) / validVenues.length;
            centerLat = avgLat;
            centerLng = avgLng;
        }

        const map = L.map(mapRef.current, {
            center: [centerLat, centerLng],
            zoom: singleMode ? 16 : zoom,
            zoomControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
        updateMarkers();
    };

    const updateMarkers = () => {
        const L = window.L;
        const map = mapInstanceRef.current;
        if (!map || !L) return;

        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        if (validVenues.length === 0) return;

        const typeLabels = {
            popup: '팝업스토어', gallery: '갤러리', cafe: '카페',
            showroom: '쇼룸', fleamarket: '플리마켓', store: '매장'
        };

        const bounds = [];

        validVenues.forEach(venue => {
            const lat = parseFloat(venue.latitude);
            const lng = parseFloat(venue.longitude);
            bounds.push([lat, lng]);

            const icon = L.divIcon({
                className: 'custom-map-marker',
                html: `<div style="
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    width: 32px;
                    height: 32px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            const typeLabel = typeLabels[venue.type] || venue.type || '';
            const price = venue.price
                ? (Number(venue.price) === 0 ? '무료' : `₩${Number(venue.price).toLocaleString()}`)
                : '';

            const popupContent = `
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; min-width:180px;">
                    <div style="font-weight:700; font-size:14px; color:#1f2937; margin-bottom:4px;">${venue.name}</div>
                    <div style="font-size:12px; color:#6b7280; margin-bottom:6px;">📍 ${venue.location || ''}</div>
                    <div>
                        ${typeLabel ? `<span style="display:inline-block; background:#eef2ff; color:#4f46e5; font-size:11px; padding:2px 8px; border-radius:10px; font-weight:600; margin-right:4px;">${typeLabel}</span>` : ''}
                        ${price ? `<span style="display:inline-block; background:#f0fdf4; color:#16a34a; font-size:11px; padding:2px 8px; border-radius:10px; font-weight:600;">${price}</span>` : ''}
                    </div>
                </div>
            `;

            const marker = L.marker([lat, lng], { icon })
                .addTo(map)
                .bindPopup(popupContent);

            if (singleMode && validVenues.length === 1) {
                marker.openPopup();
            }

            marker.on('click', () => {
                if (onMarkerClick) {
                    onMarkerClick(venue);
                }
            });
        });

        // Fit bounds if multiple venues
        if (bounds.length > 1 && !singleMode) {
            map.fitBounds(bounds, { padding: [30, 30] });
        }
    };

    // Navigate map to a specific location
    const navigateToLocation = (lat, lng, zoomLevel) => {
        const map = mapInstanceRef.current;
        if (!map) return;
        map.flyTo([lat, lng], zoomLevel, { duration: 1.2 });
        setShowFilter(false);
    };

    // Error state
    if (mapError) {
        return (
            <div
                className={`bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center ${className}`}
                style={{ height }}
            >
                <MapPin size={32} className="text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm font-medium">지도를 불러올 수 없습니다</p>
                <p className="text-gray-300 text-xs mt-1">인터넷 연결을 확인해 주세요</p>
            </div>
        );
    }

    // No venues with coordinates
    if (validVenues.length === 0 && venues.length > 0) {
        return (
            <div
                className={`bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center ${className}`}
                style={{ height }}
            >
                <MapPin size={32} className="text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm font-medium">위치 정보가 없습니다</p>
                <p className="text-gray-300 text-xs mt-1">베뉴의 좌표 데이터를 등록해 주세요</p>
            </div>
        );
    }

    return (
        <div className={`relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${className}`}>
            <div ref={mapRef} style={{ width: '100%', height }} />

            {/* Filter Button + Dropdown (non-singleMode only) */}
            {!singleMode && (
                <div ref={filterRef} className="absolute bottom-3 left-3" style={{ zIndex: 10 }}>
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg text-sm font-bold text-gray-700 border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                    >
                        <Filter size={14} className="text-indigo-500" />
                        <MapPin size={12} className="text-indigo-400" />
                        {validVenues.length}개 베뉴
                        <ChevronDown size={14} className={`transition-transform ${showFilter ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Filter Dropdown */}
                    {showFilter && (
                        <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
                            {/* Header */}
                            <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex justify-between items-center">
                                <span className="font-bold text-sm">🗺️ 지역 필터</span>
                                <button onClick={() => setShowFilter(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-100">
                                <button
                                    onClick={() => setActiveTab('region')}
                                    className={`flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === 'region'
                                        ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    광역시/도
                                </button>
                                <button
                                    onClick={() => setActiveTab('district')}
                                    className={`flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === 'district'
                                        ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    서울 구별
                                </button>
                                <button
                                    onClick={() => setActiveTab('venue')}
                                    className={`flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === 'venue'
                                        ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    베뉴 바로가기
                                </button>
                            </div>

                            {/* Content */}
                            <div className="max-h-56 overflow-y-auto custom-scrollbar p-2">
                                {activeTab === 'region' && (
                                    <div className="grid grid-cols-2 gap-1">
                                        {Object.entries(REGIONS).map(([name, coords]) => {
                                            // Count venues in this region
                                            const count = validVenues.filter(v => v.location && v.location.includes(name.replace(' 전체', ''))).length;
                                            return (
                                                <button
                                                    key={name}
                                                    onClick={() => navigateToLocation(coords.lat, coords.lng, coords.zoom)}
                                                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-left"
                                                >
                                                    <span>{name}</span>
                                                    {count > 0 && (
                                                        <span className="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{count}</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeTab === 'district' && (
                                    <div className="grid grid-cols-2 gap-1">
                                        {Object.entries(SEOUL_DISTRICTS).map(([name, coords]) => {
                                            const count = validVenues.filter(v => v.location && v.location.includes(name)).length;
                                            const hasVenues = count > 0;
                                            return (
                                                <button
                                                    key={name}
                                                    onClick={() => navigateToLocation(coords.lat, coords.lng, coords.zoom)}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${hasVenues
                                                            ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                                            : 'text-gray-300'
                                                        }`}
                                                >
                                                    <span>{name}</span>
                                                    {hasVenues && (
                                                        <span className="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{count}</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeTab === 'venue' && (
                                    <div className="space-y-1">
                                        {validVenues.length === 0 ? (
                                            <p className="text-center text-gray-400 text-xs py-4">좌표가 등록된 베뉴가 없습니다</p>
                                        ) : (
                                            validVenues.map(venue => (
                                                <button
                                                    key={venue.id}
                                                    onClick={() => navigateToLocation(parseFloat(venue.latitude), parseFloat(venue.longitude), 16)}
                                                    className="w-full flex items-start gap-2 px-3 py-2 rounded-lg text-left hover:bg-indigo-50 transition-all"
                                                >
                                                    <MapPin size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-gray-800 truncate">{venue.name}</p>
                                                        <p className="text-[10px] text-gray-400 truncate">{venue.location}</p>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KakaoMap;

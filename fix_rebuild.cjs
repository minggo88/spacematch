/**
 * 종합 구조 복원 스크립트 — VenueDetailModal, CommunityPage, VenueModal
 * 블록 단위로 손상된 JSX 구조를 재구성하고 나머지 깨진 한글 텍스트를 수정
 */
const fs = require('fs');
const BASE = 'c:/Users/KYUNG005/Desktop/spacematch/src';

// ============================================================
// 1. VenueDetailModal.jsx — 구조적 재구성 + 텍스트 수정
// ============================================================
{
    const fp = `${BASE}/components/VenueDetailModal.jsx`;
    let c = fs.readFileSync(fp, 'utf8');
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    const lines = c.split(/\r?\n/);

    // === Block 1: Fix image navigation area (lines 168-210) ===
    // The prevImage button is missing </button>, nextImage button is nested inside it,
    // and price spans are misplaced here
    const block1Start = lines.findIndex(l => l.includes('prevImage()') && l.includes('stopPropagation'));
    if (block1Start >= 0) {
        // Find where the info panel starts
        const infoPanelStart = lines.findIndex((l, i) => i > block1Start && l.includes('Right: Info'));
        if (infoPanelStart >= 0) {
            const newBlock1 = [
                '                                        <button',
                '                                            onClick={(e) => { e.stopPropagation(); prevImage(); }}',
                '                                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-all duration-200"',
                '                                        >',
                '                                            <ChevronLeft size={22} />',
                '                                        </button>',
                '                                        <button',
                '                                            onClick={(e) => { e.stopPropagation(); nextImage(); }}',
                '                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-all duration-200"',
                '                                        >',
                '                                            <ChevronRight size={22} />',
                '                                        </button>',
                '                                        {/* Counter Badge */}',
                '                                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs font-medium">',
                '                                            {currentImageIndex + 1} / {images.length}',
                '                                        </div>',
                '                                        {/* Dot Indicators */}',
                '                                        {images.length > 1 && images.length <= 10 && (',
                '                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">',
                '                                                {images.map((_, idx) => (',
                '                                                    <button',
                '                                                        key={idx}',
                '                                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}',
                '                                                        className={`rounded-full transition-all duration-300 ${idx === currentImageIndex',
                "                                                            ? 'w-5 h-2 bg-white'",
                "                                                            : 'w-2 h-2 bg-white/40 hover:bg-white/70'",
                '                                                            }`}',
                '                                                    />',
                '                                                ))}',
                '                                            </div>',
                '                                        )}',
                '                                    </>',
                '                                )}',
                '                            </>',
                '                        ) : (',
                '                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">',
                '                                <Store size={64} strokeWidth={1} />',
                '                                <span className="mt-4 text-sm">등록된 이미지가 없습니다</span>',
                '                            </div>',
                '                        )}',
                '                    </div>',
                '',
                '                    {/* Right: Info panel */}',
            ];
            lines.splice(block1Start, infoPanelStart - block1Start + 1, ...newBlock1);
            console.log(`  ✅ Block 1: 이미지 nav 영역 재구성 (L${block1Start + 1}-${infoPanelStart + 1})`);
        }
    }

    // Rebuild lines array 
    let c2 = lines.join(le);
    let lines2 = c2.split(/\r?\n/);

    // === Block 2: Fix Space Detail Grid (find "공간 상세 정보" and rebuild) ===
    const detailGridStart = lines2.findIndex(l => l.includes('공간 상세 정보'));
    if (detailGridStart >= 0) {
        // Find where Sales & Category section starts
        const salesStart = lines2.findIndex((l, i) => i > detailGridStart && l.includes('Sales & Category'));
        if (salesStart >= 0) {
            // The h3 at detailGridStart-2 starts this section, we need the div before it
            const sectionStart = detailGridStart - 2; // <div className="mb-5 pb-5...">
            const newBlock2 = [
                '                                <div className="mb-5 pb-5 border-b border-gray-100">',
                '                                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">',
                '                                        <Tag size={16} className="text-indigo-500" />',
                '                                        공간 상세 정보',
                '                                    </h3>',
                '                                    <div className="grid grid-cols-2 gap-2">',
                '                                        {/* 공간 유형 */}',
                '                                        <div className="p-3 bg-gray-50 rounded-xl">',
                '                                            <div className="flex items-center gap-1.5 mb-0.5">',
                '                                                <Store size={12} className="text-gray-400" />',
                '                                                <span className="text-[11px] font-medium text-gray-500">공간 유형</span>',
                '                                            </div>',
                '                                            <span className="text-sm font-bold text-gray-800">{typeLabels[venue.type] || venue.type}</span>',
                '                                        </div>',
                '                                        {/* 위치 */}',
                '                                        <div className="p-3 bg-gray-50 rounded-xl">',
                '                                            <div className="flex items-center gap-1.5 mb-0.5">',
                '                                                <MapPin size={12} className="text-gray-400" />',
                '                                                <span className="text-[11px] font-medium text-gray-500">지역</span>',
                '                                            </div>',
                '                                            <span className="text-sm font-bold text-gray-800">{venue.region || "미정"}</span>',
                '                                        </div>',
                '                                        {/* 공간 크기 */}',
                '                                        <div className="p-3 bg-gray-50 rounded-xl">',
                '                                            <div className="flex items-center gap-1.5 mb-0.5">',
                '                                                <Ruler size={12} className="text-gray-400" />',
                '                                                <span className="text-[11px] font-medium text-gray-500">공간 규모</span>',
                '                                            </div>',
                '                                            <span className="text-sm font-bold text-gray-800">{sizeLabels[venue.size] || venue.size || "미정"}</span>',
                '                                        </div>',
                '                                        {/* 가격 단위 */}',
                '                                        <div className="p-3 bg-gray-50 rounded-xl">',
                '                                            <div className="flex items-center gap-1.5 mb-0.5">',
                '                                                <Coins size={12} className="text-gray-400" />',
                '                                                <span className="text-[11px] font-medium text-gray-500">가격 단위</span>',
                '                                            </div>',
                "                                            <span className=\"text-sm font-bold text-gray-800\">{venue.pricing_unit === 'daily' ? '일간' : venue.pricing_unit === 'weekly' ? '주간' : venue.pricing_unit === 'monthly' ? '월간' : venue.pricing_unit || '미정'}</span>",
                '                                        </div>',
                '                                        {/* 최대 셀러 */}',
                '                                        <div className="p-3 bg-gray-50 rounded-xl">',
                '                                            <div className="flex items-center gap-1.5 mb-0.5">',
                '                                                <Users size={12} className="text-gray-400" />',
                '                                                <span className="text-[11px] font-medium text-gray-500">최대 셀러</span>',
                '                                            </div>',
                '                                            <span className="text-sm font-bold text-gray-800">{venue.max_sellers || "제한 없음"} 명</span>',
                '                                        </div>',
                '                                    </div>',
                '                                </div>',
                '',
            ];
            lines2.splice(sectionStart, salesStart - sectionStart, ...newBlock2);
            console.log(`  ✅ Block 2: 상세 그리드 재구성`);
        }
    }

    c2 = lines2.join(le);
    lines2 = c2.split(/\r?\n/);

    // === Block 3: Fix Sales & Category + Schedule sections ===
    const salesCatStart = lines2.findIndex(l => l.includes('Sales & Category'));
    if (salesCatStart >= 0) {
        // Find where Recruitment Progress starts
        const recruitStart = lines2.findIndex((l, i) => i > salesCatStart && l.includes('Recruitment Progress'));
        if (recruitStart >= 0) {
            const newBlock3 = [
                '                            {/* Sales & Category Section */}',
                "                            {(venue.avg_sales || (() => { try { const p = typeof venue.popular_categories === 'string' ? JSON.parse(venue.popular_categories) : venue.popular_categories; return Array.isArray(p) && p.length > 0; } catch { return false; } })()) && (",
                '                                <div className="mb-5 pb-5 border-b border-gray-100">',
                '                                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">',
                '                                        <BarChart3 size={16} className="text-amber-500" />',
                '                                        매출 & 카테고리 정보',
                '                                    </h3>',
                '                                    <div className="space-y-3">',
                '                                        {venue.avg_sales && (',
                '                                            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">',
                '                                                <div className="flex items-center gap-1.5 mb-1">',
                '                                                    <Coins size={12} className="text-amber-600" />',
                '                                                    <span className="text-[11px] font-medium text-amber-700">평균 매출</span>',
                '                                                </div>',
                '                                                <span className="text-sm font-bold text-gray-800">{venue.avg_sales}</span>',
                '                                            </div>',
                '                                        )}',
                '                                        {(() => {',
                '                                            let cats = [];',
                '                                            try {',
                "                                                cats = typeof venue.popular_categories === 'string' ? JSON.parse(venue.popular_categories) : venue.popular_categories;",
                '                                                if (!Array.isArray(cats)) cats = [];',
                '                                            } catch { cats = []; }',
                '                                            if (cats.length === 0) return null;',
                '                                            return (',
                '                                                <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl">',
                '                                                    <div className="flex items-center gap-1.5 mb-2">',
                '                                                        <Tag size={12} className="text-teal-600" />',
                '                                                        <span className="text-[11px] font-medium text-teal-700">인기 카테고리</span>',
                '                                                    </div>',
                '                                                    <div className="flex flex-wrap gap-1.5">',
                '                                                        {cats.map((cat, i) => {',
                '                                                            const found = Object.entries(CATEGORY_OPTIONS).find(([k]) => k === cat);',
                '                                                            return (',
                '                                                                <span key={i} className="px-2.5 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold">',
                '                                                                    {found ? found[1] : cat}',
                '                                                                </span>',
                '                                                            );',
                '                                                        })}',
                '                                                    </div>',
                '                                                </div>',
                '                                            );',
                '                                        })()}',
                '                                    </div>',
                '                                </div>',
                '                            )}',
                '',
                '                            {/* Schedule Section */}',
                '                            <div className="mb-5 pb-5 border-b border-gray-100">',
                '                                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">',
                '                                    <Calendar size={16} className="text-indigo-500" />',
                '                                    일정 정보',
                '                                </h3>',
                '',
                '                                {/* 모집 기간 */}',
                '                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-2">',
                '                                    <div className="flex items-center gap-1.5 mb-2">',
                '                                        <Clock size={13} className="text-blue-600" />',
                '                                        <span className="text-xs font-bold text-blue-800">모집 기간</span>',
                '                                    </div>',
                '                                    {(venue.recruitment_start || venue.recruitment_end) ? (',
                '                                        <div className="grid grid-cols-2 gap-2">',
                '                                            <div>',
                '                                                <span className="text-[10px] text-gray-500">시작</span>',
                "                                                <p className=\"text-sm font-bold text-gray-800\">{venue.recruitment_start ? new Date(venue.recruitment_start).toLocaleDateString('ko-KR') : '미정'}</p>",
                '                                            </div>',
                '                                            <div>',
                '                                                <span className="text-[10px] text-gray-500">마감</span>',
                "                                                <p className=\"text-sm font-bold text-gray-800\">{venue.recruitment_end ? new Date(venue.recruitment_end).toLocaleDateString('ko-KR') : '미정'}</p>",
                '                                            </div>',
                '                                        </div>',
                '                                    ) : (',
                '                                        <p className="text-xs text-blue-500">모집 기간이 설정되지 않았습니다</p>',
                '                                    )}',
                '                                </div>',
                '',
                '                                {/* 행사 기간 */}',
                '                                {(() => {',
                '                                    let periods = [];',
                '                                    if (venue.event_periods) {',
                '                                        try {',
                "                                            const parsed = typeof venue.event_periods === 'string' ? JSON.parse(venue.event_periods) : venue.event_periods;",
                '                                            if (Array.isArray(parsed)) periods = parsed.filter(p => p.start || p.end);',
                '                                        } catch { }',
                '                                    }',
                '                                    if (periods.length === 0 && (venue.event_start || venue.event_end)) {',
                "                                        periods = [{ start: venue.event_start || '', end: venue.event_end || '' }];",
                '                                    }',
                '',
                '                                    return periods.length > 0 ? (',
                '                                        <div className="space-y-2">',
                '                                            {periods.map((period, idx) => (',
                '                                                <div key={idx} className="p-3 bg-purple-50 border border-purple-100 rounded-xl">',
                '                                                    <div className="flex items-center gap-1.5 mb-2">',
                '                                                        <Calendar size={13} className="text-purple-600" />',
                '                                                        <span className="text-xs font-bold text-purple-800">',
                "                                                            {periods.length > 1 ? `행사 기간 ${idx + 1}` : '행사 기간'}",
                '                                                        </span>',
                '                                                    </div>',
                '                                                    <div className="grid grid-cols-2 gap-2">',
                '                                                        <div>',
                '                                                            <span className="text-[10px] text-gray-500">시작</span>',
                "                                                            <p className=\"text-sm font-bold text-gray-800\">{period.start ? new Date(period.start).toLocaleDateString('ko-KR') : '미정'}</p>",
                '                                                        </div>',
                '                                                        <div>',
                '                                                            <span className="text-[10px] text-gray-500">종료</span>',
                "                                                            <p className=\"text-sm font-bold text-gray-800\">{period.end ? new Date(period.end).toLocaleDateString('ko-KR') : '미정'}</p>",
                '                                                        </div>',
                '                                                    </div>',
                '                                                </div>',
                '                                            ))}',
                '                                        </div>',
                '                                    ) : (',
                '                                        <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">',
                '                                            <div className="flex items-center gap-1.5 mb-2">',
                '                                                <Calendar size={13} className="text-purple-600" />',
                '                                                <span className="text-xs font-bold text-purple-800">행사 기간</span>',
                '                                            </div>',
                '                                            <p className="text-xs text-purple-500">행사 기간이 설정되지 않았습니다</p>',
                '                                        </div>',
                '                                    );',
                '                                })()}',
                '                            </div>',
                '',
            ];
            lines2.splice(salesCatStart, recruitStart - salesCatStart, ...newBlock3);
            console.log(`  ✅ Block 3: 매출/카테고리 + 일정 섹션 재구성`);
        }
    }

    c2 = lines2.join(le);
    lines2 = c2.split(/\r?\n/);

    // === Block 4: Fix remaining text-only corruptions ===
    for (let i = 0; i < lines2.length; i++) {
        if (!lines2[i].includes('\uFFFD')) continue;
        const t = lines2[i].trim();

        // Share menu texts
        if (t.includes('공유') && t.includes('기')) { lines2[i] = lines2[i].replace(/공유\uFFFD*기/g, '공유하기'); }
        if (t.includes('복사') && t.includes('료')) { lines2[i] = lines2[i].replace(/복사 ?\uFFFD*료/g, '복사 완료'); }
        if (t.includes('URL') && t.includes('립보드')) { lines2[i] = lines2[i].replace(/URL\uFFFD*\uFFFD*립보드\uFFFD*\uFFFD*복사\uFFFD*\uFFFD*니\uFFFD*/g, 'URL이 클립보드에 복사됩니다'); }
        if (t.includes('카카') && t.includes('톡')) { lines2[i] = lines2[i].replace(/카카\uFFFD*톡/g, '카카오톡'); lines2[i] = lines2[i].replace(/카카오톡\uFFFD*로 공유\uFFFD*니\uFFFD*/g, '카카오톡으로 공유합니다'); }
        if (t.includes('른') && t.includes('으로') && t.includes('공유')) { lines2[i] = lines2[i].replace(/\uFFFD*른 \uFFFD*으\uFFFD*\uFFFD* ?공유/g, '다른 앱으로 공유'); }
        if (t.includes('스') && t.includes('공유 메뉴')) { lines2[i] = lines2[i].replace(/\uFFFD*스\uFFFD*\uFFFD* ?공유 메뉴\uFFFD*\uFFFD*\uFFFD*니\uFFFD*/g, '시스템 공유 메뉴를 엽니다'); }

        // Bottom buttons
        if (t.includes('벤더 계정')) { lines2[i] = lines2[i].replace(/벤더 계정\uFFFD*\uFFFD* ?\uFFFD*청 불\uFFFD*/g, '벤더 계정은 신청 불가'); }
        if (t.includes('청') && t.includes('료') && t.includes('<span>')) { lines2[i] = lines2[i].replace(/\uFFFD*청 \uFFFD*료/g, '신청 완료'); }

        // Description section
        if (t.includes('공간') && t.includes('개') && t.includes('h3')) { lines2[i] = lines2[i].replace(/공간 \uFFFD*개/g, '공간 소개'); }
        if (t.includes('공간') && t.includes('설명') && t.includes('없')) { lines2[i] = lines2[i].replace(/\uFFFD*\uFFFD*공간\uFFFD*\uFFFD*\uFFFD*\uFFFD*\uFFFD*\uFFFD*세\uFFFD*\uFFFD*명\uFFFD*\uFFFD*습\uFFFD*다\./g, '이 공간에 대한 자세한 설명이 없습니다.'); }
        if (t.includes('위치') || (t.includes('치') && t.length < 20 && t.includes('?'))) { lines2[i] = lines2[i].replace(/\uFFFD*위치/g, '위치').replace(/\uFFFD+치/g, '위치'); }

        // Recruitment status
        if (t.includes('모집') && t.includes('황')) { lines2[i] = lines2[i].replace(/모집 \uFFFD*황/g, '모집 현황'); }
        if (t.includes('{maxSellers}') && t.includes('\uFFFD')) { lines2[i] = lines2[i].replace(/\{maxSellers\}\uFFFD*/g, '{maxSellers}명'); }
    }

    // Fix any remaining single-char corruptions
    c2 = lines2.join(le);
    // Remove standalone \uFFFD in known patterns
    c2 = c2.replace(/\?\uFFFD위치/g, '위치');
    c2 = c2.replace(/\?\uFFFD시작/g, '시작');
    c2 = c2.replace(/명\uFFFD/g, '명');
    c2 = c2.replace(/\?\?공간\?\?\?\?\?\?\?세\?\?\?명\?\?\?습\?다\./g, '이 공간에 대한 자세한 설명이 없습니다.');

    // Fix the closing structure
    c2 = c2.replace(/\}\s*\n\s*export default/m, '};\n\nexport default');

    fs.writeFileSync(fp, c2, 'utf8');
    const rem = c2.split(/\r?\n/).filter(l => l.includes('\uFFFD')).length;
    console.log(`VenueDetailModal: ${rem} lines still have broken chars`);
}

// ============================================================
// 2. CommunityPage.jsx — 남은 깨진 텍스트 수정
// ============================================================
{
    const fp = `${BASE}/pages/community/CommunityPage.jsx`;
    let c = fs.readFileSync(fp, 'utf8');
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    const lines = c.split(/\r?\n/);
    let n = 0;

    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].includes('\uFFFD')) continue;
        const t = lines[i].trim();

        // title: '?삭' -> title: '댓글 삭제'
        if (t.startsWith("title: '") && t.includes('\uFFFD')) {
            if (t.includes('삭')) lines[i] = lines[i].replace(/title: '.*'/, "title: '댓글 삭제'");
            n++;
        }
        // 닫기
        if (t === '\uFFFD기' || t === '\uFFFD\uFFFD기') { lines[i] = lines[i].replace(/\uFFFD+기/, '닫기'); n++; }
        // 전체
        if (t === '\uFFFD체' || t === '\uFFFD\uFFFD체') { lines[i] = lines[i].replace(/\uFFFD+체/, '전체'); n++; }
        // 인기 글
        if (t.includes('인기') && t.includes('\uFFFD')) { lines[i] = lines[i].replace(/인기 \uFFFD+/g, '인기 글'); n++; }
        // 게시글 작성
        if (t.includes('게시') && t.includes('\uFFFD') && t.includes('성')) { lines[i] = lines[i].replace(/\uFFFD*게시 ?\uFFFD*\uFFFD*성/g, '게시글 작성'); n++; }
        // 라벨 선택
        if (t.includes('벨') && t.includes('\uFFFD') && t.includes('택')) { lines[i] = lines[i].replace(/\uFFFD*벨 \uFFFD*택/g, '라벨 선택'); n++; }
        // 제목을 입력하세요
        if (t.includes('목') && t.includes('\uFFFD') && t.includes('력')) { lines[i] = lines[i].replace(/\uFFFD*목\uFFFD*\uFFFD*력\uFFFD*세\uFFFD*/g, '제목을 입력하세요'); n++; }
        // 키워드 (선택사항)
        if (t.includes('워드') && t.includes('\uFFFD') && t.includes('택사항')) { lines[i] = lines[i].replace(/\uFFFD*워드.*택사항\)/g, '키워드 (선택사항)'); n++; }
        // 돌아가기
        if (t.includes('아가') && t.includes('\uFFFD')) { lines[i] = lines[i].replace(/\uFFFD*아가\uFFFD*기/g, '돌아가기'); n++; }
    }

    c = lines.join(le);
    fs.writeFileSync(fp, c, 'utf8');
    const rem = c.split(/\r?\n/).filter(l => l.includes('\uFFFD')).length;
    console.log(`CommunityPage: ${n} fixes, ${rem} lines still broken`);
}

// ============================================================
// 3. VenueModal.jsx — 남은 깨진 텍스트 수정
// ============================================================
{
    const fp = `${BASE}/components/VenueModal.jsx`;
    let c = fs.readFileSync(fp, 'utf8');
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    const lines = c.split(/\r?\n/);
    let n = 0;

    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].includes('\uFFFD')) continue;
        const t = lines[i].trim();

        if (t.includes('모집') && t.includes('원') && t.includes('정')) { lines[i] = lines[i].replace(/모집 \uFFFD*원 \uFFFD*정/g, '모집 인원 설정'); n++; }
        if (t.includes('리') && t.includes('카테고리') && t.includes('/*')) { lines[i] = lines[i].replace(/\{\/\*.*\*\/\}/g, '{/* 인기 카테고리 */}'); n++; }
        if (t.includes('리') && t.includes('카테고리') && t.includes('label')) { lines[i] = lines[i].replace(/\uFFFD*\uFFFD*리\uFFFD*\uFFFD* ?카테고리.*\)/g, '인기 카테고리 (선택)'); n++; }
        if (t.includes('공간') && t.includes('개') && t.includes('label')) { lines[i] = lines[i].replace(/공간 \uFFFD*개/g, '공간 소개'); n++; }
        if (t.includes("갤러") && t.includes('label')) { lines[i] = lines[i].replace(/\uFFFD*'.*갤러\uFFFD*/g, "'공간 이미지 갤러리'"); n++; }
        if (t.includes('번째') && t.includes('\uFFFD')) { lines[i] = lines[i].replace(/\uFFFD*첫? ?번째.*\./, '첫 번째 사진이 대표 이미지로 사용됩니다. 드래그로 순서를 변경하세요.'); n++; }
        if (t.includes('title=') && t.includes('\uFFFD') && t.includes('으로') || t.includes('으\uFFFD')) {
            if (t.includes('위') || lines[i].includes('위')) { lines[i] = lines[i].replace(/title="[^"]*"/g, 'title="위로"'); }
            else { lines[i] = lines[i].replace(/title="[^"]*"/g, 'title="아래로"'); }
            n++;
        }
        if (t.includes('정 ') && t.includes('료') && t.includes('venue')) { lines[i] = lines[i].replace(/\uFFFD*정 \uFFFD*료/g, '수정 완료'); n++; }
        if (t.includes('복제') && t.includes('록') && t.includes('\uFFFD')) { lines[i] = lines[i].replace(/복제 \uFFFD*록/g, '복제 등록'); n++; }
    }

    c = lines.join(le);
    fs.writeFileSync(fp, c, 'utf8');
    const rem = c.split(/\r?\n/).filter(l => l.includes('\uFFFD')).length;
    console.log(`VenueModal: ${n} fixes, ${rem} lines still broken`);
}

// Build check
const { execSync } = require('child_process');
try {
    const output = execSync('npm run build 2>&1', { cwd: 'c:/Users/KYUNG005/Desktop/spacematch', encoding: 'utf8', timeout: 30000 });
    if (output.includes('built in')) {
        console.log('\n✅ 빌드 성공!');
    } else {
        const errors = output.split('\n').filter(l => l.includes('ERROR'));
        console.log('\n빌드 에러:');
        errors.forEach(e => console.log('  ', e.trim()));
    }
} catch (err) {
    const errors = err.stdout?.split('\n').filter(l => l.includes('ERROR') || l.includes('Build')) || [];
    console.log('\n빌드 에러:');
    errors.forEach(e => console.log('  ', e.trim()));
}

/**
 * 최종 한글 텍스트 복원 스크립트 Part B
 * LandingPage, SellerDashboard, SellerVendorDirectory
 */
const fs = require('fs');
const path = require('path');
const BASE = 'c:/Users/KYUNG005/Desktop/spacematch/src';

function fixFile(relPath, lineFixMap) {
    const fp = path.join(BASE, relPath);
    let content = fs.readFileSync(fp, 'utf8');
    const le = content.includes('\r\n') ? '\r\n' : '\n';
    const lines = content.split(/\r?\n/);
    let count = 0;

    for (const [lineNum, newContent] of Object.entries(lineFixMap)) {
        const idx = parseInt(lineNum) - 1;
        if (idx >= 0 && idx < lines.length) {
            const origIndent = lines[idx].match(/^(\s*)/)[1];
            const newTrimmed = newContent.trim();
            lines[idx] = origIndent + newTrimmed;
            count++;
        }
    }

    content = lines.join(le);
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`✅ ${path.basename(fp)}: ${count}/${Object.keys(lineFixMap).length} lines fixed`);

    const remaining = content.split(/\r?\n/).filter(l => l.includes('\uFFFD')).length;
    if (remaining > 0) console.log(`   ⚠️ ${remaining} lines still corrupted`);
    return count;
}

let total = 0;

// ============================================================
// 4. LandingPage.jsx (40 lines)
// ============================================================
total += fixFile('pages/LandingPage.jsx', {
    114: "완벽한 공간</span>을",
    116: "찾아드립니다",
    120: "팝업스토어, 갤러리, 쇼룸 등",
    122: "다양한 공간과 브랜드를 매칭해드립니다.",
    124: "지금 바로 SpaceMatch에서 시작하세요!",
    139: "자세히 알아보기",
    147: "<span>안전한 매칭</span>",
    152: "<span>빠른 입점</span>",
    157: "<span>검증된 공간</span>",
    168: "{/* 긴급 모집 Preview */}",
    178: "지금<span className=\"bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent\">인기</span>",
    180: "모집 정보",
    183: "관리자가 선정한 인기 모집 공간을 확인하세요!",
    191: "const typeLabel = venue.type === 'popup' ? '팝업스토어' : venue.type === 'gallery' ? '갤러리' : venue.type === 'cafe' ? '카페' : venue.type === 'showroom' ? '쇼룸' : venue.type === 'fleamarket' ? '플리마켓' : venue.type || '기타';",
    226: '<span className="truncate font-medium">{venue.owner_name || \'공간 제공자\'}</span>',
    239: '<span className="truncate">{venue.location || \'위치 미정\'}</span>',
    256: "참여 신청하기",
    261: 'title="좋아요"',
    268: "try { await navigator.clipboard.writeText(`${window.location.origin}/recruitment`); alert('링크가 복사되었습니다! 📋'); } catch (e) { console.error(e); }",
    271: 'title="공유하기"',
    308: "셀러와 공간 제공자 모두를 위한",
    310: "유일한 매칭 플랫폼",
    424: "이용 방법 자세히 보기 <ArrowRight size={16} />",
    453: '<h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3">입점 브랜드(셀러)</h3>',
    455: "팝업스토어, 갤러리, 쇼룸 등 최적의 공간을 찾고 계신 브랜드 사장님을 위한 서비스입니다.",
    458: "{['전국 공간 검색 & 필터링', '간편한 입점 신청', '전용 이용 커뮤니티', '프로필 & 포트폴리오'].map((item, i) => (",
    474: '<h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3">공간 제공자(벤더)</h3>',
    476: "보유 공간에 입점할 브랜드를 효율적으로 모집하고 관리하시는 공간 오너를 위한 서비스입니다.",
    479: "{['공간 등록 & 사진 관리', '셀러 검색 & 모집', 'D-day 마감 관리', '벤더 전용 커뮤니티'].map((item, i) => (",
    492: "더 알아보기 <ArrowRight size={16} />",
    512: "{ value: '500+', label: '등록 셀러', icon: <ShoppingBag size={18} /> },",
    513: "{ value: '200+', label: '등록 공간', icon: <Store size={18} /> },",
    514: "{ value: '1,000+', label: '매칭 완료', icon: <Users size={18} /> },",
    540: "무료 회원가입으로 SpaceMatch의",
    542: "모든 기능을 경험하세요!",
    544: "궁금한 점이 있으시면",
    546: "언제든지 문의해 주세요!",
    554: "{dashboardPath ? '더 알아보기' : '무료 가입'}",
    563: "💬 문의하기",
    569: "이미 계정이 있으신가요?{' '}",
});

// ============================================================
// 5. SellerDashboard.jsx (11 lines)
// ============================================================
total += fixFile('pages/seller/SellerDashboard.jsx', {
    70: "console.log('레퍼런스 API 응답:', json);",
    79: "console.log('레퍼런스 데이터', normalized.length, '건');",
    361: "입점 현황",
    385: '<span className="flex items-center justify-center gap-2"><Sparkles size={16} /> 신청 완료</span>',
    578: "{/* ━━ 급상승 공간 ━━ */}",
    597: "{/* ━━ 지도로 보기 ━━ */}",
    609: "지도로 보기",
    612: '<span className="text-sm text-gray-400 font-medium hidden md:block">마커를 클릭하면 베뉴 상세정보를 볼 수 있어요</span>',
    630: "{/* ━━ 모든 공간 ━━ */}",
    755: '<h3 className="text-xl font-bold text-gray-900 mb-2">조건에 맞는 베뉴가 없어요</h3>',
    756: '<p className="text-gray-500">다른 키워드나 필터를 시도해보세요!</p>',
});

// ============================================================
// 6. SellerVendorDirectory.jsx (35 lines)
// ============================================================
total += fixFile('pages/seller/SellerVendorDirectory.jsx', {
    40: "console.error('벤더 목록 로드 실패:', err);",
    98: "모집 완료",
    167: '<h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">벤더 검색</h1>',
    168: '<p className="text-sm text-gray-500">공간을 제공하는 벤더(호스트)를 찾아보세요</p>',
    182: 'placeholder="벤더 이름 또는 키워드로 검색.."',
    194: "필터",
    205: '<label className="block text-xs font-bold text-gray-500 uppercase mb-2">지역</label>',
    212: '<option value="">전체 지역</option>',
    242: '<X size={14} /> 필터 초기화</button>',
    256: '<span className="text-white/70 text-xs ml-1">상위 노출</span>',
    308: '총 <span className="text-indigo-600 font-bold">{filteredVendors.length}</span>명의 벤더',
    316: '<h3 className="text-lg font-bold text-gray-400">검색 결과가 없습니다</h3>',
    317: '<p className="text-sm text-gray-400 mt-1">필터 조건을 변경해 보세요</p>',
    352: '<span className="text-gray-600">등록 공간 <span className="font-bold text-indigo-600">{vendor.venue_count}</span>개</span>',
    381: "가입일: {new Date(vendor.created_at).toLocaleDateString('ko-KR')}",
    413: "공간 제공자(벤더)",
    426: '<p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">벤더 소개</p>',
    430: '<p className="text-sm text-gray-400 italic">아직 벤더 소개를 등록하지 않았습니다</p>',
    438: '<p className="text-xs text-gray-400">등록 공간</p>',
    447: "운영 중인 공간 목록",
    481: '<span className="text-xs font-medium hidden sm:inline">상세보기</span>',
    496: "활동 지역",
    511: "운영 공간 현황",
    525: '<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">연락처 정보</p>',
    530: '<p className="text-xs text-gray-400">이메일</p>',
    537: '<p className="text-xs text-gray-400">연락처</p>',
    548: '<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">비즈니스 정보</p>',
    553: '<p className="text-xs text-gray-400">사업자등록번호</p>',
    562: '<p className="text-xs text-gray-400">가입일</p>',
    603: '<span className="mt-2 text-sm">등록된 공간이 없습니다</span>',
    640: '<p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">가격</p>',
    654: '<p className="text-xs text-orange-600 mt-2 font-medium">매출 수수료 {selectedVenue.commission_rate}%</p>',
    661: '<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">공간 소개</p>',
    663: "{selectedVenue.description || '이 공간에 대한 자세한 설명이 아직 등록되지 않았습니다'}",
    673: "벤더 정보로 돌아가기</button>",
});

console.log(`\n총 ${total} 줄 수정 완료`);

/**
 * 최종 한글 텍스트 복원 스크립트
 * 모든 파일의 \uFFFD 문자를 올바른 한글로 교체
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
            // Preserve leading whitespace from original
            const origIndent = lines[idx].match(/^(\s*)/)[1];
            const newTrimmed = newContent.trim();
            lines[idx] = origIndent + newTrimmed;
            count++;
        }
    }

    content = lines.join(le);
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`✅ ${path.basename(fp)}: ${count}/${Object.keys(lineFixMap).length} lines fixed`);

    // Count remaining
    const remaining = content.split(/\r?\n/).filter(l => l.includes('\uFFFD')).length;
    if (remaining > 0) console.log(`   ⚠️ ${remaining} lines still corrupted`);
    return count;
}

let total = 0;

// ============================================================
// 1. VenueDetailModal.jsx (30 lines)
// ============================================================
total += fixFile('components/VenueDetailModal.jsx', {
    5: "const CATEGORY_OPTIONS = { food: '음식/요리', fashion: '패션/의류', beauty: '뷰티/화장품', art: '예술/공예', digital: '디지털/전자', lifestyle: '라이프스타일', pet: '반려동물', kids: '키즈/유아', sports: '스포츠/아웃도어', book: '도서/문구', eco: '친환경/에코', local: '지역특산물', health: '건강/웰빙', handmade: '핸드메이드', vintage: '빈티지/레트로', other: '기타' };",
    8: "const typeLabels = { popup: '팝업스토어', gallery: '갤러리', cafe: '카페', showroom: '쇼룸', fleamarket: '플리마켓', store: '매장' };",
    10: "const sizeLabels = { small: '소형 (10평 미만)', medium: '중형 (10~30평)', large: '대형 (30평 이상)' };",
    // Info bar labels
    179: '<span className="text-xs font-bold text-gray-500">공간 유형</span>',
    189: '{/* 가격 */}',
    196: '<span className="text-xs font-bold text-gray-500">가격</span>',
    197: '<span className="text-lg md:text-xl font-black text-gray-900 tracking-tight">₩{Number(venue.price || 0).toLocaleString()}</span>',
    224: '기간: {new Date(venue.event_start).toLocaleDateString()} ~ {new Date(venue.event_end).toLocaleDateString()}',
    // Detail grid items
    280: '<span className="text-sm text-gray-500">공간 유형</span>',
    282: '<span className="text-sm font-semibold text-gray-900">{typeLabels[venue.type] || venue.type}</span>',
    284: '<span className="text-sm text-gray-500">위치</span>',
    286: '<span className="text-sm text-gray-500">공간 크기</span>',
    289: '<span className="text-sm text-gray-500">가격 단위</span>',
    292: '{unitLabel || "일 단위"}',
    293: '<span className="text-sm text-gray-500">최대 셀러</span>',
    295: '{venue.max_sellers || "제한 없음"} 명',
    298: '<span className="text-sm text-gray-500">평균 매출</span>',
    300: '{venue.avg_sales || "정보 없음"}',
    // Descriptions
    341: '<span className="text-sm text-gray-500 font-medium">{venue.description || "등록된 설명이 없습니다."}</span>',
    348: '<h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">',
    // Recruitment dates
    371: "<span className=\"text-xs font-bold text-emerald-700\">모집 기간</span>",
    373: '<span className="text-sm font-medium text-gray-800">{new Date(venue.recruitment_start).toLocaleDateString()} ~ {new Date(venue.recruitment_end).toLocaleDateString()}</span>',
    375: '<span className="text-xs font-medium text-gray-500">모집 마감까지</span>',
    397: "남은 기간: D-{daysLeft}",
    400: "오늘 마감!",
    401: "마감",
    // Action buttons
    406: '<MapPin size={18} /><span>위치 보기</span>',
    415: '<span className="flex items-center gap-2"><Sparkles size={18} /><span>신청 완료</span></span>',
    440: '{isAlreadyApplied ? "이미 신청됨" : applyLoading ? "신청 중..." : "입점 신청하기"}',
    443: '<p className="text-xs text-gray-400 text-center">입점 신청 후 벤더의 승인을 기다려주세요</p>',
    460: '<p className="text-xs text-gray-400 text-center mt-1">벤더 사용자만 이 기능을 사용할 수 있습니다</p>',
});

// ============================================================
// 2. VenueModal.jsx (38 lines)
// ============================================================
total += fixFile('components/VenueModal.jsx', {
    269: "<h2 className=\"text-xl font-extrabold text-gray-900\">{venue ? '공간 정보 수정' : isDuplicateMode ? '공간 복제 등록' : '새 공간 등록'}</h2>",
    270: "<p className=\"text-sm text-gray-500\">{venue ? '등록된 공간 정보를 수정합니다' : isDuplicateMode ? '기존 공간을 복제하여 새로 등록합니다' : '새로운 공간을 등록하여 서비스해보세요'}</p>",
    283: '<label className="block text-sm font-bold text-gray-700 mb-2 is-required">공간 이름</label>',
    289: 'placeholder="수원 팝업 스페이스 A"',
    343: '<label className="block text-sm font-bold text-gray-700 mb-2">공간 유형</label>',
    354: '<option value="popup">팝업스토어</option>',
    355: '<option value="fleamarket">플리마켓</option>',
    356: '<option value="gallery">갤러리</option>',
    358: '<option value="showroom">쇼룸</option>',
    359: '<option value="other">기타 (직접 입력)</option>',
    368: 'placeholder="유형 직접 입력"',
    374: '<label className="block text-sm font-bold text-gray-700 mb-2">공간 크기</label>',
    382: '<option value="small">소형 (Small)</option>',
    384: '<option value="large">대형 (Large)</option>',
    390: '<label className="block text-sm font-bold text-gray-700 mb-2">가격</label>',
    398: '<option value="daily">일 단위</option>',
    399: '<option value="weekly">주 단위</option>',
    400: '<option value="monthly">월 단위</option>',
    417: '<p className="mt-1.5 text-xs text-emerald-600 font-medium">💚 무료로 설정됩니다</p>',
    421: '<label className="block text-sm font-bold text-gray-700 mb-2">수수료 (%)</label>',
    436: '<p className="mt-1.5 text-xs text-gray-400">매출 기반 수수료 퍼센트를 입력하세요</p>',
    443: '<p className="text-xs text-gray-400 mb-3">이 공간에서 인기 있는 카테고리를 선택하세요 (복수 선택 가능)</p>',
    447: '<label className="block text-xs font-medium text-gray-500 mb-1">모집 시작</label>',
    476: "{formData.recruitment_closed ? '🔒 모집 완료' : '모집 진행 중'}",
    485: "{diff < 0 ? '마감됨' : diff === 0 ? '오늘 마감!' : `D-${diff} (${diff}일 남음)`}",
    495: '<label className="text-sm font-bold text-purple-800">행사 기간 설정</label>',
    // Event period labels  
    553: '<label className="block text-xs text-gray-500">시작일</label>',
    561: '<label className="block text-xs text-gray-500">종료일</label>',
    571: '삭제',
    // Description, max sellers
    585: '<label className="text-sm font-bold text-gray-700 mb-2">설명</label>',
    590: 'placeholder="공간에 대한 설명을 입력하세요"',
    600: '<label className="text-sm font-bold text-gray-700 mb-2">최대 셀러 수</label>',
    610: '<label className="text-sm font-bold text-gray-700 mb-2">평균 매출 (선택)</label>',
    618: '<label className="text-sm font-bold text-gray-700 mb-2">인기 카테고리</label>',
    619: '<p className="text-xs text-gray-400 mb-3">이 공간에서 인기 있는 카테고리를 선택하세요 (복수 선택 가능)</p>',
    650: '<label className="text-sm font-bold text-gray-700 mb-2">공간 이미지</label>',
    // Submit button
    688: "{venue ? '수정 완료' : isDuplicateMode ? '공간 복제 등록' : '공간 등록'}",
});

// ============================================================
// 3. CommunityPage.jsx (48 lines)
// ============================================================
total += fixFile('pages/community/CommunityPage.jsx', {
    11: "{ id: 'free', label: '자유게시판', icon: 'MessageSquare', color: 'text-blue-600 bg-blue-100' },",
    12: "{ id: 'info', label: '정보공유', icon: 'Info', color: 'text-emerald-600 bg-emerald-100' },",
    22: "title: '셀러 커뮤니티',",
    23: "subtitle: '셀러들의 자유로운 소통 공간',",
    33: "title: '벤더 커뮤니티',",
    34: "subtitle: '벤더들의 경험과 정보 공유 공간',",
    // Time labels
    55: "if (diff < 60) return `${diff}초 전`;",
    95: "const categoryLabels = { free: '자유게시판', info: '정보공유', question: '질문', review: '후기', tip: '팁/노하우' };",
    // Error handling
    278: "showToast('게시글을 불러오는 데 실패했습니다.', 'error');",
    289: "showToast('게시글을 등록했습니다!', 'success');",
    312: "showToast('게시글 등록에 실패했습니다.', 'error');",
    314: "showToast('게시글 등록 중 오류가 발생했습니다.', 'error');",
    326: "showToast('댓글을 등록했습니다!', 'success');",
    327: "showToast('댓글 등록에 실패했습니다.', 'error');",
    329: "showToast('댓글 등록 중 오류가 발생했습니다.', 'error');",
    // Post/comment actions
    344: "showToast('게시글이 삭제되었습니다.', 'success');",
    346: "showToast('게시글 삭제에 실패했습니다.', 'error');",
    349: "showToast('삭제 중 오류가 발생했습니다.', 'error');",
    // More actions
    359: "title: '게시글 수정',",
    360: "showToast('이 기능은 곧 지원됩니다.', 'info');",
    361: "title: '게시글 신고',",
    362: "showToast('신고가 접수되었습니다. 감사합니다.', 'info');",
    368: "showToast('댓글이 삭제되었습니다.', 'success');",
    370: "showToast('댓글 삭제에 실패했습니다.', 'error');",
    371: "showToast('댓글 삭제에 실패했습니다.', 'error');",
    372: "showToast('댓글 삭제 중 오류가 발생했습니다.', 'error');",
    // UI labels
    393: "alert('프로필을 불러오는 데 실패했습니다.');",
    // Time
    407: "if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;",
    408: "if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;",
    409: "return `${Math.floor(diff / 86400)}일 전`;",
    // Write post
    445: "<h2 className=\"text-xl font-bold text-gray-800 flex items-center gap-2\">✏️ 게시글 작성</h2>",
    470: "placeholder=\"게시글 내용을 입력하세요...\"",
    488: "<span>카테고리</span>",
    489: "<option value=\"\">카테고리 선택</option>",
    490: "<option value=\"free\">자유게시판</option>",
    491: "<option value=\"info\">정보공유</option>",
    497: "placeholder=\"제목을 입력하세요\"",
    499: "{postLoading ? '등록 중...' : '게시글 등록'}",
    502: "닫기",
    // Headings
    548: '<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-600 mr-2">전체 #{posts.length}</div>',
    // Empty state
    609: '<h3 className="text-xl font-bold text-gray-400 mb-2 mt-3">아직 게시글이 없습니다</h3>',
    617: '<p className="text-gray-400 text-sm">첫 게시글을 작성해 주세요!</p>',
    // Post card
    623: '{post.category && <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${CATEGORIES.find(c => c.id === post.category)?.color || "text-gray-500 bg-gray-100"}`}>{categoryLabels[post.category] || post.category}</span>}',
    624: 'title="게시글 더보기"',
    625: '{post.user_role === "vendor" ? "벤더" : post.user_role === "seller" ? "셀러" : post.user_role === "admin" ? "관리자" : ""}',
    626: '·',
    627: '{formatTime(post.created_at)}',
    633: '{post.title && <h3 className="text-base font-bold text-gray-900 mb-1 break-all">{post.title}</h3>}',
    640: '더보기',
});

// Now fix the remaining CommunityPage lines (after line 640)
total += fixFile('pages/community/CommunityPage.jsx', {
    704: '<button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors group"><Heart size={18} className={post.likedByMe ? "text-red-500 fill-red-500" : ""} /><span className="text-sm font-bold">{post.likes || 0}</span></button>',
    726: '<span className="text-sm font-bold">좋아요 {post.likes || 0}</span>',
    740: '<p className="text-sm text-gray-700 whitespace-pre-wrap break-all">{post.content}</p>',
    745: '수정',
    755: '삭제',
    786: '<h3 className="font-bold text-gray-900">{post.user_name}</h3>',
    793: '{post.user_role === "vendor" ? "벤더" : post.user_role === "seller" ? "셀러" : post.user_role === "admin" ? "관리자" : "사용자"}',
    797: '가입일: {new Date(post.created_at).toLocaleDateString()}',
    802: '<p className="text-[10px] text-gray-400 font-medium">게시글</p>',
    804: '<p className="text-[10px] text-gray-400 font-medium">댓글</p>',
    809: '확인',
    813: '{post.user_role === "vendor" ? "벤더" : post.user_role === "seller" ? "셀러" : "관리자"}',
    814: '·',
    815: '{formatTime(post.created_at)}',
    816: '·',
    817: '{post.user_role === "vendor" ? "벤더" : post.user_role === "seller" ? "셀러" : "관리자"}',
    826: '더보기',
    835: '<span className="text-sm font-bold">좋아요 {post.likes || 0}</span>',
    836: '<span className="text-sm font-bold">댓글 {commentCounts[post.id] || 0}</span>',
    840: '닫기',
    // Share, comments, profile sections
    992: '<p className="text-gray-400 text-sm mt-1">첫 번째 댓글을 작성해 보세요</p>',
    1107: 'title="공유하기"',
    1121: '<p className="text-xs font-bold text-gray-700">공유하기</p>',
    1155: "{copiedPostId === post.id ? '복사 완료!' : '링크 복사'}",
    1157: '<p className="text-[10px] text-gray-400">URL이 클립보드로 복사됩니다</p>',
    1178: '<p className="text-sm font-bold text-gray-700">카카오톡</p>',
    1179: '<p className="text-[10px] text-gray-400">카카오톡으로 공유합니다</p>',
    1200: '<p className="text-sm font-bold text-gray-700">다른 앱으로 공유</p>',
    1201: '<p className="text-[10px] text-gray-400">시스템 공유 메뉴를 엽니다</p>',
    1298: '수정',
    1305: '삭제',
    1316: '댓글 {commentCounts[post.id] > 0 && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{commentCounts[post.id]}</span>}',
    1334: 'placeholder="댓글을 입력하세요.."',
    1391: '삭제',
    1406: 'placeholder={`@${replyingTo.userName} 에게 답글...`}',
    1476: '<p className="text-xs text-gray-400 text-center py-2">아직 댓글이 없습니다. 첫 댓글을 남겨보세요</p>',
    // Profile modal
    1594: '{profileData.user.role === \'vendor\' ? \'벤더\' : profileData.user.role === \'seller\' ? \'셀러\' : profileData.user.role === \'superadmin\' ? \'최고관리자\' : \'관리자\'}',
    1600: '가입일: {new Date(profileData.user.created_at).toLocaleDateString()}',
    1617: '<p className="text-[10px] text-gray-400 font-medium">게시글</p>',
    1621: '<p className="text-[10px] text-gray-400 font-medium">댓글</p>',
    1628: '{profileData.user.role === \'vendor\' ? \'등록 베뉴\' : \'입점 활동\'}',
    1638: '판매 상품',
    1655: '등록된 베뉴',
    1686: '활동 위치 (입점 지역)',
    1710: '아직 활동 지역이 없습니다.',
    1716: '프로필 정보를 불러올 수 없습니다.',
    1740: '{confirmModal.confirmLabel || \'확인\'}',
});

console.log(`\n총 ${total} 줄 수정 완료`);

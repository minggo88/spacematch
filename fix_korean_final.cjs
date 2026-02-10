/**
 * FINAL comprehensive fix - ALL remaining corrupted Korean text
 * Line-number-based replacement for every corrupted line
 */
const fs = require('fs');
const path = require('path');
const BASE = 'c:/Users/KYUNG005/Desktop/spacematch/src';

function fixFile(relPath, lineMap) {
    const filePath = path.join(BASE, relPath);
    const content = fs.readFileSync(filePath, 'utf8');
    const le = content.includes('\r\n') ? '\r\n' : '\n';
    const lines = content.split(/\r?\n/);
    let fixed = 0;
    for (const [n, c] of Object.entries(lineMap)) {
        const i = parseInt(n) - 1;
        if (i >= 0 && i < lines.length && lines[i].includes('\uFFFD')) {
            lines[i] = c;
            fixed++;
        }
    }
    if (fixed > 0) {
        fs.writeFileSync(filePath, lines.join(le), 'utf8');
        console.log(`\u2705 ${relPath}: ${fixed} lines`);
    }
    return fixed;
}

let T = 0;

// ============================================================
// VenueModal.jsx
// ============================================================
T += fixFile('components/VenueModal.jsx', {
    128: "                    name: '', location: '', detailAddress: '', region: '', description: '', price: '', commission_rate: '', pricing_unit: 'daily', type: 'popup', size: 'medium', images: [], recruitment_start: '', recruitment_end: '', event_periods: [{ start: '', end: '' }], recruitment_closed: false, max_sellers: '', avg_sales: '', popular_categories: []",
    203: "                    </p>",
    229: "                                placeholder=\"공간 이름을 입력하세요\"",
    237: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">주소 *</label>",
    246: "                        <button type=\"button\" onClick={() => setIsPostcodeOpen(true)} className=\"px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all w-full text-center font-medium\">",
    247: "                            📍 주소 검색하기",
    253: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">상세 주소</label>",
    255: "                            placeholder=\"상세주소 입력 (동/호수 등)\"",
    261: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">지역 *</label>",
    266: "                                <option value=\"\">지역 선택</option>",
    296: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">공간 유형 *</label>",
    301: "                                <option value=\"popup\">팝업스토어</option>",
    302: "                                <option value=\"gallery\">갤러리</option>",
    303: "                                <option value=\"cafe\">카페</option>",
    304: "                                <option value=\"showroom\">쇼룸</option>",
    305: "                                <option value=\"fleamarket\">플리마켓</option>",
    306: "                                <option value=\"store\">매장</option>",
    313: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">공간 크기</label>",
    318: "                                <option value=\"small\">소형 (10평 미만)</option>",
    319: "                                <option value=\"medium\">중형 (10~30평)</option>",
    320: "                                <option value=\"large\">대형 (30평 이상)</option>",
    327: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">가격 (원) *</label>",
    329: "                            placeholder=\"가격을 입력하세요\"",
    337: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">가격 단위</label>",
    342: "                                <option value=\"daily\">일 단위</option>",
    343: "                                <option value=\"weekly\">주 단위</option>",
    344: "                                <option value=\"monthly\">월 단위</option>",
    350: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">수수료율 (%)</label>",
    352: "                            placeholder=\"수수료율\"",
    360: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">설명</label>",
    362: "                            placeholder=\"공간에 대한 설명을 입력하세요\"",
    370: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">모집 기간</label>",
    372: "                                <label className=\"text-xs text-gray-500\">모집 시작</label>",
    377: "                                <label className=\"text-xs text-gray-500\">모집 마감</label>",
    384: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">이벤트 기간</label>",
    396: "                                    <label className=\"text-xs text-gray-500\">시작일</label>",
    401: "                                    <label className=\"text-xs text-gray-500\">종료일</label>",
    408: "                                        <span>삭제</span>",
    414: "                            + 기간 추가",
    424: "                            <label className=\"block text-sm font-bold text-gray-700 mb-2\">최대 셀러 수</label>",
    426: "                            placeholder=\"최대 셀러 수\"",
    433: "                            <label className=\"block text-sm font-bold text-gray-700 mb-2\">평균 매출</label>",
    435: "                            placeholder=\"평균 매출 (선택)\"",
    442: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">인기 카테고리</label>",
    443: "                        <p className=\"text-xs text-gray-400 mb-3\">이 공간에서 인기 있는 카테고리를 선택하세요 (복수 선택 가능)</p>",
    479: "                        <label className=\"block text-sm font-bold text-gray-700 mb-2\">공간 이미지</label>",
    486: "                                {isDuplicateMode && formData.images.length > 0 && <p className=\"text-xs text-amber-500 font-medium\">⚠ 기존 이미지가 복사되었습니다. 필요시 삭제/추가하세요.</p>}",
    497: "                                    이미지 선택 (최대 10장)",
    517: "                        <button type=\"submit\" className=\"w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5\">",
    518: "                            {venue ? '공간 수정' : (isDuplicateMode ? '공간 복제 등록' : '공간 등록')}",
});

// ============================================================
// VenueDetailModal.jsx
// ============================================================
T += fixFile('components/VenueDetailModal.jsx', {
    27: "    const [activeTab, setActiveTab] = useState('정보');",
    179: "                                        모집 마감",
    189: "                                        {venue.recruitment_start && `모집: ${venue.recruitment_start} ~ ${venue.recruitment_end || '미정'}`}",
    196: "                                            <span className=\"text-xs text-gray-500\">등록일</span>",
    197: "                                            <span className=\"text-xs font-medium\">{venue.created_at ? new Date(venue.created_at).toLocaleDateString('ko-KR') : '-'}</span>",
    224: "                        {/* Price Block */}",
    259: "                            <h3 className=\"text-lg font-bold text-gray-900\">공간 정보</h3>",
    261: "                                    <Info className=\"text-gray-400\" size={14} /><span className=\"text-sm text-gray-500\">유형</span>",
    263: "                                    <span className=\"text-sm font-semibold text-gray-900\">{typeLabels[venue.type] || venue.type}</span>",
    265: "                                    <MapPin className=\"text-gray-400\" size={14} /><span className=\"text-sm text-gray-500\">위치</span>",
    268: "                                    <Maximize2 className=\"text-gray-400\" size={14} /><span className=\"text-sm text-gray-500\">크기</span>",
    271: "                                    <Percent className=\"text-gray-400\" size={14} /><span className=\"text-sm text-gray-500\">수수료</span>",
    272: "                                    <span className=\"text-sm font-semibold text-gray-900\">{venue.commission_rate ? `${venue.commission_rate}%` : '미정'}</span>",
    278: "                                    <span className=\"text-sm text-gray-500\">가격 단위</span>",
    280: "                                    <span className=\"text-sm font-semibold text-gray-900\">{venue.pricing_unit === 'daily' ? '일 단위' : venue.pricing_unit === 'weekly' ? '주 단위' : venue.pricing_unit === 'monthly' ? '월 단위' : getPricingUnitLabel ? getPricingUnitLabel(venue.pricing_unit) : venue.pricing_unit}</span>",
    291: "                                <h3 className=\"text-lg font-bold text-gray-900 mb-3\">이벤트 기간</h3>",
    293: "                                            <span className=\"text-xs font-bold text-gray-400\">기간 {idx + 1}</span>",
    297: "                                    <p className=\"text-sm text-gray-400\">등록된 이벤트 기간이 없습니다.</p>",
    340: "                                <h4 className=\"text-sm font-bold text-gray-700 mb-3\">설명</h4>",
    341: "                                {venue.description ? <p className=\"text-sm text-gray-600 whitespace-pre-wrap leading-relaxed\">{venue.description}</p> : <p className=\"text-sm text-gray-400 italic\">설명이 없습니다.</p>}",
    348: "                                    <h4 className=\"text-sm font-bold text-gray-700 mb-3\">인기 카테고리</h4>",
    371: "                                <h3 className=\"text-sm font-bold text-gray-700 mb-4\">평균 매출</h3>",
    373: "                                    <span className=\"text-2xl font-extrabold text-indigo-600\">{`₩${Number(venue.avg_sales).toLocaleString()}`}</span>",
    375: "                                    <p className=\"text-sm text-gray-400 italic\">평균 매출 정보가 없습니다.</p>",
    397: "                            <h3 className=\"text-lg font-bold text-gray-900 mb-4\">모집 현황</h3>",
    400: "                                    <span className=\"text-xs font-bold text-gray-400\">최대 셀러</span>",
    401: "                                    <span className=\"text-lg font-extrabold text-gray-900\">{maxSellers}명</span>",
    406: "                                    <span className=\"text-xs font-bold text-gray-400\">승인된 셀러</span>",
    415: "                                <span className=\"text-xs font-bold text-gray-400\">남은 자리</span>",
    440: "                                <h3 className=\"text-sm font-bold text-gray-700 mb-4\">신청자 목록</h3>",
    443: "                                                <span className=\"font-medium text-gray-900\">{app.name || app.applicant_name || '신청자'}</span>",
    460: "                                            <span className=\"text-sm text-gray-500\">신청자가 없습니다</span>",
});

// ============================================================
// SellerDashboard.jsx
// ============================================================
T += fixFile('pages/seller/SellerDashboard.jsx', {
    52: "        console.error('페이지 데이터 로딩 실패:', err);",
    55: "        console.log('대시보드 로딩 시작');",
    59: "            console.error('레퍼런스 API 응답 오류:', res.status, res.statusText);",
    64: "            console.error('레퍼런스 API 호출 실패:', err);",
    73: "            console.error('프로필 이미지 로드 실패:', err);",
    85: "            console.error('프로모션 로드 실패:', err);",
    90: "        console.log('대시보드 로딩 완료');",
    96: "    const openVenueDetail = (venue) => { setSelectedVenue(venue); };",
    115: "            <div className=\"mb-2 rounded-2xl overflow-hidden shadow-lg relative\">",
    127: "                    <span className=\"text-white text-xs md:text-sm font-bold px-3 py-1 bg-black/40 rounded-full backdrop-blur-sm\">📍 {activeVenues.length}개 공간 운영중</span>",
    133: "            {/* 1. 프로모션 배너 영역 */}",
    147: "                <span className=\"text-white/80 text-xs md:text-sm font-medium\">최적의 공간을 연결하는 플랫폼</span>",
    149: "                    <span className=\"block sm:inline\">당신의 브랜드에</span>",
    150: "                    <span className=\"block sm:inline\">맞는 완벽한 공간을</span>",
    151: "                    <span className=\"block sm:inline\">찾아드립니다</span>",
    156: "                        공간 둘러보기",
    158: "                        <span>입점 신청 현황</span>",
    179: "            <div className=\"grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8\">",
    181: "                        <span className=\"text-xs text-gray-400 font-bold uppercase\">운영중</span>",
    187: "                        <span className=\"text-xs text-gray-400 font-bold uppercase\">위시리스트</span>",
    193: "                        <span className=\"text-xs text-gray-400 font-bold uppercase\">신청 현황</span>",
    199: "                        <span className=\"text-xs text-gray-400 font-bold uppercase\">승인됨</span>",
    209: "                        📌 공간 탐색",
    213: "                            <h3 className=\"text-sm font-bold text-gray-700\">카테고리</h3>",
    215: "                            <button key={t} onClick={() => setFilterType(t)} className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${filterType === t ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{filterType === '' && t === '' ? '전체' : TYPE_LABELS[t] || t}</button>",
    420: "                            <span className=\"text-[10px] md:text-xs text-gray-400 font-bold\">{TYPE_LABELS[venue.type] || venue.type}</span>",
    423: "                            <span className=\"text-sm md:text-base font-extrabold text-gray-800 group-hover:text-indigo-600 transition-colors truncate\">{venue.name}</span>",
    425: "                            <span className=\"text-xs md:text-sm text-gray-500 truncate\">{venue.location}</span>",
    432: "                                <span className=\"text-xs text-gray-400 font-bold\">가격</span>",
    433: "                                <span className=\"text-base md:text-lg font-extrabold text-indigo-600\">{Number(venue.price) === 0 ? '무료' : `₩${parseInt(venue.price).toLocaleString()}`}</span>",
    437: "                                <span className=\"text-xs text-gray-400 font-bold\">크기</span>",
    438: "                                <span className=\"text-sm font-bold text-gray-600\">{venue.size === 'small' ? '소형' : venue.size === 'medium' ? '중형' : '대형'}</span>",
    444: "                                <span className=\"text-xs text-gray-400 font-bold\">모집</span>",
    447: "                                    <span className=\"text-xs font-bold\">{venue.recruitment_closed ? '마감' : venue.approved_count >= venue.max_sellers ? '마감' : '모집중'}</span>",
    451: "                                <span className=\"text-xs text-gray-400 font-bold\">수수료</span>",
    453: "                                <span className=\"text-xs text-gray-400 font-bold\">입점현황</span>",
    454: "                                <span className=\"text-sm font-bold text-gray-600\">{venue.approved_count || 0} / {venue.max_sellers || '무제한'}</span>",
    458: "                            {getAppStatus(venue.id) === 'approved' && <span className=\"flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full\"><CheckCircle size={12} /> 입점 승인됨</span>}",
    459: "                            {getAppStatus(venue.id) === 'pending' && <span className=\"flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full\"><Clock size={12} /> 심사 중</span>}",
    468: "                            <p className=\"text-gray-400 font-medium\">조건에 맞는 공간이 없습니다</p>",
    469: "                            <p className=\"text-gray-400 text-sm mt-1\">다른 필터를 시도해보세요</p>",
    476: "                {/* 신청 현황 */}",
    478: "                    📋 나의 입점 신청 현황",
    484: "                        <p className=\"text-gray-400 font-medium\">아직 신청한 공간이 없습니다</p>",
    495: "                                            <span className=\"text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full\">심사 대기</span>",
    496: "                                            <span className=\"text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full\">✓ 승인</span>",
    497: "                                            <span className=\"text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full\">✗ 반려</span>",
    501: "                                        <span className=\"text-xs text-gray-400\">{new Date(app.applied_at).toLocaleDateString('ko-KR')} 신청</span>",
    508: "                                            취소",
    514: "                    <div className=\"bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-5 md:p-6 mt-6 shadow-lg relative overflow-hidden\">",
    517: "                        <h3 className=\"text-lg font-extrabold mb-1\">완벽한 공간을 찾고 계신가요?</h3>",
    518: "                        <p className=\"text-white/70 text-sm mb-4\">SpaceMatch가 최적의 공간을 찾아드립니다.</p>",
    519: "                        <button onClick={() => navigate('/seller/vendors')} className=\"bg-white text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-lg\">",
    520: "                            벤더 디렉토리 둘러보기 →",
    537: "                            커뮤니티",
    538: "                        {user?.name && <span className=\"ml-1 text-xs text-gray-400\">· {user.name}님</span>}",
    544: "        {selectedVenue && <VenueDetailModal venue={selectedVenue} onClose={() => setSelectedVenue(null)} onApply={handleApplyClick} applications={applications} user={user} />}",
    556: "                <input placeholder=\"아이디 (이메일)\" value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} className=\"w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-200 font-medium\" />",
    558: "                    <input placeholder=\"비밀번호\" type={showPw ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} className=\"w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-200 font-medium pr-12\" />",
    563: "                <button onClick={handleLogin} className=\"w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all\">로그인</button>",
    564: "                {loginError && <p className=\"text-red-500 text-xs font-medium text-center\">{loginError}</p>}",
    565: "                <div className=\"flex items-center gap-4 mt-3\">",
    569: "                    아직 계정이 없으신가요?{' '}",
});

// ============================================================
// CommunityPage.jsx
// ============================================================
T += fixFile('pages/community/CommunityPage.jsx', {
    11: "        title: '셀러 커뮤니티',",
    12: "        subtitle: '셀러들의 자유로운 소통 공간',",
    22: "        title: '벤더 커뮤니티',",
    23: "        subtitle: '벤더들을 위한 정보 공유',",
    33: "        title: '공지사항',",
    34: "        subtitle: '운영진 공지 및 안내',",
    55: "    const emptyMessages = useMemo(() => ({ seller: '첫 번째 게시글을 작성해보세요!', vendor: '정보를 공유해보세요!', notice: '공지사항이 없습니다.' }), []);",
    95: "        console.error('게시글 로드 실패:', err);",
    278: "            showToast('제목과 내용을 모두 입력해주세요', 'error');",
    289: "                let bodyData = { title: newPost.title, content: newPost.content, label: newPost.label, board_type: activeBoardType };",
    312: "                showToast('게시글이 등록되었습니다!', 'success');",
    314: "                showToast(data.message || '게시글 등록에 실패했습니다.', 'error');",
    326: "                    title: '게시글 삭제',",
    327: "                    message: '이 게시글을 삭제하시겠습니까?',",
    329: "                    confirmLabel: '삭제',",
    344: "                        showToast('게시글이 삭제되었습니다.', 'success');",
    346: "                        showToast(data.message || '삭제에 실패했습니다.', 'error');",
    349: "                    showToast('오류가 발생했습니다.', 'error');",
    359: "        if (diff < 60000) return '방금 전';",
    360: "        if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;",
    361: "        if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;",
    362: "        if (diff < 604800000) return `${Math.floor(diff / 86400000)}일 전`;",
    368: "            case 'seller': return { label: '셀러', color: 'bg-violet-100 text-violet-700' };",
    370: "            case 'admin': return { label: '관리자', color: 'bg-red-100 text-red-700' };",
    371: "            case 'superadmin': return { label: '최고관리자', color: 'bg-orange-100 text-orange-700' };",
    372: "            default: return { label: role || '회원', color: 'bg-gray-100 text-gray-600' };",
    393: "            showToast('제목과 내용을 모두 입력해주세요', 'error');",
    407: "                showToast('게시글이 수정되었습니다.', 'success');",
    409: "                showToast(data.message || '수정에 실패했습니다.', 'error');",
    445: "                showToast(data.message || '등록에 실패했습니다.', 'error');",
    470: "                showToast(data.message || '등록에 실패했습니다.', 'error');",
    488: "                    title: '댓글 삭제',",
    489: "                    message: '이 댓글을 삭제하시겠습니까?',",
    491: "                    confirmLabel: '삭제',",
    497: "                        showToast('댓글이 삭제되었습니다.', 'success');",
    499: "                        showToast(data.message || '삭제에 실패했습니다.', 'error');",
    502: "                    showToast('오류가 발생했습니다.', 'error');",
    548: "                    <span className=\"text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700\">신규</span>",
    609: "                            placeholder=\"무엇이든 자유롭게 공유해보세요!\"",
    617: "                            placeholder=\"제목\"",
    623: "                                    <option value=\"\">라벨 선택</option>",
    624: "                                    <option value=\"질문\">질문</option>",
    625: "                                    <option value=\"정보공유\">정보공유</option>",
    626: "                                    <option value=\"후기\">후기</option>",
    627: "                                    <option value=\"일상\">일상</option>",
    633: "                            게시글 작성",
    640: "                                <p className=\"text-sm text-gray-400\">{loading ? '로딩 중...' : emptyMessages[activeBoardType]}</p>",
    704: "                                                    <button onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)} className=\"text-[10px] text-gray-400 hover:text-indigo-500 cursor-pointer font-medium transition-colors\">답글</button>",
    726: "                                                                    <button onClick={() => setReplyingTo(replyingTo === r.id ? null : r.id)} className=\"text-[10px] text-gray-400 hover:text-indigo-500 cursor-pointer font-medium transition-colors\">답글</button>",
    740: "                                                            placeholder=\"답글을 입력하세요...\"",
    745: "                                                            등록",
    755: "                                            placeholder=\"댓글을 입력하세요...\"",
    760: "                                            등록",
    786: "                                placeholder=\"제목\"",
    793: "                            수정 완료",
    797: "                            취소",
    802: "                {/* Write new post (form at bottom) */}",
    804: "                    <h3 className=\"text-sm font-bold text-gray-700 uppercase tracking-wider\">새 글 작성</h3>",
    809: "                        placeholder=\"제목\"",
    813: "                                <option value=\"\">라벨 선택</option>",
    814: "                                <option value=\"질문\">질문</option>",
    815: "                                <option value=\"정보공유\">정보공유</option>",
    816: "                                <option value=\"후기\">후기</option>",
    817: "                                <option value=\"일상\">일상</option>",
    826: "                            className=\"w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium resize-none\"",
    835: "                        {attachedPhotos.length > 0 && <p className=\"text-xs text-gray-500 mt-1\">{attachedPhotos.length}장의 사진이 첨부되었습니다</p>}",
    836: "                        <button type=\"button\" onClick={() => photoInputRef.current?.click()} className=\"text-xs text-indigo-500 hover:text-indigo-700 font-medium mt-2\">📷 사진 첨부</button>",
    840: "                            게시글 등록",
});

// ============================================================
// LandingPage.jsx
// ============================================================
T += fixFile('pages/LandingPage.jsx', {
    53: "        } catch (e) { console.error('프로모션 로드 실패:', e); }",
    107: "                <span className=\"text-white/80 text-xs md:text-sm font-medium\">최적의 공간을 연결하는 플랫폼</span>",
    111: "                    <span className=\"block sm:inline\">당신의 브랜드에</span>",
    112: "                    <span className=\"block sm:inline\">맞는 완벽한 공간을</span>",
    113: "                    <span className=\"block sm:inline\">찾아드립니다</span>",
    118: "                        공간 둘러보기 →",
    121: "                        카카오톡 상담",
    131: "                <h2 className=\"text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight\">추천 공간</h2>",
    132: "                <p className=\"text-gray-400 text-sm mt-1\">SpaceMatch가 엄선한 베스트 공간</p>",
    148: "                        <p className=\"text-xs text-gray-400 italic text-center py-8\">추천 공간이 없습니다</p>",
    177: "                                                    <span className=\"text-[10px] text-gray-400 font-bold\">{venue.type === 'popup' ? '팝업' : venue.type === 'gallery' ? '갤러리' : venue.type}</span>",
    188: "                                                <span className=\"truncate text-xs text-gray-400\">{venue.location}</span>",
    193: "                                                {Number(venue.price) === 0 ? <span className=\"text-emerald-600 font-bold text-sm\">무료</span> : <span className=\"text-sm font-bold text-gray-800\">{`₩${parseInt(venue.price).toLocaleString()}`}</span>}",
    200: "                                                <span className=\"text-xs text-gray-400\">무료</span>",
    275: "                            <h3 className=\"text-xs font-bold text-gray-400 uppercase tracking-widest mb-2\">Step {step.id}</h3>",
    285: "                <h2 className=\"text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight\">이용 안내</h2>",
    286: "                <p className=\"text-gray-400 text-sm mt-1\">SpaceMatch 이용 방법을 확인하세요</p>",
    289: "                    { icon: <UserPlus size={24} />, title: '회원가입', desc: '간단한 정보로 가입하세요', color: 'from-violet-500 to-purple-600' },",
    290: "                    { icon: <Search size={24} />, title: '공간 탐색', desc: '원하는 조건으로 검색하세요', color: 'from-blue-500 to-indigo-600' },",
    291: "                    { icon: <ClipboardList size={24} />, title: '입점 신청', desc: '마음에 드는 공간에 신청하세요', color: 'from-emerald-500 to-green-600' },",
    292: "                    { icon: <CheckCircle size={24} />, title: '매칭 완료', desc: '승인 후 입점을 시작하세요', color: 'from-amber-500 to-orange-600' },",
    300: "                    <h2 className=\"text-2xl md:text-3xl font-extrabold text-white mb-2\">지금 시작하세요</h2>",
    301: "                    <p className=\"text-white/80 text-sm mb-6\">SpaceMatch에서 완벽한 공간을 만나보세요</p>",
    303: "                        회원가입",
    305: "                        로그인",
    311: "            {/* Footer */}",
    314: "                <p className=\"text-xs text-gray-400\">© 2025 SpaceMatch. 모든 권리 보유.</p>",
    315: "                <p className=\"text-xs text-gray-400 mt-1\">팝업스토어·갤러리·플리마켓 공간 매칭 플랫폼</p>",
    339: "                    <input placeholder=\"아이디 (이메일)\" value={loginForm.email} onChange={e => setLoginForm(f => ({...f, email: e.target.value}))} className=\"w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-200 font-medium\" />",
    342: "                        <input placeholder=\"비밀번호\" type={showPw ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm(f => ({...f, password: e.target.value}))} className=\"w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-200 font-medium pr-12\" />",
    349: "                    <button onClick={handleLogin} className=\"w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all\">로그인</button>",
    350: "                    {loginError && <p className=\"text-red-500 text-xs font-medium text-center\">{loginError}</p>}",
    356: "                            아직 계정이 없으신가요?{' '}",
    358: "                                회원가입",
    362: "                    <button onClick={() => { setShowLogin(false); setShowSignup(true); }} className=\"w-full text-center text-indigo-600 text-xs font-bold hover:underline cursor-pointer\">또는 회원가입 →</button>",
    375: "                <h2 className=\"text-2xl font-extrabold text-gray-900\">회원가입</h2>",
    376: "                <p className=\"text-gray-400 text-sm\">SpaceMatch와 함께 시작하세요</p>",
    379: "                    <input placeholder=\"이름\" value={signupForm.name} onChange={e => setSignupForm(f => ({...f, name: e.target.value}))} className=\"w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-200 font-medium\" />",
    380: "                    <input placeholder=\"이메일\" type=\"email\" value={signupForm.email} onChange={e => setSignupForm(f => ({...f, email: e.target.value}))} className=\"w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-200 font-medium\" />",
    382: "                        <input placeholder=\"비밀번호\" type={showSignupPw ? 'text' : 'password'} value={signupForm.password} onChange={e => setSignupForm(f => ({...f, password: e.target.value}))} className=\"w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-200 font-medium pr-12\" />",
    386: "                    <input placeholder=\"연락처 (선택)\" value={signupForm.phone} onChange={e => setSignupForm(f => ({...f, phone: e.target.value}))} className=\"w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-200 font-medium\" />",
    387: "                    <label className=\"text-sm font-bold text-gray-700\">역할</label>",
    391: "                            <option value=\"seller\">셀러 (입점 희망)</option>",
    392: "                            <option value=\"vendor\">벤더 (공간 제공)</option>",
    395: "                    <button onClick={handleSignup} className=\"w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all\">가입하기</button>",
    396: "                    {signupError && <p className=\"text-red-500 text-xs font-medium text-center\">{signupError}</p>}",
    397: "                    {signupSuccess && <p className=\"text-emerald-500 text-xs font-medium text-center\">{signupSuccess}</p>}",
    400: "                    이미 계정이 있으신가요?{' '}",
    402: "                        로그인",
});

// ============================================================
// SellerVendorDirectory.jsx
// ============================================================
T += fixFile('pages/seller/SellerVendorDirectory.jsx', {
    9: "    popup: '팝업스토어',",
    10: "    gallery: '갤러리',",
    12: "    showroom: '쇼룸',",
    13: "    fleamarket: '플리마켓',",
    25: "        console.error('벤더 디렉토리 로드 실패:', err);",
    57: "                <h1 className=\"text-2xl md:text-3xl font-extrabold text-gray-900\">벤더 디렉토리</h1>",
    58: "                <p className=\"text-sm text-gray-500\">공간 제공 벤더를 찾아보세요</p>",
    66: "                        placeholder=\"벤더 이름 검색...\"",
    72: "                            필터 & 정렬",
    80: "                        <label className=\"block text-xs font-bold text-gray-500 uppercase mb-2\">공간 유형</label>",
    87: "                            <option value=\"\">전체 유형</option>",
    96: "                        <label className=\"block text-xs font-bold text-gray-500 uppercase mb-2\">지역</label>",
    103: "                            <option value=\"\">전체 지역</option>",
    118: "                        <label className=\"block text-xs font-bold text-gray-500 uppercase mb-2\">정렬</label>",
    124: "                            <option value=\"newest\">최신 가입순</option>",
    125: "                            <option value=\"oldest\">오래된 가입순</option>",
    126: "                            <option value=\"name_asc\">이름순 (가→하)</option>",
    127: "                            <option value=\"name_desc\">이름순 (하→ㄱ)</option>",
    128: "                            <option value=\"venues_desc\">공간 많은순</option>",
    136: "                        <button onClick={() => { setFilterType(''); setFilterRegion(''); setSortBy('newest'); setSearchTerm(''); }} className=\"flex-1 py-2 text-xs text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1\">",
    137: "                            <X size={14} /> 필터 초기화",
    146: "                        총 <span className=\"text-rose-600 font-bold\">{filteredVendors.length}</span>개의 벤더",
    153: "                    <h3 className=\"text-lg font-bold text-gray-400\">검색 결과가 없습니다</h3>",
    154: "                    <p className=\"text-sm text-gray-400 mt-1\">필터 조건을 변경해 보세요</p>",
    209: "                                    가입일: {new Date(vendor.created_at).toLocaleDateString('ko-KR')}",
    220: "                                <p className=\"text-xs font-bold text-violet-500 uppercase tracking-wider mb-2\">등록 공간</p>",
    228: "                                    <p className=\"text-sm text-gray-400 italic mt-2\">등록된 공간이 없습니다</p>",
    234: "                                <p className=\"text-xs font-bold text-gray-500 uppercase tracking-wider mb-2\">연락처 정보</p>",
    239: "                                        <p className=\"text-xs text-gray-400\">이메일</p>",
    246: "                                        <p className=\"text-xs text-gray-400\">연락처</p>",
    255: "                                        <p className=\"text-xs text-gray-400\">인스타그램</p>",
    268: "                                <p className=\"text-xs font-bold text-gray-500 uppercase tracking-wider mb-2\">비즈니스 정보</p>",
    273: "                                        <p className=\"text-xs text-gray-400\">사업자등록번호</p>",
    282: "                                        <p className=\"text-xs text-gray-400\">가입일</p>",
});

// ============================================================
// AdminPromotions.jsx
// ============================================================
T += fixFile('pages/admin/AdminPromotions.jsx', {
    19: "    popup: '팝업스토어', gallery: '갤러리', cafe: '카페',",
    20: "    showroom: '쇼룸', fleamarket: '플리마켓', store: '매장'",
    60: "            console.error('프로모션 데이터 로드 실패:', err);",
    104: "            showToast('필수 항목을 모두 입력해주세요', 'error');",
    118: "                showToast('프로모션이 등록되었습니다!', 'success');",
    123: "            showToast('서버 연결에 실패했습니다.', 'error');",
    129: "            title: '프로모션 삭제',",
    130: "            message: '이 프로모션을 삭제하시겠습니까?',",
    132: "            confirmLabel: '삭제',",
    145: "                        showToast('프로모션이 삭제되었습니다.', 'success');",
    148: "                    showToast('서버 연결에 실패했습니다.', 'error');",
    194: "                    <p className=\"text-sm text-gray-500 mt-1\">베뉴별 상세 정보 또는 한정 모집 영역으로 홍보하고 노출 기간을 관리합니다.</p>",
    201: "                    프로모션 추가",
    209: "                    <p className=\"text-xs text-gray-500 font-medium\">전체 프로모션</p>",
    213: "                    <p className=\"text-xs text-emerald-600 font-medium\">활성</p>",
    224: "                    { value: '', label: '전체' },",
    247: "                        <p className=\"text-gray-400 font-medium\">등록된 프로모션이 없습니다.</p>",
    249: "                            + 새 프로모션 추가하기",
    309: "                                                    {daysLeft <= 0 ? '오늘 만료' : `${daysLeft}일 남음`}",
    317: "                                                title=\"수정\"",
    345: "                                    {editTarget ? '프로모션 수정' : '프로모션 추가'}",
    354: "                                <label className=\"text-sm font-bold text-gray-700 mb-2 block\">베뉴 선택 *</label>",
    360: "                                            placeholder=\"베뉴 검색..\"",
    369: "                                        <p className=\"text-center py-4 text-sm text-gray-400\">선택 가능한 베뉴가 없습니다.</p>",
    389: "                                <label className=\"text-sm font-bold text-gray-700 mb-2 block\">노출 등급 *</label>",
    406: "                                        <label className=\"text-xs font-bold text-teal-700 mb-1.5 block\">카테고리 선택 *</label>",
    427: "                                <label className=\"text-sm font-bold text-gray-700 mb-2 block\">노출 기간 *</label>",
    430: "                                        <label className=\"text-xs text-gray-400 mb-1 block\">시작일</label>",
    468: "                                <label className=\"text-sm font-bold text-gray-700 mb-2 block\">관리자 메모 / 카피라이트</label>",
    477: "                                <p className=\"text-xs text-gray-400 mt-1\">공개 페이지에 표시됩니다 (선택사항)</p>",
    482: "                                <label className=\"text-sm font-bold text-gray-700 mb-2 block\">정렬 순서</label>",
    490: "                                <p className=\"text-xs text-gray-400 mt-1\">낮은 숫자가 먼저 노출됩니다 (0이 최우선)</p>",
    499: "                                    {editTarget ? '수정 완료' : '프로모션 등록'}",
});

// ============================================================
// AdminDashboard.jsx (remaining lines)
// ============================================================
T += fixFile('pages/admin/AdminDashboard.jsx', {
    136: "                    unit=\"건\"",
    143: "                    title=\"누적 매칭 완료\"",
    145: "                    unit=\"건\"",
    171: "                                전체 보기 <ArrowRight size={14} />",
    180: "                                <p className=\"text-gray-900 font-bold\">대기중인 심사가 없습니다.</p>",
    181: "                                <p className=\"text-gray-500 text-sm mt-1\">모든 공간 심사가 완료되었습니다!</p>",
    215: "                                                승인",
    233: "                            <h3 className=\"text-lg font-extrabold text-gray-900\">플랫폼 성장률 (주간)</h3>",
    235: "                                <span className=\"text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded\">신규 접속</span>",
    236: "                                <span className=\"text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded\">신규 신청</span>",
    266: "                            최근 신청 이력",
});

// ============================================================
// AdminCancellations.jsx (remaining lines)
// ============================================================
T += fixFile('pages/admin/AdminCancellations.jsx', {
    121: "                            취소 신청 {isVendor ? '' : '모니터링'}",
    124: "                            {isVendor ? '나의 입점 취소 신청을 확인하고 처리하세요.' : '전체 취소 신청 현황을 모니터링합니다.'}",
    133: "                    { label: '전체', value: stats.total, icon: <MessageSquare size={16} />, gradient: 'from-slate-600 to-slate-800', light: 'bg-slate-50 border-slate-100' },",
    134: "                    { label: '대기중', value: stats.pending, icon: <Clock size={16} />, gradient: 'from-amber-500 to-orange-500', light: 'bg-amber-50 border-amber-100', pulse: stats.pending > 0 },",
    135: "                    { label: '승인됨', value: stats.approved, icon: <CheckCircle size={16} />, gradient: 'from-emerald-500 to-green-600', light: 'bg-emerald-50 border-emerald-100' },",
    183: "                    <p className=\"text-sm text-gray-400 font-medium\">신청 목록을 불러오는 중...</p>",
    238: "                                                {isPending ? '대기' : req.status === 'approved' ? '승인' : '거절'}",
    298: "                                                            {req.status === 'approved' ? '취소 승인됨' : '취소 거절됨'}",
    313: "                                                        <label className=\"text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block\">결정 사유 (선택)</label>",
    317: "                                                            placeholder=\"승인 또는 거절 사유를 입력해주세요...\"",
    329: "                                                            {processing === req.id ? '처리 중...' : '취소 승인'}",
    337: "                                                            {processing === req.id ? '처리 중...' : '취소 거절'}",
});

// ============================================================
// VendorDashboard.jsx (1 remaining line)
// ============================================================
T += fixFile('pages/vendor/VendorDashboard.jsx', {
    355: "                        <p className=\"text-xs font-bold text-emerald-400 mt-1\">승인</p>",
});

// ============================================================
// VendorSellerDirectory.jsx (1 remaining line)
// ============================================================
T += fixFile('pages/vendor/VendorSellerDirectory.jsx', {
    308: "                    총 <span className=\"text-rose-600 font-bold\">{filteredSellers.length}</span>명의 셀러 </p>",
});

console.log(`\n=== FINAL TOTAL: ${T} fixes applied ===`);

/**
 * CommunityPage.jsx 구조 복원 + 나머지 깨진 텍스트 수정
 * VenueDetailModal.jsx, VenueModal.jsx 나머지 수정
 */
const fs = require('fs');
const path = require('path');
const BASE = 'c:/Users/KYUNG005/Desktop/spacematch/src';

let total = 0;

// ============================================================
// 1. CommunityPage.jsx - 구조 복원 + 깨진 텍스트
// ============================================================
{
    const fp = path.join(BASE, 'pages/community/CommunityPage.jsx');
    let c = fs.readFileSync(fp, 'utf8');
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    let n = 0;

    // Fix COMMUNITY_CONFIG - replace entire config block
    const configRegex = /const COMMUNITY_CONFIG = \{[\s\S]*?\n\};/;
    const correctConfig = `const COMMUNITY_CONFIG = {
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
};`;
    if (configRegex.test(c)) {
        c = c.replace(configRegex, correctConfig);
        n++;
        console.log('  ✅ COMMUNITY_CONFIG 구조 복원');
    }

    // Fix DEFAULT_LABELS
    const lines = c.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();

        // DEFAULT_LABELS
        if (t.startsWith("const DEFAULT_LABELS") && t.includes('\uFFFD')) {
            lines[i] = "const DEFAULT_LABELS = ['자유', '질문', '정보공유', '후기', '구인/구직', '정보', '기타'];";
            n++; console.log(`  ✅ L${i + 1}: DEFAULT_LABELS`);
        }

        // Fix misplaced time formatting code (should be inside a function, not at module level)
        if (t === "if (diff < 60) return `${diff}초 전`;" && i < 55) {
            // This line was misplaced from the formatTime function into state declarations
            lines[i] = '    // formatTime function moved below';
            n++; console.log(`  ✅ L${i + 1}: 잘못 배치된 시간 포맷 코드 제거`);
        }

        // Fix remaining corrupted lines by \uFFFD content matching
        if (lines[i].includes('\uFFFD')) {
            // Access denied message
            if (t.includes('setAccessDenied') && t.includes('message')) {
                lines[i] = lines[i].replace(/data\.message \|\| '.*?'/, "data.message || '이 커뮤니티에 접근 권한이 없습니다.'");
                n++;
            }
            // Delete post confirm
            if (t.includes("title: '게시") && t.includes('\uFFFD')) {
                lines[i] = lines[i].replace(/title:.*$/, "title: '게시글 삭제',");
                n++;
            }
            // confirmLabel
            if (t.includes("confirmLabel: '") && t.includes('\uFFFD')) {
                lines[i] = lines[i].replace(/confirmLabel:.*$/, "confirmLabel: '삭제',");
                n++;
            }
            // Delete comment
            if (t.includes("title: '") && t.includes('\uFFFD') && t.includes("삭")) {
                lines[i] = lines[i].replace(/title:.*$/, "title: '댓글 삭제',");
                n++;
            }
            if (t.includes("message: '") && t.includes('\uFFFD') && t.includes("겠습")) {
                lines[i] = lines[i].replace(/message:.*$/, "message: '이 댓글을 삭제하시겠습니까?',");
                n++;
            }

            // 닫기
            if (t === '닫기' || (t.includes('닫기') && t.length < 10 && t.includes('\uFFFD'))) {
                // skip - already fixed
            }

            // UI labels
            if (t.includes("'인기 글'") || (t.includes('인기') && t.includes('\uFFFD') && t.includes('h2'))) {
                lines[i] = lines[i].replace(/인기 \uFFFD+/, '인기 글');
                n++;
            }

            // 게시글 작성 form
            if (t.includes('게시 글') && t.includes('\uFFFD') && t.includes('성')) {
                lines[i] = lines[i].replace(/게시 ?\uFFFD*성/, '게시글 작성');
                n++;
            }
            if (t.includes('벨 ') && t.includes('\uFFFD') && t.includes('택')) {
                lines[i] = lines[i].replace(/\uFFFD*벨 \uFFFD*택/, '라벨 선택');
                n++;
            }
            if (t.includes('목을') && t.includes('\uFFFD') && t.includes('력')) {
                lines[i] = lines[i].replace(/\uFFFD*목.*력.*\uFFFD*/, '제목을 입력하세요');
                n++;
            }
            if (t.includes('워드') && t.includes('\uFFFD') && t.includes('택사항')) {
                lines[i] = lines[i].replace(/\uFFFD*워.*택사항\)/, '키워드 (선택사항)');
                n++;
            }
            if (t.includes('콤마') && t.includes('\uFFFD') && t.includes('구분')) {
                lines[i] = lines[i].replace(/콤마.*\uFFFD*력/, '콤마(,) 또는 해시태그(#)로 구분하여 입력');
                n++;
            }
            if (t.includes("'진 첨") || (t.includes('진 첨') && t.includes('\uFFFD'))) {
                lines[i] = lines[i].replace(/\uFFFD*진 첨.*\d+\uFFFD*/, '사진 첨부 (최대 10장)');
                n++;
            }
            if (t.includes("submitting ? '") && t.includes('\uFFFD')) {
                lines[i] = lines[i].replace(/submitting \? '.*' : '.*'/, "submitting ? '등록 중..' : '게시하기'");
                n++;
            }
            if (t.includes('근 권한') && t.includes('\uFFFD')) {
                lines[i] = lines[i].replace(/\uFFFD*근 권한.*\uFFFD+/, '접근 권한이 없습니다');
                n++;
            }
            if (t.includes('아가기') || (t.includes('아가') && t.includes('\uFFFD'))) {
                lines[i] = lines[i].replace(/\uFFFD*아.*기\uFFFD*/, '돌아가기');
                n++;
            }
            if (t.includes('직 게시') && t.includes('\uFFFD')) {
                lines[i] = lines[i].replace(/\uFFFD*직 게시.*\uFFFD+/, '아직 게시글이 없습니다.');
                n++;
            }
        }
    }
    c = lines.join(le);

    // Simple string replacements for remaining patterns
    const simpleReplacements = [
        ['더보기', '더보기'],
        ['체', '전체'],
    ];

    fs.writeFileSync(fp, c, 'utf8');

    const remaining = c.split(/\r?\n/).filter(l => l.includes('\uFFFD')).length;
    console.log(`CommunityPage: ${n} fixes, ${remaining} lines still corrupted`);
    total += n;
}

// ============================================================
// 2. VenueDetailModal.jsx - 나머지 29줄
// ============================================================
{
    const fp = path.join(BASE, 'components/VenueDetailModal.jsx');
    let c = fs.readFileSync(fp, 'utf8');
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    const lines = c.split(/\r?\n/);
    let n = 0;

    for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();
        if (!lines[i].includes('\uFFFD')) continue;

        // Price unit / location / type info spans
        if (t.includes('text-[11px]') && t.includes('지역')) {
            lines[i] = lines[i].replace(/text-[^"]*">[^<]*/g, (m) => m.replace(/\uFFFD+/g, ''));
            n++;
        }
        if (t.includes('금 ') && t.includes('위')) {
            lines[i] = lines[i].replace(/금 \uFFFD*위/, '가격 단위');
            n++;
        }
        if (t.includes("'daily'") && t.includes("'주간'") || t.includes("'일간'")) {
            lines[i] = lines[i].replace(/\uFFFD*간/, '일간').replace(/\uFFFD/g, '');
            n++;
        }
        if (t.includes('매출') && t.includes('카테고리') && t.includes('보')) {
            lines[i] = lines[i].replace(/매출.*보/, '매출 & 카테고리 정보');
            n++;
        }
        if (t.includes('균 매출')) {
            lines[i] = lines[i].replace(/\uFFFD*균 매출/, '평균 매출');
            n++;
        }
        if (t.includes('리 ') && t.includes('카테고리')) {
            lines[i] = lines[i].replace(/\uFFFD*리\uFFFD*\s*카테고리/, '인기 카테고리');
            n++;
        }
        if (t.includes('정 ') && t.includes('보') && t.includes('font-bold') && !t.includes('가격')) {
            lines[i] = lines[i].replace(/\uFFFD*정 \uFFFD*보/, '일정 정보');
            n++;
        }
        if (t.includes('작') && t.includes('text-[10px]') && t.includes('gray-500"')) {
            lines[i] = lines[i].replace(/\uFFFD*작/, '시작');
            n++;
        }
        if (t.includes('모집 기간') && t.includes('정 ') && t.includes('않')) {
            lines[i] = lines[i].replace(/모집 기간.*$/, '모집 기간이 설정되지 않았습니다</p>');
            n++;
        }
        if (t.includes('사 기간') && !t.includes('설정')) {
            // event period labels
            if (t.includes('{periods.length')) {
                lines[i] = lines[i].replace(/사 기간 \$\{idx \+ 1\}.*사 기간/, '행사 기간 ${idx + 1}` : \'행사 기간');
                n++;
            } else if (t.includes('font-bold text-purple')) {
                lines[i] = lines[i].replace(/사 기간/, '행사 기간');
                n++;
            } else if (t.includes('정 ') && t.includes('않')) {
                lines[i] = lines[i].replace(/사 기간.*$/, '행사 기간이 설정되지 않았습니다</p>');
                n++;
            } else {
                lines[i] = lines[i].replace(/\uFFFD*사 기간/, '행사 기간');
                n++;
            }
        }
        if (t.includes('모집') && t.includes('황')) {
            lines[i] = lines[i].replace(/모집 \uFFFD*황/, '모집 현황');
            n++;
        }
        if (t.includes('} / {maxSellers}')) {
            lines[i] = lines[i].replace(/\{maxSellers\}\uFFFD*/, '{maxSellers}명');
            n++;
        }
        if (t.includes('공간 ') && t.includes('개') && t.includes('h3')) {
            lines[i] = lines[i].replace(/공간 \uFFFD*개/, '공간 소개');
            n++;
        }
        if (t.includes('공간') && t.includes('설명') && t.includes('없')) {
            lines[i] = lines[i].replace(/\uFFFD*공간.*습.*다\.?/, '이 공간에 대한 자세한 설명이 없습니다.');
            n++;
        }
        if (t.includes('치') && t.length < 20 && !t.includes('{')) {
            lines[i] = lines[i].replace(/\uFFFD*치/, '위치');
            n++;
        }
        // Share modal
        if (t.includes('공유') && t.includes('기') && t.includes('title=')) {
            lines[i] = lines[i].replace(/공유\uFFFD*기/, '공유하기');
            n++;
        }
        if (t.includes('공유') && t.includes('기') && t.includes('font-bold')) {
            lines[i] = lines[i].replace(/공유\uFFFD*기/, '공유하기');
            n++;
        }
        if (t.includes('복사') && t.includes('료')) {
            lines[i] = lines[i].replace(/복사 \uFFFD*료/, '복사 완료');
            n++;
        }
        if (t.includes('URL') && t.includes('립보드')) {
            lines[i] = lines[i].replace(/URL\uFFFD*립보드\uFFFD*복사\uFFFD*니/, 'URL이 클립보드로 복사됩니다');
            n++;
        }
        if (t.includes('카카') && t.includes('톡') && t.includes('font-bold')) {
            lines[i] = lines[i].replace(/카카\uFFFD*톡/, '카카오톡');
            n++;
        }
        if (t.includes('카카') && t.includes('톡') && t.includes('로 공유')) {
            lines[i] = lines[i].replace(/카카\uFFFD*톡\uFFFD*로 공유\uFFFD*니/, '카카오톡으로 공유합니다');
            n++;
        }
        if (t.includes('른 ') && t.includes('으로') && t.includes('공유') && t.includes('font-bold')) {
            lines[i] = lines[i].replace(/\uFFFD*른 \uFFFD*으.*공유/, '다른 앱으로 공유');
            n++;
        }
        if (t.includes('스템') && t.includes('공유 메뉴')) {
            lines[i] = lines[i].replace(/\uFFFD*스.*메뉴\uFFFD*\uFFFD*니/, '시스템 공유 메뉴를 엽니다');
            n++;
        }
        // Vendor notice
        if (t.includes('벤더 계정') && t.includes('청 불')) {
            lines[i] = lines[i].replace(/벤더 계정\uFFFD*\s*\uFFFD*청 불\uFFFD*/, '벤더 계정은 신청 불가');
            n++;
        }
        // Apply status
        if (t.includes('청 ') && t.includes('료') && t.includes('<span>')) {
            lines[i] = lines[i].replace(/\uFFFD*청 \uFFFD*료/, '신청 완료');
            n++;
        }
    }
    c = lines.join(le);
    fs.writeFileSync(fp, c, 'utf8');

    const remaining = c.split(/\r?\n/).filter(l => l.includes('\uFFFD')).length;
    console.log(`VenueDetailModal: ${n} fixes, ${remaining} lines still corrupted`);
    total += n;
}

// ============================================================
// 3. VenueModal.jsx - 나머지 17줄
// ============================================================
{
    const fp = path.join(BASE, 'components/VenueModal.jsx');
    let c = fs.readFileSync(fp, 'utf8');
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    const lines = c.split(/\r?\n/);
    let n = 0;

    for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();
        if (!lines[i].includes('\uFFFD')) continue;

        // Comments
        if (t.includes('/* 모집 기간') && t.includes('\uFFFD')) {
            lines[i] = lines[i].replace(/\/\*.*\*\//, '/* 모집 기간 설정 */');
            n++;
        }
        if (t.includes('/* 행사 기간') || (t.includes('사 기간') && t.includes('/*'))) {
            lines[i] = lines[i].replace(/\/\*.*\*\//, '/* 행사 기간 설정 */');
            n++;
        }
        // Labels
        if (t.includes('모집 인원') || (t.includes('모집') && t.includes('원') && t.includes('label'))) {
            lines[i] = lines[i].replace(/모집 \uFFFD*원 \uFFFD*정/, '모집 인원 설정');
            n++;
        }
        if (t.includes('공간') && t.includes('점') && t.includes('한 최')) {
            lines[i] = lines[i].replace(/\uFFFD*공간.*입.*다\./, '이 공간에 입점할 수 있는 최대 셀러 수를 설정하세요. 0은 무제한입니다.');
            n++;
        }
        if (t.includes('/* 평균 매출') || (t.includes('균 매출') && t.includes('/*'))) {
            lines[i] = lines[i].replace(/\/\*.*\*\//, '/* 평균 매출 & 인기 카테고리 */');
            n++;
        }
        if (t.includes('균 매출') && t.includes('label')) {
            lines[i] = lines[i].replace(/\uFFFD*균 매출.*\)/, '평균 매출 (선택)');
            n++;
        }
        if (t.includes('공간') && t.includes('상') && t.includes('균 매출')) {
            lines[i] = lines[i].replace(/\uFFFD*공간.*\uFFFD*/, '이 공간에서 예상되는 평균 매출을 입력하세요');
            n++;
        }
        if (t.includes('리 카테고리') && t.includes('/*')) {
            lines[i] = lines[i].replace(/\/\*.*\*\//, '/* 인기 카테고리 */');
            n++;
        }
        if (t.includes('리 카테고리') && t.includes('label')) {
            lines[i] = lines[i].replace(/\uFFFD*리\uFFFD*\s*카테고리.*\)/, '인기 카테고리 (선택)');
            n++;
        }
        // Description label
        if (t.includes('공간 ') && t.includes('개') && t.includes('label') && t.includes('block')) {
            lines[i] = lines[i].replace(/공간 \uFFFD*개/, '공간 소개');
            n++;
        }
        // Image label with gallery text
        if (t.includes("'갤러") && t.includes('label')) {
            lines[i] = lines[i].replace(/'.*갤러\uFFFD*/, "'공간 이미지 갤러리'");
            n++;
        }
        if (t.includes('번째') && t.includes('사진') || (t.includes('번째') && t.includes('\uFFFD'))) {
            lines[i] = lines[i].replace(/\uFFFD*번째.*요\./, '첫 번째 사진이 대표 이미지로 사용됩니다. 드래그로 순서를 변경하세요.');
            n++;
        }
        // Image reorder buttons
        if (t.includes('title=') && t.includes('으로') && t.includes('\uFFFD')) {
            if (t.includes('위')) {
                lines[i] = lines[i].replace(/title=".*"/, 'title="위로"');
            } else {
                lines[i] = lines[i].replace(/title=".*"/, 'title="아래로"');
            }
            n++;
        }
        if (t.includes('추가') || (t.includes('추') && t.includes('\uFFFD') && t.includes('font-bold'))) {
            lines[i] = lines[i].replace(/추\uFFFD*/, '추가');
            n++;
        }
        // Submit button
        if (t.includes('정 완료') || t.includes('복제 등록') || (t.includes('venue ?') && t.includes('\uFFFD'))) {
            if (t.includes('venue ?') && t.includes('CheckCircle2')) {
                lines[i] = lines[i].replace(/\uFFFD*정 \uFFFD*료/, '수정 완료').replace(/복제 \uFFFD*록/, '복제 등록');
                n++;
            }
        }
    }
    c = lines.join(le);
    fs.writeFileSync(fp, c, 'utf8');

    const remaining = c.split(/\r?\n/).filter(l => l.includes('\uFFFD')).length;
    console.log(`VenueModal: ${n} fixes, ${remaining} lines still corrupted`);
    total += n;
}

// Final count
console.log(`\n총 ${total}줄 수정`);

function countAll(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let count = 0;
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) count += countAll(full);
        else if (e.name.endsWith('.jsx') || e.name.endsWith('.js')) {
            const content = fs.readFileSync(full, 'utf8');
            const fc = content.split('\n').filter(l => l.includes('\uFFFD')).length;
            if (fc > 0) {
                console.log(`  ${path.relative(BASE, full)}: ${fc}줄`);
                count += fc;
            }
        }
    }
    return count;
}
console.log('남은 깨진 줄:');
const rem = countAll(BASE);
console.log(`총 잔여: ${rem}줄`);

/**
 * ============ 최종 종합 구조 복원 스크립트 ============
 * VenueModal.jsx — 이벤트 기간, 최대 셀러, 매출/카테고리, 設명, 이미지, 하단 버튼
 * VenueDetailModal.jsx — 나머지 깨진 텍스트
 * CommunityPage.jsx — 나머지 깨진 텍스트 + 구조
 */
const fs = require('fs');
const BASE = 'c:/Users/KYUNG005/Desktop/spacematch/src';

// ===== VenueModal.jsx =====
{
    const fp = `${BASE}/components/VenueModal.jsx`;
    let c = fs.readFileSync(fp, 'utf8');
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    let lines = c.split(/\r?\n/);

    // --- Fix 1: Event period section (lines ~583-606) ---
    // Find label "설명" that's misplaced after event start input
    for (let i = 0; i < lines.length; i++) {
        // The start input ends with />, then there's a misplaced label
        if (lines[i].trim() === '/>' && i + 1 < lines.length && lines[i + 1].includes('label') && lines[i + 1].includes('설명')) {
            // Remove the misplaced "설명" label  
            lines.splice(i + 1, 1);
            console.log(`  ✅ 1a: 잘못 삽입된 "설명" label 제거 (L${i + 2})`);
            break;
        }
    }

    // Fix missing /> for event end date input (has <label instead of />)
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('focus:border-purple-500') && lines[i].includes('font-medium') &&
            i + 1 < lines.length && lines[i + 1].includes('<label') && lines[i + 1].includes('최대 셀러')) {
            // Replace the label line with />
            lines[i + 1] = lines[i].replace(/.*/, '                                                    />');
            console.log(`  ✅ 1b: event end input에 /> 복원 (L${i + 2})`);
            break;
        }
    }

    // --- Fix 2: Max Sellers section (lines ~608-626) ---
    // Find the "Max Sellers" comment and replace the entire section
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Max Sellers')) {
            // Find the end of this section (next section comment or closing div)
            let end = -1;
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].includes('평균 매출 & 인기 카테고리')) {
                    end = j;
                    break;
                }
            }
            if (end >= 0) {
                const replacement = [
                    '                            {/* Max Sellers */}',
                    '                            <div className="col-span-2 bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">',
                    '                                <div className="flex items-center gap-2 mb-3">',
                    '                                    <Users size={16} className="text-emerald-600" />',
                    '                                    <label className="text-sm font-bold text-emerald-800">모집 인원 설정</label>',
                    '                                </div>',
                    '                                <div className="flex items-center gap-3">',
                    '                                    <input',
                    '                                        type="number"',
                    '                                        name="max_sellers"',
                    '                                        value={formData.max_sellers}',
                    '                                        onChange={handleFormChange}',
                    '                                        placeholder="0 (무제한)"',
                    '                                        className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-emerald-500 rounded-xl outline-none transition-all font-bold text-gray-800 focus:ring-4 focus:ring-emerald-500/10"',
                    '                                    />',
                    '                                </div>',
                    '                                <p className="mt-2 text-xs text-gray-500">이 공간에 입점할 수 있는 최대 셀러 수를 설정하세요. 0은 무제한입니다.</p>',
                    '                            </div>',
                    '                        </div>',
                    '',
                ];
                lines.splice(i, end - i, ...replacement);
                console.log(`  ✅ 2: Max Sellers 섹션 재구성`);
            }
            break;
        }
    }

    // --- Fix 3: 평균매출/인기카테고리 섹션 ---
    // Fix avg sales label
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('평균 매출 (선택)') && lines[i].includes('amber-800')) {
            lines[i] = lines[i].replace(/\?평균/, '평균');
        }
        // Fix avg sales placeholder
        if (lines[i].includes('500만원') && lines[i].includes('50만원')) {
            lines[i] = lines[i].replace(/"\?500만원, \?\?50만원"/g, '"예: 500만원, 약 50만원"');
        }
        // Fix avg sales help text (missing closing </p>)
        if (lines[i].includes('평균 매출을 입력하세요') && !lines[i].includes('</p>')) {
            lines[i] = lines[i].replace(/입력하세요$/, '입력하세요</p>');
        }
        // Fix label for popular categories section header
        if (lines[i].includes('공간 이미지') && lines[i].includes('label') && i + 2 < lines.length && lines[i + 1].includes('Tag size')) {
            // This is the misplaced "공간 이미지" label — should be "인기 카테고리"
            lines[i] = lines[i].replace('공간 이미지', '인기 카테고리');
            // Fix the next line which has the corrupted label 
            if (lines[i + 2].includes('카테고리') && lines[i + 2].includes('\uFFFD')) {
                lines[i + 2] = lines[i + 2].replace(/\uFFFD+리\uFFFD*\uFFFD* ?카테고리 \(\uFFFD*택\)/g, '인기 카테고리 (선택)');
            }
            // Restructure: label -> div with icon and label
            const indent = '                                ';
            lines.splice(i, 3,
                `${indent}<div className="flex items-center gap-2 mb-3">`,
                `${indent}    <Tag size={16} className="text-teal-600" />`,
                `${indent}    <label className="text-sm font-bold text-teal-800">인기 카테고리 (선택)</label>`,
                `${indent}</div>`
            );
            console.log(`  ✅ 3: 인기 카테고리 헤더 복원`);
        }
    }

    // --- Fix 4: Custom category chip — misplaced submit button text ---
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('{c} <X size') && i + 1 < lines.length && lines[i + 1].includes('수정 완료')) {
            // Line with {c} <X size={10} /> should end with </button>
            lines[i] = lines[i].replace(/{c} <X size=\{10\} \/>/, '{c} <X size={10} />');
            // Replace the misplaced submit text with proper closing
            lines[i + 1] = '                                        </button>';
            console.log(`  ✅ 4: 카테고리 칩 내 잘못된 submit 텍스트 제거`);
        }
    }

    // --- Fix 5: Description label ---
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('공간') && lines[i].includes('개') && lines[i].includes('label') && lines[i].includes('\uFFFD')) {
            lines[i] = lines[i].replace(/공간 \uFFFD*개/g, '공간 소개');
        }
    }

    // --- Fix 6: Images label ---
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("'공간 이미지 갤러리'") && lines[i].includes('\uFFFD')) {
            lines[i] = lines[i].replace(/\?\u0027공간 이미지 갤러리\u0027/g, '공간 이미지 갤러리');
            lines[i] = lines[i].replace(/\uFFFD*\'공간 이미지 갤러리\'/g, '공간 이미지 갤러리');
            // already handled above
        }
        if (lines[i].includes('첫 번째 사진') && lines[i].includes('\uFFFD')) {
            lines[i] = lines[i].replace(/\uFFFD*첫/g, '첫').replace(/\uFFFD+/g, '');
        }
    }

    // --- Fix 7: Image badge "대표" ---
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '????') {
            lines[i] = lines[i].replace('????', '대표');
        }
    }

    // --- Fix 8: Move button titles ---
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('title="아래로"') && lines[i - 5]?.includes('prevImage') === false && lines[i - 3]?.includes('moveImage(idx, -1)')) {
            lines[i] = lines[i].replace('title="아래로"', 'title="위로"');
            console.log(`  ✅ 8: 이미지 위로 title 수정`);
        }
        if (lines[i].includes('title="') && lines[i].includes('\uFFFD') && lines[i].includes('로"')) {
            if (lines[i - 2]?.includes('moveImage(idx, 1)')) {
                lines[i] = lines[i].replace(/title="[^"]*"/, 'title="아래로"');
            } else if (lines[i - 2]?.includes('moveImage(idx, -1)')) {
                lines[i] = lines[i].replace(/title="[^"]*"/, 'title="위로"');
            }
        }
    }

    // --- Fix 9: 추가 button text ---
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('추가') && lines[i].includes('\uFFFD')) {
            lines[i] = lines[i].replace(/추가\uFFFD*/g, '추가');
        }
    }

    // --- Fix 10: Delete button text ---
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('? </button>') && lines[i - 5]?.includes('Trash2')) {
            lines[i] = lines[i].replace('? </button>', '삭제</button>');
            console.log(`  ✅ 10: 삭제 버튼 텍스트 복원`);
        }
    }

    // --- Fix 11: Submit button line ---
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('CheckCircle2') && lines[i].includes('수정') && lines[i].includes('\uFFFD')) {
            lines[i] = '                            {venue ? <><CheckCircle2 size={18} /> 수정 완료</> : isDuplicateMode ? <><Plus size={18} /> 복제 등록</> : <><Plus size={18} /> 베뉴 등록</>}';
            console.log(`  ✅ 11: Submit 버튼 텍스트 복원`);
        }
    }

    // --- Final: Remove remaining \uFFFD from all lines ---
    c = lines.join(le);
    // Common patterns
    c = c.replace(/\?\?이 공간/g, '이 공간');
    c = c.replace(/\?\?인기 카테고리/g, '인기 카테고리');

    fs.writeFileSync(fp, c, 'utf8');
    const rem1 = c.split(/\r?\n/).filter(l => l.includes('\uFFFD')).length;
    console.log(`VenueModal: ${rem1} lines still broken`);
}

// ===== VenueDetailModal.jsx — remaining text fixes =====
{
    const fp = `${BASE}/components/VenueDetailModal.jsx`;
    let c = fs.readFileSync(fp, 'utf8');

    // Fix specific broken text patterns
    c = c.replace(/공유\uFFFD*기/g, '공유하기');
    c = c.replace(/복사 \uFFFD*료!/g, '복사 완료!');
    c = c.replace(/URL\uFFFD*\uFFFD*립보드\uFFFD*\uFFFD*복사\uFFFD*니\uFFFD*/g, 'URL이 클립보드에 복사됩니다');
    c = c.replace(/카카\uFFFD*톡/g, '카카오톡');
    c = c.replace(/카카오톡\uFFFD*로 공유\uFFFD*니\uFFFD*/g, '카카오톡으로 공유합니다');
    c = c.replace(/\uFFFD*른 \uFFFD*으\uFFFD*\uFFFD* ?공유/g, '다른 앱으로 공유');
    c = c.replace(/\uFFFD*스\uFFFD*\uFFFD* ?공유 메뉴\uFFFD*\uFFFD*\uFFFD*니\uFFFD*/g, '시스템 공유 메뉴를 엽니다');
    c = c.replace(/벤더 계정\uFFFD*\uFFFD* ?\uFFFD*청 불\uFFFD*/g, '벤더 계정은 신청 불가');
    c = c.replace(/<span>\uFFFD*청 \uFFFD*료<\/span>/g, '<span>신청 완료</span>');
    c = c.replace(/공간 \uFFFD*개/g, '공간 소개');
    c = c.replace(/\uFFFD*\uFFFD*공간\uFFFD*\uFFFD*\uFFFD*\uFFFD*\uFFFD*\uFFFD*세\uFFFD*\uFFFD*명\uFFFD*\uFFFD*습\uFFFD*다\./g, '이 공간에 대한 자세한 설명이 없습니다.');
    c = c.replace(/\uFFFD*위치/g, '위치');
    c = c.replace(/모집 \uFFFD*황/g, '모집 현황');
    c = c.replace(/\{maxSellers\}명\uFFFD*/g, '{maxSellers}명');

    fs.writeFileSync(fp, c, 'utf8');
    const rem2 = c.split(/\r?\n/).filter(l => l.includes('\uFFFD')).length;
    console.log(`VenueDetailModal: ${rem2} lines still broken`);
}

// ===== CommunityPage.jsx — find and show remaining issues =====
{
    const fp = `${BASE}/pages/community/CommunityPage.jsx`;
    let c = fs.readFileSync(fp, 'utf8');
    const rem = c.split(/\r?\n/).filter(l => l.includes('\uFFFD'));
    console.log(`CommunityPage: ${rem.length} lines still broken`);
    rem.slice(0, 5).forEach((l, i) => {
        const idx = c.split(/\r?\n/).indexOf(l);
        console.log(`  L${idx + 1}: ${l.trim().substring(0, 80)}`);
    });
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
    console.log('\n빌드 결과:');
    errors.forEach(e => console.log('  ', e.trim()));
}

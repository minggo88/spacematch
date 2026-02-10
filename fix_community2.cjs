/**
 * CommunityPage.jsx 구조적 오류 수정 스크립트
 * 잘못 삽입된 줄을 제거하고 누락된 구조를 복원
 */
const fs = require('fs');
const fp = 'c:/Users/KYUNG005/Desktop/spacematch/src/pages/community/CommunityPage.jsx';
let c = fs.readFileSync(fp, 'utf8');
const le = c.includes('\r\n') ? '\r\n' : '\n';
let lines = c.split(/\r?\n/);
let fixes = 0;

// === 1. Fix goToPopularPost — remove JSX on line 612, add closing } and }; ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('setExpandedPost(postId)') && i + 1 < lines.length && lines[i + 1].includes('아직 게시글이 없습니다')) {
        // replace the JSX h3 with proper closing
        lines[i + 1] = '    };';
        fixes++;
        console.log(`  ✅ goToPopularPost 함수 닫기 (L${i + 2})`);
        break;
    }
}

// === 2. Fix openUserProfile — remove JSX scattered inside it ===
// Pattern: function code line followed by JSX, then more function code
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('setProfileLoading(true)') && i + 1 < lines.length && lines[i + 1].includes('첫 게시글을 작성해 주세요')) {
        // remove the JSX line
        lines.splice(i + 1, 1);
        fixes++;
        console.log(`  ✅ openUserProfile 내 JSX <p> 제거 (L${i + 2})`);
        break;
    }
}

// === 3. Fix openUserProfile continued — find fetch and fix it ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('get_public_profile.php') && i + 1 < lines.length) {
        // Check if the next lines are proper
        // profileData success check should end the function with setProfileLoading(false)
        let foundClosingBrace = false;
        for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
            if (lines[j].includes('setProfileData(data)') && j + 2 < lines.length) {
                // Check if function closes properly
                if (lines[j + 1].trim() === '}') {
                    // Need to add setProfileLoading(false), catch, and closing
                    // Check what comes after
                    let nextCode = j + 2;
                    // Check if there's JSX injected 
                    if (lines[nextCode]?.includes('{') && lines[nextCode]?.includes('post.category')) {
                        // Remove JSX lines until we find function logic
                        let removeEnd = nextCode;
                        while (removeEnd < lines.length && !lines[removeEnd].includes('return (')) {
                            removeEnd++;
                        }
                        // Replace with proper function closure
                        const closure = [
                            '        } catch (err) {',
                            '            console.error(err);',
                            '        } finally {',
                            '            setProfileLoading(false);',
                            '        }',
                            '    };',
                            '',
                        ];
                        lines.splice(nextCode, removeEnd - nextCode, ...closure);
                        fixes++;
                        console.log(`  ✅ openUserProfile 함수 정상 종료 + 사이 JSX 제거 (L${nextCode + 1}-${removeEnd})`);
                    }
                    break;
                }
            }
        }
        break;
    }
}

// === 4. Rebuild return ( with proper indentation ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i] === 'return (' || lines[i].trim() === 'return (') {
        lines[i] = '    return (';
        fixes++;
        console.log(`  ✅ return ( 들여쓰기 복원 (L${i + 1})`);
        break;
    }
}

// === 5. Fix Header section — remove misplaced code inside it ===
// Line with "더보기" text inside header
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '더보기' && i > 600 && i - 1 >= 0 && lines[i - 1].includes('<div>')) {
        // This "더보기" is misplaced inside header; should be some JSX
        lines.splice(i - 1, 2);  // Remove <div> and 더보기
        fixes++;
        console.log(`  ✅ Header 내 잘못된 "더보기" 제거 (L${i})`);
        break;
    }
}

// === 6. Fix "쓰기" button text ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('기') && lines[i].includes('\uFFFD') && lines[i - 1]?.includes('PenLine')) {
        lines[i] = lines[i].replace(/\uFFFD+\uFFFD*기/, '글쓰기');
        fixes++;
    }
}

// === 7. Fix "전체" button text ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('\uFFFD') && lines[i].trim().endsWith('체') && lines[i - 1]?.includes('>')) {
        lines[i] = lines[i].replace(/\uFFFD+체/, '전체');
        fixes++;
    }
}

// === 8. Fix Popular Posts section header ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Popular Posts Section') && lines[i].includes('\uFFFD')) {
        lines[i] = lines[i].replace(/\{\/\* .*Popular Posts Section.*\*\/\s*\}/, '{/* Popular Posts Section */}');
        fixes++;
    }
    if (lines[i].includes('기 ') && lines[i].includes('h2') && lines[i].includes('\uFFFD')) {
        lines[i] = lines[i].replace(/\uFFFD*기 \uFFFD*/, '인기 글');
        fixes++;
    }
}

// === 9. Fix misplaced JSX inside left arrow button ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('scrollBy') && lines[i].includes('left: -260') && i + 2 < lines.length) {
        // Next line should be class, then > then just <ChevronLeft>
        // But there's a misplaced button with Heart/likes injected
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            if (lines[j].includes('<button') && lines[j].includes('Heart') && lines[j].includes('post.likedByMe')) {
                // Replace this misplaced line with proper <ChevronLeft>
                lines[j] = '                    <ChevronLeft size={18} />';
                fixes++;
                console.log(`  ✅ Left arrow 버튼 내 잘못된 Heart/likes 버튼 제거 (L${j + 1})`);
                break;
            }
        }
    }
}

// === 10. Fix misplaced "좋아요" span inside onMouseMove ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('좋아요') && lines[i].includes('span') && lines[i].includes('post.likes') &&
        lines[i - 1]?.includes('e.preventDefault')) {
        // This is dx calculation, replace with correct code
        lines[i] = '                        const dx = e.clientX - dragStartX;';
        fixes++;
        console.log(`  ✅ onMouseMove dx 계산 복원 (L${i + 1})`);
    }
}

// === 11. Fix popular post card — remove misplaced post content ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('group/card') && i + 1 < lines.length && lines[i + 1].includes('post.content')) {
        // Remove misplaced post.content line
        lines.splice(i + 1, 1);
        fixes++;
        console.log(`  ✅ 인기글 카드 내 잘못된 post.content 제거 (L${i + 2})`);
        break;
    }
}

// === 12. Fix popular post label section — remove "수정" text ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '수정' && lines[i - 1]?.includes('pp.label')) {
        // This "수정" is misplaced; should be closing )}<br>
        lines[i] = '                                        )}';
        fixes++;
        console.log(`  ✅ 인기글 label 내 잘못된 "수정" 제거 (L${i + 1})`);
        break;
    }
}

// === 13. Fix popular post — remove "삭제" text ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '삭제' && lines[i - 1]?.includes('pp.like_count') &&
        i + 1 < lines.length && lines[i + 1].includes('MessageCircle')) {
        // Missing <span> wrapper for comment count
        lines[i] = '                                            <span className="flex items-center gap-0.5">';
        fixes++;
        console.log(`  ✅ 인기글 카드 댓글 카운트 <span> 복원 (L${i + 1})`);
        break;
    }
}

// === 14/15. Fix write form — remove misplaced post card code from form fields ===
// Write form h3 text
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('게시글 작성') && lines[i].includes('??')) {
        lines[i] = lines[i].replace(/\?\?게시글 작성/, '게시글 작성');
        fixes++;
    }
}

// Fix "label selection" — has post.user_name injected
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('post.user_name') && lines[i].includes('h3') && lines[i - 1]?.includes('Label Selection')) {
        lines.splice(i, 1);
        fixes++;
        console.log(`  ✅ Label Selection 에 잘못 삽입된 post.user_name h3 제거 (L${i + 1})`);
        break;
    }
}

// Fix label select text
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('벨') && lines[i].includes('\uFFFD') && lines[i].includes('택') && lines[i].includes('label')) {
        lines[i] = lines[i].replace(/\uFFFD*벨 \uFFFD*택/, '라벨 선택');
        fixes++;
    }
}

// Fix label button — has post.user_role code injected
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('DEFAULT_LABELS.map') && i + 1 < lines.length && lines[i + 1].includes('post.user_role')) {
        // This line and the next few lines are a mess. Replace with proper button JSX
        let endJunk = i + 1;
        while (endJunk < lines.length && !lines[endJunk].includes('</button>') && endJunk < i + 15) {
            endJunk++;
        }
        // Replace with proper label button
        const replacement = [
            '                        {DEFAULT_LABELS.map(lbl => (',
            '                            <button',
            '                                key={lbl}',
            '                                type="button"',
            '                                onClick={() => setNewPost(p => ({...p, label: p.label === lbl ? \'\' : lbl }))}',
            '                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${\u200B',
            '                                    newPost.label === lbl',
            '                                    ? config.labelActiveColor + \' shadow-sm scale-105\'',
            '                                    : \'bg-white text-gray-600 border-gray-200 hover:border-gray-300\'',
            '                                }`}',
            '                            >',
            '                                {lbl}',
            '                            </button>',
            '                        ))}',
        ];
        lines.splice(i, endJunk - i, ...replacement);
        fixes++;
        console.log(`  ✅ Label 버튼 목록 재구성 (L${i + 1}-${endJunk + 1})`);
        break;
    }
}

// === 16. Fix title input — remove misplaced code ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<input') && i + 1 < lines.length && lines[i + 1].trim() === '확인') {
        // Rebuild this input properly
        let endJunk = i + 1;
        while (endJunk < lines.length && !lines[endJunk].includes('ref={contentTextareaRef}')) {
            endJunk++;
        }
        // Replace with proper title input + content textarea start
        const replacement = [
            '                        <input',
            '                            type="text"',
            '                            placeholder="제목을 입력하세요"',
            '                            value={newPost.title}',
            '                            onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}',
            '                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-sm"',
            '                        />',
            '                        {/* Content */}',
            '                        <div className="relative">',
            '                            <textarea',
        ];
        lines.splice(i, endJunk - i, ...replacement);
        fixes++;
        console.log(`  ✅ Title input + content textarea 재구성 (L${i + 1})`);
        break;
    }
}

// === 17. Fix content textarea — remove misplaced code inside it ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '더보기' && lines[i - 1]?.includes('selectionStart')) {
        lines.splice(i, 1);
        fixes++;
        i--;
        console.log(`  ✅ textarea onChange 내 잘못된 "더보기" 제거`);
    }
    if (lines[i]?.includes('좋아요') && lines[i]?.includes('span') && lines[i - 1]?.includes('.then(r')) {
        // Replace with proper .then handler
        lines[i] = '                            .then(d => d.json())';
        if (i + 1 < lines.length && lines[i + 1].includes('댓글') && lines[i + 1].includes('commentCounts')) {
            lines.splice(i + 1, 1);
        }
        // Fix next: setMentionResults 
        if (i + 1 < lines.length && lines[i + 1].includes('setMentionResults') && !lines[i + 1].includes('.then')) {
            lines[i + 1] = '                            .then(data => {';
            lines.splice(i + 2, 0,
                '                                setMentionResults(data.users || []);',
                '                                setShowMentionDropdown((data.users || []).length > 0);',
                '                            });'
            );
            // Remove old setMentionResults and setShowMentionDropdown
            let j = i + 5;
            while (j < lines.length && !lines[j].includes('닫기') && !lines[j].includes('else')) {
                j++;
            }
            // Remove up to 닫기
            if (lines[j]?.trim() === '닫기') {
                lines.splice(j, 1);
            }
        }
        fixes++;
        console.log(`  ✅ mention fetch .then 재구성`);
    }
}

// === 18. Fix content textarea closing — remove fragmented closing ===
// Fix rows = { 5} and className = ... pattern (broken formatting)
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === 'rows = { 5}') {
        // This is the textarea rows prop, broken
        lines[i] = '                            rows={5}';
        if (i + 1 < lines.length && lines[i + 1].includes('className = "')) {
            lines[i + 1] = '                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium resize-none"';
        }
        fixes++;
    }
}

// === 19. Fix keyword label ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('워드') && lines[i].includes('택사항') && lines[i].includes('\uFFFD')) {
        lines[i] = lines[i].replace(/\uFFFD*워\uFFFD*\uFFFD* ?\(\uFFFD*택\uFFFD*항\)/g, '키워드 (선택사항)');
        if (lines[i].includes('\uFFFD')) {
            lines[i] = '                                키워드 (선택사항)';
        }
        fixes++;
    }
}

// === 20. Fix photo label ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('사진 첨부') && lines[i].includes('\uFFFD')) {
        lines[i] = lines[i].replace(/\uFFFD*사진 첨부 \(최대 10장\)\uFFFD*/g, '사진 첨부 (최대 10장)');
        if (lines[i].includes('?')) {
            lines[i] = '                                사진 첨부 (최대 10장)';
        }
        fixes++;
    }
}

// === 21. Fix spaced JSX tags like < div className = "..." > ===
c = lines.join(le);
c = c.replace(/< div className = "/g, '<div className="');
c = c.replace(/<\/div >/g, '</div>');
c = c.replace(/< div >/g, '<div>');
c = c.replace(/\} >/g, '}>');
fixes++;

// === 22. Fix remaining broken chars ===
c = c.replace(/\?\?게시글/g, '게시글');

fs.writeFileSync(fp, c, 'utf8');
console.log(`\n총 ${fixes}건 수정`);

// Remaining broken lines
const rem = c.split(/\r?\n/).filter(l => l.includes('\uFFFD'));
console.log(`남은 깨진 줄: ${rem.length}`);

// Check build
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
    const errs = err.stdout?.split('\n').filter(l => l.includes('ERROR') || l.includes('Build')) || [];
    console.log('\n빌드 결과:');
    errs.forEach(e => console.log('  ', e.trim()));
}

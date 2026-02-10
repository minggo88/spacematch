/**
 * VenueModal.jsx 구조 수정 스크립트
 * 1. form/div 태그 불일치 수정
 * 2. delete 버튼 텍스트 수정
 * 3. </div > 공백 제거
 */
const fs = require('fs');
const fp = 'c:/Users/KYUNG005/Desktop/spacematch/src/components/VenueModal.jsx';
let c = fs.readFileSync(fp, 'utf8');
const le = c.includes('\r\n') ? '\r\n' : '\n';
let lines = c.split(/\r?\n/);
let fixes = 0;

// === 1. Fix delete button text on line with "? </button>" ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '? </button>') {
        lines[i] = lines[i].replace('? </button>', '삭제</button>');
        fixes++;
        console.log(`  ✅ Delete 버튼 텍스트 수정 (L${i + 1})`);
    }
}

// === 2. Fix </div > with space ===
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('</div >')) {
        lines[i] = lines[i].replace(/<\/div >/g, '</div>');
        fixes++;
        console.log(`  ✅ </div > → </div> (L${i + 1})`);
    }
}

// === 3. Find the form tag and its nesting ===
// The form opens at around line 280 and closes with </form>
// Count divs between them to find mismatches
let formStart = -1;
let formEnd = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<form id="venue-form"')) formStart = i;
    if (lines[i].includes('</form>')) formEnd = i;
}
console.log(`  Form: L${formStart + 1} to L${formEnd + 1}`);

// Count opening and closing tags between form start and end
if (formStart >= 0 && formEnd >= 0) {
    let divDepth = 0;
    let formSectionStarts = [];
    for (let i = formStart + 1; i < formEnd; i++) {
        const line = lines[i];
        // Count <div and </div> on each line
        const opens = (line.match(/<div[\s>]/g) || []).length;
        const closes = (line.match(/<\/div>/g) || []).length;
        divDepth += opens - closes;

        // Mark major form sections (depth 0 = direct child of form)
        if (divDepth === 0 && closes > 0) {
            formSectionStarts.push(i);
        }
    }
    console.log(`  Form 내 div depth 편차: ${divDepth}`);

    if (divDepth < 0) {
        // Too many closing divs - there's an extra </div>
        // Find the first place where depth goes negative
        let d = 0;
        for (let i = formStart + 1; i < formEnd; i++) {
            const line = lines[i];
            const opens = (line.match(/<div[\s>]/g) || []).length;
            const closes = (line.match(/<\/div>/g) || []).length;
            d += opens - closes;
            if (d < 0) {
                console.log(`  ⚠️ Depth goes negative at L${i + 1}: ${line.trim().substring(0, 60)}`);
                // Remove this line if it's just a </div>
                if (line.trim() === '</div>') {
                    lines.splice(i, 1);
                    formEnd--;
                    fixes++;
                    console.log(`  ✅ 여분의 </div> 제거 (L${i + 1})`);
                }
                break;
            }
        }
    } else if (divDepth > 0) {
        // Not enough closing divs - add them before </form>
        for (let j = 0; j < divDepth; j++) {
            lines.splice(formEnd, 0, '                    </div>');
            formEnd++;
            fixes++;
        }
        console.log(`  ✅ ${divDepth}개 </div> 추가`);
    }
}

// === 4. Fix the overall structure after form ===
// After </form>, there should be </div> for body, then footer, then closing divs
// Check if the structure outside form is correct

// Write out
c = lines.join(le);
fs.writeFileSync(fp, c, 'utf8');
console.log(`\n총 ${fixes}건 수정`);

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
    const errs = (err.stdout || '').split('\n').filter(l => l.includes('ERROR') || l.includes('Build'));
    console.log('\n빌드 결과:');
    errs.forEach(e => console.log('  ', e.trim()));
}

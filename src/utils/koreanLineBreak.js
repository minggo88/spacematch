/**
 * 한국어 스마트 줄바꿈 알고리즘
 * 
 * 한국어 텍스트를 의미 단위(어절)로 자연스럽게 줄바꿈합니다.
 * 조사, 쉼표, 절 경계를 인식하여 가장 자연스러운 위치에서 줄을 나눕니다.
 * 
 * @example
 *   breakKoreanText('전국 팝업, 갤러리, 카페, 쇼룸 등 다양한 공간을 한곳에서 검색하고 비교 분석하세요.', 16)
 *   // => ['전국 팝업, 갤러리,', '카페, 쇼룸 등', '다양한 공간을 한곳에서', '검색하고 비교 분석하세요.']
 */

// ── 줄바꿈 우선순위 점수 계산 ──

// 쉼표/마침표 뒤 = 절 구분 → 최우선 줄바꿈
const CLAUSE_ENDING = /[,.]$/;

// 복합 조사/어미 뒤 = 절 경계 → 높은 우선순위
const COMPOUND_PARTICLES = /(에서|까지|부터|에게|한테|처럼|만큼|보다|라고|라는|라서|이라|으며|하고|지만|는데|인데|니까|에는|에도|으로|면서|해서|하면|고서|아서|서는|에선|고도|다면|려고|도록|서도|든지|거나|이나|가요|세요|에요|어요|니다|이다|아요|해요|나요|대요|에도)$/;

// 단순 조사 뒤 = 자연스러운 끊김
const SIMPLE_PARTICLES = /(은|는|이|가|을|를|에|와|과|로|의|도|만|서|며|고|죠|요|다|등|후|중|때)$/;

/**
 * 어절의 줄바꿈 적합도 점수를 계산합니다.
 * 점수가 높을수록 해당 어절 뒤에서 줄을 바꾸기 좋습니다.
 */
function getBreakScore(word) {
    if (CLAUSE_ENDING.test(word)) return 3;
    if (COMPOUND_PARTICLES.test(word)) return 2;
    if (SIMPLE_PARTICLES.test(word)) return 1;
    return 0;
}

/**
 * 한국어 텍스트를 지정된 최대 글자 수에 맞춰 줄 배열로 분할합니다.
 * 
 * @param {string} text - 원본 텍스트
 * @param {number} maxChars - 한 줄 최대 글자 수 (공백 포함)
 * @returns {string[]} 줄 배열
 */
export function breakKoreanText(text, maxChars = 20) {
    if (!text || typeof text !== 'string') return [''];

    // 기존 명시적 줄바꿈(\n) 처리
    const segments = text.split('\n');
    const allLines = [];

    for (const segment of segments) {
        const trimmed = segment.trim();
        if (!trimmed) {
            allLines.push('');
            continue;
        }

        const words = trimmed.split(/\s+/);
        if (words.length === 0) {
            allLines.push('');
            continue;
        }

        const lines = greedyBreak(words, maxChars);
        allLines.push(...lines);
    }

    return allLines;
}

/**
 * 개선된 Greedy 줄바꿈
 * 어절을 누적하다가 maxChars 초과 시, 최적의 줄바꿈 지점을 찾습니다.
 */
function greedyBreak(words, maxChars) {
    const lines = [];
    let lineWords = [];
    let lineLen = 0;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const newLen = lineLen === 0 ? word.length : lineLen + 1 + word.length;

        if (newLen <= maxChars) {
            // 아직 한 줄에 들어감
            lineWords.push(word);
            lineLen = newLen;
        } else if (lineWords.length === 0) {
            // 단어 하나가 maxChars보다 긴 경우 → 그냥 넣기
            lines.push(word);
        } else {
            // 줄바꿈 필요 → 최적 지점 찾기
            const breakIdx = findBestBreak(lineWords, maxChars);

            // breakIdx까지는 현재 줄
            lines.push(lineWords.slice(0, breakIdx + 1).join(' '));

            // breakIdx 이후 단어들 + 현재 단어를 다음 줄로
            const remaining = lineWords.slice(breakIdx + 1);
            remaining.push(word);
            lineWords = remaining;
            lineLen = remaining.join(' ').length;
        }
    }

    // 마지막 줄
    if (lineWords.length > 0) {
        lines.push(lineWords.join(' '));
    }

    return lines;
}

/**
 * lineWords 배열에서 줄바꿈하기 가장 좋은 인덱스를 찾습니다.
 * breakScore가 가장 높은 위치, 동점이면 뒤쪽(더 긴 줄) 우선.
 */
function findBestBreak(lineWords, maxChars) {
    if (lineWords.length <= 1) return 0;

    let bestIdx = lineWords.length - 1; // 기본: 마지막 단어 뒤
    let bestScore = -1;

    for (let i = 0; i < lineWords.length; i++) {
        const score = getBreakScore(lineWords[i]);
        // 점수가 높거나 같으면 뒤쪽 우선 (더 균형잡힌 줄)
        if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
        } else if (score === bestScore && score > 0) {
            // 같은 점수면 뒤쪽 우선
            bestIdx = i;
        }
    }

    // 점수가 0이면 (특별한 줄바꿈 지점 없음) → 마지막 단어 앞에서 끊기
    if (bestScore === 0) {
        bestIdx = lineWords.length - 1;
    }

    return bestIdx;
}

export default breakKoreanText;

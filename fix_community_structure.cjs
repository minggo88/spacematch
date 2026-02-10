const fs = require('fs');

// ============== CommunityPage.jsx ==============
{
    const fp = 'c:/Users/KYUNG005/Desktop/spacematch/src/pages/community/CommunityPage.jsx';
    let c = fs.readFileSync(fp, 'utf8');
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    const lines = c.split(/\r?\n/);

    // Find handleDeleteComment and replace it entirely
    let start = -1, end = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('handleDeleteComment') && lines[i].includes('async')) {
            start = i;
        }
        if (start >= 0 && i > start + 5 && lines[i].trim() === '};' && lines[i].match(/^\s{4}\};/)) {
            end = i;
            break;
        }
    }

    if (start >= 0 && end > start) {
        const replacement = [
            '    const handleDeleteComment = async (postId, commentId) => {',
            '        setConfirmModal({',
            "            title: '댓글 삭제',",
            "            message: '이 댓글을 삭제하시겠습니까?',",
            "            type: 'danger',",
            "            confirmLabel: '삭제',",
            '            onConfirm: async () => {',
            '                setConfirmModal(null);',
            '                try {',
            '                    const res = await fetch(`${API_BASE}/community_comments.php`, {',
            "                        method: 'DELETE',",
            "                        headers: { 'Content-Type': 'application/json' },",
            "                        credentials: 'include',",
            '                        body: JSON.stringify({ comment_id: commentId })',
            '                    });',
            '                    const data = await res.json();',
            '                    if (data.success) {',
            '                        fetchComments(postId);',
            "                        showToast('댓글이 삭제되었습니다.', 'success');",
            '                    } else {',
            "                        showToast('댓글 삭제에 실패했습니다.', 'error');",
            '                    }',
            '                } catch (err) {',
            "                    showToast('댓글 삭제 중 오류가 발생했습니다.', 'error');",
            '                }',
            '            }',
            '        });',
            '    };',
        ];
        lines.splice(start, end - start + 1, ...replacement);
        console.log(`✅ handleDeleteComment: L${start + 1}-${end + 1} -> ${replacement.length} lines`);
    }

    // Also fix the misplaced state declaration that has the formatTime line in it
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('// formatTime function moved below')) {
            lines[i] = '    const [showToastMessage, setShowToastMessage] = useState(null);';
            console.log(`✅ L${i + 1}: 잘못 배치된 시간 포맷 코드를 원래 state 선언으로 복원`);
        }
    }

    c = lines.join(le);
    fs.writeFileSync(fp, c, 'utf8');
}

// Check build
const { execSync } = require('child_process');
try {
    const output = execSync('npm run build 2>&1', { cwd: 'c:/Users/KYUNG005/Desktop/spacematch', encoding: 'utf8', timeout: 30000 });
    if (output.includes('built in')) {
        console.log('✅ 빌드 성공!');
    } else {
        const errors = output.split('\n').filter(l => l.includes('ERROR'));
        console.log('빌드 결과:');
        errors.forEach(e => console.log('  ', e.trim()));
    }
} catch (err) {
    const errors = err.stdout?.split('\n').filter(l => l.includes('ERROR') || l.includes('Build')) || [];
    console.log('빌드 결과:');
    errors.forEach(e => console.log('  ', e.trim()));
}

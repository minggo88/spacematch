const fs = require('fs');
const path = require('path');

const files = [
    'src/pages/vendor/VendorApplications.jsx',
    'src/pages/seller/SellerDashboard.jsx',
    'src/pages/seller/SellerProfile.jsx',
    'src/pages/admin/AdminVenues.jsx',
    'src/pages/RecruitmentDashboard.jsx',
    'src/pages/vendor/VendorDashboard.jsx',
    'src/pages/vendor/VendorSellerDirectory.jsx',
    'src/pages/vendor/VendorVenues.jsx',
    'src/pages/community/CommunityPage.jsx',
    'src/pages/seller/SellerApplications.jsx',
    'src/components/NotificationPrompt.jsx',
    'src/components/VenueModal.jsx',
    'src/pages/admin/AdminAds.jsx',
];

files.forEach(f => {
    const fullPath = path.resolve(f);
    if (!fs.existsSync(fullPath)) return;
    const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
    lines.forEach((line, i) => {
        const lineNum = i + 1;
        const trimmed = line.trim();

        // Check for unmatched backticks (template literal issues)
        const backticks = (line.match(/`/g) || []).length;
        if (backticks % 2 === 1 && !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
            console.log(`${f}:${lineNum}: UNMATCHED_BACKTICK: ${trimmed.substring(0, 120)}`);
        }

        // Check for stray apostrophes after word chars, closing brackets, etc.
        // Pattern: letter/digit/}/]/)/> followed by ' followed by space or end-of-tag or <
        const strayMatch = line.match(/[a-zA-Z0-9}\])\u003E]'[\s<\/]/);
        if (strayMatch && !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
            // Exclude legitimate uses like contrasts, isn't, don't, etc.
            const beforeQuote = line.substring(0, line.indexOf(strayMatch[0]) + strayMatch[0].length);
            if (!beforeQuote.match(/(isn|aren|wasn|weren|don|doesn|didn|won|wouldn|can|couldn|shouldn|haven|hasn|hadn|ain|it|that|there|what|who|let|he|she|I|we|they)'[\s,.]/) &&
                !beforeQuote.match(/'[a-zA-Z]/)) {
                console.log(`${f}:${lineNum}: STRAY_QUOTE: ${trimmed.substring(0, 120)}`);
            }
        }

        // Check for " " pattern (broken attribute value)
        if (line.includes('" "') && line.includes('=') && !trimmed.startsWith('//')) {
            console.log(`${f}:${lineNum}: BROKEN_ATTR: ${trimmed.substring(0, 120)}`);
        }
    });
});

const fs = require('fs');
const path = require('path');
const BASE = 'c:/Users/KYUNG005/Desktop/spacematch/src';
const files = [
    'components/VenueModal.jsx',
    'components/VenueDetailModal.jsx',
    'pages/seller/SellerDashboard.jsx',
    'pages/seller/SellerVendorDirectory.jsx',
    'pages/community/CommunityPage.jsx',
    'pages/LandingPage.jsx',
    'pages/admin/AdminPromotions.jsx',
    'pages/admin/AdminDashboard.jsx',
    'pages/admin/AdminCancellations.jsx',
    'pages/vendor/VendorDashboard.jsx',
    'pages/vendor/VendorSellerDirectory.jsx',
];
for (const f of files) {
    const content = fs.readFileSync(path.join(BASE, f), 'utf8');
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('\uFFFD')) {
            // Show line number and trimmed content
            console.log(`${f}|${i + 1}|${lines[i].trimEnd()}`);
        }
    }
}

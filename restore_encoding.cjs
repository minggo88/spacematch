const fs = require('fs');
const iconv = require('iconv-lite');

// The corruption chain was:
// 1. Original: UTF-8 bytes (Korean text)
// 2. PowerShell Get-Content (no encoding specified) read as system default (CP949/EUC-KR)
//    -> UTF-8 bytes were misinterpreted as CP949 characters
// 3. PowerShell Set-Content wrote those misinterpreted characters
//    -> File now has garbled text in system default encoding
// 4. fix_encoding.ps1 read again as system default and wrote as UTF-8
//    -> File is now UTF-8 but contains garbled characters
//
// To reverse: Read current file as UTF-8, encode chars back to CP949 bytes,
// then those bytes ARE the original UTF-8 content.

const files = [
    'src/components/AdSlot.jsx',
    'src/components/NotificationPrompt.jsx',
    'src/components/VenueDetailModal.jsx',
    'src/components/VenueModal.jsx',
    'src/context/AuthContext.jsx',
    'src/context/DataContext.jsx',
    'src/pages/LandingPage.jsx',
    'src/pages/RecruitmentDashboard.jsx',
    'src/pages/admin/AdminAds.jsx',
    'src/pages/admin/AdminCancellations.jsx',
    'src/pages/admin/AdminDashboard.jsx',
    'src/pages/admin/AdminPromotions.jsx',
    'src/pages/admin/AdminUserDetail.jsx',
    'src/pages/admin/AdminUsers.jsx',
    'src/pages/admin/AdminVenues.jsx',
    'src/pages/admin/SuperAdminDatabase.jsx',
    'src/pages/community/CommunityPage.jsx',
    'src/pages/seller/SellerApplications.jsx',
    'src/pages/seller/SellerDashboard.jsx',
    'src/pages/seller/SellerProfile.jsx',
    'src/pages/seller/SellerVendorDirectory.jsx',
    'src/pages/vendor/VendorApplications.jsx',
    'src/pages/vendor/VendorDashboard.jsx',
    'src/pages/vendor/VendorSellerDirectory.jsx',
    'src/pages/vendor/VendorVenues.jsx',
];

let fixed = 0;
let failed = 0;

for (const file of files) {
    try {
        // Read as UTF-8 (current state: garbled Korean in UTF-8)
        const garbled = fs.readFileSync(file, 'utf-8');

        // Encode the garbled text back to CP949 bytes
        // These bytes should be the original UTF-8 content
        const cp949Bytes = iconv.encode(garbled, 'cp949');

        // Verify: try to decode these bytes as UTF-8
        const restored = cp949Bytes.toString('utf-8');

        // Quick sanity check: restored should NOT contain garbled-looking patterns
        if (restored.includes('怨듦') || restored.includes('?좎껌') || restored.includes('?섍린')) {
            console.log(`STILL GARBLED: ${file} - trying alternative approach`);
            // Maybe the re-encoding script didn't work, try reading raw bytes
            const rawBytes = fs.readFileSync(file);
            // Decode as CP949
            const fromCp = iconv.decode(rawBytes, 'cp949');
            // Re-encode as UTF-8
            const utf8Bytes = Buffer.from(fromCp, 'utf-8');
            // Try decode as UTF-8
            const attempt2 = utf8Bytes.toString('utf-8');
            if (!attempt2.includes('怨듦') && !attempt2.includes('?좎껌')) {
                fs.writeFileSync(file, attempt2, 'utf-8');
                console.log(`RESTORED (alt): ${file}`);
                fixed++;
            } else {
                console.log(`FAILED: ${file} - could not restore`);
                failed++;
            }
        } else {
            fs.writeFileSync(file, restored, 'utf-8');
            console.log(`RESTORED: ${file}`);
            fixed++;
        }
    } catch (e) {
        console.log(`ERROR: ${file}: ${e.message}`);
        failed++;
    }
}

console.log(`\nDone. Fixed: ${fixed}, Failed: ${failed}`);

/**
 * Add chat/cs sidebar keys to all common.json locale files
 * Run: node add_chat_sidebar_keys.cjs
 */
const fs = require('fs');
const path = require('path');

const locales = ['ko', 'en', 'en-GB', 'en-CA', 'fr-CA', 'ja', 'vi', 'th', 'km', 'ru', 'uk'];
const localeDir = path.join(__dirname, 'public', 'locales');

const translations = {
    ko: { chat: '채팅', csManagement: 'CS 관리' },
    en: { chat: 'Chat', csManagement: 'CS Management' },
    'en-GB': { chat: 'Chat', csManagement: 'CS Management' },
    'en-CA': { chat: 'Chat', csManagement: 'CS Management' },
    'fr-CA': { chat: 'Chat', csManagement: 'Gestion CS' },
    ja: { chat: 'チャット', csManagement: 'CS管理' },
    vi: { chat: 'Chat', csManagement: 'Quản lý CS' },
    th: { chat: 'แชท', csManagement: 'จัดการ CS' },
    km: { chat: 'ជជែក', csManagement: 'គ្រប់គ្រង CS' },
    ru: { chat: 'Чат', csManagement: 'Управление CS' },
    uk: { chat: 'Чат', csManagement: 'Управління CS' }
};

locales.forEach(lang => {
    const file = path.join(localeDir, lang, 'common.json');
    if (!fs.existsSync(file)) {
        console.log(`[SKIP] ${lang}/common.json not found`);
        return;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!data.sidebar) data.sidebar = {};

    const t = translations[lang] || translations.en;
    data.sidebar.chat = t.chat;
    data.sidebar.csManagement = t.csManagement;

    fs.writeFileSync(file, JSON.stringify(data, null, 4) + '\n', 'utf8');
    console.log(`[OK] Updated ${lang}/common.json with chat/csManagement keys`);
});

console.log('Done!');

/**
 * Creates chat.json locale files for all non-ko/en languages
 * Run: node create_chat_locales.cjs
 */
const fs = require('fs');
const path = require('path');

const enData = {
    "title": "Chat",
    "subtitle": "Real-time messaging",
    "searchPlaceholder": "Search conversations...",
    "noConversations": "No conversations",
    "noConversationsDesc": "Start a conversation from a vendor or seller profile",
    "selectConversation": "Select a conversation",
    "selectConversationDesc": "Choose a conversation from the list to view messages",
    "startConversation": "Start a conversation",
    "startConversationDesc": "Send your first message!",
    "inputPlaceholder": "Type a message...",
    "autoTranslate": "Auto Translate",
    "autoTranslated": "Auto-translated",
    "photo": "Photo",
    "video": "Video",
    "file": "File",
    "noMessages": "No messages",
    "dropFile": "Drop file here",
    "uploading": "Uploading...",
    "seller": "Seller",
    "vendor": "Vendor",
    "justNow": "Just now",
    "minutesAgo": "{{count}}m ago",
    "daysAgo": "{{count}}d ago",
    "csTitle": "CS Management",
    "csSubtitle": "Customer support inquiries",
    "csInquiries": "inquiries",
    "noCSInquiries": "No CS inquiries",
    "csReplyPlaceholder": "Type your reply...",
    "selectCSConversation": "Select an inquiry",
    "selectCSConversationDesc": "Choose an inquiry from the list to view the conversation",
    "contactSupport": "Contact Support"
};

// Japanese
const jaData = { ...enData, title: "チャット", subtitle: "リアルタイムメッセージ", searchPlaceholder: "会話を検索...", noConversations: "会話がありません", noConversationsDesc: "ベンダーまたはセラーのプロフィールから会話を始めましょう", selectConversation: "会話を選択してください", selectConversationDesc: "リストから会話を選択してメッセージを確認してください", startConversation: "会話を始めましょう", startConversationDesc: "最初のメッセージを送ってみましょう！", inputPlaceholder: "メッセージを入力...", autoTranslate: "自動翻訳", autoTranslated: "自動翻訳済み", photo: "写真", video: "動画", file: "ファイル", noMessages: "メッセージなし", dropFile: "ここにファイルをドロップ", uploading: "アップロード中...", seller: "セラー", vendor: "ベンダー", justNow: "たった今", minutesAgo: "{{count}}分前", daysAgo: "{{count}}日前", csTitle: "CS管理", csSubtitle: "お客様サポート", csInquiries: "件の問い合わせ", noCSInquiries: "CS問い合わせはありません", csReplyPlaceholder: "返信を入力...", selectCSConversation: "問い合わせを選択", selectCSConversationDesc: "リストから問い合わせを選択してください", contactSupport: "サポートに連絡" };

const locales = ['en-GB', 'en-CA', 'fr-CA', 'ja', 'vi', 'th', 'km', 'ru', 'uk'];
const localeDir = path.join(__dirname, 'public', 'locales');

locales.forEach(lang => {
    const dir = path.join(localeDir, lang);
    const file = path.join(dir, 'chat.json');
    if (fs.existsSync(file)) {
        console.log(`[SKIP] ${lang}/chat.json already exists`);
        return;
    }
    const data = lang === 'ja' ? jaData : enData;
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`[OK] Created ${lang}/chat.json`);
});

console.log('Done!');

const fs = require('fs');
const path = require('path');
const base = 'c:/Users/KYUNG005/Desktop/spacematch/public/locales';

// New admin/superadmin step translations per language
const adminSteps = {
    'ko': {
        adminHome: { title: '관리자 홈', desc: '플랫폼 전체 현황을 한눈에 확인합니다. 주요 지표와 알림이 여기에 표시됩니다.' },
        adminDashboard: { title: '관리 대시보드', desc: '전체 통계, 사용자 활동, 매출 추이를 분석할 수 있는 종합 관리 페이지입니다.' },
        adminSellers: { title: '셀러 관리', desc: '등록된 모든 셀러를 조회하고 관리합니다. 승인, 차단, 상세 정보를 확인하세요.' },
        adminHosts: { title: '호스트 관리', desc: '등록된 모든 호스트를 조회하고 관리합니다. 호스트 승인과 공간 현황을 확인하세요.' },
        adminApps: { title: '입점 신청 관리', desc: '셀러의 입점 신청을 승인하거나 반려할 수 있습니다.' },
        adminVenues: { title: '공간(베뉴) 관리', desc: '전체 등록 공간을 관리합니다. 공간 정보 수정과 상태 변경이 가능합니다.' },
        adminUsers: { title: '사용자 관리', desc: '전체 회원을 조회하고 역할 변경, 차단, 비밀번호 초기화 등을 수행합니다.' },
        adminPayments: { title: '결제 관리', desc: '서비스 결제 현황을 확인하고 관리합니다.' },
        adminSecurity: { title: '보안 설정', desc: '플랫폼 보안 정책과 접근 제어를 관리합니다.' },
        adminDB: { title: 'DB 관리', desc: '데이터베이스 상태를 모니터링하고 직접 관리할 수 있습니다. (슈퍼관리자 전용)' },
        adminCommunity: { title: '커뮤니티 관리', desc: '전체 커뮤니티 게시판을 모니터링하고 관리합니다.' }
    },
    'en': {
        adminHome: { title: 'Admin Home', desc: 'Overview of the entire platform. Key metrics and notifications are displayed here.' },
        adminDashboard: { title: 'Admin Dashboard', desc: 'A comprehensive management page for analyzing overall statistics, user activity, and revenue trends.' },
        adminSellers: { title: 'Seller Management', desc: 'View and manage all registered sellers. Handle approvals, blocks, and detailed information.' },
        adminHosts: { title: 'Host Management', desc: 'View and manage all registered hosts. Check host approvals and space status.' },
        adminApps: { title: 'Application Management', desc: 'Approve or reject seller entry applications.' },
        adminVenues: { title: 'Venue Management', desc: 'Manage all registered spaces. Edit space information and change statuses.' },
        adminUsers: { title: 'User Management', desc: 'View all members and perform role changes, blocks, and password resets.' },
        adminPayments: { title: 'Payment Management', desc: 'View and manage service payment status.' },
        adminSecurity: { title: 'Security Settings', desc: 'Manage platform security policies and access controls.' },
        adminDB: { title: 'DB Management', desc: 'Monitor and directly manage the database. (Super Admin only)' },
        adminCommunity: { title: 'Community Management', desc: 'Monitor and manage all community boards.' }
    },
    'ja': {
        adminHome: { title: '管理者ホーム', desc: 'プラットフォーム全体の状況を一目で確認します。' },
        adminDashboard: { title: '管理ダッシュボード', desc: '全体統計、ユーザー活動、売上推移を分析できる総合管理ページです。' },
        adminSellers: { title: 'セラー管理', desc: '登録セラーを照会・管理します。承認・ブロック・詳細情報を確認しましょう。' },
        adminHosts: { title: 'ホスト管理', desc: '登録ホストを照会・管理します。承認状況とスペース現況を確認しましょう。' },
        adminApps: { title: '出店申請管理', desc: 'セラーの出店申請を承認または却下できます。' },
        adminVenues: { title: 'スペース管理', desc: '全登録スペースを管理します。情報修正とステータス変更が可能です。' },
        adminUsers: { title: 'ユーザー管理', desc: '全会員を照会し、役割変更・ブロック・パスワードリセットを行います。' },
        adminPayments: { title: '決済管理', desc: 'サービス決済状況を確認・管理します。' },
        adminSecurity: { title: 'セキュリティ設定', desc: 'プラットフォームのセキュリティポリシーとアクセス制御を管理します。' },
        adminDB: { title: 'DB管理', desc: 'データベースの状態を監視し直接管理できます。(スーパー管理者専用)' },
        adminCommunity: { title: 'コミュニティ管理', desc: '全コミュニティ掲示板を監視・管理します。' }
    },
    'fr-CA': {
        adminHome: { title: 'Accueil admin', desc: "Vue d'ensemble de la plateforme." },
        adminDashboard: { title: 'Tableau de bord admin', desc: "Page de gestion complète pour analyser les statistiques globales et les tendances." },
        adminSellers: { title: 'Gestion des vendeurs', desc: 'Consultez et gérez tous les vendeurs enregistrés.' },
        adminHosts: { title: 'Gestion des hôtes', desc: 'Consultez et gérez tous les hôtes enregistrés.' },
        adminApps: { title: 'Gestion des candidatures', desc: 'Approuvez ou rejetez les candidatures des vendeurs.' },
        adminVenues: { title: 'Gestion des espaces', desc: 'Gérez tous les espaces enregistrés.' },
        adminUsers: { title: 'Gestion des utilisateurs', desc: 'Consultez tous les membres et gérez les rôles et accès.' },
        adminPayments: { title: 'Gestion des paiements', desc: 'Consultez et gérez le statut des paiements.' },
        adminSecurity: { title: 'Paramètres de sécurité', desc: "Gérez les politiques de sécurité de la plateforme." },
        adminDB: { title: 'Gestion BD', desc: 'Surveillez et gérez directement la base de données. (Super admin uniquement)' },
        adminCommunity: { title: 'Gestion communauté', desc: 'Surveillez et gérez tous les forums communautaires.' }
    },
    'vi': {
        adminHome: { title: 'Trang chủ quản trị', desc: 'Tổng quan toàn bộ nền tảng.' },
        adminDashboard: { title: 'Bảng điều khiển quản trị', desc: 'Trang quản lý toàn diện để phân tích thống kê và xu hướng.' },
        adminSellers: { title: 'Quản lý người bán', desc: 'Xem và quản lý tất cả người bán đã đăng ký.' },
        adminHosts: { title: 'Quản lý chủ nhà', desc: 'Xem và quản lý tất cả chủ nhà đã đăng ký.' },
        adminApps: { title: 'Quản lý đơn ứng tuyển', desc: 'Phê duyệt hoặc từ chối đơn ứng tuyển.' },
        adminVenues: { title: 'Quản lý không gian', desc: 'Quản lý tất cả không gian đã đăng ký.' },
        adminUsers: { title: 'Quản lý người dùng', desc: 'Xem tất cả thành viên và quản lý vai trò, quyền truy cập.' },
        adminPayments: { title: 'Quản lý thanh toán', desc: 'Xem và quản lý trạng thái thanh toán.' },
        adminSecurity: { title: 'Cài đặt bảo mật', desc: 'Quản lý chính sách bảo mật nền tảng.' },
        adminDB: { title: 'Quản lý CSDL', desc: 'Giám sát và quản lý trực tiếp cơ sở dữ liệu. (Chỉ Super Admin)' },
        adminCommunity: { title: 'Quản lý cộng đồng', desc: 'Giám sát và quản lý tất cả diễn đàn cộng đồng.' }
    },
    'th': {
        adminHome: { title: 'หน้าหลักผู้ดูแล', desc: 'ภาพรวมทั้งหมดของแพลตฟอร์ม' },
        adminDashboard: { title: 'แดชบอร์ดผู้ดูแล', desc: 'หน้าจัดการครบวงจรสำหรับวิเคราะห์สถิติและแนวโน้ม' },
        adminSellers: { title: 'จัดการผู้ขาย', desc: 'ดูและจัดการผู้ขายที่ลงทะเบียนทั้งหมด' },
        adminHosts: { title: 'จัดการเจ้าของพื้นที่', desc: 'ดูและจัดการเจ้าของพื้นที่ที่ลงทะเบียนทั้งหมด' },
        adminApps: { title: 'จัดการใบสมัคร', desc: 'อนุมัติหรือปฏิเสธใบสมัครของผู้ขาย' },
        adminVenues: { title: 'จัดการพื้นที่', desc: 'จัดการพื้นที่ที่ลงทะเบียนทั้งหมด' },
        adminUsers: { title: 'จัดการผู้ใช้', desc: 'ดูสมาชิกทั้งหมดและจัดการบทบาทและสิทธิ์' },
        adminPayments: { title: 'จัดการการชำระเงิน', desc: 'ดูและจัดการสถานะการชำระเงิน' },
        adminSecurity: { title: 'การตั้งค่าความปลอดภัย', desc: 'จัดการนโยบายความปลอดภัยของแพลตฟอร์ม' },
        adminDB: { title: 'จัดการฐานข้อมูล', desc: 'ตรวจสอบและจัดการฐานข้อมูลโดยตรง (ซูเปอร์แอดมินเท่านั้น)' },
        adminCommunity: { title: 'จัดการชุมชน', desc: 'ตรวจสอบและจัดการบอร์ดชุมชนทั้งหมด' }
    },
    'km': {
        adminHome: { title: 'ទំព័រដើមអ្នកគ្រប់គ្រង', desc: 'ទិដ្ឋភាពទូទៅនៃវេទិកាទាំងមូល' },
        adminDashboard: { title: 'ផ្ទាំងគ្រប់គ្រងអ្នកគ្រប់គ្រង', desc: 'ទំព័រគ្រប់គ្រងសម្រាប់វិភាគស្ថិតិនិងនិន្នាការ' },
        adminSellers: { title: 'គ្រប់គ្រងអ្នកលក់', desc: 'មើលនិងគ្រប់គ្រងអ្នកលក់ដែលបានចុះឈ្មោះទាំងអស់' },
        adminHosts: { title: 'គ្រប់គ្រងម្ចាស់ទីកន្លែង', desc: 'មើលនិងគ្រប់គ្រងម្ចាស់ទីកន្លែងទាំងអស់' },
        adminApps: { title: 'គ្រប់គ្រងពាក្យស្នើសុំ', desc: 'អនុម័តឬច្រានចោលពាក្យស្នើសុំ' },
        adminVenues: { title: 'គ្រប់គ្រងទីកន្លែង', desc: 'គ្រប់គ្រងទីកន្លែងដែលបានចុះឈ្មោះទាំងអស់' },
        adminUsers: { title: 'គ្រប់គ្រងអ្នកប្រើប្រាស់', desc: 'មើលសមាជិកទាំងអស់និងគ្រប់គ្រងតួនាទី' },
        adminPayments: { title: 'គ្រប់គ្រងការទូទាត់', desc: 'មើលនិងគ្រប់គ្រងស្ថានភាពការទូទាត់' },
        adminSecurity: { title: 'ការកំណត់សុវត្ថិភាព', desc: 'គ្រប់គ្រងគោលនយោបាយសុវត្ថិភាព' },
        adminDB: { title: 'គ្រប់គ្រងមូលដ្ឋានទិន្នន័យ', desc: 'ត្រួតពិនិត្យនិងគ្រប់គ្រងមូលដ្ឋានទិន្នន័យ' },
        adminCommunity: { title: 'គ្រប់គ្រងសហគមន៍', desc: 'ត្រួតពិនិត្យនិងគ្រប់គ្រងក្ដារសហគមន៍ទាំងអស់' }
    },
    'ru': {
        adminHome: { title: 'Главная админа', desc: 'Обзор всей платформы. Ключевые показатели и уведомления.' },
        adminDashboard: { title: 'Панель управления', desc: 'Комплексная страница управления для анализа статистики и трендов.' },
        adminSellers: { title: 'Управление продавцами', desc: 'Просмотр и управление всеми зарегистрированными продавцами.' },
        adminHosts: { title: 'Управление хостами', desc: 'Просмотр и управление всеми зарегистрированными хостами.' },
        adminApps: { title: 'Управление заявками', desc: 'Одобряйте или отклоняйте заявки продавцов.' },
        adminVenues: { title: 'Управление площадками', desc: 'Управляйте всеми зарегистрированными площадками.' },
        adminUsers: { title: 'Управление пользователями', desc: 'Просмотр всех участников и управление ролями.' },
        adminPayments: { title: 'Управление платежами', desc: 'Просмотр и управление статусом платежей.' },
        adminSecurity: { title: 'Настройки безопасности', desc: 'Управление политиками безопасности платформы.' },
        adminDB: { title: 'Управление БД', desc: 'Мониторинг и управление базой данных. (Только для суперадмина)' },
        adminCommunity: { title: 'Управление сообществом', desc: 'Мониторинг и управление форумами сообщества.' }
    },
    'uk': {
        adminHome: { title: 'Головна адміна', desc: 'Огляд всієї платформи.' },
        adminDashboard: { title: 'Панель керування', desc: 'Комплексна сторінка управління для аналізу статистики та трендів.' },
        adminSellers: { title: 'Управління продавцями', desc: 'Перегляд і управління всіма зареєстрованими продавцями.' },
        adminHosts: { title: 'Управління хостами', desc: 'Перегляд і управління всіма зареєстрованими хостами.' },
        adminApps: { title: 'Управління заявками', desc: 'Схвалюйте або відхиляйте заявки продавців.' },
        adminVenues: { title: 'Управління локаціями', desc: 'Керуйте всіма зареєстрованими локаціями.' },
        adminUsers: { title: 'Управління користувачами', desc: 'Перегляд усіх учасників і управління ролями.' },
        adminPayments: { title: 'Управління платежами', desc: 'Перегляд і управління статусом платежів.' },
        adminSecurity: { title: 'Налаштування безпеки', desc: 'Управління політиками безпеки платформи.' },
        adminDB: { title: 'Управління БД', desc: 'Моніторинг і управління базою даних. (Тільки для суперадміна)' },
        adminCommunity: { title: 'Управління спільнотою', desc: 'Моніторинг і управління форумами спільноти.' }
    }
};

// en-CA and en-GB use same as en
adminSteps['en-CA'] = adminSteps['en'];
adminSteps['en-GB'] = adminSteps['en'];

const langs = ['ko', 'en', 'ja', 'fr-CA', 'vi', 'th', 'km', 'ru', 'uk', 'en-CA', 'en-GB'];

for (const lang of langs) {
    const fp = path.join(base, lang, 'common.json');
    const json = JSON.parse(fs.readFileSync(fp, 'utf8'));
    if (!json.onboarding) json.onboarding = {};
    if (!json.onboarding.steps) json.onboarding.steps = {};
    const newSteps = adminSteps[lang] || adminSteps['en'];
    Object.assign(json.onboarding.steps, newSteps);
    fs.writeFileSync(fp, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log('OK:', lang);
}
console.log('Done!');

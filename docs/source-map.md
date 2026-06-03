# SpaceMatch 소스 맵 (Source Map)

> 코드 수정 전 반드시 참조. 마지막 갱신: 2026-06-03

---

## 1. 프로젝트 개요

**SpaceMatch** — 공간 호스트(Host)와 셀러(Seller) 간 B2B 매칭 플랫폼.  
벤더(Vendor)는 셀러에게 제품/서비스를 납품하는 공급자 역할.

| 항목 | 내용 |
|------|------|
| 프레임워크 | React 18 + Vite 5 + TailwindCSS 3 |
| 백엔드 | PHP (세션 기반 인증) + MySQL |
| 호스팅 | Cafe24 (SFTP 배포) |
| CI/CD | GitHub Actions (`.github/workflows/deploy.yml`) |
| 번들러 설정 | `vite.config.js` — terser 압축, sourcemap 비활성화, 청크 분리 |

---

## 2. 사용자 역할 (Roles)

| Role | 경로 | 설명 |
|------|------|------|
| `superadmin` | `/admin` | 최고 관리자 (DB 접근 포함) |
| `admin` | `/admin` | 일반 관리자 |
| `host` | `/host` | 공간 제공자 |
| `seller` | `/seller` | 판매자 |
| `vendor` | `/vendor` | 공급업체 |

역할 기반 라우트 보호: `src/App.jsx` → `RoleRoute` 컴포넌트

---

## 3. 프론트엔드 구조 (`src/`)

### 3-1. 진입점

| 파일 | 역할 |
|------|------|
| `src/main.jsx` | React 앱 마운트 |
| `src/App.jsx` | 전체 라우팅 + Role 보호 |
| `src/index.css` | 전역 스타일 |
| `src/i18n.js` | i18next 초기화 |

### 3-2. Context (전역 상태)

| 파일 | 제공 상태 |
|------|-----------|
| `src/context/AuthContext.jsx` | `user`, `login()`, `logout()` — 세션 heartbeat 15분 |
| `src/context/DataContext.jsx` | 공유 데이터 캐시 |
| `src/context/ToastContext.jsx` | 토스트 알림 |
| `src/context/LocaleContext.jsx` | 언어/로케일 |
| `src/context/CurrencyContext.jsx` | 통화 환율 |
| `src/context/ThemeContext.jsx` | 다크/라이트 테마 |

### 3-3. Hooks

| 파일 | 역할 |
|------|------|
| `src/hooks/useGeoLanguage.js` | IP 기반 언어·통화 자동 감지 (첫 방문만) |
| `src/hooks/useAutoTranslate.js` | 자동 번역 |
| `src/hooks/useDemoGuard.js` | 데모 계정 기능 제한 |

### 3-4. 공통 컴포넌트 (`src/components/`)

| 파일 | 역할 |
|------|------|
| `Layout.jsx` | 인증 후 공통 레이아웃 (사이드바 등) |
| `SecurityGuard.jsx` | 전역 보안 검사 |
| `Toast.jsx` | 알림 UI |
| `ConfirmModal.jsx` | 확인 다이얼로그 |
| `LegalModal.jsx` | 이용약관/개인정보처리방침 팝업 |
| `VenueModal.jsx` | 장소 상세/등록 모달 |
| `VenueDetailModal.jsx` | 장소 상세 보기 모달 |
| `KakaoMap.jsx` | 카카오 지도 연동 |
| `AdSlot.jsx` | 광고 슬롯 |
| `NumberInput.jsx` | 숫자 입력 컴포넌트 |
| `KeywordSelector.jsx` | 키워드 선택기 |
| `LanguageSelector.jsx` | 언어 선택기 |
| `CountryBadge.jsx` | 국가 뱃지 |
| `SmartText.jsx` | 자동 번역 텍스트 |
| `TranslatedText.jsx` | i18n 번역 텍스트 |
| `OnboardingGuide.jsx` | 온보딩 안내 |
| `ServiceGuideModal.jsx` | 서비스 가이드 모달 |
| `NotificationPrompt.jsx` | 푸시 알림 프롬프트 |
| `TermsAgreement.jsx` | 약관 동의 |
| `PublicNav.jsx` | 공개 페이지 네비게이션 |
| `PublicFooter.jsx` | 공개 페이지 푸터 |
| `SiteFooter.jsx` | 사이트 공통 푸터 |

### 3-5. 페이지 (`src/pages/`)

#### 공개 페이지 (인증 불필요)
| 파일 | URL | 설명 |
|------|-----|------|
| `LandingPage.jsx` | `/` | 메인 랜딩 |
| `ServicesPage.jsx` | `/services` | 서비스 소개 |
| `HowItWorksPage.jsx` | `/how-it-works` | 이용 방법 |
| `AboutPage.jsx` | `/about` | 회사 소개 |
| `ContactPage.jsx` | `/contact` | 문의 |
| `RecruitmentDashboard.jsx` | `/recruitment` | 채용 |
| `HostPublicProfile.jsx` | `/profile/:id` | 호스트 공개 프로필 |
| `HostSharePage.jsx` | `/host-share/:id` | 호스트 공유 페이지 |
| `AdSharePage.jsx` | `/ad-report/:token` | 광고 리포트 공유 |
| `CampaignSharePage.jsx` | `/ad-campaign-report/:token` | 캠페인 리포트 공유 |
| `TermsPage.jsx` | — | 이용약관 |
| `PrivacyPage.jsx` | — | 개인정보처리방침 |

#### 인증 페이지
| 파일 | URL | 설명 |
|------|-----|------|
| `Login.jsx` | `/login` | 로그인 |
| `SignupSelection.jsx` | `/signup` | 가입 유형 선택 |
| `Signup.jsx` | `/signup/seller` | 셀러 가입 |
| `SignupHost.jsx` | `/signup/host` | 호스트 가입 |
| `SignupVendor.jsx` | `/signup/vendor` | 벤더 가입 |
| `FindEmail.jsx` | `/find-email` | 이메일 찾기 |
| `ResetPassword.jsx` | `/reset-password` | 비밀번호 재설정 |

#### Admin 페이지 (`src/pages/admin/`)
| 파일 | URL | 설명 |
|------|-----|------|
| `AdminDashboard.jsx` | `/admin` | 관리자 대시보드 |
| `AdminVenues.jsx` | `/admin/venues` | 장소 관리 |
| `AdminApplications.jsx` | `/admin/applications` | 신청 관리 |
| `AdminUsers.jsx` | `/admin/users` | 회원 관리 |
| `AdminUserDetail.jsx` | `/admin/users/:id` | 회원 상세 |
| `AdminPromotions.jsx` | `/admin/promotions` | 프로모션 관리 |
| `AdminCancellations.jsx` | `/admin/cancellations` | 취소 관리 |
| `AdminAds.jsx` | `/admin/ads` | 광고 관리 |
| `AdminAdDashboard.jsx` | — | 광고 대시보드 |
| `AdminTrash.jsx` | `/admin/trash` | 휴지통 |
| `AdminPopups.jsx` | `/admin/popups` | 팝업 관리 |
| `AdminSecurity.jsx` | `/admin/security` | 보안 관리 |
| `AdminPayments.jsx` | `/admin/payments` | 결제 관리 |
| `AdminSellerStats.jsx` | `/admin/seller-stats` | 셀러 통계 |
| `AdminCalcStats.jsx` | `/admin/calc-stats` | 계산 통계 |
| `AdminCS.jsx` | `/admin/cs` | 고객센터 |
| `AdminMarketing.jsx` | `/admin/marketing` | 마케팅 |
| `AdminEmailMarketing.jsx` | `/admin/email-marketing` | 이메일 마케팅 |
| `AdminMenuVisibility.jsx` | `/admin/menu-visibility` | 메뉴 표시 설정 |
| `AdminVendorManagement.jsx` | `/admin/vendor-management` | 벤더 관리 |
| `SuperAdminDatabase.jsx` | `/admin/database` | DB 관리 (superadmin) |
| `CampaignReportModal.jsx` | — | 캠페인 리포트 모달 |

#### Seller 페이지 (`src/pages/seller/`)
| 파일 | URL | 설명 |
|------|-----|------|
| `SellerDashboard.jsx` | `/seller` | 셀러 대시보드 |
| `SellerApplications.jsx` | `/seller/applications` | 신청 내역 |
| `SellerProfile.jsx` | `/seller/profile` | 프로필 |
| `SellerPayments.jsx` | `/seller/payments` | 결제 내역 |
| `SellerStats.jsx` | `/seller/stats` | 매출 통계 |
| `SellerMarketing.jsx` | `/seller/marketing` | 마케팅 |
| `SellerCommunity.jsx` | `/seller/community` | 커뮤니티 |
| `SellerHostDirectory.jsx` | `/seller/hosts` | 호스트 디렉토리 |
| `SellerProposals.jsx` | `/seller/proposals` | 제안서 |
| `SellerShipments.jsx` | `/seller/shipments` | 배송 관리 |
| `SellerSettlements.jsx` | `/seller/settlements` | 정산 |
| `SellerPopularAlerts.jsx` | `/seller/popular` | 인기 알림 |
| `CustomerTab.jsx` | — | 고객 탭 |

#### Host 페이지 (`src/pages/host/`)
| 파일 | URL | 설명 |
|------|-----|------|
| `HostDashboard.jsx` | `/host/dashboard` | 호스트 대시보드 |
| `HostVenues.jsx` | `/host/venues` | 내 장소 관리 |
| `HostApplications.jsx` | `/host/applications` | 신청 관리 |
| `HostSellerDirectory.jsx` | `/host/sellers` | 셀러 디렉토리 |
| `HostStats.jsx` | `/host/stats` | 통계 |
| `HostAnalyticsReport.jsx` | `/host/report` | 분석 리포트 |
| `HostMarketing.jsx` | `/host/marketing` | 마케팅 |
| `HostCommunity.jsx` | `/host/community` | 커뮤니티 |

#### Vendor 페이지 (`src/pages/vendor/`)
| 파일 | URL | 설명 |
|------|-----|------|
| `VendorDashboard.jsx` | `/vendor` | 벤더 대시보드 |
| `VendorSellerDirectory.jsx` | `/vendor/sellers` | 셀러 디렉토리 |
| `VendorProposals.jsx` | `/vendor/proposals` | 제안서 |
| `VendorShipments.jsx` | `/vendor/shipments` | 배송 관리 |
| `VendorSettlements.jsx` | `/vendor/settlements` | 정산 |
| `VendorProfile.jsx` | `/vendor/profile` | 프로필 |

#### 공통 (공유 페이지)
| 파일 | URL | 설명 |
|------|-----|------|
| `ChatPage.jsx` | `*/chat` | 채팅 (전 역할 공유) |
| `Analytics.jsx` | `*/analytics` | 분석 (admin/seller/host) |
| `NotificationSettings.jsx` | `*/notification-settings` | 알림 설정 |
| `community/CommunityPage.jsx` | — | 커뮤니티 공통 |
| `community/GeneralCommunity.jsx` | `*/community/general` | 일반 커뮤니티 |

---

## 4. 백엔드 API 구조 (`public/api/`)

### DB 연결
- `public/api/db_connect.php` — 공통 DB 연결 파일 (모든 API가 include)

### API 모듈별 파일 목록

#### `/api/auth/` — 인증
`login.php` · `logout.php` · `register.php` · `me.php` · `find_email.php` · `reset_password.php` · `send_verification.php` · `verify_email.php` · `withdraw.php` · `detect_country.php` · `create_demo_accounts.php`

#### `/api/venues/` — 장소
`get_venues.php` · `get_my_venues.php` · `add_venue.php` · `update_venue.php` · `delete_venue.php` · `get_pending_venues.php` · `get_all_venues_admin.php` · `manage_venue_status.php` · `update_venue_admin.php` · `get_types.php` · `manage_types.php` · `venue_analytics.php` · `popular_venues.php` · `get_trending.php` · `host_report.php` · `get_hosts_for_admin.php`

#### `/api/applications/` — 신청
`submit_application.php` · `get_applications.php` · `update_status.php` · `cancel_application.php` · `toggle_priority.php` · `get_cancellation_requests.php` · `handle_cancellation.php` · `request_cancellation.php`

#### `/api/users/` — 사용자
`get_users.php` · `get_user_detail.php` · `update_profile.php` · `upload_profile_image.php` · `change_password.php` · `manage_user_status.php` · `toggle_verified.php` · `toggle_featured.php` · `toggle_block.php` · `toggle_email_verified.php` · `toggle_service.php` · `search_users.php` · `host_stats.php` · `seller_stats.php` · `seller_stats_admin.php` · `seller_stats_public.php` · `seller_stats_import.php` · `browse_hosts.php` · `browse_sellers.php` · `get_host_public.php` · `get_public_profile.php` · `seller_upload.php` · `get_seller_photos.php` · `upload_seller_photos.php` · `delete_seller_photo.php` · `reorder_seller_photos.php` · `seller_customers.php` · `seller_expenses.php` · `seller_favorites.php` · `seller_contact_access.php` · `host_contact_access.php` · `unlock_seller_contact.php` · `unlock_host_contact.php` · `seller_tax.php` · `host_tax.php` · `update_user_content.php` · `update_venue_limit.php` · `create_admin.php` · `currency_rates.php` · `check_service.php`

#### `/api/payments/` — 결제/구독
`create_payment.php` · `confirm_payment.php` · `submit_payment.php` · `get_payments.php` · `get_plans.php` · `get_settings.php` · `manage_plans.php` · `update_settings.php` · `check_subscription.php` · `admin_grant_subscription.php` · `diag_subscription.php`

#### `/api/chat/` — 채팅
`conversations.php` · `messages.php` · `upload.php` · `chat_permission.php` · `cs_admin.php` · `retranslate.php`

#### `/api/community/` — 커뮤니티
`community_posts.php` · `community_comments.php` · `community_likes.php` · `community_comment_likes.php` · `community_bookmarks.php` · `community_polls.php` · `community_popular.php` · `community_activity.php` · `community_reports.php` · `community_delete.php` · `share_preview.php`

#### `/api/ads/` — 광고
`create_ad.php` · `update_ad.php` · `delete_ad.php` · `get_ads.php` · `list_ads.php` · `track.php` · `track_click.php` · `reorder_ads.php` · `copy_ad.php` · `batch_update_ads.php` · `campaign_api.php` · `ad_report.php` · `ad_share_create.php` · `ad_share_report.php` · `campaign_share_report.php` · `ad_export_excel.php` · `ad_share_export.php` · `adsense_config.php`

#### `/api/notifications/` — 알림
`get_notifications.php` · `mark_read.php` · `delete_read.php` · `push_subscription.php` · `send_push.php` · `send_email.php` · `notification_settings.php` · `alert_preferences.php` · `email_templates.php` · `trigger_alerts.php`

#### `/api/email/` — 이메일 마케팅
`send_marketing_email.php` · `get_campaigns.php` · `get_recipients.php` · `upload_image.php` · `unsubscribe.php`

#### `/api/proposals/` — 제안서
`proposals.php` · `respond_proposal.php` · `cancel_proposal.php`

#### `/api/shipments/` — 배송
`shipments.php` · `shipment_detail.php` · `update_shipment.php`

#### `/api/settlements/` — 정산
`settlements.php` · `update_settlement.php`

#### `/api/promotions/` — 프로모션
`get_promotions.php` · `get_admin_promotions.php` · `set_promotion.php` · `remove_promotion.php`

#### `/api/popups/` — 팝업
`popups.php`

#### `/api/trash/` — 휴지통
`list_trash.php` · `move_to_trash.php` · `restore.php` · `permanent_delete.php`

#### `/api/admin/` — 관리자 전용
`active_users.php` · `menu_visibility.php` · `security_audit.php` · `security_flags.php` · `security_settings.php`

#### `/api/currency/` — 환율
`rates.php`

#### `/api/menu/` — 메뉴 표시
`get_menu_visibility.php`

#### `/api/utils/` — 유틸
`geocode.php` · `batch_geocode.php` · `backfill_geocode.php` · `session_role.php`

#### `/api/calc-stats/` — 마진 계산 통계
`get_stats.php` · `track.php`

#### `/api/wishlist/` — 위시리스트
`get_wishlist.php` · `toggle_wishlist.php`

#### `/api/migrations/` — DB 마이그레이션 (일회성)
`add_category_to_users.php` · `add_commission_to_venues.php` · `add_locale_to_users.php` · `add_push_subscriptions.php` · `add_size_to_venues.php` · `create_ad_analytics_tables.php` · `create_ads_tables.php` · `create_payments_tables.php` · `create_seller_stats_table.php` · `update_type_column.php` · `upgrade_demo_admin.php` · `run_migration.php`

---

## 5. 다국어 (i18n)

**지원 언어 11개**: `ko` · `en` · `en-CA` · `en-GB` · `fr-CA` · `ja` · `km` · `ru` · `th` · `uk` · `vi`

**네임스페이스 (각 언어별 JSON)**:
`admin` · `ads` · `auth` · `chat` · `common` · `community` · `host` · `landing` · `legal` · `seller` · `venue`

**위치**: `public/locales/{lang}/{namespace}.json`  
**초기화**: `src/i18n.js`  
**규칙**: 어떤 문자열이든 추가/수정 시 **11개 언어 모두** 동기화

---

## 6. 빌드 & 배포

| 명령 | 설명 |
|------|------|
| `npm run dev` | 로컬 개발 서버 |
| `npm run build` | 프로덕션 빌드 → `dist/` |
| GitHub Actions | push to `main` → Cafe24 SFTP 자동 배포 |

**빌드 청크 분리** (vite.config.js):
- `vendor-xlsx` — xlsx 라이브러리
- `vendor-icons` — lucide-react
- `vendor-i18n` — i18next 관련

**PHP만 수정**: `public/api/` → Cafe24 `www/api/` FTP 업로드  
**React 수정**: `npm run build` → `dist/` 통째로 `www/`에 업로드

---

## 7. 주요 설정 파일

| 파일 | 역할 |
|------|------|
| `vite.config.js` | 빌드 설정 (청크, 압축, sourcemap) |
| `postcss.config.js` | TailwindCSS PostCSS 설정 |
| `.eslintrc.cjs` | ESLint 규칙 |
| `index.html` | HTML 진입점 |
| `public/.htaccess` | Apache 라우팅 설정 |
| `public/api/.htaccess` | API 접근 제어 |
| `public/manifest.json` | PWA 매니페스트 |
| `public/service-worker.js` | 서비스 워커 (PWA) |
| `.github/workflows/deploy.yml` | GitHub Actions 배포 |
| `scripts/deploy.cjs` | SFTP 배포 스크립트 |
| `scripts/add_translations.cjs` | 번역 추가 스크립트 |
| `docs/critical.md` | 개발·배포 핵심 규칙 |

---

## 8. 기타 디렉토리

| 경로 | 설명 |
|------|------|
| `docs/` | 배포 로그(`DEPLOY_YYYY-MM-DD.md`) + `critical.md` |
| `marketing/` | 마케팅 관련 독립 스크립트 (PHP API + JS) |
| `other service/` | 셀러 마진 계산기 (별도 Vite 프로젝트) |
| `dist/` | 빌드 결과물 (커밋 포함 — 배포용) |
| `.claude/` | Claude Code 설정 |
| `.cursor/` | Cursor IDE 규칙 |

---

## 9. 수정 시 체크리스트

- [ ] 이 파일(`docs/source-map.md`) 에서 관련 파일 위치 확인
- [ ] 다국어 문자열 추가/수정 → `public/locales/` 11개 언어 동기화
- [ ] PHP API 수정 → `dist/api/`도 같이 수정 (또는 빌드 후 덮어쓰기)
- [ ] React 컴포넌트 수정 → `npm run build` 후 `dist/` 커밋
- [ ] 수정 내역 → `docs/DEPLOY_YYYY-MM-DD.md` 기록
- [ ] `docs/source-map.md` 내용이 변경됐으면 이 파일도 갱신

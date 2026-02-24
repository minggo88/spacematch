-- =====================================================
-- SpaceMatch 마케팅 모듈 DB 마이그레이션
-- 실행: MySQL 8.0+
-- =====================================================
-- 1) 마케팅 캠페인
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL COMMENT 'seller_coupon, seller_flash_sale, vendor_ad 등',
    side ENUM('seller', 'vendor') NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'draft',
    owner_id INT NOT NULL,
    budget_total DECIMAL(15, 2) DEFAULT 0,
    budget_daily DECIMAL(15, 2) DEFAULT 0,
    budget_spent DECIMAL(15, 2) DEFAULT 0,
    targeting JSON DEFAULT NULL,
    settings JSON DEFAULT NULL,
    start_date DATETIME DEFAULT NULL,
    end_date DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_owner (owner_id),
    INDEX idx_status (status),
    INDEX idx_side (side)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 2) 마케팅 쿠폰
CREATE TABLE IF NOT EXISTS marketing_coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    type ENUM(
        'percentage',
        'fixed',
        'free_shipping',
        'buy_x_get_y'
    ) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase DECIMAL(15, 2) DEFAULT 0,
    max_discount DECIMAL(15, 2) DEFAULT NULL,
    usage_limit INT DEFAULT NULL,
    usage_per_user INT DEFAULT 1,
    usage_count INT DEFAULT 0,
    status ENUM('active', 'expired', 'exhausted', 'disabled') DEFAULT 'active',
    valid_from DATETIME DEFAULT NULL,
    valid_until DATETIME DEFAULT NULL,
    applicable_categories JSON DEFAULT NULL,
    applicable_countries JSON DEFAULT NULL,
    owner_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_owner (owner_id),
    INDEX idx_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 3) 쿠폰 사용 기록
CREATE TABLE IF NOT EXISTS marketing_coupon_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT NOT NULL,
    user_id INT NOT NULL,
    order_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES marketing_coupons(id),
    INDEX idx_coupon (coupon_id),
    INDEX idx_user (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 4) 타임세일
CREATE TABLE IF NOT EXISTS marketing_flash_sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type ENUM(
        'flash_sale',
        'happy_hour',
        'daily_deal',
        'weekend_special'
    ) DEFAULT 'flash_sale',
    discount_rate DECIMAL(5, 2) NOT NULL,
    status ENUM('scheduled', 'active', 'ended', 'cancelled') DEFAULT 'scheduled',
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    stock_limit INT DEFAULT NULL,
    per_user_limit INT DEFAULT 1,
    sold_count INT DEFAULT 0,
    applicable_items JSON DEFAULT NULL,
    owner_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_owner (owner_id),
    INDEX idx_status (status),
    INDEX idx_time (start_time, end_time)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 5) 번들 딜
CREATE TABLE IF NOT EXISTS marketing_bundle_deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type ENUM('fixed_bundle', 'mix_match', 'tiered', 'bogo') DEFAULT 'fixed_bundle',
    items JSON NOT NULL COMMENT '번들 구성 아이템',
    discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
    discount_value DECIMAL(10, 2) NOT NULL,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    valid_from DATETIME DEFAULT NULL,
    valid_until DATETIME DEFAULT NULL,
    owner_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_owner (owner_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 6) 광고 캠페인 (벤더)
CREATE TABLE IF NOT EXISTS marketing_ad_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    objective ENUM(
        'awareness',
        'traffic',
        'conversion',
        'retargeting',
        'branding'
    ) DEFAULT 'awareness',
    status VARCHAR(30) DEFAULT 'draft',
    budget DECIMAL(15, 2) DEFAULT 0,
    spent DECIMAL(15, 2) DEFAULT 0,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    revenue DECIMAL(15, 2) DEFAULT 0,
    placements JSON DEFAULT NULL,
    targeting JSON DEFAULT NULL,
    creatives JSON DEFAULT NULL,
    start_date DATETIME DEFAULT NULL,
    end_date DATETIME DEFAULT NULL,
    owner_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_owner (owner_id),
    INDEX idx_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 7) 스폰서 리스팅
CREATE TABLE IF NOT EXISTS marketing_sponsored_listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venue_id INT DEFAULT NULL,
    plan ENUM('basic', 'premium', 'enterprise') DEFAULT 'basic',
    keywords JSON DEFAULT NULL,
    bid_amount DECIMAL(10, 2) DEFAULT 0,
    daily_budget DECIMAL(10, 2) DEFAULT 0,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    status ENUM('active', 'paused', 'ended') DEFAULT 'active',
    start_date DATETIME DEFAULT NULL,
    end_date DATETIME DEFAULT NULL,
    owner_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_owner (owner_id),
    INDEX idx_venue (venue_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 8) 배너 광고
CREATE TABLE IF NOT EXISTS marketing_banner_ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slot VARCHAR(50) NOT NULL COMMENT 'hero, sidebar, search_top 등',
    creative_url VARCHAR(500) DEFAULT NULL,
    click_url VARCHAR(500) DEFAULT NULL,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    weight INT DEFAULT 1 COMMENT '로테이션 가중치',
    status ENUM('active', 'paused', 'ended') DEFAULT 'active',
    start_date DATETIME DEFAULT NULL,
    end_date DATETIME DEFAULT NULL,
    owner_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_owner (owner_id),
    INDEX idx_slot (slot)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 9) A/B 테스트
CREATE TABLE IF NOT EXISTS marketing_ab_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    element VARCHAR(50) NOT NULL COMMENT 'headline, image, cta 등',
    status ENUM('draft', 'running', 'concluded') DEFAULT 'draft',
    variants JSON NOT NULL COMMENT '변형 목록',
    traffic_split JSON DEFAULT NULL,
    results JSON DEFAULT NULL,
    winner_variant VARCHAR(50) DEFAULT NULL,
    confidence DECIMAL(5, 2) DEFAULT NULL,
    owner_id INT NOT NULL,
    started_at DATETIME DEFAULT NULL,
    concluded_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_owner (owner_id),
    INDEX idx_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 10) 알림 기록
CREATE TABLE IF NOT EXISTS marketing_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    channel ENUM('in_app', 'email', 'push', 'sms') DEFAULT 'in_app',
    title VARCHAR(300) DEFAULT NULL,
    body TEXT DEFAULT NULL,
    status ENUM('pending', 'sent', 'failed', 'read') DEFAULT 'pending',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    metadata JSON DEFAULT NULL,
    sent_at DATETIME DEFAULT NULL,
    read_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 완료
SELECT 'Marketing module migration completed!' AS result;
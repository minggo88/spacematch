import React, { useState, useEffect, useCallback, useMemo, useRef, startTransition } from 'react';
import {
    TrendingUp, Plus, X, Edit3, Trash2, Calendar, DollarSign,
    Users, ShoppingCart, Star, MapPin, Store, FileText, Save,
    BarChart3, Package, Clock, CalendarDays, CalendarRange,
    ChevronDown, ChevronRight, ArrowUp, ArrowDown, Target, Zap,
    Upload, FolderUp, CheckCircle, AlertCircle, AlertTriangle, RotateCcw, Download, Loader2,
    Wallet, Receipt, PieChart, CreditCard, Banknote, Truck, Megaphone, Wrench, Coffee, Phone, Tag,
    Globe, Trophy, Layers, Check
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import CustomerTab from './CustomerTab';
import ConfirmModal from '../../components/ConfirmModal';
import NumberInput from '../../components/NumberInput';

const API_BASE = '/api/users';

const COLORS = {
    primary: '#059669',
    primaryLight: '#10b981',
    primaryBg: '#ecfdf5',
    accent: '#0d9488',
    dark: '#064e3b',
};

const HOST_COUNTRIES = [
    { code: 'KR', name: '한국', flag: '🇰🇷' },
    { code: 'US', name: 'English', flag: '🇺🇸' },
    { code: 'GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'JP', name: '日本語', flag: '🇯🇵' },
    { code: 'VN', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'TH', name: 'ภาษาไทย', flag: '🇹🇭' },
    { code: 'KH', name: 'ខ្មែរ', flag: '🇰🇭' },
    { code: 'RU', name: 'Русский', flag: '🇷🇺' },
    { code: 'UA', name: 'Українська', flag: '🇺🇦' },
];

// ── Country code → Currency mapping ──
const COUNTRY_CURRENCY = {
    KR: { code: 'KRW', symbol: '₩' },
    US: { code: 'USD', symbol: '$' },
    GB: { code: 'GBP', symbol: '£' },
    CA: { code: 'CAD', symbol: 'C$' },
    JP: { code: 'JPY', symbol: '¥' },
    VN: { code: 'VND', symbol: '₫' },
    TH: { code: 'THB', symbol: '฿' },
    KH: { code: 'KHR', symbol: '៛' },
    RU: { code: 'RUB', symbol: '₽' },
    UA: { code: 'UAH', symbol: '₴' },
};

// ── Country-specific region data ──
const COUNTRY_REGIONS = {
    KR: {
        keys: ['regionSeoul', 'regionGyeonggi', 'regionIncheon', 'regionBusan', 'regionDaegu',
            'regionDaejeon', 'regionGwangju', 'regionUlsan', 'regionSejong', 'regionGangwon',
            'regionChungbuk', 'regionChungnam', 'regionJeonbuk', 'regionJeonnam',
            'regionGyeongbuk', 'regionGyeongnam', 'regionJeju'],
        detailPlaceholder: '예: 강남역 3번출구, 홍대 거리 등',
    },
    JP: {
        keys: ['regionJP_Hokkaido', 'regionJP_Tohoku', 'regionJP_Kanto', 'regionJP_Chubu',
            'regionJP_Kansai', 'regionJP_Chugoku', 'regionJP_Shikoku', 'regionJP_Kyushu'],
        detailPlaceholder: '예: 도쿄 시부야, 오사카 난바 등',
    },
    US: {
        keys: ['regionUS_Northeast', 'regionUS_Southeast', 'regionUS_Midwest', 'regionUS_Southwest',
            'regionUS_West', 'regionUS_Northwest', 'regionUS_MidAtlantic', 'regionUS_GreatPlains',
            'regionUS_Hawaii'],
        detailPlaceholder: '예: New York Manhattan, LA Downtown 등',
    },
    GB: {
        keys: ['regionGB_England', 'regionGB_Scotland', 'regionGB_Wales', 'regionGB_NIreland'],
        detailPlaceholder: '예: London Shoreditch, Edinburgh 등',
    },
    CA: {
        keys: ['regionCA_Ontario', 'regionCA_Quebec', 'regionCA_BC', 'regionCA_Alberta',
            'regionCA_Prairies', 'regionCA_Atlantic'],
        detailPlaceholder: '예: Toronto Downtown, Vancouver 등',
    },
    SG: {
        keys: ['regionSG_Central', 'regionSG_East', 'regionSG_West', 'regionSG_North', 'regionSG_Northeast'],
        detailPlaceholder: '예: Orchard Road, Marina Bay 등',
    },
    VN: {
        keys: ['regionVN_North', 'regionVN_NorthCentral', 'regionVN_CentralCoast',
            'regionVN_CentralHighlands', 'regionVN_Southeast', 'regionVN_MekongDelta'],
        detailPlaceholder: '예: 호찌민 1군, 하노이 호안끼엠 등',
    },
    TH: {
        keys: ['regionTH_Bangkok', 'regionTH_Central', 'regionTH_North', 'regionTH_Northeast',
            'regionTH_East', 'regionTH_South'],
        detailPlaceholder: '예: 방콕 수쿰빗, 치앙마이 올드타운 등',
    },
    KH: {
        keys: ['regionKH_PhnomPenh', 'regionKH_West', 'regionKH_Coastal', 'regionKH_Northeast'],
        detailPlaceholder: '예: 프놈펜 BKK1, 시엠립 등',
    },
    RU: {
        keys: ['regionRU_Central', 'regionRU_Northwest', 'regionRU_Southern', 'regionRU_VolGA',
            'regionRU_Ural', 'regionRU_Siberian', 'regionRU_FarEast', 'regionRU_Caucasus'],
        detailPlaceholder: '예: 모스크바 아르바트, 상트페테르부르크 등',
    },
    UA: {
        keys: ['regionUA_Kyiv', 'regionUA_West', 'regionUA_Central', 'regionUA_South', 'regionUA_East'],
        detailPlaceholder: '예: 키이우 흐레샤티크, 리비우 등',
    },
};

const SellerStats = ({ userRole = 'seller' }) => {
    const { user } = useAuth();
    const { showToast, toast: toastCtx } = useToast();
    const toastFn = useCallback((opts) => {
        if (opts && toastCtx) toastCtx[opts.type]?.(opts.message);
    }, [toastCtx]);
    const { t, i18n } = useTranslation('seller');
    const { currency, currencies, convert, formatCurrency: fmtCurrency, formatCurrencyCompact } = useCurrency();
    const currencySymbol = currencies[currency]?.symbol || '₩';

    // ── Dynamic API endpoints based on role ──
    const isHostMode = userRole === 'host';
    const STATS_API = isHostMode ? 'host_stats.php' : 'seller_stats.php';
    const TAX_API = isHostMode ? 'host_tax.php' : 'seller_tax.php';

    // ── Host: Country selection ──
    const [selectedCountry, setSelectedCountry] = useState('KR');
    const [countryBreakdown, setCountryBreakdown] = useState([]);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showTabPicker, setShowTabPicker] = useState(false);
    const countryPickerRef = useRef(null);
    const tabPickerRef = useRef(null);

    // ── Country-specific currency symbol ──
    const countryCurrency = COUNTRY_CURRENCY[selectedCountry] || COUNTRY_CURRENCY.KR;
    const countryCurrencySymbol = countryCurrency.symbol;

    // ── Product Category Options (15 + Other) ──
    const PRODUCT_CATEGORIES = [
        { value: t('statsPage.catFashion'), label: t('statsPage.catFashion') },
        { value: t('statsPage.catAccessory'), label: t('statsPage.catAccessory') },
        { value: t('statsPage.catBeauty'), label: t('statsPage.catBeauty') },
        { value: t('statsPage.catHandmade'), label: t('statsPage.catHandmade') },
        { value: t('statsPage.catFood'), label: t('statsPage.catFood') },
        { value: t('statsPage.catLiving'), label: t('statsPage.catLiving') },
        { value: t('statsPage.catArt'), label: t('statsPage.catArt') },
        { value: t('statsPage.catDigital'), label: t('statsPage.catDigital') },
        { value: t('statsPage.catCandle'), label: t('statsPage.catCandle') },
        { value: t('statsPage.catFlower'), label: t('statsPage.catFlower') },
        { value: t('statsPage.catVintage'), label: t('statsPage.catVintage') },
        { value: t('statsPage.catKids'), label: t('statsPage.catKids') },
        { value: t('statsPage.catPet'), label: t('statsPage.catPet') },
        { value: t('statsPage.catStationery'), label: t('statsPage.catStationery') },
        { value: t('statsPage.catHealth'), label: t('statsPage.catHealth') },
        { value: 'other', label: t('statsPage.catOtherInput') },
    ];

    const VENUE_TYPE_OPTIONS = [
        { value: 'popup', label: t('statsPage.venuePopup') },
        { value: 'fleamarket', label: t('statsPage.venueFlea') },
        { value: 'gallery', label: t('statsPage.venueGallery') },
        { value: 'showroom', label: t('statsPage.venueShowroom') },
        { value: 'cafe', label: t('statsPage.venueCafe') },
        { value: 'store', label: t('statsPage.venueStore') },
        { value: 'online', label: t('statsPage.venueOnline') },
        { value: 'other', label: t('statsPage.venueOther') },
    ];

    // ── Dynamic region options based on country ──
    const activeCountry = selectedCountry;
    const countryRegionData = COUNTRY_REGIONS[activeCountry] || COUNTRY_REGIONS['KR'];
    const REGION_OPTIONS = countryRegionData.keys.map(k => t(`statsPage.${k}`));
    const regionDetailPlaceholder = countryRegionData.detailPlaceholder || '상세 지역 정보';

    // ── Reverse-mapping: translate DB-stored Korean values to current language ──
    const CATEGORY_KEYS = [
        'catFashion', 'catAccessory', 'catBeauty', 'catHandmade', 'catFood', 'catLiving',
        'catArt', 'catDigital', 'catCandle', 'catFlower', 'catVintage', 'catKids',
        'catPet', 'catStationery', 'catHealth'
    ];
    const REGION_KEYS = Object.values(COUNTRY_REGIONS).flatMap(cr => cr.keys);

    // Build Korean → translation-key map (only once per render via useMemo)
    const translateDbValue = useMemo(() => {
        // Get Korean values for all known categories and regions
        const koMap = {};
        CATEGORY_KEYS.forEach(k => {
            // i18n.getFixedT('ko', 'seller') gives Korean translation
            const koVal = i18n.getFixedT('ko', 'seller')(`statsPage.${k}`);
            koMap[koVal] = `statsPage.${k}`;
        });
        REGION_KEYS.forEach(k => {
            const koVal = i18n.getFixedT('ko', 'seller')(`statsPage.${k}`);
            koMap[koVal] = `statsPage.${k}`;
        });
        return (dbValue) => {
            if (!dbValue) return dbValue;
            const key = koMap[dbValue];
            return key ? t(key) : dbValue;
        };
    }, [i18n.language]);

    const PERIOD_TABS = [
        { key: 'dashboard', label: t('statsPage.tabDashboard'), icon: BarChart3 },
        { key: 'analytics', label: t('statsPage.tabAnalytics', '📊 분석'), icon: TrendingUp },
        { key: 'sales', label: t('statsPage.tabSales', '💰 매출'), icon: TrendingUp },
        { key: 'expense', label: t('statsPage.tabExpense', '💸 지출'), icon: Wallet },
        { key: 'upload', label: t('statsPage.tabUpload', '📁 업로드'), icon: Upload },
        { key: 'tax', label: t('statsPage.tabTax', '💰 세무'), icon: DollarSign },
        { key: 'customers', label: t('statsPage.tabCustomers', '👤 고객'), icon: Users },
    ];
    const [allStats, setAllStats] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    // ── Chart Period Filter ──
    const [chartRange, setChartRange] = useState(14); // 7, 14, 30
    const [chartOffset, setChartOffset] = useState(0); // 0 = latest, 1 = previous period, etc.
    const [dashboardYear, setDashboardYear] = useState(new Date().getFullYear());
    const [customDateStart, setCustomDateStart] = useState('');
    const [customDateEnd, setCustomDateEnd] = useState('');
    const [recordsPage, setRecordsPage] = useState(1); // pagination for records list
    const RECORDS_PER_PAGE = 20;
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [sortField, setSortField] = useState('record_date');
    const [sortDir, setSortDir] = useState('desc');
    const [salesDateStart, setSalesDateStart] = useState('');
    const [salesDateEnd, setSalesDateEnd] = useState('');
    const [showSalesDatePicker, setShowSalesDatePicker] = useState(false);
    const [expDateStart, setExpDateStart] = useState('');
    const [expDateEnd, setExpDateEnd] = useState('');
    const [showExpDatePicker, setShowExpDatePicker] = useState(false);
    const [chartViewMode, setChartViewMode] = useState('both'); // 'chart' | 'table' | 'both'
    const [trendSortField, setTrendSortField] = useState('label'); // 'label' | 'revenue'
    const [trendSortDir, setTrendSortDir] = useState('asc');
    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    // ── Sales Tab Internal State ──
    const [salesView, setSalesView] = useState('daily'); // 'daily' | 'monthly' | 'annual'
    const [salesChartRange, setSalesChartRange] = useState(14);
    const [salesChartOffset, setSalesChartOffset] = useState(0);
    const [salesChartMode, setSalesChartMode] = useState('chart'); // 'chart' | 'table' | 'both'

    // ── Upload Tab State ──
    const [uploadStep, setUploadStep] = useState('select'); // select | mapping | preview | importing | done
    const [uploadFile, setUploadFile] = useState(null);
    const [parsedHeaders, setParsedHeaders] = useState([]);
    const [parsedRows, setParsedRows] = useState([]);
    const [columnMapping, setColumnMapping] = useState({});
    const [erpTemplates, setErpTemplates] = useState({});
    const [selectedTemplate, setSelectedTemplate] = useState('generic');
    const [uploadCurrency, setUploadCurrency] = useState('KRW');
    const [uploadChannel, setUploadChannel] = useState('');
    const [uploadRecordType, setUploadRecordType] = useState('daily');
    const [importResult, setImportResult] = useState(null);
    const [importHistory, setImportHistory] = useState([]);
    const [selectedBatchIds, setSelectedBatchIds] = useState(new Set());
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [importing, setImporting] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);
    // ── Multi-sheet support ──
    const workbookRef = useRef(null);
    const [sheetInfo, setSheetInfo] = useState([]); // [{name, rowCount}]
    const [uploadDuplicateMode, setUploadDuplicateMode] = useState('overwrite'); // overwrite | skip | append
    const [uploadDataType, setUploadDataType] = useState('sales'); // 'sales' | 'expense'

    // ── Auto-detect: Sales vs Expense ──
    const EXPENSE_KEYWORDS = /지출|비용|expense|cost|경비|rent|임대|수수료|commission|교통|통신|식비|유지보수|maintenance|세금|insurance|보험|광고|마케팅|복리후생|소모품|수도|전기|가스|공급가|부가세|단가|거래처|지출분류|지출항목|계정과목/i;
    const SALES_KEYWORDS = /매출|revenue|sales|주문|order|판매|고객|customer|상품|product|sku|환불|refund|정산|settlement/i;

    const detectDataType = (headers) => {
        let salesScore = 0, expenseScore = 0;
        const combined = headers.join(' ');

        // Check each header
        headers.forEach(h => {
            const hl = h.toLowerCase().trim();
            if (EXPENSE_KEYWORDS.test(hl)) expenseScore += 2;
            if (SALES_KEYWORDS.test(hl)) salesScore += 2;
        });

        // Check combined text for broader patterns
        if (EXPENSE_KEYWORDS.test(combined)) expenseScore += 1;
        if (SALES_KEYWORDS.test(combined)) salesScore += 1;

        // Expense-specific column patterns
        const hasDate = headers.some(h => /date|날짜|일자|일시/i.test(h));
        const hasAmount = headers.some(h => /amount|금액|지출|비용|가격|price|cost|expense|합계/i.test(h));
        const hasCategory = headers.some(h => /category|카테고리|분류|항목|type/i.test(h));
        const hasPayment = headers.some(h => /payment|method|결제|수단/i.test(h));
        const hasMemo = headers.some(h => /memo|메모|비고|note|description|설명|내용/i.test(h));

        // Expense-specific unique columns (supply amount, VAT, unit price, vendor)
        const hasSupplyAmount = headers.some(h => /공급가|공급금|supply/i.test(h));
        const hasVat = headers.some(h => /부가세|부가가치세|vat|세액/i.test(h));
        const hasUnitPrice = headers.some(h => /단가|unit.*price/i.test(h));
        const hasVendor = headers.some(h => /거래처|업체|상호|사용처|이용처|가맹점|vendor|supplier|merchant/i.test(h));
        const hasExpenseClass = headers.some(h => /지출분류|지출구분|비용분류|비용구분|계정과목/i.test(h));
        const hasExpenseItem = headers.some(h => /지출항목|비용항목|지출내역/i.test(h));

        // Strong expense signals
        if (hasSupplyAmount) expenseScore += 3;
        if (hasVat) expenseScore += 3;
        if (hasUnitPrice) expenseScore += 2;
        if (hasVendor) expenseScore += 3;
        if (hasExpenseClass) expenseScore += 4;
        if (hasExpenseItem) expenseScore += 4;

        // Expense pattern: date + amount + (category or payment or memo or vendor)
        if (hasDate && hasAmount && (hasCategory || hasPayment || hasMemo || hasVendor)) {
            expenseScore += 3;
        }

        // Sales-specific: needs revenue/order/product fields (not just quantity)
        const hasRevenue = headers.some(h => /매출|revenue|sales|정산/i.test(h));
        const hasOrder = headers.some(h => /주문|order/i.test(h));
        const hasProduct = headers.some(h => /상품|product|sku/i.test(h));
        if (hasRevenue) salesScore += 3;
        if (hasOrder) salesScore += 2;
        // Quantity only counts as sales if combined with product/order context
        const hasQty = headers.some(h => /수량|quantity|qty/i.test(h));
        if (hasQty && (hasProduct || hasOrder || hasRevenue)) salesScore += 2;

        console.log(`[Upload] Data type detection — Sales: ${salesScore}, Expense: ${expenseScore}`);
        return expenseScore > salesScore ? 'expense' : 'sales';
    };

    // ── Expense fields for upload mapping ──
    const UPLOAD_EXPENSE_FIELDS = [
        { key: '', label: t('statsPage.uploadSkip', '— 건너뛰기 —') },
        { key: 'expense_date', label: t('statsPage.expFieldDate', '지출 날짜') },
        { key: 'transaction_no', label: t('statsPage.expFieldTxNo', '거래 번호') },
        { key: 'expense_class', label: t('statsPage.expFieldClass', '지출 분류') },
        { key: 'expense_item', label: t('statsPage.expFieldItem', '지출 항목') },
        { key: 'vendor', label: t('statsPage.expFieldVendor', '거래처') },
        { key: 'quantity', label: t('statsPage.expFieldQty', '수량') },
        { key: 'unit', label: t('statsPage.expFieldUnit', '단위') },
        { key: 'unit_price', label: t('statsPage.expFieldUnitPrice', '단가') },
        { key: 'supply_amount', label: t('statsPage.expFieldSupply', '공급가액') },
        { key: 'vat', label: t('statsPage.expFieldVat', '부가세') },
        { key: 'amount', label: t('statsPage.expFieldAmount', '합계금액') },
        { key: 'category', label: t('statsPage.expFieldCategory', '카테고리') },
        { key: 'payment_method', label: t('statsPage.expFieldPayment', '결제수단') },
        { key: 'memo', label: t('statsPage.expFieldMemo', '비고') },
    ];

    // ── Comprehensive expense column auto-mapping with fuzzy keyword matching ──
    const EXPENSE_FIELD_KEYWORDS = {
        expense_date: {
            exact: ['date', '날짜', '일자', '일시', '지출일', '지출일자', '사용일', '사용일자', '거래일', '거래일자', '결제일', '결제일자', '발생일', '이용일', '이용일자', '승인일', '승인일자', '매입일'],
            partial: ['date', '날짜', '일자', '일시'],
            exclude: ['업데이트', 'update'],
        },
        transaction_no: {
            exact: ['거래번호', '전표번호', '승인번호', '카드승인번호', '영수증번호', 'transaction_no', 'tx_no', 'receipt_no', 'approval_no'],
            partial: ['거래번호', '전표', '승인번호', '영수증', 'transaction', 'receipt', 'approval.*no'],
            exclude: [],
        },
        expense_class: {
            exact: ['분류', '지출분류', '비용분류', '대분류', '중분류', 'class', 'classification', 'type', '유형', '구분', '지출구분', '비용구분'],
            partial: ['분류', 'class', 'type', '유형'],
            exclude: ['항목', 'item', '품목'],
        },
        expense_item: {
            exact: ['항목', '지출항목', '비용항목', '품목', '품명', '상품명', '물품명', '내역', '거래내역', '지출내역', '사용내역', '적요', 'item', 'description', 'particular', '세부내역', '세부항목'],
            partial: ['항목', '품목', '품명', '내역', '적요', 'item', 'particular', 'description'],
            exclude: [],
        },
        vendor: {
            exact: ['거래처', '거래처명', '업체', '업체명', '상호', '상호명', '사용처', '이용처', '가맹점', '가맹점명', '매장', '매장명', 'vendor', 'supplier', 'merchant', 'store', '점포', '점포명'],
            partial: ['거래처', '업체', '상호', '사용처', '이용처', '가맹점', 'vendor', 'supplier', 'merchant'],
            exclude: [],
        },
        quantity: {
            exact: ['수량', 'qty', 'quantity', '건수', '매수', '개수'],
            partial: ['수량', 'qty', 'quantity'],
            exclude: ['단가', 'price', '금액'],
        },
        unit: {
            exact: ['단위', 'unit'],
            partial: ['단위'],
            exclude: ['단가', 'price', '금액'],
        },
        unit_price: {
            exact: ['단가', '개당가격', 'unit_price', 'unitprice'],
            partial: ['단가', 'unit.*price'],
            exclude: [],
        },
        supply_amount: {
            exact: ['공급가액', '공급가', '공급금액', 'supply_amount', 'net_amount', '과세표준'],
            partial: ['공급가', 'supply', 'net.*amount'],
            exclude: [],
        },
        vat: {
            exact: ['부가세', '부가가치세', 'vat', '세액', 'tax', '세금'],
            partial: ['부가세', 'vat', '세액'],
            exclude: ['공급'],
        },
        amount: {
            exact: ['합계', '합계금액', '총액', '총금액', '금액', '결제금액', '이용금액', '사용금액', '지출금액', '결제액', '청구금액', '출금액', 'total', 'amount', '원화금액', '원화', '매입금액', '승인금액', '지급액', '비용', '지출액', 'price', 'cost', 'expense', 'total_amount', '카드사용금액', '카드이용금액'],
            partial: ['합계', '총액', '금액', '결제금', '이용금', '사용금', '지출금', '출금', '청구금', 'total', 'amount', '비용', 'price', 'cost', 'expense'],
            exclude: ['공급가', '부가세', '단가', '할인', 'discount', '수량'],
        },
        category: {
            exact: ['카테고리', 'category', '비용카테고리', '지출카테고리', '계정과목', '계정', '과목'],
            partial: ['카테고리', 'category', '계정.*과목', '계정'],
            exclude: [],
        },
        payment_method: {
            exact: ['결제수단', '결제방법', '지불방법', '지불수단', 'payment_method', 'payment', '카드종류', '카드사', '결제유형', '지급방법', '출금수단'],
            partial: ['결제수단', '결제방법', '지불', 'payment', '카드종류', '카드사'],
            exclude: ['금액', 'amount', '일자', 'date'],
        },
        memo: {
            exact: ['메모', '비고', '비고사항', '참고', '참고사항', 'memo', 'note', 'notes', 'remark', 'remarks', '설명', '기타', '코멘트', 'comment'],
            partial: ['메모', '비고', '참고', 'memo', 'note', 'remark', '코멘트', 'comment'],
            exclude: [],
        },
    };

    const autoMapExpenseColumnsUpload = (headers) => {
        const mapping = {};
        const usedFields = new Set();

        // Phase 1: Exact match
        headers.forEach((h, idx) => {
            if (mapping[idx]) return;
            const hl = h.toLowerCase().trim().replace(/[\s_-]+/g, '');
            for (const [field, kw] of Object.entries(EXPENSE_FIELD_KEYWORDS)) {
                if (usedFields.has(field)) continue;
                const matched = kw.exact.some(k => {
                    const kn = k.toLowerCase().replace(/[\s_-]+/g, '');
                    return hl === kn;
                });
                if (matched) {
                    // Check exclusion
                    const excluded = kw.exclude.some(ex => hl.includes(ex.toLowerCase()));
                    if (!excluded) {
                        mapping[idx] = field;
                        usedFields.add(field);
                        break;
                    }
                }
            }
        });

        // Phase 2: Partial / contains match
        headers.forEach((h, idx) => {
            if (mapping[idx]) return;
            const hl = h.toLowerCase().trim();
            let bestField = null;
            let bestScore = 0;
            for (const [field, kw] of Object.entries(EXPENSE_FIELD_KEYWORDS)) {
                if (usedFields.has(field)) continue;
                // Check exclusion first
                const excluded = kw.exclude.some(ex => hl.includes(ex.toLowerCase()));
                if (excluded) continue;
                let score = 0;
                for (const pattern of kw.partial) {
                    try {
                        if (new RegExp(pattern.toLowerCase(), 'i').test(hl)) {
                            score = Math.max(score, pattern.length);
                        }
                    } catch {
                        if (hl.includes(pattern.toLowerCase())) {
                            score = Math.max(score, pattern.length);
                        }
                    }
                }
                if (score > bestScore) {
                    bestScore = score;
                    bestField = field;
                }
            }
            if (bestField) {
                mapping[idx] = bestField;
                usedFields.add(bestField);
            }
        });

        return mapping;
    };

    const SYSTEM_FIELDS = [
        { key: '', label: t('statsPage.uploadSkip', '— 건너뛰기 —') },
        // 거래 기본 정보
        { key: 'record_date', label: t('statsPage.uploadFieldDate', '날짜') },
        { key: 'order_number', label: t('statsPage.uploadFieldOrderNo', '주문번호') },
        { key: 'transaction_count', label: t('statsPage.uploadFieldTx', '거래건수') },
        // 상품 정보
        { key: 'product_name', label: t('statsPage.uploadFieldProduct', '상품명') },
        { key: 'sku', label: t('statsPage.uploadFieldSku', 'SKU/바코드') },
        { key: 'brand', label: t('statsPage.uploadFieldBrand', '브랜드') },
        { key: 'option_info', label: t('statsPage.uploadFieldOption', '옵션정보') },
        { key: 'best_selling_item', label: t('statsPage.uploadFieldCategory', '카테고리') },
        // 수량
        { key: 'quantity_sold', label: t('statsPage.uploadFieldQty', '판매수량') },
        { key: 'return_qty', label: t('statsPage.uploadFieldReturnQty', '반품수량') },
        { key: 'customer_count', label: t('statsPage.uploadFieldCustomers', '고객수') },
        // 금액
        { key: 'monthly_revenue', label: t('statsPage.uploadFieldRevenue', '매출액') },
        { key: 'avg_unit_price', label: t('statsPage.uploadFieldUnitPrice', '단가') },
        { key: 'cost_price', label: t('statsPage.uploadFieldCost', '원가') },
        { key: 'discount_amount', label: t('statsPage.uploadFieldDiscount', '할인금액') },
        { key: 'tax_amount', label: t('statsPage.uploadFieldTax', '세금/부가세') },
        { key: 'shipping_cost', label: t('statsPage.uploadFieldShipping', '배송비') },
        { key: 'refund_amount', label: t('statsPage.uploadFieldRefund', '환불금액') },
        { key: 'commission_fee', label: t('statsPage.uploadFieldCommission', '수수료') },
        { key: 'net_revenue', label: t('statsPage.uploadFieldNetRevenue', '순매출/정산액') },
        { key: 'profit_amount', label: t('statsPage.uploadFieldProfit', '이익금') },
        { key: 'points_used', label: t('statsPage.uploadFieldPoints', '적립금/포인트') },
        // 결제 정보
        { key: 'payment_method', label: t('statsPage.uploadFieldPayment', '결제수단') },
        { key: 'payment_status', label: t('statsPage.uploadFieldPaymentStatus', '결제상태') },
        // 사람/장소
        { key: 'customer_name', label: t('statsPage.uploadFieldCustomerName', '고객명/주문자') },
        { key: 'staff_name', label: t('statsPage.uploadFieldStaff', '판매원/담당자') },
        { key: 'store_name', label: t('statsPage.uploadFieldStore', '매장명/지점') },
        { key: 'platform', label: t('statsPage.uploadFieldPlatform', '판매 플랫폼') },
        { key: 'supplier', label: t('statsPage.uploadFieldSupplier', '거래처/공급업체') },
        { key: 'sales_channel', label: t('statsPage.uploadFieldChannel', '판매채널') },
        { key: 'region', label: t('statsPage.uploadFieldRegion', '지역') },
        { key: 'venue_type', label: t('statsPage.uploadFieldVenue', '매장유형/업종') },
        { key: 'satisfaction', label: t('statsPage.uploadFieldRating', '만족도/평점') },
        // 기타
        { key: 'memo', label: t('statsPage.uploadFieldMemo', '메모/비고') },
    ];

    const CURRENCIES = ['KRW', 'USD', 'EUR', 'JPY', 'CNY', 'GBP', 'THB', 'VND', 'CAD', 'AUD', 'SGD', 'HKD', 'TWD'];

    // ── Expense Tab State ──
    const [expenses, setExpenses] = useState([]);
    const [expenseSummary, setExpenseSummary] = useState(null);
    const [expenseLoading, setExpenseLoading] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [expenseYear, setExpenseYear] = useState(new Date().getFullYear());
    const [expSortField, setExpSortField] = useState('expense_date');
    const [expSortDir, setExpSortDir] = useState('desc');
    const [expSelectedIds, setExpSelectedIds] = useState(new Set());
    const [expPage, setExpPage] = useState(1);
    const EXP_PER_PAGE = 10;
    const [expChartView, setExpChartView] = useState('daily'); // 'daily' | 'monthly' | 'annual'
    const [expChartRange, setExpChartRange] = useState(14); // days for daily, months for monthly, years for annual
    const [expChartOffset, setExpChartOffset] = useState(0); // page offset for past data
    const [expChartMode, setExpChartMode] = useState('chart'); // 'chart' | 'table' | 'both'

    const EXPENSE_CATEGORIES = [
        { key: 'materials', icon: Package, color: 'from-orange-400 to-orange-600', bg: 'bg-orange-50', text: 'text-orange-600' },
        { key: 'packaging', icon: Tag, color: 'from-pink-400 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-600' },
        { key: 'shipping', icon: Truck, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
        { key: 'booth_rental', icon: Store, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' },
        { key: 'transport', icon: MapPin, color: 'from-teal-400 to-teal-600', bg: 'bg-teal-50', text: 'text-teal-600' },
        { key: 'advertising', icon: Megaphone, color: 'from-red-400 to-red-600', bg: 'bg-red-50', text: 'text-red-600' },
        { key: 'commission', icon: Receipt, color: 'from-indigo-400 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
        { key: 'labor', icon: Users, color: 'from-amber-400 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
        { key: 'equipment', icon: Wrench, color: 'from-gray-400 to-gray-600', bg: 'bg-gray-50', text: 'text-gray-600' },
        { key: 'food', icon: Coffee, color: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-50', text: 'text-yellow-600' },
        { key: 'communication', icon: Phone, color: 'from-cyan-400 to-cyan-600', bg: 'bg-cyan-50', text: 'text-cyan-600' },
        { key: 'other', icon: FileText, color: 'from-slate-400 to-slate-600', bg: 'bg-slate-50', text: 'text-slate-600' },
    ];

    // ── Category keyword dictionary for auto-classification (used by Upload tab) ──
    const CATEGORY_KEYWORDS = {
        materials: ['재료', '원재료', '원두', '식자재', '부자재', '원료', '소재', '자재', '커피콩', '우유', '시럽', '설탕', '밀가루', '쌀', '고기', '야채', '과일', '생수', '종이컵', '빨대', '리드', '냅킨', '티슈', '세제', '세정제', '일회용', '원자재', '재고', '매입', '입고', '도매', 'material', 'ingredient', 'raw', 'supplies', 'wholesale'],
        packaging: ['포장', '박스', '봉투', '용기', '팩', '패킹', '포장재', '포장비', '비닐', '랩', '테이프', '스티커', '라벨', '태그', '쇼핑백', '종이백', '에어캡', '택배박스', 'packaging', 'package', 'wrapping', 'box', 'container', 'bag', 'label'],
        shipping: ['배송', '택배', '배달', '운송', '운반', '발송', '우편', '퀵', '화물', '물류', '해외배송', '배송대행', '풀필먼트', '배달대행', '배민', '요기요', '쿠팡이츠', '배달비', 'shipping', 'delivery', 'freight', 'postage', 'courier', 'logistics'],
        booth_rental: ['임대', '부스', '매장', '월세', '임차', '렌탈', '공간', '사무실', '보증금', '관리비', '플리마켓', '팝업', '팝업스토어', '전시', '행사장', '공유주방', '공유오피스', '창고', 'rent', 'booth', 'lease', 'rental', 'office', 'warehouse'],
        transport: ['교통', '주차', '유류', '기름', '주유', '톨게이트', '택시', '버스', '지하철', 'KTX', 'SRT', '기차', '항공', '비행기', '하이패스', '주차비', '차량유지', '렌트카', '대리운전', 'transport', 'parking', 'fuel', 'gas', 'taxi', 'fare', 'travel'],
        advertising: ['광고', '마케팅', '홍보', '프로모션', '전단', '블로그', '인스타', '페이스북', '구글', '네이버', '카카오', 'SNS', '현수막', '배너', '간판', '전단지', '명함', '인쇄', '이벤트', '쿠폰', '판촉', 'advertising', 'marketing', 'ad', 'promo', 'promotion', 'campaign'],
        commission: ['수수료', '플랫폼', '중개', '카드수수료', '결제수수료', 'PG수수료', '배달앱수수료', '마켓수수료', '판매수수료', '은행수수료', '송금수수료', '환전수수료', 'commission', 'fee', 'platform', 'VAN'],
        labor: ['인건', '급여', '임금', '아르바이트', '알바', '직원', '근로', '용역', '일용직', '파트타임', '시급', '월급', '상여', '보너스', '퇴직금', '4대보험', '프리랜서', '외주', 'labor', 'wage', 'salary', 'payroll', 'staff', 'employee', 'worker'],
        equipment: ['장비', '소모품', '비품', '도구', '공구', '기계', '수리', '유지', '설비', '시설', '인테리어', '집기', '가구', 'POS', '컴퓨터', '노트북', '프린터', '에어컨', '냉장고', '냉동고', '오븐', '커피머신', '그라인더', '정수기', '제빙기', 'CCTV', 'equipment', 'tool', 'maintenance', 'repair'],
        food: ['식비', '식대', '점심', '저녁', '간식', '음료', '커피', '다과', '회식', '야식', '직원식대', '배달음식', '음식점', '식당', '카페', '편의점', '마트', '외식', '접대비', '경조사', 'food', 'meal', 'lunch', 'dinner', 'snack', 'beverage', 'catering'],
        communication: ['통신', '전화', '인터넷', '문자', 'SMS', '데이터', '와이파이', 'WiFi', '핸드폰', '휴대폰', '서버', '호스팅', '도메인', '클라우드', '소프트웨어', '구독', '라이선스', '전기', '전기요금', '수도', '수도요금', '가스', '가스요금', '공과금', 'telecom', 'phone', 'internet', 'communication', 'utility', 'SaaS'],
    };

    const PAYMENT_METHODS = [
        { key: 'cash', icon: Banknote, label: t('statsPage.expPayCash', '현금') },
        { key: 'card', icon: CreditCard, label: t('statsPage.expPayCard', '카드') },
        { key: 'transfer', icon: DollarSign, label: t('statsPage.expPayTransfer', '이체') },
        { key: 'other', icon: Wallet, label: t('statsPage.expPayOther', '기타') },
    ];

    const getExpenseCatLabel = (key) => t(`statsPage.expCat${key.charAt(0).toUpperCase() + key.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase())}`, key);
    const getExpenseCatMeta = (key) => EXPENSE_CATEGORIES.find(c => c.key === key) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];

    // ── Expense: Fetch ──
    const fetchExpenses = useCallback(async () => {
        setExpenseLoading(true);
        try {
            const res = await fetch(`${API_BASE}/seller_expenses.php?action=list&year=${expenseYear}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setExpenses(data.expenses || []);
                setExpenseSummary({
                    categoryBreakdown: data.categoryBreakdown || [],
                    monthlyTotals: data.monthlyTotals || [],
                    totals: data.totals || { total_expense: 0, total_count: 0 },
                });
            }
        } catch { /* ignore */ }
        setExpenseLoading(false);
    }, [expenseYear]);

    useEffect(() => { if (activeTab === 'expense') { fetchExpenses(); if (allStats.length === 0) fetchStats(); } }, [activeTab, fetchExpenses]);

    // ── Expense: Save ──
    const handleSaveExpense = async (formData, isBulk = false) => {
        try {
            const res = await fetch(`${API_BASE}/seller_expenses.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action: 'save', ...formData }),
            });
            const data = await res.json();
            if (data.success) {
                if (!isBulk) {
                    showToast(t('statsPage.expSaved', '지출 저장 완료'), 'success');
                    setShowExpenseForm(false);
                    setEditingExpense(null);
                }
                fetchExpenses();
            } else {
                if (!isBulk) showToast(data.message || 'Error', 'error');
                throw new Error(data.message || 'Error');
            }
        } catch (err) {
            if (!isBulk) showToast(t('statsPage.serverError'), 'error');
            throw err;
        }
    };

    // ── Expense: Delete ──
    const handleDeleteExpense = (exp) => {
        setConfirmModal({
            title: t('statsPage.expDeleteTitle', '지출 삭제'),
            message: t('statsPage.expDeleteMsg', '이 지출 기록을 삭제하시겠습니까?'),
            type: 'danger',
            confirmLabel: t('statsPage.expDelete', '삭제'),
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const res = await fetch(`${API_BASE}/seller_expenses.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ action: 'delete', id: exp.id }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast(t('statsPage.expDeleted', '삭제 완료'), 'success');
                        fetchExpenses();
                    } else showToast(data.message, 'error');
                } catch { showToast(t('statsPage.serverError'), 'error'); }
            }
        });
    };

    // ── Expense: Bulk Delete ──
    const handleBulkDeleteExpenses = () => {
        if (expSelectedIds.size === 0) return;
        setConfirmModal({
            title: t('statsPage.expDeleteTitle', '지출 삭제'),
            message: t('statsPage.expBulkDeleteMsg', `선택된 ${expSelectedIds.size}건의 지출을 삭제하시겠습니까?`),
            type: 'danger',
            confirmLabel: t('statsPage.expDelete', '삭제'),
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const res = await fetch(`${API_BASE}/seller_expenses.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ action: 'bulk_delete', ids: [...expSelectedIds] }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast(data.message || `${data.deleted}${t('statsPage.units', '건')} ${t('statsPage.expDeleted', '삭제 완료')}`, 'success');
                        setExpSelectedIds(new Set());
                        fetchExpenses();
                    } else {
                        showToast(data.message || t('statsPage.deleteFail', '삭제 실패'), 'error');
                    }
                } catch {
                    showToast(t('statsPage.serverError'), 'error');
                }
            }
        });
    };

    // ── Tax Tab State ──
    const [taxCountry, setTaxCountry] = useState(isHostMode ? selectedCountry : 'KR');
    const [taxResult, setTaxResult] = useState(null);
    const [taxLoading, setTaxLoading] = useState(false);
    const [taxSummary, setTaxSummary] = useState(null);
    const AVAILABLE_TAX_COUNTRIES = [
        { code: 'KR', name: t('statsPage.countryKR', '한국'), flag: '🇰🇷' },
        { code: 'US', name: t('statsPage.countryUS', '미국'), flag: '🇺🇸' },
        { code: 'GB', name: t('statsPage.countryGB', '영국'), flag: '🇬🇧' },
        { code: 'CA', name: t('statsPage.countryCA', '캐나다'), flag: '🇨🇦' },
        { code: 'JP', name: t('statsPage.countryJP', '일본'), flag: '🇯🇵' },
        { code: 'VN', name: t('statsPage.countryVN', '베트남'), flag: '🇻🇳' },
        { code: 'TH', name: t('statsPage.countryTH', '태국'), flag: '🇹🇭' },
        { code: 'KH', name: t('statsPage.countryKH', '캄보디아'), flag: '🇰🇭' },
        { code: 'RU', name: t('statsPage.countryRU', '러시아'), flag: '🇷🇺' },
        { code: 'UA', name: t('statsPage.countryUA', '우크라이나'), flag: '🇺🇦' },
    ];

    // ── Analytics Tab State ──
    const [analyticsData, setAnalyticsData] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    // ── RFM Analysis State ──
    const [rfmData, setRfmData] = useState(null);
    const [rfmLoading, setRfmLoading] = useState(false);
    const [rfmSegmentFilter, setRfmSegmentFilter] = useState('all');

    // ── CRM Alerts State ──
    const [crmAlerts, setCrmAlerts] = useState(null);
    const [alertsLoading, setAlertsLoading] = useState(false);
    const [dismissedAlerts, setDismissedAlerts] = useState(() => {
        try { return JSON.parse(localStorage.getItem('crm_dismissed_alerts') || '[]'); } catch { return []; }
    });

    // ── Workflow Automation State ──
    const [workflowRules, setWorkflowRules] = useState(() => {
        try { return JSON.parse(localStorage.getItem('crm_workflow_rules') || '[]'); } catch { return []; }
    });
    const [showWorkflowForm, setShowWorkflowForm] = useState(false);
    const [workflowLog, setWorkflowLog] = useState(() => {
        try { return JSON.parse(localStorage.getItem('crm_workflow_log') || '[]'); } catch { return []; }
    });

    // ── External Integrations State ──
    const [integrations, setIntegrations] = useState(() => {
        try { return JSON.parse(localStorage.getItem('crm_integrations') || '{}'); } catch { return {}; }
    });

    // ── Sales Goal State ──
    const [salesGoal, setSalesGoal] = useState(() => {
        try { return JSON.parse(localStorage.getItem('seller_sales_goal') || 'null'); } catch { return null; }
    });
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [goalAmount, setGoalAmount] = useState(salesGoal?.amount || '');
    const [goalPeriod, setGoalPeriod] = useState(salesGoal?.period || 'monthly');

    const saveGoal = () => {
        if (!goalAmount || parseInt(goalAmount) <= 0) return;
        const goal = { amount: parseInt(goalAmount), period: goalPeriod, createdAt: new Date().toISOString() };
        localStorage.setItem('seller_sales_goal', JSON.stringify(goal));
        setSalesGoal(goal);
        setShowGoalForm(false);
    };
    const clearGoal = () => {
        localStorage.removeItem('seller_sales_goal');
        setSalesGoal(null);
        setGoalAmount('');
        setShowGoalForm(false);
    };

    // ── Export Period State ──
    const [exportPeriod, setExportPeriod] = useState('1y'); // '1m','3m','6m','1y','custom'
    const [exportCustomStart, setExportCustomStart] = useState('');
    const [exportCustomEnd, setExportCustomEnd] = useState('');

    // Helper: get date range from export period
    const getExportDateRange = useCallback(() => {
        const now = new Date();
        let start, end;
        end = now.toISOString().slice(0, 10);
        switch (exportPeriod) {
            case '1m': {
                const d = new Date(now); d.setMonth(d.getMonth() - 1);
                start = d.toISOString().slice(0, 10); break;
            }
            case '3m': {
                const d = new Date(now); d.setMonth(d.getMonth() - 3);
                start = d.toISOString().slice(0, 10); break;
            }
            case '6m': {
                const d = new Date(now); d.setMonth(d.getMonth() - 6);
                start = d.toISOString().slice(0, 10); break;
            }
            case '1y': {
                const d = new Date(now); d.setFullYear(d.getFullYear() - 1);
                start = d.toISOString().slice(0, 10); break;
            }
            case 'custom':
                start = exportCustomStart || '2000-01-01';
                end = exportCustomEnd || now.toISOString().slice(0, 10);
                break;
            default:
                start = '2000-01-01';
        }
        return { start, end };
    }, [exportPeriod, exportCustomStart, exportCustomEnd]);

    // Filter allStats by export period
    const getExportFilteredStats = useCallback(() => {
        const { start, end } = getExportDateRange();
        return allStats.filter(s => {
            const d = s.record_date || s.period_start || '';
            return d >= start && d <= end;
        });
    }, [allStats, getExportDateRange]);

    // Filter expenses by export period
    const getExportFilteredExpenses = useCallback(() => {
        const { start, end } = getExportDateRange();
        return expenses.filter(e => {
            const d = e.expense_date || '';
            return d >= start && d <= end;
        });
    }, [expenses, getExportDateRange]);

    // ── Export Functions ──
    const exportToExcel = () => {
        if (!analyticsData) return;
        const filteredSales = getExportFilteredStats();
        const filteredExpenses = getExportFilteredExpenses();
        const { start, end } = getExportDateRange();
        const wb = XLSX.utils.book_new();

        // Recalculate from filtered data
        const totalRevenue = filteredSales.reduce((s, r) => s + (parseInt(r.monthly_revenue) || 0), 0);
        const totalCost = filteredSales.reduce((s, r) => s + (parseInt(r.cost_price) || 0), 0);
        const grossProfit = totalRevenue - totalCost;
        const totalExpense = filteredExpenses.reduce((s, e) => s + (parseInt(e.amount) || 0), 0);
        const operatingProfit = grossProfit - totalExpense;
        const plData = [
            [t('statsPage.plStatement', '손익계산서'), ''],
            [`${t('statsPage.period', '기간')}: ${start} ~ ${end}`, ''],
            ['', ''],
            [t('statsPage.plRevenue', '매출액'), totalRevenue],
            [t('statsPage.plCost', '매출원가'), totalCost],
            [t('statsPage.plGrossProfit', '매출총이익'), grossProfit],
            [t('statsPage.plGrossMargin', '매출총이익률'), totalRevenue > 0 ? `${((grossProfit / totalRevenue) * 100).toFixed(1)}%` : '0%'],
            ['', ''],
            [t('statsPage.plExpenses', '판매관리비'), totalExpense],
        ];
        // Category breakdown from filtered expenses
        const catMap = {};
        filteredExpenses.forEach(e => {
            const cat = e.category || 'etc';
            catMap[cat] = (catMap[cat] || 0) + (parseInt(e.amount) || 0);
        });
        Object.entries(catMap).forEach(([cat, total]) => {
            plData.push([`  • ${getExpenseCatLabel(cat)}`, total]);
        });
        plData.push(['', '']);
        plData.push([t('statsPage.plOperatingProfit', '영업이익'), operatingProfit]);
        plData.push([t('statsPage.plOperatingMargin', '영업이익률'), totalRevenue > 0 ? `${((operatingProfit / totalRevenue) * 100).toFixed(1)}%` : '0%']);
        const ws1 = XLSX.utils.aoa_to_sheet(plData);
        ws1['!cols'] = [{ wch: 25 }, { wch: 18 }];
        XLSX.utils.book_append_sheet(wb, ws1, t('statsPage.plStatement', '손익계산서'));

        // Sheet 2: Monthly Trend (from filtered)
        const monthMap = {};
        filteredSales.forEach(s => {
            const m = (s.record_date || '').substring(0, 7);
            if (m) monthMap[m] = (monthMap[m] || 0) + (parseInt(s.monthly_revenue) || 0);
        });
        const trendData = [[t('statsPage.month', '월'), t('statsPage.plRevenue', '매출액')]];
        Object.keys(monthMap).sort().forEach(m => trendData.push([m, monthMap[m]]));
        const ws2 = XLSX.utils.aoa_to_sheet([[t('statsPage.analyticsTrend', '매출 트렌드')], ...trendData]);
        XLSX.utils.book_append_sheet(wb, ws2, t('statsPage.analyticsTrend', '매출트렌드'));

        // Sheet 3: Expense List (filtered)
        if (filteredExpenses.length > 0) {
            const expHeader = [[t('statsPage.expDate', '날짜'), t('statsPage.expAmount', '금액'), t('statsPage.expCategory', '카테고리'), t('statsPage.expPayMethod', '결제수단'), t('statsPage.expMemo', '메모')]];
            const expData = filteredExpenses.map(e => [e.expense_date, parseInt(e.amount), getExpenseCatLabel(e.category), e.payment_method, e.memo || '']);
            const ws3 = XLSX.utils.aoa_to_sheet([...expHeader, ...expData]);
            ws3['!cols'] = [{ wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 25 }];
            XLSX.utils.book_append_sheet(wb, ws3, t('statsPage.tabExpense', '지출내역'));
        }

        // Sheet 4: Sales Raw Data (filtered)
        if (filteredSales.length > 0) {
            const salesHeader = [[t('statsPage.period', '기간'), t('statsPage.plRevenue', '매출'), t('statsPage.totalCustomers', '고객수'), t('statsPage.totalTransactions', '거래건수'), t('statsPage.channel', '채널'), t('statsPage.category', '카테고리')]];
            const salesData = filteredSales.map(s => [s.record_date || '', parseInt(s.monthly_revenue || 0), parseInt(s.customer_count || 0), parseInt(s.transaction_count || 0), s.sales_channel || '', s.product_category || '']);
            const ws4 = XLSX.utils.aoa_to_sheet([...salesHeader, ...salesData]);
            XLSX.utils.book_append_sheet(wb, ws4, t('statsPage.salesData', '매출데이터'));
        }

        const now = new Date();
        const fileName = `Sales_Report_${start}_${end}.xlsx`;
        XLSX.writeFile(wb, fileName);
        showToast(t('statsPage.exportSuccess', '리포트가 다운로드되었습니다'), 'success');
    };

    const exportToCSV = () => {
        const filteredSales = getExportFilteredStats();
        if (!filteredSales.length) return;
        const { start, end } = getExportDateRange();
        const headers = ['Period', 'Revenue', 'Cost', 'Customers', 'Transactions', 'Channel', 'Category'];
        const rows = filteredSales.map(s => [
            s.record_date || '', s.monthly_revenue || 0, s.cost_price || 0,
            s.customer_count || 0, s.transaction_count || 0,
            `"${(s.sales_channel || '').replace(/"/g, '""')}"`,
            `"${(s.product_category || '').replace(/"/g, '""')}"`
        ].join(','));
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sales_Data_${start}_${end}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(t('statsPage.exportSuccess', '리포트가 다운로드되었습니다'), 'success');
    };

    const exportToPrint = () => {
        if (!analyticsData) return;
        const filteredSales = getExportFilteredStats();
        const filteredExpenses = getExportFilteredExpenses();
        const { start, end } = getExportDateRange();

        const now = new Date();
        const reportDate = `${start} ~ ${end}`;

        // Calculate P&L values from filtered data
        const totalRevenue = filteredSales.reduce((s, r) => s + (parseInt(r.monthly_revenue) || 0), 0);
        const totalCost = filteredSales.reduce((s, r) => s + (parseInt(r.cost_price) || 0), 0);
        const grossProfit = totalRevenue - totalCost;
        const grossMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0.0';
        const totalExpense = filteredExpenses.reduce((s, e) => s + (parseInt(e.amount) || 0), 0);
        const operatingProfit = grossProfit - totalExpense;
        const operatingMargin = totalRevenue > 0 ? ((operatingProfit / totalRevenue) * 100).toFixed(1) : '0.0';

        // Format number helper
        const fmt = (n) => Number(n || 0).toLocaleString();
        const fmtPct = (n) => n !== null && n !== undefined ? `${n > 0 ? '+' : ''}${Number(n).toFixed(1)}%` : '-';

        // ── Build Monthly Trend from filteredSales (period-filtered) ──
        const trendMonthMap = {};
        const trendCostMap = {};
        const trendTxMap = {};
        const trendCustMap = {};
        filteredSales.forEach(s => {
            const m = (s.record_date || '').substring(0, 7);
            if (m) {
                trendMonthMap[m] = (trendMonthMap[m] || 0) + (parseInt(s.monthly_revenue) || 0);
                trendCostMap[m] = (trendCostMap[m] || 0) + (parseInt(s.cost_price) || 0);
                trendTxMap[m] = (trendTxMap[m] || 0) + (parseInt(s.transaction_count) || 0);
                trendCustMap[m] = (trendCustMap[m] || 0) + (parseInt(s.customer_count) || 0);
            }
        });
        const trendData = Object.keys(trendMonthMap).sort().map(m => ({
            month: m, revenue: trendMonthMap[m], cost: trendCostMap[m] || 0,
            transactions: trendTxMap[m] || 0, customers: trendCustMap[m] || 0,
        }));
        const trendRows = trendData.map((m, idx) => {
            const cost = m.cost || 0;
            const grossP = m.revenue - cost;
            const exp = m.expense || 0;
            const netP = m.revenue - cost - exp;
            const prevRev = idx > 0 ? trendData[idx - 1].revenue : null;
            const mom = prevRev && prevRev > 0 ? ((m.revenue - prevRev) / prevRev * 100).toFixed(1) : null;
            const customers = m.customers || m.customer_count || '-';
            const transactions = m.transactions || m.transaction_count || '-';
            return `<tr>
                <td>${m.month}</td>
                <td style="text-align:right;font-weight:600;">${fmt(m.revenue)}</td>
                <td style="text-align:right;color:#dc2626;">${fmt(cost)}</td>
                <td style="text-align:right;color:${grossP >= 0 ? '#059669' : '#dc2626'};font-weight:600;">${fmt(grossP)}</td>
                <td style="text-align:right;color:#f97316;">${fmt(exp)}</td>
                <td style="text-align:right;color:${netP >= 0 ? '#059669' : '#dc2626'};font-weight:700;">${fmt(netP)}</td>
                <td style="text-align:right;">${mom !== null ? `<span style="color:${parseFloat(mom) >= 0 ? '#059669' : '#dc2626'};font-weight:600;">${parseFloat(mom) > 0 ? '+' : ''}${mom}%</span>` : '<span style="color:#9ca3af;">-</span>'}</td>
                <td style="text-align:right;">${customers}</td>
                <td style="text-align:right;">${transactions}</td>
            </tr>`;
        }).join('');
        // Trend totals row
        const trendTotalRev = trendData.reduce((s, m) => s + (m.revenue || 0), 0);
        const trendTotalCost = trendData.reduce((s, m) => s + (m.cost || 0), 0);
        const trendTotalProfit = trendTotalRev - trendTotalCost;
        const trendTotalExp = trendData.reduce((s, m) => s + (m.expense || 0), 0);
        const trendTotalNet = trendTotalRev - trendTotalCost - trendTotalExp;
        const trendAvgRev = trendData.length > 0 ? Math.round(trendTotalRev / trendData.length) : 0;
        const trendMaxRev = trendData.length > 0 ? Math.max(...trendData.map(m => m.revenue || 0)) : 0;
        const trendMinRev = trendData.length > 0 ? Math.min(...trendData.map(m => m.revenue || 0)) : 0;

        // Build channels rows from filteredSales (period-filtered)
        const chMap = {};
        filteredSales.forEach(s => {
            const ch = s.sales_channel || t('statsPage.directSales', '직접판매');
            chMap[ch] = (chMap[ch] || 0) + (parseInt(s.monthly_revenue) || 0);
        });
        const sortedChannels = Object.entries(chMap).sort((a, b) => b[1] - a[1]);
        const channelRows = sortedChannels.map(([name, rev]) => {
            const pct = totalRevenue > 0 ? ((rev / totalRevenue) * 100).toFixed(1) : '0.0';
            const bar = `<div style="background:#e5e7eb;border-radius:4px;height:6px;width:100%;margin-top:2px;"><div style="background:#059669;border-radius:4px;height:6px;width:${Math.min(parseFloat(pct), 100)}%;"></div></div>`;
            return `<tr><td>${name}${bar}</td><td style="text-align:right;font-weight:600;">${fmt(rev)}</td><td style="text-align:right;">${pct}%</td></tr>`;
        }).join('') || '';

        // Build categories rows from filteredSales (period-filtered)
        const catRevMap = {};
        filteredSales.forEach(s => {
            const cat = s.product_category || s.product_name || t('statsPage.etcCategory', '기타');
            catRevMap[cat] = (catRevMap[cat] || 0) + (parseInt(s.monthly_revenue) || 0);
        });
        const sortedCats = Object.entries(catRevMap).sort((a, b) => b[1] - a[1]);
        const categoryRows = sortedCats.map(([name, rev]) => {
            const pct = totalRevenue > 0 ? ((rev / totalRevenue) * 100).toFixed(1) : '0.0';
            const bar = `<div style="background:#e5e7eb;border-radius:4px;height:6px;width:100%;margin-top:2px;"><div style="background:#7c3aed;border-radius:4px;height:6px;width:${Math.min(parseFloat(pct), 100)}%;"></div></div>`;
            return `<tr><td>${name}${bar}</td><td style="text-align:right;font-weight:600;">${fmt(rev)}</td><td style="text-align:right;">${pct}%</td></tr>`;
        }).join('') || '';

        // ── Expense Grouping ──
        const EXPENSE_GROUPS = [
            { key: 'direct', label: t('statsPage.expGroupDirect', '매출직접비'), cats: ['materials', 'packaging', 'shipping', 'commission'], color: '#f97316' },
            { key: 'sales', label: t('statsPage.expGroupSales', '영업비'), cats: ['advertising', 'booth_rental', 'transport'], color: '#8b5cf6' },
            { key: 'admin', label: t('statsPage.expGroupAdmin', '관리비'), cats: ['labor', 'equipment', 'communication', 'food'], color: '#3b82f6' },
            { key: 'misc', label: t('statsPage.expGroupMisc', '기타경비'), cats: ['other'], color: '#6b7280' },
        ];

        // Build expense category map from filteredExpenses
        const expCatMap = {};
        const expCatCount = {};
        filteredExpenses.forEach(e => {
            const cat = e.category || 'other';
            expCatMap[cat] = (expCatMap[cat] || 0) + (parseInt(e.amount) || 0);
            expCatCount[cat] = (expCatCount[cat] || 0) + 1;
        });

        // Build grouped P&L expense rows
        const expenseRows = EXPENSE_GROUPS.map(g => {
            const groupCats = g.cats.filter(c => expCatMap[c]);
            if (groupCats.length === 0) return '';
            const groupTotal = groupCats.reduce((s, c) => s + (expCatMap[c] || 0), 0);
            const groupPct = totalExpense > 0 ? ((groupTotal / totalExpense) * 100).toFixed(1) : '0.0';
            const catRows = groupCats.map(c => {
                const amt = expCatMap[c] || 0;
                const pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : '0.0';
                return `<tr><td style="padding-left:40px;color:#6b7280;font-size:10px;">└ ${getExpenseCatLabel(c)}</td><td style="text-align:right;font-size:10px;color:#6b7280;">${fmt(amt)}</td><td style="text-align:right;font-size:10px;color:#9ca3af;">${pct}%</td></tr>`;
            }).join('');
            return `<tr><td style="padding-left:24px;font-weight:600;color:${g.color};">■ ${g.label}</td><td style="text-align:right;font-weight:600;">${fmt(groupTotal)}</td><td style="text-align:right;font-size:10px;color:#9ca3af;">${groupPct}%</td></tr>${catRows}`;
        }).join('') || '';

        // ── Monthly expense map for trend integration ──
        const monthExpMap = {};
        const monthExpCount = {};
        filteredExpenses.forEach(e => {
            const m = (e.expense_date || '').substring(0, 7);
            if (m) {
                monthExpMap[m] = (monthExpMap[m] || 0) + (parseInt(e.amount) || 0);
                monthExpCount[m] = (monthExpCount[m] || 0) + 1;
            }
        });
        // Merge expense into trendData
        trendData.forEach(td => { td.expense = monthExpMap[td.month] || 0; td.netProfit = td.revenue - td.cost - td.expense; });

        // ── Payment method breakdown ──
        const pmMap = {};
        const pmCount = {};
        filteredExpenses.forEach(e => {
            const pm = e.payment_method || 'other';
            pmMap[pm] = (pmMap[pm] || 0) + (parseInt(e.amount) || 0);
            pmCount[pm] = (pmCount[pm] || 0) + 1;
        });
        const pmLabels = { cash: t('statsPage.expPayCash', '현금'), card: t('statsPage.expPayCard', '카드'), transfer: t('statsPage.expPayTransfer', '이체'), other: t('statsPage.expPayOther', '기타') };

        // ── TOP 5 expenses ──
        const top5Expenses = [...filteredExpenses].sort((a, b) => (parseInt(b.amount) || 0) - (parseInt(a.amount) || 0)).slice(0, 5);

        // ── Build new sections HTML ──
        // Section: Expense Detail Analysis
        const expDetailSection = filteredExpenses.length > 0 ? `
        <div class="section">
            <h2>💸 ${t('statsPage.rptExpDetail', '지출 상세 분석')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Expense Analysis</span></h2>
            <table>
                <thead><tr><th>${t('statsPage.expCategory', '카테고리')}</th><th style="text-align:right;">${t('statsPage.plAmount', '금액')}</th><th style="text-align:right;">${t('statsPage.rptSalesShare', '비중')}</th><th style="text-align:right;">${t('statsPage.rptRevPercent', '매출 대비')}</th><th style="text-align:right;">${t('statsPage.rptExpCount', '건수')}</th></tr></thead>
                <tbody>
                    ${EXPENSE_GROUPS.map(g => {
            const groupCats = g.cats.filter(c => expCatMap[c]);
            if (groupCats.length === 0) return '';
            const groupTotal = groupCats.reduce((s, c) => s + (expCatMap[c] || 0), 0);
            const groupCount = groupCats.reduce((s, c) => s + (expCatCount[c] || 0), 0);
            const gPct = totalExpense > 0 ? ((groupTotal / totalExpense) * 100).toFixed(1) : '0.0';
            const gRevPct = totalRevenue > 0 ? ((groupTotal / totalRevenue) * 100).toFixed(1) : '0.0';
            const catRows = groupCats.map(c => {
                const amt = expCatMap[c] || 0;
                const cnt = expCatCount[c] || 0;
                const pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : '0.0';
                const revPct = totalRevenue > 0 ? ((amt / totalRevenue) * 100).toFixed(1) : '0.0';
                return `<tr><td style="padding-left:28px;font-size:10px;color:#6b7280;">└ ${getExpenseCatLabel(c)}</td><td style="text-align:right;font-size:10px;">${fmt(amt)}</td><td style="text-align:right;font-size:10px;color:#9ca3af;">${pct}%</td><td style="text-align:right;font-size:10px;color:#9ca3af;">${revPct}%</td><td style="text-align:right;font-size:10px;color:#9ca3af;">${cnt}${t('statsPage.units', '건')}</td></tr>`;
            }).join('');
            const bar = `<div style="background:#e5e7eb;border-radius:4px;height:5px;width:100%;margin-top:2px;"><div style="background:${g.color};border-radius:4px;height:5px;width:${Math.min(parseFloat(gPct), 100)}%;"></div></div>`;
            return `<tr class="subtotal-row"><td style="font-weight:700;color:${g.color};">■ ${g.label}${bar}</td><td style="text-align:right;font-weight:700;">${fmt(groupTotal)}</td><td style="text-align:right;font-weight:600;">${gPct}%</td><td style="text-align:right;font-weight:600;">${gRevPct}%</td><td style="text-align:right;font-weight:600;">${groupCount}${t('statsPage.units', '건')}</td></tr>${catRows}`;
        }).join('')}
                    <tr class="total-row"><td style="font-weight:800;">${t('statsPage.rptTotal', '합계')}</td><td style="text-align:right;font-weight:800;color:#dc2626;">${fmt(totalExpense)}</td><td style="text-align:right;font-weight:700;">100%</td><td style="text-align:right;font-weight:700;">${totalRevenue > 0 ? ((totalExpense / totalRevenue) * 100).toFixed(1) : '0.0'}%</td><td style="text-align:right;font-weight:700;">${filteredExpenses.length}${t('statsPage.units', '건')}</td></tr>
                </tbody>
            </table>
        </div>` : '';

        // Section: Monthly Expense Trend
        const allExpMonths = Object.keys(monthExpMap).sort();
        const expTrendSection = allExpMonths.length > 0 ? `
        <div class="section">
            <h2>📅 ${t('statsPage.rptExpTrend', '월별 지출 추이')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Monthly Expense Trend</span></h2>
            <table>
                <thead><tr><th>${t('statsPage.month', '월')}</th><th style="text-align:right;">${t('statsPage.rptExpTotal', '총 지출')}</th><th style="text-align:right;">MoM</th><th style="text-align:right;">${t('statsPage.rptRevPercent', '매출 대비')}</th><th style="text-align:right;">${t('statsPage.rptExpCount', '건수')}</th></tr></thead>
                <tbody>
                    ${allExpMonths.map((m, idx) => {
            const amt = monthExpMap[m];
            const cnt = monthExpCount[m] || 0;
            const prev = idx > 0 ? monthExpMap[allExpMonths[idx - 1]] : null;
            const mom = prev && prev > 0 ? ((amt - prev) / prev * 100).toFixed(1) : null;
            const monthRev = trendData.find(td => td.month === m)?.revenue || 0;
            const revPct = monthRev > 0 ? ((amt / monthRev) * 100).toFixed(1) : '-';
            return `<tr><td>${m}</td><td style="text-align:right;font-weight:600;color:#dc2626;">${fmt(amt)}</td><td style="text-align:right;">${mom !== null ? `<span style="color:${parseFloat(mom) >= 0 ? '#dc2626' : '#059669'};font-weight:600;">${parseFloat(mom) > 0 ? '+' : ''}${mom}%</span>` : '<span style="color:#9ca3af;">-</span>'}</td><td style="text-align:right;">${revPct}%</td><td style="text-align:right;">${cnt}${t('statsPage.units', '건')}</td></tr>`;
        }).join('')}
                    <tr class="total-row"><td style="font-weight:800;">${t('statsPage.rptTotal', '합계')}</td><td style="text-align:right;font-weight:800;color:#dc2626;">${fmt(totalExpense)}</td><td></td><td style="text-align:right;font-weight:700;">${totalRevenue > 0 ? ((totalExpense / totalRevenue) * 100).toFixed(1) : '0.0'}%</td><td style="text-align:right;font-weight:700;">${filteredExpenses.length}${t('statsPage.units', '건')}</td></tr>
                </tbody>
            </table>
        </div>` : '';

        // Section: Payment Method Breakdown
        const pmEntries = Object.entries(pmMap).sort((a, b) => b[1] - a[1]);
        const pmSection = pmEntries.length > 0 ? `
        <div class="section">
            <h2>💳 ${t('statsPage.rptPmBreakdown', '결제수단별 분석')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Payment Method</span></h2>
            <table>
                <thead><tr><th>${t('statsPage.expPayment', '결제수단')}</th><th style="text-align:right;">${t('statsPage.plAmount', '금액')}</th><th style="text-align:right;">${t('statsPage.rptSalesShare', '비중')}</th><th style="text-align:right;">${t('statsPage.rptExpCount', '건수')}</th></tr></thead>
                <tbody>
                    ${pmEntries.map(([pm, amt]) => {
            const pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : '0.0';
            const cnt = pmCount[pm] || 0;
            const bar = `<div style="background:#e5e7eb;border-radius:4px;height:5px;width:100%;margin-top:2px;"><div style="background:#6366f1;border-radius:4px;height:5px;width:${Math.min(parseFloat(pct), 100)}%;"></div></div>`;
            return `<tr><td>${pmLabels[pm] || pm}${bar}</td><td style="text-align:right;font-weight:600;">${fmt(amt)}</td><td style="text-align:right;">${pct}%</td><td style="text-align:right;">${cnt}${t('statsPage.units', '건')}</td></tr>`;
        }).join('')}
                    <tr class="total-row"><td style="font-weight:800;">${t('statsPage.rptTotal', '합계')}</td><td style="text-align:right;font-weight:800;">${fmt(totalExpense)}</td><td style="text-align:right;font-weight:700;">100%</td><td style="text-align:right;font-weight:700;">${filteredExpenses.length}${t('statsPage.units', '건')}</td></tr>
                </tbody>
            </table>
        </div>` : '';

        // Section: TOP 5 High Expenses
        const top5Section = top5Expenses.length > 0 ? `
        <div class="section">
            <h2>🏆 ${t('statsPage.rptTop5Exp', 'TOP 5 고액 지출')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Top Expenses</span></h2>
            <table>
                <thead><tr><th style="width:30px;">#</th><th>${t('statsPage.expDate', '날짜')}</th><th style="text-align:right;">${t('statsPage.plAmount', '금액')}</th><th>${t('statsPage.expCategory', '카테고리')}</th><th>${t('statsPage.expMemo', '메모')}</th></tr></thead>
                <tbody>
                    ${top5Expenses.map((e, i) => {
            const medals = ['🥇', '🥈', '🥉', '4', '5'];
            return `<tr><td style="text-align:center;">${medals[i]}</td><td>${e.expense_date || '-'}</td><td style="text-align:right;font-weight:700;color:#dc2626;">${fmt(parseInt(e.amount) || 0)}</td><td>${getExpenseCatLabel(e.category || 'other')}</td><td style="color:#6b7280;font-size:10px;">${e.memo || '-'}</td></tr>`;
        }).join('')}
                </tbody>
            </table>
        </div>` : '';

        // Net Income calculation
        const otherIncome = 0; // placeholder for future
        const otherExpense = 0;
        const ebt = operatingProfit + otherIncome - otherExpense;

        // Build sales goal section
        let goalSection = '';
        if (salesGoal) {
            const goalPeriodKey = salesGoal.period || 'monthly';
            const goalPeriodLabel = goalPeriodKey === 'monthly' ? t('statsPage.tabMonthly', '월별') : t('statsPage.tabAnnual', '연간');
            const goalAmt = salesGoal.amount || 0;
            const currentRevenue = goalPeriodKey === 'monthly'
                ? (trendData.length > 0 ? trendData[trendData.length - 1].revenue : 0)
                : totalRevenue;
            const progress = goalAmt > 0 ? Math.min((currentRevenue / goalAmt) * 100, 999) : 0;
            goalSection = `
                <div class="section">
                    <h2>🎯 ${t('statsPage.goalTitle', '매출 목표')}</h2>
                    <table>
                        <tr><td>${t('statsPage.goalPeriod', '기간')}</td><td style="text-align:right;font-weight:600;">${goalPeriodLabel}</td></tr>
                        <tr><td>${t('statsPage.goalTarget', '목표')}</td><td style="text-align:right;font-weight:600;">${fmt(goalAmt)}</td></tr>
                        <tr><td>${t('statsPage.goalCurrent', '현재')}</td><td style="text-align:right;font-weight:600;">${fmt(currentRevenue)}</td></tr>
                        <tr class="total-row"><td>${t('statsPage.goalAchieved', '달성률')}</td><td style="text-align:right;font-weight:700;color:${progress >= 100 ? '#059669' : '#7c3aed'};">${progress.toFixed(1)}%</td></tr>
                    </table>
                </div>`;
        }

        const printHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SpaceMatch - ${t('statsPage.plStatement', '손익계산서')} ${reportDate}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #1f2937;
            background: #fff;
            padding: 0;
            font-size: 11px;
            line-height: 1.5;
        }

        /* Header */
        .report-header {
            background: linear-gradient(135deg, #4f46e5, #7c3aed, #6d28d9);
            color: white;
            padding: 32px 40px;
            position: relative;
            overflow: hidden;
        }
        .report-header::after {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 300px;
            height: 300px;
            background: rgba(255,255,255,0.06);
            border-radius: 50%;
        }
        .brand-name {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 2px;
        }
        .brand-sub {
            font-size: 10px;
            opacity: 0.7;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 500;
        }
        .report-title {
            font-size: 16px;
            font-weight: 700;
            margin-top: 16px;
        }
        .report-meta {
            display: flex;
            gap: 20px;
            margin-top: 8px;
            font-size: 10px;
            opacity: 0.85;
        }

        /* Content */
        .content { padding: 30px 40px; }

        /* KPI Grid */
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 28px;
        }
        .kpi-card {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 14px 16px;
            text-align: center;
        }
        .kpi-label {
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            color: #6b7280;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        .kpi-value {
            font-size: 18px;
            font-weight: 800;
        }
        .kpi-value.green { color: #059669; }
        .kpi-value.blue { color: #2563eb; }
        .kpi-value.violet { color: #7c3aed; }
        .kpi-value.red { color: #dc2626; }

        /* Sections */
        .section {
            margin-bottom: 24px;
            break-inside: avoid;
        }
        .section h2 {
            font-size: 13px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 2px solid #e5e7eb;
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }
        th {
            background: #f3f4f6;
            padding: 8px 12px;
            text-align: left;
            font-weight: 700;
            font-size: 10px;
            text-transform: uppercase;
            color: #6b7280;
            letter-spacing: 0.3px;
            border-bottom: 2px solid #e5e7eb;
        }
        td {
            padding: 7px 12px;
            border-bottom: 1px solid #f3f4f6;
        }
        tr:last-child td { border-bottom: none; }
        .total-row td {
            font-weight: 700;
            border-top: 2px solid #d1d5db;
            border-bottom: none;
            padding-top: 10px;
            font-size: 12px;
        }
        .subtotal-row td {
            font-weight: 600;
            background: #f9fafb;
        }
        .indent { padding-left: 24px; }
        .negative { color: #dc2626; }
        .positive { color: #059669; }

        /* Two Column Layout */
        .two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
        }

        /* Footer */
        .report-footer {
            border-top: 1px solid #e5e7eb;
            padding: 16px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #9ca3af;
            font-size: 9px;
        }
        .footer-brand {
            font-weight: 700;
            color: #6b7280;
        }
        .confidential {
            background: #fef3c7;
            color: #92400e;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Print styles */
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .report-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .kpi-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { margin: 0; size: A4; }
        }
    </style>
</head>
<body>
    <!-- Report Header -->
    <div class="report-header">
        <div class="brand-name">SpaceMatch</div>
        <div class="brand-sub">Sales Analytics Platform</div>
        <div class="report-title">📊 ${t('statsPage.plStatement', '손익계산서')} · ${t('statsPage.analyticsTrend', '매출 트렌드')}</div>
        <div class="report-meta">
            <span>📅 ${t('statsPage.reportDate', '보고서 날짜')}: ${reportDate}</span>
            <span>📈 ${t('statsPage.recordCount', '데이터')}: ${filteredSales.length} ${t('statsPage.records', '건')}</span>
        </div>
    </div>

    <div class="content">
        <!-- KPI Summary -->
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-label">${t('statsPage.analyticsTotalRev', '총 매출')}</div>
                <div class="kpi-value green">${fmt(totalRevenue)}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">${t('statsPage.analyticsProfit', '이익률')}</div>
                <div class="kpi-value blue">${grossMargin}%</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">${t('statsPage.analyticsGrowth', '성장률')}</div>
                <div class="kpi-value ${trendData.length >= 2 && trendData[trendData.length - 1].revenue >= trendData[trendData.length - 2].revenue ? 'green' : 'red'}">${trendData.length >= 2 ? (() => { const cur = trendData[trendData.length - 1].revenue; const prev = trendData[trendData.length - 2].revenue; return prev > 0 ? `${cur >= prev ? '+' : ''}${((cur - prev) / prev * 100).toFixed(1)}%` : '-'; })() : '-'}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">${t('statsPage.analyticsForecast', '예상 매출')}</div>
                <div class="kpi-value violet">${trendData.length > 0 ? fmt(Math.round(trendTotalRev / trendData.length * 12)) : '-'}</div>
            </div>
        </div>

        <!-- P&L Statement — Corporate Format -->
        <div class="section">
            <h2>📋 ${t('statsPage.plStatement', '손익계산서')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Income Statement</span></h2>
            <table>
                <thead>
                    <tr>
                        <th style="width:60%;">${t('statsPage.plItem', '계정과목')}</th>
                        <th style="text-align:right;width:25%;">${t('statsPage.plAmount', '금액')}</th>
                        <th style="text-align:right;width:15%;">${t('statsPage.plPercent', '비율')}</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- I. Revenue -->
                    <tr class="subtotal-row">
                        <td style="font-weight:700;">Ⅰ. ${t('statsPage.plRevenue', '매출액')}</td>
                        <td style="text-align:right;color:#059669;font-weight:700;">${fmt(totalRevenue)}</td>
                        <td style="text-align:right;color:#059669;font-weight:600;">100.0%</td>
                    </tr>
                    ${sortedChannels.length > 0 ? sortedChannels.map(([name, rev]) => {
            const chPct = totalRevenue > 0 ? ((rev / totalRevenue) * 100).toFixed(1) : '0.0';
            return `<tr><td class="indent" style="color:#6b7280;font-size:10px;">└ ${name}</td><td style="text-align:right;font-size:10px;color:#6b7280;">${fmt(rev)}</td><td style="text-align:right;font-size:10px;color:#6b7280;">${chPct}%</td></tr>`;
        }).join('') : ''}

                    <tr><td colspan="3" style="padding:3px;"></td></tr>

                    <!-- II. COGS -->
                    <tr>
                        <td style="font-weight:600;">Ⅱ. ${t('statsPage.plCost', '매출원가')}</td>
                        <td style="text-align:right;" class="negative">(${fmt(totalCost)})</td>
                        <td style="text-align:right;color:#dc2626;">${totalRevenue > 0 ? ((totalCost / totalRevenue) * 100).toFixed(1) : '0.0'}%</td>
                    </tr>

                    <tr><td colspan="3" style="padding:3px;"></td></tr>

                    <!-- III. Gross Profit -->
                    <tr class="subtotal-row" style="background:#ecfdf5;">
                        <td style="font-weight:700;">Ⅲ. ${t('statsPage.plGrossProfit', '매출총이익')}</td>
                        <td style="text-align:right;color:${grossProfit >= 0 ? '#059669' : '#dc2626'};font-weight:700;">${fmt(grossProfit)}</td>
                        <td style="text-align:right;font-weight:600;">${grossMargin}%</td>
                    </tr>

                    <tr><td colspan="3" style="padding:3px;"></td></tr>

                    <!-- IV. SG&A -->
                    <tr>
                        <td style="font-weight:600;">Ⅳ. ${t('statsPage.plExpenses', '판매비와관리비')}</td>
                        <td style="text-align:right;" class="negative">(${fmt(totalExpense)})</td>
                        <td style="text-align:right;color:#dc2626;">${totalRevenue > 0 ? ((totalExpense / totalRevenue) * 100).toFixed(1) : '0.0'}%</td>
                    </tr>
                    ${expenseRows}

                    <tr><td colspan="3" style="padding:3px;"></td></tr>

                    <!-- V. Operating Income -->
                    <tr class="total-row" style="background:${operatingProfit >= 0 ? '#ecfdf5' : '#fef2f2'};">
                        <td style="font-weight:800;font-size:12px;">Ⅴ. ${t('statsPage.plOperatingProfit', '영업이익')}</td>
                        <td style="text-align:right;color:${operatingProfit >= 0 ? '#059669' : '#dc2626'};font-weight:800;font-size:13px;">${fmt(operatingProfit)}</td>
                        <td style="text-align:right;font-weight:700;">${operatingMargin}%</td>
                    </tr>

                    <tr><td colspan="3" style="padding:3px;"></td></tr>

                    <!-- VI. Non-operating -->
                    <tr>
                        <td style="font-weight:600;">Ⅵ. ${t('statsPage.plNonOperating', '영업외수익(비용)')}</td>
                        <td style="text-align:right;font-weight:600;">${fmt(otherIncome - otherExpense)}</td>
                        <td style="text-align:right;color:#9ca3af;">-</td>
                    </tr>

                    <tr><td colspan="3" style="padding:3px;"></td></tr>

                    <!-- VII. EBT -->
                    <tr class="total-row" style="background:${ebt >= 0 ? '#eff6ff' : '#fef2f2'};border-top:3px double #1f2937;">
                        <td style="font-weight:800;font-size:13px;">Ⅶ. ${t('statsPage.plEBT', '세전이익 (EBT)')}</td>
                        <td style="text-align:right;color:${ebt >= 0 ? '#2563eb' : '#dc2626'};font-weight:800;font-size:14px;">${fmt(ebt)}</td>
                        <td style="text-align:right;font-weight:700;">${totalRevenue > 0 ? ((ebt / totalRevenue) * 100).toFixed(1) : '0.0'}%</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Profitability Summary -->
        <div class="kpi-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:24px;">
            <div class="kpi-card"><div class="kpi-label">${t('statsPage.plGrossMargin', '매출총이익률')}</div><div class="kpi-value ${parseFloat(grossMargin) >= 0 ? 'green' : 'red'}">${grossMargin}%</div></div>
            <div class="kpi-card"><div class="kpi-label">${t('statsPage.plOperatingMargin', '영업이익률')}</div><div class="kpi-value ${parseFloat(operatingMargin) >= 0 ? 'blue' : 'red'}">${operatingMargin}%</div></div>
            <div class="kpi-card"><div class="kpi-label">${t('statsPage.plSgaRatio', '판관비율')}</div><div class="kpi-value violet">${totalRevenue > 0 ? ((totalExpense / totalRevenue) * 100).toFixed(1) : '0.0'}%</div></div>
            <div class="kpi-card"><div class="kpi-label">${t('statsPage.plCostRatio', '원가율')}</div><div class="kpi-value red">${totalRevenue > 0 ? ((totalCost / totalRevenue) * 100).toFixed(1) : '0.0'}%</div></div>
            <div class="kpi-card"><div class="kpi-label">${t('statsPage.plEBTMargin', '세전이익률')}</div><div class="kpi-value ${ebt >= 0 ? 'blue' : 'red'}">${totalRevenue > 0 ? ((ebt / totalRevenue) * 100).toFixed(1) : '0.0'}%</div></div>
        </div>

        <!-- Monthly Trend — Enhanced with Expense -->
        ${trendRows ? `
        <div class="section">
            <h2>📈 ${t('statsPage.analyticsTrend', '매출 트렌드')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Monthly Trend Analysis</span></h2>
            <table>
                <thead>
                    <tr>
                        <th>${t('statsPage.month', '월')}</th>
                        <th style="text-align:right;">${t('statsPage.plRevenue', '매출')}</th>
                        <th style="text-align:right;">${t('statsPage.plCost', '원가')}</th>
                        <th style="text-align:right;">${t('statsPage.plGrossProfit', '총이익')}</th>
                        <th style="text-align:right;">${t('statsPage.plExpenses', '판관비')}</th>
                        <th style="text-align:right;">${t('statsPage.rptNetProfit', '순이익')}</th>
                        <th style="text-align:right;">MoM</th>
                        <th style="text-align:right;">${t('statsPage.customersLabel', '고객')}</th>
                        <th style="text-align:right;">${t('statsPage.transactionsLabel', '거래')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${trendRows}
                    <tr class="total-row" style="background:#f0fdf4;">
                        <td style="font-weight:800;">📊 ${t('statsPage.rptTotal', '합계')}</td>
                        <td style="text-align:right;font-weight:800;color:#059669;">${fmt(trendTotalRev)}</td>
                        <td style="text-align:right;font-weight:700;color:#dc2626;">${fmt(trendTotalCost)}</td>
                        <td style="text-align:right;font-weight:800;color:${trendTotalProfit >= 0 ? '#059669' : '#dc2626'};">${fmt(trendTotalProfit)}</td>
                        <td style="text-align:right;font-weight:700;color:#f97316;">${fmt(trendTotalExp)}</td>
                        <td style="text-align:right;font-weight:800;color:${trendTotalNet >= 0 ? '#059669' : '#dc2626'};">${fmt(trendTotalNet)}</td>
                        <td colspan="3"></td>
                    </tr>
                    <tr style="background:#f9fafb;">
                        <td style="color:#6b7280;font-size:10px;">📉 ${t('statsPage.rptAvg', '월 평균')}</td>
                        <td style="text-align:right;color:#6b7280;font-size:10px;font-weight:600;">${fmt(trendAvgRev)}</td>
                        <td colspan="7"></td>
                    </tr>
                    <tr style="background:#f9fafb;">
                        <td style="color:#6b7280;font-size:10px;">📈 ${t('statsPage.rptMax', '최고 매출')}</td>
                        <td style="text-align:right;color:#059669;font-size:10px;font-weight:600;">${fmt(trendMaxRev)}</td>
                        <td style="color:#6b7280;font-size:10px;">📉 ${t('statsPage.rptMin', '최저 매출')}</td>
                        <td style="text-align:right;color:#dc2626;font-size:10px;font-weight:600;">${fmt(trendMinRev)}</td>
                        <td colspan="5"></td>
                    </tr>
                </tbody>
            </table>
        </div>` : ''}

        <!-- Expense Sections -->
        ${expDetailSection}

        <div class="two-col">
            ${expTrendSection ? `<div>${expTrendSection}</div>` : ''}
            ${pmSection ? `<div>${pmSection}</div>` : ''}
        </div>

        ${top5Section}

        <!-- Channels & Categories -->
        <div class="two-col">
            ${channelRows ? `
            <div class="section" style="margin-bottom:0;">
                <h2>📡 ${t('statsPage.analyticsChannels', '채널별 매출')}</h2>
                <table>
                    <thead><tr><th>${t('statsPage.channel', '채널')}</th><th style="text-align:right;">${t('statsPage.plRevenue', '매출')}</th><th style="text-align:right;">${t('statsPage.rptSalesShare', '비중')}</th></tr></thead>
                    <tbody>${channelRows}</tbody>
                </table>
            </div>` : ''}

            ${categoryRows ? `
            <div class="section" style="margin-bottom:0;">
                <h2>🏷️ ${t('statsPage.analyticsCategories', '카테고리 분석')}</h2>
                <table>
                    <thead><tr><th>${t('statsPage.category', '카테고리')}</th><th style="text-align:right;">${t('statsPage.plRevenue', '매출')}</th><th style="text-align:right;">${t('statsPage.rptSalesShare', '비중')}</th></tr></thead>
                    <tbody>${categoryRows}</tbody>
                </table>
            </div>` : ''}
        </div>

        <!-- Sales Goal -->
        ${goalSection}
    </div>

    <!-- Footer -->
    <div class="report-footer">
        <div>
            <span class="footer-brand">SpaceMatch</span> · ${t('statsPage.reportGenerated', '자동 생성된 보고서')} · ${reportDate}
        </div>
        <div class="confidential">CONFIDENTIAL</div>
    </div>
</body>
</html>`;

        const printWindow = window.open('', '_blank', 'width=900,height=1200');
        if (printWindow) {
            printWindow.document.write(printHTML);
            printWindow.document.close();
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                }, 500);
            };
        }
    };

    // ── Download Report as HTML file ──
    const downloadReportAsHTML = (htmlContent, filename) => {
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(t('statsPage.htmlDownloaded', '보고서가 HTML 파일로 다운로드되었습니다'), 'success');
    };

    // ── CRM Comprehensive Report ──
    const generateCRMReport = () => {
        if (!analyticsData) return;
        const filteredSales = getExportFilteredStats();
        const filteredExpenses = getExportFilteredExpenses();
        const { start, end } = getExportDateRange();

        const now = new Date();
        const reportDate = `${start} ~ ${end}`;
        const fmt = (v) => typeof v === 'number' ? v.toLocaleString() : (v || '-');
        const totalRevenue = filteredSales.reduce((s, r) => s + (parseInt(r.monthly_revenue) || 0), 0);
        const totalCost = filteredSales.reduce((s, r) => s + (parseInt(r.cost_price) || 0), 0);
        const grossProfit = totalRevenue - totalCost;
        const grossMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0.0';
        const totalExp = filteredExpenses.reduce((s, e) => s + (parseInt(e.amount) || 0), 0);
        const opProfit = grossProfit - totalExp;
        const opMargin = totalRevenue > 0 ? ((opProfit / totalRevenue) * 100).toFixed(1) : '0.0';

        // ── Build Monthly Trend from filteredSales (period-filtered) ──
        const crmMonthMap = {};
        const crmCostMap = {};
        const crmTxMap = {};
        const crmCustMap = {};
        filteredSales.forEach(s => {
            const m = (s.record_date || '').substring(0, 7);
            if (m) {
                crmMonthMap[m] = (crmMonthMap[m] || 0) + (parseInt(s.monthly_revenue) || 0);
                crmCostMap[m] = (crmCostMap[m] || 0) + (parseInt(s.cost_price) || 0);
                crmTxMap[m] = (crmTxMap[m] || 0) + (parseInt(s.transaction_count) || 0);
                crmCustMap[m] = (crmCustMap[m] || 0) + (parseInt(s.customer_count) || 0);
            }
        });
        // Monthly expense map
        const crmMonthExpMap = {};
        const crmMonthExpCount = {};
        filteredExpenses.forEach(e => {
            const m = (e.expense_date || '').substring(0, 7);
            if (m) {
                crmMonthExpMap[m] = (crmMonthExpMap[m] || 0) + (parseInt(e.amount) || 0);
                crmMonthExpCount[m] = (crmMonthExpCount[m] || 0) + 1;
            }
        });
        const trendData = Object.keys(crmMonthMap).sort().map(m => ({
            month: m, revenue: crmMonthMap[m], cost: crmCostMap[m] || 0,
            transactions: crmTxMap[m] || 0, customers: crmCustMap[m] || 0,
            expense: crmMonthExpMap[m] || 0,
        }));
        trendData.forEach(td => { td.grossP = td.revenue - td.cost; td.netProfit = td.revenue - td.cost - td.expense; });

        const trendRows = trendData.map((m, idx) => {
            const prev = idx > 0 ? trendData[idx - 1].revenue : null;
            const mom = prev && prev > 0 ? ((m.revenue - prev) / prev * 100).toFixed(1) : null;
            return `<tr>
                <td>${m.month}</td>
                <td style="text-align:right;font-weight:600;">${fmt(m.revenue)}</td>
                <td style="text-align:right;color:#dc2626;">${fmt(m.cost)}</td>
                <td style="text-align:right;color:${m.grossP >= 0 ? '#059669' : '#dc2626'};font-weight:600;">${fmt(m.grossP)}</td>
                <td style="text-align:right;color:#f97316;">${fmt(m.expense)}</td>
                <td style="text-align:right;color:${m.netProfit >= 0 ? '#059669' : '#dc2626'};font-weight:700;">${fmt(m.netProfit)}</td>
                <td style="text-align:right;">${mom !== null ? `<span style="color:${parseFloat(mom) >= 0 ? '#059669' : '#dc2626'};font-weight:600;">${parseFloat(mom) > 0 ? '+' : ''}${mom}%</span>` : '-'}</td>
                <td style="text-align:right;">${m.customers || '-'}</td>
                <td style="text-align:right;">${m.transactions || '-'}</td>
            </tr>`;
        }).join('');
        const trendTotalRev = trendData.reduce((s, m) => s + (m.revenue || 0), 0);
        const trendTotalCost = trendData.reduce((s, m) => s + (m.cost || 0), 0);
        const trendTotalExp = trendData.reduce((s, m) => s + (m.expense || 0), 0);
        const trendTotalNet = trendTotalRev - trendTotalCost - trendTotalExp;

        // ── Channel & Category Rows (from filteredSales, period-filtered) ──
        const crmChMap = {};
        filteredSales.forEach(s => {
            const ch = s.sales_channel || t('statsPage.directSales', '직접판매');
            crmChMap[ch] = (crmChMap[ch] || 0) + (parseInt(s.monthly_revenue) || 0);
        });
        const crmSortedChannels = Object.entries(crmChMap).sort((a, b) => b[1] - a[1]);
        const channelRows = crmSortedChannels.map(([name, rev]) => {
            const pct = totalRevenue > 0 ? ((rev / totalRevenue) * 100).toFixed(1) : '0.0';
            const bar = `<div style="background:#e5e7eb;border-radius:4px;height:6px;width:100%;margin-top:3px;"><div style="background:#059669;border-radius:4px;height:6px;width:${Math.min(parseFloat(pct), 100)}%;"></div></div>`;
            return `<tr><td>${name}${bar}</td><td style="text-align:right;font-weight:600;">${fmt(rev)}</td><td style="text-align:right;">${pct}%</td></tr>`;
        }).join('') || '';

        const crmCatMap = {};
        filteredSales.forEach(s => {
            const cat = s.product_category || s.product_name || t('statsPage.etcCategory', '기타');
            crmCatMap[cat] = (crmCatMap[cat] || 0) + (parseInt(s.monthly_revenue) || 0);
        });
        const categoryRows = Object.entries(crmCatMap).sort((a, b) => b[1] - a[1]).map(([name, rev]) => {
            const pct = totalRevenue > 0 ? ((rev / totalRevenue) * 100).toFixed(1) : '0.0';
            const bar = `<div style="background:#e5e7eb;border-radius:4px;height:6px;width:100%;margin-top:3px;"><div style="background:#7c3aed;border-radius:4px;height:6px;width:${Math.min(parseFloat(pct), 100)}%;"></div></div>`;
            return `<tr><td>${name}${bar}</td><td style="text-align:right;font-weight:600;">${fmt(rev)}</td><td style="text-align:right;">${pct}%</td></tr>`;
        }).join('') || '';

        // ── Expense Grouping (same as Print) ──
        const CRM_EXP_GROUPS = [
            { key: 'direct', label: t('statsPage.expGroupDirect', '매출직접비'), cats: ['materials', 'packaging', 'shipping', 'commission'], color: '#f97316' },
            { key: 'sales', label: t('statsPage.expGroupSales', '영업비'), cats: ['advertising', 'booth_rental', 'transport'], color: '#8b5cf6' },
            { key: 'admin', label: t('statsPage.expGroupAdmin', '관리비'), cats: ['labor', 'equipment', 'communication', 'food'], color: '#3b82f6' },
            { key: 'misc', label: t('statsPage.expGroupMisc', '기타경비'), cats: ['other'], color: '#6b7280' },
        ];
        const crmExpCatMap = {};
        const crmExpCatCount = {};
        filteredExpenses.forEach(e => {
            const cat = e.category || 'other';
            crmExpCatMap[cat] = (crmExpCatMap[cat] || 0) + (parseInt(e.amount) || 0);
            crmExpCatCount[cat] = (crmExpCatCount[cat] || 0) + 1;
        });

        // Grouped P&L expense rows
        const crmExpGroupedRows = CRM_EXP_GROUPS.map(g => {
            const gc = g.cats.filter(c => crmExpCatMap[c]);
            if (gc.length === 0) return '';
            const gt = gc.reduce((s, c) => s + (crmExpCatMap[c] || 0), 0);
            const gP = totalExp > 0 ? ((gt / totalExp) * 100).toFixed(1) : '0.0';
            const cr = gc.map(c => {
                const a2 = crmExpCatMap[c] || 0;
                const p2 = totalExp > 0 ? ((a2 / totalExp) * 100).toFixed(1) : '0.0';
                return `<tr><td style="padding-left:40px;color:#6b7280;font-size:10px;">└ ${getExpenseCatLabel(c)}</td><td style="text-align:right;font-size:10px;color:#6b7280;">${fmt(a2)}</td><td style="text-align:right;font-size:10px;color:#9ca3af;">${p2}%</td></tr>`;
            }).join('');
            return `<tr><td style="padding-left:24px;font-weight:600;color:${g.color};">■ ${g.label}</td><td style="text-align:right;font-weight:600;">${fmt(gt)}</td><td style="text-align:right;font-size:10px;color:#9ca3af;">${gP}%</td></tr>${cr}`;
        }).join('');

        // EBT
        const otherIncome = 0;
        const otherExpense2 = 0;
        const ebt = opProfit + otherIncome - otherExpense2;
        const operatingMargin = opMargin;

        // ── Payment method breakdown ──
        const crmPmMap = {};
        const crmPmCount = {};
        filteredExpenses.forEach(e => {
            const pm = e.payment_method || 'other';
            crmPmMap[pm] = (crmPmMap[pm] || 0) + (parseInt(e.amount) || 0);
            crmPmCount[pm] = (crmPmCount[pm] || 0) + 1;
        });
        const crmPmLabels = { cash: t('statsPage.expPayCash', '현금'), card: t('statsPage.expPayCard', '카드'), transfer: t('statsPage.expPayTransfer', '이체'), other: t('statsPage.expPayOther', '기타') };

        // ── TOP 5 expenses ──
        const crmTop5 = [...filteredExpenses].sort((a, b) => (parseInt(b.amount) || 0) - (parseInt(a.amount) || 0)).slice(0, 5);

        // ── Expense Detail Section (grouped) ──
        const crmExpDetailSection = filteredExpenses.length > 0 ? `
        <div class="section">
            <h2>💸 ${t('statsPage.rptExpDetail', '지출 상세 분석')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Expense Analysis</span></h2>
            <table>
                <thead><tr><th>${t('statsPage.expCategory', '카테고리')}</th><th style="text-align:right;">${t('statsPage.plAmount', '금액')}</th><th style="text-align:right;">${t('statsPage.rptSalesShare', '비중')}</th><th style="text-align:right;">${t('statsPage.rptRevPercent', '매출 대비')}</th><th style="text-align:right;">${t('statsPage.rptExpCount', '건수')}</th></tr></thead>
                <tbody>
                    ${CRM_EXP_GROUPS.map(g => {
            const gc = g.cats.filter(c => crmExpCatMap[c]);
            if (gc.length === 0) return '';
            const gt = gc.reduce((s, c) => s + (crmExpCatMap[c] || 0), 0);
            const gCnt = gc.reduce((s, c) => s + (crmExpCatCount[c] || 0), 0);
            const gP = totalExp > 0 ? ((gt / totalExp) * 100).toFixed(1) : '0.0';
            const gR = totalRevenue > 0 ? ((gt / totalRevenue) * 100).toFixed(1) : '0.0';
            const cr = gc.map(c => {
                const a2 = crmExpCatMap[c] || 0; const cn = crmExpCatCount[c] || 0;
                const p2 = totalExp > 0 ? ((a2 / totalExp) * 100).toFixed(1) : '0.0';
                const r2 = totalRevenue > 0 ? ((a2 / totalRevenue) * 100).toFixed(1) : '0.0';
                return `<tr><td style="padding-left:28px;font-size:10px;color:#6b7280;">└ ${getExpenseCatLabel(c)}</td><td style="text-align:right;font-size:10px;">${fmt(a2)}</td><td style="text-align:right;font-size:10px;color:#9ca3af;">${p2}%</td><td style="text-align:right;font-size:10px;color:#9ca3af;">${r2}%</td><td style="text-align:right;font-size:10px;color:#9ca3af;">${cn}${t('statsPage.units', '건')}</td></tr>`;
            }).join('');
            const bar2 = `<div style="background:#e5e7eb;border-radius:4px;height:5px;width:100%;margin-top:2px;"><div style="background:${g.color};border-radius:4px;height:5px;width:${Math.min(parseFloat(gP), 100)}%;"></div></div>`;
            return `<tr class="subtotal-row"><td style="font-weight:700;color:${g.color};">■ ${g.label}${bar2}</td><td style="text-align:right;font-weight:700;">${fmt(gt)}</td><td style="text-align:right;font-weight:600;">${gP}%</td><td style="text-align:right;font-weight:600;">${gR}%</td><td style="text-align:right;font-weight:600;">${gCnt}${t('statsPage.units', '건')}</td></tr>${cr}`;
        }).join('')}
                    <tr class="total-row"><td style="font-weight:800;">${t('statsPage.rptTotal', '합계')}</td><td style="text-align:right;font-weight:800;color:#dc2626;">${fmt(totalExp)}</td><td style="text-align:right;font-weight:700;">100%</td><td style="text-align:right;font-weight:700;">${totalRevenue > 0 ? ((totalExp / totalRevenue) * 100).toFixed(1) : '0.0'}%</td><td style="text-align:right;font-weight:700;">${filteredExpenses.length}${t('statsPage.units', '건')}</td></tr>
                </tbody>
            </table>
        </div>` : '';

        // ── Monthly Expense Trend ──
        const crmAllExpMonths = Object.keys(crmMonthExpMap).sort();
        const crmExpTrendSection = crmAllExpMonths.length > 0 ? `
        <div class="section">
            <h2>📅 ${t('statsPage.rptExpTrend', '월별 지출 추이')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Monthly Expense Trend</span></h2>
            <table>
                <thead><tr><th>${t('statsPage.month', '월')}</th><th style="text-align:right;">${t('statsPage.rptExpTotal', '총 지출')}</th><th style="text-align:right;">MoM</th><th style="text-align:right;">${t('statsPage.rptRevPercent', '매출 대비')}</th><th style="text-align:right;">${t('statsPage.rptExpCount', '건수')}</th></tr></thead>
                <tbody>
                    ${crmAllExpMonths.map((m, idx) => {
            const a3 = crmMonthExpMap[m]; const cn3 = crmMonthExpCount[m] || 0;
            const pv = idx > 0 ? crmMonthExpMap[crmAllExpMonths[idx - 1]] : null;
            const mm = pv && pv > 0 ? ((a3 - pv) / pv * 100).toFixed(1) : null;
            const mr = trendData.find(td => td.month === m)?.revenue || 0;
            const rp = mr > 0 ? ((a3 / mr) * 100).toFixed(1) : '-';
            return `<tr><td>${m}</td><td style="text-align:right;font-weight:600;color:#dc2626;">${fmt(a3)}</td><td style="text-align:right;">${mm !== null ? `<span style="color:${parseFloat(mm) >= 0 ? '#dc2626' : '#059669'};font-weight:600;">${parseFloat(mm) > 0 ? '+' : ''}${mm}%</span>` : '<span style="color:#9ca3af;">-</span>'}</td><td style="text-align:right;">${rp}%</td><td style="text-align:right;">${cn3}${t('statsPage.units', '건')}</td></tr>`;
        }).join('')}
                    <tr class="total-row"><td style="font-weight:800;">${t('statsPage.rptTotal', '합계')}</td><td style="text-align:right;font-weight:800;color:#dc2626;">${fmt(totalExp)}</td><td></td><td style="text-align:right;font-weight:700;">${totalRevenue > 0 ? ((totalExp / totalRevenue) * 100).toFixed(1) : '0.0'}%</td><td style="text-align:right;font-weight:700;">${filteredExpenses.length}${t('statsPage.units', '건')}</td></tr>
                </tbody>
            </table>
        </div>` : '';

        // ── Payment Method Section ──
        const crmPmEntries = Object.entries(crmPmMap).sort((a, b) => b[1] - a[1]);
        const crmPmSection = crmPmEntries.length > 0 ? `
        <div class="section">
            <h2>💳 ${t('statsPage.rptPmBreakdown', '결제수단별 분석')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Payment Method</span></h2>
            <table>
                <thead><tr><th>${t('statsPage.expPayment', '결제수단')}</th><th style="text-align:right;">${t('statsPage.plAmount', '금액')}</th><th style="text-align:right;">${t('statsPage.rptSalesShare', '비중')}</th><th style="text-align:right;">${t('statsPage.rptExpCount', '건수')}</th></tr></thead>
                <tbody>
                    ${crmPmEntries.map(([pm, amt]) => {
            const pp = totalExp > 0 ? ((amt / totalExp) * 100).toFixed(1) : '0.0';
            const bar3 = `<div style="background:#e5e7eb;border-radius:4px;height:5px;width:100%;margin-top:2px;"><div style="background:#6366f1;border-radius:4px;height:5px;width:${Math.min(parseFloat(pp), 100)}%;"></div></div>`;
            return `<tr><td>${crmPmLabels[pm] || pm}${bar3}</td><td style="text-align:right;font-weight:600;">${fmt(amt)}</td><td style="text-align:right;">${pp}%</td><td style="text-align:right;">${crmPmCount[pm] || 0}${t('statsPage.units', '건')}</td></tr>`;
        }).join('')}
                    <tr class="total-row"><td style="font-weight:800;">${t('statsPage.rptTotal', '합계')}</td><td style="text-align:right;font-weight:800;">${fmt(totalExp)}</td><td style="text-align:right;font-weight:700;">100%</td><td style="text-align:right;font-weight:700;">${filteredExpenses.length}${t('statsPage.units', '건')}</td></tr>
                </tbody>
            </table>
        </div>` : '';

        // ── TOP 5 Section ──
        const crmTop5Section = crmTop5.length > 0 ? `
        <div class="section">
            <h2>🏆 ${t('statsPage.rptTop5Exp', 'TOP 5 고액 지출')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Top Expenses</span></h2>
            <table>
                <thead><tr><th style="width:30px;">#</th><th>${t('statsPage.expDate', '날짜')}</th><th style="text-align:right;">${t('statsPage.plAmount', '금액')}</th><th>${t('statsPage.expCategory', '카테고리')}</th><th>${t('statsPage.expMemo', '메모')}</th></tr></thead>
                <tbody>
                    ${crmTop5.map((e, i) => {
            const medals = ['🥇', '🥈', '🥉', '4', '5'];
            return `<tr><td style="text-align:center;">${medals[i]}</td><td>${e.expense_date || '-'}</td><td style="text-align:right;font-weight:700;color:#dc2626;">${fmt(parseInt(e.amount) || 0)}</td><td>${getExpenseCatLabel(e.category || 'other')}</td><td style="color:#6b7280;font-size:10px;">${e.memo || '-'}</td></tr>`;
        }).join('')}
                </tbody>
            </table>
        </div>` : '';

        // ── RFM section ──
        const rfmSection = rfmData && rfmData.segments ? `
        <div class="section">
            <h2>🎯 ${t('statsPage.rptRfmTitle', '고객 세분화 (RFM 분석)')}</h2>
            <table>
                <thead><tr><th>${t('statsPage.rptSegment', '세그먼트')}</th><th style="text-align:right;">${t('statsPage.rptCustomerCount', '고객 수')}</th><th style="text-align:right;">${t('statsPage.rptRatio', '비율')}</th><th style="text-align:right;">${t('statsPage.salesLabel', '매출')}</th><th style="text-align:right;">${t('statsPage.rptSalesShare', '매출 비중')}</th></tr></thead>
                <tbody>
                    ${Object.entries(rfmData.segments).map(([key, seg]) => {
            const icons = { vip: '👑 VIP', excellent: `⭐ ${t('statsPage.rptExcellent', '우수 고객')}`, normal: `👤 ${t('statsPage.rptNormal', '일반 고객')}`, attention: `⚠️ ${t('statsPage.rptAttention', '관심 필요')}`, churn_risk: `🚨 ${t('statsPage.rptChurnRisk', '이탈 위험')}` };
            return `<tr><td>${icons[key] || key}</td><td style="text-align:right;">${seg.count}${t('statsPage.peopleSuffix', '명')}</td><td style="text-align:right;">${seg.count_pct}%</td><td style="text-align:right;">${fmt(seg.revenue)}</td><td style="text-align:right;">${seg.revenue_pct}%</td></tr>`;
        }).join('')}
                </tbody>
            </table>
            ${rfmData.customers?.length > 0 ? `
            <h3 style="margin-top:16px;font-size:12px;">Top 10 ${t('statsPage.rptCustomerRfm', '고객 RFM')}</h3>
            <table>
                <thead><tr><th>${t('statsPage.rptName', '이름')}</th><th>${t('statsPage.rptCompany', '기업')}</th><th style="text-align:center;">R</th><th style="text-align:center;">F</th><th style="text-align:center;">M</th><th style="text-align:right;">RFM</th><th style="text-align:right;">${t('statsPage.rptSegment', '세그먼트')}</th></tr></thead>
                <tbody>
                    ${rfmData.customers.slice(0, 10).map(c => {
            const icons = { vip: '👑', excellent: '⭐', normal: '👤', attention: '⚠️', churn_risk: '🚨' };
            return `<tr><td>${c.name}</td><td>${c.company || '-'}</td><td style="text-align:center;">${c.r_score}</td><td style="text-align:center;">${c.f_score}</td><td style="text-align:center;">${c.m_score}</td><td style="text-align:right;font-weight:700;">${c.rfm_total}</td><td style="text-align:right;">${icons[c.segment] || ''}</td></tr>`;
        }).join('')}
                </tbody>
            </table>` : ''}
        </div>` : '';

        // ── Forecast section ──
        const forecastSection = analyticsData.forecastMonths?.length > 0 ? `
        <div class="section">
            <h2>🔮 ${t('statsPage.rptForecast', '매출 예측')}</h2>
            <div class="two-col">
                <div>
                    <table>
                        <thead><tr><th>${t('statsPage.rptForecastMonth', '예측 월')}</th><th style="text-align:right;">${t('statsPage.rptForecastSales', '예측 매출')}</th></tr></thead>
                        <tbody>
                            ${analyticsData.forecastMonths.map(f => `<tr><td>${f.month}</td><td style="text-align:right;color:#0891b2;font-weight:700;">${fmt(f.value)}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
                <div>
                    <table>
                        <tr><td>YTD ${t('statsPage.salesLabel', '매출')}</td><td style="text-align:right;font-weight:700;">${fmt(analyticsData.ytdRevenue || 0)}</td></tr>
                        <tr><td>${t('statsPage.rptAnnualOutlook', '연간 전망')}</td><td style="text-align:right;font-weight:700;color:#0891b2;">${fmt(analyticsData.annualRunRate || 0)}</td></tr>
                        <tr><td>${t('statsPage.rptQuarterForecast', '분기 예측')}</td><td style="text-align:right;font-weight:700;">${fmt(analyticsData.quarterForecast || 0)}</td></tr>
                        ${analyticsData.goalProbability !== null ? `<tr><td>${t('statsPage.rptGoalProb', '목표 달성 확률')}</td><td style="text-align:right;font-weight:700;color:${analyticsData.goalProbability >= 70 ? '#059669' : analyticsData.goalProbability >= 40 ? '#d97706' : '#dc2626'};">${analyticsData.goalProbability}%</td></tr>` : ''}
                    </table>
                </div>
            </div>
        </div>` : '';

        // ── Region section ──
        const regionSection = analyticsData.topRegions?.length > 0 ? `
        <div class="section">
            <h2>📍 ${t('statsPage.rptRegionSales', '지역별 매출')}</h2>
            <table>
                <thead><tr><th>${t('statsPage.rptRegion', '지역')}</th><th style="text-align:right;">${t('statsPage.salesLabel', '매출')}</th><th style="text-align:right;">${t('statsPage.rptSalesShare', '비중')}</th><th style="text-align:right;">${t('statsPage.rptCount', '건수')}</th></tr></thead>
                <tbody>${analyticsData.topRegions.map(r => {
            const rPct = totalRevenue > 0 ? ((r.revenue / totalRevenue) * 100).toFixed(1) : '0.0';
            return `<tr><td>${r.name}</td><td style="text-align:right;">${fmt(r.revenue)}</td><td style="text-align:right;">${rPct}%</td><td style="text-align:right;">${r.count}</td></tr>`;
        }).join('')}</tbody>
            </table>
        </div>` : '';

        // ── Top Products section ──
        const productSection = analyticsData.topProducts?.length > 0 ? `
        <div class="section">
            <h2>🏆 ${t('statsPage.rptTopProducts', '상위 상품')}</h2>
            <table>
                <thead><tr><th>#</th><th>${t('statsPage.productNameLabel', '상품명')}</th><th style="text-align:right;">${t('statsPage.salesLabel', '매출')}</th><th style="text-align:right;">${t('statsPage.rptSalesShare', '비중')}</th><th style="text-align:right;">${t('statsPage.quantityLabel', '수량')}</th></tr></thead>
                <tbody>${analyticsData.topProducts.map((p, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const pPct = totalRevenue > 0 ? ((p.revenue / totalRevenue) * 100).toFixed(1) : '0.0';
            return `<tr><td>${medals[i] || (i + 1)}</td><td>${p.name}</td><td style="text-align:right;font-weight:600;">${fmt(p.revenue)}</td><td style="text-align:right;">${pPct}%</td><td style="text-align:right;">${p.qty}</td></tr>`;
        }).join('')}</tbody>
            </table>
        </div>` : '';

        // ── Auto Insights (Enhanced) ──
        const insights = [];
        const crmGrowth = trendData.length >= 2 ? (() => { const cur = trendData[trendData.length - 1].revenue; const prev = trendData[trendData.length - 2].revenue; return prev > 0 ? parseFloat(((cur - prev) / prev * 100).toFixed(1)) : null; })() : null;
        if (crmGrowth !== null && crmGrowth > 10) insights.push(`📈 ${t('statsPage.insightGrowth', '전월 대비 매출이 크게 성장했습니다')} (+${crmGrowth}%)`);
        if (crmGrowth !== null && crmGrowth < -10) insights.push(`📉 ${t('statsPage.insightDecline', '전월 대비 매출이 감소했습니다')} (${crmGrowth}%)`);
        if (parseFloat(grossMargin) > 50) insights.push(`💰 ${t('statsPage.insightHighMargin', '높은 매출총이익률을 유지하고 있습니다')} (${grossMargin}%)`);
        if (parseFloat(grossMargin) < 20) insights.push(`⚠️ ${t('statsPage.insightLowMargin', '매출총이익률이 낮은 수준입니다')} (${grossMargin}%)`);
        if (totalExp > 0 && totalRevenue > 0 && (totalExp / totalRevenue) > 0.3) insights.push(`🔍 ${t('statsPage.insightHighExpense', '판관비 비율이 높습니다. 비용 최적화를 검토하세요')} (${((totalExp / totalRevenue) * 100).toFixed(1)}%)`);
        if (crmSortedChannels.length > 0) {
            const topCh = crmSortedChannels[0];
            const topChPct = totalRevenue > 0 ? ((topCh[1] / totalRevenue) * 100).toFixed(1) : '0';
            if (parseFloat(topChPct) > 60) insights.push(`📡 ${t('statsPage.insightChannelConc', '채널 집중도가 높습니다')} (${topCh[0]}: ${topChPct}%)`);
        }
        if (rfmData?.segments?.churn_risk?.count > 0) insights.push(`🚨 ${t('statsPage.insightChurn', '이탈 위험 고객이 있습니다')} (${rfmData.segments.churn_risk.count}${t('statsPage.peopleSuffix', '명')})`);
        if (opProfit < 0) insights.push(`❌ ${t('statsPage.insightLoss', '영업손실이 발생하고 있습니다. 수익 구조 개선이 필요합니다.')}`);
        // Enhanced insights
        if (trendData.length >= 2) {
            const curExp = trendData[trendData.length - 1].expense;
            const prevExp = trendData[trendData.length - 2].expense;
            if (prevExp > 0) {
                const expGrowth = ((curExp - prevExp) / prevExp * 100).toFixed(1);
                if (parseFloat(expGrowth) > 20) insights.push(`💸 ${t('statsPage.insightExpIncrease', '지출이 전월 대비 크게 증가했습니다')} (+${expGrowth}%)`);
            }
        }
        if (ebt < 0 && totalRevenue > 0) insights.push(`🔻 ${t('statsPage.insightNetLoss', '세전 순손실이 발생하고 있습니다. 비용 구조 점검이 시급합니다.')}`);

        const insightsSection = insights.length > 0 ? `
        <div class="section" style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:1px solid #f59e0b;">
            <h2>💡 ${t('statsPage.rptInsights', 'AI 인사이트')}</h2>
            <div style="display:flex;flex-direction:column;gap:8px;">
                ${insights.map(i => `<div style="background:rgba(255,255,255,0.7);padding:8px 12px;border-radius:8px;font-size:11px;font-weight:600;">${i}</div>`).join('')}
            </div>
        </div>` : '';

        const printHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>CRM Report - ${reportDate}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:#1f2937;max-width:900px;margin:auto;font-size:11px;line-height:1.5}
.report-header{background:linear-gradient(135deg,#4f46e5,#7c3aed,#6d28d9);color:white;padding:32px 40px;position:relative;overflow:hidden}
.report-header::after{content:'';position:absolute;top:-50%;right:-10%;width:300px;height:300px;background:rgba(255,255,255,0.06);border-radius:50%}
.brand-name{font-size:22px;font-weight:800;letter-spacing:-0.5px;margin-bottom:2px}
.brand-sub{font-size:10px;opacity:0.7;letter-spacing:2px;text-transform:uppercase;font-weight:500}
.report-title{font-size:16px;font-weight:700;margin-top:16px}
.report-meta{display:flex;gap:20px;margin-top:8px;font-size:10px;opacity:0.85}
.content{padding:30px 40px}
.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px}
.kpi-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px;text-align:center}
.kpi-label{font-size:9px;font-weight:600;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px;margin-bottom:5px}
.kpi-value{font-size:16px;font-weight:800}
.kpi-value.green{color:#059669} .kpi-value.red{color:#dc2626} .kpi-value.blue{color:#2563eb} .kpi-value.violet{color:#7c3aed} .kpi-value.amber{color:#d97706} .kpi-value.cyan{color:#0891b2}
.section{margin-bottom:20px;break-inside:avoid}
.section h2{font-size:13px;font-weight:700;color:#1f2937;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #e5e7eb}
.section h3{font-size:12px;font-weight:700;color:#6b7280;margin-bottom:8px}
table{width:100%;border-collapse:collapse;font-size:11px}
th{background:#f3f4f6;padding:7px 10px;text-align:left;font-weight:700;font-size:10px;text-transform:uppercase;color:#6b7280;border-bottom:2px solid #e5e7eb}
td{padding:6px 10px;border-bottom:1px solid #f3f4f6}
tr:last-child td{border-bottom:none}
.total-row td{font-weight:700;border-top:2px solid #d1d5db;border-bottom:none;padding-top:8px}
.subtotal-row td{font-weight:600;background:#f9fafb}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
.report-footer{border-top:1px solid #e5e7eb;padding:16px 40px;display:flex;justify-content:space-between;align-items:center;color:#9ca3af;font-size:9px}
.footer-brand{font-weight:700;color:#6b7280}
.confidential{background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:4px;font-weight:600;font-size:8px;text-transform:uppercase;letter-spacing:0.5px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:0;size:A4}}
</style></head><body>

<!-- Header -->
<div class="report-header">
    <div class="brand-name">SpaceMatch</div>
    <div class="brand-sub">CRM Analytics Platform</div>
    <div class="report-title">📊 CRM ${t('statsPage.rptMainTitle', '종합 분석 보고서')}</div>
    <div class="report-meta">
        <span>📅 ${reportDate}</span>
        <span>🌍 ${selectedCountry}</span>
        <span>📈 ${filteredSales.length} ${t('statsPage.records', '건')}</span>
    </div>
</div>

<div class="content">

    <!-- Executive Summary KPIs — 8 cards -->
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);">
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.totalSales', '총 매출')}</div><div class="kpi-value green">${fmt(totalRevenue)}</div></div>
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.rptGrossMargin', '매출총이익률')}</div><div class="kpi-value blue">${grossMargin}%</div></div>
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.rptMoM', '전월 대비')}</div><div class="kpi-value ${crmGrowth !== null && crmGrowth >= 0 ? 'green' : 'red'}">${crmGrowth !== null ? `${crmGrowth > 0 ? '+' : ''}${crmGrowth}%` : '-'}</div></div>
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.plOperatingMargin', '영업이익률')}</div><div class="kpi-value ${parseFloat(opMargin) >= 0 ? 'blue' : 'red'}">${opMargin}%</div></div>
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.rptAvgOrder', '평균 주문가')}</div><div class="kpi-value violet">${(() => { const totalTx = filteredSales.reduce((s, r) => s + (parseInt(r.transaction_count) || 0), 0); return totalTx > 0 ? fmt(Math.round(totalRevenue / totalTx)) : '-'; })()}</div></div>
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.rptTotalCustomers', '총 고객 수')}</div><div class="kpi-value cyan">${fmt(filteredSales.reduce((s, r) => s + (parseInt(r.customer_count) || 0), 0))}</div></div>
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.rptTotalExpense', '총 지출')}</div><div class="kpi-value red">${fmt(totalExp)}</div></div>
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.rptNetProfit', '순이익')}</div><div class="kpi-value ${ebt >= 0 ? 'green' : 'red'}">${fmt(ebt)}</div></div>
    </div>

    <!-- AI Insights -->
    ${insightsSection}

    <!-- Detailed P&L Statement (7-step) -->
    <div class="section">
        <h2>📋 ${t('statsPage.plStatement', '손익계산서')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Profit & Loss</span></h2>
        <table>
            <thead><tr><th style="width:55%;">${t('statsPage.plItem', '계정과목')}</th><th style="text-align:right;width:30%;">${t('statsPage.plAmount', '금액')}</th><th style="text-align:right;width:15%;">${t('statsPage.plPercent', '비율')}</th></tr></thead>
            <tbody>
                <tr class="subtotal-row">
                    <td style="font-weight:700;">Ⅰ. ${t('statsPage.plRevenue', '매출액')}</td>
                    <td style="text-align:right;color:#059669;font-weight:700;">${fmt(totalRevenue)}</td>
                    <td style="text-align:right;color:#059669;font-weight:600;">100.0%</td>
                </tr>
                ${crmSortedChannels.length > 0 ? crmSortedChannels.map(([name, rev]) => {
            const chPct = totalRevenue > 0 ? ((rev / totalRevenue) * 100).toFixed(1) : '0.0';
            return `<tr><td class="indent" style="color:#6b7280;font-size:10px;padding-left:24px;">└ ${name}</td><td style="text-align:right;font-size:10px;color:#6b7280;">${fmt(rev)}</td><td style="text-align:right;font-size:10px;color:#6b7280;">${chPct}%</td></tr>`;
        }).join('') : ''}

                <tr><td colspan="3" style="padding:3px;"></td></tr>

                <tr>
                    <td style="font-weight:600;">Ⅱ. ${t('statsPage.plCost', '매출원가')}</td>
                    <td style="text-align:right;" class="negative">(${fmt(totalCost)})</td>
                    <td style="text-align:right;color:#dc2626;">${totalRevenue > 0 ? ((totalCost / totalRevenue) * 100).toFixed(1) : '0.0'}%</td>
                </tr>

                <tr><td colspan="3" style="padding:3px;"></td></tr>

                <tr class="subtotal-row" style="background:#ecfdf5;">
                    <td style="font-weight:700;">Ⅲ. ${t('statsPage.plGrossProfit', '매출총이익')}</td>
                    <td style="text-align:right;color:${grossProfit >= 0 ? '#059669' : '#dc2626'};font-weight:700;">${fmt(grossProfit)}</td>
                    <td style="text-align:right;font-weight:600;">${grossMargin}%</td>
                </tr>

                <tr><td colspan="3" style="padding:3px;"></td></tr>

                <tr>
                    <td style="font-weight:600;">Ⅳ. ${t('statsPage.plExpenses', '판매비와관리비')}</td>
                    <td style="text-align:right;" class="negative">(${fmt(totalExp)})</td>
                    <td style="text-align:right;color:#dc2626;">${totalRevenue > 0 ? ((totalExp / totalRevenue) * 100).toFixed(1) : '0.0'}%</td>
                </tr>
                ${crmExpGroupedRows}

                <tr><td colspan="3" style="padding:3px;"></td></tr>

                <tr class="total-row" style="background:${opProfit >= 0 ? '#ecfdf5' : '#fef2f2'};">
                    <td style="font-weight:800;font-size:12px;">Ⅴ. ${t('statsPage.plOperatingProfit', '영업이익')}</td>
                    <td style="text-align:right;color:${opProfit >= 0 ? '#059669' : '#dc2626'};font-weight:800;font-size:13px;">${fmt(opProfit)}</td>
                    <td style="text-align:right;font-weight:700;">${operatingMargin}%</td>
                </tr>

                <tr><td colspan="3" style="padding:3px;"></td></tr>

                <tr>
                    <td style="font-weight:600;">Ⅵ. ${t('statsPage.plNonOperating', '영업외수익(비용)')}</td>
                    <td style="text-align:right;font-weight:600;">${fmt(otherIncome - otherExpense2)}</td>
                    <td style="text-align:right;color:#9ca3af;">-</td>
                </tr>

                <tr><td colspan="3" style="padding:3px;"></td></tr>

                <tr class="total-row" style="background:${ebt >= 0 ? '#eff6ff' : '#fef2f2'};border-top:3px double #1f2937;">
                    <td style="font-weight:800;font-size:13px;">Ⅶ. ${t('statsPage.plEBT', '세전이익 (EBT)')}</td>
                    <td style="text-align:right;color:${ebt >= 0 ? '#2563eb' : '#dc2626'};font-weight:800;font-size:14px;">${fmt(ebt)}</td>
                    <td style="text-align:right;font-weight:700;">${totalRevenue > 0 ? ((ebt / totalRevenue) * 100).toFixed(1) : '0.0'}%</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Profitability Summary -->
    <div class="kpi-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:24px;">
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.plGrossMargin', '매출총이익률')}</div><div class="kpi-value ${parseFloat(grossMargin) >= 0 ? 'green' : 'red'}">${grossMargin}%</div></div>
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.plOperatingMargin', '영업이익률')}</div><div class="kpi-value ${parseFloat(operatingMargin) >= 0 ? 'blue' : 'red'}">${operatingMargin}%</div></div>
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.plSgaRatio', '판관비율')}</div><div class="kpi-value violet">${totalRevenue > 0 ? ((totalExp / totalRevenue) * 100).toFixed(1) : '0.0'}%</div></div>
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.plCostRatio', '원가율')}</div><div class="kpi-value red">${totalRevenue > 0 ? ((totalCost / totalRevenue) * 100).toFixed(1) : '0.0'}%</div></div>
        <div class="kpi-card"><div class="kpi-label">${t('statsPage.plEBTMargin', '세전이익률')}</div><div class="kpi-value ${ebt >= 0 ? 'blue' : 'red'}">${totalRevenue > 0 ? ((ebt / totalRevenue) * 100).toFixed(1) : '0.0'}%</div></div>
    </div>

    <!-- Monthly Trend (with expense columns) -->
    ${trendRows ? `
    <div class="section">
        <h2>📈 ${t('statsPage.analyticsTrend', '매출 트렌드')} <span style="font-size:10px;color:#9ca3af;font-weight:500;margin-left:8px;">Monthly Trend</span></h2>
        <table>
            <thead><tr><th>${t('statsPage.month', '월')}</th><th style="text-align:right;">${t('statsPage.plRevenue', '매출')}</th><th style="text-align:right;">${t('statsPage.plCost', '원가')}</th><th style="text-align:right;">${t('statsPage.plGrossProfit', '총이익')}</th><th style="text-align:right;">${t('statsPage.plExpenses', '판관비')}</th><th style="text-align:right;">${t('statsPage.rptNetProfit', '순이익')}</th><th style="text-align:right;">MoM</th><th style="text-align:right;">${t('statsPage.customersLabel', '고객')}</th><th style="text-align:right;">${t('statsPage.transactionsLabel', '거래')}</th></tr></thead>
            <tbody>
                ${trendRows}
                <tr class="total-row" style="background:#f0fdf4;">
                    <td style="font-weight:800;">📊 ${t('statsPage.rptTotal', '합계')}</td>
                    <td style="text-align:right;font-weight:800;color:#059669;">${fmt(trendTotalRev)}</td>
                    <td style="text-align:right;color:#dc2626;">${fmt(trendTotalCost)}</td>
                    <td style="text-align:right;font-weight:800;color:${(trendTotalRev - trendTotalCost) >= 0 ? '#059669' : '#dc2626'};">${fmt(trendTotalRev - trendTotalCost)}</td>
                    <td style="text-align:right;font-weight:700;color:#f97316;">${fmt(trendTotalExp)}</td>
                    <td style="text-align:right;font-weight:800;color:${trendTotalNet >= 0 ? '#059669' : '#dc2626'};">${fmt(trendTotalNet)}</td>
                    <td colspan="3"></td>
                </tr>
            </tbody>
        </table>
    </div>` : ''}

    <!-- Channels & Categories -->
    <div class="two-col">
        ${channelRows ? `
        <div class="section" style="margin-bottom:0;">
            <h2>📡 ${t('statsPage.analyticsChannels', '채널별 매출')}</h2>
            <table>
                <thead><tr><th>${t('statsPage.channel', '채널')}</th><th style="text-align:right;">${t('statsPage.salesLabel', '매출')}</th><th style="text-align:right;">${t('statsPage.rptSalesShare', '비중')}</th></tr></thead>
                <tbody>${channelRows}</tbody>
            </table>
        </div>` : ''}

        ${categoryRows ? `
        <div class="section" style="margin-bottom:0;">
            <h2>🏷️ ${t('statsPage.analyticsCategories', '카테고리 분석')}</h2>
            <table>
                <thead><tr><th>${t('statsPage.category', '카테고리')}</th><th style="text-align:right;">${t('statsPage.salesLabel', '매출')}</th><th style="text-align:right;">${t('statsPage.rptSalesShare', '비중')}</th></tr></thead>
                <tbody>${categoryRows}</tbody>
            </table>
        </div>` : ''}
    </div>

    ${rfmSection}
    ${forecastSection}
    ${regionSection}
    ${productSection}

    <!-- Expense Sections -->
    ${crmExpDetailSection}

    <div class="two-col">
        ${crmExpTrendSection ? `<div>${crmExpTrendSection}</div>` : ''}
        ${crmPmSection ? `<div>${crmPmSection}</div>` : ''}
    </div>

    ${crmTop5Section}

</div>

<!-- Footer -->
<div class="report-footer">
    <div><span class="footer-brand">SpaceMatch CRM</span> · ${t('statsPage.rptAutoGenerated', '자동 생성된 종합 보고서')} · ${reportDate}</div>
    <div class="confidential">CONFIDENTIAL</div>
</div>
</body></html>`;

        const w = window.open('', '_blank', 'width=900,height=1200');
        if (w) {
            w.document.write(printHTML);
            w.document.close();
            w.onload = () => setTimeout(() => w.print(), 500);
        }
        // Also download as HTML file
        const now2 = new Date();
        downloadReportAsHTML(printHTML, `CRM_Report_${now2.getFullYear()}${String(now2.getMonth() + 1).padStart(2, '0')}${String(now2.getDate()).padStart(2, '0')}.html`);
        showToast(t('statsPage.crmReportGenerated', 'CRM 종합 보고서가 생성되었습니다'), 'success');
    };

    // ── Tax Settings Editor State ──
    const [taxEditMode, setTaxEditMode] = useState(false);
    const [editVatRate, setEditVatRate] = useState('');
    const [editSimplifiedRate, setEditSimplifiedRate] = useState('');
    const [editSimplifiedThreshold, setEditSimplifiedThreshold] = useState('');
    const [editBrackets, setEditBrackets] = useState([]);
    const [editDeduction, setEditDeduction] = useState('');
    const [taxSettingsLoading, setTaxSettingsLoading] = useState(false);
    const [hasCustomSettings, setHasCustomSettings] = useState(false);

    const emptyForm = {
        record_type: 'monthly',
        record_date: '',
        monthly_revenue: '',
        customer_count: '',
        transaction_count: '',
        avg_unit_price: '',
        best_selling_item: '',
        best_selling_other: '',
        venue_type: '',
        region: '',
        region_detail: '',
        satisfaction: 0,
        memo: '',
        // Extended fields (same as Excel mapping)
        product_name: '',
        sku: '',
        brand: '',
        option_info: '',
        quantity_sold: '',
        cost_price: '',
        discount_amount: '',
        tax_amount: '',
        shipping_cost: '',
        refund_amount: '',
        commission_fee: '',
        net_revenue: '',
        profit_amount: '',
        payment_method: '',
        order_number: '',
        sales_channel: '',
        platform: '',
        store_name: '',
        staff_name: '',
        customer_name: '',
    };

    const [form, setForm] = useState(emptyForm);

    const fetchStats = useCallback(async () => {
        try {
            const countryParam = `&country_code=${selectedCountry}`;
            const res = await fetch(`${API_BASE}/${STATS_API}?action=list${countryParam}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setAllStats(data.stats || []);
                setSummary(data.summary || {});
                setCountryBreakdown(data.countryBreakdown || []);
            }
        } catch {
            showToast(t('statsPage.loadFailed'), 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast, selectedCountry, STATS_API]);

    useEffect(() => { fetchStats(); }, [fetchStats]);



    // ── Upload: Fetch ERP templates (GET → seller_upload.php) ──
    const fetchTemplates = useCallback(async () => {
        if (Object.keys(erpTemplates).length > 0) return;
        setLoadingTemplates(true);
        try {
            const res = await fetch(`${API_BASE}/seller_upload.php?action=templates`, { credentials: 'include' });
            if (!res.ok) { console.warn('[Templates] HTTP', res.status); return; }
            const data = await res.json();
            if (data.success) {
                setErpTemplates(data.templates || {});
            }
        } catch (err) { console.warn('[Templates] fetch error:', err); } finally { setLoadingTemplates(false); }
    }, [erpTemplates]);

    // ── Upload: Parse file with SheetJS (multi-sheet support) ──
    const handleFileParse = useCallback((file) => {
        console.log('[Upload] Parsing file:', file.name, file.size, 'bytes');
        setUploadFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target.result, { type: 'array', cellDates: true });
                workbookRef.current = workbook;

                // Analyze all sheets
                const sheets = workbook.SheetNames.map(name => {
                    const sheet = workbook.Sheets[name];
                    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
                    const rowCount = data.filter(row => row.some(c => c !== '')).length;
                    return { name, rowCount };
                }).filter(s => s.rowCount >= 2);

                console.log('[Upload] Found sheets:', sheets.map(s => `${s.name}(${s.rowCount}rows)`).join(', '));

                if (sheets.length === 0) {
                    showToast(t('statsPage.uploadNoData', '데이터가 없습니다.'), 'error');
                    return;
                }

                setSheetInfo(sheets);

                // If only 1 sheet, auto-select it
                if (sheets.length === 1) {
                    const sh = workbook.Sheets[sheets[0].name];
                    const jd = XLSX.utils.sheet_to_json(sh, { header: 1, defval: '' });
                    let hIdx = 0;
                    for (let i = 0; i < Math.min(jd.length, 5); i++) {
                        if (jd[i].filter(c => c !== '').length >= 2) { hIdx = i; break; }
                    }
                    const hdrs = jd[hIdx].map(h => String(h).trim());
                    const dRows = jd.slice(hIdx + 1).filter(r => r.some(c => c !== ''));
                    setParsedHeaders(hdrs);
                    setParsedRows(dRows);
                    // Auto-detect data type
                    const detectedType = detectDataType(hdrs);
                    setUploadDataType(detectedType);
                    setUploadStep('mapping');
                    if (detectedType === 'expense') {
                        setColumnMapping(autoMapExpenseColumnsUpload(hdrs));
                    } else {
                        autoMapColumns(hdrs);
                    }
                } else {
                    // Multiple sheets → show sheet picker
                    setUploadStep('sheet_select');
                }
            } catch (err) {
                console.error('[Upload] Parse error:', err);
                showToast(t('statsPage.uploadParseError', '파일 파싱 에러: ') + err.message, 'error');
            }
        };
        reader.onerror = () => {
            console.error('[Upload] FileReader error:', reader.error);
            showToast(t('statsPage.uploadReadError', '파일 읽기에 실패했습니다.'), 'error');
        };
        reader.readAsArrayBuffer(file);
    }, [showToast, t]);

    // ── Load data from a specific sheet ──
    const loadSheetData = useCallback((workbook, sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        let headerIdx = 0;
        for (let i = 0; i < Math.min(jsonData.length, 5); i++) {
            const row = jsonData[i];
            const nonEmpty = row.filter(c => c !== '').length;
            if (nonEmpty >= 2) { headerIdx = i; break; }
        }
        const headers = jsonData[headerIdx].map(h => String(h).trim());
        const dataRows = jsonData.slice(headerIdx + 1).filter(row => row.some(c => c !== ''));
        return { headers, dataRows };
    }, []);

    // ── Select a single sheet or merge all sheets ──
    const selectSheet = useCallback((mode) => {
        const workbook = workbookRef.current;
        if (!workbook) return;

        if (mode === 'all') {
            // Merge all sheets: use headers from first sheet, append rows from others
            let mergedHeaders = null;
            let mergedRows = [];
            sheetInfo.forEach(si => {
                const { headers, dataRows } = loadSheetData(workbook, si.name);
                if (!mergedHeaders) {
                    mergedHeaders = headers;
                    mergedRows = [...dataRows];
                } else {
                    // Map columns from this sheet to the merged headers
                    const colMap = headers.map(h => mergedHeaders.indexOf(h));
                    const hasNewCols = headers.some(h => !mergedHeaders.includes(h));

                    if (hasNewCols) {
                        // Add new columns to merged headers
                        headers.forEach(h => {
                            if (!mergedHeaders.includes(h)) mergedHeaders.push(h);
                        });
                    }

                    // Re-map after adding new columns
                    const finalMap = headers.map(h => mergedHeaders.indexOf(h));
                    dataRows.forEach(row => {
                        const mapped = new Array(mergedHeaders.length).fill('');
                        row.forEach((val, idx) => {
                            if (finalMap[idx] >= 0) mapped[finalMap[idx]] = val;
                        });
                        mergedRows.push(mapped);
                    });
                }
            });

            if (mergedHeaders && mergedRows.length > 0) {
                console.log('[Upload] Merged all sheets:', mergedHeaders.length, 'columns,', mergedRows.length, 'rows');
                setParsedHeaders(mergedHeaders);
                setParsedRows(mergedRows);
                // Auto-detect data type and apply correct mapping
                const detectedType = detectDataType(mergedHeaders);
                setUploadDataType(detectedType);
                setUploadStep('mapping');
                if (detectedType === 'expense') {
                    setColumnMapping(autoMapExpenseColumnsUpload(mergedHeaders));
                } else {
                    autoMapColumns(mergedHeaders);
                }
            } else {
                showToast(t('statsPage.uploadNoData', '데이터가 없습니다.'), 'error');
            }
        } else {
            // Single sheet selection
            const { headers, dataRows } = loadSheetData(workbook, mode);
            if (dataRows.length === 0) {
                showToast(t('statsPage.uploadNoData', '데이터가 없습니다.'), 'error');
                return;
            }
            console.log('[Upload] Selected sheet:', mode, headers.length, 'columns,', dataRows.length, 'rows');
            setParsedHeaders(headers);
            setParsedRows(dataRows);
            // Auto-detect data type
            const detectedType = detectDataType(headers);
            setUploadDataType(detectedType);
            setUploadStep('mapping');
            if (detectedType === 'expense') {
                setColumnMapping(autoMapExpenseColumnsUpload(headers));
            } else {
                autoMapColumns(headers);
            }
        }
    }, [sheetInfo, loadSheetData, showToast, t]);

    const autoMapColumns = async (headers) => {
        try {
            const fd = new FormData();
            fd.append('action', 'auto_map');
            fd.append('headers', JSON.stringify(headers));
            fd.append('template', selectedTemplate || '');
            const res = await fetch(`${API_BASE}/seller_upload.php`, {
                method: 'POST',
                credentials: 'include',
                body: fd,
            });
            const data = await res.json();
            if (data.success && data.mapping) {
                setColumnMapping(data.mapping);
            }
        } catch { /* manual mapping fallback */ }
    };

    // ── Upload: Build mapped rows & import ──
    const handleImport = async () => {
        // ═══ EXPENSE import path ═══
        if (uploadDataType === 'expense') {
            const mappedFields = Object.values(columnMapping);
            if (!mappedFields.includes('expense_date')) {
                showToast(t('statsPage.uploadNeedDate', '날짜 컬럼을 매핑해주세요.'), 'error');
                return;
            }
            if (!mappedFields.includes('amount')) {
                showToast(t('statsPage.expNeedAmount', '금액 컬럼을 매핑해주세요.'), 'error');
                return;
            }

            // Build expense rows
            const rows = parsedRows.map(row => {
                const mapped = {};
                Object.entries(columnMapping).forEach(([colIdx, field]) => {
                    if (field) {
                        let val = row[parseInt(colIdx)];
                        if (val instanceof Date) val = val.toISOString().slice(0, 10);
                        mapped[field] = val ?? '';
                    }
                });
                return mapped;
            }).filter(r => r.expense_date);

            if (rows.length === 0) {
                showToast(t('statsPage.uploadNoValid', '유효한 데이터가 없습니다.'), 'error');
                return;
            }

            setImporting(true);
            setUploadStep('importing');

            let inserted = 0, skipped = 0, errors = [];
            for (let i = 0; i < rows.length; i++) {
                const r = rows[i];
                try {
                    // Parse date
                    let dateStr = String(r.expense_date).trim();
                    if (typeof r.expense_date === 'number') {
                        const d = new Date((r.expense_date - 25569) * 86400 * 1000);
                        dateStr = d.toISOString().slice(0, 10);
                    } else {
                        const d = new Date(dateStr.replace(/\//g, '-'));
                        if (!isNaN(d.getTime())) dateStr = d.toISOString().slice(0, 10);
                    }
                    const amount = parseInt(String(r.amount || '0').replace(/[^0-9-]/g, '')) || 0;
                    if (amount <= 0) { skipped++; continue; }

                    // Auto-classify category from expense_class, expense_item, or category text
                    let category = 'other';
                    const classifyText = (val) => {
                        if (!val) return 'other';
                        const vl = String(val).toLowerCase().trim();
                        // Exact match on EXPENSE_CATEGORIES key or label
                        const exactCat = EXPENSE_CATEGORIES.find(c => c.key === vl || getExpenseCatLabel(c.key).toLowerCase() === vl);
                        if (exactCat) return exactCat.key;
                        // Keyword-based match
                        for (const [catKey, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
                            if (keywords.some(kw => vl.includes(kw.toLowerCase()))) return catKey;
                        }
                        return 'other';
                    };
                    // Try category field first, then expense_class, then expense_item
                    if (r.category) category = classifyText(r.category);
                    if (category === 'other' && r.expense_class) category = classifyText(r.expense_class);
                    if (category === 'other' && r.expense_item) category = classifyText(r.expense_item);

                    // Auto-classify payment method
                    let payment = 'other';
                    if (r.payment_method) {
                        const pv = String(r.payment_method).toLowerCase().trim();
                        if (/현금|cash/i.test(pv)) payment = 'cash';
                        else if (/카드|card|신용|체크/i.test(pv)) payment = 'card';
                        else if (/이체|transfer|송금|계좌|banking/i.test(pv)) payment = 'transfer';
                    }
                    const memo = r.memo || '';

                    await handleSaveExpense({
                        id: 0,
                        expense_date: dateStr,
                        amount,
                        category,
                        payment_method: payment,
                        memo,
                    }, true);
                    inserted++;
                } catch (err) {
                    errors.push({ row: i + 1, error: err.message || 'Unknown error' });
                }
            }

            setImportResult({ inserted, skipped, total: rows.length, errors });
            setUploadStep('done');
            setImporting(false);
            fetchExpenses();
            return;
        }

        // ═══ SALES import path (original) ═══
        // Validate: at least date and revenue mapped
        const mappedFields = Object.values(columnMapping);
        if (!mappedFields.includes('record_date')) {
            showToast(t('statsPage.uploadNeedDate', '날짜 컬럼을 매핑해주세요.'), 'error');
            return;
        }
        if (!mappedFields.includes('monthly_revenue')) {
            showToast(t('statsPage.uploadNeedRevenue', '매출액 컬럼을 매핑해주세요.'), 'error');
            return;
        }
        // Build rows
        const rows = parsedRows.map(row => {
            const mapped = {};
            Object.entries(columnMapping).forEach(([colIdx, field]) => {
                if (field) {
                    let val = row[parseInt(colIdx)];
                    if (val instanceof Date) val = val.toISOString().slice(0, 10);
                    mapped[field] = val ?? '';
                }
            });
            return mapped;
        }).filter(r => r.record_date);

        if (rows.length === 0) {
            showToast(t('statsPage.uploadNoValid', '유효한 데이터가 없습니다.'), 'error');
            return;
        }

        setImporting(true);
        setUploadStep('importing');

        // ── FormData + File upload 방식 (WAF 호환) ──
        const CHUNK_SIZE = 500;
        let totalInserted = 0;
        let totalSkipped = 0;
        let allErrors = [];
        let lastBatchId = null;

        try {
            const totalChunks = Math.ceil(rows.length / CHUNK_SIZE);
            for (let i = 0; i < totalChunks; i++) {
                const chunk = rows.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

                // JSON 데이터를 Blob 파일로 변환하여 FormData에 첨부
                const jsonPayload = JSON.stringify({
                    rows: chunk,
                    currency: uploadCurrency,
                    record_type: uploadRecordType,
                    sales_channel: uploadChannel,
                    country_code: selectedCountry,
                    duplicate_mode: uploadDuplicateMode,
                });
                const blob = new Blob([jsonPayload], { type: 'application/json' });
                const fd = new FormData();
                fd.append('action', 'import');
                fd.append('data_file', blob, 'import_data.json');

                // 최대 2회 시도
                let res = null;
                let retryCount = 0;
                while (retryCount < 2) {
                    try {
                        res = await fetch(`${API_BASE}/seller_upload.php`, {
                            method: 'POST',
                            credentials: 'include',
                            body: fd,
                        });
                        break;
                    } catch (fetchErr) {
                        retryCount++;
                        if (retryCount >= 2) throw fetchErr;
                        await new Promise(r => setTimeout(r, 1000));
                    }
                }

                // HTTP 상태 코드 확인
                if (!res.ok) {
                    const errMsg = res.status === 404
                        ? t('statsPage.uploadApiNotFound', '서버 API 파일을 찾을 수 없습니다. (404)')
                        : res.status === 403
                            ? t('statsPage.uploadAuthError', '로그인이 필요합니다.')
                            : t('statsPage.uploadServerError', `서버 오류: HTTP ${res.status}`);
                    console.error('[Import] HTTP Error:', res.status, res.url);
                    showToast(errMsg, 'error');
                    setUploadStep('mapping');
                    setImporting(false);
                    return;
                }

                let data;
                try {
                    data = await res.json();
                } catch (jsonErr) {
                    console.error('[Import] JSON parse error:', jsonErr);
                    showToast(t('statsPage.uploadJsonError', '서버 응답을 처리할 수 없습니다.'), 'error');
                    setUploadStep('mapping');
                    setImporting(false);
                    return;
                }

                if (data.success) {
                    totalInserted += (data.inserted || 0);
                    totalSkipped += (data.skipped || 0);
                    if (data.errors) allErrors = allErrors.concat(data.errors);
                    if (data.batch_id) lastBatchId = data.batch_id;
                } else {
                    showToast(data.message || t('statsPage.uploadFailed', '임포트 실패'), 'error');
                    setUploadStep('mapping');
                    setImporting(false);
                    return;
                }
            }

            setImportResult({
                success: true,
                inserted: totalInserted,
                skipped: totalSkipped,
                total: rows.length,
                batch_id: lastBatchId,
                errors: allErrors.slice(0, 10),
            });
            setUploadStep('done');
            fetchStats();
            showToast(t('statsPage.uploadSuccess', `${totalInserted}건 임포트 완료!`), 'success');
        } catch (err) {
            console.error('[Import] Network/fetch error:', err);
            showToast(t('statsPage.serverError', '서버 연결에 실패했습니다.'), 'error');
            setUploadStep('mapping');
        } finally { setImporting(false); }
    };

    // ── Upload: Fetch import history (GET → seller_upload.php) ──
    const fetchImportHistory = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/seller_upload.php?action=history`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setImportHistory(data.batches || []);
        } catch { /* ignore */ }
    }, []);

    // ── Upload: Undo batch (FormData → seller_upload.php) ──
    const undoBatch = (batchId) => {
        setConfirmModal({
            title: t('statsPage.uploadUndoTitle', '임포트 취소'),
            message: t('statsPage.uploadUndoMsg', '이 임포트의 모든 데이터를 삭제하시겠습니까?'),
            type: 'danger',
            confirmLabel: t('statsPage.uploadUndoBtn', '삭제'),
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const fd = new FormData();
                    fd.append('action', 'undo_batch');
                    fd.append('batch_id', batchId);
                    const res = await fetch(`${API_BASE}/seller_upload.php`, {
                        method: 'POST',
                        credentials: 'include',
                        body: fd,
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast(t('statsPage.uploadUndoDone', `${data.deleted}건 삭제 완료`), 'success');
                        fetchImportHistory();
                        fetchStats();
                    } else showToast(data.message, 'error');
                } catch { showToast(t('statsPage.serverError'), 'error'); }
            }
        });
    };

    const handleBulkUndoBatches = () => {
        if (selectedBatchIds.size === 0) return;
        const totalRecords = importHistory.filter(b => selectedBatchIds.has(b.import_batch_id)).reduce((s, b) => s + parseInt(b.record_count || 0), 0);
        setConfirmModal({
            title: t('statsPage.bulkUndoTitle', `${selectedBatchIds.size}개 임포트 이력 삭제`),
            message: t('statsPage.bulkUndoMsg', `선택한 ${selectedBatchIds.size}개 임포트의 모든 데이터(${totalRecords}건)를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`),
            type: 'danger',
            confirmLabel: t('statsPage.deleteCount', `${totalRecords}건 삭제`),
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const fd = new FormData();
                    fd.append('action', 'bulk_undo_batches');
                    fd.append('batch_ids', [...selectedBatchIds].join(','));
                    const res = await fetch(`${API_BASE}/seller_upload.php`, {
                        method: 'POST',
                        credentials: 'include',
                        body: fd,
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast(data.message || t('statsPage.deleteSuccess', `${data.deleted}건 삭제 완료`), 'success');
                        setSelectedBatchIds(new Set());
                        fetchImportHistory();
                        fetchStats();
                    } else showToast(data.message, 'error');
                } catch { showToast(t('statsPage.serverError'), 'error'); }
            }
        });
    };

    // Reset upload state
    const resetUpload = () => {
        setUploadStep('select');
        setUploadFile(null);
        setParsedHeaders([]);
        setParsedRows([]);
        setColumnMapping({});
        setImportResult(null);
        setUploadDataType('sales');
        workbookRef.current = null;
        setSheetInfo([]);
    };

    // Auto-fetch templates and history when upload tab is active
    // + 이전 실패 상태('preview' 등) 초기화
    useEffect(() => {
        if (activeTab === 'upload') {
            if (uploadStep !== 'select' && uploadStep !== 'sheet_select' && uploadStep !== 'mapping' && uploadStep !== 'importing') {
                setUploadStep('select');
            }
            fetchTemplates();
            fetchImportHistory();
        }
    }, [activeTab, fetchTemplates, fetchImportHistory]);

    // ── Tax: Calculate taxes ──
    const calculateTax = useCallback(async () => {
        setTaxLoading(true);
        try {
            // First get annual totals from summary
            const countryParam = `&country_code=${selectedCountry}`;
            const sumRes = await fetch(`${API_BASE}/${TAX_API}?action=summary&year=${new Date().getFullYear()}${countryParam}`, { credentials: 'include' });
            const sumData = await sumRes.json();
            if (sumData.success) setTaxSummary(sumData);

            const annualRevenue = sumData.success ? sumData.totals.revenue : 0;
            const annualCost = sumData.success ? sumData.totals.cost : 0;

            const res = await fetch(`${API_BASE}/${TAX_API}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'calculate',
                    country: taxCountry,
                    annual_revenue: annualRevenue,
                    annual_cost: annualCost,
                }),
            });
            const data = await res.json();
            if (data.success) setTaxResult(data);
        } catch { /* ignore */ } finally { setTaxLoading(false); }
    }, [taxCountry]);

    // ── Tax: Load custom settings for editing ──
    const loadTaxSettings = useCallback(async () => {
        setTaxSettingsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/${TAX_API}?action=load_settings&country=${taxCountry}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setHasCustomSettings(data.has_custom);
                const defaults = data.defaults || {};
                const settings = data.settings || {};
                setEditVatRate(settings.vat_rate ?? defaults.vat_rate ?? '');
                setEditSimplifiedRate(settings.simplified_rate ?? defaults.simplified_rate ?? '');
                setEditSimplifiedThreshold(settings.simplified_threshold ?? defaults.simplified_threshold ?? '');
                setEditDeduction(settings.extra_deduction || '');
                const brackets = settings.custom_brackets || defaults.brackets || [];
                setEditBrackets(brackets.map(b => ({ min: b.min, max: b.max, rate: b.rate })));
            }
        } catch { /* ignore */ } finally { setTaxSettingsLoading(false); }
    }, [taxCountry]);

    // ── Tax: Save custom settings ──
    const saveTaxSettings = useCallback(async () => {
        try {
            const brackets = editBrackets.map(b => ({
                min: parseInt(b.min) || 0,
                max: b.max === null || b.max === '' ? null : parseInt(b.max) || 0,
                rate: parseFloat(b.rate) || 0,
            }));
            const res = await fetch(`${API_BASE}/${TAX_API}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'save_settings',
                    country: taxCountry,
                    vat_rate: parseFloat(editVatRate) || null,
                    simplified_rate: parseFloat(editSimplifiedRate) || null,
                    simplified_threshold: parseInt(editSimplifiedThreshold) || null,
                    brackets,
                    extra_deduction: parseInt(editDeduction) || 0,
                }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(t('statsPage.taxSettingsSaved', '세율 설정이 저장되었습니다.'), 'success');
                setTaxEditMode(false);
                setHasCustomSettings(true);
                calculateTax();
            }
        } catch { showToast('Error saving', 'error'); }
    }, [taxCountry, editVatRate, editSimplifiedRate, editSimplifiedThreshold, editBrackets, editDeduction, calculateTax, showToast, t]);

    // ── Tax: Reset to defaults ──
    const resetTaxSettings = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/${TAX_API}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action: 'reset_settings', country: taxCountry }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(t('statsPage.taxSettingsReset', '기본 세율로 초기화되었습니다.'), 'success');
                setTaxEditMode(false);
                setHasCustomSettings(false);
                calculateTax();
            }
        } catch { /* ignore */ }
    }, [taxCountry, calculateTax, showToast, t]);

    // ── Analytics: Build analytics from existing stats ──
    const buildAnalytics = useCallback(() => {
        if (!allStats || allStats.length === 0) {
            setAnalyticsData(null);
            return;
        }
        // ── Filter by dashboardYear for KPI cards (except monthlyTrend which stays as last 12) ──
        const yearStr = String(dashboardYear);
        const prevYearStr = String(dashboardYear - 1);
        const yearStats = dashboardYear ? allStats.filter(s => (s.record_date || '').startsWith(yearStr)) : allStats;
        const prevYearStats = dashboardYear ? allStats.filter(s => (s.record_date || '').startsWith(prevYearStr)) : [];

        // Use yearStats for KPI calculations
        let totalRevenue = 0, totalCost = 0, totalTx = 0, totalQty = 0;
        let totalCustomers = 0;
        yearStats.forEach(s => {
            const rev = parseInt(s.monthly_revenue || 0);
            totalRevenue += rev;
            totalCost += parseInt(s.cost_price || 0);
            totalTx += parseInt(s.transaction_count || 0);
            totalQty += parseInt(s.quantity_sold || 0);
            totalCustomers += parseInt(s.customer_count || 0);
        });

        // Previous year totals for YoY growth
        let prevYearRevenue = 0;
        prevYearStats.forEach(s => {
            prevYearRevenue += parseInt(s.monthly_revenue || 0);
        });

        // Monthly maps (full data for trend/chart)
        const monthlyMap = {};
        const channelMap = {};
        const categoryMap = {};
        const regionMap = {};
        const productMap = {};
        const dayOfWeekMap = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        const dayOfWeekCount = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

        allStats.forEach(s => {
            const month = (s.record_date || '').substring(0, 7);
            const rev = parseInt(s.monthly_revenue || 0);
            if (month) {
                monthlyMap[month] = (monthlyMap[month] || 0) + rev;
            }
        });

        // Channel/category/region/product/dayOfWeek — from yearStats only
        yearStats.forEach(s => {
            const rev = parseInt(s.monthly_revenue || 0);
            const ch = s.sales_channel || s.source || 'manual';
            channelMap[ch] = (channelMap[ch] || 0) + rev;
            const cat = s.best_selling_item || 'N/A';
            categoryMap[cat] = (categoryMap[cat] || 0) + rev;

            const rg = s.region || 'N/A';
            if (!regionMap[rg]) regionMap[rg] = { revenue: 0, count: 0 };
            regionMap[rg].revenue += rev;
            regionMap[rg].count += 1;

            const pn = s.product_name || '';
            if (pn) {
                if (!productMap[pn]) productMap[pn] = { revenue: 0, qty: 0, count: 0 };
                productMap[pn].revenue += rev;
                productMap[pn].qty += parseInt(s.quantity_sold || 0);
                productMap[pn].count += 1;
            }

            if (s.record_date) {
                const d = new Date(s.record_date);
                if (!isNaN(d.getTime())) {
                    const dow = d.getDay();
                    dayOfWeekMap[dow] += rev;
                    dayOfWeekCount[dow] += 1;
                }
            }
        });

        // Sort months
        const sortedMonths = Object.keys(monthlyMap).sort();
        const last12 = sortedMonths.slice(-12);
        const last6 = sortedMonths.slice(-6);
        const maxMonthly = Math.max(...last6.map(m => monthlyMap[m]), 1);

        // Build continuous 12-month range ending at latest data month (fill gaps with 0)
        const last12Filled = [];
        if (sortedMonths.length > 0) {
            const endMonth = sortedMonths[sortedMonths.length - 1];
            const endDate = new Date(endMonth + '-01');
            for (let i = 11; i >= 0; i--) {
                const d = new Date(endDate);
                d.setMonth(d.getMonth() - i);
                const mKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
                last12Filled.push({ month: mKey, revenue: monthlyMap[mKey] || 0 });
            }
        }
        const maxMonthly12 = Math.max(...last12Filled.map(m => m.revenue), 1);

        // Growth: Year-over-Year (selected year vs previous year)
        let growth = null;
        if (prevYearRevenue > 0) {
            growth = ((totalRevenue - prevYearRevenue) / prevYearRevenue * 100).toFixed(1);
        } else if (totalRevenue > 0) {
            growth = '100.0'; // New year with data but no previous year
        }

        // Forecast: project annual revenue from YTD data
        let forecast = null;
        const yearMonths = dashboardYear ? sortedMonths.filter(m => m.startsWith(yearStr)) : sortedMonths;
        if (yearMonths.length >= 1) {
            const ytdRev = yearMonths.reduce((s, m) => s + (monthlyMap[m] || 0), 0);
            forecast = Math.round(ytdRev / yearMonths.length * 12);
        }

        // Year-over-year comparison
        const yearOverYear = [];
        const thisYear = new Date().getFullYear();
        for (let m = 1; m <= 12; m++) {
            const mStr = m.toString().padStart(2, '0');
            const thisYearKey = `${thisYear}-${mStr}`;
            const lastYearKey = `${thisYear - 1}-${mStr}`;
            yearOverYear.push({
                month: m,
                thisYear: monthlyMap[thisYearKey] || 0,
                lastYear: monthlyMap[lastYearKey] || 0,
            });
        }

        // Monthly growth rates
        const monthlyGrowthRates = [];
        for (let i = 1; i < last12.length; i++) {
            const prev = monthlyMap[last12[i - 1]] || 0;
            const cur = monthlyMap[last12[i]] || 0;
            const rate = prev > 0 ? ((cur - prev) / prev * 100).toFixed(1) : null;
            monthlyGrowthRates.push({ month: last12[i], rate: rate !== null ? parseFloat(rate) : null });
        }

        // Top channels and categories
        const topChannels = Object.entries(channelMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

        // Top regions
        const topRegions = Object.entries(regionMap)
            .map(([name, d]) => ({ name, revenue: d.revenue, count: d.count }))
            .sort((a, b) => b.revenue - a.revenue).slice(0, 8);

        // Top products
        const topProducts = Object.entries(productMap)
            .map(([name, d]) => ({ name, revenue: d.revenue, qty: d.qty, count: d.count }))
            .sort((a, b) => b.revenue - a.revenue).slice(0, 5);

        // Day of week analysis
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeekAnalysis = dayNames.map((name, i) => ({
            name,
            total: dayOfWeekMap[i],
            avg: dayOfWeekCount[i] > 0 ? Math.round(dayOfWeekMap[i] / dayOfWeekCount[i]) : 0,
            count: dayOfWeekCount[i],
        }));
        const maxDayAvg = Math.max(...dayOfWeekAnalysis.map(d => d.avg), 1);

        // Avg unit price
        const avgOrderValue = totalTx > 0 ? Math.round(totalRevenue / totalTx) : 0;

        // ── Advanced Forecast ──
        // 3-month forecast (next 3 months)
        const forecastMonths = [];
        if (sortedMonths.length >= 3) {
            const lastN = sortedMonths.slice(-6);
            const avgLast = lastN.reduce((s, m) => s + monthlyMap[m], 0) / lastN.length;

            for (let i = 1; i <= 3; i++) {
                const lastDate = new Date(sortedMonths[sortedMonths.length - 1] + '-01');
                lastDate.setMonth(lastDate.getMonth() + i);
                const fMonth = `${lastDate.getFullYear()}-${(lastDate.getMonth() + 1).toString().padStart(2, '0')}`;

                // Seasonality: check same month last year
                const sameMonthLastYear = monthlyMap[`${lastDate.getFullYear() - 1}-${(lastDate.getMonth() + 1).toString().padStart(2, '0')}`];
                let fValue = Math.round(avgLast);

                if (sameMonthLastYear && sameMonthLastYear > 0) {
                    // Weighted: 60% moving avg + 40% seasonal
                    const yearAvgLastYear = Object.values(monthlyMap).reduce((s, v) => s + v, 0) / Object.keys(monthlyMap).length;
                    const seasonFactor = yearAvgLastYear > 0 ? sameMonthLastYear / yearAvgLastYear : 1;
                    fValue = Math.round(avgLast * 0.6 + avgLast * seasonFactor * 0.4);
                }

                // Apply recent trend
                if (growth !== null) {
                    const trendFactor = 1 + (parseFloat(growth) / 100) * 0.3; // dampen trend
                    fValue = Math.round(fValue * Math.pow(trendFactor, i * 0.5));
                }

                forecastMonths.push({ month: fMonth, value: Math.max(0, fValue) });
            }
        }

        // Goal probability
        let goalProbability = null;
        try {
            const goalData = JSON.parse(localStorage.getItem('seller_sales_goal') || 'null');
            if (goalData && goalData.monthly) {
                const lastMonthRev = sortedMonths.length > 0 ? monthlyMap[sortedMonths[sortedMonths.length - 1]] || 0 : 0;
                const achieveRatio = goalData.monthly > 0 ? (lastMonthRev / goalData.monthly) : 0;
                // Simple probability based on historical achievement and trend
                const trendBonus = growth ? Math.min(20, Math.max(-20, parseFloat(growth) * 0.5)) : 0;
                goalProbability = Math.min(99, Math.max(5, Math.round(achieveRatio * 80 + trendBonus)));
            }
        } catch { /* ignore */ }

        // Quarter forecast
        const quarterForecast = forecastMonths.length > 0
            ? forecastMonths.reduce((s, f) => s + f.value, 0)
            : null;

        // Annual run rate
        const monthsWithData = dashboardYear ? sortedMonths.filter(m => m.startsWith(yearStr)).length : sortedMonths.length;
        const ytdRevenue = dashboardYear ? sortedMonths.filter(m => m.startsWith(yearStr)).reduce((s, m) => s + monthlyMap[m], 0) : sortedMonths.reduce((s, m) => s + monthlyMap[m], 0);
        const annualRunRate = monthsWithData > 0 ? Math.round(ytdRevenue / monthsWithData * 12) : null;

        setAnalyticsData({
            monthlyTrend: last12Filled,
            maxMonthly: maxMonthly12,
            totalRevenue, totalCost, totalTx, totalQty, totalCustomers, avgOrderValue,
            profitMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue * 100).toFixed(1) : 0,
            growth,
            forecast,
            topChannels,
            topCategories,
            topRegions,
            topProducts,
            yearOverYear,
            monthlyGrowthRates,
            dayOfWeekAnalysis,
            maxDayAvg,
            forecastMonths,
            goalProbability,
            quarterForecast,
            annualRunRate,
            ytdRevenue,
            recordCount: allStats.length,
        });
    }, [allStats, dashboardYear]);

    // ── RFM: Fetch RFM analysis from backend ──
    const fetchRfm = useCallback(async () => {
        setRfmLoading(true);
        try {
            const res = await fetch(`${API_BASE}/seller_customers.php?action=rfm_analysis&country_code=${selectedCountry}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setRfmData(data);
            else setRfmData(null);
        } catch { setRfmData(null); }
        setRfmLoading(false);
    }, [selectedCountry]);

    // ── CRM Alerts: Fetch alerts from backend ──
    const fetchAlerts = useCallback(async () => {
        setAlertsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/seller_customers.php?action=crm_alerts&country_code=${selectedCountry}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setCrmAlerts(data);
            else setCrmAlerts(null);
        } catch { setCrmAlerts(null); }
        setAlertsLoading(false);
    }, [selectedCountry]);

    const dismissAlert = useCallback((alertKey) => {
        const updated = [...dismissedAlerts, alertKey];
        setDismissedAlerts(updated);
        localStorage.setItem('crm_dismissed_alerts', JSON.stringify(updated));
    }, [dismissedAlerts]);

    // ── Workflow Automation: Rule management ──
    const workflowPresets = useMemo(() => [
        { id: 'churn_followup', name: t('statsPage.wfChurnFollowup', '이탈 위험 팔로업'), trigger: 'churn_risk', action: 'send_reminder', icon: '🚨', desc: t('statsPage.wfChurnDesc', '90일 이상 미구매 고객 자동 알림') },
        { id: 'vip_promo', name: t('statsPage.wfVipPromo', 'VIP 프로모션'), trigger: 'vip_inactive', action: 'send_promo', icon: '👑', desc: t('statsPage.wfVipDesc', 'VIP 고객 30일 미방문 시 프로모션 제안') },
        { id: 'lead_welcome', name: t('statsPage.wfLeadWelcome', '신규 리드 환영'), trigger: 'new_lead', action: 'welcome_message', icon: '🎉', desc: t('statsPage.wfLeadDesc', '신규 리드 등록 7일 후 첫 구매 유도') },
        { id: 'monthly_report', name: t('statsPage.wfMonthlyReport', '월간 보고서 리마인더'), trigger: 'month_end', action: 'generate_report', icon: '📊', desc: t('statsPage.wfMonthlyDesc', '매월 말 자동 보고서 생성 알림') },
        { id: 'quarterly_tax', name: t('statsPage.wfQuarterlyTax', '분기 세금 리마인더'), trigger: 'quarter_end', action: 'tax_reminder', icon: '🧾', desc: t('statsPage.wfQuarterlyDesc', '분기 말 세금 신고 리마인더') },
    ], []);

    const addWorkflowRule = useCallback((preset) => {
        if (workflowRules.find(r => r.id === preset.id)) {
            showToast(t('statsPage.workflowExists', '이미 활성화된 규칙입니다'), 'warning');
            return;
        }
        const rule = { ...preset, enabled: true, createdAt: new Date().toISOString() };
        const updated = [...workflowRules, rule];
        setWorkflowRules(updated);
        localStorage.setItem('crm_workflow_rules', JSON.stringify(updated));
        // Add log entry
        const log = { ruleId: preset.id, ruleName: preset.name, action: t('statsPage.ruleActivated', '규칙 활성화'), timestamp: new Date().toISOString() };
        const updatedLog = [log, ...workflowLog].slice(0, 50);
        setWorkflowLog(updatedLog);
        localStorage.setItem('crm_workflow_log', JSON.stringify(updatedLog));
        showToast(t('statsPage.workflowAdded', `"${preset.name}" 규칙이 활성화되었습니다`), 'success');
    }, [workflowRules, workflowLog, showToast, t]);

    const removeWorkflowRule = useCallback((ruleId) => {
        const updated = workflowRules.filter(r => r.id !== ruleId);
        setWorkflowRules(updated);
        localStorage.setItem('crm_workflow_rules', JSON.stringify(updated));
        showToast(t('statsPage.workflowRemoved', '규칙이 제거되었습니다'), 'success');
    }, [workflowRules, showToast, t]);

    const toggleWorkflowRule = useCallback((ruleId) => {
        const updated = workflowRules.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r);
        setWorkflowRules(updated);
        localStorage.setItem('crm_workflow_rules', JSON.stringify(updated));
    }, [workflowRules]);

    // ── External Integration: Toggle connection ──
    const toggleIntegration = useCallback((key, name) => {
        const updated = { ...integrations, [key]: !integrations[key] };
        setIntegrations(updated);
        localStorage.setItem('crm_integrations', JSON.stringify(updated));
        showToast(updated[key] ? t('statsPage.integrationEnabled', `${name} 연동이 활성화되었습니다`) : t('statsPage.integrationDisabled', `${name} 연동이 해제되었습니다`), updated[key] ? 'success' : 'info');
    }, [integrations, showToast]);

    // ── Format helpers ── (moved before useCallbacks that depend on it)
    const formatRevenue = (val) => {
        const n = parseInt(val) || 0;
        const converted = currency === 'KRW' ? n : convert(n);
        const config = currencies[currency] || { locale: 'ko-KR', code: 'KRW', decimals: 0 };
        try {
            // Use compact notation for large numbers, standard for small
            if (converted >= 10000 || converted <= -10000) {
                return new Intl.NumberFormat(config.locale, {
                    style: 'currency', currency: config.code,
                    notation: 'compact', maximumFractionDigits: 1,
                }).format(converted);
            }
            return new Intl.NumberFormat(config.locale, {
                style: 'currency', currency: config.code,
                minimumFractionDigits: 0, maximumFractionDigits: config.decimals,
            }).format(converted);
        } catch { return `${currencySymbol}${converted.toLocaleString()}`; }
    };

    // ── Integration Action: Copy for Google Sheets ──
    const copyForGoogleSheets = useCallback(() => {
        if (!allStats || allStats.length === 0) return showToast('복사할 데이터가 없습니다', 'error');
        // Filter by activeTab inside the function to avoid TDZ with filteredStats
        const data = activeTab && activeTab !== 'dashboard'
            ? allStats.filter(s => s.record_type === activeTab)
            : allStats;
        if (data.length === 0) return showToast('현재 탭에 복사할 데이터가 없습니다', 'error');
        const headers = [t('statsPage.dateLabel', '날짜'), t('statsPage.typeLabel', '유형'), t('statsPage.countryLabel', '국가'), t('statsPage.salesLabel', '매출'), t('statsPage.customersLabel', '고객수'), t('statsPage.transactionsLabel', '거래수'), t('statsPage.avgPriceLabel', '평균단가'), t('statsPage.salesChannelLabel', '판매채널'), t('statsPage.productNameLabel', '상품명'), t('statsPage.quantityLabel', '수량'), t('statsPage.bestItemLabel', '인기상품'), t('statsPage.memoLabel', '메모')];
        const rows = data.map(s => [
            s.record_date || '',
            s.record_type || '',
            s.country_code || 'KR',
            s.monthly_revenue || 0,
            s.customer_count || 0,
            s.transaction_count || 0,
            s.avg_unit_price || 0,
            s.sales_channel || '',
            s.product_name || '',
            s.quantity_sold || 0,
            s.best_selling_item || '',
            s.memo || ''
        ].join('\t'));
        const tsv = [headers.join('\t'), ...rows].join('\n');
        navigator.clipboard.writeText(tsv).then(() => {
            showToast(t('statsPage.dataCopied', `${data.length}건의 데이터가 복사됨`) + ' — Google Sheets에서 Ctrl+V로 붙여넣기', 'success');
        }).catch(() => showToast(t('statsPage.clipboardFail', '클립보드 복사 실패'), 'error'));
    }, [allStats, activeTab, showToast]);

    // ── Integration Action: Email Report ──
    const sendEmailReport = useCallback(() => {
        if (!allStats || allStats.length === 0) return showToast('보고서를 생성할 데이터가 없습니다', 'error');
        // Calculate totals from allStats (works from any tab)
        const totalRevenue = allStats.reduce((sum, s) => sum + (parseInt(s.monthly_revenue) || 0), 0);
        const totalTransactions = allStats.reduce((sum, s) => sum + (parseInt(s.transaction_count) || 0), 0);
        const totalCustomers = allStats.reduce((sum, s) => sum + (parseInt(s.customer_count) || 0), 0);
        const recordCount = allStats.length;
        const dateRange = allStats.length > 0
            ? `${allStats[allStats.length - 1]?.record_date || '?'} ~ ${allStats[0]?.record_date || '?'}`
            : '-';
        const subject = encodeURIComponent(`SpaceMatch ${t('statsPage.salesReport', '매출 보고서')} - ${new Date().toLocaleDateString()}`);
        const body = encodeURIComponent(
            `📊 SpaceMatch ${t('statsPage.salesReport', '매출 보고서')}\n` +
            `${t('statsPage.reportDate', '작성일')}: ${new Date().toLocaleDateString()}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `📅 ${t('statsPage.reportPeriod', '조회 기간')}: ${dateRange}\n` +
            `📋 ${t('statsPage.totalRecords', '총 기록 수')}: ${recordCount}${t('statsPage.countSuffix', '건')}\n` +
            `💰 ${t('statsPage.totalSales', '총 매출')}: ${formatRevenue(totalRevenue)}\n` +
            `👥 ${t('statsPage.totalCustomersLabel', '총 고객 수')}: ${totalCustomers.toLocaleString()}${t('statsPage.peopleSuffix', '명')}\n` +
            `🛒 ${t('statsPage.totalTxLabel', '총 거래 수')}: ${totalTransactions.toLocaleString()}${t('statsPage.countSuffix', '건')}\n` +
            `📈 ${t('statsPage.avgSales', '평균 매출')}: ${formatRevenue(Math.round(totalRevenue / Math.max(recordCount, 1)))}\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            t('statsPage.reportFooter', '본 보고서는 SpaceMatch CRM에서 자동 생성되었습니다.')
        );
        window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
        showToast(t('statsPage.emailOpened', '이메일 작성 창이 열렸습니다'), 'success');
    }, [allStats, showToast, formatRevenue]);

    // Auto-trigger tax/analytics when tabs become active
    useEffect(() => {
        if (activeTab === 'tax') calculateTax();
        if (activeTab === 'analytics') { buildAnalytics(); fetchRfm(); fetchAlerts(); }
    }, [activeTab, calculateTax, buildAnalytics, fetchRfm, fetchAlerts]);

    // ── Filtered stats by period (with aggregation) ──
    const filteredStats = useMemo(() => {
        if (activeTab === 'dashboard') return allStats;
        if (activeTab === 'sales') {
            if (salesView === 'daily') return allStats.filter(s => s.record_type === 'daily');
            // For monthly/annual: aggregate ALL records by period
            const groupKey = salesView === 'monthly'
                ? (date) => date?.slice(0, 7)    // YYYY-MM
                : (date) => date?.slice(0, 4);   // YYYY
            const groups = {};
            allStats.forEach(s => {
                const key = groupKey(s.record_date);
                if (!key) return;
                if (!groups[key]) {
                    groups[key] = {
                        record_date: salesView === 'monthly' ? `${key}-01` : `${key}-01-01`,
                        record_type: salesView,
                        country_code: s.country_code || 'KR',
                        monthly_revenue: 0, customer_count: 0, transaction_count: 0,
                        avg_unit_price: 0, best_selling_item: '', memo: '',
                        _sources: 0, _bestItems: {},
                    };
                }
                const g = groups[key];
                g.monthly_revenue += parseInt(s.monthly_revenue) || 0;
                g.customer_count += parseInt(s.customer_count) || 0;
                g.transaction_count += parseInt(s.transaction_count) || 0;
                g._sources += 1;
                if (s.best_selling_item) {
                    g._bestItems[s.best_selling_item] = (g._bestItems[s.best_selling_item] || 0) + 1;
                }
            });
            return Object.values(groups).map(g => {
                const bestItem = Object.entries(g._bestItems).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
                return { ...g, avg_unit_price: g.transaction_count > 0 ? Math.round(g.monthly_revenue / g.transaction_count) : 0, best_selling_item: bestItem, memo: t('statsPage.aggregatedMemo', `${g._sources}건의 데이터 집계`) };
            }).sort((a, b) => a.record_date.localeCompare(b.record_date));
        }
        return allStats;
    }, [allStats, activeTab, salesView]);

    const [showExtendedFields, setShowExtendedFields] = useState(false);
    const resetForm = () => { setForm(emptyForm); setEditingRecord(null); setShowExtendedFields(false); };

    const handleOpenForm = (record = null, periodOverride = null) => {
        const period = periodOverride || (activeTab !== 'dashboard' ? activeTab : 'monthly');
        if (record) {
            setEditingRecord(record);
            // Check if best_selling_item is a known category
            const isKnownCategory = PRODUCT_CATEGORIES.some(c => c.value === record.best_selling_item && c.value !== 'other');
            setForm({
                record_type: record.record_type || 'monthly',
                record_date: record.record_date || '',
                monthly_revenue: record.monthly_revenue || '',
                customer_count: record.customer_count || '',
                transaction_count: record.transaction_count || '',
                avg_unit_price: record.avg_unit_price || '',
                best_selling_item: isKnownCategory ? record.best_selling_item : (record.best_selling_item ? 'other' : ''),
                best_selling_other: isKnownCategory ? '' : (record.best_selling_item || ''),
                venue_type: record.venue_type || '',
                region: record.region || '',
                region_detail: record.region_detail || '',
                satisfaction: parseInt(record.satisfaction) || 0,
                memo: record.memo || '',
                product_name: record.product_name || '',
                sku: record.sku || '',
                brand: record.brand || '',
                option_info: record.option_info || '',
                quantity_sold: record.quantity_sold || '',
                cost_price: record.cost_price || '',
                discount_amount: record.discount_amount || '',
                tax_amount: record.tax_amount || '',
                shipping_cost: record.shipping_cost || '',
                refund_amount: record.refund_amount || '',
                commission_fee: record.commission_fee || '',
                net_revenue: record.net_revenue || '',
                profit_amount: record.profit_amount || '',
                payment_method: record.payment_method || '',
                order_number: record.order_number || '',
                sales_channel: record.sales_channel || '',
                platform: record.platform || '',
                store_name: record.store_name || '',
                staff_name: record.staff_name || '',
                customer_name: record.customer_name || '',
            });
            // Auto-expand extended fields if any are filled
            const hasExtended = record.product_name || record.sku || record.brand || record.cost_price || record.order_number || record.sales_channel || record.platform;
            if (hasExtended) setShowExtendedFields(true);
        } else {
            resetForm();
            const now = new Date();
            let defaultDate = '';
            if (period === 'daily') {
                defaultDate = now.toISOString().slice(0, 10);
            } else if (period === 'monthly') {
                defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            } else if (period === 'annual') {
                defaultDate = String(now.getFullYear());
            }
            setForm(prev => ({ ...prev, record_type: period, record_date: defaultDate }));
        }
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.record_date) { showToast(t('statsPage.selectDate'), 'error'); return; }

        // Resolve best_selling_item
        const bestItem = form.best_selling_item === 'other' ? form.best_selling_other : form.best_selling_item;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/${STATS_API}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'save',
                    ...form,
                    best_selling_item: bestItem,
                    country_code: selectedCountry,
                    currency: countryCurrency.code,
                }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message || t('statsPage.saved'), 'success');
                setShowForm(false);
                resetForm();
                fetchStats();
            } else {
                showToast(data.message || t('statsPage.saveFailed'), 'error');
            }
        } catch {
            showToast(t('statsPage.serverError'), 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (record) => {
        setConfirmModal({
            title: t('statsPage.deleteTitle'),
            message: t('statsPage.deleteMsg', { date: record.record_date }),
            type: 'danger',
            confirmLabel: t('statsPage.deleteBtn'),
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const res = await fetch(`${API_BASE}/${STATS_API}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ action: 'delete', id: record.id }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast(t('statsPage.deleted'), 'success');
                        fetchStats();
                    } else showToast(data.message || t('statsPage.deleteFailed'), 'error');
                } catch {
                    showToast(t('statsPage.serverError'), 'error');
                }
            }
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return;
        setConfirmModal({
            title: t('statsPage.bulkDeleteTitle', `${selectedIds.size}개 데이터 삭제`),
            message: t('statsPage.bulkDeleteMsg', `선택한 ${selectedIds.size}개의 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`),
            type: 'danger',
            confirmLabel: t('statsPage.deleteCount', `${selectedIds.size}개 삭제`),
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const res = await fetch(`${API_BASE}/${STATS_API}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ action: 'bulk_delete', ids: [...selectedIds] }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast(data.message || t('statsPage.deleteSuccess', `${data.deleted}개 삭제됨`), 'success');
                        setSelectedIds(new Set());
                        fetchStats();
                    } else showToast(data.message || t('statsPage.deleteFail', '삭제 실패'), 'error');
                } catch {
                    showToast(t('statsPage.serverError'), 'error');
                }
            }
        });
    };


    const formatDateLabel = (record) => {
        const d = record.record_date;
        if (record.record_type === 'daily') return d; // YYYY-MM-DD
        if (record.record_type === 'annual') return `${d}${t('statsPage.yearSuffix')}`;
        return d; // YYYY-MM
    };

    const periodLabel = (type) => {
        if (type === 'daily') return t('statsPage.tabDaily');
        if (type === 'monthly') return t('statsPage.tabMonthly');
        if (type === 'annual') return t('statsPage.tabAnnual');
        return type;
    };

    // ── Dashboard KPIs (from actual records — no double counting) ──
    const dashKPI = useMemo(() => {
        // Filter by dashboardYear
        const yearStr = String(dashboardYear);
        const yearStats = dashboardYear ? allStats.filter(s => (s.record_date || '').startsWith(yearStr)) : allStats;
        const totalRevenue = yearStats.reduce((sum, s) => sum + (parseInt(s.monthly_revenue) || 0), 0);
        const totalCustomers = yearStats.reduce((sum, s) => sum + (parseInt(s.customer_count) || 0), 0);
        const totalTransactions = yearStats.reduce((sum, s) => sum + (parseInt(s.transaction_count) || 0), 0);
        const totalCost = yearStats.reduce((sum, s) => sum + (parseInt(s.cost_price) || 0), 0);
        const totalCount = yearStats.length;

        // Sparkline: recent 7-day revenue
        const sorted = [...yearStats].sort((a, b) => (a.record_date || '').localeCompare(b.record_date || ''));
        const last7 = sorted.slice(-7).map(s => parseInt(s.monthly_revenue) || 0);

        // Monthly aggregation for trend
        const monthMap = {};
        const monthCostMap = {};
        const monthTxMap = {};
        sorted.forEach(s => {
            const m = (s.record_date || '').substring(0, 7);
            if (m) {
                monthMap[m] = (monthMap[m] || 0) + (parseInt(s.monthly_revenue) || 0);
                monthCostMap[m] = (monthCostMap[m] || 0) + (parseInt(s.cost_price) || 0);
                monthTxMap[m] = (monthTxMap[m] || 0) + (parseInt(s.transaction_count) || 0);
            }
        });
        const monthKeys = Object.keys(monthMap).sort();
        const last12Months = monthKeys.slice(-12).map(m => ({ month: m, revenue: monthMap[m], cost: monthCostMap[m] || 0, transactions: monthTxMap[m] || 0 }));

        // MoM growth
        let momGrowth = null;
        if (monthKeys.length >= 2) {
            const cur = monthMap[monthKeys[monthKeys.length - 1]] || 0;
            const prev = monthMap[monthKeys[monthKeys.length - 2]] || 0;
            momGrowth = prev > 0 ? parseFloat(((cur - prev) / prev * 100).toFixed(1)) : null;
        }

        // Daily average (from daily records)
        const dailyRecords = allStats.filter(s => s.record_type === 'daily');
        const dailyAvg = dailyRecords.length > 0 ? Math.round(dailyRecords.reduce((sum, s) => sum + (parseInt(s.monthly_revenue) || 0), 0) / dailyRecords.length) : 0;

        // Best day & month
        let bestDay = null;
        if (sorted.length > 0) {
            bestDay = sorted.reduce((best, s) => (parseInt(s.monthly_revenue) || 0) > (parseInt(best.monthly_revenue) || 0) ? s : best, sorted[0]);
        }
        let bestMonth = null;
        if (monthKeys.length > 0) {
            const bestMonthKey = monthKeys.reduce((best, m) => monthMap[m] > monthMap[best] ? m : best, monthKeys[0]);
            bestMonth = { month: bestMonthKey, revenue: monthMap[bestMonthKey] };
        }

        // Top channel & category
        const channelMap = {};
        const categoryMap = {};
        yearStats.forEach(s => {
            const rev = parseInt(s.monthly_revenue) || 0;
            const ch = s.sales_channel || s.source || 'manual';
            channelMap[ch] = (channelMap[ch] || 0) + rev;
            const cat = s.best_selling_item || 'N/A';
            categoryMap[cat] = (categoryMap[cat] || 0) + rev;
        });
        const topChannel = Object.entries(channelMap).sort((a, b) => b[1] - a[1])[0] || null;
        const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || null;

        // Profit margin
        const profitMargin = totalRevenue > 0 ? parseFloat(((totalRevenue - totalCost) / totalRevenue * 100).toFixed(1)) : 0;

        // WoW growth (last 7 vs previous 7)
        const recent7Rev = sorted.slice(-7).reduce((s, r) => s + (parseInt(r.monthly_revenue) || 0), 0);
        const prev7Rev = sorted.slice(-14, -7).reduce((s, r) => s + (parseInt(r.monthly_revenue) || 0), 0);
        const wowGrowth = prev7Rev > 0 ? parseFloat(((recent7Rev - prev7Rev) / prev7Rev * 100).toFixed(1)) : null;

        return {
            totalRevenue, totalCustomers, totalTransactions, totalCount, totalCost,
            sparkline: last7, last12Months, momGrowth, wowGrowth, dailyAvg,
            bestDay, bestMonth, topChannel, topCategory, profitMargin,
        };
    }, [allStats, dashboardYear]);

    // ── Chart Data for filtered view (with period filter) ──
    const chartData = useMemo(() => {
        const sorted = [...filteredStats].sort((a, b) => a.record_date.localeCompare(b.record_date));
        // Helper: determine current view for chart
        const curView = activeTab === 'sales' ? salesView : activeTab === 'customers' ? 'daily' : null;
        if (curView === 'daily' || activeTab === 'customers') {
            // Custom date range
            if (customDateStart && customDateEnd) {
                const dataMap = {};
                sorted.filter(s => s.record_date >= customDateStart && s.record_date <= customDateEnd)
                    .forEach(s => { dataMap[s.record_date] = (dataMap[s.record_date] || 0) + (parseInt(s.monthly_revenue) || 0); });
                const result = [];
                const cur = new Date(customDateStart);
                const end = new Date(customDateEnd);
                while (cur <= end) {
                    const ds = cur.toISOString().slice(0, 10);
                    result.push({ label: ds, revenue: dataMap[ds] || 0 });
                    cur.setDate(cur.getDate() + 1);
                }
                return result;
            }
            const today = new Date();
            const offsetDays = chartOffset * chartRange;
            const endDate = new Date(today);
            endDate.setDate(endDate.getDate() - offsetDays);
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - chartRange + 1);
            const dataMap = {};
            sorted.filter(s => s.record_date >= startDate.toISOString().slice(0, 10) && s.record_date <= endDate.toISOString().slice(0, 10))
                .forEach(s => { dataMap[s.record_date] = (dataMap[s.record_date] || 0) + (parseInt(s.monthly_revenue) || 0); });
            const result = [];
            const cur = new Date(startDate);
            while (cur <= endDate) {
                const ds = cur.toISOString().slice(0, 10);
                result.push({ label: ds, revenue: dataMap[ds] || 0 });
                cur.setDate(cur.getDate() + 1);
            }
            return result;
        }
        if (curView === 'monthly') {
            const today = new Date();
            const offsetMonths = chartOffset * chartRange;
            const endDate = new Date(today.getFullYear(), today.getMonth() - offsetMonths, 1);
            const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - chartRange + 1, 1);
            const startStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
            const endStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;
            return sorted.filter(s => {
                const ym = s.record_date?.slice(0, 7);
                return ym >= startStr && ym <= endStr;
            }).map(s => ({ label: s.record_date, revenue: parseInt(s.monthly_revenue) || 0 }));
        }
        if (curView === 'annual') {
            const thisYear = new Date().getFullYear();
            const offsetYears = chartOffset * chartRange;
            const endYear = thisYear - offsetYears;
            const startYear = endYear - chartRange + 1;
            return sorted.filter(s => {
                const y = parseInt(s.record_date?.slice(0, 4));
                return y >= startYear && y <= endYear;
            }).map(s => ({ label: s.record_date, revenue: parseInt(s.monthly_revenue) || 0 }));
        }
        // dashboard: show all
        return sorted.slice(-12).map(s => ({
            label: s.record_date,
            revenue: parseInt(s.monthly_revenue) || 0,
        }));
    }, [filteredStats, activeTab, salesView, chartRange, chartOffset, customDateStart, customDateEnd]);
    const maxChartVal = Math.max(...chartData.map(d => d.revenue), 1);
    const CHART_HEIGHT_PX = 140; // chart area height in pixels

    // ── Period KPI ──
    const periodKPI = useMemo(() => {
        if (activeTab === 'dashboard') return null;
        const records = filteredStats;
        if (records.length === 0) return null;
        const revenues = records.map(r => parseInt(r.monthly_revenue) || 0).filter(v => v > 0);
        return {
            count: records.length,
            totalRevenue: revenues.reduce((s, v) => s + v, 0),
            avgRevenue: revenues.length > 0 ? Math.round(revenues.reduce((s, v) => s + v, 0) / revenues.length) : 0,
            totalCustomers: records.reduce((s, r) => s + (parseInt(r.customer_count) || 0), 0),
            totalTransactions: records.reduce((s, r) => s + (parseInt(r.transaction_count) || 0), 0),
        };
    }, [filteredStats, activeTab]);

    return (
        <div className="max-w-6xl mx-auto pb-20 overflow-x-hidden">
            {/* ── Compact Header ── */}
            <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                        <TrendingUp className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">{t('statsPage.title')}</h1>
                        <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">{t('statsPage.subtitle')}</p>
                    </div>
                </div>
                {activeTab !== 'upload' && (
                    <button
                        onClick={() => {
                            if (activeTab === 'expense') {
                                setEditingExpense(null);
                                setShowExpenseForm(true);
                            } else {
                                handleOpenForm();
                            }
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-2 ${activeTab === 'expense' ? 'bg-violet-600 hover:bg-violet-700 shadow-violet-200/50 dark:shadow-violet-900/30' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50 dark:shadow-emerald-900/30'} text-white rounded-lg font-bold text-xs active:scale-95 transition-all shadow-md`}
                    >
                        <Plus size={14} />
                        <span className="hidden sm:inline">{activeTab === 'expense' ? t('statsPage.expAdd', '지출 추가') : t('statsPage.addData')}</span>
                        <span className="sm:hidden">{t('statsPage.add', '추가')}</span>
                    </button>
                )}
            </div>

            {/* ── Tab & Country Pickers (side by side) ── */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
                {/* Tab Picker */}
                <div className="relative" ref={tabPickerRef}>
                    <button
                        onClick={() => setShowTabPicker(!showTabPicker)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 transition-all"
                    >
                        {(() => {
                            const currentTab = PERIOD_TABS.find(t2 => t2.key === activeTab);
                            const CurIcon = currentTab?.icon || BarChart3;
                            return (
                                <>
                                    <CurIcon size={16} className="text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{currentTab?.label || 'Dashboard'}</span>
                                </>
                            );
                        })()}
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${showTabPicker ? 'rotate-180' : ''}`} />
                    </button>
                    {showTabPicker && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowTabPicker(false)} />
                            <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl p-2 min-w-[220px] animate-in fade-in slide-in-from-top-2">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-1.5 mb-1">{t('statsPage.selectTab', '페이지 선택')}</p>
                                {PERIOD_TABS.map(tab => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.key;
                                    const count = tab.key === 'dashboard'
                                        ? allStats.length
                                        : tab.key === 'sales'
                                            ? allStats.filter(s => s.record_type === 'daily').length
                                            : 0;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => {
                                                setRecordsPage(1);
                                                startTransition(() => {
                                                    setActiveTab(tab.key);
                                                    setChartOffset(0);
                                                    if (tab.key === 'sales') {
                                                        setSalesView('daily');
                                                        setSalesChartRange(14);
                                                        setSalesChartOffset(0);
                                                    }
                                                    if (tab.key === 'customers') setChartRange(14);
                                                });
                                                setShowTabPicker(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${isActive
                                                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                }`}
                                        >
                                            <Icon size={16} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'} />
                                            <span className="flex-1 text-left">{tab.label}</span>

                                            {isActive && (
                                                <CheckCircle size={16} className="text-emerald-500" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Country Picker */}
                <div className="relative" ref={countryPickerRef}>
                    <button
                        onClick={() => setShowCountryPicker(!showCountryPicker)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 transition-all"
                    >
                        <span className="text-base">{HOST_COUNTRIES.find(c => c.code === selectedCountry)?.flag || '🏳️'}</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{HOST_COUNTRIES.find(c => c.code === selectedCountry)?.name || selectedCountry}</span>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} />
                    </button>
                    {showCountryPicker && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowCountryPicker(false)} />
                            <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl p-2 min-w-[220px] animate-in fade-in slide-in-from-top-2">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-1.5 mb-1">{t('statsPage.selectCountry', '국가 선택')}</p>
                                {HOST_COUNTRIES.map(c => (
                                    <button
                                        key={c.code}
                                        onClick={() => {
                                            if (selectedCountry !== c.code) {
                                                setSelectedCountry(c.code);
                                                setLoading(true);
                                            }
                                            setShowCountryPicker(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCountry === c.code
                                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <span className="text-lg">{c.flag}</span>
                                        <span className="flex-1 text-left">{c.name}</span>
                                        {selectedCountry === c.code && (
                                            <CheckCircle size={16} className="text-emerald-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent" />
                </div>
            ) : (
                <>
                    {/* ════ DASHBOARD TAB ════ */}
                    {activeTab === 'dashboard' && (
                        <div className="max-w-7xl mx-auto space-y-5 px-1">
                            {/* Year Navigator */}
                            <div className="flex items-center gap-1">
                                <button onClick={() => setDashboardYear(y => (y || new Date().getFullYear()) - 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                                    <ChevronDown size={16} className="rotate-90" />
                                </button>
                                <span className="text-sm font-extrabold text-gray-900 dark:text-white min-w-[80px] text-center">
                                    {dashboardYear ? `${dashboardYear}${t('statsPage.year', '년')}` : t('statsPage.allYears', '전체')}
                                </span>
                                <button onClick={() => setDashboardYear(y => !y ? null : y >= new Date().getFullYear() ? null : y + 1)}
                                    disabled={!dashboardYear}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${!dashboardYear ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                    <ChevronDown size={16} className="-rotate-90" />
                                </button>
                                <button onClick={() => setDashboardYear(prev => prev === null ? new Date().getFullYear() : null)}
                                    className={`ml-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${!dashboardYear ? 'bg-indigo-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                    {t('statsPage.allData', '전체')}
                                </button>
                            </div>
                            {/* Country Breakdown (compact horizontal) */}
                            {countryBreakdown.length > 1 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs">🌍</span>
                                        <h3 className="font-bold text-gray-500 dark:text-gray-400 text-[11px] uppercase tracking-wider">{t('statsPage.countryBreakdown', '국가별 매출 현황')}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {countryBreakdown.map(cb => {
                                            const cInfo = HOST_COUNTRIES.find(vc => vc.code === cb.country_code);
                                            const isActive = selectedCountry === cb.country_code;
                                            return (
                                                <button
                                                    key={cb.country_code}
                                                    onClick={() => {
                                                        if (selectedCountry !== cb.country_code) {
                                                            setSelectedCountry(cb.country_code);
                                                            setLoading(true);
                                                        }
                                                    }}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-left ${isActive
                                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 ring-1 ring-emerald-200 dark:ring-emerald-800 shadow-sm'
                                                        : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-emerald-300 hover:bg-emerald-50/50'
                                                        }`}
                                                >
                                                    <span className="text-sm">{cInfo?.flag || '🏳️'}</span>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-tight">{cInfo?.name || cb.country_code}</p>
                                                        <p className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 leading-tight">{formatRevenue(cb.total_revenue)}</p>
                                                    </div>
                                                    <span className="text-[9px] text-gray-400">{cb.record_count}{t('statsPage.units', '건')}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ── Row 1: KPI Summary Cards (reference style) ── */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    {
                                        title: t('statsPage.totalRecords', '총 기록 수'),
                                        value: `${dashKPI.totalCount}`,
                                        unit: t('statsPage.units', '건'),
                                        change: null,
                                        icon: <FileText size={18} />,
                                        iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
                                        iconColor: 'text-emerald-600 dark:text-emerald-400',
                                        targetTab: 'sales',
                                    },
                                    {
                                        title: t('statsPage.totalRevenue', '누적 매출'),
                                        value: dashKPI.totalRevenue > 0 ? formatRevenue(dashKPI.totalRevenue) : '-',
                                        unit: '',
                                        change: dashKPI.momGrowth,
                                        changeLabel: t('statsPage.fromLastMonth', '전월 대비'),
                                        icon: <DollarSign size={18} />,
                                        iconBg: 'bg-teal-50 dark:bg-teal-900/20',
                                        iconColor: 'text-teal-600 dark:text-teal-400',
                                        targetTab: 'analytics',
                                    },
                                    {
                                        title: t('statsPage.totalExpenses', '총 원가'),
                                        value: dashKPI.totalCost > 0 ? formatRevenue(dashKPI.totalCost) : '-',
                                        unit: '',
                                        change: null,
                                        icon: <Wallet size={18} />,
                                        iconBg: 'bg-red-50 dark:bg-red-900/20',
                                        iconColor: 'text-red-500 dark:text-red-400',
                                        targetTab: 'expense',
                                    },
                                    {
                                        title: t('statsPage.totalTransactions', '총 거래건수'),
                                        value: `${dashKPI.totalTransactions.toLocaleString()}`,
                                        unit: t('statsPage.units', '건'),
                                        change: dashKPI.wowGrowth,
                                        changeLabel: t('statsPage.fromLastWeek', '전주 대비'),
                                        icon: <ShoppingCart size={18} />,
                                        iconBg: 'bg-violet-50 dark:bg-violet-900/20',
                                        iconColor: 'text-violet-600 dark:text-violet-400',
                                        targetTab: 'customers',
                                    },
                                ].map((card, idx) => (
                                    <div key={idx} onClick={() => { setRecordsPage(1); startTransition(() => setActiveTab(card.targetTab)); }} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-all group cursor-pointer">
                                        <div className="flex items-start justify-between mb-3">
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{card.title}</p>
                                            <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center ${card.iconColor}`}>
                                                {card.icon}
                                            </div>
                                        </div>
                                        <p className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">
                                            {card.value}{card.unit && <span className="text-sm ml-0.5 font-bold text-gray-400">{card.unit}</span>}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            {card.change !== null && card.change !== undefined ? (
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                                                    <span className={`font-bold ${card.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                        {card.change >= 0 ? '↑' : '↓'} {Math.abs(card.change)}%
                                                    </span>
                                                    {' '}{card.changeLabel || ''}
                                                </p>
                                            ) : (
                                                <span />
                                            )}
                                            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ── Row 2: Revenue Chart + Category Breakdown ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                                {/* Left: Average Income / Revenue Bar Chart */}
                                <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-extrabold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                                            <BarChart3 size={16} className="text-emerald-600" />
                                            {t('statsPage.avgIncomeStatistic', '평균 매출 현황')}
                                        </h3>
                                        <span className="text-[10px] bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2.5 py-1 font-bold text-gray-500 dark:text-gray-400">
                                            📅 {t('statsPage.thisYear', '올해')}
                                        </span>
                                    </div>
                                    {dashKPI.last12Months.length > 0 ? (
                                        <>
                                            <div className="mb-3">
                                                <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                                                    {formatRevenue(Math.round(dashKPI.last12Months.reduce((s, m) => s + m.revenue, 0) / Math.max(dashKPI.last12Months.length, 1)))}
                                                    <span className="text-xs text-gray-400 font-bold ml-1">/{t('statsPage.monthly', '월')}</span>
                                                </p>
                                                {dashKPI.momGrowth !== null && (
                                                    <p className={`text-[11px] font-bold ${dashKPI.momGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                        {dashKPI.momGrowth >= 0 ? '↑' : '↓'} {Math.abs(dashKPI.momGrowth)}% {t('statsPage.fromPrevMonth', '전월 대비')}
                                                    </p>
                                                )}
                                            </div>
                                            {/* Bar Chart with Y-Axis labels */}
                                            {(() => {
                                                const months = dashKPI.last12Months;
                                                const maxVal = Math.max(...months.map(m => m.revenue), 1);
                                                // Generate Y-axis scale: 6 ticks from 0 to rounded max
                                                const yTicks = [];
                                                const step = Math.ceil(maxVal / 5 / (maxVal > 10000 ? 1000 : maxVal > 1000 ? 100 : 10)) * (maxVal > 10000 ? 1000 : maxVal > 1000 ? 100 : 10);
                                                for (let i = 5; i >= 0; i--) yTicks.push(step * i);
                                                const chartMax = yTicks[0] || maxVal;

                                                return (
                                                    <div className="flex gap-1">
                                                        {/* Y-Axis labels */}
                                                        <div className="flex flex-col justify-between py-0.5 pr-1" style={{ height: '160px' }}>
                                                            {yTicks.map((v, i) => (
                                                                <span key={i} className="text-[9px] text-gray-400 dark:text-gray-500 font-medium text-right leading-none whitespace-nowrap">
                                                                    {formatRevenue(v)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        {/* Bars */}
                                                        <div className="flex-1">
                                                            <div className="flex items-end gap-1 relative" style={{ height: '160px' }}>
                                                                {/* Horizontal grid lines */}
                                                                {yTicks.map((v, i) => (
                                                                    <div key={`grid-${i}`} className="absolute left-0 right-0 border-t border-gray-100 dark:border-gray-700"
                                                                        style={{ bottom: `${(v / chartMax) * 100}%` }} />
                                                                ))}
                                                                {months.map((m, i) => {
                                                                    const pct = m.revenue / chartMax;
                                                                    const isBest = dashKPI.bestMonth && m.month === dashKPI.bestMonth.month;
                                                                    return (
                                                                        <div key={i} className="flex-1 flex flex-col items-center gap-0 relative z-10 group" style={{ height: '100%', justifyContent: 'flex-end' }}>
                                                                            {/* Hover tooltip */}
                                                                            <div className="absolute -top-5 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 dark:bg-gray-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                                                                                {formatRevenue(m.revenue)}
                                                                            </div>
                                                                            <div
                                                                                className={`w-full max-w-[32px] mx-auto rounded-t-md transition-all duration-500 cursor-pointer ${isBest
                                                                                    ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm shadow-emerald-200 dark:shadow-emerald-900'
                                                                                    : m.revenue > 0
                                                                                        ? 'bg-gradient-to-t from-emerald-200 to-emerald-100 dark:from-emerald-800/50 dark:to-emerald-700/30 group-hover:from-emerald-400 group-hover:to-emerald-300'
                                                                                        : 'bg-gray-100 dark:bg-gray-700'
                                                                                    }`}
                                                                                style={{ height: `${Math.max(3, pct * 100)}%` }}
                                                                            />
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            {/* X-axis month labels */}
                                                            <div className="flex gap-1 mt-1.5 border-t border-gray-100 dark:border-gray-700 pt-1">
                                                                {months.map((m, i) => {
                                                                    const isBest = dashKPI.bestMonth && m.month === dashKPI.bestMonth.month;
                                                                    const monthNum = parseInt(m.month.slice(5));
                                                                    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                                                    return (
                                                                        <span key={i} className={`flex-1 text-center text-[9px] font-bold ${isBest ? 'text-emerald-600' : 'text-gray-400 dark:text-gray-500'}`}>
                                                                            {monthNames[monthNum] || m.month.slice(5)}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                            {/* Summary stats below chart: Today | Last 7 Days | Last Month */}
                                            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                <div className="text-center">
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{t('statsPage.dailyAvg', '일평균')}</p>
                                                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">{dashKPI.dailyAvg > 0 ? formatRevenue(dashKPI.dailyAvg) : '-'}</p>
                                                </div>
                                                <div className="text-center border-x border-gray-100 dark:border-gray-700">
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{t('statsPage.recent7Days', '최근 7일')}</p>
                                                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">{formatRevenue(dashKPI.sparkline.reduce((s, v) => s + v, 0))}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{t('statsPage.lastMonth', '지난달')}</p>
                                                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                                                        {dashKPI.last12Months.length >= 2 ? formatRevenue(dashKPI.last12Months[dashKPI.last12Months.length - 2].revenue) : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <BarChart3 size={40} className="mb-2 opacity-30" />
                                            <p className="text-xs">{t('statsPage.noData', '데이터 없음')}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Category / Channel Breakdown (Donut) */}
                                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-extrabold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                                            <PieChart size={16} className="text-teal-600" />
                                            {t('statsPage.categoryBreakdown', '카테고리별 분석')}
                                        </h3>
                                    </div>
                                    {(() => {
                                        // Build category breakdown data from allStats
                                        const catMap = {};
                                        const catCountMap = {};
                                        allStats.forEach(s => {
                                            const rev = parseInt(s.monthly_revenue) || 0;
                                            const cat = s.best_selling_item || t('statsPage.uncategorized', '미분류');
                                            catMap[cat] = (catMap[cat] || 0) + rev;
                                            catCountMap[cat] = (catCountMap[cat] || 0) + 1;
                                        });
                                        const entries = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
                                        const total = entries.reduce((s, e) => s + e[1], 0);
                                        const totalCategories = Object.keys(catMap).length;
                                        const donutColors = ['#10b981', '#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899'];
                                        const donutBgColors = ['bg-emerald-500', 'bg-teal-500', 'bg-amber-500', 'bg-violet-500', 'bg-pink-500'];
                                        const donutTextColors = ['text-emerald-600', 'text-teal-600', 'text-amber-600', 'text-violet-600', 'text-pink-600'];

                                        if (entries.length === 0 || total === 0) {
                                            return (
                                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                                    <PieChart size={40} className="mb-2 opacity-30" />
                                                    <p className="text-xs">{t('statsPage.noData', '데이터 없음')}</p>
                                                </div>
                                            );
                                        }

                                        // SVG Donut Chart
                                        const radius = 50;
                                        const circumference = 2 * Math.PI * radius;
                                        let accumulated = 0;
                                        const topPct = entries.length > 0 ? Math.round((entries[0][1] / total) * 100) : 0;

                                        return (
                                            <div>
                                                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                                                    {/* Donut SVG */}
                                                    <div className="relative flex-shrink-0">
                                                        <svg width="130" height="130" viewBox="0 0 130 130">
                                                            <circle cx="65" cy="65" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="16" className="dark:stroke-gray-700" />
                                                            {entries.map((entry, i) => {
                                                                const pct = entry[1] / total;
                                                                const dash = pct * circumference;
                                                                const offset = -accumulated * circumference + circumference * 0.25;
                                                                accumulated += pct;
                                                                return (
                                                                    <circle key={i} cx="65" cy="65" r={radius} fill="none"
                                                                        stroke={donutColors[i]}
                                                                        strokeWidth="16" strokeLinecap="butt"
                                                                        strokeDasharray={`${dash} ${circumference - dash}`}
                                                                        strokeDashoffset={offset}
                                                                        className="transition-all duration-700" />
                                                                );
                                                            })}
                                                        </svg>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                            <span className="text-base font-extrabold text-gray-900 dark:text-white">{formatRevenue(total)}</span>
                                                            <span className="text-[9px] text-gray-400">{totalCategories}{t('statsPage.categoriesCount', '개 카테고리')}</span>
                                                        </div>
                                                    </div>
                                                    {/* Category list with progress bars + amounts */}
                                                    <div className="flex-1 space-y-2">
                                                        {entries.map((entry, i) => {
                                                            const pct = Math.round((entry[1] / total) * 100);
                                                            const count = catCountMap[entry[0]] || 0;
                                                            const isTop = i === 0;
                                                            return (
                                                                <div key={i} className={`rounded-lg p-1.5 transition-colors ${isTop ? 'bg-emerald-50/60 dark:bg-emerald-900/15' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                                                                    <div className="flex items-center justify-between mb-0.5">
                                                                        <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 truncate max-w-[90px] flex items-center gap-1">
                                                                            <span className={`w-2 h-2 rounded-full ${donutBgColors[i]} flex-shrink-0`} />
                                                                            {entry[0]}
                                                                            {isTop && <span className="text-[9px] text-amber-500 ml-0.5">★</span>}
                                                                        </span>
                                                                        <span className="text-[10px] font-extrabold text-gray-900 dark:text-white">{pct}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                                                        <div className={`${donutBgColors[i]} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                                                    </div>
                                                                    <div className="flex items-center justify-between mt-0.5">
                                                                        <span className={`text-[9px] font-bold ${donutTextColors[i]}`}>{formatRevenue(entry[1])}</span>
                                                                        <span className="text-[9px] text-gray-400">{count}건</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                {/* Analysis Summary */}
                                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                    <div className="flex flex-wrap items-center gap-2 text-[10px]">
                                                        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                                                            <Trophy size={10} className="text-amber-500" />
                                                            <span className="text-gray-600 dark:text-gray-400">{t('statsPage.rank1st', '1위')} <strong className="text-emerald-700 dark:text-emerald-400">{entries[0]?.[0]}</strong></span>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                                                            <Layers size={10} className="text-blue-500" />
                                                            <span className="text-gray-600 dark:text-gray-400">{t('statsPage.top1Share', '상위 1개가 전체')} <strong className="text-blue-700 dark:text-blue-400">{topPct}%</strong></span>
                                                        </div>
                                                        {entries.length > 1 && (
                                                            <div className="flex items-center gap-1 bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded-lg">
                                                                <Target size={10} className="text-violet-500" />
                                                                <span className="text-gray-600 dark:text-gray-400">{totalCategories}{t('statsPage.categoriesDistributed', '개 분포')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* ── Quick Action Bar ── */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-3 flex items-center gap-2 overflow-x-auto" style={{ touchAction: 'pan-x' }}>
                                <button onClick={() => handleOpenForm()} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shadow-sm">
                                    <Plus size={13} /> {t('statsPage.addData')}
                                </button>
                                <button onClick={() => setActiveTab('upload')} className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg text-[11px] font-bold text-gray-600 dark:text-gray-300 transition-all whitespace-nowrap">
                                    <Upload size={13} /> {t('statsPage.tabUpload', '업로드')}
                                </button>
                                <button onClick={() => setActiveTab('expense')} className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg text-[11px] font-bold text-gray-600 dark:text-gray-300 transition-all whitespace-nowrap">
                                    <Wallet size={13} /> {t('statsPage.tabExpense', '지출')}
                                </button>
                                <button onClick={() => setActiveTab('tax')} className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg text-[11px] font-bold text-gray-600 dark:text-gray-300 transition-all whitespace-nowrap">
                                    <DollarSign size={13} /> {t('statsPage.tabTax', '세무')}
                                </button>
                                <button onClick={() => setActiveTab('analytics')} className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg text-[11px] font-bold text-gray-600 dark:text-gray-300 transition-all whitespace-nowrap">
                                    <TrendingUp size={13} /> {t('statsPage.tabAnalytics', '분석')}
                                </button>
                            </div>

                            {/* ── Row 2.5: Revenue Trend (Sparkline) + Profitability Gauge ── */}
                            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">📊 {t('statsPage.revenueTrendSection', '매출 추이 & 수익성')}</p>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 min-w-0">
                                {/* Monthly Revenue Mini Chart (with Sparkline) */}
                                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-shadow overflow-hidden min-w-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-extrabold text-gray-900 dark:text-white text-xs flex items-center gap-2">
                                            <BarChart3 size={14} className="text-emerald-600" />
                                            {t('statsPage.monthlyRevenueTrend', '월별 매출 추이')}
                                        </h3>
                                        {dashKPI.momGrowth !== null && (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dashKPI.momGrowth >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {dashKPI.momGrowth >= 0 ? '▲' : '▼'} {Math.abs(dashKPI.momGrowth)}%
                                            </span>
                                        )}
                                    </div>
                                    {dashKPI.last12Months.length > 0 ? (
                                        <div className="flex items-end gap-1.5 h-36 overflow-hidden min-w-0">
                                            {dashKPI.last12Months.map((m, i) => {
                                                const mx = Math.max(...dashKPI.last12Months.map(x => x.revenue), 1);
                                                const pct = m.revenue / mx;
                                                const isLast = i === dashKPI.last12Months.length - 1;
                                                return (
                                                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group" style={{ height: '100%', justifyContent: 'flex-end' }}>
                                                        <span className="text-[8px] font-bold text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{formatRevenue(m.revenue)}</span>
                                                        <div className={`w-full rounded-t-md transition-all ${isLast ? 'bg-gradient-to-t from-emerald-500 to-teal-400' : m.revenue > 0 ? 'bg-gradient-to-t from-emerald-200 to-emerald-100 dark:from-emerald-800/40 dark:to-emerald-700/20' : 'bg-gray-100 dark:bg-gray-700'}`}
                                                            style={{ height: `${Math.max(4, pct * 85)}%` }} />
                                                        <span className="text-[8px] text-gray-400 dark:text-gray-500 font-medium">{m.month.slice(5)}월</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 text-center py-8">{t('statsPage.noData', '데이터 없음')}</p>
                                    )}
                                    {/* Sparkline: Recent 7 Records */}
                                    {dashKPI.sparkline.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <p className="text-[10px] text-gray-400 font-bold mb-1.5">{t('statsPage.recent7Records', '최근 7건 매출')}</p>
                                            <div className="flex items-end gap-1 h-8">
                                                {dashKPI.sparkline.map((v, i) => {
                                                    const mx = Math.max(...dashKPI.sparkline, 1);
                                                    return (
                                                        <div key={i} className="flex-1 bg-gradient-to-t from-teal-400 to-emerald-300 dark:from-teal-700 dark:to-emerald-600 rounded-t-sm transition-all hover:from-teal-500 hover:to-emerald-400 cursor-pointer"
                                                            style={{ height: `${Math.max(6, (v / mx) * 100)}%` }}
                                                            title={formatRevenue(v)} />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Profitability Gauge */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <h3 className="font-extrabold text-gray-900 dark:text-white text-xs mb-3 self-start flex items-center gap-2">
                                        <TrendingUp size={14} className="text-violet-600" />
                                        {t('statsPage.profitability', '수익성')}
                                    </h3>
                                    {(() => {
                                        const margin = dashKPI.profitMargin;
                                        const radius = 38;
                                        const circ = 2 * Math.PI * radius;
                                        const dashVal = (Math.min(margin, 100) / 100) * circ;
                                        return (
                                            <div className="relative">
                                                <svg width="96" height="96" viewBox="0 0 96 96">
                                                    <circle cx="48" cy="48" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="7" className="dark:stroke-gray-700" />
                                                    <circle cx="48" cy="48" r={radius} fill="none"
                                                        stroke={margin >= 50 ? '#10b981' : margin >= 20 ? '#f59e0b' : '#ef4444'}
                                                        strokeWidth="7" strokeLinecap="round"
                                                        strokeDasharray={`${dashVal} ${circ}`}
                                                        transform="rotate(-90 48 48)"
                                                        className="transition-all duration-1000" />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className={`text-xl font-extrabold ${margin >= 50 ? 'text-emerald-600' : margin >= 20 ? 'text-amber-600' : 'text-red-600'}`}>{margin}%</span>
                                                    <span className="text-[9px] text-gray-400">{t('statsPage.marginRate', '마진율')}</span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    <div className="grid grid-cols-2 gap-2 w-full mt-2">
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2 text-center">
                                            <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">{t('statsPage.plRevenue', '매출')}</p>
                                            <p className="text-xs font-extrabold text-gray-900 dark:text-gray-100">{formatRevenue(dashKPI.totalRevenue)}</p>
                                        </div>
                                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 text-center">
                                            <p className="text-[9px] text-red-500 font-bold">{t('statsPage.plCost', '원가')}</p>
                                            <p className="text-xs font-extrabold text-gray-900 dark:text-gray-100">{formatRevenue(dashKPI.totalCost)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Row 2.7: XY Line Chart (Revenue & Cost Trend) ── */}
                            {dashKPI.last12Months.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-shadow overflow-hidden min-w-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-extrabold text-gray-900 dark:text-white text-xs flex items-center gap-2">
                                            <TrendingUp size={14} className="text-blue-600" />
                                            {t('statsPage.xyChartTitle', '매출 · 원가 추이 (선 그래프)')}
                                        </h3>
                                        {/* Legend */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4 h-[3px] bg-emerald-500 rounded-full" />
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">{t('statsPage.plRevenue', '매출')}</span>
                                            </div>
                                            {dashKPI.last12Months.some(d => d.cost > 0) && (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-4 h-[3px] bg-red-400 rounded-full opacity-60" />
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">{t('statsPage.plCost', '원가')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {(() => {
                                        const data = dashKPI.last12Months;
                                        const hasCost = data.some(d => d.cost > 0);
                                        const maxVal = Math.max(...data.map(d => Math.max(d.revenue, d.cost || 0)), 1) * 1.1; // 10% headroom
                                        const W = 700;
                                        const H = 300;
                                        const padL = 70;  // left pad for Y labels
                                        const padR = 15;
                                        const padT = 15;
                                        const padB = 30; // bottom pad for X labels
                                        const chartW = W - padL - padR;
                                        const chartH = H - padT - padB;
                                        const n = data.length;
                                        const step = n > 1 ? chartW / (n - 1) : 0;

                                        const toX = (i) => padL + i * step;
                                        const toY = (val) => padT + chartH - (val / maxVal) * chartH;

                                        // Smooth cubic bezier path
                                        const smoothPath = (pts) => {
                                            if (pts.length < 2) return `M${pts[0][0]},${pts[0][1]}`;
                                            let d = `M${pts[0][0]},${pts[0][1]}`;
                                            for (let i = 0; i < pts.length - 1; i++) {
                                                const cpx = (pts[i][0] + pts[i + 1][0]) / 2;
                                                d += ` C${cpx},${pts[i][1]} ${cpx},${pts[i + 1][1]} ${pts[i + 1][0]},${pts[i + 1][1]}`;
                                            }
                                            return d;
                                        };

                                        const revPts = data.map((d, i) => [toX(i), toY(d.revenue)]);
                                        const costPts = data.map((d, i) => [toX(i), toY(d.cost || 0)]);

                                        const revenuePath = smoothPath(revPts);
                                        const costPathD = smoothPath(costPts);

                                        // Area under revenue
                                        const revenueArea = revenuePath + ` L${revPts[revPts.length - 1][0]},${padT + chartH} L${revPts[0][0]},${padT + chartH} Z`;

                                        // Y gridlines + labels
                                        const yTicks = 5;
                                        const yGrid = Array.from({ length: yTicks + 1 }, (_, i) => {
                                            const frac = i / yTicks;
                                            const val = maxVal * frac;
                                            const y = padT + chartH * (1 - frac);
                                            return { y, val };
                                        });

                                        return (
                                            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto', aspectRatio: `${W}/${H}` }}>
                                                <defs>
                                                    <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                                                    </linearGradient>
                                                </defs>

                                                {/* Y grid lines + labels */}
                                                {yGrid.map((g, i) => (
                                                    <g key={i}>
                                                        <line x1={padL} x2={W - padR} y1={g.y} y2={g.y} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray={i === 0 ? 'none' : '3,2'} className="dark:stroke-gray-700" />
                                                        <text x={padL - 6} y={g.y + 3} textAnchor="end" fontSize="9" fill="#9ca3af" fontWeight="500" fontFamily="system-ui">
                                                            {g.val >= 10000 ? `${(g.val / 10000).toFixed(g.val >= 100000 ? 0 : 1)}만` : g.val >= 1000 ? `${(g.val / 1000).toFixed(0)}천` : Math.round(g.val)}
                                                        </text>
                                                    </g>
                                                ))}

                                                {/* Revenue area fill */}
                                                <path d={revenueArea} fill="url(#revAreaGrad)" />

                                                {/* Revenue line */}
                                                <path d={revenuePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

                                                {/* Cost line */}
                                                {hasCost && (
                                                    <path d={costPathD} fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5,3" strokeLinejoin="round" strokeLinecap="round" opacity="0.6" />
                                                )}

                                                {/* Revenue dots with white border */}
                                                {data.map((d, i) => (
                                                    <g key={`rd${i}`} className="cursor-pointer">
                                                        <circle cx={toX(i)} cy={toY(d.revenue)} r="4" fill="white" stroke="#10b981" strokeWidth="2" />
                                                        <circle cx={toX(i)} cy={toY(d.revenue)} r="6" fill="transparent" className="hover:fill-emerald-500/10">
                                                            <title>{d.month.slice(5)} {t('statsPage.monthlyRevenue', '월 매출')}: {formatRevenue(d.revenue)}</title>
                                                        </circle>
                                                    </g>
                                                ))}

                                                {/* Cost dots */}
                                                {hasCost && data.map((d, i) => (
                                                    d.cost > 0 && (
                                                        <g key={`cd${i}`} className="cursor-pointer">
                                                            <circle cx={toX(i)} cy={toY(d.cost)} r="3" fill="white" stroke="#ef4444" strokeWidth="1.2" opacity="0.7" />
                                                            <circle cx={toX(i)} cy={toY(d.cost)} r="5" fill="transparent">
                                                                <title>{d.month.slice(5)} {t('statsPage.monthlyCost', '월 원가')}: {formatRevenue(d.cost)}</title>
                                                            </circle>
                                                        </g>
                                                    )
                                                ))}

                                                {/* X-axis labels */}
                                                {data.map((d, i) => (
                                                    <text key={`xl${i}`} x={toX(i)} y={H - 10} textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="500" fontFamily="system-ui">
                                                        {d.month.slice(5)}월
                                                    </text>
                                                ))}
                                            </svg>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* ── Row 2.8: Monthly Data Table ── */}
                            {dashKPI.last12Months.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-shadow overflow-hidden min-w-0">
                                    <h3 className="font-extrabold text-gray-900 dark:text-white text-xs flex items-center gap-2 mb-3">
                                        <FileText size={14} className="text-violet-600" />
                                        {t('statsPage.monthlyDataTable', '월별 매출 데이터 (표)')}
                                    </h3>
                                    <div className="overflow-x-auto" style={{ touchAction: 'pan-x' }}>
                                        <table className="w-full text-xs min-w-[600px]">
                                            <thead>
                                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                                    <th className="text-left py-2 px-2 font-bold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">{t('statsPage.month', '월')}</th>
                                                    <th className="text-right py-2 px-2 font-bold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">{t('statsPage.plRevenue', '매출')}</th>
                                                    <th className="text-right py-2 px-2 font-bold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">{t('statsPage.plCost', '원가')}</th>
                                                    <th className="text-right py-2 px-2 font-bold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">{t('statsPage.profit', '이익')}</th>
                                                    <th className="text-right py-2 px-2 font-bold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">{t('statsPage.transactionCount', '거래 건수')}</th>
                                                    <th className="text-right py-2 px-2 font-bold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">{t('statsPage.marginRate', '마진율')}</th>
                                                    <th className="text-right py-2 px-2 font-bold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">{t('statsPage.momChange', '전월 대비')} ↕</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashKPI.last12Months.map((m, i) => {
                                                    const profit = m.revenue - (m.cost || 0);
                                                    const margin = m.revenue > 0 ? Math.round((profit / m.revenue) * 100) : 0;
                                                    const prev = i > 0 ? dashKPI.last12Months[i - 1] : null;
                                                    const mom = prev && prev.revenue > 0
                                                        ? Math.round(((m.revenue - prev.revenue) / prev.revenue) * 100)
                                                        : null;
                                                    const isLast = i === dashKPI.last12Months.length - 1;
                                                    const txCount = m.transactions || 0;
                                                    return (
                                                        <tr key={i} className={`border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${isLast ? 'bg-emerald-50/50 dark:bg-emerald-900/10 font-bold' : ''}`}>
                                                            <td className="py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">{m.month.slice(2).replace('-', '.')}월</td>
                                                            <td className="py-2 px-2 text-right font-bold text-emerald-700 dark:text-emerald-400">{formatRevenue(m.revenue)}</td>
                                                            <td className="py-2 px-2 text-right text-red-500 dark:text-red-400">{m.cost > 0 ? formatRevenue(m.cost) : '-'}</td>
                                                            <td className={`py-2 px-2 text-right font-bold ${profit >= 0 ? 'text-gray-800 dark:text-gray-200' : 'text-red-600'}`}>{formatRevenue(profit)}</td>
                                                            <td className="py-2 px-2 text-right text-gray-600 dark:text-gray-400 font-medium">{txCount > 0 ? `${txCount.toLocaleString()}건` : '-'}</td>
                                                            <td className="py-2 px-2 text-right">
                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${margin >= 50 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : margin >= 20 ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                                    {margin}%
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-2 text-right">
                                                                {mom !== null ? (
                                                                    <span className={`text-[10px] font-bold ${mom >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                                                                        {mom >= 0 ? '▲' : '▼'}{Math.abs(mom)}%
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[10px] text-gray-300 dark:text-gray-600">-</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr className="border-t-2 border-gray-200 dark:border-gray-600">
                                                    <td className="py-2 px-2 font-extrabold text-gray-900 dark:text-white">{t('statsPage.total', '합계')}</td>
                                                    <td className="py-2 px-2 text-right font-extrabold text-emerald-700 dark:text-emerald-400">{formatRevenue(dashKPI.last12Months.reduce((s, d) => s + d.revenue, 0))}</td>
                                                    <td className="py-2 px-2 text-right font-bold text-red-500">{formatRevenue(dashKPI.last12Months.reduce((s, d) => s + (d.cost || 0), 0))}</td>
                                                    <td className="py-2 px-2 text-right font-extrabold text-gray-900 dark:text-white">{formatRevenue(dashKPI.last12Months.reduce((s, d) => s + d.revenue - (d.cost || 0), 0))}</td>
                                                    <td className="py-2 px-2 text-right font-bold text-gray-600 dark:text-gray-400">{dashKPI.last12Months.reduce((s, d) => s + (d.transactions || 0), 0).toLocaleString()}건</td>
                                                    <td className="py-2 px-2 text-right">
                                                        {(() => {
                                                            const totalR = dashKPI.last12Months.reduce((s, d) => s + d.revenue, 0);
                                                            const totalC = dashKPI.last12Months.reduce((s, d) => s + (d.cost || 0), 0);
                                                            const avgMargin = totalR > 0 ? Math.round(((totalR - totalC) / totalR) * 100) : 0;
                                                            return <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">{avgMargin}%</span>;
                                                        })()}
                                                    </td>
                                                    <td className="py-2 px-2" />
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            )}
                            {/* ── Quick Insights (4 cards) ── */}
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">💡 {t('statsPage.quickInsightsSection', '핵심 인사이트')}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-3 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white"><Trophy size={14} /></div>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase leading-tight">{t('statsPage.bestMonth', '최고 매출월')}</p>
                                    </div>
                                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">{dashKPI.bestMonth ? dashKPI.bestMonth.month.slice(0, 7) : '-'}</p>
                                    {dashKPI.bestMonth && (
                                        <>
                                            <p className="text-[11px] text-emerald-600 font-bold">{formatRevenue(dashKPI.bestMonth.revenue)}</p>
                                            {dashKPI.totalRevenue > 0 && (
                                                <div className="mt-1.5">
                                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1">
                                                        <div className="bg-amber-400 h-1 rounded-full" style={{ width: `${Math.min(100, (dashKPI.bestMonth.revenue / dashKPI.totalRevenue * 100))}%` }} />
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">{t('statsPage.shareOfTotal', '전체 대비')} {(dashKPI.bestMonth.revenue / dashKPI.totalRevenue * 100).toFixed(1)}%</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-3 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white"><ShoppingCart size={14} /></div>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase leading-tight">{t('statsPage.analyticsAvgOrder', '평균 주문가')}</p>
                                    </div>
                                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">{dashKPI.totalTransactions > 0 ? formatRevenue(Math.round(dashKPI.totalRevenue / dashKPI.totalTransactions)) : '-'}</p>
                                    {dashKPI.totalTransactions > 0 && (
                                        <div className="mt-1.5 grid grid-cols-2 gap-1">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded px-1.5 py-0.5">
                                                <p className="text-[11px] text-blue-500 font-bold">{t('statsPage.totalSales', '총매출')}</p>
                                                <p className="text-xs font-extrabold text-gray-700 dark:text-gray-300">{formatRevenue(dashKPI.totalRevenue)}</p>
                                            </div>
                                            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded px-1.5 py-0.5">
                                                <p className="text-[11px] text-indigo-500 font-bold">{t('statsPage.orderCount', '주문수')}</p>
                                                <p className="text-xs font-extrabold text-gray-700 dark:text-gray-300">{dashKPI.totalTransactions.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-3 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white"><TrendingUp size={14} /></div>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase leading-tight">{t('statsPage.topChannel', '주요 채널')}</p>
                                    </div>
                                    <p className="text-sm font-extrabold text-gray-900 dark:text-white truncate">{dashKPI.topChannel ? dashKPI.topChannel[0] : '-'}</p>
                                    {dashKPI.topChannel && (
                                        <>
                                            <p className="text-[11px] text-emerald-600 font-bold">{formatRevenue(dashKPI.topChannel[1])}</p>
                                            {dashKPI.totalRevenue > 0 && (
                                                <div className="mt-1.5">
                                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1">
                                                        <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${Math.min(100, (dashKPI.topChannel[1] / dashKPI.totalRevenue * 100))}%` }} />
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">{t('statsPage.revenueShare', '매출 비중')} {(dashKPI.topChannel[1] / dashKPI.totalRevenue * 100).toFixed(1)}%</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-3 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white"><Star size={14} /></div>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase leading-tight">{t('statsPage.topCategory', '인기 상품')}</p>
                                    </div>
                                    <p className="text-sm font-extrabold text-gray-900 dark:text-white truncate">{dashKPI.topCategory ? dashKPI.topCategory[0] : '-'}</p>
                                    {dashKPI.topCategory && (
                                        <>
                                            <p className="text-[11px] text-emerald-600 font-bold">{formatRevenue(dashKPI.topCategory[1])}</p>
                                            {dashKPI.totalRevenue > 0 && (
                                                <div className="mt-1.5">
                                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1">
                                                        <div className="bg-violet-500 h-1 rounded-full" style={{ width: `${Math.min(100, (dashKPI.topCategory[1] / dashKPI.totalRevenue * 100))}%` }} />
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">{t('statsPage.revenueShare', '매출 비중')} {(dashKPI.topCategory[1] / dashKPI.totalRevenue * 100).toFixed(1)}%</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* ── Period Breakdown Cards (3) ── */}
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">📋 {t('statsPage.periodBreakdownSection', '기간별 데이터')}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {[
                                    { key: 'daily', label: t('statsPage.dailyData'), icon: <Clock size={15} />, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50 dark:bg-blue-900/30', textColor: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-200 dark:ring-blue-800' },
                                    { key: 'monthly', label: t('statsPage.monthlyData'), icon: <CalendarDays size={15} />, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/30', textColor: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-200 dark:ring-emerald-800' },
                                    { key: 'annual', label: t('statsPage.annualData'), icon: <CalendarRange size={15} />, color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50 dark:bg-amber-900/30', textColor: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-200 dark:ring-amber-800' },
                                ].map(period => {
                                    const periodRecords = allStats.filter(s => s.record_type === period.key);
                                    const count = periodRecords.length;
                                    const totalRev = periodRecords.reduce((sum, s) => sum + (parseInt(s.monthly_revenue) || 0), 0);
                                    const avgRev = count > 0 ? Math.round(totalRev / count) : 0;
                                    return (
                                        <button
                                            key={period.key}
                                            onClick={() => setActiveTab(period.key)}
                                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:ring-2 hover:ring-offset-1 transition-all p-4 text-left group cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 bg-gradient-to-br ${period.color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                                                        {period.icon}
                                                    </div>
                                                    <h4 className="font-extrabold text-gray-900 dark:text-white text-xs">{period.label}</h4>
                                                </div>
                                                <span className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${period.bgColor} ${period.textColor}`}>
                                                    {count}{t('statsPage.units')}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <div className={`${period.bgColor} rounded-lg p-2`}>
                                                    <p className={`text-[11px] font-bold ${period.textColor} mb-0.5`}>{t('statsPage.totalSales')}</p>
                                                    <p className="text-xs font-extrabold text-gray-900 dark:text-gray-100">
                                                        {totalRev > 0 ? formatRevenue(totalRev) : '-'}
                                                    </p>
                                                </div>
                                                <div className={`${period.bgColor} rounded-lg p-2`}>
                                                    <p className={`text-[11px] font-bold ${period.textColor} mb-0.5`}>{t('statsPage.avgSales')}</p>
                                                    <p className="text-xs font-extrabold text-gray-900 dark:text-gray-100">
                                                        {avgRev > 0 ? formatRevenue(avgRev) : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`mt-2.5 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold ${period.bgColor} ${period.textColor} group-hover:ring-1 ${period.ring} transition-all`}>
                                                {t('statsPage.viewDetails', { period: period.label })}
                                                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ── Row 3: Latest Transactions + Sales Goal ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
                                {/* Left: Latest Transactions Table */}
                                {allStats.length > 0 ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
                                                <Calendar size={15} className="text-emerald-600" />
                                                {t('statsPage.latestTransactions', '최근 거래 내역')}
                                            </h3>
                                            <button onClick={() => setActiveTab('sales')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                                {t('statsPage.viewAll', '전체보기')} →
                                            </button>
                                        </div>
                                        {/* Table Header */}
                                        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                                            <span className="col-span-4">{t('statsPage.itemName', '항목')}</span>
                                            <span className="col-span-3">{t('statsPage.date', '날짜')}</span>
                                            <span className="col-span-2 text-center">{t('statsPage.status', '유형')}</span>
                                            <span className="col-span-3 text-right">{t('statsPage.amount', '금액')}</span>
                                        </div>
                                        {/* Table Rows */}
                                        <div className="space-y-1">
                                            {allStats.slice(0, 5).map(record => {
                                                const typeColors = {
                                                    daily: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                                                    monthly: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
                                                    annual: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
                                                };
                                                return (
                                                    <div key={record.id} className="grid grid-cols-12 gap-2 items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-1 transition-colors group cursor-pointer"
                                                        onClick={() => handleOpenForm(record)}>
                                                        <div className="col-span-4 flex items-center gap-2 min-w-0">
                                                            <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <ShoppingCart size={12} className="text-emerald-600 dark:text-emerald-400" />
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                                                {record.best_selling_item || record.product_name || t('statsPage.noItem', '항목 없음')}
                                                            </span>
                                                        </div>
                                                        <span className="col-span-3 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                                                            {record.record_date || '-'}
                                                        </span>
                                                        <div className="col-span-2 flex justify-center">
                                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${typeColors[record.record_type] || 'bg-gray-100 text-gray-500'}`}>
                                                                {record.record_type === 'daily' ? t('statsPage.daily', '일별') : record.record_type === 'monthly' ? t('statsPage.monthlyLabel', '월별') : t('statsPage.annualLabel', '연간')}
                                                            </span>
                                                        </div>
                                                        <span className="col-span-3 text-xs font-extrabold text-gray-900 dark:text-white text-right">
                                                            {formatRevenue(parseInt(record.monthly_revenue) || 0)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <EmptyPrompt onAdd={() => handleOpenForm()} />
                                )}

                                {/* Right: Sales Goal Widget */}
                                {(() => {
                                    const goalPeriodKey = salesGoal?.period || 'monthly';
                                    const goalRecords = allStats.filter(s => s.record_type === goalPeriodKey);
                                    const currentRevenue = goalRecords.reduce((sum, s) => sum + (parseInt(s.monthly_revenue) || 0), 0);
                                    const goalAmt = salesGoal?.amount || 0;
                                    const progress = goalAmt > 0 ? Math.min((currentRevenue / goalAmt) * 100, 100) : 0;
                                    const remaining = goalAmt - currentRevenue;
                                    const circumference = 2 * Math.PI * 40;
                                    const strokeDash = (progress / 100) * circumference;

                                    return (
                                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
                                                    <Target size={15} className="text-emerald-600" />
                                                    {t('statsPage.goalTitle', '🎯 매출 목표')}
                                                </h3>
                                                <button
                                                    onClick={() => { setShowGoalForm(!showGoalForm); setGoalAmount(salesGoal?.amount || ''); setGoalPeriod(salesGoal?.period || 'monthly'); }}
                                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                                                >
                                                    {salesGoal ? t('statsPage.goalEdit', '수정') : t('statsPage.goalSet', '목표 설정')}
                                                </button>
                                            </div>

                                            {showGoalForm && (
                                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-2.5 space-y-3">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">{t('statsPage.goalPeriod', '기간')}</label>
                                                        <div className="flex gap-2">
                                                            {[{ k: 'monthly', l: t('statsPage.tabMonthly', '월별') }, { k: 'annual', l: t('statsPage.tabAnnual', '연간') }].map(p => (
                                                                <button key={p.k} onClick={() => setGoalPeriod(p.k)}
                                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${goalPeriod === p.k ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
                                                                    {p.l}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">{t('statsPage.goalAmount', '목표 금액')}</label>
                                                        <input type="number" value={goalAmount} onChange={e => setGoalAmount(e.target.value)} placeholder="0"
                                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-bold text-right text-gray-900 dark:text-white" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={saveGoal} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors">{t('statsPage.goalSave', '저장')}</button>
                                                        {salesGoal && <button onClick={clearGoal} className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">{t('statsPage.goalClear', '삭제')}</button>}
                                                        <button onClick={() => setShowGoalForm(false)} className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">{t('statsPage.expCancel', '취소')}</button>
                                                    </div>
                                                </div>
                                            )}

                                            {salesGoal ? (
                                                <div className="flex items-center gap-5">
                                                    <div className="relative flex-shrink-0">
                                                        <svg width="96" height="96" viewBox="0 0 96 96">
                                                            <circle cx="48" cy="48" r="40" fill="none" stroke="#f3f4f6" strokeWidth="6" className="dark:stroke-gray-700" />
                                                            <circle cx="48" cy="48" r="40" fill="none"
                                                                stroke={progress >= 100 ? '#10b981' : '#10b981'}
                                                                strokeWidth="6" strokeLinecap="round"
                                                                strokeDasharray={`${strokeDash} ${circumference}`}
                                                                transform="rotate(-90 48 48)"
                                                                className="transition-all duration-1000" />
                                                        </svg>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                            <span className={`text-lg font-extrabold ${progress >= 100 ? 'text-emerald-600' : 'text-emerald-600'}`}>{progress.toFixed(0)}%</span>
                                                            <span className="text-[11px] text-gray-400 dark:text-gray-500">{t('statsPage.goalAchieved', '달성률')}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
                                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{t('statsPage.goalTarget', '목표')}</p>
                                                            <p className="text-sm font-extrabold text-gray-900 dark:text-white">{formatRevenue(goalAmt)}</p>
                                                        </div>
                                                        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-3">
                                                            <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">{t('statsPage.goalCurrent', '현재')}</p>
                                                            <p className="text-sm font-extrabold text-gray-900 dark:text-white">{formatRevenue(currentRevenue)}</p>
                                                        </div>
                                                        {remaining > 0 && (
                                                            <p className="text-xs text-gray-400 text-center">
                                                                {t('statsPage.goalRemaining', '남은 금액')}: <span className="font-bold text-emerald-600">{formatRevenue(remaining)}</span>
                                                            </p>
                                                        )}
                                                        {progress >= 100 && (
                                                            <p className="text-xs text-emerald-600 font-bold text-center flex items-center justify-center gap-1">
                                                                <CheckCircle size={14} /> {t('statsPage.goalComplete', '🎉 목표 달성!')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <Target size={32} className="mx-auto text-gray-300 mb-2" />
                                                    <p className="text-xs text-gray-400">{t('statsPage.goalEmpty', '매출 목표를 설정하여 진행 상황을 추적하세요!')}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {/* ════ PERIOD TABS (daily/monthly/annual) ════ */}
                    {
                        activeTab === 'sales' && (
                            <div className="space-y-3">
                                {/* Period KPI */}
                                {periodKPI && (
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                        {[
                                            { label: t('statsPage.recordCount'), value: `${periodKPI.count}${t('statsPage.units')}`, icon: <Calendar size={16} />, color: 'from-indigo-500 to-violet-600' },
                                            { label: t('statsPage.totalRevenue'), value: formatRevenue(periodKPI.totalRevenue), icon: <DollarSign size={16} />, color: 'from-emerald-500 to-teal-600' },
                                            { label: t('statsPage.avgRevenue'), value: formatRevenue(periodKPI.avgRevenue), icon: <TrendingUp size={16} />, color: 'from-blue-500 to-indigo-600' },
                                            { label: t('statsPage.totalCustomers'), value: periodKPI.totalCustomers.toLocaleString(), icon: <Users size={16} />, color: 'from-amber-500 to-orange-600' },
                                            { label: t('statsPage.totalTransactions'), value: periodKPI.totalTransactions.toLocaleString(), icon: <ShoppingCart size={16} />, color: 'from-rose-500 to-pink-600' },
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                                <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white mb-2`}>
                                                    {stat.icon}
                                                </div>
                                                <p className="text-lg font-extrabold text-gray-900">{stat.value}</p>
                                                <p className="text-[11px] text-gray-400 font-medium">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Revenue Chart */}
                                {chartData.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <BarChart3 size={18} className="text-emerald-600 dark:text-emerald-400" />
                                                <h3 className="font-extrabold text-gray-900 dark:text-gray-100">{t('statsPage.salesTrend', { period: periodLabel(salesView) })}</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {/* Chart Type Toggle */}
                                                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                                                    {[{ val: 'chart', icon: '📊' }, { val: 'table', icon: '📋' }, { val: 'both', icon: '📊📋' }].map(v => (
                                                        <button key={v.val} onClick={() => setChartViewMode(v.val)}
                                                            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${chartViewMode === v.val ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'}`}
                                                        >{v.icon}</button>
                                                    ))}
                                                </div>
                                                {/* Daily/Monthly/Annual Toggle */}
                                                <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                                                    {[
                                                        { key: 'daily', label: t('statsPage.tabDaily', '일간') },
                                                        { key: 'monthly', label: t('statsPage.tabMonthly', '월간') },
                                                        { key: 'annual', label: t('statsPage.tabAnnual', '연간') },
                                                    ].map(v => (
                                                        <button key={v.key} onClick={() => {
                                                            setSalesView(v.key);
                                                            setChartOffset(0);
                                                            setRecordsPage(1);
                                                            if (v.key === 'daily') setChartRange(14);
                                                            else if (v.key === 'monthly') setChartRange(6);
                                                            else setChartRange(5);
                                                        }}
                                                            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${salesView === v.key
                                                                ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                                            {v.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Period Filter */}
                                        {activeTab === 'sales' && (
                                            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                                                <div className="flex gap-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
                                                    {(salesView === 'daily'
                                                        ? [{ val: 7, label: t('statsPage.days7', '7일') }, { val: 14, label: t('statsPage.days14', '14일') }, { val: 30, label: t('statsPage.month1', '1개월') }]
                                                        : salesView === 'monthly'
                                                            ? [{ val: 3, label: t('statsPage.months3', '3개월') }, { val: 6, label: t('statsPage.months6', '6개월') }, { val: 12, label: t('statsPage.months12', '12개월') }, { val: 24, label: t('statsPage.months24', '24개월') }]
                                                            : [{ val: 3, label: t('statsPage.years3', '3년') }, { val: 5, label: t('statsPage.years5', '5년') }, { val: 10, label: t('statsPage.years10', '10년') }]
                                                    ).map(opt => (
                                                        <button key={opt.val}
                                                            onClick={() => { setChartRange(opt.val); setChartOffset(0); setCustomDateStart(''); setCustomDateEnd(''); }}
                                                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${chartRange === opt.val
                                                                ? 'bg-emerald-500 text-white shadow-sm'
                                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                                }`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                {/* Custom Date Range (daily/customers only) */}
                                                {salesView === 'daily' && (
                                                    <div className="flex items-center gap-1.5 ml-2">
                                                        <input
                                                            type="date"
                                                            value={customDateStart}
                                                            onChange={e => { setCustomDateStart(e.target.value); setChartRange(0); }}
                                                            className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[11px] text-gray-700 dark:text-gray-300 font-medium"
                                                        />
                                                        <span className="text-[11px] text-gray-400">~</span>
                                                        <input
                                                            type="date"
                                                            value={customDateEnd}
                                                            onChange={e => { setCustomDateEnd(e.target.value); setChartRange(0); }}
                                                            className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[11px] text-gray-700 dark:text-gray-300 font-medium"
                                                        />
                                                        {(customDateStart || customDateEnd) && (
                                                            <button
                                                                onClick={() => { setCustomDateStart(''); setCustomDateEnd(''); setChartRange(14); }}
                                                                className="px-2 py-1 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 text-[10px] font-bold hover:bg-red-100 transition-all"
                                                            >{t('statsPage.reset', '초기화')}</button>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-0 ml-auto bg-white dark:bg-gray-800 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-sm overflow-hidden">
                                                    <button
                                                        onClick={() => { setCustomDateStart(''); setCustomDateEnd(''); setChartOffset(p => p + 1); }}
                                                        className="w-8 h-8 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 active:bg-emerald-100 transition-colors border-r border-emerald-200 dark:border-emerald-700"
                                                        title={t('statsPage.prevPeriod', '이전 기간')}
                                                    ><ChevronDown size={14} className="rotate-90" /></button>
                                                    <button
                                                        onClick={() => setChartOffset(p => Math.max(0, p - 1))}
                                                        disabled={chartOffset === 0}
                                                        className={`w-8 h-8 flex items-center justify-center transition-colors border-r border-emerald-200 dark:border-emerald-700 ${chartOffset > 0 ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 active:bg-emerald-100' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                                                        title={t('statsPage.nextPeriod', '다음 기간')}
                                                    ><ChevronDown size={14} className="-rotate-90" /></button>
                                                    <button
                                                        onClick={() => setChartOffset(0)}
                                                        disabled={chartOffset === 0}
                                                        className={`px-3 h-8 text-[10px] font-bold transition-colors ${chartOffset > 0 ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 active:bg-emerald-100' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                                                    >{t('statsPage.latest', '최근')}</button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Chart Date Range Label */}
                                        {activeTab === 'sales' && chartData.length > 0 && (
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 font-medium">
                                                {salesView === 'daily' && `${chartData[0]?.label} ~ ${chartData[chartData.length - 1]?.label}`}
                                                {salesView === 'monthly' && `${chartData[0]?.label?.slice(0, 7)} ~ ${chartData[chartData.length - 1]?.label?.slice(0, 7)}`}
                                                {salesView === 'annual' && `${chartData[0]?.label?.slice(0, 4)} ~ ${chartData[chartData.length - 1]?.label?.slice(0, 4)}`}
                                                {chartOffset > 0 && <span className="ml-1 text-amber-500">({t('statsPage.pastData', '과거 데이터')})</span>}
                                            </p>
                                        )}

                                        {(chartViewMode === 'chart' || chartViewMode === 'both') && (
                                            <div className="overflow-x-auto" style={{ touchAction: 'pan-x' }}>
                                                <div className="flex items-end gap-1.5" style={{ height: `${CHART_HEIGHT_PX}px`, minWidth: `${Math.max(chartData.length * 42, 300)}px` }}>
                                                    {chartData.map((d, idx) => {
                                                        const pct = maxChartVal > 0 ? (d.revenue / maxChartVal) : 0;
                                                        const hasData = d.revenue > 0;
                                                        const barH = hasData ? Math.max(pct * (CHART_HEIGHT_PX - 30), 6) : 6;
                                                        return (
                                                            <div key={idx} className="flex flex-col items-center group" style={{ height: '100%', justifyContent: 'flex-end', minWidth: '36px', flex: '1 0 36px' }}>
                                                                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                    {formatRevenue(d.revenue)}
                                                                </span>
                                                                <div
                                                                    className={`w-full max-w-[32px] rounded-t-md transition-all duration-500 cursor-pointer
                                                                    ${hasData
                                                                            ? 'bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-300 shadow-sm'
                                                                            : 'bg-gray-200 dark:bg-gray-700'}`}
                                                                    style={{ height: `${barH}px` }}
                                                                />
                                                                <span className="text-[9px] text-gray-400 dark:text-gray-500 mt-1 whitespace-nowrap text-center font-medium">
                                                                    {salesView === 'daily' ? d.label.slice(5) : salesView === 'annual' ? d.label?.slice(0, 4) : d.label.slice(5) + t('statsPage.chartMonthSuffix')}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Analysis Data Table */}
                                        {(chartViewMode === 'table' || chartViewMode === 'both') && chartData.length > 0 && (() => {
                                            const totalRev = chartData.reduce((s, d) => s + d.revenue, 0);
                                            const avgRev = chartData.length > 0 ? Math.round(totalRev / chartData.length) : 0;
                                            const maxRev = Math.max(...chartData.map(d => d.revenue));
                                            const minRev = Math.min(...chartData.map(d => d.revenue));
                                            const nonZero = chartData.filter(d => d.revenue > 0);
                                            const sortedData = [...chartData].sort((a, b) => {
                                                const av = trendSortField === 'label' ? a.label : a.revenue;
                                                const bv = trendSortField === 'label' ? b.label : b.revenue;
                                                if (av < bv) return trendSortDir === 'asc' ? -1 : 1;
                                                if (av > bv) return trendSortDir === 'asc' ? 1 : -1;
                                                return 0;
                                            });
                                            const toggleTrendSort = (f) => {
                                                if (trendSortField === f) setTrendSortDir(d => d === 'asc' ? 'desc' : 'asc');
                                                else { setTrendSortField(f); setTrendSortDir('asc'); }
                                            };
                                            return (
                                                <div className="mt-3">
                                                    {/* Summary Cards */}
                                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                                        <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-2 text-center">
                                                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{t('statsPage.total', '합계')}</p>
                                                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">{formatRevenue(totalRev)}</p>
                                                        </div>
                                                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2 text-center">
                                                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">{t('statsPage.trendAvg', '평균')}</p>
                                                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">{formatRevenue(avgRev)}</p>
                                                        </div>
                                                        <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-2 text-center">
                                                            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{t('statsPage.trendMax', '최대')}</p>
                                                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">{formatRevenue(maxRev)}</p>
                                                        </div>
                                                        <div className="bg-violet-50 dark:bg-violet-900/30 rounded-lg p-2 text-center">
                                                            <p className="text-[10px] text-violet-600 dark:text-violet-400 font-bold">{t('statsPage.dataCount', '데이터 수')}</p>
                                                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">{nonZero.length}/{chartData.length}</p>
                                                        </div>
                                                    </div>
                                                    {/* Sortable Data Table */}
                                                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                                                        <table className="w-full text-[11px]">
                                                            <thead>
                                                                <tr className="bg-gray-50 dark:bg-gray-700/50">
                                                                    <th className="px-3 py-2 text-left font-bold text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 select-none" onClick={() => toggleTrendSort('label')}>
                                                                        {t('statsPage.dateLabel', '날짜')} {trendSortField === 'label' && (trendSortDir === 'asc' ? '↑' : '↓')}
                                                                    </th>
                                                                    <th className="px-3 py-2 text-right font-bold text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 select-none" onClick={() => toggleTrendSort('revenue')}>
                                                                        {t('statsPage.salesLabel', '매출')} {trendSortField === 'revenue' && (trendSortDir === 'asc' ? '↑' : '↓')}
                                                                    </th>
                                                                    <th className="px-3 py-2 text-right font-bold text-gray-500 dark:text-gray-400">{t('statsPage.share', '비중')}</th>
                                                                    <th className="px-3 py-2 text-right font-bold text-gray-500 dark:text-gray-400">{t('statsPage.vsAvg', '평균 대비')}</th>
                                                                    <th className="px-3 py-2 text-right font-bold text-gray-500 dark:text-gray-400">{t('statsPage.vsPrev', '전일 대비')}</th>
                                                                    <th className="px-3 py-2 text-right font-bold text-gray-500 dark:text-gray-400">{t('statsPage.cumulative', '누적 매출')}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                                {(() => {
                                                                    let cumulative = 0;
                                                                    // Build a date-sorted copy for prev-day lookup
                                                                    const dateSorted = [...chartData].sort((a, b) => a.label.localeCompare(b.label));
                                                                    const prevMap = {};
                                                                    dateSorted.forEach((d, i) => {
                                                                        prevMap[d.label] = i > 0 ? dateSorted[i - 1].revenue : null;
                                                                    });
                                                                    return sortedData.map((d, i) => {
                                                                        cumulative += d.revenue;
                                                                        const share = totalRev > 0 ? ((d.revenue / totalRev) * 100).toFixed(1) : '0.0';
                                                                        const vsAvg = avgRev > 0 ? (((d.revenue - avgRev) / avgRev) * 100).toFixed(0) : '0';
                                                                        const isMax = d.revenue === maxRev && d.revenue > 0;
                                                                        const prevRev = prevMap[d.label];
                                                                        const vsPrev = prevRev != null && prevRev > 0 ? (((d.revenue - prevRev) / prevRev) * 100).toFixed(0) : null;
                                                                        return (
                                                                            <tr key={i} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${isMax ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                                                                                <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                                                                                    {salesView === 'daily' ? d.label : salesView === 'annual' ? d.label?.slice(0, 4) + '년' : d.label?.slice(0, 7)}
                                                                                </td>
                                                                                <td className="px-3 py-2 text-right font-bold text-gray-900 dark:text-white">
                                                                                    {d.revenue > 0 ? formatRevenue(d.revenue) : '-'}
                                                                                    {isMax && <span className="ml-1 text-[9px] text-emerald-500">★</span>}
                                                                                </td>
                                                                                <td className="px-3 py-2 text-right text-gray-500 dark:text-gray-400">
                                                                                    <div className="flex items-center justify-end gap-1">
                                                                                        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                                                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(parseFloat(share), 100)}%` }} />
                                                                                        </div>
                                                                                        <span>{share}%</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className={`px-3 py-2 text-right font-bold ${parseInt(vsAvg) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                                                                                    {d.revenue > 0 ? `${parseInt(vsAvg) >= 0 ? '+' : ''}${vsAvg}%` : '-'}
                                                                                </td>
                                                                                <td className={`px-3 py-2 text-right font-bold ${vsPrev != null ? (parseInt(vsPrev) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-500') : 'text-gray-400'}`}>
                                                                                    {vsPrev != null ? `${parseInt(vsPrev) >= 0 ? '+' : ''}${vsPrev}%` : '-'}
                                                                                </td>
                                                                                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-300 font-medium">
                                                                                    {cumulative > 0 ? formatRevenue(cumulative) : '-'}
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    });
                                                                })()}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Empty state for filtered range */}
                                        {chartData.length === 0 && activeTab === 'sales' && (
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                                                <BarChart3 size={32} className="mb-2 opacity-30" />
                                                <p className="text-xs font-medium">{t('statsPage.noDataPeriod', '이 기간에 데이터가 없습니다')}</p>
                                                <button onClick={() => setChartOffset(0)} className="mt-2 text-[11px] font-bold text-emerald-500 hover:text-emerald-600">{t('statsPage.goToLatest', '최근으로 이동')} →</button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Show chart placeholder when no data at all */}
                                {chartData.length === 0 && filteredStats.length > 0 && activeTab === 'daily' && (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                        <div className="flex items-center gap-2 mb-2.5">
                                            <BarChart3 size={18} className="text-emerald-600 dark:text-emerald-400" />
                                            <h3 className="font-extrabold text-gray-900 dark:text-gray-100">{t('statsPage.salesTrend', { period: periodLabel(activeTab) })}</h3>
                                        </div>
                                        {/* Period Filter */}
                                        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                                            <div className="flex gap-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
                                                {[{ days: 7, label: t('statsPage.days7', '7일') }, { days: 14, label: t('statsPage.days14', '14일') }, { days: 30, label: t('statsPage.month1', '1개월') }].map(opt => (
                                                    <button key={opt.days}
                                                        onClick={() => { setChartRange(opt.days); setChartOffset(0); }}
                                                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${chartRange === opt.days
                                                            ? 'bg-emerald-500 text-white shadow-sm'
                                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-1 ml-auto">
                                                <button onClick={() => setChartOffset(p => p + 1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-bold transition-all"
                                                >◀</button>
                                                {chartOffset > 0 && (
                                                    <button onClick={() => setChartOffset(0)}
                                                        className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold"
                                                    >{t('statsPage.latest', '최근')}</button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                                            <BarChart3 size={32} className="mb-2 opacity-30" />
                                            <p className="text-xs font-medium">{t('statsPage.noDataPeriod', '이 기간에 데이터가 없습니다')}</p>
                                            <button onClick={() => setChartOffset(0)} className="mt-2 text-[11px] font-bold text-emerald-500 hover:text-emerald-600">{t('statsPage.goToLatest', '최근으로 이동')} →</button>
                                        </div>
                                    </div>
                                )}

                                {/* Add Button for this period — Compact */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleOpenForm(null, activeTab)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-95 transition-all"
                                    >
                                        <Plus size={14} />
                                        {t('statsPage.addPeriodData', { period: periodLabel(activeTab) })}
                                    </button>
                                </div>

                                {/* Records List */}
                                {filteredStats.length === 0 ? (
                                    <EmptyPrompt onAdd={() => handleOpenForm(null, activeTab)} />
                                ) : (() => {
                                    // Filter by date range if set
                                    const dateFiltered = filteredStats.filter(r => {
                                        if (!salesDateStart && !salesDateEnd) return true;
                                        const d = r.record_date || '';
                                        if (salesDateStart && d < salesDateStart) return false;
                                        if (salesDateEnd && d > salesDateEnd) return false;
                                        return true;
                                    });
                                    // Sort records
                                    const sorted = [...dateFiltered].sort((a, b) => {
                                        let av, bv;
                                        if (sortField === 'record_date') { av = a.record_date || ''; bv = b.record_date || ''; }
                                        else if (sortField === 'monthly_revenue') { av = parseInt(a.monthly_revenue) || 0; bv = parseInt(b.monthly_revenue) || 0; }
                                        else if (sortField === 'customer_count') { av = parseInt(a.customer_count) || 0; bv = parseInt(b.customer_count) || 0; }
                                        else if (sortField === 'transaction_count') { av = parseInt(a.transaction_count) || 0; bv = parseInt(b.transaction_count) || 0; }
                                        else { av = a.record_date || ''; bv = b.record_date || ''; }
                                        if (av < bv) return sortDir === 'asc' ? -1 : 1;
                                        if (av > bv) return sortDir === 'asc' ? 1 : -1;
                                        return 0;
                                    });
                                    const totalPages = Math.ceil(sorted.length / RECORDS_PER_PAGE);
                                    const safePage = Math.min(recordsPage, totalPages);
                                    const pageRecords = sorted.slice((safePage - 1) * RECORDS_PER_PAGE, safePage * RECORDS_PER_PAGE);
                                    const allOnPage = pageRecords.every(r => selectedIds.has(r.id));
                                    const toggleSort = (field) => {
                                        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                                        else { setSortField(field); setSortDir('desc'); }
                                        setRecordsPage(1);
                                    };
                                    const toggleSelectAll = () => {
                                        const next = new Set(selectedIds);
                                        if (allOnPage) pageRecords.forEach(r => next.delete(r.id));
                                        else pageRecords.forEach(r => next.add(r.id));
                                        setSelectedIds(next);
                                    };
                                    const toggleOne = (id) => {
                                        const next = new Set(selectedIds);
                                        if (next.has(id)) next.delete(id); else next.add(id);
                                        setSelectedIds(next);
                                    };
                                    return (
                                        <div className="space-y-2">
                                            {/* Sort Bar */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">{t('statsPage.sortLabel', '정렬')}:</span>
                                                {[
                                                    { key: 'record_date', label: t('statsPage.dateLabel', '날짜') },
                                                    { key: 'monthly_revenue', label: t('statsPage.salesLabel', '매출') },
                                                    { key: 'customer_count', label: t('statsPage.customersLabel', '고객수') },
                                                    { key: 'transaction_count', label: t('statsPage.transactionsLabel', '거래수') },
                                                ].map(s => (
                                                    <button key={s.key} onClick={() => toggleSort(s.key)}
                                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${sortField === s.key
                                                            ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                                    >
                                                        {s.label} {sortField === s.key && (sortDir === 'asc' ? '↑' : '↓')}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => setShowSalesDatePicker(v => !v)}
                                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${showSalesDatePicker || salesDateStart || salesDateEnd ? 'bg-indigo-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                                >
                                                    📅 {t('statsPage.dateRange', '기간')}
                                                </button>
                                                <span className="ml-auto text-[11px] text-gray-400 dark:text-gray-500 font-medium">{t('statsPage.totalCount', '총')} {sorted.length}</span>
                                            </div>
                                            {showSalesDatePicker && (
                                                <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl px-3 py-2 border border-indigo-200 dark:border-indigo-700">
                                                    <span className="text-[10px] font-bold text-indigo-500">📅</span>
                                                    <input type="date" value={salesDateStart} onChange={e => { setSalesDateStart(e.target.value); setRecordsPage(1); }}
                                                        className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 w-[130px]" />
                                                    <span className="text-xs text-gray-400">~</span>
                                                    <input type="date" value={salesDateEnd} onChange={e => { setSalesDateEnd(e.target.value); setRecordsPage(1); }}
                                                        className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 w-[130px]" />
                                                    {(salesDateStart || salesDateEnd) && (
                                                        <button onClick={() => { setSalesDateStart(''); setSalesDateEnd(''); setRecordsPage(1); }}
                                                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-500 transition-all">
                                                            {t('statsPage.resetFilter', '초기화')}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Bulk Action Bar */}
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 flex-wrap">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={allOnPage && pageRecords.length > 0} onChange={toggleSelectAll}
                                                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">{t('statsPage.selectAll', '전체선택')}</span>
                                                </label>
                                                {/* Select ALL data (all pages) */}
                                                {sorted.length > RECORDS_PER_PAGE && (
                                                    <button
                                                        onClick={() => {
                                                            const allIds = new Set(sorted.map(r => r.id));
                                                            setSelectedIds(allIds);
                                                        }}
                                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${selectedIds.size === sorted.length
                                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400'
                                                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300'}`}
                                                    >
                                                        📋 {t('statsPage.selectAllPages', `전체 ${sorted.length}개 모두 선택`)}
                                                    </button>
                                                )}
                                                {selectedIds.size > 0 && (
                                                    <>
                                                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{selectedIds.size}{t('statsPage.selected', '개 선택됨')}</span>
                                                        <button onClick={handleBulkDelete}
                                                            className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors shadow-sm">
                                                            <Trash2 size={12} /> {t('statsPage.deleteSelected', '선택 삭제')}
                                                        </button>
                                                        <button onClick={() => setSelectedIds(new Set())}
                                                            className="px-2.5 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-[11px] font-bold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                                            {t('statsPage.deselectAll', '선택해제')}
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            {/* Record Cards */}
                                            {pageRecords.map(record => (
                                                <RecordCard
                                                    key={record.id}
                                                    record={record}
                                                    formatRevenue={formatRevenue}
                                                    formatDateLabel={formatDateLabel}
                                                    translateDbValue={translateDbValue}
                                                    onEdit={() => handleOpenForm(record)}
                                                    onDelete={() => handleDelete(record)}
                                                    checked={selectedIds.has(record.id)}
                                                    onCheck={() => toggleOne(record.id)}
                                                />
                                            ))}

                                            {/* Pagination */}
                                            {totalPages > 1 && (
                                                <div className="flex items-center justify-center gap-1 pt-2">
                                                    <button onClick={() => setRecordsPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-bold transition-all">◀</button>
                                                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                                        let page;
                                                        if (totalPages <= 7) page = i + 1;
                                                        else if (safePage <= 4) page = i + 1;
                                                        else if (safePage >= totalPages - 3) page = totalPages - 6 + i;
                                                        else page = safePage - 3 + i;
                                                        return (
                                                            <button key={page} onClick={() => setRecordsPage(page)}
                                                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${page === safePage
                                                                    ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                                            >{page}</button>
                                                        );
                                                    })}
                                                    <button onClick={() => setRecordsPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-bold transition-all">▶</button>
                                                    <span className="ml-2 text-[10px] text-gray-400 font-medium">{safePage}/{totalPages}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )
                    }

                    {/* ════ UPLOAD TAB ════ */}
                    {
                        activeTab === 'upload' && (
                            <div className="space-y-3">
                                {/* Step: File Select */}
                                {uploadStep === 'select' && (
                                    <>
                                        {/* Upload Type Selection Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            {/* Sales Upload Card */}
                                            <div
                                                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                                                    ${dragOver && uploadDataType === 'sales' ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/30 scale-[1.01]' : 'border-emerald-200 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-900/10 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20'}`}
                                                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setUploadDataType('sales'); setDragOver(true); }}
                                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
                                                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget)) setDragOver(false); }}
                                                onDrop={(e) => {
                                                    e.preventDefault(); e.stopPropagation(); setDragOver(false);
                                                    setUploadDataType('sales');
                                                    const files = e.dataTransfer?.files;
                                                    if (files && files.length > 0) handleFileParse(files[0]);
                                                }}
                                                onClick={() => { setUploadDataType('sales'); fileInputRef.current?.click(); }}
                                            >
                                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-3 flex items-center justify-center pointer-events-none">
                                                    <TrendingUp className="text-white" size={24} />
                                                </div>
                                                <h3 className="font-extrabold text-gray-800 dark:text-white text-base mb-1 pointer-events-none">
                                                    💰 {t('statsPage.uploadSalesTitle', '매출 데이터 업로드')}
                                                </h3>
                                                <p className="text-xs text-gray-400 pointer-events-none">
                                                    {t('statsPage.uploadSalesDesc', '일간/월간/연간 매출 데이터를 업로드합니다')}
                                                </p>
                                                <p className="text-[10px] text-emerald-500 font-bold mt-2 pointer-events-none">Excel (.xlsx, .xls) / CSV</p>
                                            </div>

                                            {/* Expense Upload Card */}
                                            <div
                                                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                                                    ${dragOver && uploadDataType === 'expense' ? 'border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-900/30 scale-[1.01]' : 'border-violet-200 dark:border-violet-700 bg-violet-50/30 dark:bg-violet-900/10 hover:border-violet-400 hover:bg-violet-50 dark:hover:border-violet-500 dark:hover:bg-violet-900/20'}`}
                                                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setUploadDataType('expense'); setDragOver(true); }}
                                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
                                                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget)) setDragOver(false); }}
                                                onDrop={(e) => {
                                                    e.preventDefault(); e.stopPropagation(); setDragOver(false);
                                                    setUploadDataType('expense');
                                                    const files = e.dataTransfer?.files;
                                                    if (files && files.length > 0) handleFileParse(files[0]);
                                                }}
                                                onClick={() => { setUploadDataType('expense'); fileInputRef.current?.click(); }}
                                            >
                                                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mx-auto mb-3 flex items-center justify-center pointer-events-none">
                                                    <Wallet className="text-white" size={24} />
                                                </div>
                                                <h3 className="font-extrabold text-gray-800 dark:text-white text-base mb-1 pointer-events-none">
                                                    💸 {t('statsPage.uploadExpenseTitle', '지출 데이터 업로드')}
                                                </h3>
                                                <p className="text-xs text-gray-400 pointer-events-none">
                                                    {t('statsPage.uploadExpenseDesc', '지출/경비 데이터를 업로드합니다')}
                                                </p>
                                                <p className="text-[10px] text-violet-500 font-bold mt-2 pointer-events-none">Excel (.xlsx, .xls) / CSV</p>
                                            </div>
                                        </div>

                                        {/* Hidden file input (shared) */}
                                        <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    console.log('[Upload] File selected:', file.name, file.size);
                                                    handleFileParse(file);
                                                }
                                                e.target.value = '';
                                            }} />


                                        {/* ERP Template Selector — 숨김 처리 */}
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4" style={{ display: 'none' }}>
                                            <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-2.5">
                                                <Download size={16} className="text-emerald-600" />
                                                {t('statsPage.uploadErpTitle', 'ERP / 마켓플레이스 템플릿')}
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-3">
                                                {t('statsPage.uploadErpDesc', '사용 중인 ERP를 선택하면 컬럼이 자동 매핑됩니다.')}
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                {Object.entries(erpTemplates).map(([key, tmpl]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => setSelectedTemplate(key)}
                                                        className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${selectedTemplate === key
                                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                                                            }`}
                                                    >
                                                        {(i18n.language === 'ko' ? tmpl.name_ko : tmpl.name) || tmpl.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Import History */}
                                        {importHistory.length > 0 && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                                <div className="flex items-center justify-between mb-2.5">
                                                    <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                                                        <Clock size={16} className="text-emerald-600 dark:text-emerald-400" />
                                                        {t('statsPage.uploadHistoryTitle', '임포트 이력')}
                                                    </h3>
                                                    {selectedBatchIds.size > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{selectedBatchIds.size}{t('statsPage.selected', '개 선택됨')}</span>
                                                            <button onClick={handleBulkUndoBatches}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors shadow-sm">
                                                                <Trash2 size={12} /> {t('statsPage.deleteSelected', '선택 삭제')}
                                                            </button>
                                                            <button onClick={() => setSelectedBatchIds(new Set())}
                                                                className="px-2.5 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-[11px] font-bold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                                                {t('statsPage.deselectAll', '해제')}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Select All */}
                                                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                                    <input type="checkbox"
                                                        checked={importHistory.length > 0 && importHistory.every(b => selectedBatchIds.has(b.import_batch_id))}
                                                        onChange={() => {
                                                            const allSelected = importHistory.every(b => selectedBatchIds.has(b.import_batch_id));
                                                            if (allSelected) setSelectedBatchIds(new Set());
                                                            else setSelectedBatchIds(new Set(importHistory.map(b => b.import_batch_id)));
                                                        }}
                                                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">{t('statsPage.selectAll', '전체선택')}</span>
                                                </label>
                                                <div className="space-y-2">
                                                    {importHistory.map((batch, idx) => {
                                                        const isChecked = selectedBatchIds.has(batch.import_batch_id);
                                                        const toggleBatch = () => {
                                                            const next = new Set(selectedBatchIds);
                                                            if (isChecked) next.delete(batch.import_batch_id); else next.add(batch.import_batch_id);
                                                            setSelectedBatchIds(next);
                                                        };
                                                        return (
                                                            <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isChecked ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                                                                <input type="checkbox" checked={isChecked} onChange={toggleBatch}
                                                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 flex-shrink-0 cursor-pointer" />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                                                                            {batch.sales_channel || batch.source || 'Excel'}
                                                                        </span>
                                                                        <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold">
                                                                            {batch.record_count}{t('statsPage.units', '건')}
                                                                        </span>
                                                                        <span className="text-[10px] text-gray-400 dark:text-gray-500">{batch.currency}</span>
                                                                    </div>
                                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                                                        {batch.date_from} ~ {batch.date_to} · {new Date(batch.imported_at).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => undoBatch(batch.import_batch_id)}
                                                                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors"
                                                                    title={t('statsPage.uploadUndo', '취소')}
                                                                >
                                                                    <RotateCcw size={14} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Step: Sheet Select (multi-sheet Excel) */}
                                {uploadStep === 'sheet_select' && sheetInfo.length > 1 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                                                <FileText size={16} className="text-emerald-600" />
                                                {t('statsPage.sheetSelectTitle', '시트 선택')}
                                            </h3>
                                            <button onClick={resetUpload} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                                                <X size={12} /> {t('statsPage.cancel')}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                            {t('statsPage.sheetSelectDesc', '이 엑셀 파일에 여러 시트가 감지되었습니다. 임포트할 시트를 선택하세요.')}
                                        </p>

                                        {/* Merge all sheets button */}
                                        <button
                                            onClick={() => selectSheet('all')}
                                            className="w-full mb-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Layers size={16} />
                                            {t('statsPage.sheetMergeAll', `전체 시트 병합 (${sheetInfo.reduce((s, si) => s + si.rowCount, 0)}행)`)}
                                        </button>

                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mb-3">
                                            {t('statsPage.sheetOrSelect', '── 또는 개별 시트 선택 ──')}
                                        </p>

                                        {/* Individual sheet buttons */}
                                        <div className="space-y-2">
                                            {sheetInfo.map((si, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => selectSheet(si.name)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-left flex items-center gap-3"
                                                >
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{si.name}</p>
                                                        <p className="text-[10px] text-gray-400">{si.rowCount}{t('statsPage.uploadRows', '행 감지')}</p>
                                                    </div>
                                                    <ChevronRight size={16} className="text-gray-300" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step: Column Mapping */}
                                {uploadStep === 'mapping' && (
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                            <div className="flex items-center justify-between mb-2.5">
                                                <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                                                    <FileText size={16} className="text-emerald-600" />
                                                    {t('statsPage.uploadMappingTitle', '컬럼 매핑')}
                                                </h3>
                                                <button onClick={resetUpload} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                                                    <X size={12} /> {t('statsPage.cancel')}
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2.5">
                                                {t('statsPage.uploadMappingDesc', '파일: ')}{uploadFile?.name} — {parsedRows.length}{t('statsPage.uploadRows', '행 감지')}
                                            </p>

                                            {/* Data Type Detection Badge + Toggle */}
                                            <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-50 border border-gray-100">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">{t('statsPage.uploadDetectedType', '감지된 데이터 유형')}:</span>
                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={() => {
                                                            setUploadDataType('sales');
                                                            autoMapColumns(parsedHeaders);
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${uploadDataType === 'sales'
                                                            ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-emerald-300'}`}
                                                    >
                                                        <TrendingUp size={12} /> {t('statsPage.uploadTypeSales', '📊 매출 데이터')}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUploadDataType('expense');
                                                            setColumnMapping(autoMapExpenseColumnsUpload(parsedHeaders));
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${uploadDataType === 'expense'
                                                            ? 'bg-violet-500 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-violet-300'}`}
                                                    >
                                                        <Wallet size={12} /> {t('statsPage.uploadTypeExpense', '💸 지출 데이터')}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Upload settings (sales only) */}
                                            {uploadDataType === 'sales' && (
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2.5">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                                            {t('statsPage.uploadRecordType', '기록 유형')}
                                                        </label>
                                                        <select value={uploadRecordType} onChange={(e) => setUploadRecordType(e.target.value)}
                                                            className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-medium">
                                                            <option value="daily">{t('statsPage.tabDaily')}</option>
                                                            <option value="monthly">{t('statsPage.tabMonthly')}</option>
                                                            <option value="annual">{t('statsPage.tabAnnual')}</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                                            {t('statsPage.uploadCurrency', '통화')}
                                                        </label>
                                                        <select value={uploadCurrency} onChange={(e) => setUploadCurrency(e.target.value)}
                                                            className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-medium">
                                                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                                            {t('statsPage.uploadChannel', '판매 채널')}
                                                        </label>
                                                        <input type="text" value={uploadChannel}
                                                            onChange={(e) => setUploadChannel(e.target.value)}
                                                            placeholder={t('statsPage.uploadChannelPh', '예: 네이버 스마트스토어')}
                                                            className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-medium" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                                            {t('statsPage.uploadDuplicateMode', '중복 처리')}
                                                        </label>
                                                        <select value={uploadDuplicateMode} onChange={(e) => setUploadDuplicateMode(e.target.value)}
                                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 text-xs font-medium">
                                                            <option value="overwrite">{t('statsPage.duplicateOverwrite', '덮어쓰기')}</option>
                                                            <option value="skip">{t('statsPage.duplicateSkip', '건너뛰기')}</option>
                                                            <option value="append">{t('statsPage.duplicateAppend', '추가')}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Column mapping table */}
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs">
                                                    <thead>
                                                        <tr className="border-b border-gray-100">
                                                            <th className="text-left py-2 pr-3 text-gray-500 font-bold">{t('statsPage.uploadFileCol', '파일 컬럼')}</th>
                                                            <th className="text-left py-2 pr-3 text-gray-500 font-bold">{t('statsPage.uploadSample', '데이터 샘플')}</th>
                                                            <th className="text-left py-2 text-gray-500 font-bold">{t('statsPage.uploadMapTo', '매핑 대상')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {parsedHeaders.map((header, idx) => (
                                                            <tr key={idx} className="border-b border-gray-50">
                                                                <td className="py-2 pr-3 font-bold text-gray-900">{header}</td>
                                                                <td className="py-2 pr-3 text-gray-400 truncate max-w-[150px]">
                                                                    {parsedRows[0]?.[idx] instanceof Date
                                                                        ? parsedRows[0][idx].toISOString().slice(0, 10)
                                                                        : String(parsedRows[0]?.[idx] ?? '').slice(0, 30)}
                                                                </td>
                                                                <td className="py-2">
                                                                    <select
                                                                        value={columnMapping[idx] || ''}
                                                                        onChange={(e) => setColumnMapping(prev => ({ ...prev, [idx]: e.target.value }))}
                                                                        className={`w-full px-2 py-1.5 rounded-lg border text-xs font-medium ${columnMapping[idx] ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                                            : 'bg-gray-50 border-gray-200 text-gray-500'
                                                                            }`}
                                                                    >
                                                                        {(uploadDataType === 'expense' ? UPLOAD_EXPENSE_FIELDS : SYSTEM_FIELDS).map(f => (
                                                                            <option key={f.key} value={f.key}>{f.label}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Preview & Actions */}
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                            <h3 className="font-extrabold text-gray-900 text-sm mb-3">
                                                {t('statsPage.uploadPreview', '미리보기')} ({Math.min(parsedRows.length, 5)}/{parsedRows.length}{t('statsPage.uploadRows', '행')})
                                            </h3>
                                            <div className="overflow-x-auto mb-2.5">
                                                <table className="w-full text-[11px]">
                                                    <thead>
                                                        <tr className="bg-gray-50">
                                                            {Object.entries(columnMapping).filter(([, v]) => v).map(([idx, field]) => (
                                                                <th key={idx} className="text-left py-1.5 px-2 font-bold text-emerald-700">
                                                                    {SYSTEM_FIELDS.find(f => f.key === field)?.label || field}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {parsedRows.slice(0, 5).map((row, ri) => (
                                                            <tr key={ri} className="border-b border-gray-50">
                                                                {Object.entries(columnMapping).filter(([, v]) => v).map(([idx]) => (
                                                                    <td key={idx} className="py-1.5 px-2 text-gray-700">
                                                                        {row[parseInt(idx)] instanceof Date
                                                                            ? row[parseInt(idx)].toISOString().slice(0, 10)
                                                                            : String(row[parseInt(idx)] ?? '').slice(0, 40)}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={handleImport}
                                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                                                    <Upload size={16} />
                                                    {t('statsPage.uploadImportBtn', `${parsedRows.length}건 임포트`)}
                                                </button>
                                                <button onClick={resetUpload}
                                                    className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                                                    {t('statsPage.cancel')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step: Importing */}
                                {uploadStep === 'importing' && (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <Loader2 size={48} className="text-emerald-500 animate-spin mb-2.5" />
                                        <p className="font-bold text-gray-900">{t('statsPage.uploadImporting', '임포트 중...')}</p>
                                        <p className="text-sm text-gray-500 mt-1">{parsedRows.length}{t('statsPage.uploadImportingRows', '행 처리 중')}</p>
                                    </div>
                                )}

                                {/* Step: Done */}
                                {uploadStep === 'done' && importResult && (
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl mx-auto mb-2.5 flex items-center justify-center">
                                            <CheckCircle size={32} className="text-emerald-600" />
                                        </div>
                                        <h3 className="font-extrabold text-gray-900 text-lg mb-2">
                                            {t('statsPage.uploadDoneTitle', '임포트 완료!')}
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
                                            <div className="bg-emerald-50 rounded-xl p-3">
                                                <p className="text-lg font-extrabold text-emerald-600">{importResult.inserted}</p>
                                                <p className="text-[10px] text-emerald-700 font-bold">{t('statsPage.uploadDoneInserted', '성공')}</p>
                                            </div>
                                            <div className="bg-amber-50 rounded-xl p-3">
                                                <p className="text-lg font-extrabold text-amber-600">{importResult.skipped}</p>
                                                <p className="text-[10px] text-amber-700 font-bold">{t('statsPage.uploadDoneSkipped', '스킵')}</p>
                                            </div>
                                            <div className="bg-blue-50 rounded-xl p-3">
                                                <p className="text-lg font-extrabold text-blue-600">{importResult.total}</p>
                                                <p className="text-[10px] text-blue-700 font-bold">{t('statsPage.uploadDoneTotal', '전체')}</p>
                                            </div>
                                        </div>
                                        {importResult.errors?.length > 0 && (
                                            <div className="bg-red-50 rounded-xl p-3 mb-2.5 text-left max-w-sm mx-auto">
                                                <p className="text-xs font-bold text-red-600 mb-1">
                                                    <AlertCircle size={12} className="inline mr-1" />
                                                    {t('statsPage.uploadErrors', '에러')}
                                                </p>
                                                {importResult.errors.slice(0, 3).map((err, i) => (
                                                    <p key={i} className="text-[10px] text-red-500">Row {err.row}: {err.error}</p>
                                                ))}
                                            </div>
                                        )}
                                        <button onClick={resetUpload}
                                            className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors">
                                            {t('statsPage.uploadNewImport', '새로운 임포트')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ════ EXPENSE TAB ════ */}
                    {
                        activeTab === 'expense' && (
                            <div className="space-y-3">
                                {/* Period Filter Bar */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    {/* Year Navigation */}
                                    <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-2 py-1.5 shadow-sm">
                                        <button onClick={() => setExpenseYear(y => y - 1)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <ChevronDown size={12} className="rotate-90 text-gray-500" />
                                        </button>
                                        <span className="text-sm font-extrabold text-gray-900 dark:text-white min-w-[52px] text-center">{expenseYear}{t('statsPage.yearSuffix', '년')}</span>
                                        <button onClick={() => setExpenseYear(y => y + 1)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <ChevronDown size={12} className="-rotate-90 text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                {expenseLoading ? (
                                    <div className="flex justify-center py-16"><Loader2 size={32} className="text-violet-500 animate-spin" /></div>
                                ) : (
                                    <>
                                        {/* KPI Cards */}
                                        {expenseSummary && (
                                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                                {/* Total Revenue */}
                                                {(() => {
                                                    const yearStr = String(expenseYear);
                                                    const yearRevenue = allStats
                                                        .filter(s => {
                                                            const d = s.record_date || '';
                                                            return d.startsWith(yearStr);
                                                        })
                                                        .reduce((sum, s) => sum + (parseInt(s.monthly_revenue) || 0), 0);
                                                    const totalExpense = parseInt(expenseSummary.totals.total_expense || 0);
                                                    const netProfit = yearRevenue - totalExpense;
                                                    const profitRate = yearRevenue > 0 ? ((netProfit / yearRevenue) * 100).toFixed(1) : (totalExpense > 0 ? '-100' : '0');
                                                    return (
                                                        <>
                                                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white mb-2"><TrendingUp size={16} /></div>
                                                                <p className="text-lg font-extrabold text-emerald-600">{formatRevenue(yearRevenue)}</p>
                                                                <p className="text-[11px] text-gray-400 font-medium">{t('statsPage.expTotalRevenue', '총 매출')}</p>
                                                            </div>
                                                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                                                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-2"><Wallet size={16} /></div>
                                                                <p className="text-lg font-extrabold text-gray-900">{formatRevenue(totalExpense)}</p>
                                                                <p className="text-[11px] text-gray-400 font-medium">{t('statsPage.expTotalExpense', '총 지출')}</p>
                                                            </div>
                                                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mb-2"><Receipt size={16} /></div>
                                                                <p className="text-lg font-extrabold text-gray-900">{parseInt(expenseSummary.totals.total_count || 0).toLocaleString()}{t('statsPage.units', '건')}</p>
                                                                <p className="text-[11px] text-gray-400 font-medium">{t('statsPage.expTotalCount', '총 건수')}</p>
                                                            </div>
                                                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                                                <div className={`w-8 h-8 bg-gradient-to-br ${netProfit >= 0 ? 'from-emerald-500 to-teal-600' : 'from-red-500 to-rose-600'} rounded-lg flex items-center justify-center text-white mb-2`}><TrendingUp size={16} /></div>
                                                                <p className={`text-lg font-extrabold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{netProfit >= 0 ? '+' : ''}{formatRevenue(netProfit)}</p>
                                                                <p className="text-[11px] text-gray-400 font-medium">{t('statsPage.expNetProfit', '순이익')}</p>
                                                            </div>
                                                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                                                <div className={`w-8 h-8 bg-gradient-to-br ${netProfit >= 0 ? 'from-amber-500 to-orange-600' : 'from-red-500 to-rose-600'} rounded-lg flex items-center justify-center text-white mb-2`}><Target size={16} /></div>
                                                                <p className={`text-lg font-extrabold ${netProfit >= 0 ? 'text-amber-600' : 'text-red-600'}`}>{profitRate}%</p>
                                                                <p className="text-[11px] text-gray-400 font-medium">{t('statsPage.expProfitRate', '이익률')}</p>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        )}

                                        {/* Category Breakdown */}
                                        {expenseSummary?.categoryBreakdown?.length > 0 && (
                                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                                <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-2.5">
                                                    <PieChart size={16} className="text-violet-600" />
                                                    {t('statsPage.expByCategory', '카테고리별 지출')}
                                                </h3>
                                                <div className="space-y-2">
                                                    {expenseSummary.categoryBreakdown.map(cat => {
                                                        const meta = getExpenseCatMeta(cat.category);
                                                        const CatIcon = meta.icon;
                                                        const total = parseInt(expenseSummary.totals.total_expense || 1);
                                                        const pct = total > 0 ? ((parseInt(cat.total) / total) * 100).toFixed(1) : 0;
                                                        return (
                                                            <div key={cat.category} className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 bg-gradient-to-br ${meta.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                                                                    <CatIcon size={14} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="text-xs font-bold text-gray-900">{getExpenseCatLabel(cat.category)}</span>
                                                                        <span className="text-xs font-extrabold text-gray-700">{formatRevenue(cat.total)}</span>
                                                                    </div>
                                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                        <div className={`h-full bg-gradient-to-r ${meta.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                                                                    </div>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-gray-400 w-10 text-right">{pct}%</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* ═══ Expense Trend Chart (daily/monthly/annual) ═══ */}
                                        {expenses.length > 0 && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                                {/* Header: Title + View Mode Toggle */}
                                                <div className="flex items-center justify-between mb-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <BarChart3 size={16} className="text-violet-600" />
                                                        <h3 className="font-extrabold text-gray-900 dark:text-gray-100">
                                                            {expChartView === 'daily' ? t('statsPage.expDailyTrend', '일간 지출 추이')
                                                                : expChartView === 'monthly' ? t('statsPage.expMonthlyTrend', '월별 지출 추이')
                                                                    : t('statsPage.expAnnualTrend', '연간 지출 추이')}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {/* Chart Type Toggle */}
                                                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                                                            {[{ val: 'chart', icon: '📊' }, { val: 'table', icon: '📋' }, { val: 'both', icon: '📊📋' }].map(v => (
                                                                <button key={v.val} onClick={() => setExpChartMode(v.val)}
                                                                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${expChartMode === v.val ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                                                >{v.icon}</button>
                                                            ))}
                                                        </div>
                                                        {/* Daily/Monthly/Annual Toggle */}
                                                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                                                            {[
                                                                { key: 'daily', label: t('statsPage.tabDaily', '일간') },
                                                                { key: 'monthly', label: t('statsPage.tabMonthly', '월간') },
                                                                { key: 'annual', label: t('statsPage.tabAnnual', '연간') },
                                                            ].map(v => (
                                                                <button key={v.key} onClick={() => { setExpChartView(v.key); setExpChartOffset(0); setExpChartRange(v.key === 'daily' ? 14 : v.key === 'monthly' ? 6 : 3); }}
                                                                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${expChartView === v.key
                                                                        ? 'bg-violet-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                                                    {v.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Period Range Selector + Past Navigation */}
                                                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                                                    <div className="flex gap-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
                                                        {(expChartView === 'daily'
                                                            ? [{ val: 7, label: t('statsPage.days7', '7일') }, { val: 14, label: t('statsPage.days14', '14일') }, { val: 30, label: t('statsPage.month1', '1개월') }]
                                                            : expChartView === 'monthly'
                                                                ? [{ val: 3, label: t('statsPage.months3', '3개월') }, { val: 6, label: t('statsPage.months6', '6개월') }, { val: 12, label: t('statsPage.months12', '12개월') }, { val: 24, label: t('statsPage.months24', '24개월') }]
                                                                : [{ val: 1, label: t('statsPage.years1', '1년') }, { val: 3, label: t('statsPage.years3', '3년') }, { val: 5, label: t('statsPage.years5', '5년') }, { val: 10, label: t('statsPage.years10', '10년') }]
                                                        ).map(opt => (
                                                            <button key={opt.val}
                                                                onClick={() => { setExpChartRange(opt.val); setExpChartOffset(0); }}
                                                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${expChartRange === opt.val
                                                                    ? 'bg-violet-500 text-white shadow-sm'
                                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-0 ml-auto bg-white dark:bg-gray-800 rounded-xl border border-violet-200 dark:border-violet-700 shadow-sm overflow-hidden">
                                                        <button
                                                            onClick={() => setExpChartOffset(p => p + 1)}
                                                            className="w-8 h-8 flex items-center justify-center text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 active:bg-violet-100 transition-colors border-r border-violet-200 dark:border-violet-700"
                                                            title={t('statsPage.prevPeriod', '이전 기간')}
                                                        ><ChevronDown size={14} className="rotate-90" /></button>
                                                        <button
                                                            onClick={() => setExpChartOffset(p => Math.max(0, p - 1))}
                                                            disabled={expChartOffset === 0}
                                                            className={`w-8 h-8 flex items-center justify-center transition-colors border-r border-violet-200 dark:border-violet-700 ${expChartOffset > 0 ? 'text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 active:bg-violet-100' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                                                            title={t('statsPage.nextPeriod', '다음 기간')}
                                                        ><ChevronDown size={14} className="-rotate-90" /></button>
                                                        <button
                                                            onClick={() => setExpChartOffset(0)}
                                                            disabled={expChartOffset === 0}
                                                            className={`px-3 h-8 text-[10px] font-bold transition-colors ${expChartOffset > 0 ? 'text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 active:bg-violet-100' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                                                        >{t('statsPage.latest', '최근')}</button>
                                                    </div>
                                                </div>

                                                {(() => {
                                                    // Group expenses by view mode
                                                    let grouped = {};
                                                    expenses.forEach(exp => {
                                                        let key;
                                                        if (expChartView === 'daily') key = exp.expense_date;
                                                        else if (expChartView === 'monthly') key = exp.expense_date?.slice(0, 7);
                                                        else key = exp.expense_date?.slice(0, 4);
                                                        if (!key) return;
                                                        if (!grouped[key]) grouped[key] = { total: 0, count: 0 };
                                                        grouped[key].total += parseInt(exp.amount) || 0;
                                                        grouped[key].count += 1;
                                                    });

                                                    // Sort all keys
                                                    const allKeys = Object.keys(grouped).sort();

                                                    // Apply range and offset
                                                    let endIdx = allKeys.length - (expChartOffset * expChartRange);
                                                    let startIdx = Math.max(0, endIdx - expChartRange);
                                                    if (endIdx <= 0) { endIdx = Math.min(expChartRange, allKeys.length); startIdx = 0; }
                                                    const chartKeys = allKeys.slice(startIdx, endIdx);

                                                    const chartData = chartKeys.map(k => ({ key: k, ...grouped[k] }));
                                                    if (chartData.length === 0) return <p className="text-sm text-gray-400 text-center py-8">{t('statsPage.expNoData', '데이터 없음')}</p>;

                                                    const maxVal = Math.max(...chartData.map(d => d.total), 1);
                                                    const totalSum = chartData.reduce((s, d) => s + d.total, 0);
                                                    const avgVal = Math.round(totalSum / chartData.length);
                                                    const maxItem = chartData.reduce((a, b) => a.total > b.total ? a : b);
                                                    const totalCount = chartData.reduce((s, d) => s + d.count, 0);

                                                    const formatLabel = (key) => {
                                                        if (expChartView === 'daily') return key.slice(5);
                                                        if (expChartView === 'monthly') return key.slice(5) + '월';
                                                        return key + '년';
                                                    };

                                                    // Date range label
                                                    const rangeLabel = chartData.length > 0 ? `${chartData[0].key} ~ ${chartData[chartData.length - 1].key}` : '';

                                                    return (
                                                        <>
                                                            {/* Date Range Label */}
                                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 font-medium">
                                                                {rangeLabel}
                                                                {expChartOffset > 0 && <span className="ml-1 text-amber-500">({t('statsPage.pastData', '과거 데이터')})</span>}
                                                            </p>

                                                            {/* Bar Chart */}
                                                            {(expChartMode === 'chart' || expChartMode === 'both') && (
                                                                <div className="flex items-end gap-1.5 h-40 mb-3">
                                                                    {chartData.map((d, idx) => {
                                                                        const pct = (d.total / maxVal) * 100;
                                                                        return (
                                                                            <div key={idx} className="flex flex-col items-center flex-1 min-w-0 h-full group cursor-pointer">
                                                                                <span className="text-[8px] font-bold text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                                    {formatRevenue(d.total)}
                                                                                </span>
                                                                                <div className="flex-1 w-full flex items-end justify-center">
                                                                                    <div
                                                                                        className="w-full max-w-[36px] rounded-t-lg transition-all duration-500 hover:opacity-80 bg-gradient-to-t from-violet-500 to-purple-400"
                                                                                        style={{ height: `${Math.max(pct, 4)}%` }}
                                                                                    />
                                                                                </div>
                                                                                <span className="text-[8px] text-gray-400 mt-1 truncate w-full text-center font-medium">
                                                                                    {formatLabel(d.key)}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}

                                                            {/* Summary Cards */}
                                                            <div className="grid grid-cols-4 gap-2 mb-3">
                                                                <div className="bg-violet-50 rounded-xl p-2.5 text-center">
                                                                    <p className="text-[10px] font-bold text-violet-600">{t('statsPage.expTotalLabel', '합계')}</p>
                                                                    <p className="text-sm font-extrabold text-violet-700">{formatRevenue(totalSum)}</p>
                                                                </div>
                                                                <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                                                                    <p className="text-[10px] font-bold text-blue-600">{t('statsPage.expAvgLabel', '평균')}</p>
                                                                    <p className="text-sm font-extrabold text-blue-700">{formatRevenue(avgVal)}</p>
                                                                </div>
                                                                <div className="bg-red-50 rounded-xl p-2.5 text-center">
                                                                    <p className="text-[10px] font-bold text-red-600">{t('statsPage.expMaxLabel', '최고')}</p>
                                                                    <p className="text-sm font-extrabold text-red-700">{formatRevenue(maxItem.total)}</p>
                                                                </div>
                                                                <div className="bg-amber-50 rounded-xl p-2.5 text-center">
                                                                    <p className="text-[10px] font-bold text-amber-600">{t('statsPage.expCountLabel', '데이터 수')}</p>
                                                                    <p className="text-sm font-extrabold text-amber-700">{totalCount}{t('statsPage.units', '건')}</p>
                                                                </div>
                                                            </div>

                                                            {/* Data Table */}
                                                            {(expChartMode === 'table' || expChartMode === 'both') && (
                                                                <div className="overflow-x-auto">
                                                                    <table className="w-full text-xs">
                                                                        <thead>
                                                                            <tr className="border-b border-gray-200 dark:border-gray-600">
                                                                                <th className="text-left py-2 font-bold text-gray-500">{t('statsPage.expDate', '날짜')}</th>
                                                                                <th className="text-right py-2 font-bold text-gray-500">{t('statsPage.expAmount', '지출')}</th>
                                                                                <th className="text-right py-2 font-bold text-gray-500">{t('statsPage.expShare', '비중')}</th>
                                                                                <th className="text-right py-2 font-bold text-gray-500">{t('statsPage.expVsAvg', '평균 대비')}</th>
                                                                                <th className="text-right py-2 font-bold text-gray-500">{t('statsPage.expVsPrev', '전일 대비')}</th>
                                                                                <th className="text-right py-2 font-bold text-gray-500">{t('statsPage.expCumulative', '누적 지출')}</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {(() => {
                                                                                let cumulative = 0;
                                                                                return chartData.map((d, idx) => {
                                                                                    cumulative += d.total;
                                                                                    const share = totalSum > 0 ? ((d.total / totalSum) * 100).toFixed(1) : 0;
                                                                                    const vsAvg = avgVal > 0 ? (((d.total - avgVal) / avgVal) * 100).toFixed(0) : 0;
                                                                                    const prevTotal = idx > 0 ? chartData[idx - 1].total : null;
                                                                                    const vsPrev = prevTotal ? (((d.total - prevTotal) / prevTotal) * 100).toFixed(0) : null;
                                                                                    const isMax = d.total === maxItem.total;
                                                                                    return (
                                                                                        <tr key={idx} className={`border-b border-gray-50 dark:border-gray-700 ${isMax ? 'bg-violet-50/50' : ''}`}>
                                                                                            <td className="py-2 font-bold text-gray-900 dark:text-white">{d.key}</td>
                                                                                            <td className="py-2 text-right font-bold text-gray-900 dark:text-white">
                                                                                                {formatRevenue(d.total)}{isMax && ' ⭐'}
                                                                                            </td>
                                                                                            <td className="py-2 text-right">
                                                                                                <span className="inline-flex items-center gap-1">
                                                                                                    <span className="w-8 h-1.5 rounded-full bg-gray-200 inline-block relative overflow-hidden">
                                                                                                        <span className="absolute left-0 top-0 h-full bg-violet-500 rounded-full" style={{ width: `${share}%` }} />
                                                                                                    </span>
                                                                                                    <span className="text-gray-500 font-medium">{share}%</span>
                                                                                                </span>
                                                                                            </td>
                                                                                            <td className={`py-2 text-right font-bold ${Number(vsAvg) >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                                                                {Number(vsAvg) >= 0 ? '+' : ''}{vsAvg}%
                                                                                            </td>
                                                                                            <td className={`py-2 text-right font-bold ${vsPrev === null ? 'text-gray-300' : Number(vsPrev) >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                                                                {vsPrev === null ? '-' : `${Number(vsPrev) >= 0 ? '+' : ''}${vsPrev}%`}
                                                                                            </td>
                                                                                            <td className="py-2 text-right font-medium text-gray-500">{formatRevenue(cumulative)}</td>
                                                                                        </tr>
                                                                                    );
                                                                                });
                                                                            })()}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        )}


                                        {/* Expense List */}
                                        {expenses.length === 0 ? (
                                            <div className="text-center py-16">
                                                <Wallet className="mx-auto text-gray-300 mb-2.5" size={48} />
                                                <h3 className="text-lg font-bold text-gray-400">{t('statsPage.expNoData', '아직 지출 기록이 없습니다.')}</h3>
                                                <p className="text-sm text-gray-400 mt-1">{t('statsPage.expAddFirst', '첫 지출을 기록해보세요!')}</p>
                                            </div>
                                        ) : (() => {
                                            // Filter by date range if set
                                            const expDateFiltered = expenses.filter(e => {
                                                if (!expDateStart && !expDateEnd) return true;
                                                const d = e.expense_date || '';
                                                if (expDateStart && d < expDateStart) return false;
                                                if (expDateEnd && d > expDateEnd) return false;
                                                return true;
                                            });
                                            // Sort
                                            const sorted = [...expDateFiltered].sort((a, b) => {
                                                let av, bv;
                                                if (expSortField === 'expense_date') { av = a.expense_date || ''; bv = b.expense_date || ''; }
                                                else if (expSortField === 'amount') { av = parseInt(a.amount) || 0; bv = parseInt(b.amount) || 0; }
                                                else if (expSortField === 'category') { av = getExpenseCatLabel(a.category); bv = getExpenseCatLabel(b.category); }
                                                else if (expSortField === 'payment_method') {
                                                    const pmA = PAYMENT_METHODS.find(p => p.key === a.payment_method);
                                                    const pmB = PAYMENT_METHODS.find(p => p.key === b.payment_method);
                                                    av = pmA?.label || a.payment_method; bv = pmB?.label || b.payment_method;
                                                }
                                                else { av = a.expense_date || ''; bv = b.expense_date || ''; }
                                                if (av < bv) return expSortDir === 'asc' ? -1 : 1;
                                                if (av > bv) return expSortDir === 'asc' ? 1 : -1;
                                                return 0;
                                            });
                                            const totalPages = Math.ceil(sorted.length / EXP_PER_PAGE);
                                            const safePage = Math.min(expPage, totalPages);
                                            const pageItems = sorted.slice((safePage - 1) * EXP_PER_PAGE, safePage * EXP_PER_PAGE);
                                            const allOnPage = pageItems.every(r => expSelectedIds.has(r.id));
                                            const toggleExpSort = (field) => {
                                                if (expSortField === field) setExpSortDir(d => d === 'asc' ? 'desc' : 'asc');
                                                else { setExpSortField(field); setExpSortDir('desc'); }
                                                setExpPage(1);
                                            };
                                            const toggleExpSelectAll = () => {
                                                const next = new Set(expSelectedIds);
                                                if (allOnPage) pageItems.forEach(r => next.delete(r.id));
                                                else pageItems.forEach(r => next.add(r.id));
                                                setExpSelectedIds(next);
                                            };
                                            const toggleExpOne = (id) => {
                                                const next = new Set(expSelectedIds);
                                                if (next.has(id)) next.delete(id); else next.add(id);
                                                setExpSelectedIds(next);
                                            };
                                            return (
                                                <div className="space-y-2">
                                                    {/* Sort Bar */}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">{t('statsPage.sortLabel', '정렬')}:</span>
                                                        {[
                                                            { key: 'expense_date', label: t('statsPage.expDate', '날짜') },
                                                            { key: 'amount', label: t('statsPage.expAmount', '금액') },
                                                            { key: 'category', label: t('statsPage.expCategory', '카테고리') },
                                                            { key: 'payment_method', label: t('statsPage.expPayment', '결제수단') },
                                                        ].map(s => (
                                                            <button key={s.key} onClick={() => toggleExpSort(s.key)}
                                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${expSortField === s.key
                                                                    ? 'bg-violet-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                                            >
                                                                {s.label} {expSortField === s.key && (expSortDir === 'asc' ? '↑' : '↓')}
                                                            </button>
                                                        ))}
                                                        <button
                                                            onClick={() => setShowExpDatePicker(v => !v)}
                                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${showExpDatePicker || expDateStart || expDateEnd ? 'bg-indigo-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                                        >
                                                            📅 {t('statsPage.dateRange', '기간')}
                                                        </button>
                                                        <span className="ml-auto text-[11px] text-gray-400 dark:text-gray-500 font-medium">{t('statsPage.totalCount', '총')} {sorted.length}</span>
                                                    </div>
                                                    {showExpDatePicker && (
                                                        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl px-3 py-2 border border-indigo-200 dark:border-indigo-700">
                                                            <span className="text-[10px] font-bold text-indigo-500">📅</span>
                                                            <input type="date" value={expDateStart} onChange={e => { setExpDateStart(e.target.value); setExpPage(1); }}
                                                                className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 w-[130px]" />
                                                            <span className="text-xs text-gray-400">~</span>
                                                            <input type="date" value={expDateEnd} onChange={e => { setExpDateEnd(e.target.value); setExpPage(1); }}
                                                                className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 w-[130px]" />
                                                            {(expDateStart || expDateEnd) && (
                                                                <button onClick={() => { setExpDateStart(''); setExpDateEnd(''); setExpPage(1); }}
                                                                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-500 transition-all">
                                                                    {t('statsPage.resetFilter', '초기화')}
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Bulk Action Bar */}
                                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 flex-wrap">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input type="checkbox" checked={allOnPage && pageItems.length > 0} onChange={toggleExpSelectAll}
                                                                className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                                                            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">{t('statsPage.selectAll', '전체선택')}</span>
                                                        </label>
                                                        {/* Select ALL data (all pages) */}
                                                        {sorted.length > EXP_PER_PAGE && (
                                                            <button
                                                                onClick={() => {
                                                                    const allIds = new Set(sorted.map(r => r.id));
                                                                    setExpSelectedIds(allIds);
                                                                }}
                                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${expSelectedIds.size === sorted.length
                                                                    ? 'bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-400'
                                                                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-300'}`}
                                                            >
                                                                📋 {t('statsPage.selectAllPages', `전체 ${sorted.length}개 모두 선택`)}
                                                            </button>
                                                        )}
                                                        {expSelectedIds.size > 0 && (
                                                            <>
                                                                <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">{expSelectedIds.size}{t('statsPage.selected', '개 선택됨')}</span>
                                                                <button onClick={handleBulkDeleteExpenses}
                                                                    className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors shadow-sm">
                                                                    <Trash2 size={12} /> {t('statsPage.deleteSelected', '선택 삭제')}
                                                                </button>
                                                                <button onClick={() => setExpSelectedIds(new Set())}
                                                                    className="px-2.5 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-[11px] font-bold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                                                    {t('statsPage.deselectAll', '선택해제')}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Expense Cards */}
                                                    {pageItems.map(exp => {
                                                        const meta = getExpenseCatMeta(exp.category);
                                                        const CatIcon = meta.icon;
                                                        const pm = PAYMENT_METHODS.find(p => p.key === exp.payment_method);
                                                        return (
                                                            <div key={exp.id} className={`bg-white dark:bg-gray-800 rounded-2xl border shadow-sm p-4 hover:shadow-md transition-shadow ${expSelectedIds.has(exp.id) ? 'border-violet-300 dark:border-violet-600 bg-violet-50/30' : 'border-gray-100 dark:border-gray-700'}`}>
                                                                <div className="flex items-center gap-3">
                                                                    <input type="checkbox" checked={expSelectedIds.has(exp.id)} onChange={() => toggleExpOne(exp.id)}
                                                                        className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 flex-shrink-0" />
                                                                    <div className={`w-10 h-10 bg-gradient-to-br ${meta.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                                                                        <CatIcon size={18} />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-sm font-extrabold text-gray-900 dark:text-white">{getExpenseCatLabel(exp.category)}</span>
                                                                            <span className="text-sm font-extrabold text-violet-600">{formatRevenue(exp.amount)}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <span className="text-[10px] text-gray-400">{exp.expense_date}</span>
                                                                            {pm && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full font-medium">{pm.label}</span>}
                                                                            {exp.memo && <span className="text-[10px] text-gray-400 truncate max-w-[120px]">{exp.memo}</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-1">
                                                                        <button onClick={() => { setEditingExpense(exp); setShowExpenseForm(true); }} className="p-2 rounded-lg text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"><Edit3 size={14} /></button>
                                                                        <button onClick={() => handleDeleteExpense(exp)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* Pagination */}
                                                    {totalPages > 1 && (
                                                        <div className="flex items-center justify-center gap-1 pt-2">
                                                            <button onClick={() => setExpPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-bold transition-all">◀</button>
                                                            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                                                let page;
                                                                if (totalPages <= 7) page = i + 1;
                                                                else if (safePage <= 4) page = i + 1;
                                                                else if (safePage >= totalPages - 3) page = totalPages - 6 + i;
                                                                else page = safePage - 3 + i;
                                                                return (
                                                                    <button key={page} onClick={() => setExpPage(page)}
                                                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${page === safePage
                                                                            ? 'bg-violet-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                                                    >{page}</button>
                                                                );
                                                            })}
                                                            <button onClick={() => setExpPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-bold transition-all">▶</button>
                                                            <span className="ml-2 text-[10px] text-gray-400 font-medium">{safePage}/{totalPages}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </>
                                )}

                                {/* Expense Form Modal */}
                                {showExpenseForm && (
                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={() => setShowExpenseForm(false)}>
                                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                                <h3 className="font-extrabold text-gray-900">{editingExpense ? t('statsPage.expEdit', '지출 수정') : t('statsPage.expAdd', '지출 추가')}</h3>
                                                <button onClick={() => setShowExpenseForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
                                            </div>
                                            <ExpenseFormInner
                                                initial={editingExpense}
                                                onSave={handleSaveExpense}
                                                onCancel={() => setShowExpenseForm(false)}
                                                categories={EXPENSE_CATEGORIES}
                                                paymentMethods={PAYMENT_METHODS}
                                                getCatLabel={getExpenseCatLabel}
                                                formatRevenue={formatRevenue}
                                                selectedCountry={selectedCountry}
                                                onCountryChange={setSelectedCountry}
                                                hostCountries={HOST_COUNTRIES}
                                                countryCurrency={COUNTRY_CURRENCY}
                                                t={t}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ════ TAX TAB ════ */}
                    {
                        activeTab === 'tax' && (
                            <div className="space-y-3">
                                {/* Country Selector */}
                                <div className="flex gap-2 flex-wrap">
                                    {AVAILABLE_TAX_COUNTRIES.map(c => (
                                        <button key={c.code}
                                            onClick={() => setTaxCountry(c.code)}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${taxCountry === c.code
                                                ? 'bg-violet-600 text-white border-violet-600'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'
                                                }`}>
                                            {c.flag} {c.name}
                                        </button>
                                    ))}
                                </div>

                                {taxLoading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 size={32} className="text-violet-500 animate-spin" />
                                    </div>
                                ) : taxResult?.calculation ? (
                                    <>
                                        {/* Revenue & Profit Summary */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { label: t('statsPage.taxRevenue', '연간 매출'), value: taxResult.calculation.summary?.annual_revenue, bgCls: 'bg-blue-50', textCls: 'text-blue-600' },
                                                { label: t('statsPage.taxCost', '원가/경비'), value: taxResult.calculation.summary?.annual_cost, bgCls: 'bg-gray-50', textCls: 'text-gray-600' },
                                                { label: t('statsPage.taxProfit', '순이익'), value: taxResult.calculation.summary?.profit, bgCls: 'bg-emerald-50', textCls: 'text-emerald-600' },
                                                { label: t('statsPage.taxTotal', '예상 총 세금'), value: taxResult.calculation.summary?.total_estimated_tax, bgCls: 'bg-red-50', textCls: 'text-red-600' },
                                            ].map((item, i) => (
                                                <div key={i} className={`${item.bgCls} rounded-2xl p-4`}>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{item.label}</p>
                                                    <p className={`text-lg font-extrabold ${item.textCls}`}>
                                                        {(item.value || 0).toLocaleString()} {taxResult.currency}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* VAT Section */}
                                        {taxResult.calculation.vat && (
                                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                                <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-3">
                                                    <DollarSign size={16} className="text-violet-600" />
                                                    {t(`statsPage.taxVatName${taxResult.country}`, taxResult.calculation.vat.name)}
                                                </h3>
                                                <div className="grid grid-cols-3 gap-3 mb-3">
                                                    <div className="bg-violet-50 rounded-xl p-3">
                                                        <p className="text-[10px] text-violet-600 font-bold">{t('statsPage.taxRate', '세율')}</p>
                                                        <p className="text-lg font-extrabold text-violet-700">
                                                            {taxResult.calculation.vat.simplified ? taxResult.calculation.vat.simplified_rate : taxResult.calculation.vat.rate}%
                                                        </p>
                                                    </div>
                                                    <div className="bg-violet-50 rounded-xl p-3">
                                                        <p className="text-[10px] text-violet-600 font-bold">{t('statsPage.taxAmount', '예상 세액')}</p>
                                                        <p className="text-lg font-extrabold text-violet-700">
                                                            {(taxResult.calculation.vat.amount || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="bg-violet-50 rounded-xl p-3">
                                                        <p className="text-[10px] text-violet-600 font-bold">{t('statsPage.taxPeriod', '신고주기')}</p>
                                                        <p className="text-sm font-bold text-violet-700">
                                                            {taxResult.calculation.vat.filing_dates?.join(', ') || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500">{taxResult.calculation.vat.simplified ? t('statsPage.taxSimplifiedDesc', taxResult.calculation.vat.description) : t(`statsPage.taxVatDesc${taxResult.country}`, taxResult.calculation.vat.description)}</p>
                                                {taxResult.calculation.vat.simplified && (
                                                    <div className="mt-2 px-3 py-2 bg-amber-50 rounded-xl">
                                                        <p className="text-xs font-bold text-amber-700">⚠️ {t('statsPage.taxSimplified', '간이과세자 적용')}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Income Tax Section */}
                                        {taxResult.calculation.income_tax && (
                                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                                <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-3">
                                                    <Target size={16} className="text-violet-600" />
                                                    {t(`statsPage.taxIncomeName${taxResult.country}`, taxResult.calculation.income_tax.name)}
                                                </h3>
                                                <div className="grid grid-cols-3 gap-3 mb-2.5">
                                                    <div className="bg-orange-50 rounded-xl p-3">
                                                        <p className="text-[10px] text-orange-600 font-bold">{t('statsPage.taxTaxable', '과세 소득')}</p>
                                                        <p className="text-sm font-extrabold text-orange-700">
                                                            {(taxResult.calculation.income_tax.taxable_income || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="bg-red-50 rounded-xl p-3">
                                                        <p className="text-[10px] text-red-600 font-bold">{t('statsPage.taxIncomeTax', '소득세')}</p>
                                                        <p className="text-sm font-extrabold text-red-700">
                                                            {(taxResult.calculation.income_tax.total_tax || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="bg-blue-50 rounded-xl p-3">
                                                        <p className="text-[10px] text-blue-600 font-bold">{t('statsPage.taxEffective', '실효세율')}</p>
                                                        <p className="text-lg font-extrabold text-blue-700">
                                                            {taxResult.calculation.income_tax.effective_rate}%
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Bracket breakdown */}
                                                <div className="space-y-1">
                                                    {taxResult.calculation.income_tax.breakdown?.map((b, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-[11px]">
                                                            <span className="text-gray-400 w-32 text-right">{b.range}</span>
                                                            <span className="text-gray-600 w-10 text-right">{b.rate}%</span>
                                                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                                                                <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all"
                                                                    style={{ width: `${Math.min(100, (b.tax / (taxResult.calculation.income_tax.total_tax || 1)) * 100)}%` }} />
                                                            </div>
                                                            <span className="text-gray-700 font-bold w-20 text-right">
                                                                {(b.tax || 0).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-3 px-3 py-2 bg-gray-50 rounded-xl flex items-center gap-2">
                                                    <Calendar size={12} className="text-gray-400" />
                                                    <span className="text-xs text-gray-500">
                                                        {t('statsPage.taxFilingDate', '신고 기한')}: {taxResult.calculation.income_tax.filing_date}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* After-tax Income */}
                                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white">
                                            <p className="text-sm font-bold opacity-80">
                                                {t('statsPage.taxAfterTax', '세후 예상 소득')}
                                            </p>
                                            <p className="text-3xl font-extrabold mt-1">
                                                {(taxResult.calculation.summary?.after_tax_income || 0).toLocaleString()} {taxResult.currency}
                                            </p>
                                            <p className="text-xs mt-1 opacity-70">
                                                {t('statsPage.taxEffectiveTotal', '실효 총 세율')}: {taxResult.calculation.summary?.effective_total_rate}%
                                            </p>
                                        </div>

                                        {/* ── Tax Settings Editor ── */}
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                            <button onClick={() => { if (!taxEditMode) { loadTaxSettings(); } setTaxEditMode(!taxEditMode); }}
                                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <Edit3 size={16} className="text-violet-600" />
                                                    <span className="font-bold text-sm text-gray-900">
                                                        {t('statsPage.taxSettings', '⚙️ 세율 설정')}
                                                    </span>
                                                    {hasCustomSettings && (
                                                        <span className="px-2 py-0.5 bg-violet-100 text-violet-600 rounded-full text-[10px] font-bold">
                                                            {t('statsPage.taxCustom', '커스텀')}
                                                        </span>
                                                    )}
                                                    {taxResult?.is_custom && (
                                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[10px] font-bold">
                                                            {t('statsPage.taxCustomApplied', '적용중')}
                                                        </span>
                                                    )}
                                                </div>
                                                <ChevronDown size={16} className={`text-gray-400 transition-transform ${taxEditMode ? 'rotate-180' : ''}`} />
                                            </button>

                                            {taxEditMode && (
                                                <div className="border-t border-gray-100 p-4 space-y-4">
                                                    {taxSettingsLoading ? (
                                                        <div className="flex items-center justify-center py-8">
                                                            <Loader2 size={24} className="text-violet-500 animate-spin" />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {/* VAT Rate */}
                                                            <div>
                                                                <label className="text-xs font-bold text-gray-600 block mb-1">
                                                                    {t('statsPage.taxEditVat', 'VAT / 부가세율 (%)')}
                                                                </label>
                                                                <input type="number" step="0.1" min="0" max="100"
                                                                    value={editVatRate} onChange={e => setEditVatRate(e.target.value)}
                                                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all" />
                                                            </div>

                                                            {/* Simplified Tax (KR only) */}
                                                            {taxCountry === 'KR' && (
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <div>
                                                                        <label className="text-xs font-bold text-gray-600 block mb-1">
                                                                            {t('statsPage.taxEditSimplifiedRate', '간이과세율 (%)')}
                                                                        </label>
                                                                        <input type="number" step="0.1" min="0" max="100"
                                                                            value={editSimplifiedRate} onChange={e => setEditSimplifiedRate(e.target.value)}
                                                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-xs font-bold text-gray-600 block mb-1">
                                                                            {t('statsPage.taxEditSimplifiedThreshold', '간이과세 기준 (원)')}
                                                                        </label>
                                                                        <input type="number" step="1000000"
                                                                            value={editSimplifiedThreshold} onChange={e => setEditSimplifiedThreshold(e.target.value)}
                                                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all" />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Extra Deduction */}
                                                            <div>
                                                                <label className="text-xs font-bold text-gray-600 block mb-1">
                                                                    {t('statsPage.taxEditDeduction', '추가 공제액')}
                                                                </label>
                                                                <input type="number" step="10000"
                                                                    value={editDeduction} onChange={e => setEditDeduction(e.target.value)}
                                                                    placeholder="0"
                                                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all" />
                                                            </div>

                                                            {/* Income Tax Brackets */}
                                                            <div>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <label className="text-xs font-bold text-gray-600">
                                                                        {t('statsPage.taxEditBrackets', '소득세 구간')}
                                                                    </label>
                                                                    <button onClick={() => setEditBrackets([...editBrackets, { min: editBrackets.length > 0 ? editBrackets[editBrackets.length - 1].max || 0 : 0, max: null, rate: 0 }])}
                                                                        className="text-xs text-violet-600 font-bold hover:text-violet-700">
                                                                        + {t('statsPage.taxEditAddBracket', '구간 추가')}
                                                                    </button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {editBrackets.map((bracket, idx) => (
                                                                        <div key={idx} className="flex items-center gap-2">
                                                                            <input type="number" value={bracket.min}
                                                                                onChange={e => {
                                                                                    const nb = [...editBrackets]; nb[idx] = { ...nb[idx], min: e.target.value }; setEditBrackets(nb);
                                                                                }}
                                                                                className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-right"
                                                                                placeholder={t('statsPage.minimum', '최소')} />
                                                                            <span className="text-gray-400 text-xs">~</span>
                                                                            <input type="number" value={bracket.max ?? ''}
                                                                                onChange={e => {
                                                                                    const nb = [...editBrackets]; nb[idx] = { ...nb[idx], max: e.target.value || null }; setEditBrackets(nb);
                                                                                }}
                                                                                className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-right"
                                                                                placeholder="∞" />
                                                                            <input type="number" step="0.1" value={bracket.rate}
                                                                                onChange={e => {
                                                                                    const nb = [...editBrackets]; nb[idx] = { ...nb[idx], rate: e.target.value }; setEditBrackets(nb);
                                                                                }}
                                                                                className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-right"
                                                                                placeholder="%" />
                                                                            <span className="text-xs text-gray-400">%</span>
                                                                            {editBrackets.length > 1 && (
                                                                                <button onClick={() => setEditBrackets(editBrackets.filter((_, i) => i !== idx))}
                                                                                    className="text-red-400 hover:text-red-600 p-1">
                                                                                    <X size={12} />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex gap-2 pt-2">
                                                                <button onClick={saveTaxSettings}
                                                                    className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl font-bold text-xs hover:bg-violet-700 transition-colors flex items-center justify-center gap-1">
                                                                    <Save size={14} /> {t('statsPage.taxSettingsSave', '저장')}
                                                                </button>
                                                                {hasCustomSettings && (
                                                                    <button onClick={resetTaxSettings}
                                                                        className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs hover:bg-gray-200 transition-colors flex items-center gap-1">
                                                                        <RotateCcw size={14} /> {t('statsPage.taxSettingsReset', '기본값')}
                                                                    </button>
                                                                )}
                                                                <button onClick={() => setTaxEditMode(false)}
                                                                    className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs hover:bg-gray-200 transition-colors">
                                                                    {t('statsPage.taxSettingsCancel', '취소')}
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-[10px] text-gray-400 text-center">
                                            {t('statsPage.taxDisclaimer', '※ 이 계산은 참고용이며, 실제 세금은 세무사와 상담하시기 바랍니다.')}
                                        </p>
                                    </>
                                ) : (
                                    <div className="text-center py-16">
                                        <DollarSign size={48} className="text-gray-200 mx-auto mb-3" />
                                        <p className="text-sm text-gray-400">
                                            {t('statsPage.taxNoData', '매출 데이터가 없습니다. 먼저 매출 데이터를 입력해주세요.')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ════ TAX TIPS & COUNTRY INFO (shown when tax tab active) ════ */}
                    {
                        activeTab === 'tax' && (
                            <div className="space-y-3 mt-5">

                                {/* ── Tax Saving Tips ── */}
                                {(() => {
                                    const taxTips = {
                                        KR: [
                                            { title: t('statsPage.tipKR0Title', '간이과세자 vs 일반과세자'), desc: t('statsPage.tipKR0Desc', '연매출 8,000만원 이하면 간이과세자로 등록하여 부가세 부담을 줄일 수 있습니다. 간이과세율은 1.5%~4%로 일반과세 10%보다 훨씬 유리합니다.'), cat: t('statsPage.tipCatBusinessType', '사업자 유형') },
                                            { title: t('statsPage.tipKR1Title', '필요경비 인정 항목'), desc: t('statsPage.tipKR1Desc', '재료비, 배송비, 부스임대료, 교통비 등의 증빙을 반드시 보관하세요. 적격증빙 수취 시 경비로 인정받아 소득세 절감이 가능합니다.'), cat: t('statsPage.tipCatExpenseDeduction', '경비 공제') },
                                            { title: t('statsPage.tipKR2Title', '사업용 카드 등록'), desc: t('statsPage.tipKR2Desc', '홈택스(hometax.go.kr)에 사업용 카드를 등록하면 카드 사용 내역이 자동으로 경비 처리되어 장부 정리가 편리해집니다.'), cat: t('statsPage.tipCatExpenseDeduction', '경비 공제') },
                                            { title: t('statsPage.tipKR3Title', '세금계산서 발행/수취'), desc: t('statsPage.tipKR3Desc', '매입처에서 세금계산서를 발급받으면 부가세 매입공제를 받을 수 있어 실질적인 세금 절감 효과가 있습니다.'), cat: t('statsPage.tipCatVATSaving', '부가세 절감') },
                                            { title: t('statsPage.tipKR4Title', '소규모 사업자 세액감면'), desc: t('statsPage.tipKR4Desc', '연매출 8,000만원 이하 소규모 개인사업자는 부가세 간이 납부 세액에서 일정 비율을 감면받을 수 있습니다.'), cat: t('statsPage.tipCatIncomeTaxSaving', '소득세 절감') },
                                            { title: t('statsPage.tipKR5Title', '전자신고 세액공제'), desc: t('statsPage.tipKR5Desc', '종합소득세를 전자(홈택스)로 직접 신고하면 2만원의 세액공제를 받을 수 있습니다.'), cat: t('statsPage.tipCatFilingStrategy', '신고 전략') },
                                        ],
                                        JP: [
                                            { title: t('statsPage.tipJP0Title', '청색신고 특별공제'), desc: t('statsPage.tipJP0Desc', '확정신고 시 청색신고를 선택하고 e-Tax로 신고하면 최대 65만엔의 공제를 받을 수 있습니다. 장부를 정확히 기재하는 것이 조건입니다.'), cat: t('statsPage.tipCatIncomeTaxSaving', '소득세 절감') },
                                            { title: t('statsPage.tipJP1Title', '인보이스 제도 활용'), desc: t('statsPage.tipJP1Desc', '적격청구서 발행사업자로 등록하면, 거래처가 매입세액공제를 받을 수 있어 거래를 유리하게 할 수 있습니다.'), cat: t('statsPage.tipCatConsumptionTax', '소비세') },
                                            { title: t('statsPage.tipJP2Title', '소규모 사업자 특례'), desc: t('statsPage.tipJP2Desc', '과세 매출액 1,000만엔 이하인 경우 소비세 면세사업자가 될 수 있습니다. 단, 인보이스 제도와의 관계에 주의가 필요합니다.'), cat: t('statsPage.tipCatConsumptionTax', '소비세') },
                                            { title: t('statsPage.tipJP3Title', '필요경비의 명확화'), desc: t('statsPage.tipJP3Desc', '재료비, 출점료, 교통비, 통신비 등을 꼼꼼히 기록하여 경비로 처리하세요. 영수증은 5년간 보관이 필요합니다.'), cat: t('statsPage.tipCatExpenseDeduction', '경비 공제') },
                                            { title: t('statsPage.tipJP4Title', '확정신고 공제 활용'), desc: t('statsPage.tipJP4Desc', '의료비 공제, 기부금 공제, 생명보험료 공제 등 각종 공제를 빠짐없이 신고하여 세금 부담을 줄일 수 있습니다.'), cat: t('statsPage.tipCatIncomeTaxSaving', '소득세 절감') },
                                        ],
                                        US: [
                                            { title: t('statsPage.tipUS0Title', '자영업세 공제'), desc: t('statsPage.tipUS0Desc', '자영업세(15.3%)의 절반을 조정총소득에서 공제할 수 있어 소득세 부담이 효과적으로 줄어듭니다.'), cat: t('statsPage.tipCatIncomeTax', '소득세') },
                                            { title: t('statsPage.tipUS1Title', '홈오피스 공제'), desc: t('statsPage.tipUS1Desc', '사업 전용 공간을 사용하는 경우 간편 방법으로 $5/sqft(최대 300sqft)를 공제하거나, 실제 비용을 공제할 수 있습니다.'), cat: t('statsPage.tipCatDeduction', '공제') },
                                            { title: t('statsPage.tipUS2Title', '분기 추정세 납부'), desc: t('statsPage.tipUS2Desc', '과소납부 벌금을 피하기 위해 분기별 추정세(Form 1040-ES)를 납부하세요. 납부일: 4/15, 6/15, 9/15, 1/15.'), cat: t('statsPage.tipCatFilingStrategy', '신고 전략') },
                                            { title: t('statsPage.tipUS3Title', '사업 경비 추적'), desc: t('statsPage.tipUS3Desc', '재료비, 배송비, 부스비, 출장비 등의 영수증을 보관하세요. QuickBooks나 Wave 같은 회계 소프트웨어를 활용하면 편리합니다.'), cat: t('statsPage.tipCatDeduction', '공제') },
                                            { title: t('statsPage.tipUS4Title', '판매세 넥서스'), desc: t('statsPage.tipUS4Desc', '여러 주에서 판매하는 경우, 경제 활동 기준으로 판매세 징수/납부 의무("넥서스")가 있는지 확인하세요.'), cat: t('statsPage.tipCatSalesTax', '판매세') },
                                        ],
                                        GB: [
                                            { title: t('statsPage.tipGB0Title', 'VAT 균일세율제도'), desc: t('statsPage.tipGB0Desc', 'VAT 과세 매출이 £150,000 미만이면 균일세율제도로 총매출의 고정 %를 납부하여 절세할 수 있습니다.'), cat: t('statsPage.tipCatVAT', 'VAT') },
                                            { title: t('statsPage.tipGB1Title', '거래 면세 한도'), desc: t('statsPage.tipGB1Desc', '연간 £1,000까지 판매 소득을 HMRC에 신고하지 않아도 됩니다. 초과 시 자영업자 등록이 필요합니다.'), cat: t('statsPage.tipCatIncomeTax', '소득세') },
                                            { title: t('statsPage.tipGB2Title', '허용 사업 경비'), desc: t('statsPage.tipGB2Desc', '원자재, 배송비, 매대비, 출장비 등을 공제할 수 있으며, 재택근무 시 가정용 공과금의 일부도 공제 가능합니다.'), cat: t('statsPage.tipCatDeduction', '공제') },
                                            { title: t('statsPage.tipGB3Title', '선납 세금'), desc: t('statsPage.tipGB3Desc', 'HMRC는 전년도 세금 청구서에 기반하여 선납을 요구할 수 있습니다. 현금 흐름 문제를 피하기 위해 미리 예산을 책정하세요.'), cat: t('statsPage.tipCatFilingStrategy', '신고 전략') },
                                        ],
                                        DE: [
                                            { title: t('statsPage.tipDE0Title', '소규모사업자 규정'), desc: t('statsPage.tipDE0Desc', '전년도 매출이 22,000€ 미만이고 당해 매출이 50,000€ 이하로 예상되면 부가가치세를 면제받을 수 있습니다.'), cat: t('statsPage.tipCatVATSaving', '부가세 절감') },
                                            { title: t('statsPage.tipDE1Title', '사업 경비 처리'), desc: t('statsPage.tipDE1Desc', '재료비, 배송비, 부스비, 출장비, 업무용품 등을 사업 경비로 공제할 수 있습니다. 증빙서류는 10년간 보관해야 합니다.'), cat: t('statsPage.tipCatDeduction', '공제') },
                                            { title: t('statsPage.tipDE2Title', '매입세액 공제'), desc: t('statsPage.tipDE2Desc', '일반과세 사업자는 매입 청구서에 기재된 부가가치세를 매입세액으로 공제받을 수 있습니다.'), cat: t('statsPage.tipCatVATSaving', '부가세 절감') },
                                        ],
                                        SG: [
                                            { title: t('statsPage.tipSG0Title', 'GST 등록 기준'), desc: t('statsPage.tipSG0Desc', '과세 매출이 S$100만을 초과하는 경우에만 GST 등록이 필수입니다. 그 이하에서는 자발적 등록이 가능합니다.'), cat: t('statsPage.tipCatGST', 'GST') },
                                            { title: t('statsPage.tipSG1Title', '생산성 및 혁신 세제 혜택'), desc: t('statsPage.tipSG1Desc', '다양한 정부 지원 제도를 통해 혁신 활동과 기술 투자에 대한 세금 공제를 신청할 수 있습니다.'), cat: t('statsPage.tipCatDeduction', '공제') },
                                            { title: t('statsPage.tipSG2Title', '법인세 감면'), desc: t('statsPage.tipSG2Desc', '소규모 기업은 부분 세금 면제를 받을 수 있습니다: 과세 소득 중 첫 S$10,000의 75%, 다음 S$190,000의 50%.'), cat: t('statsPage.tipCatIncomeTax', '소득세') },
                                        ],
                                        CA: [
                                            { title: t('statsPage.tipCA0Title', '소규모 사업자 공제'), desc: t('statsPage.tipCA0Desc', '캐나다 법인(CCPC)은 소규모 사업자 공제(Small Business Deduction)를 통해 첫 C$500,000의 사업 소득에 대해 감면된 세율을 적용받을 수 있습니다.'), cat: t('statsPage.tipCatIncomeTax', '소득세') },
                                            { title: t('statsPage.tipCA1Title', 'GST/HST 간이신고'), desc: t('statsPage.tipCA1Desc', '연매출 C$400,000 이하인 경우 Quick Method를 선택하여 GST/HST를 간편하게 신고할 수 있으며, 실질적으로 세금을 절감할 수 있습니다.'), cat: t('statsPage.tipCatGST', 'GST') },
                                            { title: t('statsPage.tipCA2Title', '사업 경비 공제'), desc: t('statsPage.tipCA2Desc', '재료비, 배송비, 부스 임대료, 출장비, 홈오피스 비용 등을 사업 경비로 공제할 수 있습니다. 모든 영수증을 6년간 보관하세요.'), cat: t('statsPage.tipCatDeduction', '공제') },
                                            { title: t('statsPage.tipCA3Title', 'RRSP 기여금 공제'), desc: t('statsPage.tipCA3Desc', 'RRSP(등록퇴직저축)에 기여한 금액은 과세 소득에서 공제됩니다. 최대 기여 한도는 전년도 근로소득의 18%입니다.'), cat: t('statsPage.tipCatDeduction', '공제') },
                                            { title: t('statsPage.tipCA4Title', '주별 세금 차이'), desc: t('statsPage.tipCA4Desc', '각 주마다 HST/PST 세율과 주 소득세율이 다릅니다. Alberta는 PST가 없어 세금 부담이 낮은 편입니다.'), cat: t('statsPage.tipCatFilingStrategy', '신고 전략') },
                                        ],
                                        VN: [
                                            { title: t('statsPage.tipVN0Title', '간이 과세 방식'), desc: t('statsPage.tipVN0Desc', '연매출 1억 VND 이하의 개인사업자는 VAT 납부 의무가 면제됩니다. 소규모 사업자는 이 혜택을 적극 활용하세요.'), cat: t('statsPage.tipCatVATSaving', '부가세 절감') },
                                            { title: t('statsPage.tipVN1Title', '경비 증빙 관리'), desc: t('statsPage.tipVN1Desc', '사업 경비로 인정받으려면 적격 증빙서류(Hóa đơn VAT)가 필요합니다. 2천만 VND 이상 거래는 반드시 은행 이체로 결제하세요.'), cat: t('statsPage.tipCatExpenseDeduction', '경비 공제') },
                                            { title: t('statsPage.tipVN2Title', 'VAT 매입세액 공제'), desc: t('statsPage.tipVN2Desc', '매입 시 수취한 VAT 전자세금계산서를 잘 관리하면 매출 VAT에서 공제받을 수 있습니다.'), cat: t('statsPage.tipCatVATSaving', '부가세 절감') },
                                            { title: t('statsPage.tipVN3Title', '투자 우대 세율'), desc: t('statsPage.tipVN3Desc', '특정 산업이나 지역에 투자하는 경우 법인세 우대세율(10~17%)과 면세 기간을 적용받을 수 있습니다.'), cat: t('statsPage.tipCatIncomeTax', '소득세') },
                                        ],
                                        TH: [
                                            { title: t('statsPage.tipTH0Title', 'VAT 면세 기준'), desc: t('statsPage.tipTH0Desc', '연매출 180만 바트 이하인 경우 VAT 등록이 면제됩니다. 면세 기준 이하에서는 불필요한 VAT 부담을 피할 수 있습니다.'), cat: t('statsPage.tipCatVATSaving', '부가세 절감') },
                                            { title: t('statsPage.tipTH1Title', '개인 공제 항목'), desc: t('statsPage.tipTH1Desc', '본인 공제 6만 바트, 배우자 공제 6만 바트, 자녀 1인당 3만 바트, 생명보험료 최대 10만 바트까지 공제 가능합니다.'), cat: t('statsPage.tipCatDeduction', '공제') },
                                            { title: t('statsPage.tipTH2Title', 'BOI 투자 혜택'), desc: t('statsPage.tipTH2Desc', '태국 투자촉진위원회(BOI) 인증 사업은 법인세 면제, 수입관세 감면 등 다양한 세제 혜택을 받을 수 있습니다.'), cat: t('statsPage.tipCatIncomeTax', '소득세') },
                                            { title: t('statsPage.tipTH3Title', '원천징수세 관리'), desc: t('statsPage.tipTH3Desc', '서비스 대금 지급 시 원천징수한 세금(보통 3%)은 연말 정산 시 기납부세액으로 공제됩니다. 원천징수 영수증을 반드시 보관하세요.'), cat: t('statsPage.tipCatFilingStrategy', '신고 전략') },
                                        ],
                                        KH: [
                                            { title: t('statsPage.tipKH0Title', '소규모 납세자 제도'), desc: t('statsPage.tipKH0Desc', '연매출 2억5천만 리엘 이하 사업자는 소규모 납세자로 분류되어 간소화된 세금 신고가 가능합니다.'), cat: t('statsPage.tipCatFilingStrategy', '신고 전략') },
                                            { title: t('statsPage.tipKH1Title', '사업 경비 공제'), desc: t('statsPage.tipKH1Desc', '사업과 직접 관련된 비용(재료비, 임대료, 급여, 감가상각 등)은 사업이익세(ToP) 과세표준에서 공제할 수 있습니다.'), cat: t('statsPage.tipCatExpenseDeduction', '경비 공제') },
                                            { title: t('statsPage.tipKH2Title', 'QIP 투자 인센티브'), desc: t('statsPage.tipKH2Desc', '적격투자프로젝트(QIP) 승인을 받으면 법인세 면제 기간(최대 9년)과 수입관세 면제 혜택을 받을 수 있습니다.'), cat: t('statsPage.tipCatIncomeTax', '소득세') },
                                        ],
                                        RU: [
                                            { title: t('statsPage.tipRU0Title', '간이과세 제도(USN)'), desc: t('statsPage.tipRU0Desc', '연매출 2억5천만 루블 이하인 경우 간이과세(USN)를 선택할 수 있습니다. 매출의 6% 또는 이익의 15% 중 유리한 방식을 선택하세요.'), cat: t('statsPage.tipCatIncomeTax', '소득세') },
                                            { title: t('statsPage.tipRU1Title', '개인사업자(IP) 등록'), desc: t('statsPage.tipRU1Desc', '개인사업자로 등록하면 소규모 사업에 적합한 간소화된 세금 체계를 이용할 수 있으며, 사회보험료도 고정 금액으로 납부합니다.'), cat: t('statsPage.tipCatFilingStrategy', '신고 전략') },
                                            { title: t('statsPage.tipRU2Title', 'VAT 면세'), desc: t('statsPage.tipRU2Desc', '간이과세(USN) 적용 시 НДС(부가가치세) 납부 의무가 면제됩니다. 이는 소규모 사업자에게 큰 세금 절감 효과가 있습니다.'), cat: t('statsPage.tipCatVATSaving', '부가세 절감') },
                                            { title: t('statsPage.tipRU3Title', '자영업자 세금(НПД)'), desc: t('statsPage.tipRU3Desc', '연소득 240만 루블 이하인 경우 자영업자 세금(НПД) 제도를 이용하면 개인 고객 4%, 법인 고객 6%의 낮은 세율이 적용됩니다.'), cat: t('statsPage.tipCatIncomeTax', '소득세') },
                                        ],
                                        UA: [
                                            { title: t('statsPage.tipUA0Title', '간이과세 그룹'), desc: t('statsPage.tipUA0Desc', '우크라이나 간이과세는 4개 그룹으로 나뉩니다. 그룹 3은 연매출 1,167 최저임금 이하이며 매출의 5%(VAT 없음) 또는 3%(VAT 포함)를 납부합니다.'), cat: t('statsPage.tipCatIncomeTax', '소득세') },
                                            { title: t('statsPage.tipUA1Title', 'ФОП 개인사업자'), desc: t('statsPage.tipUA1Desc', 'ФОП(개인사업자)로 등록하면 간소화된 세금 체계를 이용할 수 있습니다. 그룹 1~3 중 매출 규모와 활동 유형에 맞는 그룹을 선택하세요.'), cat: t('statsPage.tipCatFilingStrategy', '신고 전략') },
                                            { title: t('statsPage.tipUA2Title', 'VAT 면세 조건'), desc: t('statsPage.tipUA2Desc', '간이과세 그룹 1, 2 또는 그룹 3(5% 선택)의 경우 ПДВ(부가가치세) 납부 의무가 면제됩니다.'), cat: t('statsPage.tipCatVATSaving', '부가세 절감') },
                                            { title: t('statsPage.tipUA3Title', '통합사회보험료(ЄСВ)'), desc: t('statsPage.tipUA3Desc', 'ФОП는 매월 최저임금의 22%에 해당하는 ЄСВ(통합사회보험료)를 납부해야 합니다. 이는 의무 사항이지만 고정 금액이라 예측 가능합니다.'), cat: t('statsPage.tipCatFilingStrategy', '신고 전략') },
                                        ],
                                    };

                                    const tips = taxTips[taxCountry] || [];
                                    if (tips.length === 0) return null;

                                    return (
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                            <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5">
                                                <Zap size={16} className="text-amber-500" />
                                                {t('statsPage.taxTipsTitle', '💡 절세 팁')}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2.5">{t('statsPage.taxTipsSubtitle', '세금을 줄이는 실용적인 방법')}</p>
                                            <div className="space-y-2">
                                                {tips.map((tip, i) => (
                                                    <details key={i} className="group bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden">
                                                        <summary className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors list-none [&::-webkit-details-marker]:hidden">
                                                            <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-full text-[10px] font-bold whitespace-nowrap">{tip.cat}</span>
                                                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100 flex-1">{tip.title}</span>
                                                            <ChevronDown size={14} className="text-gray-400 group-open:rotate-180 transition-transform" />
                                                        </summary>
                                                        <div className="px-3 pb-3 pt-0">
                                                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{tip.desc}</p>
                                                        </div>
                                                    </details>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* ── Country-specific Tax Info ── */}
                                {(() => {
                                    const countryInfo = {
                                        KR: {
                                            overview: { title: t('statsPage.infoKROverviewTitle', '한국 세금 체계'), items: [t('statsPage.infoKROverview0', '부가가치세(VAT): 10%'), t('statsPage.infoKROverview1', '종합소득세: 6% ~ 45% (8구간 누진세)'), t('statsPage.infoKROverview2', '간이과세: 연매출 8,000만원 이하 시 1.5%~4%'), t('statsPage.infoKROverview3', '국민건강보험·국민연금 별도 부과')] },
                                            registration: { title: t('statsPage.infoKRRegTitle', '사업자 등록'), items: [t('statsPage.infoKRReg0', '홈택스(hometax.go.kr)에서 온라인 신청'), t('statsPage.infoKRReg1', '사업개시일로부터 20일 이내 등록 필요'), t('statsPage.infoKRReg2', '필요서류: 신분증, 사업장 임대차계약서'), t('statsPage.infoKRReg3', '간이과세자/일반과세자 중 선택')] },
                                            deductions: { title: t('statsPage.infoKRDeductTitle', '주요 공제 항목'), items: [t('statsPage.infoKRDeduct0', '기본공제: 본인 150만원'), t('statsPage.infoKRDeduct1', '인적공제: 부양가족 1인당 150만원'), t('statsPage.infoKRDeduct2', '연금보험료 공제'), t('statsPage.infoKRDeduct3', '건강보험료 공제'), t('statsPage.infoKRDeduct4', '기부금 공제'), t('statsPage.infoKRDeduct5', '중소기업 특별세액감면')] },
                                            deadlines: { title: t('statsPage.infoKRDeadlineTitle', '주요 신고 기한'), items: [t('statsPage.infoKRDeadline0', '부가세 1기 확정: 7월 25일'), t('statsPage.infoKRDeadline1', '부가세 2기 확정: 1월 25일'), t('statsPage.infoKRDeadline2', '종합소득세: 5월 31일'), t('statsPage.infoKRDeadline3', '원천세: 매월 10일')] },
                                            links: [
                                                { label: t('statsPage.infoKRLink0', '국세청 홈택스'), url: 'https://hometax.go.kr' },
                                                { label: t('statsPage.infoKRLink1', '국세법령정보시스템'), url: 'https://taxlaw.nts.go.kr' },
                                            ],
                                        },
                                        JP: {
                                            overview: { title: t('statsPage.infoJPOverviewTitle', '일본 세금 체계'), items: [t('statsPage.infoJPOverview0', '소비세: 10% (경감세율 8%)'), t('statsPage.infoJPOverview1', '소득세: 5%~45% (7단계 누진과세)'), t('statsPage.infoJPOverview2', '개인사업세: 3%~5%'), t('statsPage.infoJPOverview3', '주민세: 약 10%')] },
                                            registration: { title: t('statsPage.infoJPRegTitle', '사업자 등록'), items: [t('statsPage.infoJPReg0', '세무서에 "개인사업 개업신고서" 제출'), t('statsPage.infoJPReg1', '개업 후 1개월 이내 신고'), t('statsPage.infoJPReg2', '청색신고 승인신청서도 동시 제출 권장'), t('statsPage.infoJPReg3', 'e-Tax로 온라인 신청 가능')] },
                                            deductions: { title: t('statsPage.infoJPDeductTitle', '주요 공제 항목'), items: [t('statsPage.infoJPDeduct0', '기초공제: 48만엔'), t('statsPage.infoJPDeduct1', '청색신고 특별공제: 최대 65만엔'), t('statsPage.infoJPDeduct2', '배우자 공제'), t('statsPage.infoJPDeduct3', '사회보험료 공제'), t('statsPage.infoJPDeduct4', '의료비 공제'), t('statsPage.infoJPDeduct5', '기부금 공제')] },
                                            deadlines: { title: t('statsPage.infoJPDeadlineTitle', '신고 기한'), items: [t('statsPage.infoJPDeadline0', '확정신고: 2월 16일~3월 15일'), t('statsPage.infoJPDeadline1', '소비세: 3월 31일'), t('statsPage.infoJPDeadline2', '예정납세(1기): 7월 31일'), t('statsPage.infoJPDeadline3', '예정납세(2기): 11월 30일')] },
                                            links: [
                                                { label: t('statsPage.infoJPLink0', '국세청'), url: 'https://www.nta.go.jp' },
                                                { label: 'e-Tax', url: 'https://www.e-tax.nta.go.jp' },
                                            ],
                                        },
                                        US: {
                                            overview: { title: t('statsPage.infoUSOverviewTitle', '미국 세금 체계'), items: [t('statsPage.infoUSOverview0', '연방 소득세: 10%~37% (7구간)'), t('statsPage.infoUSOverview1', '자영업세: 15.3% (사회보장 + 의료보험)'), t('statsPage.infoUSOverview2', '판매세: 주별 상이 (0%~10.25%)'), t('statsPage.infoUSOverview3', '연방 부가가치세 없음')] },
                                            registration: { title: t('statsPage.infoUSRegTitle', '사업자 등록'), items: [t('statsPage.infoUSReg0', 'IRS(irs.gov)를 통해 EIN 신청'), t('statsPage.infoUSReg1', '주 정부에 판매세 허가증 등록'), t('statsPage.infoUSReg2', '사업 형태 선택: 개인사업, LLC, S-Corp'), t('statsPage.infoUSReg3', '주별 요구사항 상이')] },
                                            deductions: { title: t('statsPage.infoUSDeductTitle', '주요 공제 항목'), items: [t('statsPage.infoUSDeduct0', '표준 공제: $14,600 (2024)'), t('statsPage.infoUSDeduct1', '자영업세 공제 (50%)'), t('statsPage.infoUSDeduct2', '홈오피스 공제'), t('statsPage.infoUSDeduct3', '건강보험료'), t('statsPage.infoUSDeduct4', '퇴직연금 기여(SEP-IRA)'), t('statsPage.infoUSDeduct5', '사업 출장 및 식비(50%)')] },
                                            deadlines: { title: t('statsPage.infoUSDeadlineTitle', '주요 신고 기한'), items: [t('statsPage.infoUSDeadline0', '연간 세금신고(1040): 4월 15일'), t('statsPage.infoUSDeadline1', '분기 추정세(1040-ES): 4/15, 6/15, 9/15, 1/15'), t('statsPage.infoUSDeadline2', '판매세: 주별 상이 (월간/분기)')] },
                                            links: [
                                                { label: 'IRS', url: 'https://www.irs.gov' },
                                                { label: t('statsPage.infoUSLink1', '중소기업청(SBA)'), url: 'https://www.sba.gov/business-guide/manage-your-business/pay-taxes' },
                                            ],
                                        },
                                        GB: {
                                            overview: { title: t('statsPage.infoGBOverviewTitle', '영국 세금 체계'), items: [t('statsPage.infoGBOverview0', 'VAT: 20% (경감세율 5%, 영세율 0%)'), t('statsPage.infoGBOverview1', '소득세: 20%~45% (3구간)'), t('statsPage.infoGBOverview2', '국민보험: Class 4 8%'), t('statsPage.infoGBOverview3', '법인세: 19%~25%')] },
                                            registration: { title: t('statsPage.infoGBRegTitle', '사업자 등록'), items: [t('statsPage.infoGBReg0', 'HMRC에 자영업자 등록'), t('statsPage.infoGBReg1', '사업 개시 후 3개월 이내 등록'), t('statsPage.infoGBReg2', 'UTR(고유 납세자 번호) 신청'), t('statsPage.infoGBReg3', '매출 £85,000 초과 시 VAT 등록')] },
                                            deductions: { title: t('statsPage.infoGBDeductTitle', '주요 공제 항목'), items: [t('statsPage.infoGBDeduct0', '개인 면세한도: £12,570'), t('statsPage.infoGBDeduct1', '거래 면세한도: £1,000'), t('statsPage.infoGBDeduct2', '장비 자본지출 공제'), t('statsPage.infoGBDeduct3', '허용 사업 경비'), t('statsPage.infoGBDeduct4', '연금 기여금 세금 감면')] },
                                            deadlines: { title: t('statsPage.infoGBDeadlineTitle', '주요 신고 기한'), items: [t('statsPage.infoGBDeadline0', '자기평가(서면): 10월 31일'), t('statsPage.infoGBDeadline1', '자기평가(온라인): 1월 31일'), t('statsPage.infoGBDeadline2', 'VAT 신고: 분기'), t('statsPage.infoGBDeadline3', '선납: 1월 31일 및 7월 31일')] },
                                            links: [
                                                { label: 'HMRC', url: 'https://www.gov.uk/government/organisations/hm-revenue-customs' },
                                                { label: t('statsPage.infoGBLink1', 'GOV.UK 자영업자'), url: 'https://www.gov.uk/working-for-yourself' },
                                            ],
                                        },
                                        DE: {
                                            overview: { title: t('statsPage.infoDEOverviewTitle', '독일 세금 체계'), items: [t('statsPage.infoDEOverview0', '부가가치세(USt): 19% (경감세율 7%)'), t('statsPage.infoDEOverview1', '소득세: 14%~45% (누진세)'), t('statsPage.infoDEOverview2', '연대부담금: 소득세의 5.5%'), t('statsPage.infoDEOverview3', '영업세: 지자체별 상이')] },
                                            registration: { title: t('statsPage.infoDERegTitle', '사업자 등록'), items: [t('statsPage.infoDEReg0', '관할 상공회의소에 영업 등록'), t('statsPage.infoDEReg1', '세무 등록 양식 작성'), t('statsPage.infoDEReg2', '연방중앙세무청에 USt-IdNr. 신청'), t('statsPage.infoDEReg3', '소규모사업자 규정 선택(선택사항)')] },
                                            deductions: { title: t('statsPage.infoDEDeductTitle', '주요 공제 항목'), items: [t('statsPage.infoDEDeduct0', '기본면세: 11,604€ (2024)'), t('statsPage.infoDEDeduct1', '사업 경비'), t('statsPage.infoDEDeduct2', '특별경비(보험료)'), t('statsPage.infoDEDeduct3', '매입세액 공제'), t('statsPage.infoDEDeduct4', '재택근무실')] },
                                            deadlines: { title: t('statsPage.infoDEDeadlineTitle', '주요 신고 기한'), items: [t('statsPage.infoDEDeadline0', '소득세 신고: 7월 31일 (세무사 이용 시: 다음해 2월 말)'), t('statsPage.infoDEDeadline1', '부가세 예정신고: 월간/분기'), t('statsPage.infoDEDeadline2', '영업세 신고: 7월 31일')] },
                                            links: [
                                                { label: 'ELSTER', url: 'https://www.elster.de' },
                                                { label: t('statsPage.infoDELink1', '연방재무부'), url: 'https://www.bundesfinanzministerium.de' },
                                            ],
                                        },
                                        SG: {
                                            overview: { title: t('statsPage.infoSGOverviewTitle', '싱가포르 세금 체계'), items: [t('statsPage.infoSGOverview0', 'GST: 9% (2024)'), t('statsPage.infoSGOverview1', '개인소득세: 0%~22% (누진세)'), t('statsPage.infoSGOverview2', '법인세: 17% (단일세율)'), t('statsPage.infoSGOverview3', '양도차익세 없음')] },
                                            registration: { title: t('statsPage.infoSGRegTitle', '사업자 등록'), items: [t('statsPage.infoSGReg0', 'ACRA(acra.gov.sg) 등록'), t('statsPage.infoSGReg1', '매출 S$100만 초과 시 GST 등록'), t('statsPage.infoSGReg2', 'IRAS에 NRIC/FIN 세금 파일 신청'), t('statsPage.infoSGReg3', '개인사업 또는 유한회사(Pte Ltd) 선택')] },
                                            deductions: { title: t('statsPage.infoSGDeductTitle', '주요 공제 항목'), items: [t('statsPage.infoSGDeduct0', '근로소득 공제: 최대 S$8,000'), t('statsPage.infoSGDeduct1', 'CPF 공제'), t('statsPage.infoSGDeduct2', '교육비 공제'), t('statsPage.infoSGDeduct3', '국방의무 공제'), t('statsPage.infoSGDeduct4', '법인 부분 세금 면제')] },
                                            deadlines: { title: t('statsPage.infoSGDeadlineTitle', '주요 신고 기한'), items: [t('statsPage.infoSGDeadline0', '개인세: 4월 15일 (온라인: 4월 18일)'), t('statsPage.infoSGDeadline1', '법인세: 11월 30일 (ECI: 회계연도 종료 후 3개월)'), t('statsPage.infoSGDeadline2', 'GST 신고: 분기')] },
                                            links: [
                                                { label: 'IRAS', url: 'https://www.iras.gov.sg' },
                                                { label: 'ACRA', url: 'https://www.acra.gov.sg' },
                                            ],
                                        },
                                        CA: {
                                            overview: { title: t('statsPage.infoCAOverviewTitle', '캐나다 세금 체계'), items: [t('statsPage.infoCAOverview0', 'GST: 5% (연방), HST: 13~15% (일부 주)'), t('statsPage.infoCAOverview1', '연방 소득세: 15%~33% (5구간)'), t('statsPage.infoCAOverview2', '주 소득세: 주마다 상이 (4%~21%)'), t('statsPage.infoCAOverview3', 'CPP/EI 사회보험 기여금')] },
                                            registration: { title: t('statsPage.infoCARegTitle', '사업자 등록'), items: [t('statsPage.infoCAReg0', 'CRA(canada.ca)에 사업자 번호(BN) 신청'), t('statsPage.infoCAReg1', '연매출 C$30,000 초과 시 GST/HST 등록'), t('statsPage.infoCAReg2', '주 정부에 PST 등록 (해당 주)'), t('statsPage.infoCAReg3', '개인사업, 파트너십, 법인 중 선택')] },
                                            deductions: { title: t('statsPage.infoCADeductTitle', '주요 공제 항목'), items: [t('statsPage.infoCADeduct0', '기본 개인 면세: C$15,705 (2024)'), t('statsPage.infoCADeduct1', 'RRSP 기여금 공제'), t('statsPage.infoCADeduct2', '홈오피스 경비'), t('statsPage.infoCADeduct3', '사업 경비 (재료, 배송, 출장)'), t('statsPage.infoCADeduct4', 'CPP 자영업 기여금의 50%')] },
                                            deadlines: { title: t('statsPage.infoCADeadlineTitle', '주요 신고 기한'), items: [t('statsPage.infoCADeadline0', '개인 소득세: 4월 30일'), t('statsPage.infoCADeadline1', '자영업자: 6월 15일 (납부: 4월 30일)'), t('statsPage.infoCADeadline2', 'GST/HST 신고: 분기/연간'), t('statsPage.infoCADeadline3', '분할납부: 분기별')] },
                                            links: [
                                                { label: 'CRA', url: 'https://www.canada.ca/en/revenue-agency.html' },
                                                { label: t('statsPage.infoCALink1', '사업자 등록 안내'), url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses.html' },
                                            ],
                                        },
                                        VN: {
                                            overview: { title: t('statsPage.infoVNOverviewTitle', '베트남 세금 체계'), items: [t('statsPage.infoVNOverview0', 'VAT: 10% (표준), 5% (경감), 0% (수출)'), t('statsPage.infoVNOverview1', '개인소득세(PIT): 5%~35% (7구간)'), t('statsPage.infoVNOverview2', '법인세(CIT): 20%'), t('statsPage.infoVNOverview3', '특별소비세: 품목별 상이')] },
                                            registration: { title: t('statsPage.infoVNRegTitle', '사업자 등록'), items: [t('statsPage.infoVNReg0', '기획투자국에 사업자 등록'), t('statsPage.infoVNReg1', '세무서에 세금 코드 신청'), t('statsPage.infoVNReg2', '전자세금계산서 시스템 등록'), t('statsPage.infoVNReg3', '개인사업, 유한회사(LLC) 등 선택')] },
                                            deductions: { title: t('statsPage.infoVNDeductTitle', '주요 공제 항목'), items: [t('statsPage.infoVNDeduct0', '본인 공제: 월 1,100만 VND'), t('statsPage.infoVNDeduct1', '부양가족 1인당: 월 440만 VND'), t('statsPage.infoVNDeduct2', '사회보험료 공제'), t('statsPage.infoVNDeduct3', '자선/교육 기부금'), t('statsPage.infoVNDeduct4', '사업 관련 경비')] },
                                            deadlines: { title: t('statsPage.infoVNDeadlineTitle', '주요 신고 기한'), items: [t('statsPage.infoVNDeadline0', 'VAT 월간 신고: 매월 20일'), t('statsPage.infoVNDeadline1', '분기 VAT: 분기 종료 후 30일'), t('statsPage.infoVNDeadline2', '연간 PIT 정산: 3월 31일'), t('statsPage.infoVNDeadline3', '법인세 잠정신고: 분기별')] },
                                            links: [
                                                { label: t('statsPage.infoVNLink0', '베트남 세무총국'), url: 'https://www.gdt.gov.vn' },
                                                { label: t('statsPage.infoVNLink1', '전자세금계산서'), url: 'https://hoadondientu.gdt.gov.vn' },
                                            ],
                                        },
                                        TH: {
                                            overview: { title: t('statsPage.infoTHOverviewTitle', '태국 세금 체계'), items: [t('statsPage.infoTHOverview0', 'VAT: 7% (표준)'), t('statsPage.infoTHOverview1', '개인소득세(PIT): 0%~35% (8구간)'), t('statsPage.infoTHOverview2', '법인세(CIT): 20%'), t('statsPage.infoTHOverview3', '원천징수세: 1%~5%')] },
                                            registration: { title: t('statsPage.infoTHRegTitle', '사업자 등록'), items: [t('statsPage.infoTHReg0', '상무부(DBD)에 사업자 등록'), t('statsPage.infoTHReg1', '연매출 180만 바트 초과 시 VAT 등록'), t('statsPage.infoTHReg2', '세무서에 TIN(납세자번호) 발급'), t('statsPage.infoTHReg3', '개인사업, 파트너십, 유한회사 선택')] },
                                            deductions: { title: t('statsPage.infoTHDeductTitle', '주요 공제 항목'), items: [t('statsPage.infoTHDeduct0', '본인 공제: 6만 바트'), t('statsPage.infoTHDeduct1', '배우자 공제: 6만 바트'), t('statsPage.infoTHDeduct2', '자녀 공제: 1인당 3만 바트'), t('statsPage.infoTHDeduct3', '생명보험료: 최대 10만 바트'), t('statsPage.infoTHDeduct4', '사회보험 기여금')] },
                                            deadlines: { title: t('statsPage.infoTHDeadlineTitle', '주요 신고 기한'), items: [t('statsPage.infoTHDeadline0', '개인소득세(연간): 3월 31일'), t('statsPage.infoTHDeadline1', '반기 예정신고: 9월 30일'), t('statsPage.infoTHDeadline2', 'VAT 월별 신고: 매월 15일'), t('statsPage.infoTHDeadline3', '원천징수세: 매월 7일')] },
                                            links: [
                                                { label: t('statsPage.infoTHLink0', '태국 국세청'), url: 'https://www.rd.go.th' },
                                                { label: 'e-Filing', url: 'https://efiling.rd.go.th' },
                                            ],
                                        },
                                        KH: {
                                            overview: { title: t('statsPage.infoKHOverviewTitle', '캄보디아 세금 체계'), items: [t('statsPage.infoKHOverview0', 'VAT: 10%'), t('statsPage.infoKHOverview1', '사업이익세(ToP): 20%'), t('statsPage.infoKHOverview2', '급여세(ToS): 0%~20%'), t('statsPage.infoKHOverview3', '원천징수세: 4%~15%')] },
                                            registration: { title: t('statsPage.infoKHRegTitle', '사업자 등록'), items: [t('statsPage.infoKHReg0', '상무부에 사업자 등록'), t('statsPage.infoKHReg1', '세무총국(GDT)에 세금 등록'), t('statsPage.infoKHReg2', '연매출 2.5억 리엘 초과: 일반 납세자'), t('statsPage.infoKHReg3', '소규모 납세자: 간이 신고 가능')] },
                                            deductions: { title: t('statsPage.infoKHDeductTitle', '주요 공제 항목'), items: [t('statsPage.infoKHDeduct0', '사업 관련 직접 경비'), t('statsPage.infoKHDeduct1', '감가상각비'), t('statsPage.infoKHDeduct2', '대손상각금'), t('statsPage.infoKHDeduct3', 'QIP 투자 인센티브')] },
                                            deadlines: { title: t('statsPage.infoKHDeadlineTitle', '주요 신고 기한'), items: [t('statsPage.infoKHDeadline0', '월별 세금신고: 매월 20일'), t('statsPage.infoKHDeadline1', '연간 ToP: 3월 31일'), t('statsPage.infoKHDeadline2', 'VAT 월별: 매월 20일'), t('statsPage.infoKHDeadline3', '특허세(Patent Tax): 3월 31일')] },
                                            links: [
                                                { label: t('statsPage.infoKHLink0', '캄보디아 세무총국'), url: 'https://www.tax.gov.kh' },
                                                { label: 'e-Filing', url: 'https://efiling.tax.gov.kh' },
                                            ],
                                        },
                                        RU: {
                                            overview: { title: t('statsPage.infoRUOverviewTitle', '러시아 세금 체계'), items: [t('statsPage.infoRUOverview0', 'НДС(VAT): 20% (경감 10%)'), t('statsPage.infoRUOverview1', 'НДФЛ(PIT): 13%~15%'), t('statsPage.infoRUOverview2', '간이과세(USN): 매출 6% 또는 이익 15%'), t('statsPage.infoRUOverview3', '자영업세(НПД): 4%/6%')] },
                                            registration: { title: t('statsPage.infoRURegTitle', '사업자 등록'), items: [t('statsPage.infoRUReg0', '연방세무서(ФНС)에 ИП 등록'), t('statsPage.infoRUReg1', '세금 체계 선택: 일반/USN/НПД'), t('statsPage.infoRUReg2', 'Госуслуги 포털에서 온라인 등록'), t('statsPage.infoRUReg3', 'ИНН(납세자번호) 자동 발급')] },
                                            deductions: { title: t('statsPage.infoRUDeductTitle', '주요 공제 항목'), items: [t('statsPage.infoRUDeduct0', '표준 공제: 최대 3,000루블/월'), t('statsPage.infoRUDeduct1', '사회 공제(교육, 의료): 최대 120,000루블/년'), t('statsPage.infoRUDeduct2', '재산 공제(주택 구매)'), t('statsPage.infoRUDeduct3', 'USN "소득-경비" 시 사업 경비'), t('statsPage.infoRUDeduct4', '사회보험료(고정 기여금)')] },
                                            deadlines: { title: t('statsPage.infoRUDeadlineTitle', '주요 신고 기한'), items: [t('statsPage.infoRUDeadline0', 'НДФЛ 연간 신고(3-НДФЛ): 4월 30일'), t('statsPage.infoRUDeadline1', 'USN 연간 신고: 4월 30일(ИП)/3월 31일(법인)'), t('statsPage.infoRUDeadline2', 'НДС 분기 신고: 분기 종료 후 25일'), t('statsPage.infoRUDeadline3', '사회보험료: 매월 15일')] },
                                            links: [
                                                { label: t('statsPage.infoRULink0', '러시아 연방세무서'), url: 'https://www.nalog.gov.ru' },
                                                { label: t('statsPage.infoRULink1', '납세자 개인계정'), url: 'https://lkfl2.nalog.ru' },
                                            ],
                                        },
                                        UA: {
                                            overview: { title: t('statsPage.infoUAOverviewTitle', '우크라이나 세금 체계'), items: [t('statsPage.infoUAOverview0', 'ПДВ(VAT): 20% (경감 7%)'), t('statsPage.infoUAOverview1', 'ПДФО(PIT): 18%'), t('statsPage.infoUAOverview2', '간이과세: 그룹별 2%~5%'), t('statsPage.infoUAOverview3', '군사세: 1.5%')] },
                                            registration: { title: t('statsPage.infoUARegTitle', '사업자 등록'), items: [t('statsPage.infoUAReg0', '국가등록서비스에서 ФОП 등록'), t('statsPage.infoUAReg1', '세무서에 세금 체계 선택 신고'), t('statsPage.infoUAReg2', '간이과세 그룹 1~3 중 선택'), t('statsPage.infoUAReg3', '전자 캐비넷으로 온라인 관리')] },
                                            deductions: { title: t('statsPage.infoUADeductTitle', '주요 공제 항목'), items: [t('statsPage.infoUADeduct0', '세금 소셜 혜택(ПСП): 최저임금의 50%'), t('statsPage.infoUADeduct1', '교육비 공제'), t('statsPage.infoUADeduct2', '의료비 공제'), t('statsPage.infoUADeduct3', '주택 이자 공제'), t('statsPage.infoUADeduct4', '자선 기부금(4% 한도)')] },
                                            deadlines: { title: t('statsPage.infoUADeadlineTitle', '주요 신고 기한'), items: [t('statsPage.infoUADeadline0', '연간 ПДФО 신고: 5월 1일'), t('statsPage.infoUADeadline1', 'ФОП 분기 신고: 분기 종료 후 40일'), t('statsPage.infoUADeadline2', 'ЄСВ: 매월 19일'), t('statsPage.infoUADeadline3', 'ПДВ 월별: 매월 20일')] },
                                            links: [
                                                { label: t('statsPage.infoUALink0', '우크라이나 세무서'), url: 'https://tax.gov.ua' },
                                                { label: t('statsPage.infoUALink1', '전자 캐비넷'), url: 'https://cabinet.tax.gov.ua' },
                                            ],
                                        },
                                    };

                                    const info = countryInfo[taxCountry];
                                    if (!info) return null;

                                    const country = AVAILABLE_TAX_COUNTRIES.find(c => c.code === taxCountry);

                                    const sectionIcons = {
                                        overview: BarChart3,
                                        registration: FileText,
                                        deductions: DollarSign,
                                        deadlines: Calendar,
                                    };

                                    const sectionLabels = {
                                        overview: t('statsPage.taxOverview', '세금 체계 개요'),
                                        registration: t('statsPage.taxRegistration', '사업자 등록'),
                                        deductions: t('statsPage.taxDeductions', '주요 공제 항목'),
                                        deadlines: t('statsPage.taxDeadlines', '신고 기한'),
                                    };

                                    return (
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                            <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5">
                                                <MapPin size={16} className="text-emerald-600 dark:text-emerald-400" />
                                                {t('statsPage.taxCountryInfoTitle', '🌍 국가별 세무 정보')}
                                                <span className="text-sm">{country?.flag} {country?.name}</span>
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2.5">{t('statsPage.taxCountryInfoSubtitle', '각 국가의 세무 환경 안내')}</p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {['overview', 'registration', 'deductions', 'deadlines'].map(section => {
                                                    const data = info[section];
                                                    const SIcon = sectionIcons[section];
                                                    if (!data) return null;
                                                    return (
                                                        <div key={section} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white">
                                                                    <SIcon size={13} />
                                                                </div>
                                                                <h4 className="text-xs font-extrabold text-gray-900 dark:text-gray-100">{sectionLabels[section]}</h4>
                                                            </div>
                                                            <ul className="space-y-1.5">
                                                                {data.items.map((item, i) => (
                                                                    <li key={i} className="text-[11px] text-gray-600 dark:text-gray-300 flex items-start gap-1.5">
                                                                        <span className="text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0">•</span>
                                                                        <span>{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Useful Links */}
                                            {info.links && info.links.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <h4 className="text-xs font-extrabold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-1.5">
                                                        🔗 {t('statsPage.taxLinks', '유용한 링크')}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {info.links.map((link, i) => (
                                                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                                                                className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-700/50 rounded-lg text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-colors">
                                                                {link.label} ↗
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )
                    }

                    {/* ════ ANALYTICS TAB ════ */}
                    {
                        activeTab === 'analytics' && (
                            <div className="space-y-3">
                                {analyticsData ? (
                                    <>
                                        {/* Year Navigator (same as dashboard) */}
                                        <div className="flex items-center gap-1 mb-1">
                                            <button onClick={() => setDashboardYear(y => (y || new Date().getFullYear()) - 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                                                <ChevronDown size={16} className="rotate-90" />
                                            </button>
                                            <span className="text-sm font-extrabold text-gray-900 dark:text-white min-w-[80px] text-center">
                                                {dashboardYear ? `${dashboardYear}${t('statsPage.year', '년')}` : t('statsPage.allYears', '전체')}
                                            </span>
                                            <button onClick={() => setDashboardYear(y => !y ? null : y >= new Date().getFullYear() ? null : y + 1)}
                                                disabled={!dashboardYear}
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${!dashboardYear ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                                <ChevronDown size={16} className="-rotate-90" />
                                            </button>
                                            <button onClick={() => setDashboardYear(prev => prev === null ? new Date().getFullYear() : null)}
                                                className={`ml-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${!dashboardYear ? 'bg-indigo-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                                {t('statsPage.allData', '전체')}
                                            </button>
                                        </div>
                                        {/* ═══ Enhanced KPI Cards with SVG Infographics ═══ */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {/* Total Revenue — with mini area sparkline */}
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 relative overflow-hidden group hover:shadow-lg transition-all">
                                                <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"><DollarSign size={80} /></div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-200 dark:shadow-emerald-900">
                                                        <DollarSign size={17} className="text-white" />
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-tight">{t('statsPage.analyticsTotalRev', '총 매출')}</p>
                                                </div>
                                                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{formatRevenue(analyticsData.totalRevenue)}</p>
                                                <p className="text-[9px] text-gray-400 mt-0.5">{t('statsPage.analyticsTotalTx', '총 거래건수')}: {analyticsData.totalTx.toLocaleString()}</p>
                                                {/* SVG Area Sparkline */}
                                                {analyticsData.monthlyTrend.length > 1 && (() => {
                                                    const data = analyticsData.monthlyTrend;
                                                    const mx = Math.max(...data.map(x => x.revenue), 1);
                                                    const w = 140; const h = 32;
                                                    const pts = data.map((m, i) => `${(i / (data.length - 1)) * w},${h - (m.revenue / mx) * (h - 4)}`);
                                                    return (
                                                        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="mt-2" preserveAspectRatio="none">
                                                            <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.3" /><stop offset="100%" stopColor="#10b981" stopOpacity="0.02" /></linearGradient></defs>
                                                            <polygon points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill="url(#areaGrad)" />
                                                            <polyline points={pts.join(' ')} fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <circle cx={w} cy={h - (data[data.length - 1].revenue / mx) * (h - 4)} r="2.5" fill="#10b981" className="animate-pulse" />
                                                        </svg>
                                                    );
                                                })()}
                                            </div>
                                            {/* Profit Margin — with SVG Radial Gauge */}
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 relative overflow-hidden group hover:shadow-lg transition-all">
                                                <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"><TrendingUp size={80} /></div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-200 dark:shadow-blue-900">
                                                        <TrendingUp size={17} className="text-white" />
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-tight">{t('statsPage.analyticsProfit', '이익 마진')}</p>
                                                </div>
                                                {/* SVG Radial Gauge */}
                                                {(() => {
                                                    const pct = Math.min(100, Math.max(0, parseFloat(analyticsData.profitMargin)));
                                                    const r = 28; const circ = 2 * Math.PI * r;
                                                    const dashVal = (pct / 100) * circ * 0.75; // 270-degree arc
                                                    const color = pct >= 50 ? '#10b981' : pct >= 20 ? '#f59e0b' : '#ef4444';
                                                    return (
                                                        <div className="flex items-center gap-3">
                                                            <svg width="68" height="68" viewBox="0 0 68 68" className="flex-shrink-0">
                                                                <circle cx="34" cy="34" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} transform="rotate(135 34 34)" className="dark:stroke-gray-700" />
                                                                <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${dashVal} ${circ}`} transform="rotate(135 34 34)" className="transition-all duration-1000" />
                                                                <text x="34" y="32" textAnchor="middle" className="fill-gray-900 dark:fill-white text-[13px] font-extrabold">{analyticsData.profitMargin}%</text>
                                                                <text x="34" y="42" textAnchor="middle" className="fill-gray-400 text-[7px] font-medium">{t('statsPage.marginRate', '마진율')}</text>
                                                            </svg>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-1 text-[9px]">
                                                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                                    <span className="text-gray-400 truncate">{t('statsPage.plRevenue', '매출')}</span>
                                                                    <span className="font-bold text-gray-600 dark:text-gray-300 ml-auto">{formatRevenue(analyticsData.totalRevenue)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-[9px] mt-0.5">
                                                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                                                    <span className="text-gray-400 truncate">{t('statsPage.plCost', '원가')}</span>
                                                                    <span className="font-bold text-gray-600 dark:text-gray-300 ml-auto">{formatRevenue(analyticsData.totalCost)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                            {/* MoM Growth — with bar sparkline & arrow */}
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 relative overflow-hidden group hover:shadow-lg transition-all">
                                                <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">{analyticsData.growth > 0 ? <ArrowUp size={80} /> : <ArrowDown size={80} />}</div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-9 h-9 bg-gradient-to-br ${analyticsData.growth > 0 ? 'from-emerald-500 to-green-600 shadow-emerald-200 dark:shadow-emerald-900' : 'from-red-500 to-rose-600 shadow-red-200 dark:shadow-red-900'} rounded-xl flex items-center justify-center shadow-sm`}>
                                                        {analyticsData.growth > 0 ? <ArrowUp size={17} className="text-white" /> : <ArrowDown size={17} className="text-white" />}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-tight">{t('statsPage.analyticsGrowth', '전월 대비')}</p>
                                                </div>
                                                <p className={`text-xl font-extrabold ${analyticsData.growth > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {analyticsData.growth !== null ? `${analyticsData.growth > 0 ? '+' : ''}${analyticsData.growth}%` : '-'}
                                                </p>
                                                {/* Mini Growth Bar Chart */}
                                                {analyticsData.monthlyGrowthRates?.length > 0 && (
                                                    <div className="flex items-end gap-[3px] h-7 mt-2">
                                                        {analyticsData.monthlyGrowthRates.slice(-8).map((g, i) => {
                                                            const rate = g.rate || 0;
                                                            const absMax = Math.max(...analyticsData.monthlyGrowthRates.slice(-8).map(x => Math.abs(x.rate || 0)), 1);
                                                            return (
                                                                <div key={i} className="flex-1 flex flex-col justify-end items-center" style={{ height: '100%' }}>
                                                                    <div className={`w-full rounded-t-sm transition-all ${rate >= 0 ? 'bg-gradient-to-t from-emerald-400 to-emerald-300 dark:from-emerald-700 dark:to-emerald-600' : 'bg-gradient-to-t from-red-400 to-red-300 dark:from-red-700 dark:to-red-600'}`}
                                                                        style={{ height: `${Math.max(3, (Math.abs(rate) / absMax) * 100)}%` }}
                                                                        title={g.rate !== null ? `${g.month}: ${g.rate}%` : ''} />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Forecast — with progress ring */}
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 relative overflow-hidden group hover:shadow-lg transition-all">
                                                <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"><Target size={80} /></div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm shadow-violet-200 dark:shadow-violet-900">
                                                        <Target size={17} className="text-white" />
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-tight">{t('statsPage.analyticsForecast', '다음달 예측')}</p>
                                                </div>
                                                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{analyticsData.forecast ? formatRevenue(analyticsData.forecast) : '-'}</p>
                                                {analyticsData.annualRunRate && <p className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span> {t('statsPage.annualRunRate', '연간 환산')}: {formatRevenue(analyticsData.annualRunRate)}</p>}
                                                {analyticsData.quarterForecast && <p className="text-[9px] text-violet-500 dark:text-violet-400 font-bold mt-0.5 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span> {t('statsPage.quarterForecast', '분기 예측')}: {formatRevenue(analyticsData.quarterForecast)}</p>}
                                                {/* Forecast confidence mini bar */}
                                                {analyticsData.goalProbability !== null && (
                                                    <div className="mt-2">
                                                        <div className="flex justify-between text-[8px] text-gray-400 mb-0.5">
                                                            <span>{t('statsPage.confidence', '달성확률')}</span>
                                                            <span className="font-bold">{analyticsData.goalProbability}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                                            <div className={`h-1.5 rounded-full transition-all duration-700 ${analyticsData.goalProbability >= 70 ? 'bg-gradient-to-r from-violet-500 to-purple-400' : analyticsData.goalProbability >= 40 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-rose-400'}`}
                                                                style={{ width: `${analyticsData.goalProbability}%` }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* ═══ Revenue Health Score Infographic ═══ */}
                                        {(() => {
                                            const margin = parseFloat(analyticsData.profitMargin) || 0;
                                            const growth = analyticsData.growth || 0;
                                            const goalProb = analyticsData.goalProbability || 0;
                                            // Composite health: margin(40%) + growth(30%) + goal(30%)
                                            const marginScore = Math.min(100, margin * 2);
                                            const growthScore = Math.min(100, Math.max(0, growth * 2 + 50));
                                            const goalScore = goalProb;
                                            const healthScore = Math.round(marginScore * 0.4 + growthScore * 0.3 + goalScore * 0.3);
                                            const healthColor = healthScore >= 70 ? '#10b981' : healthScore >= 40 ? '#f59e0b' : '#ef4444';
                                            const healthLabel = healthScore >= 70 ? t('statsPage.healthExcellent', '우수') : healthScore >= 40 ? t('statsPage.healthGood', '양호') : t('statsPage.healthCaution', '주의');
                                            const r = 42; const circ = 2 * Math.PI * r;
                                            const dashVal = (healthScore / 100) * circ;

                                            // Additional metrics
                                            const avgRevPerTx = dashKPI.totalTransactions > 0 ? Math.round(dashKPI.totalRevenue / dashKPI.totalTransactions) : 0;
                                            const txEfficiency = dashKPI.totalTransactions > 0 ? Math.min(100, Math.round((avgRevPerTx / (dashKPI.totalRevenue / Math.max(dashKPI.totalCount, 1))) * 50)) : 0;
                                            const stabilityScore = dashKPI.last12Months && dashKPI.last12Months.length >= 3 ? (() => {
                                                const revenues = dashKPI.last12Months.map(m => m.revenue);
                                                const avg = revenues.reduce((a, b) => a + b, 0) / revenues.length;
                                                if (avg === 0) return 0;
                                                const variance = revenues.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / revenues.length;
                                                const cv = Math.sqrt(variance) / avg;
                                                return Math.min(100, Math.round((1 - Math.min(cv, 1)) * 100));
                                            })() : 50;

                                            return (
                                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-5">
                                                        {/* Health Ring */}
                                                        <div className="relative flex-shrink-0">
                                                            <svg width="100" height="100" viewBox="0 0 100 100">
                                                                <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="6" className="dark:stroke-gray-700" />
                                                                <circle cx="50" cy="50" r={r} fill="none" stroke={healthColor} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${dashVal} ${circ}`} transform="rotate(-90 50 50)" className="transition-all duration-1000" />
                                                            </svg>
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                <span className="text-2xl font-extrabold" style={{ color: healthColor }}>{healthScore}</span>
                                                                <span className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase">{healthLabel}</span>
                                                            </div>
                                                        </div>
                                                        {/* Description */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                                                                <Zap size={14} className="text-amber-500" />
                                                                {t('statsPage.revenueHealthScore', '매출 건강 점수')}
                                                            </h3>
                                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">{t('statsPage.healthDesc', '마진율, 성장률, 목표달성률을 종합한 비즈니스 상태 지표')}</p>
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                                                {[
                                                                    { label: t('statsPage.marginRate', '마진율'), value: `${margin}%`, score: marginScore, color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800/40' },
                                                                    { label: t('statsPage.analyticsGrowth', '성장률'), value: `${growth > 0 ? '+' : ''}${growth}%`, score: growthScore, color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800/40' },
                                                                    { label: t('statsPage.goalAchieve', '목표달성'), value: `${goalProb}%`, score: goalScore, color: '#8b5cf6', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800/40' },
                                                                    { label: t('statsPage.txEfficiency', '거래효율'), value: avgRevPerTx > 0 ? formatRevenue(avgRevPerTx) : '-', score: txEfficiency, color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800/40' },
                                                                    { label: t('statsPage.stability', '안정성'), value: `${stabilityScore}${t('statsPage.scoreSuffix', '점')}`, score: stabilityScore, color: '#ec4899', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-800/40' },
                                                                ].map((item, i) => (
                                                                    <div key={i} className={`${item.bg} rounded-xl p-2.5 border ${item.border}`}>
                                                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-0.5">{item.label}</p>
                                                                        <p className="text-sm font-extrabold" style={{ color: item.color }}>{item.value}</p>
                                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1.5">
                                                                            <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* ═══ CRM Alert Center ═══ */}
                                        {crmAlerts && crmAlerts.alerts?.length > 0 && (() => {
                                            const visibleAlerts = crmAlerts.alerts.filter(a => !dismissedAlerts.includes(`${a.type}-${a.customer_id}`));
                                            if (visibleAlerts.length === 0) return null;
                                            const priorityConfig = {
                                                high: { border: 'border-red-300 dark:border-red-700', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', badge: 'bg-red-500' },
                                                medium: { border: 'border-amber-300 dark:border-amber-700', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-500' },
                                                low: { border: 'border-blue-300 dark:border-blue-700', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-500' },
                                            };
                                            return (
                                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white flex items-center justify-between">
                                                        <h3 className="font-extrabold text-sm flex items-center gap-2">
                                                            <AlertTriangle size={16} />
                                                            {t('statsPage.alertTitle', '🔔 CRM 알림 센터')}
                                                            <span className="bg-white/20 rounded-full px-2 py-0.5 text-[10px]">{visibleAlerts.length}</span>
                                                        </h3>
                                                    </div>
                                                    <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                                                        {visibleAlerts.slice(0, 8).map((alert, i) => {
                                                            const cfg = priorityConfig[alert.priority] || priorityConfig.low;
                                                            const alertKey = `${alert.type}-${alert.customer_id}`;
                                                            return (
                                                                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.border} ${cfg.bg} transition-all hover:scale-[1.005]`}>
                                                                    <span className="text-lg mt-0.5">{alert.icon}</span>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <p className={`text-xs font-extrabold ${cfg.text}`}>{alert.title}</p>
                                                                            <span className={`${cfg.badge} text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase`}>
                                                                                {alert.priority === 'high' ? t('statsPage.alertHigh', '긴급') : alert.priority === 'medium' ? t('statsPage.alertMedium', '중요') : t('statsPage.alertLow', '참고')}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{alert.message}</p>
                                                                    </div>
                                                                    <button onClick={() => dismissAlert(alertKey)}
                                                                        className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors flex-shrink-0 mt-1">
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        {alertsLoading && (
                                            <div className="text-center py-2">
                                                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                            </div>
                                        )}

                                        {/* Revenue Trend Chart — Premium */}
                                        {(() => {
                                            const trendData = analyticsData.monthlyTrend;
                                            const maxVal = analyticsData.maxMonthly;
                                            const CHART_H = 200;
                                            const gridSteps = 4;
                                            const gridValues = Array.from({ length: gridSteps + 1 }, (_, i) => Math.round(maxVal / gridSteps * (gridSteps - i)));
                                            return (
                                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                                    {/* Header */}
                                                    <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                                                                <BarChart3 size={16} className="text-white" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-sm">{t('statsPage.analyticsTrend', '매출 트렌드')}</h3>
                                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{t('statsPage.last12Months', '최근 12개월')}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {/* Summary KPIs */}
                                                            {trendData.filter(m => m.revenue > 0).length > 0 && (
                                                                <div className="flex gap-3">
                                                                    <div className="text-right">
                                                                        <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">{t('statsPage.trendMax', '최고')}</p>
                                                                        <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{formatRevenue(Math.max(...trendData.map(m => m.revenue)))}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">{t('statsPage.trendAvg', '평균')}</p>
                                                                        <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{formatRevenue(Math.round(trendData.reduce((s, m) => s + m.revenue, 0) / Math.max(1, trendData.filter(m => m.revenue > 0).length)))}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Chart Area */}
                                                    <div className="px-5 pb-4">
                                                        <div className="flex">
                                                            {/* Y-Axis Labels */}
                                                            <div className="flex flex-col justify-between pr-2 py-1" style={{ height: `${CHART_H}px` }}>
                                                                {gridValues.map((v, i) => (
                                                                    <span key={i} className="text-[9px] text-gray-400 dark:text-gray-500 font-medium tabular-nums text-right" style={{ minWidth: '40px' }}>
                                                                        {currency === 'KRW' ? (v >= 10000 ? `${(v / 10000).toFixed(v >= 100000 ? 0 : 1)}만` : v >= 1000 ? `${(v / 1000).toFixed(0)}천` : v.toLocaleString()) : v.toLocaleString()}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            {/* Grid + Bars */}
                                                            <div className="flex-1 relative" style={{ height: `${CHART_H}px` }}>
                                                                {/* Grid lines */}
                                                                {gridValues.map((_, i) => (
                                                                    <div key={i}
                                                                        className="absolute left-0 right-0 border-t border-gray-100 dark:border-gray-700/50"
                                                                        style={{ top: `${(i / gridSteps) * 100}%` }}
                                                                    />
                                                                ))}
                                                                {/* Bars */}
                                                                <div className="relative flex items-end gap-[3px] h-full px-1">
                                                                    {trendData.map((m, i) => {
                                                                        const pct = maxVal > 0 ? (m.revenue / maxVal) : 0;
                                                                        const barH = Math.max(pct > 0 ? 4 : 2, pct * (CHART_H - 8));
                                                                        const prevRev = i > 0 ? trendData[i - 1].revenue : null;
                                                                        const growthPct = prevRev && prevRev > 0 ? ((m.revenue - prevRev) / prevRev * 100).toFixed(1) : null;
                                                                        const isPositive = growthPct !== null && parseFloat(growthPct) >= 0;
                                                                        return (
                                                                            <div key={i} className="flex-1 flex flex-col items-center group relative" style={{ height: '100%', justifyContent: 'flex-end', minWidth: 0 }}>
                                                                                {/* Hover tooltip */}
                                                                                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20" style={{ minWidth: '120px' }}>
                                                                                    <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg px-3 py-2 shadow-xl text-center">
                                                                                        <p className="text-[10px] font-medium text-gray-300 dark:text-gray-600">{m.month.slice(0, 4)}년 {parseInt(m.month.slice(5))}월</p>
                                                                                        <p className="text-sm font-extrabold">{formatRevenue(m.revenue)}</p>
                                                                                        {growthPct !== null && parseFloat(growthPct) !== 0 && (
                                                                                            <p className={`text-[10px] font-bold mt-0.5 ${isPositive ? 'text-emerald-400 dark:text-emerald-600' : 'text-red-400 dark:text-red-600'}`}>
                                                                                                {isPositive ? '▲' : '▼'} {Math.abs(parseFloat(growthPct))}%
                                                                                            </p>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="mx-auto w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45 -mt-1" />
                                                                                </div>
                                                                                {/* Bar */}
                                                                                <div
                                                                                    className={`w-full rounded-t-md transition-all duration-500 cursor-pointer
                                                                                    ${m.revenue > 0 ? 'bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 group-hover:from-emerald-500 group-hover:via-emerald-400 group-hover:to-teal-300 shadow-sm' : 'bg-gray-200 dark:bg-gray-700'}`}
                                                                                    style={{ height: `${barH}px`, maxWidth: '32px', margin: '0 auto' }}
                                                                                />
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* X-Axis Labels */}
                                                        <div className="flex gap-[3px] mt-1.5 pl-[48px] pr-1">
                                                            {trendData.map((m, i) => (
                                                                <div key={i} className="flex-1 text-center" style={{ minWidth: 0 }}>
                                                                    <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium truncate block">
                                                                        {parseInt(m.month.slice(5))}월
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* Footer */}
                                                    <div className="px-5 py-2.5 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                                            {trendData.length > 0 && `${trendData[0].month.slice(0, 4)}.${parseInt(trendData[0].month.slice(5))} ~ ${trendData[trendData.length - 1].month.slice(0, 4)}.${parseInt(trendData[trendData.length - 1].month.slice(5))}`}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                                            {currency === 'KRW' ? t('statsPage.analyticsUnit', '단위: 만원') : `${t('statsPage.analyticsUnitGeneric', '단위')}: ${currency}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Channel & Category Breakdown — with SVG Donut Charts */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Top Channels — Donut + List */}
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-shadow">
                                                <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-sm mb-3 flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center"><BarChart3 size={12} className="text-white" /></div>
                                                    {t('statsPage.analyticsChannels', '채널별 매출')}
                                                </h3>
                                                {(() => {
                                                    const entries = analyticsData.topChannels.slice(0, 5);
                                                    const total = entries.reduce((s, e) => s + e[1], 0);
                                                    const donutColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];
                                                    const radius = 36; const circ = 2 * Math.PI * radius;
                                                    let acc = 0;
                                                    return (
                                                        <div className="flex gap-4 items-center">
                                                            <svg width="90" height="90" viewBox="0 0 90 90" className="flex-shrink-0">
                                                                <circle cx="45" cy="45" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" className="dark:stroke-gray-700" />
                                                                {entries.map((entry, i) => {
                                                                    const pct = total > 0 ? entry[1] / total : 0;
                                                                    const dash = pct * circ;
                                                                    const offset = -acc * circ + circ * 0.25;
                                                                    acc += pct;
                                                                    return <circle key={i} cx="45" cy="45" r={radius} fill="none" stroke={donutColors[i]} strokeWidth="10" strokeLinecap="butt" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={offset} className="transition-all duration-700" />;
                                                                })}
                                                                <text x="45" y="43" textAnchor="middle" className="fill-gray-900 dark:fill-white text-[10px] font-extrabold">{entries.length}</text>
                                                                <text x="45" y="52" textAnchor="middle" className="fill-gray-400 text-[7px]">{t('statsPage.channels', '채널')}</text>
                                                            </svg>
                                                            <div className="flex-1 space-y-1.5">
                                                                {entries.map(([name, rev], i) => {
                                                                    const pct = total > 0 ? (rev / total * 100).toFixed(1) : 0;
                                                                    return (
                                                                        <div key={i} className="flex items-center gap-2">
                                                                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: donutColors[i] }} />
                                                                            <span className="text-[10px] text-gray-700 dark:text-gray-300 font-bold truncate flex-1">{name}</span>
                                                                            <span className="text-[10px] font-extrabold text-gray-900 dark:text-white">{pct}%</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {/* Top Categories — Donut + List */}
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-shadow">
                                                <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-sm mb-3 flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center"><PieChart size={12} className="text-white" /></div>
                                                    {t('statsPage.analyticsCategories', '카테고리별 매출')}
                                                </h3>
                                                {(() => {
                                                    const entries = analyticsData.topCategories.slice(0, 5);
                                                    const total = entries.reduce((s, e) => s + e[1], 0);
                                                    const donutColors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
                                                    const radius = 36; const circ = 2 * Math.PI * radius;
                                                    let acc = 0;
                                                    return (
                                                        <div className="flex gap-4 items-center">
                                                            <svg width="90" height="90" viewBox="0 0 90 90" className="flex-shrink-0">
                                                                <circle cx="45" cy="45" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" className="dark:stroke-gray-700" />
                                                                {entries.map((entry, i) => {
                                                                    const pct = total > 0 ? entry[1] / total : 0;
                                                                    const dash = pct * circ;
                                                                    const offset = -acc * circ + circ * 0.25;
                                                                    acc += pct;
                                                                    return <circle key={i} cx="45" cy="45" r={radius} fill="none" stroke={donutColors[i]} strokeWidth="10" strokeLinecap="butt" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={offset} className="transition-all duration-700" />;
                                                                })}
                                                                <text x="45" y="43" textAnchor="middle" className="fill-gray-900 dark:fill-white text-[10px] font-extrabold">{entries.length}</text>
                                                                <text x="45" y="52" textAnchor="middle" className="fill-gray-400 text-[7px]">{t('statsPage.categories', '카테고리')}</text>
                                                            </svg>
                                                            <div className="flex-1 space-y-1.5">
                                                                {entries.map(([name, rev], i) => {
                                                                    const pct = total > 0 ? (rev / total * 100).toFixed(1) : 0;
                                                                    return (
                                                                        <div key={i} className="flex items-center gap-2">
                                                                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: donutColors[i] }} />
                                                                            <span className="text-[10px] text-gray-700 dark:text-gray-300 font-bold truncate flex-1">{name}</span>
                                                                            <span className="text-[10px] font-extrabold text-gray-900 dark:text-white">{pct}%</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        {/* ═══ Sales Forecast ═══ */}
                                        {analyticsData.forecastMonths?.length > 0 && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4 text-white">
                                                    <h3 className="font-extrabold text-sm flex items-center gap-2">
                                                        <Target size={16} />
                                                        {t('statsPage.forecastTitle', '🔮 매출 예측')}
                                                    </h3>
                                                    <p className="text-[10px] opacity-70 mt-1">{t('statsPage.forecastDesc', '이동 평균 + 시즌 보정 기반 향후 3개월 예측')}</p>
                                                </div>
                                                <div className="p-5 space-y-4">
                                                    {/* Forecast chart */}
                                                    <div className="flex items-end gap-2 h-32">
                                                        {/* Show last 3 actual months */}
                                                        {analyticsData.monthlyTrend.slice(-3).map((m, i) => {
                                                            const allVals = [...analyticsData.monthlyTrend.slice(-3).map(x => x.revenue), ...analyticsData.forecastMonths.map(x => x.value)];
                                                            const maxV = Math.max(...allVals, 1);
                                                            const barH = Math.max(4, (m.revenue / maxV) * 100);
                                                            return (
                                                                <div key={`actual-${i}`} className="flex-1 flex flex-col items-center gap-1">
                                                                    <span className="text-[9px] font-bold text-gray-600 dark:text-gray-300">{formatRevenue(m.revenue)}</span>
                                                                    <div className="w-full rounded-t-lg relative" style={{ height: `${barH}px` }}>
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" />
                                                                    </div>
                                                                    <span className="text-[9px] text-gray-400">{m.month.slice(5)}월</span>
                                                                </div>
                                                            );
                                                        })}
                                                        {/* Divider */}
                                                        <div className="w-px h-24 border-l-2 border-dashed border-gray-300 dark:border-gray-600 mx-1" />
                                                        {/* Predicted months */}
                                                        {analyticsData.forecastMonths.map((f, i) => {
                                                            const allVals = [...analyticsData.monthlyTrend.slice(-3).map(x => x.revenue), ...analyticsData.forecastMonths.map(x => x.value)];
                                                            const maxV = Math.max(...allVals, 1);
                                                            const barH = Math.max(4, (f.value / maxV) * 100);
                                                            return (
                                                                <div key={`forecast-${i}`} className="flex-1 flex flex-col items-center gap-1">
                                                                    <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400">{formatRevenue(f.value)}</span>
                                                                    <div className="w-full rounded-t-lg relative" style={{ height: `${barH}px` }}>
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-400 to-cyan-300 dark:from-cyan-600 dark:to-cyan-500 rounded-t-lg opacity-70 border-2 border-dashed border-cyan-500" />
                                                                    </div>
                                                                    <span className="text-[9px] text-cyan-500">{f.month.slice(5)}월</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="flex items-center justify-center gap-4">
                                                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500" /><span className="text-[10px] text-gray-400">{t('statsPage.forecastActual', '실적')}</span></div>
                                                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-cyan-400 border border-dashed border-cyan-500" /><span className="text-[10px] text-gray-400">{t('statsPage.forecastPredicted', '예측')}</span></div>
                                                    </div>

                                                    {/* Forecast KPIs */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                                                        <div className="bg-teal-50 dark:bg-teal-900/30 rounded-xl p-3 text-center">
                                                            <p className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase">{t('statsPage.forecastYtd', 'YTD 매출')}</p>
                                                            <p className="text-sm font-extrabold text-teal-700 dark:text-teal-300">{formatRevenue(analyticsData.ytdRevenue || 0)}</p>
                                                        </div>
                                                        <div className="bg-cyan-50 dark:bg-cyan-900/30 rounded-xl p-3 text-center">
                                                            <p className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 uppercase">{t('statsPage.forecastAnnual', '연간 전망')}</p>
                                                            <p className="text-sm font-extrabold text-cyan-700 dark:text-cyan-300">{formatRevenue(analyticsData.annualRunRate || 0)}</p>
                                                        </div>
                                                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3 text-center">
                                                            <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase">{t('statsPage.forecastQuarter', '분기 예측')}</p>
                                                            <p className="text-sm font-extrabold text-blue-700 dark:text-blue-300">{formatRevenue(analyticsData.quarterForecast || 0)}</p>
                                                        </div>
                                                        {analyticsData.goalProbability !== null && (
                                                            <div className="bg-violet-50 dark:bg-violet-900/30 rounded-xl p-3 text-center">
                                                                <p className="text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase">{t('statsPage.forecastGoalProb', '목표 달성률')}</p>
                                                                <p className={`text-sm font-extrabold ${analyticsData.goalProbability >= 70 ? 'text-emerald-600' : analyticsData.goalProbability >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                                                                    {analyticsData.goalProbability}%
                                                                </p>
                                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
                                                                    <div className={`h-1.5 rounded-full transition-all ${analyticsData.goalProbability >= 70 ? 'bg-emerald-500' : analyticsData.goalProbability >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                                        style={{ width: `${analyticsData.goalProbability}%` }} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Detailed P&L Statement */}
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                                                <h3 className="font-extrabold text-sm flex items-center gap-2">
                                                    <FileText size={16} />
                                                    {t('statsPage.plStatement', '📋 손익계산서')}
                                                </h3>
                                                <p className="text-[10px] opacity-70 mt-1">{t('statsPage.plStatementDesc', '매출 및 지출을 기반으로 한 상세 손익 분석')}</p>
                                            </div>
                                            {(() => {
                                                const totalRevenue = analyticsData.totalRevenue || 0;
                                                const totalCost = analyticsData.totalCost || 0;
                                                const grossProfit = totalRevenue - totalCost;
                                                const grossMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;
                                                const totalExpense = parseInt(expenseSummary?.totals?.total_expense || 0);
                                                const operatingProfit = grossProfit - totalExpense;
                                                const operatingMargin = totalRevenue > 0 ? ((operatingProfit / totalRevenue) * 100).toFixed(1) : 0;

                                                const PLRow = ({ label, amount, bold, border = true, color, indent }) => (
                                                    <div className={`flex items-center justify-between py-2.5 px-5 ${border ? 'border-t border-gray-200 dark:border-gray-700' : ''} ${bold ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}>
                                                        <span className={`text-xs ${bold ? 'font-extrabold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'} ${indent ? 'pl-4' : ''}`}>{label}</span>
                                                        <span className={`text-xs font-bold ${color || 'text-gray-900 dark:text-gray-100'}`}>{formatRevenue(amount)}</span>
                                                    </div>
                                                );

                                                return (
                                                    <div>
                                                        <PLRow label={t('statsPage.plRevenue', '매출액')} amount={totalRevenue} bold={true} border={false} color="text-emerald-600" />
                                                        <PLRow label={t('statsPage.plCost', '(-) 매출원가')} amount={totalCost} indent={true} color="text-red-500" />
                                                        <PLRow label={t('statsPage.plGrossProfit', '매출총이익')} amount={grossProfit} bold={true} border={true} color={grossProfit >= 0 ? 'text-emerald-600' : 'text-red-600'} />
                                                        <div className="flex items-center justify-between py-2 px-5">
                                                            <span className="text-[10px] text-gray-400">{t('statsPage.plGrossMargin', '매출총이익률')}</span>
                                                            <span className="text-[10px] font-bold text-gray-400">{grossMargin}%</span>
                                                        </div>

                                                        {/* Expense Breakdown */}
                                                        <div className="border-t border-gray-100">
                                                            <PLRow label={t('statsPage.plExpenses', '(-) 판매관리비')} amount={totalExpense} bold={true} border={false} color="text-red-500" />
                                                            {expenseSummary?.categoryBreakdown?.slice(0, 5).map(cat => (
                                                                <PLRow key={cat.category} label={`  • ${getExpenseCatLabel(cat.category)}`} amount={cat.total} indent={true} color="text-gray-500" />
                                                            ))}
                                                            {(expenseSummary?.categoryBreakdown?.length || 0) > 5 && (
                                                                <div className="flex items-center justify-between py-1.5 px-5 pl-9">
                                                                    <span className="text-[10px] text-gray-400 italic">+{(expenseSummary?.categoryBreakdown?.length || 0) - 5} {t('statsPage.plMore', '기타')}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Operating Profit */}
                                                        <div className={`border-t-2 ${operatingProfit >= 0 ? 'border-emerald-300 dark:border-emerald-600' : 'border-red-300 dark:border-red-600'}`}>
                                                            <div className="flex items-center justify-between py-3 px-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800">
                                                                <span className="text-sm font-extrabold text-gray-900 dark:text-gray-100">{t('statsPage.plOperatingProfit', '영업이익')}</span>
                                                                <span className={`text-sm font-extrabold ${operatingProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                                                    {operatingProfit >= 0 ? '+' : ''}{formatRevenue(operatingProfit)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between pb-3 px-5">
                                                                <span className="text-[10px] text-gray-400">{t('statsPage.plOperatingMargin', '영업이익률')}</span>
                                                                <span className={`text-[10px] font-bold ${operatingProfit >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>{operatingMargin}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* ═══ Year-over-Year Comparison ═══ */}
                                        {analyticsData.yearOverYear?.some(y => y.thisYear > 0 || y.lastYear > 0) && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                                <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5 text-sm">
                                                    <Calendar size={16} className="text-indigo-600" />
                                                    {t('statsPage.analyticsYoY', '📅 전년 대비 비교')}
                                                </h3>
                                                <div className="flex items-end gap-1 h-36">
                                                    {analyticsData.yearOverYear.map((m, i) => {
                                                        const maxVal = Math.max(...analyticsData.yearOverYear.map(y => Math.max(y.thisYear, y.lastYear)), 1);
                                                        const thisH = Math.max(2, (m.thisYear / maxVal) * 100);
                                                        const lastH = Math.max(2, (m.lastYear / maxVal) * 100);
                                                        return (
                                                            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                                                                <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: '100px' }}>
                                                                    <div className="w-[40%] bg-gradient-to-t from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-500 rounded-t" style={{ height: `${lastH}px` }} title={`${new Date().getFullYear() - 1}: ${m.lastYear.toLocaleString()}`} />
                                                                    <div className="w-[40%] bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t" style={{ height: `${thisH}px` }} title={`${new Date().getFullYear()}: ${m.thisYear.toLocaleString()}`} />
                                                                </div>
                                                                <span className="text-[9px] text-gray-400 font-medium">{m.month}월</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="flex items-center justify-center gap-4 mt-3">
                                                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-300 dark:bg-gray-600" /><span className="text-[10px] text-gray-400">{new Date().getFullYear() - 1}년</span></div>
                                                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500" /><span className="text-[10px] text-gray-400">{new Date().getFullYear()}년</span></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ═══ Region Analysis ═══ */}
                                        {analyticsData.topRegions?.length > 0 && analyticsData.topRegions[0].name !== 'N/A' && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                                <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5 text-sm">
                                                    <MapPin size={16} className="text-rose-500" />
                                                    {t('statsPage.analyticsRegions', '📍 지역별 매출')}
                                                </h3>
                                                <div className="space-y-2">
                                                    {analyticsData.topRegions.map((rg, i) => {
                                                        const maxRev = analyticsData.topRegions[0]?.revenue || 1;
                                                        const pct = (rg.revenue / analyticsData.totalRevenue * 100).toFixed(1);
                                                        const barW = (rg.revenue / maxRev * 100).toFixed(0);
                                                        const regionColors = ['bg-rose-500', 'bg-amber-500', 'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
                                                        return (
                                                            <div key={i}>
                                                                <div className="flex justify-between text-[11px] mb-1">
                                                                    <span className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1">
                                                                        <span className={`w-2 h-2 rounded-full ${regionColors[i % 8]}`} />
                                                                        {t(`statsPage.${rg.name}`, rg.name)}
                                                                    </span>
                                                                    <span className="text-gray-400">{formatRevenue(rg.revenue)} ({pct}%)</span>
                                                                </div>
                                                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                                                    <div className={`${regionColors[i % 8]} h-2 rounded-full transition-all`} style={{ width: `${barW}%` }} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* ═══ Day of Week Pattern ═══ */}
                                        {analyticsData.dayOfWeekAnalysis?.some(d => d.avg > 0) && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                                <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5 text-sm">
                                                    <Clock size={16} className="text-amber-500" />
                                                    {t('statsPage.analyticsDayPattern', '📊 요일별 매출 패턴')}
                                                </h3>
                                                <div className="flex items-end gap-3 h-32 px-2">
                                                    {analyticsData.dayOfWeekAnalysis.map((d, i) => {
                                                        const barH = Math.max(4, (d.avg / analyticsData.maxDayAvg) * 100);
                                                        const isWeekend = i === 0 || i === 6;
                                                        return (
                                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                                                                    {formatRevenue(d.avg)}
                                                                </span>
                                                                <div className="w-full rounded-t-lg relative" style={{ height: `${barH}px` }}>
                                                                    <div className={`absolute inset-0 rounded-t-lg bg-gradient-to-t ${isWeekend ? 'from-amber-500 to-amber-400' : 'from-blue-500 to-blue-400'}`} />
                                                                </div>
                                                                <span className={`text-[10px] font-bold ${isWeekend ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>{d.name}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="flex items-center justify-center gap-4 mt-3">
                                                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-500" /><span className="text-[10px] text-gray-400">{t('statsPage.weekday', '평일')}</span></div>
                                                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-500" /><span className="text-[10px] text-gray-400">{t('statsPage.weekend', '주말')}</span></div>
                                                </div>
                                                <p className="text-[10px] text-gray-400 text-center mt-2">{t('statsPage.dayPatternNote', '평균 매출 기준')}</p>
                                            </div>
                                        )}

                                        {/* ═══ Top Products ═══ */}
                                        {analyticsData.topProducts?.length > 0 && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                                <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5 text-sm">
                                                    <ShoppingCart size={16} className="text-purple-500" />
                                                    {t('statsPage.analyticsTopProducts', '🏆 상위 상품')}
                                                </h3>
                                                <div className="space-y-3">
                                                    {analyticsData.topProducts.map((p, i) => (
                                                        <div key={i} className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm text-white ${i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : i === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' : i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' : 'bg-gradient-to-br from-gray-300 to-gray-400'}`}>
                                                                {i + 1}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{p.name}</p>
                                                                <p className="text-[10px] text-gray-400">{p.qty}{t('statsPage.unitCount', '개')} · {p.count}{t('statsPage.tradeCount', '건')}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{formatRevenue(p.revenue)}</p>
                                                                <p className="text-[9px] text-gray-400">{(p.revenue / analyticsData.totalRevenue * 100).toFixed(1)}%</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* ═══ Monthly Performance Heatmap ═══ */}
                                        {analyticsData.monthlyTrend?.length > 0 && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                                <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5 text-sm">
                                                    <Calendar size={16} className="text-teal-600" />
                                                    {t('statsPage.monthlyHeatmap', '📊 월별 성과 히트맵')}
                                                </h3>
                                                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                                                    {(() => {
                                                        const data = analyticsData.monthlyTrend;
                                                        const maxRev = Math.max(...data.map(m => m.revenue), 1);
                                                        return data.map((m, i) => {
                                                            const intensity = m.revenue / maxRev;
                                                            const bgOpacity = Math.max(0.1, intensity);
                                                            return (
                                                                <div key={i} className="flex flex-col items-center gap-1 group cursor-default">
                                                                    <div className="w-full aspect-square rounded-lg flex items-center justify-center relative transition-transform group-hover:scale-110"
                                                                        style={{ backgroundColor: `rgba(16, 185, 129, ${bgOpacity})` }}>
                                                                        <span className={`text-[8px] font-bold ${intensity > 0.5 ? 'text-white' : 'text-emerald-700 dark:text-emerald-300'}`}>
                                                                            {m.month.slice(5)}
                                                                        </span>
                                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[9px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                                            {m.month}: {formatRevenue(m.revenue)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>
                                                <div className="flex items-center justify-end gap-2 mt-3">
                                                    <span className="text-[9px] text-gray-400">{t('statsPage.low', '낮음')}</span>
                                                    <div className="flex gap-0.5">
                                                        {[0.1, 0.3, 0.5, 0.7, 0.9].map((op, i) => (
                                                            <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(16, 185, 129, ${op})` }} />
                                                        ))}
                                                    </div>
                                                    <span className="text-[9px] text-gray-400">{t('statsPage.high', '높음')}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* ═══ Key Performance Insights ═══ */}
                                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 p-4">
                                            <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5 text-sm">
                                                <Zap size={16} className="text-indigo-600" />
                                                {t('statsPage.keyInsights', '💡 핵심 성과 인사이트')}
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {(() => {
                                                    const insights = [];
                                                    // Best month
                                                    if (analyticsData.monthlyTrend?.length > 0) {
                                                        const best = analyticsData.monthlyTrend.reduce((a, b) => a.revenue > b.revenue ? a : b);
                                                        insights.push({
                                                            icon: '🏆', label: t('statsPage.bestMonth', '최고 매출월'),
                                                            value: best.month, sub: formatRevenue(best.revenue), color: 'text-amber-600 dark:text-amber-400'
                                                        });
                                                    }
                                                    // Avg growth
                                                    if (analyticsData.monthlyGrowthRates?.length > 0) {
                                                        const validRates = analyticsData.monthlyGrowthRates.filter(g => g.rate !== null);
                                                        const avgGrowth = validRates.length > 0 ? (validRates.reduce((s, g) => s + g.rate, 0) / validRates.length).toFixed(1) : null;
                                                        if (avgGrowth !== null) {
                                                            insights.push({
                                                                icon: '📈', label: t('statsPage.avgGrowth', '평균 성장률'),
                                                                value: `${avgGrowth > 0 ? '+' : ''}${avgGrowth}%`, sub: t('statsPage.monthlyAvg', '월평균'), color: parseFloat(avgGrowth) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                                            });
                                                        }
                                                    }
                                                    // Best day of week
                                                    if (analyticsData.dayOfWeekAnalysis?.some(d => d.avg > 0)) {
                                                        const bestDay = analyticsData.dayOfWeekAnalysis.reduce((a, b) => a.avg > b.avg ? a : b);
                                                        insights.push({
                                                            icon: '📅', label: t('statsPage.bestDayOfWeek', '최고 매출 요일'),
                                                            value: `${bestDay.name}${t('statsPage.dayLabel', '요일')}`, sub: `${t('statsPage.dailyAvg', '일평균')}: ${formatRevenue(bestDay.avg)}`, color: 'text-blue-600 dark:text-blue-400'
                                                        });
                                                    }
                                                    // Top product
                                                    if (analyticsData.topProducts?.length > 0) {
                                                        insights.push({
                                                            icon: '🎯', label: t('statsPage.topProduct', '인기 상품'),
                                                            value: analyticsData.topProducts[0].name, sub: formatRevenue(analyticsData.topProducts[0].revenue), color: 'text-purple-600 dark:text-purple-400'
                                                        });
                                                    }
                                                    return insights.map((ins, i) => (
                                                        <div key={i} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                                                            <span className="text-2xl">{ins.icon}</span>
                                                            <div className="min-w-0">
                                                                <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase">{ins.label}</p>
                                                                <p className={`text-sm font-extrabold truncate ${ins.color}`}>{ins.value}</p>
                                                                <p className="text-[10px] text-gray-400">{ins.sub}</p>
                                                            </div>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                        </div>

                                        {/* ═══ Additional KPI Row — with SVG Ring Charts ═══ */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { label: t('statsPage.analyticsAvgOrder', '평균 주문가'), value: formatRevenue(analyticsData.avgOrderValue), raw: analyticsData.avgOrderValue, max: analyticsData.totalRevenue > 0 ? analyticsData.totalRevenue / Math.max(1, analyticsData.totalTx) * 3 : 1, color: '#6366f1', icon: <ShoppingCart size={14} /> },
                                                { label: t('statsPage.analyticsTotalTx', '총 거래건수'), value: analyticsData.totalTx.toLocaleString(), raw: analyticsData.totalTx, max: Math.max(analyticsData.totalTx * 1.5, 1), color: '#3b82f6', icon: <FileText size={14} /> },
                                                { label: t('statsPage.analyticsTotalQty', '총 판매수량'), value: analyticsData.totalQty.toLocaleString(), raw: analyticsData.totalQty, max: Math.max(analyticsData.totalQty * 1.5, 1), color: '#a855f7', icon: <Package size={14} /> },
                                                { label: t('statsPage.analyticsTotalCustomers', '총 고객수'), value: analyticsData.totalCustomers.toLocaleString(), raw: analyticsData.totalCustomers, max: Math.max(analyticsData.totalCustomers * 1.5, 1), color: '#14b8a6', icon: <Users size={14} /> },
                                            ].map((item, idx) => {
                                                const pct = Math.min(100, (item.raw / item.max) * 100);
                                                const r = 22; const circ = 2 * Math.PI * r;
                                                const dash = (pct / 100) * circ;
                                                return (
                                                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
                                                        <svg width="52" height="52" viewBox="0 0 52 52" className="flex-shrink-0">
                                                            <circle cx="26" cy="26" r={r} fill="none" stroke="#f3f4f6" strokeWidth="4" className="dark:stroke-gray-700" />
                                                            <circle cx="26" cy="26" r={r} fill="none" stroke={item.color} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} transform="rotate(-90 26 26)" className="transition-all duration-700" />
                                                        </svg>
                                                        <div className="absolute" style={{ width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <span style={{ color: item.color }}>{item.icon}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-bold text-gray-400 uppercase">{item.label}</p>
                                                            <p className="text-base font-extrabold" style={{ color: item.color }}>{item.value}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Stats Footer */}
                                        <p className="text-[10px] text-gray-400 text-center">
                                            {t('statsPage.analyticsFooter', `총 ${analyticsData.recordCount}${t('statsPage.recordBasedAnalysis', '개 레코드 기준 분석')}`)}
                                        </p>

                                        {/* Export Buttons */}
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
                                            <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                                <Download size={16} className="text-indigo-600 dark:text-indigo-400" />
                                                {t('statsPage.exportTitle', '📤 리포트 내보내기')}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2.5">{t('statsPage.exportDesc', '매출 데이터와 손익계산서를 파일로 다운로드하세요')}</p>
                                            {/* Period Selector */}
                                            <div className="mb-4">
                                                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t('statsPage.exportPeriodLabel', '📅 내보내기 기간')}</label>
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {[
                                                        { key: '1m', label: t('statsPage.export1m', '1개월') },
                                                        { key: '3m', label: t('statsPage.export3m', '3개월') },
                                                        { key: '6m', label: t('statsPage.export6m', '6개월') },
                                                        { key: '1y', label: t('statsPage.export1y', '1년') },
                                                        { key: 'custom', label: t('statsPage.exportCustom', '직접 설정') },
                                                    ].map(opt => (
                                                        <button key={opt.key} type="button"
                                                            onClick={() => setExportPeriod(opt.key)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${exportPeriod === opt.key
                                                                ? 'bg-indigo-500 text-white shadow-sm'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                                }`}
                                                        >{opt.label}</button>
                                                    ))}
                                                </div>
                                                {exportPeriod === 'custom' && (
                                                    <div className="flex items-center gap-2">
                                                        <input type="date" value={exportCustomStart}
                                                            onChange={e => setExportCustomStart(e.target.value)}
                                                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300" />
                                                        <span className="text-xs text-gray-400">~</span>
                                                        <input type="date" value={exportCustomEnd}
                                                            onChange={e => setExportCustomEnd(e.target.value)}
                                                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300" />
                                                    </div>
                                                )}
                                                {/* Show selected range */}
                                                {(() => {
                                                    const { start, end } = getExportDateRange();
                                                    return (
                                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
                                                            📊 {start} ~ {end}
                                                        </p>
                                                    );
                                                })()}
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                <button onClick={exportToExcel}
                                                    className="flex flex-col items-center gap-2 py-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-700/50 rounded-xl hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all">
                                                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                                                        <FileText size={18} />
                                                    </div>
                                                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Excel</span>
                                                    <span className="text-[9px] text-gray-400">.xlsx</span>
                                                </button>
                                                <button onClick={exportToCSV}
                                                    className="flex flex-col items-center gap-2 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700/50 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all">
                                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                                        <Download size={18} />
                                                    </div>
                                                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">CSV</span>
                                                    <span className="text-[9px] text-gray-400">.csv</span>
                                                </button>
                                                <button onClick={exportToPrint}
                                                    className="flex flex-col items-center gap-2 py-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200 dark:border-violet-700/50 rounded-xl hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/50 dark:hover:to-purple-900/50 transition-all">
                                                    <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center text-white">
                                                        <FileText size={18} />
                                                    </div>
                                                    <span className="text-xs font-bold text-violet-700 dark:text-violet-400">{t('statsPage.exportPrint', '인쇄')}</span>
                                                    <span className="text-[9px] text-gray-400">PDF</span>
                                                </button>
                                                <button onClick={generateCRMReport}
                                                    className="flex flex-col items-center gap-2 py-4 bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/30 dark:to-pink-900/30 border border-fuchsia-200 dark:border-fuchsia-700/50 rounded-xl hover:from-fuchsia-100 hover:to-pink-100 dark:hover:from-fuchsia-900/50 dark:hover:to-pink-900/50 transition-all">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                                                        <BarChart3 size={18} />
                                                    </div>
                                                    <span className="text-xs font-bold text-fuchsia-700 dark:text-fuchsia-400">{t('statsPage.crmReport', 'CRM Report')}</span>
                                                    <span className="text-[9px] text-gray-400">{t('statsPage.crmReportSub', '종합 분석')}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* ═══ Workflow Automation ═══ */}
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 text-white flex items-center justify-between">
                                                <h3 className="font-extrabold text-sm flex items-center gap-2">
                                                    <Zap size={16} />
                                                    {t('statsPage.workflowTitle', '⚡ 자동화 워크플로우')}
                                                    <span className="bg-white/20 rounded-full px-2 py-0.5 text-[10px]">{workflowRules.filter(r => r.enabled).length} {t('statsPage.workflowActive', '활성')}</span>
                                                </h3>
                                                <button onClick={() => setShowWorkflowForm(!showWorkflowForm)}
                                                    className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1 text-xs font-bold transition-all">
                                                    {showWorkflowForm ? t('statsPage.workflowClose', '닫기') : t('statsPage.workflowAdd', '+ 규칙 추가')}
                                                </button>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                {/* Active rules */}
                                                {workflowRules.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {workflowRules.map(rule => (
                                                            <div key={rule.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${rule.enabled ? 'border-teal-200 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50'}`}>
                                                                <span className="text-lg">{rule.icon}</span>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200">{rule.name}</p>
                                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{rule.desc}</p>
                                                                </div>
                                                                <button onClick={() => toggleWorkflowRule(rule.id)}
                                                                    className={`w-10 h-5 rounded-full transition-all relative ${rule.enabled ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${rule.enabled ? 'left-5' : 'left-0.5'}`} />
                                                                </button>
                                                                <button onClick={() => removeWorkflowRule(rule.id)}
                                                                    className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6">
                                                        <Zap size={32} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                                        <p className="text-xs text-gray-400">{t('statsPage.workflowEmpty', '활성 워크플로우 규칙이 없습니다')}</p>
                                                        <p className="text-[10px] text-gray-300 dark:text-gray-500">{t('statsPage.workflowEmptyDesc', '"+ 규칙 추가"를 눌러 자동화를 시작하세요')}</p>
                                                    </div>
                                                )}

                                                {/* Preset rules */}
                                                {showWorkflowForm && (
                                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">{t('statsPage.workflowPresets', '추천 자동화 규칙')}</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {workflowPresets.filter(p => !workflowRules.find(r => r.id === p.id)).map(preset => (
                                                                <button key={preset.id} onClick={() => addWorkflowRule(preset)}
                                                                    className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-all text-left">
                                                                    <span className="text-lg">{preset.icon}</span>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{preset.name}</p>
                                                                        <p className="text-[9px] text-gray-400">{preset.desc}</p>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Recent log */}
                                                {workflowLog.length > 0 && (
                                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">{t('statsPage.workflowLog', '최근 활동 로그')}</p>
                                                        <div className="space-y-1">
                                                            {workflowLog.slice(0, 5).map((log, i) => (
                                                                <div key={i} className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                                                                    <Clock size={10} className="flex-shrink-0" />
                                                                    <span className="font-bold">{log.ruleName}</span>
                                                                    <span>· {log.action}</span>
                                                                    <span className="ml-auto text-gray-300 dark:text-gray-600">{new Date(log.timestamp).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* ═══ External Integrations Hub ═══ */}
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                            <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-4 text-white">
                                                <h3 className="font-extrabold text-sm flex items-center gap-2">
                                                    <Globe size={16} />
                                                    {t('statsPage.integrationsTitle', '🔗 외부 연동 허브')}
                                                </h3>
                                                <p className="text-[10px] text-white/70 mt-1">{t('statsPage.integrationsDesc', '외부 서비스와 연동하여 CRM 기능을 확장하세요')}</p>
                                            </div>
                                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {[
                                                    { key: 'gsheets', name: 'Google Sheets', icon: '📊', desc: t('statsPage.gsheetsDesc', '매출 데이터를 복사하여 시트에 붙여넣기'), features: [t('statsPage.clipboardCopy', '클립보드 복사'), 'Ctrl+V'], color: 'from-green-500 to-emerald-600', action: copyForGoogleSheets, actionLabel: t('statsPage.copyData', '데이터 복사') },
                                                    { key: 'email', name: t('statsPage.emailReport', '이메일 보고서'), icon: '📧', desc: t('statsPage.emailDesc', '매출 요약 보고서 초안 자동 작성'), features: [t('statsPage.reportDraft', '보고서 초안'), t('statsPage.mailAppConnect', '메일 앱 연결')], color: 'from-purple-500 to-violet-600', action: sendEmailReport, actionLabel: t('statsPage.sendReport', '보고서 전송') },
                                                ].map(item => (
                                                    <div key={item.key} className={`rounded-xl border p-4 transition-all ${integrations[item.key] ? 'border-sky-200 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white text-base`}>{item.icon}</div>
                                                                <div>
                                                                    <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200">{item.name}</p>
                                                                    <p className="text-[9px] text-gray-400">{item.desc}</p>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => toggleIntegration(item.key, item.name)}
                                                                className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 ${integrations[item.key] ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${integrations[item.key] ? 'left-5' : 'left-0.5'}`} />
                                                            </button>
                                                        </div>
                                                        <div className="flex gap-1.5">
                                                            {item.features.map((f, i) => (
                                                                <span key={i} className="text-[8px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full px-2 py-0.5">{f}</span>
                                                            ))}
                                                        </div>
                                                        {integrations[item.key] && (
                                                            <div className="mt-2 flex items-center justify-between">
                                                                <div className="flex items-center gap-1 text-[9px] text-sky-600 dark:text-sky-400">
                                                                    <CheckCircle size={10} />
                                                                    <span className="font-bold">{t('statsPage.integrationConnected', '연동됨')}</span>
                                                                </div>
                                                                <button onClick={item.action}
                                                                    className="text-[9px] font-bold bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-full transition-colors">
                                                                    {item.actionLabel}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* ═══ RFM Customer Segmentation ═══ */}
                                        {rfmData && rfmData.segments && Object.keys(rfmData.segments).length > 0 && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
                                                    <h3 className="font-extrabold text-sm flex items-center gap-2">
                                                        <Users size={16} />
                                                        {t('statsPage.rfmTitle', '🎯 고객 세분화 (RFM 분석)')}
                                                    </h3>
                                                    <p className="text-[10px] opacity-70 mt-1">{t('statsPage.rfmDesc', 'Recency · Frequency · Monetary 기반 자동 분류')}</p>
                                                </div>

                                                {/* Segment Distribution */}
                                                <div className="p-5 space-y-4">
                                                    {(() => {
                                                        const segConfig = {
                                                            vip: { color: 'bg-amber-500', lightBg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: '👑', label: t('statsPage.rfmVip', 'VIP') },
                                                            excellent: { color: 'bg-emerald-500', lightBg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: '⭐', label: t('statsPage.rfmExcellent', '우수 고객') },
                                                            normal: { color: 'bg-blue-500', lightBg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: '👤', label: t('statsPage.rfmNormal', '일반 고객') },
                                                            attention: { color: 'bg-orange-500', lightBg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: '⚠️', label: t('statsPage.rfmAttention', '관심 필요') },
                                                            churn_risk: { color: 'bg-red-500', lightBg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: '🚨', label: t('statsPage.rfmChurnRisk', '이탈 위험') },
                                                        };
                                                        return (
                                                            <>
                                                                {/* Segment bars */}
                                                                <div className="space-y-3">
                                                                    {Object.entries(rfmData.segments).map(([key, seg]) => {
                                                                        const cfg = segConfig[key] || {};
                                                                        return (
                                                                            <div key={key} className={`p-3 rounded-xl ${cfg.lightBg} cursor-pointer transition-all hover:scale-[1.01]`}
                                                                                onClick={() => setRfmSegmentFilter(rfmSegmentFilter === key ? 'all' : key)}>
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                    <span className={`text-xs font-extrabold ${cfg.text} flex items-center gap-1`}>
                                                                                        <span>{cfg.icon}</span> {cfg.label}
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                                        {seg.count}{t('statsPage.rfmPeople', '명')} ({seg.count_pct}%)
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                                                                        <div className={`${cfg.color} h-2.5 rounded-full transition-all`} style={{ width: `${seg.count_pct}%` }} />
                                                                                    </div>
                                                                                    <span className="text-[10px] font-bold text-gray-400 w-20 text-right">
                                                                                        {formatRevenue(seg.revenue)}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex justify-between mt-1">
                                                                                    <span className="text-[9px] text-gray-400">{t('statsPage.rfmRevPct', '매출 비중')}: {seg.revenue_pct}%</span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>

                                                                {/* Top RFM customers */}
                                                                {rfmData.customers?.length > 0 && (
                                                                    <div className="mt-4">
                                                                        <div className="flex items-center justify-between mb-3">
                                                                            <h4 className="text-xs font-extrabold text-gray-700 dark:text-gray-200">
                                                                                {rfmSegmentFilter !== 'all' ? `${segConfig[rfmSegmentFilter]?.icon} ${segConfig[rfmSegmentFilter]?.label}` : t('statsPage.rfmAllCustomers', '전체 고객')} RFM
                                                                            </h4>
                                                                            {rfmSegmentFilter !== 'all' && (
                                                                                <button onClick={() => setRfmSegmentFilter('all')} className="text-[10px] text-indigo-500 hover:underline">
                                                                                    {t('statsPage.rfmShowAll', '전체 보기')}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                                                            {rfmData.customers
                                                                                .filter(c => rfmSegmentFilter === 'all' || c.segment === rfmSegmentFilter)
                                                                                .slice(0, 10)
                                                                                .map((c, i) => {
                                                                                    const cfg = segConfig[c.segment] || {};
                                                                                    return (
                                                                                        <div key={c.id || i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                                                            <div className={`w-8 h-8 rounded-full ${cfg.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                                                                                                {(c.name || '?')[0]}
                                                                                            </div>
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{c.name}</p>
                                                                                                <p className="text-[10px] text-gray-400">{c.company || c.email || ''}</p>
                                                                                            </div>
                                                                                            {/* Mini RFM bars */}
                                                                                            <div className="flex items-center gap-1">
                                                                                                {[
                                                                                                    { label: 'R', val: c.r_score, color: 'bg-blue-400' },
                                                                                                    { label: 'F', val: c.f_score, color: 'bg-emerald-400' },
                                                                                                    { label: 'M', val: c.m_score, color: 'bg-amber-400' },
                                                                                                ].map(s => (
                                                                                                    <div key={s.label} className="flex flex-col items-center gap-0.5">
                                                                                                        <span className="text-[8px] text-gray-400 font-bold">{s.label}</span>
                                                                                                        <div className="w-3 h-12 bg-gray-100 dark:bg-gray-600 rounded-full relative overflow-hidden">
                                                                                                            <div className={`absolute bottom-0 w-full ${s.color} rounded-full transition-all`}
                                                                                                                style={{ height: `${(s.val / 5) * 100}%` }} />
                                                                                                        </div>
                                                                                                        <span className="text-[8px] font-bold text-gray-500">{s.val}</span>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                            <div className="text-right w-16">
                                                                                                <p className={`text-[10px] font-bold ${cfg.text}`}>{cfg.icon} {c.rfm_total}</p>
                                                                                                <p className="text-[9px] text-gray-400">{c.recency_days}d</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        )}
                                        {rfmLoading && (
                                            <div className="text-center py-4">
                                                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                                <p className="text-[10px] text-gray-400 mt-2">{t('statsPage.rfmLoading', 'RFM 분석 중...')}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-16">
                                        <BarChart3 size={48} className="text-gray-200 mx-auto mb-3" />
                                        <p className="text-sm text-gray-400">
                                            {t('statsPage.analyticsNoData', '분석할 데이터가 없습니다. 먼저 매출 데이터를 입력해주세요.')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ════ CUSTOMER TAB ════ */}
                    {
                        activeTab === 'customers' && (
                            <CustomerTab
                                selectedCountry={selectedCountry}
                                t={t}
                                formatRevenue={formatRevenue}
                                toast={toastFn}
                            />
                        )
                    }
                </>
            )
            }

            {/* Privacy Notice */}
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-400">
                    {t('statsPage.privacyNotice')}
                </p>
            </div>

            {/* ── Create/Edit Modal ── */}
            {
                showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); resetForm(); }}>
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white flex items-center justify-between">
                                <h2 className="font-extrabold text-lg flex items-center gap-2">
                                    <TrendingUp size={20} />
                                    {editingRecord ? t('statsPage.editData') : t('statsPage.addData')}
                                </h2>
                                <button onClick={() => { setShowForm(false); resetForm(); }} className="text-white/80 hover:text-white"><X size={22} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Country Selector + Upload Button */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    {/* Compact Country Selector */}
                                    <div className="relative flex-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                                            🌐 {t('statsPage.countrySelect', '국가 선택')}
                                        </label>
                                        <button type="button"
                                            onClick={() => setForm(prev => ({ ...prev, _showCountryPicker: !prev._showCountryPicker }))}
                                            className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-emerald-400 transition-colors text-sm font-bold text-gray-800 dark:text-gray-200"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="text-lg">{HOST_COUNTRIES.find(c => c.code === selectedCountry)?.flag || '🏳️'}</span>
                                                <span>{HOST_COUNTRIES.find(c => c.code === selectedCountry)?.name || selectedCountry}</span>
                                            </span>
                                            <ChevronDown size={16} className={`text-gray-400 transition-transform ${form._showCountryPicker ? 'rotate-180' : ''}`} />
                                        </button>
                                        {form._showCountryPicker && (
                                            <div className="absolute z-10 mt-1 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl max-h-48 overflow-y-auto">
                                                {HOST_COUNTRIES.map(c => (
                                                    <button
                                                        key={c.code}
                                                        type="button"
                                                        onClick={() => {
                                                            if (selectedCountry !== c.code) {
                                                                setSelectedCountry(c.code);
                                                                setForm(prev => ({ ...prev, region: '', region_detail: '', _showCountryPicker: false }));
                                                            } else {
                                                                setForm(prev => ({ ...prev, _showCountryPicker: false }));
                                                            }
                                                        }}
                                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${selectedCountry === c.code
                                                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                            }`}
                                                    >
                                                        <span className="text-lg">{c.flag}</span>
                                                        <span className="flex-1">{c.name}</span>
                                                        {selectedCountry === c.code && <Check size={14} className="text-emerald-600" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* File Upload Area (Drag & Drop) */}
                                <div
                                    className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${dragOver ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/30 scale-[1.01]' : 'border-gray-200 dark:border-gray-600 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 hover:border-indigo-300 hover:from-indigo-50 hover:to-purple-50'}`}
                                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
                                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget)) setDragOver(false); }}
                                    onDrop={(e) => {
                                        e.preventDefault(); e.stopPropagation(); setDragOver(false);
                                        const files = e.dataTransfer?.files;
                                        if (files && files.length > 0) {
                                            const file = files[0];
                                            setShowForm(false);
                                            resetForm();
                                            startTransition(() => { setActiveTab('upload'); });
                                            setTimeout(() => handleFileParse(file), 100);
                                        }
                                    }}
                                    onClick={() => {
                                        // Create a temporary file input for the modal
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.xlsx,.xls,.csv';
                                        input.onchange = (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setShowForm(false);
                                                resetForm();
                                                startTransition(() => { setActiveTab('upload'); });
                                                setTimeout(() => handleFileParse(file), 100);
                                            }
                                        };
                                        input.click();
                                    }}
                                >
                                    <div className="flex items-center justify-center gap-4 pointer-events-none">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50 flex-shrink-0">
                                            <FolderUp className="text-white" size={22} />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-extrabold text-gray-800 dark:text-white text-sm">
                                                {t('statsPage.uploadDragTitle', '파일을 드래그하거나 클릭하세요')}
                                            </h4>
                                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                                                Excel (.xlsx, .xls) · CSV {t('statsPage.fileSupported', '파일 지원')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Record Type */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.recordType')}</label>
                                    <div className="flex gap-2">
                                        {['daily', 'monthly', 'annual'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => {
                                                    if (!editingRecord) setForm({ ...form, record_type: type, record_date: '' });
                                                }}
                                                disabled={!!editingRecord}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${form.record_type === type
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    } ${editingRecord ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            >
                                                {periodLabel(type)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Record Date */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                                        {form.record_type === 'daily' ? t('statsPage.recordDateDaily') : form.record_type === 'annual' ? t('statsPage.recordDateAnnual') : t('statsPage.recordDateMonthly')}
                                    </label>
                                    {form.record_type === 'daily' && (
                                        <input type="date" value={form.record_date} onChange={e => setForm({ ...form, record_date: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium"
                                            required disabled={!!editingRecord} />
                                    )}
                                    {form.record_type === 'monthly' && (
                                        <input type="month" value={form.record_date} onChange={e => setForm({ ...form, record_date: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium"
                                            required disabled={!!editingRecord} />
                                    )}
                                    {form.record_type === 'annual' && (
                                        <select value={form.record_date} onChange={e => setForm({ ...form, record_date: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium appearance-none"
                                            required disabled={!!editingRecord}>
                                            <option value="">{t('statsPage.selectYear')}</option>
                                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                                <option key={y} value={y}>{y}{t('statsPage.yearSuffix')}</option>
                                            ))}
                                        </select>
                                    )}
                                    {editingRecord && <p className="text-[10px] text-gray-400 mt-1">{t('statsPage.dateEditNote')}</p>}
                                </div>

                                {/* Revenue & Transactions */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.revenueLabel', '매출액')} ({countryCurrencySymbol})</label>
                                        <NumberInput value={form.monthly_revenue}
                                            onChange={rev => {
                                                const tx = parseInt(form.transaction_count) || 0;
                                                const unitPrice = rev && tx > 0 ? Math.round(parseInt(rev) / tx) : '';
                                                setForm({ ...form, monthly_revenue: rev, avg_unit_price: unitPrice.toString() });
                                            }}
                                            placeholder="5,000,000"
                                            className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.transactionCount')}</label>
                                        <NumberInput value={form.transaction_count}
                                            onChange={tx => {
                                                const rev = parseInt(form.monthly_revenue) || 0;
                                                const unitPrice = rev > 0 && tx && parseInt(tx) > 0 ? Math.round(rev / parseInt(tx)) : '';
                                                setForm({ ...form, transaction_count: tx, avg_unit_price: unitPrice.toString() });
                                            }}
                                            placeholder="150"
                                            className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium" />
                                    </div>
                                </div>

                                {/* Customers & Auto-calculated Unit Price */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.customerCount')}</label>
                                        <NumberInput value={form.customer_count}
                                            onChange={val => setForm({ ...form, customer_count: val })}
                                            placeholder="200"
                                            className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                                            {t('statsPage.unitPriceLabel', '평균 객단가')} ({countryCurrencySymbol})
                                            <span className="ml-1 text-[10px] text-emerald-500 font-medium normal-case">{t('statsPage.autoCalc', '자동계산')}</span>
                                        </label>
                                        <div className="w-full px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-sm font-bold text-emerald-700 min-h-[42px] flex items-center">
                                            {form.avg_unit_price && parseInt(form.avg_unit_price) > 0
                                                ? `${countryCurrencySymbol}${parseInt(form.avg_unit_price).toLocaleString()}`
                                                : <span className="text-gray-400 font-medium">{t('statsPage.autoCalcHint', '매출액과 거래건수를 입력하세요')}</span>
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Best Selling Item — Category Selector */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.bestCategory')}</label>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {PRODUCT_CATEGORIES.map(cat => (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() => setForm({ ...form, best_selling_item: form.best_selling_item === cat.value ? '' : cat.value, best_selling_other: cat.value !== 'other' ? '' : form.best_selling_other })}
                                                className={`px-2 py-2 rounded-xl text-[11px] font-bold transition-all border ${form.best_selling_item === cat.value
                                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                    {form.best_selling_item === 'other' && (
                                        <input
                                            type="text"
                                            value={form.best_selling_other}
                                            onChange={e => setForm({ ...form, best_selling_other: e.target.value })}
                                            placeholder={t('statsPage.bestOtherPlaceholder')}
                                            className="w-full mt-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium"
                                        />
                                    )}
                                </div>

                                {/* Venue Type */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.venueType')}</label>
                                    <select value={form.venue_type} onChange={e => setForm({ ...form, venue_type: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm font-medium appearance-none">
                                        <option value="">{t('statsPage.select')}</option>
                                        {VENUE_TYPE_OPTIONS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                                    </select>
                                </div>

                                {/* Region - Major Category Buttons + Detail Input */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.region')}</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {REGION_OPTIONS.map(r => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setForm({ ...form, region: form.region === r ? '' : r, region_detail: form.region === r ? '' : form.region_detail })}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${form.region === r
                                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                                    }`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                    {form.region && (
                                        <div className="mt-2">
                                            <label className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                                                📍 {form.region} - {t('statsPage.regionDetailLabel', '상세 정보')}
                                            </label>
                                            <input
                                                type="text"
                                                value={form.region_detail}
                                                onChange={e => setForm({ ...form, region_detail: e.target.value })}
                                                placeholder={t('statsPage.regionDetailPlaceholder', regionDetailPlaceholder)}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm"
                                            />
                                        </div>
                                    )}
                                </div>


                                {/* Satisfaction */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.satisfaction')}</label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <button key={n} type="button"
                                                onClick={() => setForm({ ...form, satisfaction: form.satisfaction === n ? 0 : n })}
                                                className={`p-2 rounded-xl transition-all ${form.satisfaction >= n ? 'bg-yellow-100 text-yellow-500 scale-110' : 'bg-gray-50 text-gray-300 hover:bg-yellow-50 hover:text-yellow-400'}`}
                                            >
                                                <Star size={20} fill={form.satisfaction >= n ? 'currentColor' : 'none'} />
                                            </button>
                                        ))}
                                        <span className="text-xs text-gray-400 ml-2">{form.satisfaction > 0 ? `${form.satisfaction}/5` : t('statsPage.notSelected')}</span>
                                    </div>
                                </div>

                                {/* Extended Fields — Collapsible */}
                                <div className="border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden">
                                    <button type="button" onClick={() => setShowExtendedFields(!showExtendedFields)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                            📋 {t('statsPage.detailedData', '상세 데이터 (엑셀 매핑 필드)')}
                                            {Object.entries(form).filter(([k, v]) => ['product_name', 'sku', 'brand', 'cost_price', 'order_number', 'sales_channel', 'platform', 'quantity_sold'].includes(k) && v).length > 0 && (
                                                <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold">
                                                    {Object.entries(form).filter(([k, v]) => ['product_name', 'sku', 'brand', 'cost_price', 'order_number', 'sales_channel', 'platform', 'quantity_sold', 'option_info', 'discount_amount', 'tax_amount', 'shipping_cost', 'refund_amount', 'commission_fee', 'net_revenue', 'profit_amount', 'payment_method', 'store_name', 'staff_name', 'customer_name'].includes(k) && v).length}{t('statsPage.fieldsEntered', '개 입력')}
                                                </span>
                                            )}
                                        </span>
                                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${showExtendedFields ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showExtendedFields && (
                                        <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-600">
                                            {/* Product Info */}
                                            <div>
                                                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2">📦 {t('statsPage.productInfoLabel', '상품 정보')}</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.productNameLabel', '상품명')}</label>
                                                        <input type="text" value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })}
                                                            placeholder={t('statsPage.productNameLabel', '상품명')} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.skuLabel', 'SKU / 바코드')}</label>
                                                        <input type="text" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })}
                                                            placeholder="SKU" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.brandLabel', '브랜드')}</label>
                                                        <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}
                                                            placeholder={t('statsPage.brandLabel', '브랜드')} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.optionLabel', '옵션')}</label>
                                                        <input type="text" value={form.option_info} onChange={e => setForm({ ...form, option_info: e.target.value })}
                                                            placeholder={t('statsPage.optionPlaceholder', '색상/사이즈')} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.quantityLabel', '판매수량')}</label>
                                                        <NumberInput value={form.quantity_sold} onChange={val => setForm({ ...form, quantity_sold: val })}
                                                            placeholder="0" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Financial Info */}
                                            <div>
                                                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">💰 {t('statsPage.financialInfoLabel', '금액 정보')} ({countryCurrencySymbol})</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { key: 'cost_price', label: t('statsPage.costPriceLabel', '원가') },
                                                        { key: 'discount_amount', label: t('statsPage.discountLabel', '할인액') },
                                                        { key: 'tax_amount', label: t('statsPage.taxLabel', '세금/부가세') },
                                                        { key: 'shipping_cost', label: t('statsPage.shippingLabel', '배송비') },
                                                        { key: 'refund_amount', label: t('statsPage.refundLabel', '환불액') },
                                                        { key: 'commission_fee', label: t('statsPage.commissionLabel', '수수료') },
                                                        { key: 'net_revenue', label: t('statsPage.netRevenueLabel', '순매출') },
                                                        { key: 'profit_amount', label: t('statsPage.profitLabel', '이익') },
                                                    ].map(f => (
                                                        <div key={f.key}>
                                                            <label className="block text-[10px] font-bold text-gray-500 mb-1">{f.label}</label>
                                                            <NumberInput value={form[f.key]} onChange={val => setForm({ ...form, [f.key]: val })}
                                                                placeholder="0" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Transaction Info */}
                                            <div>
                                                <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase mb-2">🧾 {t('statsPage.txInfoLabel', '거래 정보')}</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.paymentMethodLabel', '결제수단')}</label>
                                                        <input type="text" value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}
                                                            placeholder={t('statsPage.paymentMethodPlaceholder', '카드/현금')} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.orderNumLabel', '주문번호')}</label>
                                                        <input type="text" value={form.order_number} onChange={e => setForm({ ...form, order_number: e.target.value })}
                                                            placeholder={t('statsPage.orderNumLabel', '주문번호')} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.salesChannelLabel', '판매채널')}</label>
                                                        <input type="text" value={form.sales_channel} onChange={e => setForm({ ...form, sales_channel: e.target.value })}
                                                            placeholder={t('statsPage.salesChannelPlaceholder', '온라인/오프라인')} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.platformLabel', '플랫폼')}</label>
                                                        <input type="text" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                                                            placeholder={t('statsPage.platformPlaceholder', 'Naver/Coupang')} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Operations Info */}
                                            <div>
                                                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase mb-2">🏪 {t('statsPage.opsInfoLabel', '운영 정보')}</p>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.storeNameLabel', '매장명')}</label>
                                                        <input type="text" value={form.store_name} onChange={e => setForm({ ...form, store_name: e.target.value })}
                                                            placeholder={t('statsPage.storeNameLabel', '매장명')} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.staffLabel', '담당자')}</label>
                                                        <input type="text" value={form.staff_name} onChange={e => setForm({ ...form, staff_name: e.target.value })}
                                                            placeholder={t('statsPage.staffLabel', '담당자')} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">{t('statsPage.customerNameLabel', '고객명')}</label>
                                                        <input type="text" value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })}
                                                            placeholder={t('statsPage.customerNameLabel', '고객명')} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-xs" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Memo */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.memo')}</label>
                                    <textarea value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })}
                                        rows="2" placeholder={t('statsPage.memoPlaceholder')}
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium resize-none" />
                                </div>

                                {/* Submit */}
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={submitting}
                                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                        <Save size={16} />
                                        {submitting ? t('statsPage.saving') : (editingRecord ? t('statsPage.editDone') : t('statsPage.saveData'))}
                                    </button>
                                    <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                                        className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                                        {t('statsPage.cancel')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <ConfirmModal modal={confirmModal} onClose={() => setConfirmModal(null)} />
        </div >
    );
};

// ── Sub Components ──
const DashKPICard = ({ label, value }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 hover:bg-white/15 transition-colors">
        <p className="text-[10px] text-emerald-200/70 mb-0.5 font-medium">{label}</p>
        <p className="text-lg font-extrabold leading-tight">{value}</p>
    </div>
);

const ReccentRecordBadge = ({ type }) => {
    const styles = {
        daily: 'bg-blue-50 text-blue-600',
        monthly: 'bg-emerald-50 text-emerald-600',
        annual: 'bg-amber-50 text-amber-600',
    };
    const labels = { daily: 'Daily', monthly: 'Monthly', annual: 'Annual' };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[type] || 'bg-gray-50 text-gray-500'}`}>
            {labels[type] || type}
        </span>
    );
};

const RecentRecordRow = ({ record, formatRevenue, periodLabel, translateDbValue, onEdit, onDelete }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={onEdit}>
        <ReccentRecordBadge type={record.record_type} />
        <span className="font-bold text-sm text-gray-900 min-w-[80px]">{record.record_date}</span>
        <span className="text-sm font-bold text-emerald-600 flex-1">
            {parseInt(record.monthly_revenue) > 0 ? formatRevenue(record.monthly_revenue) : '-'}
        </span>
        {record.best_selling_item && (
            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium hidden md:inline">
                {translateDbValue(record.best_selling_item)}
            </span>
        )}
        <div className="flex items-center gap-1 flex-shrink-0">
            <Edit3 size={14} className="text-gray-400" />
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                <Trash2 size={14} />
            </button>
        </div>
    </div>
);

const RecordCard = ({ record, formatRevenue, formatDateLabel, translateDbValue, onEdit, onDelete, checked, onCheck }) => {
    const { t } = useTranslation('seller');
    const revenue = parseInt(record.monthly_revenue) || 0;
    const customers = parseInt(record.customer_count) || 0;
    const transactions = parseInt(record.transaction_count) || 0;
    const unitPrice = parseInt(record.avg_unit_price) || 0;
    const costPrice = parseInt(record.cost_price) || 0;
    const satisfaction = parseInt(record.satisfaction) || 0;
    const productName = record.product_name || '';

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl border shadow-sm p-4 hover:shadow-md transition-shadow ${checked ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-gray-100 dark:border-gray-700'}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {onCheck && (
                        <input type="checkbox" checked={!!checked} onChange={onCheck}
                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 flex-shrink-0 mt-1 cursor-pointer" />
                    )}
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
                        <Calendar size={20} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-gray-900 dark:text-white text-lg">{formatDateLabel(record)}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <ReccentRecordBadge type={record.record_type} />
                            {record.venue_type && (
                                <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold">
                                    {t(`statsPage.venue${record.venue_type.charAt(0).toUpperCase() + record.venue_type.slice(1)}`, record.venue_type)}
                                </span>
                            )}
                            {record.region && (
                                <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-bold flex items-center gap-0.5">
                                    <MapPin size={8} /> {translateDbValue(record.region)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={onEdit} className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"><Edit3 size={14} /></button>
                    <button onClick={onDelete} className="p-2 rounded-xl bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors"><Trash2 size={14} /></button>
                </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-2.5 border border-emerald-100/50 dark:border-emerald-800/30">
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mb-0.5">{t('statsPage.salesCardLabel')}</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-gray-100">{revenue > 0 ? formatRevenue(revenue) : '-'}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-2.5 border border-blue-100/50 dark:border-blue-800/30">
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mb-0.5">{t('statsPage.customersCardLabel')}</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-gray-100">{customers > 0 ? `${customers.toLocaleString()}${t('statsPage.peopleSuffix')}` : '-'}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-2.5 border border-amber-100/50 dark:border-amber-800/30">
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mb-0.5">{t('statsPage.transactionsCardLabel')}</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-gray-100">{transactions > 0 ? `${transactions.toLocaleString()}${t('statsPage.transactionSuffix')}` : '-'}</p>
                </div>
                <div className="bg-violet-50 dark:bg-violet-900/30 rounded-xl p-2.5 border border-violet-100/50 dark:border-violet-800/30">
                    <p className="text-[10px] text-violet-600 dark:text-violet-400 font-bold mb-0.5">{t('statsPage.unitPriceCardLabel')}</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-gray-100">{unitPrice > 0 ? formatRevenue(unitPrice) : '-'}</p>
                </div>
                <div className="bg-pink-50 dark:bg-pink-900/30 rounded-xl p-2.5 border border-pink-100/50 dark:border-pink-800/30">
                    <p className="text-[10px] text-pink-600 dark:text-pink-400 font-bold mb-0.5">{t('statsPage.costPriceLabel', '원가')}</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-gray-100">{costPrice > 0 ? formatRevenue(costPrice) : '-'}</p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/30 rounded-xl p-2.5 border border-teal-100/50 dark:border-teal-800/30">
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mb-0.5">{t('statsPage.productNameLabel', '상품명')}</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-gray-100 truncate" title={productName}>{productName || '-'}</p>
                </div>
            </div>

            {(record.best_selling_item || satisfaction > 0 || record.memo) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {record.best_selling_item && (
                        <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/60 px-2.5 py-1 rounded-lg">
                            <Package size={11} className="text-gray-400 dark:text-gray-500" />
                            <span className="font-medium">{translateDbValue(record.best_selling_item)}</span>
                        </span>
                    )}
                    {satisfaction > 0 && (
                        <span className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2.5 py-1 rounded-lg text-yellow-700 dark:text-yellow-400">
                            <Star size={11} />
                            <span className="font-bold">{satisfaction}/5</span>
                        </span>
                    )}
                    {record.memo && (
                        <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/60 px-2.5 py-1 rounded-lg text-gray-400 dark:text-gray-500">
                            <FileText size={11} />
                            <span className="truncate max-w-[200px]">{record.memo}</span>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

const ExpenseFormInner = ({ initial, onSave, onCancel, categories, paymentMethods, getCatLabel, formatRevenue, selectedCountry, onCountryChange, hostCountries, countryCurrency, t }) => {
    // ── Custom categories & payment methods from localStorage ──
    const [customCategories, setCustomCategories] = useState(() => {
        try { return JSON.parse(localStorage.getItem('expense_custom_categories') || '[]'); } catch { return []; }
    });
    const [customPaymentMethods, setCustomPaymentMethods] = useState(() => {
        try { return JSON.parse(localStorage.getItem('expense_custom_payments') || '[]'); } catch { return []; }
    });
    const [showCustomCatInput, setShowCustomCatInput] = useState(false);
    const [customCatName, setCustomCatName] = useState('');
    const [showCustomPmInput, setShowCustomPmInput] = useState(false);
    const [customPmName, setCustomPmName] = useState('');

    // ── File upload state (step-based like sales upload) ──
    const [uploadMode, setUploadMode] = useState(false);
    const [expUploadStep, setExpUploadStep] = useState('select'); // select | mapping | importing | done
    const [expUploadFile, setExpUploadFile] = useState(null);
    const [expParsedHeaders, setExpParsedHeaders] = useState([]);
    const [expParsedRows, setExpParsedRows] = useState([]);
    const [expColumnMapping, setExpColumnMapping] = useState({});
    const [expDragOver, setExpDragOver] = useState(false);
    const [expImporting, setExpImporting] = useState(false);
    const [expImportResult, setExpImportResult] = useState(null);
    const expFileInputRef = useRef(null);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [expCountry, setExpCountry] = useState(selectedCountry || 'KR');

    const EXPENSE_FIELDS = [
        { key: '', label: t('statsPage.uploadSkip', '— 건너뛰기 —') },
        { key: 'expense_date', label: t('statsPage.expFieldDate', '지출 날짜') },
        { key: 'transaction_no', label: t('statsPage.expFieldTxNo', '거래 번호') },
        { key: 'expense_class', label: t('statsPage.expFieldClass', '지출 분류') },
        { key: 'expense_item', label: t('statsPage.expFieldItem', '지출 항목') },
        { key: 'vendor', label: t('statsPage.expFieldVendor', '거래처') },
        { key: 'quantity', label: t('statsPage.expFieldQty', '수량') },
        { key: 'unit', label: t('statsPage.expFieldUnit', '단위') },
        { key: 'unit_price', label: t('statsPage.expFieldUnitPrice', '단가') },
        { key: 'supply_amount', label: t('statsPage.expFieldSupply', '공급가액') },
        { key: 'vat', label: t('statsPage.expFieldVat', '부가세') },
        { key: 'amount', label: t('statsPage.expFieldAmount', '합계금액') },
        { key: 'category', label: t('statsPage.expFieldCategory', '카테고리') },
        { key: 'payment_method', label: t('statsPage.expFieldPayment', '결제수단') },
        { key: 'memo', label: t('statsPage.expFieldMemo', '비고') },
    ];

    // ── Auto-map expense columns ──
    const autoMapExpenseColumns = (headers) => {
        // Reuse the same comprehensive keyword dictionary
        const FIELD_KW = {
            expense_date: { exact: ['date', '날짜', '일자', '일시', '지출일', '지출일자', '사용일', '사용일자', '거래일', '거래일자', '결제일', '결제일자', '발생일', '이용일', '이용일자', '승인일', '승인일자', '매입일'], partial: ['date', '날짜', '일자', '일시'], exclude: ['업데이트', 'update'] },
            transaction_no: { exact: ['거래번호', '전표번호', '승인번호', '카드승인번호', '영수증번호', 'transaction_no', 'tx_no', 'receipt_no', 'approval_no'], partial: ['거래번호', '전표', '승인번호', '영수증', 'transaction', 'receipt'], exclude: [] },
            expense_class: { exact: ['분류', '지출분류', '비용분류', '대분류', '중분류', 'class', 'classification', 'type', '유형', '구분', '지출구분', '비용구분'], partial: ['분류', 'class', 'type', '유형'], exclude: ['항목', 'item', '품목'] },
            expense_item: { exact: ['항목', '지출항목', '비용항목', '품목', '품명', '상품명', '물품명', '내역', '거래내역', '지출내역', '사용내역', '적요', 'item', 'description', 'particular', '세부내역', '세부항목'], partial: ['항목', '품목', '품명', '내역', '적요', 'item', 'particular', 'description'], exclude: [] },
            vendor: { exact: ['거래처', '거래처명', '업체', '업체명', '상호', '상호명', '사용처', '이용처', '가맹점', '가맹점명', '매장', '매장명', 'vendor', 'supplier', 'merchant', 'store', '점포', '점포명'], partial: ['거래처', '업체', '상호', '사용처', '이용처', '가맹점', 'vendor', 'supplier', 'merchant'], exclude: [] },
            quantity: { exact: ['수량', 'qty', 'quantity', '건수', '매수', '개수'], partial: ['수량', 'qty', 'quantity'], exclude: ['단가', 'price', '금액'] },
            unit: { exact: ['단위', 'unit'], partial: ['단위'], exclude: ['단가', 'price', '금액'] },
            unit_price: { exact: ['단가', '개당가격', 'unit_price', 'unitprice'], partial: ['단가', 'unit.*price'], exclude: [] },
            supply_amount: { exact: ['공급가액', '공급가', '공급금액', 'supply_amount', 'net_amount', '과세표준'], partial: ['공급가', 'supply', 'net.*amount'], exclude: [] },
            vat: { exact: ['부가세', '부가가치세', 'vat', '세액', 'tax', '세금'], partial: ['부가세', 'vat', '세액'], exclude: ['공급'] },
            amount: { exact: ['합계', '합계금액', '총액', '총금액', '금액', '결제금액', '이용금액', '사용금액', '지출금액', '결제액', '청구금액', '출금액', 'total', 'amount', '원화금액', '원화', '매입금액', '승인금액', '지급액', '비용', '지출액', 'price', 'cost', 'expense', 'total_amount', '카드사용금액', '카드이용금액'], partial: ['합계', '총액', '금액', '결제금', '이용금', '사용금', '지출금', '출금', '청구금', 'total', 'amount', '비용', 'price', 'cost', 'expense'], exclude: ['공급가', '부가세', '단가', '할인', 'discount', '수량'] },
            category: { exact: ['카테고리', 'category', '비용카테고리', '지출카테고리', '계정과목', '계정', '과목'], partial: ['카테고리', 'category', '계정.*과목', '계정'], exclude: [] },
            payment_method: { exact: ['결제수단', '결제방법', '지불방법', '지불수단', 'payment_method', 'payment', '카드종류', '카드사', '결제유형', '지급방법', '출금수단'], partial: ['결제수단', '결제방법', '지불', 'payment', '카드종류', '카드사'], exclude: ['금액', 'amount', '일자', 'date'] },
            memo: { exact: ['메모', '비고', '비고사항', '참고', '참고사항', 'memo', 'note', 'notes', 'remark', 'remarks', '설명', '기타', '코멘트', 'comment'], partial: ['메모', '비고', '참고', 'memo', 'note', 'remark', '코멘트', 'comment'], exclude: [] },
        };
        const mapping = {};
        const usedFields = new Set();
        // Phase 1: Exact match
        headers.forEach((h, idx) => {
            const hl = h.toLowerCase().trim().replace(/[\s_-]+/g, '');
            for (const [field, kw] of Object.entries(FIELD_KW)) {
                if (usedFields.has(field)) continue;
                if (kw.exact.some(k => hl === k.toLowerCase().replace(/[\s_-]+/g, ''))) {
                    if (!kw.exclude.some(ex => hl.includes(ex.toLowerCase()))) {
                        mapping[idx] = field;
                        usedFields.add(field);
                        break;
                    }
                }
            }
        });
        // Phase 2: Partial match
        headers.forEach((h, idx) => {
            if (mapping[idx]) return;
            const hl = h.toLowerCase().trim();
            let bestField = null, bestScore = 0;
            for (const [field, kw] of Object.entries(FIELD_KW)) {
                if (usedFields.has(field)) continue;
                if (kw.exclude.some(ex => hl.includes(ex.toLowerCase()))) continue;
                for (const p of kw.partial) {
                    try { if (new RegExp(p, 'i').test(hl) && p.length > bestScore) { bestScore = p.length; bestField = field; } }
                    catch { if (hl.includes(p.toLowerCase()) && p.length > bestScore) { bestScore = p.length; bestField = field; } }
                }
            }
            if (bestField) { mapping[idx] = bestField; usedFields.add(bestField); }
        });
        return mapping;
    };

    // ── Parse file for expense upload (multi-sheet merge) ──
    const handleExpenseFileParse = async (file) => {
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(ext)) return;

        try {
            setExpUploadFile(file);
            const data = await file.arrayBuffer();
            const wb = XLSX.read(data, { type: 'array', cellDates: true });

            // Merge all sheets
            let mergedHeaders = null;
            let mergedRows = [];

            wb.SheetNames.forEach(sheetName => {
                const ws = wb.Sheets[sheetName];
                const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });
                if (rawRows.length < 2) return;

                // Find header row (first row with 2+ non-empty cells)
                let headerIdx = 0;
                for (let i = 0; i < Math.min(rawRows.length, 5); i++) {
                    if (rawRows[i].filter(c => c !== '').length >= 2) { headerIdx = i; break; }
                }

                const sheetHeaders = rawRows[headerIdx].map(h => String(h).trim());
                const sheetRows = rawRows.slice(headerIdx + 1).filter(r => r.some(c => c !== ''));

                if (!mergedHeaders) {
                    mergedHeaders = sheetHeaders;
                    mergedRows = [...sheetRows];
                } else {
                    // Map columns from this sheet to merged headers
                    sheetHeaders.forEach(h => {
                        if (!mergedHeaders.includes(h)) mergedHeaders.push(h);
                    });
                    const colMap = sheetHeaders.map(h => mergedHeaders.indexOf(h));
                    sheetRows.forEach(row => {
                        const mapped = new Array(mergedHeaders.length).fill('');
                        row.forEach((val, idx) => {
                            if (colMap[idx] >= 0) mapped[colMap[idx]] = val;
                        });
                        mergedRows.push(mapped);
                    });
                }
            });

            if (!mergedHeaders || mergedRows.length === 0) return;

            console.log(`[ExpenseUpload] Merged ${wb.SheetNames.length} sheets: ${mergedHeaders.length} cols, ${mergedRows.length} rows`);
            setExpParsedHeaders(mergedHeaders);
            setExpParsedRows(mergedRows);
            setExpColumnMapping(autoMapExpenseColumns(mergedHeaders));
            setExpUploadStep('mapping');
        } catch (err) {
            console.error('Expense file parse error:', err);
        }
    };

    // ── Reset expense upload ──
    const resetExpUpload = () => {
        setExpUploadStep('select');
        setExpUploadFile(null);
        setExpParsedHeaders([]);
        setExpParsedRows([]);
        setExpColumnMapping({});
        setExpImportResult(null);
    };

    // ── Category keyword dictionary for auto-classification ──
    const CATEGORY_KEYWORDS = {
        materials: [
            '재료', '원재료', '원두', '식자재', '부자재', '원료', '소재', '자재',
            '커피콩', '우유', '시럽', '설탕', '밀가루', '쌀', '고기', '야채', '과일', '생수',
            '종이컵', '빨대', '리드', '냅킨', '티슈', '세제', '세정제', '일회용',
            '원자재', '재고', '매입', '입고', '도매', '구매자재',
            'material', 'ingredient', 'raw', 'supplies', 'wholesale', 'purchase',
            '반제품', '가공재료', '농산물', '수산물', '축산물', '유제품', '양념', '조미료',
            '제빵재료', '토핑', '크림', '버터', '계란', '달걀', '오일',
        ],
        packaging: [
            '포장', '박스', '봉투', '용기', '팩', '패킹', '포장재', '포장비',
            '비닐', '랩', '테이프', '스티커', '라벨', '태그', '리본', '쇼핑백',
            '종이백', '에어캡', '완충재', '택배박스', '종이상자', '선물포장',
            'packaging', 'package', 'wrapping', 'box', 'container', 'bag', 'label',
            '캐리어', '트레이', '도시락용기', '컵홀더', '슬리브',
        ],
        shipping: [
            '배송', '택배', '배달', '운송', '운반', '발송', '우편', '퀵', '퀵서비스',
            '화물', '물류', '해외배송', '국제배송', '착불', '선불', '반품배송',
            '배송대행', '풀필먼트', '우체국', 'CJ', '한진', '로젠', '롯데택배',
            'shipping', 'delivery', 'freight', 'postage', 'courier', 'logistics',
            '배달대행', '배민', '요기요', '쿠팡이츠', '배달비', '배달수수료',
        ],
        booth_rental: [
            '임대', '부스', '매장', '월세', '임차', '렌탈', '공간', '사무실',
            '보증금', '관리비', '공용관리비', '건물관리', '시설사용', '장소대여',
            '플리마켓', '팝업', '팝업스토어', '전시', '행사장', '마켓참가',
            '주방임대', '공유주방', '공유오피스', '코워킹', '창고', '창고임대',
            'rent', 'booth', 'lease', 'store', 'rental', 'office', 'warehouse',
            '부동산', '건물', '상가', '점포임대', '시장',
        ],
        transport: [
            '교통', '주차', '유류', '기름', '주유', '톨게이트', '택시', '버스',
            '지하철', 'KTX', 'SRT', '기차', '항공', '비행기', '출장교통',
            '하이패스', '주차비', '주차요금', '통행료', '차량유지', '자동차',
            '렌트카', '차량렌트', '대리운전', '카풀', '오토바이', '킥보드',
            'transport', 'parking', 'fuel', 'gas', 'taxi', 'fare', 'travel',
            '경유', '휘발유', 'LPG', '충전', '전기차충전', '타이어', '세차',
        ],
        advertising: [
            '광고', '마케팅', '홍보', '프로모션', '전단', '블로그', '인스타',
            '페이스북', '구글', '네이버', '카카오', 'SNS', '온라인광고',
            '오프라인광고', '현수막', '배너', '간판', '전단지', '명함', '인쇄',
            '이벤트', '쿠폰', '할인행사', '판촉', '판촉물', '샘플', '시식',
            'advertising', 'marketing', 'ad', 'promo', 'promotion', 'campaign',
            '브랜딩', '디자인', '로고', '사진촬영', '영상촬영', '콘텐츠',
        ],
        commission: [
            '수수료', '플랫폼', '중개', '카드수수료', '결제수수료', 'PG수수료',
            '배달앱수수료', '마켓수수료', '판매수수료', '중개수수료', '거래수수료',
            '가맹수수료', '네이버수수료', '쿠팡수수료', '카카오수수료',
            '은행수수료', '송금수수료', '환전수수료', '이체수수료',
            'commission', 'fee', 'platform', 'transaction fee', 'service fee',
            '대행수수료', '정산수수료', '결제대행', '밴수수료', 'VAN',
        ],
        labor: [
            '인건', '급여', '임금', '아르바이트', '알바', '직원', '근로', '용역',
            '일용직', '파트타임', '시급', '월급', '상여', '보너스', '퇴직금',
            '4대보험', '사회보험', '국민연금', '건강보험', '고용보험', '산재보험',
            '인력', '파견', '외주', '프리랜서', '강사비', '강연비', '자문료',
            'labor', 'wage', 'salary', 'payroll', 'staff', 'employee', 'worker',
            '야근수당', '주휴수당', '연장근로', '교육비', '복리후생', '식대지원',
        ],
        equipment: [
            '장비', '소모품', '비품', '도구', '공구', '기계', '수리', '유지',
            '설비', '시설', '인테리어', '리모델링', '집기', '가구', '선반',
            'POS', '컴퓨터', '노트북', '프린터', '모니터', '키보드', '마우스',
            '에어컨', '냉장고', '냉동고', '오븐', '커피머신', '에스프레소',
            '그라인더', '블렌더', '믹서기', '정수기', '제빙기', 'CCTV', '카메라',
            'equipment', 'tool', 'supply', 'maintenance', 'repair', 'fixture',
            '전구', '조명', 'LED', '배터리', '충전기', '케이블', '어댑터', '문구',
        ],
        food: [
            '식비', '식대', '점심', '저녁', '간식', '음료', '커피', '다과',
            '회식', '야식', '출장식비', '직원식대', '배달음식', '음식점', '식당',
            '카페', '편의점', '마트', '외식', '조식', '브런치', '제과', '베이커리',
            '분식', '패스트푸드', '한식', '중식', '일식', '양식', '뷔페',
            'food', 'meal', 'lunch', 'dinner', 'snack', 'beverage', 'catering',
            '회의다과', '손님접대', '접대비', '경조사', '축의금', '조의금',
        ],
        communication: [
            '통신', '전화', '인터넷', '문자', 'SMS', '데이터', '와이파이',
            'WiFi', 'LTE', '5G', '핸드폰', '휴대폰', '스마트폰', '유선전화',
            '팩스', '우편요금', '등기', '서버', '호스팅', '도메인', '클라우드',
            '소프트웨어', '앱', '구독', '라이선스', '이메일', '전기', '전기요금',
            '수도', '수도요금', '가스', '가스요금', '공과금', '관리비',
            'telecom', 'phone', 'internet', 'communication', 'utility',
            'SaaS', '구독료', '월정액', '정기결제',
        ],
    };

    const classifyExpenseCategory = (val, cats, getCatLbl) => {
        if (!val) return 'other';
        const vl = val.toLowerCase().trim();
        // 1) Exact match on key or label
        const exactMatch = cats.find(c => c.key === vl || getCatLbl(c.key).toLowerCase() === vl);
        if (exactMatch) return exactMatch.key;
        // 2) Keyword-based fuzzy match
        for (const [catKey, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
            if (keywords.some(kw => vl.includes(kw.toLowerCase()))) return catKey;
        }
        // 3) Fallback
        return 'other';
    };

    const classifyPaymentMethod = (val, pms) => {
        if (!val) return 'other';
        const vl = val.toLowerCase().trim();
        // Exact match
        const exact = pms.find(p => p.key === vl || p.label?.toLowerCase() === vl);
        if (exact) return exact.key;
        // Keyword match
        if (/현금|cash/i.test(vl)) return 'cash';
        if (/카드|card|신용|체크/i.test(vl)) return 'card';
        if (/이체|transfer|송금|계좌|banking/i.test(vl)) return 'transfer';
        return 'other';
    };

    // ── Import expense data ──
    const handleExpenseImport = async () => {
        const mappedCols = Object.entries(expColumnMapping).filter(([, v]) => v);
        if (mappedCols.length === 0 || expParsedRows.length === 0) return;

        setExpUploadStep('importing');
        setExpImporting(true);

        let success = 0, fail = 0, errors = [];
        const categoryStats = {};
        const insertedRecords = [];

        for (let ri = 0; ri < expParsedRows.length; ri++) {
            const row = expParsedRows[ri];
            const record = { id: 0, expense_date: '', amount: 0, category: 'other', payment_method: 'other', memo: '' };
            let itemLabel = '';

            mappedCols.forEach(([colIdx, field]) => {
                const val = String(row[parseInt(colIdx)] ?? '').trim();
                if (field === 'expense_date') {
                    if (typeof row[parseInt(colIdx)] === 'number') {
                        const d = new Date((row[parseInt(colIdx)] - 25569) * 86400 * 1000);
                        record.expense_date = d.toISOString().slice(0, 10);
                    } else if (val) {
                        const d = new Date(val.replace(/\//g, '-'));
                        if (!isNaN(d.getTime())) record.expense_date = d.toISOString().slice(0, 10);
                        else record.expense_date = val;
                    }
                } else if (field === 'amount') {
                    record.amount = parseInt(String(val).replace(/[^0-9-]/g, '')) || 0;
                } else if (field === 'category') {
                    record.category = classifyExpenseCategory(val, categories, getCatLabel);
                } else if (field === 'expense_class' || field === 'expense_item') {
                    if (field === 'expense_item') itemLabel = val;
                    if (record.category === 'other') {
                        record.category = classifyExpenseCategory(val, categories, getCatLabel);
                    }
                } else if (field === 'payment_method') {
                    record.payment_method = classifyPaymentMethod(val, paymentMethods);
                } else if (field === 'memo') {
                    record.memo = val;
                } else {
                    if (val && field !== 'transaction_no' && field !== 'quantity' && field !== 'unit' && field !== 'unit_price' && field !== 'supply_amount' && field !== 'vat' && field !== 'vendor') {
                        record.memo = record.memo ? `${record.memo} | ${val}` : val;
                    }
                }
            });

            if (!record.expense_date) record.expense_date = new Date().toISOString().slice(0, 10);
            if (record.amount <= 0) { fail++; errors.push({ row: ri + 2, error: t('statsPage.expErrNoAmount', '금액 없음') }); continue; }

            // Track category stats
            categoryStats[record.category] = (categoryStats[record.category] || 0) + 1;

            try {
                await onSave(record, true);
                success++;
                insertedRecords.push({
                    row: ri + 2,
                    date: record.expense_date,
                    item: itemLabel || record.memo?.split('|')[0]?.trim() || '',
                    amount: record.amount,
                    category: record.category,
                });
            } catch {
                fail++;
                errors.push({ row: ri + 2, error: t('statsPage.serverError', '서버 에러') });
            }
        }

        setExpImportResult({
            inserted: success, skipped: fail, total: expParsedRows.length, errors,
            categoryStats, insertedRecords,
        });
        setExpImporting(false);
        setExpUploadStep('done');
    };

    // Merge custom categories with defaults
    const allCategories = useMemo(() => {
        const customs = customCategories.map(c => ({
            key: `custom_${c}`, icon: FileText, color: 'from-slate-400 to-slate-600', bg: 'bg-slate-50', text: 'text-slate-600', customLabel: c
        }));
        return [...categories, ...customs];
    }, [categories, customCategories]);

    const allPaymentMethods = useMemo(() => {
        const customs = customPaymentMethods.map(p => ({
            key: `custom_${p}`, icon: Wallet, label: p
        }));
        return [...paymentMethods, ...customs];
    }, [paymentMethods, customPaymentMethods]);

    const [formData, setFormData] = useState({
        id: initial?.id || 0,
        expense_date: initial?.expense_date || new Date().toISOString().slice(0, 10),
        amount: initial?.amount || '',
        category: initial?.category || 'materials',
        payment_method: initial?.payment_method || 'card',
        memo: initial?.memo || '',
    });

    // ── Add custom category ──
    const addCustomCategory = () => {
        const name = customCatName.trim();
        if (!name || customCategories.includes(name)) return;
        const updated = [...customCategories, name];
        setCustomCategories(updated);
        localStorage.setItem('expense_custom_categories', JSON.stringify(updated));
        setFormData(f => ({ ...f, category: `custom_${name}` }));
        setCustomCatName('');
        setShowCustomCatInput(false);
    };

    // ── Add custom payment method ──
    const addCustomPaymentMethod = () => {
        const name = customPmName.trim();
        if (!name || customPaymentMethods.includes(name)) return;
        const updated = [...customPaymentMethods, name];
        setCustomPaymentMethods(updated);
        localStorage.setItem('expense_custom_payments', JSON.stringify(updated));
        setFormData(f => ({ ...f, payment_method: `custom_${name}` }));
        setCustomPmName('');
        setShowCustomPmInput(false);
    };

    // ── Get label for any category (including custom) ──
    const getAnyCatLabel = (key) => {
        if (key?.startsWith('custom_')) return key.replace('custom_', '');
        return getCatLabel(key);
    };

    const handleSubmit = () => {
        if (!formData.expense_date || !formData.amount || parseInt(formData.amount) <= 0) return;
        onSave({ ...formData, amount: parseInt(formData.amount) });
    };

    return (
        <div className="p-5 space-y-4">
            {/* ── Country Selector (same as data add form) ── */}
            {hostCountries && (
                <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                        🌐 {t('statsPage.countrySelect', '국가 선택')}
                    </label>
                    <button type="button"
                        onClick={() => setShowCountryPicker(!showCountryPicker)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 hover:border-violet-400 transition-colors text-sm font-bold text-gray-800"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-lg">{hostCountries.find(c => c.code === expCountry)?.flag || '🏳️'}</span>
                            <span>{hostCountries.find(c => c.code === expCountry)?.name || expCountry}</span>
                        </span>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} />
                    </button>
                    {showCountryPicker && (
                        <div className="absolute z-10 mt-1 left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-xl max-h-48 overflow-y-auto">
                            {hostCountries.map(c => (
                                <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => {
                                        setExpCountry(c.code);
                                        if (onCountryChange) onCountryChange(c.code);
                                        setShowCountryPicker(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${expCountry === c.code
                                        ? 'bg-violet-50 text-violet-700 font-bold'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="text-lg">{c.flag}</span>
                                    <span className="flex-1">{c.name}</span>
                                    {expCountry === c.code && <Check size={14} className="text-violet-600" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Inline File Upload Area (not a separate tab) ── */}
            {!initial && (
                <div
                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${expDragOver ? 'border-violet-500 bg-violet-50 scale-[1.01]' : 'border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/50'}`}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setExpDragOver(true); }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setExpDragOver(true); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget)) setExpDragOver(false); }}
                    onDrop={(e) => {
                        e.preventDefault(); e.stopPropagation(); setExpDragOver(false);
                        const files = e.dataTransfer?.files;
                        if (files && files.length > 0) { setUploadMode(true); handleExpenseFileParse(files[0]); }
                    }}
                    onClick={() => expFileInputRef.current?.click()}
                >
                    <input ref={expFileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) { setUploadMode(true); handleExpenseFileParse(file); }
                            e.target.value = '';
                        }} />
                    <div className="flex items-center gap-4 pointer-events-none">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FolderUp className="text-white" size={22} />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-gray-900 text-sm">{t('statsPage.uploadDragTitle', '파일을 드래그하거나 클릭하세요')}</h4>
                            <p className="text-xs text-gray-500">Excel (.xlsx, .xls) · CSV {t('statsPage.expFileSupport', '파일 지원')}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ BULK UPLOAD STEPS (appear when file is parsed) ═══ */}
            {uploadMode && !initial && expUploadStep !== 'select' ? (
                <div className="space-y-3">
                    {/* Step: File Select */}
                    {expUploadStep === 'select' && (
                        <div
                            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${expDragOver ? 'border-violet-500 bg-violet-50 scale-[1.01]' : 'border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/50'}`}
                            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setExpDragOver(true); }}
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setExpDragOver(true); }}
                            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget)) setExpDragOver(false); }}
                            onDrop={(e) => {
                                e.preventDefault(); e.stopPropagation(); setExpDragOver(false);
                                const files = e.dataTransfer?.files;
                                if (files && files.length > 0) handleExpenseFileParse(files[0]);
                            }}
                            onClick={() => expFileInputRef.current?.click()}
                        >
                            <input ref={expFileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleExpenseFileParse(file);
                                    e.target.value = '';
                                }} />
                            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mx-auto mb-2.5 flex items-center justify-center pointer-events-none">
                                <FolderUp className="text-white" size={28} />
                            </div>
                            <h3 className="font-extrabold text-gray-900 text-lg mb-2 pointer-events-none">
                                {t('statsPage.uploadDragTitle', '파일을 드래그하거나 클릭하세요')}
                            </h3>
                            <p className="text-sm text-gray-500 pointer-events-none">
                                Excel (.xlsx, .xls) · CSV {t('statsPage.expFileSupport', '파일 지원')}
                            </p>
                        </div>
                    )}

                    {/* Step: Column Mapping */}
                    {expUploadStep === 'mapping' && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                <div className="flex items-center justify-between mb-2.5">
                                    <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                                        <FileText size={16} className="text-violet-600" />
                                        {t('statsPage.uploadMappingTitle', '컬럼 매핑')}
                                    </h3>
                                    <button onClick={resetExpUpload} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                                        <X size={12} /> {t('statsPage.cancel')}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mb-2.5">
                                    {t('statsPage.uploadMappingDesc', '파일: ')}{expUploadFile?.name} — {expParsedRows.length}{t('statsPage.uploadRows', '행 감지')}
                                </p>

                                {/* Column mapping table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left py-2 pr-3 text-gray-500 font-bold">{t('statsPage.uploadFileCol', '파일 컬럼')}</th>
                                                <th className="text-left py-2 pr-3 text-gray-500 font-bold">{t('statsPage.uploadSample', '데이터 샘플')}</th>
                                                <th className="text-left py-2 text-gray-500 font-bold">{t('statsPage.uploadMapTo', '매핑 대상')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expParsedHeaders.map((header, idx) => (
                                                <tr key={idx} className="border-b border-gray-50">
                                                    <td className="py-2 pr-3 font-bold text-gray-900">{header}</td>
                                                    <td className="py-2 pr-3 text-gray-400 truncate max-w-[150px]">
                                                        {expParsedRows[0]?.[idx] instanceof Date
                                                            ? expParsedRows[0][idx].toISOString().slice(0, 10)
                                                            : String(expParsedRows[0]?.[idx] ?? '').slice(0, 30)}
                                                    </td>
                                                    <td className="py-2">
                                                        <select
                                                            value={expColumnMapping[idx] || ''}
                                                            onChange={(e) => setExpColumnMapping(prev => ({ ...prev, [idx]: e.target.value }))}
                                                            className={`w-full px-2 py-1.5 rounded-lg border text-xs font-medium ${expColumnMapping[idx] ? 'bg-violet-50 border-violet-200 text-violet-700'
                                                                : 'bg-gray-50 border-gray-200 text-gray-500'
                                                                }`}
                                                        >
                                                            {EXPENSE_FIELDS.map(f => (
                                                                <option key={f.key} value={f.key}>{f.label}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Preview & Actions */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                <h3 className="font-extrabold text-gray-900 text-sm mb-3">
                                    {t('statsPage.uploadPreview', '미리보기')} ({Math.min(expParsedRows.length, 5)}/{expParsedRows.length}{t('statsPage.uploadRows', '행')})
                                </h3>
                                <div className="overflow-x-auto mb-2.5">
                                    <table className="w-full text-[11px]">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                {Object.entries(expColumnMapping).filter(([, v]) => v).map(([idx, field]) => (
                                                    <th key={idx} className="text-left py-1.5 px-2 font-bold text-violet-700">
                                                        {EXPENSE_FIELDS.find(f => f.key === field)?.label || field}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expParsedRows.slice(0, 5).map((row, ri) => (
                                                <tr key={ri} className="border-b border-gray-50">
                                                    {Object.entries(expColumnMapping).filter(([, v]) => v).map(([idx]) => (
                                                        <td key={idx} className="py-1.5 px-2 text-gray-700">
                                                            {row[parseInt(idx)] instanceof Date
                                                                ? row[parseInt(idx)].toISOString().slice(0, 10)
                                                                : String(row[parseInt(idx)] ?? '').slice(0, 40)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleExpenseImport}
                                        className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:from-violet-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2">
                                        <Upload size={16} />
                                        {t('statsPage.uploadImportBtn', `${expParsedRows.length}건 임포트`)}
                                    </button>
                                    <button onClick={resetExpUpload}
                                        className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                                        {t('statsPage.cancel')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step: Importing */}
                    {expUploadStep === 'importing' && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 size={48} className="text-violet-500 animate-spin mb-2.5" />
                            <p className="font-bold text-gray-900">{t('statsPage.uploadImporting', '임포트 중...')}</p>
                            <p className="text-sm text-gray-500 mt-1">{expParsedRows.length}{t('statsPage.uploadImportingRows', '행 처리 중')}</p>
                        </div>
                    )}

                    {/* Step: Done */}
                    {expUploadStep === 'done' && expImportResult && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="text-center mb-5">
                                <div className="w-14 h-14 bg-violet-100 rounded-2xl mx-auto mb-2 flex items-center justify-center">
                                    <CheckCircle size={28} className="text-violet-600" />
                                </div>
                                <h3 className="font-extrabold text-gray-900 text-lg mb-1">
                                    {t('statsPage.uploadDoneTitle', '임포트 완료!')}
                                </h3>
                                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                                    <div className="bg-violet-50 rounded-xl p-2.5">
                                        <p className="text-base font-extrabold text-violet-600">{expImportResult.inserted}</p>
                                        <p className="text-[10px] text-violet-700 font-bold">{t('statsPage.uploadDoneInserted', '성공')}</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-xl p-2.5">
                                        <p className="text-base font-extrabold text-amber-600">{expImportResult.skipped}</p>
                                        <p className="text-[10px] text-amber-700 font-bold">{t('statsPage.uploadDoneSkipped', '스킵')}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-2.5">
                                        <p className="text-base font-extrabold text-blue-600">{expImportResult.total}</p>
                                        <p className="text-[10px] text-blue-700 font-bold">{t('statsPage.uploadDoneTotal', '전체')}</p>
                                    </div>
                                </div>
                            </div>
                            {expImportResult.errors?.length > 0 && (
                                <div className="bg-red-50 rounded-xl p-3 mb-3 text-left">
                                    <p className="text-xs font-bold text-red-600 mb-1">
                                        <AlertCircle size={12} className="inline mr-1" />
                                        {t('statsPage.uploadErrors', '에러')}
                                    </p>
                                    {expImportResult.errors.slice(0, 3).map((err, i) => (
                                        <p key={i} className="text-[10px] text-red-500">Row {err.row}: {err.error}</p>
                                    ))}
                                </div>
                            )}

                            {/* Category Classification Summary */}
                            {expImportResult.categoryStats && Object.keys(expImportResult.categoryStats).length > 0 && (() => {
                                const stats = expImportResult.categoryStats;
                                const totalCat = Object.values(stats).reduce((s, v) => s + v, 0);
                                const otherCount = stats['other'] || 0;
                                const autoClassified = totalCat - otherCount;
                                const successRate = totalCat > 0 ? Math.round((autoClassified / totalCat) * 100) : 0;
                                // Sort: 'other' first, then by count desc
                                const sortedCats = Object.entries(stats).sort((a, b) => {
                                    if (a[0] === 'other') return -1;
                                    if (b[0] === 'other') return 1;
                                    return b[1] - a[1];
                                });
                                const maxCount = Math.max(...Object.values(stats));
                                return (
                                    <div className="mt-3 border-t border-gray-100 pt-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                                                📊 {t('statsPage.catClassResult', '카테고리 분류 결과')}
                                            </h4>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${successRate >= 80 ? 'bg-emerald-100 text-emerald-700' : successRate >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                {t('statsPage.catAutoRate', '자동분류')} {successRate}%
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {sortedCats.map(([catKey, count]) => {
                                                const catMeta = allCategories.find(c => c.key === catKey) || { icon: FileText, bg: 'bg-slate-50', text: 'text-slate-600' };
                                                const CIcon = catMeta.icon;
                                                const label = catMeta.customLabel || getCatLabel(catKey);
                                                const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                                const isOther = catKey === 'other';
                                                return (
                                                    <div key={catKey} className={`flex items-center gap-2 p-1.5 rounded-lg ${isOther ? 'bg-amber-50 border border-amber-200' : 'hover:bg-gray-50'}`}>
                                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${catMeta.bg}`}>
                                                            <CIcon size={12} className={catMeta.text} />
                                                        </div>
                                                        <span className={`text-[11px] font-bold w-16 truncate ${isOther ? 'text-amber-700' : 'text-gray-700'}`}>
                                                            {label}
                                                        </span>
                                                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${isOther ? 'bg-amber-400' : 'bg-violet-400'}`}
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-[11px] font-extrabold min-w-[28px] text-right ${isOther ? 'text-amber-600' : 'text-gray-600'}`}>
                                                            {count}{t('statsPage.units', '건')}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {otherCount > 0 && (
                                            <p className="text-[10px] text-amber-600 mt-2 font-medium">
                                                💡 {t('statsPage.catOtherHint', '"기타"로 분류된 항목은 지출 탭에서 개별 편집하거나, 다음 업로드 시 "지출분류" 컬럼을 포함하면 자동 분류됩니다.')}
                                            </p>
                                        )}
                                    </div>
                                );
                            })()}

                            <div className="mt-4 text-center">
                                <button onClick={() => { resetExpUpload(); onCancel(); }}
                                    className="px-8 py-3 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 transition-colors">
                                    {t('statsPage.expClose', '닫기')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* ═══ SINGLE ENTRY MODE ═══ */}
                    {/* Expense Date */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{t('statsPage.expDate', '지출 날짜')}</label>
                        <input type="date" value={formData.expense_date}
                            onChange={e => setFormData(f => ({ ...f, expense_date: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium" />
                    </div>
                    {/* Amount with currency */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">
                            {t('statsPage.expAmount', '금액')} {countryCurrency && countryCurrency[expCountry] && (
                                <span className="text-violet-600">({countryCurrency[expCountry].symbol})</span>
                            )}
                        </label>
                        <NumberInput value={formData.amount} placeholder="0"
                            onChange={val => setFormData(f => ({ ...f, amount: val }))}
                            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-right" />
                    </div>
                    {/* Category */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">{t('statsPage.expCategory', '카테고리')}</label>
                        <div className="grid grid-cols-4 gap-2">
                            {allCategories.map(cat => {
                                const CatIcon = cat.icon;
                                const selected = formData.category === cat.key;
                                const isOther = cat.key === 'other';
                                return (
                                    <button key={cat.key}
                                        onClick={() => {
                                            if (isOther) {
                                                setShowCustomCatInput(true);
                                            }
                                            setFormData(f => ({ ...f, category: cat.key }));
                                        }}
                                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-[10px] font-bold transition-all border ${selected
                                            ? `bg-gradient-to-br ${cat.color} text-white border-transparent shadow-md`
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <CatIcon size={16} />
                                        <span className="truncate w-full text-center">{cat.customLabel || getCatLabel(cat.key)}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {/* Custom category input */}
                        {showCustomCatInput && (
                            <div className="mt-2 flex gap-2 items-center animate-in slide-in-from-top-1">
                                <input type="text" value={customCatName} placeholder={t('statsPage.expCustomCatPlaceholder', '새 카테고리 이름 입력')}
                                    onChange={e => setCustomCatName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') addCustomCategory(); }}
                                    className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border border-violet-200 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-200 outline-none" autoFocus />
                                <button onClick={addCustomCategory} disabled={!customCatName.trim()}
                                    className="px-3 py-2 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors disabled:opacity-40">
                                    <Plus size={14} />
                                </button>
                                <button onClick={() => { setShowCustomCatInput(false); setCustomCatName(''); }}
                                    className="px-2 py-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Payment Method */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">{t('statsPage.expPayment', '결제수단')}</label>
                        <div className="flex gap-2 flex-wrap">
                            {allPaymentMethods.map(pm => {
                                const PMIcon = pm.icon;
                                const selected = formData.payment_method === pm.key;
                                const isOther = pm.key === 'other';
                                return (
                                    <button key={pm.key}
                                        onClick={() => {
                                            if (isOther) {
                                                setShowCustomPmInput(true);
                                            }
                                            setFormData(f => ({ ...f, payment_method: pm.key }));
                                        }}
                                        className={`flex-1 min-w-[70px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${selected
                                            ? 'bg-violet-600 text-white border-violet-600'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'
                                            }`}
                                    >
                                        <PMIcon size={14} />
                                        {pm.label}
                                    </button>
                                );
                            })}
                        </div>
                        {/* Custom payment method input */}
                        {showCustomPmInput && (
                            <div className="mt-2 flex gap-2 items-center animate-in slide-in-from-top-1">
                                <input type="text" value={customPmName} placeholder={t('statsPage.expCustomPmPlaceholder', '새 결제수단 이름 입력')}
                                    onChange={e => setCustomPmName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') addCustomPaymentMethod(); }}
                                    className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border border-violet-200 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-200 outline-none" autoFocus />
                                <button onClick={addCustomPaymentMethod} disabled={!customPmName.trim()}
                                    className="px-3 py-2 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors disabled:opacity-40">
                                    <Plus size={14} />
                                </button>
                                <button onClick={() => { setShowCustomPmInput(false); setCustomPmName(''); }}
                                    className="px-2 py-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Memo */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{t('statsPage.expMemo', '메모')}</label>
                        <textarea value={formData.memo} placeholder={t('statsPage.expMemo', '메모')}
                            onChange={e => setFormData(f => ({ ...f, memo: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm resize-none h-20" />
                    </div>
                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button onClick={handleSubmit}
                            className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:from-violet-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                            <Save size={16} />
                            {t('statsPage.expSave', '저장')}
                        </button>
                        <button onClick={onCancel}
                            className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                            {t('statsPage.expCancel', '취소')}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const EmptyPrompt = ({ onAdd }) => {
    const { t } = useTranslation('seller');
    return (
        <div className="text-center py-16">
            <TrendingUp className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-400">{t('statsPage.emptyTitle')}</h3>
            <p className="text-sm text-gray-400 mt-1">{t('statsPage.emptyDesc')}</p>
            <p className="text-xs text-gray-300 mt-3">{t('statsPage.emptyNote')}</p>
            <button onClick={onAdd}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors">
                <Plus size={16} />
                {t('statsPage.firstDataBtn')}
            </button>
        </div>
    );
};


export default SellerStats;

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Filter, ChevronDown, X } from 'lucide-react';

/**
 * Map Component using Leaflet + OpenStreetMap
 * 
 * Props:
 *   venues     - Array of venue objects with { id, name, location, latitude, longitude }
 *   center     - { lat, lng } to center the map (default: Seoul)
 *   zoom       - Zoom level 1-18 (default: 12)
 *   height     - Map height (default: '400px')
 *   singleMode - If true, show single venue with larger marker
 *   onMarkerClick - (venue) => void, callback when a marker is clicked
 *   className  - Additional CSS classes
 */

// ─── Country center coordinates ───
const COUNTRY_CENTERS = {
    'ko': { lat: 37.5665, lng: 126.9780, zoom: 11 },
    'en': { lat: 40.7128, lng: -74.0060, zoom: 10 },
    'en-GB': { lat: 51.5074, lng: -0.1278, zoom: 10 },
    'en-CA': { lat: 43.6532, lng: -79.3832, zoom: 10 },
    'fr-CA': { lat: 45.5017, lng: -73.5673, zoom: 10 },
    'ja': { lat: 35.6762, lng: 139.6503, zoom: 10 },
    'vi': { lat: 10.8231, lng: 106.6297, zoom: 10 },
    'th': { lat: 13.7563, lng: 100.5018, zoom: 10 },
    'km': { lat: 11.5564, lng: 104.9282, zoom: 11 },
    'ru': { lat: 55.7558, lng: 37.6173, zoom: 10 },
    'uk': { lat: 50.4501, lng: 30.5234, zoom: 10 },
};

// ─── Sub-districts for each region ───
const REGION_DISTRICTS = {
    '서울 전체': {
        '강남구': { lat: 37.4959, lng: 127.0628, zoom: 14 },
        '강동구': { lat: 37.5500, lng: 127.1470, zoom: 14 },
        '강북구': { lat: 37.6380, lng: 127.0270, zoom: 14 },
        '강서구': { lat: 37.5600, lng: 126.8490, zoom: 14 },
        '관악구': { lat: 37.4780, lng: 126.9520, zoom: 14 },
        '광진구': { lat: 37.5480, lng: 127.0860, zoom: 14 },
        '구로구': { lat: 37.4950, lng: 126.8580, zoom: 14 },
        '금천구': { lat: 37.4570, lng: 126.8960, zoom: 14 },
        '노원구': { lat: 37.6550, lng: 127.0580, zoom: 14 },
        '도봉구': { lat: 37.6680, lng: 127.0470, zoom: 14 },
        '동대문구': { lat: 37.5740, lng: 127.0400, zoom: 14 },
        '동작구': { lat: 37.5080, lng: 126.9380, zoom: 14 },
        '마포구': { lat: 37.5660, lng: 126.9010, zoom: 14 },
        '서대문구': { lat: 37.5780, lng: 126.9370, zoom: 14 },
        '서초구': { lat: 37.4920, lng: 127.0090, zoom: 14 },
        '성동구': { lat: 37.5510, lng: 127.0410, zoom: 14 },
        '성북구': { lat: 37.6060, lng: 127.0170, zoom: 14 },
        '송파구': { lat: 37.5140, lng: 127.1060, zoom: 14 },
        '양천구': { lat: 37.5270, lng: 126.8660, zoom: 14 },
        '영등포구': { lat: 37.5260, lng: 126.8970, zoom: 14 },
        '용산구': { lat: 37.5320, lng: 126.9810, zoom: 14 },
        '은평구': { lat: 37.6170, lng: 126.9220, zoom: 14 },
        '종로구': { lat: 37.5730, lng: 126.9790, zoom: 14 },
        '중구': { lat: 37.5610, lng: 126.9960, zoom: 14 },
        '중랑구': { lat: 37.5960, lng: 127.0940, zoom: 14 },
    },
    '경기도': {
        '수원시': { lat: 37.2636, lng: 127.0286, zoom: 13 },
        '성남시': { lat: 37.4200, lng: 127.1267, zoom: 13 },
        '고양시': { lat: 37.6584, lng: 126.8320, zoom: 13 },
        '용인시': { lat: 37.2411, lng: 127.1776, zoom: 12 },
        '부천시': { lat: 37.5034, lng: 126.7660, zoom: 13 },
        '안산시': { lat: 37.3219, lng: 126.8309, zoom: 13 },
        '안양시': { lat: 37.3943, lng: 126.9568, zoom: 13 },
        '남양주시': { lat: 37.6360, lng: 127.2165, zoom: 12 },
        '화성시': { lat: 37.1995, lng: 126.8313, zoom: 12 },
        '평택시': { lat: 36.9921, lng: 127.1127, zoom: 12 },
        '의정부시': { lat: 37.7381, lng: 127.0337, zoom: 13 },
        '시흥시': { lat: 37.3800, lng: 126.8028, zoom: 13 },
        '파주시': { lat: 37.7599, lng: 126.7802, zoom: 12 },
        '광명시': { lat: 37.4786, lng: 126.8645, zoom: 14 },
        '김포시': { lat: 37.6153, lng: 126.7156, zoom: 12 },
        '군포시': { lat: 37.3617, lng: 126.9352, zoom: 14 },
        '광주시': { lat: 37.4294, lng: 127.2551, zoom: 12 },
        '이천시': { lat: 37.2720, lng: 127.4350, zoom: 12 },
        '양주시': { lat: 37.7853, lng: 127.0456, zoom: 12 },
        '오산시': { lat: 37.1498, lng: 127.0697, zoom: 14 },
        '구리시': { lat: 37.5943, lng: 127.1296, zoom: 14 },
        '안성시': { lat: 37.0080, lng: 127.2797, zoom: 12 },
        '포천시': { lat: 37.8949, lng: 127.2003, zoom: 12 },
        '의왕시': { lat: 37.3449, lng: 126.9685, zoom: 14 },
        '하남시': { lat: 37.5393, lng: 127.2148, zoom: 13 },
        '여주시': { lat: 37.2983, lng: 127.6373, zoom: 12 },
        '양평군': { lat: 37.4917, lng: 127.4876, zoom: 12 },
        '동두천시': { lat: 37.9034, lng: 127.0607, zoom: 13 },
        '과천시': { lat: 37.4292, lng: 126.9876, zoom: 14 },
        '가평군': { lat: 37.8313, lng: 127.5098, zoom: 11 },
        '연천군': { lat: 38.0964, lng: 127.0751, zoom: 11 },
    },
    '인천': {
        '중구': { lat: 37.4738, lng: 126.6217, zoom: 13 },
        '동구': { lat: 37.4737, lng: 126.6432, zoom: 14 },
        '미추홀구': { lat: 37.4420, lng: 126.6530, zoom: 14 },
        '연수구': { lat: 37.4101, lng: 126.6783, zoom: 13 },
        '남동구': { lat: 37.4488, lng: 126.7317, zoom: 13 },
        '부평구': { lat: 37.5067, lng: 126.7219, zoom: 14 },
        '계양구': { lat: 37.5371, lng: 126.7378, zoom: 14 },
        '서구': { lat: 37.5449, lng: 126.6760, zoom: 13 },
        '강화군': { lat: 37.7470, lng: 126.4879, zoom: 12 },
        '옹진군': { lat: 37.4467, lng: 126.6356, zoom: 11 },
    },
    '부산': {
        '중구': { lat: 35.1066, lng: 129.0326, zoom: 14 },
        '서구': { lat: 35.0976, lng: 129.0243, zoom: 14 },
        '동구': { lat: 35.1295, lng: 129.0457, zoom: 14 },
        '영도구': { lat: 35.0914, lng: 129.0680, zoom: 14 },
        '부산진구': { lat: 35.1629, lng: 129.0531, zoom: 14 },
        '동래구': { lat: 35.1964, lng: 129.0838, zoom: 14 },
        '남구': { lat: 35.1365, lng: 129.0843, zoom: 14 },
        '북구': { lat: 35.1975, lng: 129.0130, zoom: 14 },
        '해운대구': { lat: 35.1631, lng: 129.1636, zoom: 13 },
        '사하구': { lat: 35.1046, lng: 128.9748, zoom: 14 },
        '금정구': { lat: 35.2431, lng: 129.0923, zoom: 14 },
        '강서구': { lat: 35.2121, lng: 128.9806, zoom: 13 },
        '연제구': { lat: 35.1761, lng: 129.0797, zoom: 14 },
        '수영구': { lat: 35.1454, lng: 129.1132, zoom: 14 },
        '사상구': { lat: 35.1526, lng: 128.9916, zoom: 14 },
        '기장군': { lat: 35.2447, lng: 129.2222, zoom: 12 },
    },
    '대구': {
        '중구': { lat: 35.8694, lng: 128.6062, zoom: 14 },
        '동구': { lat: 35.8862, lng: 128.6356, zoom: 13 },
        '서구': { lat: 35.8718, lng: 128.5592, zoom: 14 },
        '남구': { lat: 35.8462, lng: 128.5977, zoom: 14 },
        '북구': { lat: 35.8861, lng: 128.5830, zoom: 13 },
        '수성구': { lat: 35.8586, lng: 128.6306, zoom: 14 },
        '달서구': { lat: 35.8299, lng: 128.5327, zoom: 13 },
        '달성군': { lat: 35.7749, lng: 128.4313, zoom: 12 },
    },
    '대전': {
        '동구': { lat: 36.3121, lng: 127.4558, zoom: 13 },
        '중구': { lat: 36.3254, lng: 127.4212, zoom: 13 },
        '서구': { lat: 36.3555, lng: 127.3836, zoom: 13 },
        '유성구': { lat: 36.3622, lng: 127.3561, zoom: 13 },
        '대덕구': { lat: 36.3467, lng: 127.4156, zoom: 13 },
    },
    '광주': {
        '동구': { lat: 35.1460, lng: 126.9231, zoom: 14 },
        '서구': { lat: 35.1525, lng: 126.8910, zoom: 14 },
        '남구': { lat: 35.1329, lng: 126.9025, zoom: 14 },
        '북구': { lat: 35.1747, lng: 126.9120, zoom: 13 },
        '광산구': { lat: 35.1396, lng: 126.7936, zoom: 13 },
    },
    '울산': {
        '중구': { lat: 35.5698, lng: 129.3324, zoom: 14 },
        '남구': { lat: 35.5446, lng: 129.3301, zoom: 14 },
        '동구': { lat: 35.5050, lng: 129.4169, zoom: 13 },
        '북구': { lat: 35.5824, lng: 129.3612, zoom: 13 },
        '울주군': { lat: 35.5225, lng: 129.2425, zoom: 11 },
    },
    '세종': {
        '세종시': { lat: 36.4800, lng: 127.0000, zoom: 12 },
    },
    '제주': {
        '제주시': { lat: 33.4996, lng: 126.5312, zoom: 12 },
        '서귀포시': { lat: 33.2542, lng: 126.5600, zoom: 12 },
    },
    '강원': {
        '춘천시': { lat: 37.8813, lng: 127.7300, zoom: 12 },
        '원주시': { lat: 37.3422, lng: 127.9202, zoom: 12 },
        '강릉시': { lat: 37.7519, lng: 128.8761, zoom: 12 },
        '동해시': { lat: 37.5247, lng: 129.1143, zoom: 13 },
        '태백시': { lat: 37.1641, lng: 128.9858, zoom: 13 },
        '속초시': { lat: 38.2071, lng: 128.5918, zoom: 13 },
        '삼척시': { lat: 37.4500, lng: 129.1652, zoom: 12 },
        '홍천군': { lat: 37.6972, lng: 127.8886, zoom: 11 },
        '횡성군': { lat: 37.4883, lng: 127.9847, zoom: 11 },
        '영월군': { lat: 37.1837, lng: 128.4615, zoom: 11 },
        '평창군': { lat: 37.3706, lng: 128.3906, zoom: 11 },
        '정선군': { lat: 37.3808, lng: 128.6608, zoom: 11 },
        '철원군': { lat: 38.1467, lng: 127.3133, zoom: 11 },
        '화천군': { lat: 38.1063, lng: 127.7082, zoom: 11 },
        '양구군': { lat: 38.1097, lng: 127.9895, zoom: 11 },
        '인제군': { lat: 38.0697, lng: 128.1706, zoom: 11 },
        '고성군': { lat: 38.3800, lng: 128.4678, zoom: 11 },
        '양양군': { lat: 38.0754, lng: 128.6189, zoom: 11 },
    },
    '충북': {
        '청주시': { lat: 36.6424, lng: 127.4890, zoom: 12 },
        '충주시': { lat: 36.9911, lng: 127.9259, zoom: 12 },
        '제천시': { lat: 37.1327, lng: 128.1909, zoom: 12 },
        '보은군': { lat: 36.4893, lng: 127.7293, zoom: 11 },
        '옥천군': { lat: 36.3062, lng: 127.5713, zoom: 11 },
        '영동군': { lat: 36.1750, lng: 127.7836, zoom: 11 },
        '진천군': { lat: 36.8554, lng: 127.4356, zoom: 12 },
        '괴산군': { lat: 36.8150, lng: 127.7866, zoom: 11 },
        '음성군': { lat: 36.9403, lng: 127.6907, zoom: 11 },
        '단양군': { lat: 36.9846, lng: 128.3653, zoom: 11 },
        '증평군': { lat: 36.7855, lng: 127.5813, zoom: 12 },
    },
    '충남': {
        '천안시': { lat: 36.8151, lng: 127.1139, zoom: 12 },
        '공주시': { lat: 36.4465, lng: 127.1190, zoom: 12 },
        '보령시': { lat: 36.3334, lng: 126.6128, zoom: 12 },
        '아산시': { lat: 36.7898, lng: 127.0018, zoom: 12 },
        '서산시': { lat: 36.7845, lng: 126.4503, zoom: 12 },
        '논산시': { lat: 36.1872, lng: 127.0987, zoom: 12 },
        '계룡시': { lat: 36.2741, lng: 127.2487, zoom: 13 },
        '당진시': { lat: 36.8900, lng: 126.6297, zoom: 12 },
        '금산군': { lat: 36.1086, lng: 127.4878, zoom: 11 },
        '부여군': { lat: 36.2758, lng: 126.9098, zoom: 11 },
        '서천군': { lat: 36.0801, lng: 126.6941, zoom: 11 },
        '청양군': { lat: 36.4594, lng: 126.8022, zoom: 11 },
        '홍성군': { lat: 36.6011, lng: 126.6608, zoom: 11 },
        '예산군': { lat: 36.6828, lng: 126.8484, zoom: 11 },
        '태안군': { lat: 36.7456, lng: 126.2979, zoom: 11 },
    },
    '전북': {
        '전주시': { lat: 35.8242, lng: 127.1480, zoom: 12 },
        '군산시': { lat: 35.9676, lng: 126.7368, zoom: 12 },
        '익산시': { lat: 35.9483, lng: 126.9576, zoom: 12 },
        '정읍시': { lat: 35.5699, lng: 126.8558, zoom: 12 },
        '남원시': { lat: 35.4164, lng: 127.3905, zoom: 12 },
        '김제시': { lat: 35.8036, lng: 126.8809, zoom: 12 },
        '완주군': { lat: 35.9044, lng: 127.1628, zoom: 11 },
        '진안군': { lat: 35.7919, lng: 127.4246, zoom: 11 },
        '무주군': { lat: 35.9221, lng: 127.6606, zoom: 11 },
        '장수군': { lat: 35.6475, lng: 127.5211, zoom: 11 },
        '임실군': { lat: 35.6178, lng: 127.2827, zoom: 11 },
        '순창군': { lat: 35.3743, lng: 127.1378, zoom: 11 },
        '고창군': { lat: 35.4358, lng: 126.7019, zoom: 11 },
        '부안군': { lat: 35.7316, lng: 126.7332, zoom: 11 },
    },
    '전남': {
        '목포시': { lat: 34.8118, lng: 126.3922, zoom: 13 },
        '여수시': { lat: 34.7604, lng: 127.6622, zoom: 12 },
        '순천시': { lat: 34.9506, lng: 127.4874, zoom: 12 },
        '나주시': { lat: 35.0159, lng: 126.7109, zoom: 12 },
        '광양시': { lat: 34.9407, lng: 127.6958, zoom: 12 },
        '담양군': { lat: 35.3213, lng: 126.9883, zoom: 11 },
        '곡성군': { lat: 35.2819, lng: 127.2922, zoom: 11 },
        '구례군': { lat: 35.2026, lng: 127.4625, zoom: 11 },
        '고흥군': { lat: 34.6111, lng: 127.2750, zoom: 11 },
        '보성군': { lat: 34.7714, lng: 127.0800, zoom: 11 },
        '화순군': { lat: 35.0643, lng: 126.9864, zoom: 11 },
        '장흥군': { lat: 34.6819, lng: 126.9073, zoom: 11 },
        '강진군': { lat: 34.6419, lng: 126.7673, zoom: 11 },
        '해남군': { lat: 34.5735, lng: 126.5988, zoom: 11 },
        '영암군': { lat: 34.8001, lng: 126.6966, zoom: 11 },
        '무안군': { lat: 34.9906, lng: 126.4815, zoom: 11 },
        '함평군': { lat: 35.0658, lng: 126.5167, zoom: 11 },
        '영광군': { lat: 35.2771, lng: 126.5122, zoom: 11 },
        '장성군': { lat: 35.3019, lng: 126.7847, zoom: 11 },
        '완도군': { lat: 34.3108, lng: 126.7543, zoom: 11 },
        '진도군': { lat: 34.4868, lng: 126.2633, zoom: 11 },
        '신안군': { lat: 34.8272, lng: 126.1082, zoom: 10 },
    },
    '경북': {
        '포항시': { lat: 36.0190, lng: 129.3435, zoom: 12 },
        '경주시': { lat: 35.8562, lng: 129.2250, zoom: 12 },
        '김천시': { lat: 36.1398, lng: 128.1136, zoom: 12 },
        '안동시': { lat: 36.5684, lng: 128.7294, zoom: 12 },
        '구미시': { lat: 36.1196, lng: 128.3444, zoom: 12 },
        '영주시': { lat: 36.8057, lng: 128.6240, zoom: 12 },
        '영천시': { lat: 35.9733, lng: 128.9385, zoom: 12 },
        '상주시': { lat: 36.4110, lng: 128.1590, zoom: 12 },
        '문경시': { lat: 36.5866, lng: 128.1864, zoom: 12 },
        '경산시': { lat: 35.8254, lng: 128.7413, zoom: 12 },
    },
    '경남': {
        '창원시': { lat: 35.2280, lng: 128.6811, zoom: 12 },
        '진주시': { lat: 35.1798, lng: 128.1076, zoom: 12 },
        '통영시': { lat: 34.8545, lng: 128.4332, zoom: 12 },
        '사천시': { lat: 35.0036, lng: 128.0647, zoom: 12 },
        '김해시': { lat: 35.2286, lng: 128.8890, zoom: 12 },
        '밀양시': { lat: 35.5037, lng: 128.7467, zoom: 12 },
        '거제시': { lat: 34.8808, lng: 128.6213, zoom: 12 },
        '양산시': { lat: 35.3351, lng: 129.0373, zoom: 12 },
        '의령군': { lat: 35.3222, lng: 128.2617, zoom: 11 },
        '함안군': { lat: 35.2724, lng: 128.4060, zoom: 11 },
        '창녕군': { lat: 35.5441, lng: 128.4917, zoom: 11 },
        '고성군': { lat: 34.9733, lng: 128.3225, zoom: 11 },
        '남해군': { lat: 34.8377, lng: 127.8926, zoom: 11 },
        '하동군': { lat: 35.0675, lng: 127.7514, zoom: 11 },
        '산청군': { lat: 35.4156, lng: 127.8734, zoom: 11 },
        '함양군': { lat: 35.5197, lng: 127.7252, zoom: 11 },
        '거창군': { lat: 35.6869, lng: 127.9093, zoom: 11 },
        '합천군': { lat: 35.5664, lng: 128.1660, zoom: 11 },
    },
};

// ─── Major regions with center coordinates (by country) ───
const REGIONS_BY_COUNTRY = {
    'ko': {
        '서울 전체': { lat: 37.5665, lng: 126.9780, zoom: 11, keywords: ['서울', '서울특별시'] },
        '경기도': { lat: 37.2750, lng: 127.0090, zoom: 9, keywords: ['경기', '경기도'] },
        '인천': { lat: 37.4563, lng: 126.7052, zoom: 11, keywords: ['인천', '인천광역시'] },
        '부산': { lat: 35.1796, lng: 129.0756, zoom: 11, keywords: ['부산', '부산광역시'] },
        '대구': { lat: 35.8714, lng: 128.6014, zoom: 11, keywords: ['대구', '대구광역시'] },
        '대전': { lat: 36.3504, lng: 127.3845, zoom: 11, keywords: ['대전', '대전광역시'] },
        '광주': { lat: 35.1595, lng: 126.8526, zoom: 11, keywords: ['광주', '광주광역시'] },
        '울산': { lat: 35.5384, lng: 129.3114, zoom: 11, keywords: ['울산', '울산광역시'] },
        '세종': { lat: 36.4800, lng: 127.0000, zoom: 11, keywords: ['세종', '세종특별자치시'] },
        '제주': { lat: 33.4996, lng: 126.5312, zoom: 10, keywords: ['제주', '제주특별자치도'] },
        '강원': { lat: 37.8228, lng: 128.1555, zoom: 9, keywords: ['강원', '강원도', '강원특별자치도'] },
        '충북': { lat: 36.6357, lng: 127.4913, zoom: 9, keywords: ['충북', '충청북도'] },
        '충남': { lat: 36.5184, lng: 126.8000, zoom: 9, keywords: ['충남', '충청남도'] },
        '전북': { lat: 35.8200, lng: 127.1089, zoom: 9, keywords: ['전북', '전라북도', '전북특별자치도'] },
        '전남': { lat: 34.8161, lng: 126.4629, zoom: 9, keywords: ['전남', '전라남도'] },
        '경북': { lat: 36.4919, lng: 128.8889, zoom: 9, keywords: ['경북', '경상북도'] },
        '경남': { lat: 35.4606, lng: 128.2132, zoom: 9, keywords: ['경남', '경상남도'] },
    },
    'en': {
        'New York': { lat: 40.7128, lng: -74.0060, zoom: 10, keywords: ['new york', 'ny'] },
        'California': { lat: 36.7783, lng: -119.4179, zoom: 6, keywords: ['california', 'ca'] },
        'Texas': { lat: 31.9686, lng: -99.9018, zoom: 6, keywords: ['texas', 'tx'] },
        'Florida': { lat: 27.6648, lng: -81.5158, zoom: 7, keywords: ['florida', 'fl'] },
        'Illinois': { lat: 40.6331, lng: -89.3985, zoom: 7, keywords: ['illinois', 'il', 'chicago'] },
        'Washington': { lat: 47.7511, lng: -120.7401, zoom: 7, keywords: ['washington', 'wa', 'seattle'] },
        'Georgia': { lat: 32.1656, lng: -82.9001, zoom: 7, keywords: ['georgia', 'ga', 'atlanta'] },
        'Massachusetts': { lat: 42.4072, lng: -71.3824, zoom: 8, keywords: ['massachusetts', 'ma', 'boston'] },
        'Pennsylvania': { lat: 41.2033, lng: -77.1945, zoom: 7, keywords: ['pennsylvania', 'pa'] },
        'New Jersey': { lat: 40.0583, lng: -74.4057, zoom: 8, keywords: ['new jersey', 'nj'] },
        'Hawaii': { lat: 19.8968, lng: -155.5828, zoom: 7, keywords: ['hawaii', 'hi'] },
        'Nevada': { lat: 38.8026, lng: -116.4194, zoom: 7, keywords: ['nevada', 'nv', 'las vegas'] },
    },
    'en-GB': {
        'London': { lat: 51.5074, lng: -0.1278, zoom: 10, keywords: ['london'] },
        'Manchester': { lat: 53.4808, lng: -2.2426, zoom: 11, keywords: ['manchester'] },
        'Birmingham': { lat: 52.4862, lng: -1.8904, zoom: 11, keywords: ['birmingham'] },
        'Edinburgh': { lat: 55.9533, lng: -3.1883, zoom: 11, keywords: ['edinburgh'] },
        'Glasgow': { lat: 55.8642, lng: -4.2518, zoom: 11, keywords: ['glasgow'] },
        'Liverpool': { lat: 53.4084, lng: -2.9916, zoom: 11, keywords: ['liverpool'] },
        'Bristol': { lat: 51.4545, lng: -2.5879, zoom: 11, keywords: ['bristol'] },
        'Cardiff': { lat: 51.4816, lng: -3.1791, zoom: 11, keywords: ['cardiff'] },
        'Belfast': { lat: 54.5973, lng: -5.9301, zoom: 11, keywords: ['belfast'] },
        'Leeds': { lat: 53.8008, lng: -1.5491, zoom: 11, keywords: ['leeds'] },
    },
    'en-CA': {
        'Ontario': { lat: 51.2538, lng: -85.3232, zoom: 5, keywords: ['ontario', 'toronto'] },
        'British Columbia': { lat: 53.7267, lng: -127.6476, zoom: 5, keywords: ['british columbia', 'bc', 'vancouver'] },
        'Quebec': { lat: 46.8139, lng: -71.2080, zoom: 6, keywords: ['quebec', 'montreal'] },
        'Alberta': { lat: 53.9333, lng: -116.5765, zoom: 5, keywords: ['alberta', 'calgary', 'edmonton'] },
        'Manitoba': { lat: 53.7609, lng: -98.8139, zoom: 5, keywords: ['manitoba', 'winnipeg'] },
        'Saskatchewan': { lat: 52.9399, lng: -106.4509, zoom: 5, keywords: ['saskatchewan'] },
        'Nova Scotia': { lat: 44.6820, lng: -63.7443, zoom: 7, keywords: ['nova scotia', 'halifax'] },
        'New Brunswick': { lat: 46.5653, lng: -66.4619, zoom: 7, keywords: ['new brunswick'] },
    },
    'fr-CA': {
        'Ontario': { lat: 51.2538, lng: -85.3232, zoom: 5, keywords: ['ontario', 'toronto'] },
        'Colombie-Britannique': { lat: 53.7267, lng: -127.6476, zoom: 5, keywords: ['colombie-britannique', 'bc', 'vancouver'] },
        'Québec': { lat: 46.8139, lng: -71.2080, zoom: 6, keywords: ['québec', 'montréal'] },
        'Alberta': { lat: 53.9333, lng: -116.5765, zoom: 5, keywords: ['alberta', 'calgary'] },
        'Manitoba': { lat: 53.7609, lng: -98.8139, zoom: 5, keywords: ['manitoba', 'winnipeg'] },
        'Saskatchewan': { lat: 52.9399, lng: -106.4509, zoom: 5, keywords: ['saskatchewan'] },
        'Nouvelle-Écosse': { lat: 44.6820, lng: -63.7443, zoom: 7, keywords: ['nouvelle-écosse', 'halifax'] },
        'Nouveau-Brunswick': { lat: 46.5653, lng: -66.4619, zoom: 7, keywords: ['nouveau-brunswick'] },
    },
    'ja': {
        '東京都': { lat: 35.6762, lng: 139.6503, zoom: 10, keywords: ['東京', 'tokyo'] },
        '大阪府': { lat: 34.6937, lng: 135.5023, zoom: 10, keywords: ['大阪', 'osaka'] },
        '京都府': { lat: 35.0116, lng: 135.7681, zoom: 10, keywords: ['京都', 'kyoto'] },
        '北海道': { lat: 43.0642, lng: 141.3469, zoom: 7, keywords: ['北海道', 'hokkaido', '札幌'] },
        '愛知県': { lat: 35.1802, lng: 136.9066, zoom: 10, keywords: ['愛知', '名古屋', 'nagoya'] },
        '福岡県': { lat: 33.5904, lng: 130.4017, zoom: 10, keywords: ['福岡', 'fukuoka'] },
        '神奈川県': { lat: 35.4478, lng: 139.6425, zoom: 10, keywords: ['神奈川', '横浜', 'yokohama'] },
        '兵庫県': { lat: 34.6913, lng: 135.1830, zoom: 9, keywords: ['兵庫', '神戸', 'kobe'] },
        '広島県': { lat: 34.3966, lng: 132.4596, zoom: 9, keywords: ['広島', 'hiroshima'] },
        '沖縄県': { lat: 26.3344, lng: 127.8056, zoom: 9, keywords: ['沖縄', 'okinawa'] },
        '宮城県': { lat: 38.2688, lng: 140.8721, zoom: 9, keywords: ['宮城', '仙台', 'sendai'] },
        '千葉県': { lat: 35.6073, lng: 140.1063, zoom: 9, keywords: ['千葉', 'chiba'] },
    },
    'vi': {
        'Hà Nội': { lat: 21.0285, lng: 105.8542, zoom: 11, keywords: ['hà nội', 'ha noi', 'hanoi'] },
        'TP. Hồ Chí Minh': { lat: 10.8231, lng: 106.6297, zoom: 11, keywords: ['hồ chí minh', 'ho chi minh', 'saigon'] },
        'Đà Nẵng': { lat: 16.0544, lng: 108.2022, zoom: 11, keywords: ['đà nẵng', 'da nang'] },
        'Hải Phòng': { lat: 20.8449, lng: 106.6881, zoom: 11, keywords: ['hải phòng', 'hai phong'] },
        'Cần Thơ': { lat: 10.0452, lng: 105.7469, zoom: 11, keywords: ['cần thơ', 'can tho'] },
        'Nha Trang': { lat: 12.2388, lng: 109.1967, zoom: 11, keywords: ['nha trang', 'khánh hòa'] },
        'Huế': { lat: 16.4637, lng: 107.5909, zoom: 11, keywords: ['huế', 'hue'] },
        'Đà Lạt': { lat: 11.9404, lng: 108.4583, zoom: 11, keywords: ['đà lạt', 'da lat', 'lâm đồng'] },
        'Vũng Tàu': { lat: 10.4114, lng: 107.1362, zoom: 11, keywords: ['vũng tàu', 'vung tau'] },
        'Quảng Ninh': { lat: 21.0064, lng: 107.2925, zoom: 9, keywords: ['quảng ninh', 'hạ long'] },
    },
    'th': {
        'กรุงเทพมหานคร': { lat: 13.7563, lng: 100.5018, zoom: 11, keywords: ['กรุงเทพ', 'bangkok'] },
        'เชียงใหม่': { lat: 18.7883, lng: 98.9853, zoom: 10, keywords: ['เชียงใหม่', 'chiang mai'] },
        'ภูเก็ต': { lat: 7.8804, lng: 98.3923, zoom: 10, keywords: ['ภูเก็ต', 'phuket'] },
        'พัทยา': { lat: 12.9236, lng: 100.8825, zoom: 11, keywords: ['พัทยา', 'pattaya', 'ชลบุรี'] },
        'เชียงราย': { lat: 19.9105, lng: 99.8406, zoom: 10, keywords: ['เชียงราย', 'chiang rai'] },
        'ขอนแก่น': { lat: 16.4322, lng: 102.8236, zoom: 10, keywords: ['ขอนแก่น', 'khon kaen'] },
        'สุราษฎร์ธานี': { lat: 9.1382, lng: 99.3217, zoom: 9, keywords: ['สุราษฎร์ธานี', 'surat thani', 'เกาะสมุย'] },
        'นครราชสีมา': { lat: 14.9799, lng: 102.0978, zoom: 10, keywords: ['นครราชสีมา', 'nakhon ratchasima', 'โคราช'] },
        'สงขลา': { lat: 7.1896, lng: 100.5945, zoom: 10, keywords: ['สงขลา', 'หาดใหญ่', 'songkhla'] },
    },
    'km': {
        'ភ្នំពេញ': { lat: 11.5564, lng: 104.9282, zoom: 12, keywords: ['ភ្នំពេញ', 'phnom penh'] },
        'សៀមរាប': { lat: 13.3633, lng: 103.8600, zoom: 11, keywords: ['សៀមរាប', 'siem reap'] },
        'បាត់ដំបង': { lat: 13.1023, lng: 103.1986, zoom: 11, keywords: ['បាត់ដំបង', 'battambang'] },
        'ព្រះសីហនុ': { lat: 10.6093, lng: 103.5228, zoom: 11, keywords: ['ព្រះសីហនុ', 'sihanoukville'] },
        'កំពង់ចាម': { lat: 11.9925, lng: 105.4533, zoom: 10, keywords: ['កំពង់ចាម', 'kampong cham'] },
        'កំពត': { lat: 10.6104, lng: 104.1722, zoom: 10, keywords: ['កំពត', 'kampot'] },
    },
    'ru': {
        'Москва': { lat: 55.7558, lng: 37.6173, zoom: 10, keywords: ['москва', 'moscow'] },
        'Санкт-Петербург': { lat: 59.9343, lng: 30.3351, zoom: 10, keywords: ['санкт-петербург', 'saint petersburg'] },
        'Новосибирск': { lat: 55.0084, lng: 82.9357, zoom: 10, keywords: ['новосибирск', 'novosibirsk'] },
        'Екатеринбург': { lat: 56.8389, lng: 60.6057, zoom: 10, keywords: ['екатеринбург', 'yekaterinburg'] },
        'Казань': { lat: 55.7887, lng: 49.1221, zoom: 10, keywords: ['казань', 'kazan'] },
        'Нижний Новгород': { lat: 56.2965, lng: 43.9361, zoom: 10, keywords: ['нижний новгород'] },
        'Красноярск': { lat: 56.0153, lng: 92.8932, zoom: 10, keywords: ['красноярск'] },
        'Владивосток': { lat: 43.1156, lng: 131.8855, zoom: 10, keywords: ['владивосток', 'vladivostok'] },
        'Сочи': { lat: 43.6028, lng: 39.7342, zoom: 11, keywords: ['сочи', 'sochi'] },
    },
    'uk': {
        'Київ': { lat: 50.4501, lng: 30.5234, zoom: 10, keywords: ['київ', 'kyiv'] },
        'Харків': { lat: 49.9935, lng: 36.2304, zoom: 10, keywords: ['харків', 'kharkiv'] },
        'Одеса': { lat: 46.4825, lng: 30.7233, zoom: 10, keywords: ['одеса', 'odesa'] },
        'Дніпро': { lat: 48.4647, lng: 35.0462, zoom: 10, keywords: ['дніпро', 'dnipro'] },
        'Львів': { lat: 49.8397, lng: 24.0297, zoom: 11, keywords: ['львів', 'lviv'] },
        'Запоріжжя': { lat: 47.8388, lng: 35.1396, zoom: 10, keywords: ['запоріжжя'] },
        'Вінниця': { lat: 49.2331, lng: 28.4682, zoom: 10, keywords: ['вінниця', 'vinnytsia'] },
        'Полтава': { lat: 49.5883, lng: 34.5514, zoom: 10, keywords: ['полтава'] },
    },
};

// Helper to get REGIONS for current country
const getRegionsForCountry = (code) => {
    if (!code || code === 'all') return REGIONS_BY_COUNTRY['ko'];
    return REGIONS_BY_COUNTRY[code] || REGIONS_BY_COUNTRY['ko'];
};

// Helper to get default region for country
const getDefaultRegion = (code) => {
    const regions = getRegionsForCountry(code);
    return Object.keys(regions)[0] || '서울 전체';
};

const KakaoMap = ({
    venues = [],
    center = null,
    zoom = 12,
    height = '400px',
    singleMode = false,
    onMarkerClick = null,
    countryCode = 'all',
    className = ''
}) => {
    const mapRef = useRef(null);
    const { t } = useTranslation();
    const mapInstanceRef = useRef(null);
    const [mapError, setMapError] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [activeTab, setActiveTab] = useState('region'); // 'region' | 'district'
    const [selectedRegion, setSelectedRegion] = useState(getDefaultRegion(countryCode));
    const filterRef = useRef(null);

    // Filter venues that have valid coordinates
    const validVenues = venues.filter(v => v.latitude && v.longitude);

    // Extract unique districts from venue locations
    const venueDistricts = [...new Set(validVenues.map(v => {
        if (!v.location) return null;
        // Extract district (구) from address like "서울 강남구 ..."
        const match = v.location.match(/([가-힣]+구)/);
        return match ? match[1] : null;
    }).filter(Boolean))];

    // Close filter on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setShowFilter(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load Leaflet CSS + JS dynamically
    useEffect(() => {
        if (!mapRef.current) return;
        let cancelled = false;

        const loadLeaflet = () => {
            return new Promise((resolve, reject) => {
                if (window.L) {
                    resolve();
                    return;
                }

                if (!document.querySelector('link[href*="leaflet"]')) {
                    const css = document.createElement('link');
                    css.rel = 'stylesheet';
                    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    css.crossOrigin = '';
                    document.head.appendChild(css);
                }

                if (!document.querySelector('script[src*="leaflet"]')) {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.crossOrigin = '';
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to load Leaflet'));
                    document.head.appendChild(script);
                } else {
                    const check = setInterval(() => {
                        if (window.L) { clearInterval(check); resolve(); }
                    }, 100);
                    setTimeout(() => { clearInterval(check); reject(new Error('Timeout')); }, 10000);
                }
            });
        };

        loadLeaflet()
            .then(() => {
                if (cancelled || !mapRef.current) return;
                initMap();
                setMapLoaded(true);
            })
            .catch(err => {
                console.error('Map load error:', err);
                if (!cancelled) setMapError(true);
            });

        return () => {
            cancelled = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update markers when venues change
    useEffect(() => {
        if (mapInstanceRef.current && mapLoaded) {
            updateMarkers();
        }
    }, [venues, mapLoaded]);

    // Re-center map and reset region filter when countryCode changes
    useEffect(() => {
        if (!mapInstanceRef.current || !mapLoaded) return;
        // Reset selected region to default for the new country
        setSelectedRegion(getDefaultRegion(countryCode));
        setActiveTab('region');
        if (!countryCode || countryCode === 'all' || countryCode === 'ko') return;
        const cc = COUNTRY_CENTERS[countryCode];
        if (cc) {
            mapInstanceRef.current.flyTo([cc.lat, cc.lng], cc.zoom, { duration: 1.2 });
        }
    }, [countryCode, mapLoaded]);

    const initMap = () => {
        const L = window.L;

        let centerLat = 37.5665;
        let centerLng = 126.9780;

        if (center) {
            centerLat = center.lat;
            centerLng = center.lng;
        } else if (validVenues.length === 1) {
            centerLat = parseFloat(validVenues[0].latitude);
            centerLng = parseFloat(validVenues[0].longitude);
        } else if (validVenues.length > 1) {
            const avgLat = validVenues.reduce((sum, v) => sum + parseFloat(v.latitude), 0) / validVenues.length;
            const avgLng = validVenues.reduce((sum, v) => sum + parseFloat(v.longitude), 0) / validVenues.length;
            centerLat = avgLat;
            centerLng = avgLng;
        }

        const map = L.map(mapRef.current, {
            center: [centerLat, centerLng],
            zoom: singleMode ? 16 : zoom,
            zoomControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
        updateMarkers();
    };

    const updateMarkers = () => {
        const L = window.L;
        const map = mapInstanceRef.current;
        if (!map || !L) return;

        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        if (validVenues.length === 0) return;

        const typeLabels = {
            popup: t('mapComponent.typePopup'), gallery: t('mapComponent.typeGallery'), cafe: t('mapComponent.typeCafe'),
            showroom: t('mapComponent.typeShowroom'), fleamarket: t('mapComponent.typeFleamarket'), store: t('mapComponent.typeStore')
        };

        const bounds = [];

        validVenues.forEach(venue => {
            const lat = parseFloat(venue.latitude);
            const lng = parseFloat(venue.longitude);
            bounds.push([lat, lng]);

            const icon = L.divIcon({
                className: 'custom-map-marker',
                html: `<div style="
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    width: 32px;
                    height: 32px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            const typeLabel = typeLabels[venue.type] || venue.type || '';
            const price = venue.price
                ? (Number(venue.price) === 0 ? t('mapComponent.free') : `₩${Number(venue.price).toLocaleString()}`)
                : '';

            const popupContent = `
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; min-width:180px;">
                    <div style="font-weight:700; font-size:14px; color:#1f2937; margin-bottom:4px;">${venue.name}</div>
                    <div style="font-size:12px; color:#6b7280; margin-bottom:6px;">📍 ${venue.location || ''}</div>
                    <div>
                        ${typeLabel ? `<span style="display:inline-block; background:#eef2ff; color:#4f46e5; font-size:11px; padding:2px 8px; border-radius:10px; font-weight:600; margin-right:4px;">${typeLabel}</span>` : ''}
                        ${price ? `<span style="display:inline-block; background:#f0fdf4; color:#16a34a; font-size:11px; padding:2px 8px; border-radius:10px; font-weight:600;">${price}</span>` : ''}
                    </div>
                </div>
            `;

            const marker = L.marker([lat, lng], { icon })
                .addTo(map)
                .bindPopup(popupContent);

            if (singleMode && validVenues.length === 1) {
                marker.openPopup();
            }

            marker.on('click', () => {
                if (onMarkerClick) {
                    onMarkerClick(venue);
                }
            });
        });

        // Fit bounds if multiple venues
        if (bounds.length > 1 && !singleMode) {
            map.fitBounds(bounds, { padding: [30, 30] });
        }
    };

    // Navigate map to a specific location
    const navigateToLocation = (lat, lng, zoomLevel) => {
        const map = mapInstanceRef.current;
        if (!map) return;
        map.flyTo([lat, lng], zoomLevel, { duration: 1.2 });
        setShowFilter(false);
    };

    // Error state
    if (mapError) {
        return (
            <div
                className={`bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center ${className}`}
                style={{ height }}
            >
                <MapPin size={32} className="text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm font-medium">{t('mapComponent.mapLoadError')}</p>
                <p className="text-gray-300 text-xs mt-1">{t('mapComponent.checkInternet')}</p>
            </div>
        );
    }

    // No venues with coordinates
    if (validVenues.length === 0 && venues.length > 0) {
        return (
            <div
                className={`bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center ${className}`}
                style={{ height }}
            >
                <MapPin size={32} className="text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm font-medium">{t('mapComponent.noLocationData')}</p>
                <p className="text-gray-300 text-xs mt-1">{t('mapComponent.registerCoordinates')}</p>
            </div>
        );
    }

    return (
        <div className={`relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${className}`}>
            <div ref={mapRef} style={{ width: '100%', height }} />

            {/* Filter Button + Dropdown (non-singleMode only) */}
            {!singleMode && (
                <div ref={filterRef} className="absolute bottom-3 left-3" style={{ zIndex: 10 }}>
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg text-sm font-bold text-gray-700 border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                    >
                        <Filter size={14} className="text-indigo-500" />
                        <MapPin size={12} className="text-indigo-400" />
                        {t('mapComponent.venueCount', { count: validVenues.length })}
                        <ChevronDown size={14} className={`transition-transform ${showFilter ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Filter Dropdown */}
                    {showFilter && (
                        <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
                            {/* Header */}
                            <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex justify-between items-center">
                                <span className="font-bold text-sm">{t('mapComponent.regionFilter')}</span>
                                <button onClick={() => setShowFilter(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-100">
                                <button
                                    onClick={() => setActiveTab('region')}
                                    className={`flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === 'region'
                                        ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {t('mapComponent.metropolitanTab')}
                                </button>
                                {(!countryCode || countryCode === 'all' || countryCode === 'ko') && (
                                    <button
                                        onClick={() => setActiveTab('district')}
                                        className={`flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === 'district'
                                            ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {t('mapComponent.districtDetailTab', { region: selectedRegion.replace(' 전체', '') })}
                                    </button>
                                )}
                                <button
                                    onClick={() => setActiveTab('venue')}
                                    className={`flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === 'venue'
                                        ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {t('mapComponent.venueShortcutTab')}
                                </button>
                            </div>

                            {/* Content */}
                            <div className="max-h-56 overflow-y-auto custom-scrollbar p-2">
                                {activeTab === 'region' && (
                                    <div className="grid grid-cols-2 gap-1">
                                        {Object.entries(getRegionsForCountry(countryCode)).map(([name, coords]) => {
                                            // Count venues matching any keyword for this region
                                            const count = validVenues.filter(v => {
                                                const loc = (v.location || '').toLowerCase();
                                                const reg = (v.region || '').toLowerCase();
                                                return (coords.keywords || []).some(kw => {
                                                    const kwLower = kw.toLowerCase();
                                                    return loc.includes(kwLower) || reg.includes(kwLower);
                                                });
                                            }).length;
                                            const isSelected = selectedRegion === name;
                                            return (
                                                <button
                                                    key={name}
                                                    onClick={() => {
                                                        navigateToLocation(coords.lat, coords.lng, coords.zoom);
                                                        setSelectedRegion(name);
                                                    }}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${isSelected ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                                >
                                                    <span>{name}</span>
                                                    {count > 0 && (
                                                        <span className="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{count}</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeTab === 'district' && (
                                    <div className="grid grid-cols-2 gap-1">
                                        {REGION_DISTRICTS[selectedRegion] ? Object.entries(REGION_DISTRICTS[selectedRegion]).map(([name, coords]) => {
                                            const count = validVenues.filter(v => v.location && v.location.includes(name)).length;
                                            const hasVenues = count > 0;
                                            return (
                                                <button
                                                    key={name}
                                                    onClick={() => navigateToLocation(coords.lat, coords.lng, coords.zoom)}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${hasVenues
                                                        ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                                        : 'text-gray-300'
                                                        }`}
                                                >
                                                    <span>{name}</span>
                                                    {hasVenues && (
                                                        <span className="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{count}</span>
                                                    )}
                                                </button>
                                            );
                                        }) : (
                                            <p className="col-span-2 text-center text-gray-400 text-xs py-4">{t('mapComponent.noDistrictData')}</p>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'venue' && (
                                    <div className="space-y-1">
                                        {validVenues.length === 0 ? (
                                            <p className="text-center text-gray-400 text-xs py-4">{t('mapComponent.noVenuesWithCoords')}</p>
                                        ) : (
                                            validVenues.map(venue => (
                                                <button
                                                    key={venue.id}
                                                    onClick={() => navigateToLocation(parseFloat(venue.latitude), parseFloat(venue.longitude), 16)}
                                                    className="w-full flex items-start gap-2 px-3 py-2 rounded-lg text-left hover:bg-indigo-50 transition-all"
                                                >
                                                    <MapPin size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-gray-800 truncate">{venue.name}</p>
                                                        <p className="text-[10px] text-gray-400 truncate">{venue.location}</p>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KakaoMap;

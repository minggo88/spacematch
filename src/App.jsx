import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { LocaleProvider } from './context/LocaleContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignupHost from './pages/SignupHost';
import SignupSelection from './pages/SignupSelection';
import FindEmail from './pages/FindEmail';
import ResetPassword from './pages/ResetPassword';
import LandingPage from './pages/LandingPage';
import ServicesPage from './pages/ServicesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RecruitmentDashboard from './pages/RecruitmentDashboard';
import HostPublicProfile from './pages/HostPublicProfile';
import AdSharePage from './pages/AdSharePage';
import CampaignSharePage from './pages/CampaignSharePage';
import SecurityGuard from './components/SecurityGuard';

// ── Lazy-loaded heavy pages (code splitting) ──
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminVenues = React.lazy(() => import('./pages/admin/AdminVenues'));
const AdminApplications = React.lazy(() => import('./pages/admin/AdminApplications'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminUserDetail = React.lazy(() => import('./pages/admin/AdminUserDetail'));
const AdminPromotions = React.lazy(() => import('./pages/admin/AdminPromotions'));
const AdminCancellations = React.lazy(() => import('./pages/admin/AdminCancellations'));
const SuperAdminDatabase = React.lazy(() => import('./pages/admin/SuperAdminDatabase'));
const AdminAds = React.lazy(() => import('./pages/admin/AdminAds'));
const AdminTrash = React.lazy(() => import('./pages/admin/AdminTrash'));
const AdminPopups = React.lazy(() => import('./pages/admin/AdminPopups'));
const AdminSecurity = React.lazy(() => import('./pages/admin/AdminSecurity'));
const AdminPayments = React.lazy(() => import('./pages/admin/AdminPayments'));
const AdminSellerStats = React.lazy(() => import('./pages/admin/AdminSellerStats'));
const AdminCalcStats = React.lazy(() => import('./pages/admin/AdminCalcStats'));
const SellerDashboard = React.lazy(() => import('./pages/seller/SellerDashboard'));
const SellerApplications = React.lazy(() => import('./pages/seller/SellerApplications'));
const SellerProfile = React.lazy(() => import('./pages/seller/SellerProfile'));
const SellerPayments = React.lazy(() => import('./pages/seller/SellerPayments'));
const SellerStats = React.lazy(() => import('./pages/seller/SellerStats'));
const HostDashboard = React.lazy(() => import('./pages/host/HostDashboard'));
const HostVenues = React.lazy(() => import('./pages/host/HostVenues'));
const SellerHostDirectory = React.lazy(() => import('./pages/seller/SellerHostDirectory'));
const HostSellerDirectory = React.lazy(() => import('./pages/host/HostSellerDirectory'));
const SellerCommunity = React.lazy(() => import('./pages/seller/SellerCommunity'));
const HostCommunity = React.lazy(() => import('./pages/host/HostCommunity'));
const HostApplications = React.lazy(() => import('./pages/host/HostApplications'));
const GeneralCommunity = React.lazy(() => import('./pages/community/GeneralCommunity'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const HostAnalyticsReport = React.lazy(() => import('./pages/host/HostAnalyticsReport'));
const HostStats = React.lazy(() => import('./pages/host/HostStats'));
const SellerPopularAlerts = React.lazy(() => import('./pages/seller/SellerPopularAlerts'));
const SellerMarketing = React.lazy(() => import('./pages/seller/SellerMarketing'));
const HostMarketing = React.lazy(() => import('./pages/host/HostMarketing'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const AdminCS = React.lazy(() => import('./pages/admin/AdminCS'));
const NotificationSettings = React.lazy(() => import('./pages/NotificationSettings'));
const AdminMenuVisibility = React.lazy(() => import('./pages/admin/AdminMenuVisibility'));
const AdminMarketing = React.lazy(() => import('./pages/admin/AdminMarketing'));
const AdminEmailMarketing = React.lazy(() => import('./pages/admin/AdminEmailMarketing'));
const AdminVendorManagement = React.lazy(() => import('./pages/admin/AdminVendorManagement'));
const VendorDashboard = React.lazy(() => import('./pages/vendor/VendorDashboard'));
const VendorSellerDirectory = React.lazy(() => import('./pages/vendor/VendorSellerDirectory'));
const VendorProposals = React.lazy(() => import('./pages/vendor/VendorProposals'));
const VendorShipments = React.lazy(() => import('./pages/vendor/VendorShipments'));
const VendorSettlements = React.lazy(() => import('./pages/vendor/VendorSettlements'));
const SellerProposals = React.lazy(() => import('./pages/seller/SellerProposals'));
const SellerShipments = React.lazy(() => import('./pages/seller/SellerShipments'));
const SellerSettlements = React.lazy(() => import('./pages/seller/SellerSettlements'));
const VendorProfile = React.lazy(() => import('./pages/vendor/VendorProfile'));
const SignupVendor = React.lazy(() => import('./pages/SignupVendor'));
import { useGeoLanguage } from './hooks/useGeoLanguage';

// Lazy loading fallback
const LazyFallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
);

// Role-based route protection component
const RoleRoute = ({ allowedRoles, children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user.role)) {
        // Redirect to their correct dashboard
        const redirectMap = { admin: '/admin', superadmin: '/admin', host: '/host', seller: '/seller', vendor: '/vendor' };
        return <Navigate to={redirectMap[user.role] || '/login'} replace />;
    }
    return children;
};

function App() {
    // IP 기반 언어/통화 자동 감지 (첫 방문 시에만 동작)
    useGeoLanguage();

    return (
        <ToastProvider>
            <AuthProvider>
                <SecurityGuard />
                <DataProvider>
                    <LocaleProvider>
                        <Router basename="/">
                            <Suspense fallback={<LazyFallback />}>
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<SignupSelection />} />
                                    <Route path="/signup/seller" element={<Signup />} />
                                    <Route path="/signup/host" element={<SignupHost />} />
                                    <Route path="/signup/vendor" element={<SignupVendor />} />
                                    <Route path="/find-email" element={<FindEmail />} />
                                    <Route path="/reset-password" element={<ResetPassword />} />

                                    {/* Admin Routes — admin/superadmin only */}
                                    <Route path="/admin" element={<RoleRoute allowedRoles={['admin', 'superadmin']}><Layout /></RoleRoute>}>
                                        <Route index element={<SellerDashboard />} />
                                        <Route path="dashboard" element={<AdminDashboard />} />
                                        <Route path="venues" element={<AdminVenues />} />
                                        <Route path="applications" element={<AdminApplications />} />
                                        <Route path="users" element={<AdminUsers />} />
                                        <Route path="users/:id" element={<AdminUserDetail />} />
                                        <Route path="promotions" element={<AdminPromotions />} />
                                        <Route path="cancellations" element={<AdminCancellations />} />
                                        <Route path="database" element={<SuperAdminDatabase />} />
                                        <Route path="ads" element={<AdminAds />} />
                                        <Route path="popups" element={<AdminPopups />} />
                                        <Route path="security" element={<AdminSecurity />} />
                                        <Route path="payments" element={<AdminPayments />} />
                                        <Route path="seller-stats" element={<AdminSellerStats />} />
                                        <Route path="calc-stats" element={<AdminCalcStats />} />
                                        <Route path="community/seller" element={<SellerCommunity />} />
                                        <Route path="community/host" element={<HostCommunity />} />
                                        <Route path="community/general" element={<GeneralCommunity />} />
                                        <Route path="profile" element={<SellerProfile />} />
                                        <Route path="analytics" element={<Analytics />} />
                                        <Route path="sellers" element={<HostSellerDirectory />} />
                                        <Route path="hosts" element={<SellerHostDirectory />} />
                                        <Route path="host-report" element={<HostAnalyticsReport />} />
                                        <Route path="popular" element={<SellerPopularAlerts />} />
                                        <Route path="trash" element={<AdminTrash />} />
                                        <Route path="notification-settings" element={<NotificationSettings />} />
                                        <Route path="menu-visibility" element={<AdminMenuVisibility />} />
                                        <Route path="marketing" element={<AdminMarketing />} />
                                        <Route path="email-marketing" element={<AdminEmailMarketing />} />
                                        <Route path="vendor-management" element={<AdminVendorManagement />} />
                                        <Route path="cs" element={<AdminCS />} />
                                        <Route path="chat" element={<ChatPage />} />
                                    </Route>

                                    {/* Seller Routes — seller only */}
                                    <Route path="/seller" element={<RoleRoute allowedRoles={['seller']}><Layout /></RoleRoute>}>
                                        <Route index element={<SellerDashboard />} />
                                        <Route path="applications" element={<SellerApplications />} />
                                        <Route path="hosts" element={<SellerHostDirectory />} />
                                        <Route path="payments" element={<SellerPayments />} />
                                        <Route path="community" element={<SellerCommunity />} />
                                        <Route path="community/general" element={<GeneralCommunity />} />
                                        <Route path="profile" element={<SellerProfile />} />
                                        <Route path="analytics" element={<Analytics />} />
                                        <Route path="stats" element={<SellerStats />} />
                                        <Route path="popular" element={<SellerPopularAlerts />} />
                                        <Route path="marketing" element={<SellerMarketing />} />
                                        <Route path="chat" element={<ChatPage />} />
                                        <Route path="proposals" element={<SellerProposals />} />
                                        <Route path="shipments" element={<SellerShipments />} />
                                        <Route path="settlements" element={<SellerSettlements />} />
                                        <Route path="notification-settings" element={<NotificationSettings />} />
                                    </Route>

                                    {/* Host Routes — host only */}
                                    <Route path="/host" element={<RoleRoute allowedRoles={['host']}><Layout /></RoleRoute>}>
                                        <Route index element={<SellerDashboard />} />
                                        <Route path="dashboard" element={<HostDashboard />} />
                                        <Route path="venues" element={<HostVenues />} />
                                        <Route path="applications" element={<HostApplications />} />
                                        <Route path="sellers" element={<HostSellerDirectory />} />
                                        <Route path="cancellations" element={<AdminCancellations />} />
                                        <Route path="payments" element={<SellerPayments />} />
                                        <Route path="community" element={<HostCommunity />} />
                                        <Route path="community/general" element={<GeneralCommunity />} />
                                        <Route path="profile" element={<SellerProfile />} />
                                        <Route path="analytics" element={<Analytics />} />
                                        <Route path="stats" element={<HostStats />} />
                                        <Route path="report" element={<HostAnalyticsReport />} />
                                        <Route path="marketing" element={<HostMarketing />} />
                                        <Route path="chat" element={<ChatPage />} />
                                        <Route path="notification-settings" element={<NotificationSettings />} />
                                    </Route>

                                    {/* Vendor Routes — vendor only */}
                                    <Route path="/vendor" element={<RoleRoute allowedRoles={['vendor']}><Layout /></RoleRoute>}>
                                        <Route index element={<VendorDashboard />} />
                                        <Route path="sellers" element={<VendorSellerDirectory />} />
                                        <Route path="proposals" element={<VendorProposals />} />
                                        <Route path="shipments" element={<VendorShipments />} />
                                        <Route path="settlements" element={<VendorSettlements />} />
                                        <Route path="profile" element={<VendorProfile />} />
                                        <Route path="chat" element={<ChatPage />} />
                                        <Route path="notification-settings" element={<NotificationSettings />} />
                                    </Route>

                                    {/* Public Pages */}
                                    <Route path="/" element={<LandingPage />} />
                                    <Route path="/services" element={<ServicesPage />} />
                                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                                    <Route path="/about" element={<AboutPage />} />
                                    <Route path="/contact" element={<ContactPage />} />
                                    <Route path="/recruitment" element={<RecruitmentDashboard />} />
                                    <Route path="/profile/:id" element={<HostPublicProfile />} />
                                    <Route path="/ad-report/:token" element={<AdSharePage />} />
                                    <Route path="/ad-campaign-report/:token" element={<CampaignSharePage />} />
                                </Routes>
                            </Suspense>
                        </Router>
                    </LocaleProvider>
                </DataProvider>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;

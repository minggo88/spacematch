import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { LocaleProvider } from './context/LocaleContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignupVendor from './pages/SignupVendor';
import SignupSelection from './pages/SignupSelection';
import FindEmail from './pages/FindEmail';
import ResetPassword from './pages/ResetPassword';
import LandingPage from './pages/LandingPage';
import ServicesPage from './pages/ServicesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RecruitmentDashboard from './pages/RecruitmentDashboard';
import VendorPublicProfile from './pages/VendorPublicProfile';
import AdSharePage from './pages/AdSharePage';
import CampaignSharePage from './pages/CampaignSharePage';
import SecurityGuard from './components/SecurityGuard';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVenues from './pages/admin/AdminVenues';
import AdminApplications from './pages/admin/AdminApplications';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminCancellations from './pages/admin/AdminCancellations';
import SuperAdminDatabase from './pages/admin/SuperAdminDatabase';
import AdminAds from './pages/admin/AdminAds';
import AdminTrash from './pages/admin/AdminTrash';
import AdminPopups from './pages/admin/AdminPopups';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSellerStats from './pages/admin/AdminSellerStats';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerApplications from './pages/seller/SellerApplications';
import SellerProfile from './pages/seller/SellerProfile';
import SellerPayments from './pages/seller/SellerPayments';
import SellerStats from './pages/seller/SellerStats';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorVenues from './pages/vendor/VendorVenues';
import SellerVendorDirectory from './pages/seller/SellerVendorDirectory';
import VendorSellerDirectory from './pages/vendor/VendorSellerDirectory';
import SellerCommunity from './pages/seller/SellerCommunity';
import VendorCommunity from './pages/vendor/VendorCommunity';
import VendorApplications from './pages/vendor/VendorApplications';
import GeneralCommunity from './pages/community/GeneralCommunity';
import Analytics from './pages/Analytics';
import VendorAnalyticsReport from './pages/vendor/VendorAnalyticsReport';
import SellerPopularAlerts from './pages/seller/SellerPopularAlerts';
import ChatPage from './pages/ChatPage';
import AdminCS from './pages/admin/AdminCS';

// Role-based route protection component
const RoleRoute = ({ allowedRoles, children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user.role)) {
        // Redirect to their correct dashboard
        const redirectMap = { admin: '/admin', superadmin: '/admin', vendor: '/vendor', seller: '/seller' };
        return <Navigate to={redirectMap[user.role] || '/login'} replace />;
    }
    return children;
};

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <SecurityGuard />
                <DataProvider>
                    <LocaleProvider>
                        <Router basename="/">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<SignupSelection />} />
                                <Route path="/signup/seller" element={<Signup />} />
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
                                    <Route path="community/seller" element={<SellerCommunity />} />
                                    <Route path="community/vendor" element={<VendorCommunity />} />
                                    <Route path="community/general" element={<GeneralCommunity />} />
                                    <Route path="profile" element={<SellerProfile />} />
                                    <Route path="analytics" element={<Analytics />} />
                                    <Route path="sellers" element={<VendorSellerDirectory />} />
                                    <Route path="vendors" element={<SellerVendorDirectory />} />
                                    <Route path="vendor-report" element={<VendorAnalyticsReport />} />
                                    <Route path="popular" element={<SellerPopularAlerts />} />
                                    <Route path="trash" element={<AdminTrash />} />
                                </Route>

                                {/* Seller Routes — seller only */}
                                <Route path="/seller" element={<RoleRoute allowedRoles={['seller']}><Layout /></RoleRoute>}>
                                    <Route index element={<SellerDashboard />} />
                                    <Route path="applications" element={<SellerApplications />} />
                                    <Route path="vendors" element={<SellerVendorDirectory />} />
                                    <Route path="payments" element={<SellerPayments />} />
                                    <Route path="community" element={<SellerCommunity />} />
                                    <Route path="community/general" element={<GeneralCommunity />} />
                                    <Route path="profile" element={<SellerProfile />} />
                                    <Route path="analytics" element={<Analytics />} />
                                    <Route path="stats" element={<SellerStats />} />
                                    <Route path="popular" element={<SellerPopularAlerts />} />
                                    <Route path="chat" element={<ChatPage />} />
                                </Route>

                                {/* Vendor Routes — vendor only */}
                                <Route path="/vendor" element={<RoleRoute allowedRoles={['vendor']}><Layout /></RoleRoute>}>
                                    <Route index element={<SellerDashboard />} />
                                    <Route path="dashboard" element={<VendorDashboard />} />
                                    <Route path="venues" element={<VendorVenues />} />
                                    <Route path="applications" element={<VendorApplications />} />
                                    <Route path="sellers" element={<VendorSellerDirectory />} />
                                    <Route path="cancellations" element={<AdminCancellations />} />
                                    <Route path="payments" element={<SellerPayments />} />
                                    <Route path="community" element={<VendorCommunity />} />
                                    <Route path="community/general" element={<GeneralCommunity />} />
                                    <Route path="profile" element={<SellerProfile />} />
                                    <Route path="analytics" element={<Analytics />} />
                                    <Route path="report" element={<VendorAnalyticsReport />} />
                                    <Route path="chat" element={<ChatPage />} />
                                </Route>

                                {/* Public Pages */}
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/services" element={<ServicesPage />} />
                                <Route path="/how-it-works" element={<HowItWorksPage />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/contact" element={<ContactPage />} />
                                <Route path="/recruitment" element={<RecruitmentDashboard />} />
                                <Route path="/profile/:id" element={<VendorPublicProfile />} />
                                <Route path="/ad-report/:token" element={<AdSharePage />} />
                                <Route path="/ad-campaign-report/:token" element={<CampaignSharePage />} />
                            </Routes>
                        </Router>
                    </LocaleProvider>
                </DataProvider>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;

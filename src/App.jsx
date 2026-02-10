import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignupVendor from './pages/SignupVendor';
import SignupSelection from './pages/SignupSelection';
import LandingPage from './pages/LandingPage';
import ServicesPage from './pages/ServicesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RecruitmentDashboard from './pages/RecruitmentDashboard';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVenues from './pages/admin/AdminVenues';
import AdminApplications from './pages/admin/AdminApplications';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminCancellations from './pages/admin/AdminCancellations';
import SuperAdminDatabase from './pages/admin/SuperAdminDatabase';
import AdminAds from './pages/admin/AdminAds';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerApplications from './pages/seller/SellerApplications';
import SellerProfile from './pages/seller/SellerProfile';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorVenues from './pages/vendor/VendorVenues';
import SellerVendorDirectory from './pages/seller/SellerVendorDirectory';
import VendorSellerDirectory from './pages/vendor/VendorSellerDirectory';
import SellerCommunity from './pages/seller/SellerCommunity';
import VendorCommunity from './pages/vendor/VendorCommunity';
import VendorApplications from './pages/vendor/VendorApplications';
import GeneralCommunity from './pages/community/GeneralCommunity';

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
        <AuthProvider>
            <DataProvider>
                <Router basename="/">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignupSelection />} />
                        <Route path="/signup/seller" element={<Signup />} />
                        <Route path="/signup/vendor" element={<SignupVendor />} />

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
                            <Route path="community/seller" element={<SellerCommunity />} />
                            <Route path="community/vendor" element={<VendorCommunity />} />
                            <Route path="community/general" element={<GeneralCommunity />} />
                            <Route path="profile" element={<SellerProfile />} />
                        </Route>

                        {/* Seller Routes — seller only */}
                        <Route path="/seller" element={<RoleRoute allowedRoles={['seller']}><Layout /></RoleRoute>}>
                            <Route index element={<SellerDashboard />} />
                            <Route path="applications" element={<SellerApplications />} />
                            <Route path="vendors" element={<SellerVendorDirectory />} />
                            <Route path="community" element={<SellerCommunity />} />
                            <Route path="community/general" element={<GeneralCommunity />} />
                            <Route path="profile" element={<SellerProfile />} />
                        </Route>

                        {/* Vendor Routes — vendor only */}
                        <Route path="/vendor" element={<RoleRoute allowedRoles={['vendor']}><Layout /></RoleRoute>}>
                            <Route index element={<SellerDashboard />} />
                            <Route path="dashboard" element={<VendorDashboard />} />
                            <Route path="venues" element={<VendorVenues />} />
                            <Route path="applications" element={<VendorApplications />} />
                            <Route path="sellers" element={<VendorSellerDirectory />} />
                            <Route path="cancellations" element={<AdminCancellations />} />
                            <Route path="community" element={<VendorCommunity />} />
                            <Route path="community/general" element={<GeneralCommunity />} />
                            <Route path="profile" element={<SellerProfile />} />
                        </Route>

                        {/* Public Pages */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/recruitment" element={<RecruitmentDashboard />} />
                    </Routes>
                </Router>
            </DataProvider>
        </AuthProvider>
    );
}

export default App;

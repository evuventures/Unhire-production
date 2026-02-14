import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
// import PostJobPage from './pages/PostJobPage';
// import FindJobsPage from './pages/FindJobsPage';
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import ClientDashboard from './pages/ClientDashboard';
import ClientProjectDetailPage from './pages/ClientProjectDetailPage';
import ExpertDashboard from './pages/ExpertDashboard';
import PostProjectPage from './pages/PostProjectPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PaymentsPage from './pages/PaymentsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import ExpertApplicationPage from './pages/ExpertApplicationPage';
import ClientProjectDetailsPage from './pages/ClientProjectDetailsPage';

function App() {
  return (
<<<<<<< HEAD
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/client/project/:id" element={<ClientProjectDetailPage />} />
          <Route path="/expert-dashboard" element={<ExpertDashboard />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/post-project" element={<PostProjectPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/client/project/:id" element={<ClientProjectDetailsPage />} />
        </Routes>
      </div>
    </Router>
=======
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Client Routes */}
        <Route path="/client-dashboard" element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/post-project" element={
          <ProtectedRoute allowedRoles={['client']}>
            <PostProjectPage />
          </ProtectedRoute>
        } />
        <Route path="/client/project/:id" element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientProjectDetailsPage />
          </ProtectedRoute>
        } />

        {/* Expert Routes */}
        <Route path="/expert-dashboard" element={
          <ProtectedRoute allowedRoles={['expert']}>
            <ExpertDashboard />
          </ProtectedRoute>
        } />
        <Route path="/expert/apply" element={
          <ProtectedRoute allowedRoles={['expert']}>
            <ExpertApplicationPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Common Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </div>
>>>>>>> auth-overhaul-evu
  );
}

export default App;
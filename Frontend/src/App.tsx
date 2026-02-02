import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import ClientDashboard from './pages/ClientDashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import PostProjectPage from './pages/PostProjectPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PaymentsPage from './pages/PaymentsPage';
import OnboardingPage from './pages/OnboardingPage';

// Route protection for specific roles
const RoleProtectedRoute: React.FC<{ children: React.ReactNode, allowedRole: string }> = ({ children, allowedRole }) => {
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  if (user.role !== allowedRole) {
    const defaultPath = user.role === "client" ? "/client-dashboard" : "/expert-dashboard";
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/client-dashboard"
            element={
              <RoleProtectedRoute allowedRole="client">
                <ClientDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/expert-dashboard"
            element={
              <RoleProtectedRoute allowedRole="expert">
                <ExpertDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route
            path="/post-project"
            element={
              <RoleProtectedRoute allowedRole="client">
                <PostProjectPage />
              </RoleProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route
            path="/onboarding"
            element={
              <RoleProtectedRoute allowedRole="expert">
                <OnboardingPage />
              </RoleProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

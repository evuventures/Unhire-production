import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ClientProjectDetailsPage from './pages/ClientProjectDetailsPage';

function App() {
  return (
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
  );
}

export default App;
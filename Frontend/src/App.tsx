import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PostJobPage from './pages/PostJobPage';
import FindJobsPage from './pages/FindJobsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="/find-jobs" element={<FindJobsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
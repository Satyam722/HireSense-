import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout & Pages
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobSeekerDashboard from './pages/dashboards/JobSeekerDashboard';
import RecruiterDashboard from './pages/dashboards/RecruiterDashboard';
import JobApplicants from './pages/recruiter/JobApplicants'; // Ensure this path is correct
import PostJob from './pages/jobs/PostJob';
import JobListing from './pages/JobListing';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;

  return children;
};

// Helper component to decide which dashboard to show
const DashboardSwitcher = () => {
  const { user } = useAuth();
  return user?.role === 'recruiter' ? <RecruiterDashboard /> : <JobSeekerDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobListing />} />

            {/* General Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardSwitcher />
                </ProtectedRoute>
              } 
            />

            {/* Recruiter Specific: View Applicants for a Job */}
            <Route 
              path="/jobs/:jobId/applicants" 
              element={
                <ProtectedRoute allowedRole="recruiter">
                  <JobApplicants />
                </ProtectedRoute>
              } 
            />
            
            {/* Recruiter Specific: Post a New Job */}
            <Route 
              path="/post-job" 
              element={
                <ProtectedRoute allowedRole="recruiter">
                  <PostJob />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
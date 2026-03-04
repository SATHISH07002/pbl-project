/**
 * InternVerify - Main App
 * Role-based routing: Student, College, Company
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";

// Student
import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import CertificateUpload from "./pages/CertificateUpload";
import Approvals from "./pages/Approvals";
import Pending from "./pages/Pending";
import Rejected from "./pages/Rejected";
import Offers from "./pages/Offers";
import Notifications from "./pages/Notifications";
import QRCodes from "./pages/QRCodes";

// College
import CollegeDashboard from "./pages/CollegeDashboard";
import CollegeApprovals from "./pages/CollegeApprovals";
import CollegeRejected from "./pages/CollegeRejected";

// Company
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyApprovals from "./pages/CompanyApprovals";
import CompanyRejected from "./pages/CompanyRejected";
import CompanyOffers from "./pages/CompanyOffers";

// Public
import Verify from "./pages/Verify";

function RoleRedirect() {
  const { user } = useAuth();
  if (user?.role === "student") return <Navigate to="/dashboard" replace />;
  if (user?.role === "college") return <Navigate to="/college" replace />;
  if (user?.role === "company") return <Navigate to="/company" replace />;
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:certificateId" element={<Verify />} />

          {/* Student routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["student"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-certificate"
            element={
              <ProtectedRoute roles={["student"]}>
                <CertificateUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <ProtectedRoute roles={["student"]}>
                <Approvals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pending"
            element={
              <ProtectedRoute roles={["student"]}>
                <Pending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rejected"
            element={
              <ProtectedRoute roles={["student"]}>
                <Rejected />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offers"
            element={
              <ProtectedRoute roles={["student"]}>
                <Offers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute roles={["student"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr-codes"
            element={
              <ProtectedRoute roles={["student"]}>
                <QRCodes />
              </ProtectedRoute>
            }
          />

          {/* College routes */}
          <Route
            path="/college"
            element={
              <ProtectedRoute roles={["college"]}>
                <CollegeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/college/approvals"
            element={
              <ProtectedRoute roles={["college"]}>
                <CollegeApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/college/rejected"
            element={
              <ProtectedRoute roles={["college"]}>
                <CollegeRejected />
              </ProtectedRoute>
            }
          />

          {/* Company routes */}
          <Route
            path="/company"
            element={
              <ProtectedRoute roles={["company"]}>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/approvals"
            element={
              <ProtectedRoute roles={["company"]}>
                <CompanyApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/rejected"
            element={
              <ProtectedRoute roles={["company"]}>
                <CompanyRejected />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/offers"
            element={
              <ProtectedRoute roles={["company"]}>
                <CompanyOffers />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

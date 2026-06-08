// src/App.jsx
// Root component. Sets up routing and wraps app in AuthProvider.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Pages
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CustomerDetailPage from "./pages/CustomerDetailPage.jsx";
import MatchesPage from "./pages/MatchesPage.jsx";

// ProtectedRoute: If user is not logged in, redirect to /login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show nothing while checking auth (avoids flash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-300 border-t-rose-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-sans">Loading TDC...</p>
        </div>
      </div>
    );
  }

  // If not logged in, send to login page
  return user ? children : <Navigate to="/login" replace />;
};

// PublicRoute: If user IS logged in, skip login page and go to dashboard
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public route */}
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

    {/* Protected routes — require login */}
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/customer/:id" element={<ProtectedRoute><CustomerDetailPage /></ProtectedRoute>} />
    <Route path="/customer/:id/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />

    {/* Default redirect */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      {/* Toast notifications — shows success/error popups */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: "DM Sans, sans-serif", fontSize: "14px" },
          success: { iconTheme: { primary: "#f43f5e", secondary: "#fff" } },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useEffect } from "react";
import useAuthStore from "./stores/authStore";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import Toaster from "./components/ui/toaster";
import Dashboard from "./pages/Dashboard";
import Blogs from "./pages/Blogs";
import Users from "./pages/Users";
import Login from "./pages/Login";
import BlogCreate from "./pages/BlogCreate";
import BlogEdit from "./pages/BlogEdit";
import Trainers from "./pages/Trainers";
import Subscriber from "./pages/Subscriber";
import Quotes from "./pages/Quotes";
import QuoteView from "./pages/QuoteView";
import Products from "./pages/Products";
import Subscriptions from "./pages/Subscriptions";
// Create a client
const queryClient = new QueryClient();

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              }
            />

            {/* Protected admin routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="trainers" element={<Trainers />} />
              <Route path="products" element={<Products />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="blogs/create" element={<BlogCreate />} />
              <Route path="blogs/:id/edit" element={<BlogEdit />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="quotes/:id" element={<QuoteView />} />
              <Route path="subscribers" element={<Subscriber />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

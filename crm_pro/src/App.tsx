
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import NewClient from "@/pages/NewClient";
import Services from "@/pages/Services";
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import NewOrder from "@/pages/NewOrder";
import NotFound from "@/pages/NotFound";
import { DataContextProvider } from "./contexts/DataContext";
import NewService from "./pages/NewService";
import NewProduct from "./pages/NewProduct";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Main app routes wrapped with DataContextProvider */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DataContextProvider>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </DataContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <DataContextProvider>
                    <Layout>
                      <Clients />
                    </Layout>
                  </DataContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <DataContextProvider>
                    <Layout>
                      <Services />
                    </Layout>
                  </DataContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <DataContextProvider>
                    <Layout>
                      <Products />
                    </Layout>
                  </DataContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <DataContextProvider>
                    <Layout>
                      <Orders />
                    </Layout>
                  </DataContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewClient />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewService />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewProduct />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/new"
              element={
                <ProtectedRoute>
                  <DataContextProvider>
                    <Layout>
                      <NewOrder />
                    </Layout>
                  </DataContextProvider>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

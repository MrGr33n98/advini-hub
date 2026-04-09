import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { CompareProvider } from "@/contexts/compare-context";
import { CompareBar } from "@/components/compare-bar";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import SearchPage from "@/pages/search";
import LawyerProfile from "@/pages/lawyer-profile";
import BlogList from "@/pages/blog-list";
import BlogPostPage from "@/pages/blog-post";
import CategoriasPage from "@/pages/categorias";
import LoginPage from "@/pages/login";
import CadastroPage from "@/pages/cadastro";
import FavoritosPage from "@/pages/favoritos";
import CompararPage from "@/pages/comparar";
import PrecosPage from "@/pages/precos";
import CalculadoraPage from "@/pages/calculadora";
import FaqPage from "@/pages/faq";
import EscritoriosPage from "@/pages/escritorios";
import Dashboard from "@/pages/Dashboard";
import LawyerDashboard from "@/pages/LawyerDashboard";
import OfficeDashboard from "@/pages/OfficeDashboard";
import ClientDashboard from "@/pages/ClientDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ component: Component, roles }: { component: any; roles?: string[] }) {
  const { isAuthenticated, user, loading } = useAuthContext();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (roles && user && !roles.includes(user.role)) {
    setLocation("/");
    return null;
  }

  return <Component />;
}

// Redirect if authenticated (for login/cadastro pages)
function AuthRedirect({ component: Component }: { component: any }) {
  const { isAuthenticated, loading } = useAuthContext();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? null : <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/buscar" component={SearchPage} />
      <Route path="/advogado/:id" component={LawyerProfile} />
      <Route path="/categorias" component={CategoriasPage} />
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:id" component={BlogPostPage} />
      <Route path="/escritorios" component={EscritoriosPage} />
      <Route path="/favoritos" component={FavoritosPage} />
      <Route path="/comparar" component={CompararPage} />
      <Route path="/precos" component={PrecosPage} />
      <Route path="/calculadora" component={CalculadoraPage} />
      <Route path="/faq" component={FaqPage} />
      
      {/* Auth pages with redirect if already logged in */}
      <Route path="/login">
        {(params) => <AuthRedirect component={LoginPage} />}
      </Route>
      <Route path="/cadastro">
        {(params) => <AuthRedirect component={CadastroPage} />}
      </Route>
      
      {/* Protected routes */}
      <Route path="/dashboard">
        {(params) => <ProtectedRoute component={Dashboard} roles={["admin"]} />}
      </Route>
      <Route path="/dashboard/lawyer">
        {(params) => <ProtectedRoute component={LawyerDashboard} roles={["lawyer", "admin"]} />}
      </Route>
      <Route path="/dashboard/office">
        {(params) => <ProtectedRoute component={OfficeDashboard} roles={["lawyer", "admin"]} />}
      </Route>
      <Route path="/dashboard/client">
        {(params) => <ProtectedRoute component={ClientDashboard} roles={["client"]} />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <FavoritesProvider>
            <CompareProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
                <CompareBar />
              </WouterRouter>
              <Toaster />
            </CompareProvider>
          </FavoritesProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

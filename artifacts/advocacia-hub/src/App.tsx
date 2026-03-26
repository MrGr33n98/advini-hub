import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { CompareProvider } from "@/contexts/compare-context";
import { CompareBar } from "@/components/compare-bar";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/buscar" component={SearchPage} />
      <Route path="/advogado/:id" component={LawyerProfile} />
      <Route path="/categorias" component={CategoriasPage} />
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:id" component={BlogPostPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/cadastro" component={CadastroPage} />
      <Route path="/favoritos" component={FavoritosPage} />
      <Route path="/comparar" component={CompararPage} />
      <Route path="/precos" component={PrecosPage} />
      <Route path="/calculadora" component={CalculadoraPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/escritorios" component={EscritoriosPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;

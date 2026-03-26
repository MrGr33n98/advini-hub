import { Layout } from "@/components/layout";
import { useFavorites } from "@/contexts/favorites-context";
import { useListLawyers } from "@/hooks/use-lawyers";
import { LawyerCard } from "@/components/lawyer-card";
import { Link } from "wouter";
import { Heart, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function FavoritosPage() {
  const { favorites, count } = useFavorites();

  const { data, isLoading } = useListLawyers(
    { limit: 100 },
    { query: { enabled: count > 0 } }
  );

  const favoriteLawyers = data?.data?.filter(l => favorites.includes(l.id)) ?? [];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-rose-50 to-pink-50/30 border-b border-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Meus Favoritos</h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            {count === 0 ? "Você ainda não salvou nenhum advogado." : `${count} advogado${count !== 1 ? "s" : ""} salvo${count !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {count === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-rose-200" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">Nenhum favorito ainda</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Salve advogados que você gostar clicando no ícone de coração nos cards de busca. Eles aparecerão aqui para você consultar depois.
            </p>
            <Button asChild className="rounded-xl shadow-clay-btn gap-2">
              <Link href="/buscar">
                <Search className="w-4 h-4" />
                Buscar Advogados
              </Link>
            </Button>
          </motion.div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteLawyers.map((lawyer, i) => (
                <motion.div
                  key={lawyer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <LawyerCard lawyer={lawyer} />
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="rounded-xl gap-2">
                <Link href="/buscar">
                  <Search className="w-4 h-4" />
                  Buscar mais advogados
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

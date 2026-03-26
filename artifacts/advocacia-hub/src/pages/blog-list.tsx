import { Layout } from "@/components/layout";
import { useBlogSearch } from "@/hooks/use-blog";
import { AdBanner } from "@/components/ad-banner";
import { Pagination } from "@/components/pagination";
import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Tag, Clock, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const POPULAR_TAGS = ["Direito Civil", "Trabalhista", "Família", "Imóveis", "Empresarial", "Tributário"];

export default function BlogList() {
  const { data, isLoading, params, updateFilters, setPage } = useBlogSearch({
    limit: 9,
  });

  const totalPages = data?.totalPages ?? 1;
  const currentPage = params.page ?? 1;

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=80"
            alt="Library"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BookOpen className="w-12 h-12 mx-auto text-primary mb-5" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Blog Jurídico</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Artigos, guias e dicas escritas por especialistas para ajudar você a entender seus direitos.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Tags Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <Button
            variant={params.tag === undefined ? "default" : "outline"}
            size="sm"
            className="rounded-full shadow-sm"
            onClick={() => updateFilters({ tag: undefined })}
          >
            Todos
          </Button>
          {POPULAR_TAGS.map(tag => (
            <Button
              key={tag}
              size="sm"
              variant={params.tag === tag ? "default" : "outline"}
              className="rounded-full shadow-sm"
              onClick={() => updateFilters({ tag })}
            >
              <Tag className="w-3 h-3 mr-1.5" />
              {tag}
            </Button>
          ))}
        </div>

        {/* Results info */}
        {!isLoading && data && (
          <p className="text-sm text-muted-foreground text-center mb-6">
            {data.total} artigo{data.total !== 1 ? "s" : ""} encontrado{data.total !== 1 ? "s" : ""}
            {params.tag ? ` em "${params.tag}"` : ""}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-3xl" />
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <>
            {/* Featured first post on page 1 */}
            {currentPage === 1 && !params.tag && data.data[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Link href={`/blog/${data.data[0].id}`}>
                  <div className="group grid md:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="relative aspect-video md:aspect-auto overflow-hidden bg-slate-100">
                      <img
                        src={data.data[0].featuredImageUrl || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80"}
                        alt={data.data[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      {data.data[0].tags[0] && (
                        <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                          {data.data[0].tags[0]}
                        </span>
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Destaque</span>
                      <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors leading-snug">
                        {data.data[0].title}
                      </h2>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-3">{data.data[0].excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{data.data[0].authorName}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{data.data[0].readTimeMinutes} min</span>
                        <span>{format(new Date(data.data[0].publishedAt), "dd MMM, yyyy", { locale: ptBR })}</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                        Ler artigo completo <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Rest of posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(currentPage === 1 && !params.tag ? data.data.slice(1) : data.data).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col h-full cursor-pointer">
                      <div className="aspect-video relative overflow-hidden bg-slate-100">
                        <img
                          src={post.featuredImageUrl || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80"}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {post.tags[0] && (
                          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                            {post.tags[0]}
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-medium">
                          <span>{format(new Date(post.publishedAt), "dd MMM, yyyy", { locale: ptBR })}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTimeMinutes} min</span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h2>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                          <span className="text-slate-600 font-medium text-xs flex items-center gap-1">
                            <User className="w-3 h-3" /> {post.authorName}
                          </span>
                          <span className="text-primary font-semibold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                            Ler <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Ad between pages */}
            {totalPages > 1 && (
              <AdBanner position="blog-between" className="mt-10" />
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={data.total}
              itemsPerPage={params.limit ?? 9}
              onPageChange={setPage}
              itemLabel="artigos"
              className="mt-10"
            />
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum artigo encontrado</h3>
            <p className="text-slate-500 mt-2 mb-5">Tente outra categoria ou volte em breve.</p>
            <Button variant="outline" className="rounded-xl" onClick={() => updateFilters({ tag: undefined })}>
              Ver todos os artigos
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

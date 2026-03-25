import { Layout } from "@/components/layout";
import { useListBlogPosts } from "@/hooks/use-blog";
import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Tag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BlogList() {
  const [activeTag, setActiveTag] = useState<string | undefined>(undefined);
  const { data, isLoading } = useListBlogPosts({ 
    limit: 12,
    tag: activeTag 
  });

  const popularTags = ["Direito Civil", "Trabalhista", "Família", "Imóveis", "Empresarial"];

  return (
    <Layout>
      <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        {/* unsplash architectural abstraction */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=80" 
            alt="Library" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/80 mix-blend-multiply"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Blog AdvocaciaHub</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Artigos, guias e dicas legais escritas por especialistas para ajudar você a entender melhor seus direitos.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Tags Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Button 
            variant={activeTag === undefined ? "default" : "outline"}
            className="rounded-full shadow-sm"
            onClick={() => setActiveTag(undefined)}
          >
            Todos os Artigos
          </Button>
          {popularTags.map(tag => (
            <Button 
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              className="rounded-full shadow-sm"
              onClick={() => setActiveTag(tag)}
            >
              <Tag className="w-3 h-3 mr-2" />
              {tag}
            </Button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-96 rounded-3xl" />)}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.data.map(post => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-clay-sm flex flex-col h-full cursor-pointer hover:-translate-y-1">
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img 
                      src={post.featuredImageUrl || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80"} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      {post.tags[0] && (
                        <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                          {post.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
                      <span>{format(new Date(post.publishedAt), "dd MMM, yyyy", { locale: ptBR })}</span>
                      <span>{post.readTimeMinutes} min de leitura</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-100 text-sm font-medium text-slate-700">
                      Por {post.authorName}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-slate-700">Nenhum artigo encontrado</h3>
            <p className="text-slate-500 mt-2">Tente outra categoria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

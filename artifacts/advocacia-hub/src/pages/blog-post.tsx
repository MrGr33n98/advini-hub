import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { useGetBlogPost } from "@/hooks/use-blog";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Calendar, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPostPage() {
  const { id } = useParams();
  const postId = id ? parseInt(id, 10) : 0;
  
  const { data: post, isLoading, isError } = useGetBlogPost(postId, {
    query: { enabled: !!postId }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-10 w-3/4 mb-6" />
          <Skeleton className="h-6 w-1/2 mb-10" />
          <Skeleton className="w-full aspect-[2/1] rounded-3xl mb-10" />
          <div className="space-y-4">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !post) {
    return (
      <Layout>
        <div className="text-center py-24">
          <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
          <Button asChild variant="outline"><Link href="/blog">Voltar ao Blog</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="pb-24">
        {/* Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para todos os artigos
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 leading-tight mb-8">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-slate-700">{post.authorName}</span>
              <span className="text-slate-400 font-normal">({post.authorOab})</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.publishedAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTimeMinutes} min de leitura
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
          <div className="w-full aspect-[2/1] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-clay-sm bg-slate-100">
            <img 
              src={post.featuredImageUrl || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=1600&q=80"} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg prose-slate prose-headings:font-display prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
            {/* 
              In a real app, this might be HTML or Markdown parsed. 
              Since it's a simple string in our schema, we'll format it with basic whitespace parsing.
            */}
            {post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200">
            <div className="bg-slate-50 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 border border-slate-100">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-bold text-lg text-slate-900 mb-1">Escrito por {post.authorName}</h3>
                <p className="text-slate-500 text-sm mb-4">Advogado(a) Especialista • OAB {post.authorOab}</p>
                <Button asChild variant="outline" className="rounded-full shadow-sm bg-white">
                  <Link href="/buscar">Encontrar especialistas como este</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}

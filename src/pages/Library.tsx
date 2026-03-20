import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import StrawberryRating from "@/components/StrawberryRating";
import { BookOpen } from "lucide-react";

interface UserBook {
  id: string;
  title: string;
  author: string | null;
  cover_url: string | null;
  status: string;
  pages_read: number | null;
  total_pages: number | null;
  strawberry_rating: number | null;
}

const statusLabels: Record<string, string> = {
  reading: "📖 Lendo",
  finished: "✅ Finalizado",
  want_to_read: "📌 Quero ler",
};

const Library = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<UserBook[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchBooks = async () => {
      let query = supabase.from("user_books").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
      if (filter !== "all") query = query.eq("status", filter);
      const { data } = await query;
      setBooks((data as UserBook[]) || []);
      setLoading(false);
    };
    fetchBooks();
  }, [user, filter]);

  const filters = [
    { key: "all", label: "Todos" },
    { key: "reading", label: "Lendo" },
    { key: "finished", label: "Finalizados" },
    { key: "want_to_read", label: "Quero ler" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 bg-background/90 backdrop-blur-md z-40 px-4 pt-[env(safe-area-inset-top)] pb-3">
        <h1 className="text-xl font-extrabold text-foreground pt-4">Minha Estante 🍓</h1>
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 mt-2">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-wiggle">
              <StrawberryRating rating={0} size={32} />
            </div>
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up" style={{ opacity: 0 }}>
            <BookOpen size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium">Sua estante está vazia!</p>
            <button
              onClick={() => navigate("/search")}
              className="mt-4 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm active:scale-95 transition-transform"
            >
              Buscar livros 🍓
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {books.map((book, i) => (
              <button
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                className="bg-card rounded-2xl overflow-hidden shadow-[0_2px_12px_hsl(345_70%_65%/0.08)] border border-border text-left active:scale-[0.97] transition-transform animate-fade-up"
                style={{ opacity: 0, animationDelay: `${i * 60}ms` }}
              >
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-secondary flex items-center justify-center">
                    <BookOpen size={32} className="text-muted-foreground" />
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-bold text-foreground line-clamp-2 leading-tight">{book.title}</p>
                  {book.author && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{book.author}</p>}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-muted-foreground">{statusLabels[book.status]}</span>
                    {book.strawberry_rating && book.strawberry_rating > 0 && (
                      <StrawberryRating rating={book.strawberry_rating} size={12} />
                    )}
                  </div>
                  {book.status === "reading" && book.total_pages && book.total_pages > 0 && (
                    <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min(100, ((book.pages_read || 0) / book.total_pages) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Library;

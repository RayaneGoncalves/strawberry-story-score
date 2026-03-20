import { useState } from "react";
import { Search, Plus, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: { thumbnail?: string };
    pageCount?: number;
    description?: string;
  };
}

const SearchBooks = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12&langRestrict=pt`
      );
      const data = await res.json();
      setResults(data.items || []);
    } catch {
      toast.error("Erro ao buscar livros");
    }
    setLoading(false);
  };

  const addBook = async (book: GoogleBook) => {
    if (!user) return;
    setAddingId(book.id);
    try {
      const { error } = await supabase.from("user_books").insert({
        user_id: user.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.join(", ") || null,
        cover_url: book.volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") || null,
        google_books_id: book.id,
        total_pages: book.volumeInfo.pageCount || 0,
        status: "want_to_read",
      });
      if (error) throw error;
      toast.success("Livro adicionado! 🍓");
    } catch (err: any) {
      if (err.message?.includes("duplicate")) {
        toast.error("Esse livro já está na sua estante!");
      } else {
        toast.error("Erro ao adicionar livro");
      }
    }
    setAddingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff0f3] to-[#ffd6dd] pb-20 font-sans">

      {/* HEADER */}
      <header className="sticky top-0 bg-white/50 backdrop-blur-md z-40 px-4 pt-[env(safe-area-inset-top)] pb-3 shadow-sm">
        <h1 className="text-xl font-extrabold text-red-500 drop-shadow-sm pt-4">Buscar Livros 📚</h1>
        <form
          onSubmit={(e) => { e.preventDefault(); searchBooks(); }}
          className="mt-3 flex gap-2"
        >
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-300" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nome do livro..."
              className="rounded-full h-11 pl-10 bg-white/70 border border-red-200 focus:border-red-400 focus:ring-1 focus:ring-pink-300 transition-shadow"
            />
          </div>
          <button
            type="submit"
            className="h-11 w-11 rounded-full bg-gradient-to-r from-red-400 to-pink-400 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
          >
            <Search size={18} />
          </button>
        </form>
      </header>

      <main className="px-4 mt-4">
        {loading ? (
          <div className="flex flex-col gap-3 py-20 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/70 rounded-2xl p-3 flex gap-3 shadow-md h-28" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up" style={{ opacity: 0 }}>
            <BookOpen size={48} className="text-red-300 mb-4 animate-bounce-slow" />
            <p className="text-red-300 font-medium">Pesquise um livro para adicionar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((book, i) => (
              <div
                key={book.id}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-3 flex gap-3 shadow-md border border-red-100 hover:scale-[1.02] hover:shadow-lg transition transform animate-fade-up"
                style={{ opacity: 0, animationDelay: `${i * 50}ms` }}
              >
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail.replace("http://", "https://")}
                    alt={book.volumeInfo.title}
                    className="w-16 h-24 rounded-xl object-cover flex-shrink-0 shadow"
                  />
                ) : (
                  <div className="w-16 h-24 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={20} className="text-red-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-red-500 line-clamp-2 leading-tight">{book.volumeInfo.title}</p>
                  {book.volumeInfo.authors && (
                    <p className="text-xs text-red-300 mt-0.5">{book.volumeInfo.authors.join(", ")}</p>
                  )}
                  {book.volumeInfo.pageCount && (
                    <p className="text-[10px] text-red-300 mt-1">{book.volumeInfo.pageCount} páginas</p>
                  )}
                </div>
                <button
                  onClick={() => addBook(book)}
                  disabled={addingId === book.id}
                  className="self-center w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-pink-400 text-white flex items-center justify-center flex-shrink-0 hover:scale-110 active:scale-90 transition-transform shadow-lg disabled:opacity-50"
                >
                  <Plus size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default SearchBooks;

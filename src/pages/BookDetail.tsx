import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import StrawberryIcon from "@/components/StrawberryIcon";
import { Input } from "@/components/ui/input";

interface BookData {
  id: string;
  title: string;
  author: string | null;
  cover_url: string | null;
  status: string;
  pages_read: number | null;
  total_pages: number | null;
  strawberry_rating: number | null;
  review: string | null;
}

const statusOptions = [
  { value: "want_to_read", label: "Quero ler 📌" },
  { value: "reading", label: "Lendo 📖" },
  { value: "finished", label: "Finalizado ✅" },
];

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState<BookData | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [pagesRead, setPagesRead] = useState(0);
  const [status, setStatus] = useState("want_to_read");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from("user_books")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const b = data as BookData;
          setBook(b);
          setRating(b.strawberry_rating || 0);
          setReview(b.review || "");
          setPagesRead(b.pages_read || 0);
          setStatus(b.status);
        }
      });
  }, [id, user]);

  const save = async () => {
    if (!id || !user) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_books")
      .update({
        strawberry_rating: rating,
        review,
        pages_read: pagesRead,
        status,
        finished_at: status === "finished" ? new Date().toISOString() : null,
        started_at: status === "reading" ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error("Erro ao salvar");
    else toast.success("Salvo! 🍓");
  };

  const deleteBook = async () => {
    if (!id || !user) return;
    await supabase.from("user_books").delete().eq("id", id).eq("user_id", user.id);
    toast.success("Livro removido");
    navigate("/library");
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const progress = book.total_pages && book.total_pages > 0 ? Math.min(100, (pagesRead / book.total_pages) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="relative">
        {book.cover_url ? (
          <div className="h-56 overflow-hidden">
            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover blur-sm scale-110 opacity-50" />
          </div>
        ) : (
          <div className="h-56 bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <button
          onClick={() => navigate("/library")}
          className="absolute top-[env(safe-area-inset-top)] left-4 mt-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="px-4 -mt-20 relative z-10">
        <div className="flex gap-4 items-end">
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="w-28 h-40 rounded-2xl object-cover shadow-lg flex-shrink-0" />
          ) : (
            <div className="w-28 h-40 rounded-2xl bg-secondary flex-shrink-0" />
          )}
          <div className="pb-1">
            <h1 className="text-lg font-extrabold text-foreground leading-tight" style={{ textWrap: "balance" }}>{book.title}</h1>
            {book.author && <p className="text-sm text-muted-foreground mt-0.5">{book.author}</p>}
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar">
          {statusOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                status === s.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Pages */}
        <div className="mt-6 bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm font-semibold text-foreground mb-3">Progresso de leitura</p>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={pagesRead}
              onChange={(e) => setPagesRead(Math.max(0, Number(e.target.value)))}
              className="w-20 rounded-xl h-10 text-center bg-secondary/50"
              min={0}
              max={book.total_pages || 99999}
            />
            <span className="text-sm text-muted-foreground">de {book.total_pages || "?"} páginas</span>
          </div>
          {book.total_pages && book.total_pages > 0 && (
            <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="mt-4 bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm font-semibold text-foreground mb-3">Classificação 🍓</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => setRating(i === rating ? 0 : i)}
                className="transition-transform active:scale-90 hover:scale-110"
              >
                <StrawberryIcon filled={i <= rating} size={36} />
              </button>
            ))}
          </div>
        </div>

        {/* Review */}
        <div className="mt-4 bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm font-semibold text-foreground mb-3">Resenha ✍️</p>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="O que você achou desse livro?"
            rows={4}
            maxLength={2000}
            className="w-full rounded-xl bg-secondary/50 border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-bold text-sm active:scale-[0.97] transition-all disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar 🍓"}
          </button>
          <button
            onClick={deleteBook}
            className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center active:scale-90 transition-transform"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;

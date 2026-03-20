import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import StrawberryIcon from "@/components/StrawberryIcon";
import Confetti from "react-confetti"; // npm install react-confetti

const Profile = () => {
  const { user, signOut } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [booksGoal, setBooksGoal] = useState(12);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    reading: 0,
    finished: 0,
  });

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);

      const [{ data: profile }, { data: books }] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single(),

        supabase
          .from("user_books")
          .select("status")
          .eq("user_id", user.id),
      ]);

      if (profile) {
        setDisplayName(profile.display_name || "");
        setBio(profile.bio || "");
        setFavoriteGenre(profile.favorite_genre || "");
        setBooksGoal(profile.books_goal || 12);
      }

      if (books) {
        const total = books.length;
        setStats({
          total,
          reading: books.filter((b) => b.status === "reading").length,
          finished: books.filter((b) => b.status === "finished").length,
        });
        if (total >= booksGoal) setShowConfetti(true);
      }

      setLoading(false);
    };

    loadData();
  }, [user, booksGoal]);

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        bio,
        favorite_genre: favoriteGenre,
        books_goal: booksGoal,
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast.error("Erro ao salvar 😢");
    } else {
      toast.success("Perfil atualizado! 🍓");
    }
  };

  const progress = stats.total && booksGoal ? Math.min((stats.total / booksGoal) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff0f3] to-[#ffd6dd] pb-28 font-sans relative overflow-hidden">

      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      {/* HEADER */}
      <header className="px-4 pt-[env(safe-area-inset-top)] pb-3">
        <div className="flex items-center justify-between pt-4">
          <h1 className="text-xl font-extrabold text-red-500 drop-shadow-sm">Meu Perfil</h1>

          <button
            onClick={signOut}
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition"
          >
            <LogOut size={18} className="text-red-500"/>
          </button>
        </div>
      </header>

      <main className="px-4 space-y-6">

        {/* AVATAR */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-pink-200 shadow-md flex flex-col items-center transition hover:scale-105 animate-fade-in">
          
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center mb-3 shadow-lg animate-bounce-slow hover:animate-bounce-fast transition">
            <StrawberryIcon filled size={48} />
          </div>

          {loading ? (
            <div className="flex flex-col items-center gap-1 animate-pulse">
              <div className="h-5 w-28 bg-pink-200 rounded-full"/>
              <div className="h-3 w-36 bg-pink-100 rounded-full"/>
            </div>
          ) : (
            <>
              <p className="text-lg font-bold text-red-500">{displayName || "Leitor(a)"}</p>
              <p className="text-xs text-red-300">{user?.email}</p>
            </>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: stats.total },
            { label: "Lendo", value: stats.reading },
            { label: "Finalizados", value: stats.finished },
          ].map((s) => (
            <div key={s.label} className="bg-white/70 backdrop-blur-md rounded-2xl p-4 text-center shadow-md hover:scale-105 hover:rotate-[1deg] transition animate-fade-in">
              <p className="text-2xl font-extrabold text-red-500">{loading ? "—" : s.value}</p>
              <p className="text-xs text-red-300">{s.label}</p>
            </div>
          ))}
        </div>

        {/* PROGRESSO */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-md animate-fade-in">
          <p className="text-sm text-red-400 font-semibold mb-1">Progresso da meta anual: {stats.total}/{booksGoal}</p>
          <div className="w-full h-3 bg-red-100 rounded-full overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 space-y-4 shadow-md animate-fade-in">
          <p className="text-sm font-semibold text-red-500">Editar perfil</p>

          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Seu nome 🍓"
            className="rounded-xl bg-white/70 shadow-sm focus:ring-2 focus:ring-pink-300 transition hover:scale-[1.02]"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Fale sobre você..."
            rows={3}
            maxLength={500}
            className="w-full rounded-xl p-3 text-sm bg-white/70 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 transition shadow-sm hover:scale-[1.01]"
          />

          <Input
            value={favoriteGenre}
            onChange={(e) => setFavoriteGenre(e.target.value)}
            placeholder="Gênero favorito"
            className="rounded-xl bg-white/70 shadow-sm focus:ring-2 focus:ring-pink-300 transition hover:scale-[1.02]"
          />

          {/* META */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-red-300 font-medium">Meta:</span>
            <Input
              type="number"
              value={booksGoal}
              onChange={(e) => setBooksGoal(Number(e.target.value))}
              className="w-20 text-center rounded-xl bg-white/70 shadow-sm focus:ring-2 focus:ring-pink-300 transition hover:scale-[1.02]"
              min={1}
            />
            <span className="text-sm text-red-300 font-medium">livros/ano</span>
          </div>

          {/* BOTÃO */}
          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-400 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar 🍓"}
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import StrawberryIcon from "@/components/StrawberryIcon";

const Profile = () => {
  const { user, signOut } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [booksGoal, setBooksGoal] = useState(12);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setStats({
          total: books.length,
          reading: books.filter((b) => b.status === "reading").length,
          finished: books.filter((b) => b.status === "finished").length,
        });
      }

      setLoading(false);
    };

    loadData();
  }, [user]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff0f3] to-[#ffd6dd] pb-24">
      
      {/* HEADER */}
      <header className="px-4 pt-[env(safe-area-inset-top)] pb-3">
        <div className="flex items-center justify-between pt-4">
          <h1 className="text-xl font-extrabold">Meu Perfil</h1>

          <button
            onClick={signOut}
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur flex items-center justify-center shadow active:scale-95 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="px-4 space-y-5">

        {/* AVATAR */}
        <div className="bg-white/60 backdrop-blur rounded-3xl p-6 border shadow flex flex-col items-center transition hover:scale-[1.02]">
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center mb-3 shadow-lg">
            <StrawberryIcon filled size={44} />
          </div>

          {loading ? (
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
          ) : (
            <>
              <p className="text-lg font-bold">
                {displayName || "Leitor(a)"}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: stats.total },
            { label: "Lendo", value: stats.reading },
            { label: "Finalizados", value: stats.finished },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/70 backdrop-blur rounded-2xl p-4 text-center shadow hover:scale-105 transition"
            >
              <p className="text-2xl font-extrabold text-red-500">
                {loading ? "—" : s.value}
              </p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div className="bg-white/60 backdrop-blur rounded-2xl p-4 space-y-3 shadow">
          
          <p className="text-sm font-semibold">Editar perfil</p>

          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Seu nome 🍓"
            className="rounded-xl bg-white/70"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Fale sobre você..."
            rows={3}
            maxLength={500}
            className="w-full rounded-xl p-3 text-sm bg-white/70 resize-none focus:outline-none focus:ring-2 focus:ring-red-300 transition"
          />

          <Input
            value={favoriteGenre}
            onChange={(e) => setFavoriteGenre(e.target.value)}
            placeholder="Gênero favorito"
            className="rounded-xl bg-white/70"
          />

          {/* META */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Meta:</span>

            <Input
              type="number"
              value={booksGoal}
              onChange={(e) => setBooksGoal(Number(e.target.value))}
              className="w-20 text-center rounded-xl bg-white/70"
              min={1}
            />

            <span className="text-sm text-gray-500">livros/ano</span>
          </div>

          {/* BOTÃO */}
          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full h-11 rounded-full bg-gradient-to-r from-red-500 to-pink-400 text-white font-bold shadow-lg active:scale-95 transition disabled:opacity-50"
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

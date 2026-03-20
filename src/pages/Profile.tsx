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
  const [stats, setStats] = useState({ total: 0, reading: 0, finished: 0 });

  useEffect(() => {
    if (!user) return;
    // Fetch profile
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || "");
          setBio(data.bio || "");
          setFavoriteGenre(data.favorite_genre || "");
          setBooksGoal(data.books_goal || 12);
        }
      });

    // Fetch stats
    supabase
      .from("user_books")
      .select("status")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          setStats({
            total: data.length,
            reading: data.filter((b) => b.status === "reading").length,
            finished: data.filter((b) => b.status === "finished").length,
          });
        }
      });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio, favorite_genre: favoriteGenre, books_goal: booksGoal })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error("Erro ao salvar");
    else toast.success("Perfil atualizado! 🍓");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 pt-[env(safe-area-inset-top)] pb-3">
        <div className="flex items-center justify-between pt-4">
          <h1 className="text-xl font-extrabold text-foreground">Meu Perfil</h1>
          <button
            onClick={signOut}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          >
            <LogOut size={18} className="text-muted-foreground" />
          </button>
        </div>
      </header>

      <main className="px-4 space-y-4">
        {/* Avatar & Name */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-[0_2px_12px_hsl(345_70%_65%/0.08)] flex flex-col items-center animate-fade-up" style={{ opacity: 0 }}>
          <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-3">
            <StrawberryIcon filled size={40} />
          </div>
          <p className="text-lg font-bold text-foreground">{displayName || "Leitor(a)"}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ opacity: 0, animationDelay: "120ms" }}>
          {[
            { label: "Total", value: stats.total },
            { label: "Lendo", value: stats.reading },
            { label: "Finalizados", value: stats.finished },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl p-3 border border-border text-center">
              <p className="text-xl font-extrabold text-primary">{s.value}</p>
              <p className="text-[10px] font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Edit Profile */}
        <div className="bg-card rounded-2xl p-4 border border-border space-y-3 animate-fade-up" style={{ opacity: 0, animationDelay: "240ms" }}>
          <p className="text-sm font-semibold text-foreground">Editar perfil</p>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Seu nome"
            className="rounded-xl h-10 bg-secondary/50"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Sobre você..."
            rows={3}
            maxLength={500}
            className="w-full rounded-xl bg-secondary/50 border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary transition-colors"
          />
          <Input
            value={favoriteGenre}
            onChange={(e) => setFavoriteGenre(e.target.value)}
            placeholder="Gênero favorito"
            className="rounded-xl h-10 bg-secondary/50"
          />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Meta anual:</span>
            <Input
              type="number"
              value={booksGoal}
              onChange={(e) => setBooksGoal(Number(e.target.value))}
              className="w-20 rounded-xl h-10 text-center bg-secondary/50"
              min={1}
            />
            <span className="text-sm text-muted-foreground">livros</span>
          </div>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full h-11 rounded-full bg-primary text-primary-foreground font-bold text-sm active:scale-[0.97] transition-all disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar perfil 🍓"}
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;

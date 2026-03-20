import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import StrawberryIcon from "@/components/StrawberryIcon";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Bem-vinda de volta! 🍓");
        navigate("/library");
      } else {
        await signUp(email, password, displayName);
        toast.success("Conta criada! Verifique seu email 📧");
      }
    } catch (err: any) {
      toast.error(err.message || "Algo deu errado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-up" style={{ opacity: 0 }}>
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pop" style={{ animationDelay: `${i * 120}ms`, opacity: 0 }}>
                <StrawberryIcon filled size={40} />
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Berry Books</h1>
          <p className="text-muted-foreground text-sm mt-1">Sua estante de leitura 🍓</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-6 shadow-[0_4px_24px_hsl(345_70%_65%/0.12)] border border-border space-y-4">
          {!isLogin && (
            <Input
              type="text"
              placeholder="Seu nome"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required={!isLogin}
              className="rounded-2xl h-12 bg-secondary/50 border-border focus:border-primary"
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-2xl h-12 bg-secondary/50 border-border focus:border-primary"
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-2xl h-12 bg-secondary/50 border-border focus:border-primary"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 active:scale-[0.97] transition-all"
          >
            {isLoading ? "..." : isLogin ? "Entrar 🍓" : "Criar conta 🍓"}
          </Button>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLogin ? "Não tem conta? Crie uma!" : "Já tem conta? Entre!"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;

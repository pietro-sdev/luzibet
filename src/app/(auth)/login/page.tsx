// app/LoginPage.tsx

'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash } from "iconsax-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Envia a requisição para a API de login
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Verifica se a resposta foi bem-sucedida
      if (!res.ok) {
        const data = await res.json();
        toast({
          title: "Erro no login",
          description: data.message || "Erro ao fazer login",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o painel...",
        variant: "success",
      });

      // Redireciona para o painel após um pequeno atraso para mostrar o toast
      setTimeout(() => {
        router.push("/painel");
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-bgLuizbet border-2 border-[#202020] rounded-lg shadow-lg">
        <h1 className="text-xl font-semibold text-center">Acesse o painel de administrador LuizBet!</h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 text-sm text-gray-100">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full p-2 text-sm text-gray-200 bg-[#202124] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-100">Senha</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full p-2 text-sm text-gray-200 bg-[#202124] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {passwordVisible ? (
                  <Eye size="20" color="currentColor" />
                ) : (
                  <EyeSlash size="20" color="currentColor" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg text-center bg-green-500 font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

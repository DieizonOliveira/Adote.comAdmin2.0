"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function TrocarSenhaObrigatorio() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  const id = Cookies.get("admin_logado_id");
  const token = Cookies.get("admin_logado_token") || "";

  async function salvarNovaSenha() {
    if (senha.length < 8) {
      Swal.fire("Erro", "A senha deve ter no mínimo 8 caracteres.", "error");
      return;
    }

    if (senha !== confirmar) {
      Swal.fire("Erro", "As senhas não conferem.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/admins/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ senha }),
        }
      );

      if (!response.ok) {
        const erro = await response.text();
        Swal.fire("Erro", erro || "Erro ao atualizar a senha.", "error");
        setLoading(false);
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Senha alterada!",
        text: "Faça login novamente com a nova senha.",
      });

      // força logout
      Cookies.remove("admin_logado_id");
      Cookies.remove("admin_logado_nome");
      Cookies.remove("admin_logado_token");

      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">

        <h2 className="text-xl font-bold mb-4 text-center">
          ⚠️ Troca de senha obrigatória
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Você está usando a senha padrão. Para continuar, defina uma nova senha.
        </p>

        <div className="mb-4">
          <label className="block text-sm mb-1">Nova senha</label>
          <input
            type="password"
            className="border rounded w-full p-2"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Confirmar nova senha</label>
          <input
            type="password"
            className="border rounded w-full p-2"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />
        </div>

        {/* 🔥 Não existe botão de fechar — OBRIGATÓRIO */}
        <button
          onClick={salvarNovaSenha}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </div>
    </div>
  );
}

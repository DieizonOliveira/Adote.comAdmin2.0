"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AdminI } from "@/utils/types/admins";

const MySwal = withReactContent(Swal);

interface Props {
  admin: AdminI;
  fechar: () => void;
  onAtualizar?: (adminAtualizado: AdminI) => void;
}

export default function ModalEditarAdmin({ admin, fechar, onAtualizar }: Props) {
  const [nome, setNome] = useState(admin.nome);
  const [email, setEmail] = useState(admin.email);
  const [role, setRole] = useState(admin.role);
  const [ativo, setAtivo] = useState(admin.ativo);

  const [loading, setLoading] = useState(false);

  const token = Cookies.get("admin_logado_token") || "";

  const toast = (
    icon: "success" | "error" | "warning",
    title: string
  ) => {
    MySwal.fire({
      icon,
      title,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2300,
      timerProgressBar: true,
    });
  };

  async function salvar() {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/admins/${admin.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            nome,
            email,
            role,
            ativo,
          }),
        }
      );

      if (!response.ok) {
        const erro = await response.text();
        toast("error", "Erro ao atualizar admin: " + erro);
        setLoading(false);
        return;
      }

      const adminAtualizado = await response.json();

      toast("success", "Administrador atualizado!");

      if (onAtualizar) onAtualizar(adminAtualizado);

      fechar();
    } catch (error) {
      toast("error", "Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[450px]">

        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
          Editar Administrador
        </h2>

        {/* Nome */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Função (Role)
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="master">Master</option>
            <option value="adm">Administrador</option>
            <option value="veterinario">Veterinário</option>
          </select>
        </div>

        {/* Ativo / Inativo */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
          />
          <span className="text-gray-700">
            {ativo ? "Ativo" : "Inativo"}
          </span>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={fechar}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Fechar
          </button>

          <button
            onClick={salvar}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

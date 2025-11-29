"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Cookies from "js-cookie";

const MySwal = withReactContent(Swal);

export default function NovoAdmin() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("adm"); // padrão

  async function salvarAdmin(e: React.FormEvent) {
    e.preventDefault();

    const token = Cookies.get("admin_logado_token") || "";

    const adminData = {
      nome,
      email,
      role,
      senha: "@12345",   // ✔ senha padrão
      ativo: true         // ✔ sempre ativo ao criar
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(adminData),
      });

      if (response.ok) {
        await MySwal.fire({
          icon: "success",
          title: "Administrador cadastrado!",
          text: "A senha padrão é @12345",
          confirmButtonText: "OK",
        });

        router.push("/principal/admins");
      } else {
        await MySwal.fire({
          icon: "error",
          title: "Erro ao cadastrar",
          text: "Verifique os dados e tente novamente.",
        });
      }
    } catch (error) {
      console.error(error);
      await MySwal.fire({
        icon: "error",
        title: "Erro de conexão",
        text: "Não foi possível conectar ao servidor.",
      });
    }
  }

  return (
    <div className="m-4 mt-24 max-w-xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        ➕ Novo Administrador
      </h1>

      <form
        onSubmit={salvarAdmin}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4"
      >
        {/* Nome */}
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Nome
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Função (Role)
          </label>
          <select
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="master">Master</option>
            <option value="adm">Administrador</option>
            <option value="veterinario">Veterinário</option>
          </select>
        </div>

        {/* Botões */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Voltar
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Salvar Admin
          </button>
        </div>
      </form>
    </div>
  );
}

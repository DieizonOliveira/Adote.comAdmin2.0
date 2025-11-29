"use client";

import { useEffect, useState } from "react";
import ItemAdmin from "@/components/itemAdmin";
import { AdminI } from "@/utils/types/admins";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

function CadAdmins() {
  const [admins, setAdmins] = useState<AdminI[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function getAdmins() {
      const token = Cookies.get("admin_logado_token") || "";

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/admins`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          }
        });

        if (response.status === 401) {
          await Swal.fire({
            icon: "error",
            title: "Acesso não autorizado",
            text: "Você precisa fazer login novamente."
          });
          return;
        }

        const dados = await response.json();
        setAdmins(Array.isArray(dados) ? dados : dados.admins ?? []);

      } catch (error) {
        console.log("Erro ao carregar admins", error);
      }
    }

    getAdmins();
  }, []);

  const listaAdmins = admins.map(admin => (
    <ItemAdmin
      key={String(admin.id)}
      admin={admin}
      admins={admins}
      setAdmins={setAdmins}
    />
  ));

  return (
    <div className='m-4 mt-24'>
      <div className='flex justify-between items-center'>
        <h1 className="mb-4 text-2xl font-bold dark:text-white">
          Cadastro de Admins
        </h1>

        {/* BOTÃO ADD ADMIN */}
        <button
          onClick={() => router.push("/principal/admins/novo")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          ➕ Adicionar Admin
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>

          <tbody>
            {listaAdmins}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CadAdmins;

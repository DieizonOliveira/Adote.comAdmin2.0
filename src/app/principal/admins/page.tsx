"use client";

import { useEffect, useState } from "react";
import ItemAdmin from "@/components/itemAdmin";
import { AdminI } from "@/utils/types/admins";

function CadAdmins() {
  const [admins, setAdmins] = useState<AdminI[]>([]);

  useEffect(() => {
    async function getAdmins() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/admins`);
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
    <div className="m-4 mt-24">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          Cadastro de Admins
        </h1>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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

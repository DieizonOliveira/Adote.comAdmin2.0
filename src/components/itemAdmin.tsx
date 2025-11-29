"use client";

import { AdminI } from "@/utils/types/admins";

interface Props {
  admin: AdminI;
  admins: AdminI[];
  setAdmins: (admins: AdminI[]) => void;
}

export default function ItemAdmin({ admin, admins, setAdmins }: Props) {

  async function excluirAdmin() {
    if (!confirm("Tem certeza que deseja remover este Admin?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL_API}/admins/${admin.id}`, {
        method: "DELETE",
      });

      const novaLista = admins.filter(a => a.id !== admin.id);
      setAdmins(novaLista);

    } catch (error) {
      console.log("Erro ao remover admin", error);
    }
  }

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-4">{admin.nome}</td>
      <td className="px-6 py-4">{admin.email}</td>

      <td className="px-6 py-4">
        {admin.status ? (
          <span className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded">
            Ativo
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded">
            Inativo
          </span>
        )}
      </td>

      <td className="px-6 py-4 flex gap-2">
        <button
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
          onClick={excluirAdmin}
        >
          Excluir
        </button>
      </td>
    </tr>
  );
}

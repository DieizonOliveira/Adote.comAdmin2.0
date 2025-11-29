"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { TiDeleteOutline, TiEdit } from "react-icons/ti";
import { AdminI } from "@/utils/types/admins";
import ModalEditarAdmin from "./modalEditarAdmin";

const MySwal = withReactContent(Swal);

interface Props {
  admin: AdminI;
  admins: AdminI[];
  setAdmins: React.Dispatch<React.SetStateAction<AdminI[]>>;
}

export default function ItemAdmin({ admin, admins, setAdmins }: Props) {
  const [loading, setLoading] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);

  async function excluirAdmin() {
    const confirmResult = await MySwal.fire({
      title: "Confirmação",
      text: `Deseja realmente excluir o administrador ${admin.nome}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!confirmResult.isConfirmed) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/admins/${admin.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + (Cookies.get("admin_logado_token") || ""),
          },
        }
      );

      if (response.ok) {
        const novaLista = admins.filter((a) => a.id !== admin.id);
        setAdmins(novaLista);

        await MySwal.fire({
          icon: "success",
          title: "Administrador excluído!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        await MySwal.fire({
          icon: "error",
          title: "Erro ao excluir",
          text: "O administrador não pôde ser excluído.",
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

    setLoading(false);
  }

  // Atualiza apenas um admin na lista (depois do modal salvar)
  function atualizarAdmin(adminAtualizado: AdminI) {
    const novaLista = admins.map((a) =>
      a.id === adminAtualizado.id ? adminAtualizado : a
    );
    setAdmins(novaLista);
  }

  return (
    <>
      <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {admin.nome}
        </td>

        <td className="px-6 py-4">{admin.email}</td>

        <td className="px-6 py-4">
          {admin.ativo ? (
            <span className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded">
              Ativo
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded">
              Inativo
            </span>
          )}
        </td>

        <td className="px-6 py-4 flex gap-3">
          {/* EDITAR */}
          <TiEdit
            className="text-3xl text-blue-600 cursor-pointer"
            title="Editar"
            onClick={() => setAbrirModal(true)}
          />

          {/* EXCLUIR */}
          <TiDeleteOutline
            className={`text-3xl text-red-600 cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Excluir"
            onClick={() => !loading && excluirAdmin()}
          />
        </td>
      </tr>

      {/* Modal de Edição */}
      {abrirModal && (
        <ModalEditarAdmin
          admin={admin}
          fechar={() => setAbrirModal(false)}
          onAtualizar={atualizarAdmin}
        />
      )}
    </>
  );
}

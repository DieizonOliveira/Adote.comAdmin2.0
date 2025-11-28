'use client'

import { useState } from "react";
import { VacinaI } from "@/utils/types/vacinas";
import { TiDeleteOutline, TiEdit } from "react-icons/ti";
import ModalVacina from "./modalVacina";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";

interface ItemVacinaProps {
  vacina: VacinaI;
  vacinas: VacinaI[];
  setVacinas: React.Dispatch<React.SetStateAction<VacinaI[]>>;
}

export default function ItemVacina({ vacina, vacinas, setVacinas }: ItemVacinaProps) {
  const [abrirEditar, setAbrirEditar] = useState(false);  // <-- ESSENCIAL

  async function excluirVacina(vacinaId: number) {
    const result = await Swal.fire({
      title: 'Confirma exclusão?',
      text: `Deseja excluir a vacina "${vacina.nome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/vacinas-aplicadas/${vacinaId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + (document.cookie.match(/admin_logado_token=([^;]+)/)?.[1] || "")
        },
      });

      if (response.ok) {
        Swal.fire('Excluída!', 'Vacina excluída com sucesso.', 'success');
        setVacinas(vacinas.filter(v => v.id !== vacinaId));
      } else {
        Swal.fire('Erro', 'Erro ao excluir vacina', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Erro de conexão ao excluir vacina', 'error');
    }
  }

  return (
    <>
      <tr className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700">
        <td className="px-6 py-4">{vacina.nome}</td>
        <td className="px-6 py-4">{new Date(vacina.dataAplicacao).toLocaleDateString()}</td>
        <td className="px-6 py-4">{vacina.aplicadoPor || "-"}</td>
        <td className="px-6 py-4">{vacina.observacoes || "-"}</td>
        <td className="px-6 py-4 flex gap-2">
          <TiEdit
            className="text-2xl text-blue-600 cursor-pointer"
            title="Editar vacina"
            onClick={() => setAbrirEditar(true)}
          />
          <TiDeleteOutline
            className="text-2xl text-red-600 cursor-pointer"
            title="Excluir vacina"
            onClick={() => excluirVacina(vacina.id)}
          />
        </td>
      </tr>

      {abrirEditar && createPortal(
        <ModalVacina
          animalId={vacina.animalId}   // <-- AGORA FUNCIONA normal
          vacina={vacina}
          fechar={() => setAbrirEditar(false)}
          onAtualizar={(novaVacina) => {
            setVacinas(vacinas.map(v => v.id === novaVacina.id ? novaVacina : v))
          }}
        />,
        document.body
      )}
    </>
  );
}

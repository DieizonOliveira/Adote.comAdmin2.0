'use client'

import { Dispatch, SetStateAction } from "react"
import Cookies from "js-cookie"
import { AcompanhamentoI } from "@/utils/types/acompanhamento"
import { TiDeleteOutline, TiEdit } from "react-icons/ti"

interface ItemAcompanhamentoProps {
  acompanhamento: AcompanhamentoI
  acompanhamentos: AcompanhamentoI[]
  setAcompanhamentos: Dispatch<SetStateAction<AcompanhamentoI[]>>
  abrirModalVisita?: (acompanhamento: AcompanhamentoI) => void
  abrirModalVacina?: (acompanhamento: AcompanhamentoI) => void
}

export default function ItemAcompanhamento({
  acompanhamento,
  acompanhamentos,
  setAcompanhamentos,
  abrirModalVisita,
  abrirModalVacina,
}: ItemAcompanhamentoProps) {

  if (!acompanhamento) return null

  async function excluirAcompanhamento() {
    if (!confirm("Deseja remover acompanhamento?")) return

    const token = Cookies.get("admin_logado_token")
    if (!token) {
      alert("Token não encontrado. Faça login novamente.")
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/acompanhamento/${acompanhamento.id}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      )

      if (res.ok) {
        setAcompanhamentos(acompanhamentos.filter(a => a.id !== acompanhamento.id))
        alert("Acompanhamento removido com sucesso")
      } else {
        alert("Erro ao remover acompanhamento")
      }
    } catch (err) {
      console.error(err)
      alert("Erro ao remover acompanhamento")
    }
  }

  return (
    <tr className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700 hover:bg-gray-50">
      <td className="px-6 py-4">
        {acompanhamento.dataVisita
          ? new Date(acompanhamento.dataVisita).toLocaleDateString()
          : "-"}
      </td>

      <td className="px-6 py-4">{acompanhamento.observacoes || "-"}</td>

      <td className="px-6 py-4">
        {acompanhamento.proximaVisita
          ? new Date(acompanhamento.proximaVisita).toLocaleDateString()
          : "-"}
      </td>

      <td className="px-6 py-4">
        {acompanhamento.vacinasAplicadas
          ? acompanhamento.vacinasAplicadas.length
          : 0}
      </td>

      <td className="px-6 py-4 flex gap-2">

        {/* EDITAR */}
        <TiEdit
          className="text-2xl text-blue-600 cursor-pointer"
          title="Editar acompanhamento"
          onClick={() => abrirModalVisita?.(acompanhamento)}
        />

        {/* VACINAR */}
        <button
          onClick={() => abrirModalVacina?.(acompanhamento)}
          title="Aplicar vacina nesta visita"
          className="text-sm px-2 py-1 rounded bg-purple-100 hover:bg-purple-200"
        >
          💉 Vacinar
        </button>

        {/* EXCLUIR */}
        <TiDeleteOutline
          className="text-2xl text-red-600 cursor-pointer"
          title="Excluir acompanhamento"
          onClick={excluirAcompanhamento}
        />

      </td>
    </tr>
  )
}


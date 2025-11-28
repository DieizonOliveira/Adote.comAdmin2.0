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
  statusAdocao: "Ativa" | "Concluida" | "Cancelada"   // <-- ADICIONADO
}

export default function ItemAcompanhamento({
  acompanhamento,
  acompanhamentos,
  setAcompanhamentos,
  abrirModalVisita,
  abrirModalVacina,
  statusAdocao,
}: ItemAcompanhamentoProps) {

  if (!acompanhamento) return null

  const bloqueado = statusAdocao !== "Ativa"    // <-- SE NÃO ESTÁ ATIVA, BLOQUEIA

  async function excluirAcompanhamento() {
    if (bloqueado) {
      alert("Adoção finalizada. Alterações não são permitidas.")
      return
    }

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
          className={
            "text-2xl " +
            (bloqueado
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 cursor-pointer")
          }
          title="Editar acompanhamento"
          onClick={() => !bloqueado && abrirModalVisita?.(acompanhamento)}
        />

        {/* VACINAR */}
        <button
          onClick={() => !bloqueado && abrirModalVacina?.(acompanhamento)}
          title="Aplicar vacina nesta visita"
          disabled={bloqueado}
          className={
            "text-sm px-2 py-1 rounded " +
            (bloqueado
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-purple-100 hover:bg-purple-200")
          }
        >
          💉 Vacinar
        </button>

        {/* EXCLUIR */}
        <TiDeleteOutline
          className={
            "text-2xl " +
            (bloqueado
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-600 cursor-pointer")
          }
          title="Excluir acompanhamento"
          onClick={excluirAcompanhamento}
        />

      </td>
    </tr>
  )
}


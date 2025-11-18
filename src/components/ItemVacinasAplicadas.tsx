'use client'

import { Dispatch, SetStateAction } from "react"
import Cookies from "js-cookie"
import { VacinasAplicadasI } from "@/utils/types/vacinasAplicadas"
import { TiDeleteOutline } from "react-icons/ti"

interface ItemVacinasAplicadasProps {
  aplicacao: VacinasAplicadasI
  aplicacoes: VacinasAplicadasI[]
  setAplicacoes: Dispatch<SetStateAction<VacinasAplicadasI[]>>
}

export default function ItemVacinasAplicadas({ aplicacao, aplicacoes, setAplicacoes }: ItemVacinasAplicadasProps) {

  async function excluirAplicacao() {
    if (!confirm(`Deseja remover aplicação de vacina #${aplicacao.id}`)) return

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/vacinas-aplicadas/${aplicacao.id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + (Cookies.get("admin_logado_token") || "") }
    })

    if (response.ok) {
      setAplicacoes(aplicacoes.filter(a => a.id !== aplicacao.id))
      alert("Aplicação removida com sucesso")
    } else {
      alert("Erro ao excluir aplicação")
    }
  }

  return (
    <tr className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700 hover:bg-gray-100">
      <td className="px-6 py-4">{aplicacao.id}</td>
      <td className="px-6 py-4">{aplicacao.vacina.nome}</td>
      <td className="px-6 py-4">{aplicacao.animal.nome}</td>
      <td className="px-6 py-4">{new Date(aplicacao.dataAplicacao).toLocaleDateString()}</td>
      <td className="px-6 py-4">{aplicacao.observacoes || "-"}</td>
      <td className="px-6 py-4">
        <TiDeleteOutline
          className="text-2xl text-red-600 cursor-pointer"
          title="Excluir aplicação"
          onClick={excluirAplicacao}
        />
      </td>
    </tr>
  )
}

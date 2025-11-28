'use client'
import { useState } from "react"
import Cookies from "js-cookie"
import { AcompanhamentoI } from "@/utils/types/acompanhamento"

interface Props {
  adocaoId: number
  fechar: () => void
  acompanhamento?: AcompanhamentoI
  statusAdocao: "Ativa" | "Concluida" | "Cancelada"   // ✅ ADICIONADO
}

export default function ModalRegistrarVisita({ adocaoId, fechar, acompanhamento, statusAdocao }: Props) {
  const [observacoes, setObservacoes] = useState(acompanhamento?.observacoes || "")
  const [proximaVisita, setProximaVisita] = useState(
    acompanhamento?.proximaVisita
      ? new Date(acompanhamento.proximaVisita).toISOString().slice(0, 10)
      : ""
  )
  const [loading, setLoading] = useState(false)

  const isEdit = !!acompanhamento

  // 🔒 Só permite editar se adoção estiver ativa
  const bloqueado = statusAdocao !== "Ativa"   // ⬅ REGRA

  const handleSalvar = async () => {
    if (bloqueado) return alert("Adoção finalizada. Não é possível alterar visitas.")  // ⬅ BLOQUEIO

    if (!observacoes && !proximaVisita) {
      alert("Preencha pelo menos observações ou próxima visita.")
      return
    }

    setLoading(true)
    try {
      const token = Cookies.get("admin_logado_token")
      const usuarioId = Number(Cookies.get("admin_logado_id"))

      if (!usuarioId) {
        alert("Usuário não autenticado")
        return
      }

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_URL_API}/acompanhamento/${acompanhamento?.id}`
        : `${process.env.NEXT_PUBLIC_URL_API}/acompanhamento`

      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          adocaoId,
          observacoes,
          proximaVisita: proximaVisita ? new Date(proximaVisita) : null,
          usuarioId
        })
      })

      if (res.ok) {
        alert(isEdit ? "Acompanhamento atualizado!" : "Acompanhamento registrado!")
        fechar()
      } else {
        const errorData = await res.json()
        alert("Erro: " + (errorData.erro || "Desconhecido"))
      }
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar acompanhamento.")
    } finally {
      setLoading(false)
    }
  }

  const handleExcluir = async () => {
    if (bloqueado) return alert("Adoção finalizada. Não é possível excluir visitas.")  // ⬅ BLOQUEIO

    if (!confirm("Deseja realmente excluir este acompanhamento?")) return

    setLoading(true)
    try {
      const token = Cookies.get("admin_logado_token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/acompanhamento/${acompanhamento?.id}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token }
        }
      )

      if (res.ok) {
        alert("Acompanhamento deletado!")
        fechar()
      } else {
        alert("Erro ao deletar acompanhamento.")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[400px] relative">
        <button
          onClick={fechar}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold mb-4 text-center">
          {isEdit ? "Editar Acompanhamento" : "Registrar Visita"}
        </h3>

        <div className="flex flex-col gap-3 text-sm">
          <label>
            Observações:
            <textarea
              disabled={bloqueado}   // 🔒 BLOQUEIA INPUT
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              className="w-full border rounded p-2 mt-1 text-sm disabled:bg-gray-200"
              rows={3}
            />
          </label>

          <label>
            Próxima Visita:
            <input
              disabled={bloqueado}   // 🔒 BLOQUEIA DATA
              type="date"
              value={proximaVisita}
              onChange={e => setProximaVisita(e.target.value)}
              className="w-full border rounded p-2 mt-1 text-sm disabled:bg-gray-200"
            />
          </label>

          <div className="flex justify-between mt-2">
            {isEdit && (
              <button
                onClick={handleExcluir}
                disabled={loading || bloqueado}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm disabled:bg-gray-300"
              >
                {loading ? "Excluindo..." : "Excluir"}
              </button>
            )}

            <button
              onClick={handleSalvar}
              disabled={loading || bloqueado}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm ml-auto disabled:bg-gray-300"
            >
              {loading ? "Salvando..." : isEdit ? "Atualizar" : "Registrar"}
            </button>
          </div>

          {bloqueado && (
            <p className="text-red-600 text-xs mt-2">
              Esta adoção está <b>{statusAdocao}</b>. Alterações não são permitidas.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from "react"
import { VacinasAplicadasI } from "@/utils/types/vacinasAplicadas"
import ItemVacinasAplicadas from "@/components/ItemVacinasAplicadas"
import Cookies from "js-cookie"

export default function ControleVacinasAplicadas() {
  const [aplicacoes, setAplicacoes] = useState<VacinasAplicadasI[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getAplicacoes() {
      try {
        const token = Cookies.get("admin_logado_token")
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/vacinas-aplicadas`, {
          headers: { Authorization: "Bearer " + token }
        })

        if (!response.ok) throw new Error("Erro ao buscar aplicações")

        const dados = await response.json()
        setAplicacoes(Array.isArray(dados) ? dados : [])
      } catch (err) {
        console.error("Erro ao buscar aplicações:", err)
        setAplicacoes([])
      } finally {
        setLoading(false)
      }
    }

    getAplicacoes()
  }, [])

  if (loading) {
    return (
      <div className="m-4 mt-24 text-center text-gray-500">
        Carregando aplicações de vacinas...
      </div>
    )
  }

  return (
    <div className="m-4 mt-24">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Vacinas Aplicadas</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Vacina</th>
              <th className="px-6 py-3">Animal</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Observações</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {aplicacoes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Nenhuma aplicação registrada.
                </td>
              </tr>
            ) : (
              aplicacoes.map(a => (
                <ItemVacinasAplicadas
                  key={a.id}
                  aplicacao={a}
                  aplicacoes={aplicacoes}
                  setAplicacoes={setAplicacoes}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from "react"
import { AdocaoI } from "@/utils/types/adocoes"
import ModalAcompanhamentos from "@/components/modalAcompanhamento"
import Cookies from "js-cookie"

export default function ControleAdocoes() {
  const [adocoes, setAdocoes] = useState<AdocaoI[]>([])
  const [loading, setLoading] = useState(true)
  const [adocaoSelecionada, setAdocaoSelecionada] = useState<AdocaoI | null>(null)

  useEffect(() => {
    async function getAdocoes() {
      try {
        const token = Cookies.get("admin_logado_token")
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/adocoes`, {
          headers: { Authorization: "Bearer " + token }
        })

        if (!response.ok) throw new Error("Erro ao buscar adoções")

        const dados = await response.json()
        setAdocoes(Array.isArray(dados) ? dados : [])
      } catch (err) {
        console.error("Erro ao buscar adoções:", err)
        setAdocoes([])
      } finally {
        setLoading(false)
      }
    }

    getAdocoes()
  }, [])

  if (loading) {
    return (
      <div className="m-4 mt-24 text-center text-gray-500">
        Carregando adoções...
      </div>
    )
  }

  return (
    <div className="m-4 mt-24">
      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
        Controle de Adoções
      </h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Foto</th>
              <th className="px-6 py-3">Animal</th>
              <th className="px-6 py-3">Adotante</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>

          <tbody>
            {(adocoes || []).length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Nenhuma adoção registrada.
                </td>
              </tr>
            ) : (
              (adocoes || []).map(adocao => (
                <tr
                  key={adocao.id}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 
                             border-b dark:border-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  <td className="px-6 py-2">
                    <img
                      src={adocao.animal.fotos?.[0]?.codigoFoto || "/sem-foto.jpg"}
                      alt={adocao.animal.nome}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-2 font-medium text-gray-900 dark:text-white">{adocao.animal.nome}</td>
                  <td className="px-6 py-2">{adocao.adotante.nome}</td>
                  <td className="px-6 py-2">{new Date(adocao.dataAdocao).toLocaleDateString()}</td>
                  <td className="px-6 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        adocao.status === "Ativa"
                          ? "bg-green-100 text-green-800"
                          : adocao.status === "Concluida"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {adocao.status}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-center">
                    <button
                      onClick={() => setAdocaoSelecionada(adocao)}
                      className="text-blue-500 hover:text-blue-700 text-lg"
                      title="Visualizar Acompanhamentos"
                    >
                      📋
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {adocaoSelecionada && (
        <ModalAcompanhamentos
  adocaoId={adocaoSelecionada.id}
  statusAdocao={adocaoSelecionada.status as "Ativa" | "Concluida" | "Cancelada"} 
  fechar={() => setAdocaoSelecionada(null)}
/>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from "react"
import { VacinaI } from "@/utils/types/vacinas"
import ItemVacina from "@/components/ItemVacina"
import Cookies from "js-cookie"

export default function ControleVacinas() {
  const [vacinas, setVacinas] = useState<VacinaI[]>([])

  useEffect(() => {
    async function getVacinas() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/vacinas`, {
        headers: {
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
        }
      })
      const dados = await response.json()
      setVacinas(dados)
    }
    getVacinas()
  }, [])

  return (
    <div className="m-4 mt-24">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Cadastro de Vacinas</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vacinas.map(vacina => (
              <ItemVacina
                key={vacina.id}
                vacina={vacina}
                vacinas={vacinas}
                setVacinas={setVacinas}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
